// Girdi Sistemi - Mobil + Masaüstü (Otomatik Başlatma)

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

        this.isMobile = false;
        this.touchActive = false;

        this.setupEventListeners();
        this.detectDevice();
    }

    detectDevice() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

        const mobileControls = document.getElementById('mobile-controls');
        const deviceInfo = document.getElementById('device-info');

        if (this.isMobile && mobileControls) {
            mobileControls.classList.remove('hidden');
        }

        if (deviceInfo) {
            deviceInfo.textContent = this.isMobile ? '📱 Mobil Cihaz Algılandı' : '🖥️ Masaüstü Modu';
        }

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.resizeCanvas(), 300);
        });
    }

    resizeCanvas() {
        const canvas = document.getElementById('gameCanvas');
        const container = document.getElementById('game-container');

        if (!canvas || !container) return;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const gameAspect = LOGICAL_WIDTH / LOGICAL_HEIGHT;
        const containerAspect = containerWidth / containerHeight;

        let canvasWidth, canvasHeight;

        if (containerAspect > gameAspect) {
            canvasHeight = containerHeight;
            canvasWidth = canvasHeight * gameAspect;
        } else {
            canvasWidth = containerWidth;
            canvasHeight = canvasWidth / gameAspect;
        }

        const dpr = window.devicePixelRatio || 1;
        canvas.width = LOGICAL_WIDTH * dpr;
        canvas.height = LOGICAL_HEIGHT * dpr;

        canvas.style.width = canvasWidth + 'px';
        canvas.style.height = canvasHeight + 'px';

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        window.GAME_SCALE = Math.min(canvasWidth / LOGICAL_WIDTH, canvasHeight / LOGICAL_HEIGHT);
    }

    setupEventListeners() {
        // Klavye olayları (Masaüstü)
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.updateState();

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            this.updateState();
        });

        // Dokunmatik olaylar (Mobil)
        this.setupTouchControls();
    }

    setupTouchControls() {
        // D-Pad butonları
        const dpadButtons = {
            'btn-up': 'up',
            'btn-down': 'down',
            'btn-left': 'left',
            'btn-right': 'right'
        };

        Object.entries(dpadButtons).forEach(([id, action]) => {
            const btn = document.getElementById(id);
            if (!btn) return;

            const startHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this[action] = true;
                btn.style.background = 'rgba(255, 255, 255, 0.5)';
                btn.style.transform = 'scale(0.9)';
            };

            const endHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this[action] = false;
                btn.style.background = '';
                btn.style.transform = '';
            };

            btn.addEventListener('touchstart', startHandler, { passive: false });
            btn.addEventListener('touchend', endHandler, { passive: false });
            btn.addEventListener('touchcancel', endHandler, { passive: false });
            btn.addEventListener('mousedown', startHandler);
            btn.addEventListener('mouseup', endHandler);
            btn.addEventListener('mouseleave', endHandler);
        });

        // Aksiyon butonları
        const jumpBtn = document.getElementById('btn-jump');
        const runBtn = document.getElementById('btn-run');
        const pauseBtn = document.getElementById('mobile-pause-btn');

        if (jumpBtn) {
            const jumpStart = (e) => {
                e.preventDefault();
                this.jump = true;
                this.jumpPressed = true;
                jumpBtn.style.background = 'rgba(0, 168, 0, 0.6)';
                jumpBtn.style.transform = 'scale(0.9)';
            };
            const jumpEnd = (e) => {
                e.preventDefault();
                this.jump = false;
                jumpBtn.style.background = '';
                jumpBtn.style.transform = '';
            };
            jumpBtn.addEventListener('touchstart', jumpStart, { passive: false });
            jumpBtn.addEventListener('touchend', jumpEnd, { passive: false });
            jumpBtn.addEventListener('touchcancel', jumpEnd, { passive: false });
            jumpBtn.addEventListener('mousedown', jumpStart);
            jumpBtn.addEventListener('mouseup', jumpEnd);
            jumpBtn.addEventListener('mouseleave', jumpEnd);
        }

        if (runBtn) {
            const runStart = (e) => {
                e.preventDefault();
                this.run = true;
                this.fire = true;
                this.firePressed = true;
                runBtn.style.background = 'rgba(230, 0, 18, 0.6)';
                runBtn.style.transform = 'scale(0.9)';
            };
            const runEnd = (e) => {
                e.preventDefault();
                this.run = false;
                this.fire = false;
                runBtn.style.background = '';
                runBtn.style.transform = '';
            };
            runBtn.addEventListener('touchstart', runStart, { passive: false });
            runBtn.addEventListener('touchend', runEnd, { passive: false });
            runBtn.addEventListener('touchcancel', runEnd, { passive: false });
            runBtn.addEventListener('mousedown', runStart);
            runBtn.addEventListener('mouseup', runEnd);
            runBtn.addEventListener('mouseleave', runEnd);
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.pausePressed = true;
            }, { passive: false });
            pauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.pausePressed = true;
            });
        }

        // Swipe kontrolleri
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.dpad-btn') || e.target.closest('.action-btn')) return;

            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (e.target.closest('.dpad-btn') || e.target.closest('.action-btn')) return;

            const touch = e.changedTouches[0];
            const dx = touch.clientX - touchStartX;
            const dy = touch.clientY - touchStartY;
            const dt = Date.now() - touchStartTime;

            if (Math.abs(dy) > 50 && dy < 0 && dt < 300) {
                this.jump = true;
                this.jumpPressed = true;
                setTimeout(() => { this.jump = false; }, 100);
            }

            if (Math.abs(dx) > 30) {
                if (dx > 0) {
                    this.right = true;
                    setTimeout(() => { this.right = false; }, 150);
                } else {
                    this.left = true;
                    setTimeout(() => { this.left = false; }, 150);
                }
            }
        }, { passive: true });
    }

    updateState() {
        this.left = this.keys['ArrowLeft'] || this.keys['KeyA'];
        this.right = this.keys['ArrowRight'] || this.keys['KeyD'];
        this.up = this.keys['ArrowUp'] || this.keys['KeyW'];
        this.down = this.keys['ArrowDown'] || this.keys['KeyS'];

        const jumpKey = this.keys['ArrowUp'] || this.keys['KeyW'] || this.keys['Space'];
        this.jump = jumpKey;

        this.run = this.keys['KeyZ'] || this.keys['ShiftLeft'] || this.keys['ShiftRight'];
        this.fire = this.keys['KeyX'];
        this.pause = this.keys['KeyP'] || this.keys['Escape'];
        this.start = this.keys['Enter'];
    }

    update() {
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
