// Girdi Sistemi

class Input {
    constructor() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.jump = false;
        this.run = false;
        this.fire = false;
        this.pause = false;
        this.start = false;

        this.jumpPressed = false;
        this.firePressed = false;
        this.pausePressed = false;
        this.startPressed = false;

        this.keys = {};
        this.previousKeys = {};

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.updateState();

            // Tarayıcı varsayılan davranışlarını engelle
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            this.updateState();
        });
    }

    updateState() {
        // Yön tuşları
        this.left = this.keys['ArrowLeft'] || this.keys['KeyA'];
        this.right = this.keys['ArrowRight'] || this.keys['KeyD'];
        this.up = this.keys['ArrowUp'] || this.keys['KeyW'];
        this.down = this.keys['ArrowDown'] || this.keys['KeyS'];

        // Zıplama
        const jumpKey = this.keys['ArrowUp'] || this.keys['KeyW'] || this.keys['Space'];
        this.jump = jumpKey;

        // Koşma (Z tuşu veya Shift)
        this.run = this.keys['KeyZ'] || this.keys['ShiftLeft'] || this.keys['ShiftRight'];

        // Ateş etme (X tuşu)
        this.fire = this.keys['KeyX'];

        // Duraklatma (P tuşu)
        this.pause = this.keys['KeyP'];

        // Başlatma (Enter)
        this.start = this.keys['Enter'];
    }

    update() {
        // Tek seferlik basma kontrolü
        this.jumpPressed = this.jump && !this.previousJump;
        this.firePressed = this.fire && !this.previousFire;
        this.pausePressed = this.pause && !this.previousPause;
        this.startPressed = this.start && !this.previousStart;

        this.previousJump = this.jump;
        this.previousFire = this.fire;
        this.previousPause = this.pause;
        this.previousStart = this.start;
    }

    reset() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.jump = false;
        this.run = false;
        this.fire = false;
        this.pause = false;
        this.start = false;
        this.keys = {};
    }
}
