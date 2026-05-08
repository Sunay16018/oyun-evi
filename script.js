/* ============================================
   OYUN EVİ - Ana Sayfa JavaScript
   Dinamik Oyun Kartları Yükleme Sistemi
   ============================================ */

// Sayfa yüklendiğinde çalışacak ana fonksiyon
document.addEventListener('DOMContentLoaded', function() {
    oyunlariYukle();
    geriDonButonuEkle(); // Geri dön butonunu otomatik ekle
});

/**
 * oyun-listesi.json dosyasını okuyup oyun kartlarını oluşturur
 */
async function oyunlariYukle() {
    const kartlarAlani = document.getElementById('oyun-kartlari');

    // Yükleniyor mesajı göster
    kartlarAlani.innerHTML = '<div class="loading-text">🎮 Oyunlar yükleniyor...</div>';

    try {
        // JSON dosyasını fetch ile oku
        const response = await fetch('oyun-listesi.json');

        if (!response.ok) {
            throw new Error(`HTTP Hatası: ${response.status}`);
        }

        const oyunlar = await response.json();

        // JSON boş veya dizi değilse hata ver
        if (!Array.isArray(oyunlar) || oyunlar.length === 0) {
            kartlarAlani.innerHTML = '<div class="error-text">⚠️ Henüz hiç oyun eklenmemiş.</div>';
            return;
        }

        // Kartları temizle ve oluştur
        kartlarAlani.innerHTML = '';

        oyunlar.forEach((oyun, index) => {
            const kart = oyunKartiOlustur(oyun, index);
            kartlarAlani.appendChild(kart);
        });

    } catch (hata) {
        console.error('Oyunlar yüklenirken hata oluştu:', hata);
        kartlarAlani.innerHTML = `
            <div class="error-text">
                ⚠️ Oyunlar yüklenemedi!<br>
                <small>${hata.message}</small>
            </div>
        `;
    }
}

/**
 * Tek bir oyun kartı HTML elementi oluşturur
 * @param {Object} oyun - Oyun bilgileri (id, ad, ikon, baglanti)
 * @param {number} index - Kartın sıra numarası (animasyon gecikmesi için)
 * @returns {HTMLElement} - Oluşturulan kart elementi
 */
function oyunKartiOlustur(oyun, index) {
    // Ana kart elementi (a etiketi - tıklanabilir)
    const kart = document.createElement('a');
    kart.href = oyun.baglanti;
    kart.className = 'game-card';

    // Kartın animasyon gecikmesi (sırayla belirmesi için)
    kart.style.animationDelay = `${index * 0.1}s`;
    kart.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
    kart.style.opacity = '0';

    // İkon alanı
    const iconAlani = document.createElement('div');
    iconAlani.className = 'card-icon';

    // İkon varsa resim olarak, yoksa varsayılan renkli kare
    if (oyun.ikon && oyun.ikon.trim() !== '') {
        const img = document.createElement('img');
        img.src = oyun.ikon;
        img.alt = oyun.ad;
        img.onerror = function() {
            // Resim yüklenemezse varsayılan ikon göster
            this.parentElement.innerHTML = varsayilanIkonOlustur(oyun.ad);
        };
        iconAlani.appendChild(img);
    } else {
        iconAlani.innerHTML = varsayilanIkonOlustur(oyun.ad);
    }

    // İçerik alanı
    const icerik = document.createElement('div');
    icerik.className = 'card-content';

    const baslik = document.createElement('h3');
    baslik.className = 'card-title';
    baslik.textContent = oyun.ad;

    const oynaButon = document.createElement('span');
    oynaButon.className = 'play-hint';
    oynaButon.textContent = '▶ Oyna';

    icerik.appendChild(baslik);
    icerik.appendChild(oynaButon);

    // Kartı birleştir
    kart.appendChild(iconAlani);
    kart.appendChild(icerik);

    return kart;
}

/**
 * İkon resmi olmayan oyunlar için varsayılan renkli kare oluşturur
 * @param {string} oyunAdi - Oyunun adı (renk belirlemek için kullanılır)
 * @returns {string} - HTML string
 */
function varsayilanIkonOlustur(oyunAdi) {
    // Oyun adından bir renk hash'i üret (tutarlı renk için)
    const renkler = [
        '#00d4ff', '#ff00aa', '#00ff88', '#b300ff',
        '#ffdd00', '#ff4444', '#44ff44', '#4444ff'
    ];

    let hash = 0;
    for (let i = 0; i < oyunAdi.length; i++) {
        hash = oyunAdi.charCodeAt(i) + ((hash << 5) - hash);
    }

    const renkIndex = Math.abs(hash) % renkler.length;
    const arkaPlanRengi = renkler[renkIndex];

    // İlk harfi büyük olarak al
    const ilkHarf = oyunAdi.charAt(0).toUpperCase();

    return `
        <div class="default-icon" style="background: ${arkaPlanRengi};">
            <span style="color: #fff; font-weight: 900;">${ilkHarf}</span>
        </div>
    `;
}

/* ============================================
   OTOMATİK GERİ DÖN BUTONU EKLEME
   Bu fonksiyon tüm oyun sayfalarında çalışır
   ============================================ */

/**
 * Sayfaya otomatik olarak "Ana Sayfaya Dön" butonu ekler.
 * Buton, sitenin karanlık neon temasına uygun şekilde stilize edilir.
 */
function geriDonButonuEkle() {
    // Eğer buton zaten varsa tekrar ekleme
    if (document.getElementById('oyun-evi-geri-don')) {
        return;
    }

    const geriButonu = document.createElement('button');
    geriButonu.id = 'oyun-evi-geri-don';
    geriButonu.innerHTML = '🏠 GERİ DÖN';
    geriButonu.setAttribute('aria-label', 'Ana sayfaya dön');
    geriButonu.setAttribute('title', 'Ana sayfaya geri dön');
    
    geriButonu.onclick = function() {
        window.location.href = '/';
    };

    // Butonu sayfanın en başına ekle (body'nin ilk çocuğu olarak)
    document.body.prepend(geriButonu);
}

/* ============================================
   ANİMASYON KEYFRAME'LERİ (JavaScript ile ekleniyor)
   ============================================ */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(styleSheet);
