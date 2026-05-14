// Ana Oyun Motoru

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = GAME_STATE.START;

        this.mario = new Mario(64, 400);
        this.level = new Level();
        this.camera = new Camera();
        this.input = new Input();
        this.audio = new AudioManager();
        this.particles = new ParticleSystem();

        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.world = 1;
        this.levelNum = 1;
        this.time = 400;
        this.timeTimer = 0;

        this.blockBumps = [];
        this.coinBounces = [];

        this.lastTime = 0;
        this.accumulator = 0;
        this.dt = 1;

        this.ui = {
            score: document.getElementById('score'),
            coins: document.getElementById('coins'),
            world: document.getElementById('world'),
            time: document.getElementById('time'),
            lives: document.getElementById('lives')
        };

        this.screens = {
            start: document.getElementById('start-screen'),
            pause: document.getElementById('pause-screen'),
            gameOver: document.getElementById('game-over-screen'),
            levelComplete: document.getElementById('level-complete-screen')
        };

        this.init();
    }

    init() {
        spriteManager.init();
        this.audio.init();
        this.level.loadLevel(1);
        this.camera.setBounds(0, this.level.width * TILE_SIZE - CANVAS_WIDTH);

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.accumulator += deltaTime;

        while (this.accumulator >= 16.67) {
            this.update(1);
            this.accumulator -= 16.67;
        }

        this.draw();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        this.input.update();

        switch (this.state) {
            case GAME_STATE.START:
                this.updateStartScreen();
                break;
            case GAME_STATE.PLAYING:
                this.updatePlaying(dt);
                break;
            case GAME_STATE.PAUSED:
                this.updatePaused();
                break;
            case GAME_STATE.GAME_OVER:
                this.updateGameOver();
                break;
            case GAME_STATE.LEVEL_COMPLETE:
                this.updateLevelComplete();
                break;
        }

        this.updateUI();
    }

    updateStartScreen() {
        if (this.input.startPressed) {
            this.startGame();
        }
    }

    updatePlaying(dt) {
        // Duraklatma
        if (this.input.pausePressed) {
            this.pauseGame();
            return;
        }

        // Zaman sayacı
        this.timeTimer += dt;
        if (this.timeTimer > 60) {
            this.timeTimer = 0;
            this.time--;
            if (this.time <= 0) {
                this.mario.die();
            }
        }

        // Mario güncelle
        this.mario.update(this.input, this.level.data, dt);

        // Kamera güncelle
        this.camera.update(this.mario, this.level.width * TILE_SIZE);

        // Düşmanları güncelle
        this.level.enemies.forEach(enemy => {
            enemy.update(this.level.data, dt);

            // Mario ile çarpışma
            if (enemy.active && !enemy.dead) {
                this.checkEnemyCollision(enemy);
            }

            // Ateş topu ile çarpışma
            this.mario.fireballs.forEach(fb => {
                if (fb.active && enemy.active && !enemy.dead) {
                    if (rectIntersect(fb, enemy.getHitbox())) {
                        enemy.kill();
                        fb.active = false;
                        this.particles.createFireExplosion(enemy.x + 16, enemy.y + 16);
                    }
                }
            });

            // Kabuk ile çarpışma
            if (enemy.type === ENEMY_TYPE.KOOPA_SHELL && enemy.shellMoving) {
                this.level.enemies.forEach(other => {
                    if (other !== enemy && other.active && !other.dead) {
                        if (rectIntersect(enemy.getHitbox(), other.getHitbox())) {
                            other.shellKill();
                            this.particles.createFireExplosion(other.x + 16, other.y + 16);
                        }
                    }
                });
            }
        });

        // Eşyaları güncelle
        this.level.items.forEach(item => {
            item.update(this.level.data, dt);

            // Mario ile çarpışma
            if (item.active && !item.collected) {
                if (rectIntersect(this.mario.getHitbox(), item.getHitbox())) {
                    item.collect(this.mario);
                }
            }
        });

        // Parçacıkları güncelle
        this.particles.update(dt);

        // Blok sallanmalarını güncelle
        this.updateBlockBumps(dt);

        // Coin zıplamalarını güncelle
        this.updateCoinBounces(dt);

        // Ölüm kontrolü
        if (this.mario.dead && this.mario.deadTimer > 120) {
            this.handleDeath();
        }

        // Bayrak kontrolü
        this.checkFlagCollision();

        // Yıldız gücü trail efekti
        if (this.mario.starPower && Math.random() < 0.3) {
            this.particles.createStarTrail(
                this.mario.x + Math.random() * this.mario.width,
                this.mario.y + Math.random() * this.mario.height
            );
        }
    }

    updatePaused() {
        if (this.input.pausePressed) {
            this.resumeGame();
        }
    }

    updateGameOver() {
        if (this.input.startPressed) {
            this.restartGame();
        }
    }

    updateLevelComplete() {
        if (this.input.startPressed) {
            this.nextLevel();
        }
    }

    checkEnemyCollision(enemy) {
        const marioBox = this.mario.getHitbox();
        const enemyBox = enemy.getHitbox();

        if (!rectIntersect(marioBox, enemyBox)) return;

        // Yıldız gücü aktifse
        if (this.mario.starPower) {
            enemy.kill();
            this.particles.createFireExplosion(enemy.x + 16, enemy.y + 16);
            return;
        }

        // Dokunulmazlık
        if (this.mario.invincible) return;

        // Üstten ezme
        if (this.mario.velocityY > 0 && marioBox.y + marioBox.height < enemyBox.y + enemyBox.height / 2) {
            enemy.stomp();
            this.mario.velocityY = BOUNCE_FORCE;
            this.particles.createDust(enemy.x + 16, enemy.y);
        } else {
            // Hasar alma
            this.mario.shrink();
            if (this.mario.dead) {
                this.particles.createFireExplosion(this.mario.x + 16, this.mario.y + 16);
            }
        }
    }

    checkFlagCollision() {
        const flagX = this.level.flagX * TILE_SIZE;
        if (this.mario.x + this.mario.width > flagX && !this.mario.poleSlide) {
            this.mario.startPoleSlide(flagX);
            this.addScore(this.time * 50);
            this.audio.playSound('powerup');
        }
    }

    updateBlockBumps(dt) {
        for (let i = this.blockBumps.length - 1; i >= 0; i--) {
            const bump = this.blockBumps[i];
            bump.timer += dt;
            bump.offset = Math.sin(bump.timer * 0.3) * 4;

            if (bump.timer > 20) {
                this.blockBumps.splice(i, 1);
            }
        }
    }

    updateCoinBounces(dt) {
        for (let i = this.coinBounces.length - 1; i >= 0; i--) {
            const coin = this.coinBounces[i];
            coin.timer += dt;
            coin.y -= 3;
            coin.opacity -= 0.03;

            if (coin.timer > 30 || coin.opacity <= 0) {
                this.coinBounces.splice(i, 1);
            }
        }
    }

    draw() {
        // Arkaplan
        this.ctx.fillStyle = COLORS.SKY;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (this.state === GAME_STATE.START) {
            this.drawStartScreen();
            return;
        }

        // Seviye
        this.level.draw(this.ctx, this.camera.x);

        // Blok sallanmaları
        this.blockBumps.forEach(bump => {
            const sprite = spriteManager.get(bump.type === BLOCK_TYPE.BRICK ? 'brick' : 'question');
            if (sprite) {
                this.ctx.drawImage(sprite, bump.x - this.camera.x, bump.y + bump.offset);
            }
        });

        // Coin zıplamaları
        this.coinBounces.forEach(coin => {
            this.ctx.globalAlpha = coin.opacity;
            const sprite = spriteManager.get('coin');
            if (sprite) {
                this.ctx.drawImage(sprite, coin.x - this.camera.x, coin.y);
            }
            this.ctx.globalAlpha = 1;
        });

        // Eşyalar
        this.level.items.forEach(item => item.draw(this.ctx, this.camera.x));

        // Düşmanlar
        this.level.enemies.forEach(enemy => enemy.draw(this.ctx, this.camera.x));

        // Mario
        this.mario.draw(this.ctx, this.camera.x);

        // Parçacıklar
        this.particles.draw(this.ctx, this.camera.x);

        // Duraklatma ekranı
        if (this.state === GAME_STATE.PAUSED) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    }

    drawStartScreen() {
        // Başlangıç ekranı arka planı
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Demo seviye çiz
        this.level.draw(this.ctx, 0);
    }

    startGame() {
        this.state = GAME_STATE.PLAYING;
        this.screens.start.classList.add('hidden');
        this.audio.init();
    }

    pauseGame() {
        this.state = GAME_STATE.PAUSED;
        this.screens.pause.classList.remove('hidden');
    }

    resumeGame() {
        this.state = GAME_STATE.PLAYING;
        this.screens.pause.classList.add('hidden');
    }

    levelComplete() {
        this.state = GAME_STATE.LEVEL_COMPLETE;
        this.screens.levelComplete.classList.remove('hidden');
        this.audio.playSound('powerup');
    }

    nextLevel() {
        this.levelNum++;
        if (this.levelNum > 4) {
            this.world++;
            this.levelNum = 1;
        }

        this.resetLevel();
        this.state = GAME_STATE.PLAYING;
        this.screens.levelComplete.classList.add('hidden');
    }

    handleDeath() {
        this.lives--;
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.resetLevel();
        }
    }

    gameOver() {
        this.state = GAME_STATE.GAME_OVER;
        this.screens.gameOver.classList.remove('hidden');
    }

    restartGame() {
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.world = 1;
        this.levelNum = 1;
        this.resetLevel();
        this.state = GAME_STATE.PLAYING;
        this.screens.gameOver.classList.add('hidden');
    }

    resetLevel() {
        this.time = 400;
        this.timeTimer = 0;
        this.mario.reset(this.level.startX, this.level.startY);
        this.camera.reset();
        this.particles.clear();
        this.blockBumps = [];
        this.coinBounces = [];
        this.level.loadLevel(this.levelNum);
    }

    addScore(points) {
        this.score += points;
        this.particles.createScorePopup(this.mario.x, this.mario.y - 20, points);
    }

    addCoin() {
        this.coins++;
        if (this.coins >= 100) {
            this.coins = 0;
            this.lives++;
            this.audio.playSound('one_up');
        }
    }

    spawnItem(x, y, type) {
        const item = new Item(x, y, type);
        this.level.items.push(item);
    }

    createBrickParticles(x, y) {
        this.particles.createBrickExplosion(x, y);
    }

    createBlockBump(x, y) {
        const blockType = this.level.getBlockAt(x, y);
        this.blockBumps.push({
            x: x,
            y: y,
            timer: 0,
            offset: 0,
            type: blockType
        });

        // Coin çıkarsa
        if (blockType === BLOCK_TYPE.QUESTION) {
            this.coinBounces.push({
                x: x,
                y: y,
                timer: 0,
                opacity: 1
            });
            this.addCoin();
            this.addScore(200);
        }
    }

    updateUI() {
        this.ui.score.textContent = formatNumber(this.score, 6);
        this.ui.coins.textContent = formatNumber(this.coins, 2);
        this.ui.world.textContent = `${this.world}-${this.levelNum}`;
        this.ui.time.textContent = formatNumber(Math.max(0, this.time), 3);
        this.ui.lives.textContent = this.lives;
    }
}

// Global game instance
let game;
