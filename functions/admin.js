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
        'Access-Control-Allow-Headers': 'Content-Type, x-admin-secret',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

    // Auth check
    const secret = event.headers['x-admin-secret'];
    if (!secret || secret !== process.env.ADMIN_SECRET) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    try {
        const client = await getDB();
        const db = client.db('portfolio');
        const action = event.queryStringParameters?.action || 'overview';

        if (action === 'overview') {
            const [contacts, totalStats, dailyStats, projectStats, recentEvents] = await Promise.all([
                db.collection('contacts').countDocuments(),
                db.collection('stats').findOne({ type: 'total' }),
                db.collection('stats').find({ type: 'daily' }).sort({ date: -1 }).limit(7).toArray(),
                db.collection('stats').find({ type: 'project' }).sort({ clicks: -1 }).toArray(),
                db.collection('analytics').find({}).sort({ timestamp: -1 }).limit(10).toArray()
            ]);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    overview: {
                        totalContacts: contacts,
                        totalPageViews: totalStats?.views || 0,
                        last7Days: dailyStats,
                        projectClicks: projectStats,
                        recentEvents
                    }
                })
            };
        }

        if (action === 'contacts') {
            const page = parseInt(event.queryStringParameters?.page || '1');
            const limit = 20;
            const skip = (page - 1) * limit;
            const status = event.queryStringParameters?.status;

            const filter = status ? { status } : {};
            const [contacts, total] = await Promise.all([
                db.collection('contacts')
                    .find(filter, { projection: { ip: 0 } })
                    .sort({ timestamp: -1 })
                    .skip(skip)
                    .limit(limit)
                    .toArray(),
                db.collection('contacts').countDocuments(filter)
            ]);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ contacts, total, page, pages: Math.ceil(total / limit) })
            };
        }

        if (action === 'mark_read' && event.httpMethod === 'POST') {
            const { MongoClient: MC, ObjectId } = require('mongodb');
            const body = JSON.parse(event.body || '{}');
            if (!body.id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'ID required' }) };

            const { ObjectId: OID } = require('mongodb');
            await db.collection('contacts').updateOne(
                { _id: new OID(body.id) },
                { $set: { status: 'read', readAt: new Date() } }
            );

            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action' }) };

    } catch (err) {
        console.error('Admin error:', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
    }
};
