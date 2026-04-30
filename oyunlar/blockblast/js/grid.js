const Grid = {
  size: 8,
  cells: [],

  init() {
    this.cells = Array(this.size).fill(null).map(() => Array(this.size).fill(null));
  },

  canPlace(block, gridX, gridY) {
    const shape = block.shape;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const targetX = gridX + x;
          const targetY = gridY + y;

          if (targetX < 0 || targetX >= this.size || targetY < 0 || targetY >= this.size) return false;
          if (this.cells[targetY][targetX] !== null) return false;
        }
      }
    }
    return true;
  },

  placeBlock(block, gridX, gridY) {
    const shape = block.shape;
    const placedCells = [];

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const targetX = gridX + x;
          const targetY = gridY + y;
          this.cells[targetY][targetX] = { ...block, gridX: targetX, gridY: targetY };
          placedCells.push({ x: targetX, y: targetY });
        }
      }
    }

    return placedCells;
  },

  checkLines() {
    const rowsToClear = [];
    const colsToClear = [];

    for (let y = 0; y < this.size; y++) {
      if (this.cells[y].every(cell => cell !== null)) rowsToClear.push(y);
    }

    for (let x = 0; x < this.size; x++) {
      if (this.cells.every(row => row[x] !== null)) colsToClear.push(x);
    }

    return { rows: rowsToClear, cols: colsToClear };
  },

  clearLines(lines) {
    const clearedCells = [];

    lines.rows.forEach(row => {
      for (let x = 0; x < this.size; x++) {
        if (this.cells[row][x] !== null) {
          clearedCells.push({ x, y: row, block: this.cells[row][x] });
          this.cells[row][x] = null;
        }
      }
    });

    lines.cols.forEach(col => {
      for (let y = 0; y < this.size; y++) {
        if (this.cells[y][col] !== null) {
          const exists = clearedCells.some(c => c.x === col && c.y === y);
          if (!exists) {
            clearedCells.push({ x: col, y, block: this.cells[y][col] });
          }
          this.cells[y][col] = null;
        }
      }
    });

    return clearedCells;
  },

  applyGravity() {
    const movedCells = [];

    for (let x = 0; x < this.size; x++) {
      let writeY = this.size - 1;

      for (let y = this.size - 1; y >= 0; y--) {
        if (this.cells[y][x] !== null) {
          if (y !== writeY) {
            const block = this.cells[y][x];
            this.cells[writeY][x] = block;
            this.cells[y][x] = null;
            movedCells.push({ fromX: x, fromY: y, toX: x, toY: writeY, block });
          }
          writeY--;
        }
      }
    }

    return movedCells;
  },

  hasAnyValidPlacement(blocks) {
    for (const block of blocks) {
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          if (this.canPlace(block, x, y)) return true;
        }
      }
    }
    return false;
  },

  isEmpty() {
    return this.cells.every(row => row.every(cell => cell === null));
  }
};
