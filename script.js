/* ============================================
   OYUN EVİ - Ana Sayfa JavaScript
   Dinamik Oyun Kartları Yükleme Sistemi
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('oyun-kartlari')) {
        oyunlariYukle();
    }
});

async function oyunlariYukle() {
    const kartlarAlani = document.getElementById('oyun-kartlari');
    if (!kartlarAlani) return;

    kartlarAlani.innerHTML = '<div class="loading-text">🎮 Oyunlar yükleniyor...</div>';

    try {
        const response = await fetch('oyun-listesi.json');
        if (!response.ok) throw new Error(`HTTP Hatası: ${response.status}`);

        const oyunlar = await response.json();
        if (!Array.isArray(oyunlar) || oyunlar.length === 0) {
            kartlarAlani.innerHTML = '<div class="error-text">⚠️ Henüz hiç oyun eklenmemiş.</div>';
            return;
        }

        kartlarAlani.innerHTML = '';
        oyunlar.forEach((oyun, index) => {
            const kart = oyunKartiOlustur(oyun, index);
            kartlarAlani.appendChild(kart);
        });

    } catch (hata) {
        console.error('Oyunlar yüklenirken hata oluştu:', hata);
        kartlarAlani.innerHTML = `<div class="error-text">⚠️ Oyunlar yüklenemedi!<br><small>${hata.message}</small></div>`;
    }
}

function oyunKartiOlustur(oyun, index) {
    const kart = document.createElement('a');
    kart.href = oyun.baglanti;
    kart.className = 'game-card';
    kart.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
    kart.style.opacity = '0';

    const iconAlani = document.createElement('div');
    iconAlani.className = 'card-icon';

    if (oyun.ikon && oyun.ikon.trim() !== '') {
        const img = document.createElement('img');
        img.src = oyun.ikon;
        img.alt = oyun.ad;
        img.onerror = function() {
            this.parentElement.innerHTML = varsayilanIkonOlustur(oyun.ad);
        };
        iconAlani.appendChild(img);
    } else {
        iconAlani.innerHTML = varsayilanIkonOlustur(oyun.ad);
    }

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
    kart.appendChild(iconAlani);
    kart.appendChild(icerik);

    return kart;
}

function varsayilanIkonOlustur(oyunAdi) {
    const renkler = ['#00d4ff', '#ff00aa', '#00ff88', '#b300ff', '#ffdd00', '#ff4444', '#44ff44', '#4444ff'];
    let hash = 0;
    for (let i = 0; i < oyunAdi.length; i++) {
        hash = oyunAdi.charCodeAt(i) + ((hash << 5) - hash);
    }
    const renkIndex = Math.abs(hash) % renkler.length;
    const arkaPlanRengi = renkler[renkIndex];
    const ilkHarf = oyunAdi.charAt(0).toUpperCase();

    return `<div class="default-icon" style="background: ${arkaPlanRengi};"><span style="color: #fff; font-weight: 900;">${ilkHarf}</span></div>`;
}

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleSheet);
