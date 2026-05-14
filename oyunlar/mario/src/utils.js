// Yardımcı Fonksiyonlar

function rectIntersect(r1, r2) {
    return !(r2.x > r1.x + r1.width ||
             r2.x + r2.width < r1.x ||
             r2.y > r1.y + r1.height ||
             r2.y + r2.height < r1.y);
}

function pointInRect(px, py, rect) {
    return px >= rect.x && px <= rect.x + rect.width &&
           py >= rect.y && py <= rect.y + rect.height;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num, digits) {
    return num.toString().padStart(digits, '0');
}

function getTileAt(x, y, level) {
    const tx = Math.floor(x / TILE_SIZE);
    const ty = Math.floor(y / TILE_SIZE);
    if (ty >= 0 && ty < level.length && tx >= 0 && tx < level[ty].length) {
        return level[ty][tx];
    }
    return BLOCK_TYPE.EMPTY;
}

function setTileAt(x, y, level, value) {
    const tx = Math.floor(x / TILE_SIZE);
    const ty = Math.floor(y / TILE_SIZE);
    if (ty >= 0 && ty < level.length && tx >= 0 && tx < level[ty].length) {
        level[ty][tx] = value;
    }
}

function isSolidBlock(blockType) {
    return blockType === BLOCK_TYPE.GROUND ||
           blockType === BLOCK_TYPE.BRICK ||
           blockType === BLOCK_TYPE.QUESTION ||
           blockType === BLOCK_TYPE.HARD_BLOCK ||
           blockType === BLOCK_TYPE.PIPE_TOP_LEFT ||
           blockType === BLOCK_TYPE.PIPE_TOP_RIGHT ||
           blockType === BLOCK_TYPE.PIPE_BODY_LEFT ||
           blockType === BLOCK_TYPE.PIPE_BODY_RIGHT ||
           blockType === BLOCK_TYPE.INVISIBLE_BLOCK;
}

function isBreakableBlock(blockType) {
    return blockType === BLOCK_TYPE.BRICK ||
           blockType === BLOCK_TYPE.QUESTION;
}

function isQuestionBlock(blockType) {
    return blockType === BLOCK_TYPE.QUESTION;
}

function isPipe(blockType) {
    return blockType === BLOCK_TYPE.PIPE_TOP_LEFT ||
           blockType === BLOCK_TYPE.PIPE_TOP_RIGHT ||
           blockType === BLOCK_TYPE.PIPE_BODY_LEFT ||
           blockType === BLOCK_TYPE.PIPE_BODY_RIGHT;
}

function isHazard(blockType) {
    return false;
}

function worldToTile(x, y) {
    return {
        tx: Math.floor(x / TILE_SIZE),
        ty: Math.floor(y / TILE_SIZE)
    };
}

function tileToWorld(tx, ty) {
    return {
        x: tx * TILE_SIZE,
        y: ty * TILE_SIZE
    };
}

function create2DArray(width, height, defaultValue = 0) {
    const arr = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            row.push(defaultValue);
        }
        arr.push(row);
    }
    return arr;
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function easeOutQuad(t) {
    return t * (2 - t);
}

function easeInQuad(t) {
    return t * t;
}

function easeOutBounce(t) {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
        return n1 * t * t;
    } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
}

// Çarpışma kutusu oluştur
function createHitbox(x, y, width, height) {
    return { x, y, width, height };
}

// İki dikdörtgen arasındaki çakışma bilgisi
function getCollisionInfo(rect1, rect2) {
    const overlapX = Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x);
    const overlapY = Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y);

    return {
        overlapX,
        overlapY,
        collides: overlapX > 0 && overlapY > 0,
        fromLeft: rect1.x < rect2.x,
        fromTop: rect1.y < rect2.y
    };
}
