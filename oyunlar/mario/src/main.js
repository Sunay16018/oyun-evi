// Giriş Noktası - Mobil + Masaüstü (Düzeltilmiş)

document.addEventListener('DOMContentLoaded', () => {
    // Tüm sayfa için metin seçimini engelle
    document.addEventListener('selectstart', (e) => {
        e.preventDefault();
        return false;
    });

    // Context menu engelle (sağ tık menüsü)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // Drag engelle
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    });

    // Mobil cihazlarda dokunmatik olayları optimize et
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }

    // Oyunu başlat
    game = new Game();

    // iOS için standalone mod kontrolü
    if (window.navigator.standalone) {
        document.body.classList.add('standalone');
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
