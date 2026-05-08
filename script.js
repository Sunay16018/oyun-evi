/* ============================================
   OYUN EVİ - Ana Sayfa JavaScript
   iframe Sistemi ile Otomatik Geri Dön Butonu
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
    const kart = document.createElement('div');
    kart.className = 'game-card';
    kart.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
    kart.style.opacity = '0';
    kart.onclick = function() {
        oyunuAc(oyun);
    };

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

/* ============================================
   OYUN AÇMA SİSTEMİ (GERİ DÖN BUTONLU)
   ============================================ */
function oyunuAc(oyun) {
    // Tam ekran oyun overlay'i oluştur
    const overlay = document.createElement('div');
    overlay.id = 'oyun-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        z-index: 9999;
        background: #0a0a0f;
    `;

    // Geri dön butonu
    const geriBtn = document.createElement('button');
    geriBtn.innerHTML = '←';
    geriBtn.title = 'Ana Sayfaya Dön';
    geriBtn.style.cssText = `
        position: fixed;
        top: 12px; left: 12px;
        z-index: 99999;
        width: 38px; height: 38px;
        border-radius: 50%;
        background: rgba(10, 10, 15, 0.8);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1.5px solid rgba(0, 212, 255, 0.6);
        color: #00d4ff;
        font-size: 18px; font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 0 12px rgba(0, 212, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.5);
        outline: none;
        padding: 0;
        line-height: 1;
    `;

    geriBtn.onmouseenter = function() {
        this.style.transform = 'scale(1.15)';
        this.style.borderColor = '#ff00aa';
        this.style.color = '#ff00aa';
        this.style.boxShadow = '0 0 20px rgba(255, 0, 170, 0.6), 0 6px 16px rgba(0, 0, 0, 0.7)';
    };

    geriBtn.onmouseleave = function() {
        this.style.transform = 'scale(1)';
        this.style.borderColor = 'rgba(0, 212, 255, 0.6)';
        this.style.color = '#00d4ff';
        this.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.5)';
    };

    geriBtn.onclick = function() {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
    };

    // Oyun iframe'i
    const iframe = document.createElement('iframe');
    iframe.src = oyun.baglanti;
    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
    `;

    overlay.appendChild(geriBtn);
    overlay.appendChild(iframe);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

/* ============================================
   ANİMASYON KEYFRAME'LERİ
   ============================================ */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleSheet);
