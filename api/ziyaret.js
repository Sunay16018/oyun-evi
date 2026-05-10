const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
    if (!uri) {
        return res.status(500).json({ error: "MONGODB_URI tanımlı değil!" });
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('oyun_evi_db');
        const collection = db.collection('sayaclar');

        const result = await collection.findOneAndUpdate(
            { _id: 'toplam_ziyaret' },
            { $inc: { count: 1 } },
            { upsert: true, returnDocument: 'after' }
        );

        // MongoDB sürümüne göre 'value' veya 'count' dönebilir
        const miktar = result.count || (result.value && result.value.count) || result.miktar;
        res.status(200).json({ miktar: miktar });

    } catch (error) {
        // Hatayı detaylıca gönderiyoruz
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
}
