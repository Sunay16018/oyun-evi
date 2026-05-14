// Parçacıklar (Efektler)

class Particle {
    constructor(x, y, type, options = {}) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = options.width || 8;
        this.height = options.height || 8;
        this.velocityX = options.velocityX || (Math.random() - 0.5) * 6;
        this.velocityY = options.velocityY || -Math.random() * 6 - 2;
        this.life = options.life || 60;
        this.maxLife = this.life;
        this.active = true;
        this.gravity = options.gravity !== undefined ? options.gravity : 0.3;
        this.color = options.color || '#fff';
        this.size = options.size || 4;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    }

    update(dt) {
        if (!this.active) return;

        this.life -= dt;
        if (this.life <= 0) {
            this.active = false;
            return;
        }

        this.velocityY += this.gravity;
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;
        this.rotation += this.rotationSpeed * dt;
    }

    draw(ctx, cameraX) {
        if (!this.active) return;

        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(this.x - cameraX + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        switch (this.type) {
            case 'brick':
                const brickSprite = spriteManager.get('particle_brick');
                if (brickSprite) {
                    ctx.drawImage(brickSprite, -this.width / 2, -this.height / 2);
                }
                break;
            case 'coin':
                const coinSprite = spriteManager.get('particle_coin');
                if (coinSprite) {
                    ctx.drawImage(coinSprite, -this.width / 2, -this.height / 2);
                }
                break;
            case 'fire':
                const fireSprite = spriteManager.get('particle_fire');
                if (fireSprite) {
                    ctx.drawImage(fireSprite, -this.width / 2, -this.height / 2);
                }
                break;
            case 'sparkle':
                const sparkleSprite = spriteManager.get('particle_sparkle');
                if (sparkleSprite) {
                    ctx.drawImage(sparkleSprite, -this.width / 2, -this.height / 2);
                }
                break;
            case 'text':
                ctx.fillStyle = this.color;
                ctx.font = `bold ${this.size}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.text || '', 0, 0);
                break;
            case 'circle':
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(0, 0, this.size * alpha, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'rect':
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
                break;
        }

        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    add(particle) {
        this.particles.push(particle);
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(dt);
            if (!this.particles[i].active) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx, cameraX) {
        this.particles.forEach(p => p.draw(ctx, cameraX));
    }

    clear() {
        this.particles = [];
    }

    // Önceden tanımlı efektler
    createBrickExplosion(x, y) {
        for (let i = 0; i < 4; i++) {
            this.add(new Particle(x + (i % 2) * 16, y + Math.floor(i / 2) * 16, 'brick', {
                velocityX: (Math.random() - 0.5) * 8,
                velocityY: -Math.random() * 8 - 2,
                life: 60
            }));
        }
    }

    createCoinSparkle(x, y) {
        for (let i = 0; i < 6; i++) {
            this.add(new Particle(x + 16, y + 16, 'sparkle', {
                velocityX: (Math.random() - 0.5) * 4,
                velocityY: (Math.random() - 0.5) * 4,
                life: 30
            }));
        }
    }

    createScorePopup(x, y, score) {
        this.add(new Particle(x, y, 'text', {
            velocityY: -2,
            life: 60,
            color: '#fff',
            size: 14,
            text: score.toString(),
            gravity: 0
        }));
    }

    createFireExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            this.add(new Particle(x, y, 'fire', {
                velocityX: (Math.random() - 0.5) * 6,
                velocityY: (Math.random() - 0.5) * 6,
                life: 20
            }));
        }
    }

    createDust(x, y) {
        for (let i = 0; i < 3; i++) {
            this.add(new Particle(x, y, 'circle', {
                velocityX: (Math.random() - 0.5) * 2,
                velocityY: -Math.random() * 2,
                life: 20,
                color: '#ccc',
                size: 3,
                gravity: 0.1
            }));
        }
    }

    createStarTrail(x, y) {
        this.add(new Particle(x, y, 'circle', {
            velocityX: (Math.random() - 0.5) * 2,
            velocityY: (Math.random() - 0.5) * 2,
            life: 15,
            color: '#ffd700',
            size: 4,
            gravity: 0
        }));
    }

    createPowerUpEffect(x, y) {
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            this.add(new Particle(x, y, 'circle', {
                velocityX: Math.cos(angle) * 4,
                velocityY: Math.sin(angle) * 4,
                life: 40,
                color: '#ffd700',
                size: 3,
                gravity: 0
            }));
        }
    }
}
