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

        // Kullanıcının IP adresini alıyoruz
        const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Bu IP daha önce gelmiş mi?
        const hasVisited = await ipsCol.findOne({ ip: userIp });

        if (!hasVisited) {
            // IP ilk defa geliyorsa: Kaydet ve sayacı 1 artır
            await ipsCol.insertOne({ ip: userIp, tarih: new Date() });
            
            const result = await counterCol.findOneAndUpdate(
                { _id: 'toplam_ziyaretci' },
                { $inc: { count: 1 } },
                { upsert: true, returnDocument: 'after' }
            );
            
            const miktar = result.value ? result.value.count : (result.count || 1);
            return res.status(200).json({ miktar: miktar });
        } else {
            // IP zaten varsa: Hiçbir şey yapma, sadece mevcut sayıyı oku
            const current = await counterCol.findOne({ _id: 'toplam_ziyaretci' });
            return res.status(200).json({ miktar: current ? current.count : 0 });
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
