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
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

    try {
        const body = JSON.parse(event.body || '{}');
        const { type, data } = body;

        // Validate type
        const allowedTypes = ['pageview', 'project_click', 'section_view', 'contact_click'];
        if (!allowedTypes.includes(type)) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid event type' }) };
        }

        const client = await getDB();
        const db = client.db('portfolio');

        const event_doc = {
            type,
            data: data || {},
            timestamp: new Date(),
            ip: event.headers['x-forwarded-for']?.split(',')[0] || 'unknown',
            userAgent: event.headers['user-agent']?.substring(0, 200) || '',
            referrer: event.headers['referer'] || ''
        };

        // Store event
        await db.collection('analytics').insertOne(event_doc);

        // Update aggregated stats
        const today = new Date().toISOString().split('T')[0];

        if (type === 'pageview') {
            await db.collection('stats').updateOne(
                { type: 'daily', date: today },
                {
                    $inc: { views: 1 },
                    $set: { lastUpdated: new Date() },
                    $setOnInsert: { date: today, type: 'daily' }
                },
                { upsert: true }
            );
            await db.collection('stats').updateOne(
                { type: 'total' },
                { $inc: { views: 1 }, $set: { lastUpdated: new Date() } },
                { upsert: true }
            );
        }

        if (type === 'project_click' && data?.project) {
            await db.collection('stats').updateOne(
                { type: 'project', name: data.project },
                {
                    $inc: { clicks: 1 },
                    $set: { lastClicked: new Date() }
                },
                { upsert: true }
            );
        }

        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };

    } catch (err) {
        console.error('Analytics error:', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
    }
};