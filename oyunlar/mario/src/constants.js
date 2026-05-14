// Oyun Sabitleri
const TILE_SIZE = 32;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.6;
const MAX_FALL_SPEED = 12;
const FRICTION = 0.85;
const ACCELERATION = 0.5;
const MAX_SPEED = 5;
const JUMP_FORCE = -12;
const BOUNCE_FORCE = -8;

// Oyun Durumları
const GAME_STATE = {
    START: 0,
    PLAYING: 1,
    PAUSED: 2,
    GAME_OVER: 3,
    LEVEL_COMPLETE: 4
};

// Mario Durumları
const MARIO_STATE = {
    SMALL: 0,
    BIG: 1,
    FIRE: 2
};

// Yönler
const DIRECTION = {
    LEFT: -1,
    RIGHT: 1
};

// Blok Tipleri
const BLOCK_TYPE = {
    EMPTY: 0,
    GROUND: 1,
    BRICK: 2,
    QUESTION: 3,
    PIPE_TOP_LEFT: 4,
    PIPE_TOP_RIGHT: 5,
    PIPE_BODY_LEFT: 6,
    PIPE_BODY_RIGHT: 7,
    HARD_BLOCK: 8,
    FLAG_POLE: 9,
    FLAG_TOP: 10,
    CASTLE_BRICK: 11,
    CASTLE_DOOR: 12,
    CLOUD: 13,
    BUSH: 14,
    HILL: 15,
    COIN: 16,
    INVISIBLE_BLOCK: 17,
    PIPE_ENTRANCE: 18
};

// Düşman Tipleri
const ENEMY_TYPE = {
    GOOMBA: 0,
    KOOPA: 1,
    KOOPA_SHELL: 2,
    PIRANHA_PLANT: 3,
    FLYING_KOOPA: 4
};

// Eşya Tipleri
const ITEM_TYPE = {
    COIN: 0,
    MUSHROOM: 1,
    FIRE_FLOWER: 2,
    STAR: 3,
    ONE_UP: 4
};

// Renkler
const COLORS = {
    SKY: '#5c94fc',
    GROUND_TOP: '#e69c24',
    GROUND_SIDE: '#c84c0c',
    BRICK: '#b83800',
    BRICK_HIGHLIGHT: '#ff9c00',
    QUESTION: '#fc9c00',
    QUESTION_DARK: '#d87800',
    PIPE_GREEN: '#00a800',
    PIPE_DARK: '#008400',
    PIPE_LIGHT: '#00d800',
    HARD_BLOCK: '#fc9c00',
    MARIO_RED: '#e60012',
    MARIO_BLUE: '#0044ff',
    MARIO_SKIN: '#ffcc99',
    MARIO_HAIR: '#4a3000',
    GOOMBA_BROWN: '#8b4513',
    GOOMBA_FEET: '#000000',
    MUSHROOM_RED: '#e60012',
    MUSHROOM_CAP: '#ffffff',
    FIRE_FLOWER_ORANGE: '#ff6600',
    STAR_YELLOW: '#ffd700',
    FLAG_RED: '#e60012',
    CASTLE_BRICK: '#b83800',
    CASTLE_ROOF: '#e60012',
    BUSH_GREEN: '#00a800',
    CLOUD_WHITE: '#ffffff',
    HILL_GREEN: '#00a800',
    HILL_TOP: '#00d800'
};

// Harita boyutları
const MAP_WIDTH = 200;
const MAP_HEIGHT = 20;
