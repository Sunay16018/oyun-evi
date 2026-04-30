// Oyun Değişkenleri
let skor = 0;
let rekor = localStorage.getItem('kopruKurRekor') || 0;
let sesAcik = localStorage.getItem('kopruKurSes') !== 'kapali';
let oyunAktif = false;
let kopruUzunlugu = 0;
let uzamaHizi = 200; // px/saniye
let boslukMesafe = 200;
let platformGenislik = 120;
let tur = 1;

// DOM Elementleri
const solPlatform = document.getElementById('solPlatform');
const sagPlatform = document.getElementById('sagPlatform');
const kopru = document.getElementById('kopru');
const kopruContainer = document.getElementById('kopruContainer');
const karakter = document.getElementById('karakter');
const skorElement = document.getElementById('skor');
const rekorElement = document.getElementById('rekor');
const talimat = document.getElementById('talimat');
const gameOverEkran = document.getElementById('gameOver');
const finalSkor = document.getElementById('finalSkor');
const yeniRekor = document.getElementById('yeniRekor');
const sesToggle = document.getElementById('sesToggle');
const konfetiContainer = document.getElementById('konfeti');
const mukemmelYazi = document.getElementById('mukemmelYazi');

// Ses Context
let audioContext = null;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(frequency, duration, type = 'sine') {
  if (!sesAcik || !audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function playBridgeGrow() {
  if (!sesAcik || !audioContext) return;
  playSound(200, 0.1, 'sawtooth');
}

function playBridgeDrop() {
  playSound(150, 0.3, 'triangle');
}

function playSuccess() {
  playSound(523, 0.2); // Do
  setTimeout(() => playSound(659, 0.2), 100); // Mi
  setTimeout(() => playSound(784, 0.3), 200); // Sol
}

function playPerfect() {
  playSound(1000, 0.1);
  setTimeout(() => playSound(1200, 0.1), 50);
  setTimeout(() => playSound(1500, 0.2), 100);
}

function playFail() {
  playSound(400, 0.5, 'sawtooth');
  setTimeout(() => playSound(300, 0.5, 'sawtooth'), 100);
  setTimeout(() => playSound(200, 0.5, 'sawtooth'), 200);
}

function playGameOver() {
  playSound(150, 0.5, 'square');
}

// Oyun Başlatma
function oyunBaslat() {
  skor = 0;
  tur = 1;
  boslukMesafe = 200;
  platformGenislik = 120;
  oyunAktif = true;

  skorElement.textContent = skor;
  rekorElement.textContent = rekor;

  gameOverEkran.classList.remove('show');
  talimat.style.display = 'block';

  platformlariAyarla();
  karakteriSifirla();
  kopruyuSifirla();

  initAudio();
}

// Platformları Ayarla
function platformlariAyarla() {
  solPlatform.style.width = platformGenislik + 'px';
  solPlatform.style.height = '80px';

  sagPlatform.style.width = platformGenislik + 'px';
  sagPlatform.style.height = '80px';
  sagPlatform.style.position = 'absolute';
  sagPlatform.style.right = '50px';
  sagPlatform.style.bottom = '0';

  // Köprü container pozisyonu
  kopruContainer.style.left = (platformGenislik + 50) + 'px';
}

// Karakteri Sıfırla
function karakteriSifirla() {
  karakter.style.bottom = '80px';
  karakter.style.left = '50%';
  karakter.style.transform = 'translateX(-50%)';
  karakter.classList.remove('walking');
  karakter.style.opacity = '1';
}

// Köprüyü Sıfırla
function kopruyuSifirla() {
  kopruUzunlugu = 0;
  kopru.style.height = '0px';
  kopru.style.transform = 'scaleY(0)';
}

// Köprü Uzatma
let uzamaInterval = null;
let baslangicZamani = null;

function kopruUzat() {
  if (!oyunAktif) return;

  initAudio();
  baslangicZamani = Date.now();

  uzamaInterval = setInterval(() => {
    const gecenSure = (Date.now() - baslangicZamani) / 1000;
    kopruUzunlugu = gecenSure * uzamaHizi;

    kopru.style.height = kopruUzunlugu + 'px';
    kopru.style.transform = 'scaleY(1)';

    playBridgeGrow();
  }, 50);
}

// Köprü Bırakma
function kopruBirak() {
  if (!oyunAktif || !uzamaInterval) return;

  clearInterval(uzamaInterval);
  uzamaInterval = null;

  playBridgeDrop();

  // Köprüyü döndür
  kopru.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
  kopru.style.transform = 'rotate(90deg)';
  kopru.style.transformOrigin = 'bottom center';

  setTimeout(() => {
    sonucKontrol();
  }, 300);
}

// Sonuç Kontrol
function sonucKontrol() {
  const tolerans = platformGenislik * 0.05; // %5 tolerans
  const minUzunluk = boslukMesafe;
  const maxUzunluk = boslukMesafe + platformGenislik;

  if (kopruUzunlugu < minUzunluk) {
    // Çok kısa - Düşüş
    dususAnimasyonu();
  } else if (kopruUzunlugu > maxUzunluk + tolerans) {
    // Çok uzun - Uçuş
    ucusAnimasyonu();
  } else {
    // Başarılı
    const mukemmel = Math.abs(kopruUzunlugu - (minUzunluk + platformGenislik / 2)) < tolerans;
    basarili(mukemmel);
  }
}

// Başarılı
function basarili(mukemmel) {
  if (mukemmel) {
    skor += 2;
    playPerfect();
    mukemmelYazi.classList.add('show');
    konfetiEkle();
    setTimeout(() => mukemmelYazi.classList.remove('show'), 1000);
  } else {
    skor += 1;
    playSuccess();
  }

  skorElement.textContent = skor;

  // Karakter yürüyüşü
  karakter.classList.add('walking');

  const yurumeMesafe = boslukMesafe + platformGenislik + 50;
  karakter.style.transition = 'left 1s linear';
  karakter.style.left = yurumeMesafe + 'px';

  setTimeout(() => {
    karakter.classList.remove('walking');
    sonrakiTur();
  }, 1000);
}

// Düşüş Animasyonu
function dususAnimasyonu() {
  oyunAktif = false;
  playFail();

  karakter.style.transition = 'transform 1s ease-in, opacity 1s';
  karakter.style.transform = 'translateX(-50%) rotate(90deg) translateY(300px)';
  karakter.style.opacity = '0';

  document.body.classList.add('shake');
  setTimeout(() => document.body.classList.remove('shake'), 500);

  setTimeout(() => gameOver(), 1200);
}

// Uçuş Animasyonu
function ucusAnimasyonu() {
  oyunAktif = false;
  playFail();

  karakter.style.transition = 'transform 1.2s ease-out, opacity 1.2s';
  karakter.style.transform = 'translateX(-50%) rotate(45deg) translate(200px, 200px)';
  karakter.style.opacity = '0';

  document.body.classList.add('shake');
  setTimeout(() => document.body.classList.remove('shake'), 500);

  setTimeout(() => gameOver(), 1400);
}

// Sonraki Tur
function sonrakiTur() {
  tur++;

  // Zorlaşma
  if (tur <= 5) {
    boslukMesafe = 150 + Math.random() * 50;
  } else if (tur <= 10) {
    boslukMesafe = 200 + Math.random() * 80;
    platformGenislik = 100;
  } else if (tur <= 15) {
    boslukMesafe = 280 + Math.random() * 70;
    platformGenislik = 90;
  } else if (tur <= 20) {
    boslukMesafe = 350 + Math.random() * 70;
    platformGenislik = 80;
  } else if (tur <= 30) {
    boslukMesafe = 420 + Math.random() * 80;
    platformGenislik = 70;
  } else {
    boslukMesafe = 500 + Math.random() * 100;
    platformGenislik = 60;
  }

  // Platformları güncelle
  platformlariAyarla();

  // Karakteri sıfırla
  karakter.style.transition = 'none';
  karakteriSifirla();

  // Köprüyü sıfırla
  kopru.style.transition = 'none';
  kopruyuSifirla();

  // Yeni pozisyon
  sagPlatform.style.right = (50 + Math.random() * 100) + 'px';
}

// Game Over
function gameOver() {
  oyunAktif = false;
  playGameOver();

  finalSkor.textContent = skor;

  if (skor > rekor) {
    rekor = skor;
    localStorage.setItem('kopruKurRekor', rekor);
    yeniRekor.classList.add('show');
    konfetiEkle();
  } else {
    yeniRekor.classList.remove('show');
  }

  gameOverEkran.classList.add('show');
  talimat.style.display = 'none';
}

// Konfeti Efekti
function konfetiEkle() {
  const renkler = ['#FFD700', '#2ed573', '#1e90ff', '#ff4757', '#ffa502'];

  for (let i = 0; i < 50; i++) {
    const konfeti = document.createElement('div');
    konfeti.className = 'confetti';
    konfeti.style.left = Math.random() * 100 + '%';
    konfeti.style.backgroundColor = renkler[Math.floor(Math.random() * renkler.length)];
    konfeti.style.animationDelay = Math.random() * 2 + 's';
    konfeti.style.animationDuration = (1 + Math.random() * 2) + 's';

    konfetiContainer.appendChild(konfeti);

    setTimeout(() => konfeti.remove(), 3000);
  }
}

// Ses Toggle
sesToggle.addEventListener('click', () => {
  sesAcik = !sesAcik;
  sesToggle.textContent = sesAcik ? '🔊' : '🔇';
  localStorage.setItem('kopruKurSes', sesAcik ? 'acik' : 'kapali');
});

// Yeniden Başla
document.getElementById('yenidenBasla').addEventListener('click', () => {
  oyunBaslat();
});

// Mouse/Touch Olayları
document.addEventListener('mousedown', (e) => {
  if (e.target.closest('.back-button') || e.target.closest('.sound-toggle')) return;
  if (oyunAktif && !uzamaInterval) {
    kopruUzat();
  }
});

document.addEventListener('mouseup', () => {
  if (uzamaInterval) {
    kopruBirak();
  }
});

document.addEventListener('touchstart', (e) => {
  if (e.target.closest('.back-button') || e.target.closest('.sound-toggle')) return;
  e.preventDefault();
  if (oyunAktif && !uzamaInterval) {
    kopruUzat();
  }
}, { passive: false });

document.addEventListener('touchend', (e) => {
  e.preventDefault();
  if (uzamaInterval) {
    kopruBirak();
  }
});

// Klavye Desteği
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && oyunAktif && !uzamaInterval) {
    e.preventDefault();
    kopruUzat();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space' && uzamaInterval) {
    e.preventDefault();
    kopruBirak();
  }
});

// Başlat
oyunBaslat();
