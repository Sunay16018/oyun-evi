// Sprite Yöneticisi - Tüm görselleri canvas üzerinde çizer

class SpriteManager {
    constructor() {
        this.sprites = {};
        this.initialized = false;
    }

    init() {
        this.createMarioSprites();
        this.createEnemySprites();
        this.createItemSprites();
        this.createBlockSprites();
        this.createBackgroundSprites();
        this.createParticleSprites();
        this.initialized = true;
    }

    // Mario Spriteleri
    createMarioSprites() {
        const sizes = [
            { name: 'small', width: 32, height: 32 },
            { name: 'big', width: 32, height: 64 },
            { name: 'fire', width: 32, height: 64 }
        ];

        const states = ['idle', 'run1', 'run2', 'run3', 'jump', 'skid', 'climb'];

        sizes.forEach(size => {
            states.forEach(state => {
                const key = `mario_${size.name}_${state}`;
                this.sprites[key] = this.drawMario(size.name, state);
            });
        });

        // Ölüm sprite'ı
        this.sprites['mario_dead'] = this.drawMarioDead();
    }

    drawMario(size, state) {
        const canvas = document.createElement('canvas');
        const w = size === 'small' ? 32 : 32;
        const h = size === 'small' ? 32 : 64;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        const colors = {
            hat: '#e60012',
            shirt: '#e60012',
            overalls: '#0044ff',
            skin: '#ffcc99',
            hair: '#4a3000',
            shoes: '#4a3000',
            gloves: '#ffffff',
            fire: '#ff6600'
        };

        if (size === 'small') {
            this.drawSmallMario(ctx, state, colors, w, h);
        } else if (size === 'big') {
            this.drawBigMario(ctx, state, colors, w, h);
        } else {
            this.drawFireMario(ctx, state, colors, w, h);
        }

        return canvas;
    }

    drawSmallMario(ctx, state, colors, w, h) {
        ctx.clearRect(0, 0, w, h);

        // Şapka
        ctx.fillStyle = colors.hat;
        ctx.fillRect(4, 0, 24, 8);
        ctx.fillRect(2, 8, 28, 4);

        // Yüz
        ctx.fillStyle = colors.skin;
        ctx.fillRect(6, 12, 20, 12);

        // Bıyık
        ctx.fillStyle = colors.hair;
        ctx.fillRect(14, 20, 14, 3);

        // Göz
        ctx.fillStyle = '#000';
        ctx.fillRect(16, 14, 3, 3);

        // Vücut (overalls)
        ctx.fillStyle = colors.overalls;
        ctx.fillRect(6, 24, 20, 8);

        // Ayakkabı
        ctx.fillStyle = colors.shoes;
        ctx.fillRect(4, 28, 10, 4);
        ctx.fillRect(18, 28, 10, 4);

        // Kollar
        if (state === 'run1' || state === 'run3') {
            ctx.fillStyle = colors.shirt;
            ctx.fillRect(0, 18, 6, 8);
            ctx.fillRect(26, 18, 6, 8);
        } else {
            ctx.fillStyle = colors.shirt;
            ctx.fillRect(2, 16, 6, 8);
            ctx.fillRect(24, 16, 6, 8);
        }
    }

    drawBigMario(ctx, state, colors, w, h) {
        ctx.clearRect(0, 0, w, h);

        // Şapka
        ctx.fillStyle = colors.hat;
        ctx.fillRect(4, 0, 24, 8);
        ctx.fillRect(2, 8, 28, 4);

        // Yüz
        ctx.fillStyle = colors.skin;
        ctx.fillRect(6, 12, 20, 14);

        // Bıyık
        ctx.fillStyle = colors.hair;
        ctx.fillRect(14, 22, 14, 3);

        // Göz
        ctx.fillStyle = '#000';
        ctx.fillRect(16, 16, 3, 3);

        // Gömlek
        ctx.fillStyle = colors.shirt;
        ctx.fillRect(4, 26, 24, 10);

        // Overalls
        ctx.fillStyle = colors.overalls;
        ctx.fillRect(6, 36, 20, 20);

        // Düğmeler
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(12, 38, 3, 3);
        ctx.fillRect(18, 38, 3, 3);

        // Ayakkabı
        ctx.fillStyle = colors.shoes;
        ctx.fillRect(4, 56, 10, 8);
        ctx.fillRect(18, 56, 10, 8);

        // Kollar
        if (state === 'run1' || state === 'run3') {
            ctx.fillStyle = colors.shirt;
            ctx.fillRect(0, 28, 6, 12);
            ctx.fillRect(26, 28, 6, 12);
        } else {
            ctx.fillStyle = colors.shirt;
            ctx.fillRect(2, 26, 6, 12);
            ctx.fillRect(24, 26, 6, 12);
        }
    }

    drawFireMario(ctx, state, colors, w, h) {
        ctx.clearRect(0, 0, w, h);

        // Şapka (beyaz)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(4, 0, 24, 8);
        ctx.fillRect(2, 8, 28, 4);

        // Yüz
        ctx.fillStyle = colors.skin;
        ctx.fillRect(6, 12, 20, 14);

        // Bıyık
        ctx.fillStyle = colors.hair;
        ctx.fillRect(14, 22, 14, 3);

        // Göz
        ctx.fillStyle = '#000';
        ctx.fillRect(16, 16, 3, 3);

        // Gömlek (beyaz)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(4, 26, 24, 10);

        // Overalls (kırmızı)
        ctx.fillStyle = colors.hat;
        ctx.fillRect(6, 36, 20, 20);

        // Düğmeler
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(12, 38, 3, 3);
        ctx.fillRect(18, 38, 3, 3);

        // Ayakkabı
        ctx.fillStyle = colors.shoes;
        ctx.fillRect(4, 56, 10, 8);
        ctx.fillRect(18, 56, 10, 8);

        // Kollar
        if (state === 'run1' || state === 'run3') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 28, 6, 12);
            ctx.fillRect(26, 28, 6, 12);
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(2, 26, 6, 12);
            ctx.fillRect(24, 26, 6, 12);
        }
    }

    drawMarioDead() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#e60012';
        ctx.fillRect(8, 4, 16, 8);
        ctx.fillRect(6, 12, 20, 8);
        ctx.fillRect(8, 20, 16, 8);
        ctx.fillRect(10, 28, 12, 4);

        return canvas;
    }

    // Düşman Spriteleri
    createEnemySprites() {
        this.sprites['goomba'] = this.drawGoomba();
        this.sprites['goomba_flat'] = this.drawGoombaFlat();
        this.sprites['koopa'] = this.drawKoopa();
        this.sprites['koopa_shell'] = this.drawKoopaShell();
        this.sprites['koopa_shell_moving'] = this.drawKoopaShellMoving();
        this.sprites['piranha_plant'] = this.drawPiranhaPlant();
    }

    drawGoomba() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        // Vücut
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(4, 8, 24, 20);

        // Ayaklar
        ctx.fillStyle = '#000';
        ctx.fillRect(4, 28, 8, 4);
        ctx.fillRect(20, 28, 8, 4);

        // Kaşlar
        ctx.fillStyle = '#000';
        ctx.fillRect(6, 6, 8, 4);
        ctx.fillRect(18, 6, 8, 4);

        // Gözler
        ctx.fillStyle = '#fff';
        ctx.fillRect(8, 12, 6, 6);
        ctx.fillRect(18, 12, 6, 6);
        ctx.fillStyle = '#000';
        ctx.fillRect(10, 14, 2, 2);
        ctx.fillRect(20, 14, 2, 2);

        return canvas;
    }

    drawGoombaFlat() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#8b4513';
        ctx.fillRect(4, 26, 24, 4);
        ctx.fillStyle = '#000';
        ctx.fillRect(6, 28, 6, 4);
        ctx.fillRect(20, 28, 6, 4);

        return canvas;
    }

    drawKoopa() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');

        // Kabuk
        ctx.fillStyle = '#00a800';
        ctx.fillRect(6, 16, 20, 24);
        ctx.fillStyle = '#008400';
        ctx.fillRect(8, 18, 16, 20);

        // Kafa
        ctx.fillStyle = '#00a800';
        ctx.fillRect(8, 4, 16, 14);
        ctx.fillStyle = '#ffcc99';
        ctx.fillRect(10, 8, 12, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(12, 10, 2, 2);
        ctx.fillRect(18, 10, 2, 2);

        // Ayaklar
        ctx.fillStyle = '#00a800';
        ctx.fillRect(6, 40, 8, 8);
        ctx.fillRect(18, 40, 8, 8);

        return canvas;
    }

    drawKoopaShell() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#00a800';
        ctx.fillRect(4, 4, 24, 24);
        ctx.fillStyle = '#008400';
        ctx.fillRect(6, 6, 20, 20);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(12, 12, 8, 8);

        return canvas;
    }

    drawKoopaShellMoving() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#00a800';
        ctx.fillRect(4, 4, 24, 24);
        ctx.fillStyle = '#008400';
        ctx.fillRect(6, 6, 20, 20);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(12, 12, 8, 8);

        // Hareket çizgileri
        ctx.fillStyle = '#000';
        ctx.fillRect(8, 8, 2, 2);
        ctx.fillRect(22, 8, 2, 2);
        ctx.fillRect(8, 22, 2, 2);
        ctx.fillRect(22, 22, 2, 2);

        return canvas;
    }

    drawPiranhaPlant() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');

        // Gövde
        ctx.fillStyle = '#00a800';
        ctx.fillRect(10, 16, 12, 32);

        // Ağız
        ctx.fillStyle = '#e60012';
        ctx.fillRect(6, 4, 20, 16);
        ctx.fillStyle = '#fff';
        ctx.fillRect(8, 6, 16, 4);
        ctx.fillStyle = '#000';
        ctx.fillRect(12, 10, 4, 4);
        ctx.fillRect(18, 10, 4, 4);

        // Dişler
        ctx.fillStyle = '#fff';
        ctx.fillRect(8, 16, 4, 4);
        ctx.fillRect(20, 16, 4, 4);

        return canvas;
    }

    // Eşya Spriteleri
    createItemSprites() {
        this.sprites['coin'] = this.drawCoin();
        this.sprites['coin_spin1'] = this.drawCoinSpin1();
        this.sprites['coin_spin2'] = this.drawCoinSpin2();
        this.sprites['mushroom'] = this.drawMushroom();
        this.sprites['fire_flower'] = this.drawFireFlower();
        this.sprites['star'] = this.drawStar();
        this.sprites['one_up'] = this.drawOneUp();
    }

    drawCoin() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(16, 16, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffed4a';
        ctx.beginPath();
        ctx.arc(16, 16, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 16, 17);

        return canvas;
    }

    drawCoinSpin1() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffd700';
        ctx.fillRect(10, 4, 12, 24);
        ctx.fillStyle = '#ffed4a';
        ctx.fillRect(12, 6, 8, 20);

        return canvas;
    }

    drawCoinSpin2() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffd700';
        ctx.fillRect(14, 4, 4, 24);

        return canvas;
    }

    drawMushroom() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        // Şapka
        ctx.fillStyle = '#e60012';
        ctx.beginPath();
        ctx.arc(16, 14, 14, Math.PI, 0);
        ctx.fill();

        // Beyaz noktalar
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(10, 10, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(22, 10, 4, 0, Math.PI * 2);
        ctx.fill();

        // Gövde
        ctx.fillStyle = '#ffcc99';
        ctx.fillRect(10, 16, 12, 14);

        // Gözler
        ctx.fillStyle = '#000';
        ctx.fillRect(12, 20, 2, 4);
        ctx.fillRect(18, 20, 2, 4);

        return canvas;
    }

    drawFireFlower() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        // Gövde
        ctx.fillStyle = '#00a800';
        ctx.fillRect(14, 16, 4, 16);

        // Yapraklar
        ctx.fillStyle = '#00a800';
        ctx.fillRect(8, 20, 6, 4);
        ctx.fillRect(18, 20, 6, 4);

        // Çiçek
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(8, 4, 16, 14);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(12, 8, 8, 6);

        return canvas;
    }

    drawStar() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        const cx = 16, cy = 16;
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
            const x = cx + Math.cos(angle) * 14;
            const y = cy + Math.sin(angle) * 14;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffed4a';
        ctx.beginPath();
        ctx.arc(16, 16, 6, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    drawOneUp() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        // Şapka (yeşil)
        ctx.fillStyle = '#00a800';
        ctx.beginPath();
        ctx.arc(16, 14, 14, Math.PI, 0);
        ctx.fill();

        // Beyaz noktalar
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(10, 10, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(22, 10, 4, 0, Math.PI * 2);
        ctx.fill();

        // Gövde
        ctx.fillStyle = '#ffcc99';
        ctx.fillRect(10, 16, 12, 14);

        // Gözler
        ctx.fillStyle = '#000';
        ctx.fillRect(12, 20, 2, 4);
        ctx.fillRect(18, 20, 2, 4);

        return canvas;
    }

    // Blok Spriteleri
    createBlockSprites() {
        this.sprites['ground'] = this.drawGround();
        this.sprites['brick'] = this.drawBrick();
        this.sprites['question'] = this.drawQuestion();
        this.sprites['question_hit'] = this.drawQuestionHit();
        this.sprites['pipe_top_left'] = this.drawPipeTopLeft();
        this.sprites['pipe_top_right'] = this.drawPipeTopRight();
        this.sprites['pipe_body_left'] = this.drawPipeBodyLeft();
        this.sprites['pipe_body_right'] = this.drawPipeBodyRight();
        this.sprites['hard_block'] = this.drawHardBlock();
        this.sprites['flag_pole'] = this.drawFlagPole();
        this.sprites['flag_top'] = this.drawFlagTop();
        this.sprites['castle_brick'] = this.drawCastleBrick();
        this.sprites['castle_door'] = this.drawCastleDoor();
        this.sprites['invisible'] = this.drawInvisible();
    }

    drawGround() {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');

        // Üst kısım
        ctx.fillStyle = '#e69c24';
        ctx.fillRect(0, 0, TILE_SIZE, 8);
        ctx.fillStyle = '#ffcc66';
        ctx.fillRect(0, 0, TILE_SIZE, 2);

        // Desen
        ctx.fillStyle = '#c84c0c';
        ctx.fillRect(0, 8, TILE_SIZE, TILE_SIZE - 8);

        // Tuğla deseni
        ctx.fillStyle = '#a03000';
        for (let y = 8; y < TILE_SIZE; y += 8) {
            ctx.fillRect(0, y, TILE_SIZE, 1);
        }
        for (let x = 0; x < TILE_SIZE; x += 16) {
            ctx.fillRect(x, 8, 1, TILE_SIZE - 8);
        }

        return canvas;
    }

    drawBrick() {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#b83800';
        ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

        // Tuğla deseni
        ctx.fillStyle = '#ff9c00';
        ctx.fillRect(0, 0, TILE_SIZE, 2);
        ctx.fillRect(0, 0, 2, TILE_SIZE);

        ctx.fillStyle = '#8a2800';
        ctx.fillRect(0, 14, TILE_SIZE, 2);
        ctx.fillRect(14, 0, 2, 14);
        ctx.fillRect(0, 30, TILE_SIZE, 2);
        ctx.fillRect(30, 16, 2, 14);

        return canvas;
    }

    drawQuestion() {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#fc9c00';
        ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

        // Köşeler
        ctx.fillStyle = '#d87800';
        ctx.fillRect(0, 0, 4, 4);
        ctx.fillRect(TILE_SIZE - 4, 0, 4, 4);
        ctx.fillRect(0, TILE_SIZE - 4, 4, 4);
        ctx.fillRect(TILE_SIZE - 4, TILE_SIZE - 4, 4, 4);

        // Soru işareti
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', TILE_SIZE / 2, TILE_SIZE / 2);

        // Parıltı noktaları
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(4, 4, 3, 3);
        ctx.fillRect(TILE_SIZE - 7, 4, 3, 3);

        return canvas;
    }

    drawQuestionHit() {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#8a6a00';
        ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

        ctx.fillStyle = '#6a4a00';
        ctx.fillRect(0, 0, 4, 4);
        ctx.fillRect(TILE_SIZE - 4, 0, 4, 4);
        ctx.fillRect(0, TILE_SIZE - 4, 4, 4);
        ctx.fillRect(TILE_SIZE - 4, TILE_SIZE - 4, 4, 4);

        return canvas;
    }

    drawPipeTopLeft() {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#00a800';
        ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#00d800';
        ctx.fillRect(2, 2, TILE_SIZE - 4, 8);
        ctx.fillStyle = '#008400';
        ctx.fillRect(0, 12, TILE_SIZE, TILE_SIZE - 12);
        ctx.fillStyle = '#006400';
        ctx.fillRect(TILE_SIZE - 4, 12, 4, TILE_SIZE - 12);

        return canvas;
    }

    drawPipeTopRight() {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#00a800';
        ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#00d800';
        ctx.fillRect(0, 2, TILE_SIZE - 2, 8);
        ctx.fillStyle = '#008400';
        ctx.fillRect(0, 12, TILE_SIZE, TILE_SIZE - 12);
        ctx.fillStyle = '#006400';
        ctx.fillRect(0, 12, 4, TILE_SIZE - 12);

        return canvas;
    }

    drawPipeBodyLeft() {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#008400';
        ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#00a800';
        ctx.fillRect(2, 0, TILE_SIZE - 6, TILE_SIZE);
        ctx.fillStyle = '#006400';
        ctx.fillRect(TILE_SIZE - 4, 0, 4, TILE_SIZE);

        return canvas;
    }

    drawPipeBodyRight() {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#008400';
        ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#00a800';
        ctx.fillRect(4, 0, TILE_SIZE - 6, TILE_SIZE);
        ctx.fillStyle = '#006400';
        ctx.fillRect(0, 0, 4, TILE_SIZE);

        return canvas;
    }

    drawHardBlock() {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#fc9c00';
        ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#ffcc66';
        ctx.fillRect(0, 0, TILE_SIZE, 2);
        ctx.fillRect(0, 0, 2, TILE_SIZE);
        ctx.fillStyle = '#d87800';
        ctx.fillRect(TILE_SIZE - 2, 0, 2, TILE_SIZE);
        ctx.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2);

        return canvas;
    }

    drawFlagPole() {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#fff';
        ctx.fillRect(14, 0, 4, TILE_SIZE);
        ctx.fillStyle = '#ccc';
        ctx.fillRect(14, 0, 2, TILE_SIZE);

        return canvas;
    }

    drawFlagTop() {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#e60012';
        ctx.fillRect(14, 0, 4, 4);

        return canvas;
    }

    drawCastleBrick() {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#b83800';
        ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#8a2800';
        ctx.fillRect(0, 0, TILE_SIZE, 2);
        ctx.fillRect(0, 0, 2, TILE_SIZE);
        ctx.fillStyle = '#d06000';
        ctx.fillRect(TILE_SIZE - 2, 0, 2, TILE_SIZE);
        ctx.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2);

        return canvas;
    }

    drawCastleDoor() {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#444';
        ctx.fillRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4);
        ctx.fillStyle = '#222';
        ctx.fillRect(4, 4, TILE_SIZE - 8, TILE_SIZE - 8);

        return canvas;
    }

    drawInvisible() {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, TILE_SIZE, TILE_SIZE);

        return canvas;
    }

    // Arka Plan Spriteleri
    createBackgroundSprites() {
        this.sprites['cloud'] = this.drawCloud();
        this.sprites['bush'] = this.drawBush();
        this.sprites['hill'] = this.drawHill();
    }

    drawCloud() {
        const canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#fff';
        // Bulut şekilleri
        ctx.beginPath();
        ctx.arc(24, 24, 16, 0, Math.PI * 2);
        ctx.arc(48, 20, 20, 0, Math.PI * 2);
        ctx.arc(72, 24, 16, 0, Math.PI * 2);
        ctx.arc(48, 32, 14, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    drawBush() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#00a800';
        ctx.beginPath();
        ctx.arc(16, 28, 14, 0, Math.PI * 2);
        ctx.arc(32, 24, 18, 0, Math.PI * 2);
        ctx.arc(48, 28, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#00d800';
        ctx.beginPath();
        ctx.arc(16, 26, 10, 0, Math.PI * 2);
        ctx.arc(32, 22, 12, 0, Math.PI * 2);
        ctx.arc(48, 26, 10, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    drawHill() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#00a800';
        ctx.beginPath();
        ctx.moveTo(0, 64);
        ctx.quadraticCurveTo(64, 0, 128, 64);
        ctx.fill();

        ctx.fillStyle = '#00d800';
        ctx.beginPath();
        ctx.moveTo(10, 64);
        ctx.quadraticCurveTo(64, 10, 118, 64);
        ctx.fill();

        return canvas;
    }

    // Parçacık Spriteleri
    createParticleSprites() {
        this.sprites['particle_brick'] = this.drawBrickParticle();
        this.sprites['particle_coin'] = this.drawCoinParticle();
        this.sprites['particle_fire'] = this.drawFireParticle();
        this.sprites['particle_sparkle'] = this.drawSparkleParticle();
    }

    drawBrickParticle() {
        const canvas = document.createElement('canvas');
        canvas.width = 8;
        canvas.height = 8;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#b83800';
        ctx.fillRect(0, 0, 8, 8);
        ctx.fillStyle = '#ff9c00';
        ctx.fillRect(0, 0, 8, 2);
        ctx.fillRect(0, 0, 2, 8);

        return canvas;
    }

    drawCoinParticle() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(8, 8, 6, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    drawFireParticle() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.arc(8, 8, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(8, 8, 3, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    drawSparkleParticle() {
        const canvas = document.createElement('canvas');
        canvas.width = 8;
        canvas.height = 8;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#fff';
        ctx.fillRect(3, 0, 2, 8);
        ctx.fillRect(0, 3, 8, 2);

        return canvas;
    }

    // Sprite al
    get(name) {
        return this.sprites[name] || null;
    }

    // Mario sprite'ını al (durum ve boyuta göre)
    getMarioSprite(size, state, direction) {
        const sizeName = size === MARIO_STATE.SMALL ? 'small' : 
                        size === MARIO_STATE.BIG ? 'big' : 'fire';
        const key = `mario_${sizeName}_${state}`;
        const sprite = this.sprites[key];

        if (!sprite) return null;

        // Yön ters ise flip yap
        if (direction === DIRECTION.LEFT) {
            const flipped = document.createElement('canvas');
            flipped.width = sprite.width;
            flipped.height = sprite.height;
            const ctx = flipped.getContext('2d');
            ctx.translate(flipped.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, 0, 0);
            return flipped;
        }

        return sprite;
    }

    // Animasyonlu coin sprite'ı
    getCoinSprite(frame) {
        const frames = ['coin', 'coin_spin1', 'coin_spin2', 'coin_spin1'];
        return this.sprites[frames[frame % 4]];
    }
}

// Global sprite manager
const spriteManager = new SpriteManager();
