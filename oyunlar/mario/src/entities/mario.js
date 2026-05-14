// Mario Karakteri

class Mario {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.onPipe = false;
        this.direction = DIRECTION.RIGHT;
        this.state = MARIO_STATE.SMALL;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.starPower = false;
        this.starTimer = 0;
        this.animFrame = 0;
        this.animTimer = 0;
        this.dead = false;
        this.deadTimer = 0;
        this.type = 'mario';
        this.fireballs = [];
        this.canShoot = false;
        this.shootCooldown = 0;
        this.poleSlide = false;
        this.poleX = 0;
        this.poleY = 0;
        this.enteringPipe = false;
        this.pipeTimer = 0;
        this.climbing = false;
    }

    getHitbox() {
        return {
            x: this.x + 4,
            y: this.y,
            width: this.width - 8,
            height: this.height
        };
    }

    update(input, level, dt) {
        if (this.dead) {
            this.deadTimer += dt;
            this.velocityY += GRAVITY * 0.5;
            this.y += this.velocityY * dt;
            return;
        }

        if (this.poleSlide) {
            this.updatePoleSlide(dt);
            return;
        }

        if (this.enteringPipe) {
            this.updatePipeEntry(dt);
            return;
        }

        if (this.starPower) {
            this.starTimer -= dt;
            if (this.starTimer <= 0) {
                this.starPower = false;
            }
        }

        if (this.invincible) {
            this.invincibleTimer -= dt;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }

        if (this.shootCooldown > 0) {
            this.shootCooldown -= dt;
        }

        if (input.left) {
            this.velocityX -= ACCELERATION;
            this.direction = DIRECTION.LEFT;
        }
        if (input.right) {
            this.velocityX += ACCELERATION;
            this.direction = DIRECTION.RIGHT;
        }

        const maxSpeed = input.run ? MAX_SPEED * 1.5 : MAX_SPEED;
        this.velocityX = clamp(this.velocityX, -maxSpeed, maxSpeed);

        if (input.jump && this.onGround && !this.climbing) {
            this.velocityY = JUMP_FORCE;
            this.onGround = false;
            game.audio.playSound('jump');
        }

        if (input.fire && this.canShoot && this.shootCooldown <= 0 && this.state === MARIO_STATE.FIRE) {
            this.shootFireball();
            this.shootCooldown = 20;
        }

        if (input.down && this.onPipe) {
            this.enterPipe();
        }

        this.updateAnimation(dt);
        physics.applyGravity(this);
        physics.moveEntity(this, level, dt);

        if (physics.checkFallOff(this)) {
            this.die();
        }

        this.updateFireballs(level, dt);
    }

    updateAnimation(dt) {
        this.animTimer += dt;
        if (Math.abs(this.velocityX) > 0.5 && this.onGround) {
            if (this.animTimer > 8) {
                this.animFrame = (this.animFrame + 1) % 3;
                this.animTimer = 0;
            }
        } else {
            this.animFrame = 0;
        }
    }

    getAnimationState() {
        if (this.dead) return 'dead';
        if (!this.onGround) return 'jump';
        if (this.velocityX > 0.5 && this.direction === DIRECTION.LEFT) return 'skid';
        if (this.velocityX < -0.5 && this.direction === DIRECTION.RIGHT) return 'skid';
        if (Math.abs(this.velocityX) > 0.5) {
            return ['run1', 'run2', 'run3'][this.animFrame];
        }
        return 'idle';
    }

    shootFireball() {
        const fireball = {
            x: this.direction === DIRECTION.RIGHT ? this.x + this.width : this.x - 8,
            y: this.y + this.height / 2,
            width: 16,
            height: 16,
            velocityX: this.direction === DIRECTION.RIGHT ? 8 : -8,
            velocityY: 0,
            direction: this.direction,
            active: true,
            type: 'fireball'
        };
        this.fireballs.push(fireball);
        game.audio.playSound('fireball');
    }

    updateFireballs(level, dt) {
        for (let i = this.fireballs.length - 1; i >= 0; i--) {
            const fb = this.fireballs[i];
            physics.updateFireball(fb, level, dt);
            if (!fb.active) {
                this.fireballs.splice(i, 1);
            }
        }
    }

    enterPipe() {
        this.enteringPipe = true;
        this.pipeTimer = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        game.audio.playSound('pipe');
    }

    updatePipeEntry(dt) {
        this.pipeTimer += dt;
        this.y += 2;
        if (this.pipeTimer > 60) {
            this.enteringPipe = false;
        }
    }

    startPoleSlide(poleX) {
        this.poleSlide = true;
        this.poleX = poleX;
        this.poleY = this.y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.x = poleX - this.width / 2;
    }

    updatePoleSlide(dt) {
        this.y += 3;
        if (this.y > CANVAS_HEIGHT - 80) {
            this.poleSlide = false;
            game.levelComplete();
        }
    }

    grow() {
        if (this.state === MARIO_STATE.SMALL) {
            this.state = MARIO_STATE.BIG;
            this.height = 64;
            this.y -= 32;
            game.audio.playSound('powerup');
        }
    }

    shrink() {
        if (this.state === MARIO_STATE.BIG || this.state === MARIO_STATE.FIRE) {
            this.state = MARIO_STATE.SMALL;
            this.height = 32;
            this.invincible = true;
            this.invincibleTimer = 120;
            game.audio.playSound('pipe');
        } else {
            this.die();
        }
    }

    getFirePower() {
        if (this.state === MARIO_STATE.BIG) {
            this.state = MARIO_STATE.FIRE;
            this.canShoot = true;
            game.audio.playSound('powerup');
        } else if (this.state === MARIO_STATE.SMALL) {
            this.grow();
        }
    }

    getStar() {
        this.starPower = true;
        this.starTimer = 600;
        this.invincible = true;
        this.invincibleTimer = 600;
        game.audio.playSound('star');
    }

    getOneUp() {
        game.lives++;
        game.audio.playSound('one_up');
    }

    die() {
        if (this.dead) return;
        this.dead = true;
        this.deadTimer = 0;
        this.velocityY = -10;
        this.velocityX = 0;
        game.audio.playSound('die');
    }

    draw(ctx, cameraX) {
        if (this.dead) {
            const sprite = spriteManager.get('mario_dead');
            if (sprite) {
                ctx.drawImage(sprite, this.x - cameraX, this.y);
            }
            return;
        }

        if (this.invincible && Math.floor(Date.now() / 50) % 2 === 0) {
            return;
        }

        const state = this.getAnimationState();
        const sprite = spriteManager.getMarioSprite(this.state, state, this.direction);
        if (sprite) {
            ctx.drawImage(sprite, this.x - cameraX, this.y);
        }

        this.fireballs.forEach(fb => {
            const fbSprite = spriteManager.get('particle_fire');
            if (fbSprite) {
                ctx.drawImage(fbSprite, fb.x - cameraX, fb.y);
            }
        });
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.direction = DIRECTION.RIGHT;
        this.state = MARIO_STATE.SMALL;
        this.height = 32;
        this.invincible = false;
        this.starPower = false;
        this.dead = false;
        this.fireballs = [];
        this.canShoot = false;
        this.poleSlide = false;
        this.enteringPipe = false;
        this.climbing = false;
    }
}
