// Seviye Sistemi

class Level {
    constructor() {
        this.data = [];
        this.width = 0;
        this.height = 0;
        this.enemies = [];
        this.items = [];
        this.backgroundElements = [];
        this.startX = 64;
        this.startY = 400;
        this.flagX = 0;
        this.castleX = 0;
    }

    loadLevel(levelNum) {
        this.data = this.generateLevel(levelNum);
        this.height = this.data.length;
        this.width = this.data[0].length;
        this.enemies = [];
        this.items = [];
        this.backgroundElements = [];

        this.parseLevel();
        this.generateBackground();
    }

    generateLevel(levelNum) {
        const width = 200;
        const height = 20;
        const level = create2DArray(width, height, BLOCK_TYPE.EMPTY);

        // Zemin
        for (let x = 0; x < width; x++) {
            level[height - 2][x] = BLOCK_TYPE.GROUND;
            level[height - 1][x] = BLOCK_TYPE.GROUND;
        }

        // Seviye tasarımı
        this.addPlatform(level, 10, 14, 5);
        this.addPlatform(level, 20, 12, 3);
        this.addPlatform(level, 30, 10, 5);

        // Soru blokları
        this.addQuestionBlocks(level, 15, 10, 3);
        this.addQuestionBlocks(level, 25, 10, 1);
        this.addQuestionBlocks(level, 40, 10, 3);
        this.addQuestionBlocks(level, 55, 6, 3);

        // Tuğla duvarları
        this.addBricks(level, 18, 10, 2);
        this.addBricks(level, 35, 10, 5);
        this.addBricks(level, 50, 10, 4);
        this.addBricks(level, 70, 10, 8);

        // Borular
        this.addPipe(level, 25, 16, 2);
        this.addPipe(level, 40, 15, 3);
        this.addPipe(level, 55, 14, 4);
        this.addPipe(level, 80, 15, 2);
        this.addPipe(level, 95, 14, 3);

        // Merdiven basamakları
        this.addStairs(level, 60, 14, 4);
        this.addStairs(level, 75, 14, 4, true);
        this.addStairs(level, 110, 14, 5);

        // Boşluklar
        this.addGap(level, 45, 2);
        this.addGap(level, 65, 3);
        this.addGap(level, 90, 2);
        this.addGap(level, 120, 3);

        // Görünmez blok
        level[10][22] = BLOCK_TYPE.INVISIBLE_BLOCK;

        // Sert bloklar
        this.addHardBlocks(level, 85, 10, 5);

        // Bayrak direği
        this.flagX = 180;
        for (let y = 2; y < height - 2; y++) {
            level[y][this.flagX] = BLOCK_TYPE.FLAG_POLE;
        }
        level[2][this.flagX] = BLOCK_TYPE.FLAG_TOP;

        // Kale
        this.castleX = 185;
        this.addCastle(level, this.castleX, height - 8);

        return level;
    }

    addPlatform(level, x, y, width) {
        for (let i = 0; i < width; i++) {
            if (x + i < level[0].length) {
                level[y][x + i] = BLOCK_TYPE.HARD_BLOCK;
            }
        }
    }

    addQuestionBlocks(level, x, y, count) {
        for (let i = 0; i < count; i++) {
            if (x + i < level[0].length) {
                level[y][x + i] = BLOCK_TYPE.QUESTION;
            }
        }
    }

    addBricks(level, x, y, count) {
        for (let i = 0; i < count; i++) {
            if (x + i < level[0].length) {
                level[y][x + i] = BLOCK_TYPE.BRICK;
            }
        }
    }

    addPipe(level, x, y, height) {
        for (let h = 0; h < height; h++) {
            const py = y - h;
            if (py >= 0 && x + 1 < level[0].length) {
                if (h === height - 1) {
                    level[py][x] = BLOCK_TYPE.PIPE_TOP_LEFT;
                    level[py][x + 1] = BLOCK_TYPE.PIPE_TOP_RIGHT;
                } else {
                    level[py][x] = BLOCK_TYPE.PIPE_BODY_LEFT;
                    level[py][x + 1] = BLOCK_TYPE.PIPE_BODY_RIGHT;
                }
            }
        }
    }

    addStairs(level, x, y, height, descending = false) {
        for (let h = 0; h < height; h++) {
            const stairX = descending ? x + h : x + h;
            const stairY = descending ? y - h : y - h;
            if (stairY >= 0 && stairX < level[0].length) {
                for (let w = 0; w < height - h; w++) {
                    if (stairX + w < level[0].length) {
                        level[stairY][stairX + w] = BLOCK_TYPE.HARD_BLOCK;
                    }
                }
            }
        }
    }

    addGap(level, x, width) {
        for (let i = 0; i < width; i++) {
            if (x + i < level[0].length) {
                level[level.length - 2][x + i] = BLOCK_TYPE.EMPTY;
                level[level.length - 1][x + i] = BLOCK_TYPE.EMPTY;
            }
        }
    }

    addHardBlocks(level, x, y, count) {
        for (let i = 0; i < count; i++) {
            if (x + i < level[0].length) {
                level[y][x + i] = BLOCK_TYPE.HARD_BLOCK;
            }
        }
    }

    addCastle(level, x, y) {
        const castleHeight = 6;
        const castleWidth = 8;

        for (let cy = 0; cy < castleHeight; cy++) {
            for (let cx = 0; cx < castleWidth; cx++) {
                const px = x + cx;
                const py = y - cy;
                if (px < level[0].length && py >= 0) {
                    if (cx >= 2 && cx <= 5 && cy < 4) {
                        level[py][px] = BLOCK_TYPE.EMPTY;
                    } else if (cx >= 3 && cx <= 4 && cy === 0) {
                        level[py][px] = BLOCK_TYPE.CASTLE_DOOR;
                    } else {
                        level[py][px] = BLOCK_TYPE.CASTLE_BRICK;
                    }
                }
            }
        }
    }

    parseLevel() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const block = this.data[y][x];

                // Düşman spawn noktaları
                if (block === BLOCK_TYPE.EMPTY && y < this.height - 3) {
                    // Goomba spawn
                    if (Math.random() < 0.02 && x > 20 && x < this.width - 20) {
                        const tileBelow = y + 1 < this.height ? this.data[y + 1][x] : BLOCK_TYPE.EMPTY;
                        if (isSolidBlock(tileBelow)) {
                            this.enemies.push(new Enemy(x * TILE_SIZE, y * TILE_SIZE, ENEMY_TYPE.GOOMBA));
                        }
                    }

                    // Koopa spawn
                    if (Math.random() < 0.01 && x > 30 && x < this.width - 20) {
                        const tileBelow = y + 1 < this.height ? this.data[y + 1][x] : BLOCK_TYPE.EMPTY;
                        if (isSolidBlock(tileBelow)) {
                            this.enemies.push(new Enemy(x * TILE_SIZE, y * TILE_SIZE, ENEMY_TYPE.KOOPA));
                        }
                    }
                }
            }
        }
    }

    generateBackground() {
        // Bulutlar
        for (let i = 0; i < 15; i++) {
            this.backgroundElements.push({
                type: 'cloud',
                x: Math.random() * this.width * TILE_SIZE,
                y: Math.random() * 150 + 20,
                scale: 0.5 + Math.random() * 0.5
            });
        }

        // Çalılar
        for (let i = 0; i < 20; i++) {
            this.backgroundElements.push({
                type: 'bush',
                x: Math.random() * this.width * TILE_SIZE,
                y: (this.height - 2) * TILE_SIZE - 32,
                scale: 0.8 + Math.random() * 0.4
            });
        }

        // Tepeler
        for (let i = 0; i < 8; i++) {
            this.backgroundElements.push({
                type: 'hill',
                x: Math.random() * this.width * TILE_SIZE,
                y: (this.height - 2) * TILE_SIZE - 64,
                scale: 0.6 + Math.random() * 0.4
            });
        }
    }

    draw(ctx, cameraX) {
        // Arka plan elementleri
        this.backgroundElements.forEach(bg => {
            const screenX = bg.x - cameraX * 0.5;
            if (screenX > -200 && screenX < CANVAS_WIDTH + 200) {
                const sprite = spriteManager.get(bg.type);
                if (sprite) {
                    ctx.save();
                    ctx.translate(screenX, bg.y);
                    ctx.scale(bg.scale, bg.scale);
                    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
                    ctx.restore();
                }
            }
        });

        // Bloklar
        const startX = Math.floor(cameraX / TILE_SIZE);
        const endX = Math.min(startX + Math.ceil(CANVAS_WIDTH / TILE_SIZE) + 1, this.width);
        const startY = 0;
        const endY = this.height;

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const block = this.data[y][x];
                if (block !== BLOCK_TYPE.EMPTY) {
                    this.drawBlock(ctx, block, x * TILE_SIZE - cameraX, y * TILE_SIZE);
                }
            }
        }
    }

    drawBlock(ctx, block, x, y) {
        let spriteName = '';

        switch (block) {
            case BLOCK_TYPE.GROUND:
                spriteName = 'ground';
                break;
            case BLOCK_TYPE.BRICK:
                spriteName = 'brick';
                break;
            case BLOCK_TYPE.QUESTION:
                spriteName = 'question';
                break;
            case BLOCK_TYPE.QUESTION_HIT:
                spriteName = 'question_hit';
                break;
            case BLOCK_TYPE.PIPE_TOP_LEFT:
                spriteName = 'pipe_top_left';
                break;
            case BLOCK_TYPE.PIPE_TOP_RIGHT:
                spriteName = 'pipe_top_right';
                break;
            case BLOCK_TYPE.PIPE_BODY_LEFT:
                spriteName = 'pipe_body_left';
                break;
            case BLOCK_TYPE.PIPE_BODY_RIGHT:
                spriteName = 'pipe_body_right';
                break;
            case BLOCK_TYPE.HARD_BLOCK:
                spriteName = 'hard_block';
                break;
            case BLOCK_TYPE.FLAG_POLE:
                spriteName = 'flag_pole';
                break;
            case BLOCK_TYPE.FLAG_TOP:
                spriteName = 'flag_top';
                break;
            case BLOCK_TYPE.CASTLE_BRICK:
                spriteName = 'castle_brick';
                break;
            case BLOCK_TYPE.CASTLE_DOOR:
                spriteName = 'castle_door';
                break;
            case BLOCK_TYPE.INVISIBLE_BLOCK:
                return; // Görünmez
        }

        if (spriteName) {
            const sprite = spriteManager.get(spriteName);
            if (sprite) {
                ctx.drawImage(sprite, x, y);
            }
        }
    }

    getBlockAt(x, y) {
        const tx = Math.floor(x / TILE_SIZE);
        const ty = Math.floor(y / TILE_SIZE);
        if (ty >= 0 && ty < this.height && tx >= 0 && tx < this.width) {
            return this.data[ty][tx];
        }
        return BLOCK_TYPE.EMPTY;
    }

    setBlockAt(x, y, value) {
        const tx = Math.floor(x / TILE_SIZE);
        const ty = Math.floor(y / TILE_SIZE);
        if (ty >= 0 && ty < this.height && tx >= 0 && tx < this.width) {
            this.data[ty][tx] = value;
        }
    }
}
