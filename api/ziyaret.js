const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
let cachedClient = null;

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (!cachedClient) {
        cachedClient = new MongoClient(uri);
        await cachedClient.connect();
    }

    try {
        const db = cachedClient.db('oyun_evi_db');
        const aktiflerCol = db.collection('aktif_kullanicilar');

        // Kullanıcının benzersiz kimliği (IP + UserAgent birleşimi)
        const userId = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // 1. Kullanıcıyı "Aktif" olarak işaretle veya vaktini güncelle
        await aktiflerCol.updateOne(
            { _id: userId },
            { $set: { sonGorulme: new Date() } },
            { upsert: true }
        );

        // 2. 30 saniyeden daha eski olan "hayalet" kullanıcıları temizle
        const sınırVakti = new Date(Date.now() - 30 * 1000); 
        await aktiflerCol.deleteMany({ sonGorulme: { $lt: sınırVakti } });

        // 3. Şu an kaç tane aktif kayıt var say
        const aktifSayisi = await aktiflerCol.countDocuments();

        res.status(200).json({ miktar: aktifSayisi });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
