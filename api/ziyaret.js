const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
let cachedClient = null;

export default async function handler(req, res) {
    if (!uri) return res.status(500).json({ error: "MONGODB_URI eksik!" });

    if (!cachedClient) {
        cachedClient = new MongoClient(uri);
        await cachedClient.connect();
    }

    try {
        const db = cachedClient.db('oyun_evi_db');
        const counterCol = db.collection('sayaclar');
        const ipsCol = db.collection('ziyaretci_ipleri');

        const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const isFirstLoad = req.query.ilk === 'true'; // Sayfa ilk açıldığında bu true gelecek

        if (isFirstLoad) {
            const alreadyExists = await ipsCol.findOne({ ip: userIp });

            if (!alreadyExists) {
                // Yeni IP: Kaydet ve +1 artır
                await ipsCol.insertOne({ ip: userIp, tarih: new Date() });
                const update = await counterCol.findOneAndUpdate(
                    { _id: 'toplam_ziyaretci' },
                    { $inc: { count: 1 } },
                    { upsert: true, returnDocument: 'after' }
                );
                const miktar = update.value ? update.value.count : (update.count || 1);
                return res.status(200).json({ miktar: miktar });
            }
        }

        // Eski IP veya Anlık Güncelleme: Sadece sayıyı oku
        const current = await counterCol.findOne({ _id: 'toplam_ziyaretci' });
        res.status(200).json({ miktar: current ? current.count : 0 });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
