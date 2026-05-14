// Fizik Motoru

class Physics {
    constructor() {
        this.gravity = GRAVITY;
        this.friction = FRICTION;
        this.maxFallSpeed = MAX_FALL_SPEED;
    }

    // Entity'ye yerçekimi uygula
    applyGravity(entity) {
        if (!entity.onGround) {
            entity.velocityY += this.gravity;
            if (entity.velocityY > this.maxFallSpeed) {
                entity.velocityY = this.maxFallSpeed;
            }
        }
    }

    // Entity'yi hareket ettir ve çarpışmaları kontrol et
    moveEntity(entity, level, dt = 1) {
        // X ekseninde hareket
        entity.x += entity.velocityX * dt;
        this.checkHorizontalCollisions(entity, level);

        // Y ekseninde hareket
        entity.y += entity.velocityY * dt;
        this.checkVerticalCollisions(entity, level);

        // Sürtünme uygula
        if (entity.onGround) {
            entity.velocityX *= this.friction;
            if (Math.abs(entity.velocityX) < 0.1) {
                entity.velocityX = 0;
            }
        }
    }

    // Yatay çarpışmaları kontrol et
    checkHorizontalCollisions(entity, level) {
        const hitbox = entity.getHitbox();
        const tileY1 = Math.floor(hitbox.y / TILE_SIZE);
        const tileY2 = Math.floor((hitbox.y + hitbox.height - 1) / TILE_SIZE);
        const tileX = entity.velocityX > 0 
            ? Math.floor((hitbox.x + hitbox.width) / TILE_SIZE)
            : Math.floor(hitbox.x / TILE_SIZE);

        for (let ty = tileY1; ty <= tileY2; ty++) {
            if (ty >= 0 && ty < level.length) {
                const block = level[ty][tileX];
                if (isSolidBlock(block)) {
                    if (entity.velocityX > 0) {
                        entity.x = tileX * TILE_SIZE - hitbox.width - (hitbox.x - entity.x);
                    } else {
                        entity.x = (tileX + 1) * TILE_SIZE - (hitbox.x - entity.x);
                    }
                    entity.velocityX = 0;
                    return true;
                }
            }
        }
        return false;
    }

    // Dikey çarpışmaları kontrol et
    checkVerticalCollisions(entity, level) {
        const hitbox = entity.getHitbox();
        const tileX1 = Math.floor(hitbox.x / TILE_SIZE);
        const tileX2 = Math.floor((hitbox.x + hitbox.width - 1) / TILE_SIZE);
        const tileY = entity.velocityY > 0 
            ? Math.floor((hitbox.y + hitbox.height) / TILE_SIZE)
            : Math.floor(hitbox.y / TILE_SIZE);

        for (let tx = tileX1; tx <= tileX2; tx++) {
            if (tileY >= 0 && tileY < level.length) {
                const block = level[tileY][tx];
                if (isSolidBlock(block)) {
                    if (entity.velocityY > 0) {
                        // Yere düştü
                        entity.y = tileY * TILE_SIZE - hitbox.height - (hitbox.y - entity.y);
                        entity.velocityY = 0;
                        entity.onGround = true;

                        // Boru girişi kontrolü
                        if (block === BLOCK_TYPE.PIPE_ENTRANCE && entity.type === 'mario') {
                            entity.onPipe = true;
                        }
                    } else {
                        // Tavan çarpması
                        entity.y = (tileY + 1) * TILE_SIZE - (hitbox.y - entity.y);
                        entity.velocityY = 0;

                        // Blok vurma olayı
                        if (entity.type === 'mario') {
                            this.handleBlockHit(tx, tileY, level, entity);
                        }
                    }
                    return true;
                }
            }
        }

        entity.onGround = false;
        entity.onPipe = false;
        return false;
    }

    // Blok vurma işleyicisi
    handleBlockHit(tx, ty, level, mario) {
        const block = level[ty][tx];

        if (block === BLOCK_TYPE.BRICK) {
            if (mario.state >= MARIO_STATE.BIG) {
                // Büyük Mario tuğlayı kırar
                level[ty][tx] = BLOCK_TYPE.EMPTY;
                game.createBrickParticles(tx * TILE_SIZE, ty * TILE_SIZE);
                game.audio.playSound('break');
            } else {
                // Küçük Mario tuğlayı sallar
                game.createBlockBump(tx * TILE_SIZE, ty * TILE_SIZE);
                game.audio.playSound('bump');
            }
        } else if (block === BLOCK_TYPE.QUESTION) {
            // Soru bloğu eşya çıkarır
            level[ty][tx] = BLOCK_TYPE.QUESTION_HIT;
            game.spawnItem(tx * TILE_SIZE, (ty - 1) * TILE_SIZE, this.getQuestionItem(tx, ty));
            game.createBlockBump(tx * TILE_SIZE, ty * TILE_SIZE);
            game.audio.playSound('coin');
        } else if (block === BLOCK_TYPE.INVISIBLE_BLOCK) {
            // Görünmez blok
            level[ty][tx] = BLOCK_TYPE.HARD_BLOCK;
            game.spawnItem(tx * TILE_SIZE, (ty - 1) * TILE_SIZE, ITEM_TYPE.ONE_UP);
            game.audio.playSound('powerup_appear');
        }
    }

    // Soru bloğundan çıkan eşyayı belirle
    getQuestionItem(tx, ty) {
        // Basit mantık: Bazı pozisyonlarda belirli eşyalar
        const hash = (tx * 7 + ty * 13) % 4;
        switch (hash) {
            case 0: return ITEM_TYPE.COIN;
            case 1: return ITEM_TYPE.MUSHROOM;
            case 2: return ITEM_TYPE.FIRE_FLOWER;
            case 3: return ITEM_TYPE.STAR;
        }
        return ITEM_TYPE.COIN;
    }

    // Entity'ler arası çarpışma
    checkEntityCollision(entity1, entity2) {
        const hb1 = entity1.getHitbox();
        const hb2 = entity2.getHitbox();
        return rectIntersect(hb1, hb2);
    }

    // Entity'nin düşüp düşmediğini kontrol et
    checkFallOff(entity) {
        if (entity.y > CANVAS_HEIGHT + 100) {
            return true;
        }
        return false;
    }

    // Ateş topu fizikleri
    updateFireball(fireball, level, dt) {
        fireball.x += fireball.velocityX * dt;
        fireball.y += fireball.velocityY * dt;

        // Yerçekimi
        fireball.velocityY += this.gravity * 0.5;

        // Zıplama
        const tileY = Math.floor((fireball.y + 16) / TILE_SIZE);
        const tileX = Math.floor((fireball.x + 8) / TILE_SIZE);

        if (tileY >= 0 && tileY < level.length && tileX >= 0 && tileX < level[0].length) {
            if (isSolidBlock(level[tileY][tileX])) {
                fireball.velocityY = -8;
                fireball.y = tileY * TILE_SIZE - 16;
            }
        }

        // Harita sınırları
        if (fireball.x < 0 || fireball.x > level[0].length * TILE_SIZE) {
            fireball.active = false;
        }
    }
}

// Global physics instance
const physics = new Physics();
