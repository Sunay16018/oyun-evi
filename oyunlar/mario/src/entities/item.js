// Eşyalar

class Item {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 32;
        this.height = 32;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.direction = DIRECTION.RIGHT;
        this.active = true;
        this.animFrame = 0;
        this.animTimer = 0;
        this.emerging = true;
        this.emergeY = y;
        this.emergeTargetY = y - TILE_SIZE;
        this.collected = false;
        this.collectTimer = 0;
        this.bounceY = 0;
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
        if (!this.active) return;

        if (this.collected) {
            this.collectTimer += dt;
            this.bounceY -= 2;
            if (this.collectTimer > 30) {
                this.active = false;
            }
            return;
        }

        if (this.emerging) {
            this.y -= 1;
            if (this.y <= this.emergeTargetY) {
                this.emerging = false;
                this.y = this.emergeTargetY;
                if (this.type === ITEM_TYPE.MUSHROOM || this.type === ITEM_TYPE.ONE_UP) {
                    this.velocityX = 1.5;
                } else if (this.type === ITEM_TYPE.STAR) {
                    this.velocityX = 2;
                }
            }
            return;
        }

        this.animTimer += dt;
        if (this.animTimer > 10) {
            this.animFrame = (this.animFrame + 1) % 4;
            this.animTimer = 0;
        }

        if (this.type === ITEM_TYPE.COIN) {
            this.bounceY += this.velocityY * dt;
            this.velocityY += GRAVITY * 0.5;
            if (this.bounceY > 0) {
                this.active = false;
            }
            return;
        }

        if (this.type === ITEM_TYPE.STAR) {
            if (this.onGround) {
                this.velocityY = -10;
                this.onGround = false;
            }
        }

        const tileAhead = getTileAt(
            this.x + (this.velocityX > 0 ? this.width + 2 : -2),
            this.y + this.height / 2,
            level
        );

        if (isSolidBlock(tileAhead)) {
            this.velocityX *= -1;
            this.direction *= -1;
        }

        const tileBelow = getTileAt(
            this.x + this.width / 2,
            this.y + this.height + 2,
            level
        );

        if (!isSolidBlock(tileBelow) && this.onGround && 
            (this.type === ITEM_TYPE.MUSHROOM || this.type === ITEM_TYPE.ONE_UP)) {
            this.velocityX *= -1;
            this.direction *= -1;
        }

        physics.applyGravity(this);
        this.x += this.velocityX * dt;
        physics.moveEntity(this, level, dt);

        if (this.x < 0 || this.x > level[0].length * TILE_SIZE) {
            this.active = false;
        }
    }

    collect(mario) {
        if (this.collected || !this.active) return;

        this.collected = true;
        this.collectTimer = 0;
        this.bounceY = 0;
        this.velocityY = -5;

        switch (this.type) {
            case ITEM_TYPE.COIN:
                game.addCoin();
                game.addScore(200);
                game.audio.playSound('coin');
                break;
            case ITEM_TYPE.MUSHROOM:
                mario.grow();
                game.addScore(1000);
                break;
            case ITEM_TYPE.FIRE_FLOWER:
                mario.getFirePower();
                game.addScore(1000);
                break;
            case ITEM_TYPE.STAR:
                mario.getStar();
                game.addScore(1000);
                break;
            case ITEM_TYPE.ONE_UP:
                mario.getOneUp();
                break;
        }
    }

    draw(ctx, cameraX) {
        if (!this.active) return;

        let spriteName = '';

        switch (this.type) {
            case ITEM_TYPE.COIN:
                const coinSprite = spriteManager.getCoinSprite(this.animFrame);
                if (coinSprite) {
                    ctx.drawImage(coinSprite, this.x - cameraX, this.y + this.bounceY);
                }
                return;
            case ITEM_TYPE.MUSHROOM:
                spriteName = 'mushroom';
                break;
            case ITEM_TYPE.FIRE_FLOWER:
                spriteName = 'fire_flower';
                break;
            case ITEM_TYPE.STAR:
                spriteName = 'star';
                break;
            case ITEM_TYPE.ONE_UP:
                spriteName = 'one_up';
                break;
        }

        const sprite = spriteManager.get(spriteName);
        if (sprite) {
            const drawY = this.collected ? this.y + this.bounceY : this.y;
            ctx.drawImage(sprite, this.x - cameraX, drawY);
        }
    }
}
