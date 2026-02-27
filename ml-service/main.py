from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import numpy as np
import pandas as pd
import joblib
import redis
import json
from datetime import datetime
import asyncio
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
import xgboost as xgb
import lightgbm as lgb

app = FastAPI(title="AdViser ML Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection for caching
redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)

# Load pre-trained models (in production, load from S3 or local storage)
try:
    success_predictor = joblib.load('models/success_predictor.pkl')
    budget_optimizer = joblib.load('models/budget_optimizer.pkl')
    audience_encoder = joblib.load('models/audience_encoder.pkl')
    scaler = joblib.load('models/scaler.pkl')
except:
    print("Models not found. Using dummy models for demo.")
    success_predictor = None
    budget_optimizer = None

# Pydantic models
class BusinessProfile(BaseModel):
    industry: str
    sub_industry: Optional[str]
    company_size: str
    target_age_min: int
    target_age_max: int
    target_gender: List[str]
    target_locations: List[str]
    target_interests: List[str]
    business_model: str
    avg_order_value: float
    customer_lifetime_value: float
    monthly_budget: float
    marketing_goal: str
    competitors: Optional[List[str]]

class RecommendationRequest(BaseModel):
    user_id: str
    business_profile: BusinessProfile
    include_dark_horse: bool = True
    num_recommendations: int = 10

class PlatformScore(BaseModel):
    platform: str
    success_probability: float
    estimated_reach: int
    estimated_cac: float
    estimated_roas: float
    competition_level: str
    audience_match: float
    reasons: List[str]

class RecommendationResponse(BaseModel):
    recommendations: List[PlatformScore]
    dark_horse: Optional[PlatformScore]
    budget_allocation: Dict[str, float]
    created_at: datetime

# ML Models
class RecommendationEngine:
    def __init__(self):
        self.platforms = [
            'google_ads', 'facebook', 'instagram', 'linkedin', 'tiktok',
            'twitter', 'pinterest', 'snapchat', 'reddit', 'youtube',
            'amazon_ads', 'microsoft_ads', 'spotify', 'twitch',
            'industry_blogs', 'newsletters', 'podcasts', 'ctv_ott'
        ]
        
        self.platform_features = self._load_platform_features()
        self.recent_trends = self._load_recent_trends()
        
    def _load_platform_features(self):
        """Load platform demographic and performance data"""
        return {
            'linkedin': {
                'primary_demographics': [25, 55],
                'primary_gender': ['male', 'female'],
                'primary_interests': ['b2b', 'professional', 'career'],
                'avg_cpc': 5.26,
                'b2b_score': 0.95,
                'b2c_score': 0.3
            },
            'tiktok': {
                'primary_demographics': [16, 30],
                'primary_gender': ['male', 'female'],
                'primary_interests': ['entertainment', 'music', 'dance', 'trends'],
                'avg_cpc': 1.95,
                'b2b_score': 0.1,
                'b2c_score': 0.9
            },
            # Add more platforms...
        }
    
    def _load_recent_trends(self):
        """Load trending data from external APIs"""
        # In production, this would fetch from Google Trends, etc.
        return {
            'platform_growth': {
                'tiktok': 0.25,
                'linkedin': 0.15,
                'pinterest': 0.1
            }
        }
    
    def calculate_audience_match(self, profile: BusinessProfile, platform: str):
        """Calculate how well the target audience matches platform demographics"""
        platform_data = self.platform_features.get(platform, {})
        if not platform_data:
            return 0.5
        
        score = 0
        weights = {'age': 0.3, 'gender': 0.2, 'interests': 0.3, 'business_model': 0.2}
        
        # Age match
        target_age = (profile.target_age_min + profile.target_age_max) / 2
        platform_age_range = platform_data.get('primary_demographics', [18, 65])
        if platform_age_range[0] <= target_age <= platform_age_range[1]:
            score += weights['age']
        
        # Gender match
        platform_genders = set(platform_data.get('primary_gender', []))
        target_genders = set(profile.target_gender)
        if target_genders.intersection(platform_genders):
            score += weights['gender'] * len(target_genders.intersection(platform_genders)) / len(platform_genders)
        
        # Interests match
        platform_interests = set(platform_data.get('primary_interests', []))
        target_interests = set(profile.target_interests)
        if platform_interests and target_interests:
            match_ratio = len(platform_interests.intersection(target_interests)) / len(platform_interests)
            score += weights['interests'] * match_ratio
        
        # Business model match
        if profile.business_model == 'B2B':
            score += weights['business_model'] * platform_data.get('b2b_score', 0)
        else:
            score += weights['business_model'] * platform_data.get('b2c_score', 0)
        
        return min(score, 1.0)
    
    def predict_success_probability(self, profile: BusinessProfile, platform: str):
        """Predict probability of success using ensemble model"""
        # In production, this would use the actual ML model
        # For demo, we'll use a weighted scoring system
        
        if success_predictor:
            # Use actual ML model
            features = self._extract_features(profile, platform)
            proba = success_predictor.predict_proba([features])[0][1]
            return proba
        
        # Fallback to heuristic
        audience_match = self.calculate_audience_match(profile, platform)
        trend_boost = self.recent_trends.get('platform_growth', {}).get(platform, 0)
        
        base_probability = 0.3 + (audience_match * 0.5) + trend_boost
        return min(base_probability, 0.95)
    
    def estimate_cac(self, profile: BusinessProfile, platform: str):
        """Estimate Customer Acquisition Cost"""
        platform_data = self.platform_features.get(platform, {})
        base_cpc = platform_data.get('avg_cpc', 2.0)
        
        # Adjust based on competition and targeting
        conversion_rate = 0.02 + (self.calculate_audience_match(profile, platform) * 0.03)
        estimated_cac = base_cpc / conversion_rate
        
        return estimated_cac
    
    def get_recommendations(self, request: RecommendationRequest):
        """Main recommendation engine"""
        recommendations = []
        profile = request.business_profile
        
        for platform in self.platforms:
            success_prob = self.predict_success_probability(profile, platform)
            audience_match = self.calculate_audience_match(profile, platform)
            estimated_cac = self.estimate_cac(profile, platform)
            
            # Calculate estimated reach
            estimated_reach = int(audience_match * 1000000 * np.random.uniform(0.5, 2.0))
            
            # Calculate estimated ROAS
            estimated_roas = (profile.customer_lifetime_value / estimated_cac) * success_prob
            
            # Determine competition level
            if success_prob > 0.7:
                competition = "High"
            elif success_prob > 0.4:
                competition = "Medium"
            else:
                competition = "Low"
            
            # Generate reasons
            reasons = []
            if audience_match > 0.7:
                reasons.append(f"Excellent audience match ({int(audience_match*100)}%)")
            if estimated_roas > 3:
                reasons.append("High potential ROAS")
            if platform in self.recent_trends.get('platform_growth', {}):
                reasons.append("Growing platform engagement")
            
            recommendations.append(PlatformScore(
                platform=platform,
                success_probability=success_prob,
                estimated_reach=estimated_reach,
                estimated_cac=estimated_cac,
                estimated_roas=estimated_roas,
                competition_level=competition,
                audience_match=audience_match,
                reasons=reasons[:3]  # Top 3 reasons
            ))
        
        # Sort by success probability
        recommendations.sort(key=lambda x: x.success_probability, reverse=True)
        
        # Get dark horse (non-obvious recommendation)
        dark_horse = None
        if request.include_dark_horse and len(recommendations) > 5:
            dark_horse = recommendations[5]  # Pick the 6th best as dark horse
        
        # Optimize budget allocation
        budget_allocation = self.optimize_budget(
            recommendations[:5], 
            profile.monthly_budget
        )
        
        return RecommendationResponse(
            recommendations=recommendations[:request.num_recommendations],
            dark_horse=dark_horse,
            budget_allocation=budget_allocation,
            created_at=datetime.now()
        )
    
    def optimize_budget(self, top_recommendations: List[PlatformScore], total_budget: float):
        """Optimize budget allocation across platforms"""
        if budget_optimizer:
            # Use ML model for budget optimization
            pass
        
        # Simple proportional allocation based on success probability
        total_prob = sum(r.success_probability for r in top_recommendations)
        allocation = {}
        
        for rec in top_recommendations:
            weight = rec.success_probability / total_prob
            allocation[rec.platform] = round(total_budget * weight, 2)
        
        return allocation
    
    def _extract_features(self, profile: BusinessProfile, platform: str):
        """Extract features for ML model"""
        # Convert profile to feature vector
        features = []
        
        # Encode categorical variables
        features.append(hash(profile.industry) % 100)
        features.append(profile.target_age_max - profile.target_age_min)
        features.append(len(profile.target_locations))
        features.append(len(profile.target_interests))
        features.append(profile.monthly_budget)
        features.append(profile.avg_order_value)
        features.append(profile.customer_lifetime_value)
        
        # Platform-specific features
        features.append(hash(platform) % 50)
        
        return np.array(features).reshape(1, -1)

# Initialize engine
engine = RecommendationEngine()

@app.get("/")
async def root():
    return {"message": "AdViser ML Service", "status": "operational"}

@app.post("/api/recommendations", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest, background_tasks: BackgroundTasks):
    """Get platform recommendations for a business"""
    try:
        # Check cache
        cache_key = f"rec_{request.user_id}_{hash(str(request.business_profile))}"
        cached = redis_client.get(cache_key)
        
        if cached:
            return json.loads(cached)
        
        # Generate recommendations
        recommendations = engine.get_recommendations(request)
        
        # Cache results (expire in 1 hour)
        background_tasks.add_task(
            redis_client.setex,
            cache_key,
            3600,
            json.dumps(recommendations.dict(), default=str)
        )
        
        return recommendations
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/platforms")
async def get_platforms():
    """Get list of available platforms with metadata"""
    return {
        "platforms": [
            {
                "name": platform,
                "features": engine.platform_features.get(platform, {})
            }
            for platform in engine.platforms
        ]
    }

@app.post("/api/train")
async def train_model(background_tasks: BackgroundTasks):
    """Trigger model retraining"""
    background_tasks.add_task(retrain_models)
    return {"message": "Training started in background"}

def retrain_models():
    """Retrain ML models with new data"""
    # In production, this would load new data and retrain
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)