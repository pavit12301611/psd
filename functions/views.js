const { MongoClient } = require('mongodb');

let cachedClient = null;
async function getDB() {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    cachedClient = client;
    return client;
}

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

    try {
        const client = await getDB();
        const db = client.db('portfolio');

        if (event.httpMethod === 'POST') {
            // Increment view
            const today = new Date().toISOString().split('T')[0];
            await db.collection('stats').updateOne(
                { type: 'total' },
                { $inc: { views: 1 }, $set: { lastUpdated: new Date() } },
                { upsert: true }
            );
            await db.collection('stats').updateOne(
                { type: 'daily', date: today },
                { $inc: { views: 1 }, $set: { lastUpdated: new Date() }, $setOnInsert: { date: today } },
                { upsert: true }
            );
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        if (event.httpMethod === 'GET') {
            const total = await db.collection('stats').findOne({ type: 'total' });
            return {
                statusCode: 200, headers,
                body: JSON.stringify({ views: total?.views || 0 })
            };
        }

        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

    } catch (err) {
        console.error('Views error:', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
    }
};