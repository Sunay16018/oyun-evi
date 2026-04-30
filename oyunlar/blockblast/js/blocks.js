const BLOCK_TYPES = {
  single: { name: 'Tekli', color: '#FF4757', class: 'block-red', score: 10, shape: [[1]], weight: 25 },
  dualH: { name: 'İkili-Y', color: '#FF6348', class: 'block-orange', score: 20, shape: [[1,1]], weight: 20 },
  dualV: { name: 'İkili-D', color: '#FFA502', class: 'block-amber', score: 25, shape: [[1],[1]], weight: 20 },
  tripleH: { name: 'Üçlü-Y', color: '#2ED573', class: 'block-green', score: 30, shape: [[1,1,1]], weight: 15 },
  tripleV: { name: 'Üçlü-D', color: '#1E90FF', class: 'block-blue', score: 35, shape: [[1],[1],[1]], weight: 15 },
  lShape: { name: 'L-Şekli', color: '#5352ED', class: 'block-purple', score: 40, shape: [[1,0],[1,1]], weight: 10 },
  tShape: { name: 'T-Şekli', color: '#9B59B6', class: 'block-pink', score: 50, shape: [[1,1,1],[0,1,0]], weight: 10 },
  square: { name: 'Kare', color: '#00D2D3', class: 'block-cyan', score: 60, shape: [[1,1],[1,1]], weight: 8 },
  bigSquare: { name: 'Büyük-K', color: '#F1C40F', class: 'block-gold', score: 100, shape: [[1,1,1],[1,1,1],[1,1,1]], weight: 1 },
  zShape: { name: 'Z-Şekli', color: '#E84393', class: 'block-pink', score: 45, shape: [[1,1,0],[0,1,1]], weight: 10 },
  cross: { name: 'Cross', color: '#00B894', class: 'block-emerald', score: 55, shape: [[0,1,0],[1,1,1],[0,1,0]], weight: 1 }
};

const BlockGenerator = {
  getWeightedRandomBlock(level = 1) {
    const types = Object.keys(BLOCK_TYPES);
    let weights = types.map(t => BLOCK_TYPES[t].weight);

    if (level >= 4) {
      weights = weights.map((w, i) => {
        const type = types[i];
        if (['bigSquare', 'cross', 'tShape', 'zShape'].includes(type)) return w * 1.3;
        return w * 0.9;
      });
    }
    if (level >= 8) {
      weights = weights.map((w, i) => {
        const type = types[i];
        if (['single', 'dualH', 'dualV'].includes(type)) return w * 0.7;
        return w * 1.2;
      });
    }

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < types.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        const type = types[i];
        return { ...BLOCK_TYPES[type], type: type, rotation: 0, id: Math.random().toString(36).substr(2, 9) };
      }
    }

    return { ...BLOCK_TYPES.single, type: 'single', rotation: 0, id: Math.random().toString(36).substr(2, 9) };
  },

  generateBlocks(count = 3, level = 1) {
    return Array.from({ length: count }, () => this.getWeightedRandomBlock(level));
  },

  rotateBlock(block) {
    const shape = block.shape;
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        rotated[x][rows - 1 - y] = shape[y][x];
      }
    }

    return { ...block, shape: rotated, rotation: (block.rotation + 90) % 360 };
  }
};
