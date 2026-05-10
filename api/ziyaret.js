const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let cachedClient = null;

export default async function handler(req, res) {
    if (!uri) {
        return res.status(500).json({ error: "MONGODB_URI eksik!" });
    }

    try {
        if (!cachedClient) {
            cachedClient = new MongoClient(uri);
            await cachedClient.connect();
        }

        const db = cachedClient.db('oyun_evi_db');
        const collection = db.collection('sayaclar');

        const result = await collection.findOneAndUpdate(
            { _id: 'genel_sayac' },
            { $inc: { count: 1 } },
            { upsert: true, returnDocument: 'after' }
        );

        // MongoDB versiyonlarına göre veri kontrolü
        const miktar = result.value ? result.value.count : (result.count || 0);

        res.status(200).json({ miktar: miktar });
    } catch (e) {
        res.status(500).json({ error: "Veritabanı hatası: " + e.message });
    }
}
