// ===== SHARED DB UTILITY =====
// This is a shared module used by all functions
// Not a Netlify function itself — just a helper

const { MongoClient } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectDB(dbName = 'portfolio') {
    if (cachedClient && cachedDb) {
        try {
            await cachedClient.db('admin').command({ ping: 1 });
            return cachedDb;
        } catch {
            cachedClient = null;
            cachedDb = null;
        }
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI environment variable not set');

    const client = new MongoClient(uri, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
        connectTimeoutMS: 10000,
    });

    await client.connect();
    cachedClient = client;
    cachedDb = client.db(dbName);

    console.log('✅ MongoDB connected');
    return cachedDb;
}

module.exports = { connectDB };