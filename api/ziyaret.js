const { MongoClient } = require('mongodb');

// Vercel ayarlarından MONGODB_URI'yi çeker
const uri = process.env.MONGODB_URI;
let client;

export default async function handler(req, res) {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
    
    try {
        const database = client.db('oyun_evi_veritabani');
        const sayaclar = database.collection('sayac_verisi');

        // 'toplam' kaydını bul ve 1 artır. Eğer yoksa yeni oluştur (upsert).
        const result = await sayaclar.findOneAndUpdate(
            { id: 'genel_sayac' },
            { $inc: { miktar: 1 } },
            { upsert: true, returnDocument: 'after' }
        );

        // Başarılıysa sayıyı gönder
        res.status(200).json({ toplam: result.miktar });
    } catch (error) {
        res.status(500).json({ error: "Veritabanı hatası: " + error.message });
    }
}
