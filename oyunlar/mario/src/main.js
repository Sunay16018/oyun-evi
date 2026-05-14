// Giriş Noktası - Mobil + Masaüstü

document.addEventListener('DOMContentLoaded', () => {
    // Mobil cihazlarda dokunmatik olayları optimize et
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }

    // Oyunu başlat
    game = new Game();

    // Tam ekran desteği
    const gameContainer = document.getElementById('game-container');

    // iOS için standalone mod kontrolü
    if (window.navigator.standalone) {
        document.body.classList.add('standalone');
    }

    // Android için PWA desteği
    if ('serviceWorker' in navigator) {
        // Service worker kaydı (opsiyonel)
        // navigator.serviceWorker.register('sw.js');
    }

    // Ekran döndürme kontrolü
    if (screen.orientation) {
        screen.orientation.addEventListener('change', () => {
            setTimeout(() => {
                if (game && game.input) {
                    game.input.resizeCanvas();
                }
            }, 300);
        });
    }

    // Klavye görününce resize (mobil)
    window.addEventListener('resize', () => {
        if (game && game.input) {
            game.input.resizeCanvas();
        }
    });
});

// Sayfa görünürlük değişimi (arka plana atma)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && game && game.state === GAME_STATE.PLAYING) {
        game.pauseGame();
    }
});
