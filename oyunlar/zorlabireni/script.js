/* ============================================
   ZORLABİRENI - Labirent Oyunu
   Canvas API ile geliştirilmiş
   ============================================ */

// ============================================
// OYUN DEĞİŞKENLERİ
// ============================================
const canvas = document.getElementById('oyunCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayDesc = document.getElementById('overlayDesc');
const startBtn = document.getElementById('startBtn');
const timerEl = document.getElementById('timer');
const movesEl = document.getElementById('moves');
const levelEl = document.getElementById('level');

// Oyun durumu
let oyunAktif = false;
let oyunBitti = false;
let seviye = 1;
let hamleSayisi = 0;
let baslangicZamani = 0;
let zamanlayici = null;

// Labirent boyutları
const HUCRE_BOYUTU = 30;
const SATIR = 20;
const SUTUN = 20;

// Oyuncu ve hedef
let oyuncu = { x: 1, y: 1 };
let hedef = { x: 18, y: 18 };

// Labirent haritası (1 = duvar, 0 = yol)
const labirentler = [
    // Seviye 1 - Başlangıç (Kolay)
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,0,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    // Seviye 2 - Orta
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1],
        [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    // Seviye 3 - Zor
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1],
        [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
];

let mevcutLabirent = [];

// ============================================
// OYUN BAŞLATMA
// ============================================
startBtn.addEventListener('click', oyunuBaslat);

function oyunuBaslat() {
    oyunAktif = true;
    oyunBitti = false;
    hamleSayisi = 0;
    baslangicZamani = Date.now();

    // Labirenti kopyala
    mevcutLabirent = labirentler[seviye - 1].map(satir => [...satir]);

    // Oyuncu ve hedef pozisyonlarını ayarla
    oyuncu = { x: 1, y: 1 };
    hedef = { x: 18, y: 18 };

    // Overlay'i gizle
    overlay.classList.add('hidden');

    // Bilgileri güncelle
    guncelleBilgiler();

    // Zamanlayıcıyı başlat
    if (zamanlayici) clearInterval(zamanlayici);
    zamanlayici = setInterval(guncelleZaman, 1000);

    // İlk çizim
    ciz();
}

// ============================================
// OYUN BİTİŞİ
// ============================================
function oyunuBitir(kazandi) {
    oyunAktif = false;
    oyunBitti = true;
    clearInterval(zamanlayici);

    if (kazandi) {
        const gecenSure = Math.floor((Date.now() - baslangicZamani) / 1000);
        overlayTitle.textContent = '🎉 Tebrikler!';
        overlayDesc.innerHTML = `Labirenti ${gecenSure} saniyede ve ${hamleSayisi} hamlede çözdün!<br>Seviye ${seviye} tamamlandı.`;

        if (seviye < labirentler.length) {
            startBtn.textContent = '▶ SONRAKİ SEVİYE';
            seviye++;
        } else {
            overlayTitle.textContent = '🏆 Oyun Tamamlandı!';
            overlayDesc.innerHTML = `Tüm seviyeleri bitirdin!<br>Toplam ${hamleSayisi} hamle kullandın.`;
            startBtn.textContent = '▶ YENİDEN BAŞLA';
            seviye = 1;
        }
    } else {
        overlayTitle.textContent = '⏸️ Duraklatıldı';
        overlayDesc.textContent = 'Kaldığın yerden devam et.';
        startBtn.textContent = '▶ DEVAM ET';
    }

    overlay.classList.remove('hidden');
}

// ============================================
// TUŞ KONTROLLERİ
// ============================================
document.addEventListener('keydown', function(e) {
    if (!oyunAktif || oyunBitti) return;

    let yeniX = oyuncu.x;
    let yeniY = oyuncu.y;
    let hareketEtti = false;

    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            yeniY--;
            hareketEtti = true;
            e.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            yeniY++;
            hareketEtti = true;
            e.preventDefault();
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            yeniX--;
            hareketEtti = true;
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            yeniX++;
            hareketEtti = true;
            e.preventDefault();
            break;
        case 'Escape':
            oyunuBitir(false);
            return;
    }

    if (hareketEtti) {
        // Duvar kontrolü
        if (mevcutLabirent[yeniY] && mevcutLabirent[yeniY][yeniX] === 0) {
            oyuncu.x = yeniX;
            oyuncu.y = yeniY;
            hamleSayisi++;
            guncelleBilgiler();
            ciz();

            // Hedef kontrolü
            if (oyuncu.x === hedef.x && oyuncu.y === hedef.y) {
                setTimeout(() => oyunuBitir(true), 200);
            }
        }
    }
});

// ============================================
// MOBİL KONTROLLER
// ============================================
document.querySelectorAll('.dpad-btn[data-dir]').forEach(btn => {
    btn.addEventListener('click', function() {
        if (!oyunAktif || oyunBitti) return;

        const dir = this.getAttribute('data-dir');
        let yeniX = oyuncu.x;
        let yeniY = oyuncu.y;

        switch(dir) {
            case 'up': yeniY--; break;
            case 'down': yeniY++; break;
            case 'left': yeniX--; break;
            case 'right': yeniX++; break;
        }

        if (mevcutLabirent[yeniY] && mevcutLabirent[yeniY][yeniX] === 0) {
            oyuncu.x = yeniX;
            oyuncu.y = yeniY;
            hamleSayisi++;
            guncelleBilgiler();
            ciz();

            if (oyuncu.x === hedef.x && oyuncu.y === hedef.y) {
                setTimeout(() => oyunuBitir(true), 200);
            }
        }
    });
});

// ============================================
// BİLGİLERİ GÜNCELLE
// ============================================
function guncelleBilgiler() {
    movesEl.textContent = hamleSayisi;
    levelEl.textContent = seviye;
}

function guncelleZaman() {
    if (!oyunAktif) return;
    const gecenSure = Math.floor((Date.now() - baslangicZamani) / 1000);
    const dakika = Math.floor(gecenSure / 60).toString().padStart(2, '0');
    const saniye = (gecenSure % 60).toString().padStart(2, '0');
    timerEl.textContent = `${dakika}:${saniye}`;
}

// ============================================
// CANVAS ÇİZİM FONKSİYONLARI
// ============================================
function ciz() {
    // Canvas'ı temizle
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Izgara çiz
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= SATIR; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * HUCRE_BOYUTU);
        ctx.lineTo(canvas.width, i * HUCRE_BOYUTU);
        ctx.stroke();
    }
    for (let j = 0; j <= SUTUN; j++) {
        ctx.beginPath();
        ctx.moveTo(j * HUCRE_BOYUTU, 0);
        ctx.lineTo(j * HUCRE_BOYUTU, canvas.height);
        ctx.stroke();
    }

    // Labirenti çiz
    for (let y = 0; y < SATIR; y++) {
        for (let x = 0; x < SUTUN; x++) {
            const hucreX = x * HUCRE_BOYUTU;
            const hucreY = y * HUCRE_BOYUTU;

            if (mevcutLabirent[y][x] === 1) {
                // Duvar
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(hucreX, hucreY, HUCRE_BOYUTU, HUCRE_BOYUTU);

                // Duvar kenar efekti
                ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
                ctx.lineWidth = 1;
                ctx.strokeRect(hucreX, hucreY, HUCRE_BOYUTU, HUCRE_BOYUTU);

                // Duvar içi detay
                ctx.fillStyle = 'rgba(0, 212, 255, 0.05)';
                ctx.fillRect(hucreX + 5, hucreY + 5, HUCRE_BOYUTU - 10, HUCRE_BOYUTU - 10);
            } else {
                // Yol
                ctx.fillStyle = 'rgba(0, 212, 255, 0.02)';
                ctx.fillRect(hucreX, hucreY, HUCRE_BOYUTU, HUCRE_BOYUTU);
            }
        }
    }

    // Hedefi çiz (yeşil kare + parıltı)
    const hedefX = hedef.x * HUCRE_BOYUTU;
    const hedefY = hedef.y * HUCRE_BOYUTU;

    // Hedef parıltısı
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(hedefX + 2, hedefY + 2, HUCRE_BOYUTU - 4, HUCRE_BOYUTU - 4);
    ctx.shadowBlur = 0;

    // Hedef içi
    ctx.fillStyle = '#00cc6a';
    ctx.fillRect(hedefX + 6, hedefY + 6, HUCRE_BOYUTU - 12, HUCRE_BOYUTU - 12);

    // Hedef işareti
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏁', hedefX + HUCRE_BOYUTU / 2, hedefY + HUCRE_BOYUTU / 2);

    // Oyuncuyu çiz (mavi kare + parıltı)
    const oyuncuX = oyuncu.x * HUCRE_BOYUTU;
    const oyuncuY = oyuncu.y * HUCRE_BOYUTU;

    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(oyuncuX + 3, oyuncuY + 3, HUCRE_BOYUTU - 6, HUCRE_BOYUTU - 6);
    ctx.shadowBlur = 0;

    // Oyuncu içi
    ctx.fillStyle = '#0099cc';
    ctx.fillRect(oyuncuX + 7, oyuncuY + 7, HUCRE_BOYUTU - 14, HUCRE_BOYUTU - 14);

    // Oyuncu gözleri (sevimli efekt)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(oyuncuX + 11, oyuncuY + 11, 2, 0, Math.PI * 2);
    ctx.arc(oyuncuX + 19, oyuncuY + 11, 2, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// BAŞLANGIÇ ÇİZİMİ
// ============================================
// Sayfa yüklendiğinde labirenti göster (oyun başlamadan önce)
mevcutLabirent = labirentler[0].map(satir => [...satir]);
ciz();
