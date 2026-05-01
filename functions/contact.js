const { MongoClient } = require('mongodb');

// ===== DB CONNECTION (reused across warm function calls) =====
let cachedClient = null;

async function getDB() {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    cachedClient = client;
    return client;
}

// ===== SIMPLE EMAIL NOTIFICATION =====
async function sendNotificationEmail(data) {
    try {
        const nodemailer = require('nodemailer');

        // Using Gmail — you need App Password (not regular password)
        // Go to Google Account → Security → 2-Step Verification → App Passwords
        // Generate one for "Mail" → use that as GMAIL_APP_PASSWORD in Netlify env vars
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: process.env.FROM_EMAIL,
            subject: `📬 New Contact: ${data.name}`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f5f5f7;border-radius:16px;">
                    <h2 style="color:#1d1d1f;margin-bottom:24px;font-size:24px;">New Message 📬</h2>
                    <div style="background:white;border-radius:12px;padding:24px;">
                        <p><strong>Name:</strong> ${data.name}</p>
                        <p><strong>Email:</strong> ${data.email}</p>
                        <p><strong>Message:</strong></p>
                        <div style="background:#f5f5f7;padding:16px;border-radius:8px;margin-top:8px;color:#424245;">
                            ${data.message.replace(/\n/g, '<br>')}
                        </div>
                        <p style="margin-top:16px;font-size:12px;color:#86868b;">
                            Sent: ${new Date(data.timestamp).toLocaleString('en-IN', {timeZone:'Asia/Kolkata'})} IST
                        </p>
                    </div>
                </div>
            `
        });
    } catch (err) {
        // Email is optional — don't fail the main function
        console.error('Email send failed (non-critical):', err.message);
    }
}

// ===== VALIDATION =====
function validate(data) {
    const errors = [];
    if (!data.name || data.name.trim().length < 2) errors.push('Name must be at least 2 characters');
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Valid email required');
    if (!data.message || data.message.trim().length < 10) errors.push('Message must be at least 10 characters');
    if (data.name && data.name.length > 100) errors.push('Name too long');
    if (data.message && data.message.length > 5000) errors.push('Message too long');
    return errors;
}

// ===== RATE LIMIT (simple IP-based) =====
const rateLimitMap = new Map();
function isRateLimited(ip) {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const maxRequests = 3;

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, []);
    }

    const timestamps = rateLimitMap.get(ip).filter(t => now - t < windowMs);
    rateLimitMap.set(ip, timestamps);

    if (timestamps.length >= maxRequests) return true;
    timestamps.push(now);
    return false;
}

// ===== MAIN HANDLER =====
exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        // Parse body
        let body;
        try {
            body = JSON.parse(event.body);
        } catch {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
        }

        // Rate limit
        const clientIP = event.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
        if (isRateLimited(clientIP)) {
            return {
                statusCode: 429, headers,
                body: JSON.stringify({ error: 'Too many requests. Please wait an hour before sending again.' })
            };
        }

        // Validate
        const errors = validate(body);
        if (errors.length > 0) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: errors[0], errors }) };
        }

        // Sanitize
        const submission = {
            name: body.name.trim().substring(0, 100),
            email: body.email.trim().toLowerCase().substring(0, 200),
            message: body.message.trim().substring(0, 5000),
            timestamp: new Date(),
            ip: clientIP,
            userAgent: event.headers['user-agent']?.substring(0, 200) || '',
            status: 'new'
        };

        // Save to MongoDB
        const client = await getDB();
        const db = client.db('portfolio');
        const collection = db.collection('contacts');
        const result = await collection.insertOne(submission);

        // Send email notification (non-blocking)
        sendNotificationEmail(submission);

        console.log(`✅ New contact: ${submission.name} (${submission.email})`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Message received! I\'ll get back to you soon.',
                id: result.insertedId
            })
        };

    } catch (err) {
        console.error('Contact function error:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Something went wrong. Please try again.' })
        };
    }
};