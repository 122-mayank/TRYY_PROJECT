const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();


// ✅ Add this line to trust the first proxy (Render's load balancer)
app.set('trust proxy', 1);

// ... rest of your code (helmet, cors, etc.)

// ... (your existing code)

const allowedOrigins = [
  'http://localhost:3000',
  'https://tryy-project-1-frontend.onrender.com'
];

// Security middleware
app.use(helmet());

// ✅ FIXED CORS CONFIGURATION
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // This allows cookies/auth headers to be sent
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// ... (rest of your server.js remains exactly the same)
app.use('/api/', limiter);

app.use(express.json());

// Database connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check if MongoDB is running on port 27017');
    console.log('3. Verify your MONGODB_URI in .env file');
    console.log('4. Try running: "net start MongoDB" (Windows)');
    console.log('5. Or start MongoDB manually: "mongod"');
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users')); // Fixed typo
app.use('/api/business', require('./routes/business'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/admin', require('./routes/admin'));

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
});