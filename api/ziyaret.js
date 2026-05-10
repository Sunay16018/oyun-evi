const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
    if (!uri) return res.status(500).json({ error: "Vercel'de MONGODB_URI ekli değil!" });

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('oyun_evi_db');
        const collection = db.collection('sayaclar');

        const result = await collection.findOneAndUpdate(
            { _id: 'sayac_test' },
            { $inc: { miktar: 1 } },
            { upsert: true, returnDocument: 'after' }
        );

        const miktar = result.value ? result.value.miktar : (result.miktar || 1);
        res.status(200).json({ miktar: miktar });
    } catch (e) {
        res.status(500).json({ error: "Baglanti Hatasi: " + e.message });
    } finally {
        await client.close();
    }
}
