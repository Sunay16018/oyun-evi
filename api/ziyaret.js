const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let cachedClient = null;

export default async function handler(req, res) {
    try {
        if (!uri) throw new Error("MONGODB_URI tanımlı değil!");

        if (!cachedClient) {
            cachedClient = new MongoClient(uri);
            await cachedClient.connect();
        }

        const db = cachedClient.db('oyun_evi_db');
        const collection = db.collection('sayaclar');

        // Sayıyı artır ve sonucu al
        const result = await collection.findOneAndUpdate(
            { _id: 'sayac_id' },
            { $inc: { miktar: 1 } },
            { upsert: true, returnDocument: 'after' }
        );

        // Farklı MongoDB sürümleri için veriyi güvenli çekme
        const sayı = result.value ? result.value.miktar : result.miktar;
        
        res.status(200).json({ miktar: sayı || 1 });
    } catch (error) {
        console.error("Hata:", error.message);
        res.status(500).json({ error: error.message });
    }
}
        } else {
            // IP zaten varsa: Hiçbir şey yapma, sadece mevcut sayıyı oku
            const current = await counterCol.findOne({ _id: 'toplam_ziyaretci' });
            return res.status(200).json({ miktar: current ? current.count : 0 });
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
