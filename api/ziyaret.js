const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
let cachedClient = null;

export default async function handler(req, res) {
    if (!cachedClient) {
        cachedClient = new MongoClient(uri);
        await cachedClient.connect();
    }

    try {
        const db = cachedClient.db('oyun_evi_db');
        const collection = db.collection('sayaclar');
        const shouldIncrease = req.query.artir === 'true';

        let result;
        if (shouldIncrease) {
            // Eğer URL'de ?artir=true varsa sayıyı artır
            result = await collection.findOneAndUpdate(
                { _id: 'genel_sayac' },
                { $inc: { count: 1 } },
                { upsert: true, returnDocument: 'after' }
            );
        } else {
            // Yoksa sadece mevcut sayıyı oku
            result = await collection.findOne({ _id: 'genel_sayac' });
        }

        const miktar = result ? (result.count || (result.value && result.value.count) || 0) : 0;
        res.status(200).json({ miktar: miktar });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
