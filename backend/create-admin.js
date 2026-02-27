// create-admin.js
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const db = client.db('adviser');
        const users = db.collection('users');
        
        // Check if admin already exists
        const existingAdmin = await users.findOne({ email: 'admin@adviser.com' });
        if (existingAdmin) {
            console.log('📝 Admin already exists! Updating role...');
            
            // Update role to admin
            await users.updateOne(
                { email: 'admin@adviser.com' },
                { $set: { role: 'admin' } }
            );
            
            console.log('✅ Role updated to admin successfully!');
            console.log('📧 Email: admin@adviser.com');
            console.log('🔑 Password: (your existing password)');
            
            return;
        }
        
        // Create new admin
        const hashedPassword = await bcrypt.hash('Admin@123', 12);
        
        const result = await users.insertOne({
            email: 'admin@adviser.com',
            password: hashedPassword,
            companyName: 'AdViser Admin',
            role: 'admin',
            createdAt: new Date(),
            lastLogin: null,
            subscription: {
                plan: 'enterprise',
                features: ['all']
            }
        });
        
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@adviser.com');
        console.log('🔑 Password: Admin@123');
        console.log('👤 Role: admin');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('👋 MongoDB connection closed');
    }
}

createAdmin();