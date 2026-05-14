// Düşmanlar

class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 32;
        this.height = type === ENEMY_TYPE.KOOPA ? 48 : 32;
        this.velocityX = -1;
        this.velocityY = 0;
        this.onGround = false;
        this.direction = DIRECTION.LEFT;
        this.active = true;
        this.dead = false;
        this.deadTimer = 0;
        this.animFrame = 0;
        this.animTimer = 0;
        this.shellMoving = false;
        this.shellSpeed = 0;
        this.piranhaTimer = 0;
        this.piranhaState = 0; // 0: in, 1: out
        this.piranhaY = 0;
        this.flyY = 0;
        this.flyDirection = 1;
        this.flyTimer = 0;
    }

    getHitbox() {
        return {
            x: this.x + 2,
            y: this.y + 2,
            width: this.width - 4,
            height: this.height - 4
        };
    }

    update(level, dt) {
        if (!this.active || this.dead) {
            if (this.dead) {
                this.deadTimer += dt;
                if (this.deadTimer > 30) {
                    this.active = false;
                }
            }
            return;
        }

        switch (this.type) {
            case ENEMY_TYPE.GOOMBA:
                this.updateGoomba(level, dt);
                break;
            case ENEMY_TYPE.KOOPA:
                this.updateKoopa(level, dt);
                break;
            case ENEMY_TYPE.KOOPA_SHELL:
                this.updateShell(level, dt);
                break;
            case ENEMY_TYPE.PIRANHA_PLANT:
                this.updatePiranha(level, dt);
                break;
            case ENEMY_TYPE.FLYING_KOOPA:
                this.updateFlyingKoopa(level, dt);
                break;
        }
    }

    updateGoomba(level, dt) {
        physics.applyGravity(this);

        // Yön değiştirme kontrolü
        const tileAhead = getTileAt(
            this.x + (this.direction === DIRECTION.LEFT ? -2 : this.width + 2),
            this.y + this.height / 2,
            level
        );

        if (isSolidBlock(tileAhead)) {
            this.direction *= -1;
            this.velocityX *= -1;
        }

        // Uçurum kontrolü
        const tileBelow = getTileAt(
            this.x + this.width / 2,
            this.y + this.height + 2,
            level
        );

        if (!isSolidBlock(tileBelow) && this.onGround) {
            this.direction *= -1;
            this.velocityX *= -1;
        }

        this.x += this.velocityX * dt;
        physics.moveEntity(this, level, dt);

        this.animTimer += dt;
        if (this.animTimer > 15) {
            this.animFrame = (this.animFrame + 1) % 2;
            this.animTimer = 0;
        }
    }

    updateKoopa(level, dt) {
        physics.applyGravity(this);

        const tileAhead = getTileAt(
            this.x + (this.direction === DIRECTION.LEFT ? -2 : this.width + 2),
            this.y + this.height / 2,
            level
        );

        if (isSolidBlock(tileAhead)) {
            this.direction *= -1;
            this.velocityX *= -1;
        }

        this.x += this.velocityX * dt;
        physics.moveEntity(this, level, dt);
    }

    updateShell(level, dt) {
        if (this.shellMoving) {
            this.x += this.shellSpeed * dt;
            physics.moveEntity(this, level, dt);

            // Duvar çarpması
            const tileAhead = getTileAt(
                this.x + (this.shellSpeed > 0 ? this.width + 2 : -2),
                this.y + this.height / 2,
                level
            );

            if (isSolidBlock(tileAhead)) {
                this.shellSpeed *= -1;
            }
        } else {
            physics.applyGravity(this);
            physics.moveEntity(this, level, dt);
        }
    }

    updatePiranha(level, dt) {
        this.piranhaTimer += dt;

        if (this.piranhaState === 0 && this.piranhaTimer > 120) {
            this.piranhaState = 1;
            this.piranhaTimer = 0;
        } else if (this.piranhaState === 1 && this.piranhaTimer > 120) {
            this.piranhaState = 0;
            this.piranhaTimer = 0;
        }

        if (this.piranhaState === 1) {
            this.piranhaY = Math.min(this.piranhaY + 1, 32);
        } else {
            this.piranhaY = Math.max(this.piranhaY - 1, 0);
        }

        this.y = this.y - this.piranhaY;
    }

    updateFlyingKoopa(level, dt) {
        this.flyTimer += dt;
        this.flyY += this.flyDirection * 0.5;

        if (Math.abs(this.flyY) > 30) {
            this.flyDirection *= -1;
        }

        this.y += this.flyY * 0.1;

        physics.applyGravity(this);
        this.x += this.velocityX * dt;
        physics.moveEntity(this, level, dt);
    }

    // Mario tarafından ezilme
    stomp() {
        if (this.type === ENEMY_TYPE.GOOMBA) {
            this.dead = true;
            this.height = 8;
            game.audio.playSound('stomp');
            game.addScore(100);
        } else if (this.type === ENEMY_TYPE.KOOPA) {
            this.type = ENEMY_TYPE.KOOPA_SHELL;
            this.height = 32;
            this.velocityX = 0;
            game.audio.playSound('stomp');
            game.addScore(100);
        } else if (this.type === ENEMY_TYPE.KOOPA_SHELL) {
            if (!this.shellMoving) {
                this.shellMoving = true;
                this.shellSpeed = 8;
                game.audio.playSound('kick');
            } else {
                this.shellMoving = false;
                this.shellSpeed = 0;
                game.audio.playSound('stomp');
            }
        }
    }

    // Ateş topu veya yıldız gücü ile öldürme
    kill() {
        this.dead = true;
        this.velocityY = -6;
        game.audio.playSound('kick');
        game.addScore(200);
    }

    // Kabuk tarafından öldürülme
    shellKill() {
        this.dead = true;
        this.velocityY = -8;
        this.velocityX = this.direction * 3;
        game.addScore(200);
    }

    draw(ctx, cameraX) {
        if (!this.active) return;

        let spriteName = '';

        switch (this.type) {
            case ENEMY_TYPE.GOOMBA:
                spriteName = this.dead ? 'goomba_flat' : 'goomba';
                break;
            case ENEMY_TYPE.KOOPA:
                spriteName = 'koopa';
                break;
            case ENEMY_TYPE.KOOPA_SHELL:
                spriteName = this.shellMoving ? 'koopa_shell_moving' : 'koopa_shell';
                break;
            case ENEMY_TYPE.PIRANHA_PLANT:
                spriteName = 'piranha_plant';
                break;
            case ENEMY_TYPE.FLYING_KOOPA:
                spriteName = 'koopa';
                break;
        }

        const sprite = spriteManager.get(spriteName);
        if (sprite) {
            ctx.drawImage(sprite, this.x - cameraX, this.y);
        }
    }
}
