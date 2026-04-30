const Game = {
  grid: null,
  availableBlocks: [],
  score: 0,
  highScore: 0,
  isGameOver: false,
  isPaused: false,
  selectedBlockIndex: null,

  init() {
    Grid.init();
    Renderer.init();
    Particles.init();
    Input.init();

    this.highScore = Storage.getHighScore();
    this.reset();
    this.setupUI();
  },

  reset() {
    Grid.init();
    this.score = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.availableBlocks = [];
    Scoring.reset();

    this.generateBlocks();
    Renderer.updateGrid(Grid.cells);
    Renderer.updateScore(this.score, this.highScore, 1, 1);

    document.getElementById('game-over-modal').classList.add('hidden');
    document.getElementById('pause-modal').classList.add('hidden');
  },

  generateBlocks() {
    this.availableBlocks = BlockGenerator.generateBlocks(3, Scoring.level);
    Renderer.renderNextBlocks(this.availableBlocks);
  },

  placeBlock(blockIndex, gridX, gridY) {
    if (this.isGameOver || this.isPaused) return;

    const block = this.availableBlocks[blockIndex];
    if (!block) return;

    if (!Grid.canPlace(block, gridX, gridY)) return;

    // Place block
    const placedCells = Grid.placeBlock(block, gridX, gridY);
    Renderer.updateGrid(Grid.cells);

    // Remove from available
    this.availableBlocks.splice(blockIndex, 1);

    // Check lines
    this.processLines();

    // Check if need new blocks
    if (this.availableBlocks.length === 0) {
      this.generateBlocks();
    }

    // Check game over
    if (!Grid.hasAnyValidPlacement(this.availableBlocks)) {
      this.gameOver();
    }

    Renderer.renderNextBlocks(this.availableBlocks);
  },

  processLines() {
    const lines = Grid.checkLines();

    if (lines.rows.length === 0 && lines.cols.length === 0) {
      Scoring.resetCombo();
      return;
    }

    // Show matched animation
    const allMatched = [];
    lines.rows.forEach(row => {
      for (let x = 0; x < 8; x++) allMatched.push({ x, y: row });
    });
    lines.cols.forEach(col => {
      for (let y = 0; y < 8; y++) {
        if (!allMatched.some(p => p.x === col && p.y === y)) {
          allMatched.push({ x: col, y });
        }
      }
    });

    Renderer.animateClear(allMatched);

    setTimeout(() => {
      // Calculate score
      const clearedCells = Grid.clearLines(lines);
      const scoreResult = Scoring.addScore(10, clearedCells, lines);
      this.score = Scoring.baseScore;

      // Combo
      const comboCount = Scoring.incrementCombo();
      const comboInfo = Scoring.getComboText();

      if (comboInfo) {
        Renderer.showComboText(comboInfo.text, comboInfo.type);
      }

      // Update score display
      Renderer.updateScore(this.score, this.highScore, Scoring.comboMultiplier, Scoring.level);

      // Score popup
      if (clearedCells.length > 0) {
        const centerCell = clearedCells[Math.floor(clearedCells.length / 2)];
        Renderer.showScorePopup(centerCell.x, centerCell.y, scoreResult.points);
      }

      // Particles
      Particles.createComboExplosion(lines);

      // Apply gravity
      setTimeout(() => {
        const moved = Grid.applyGravity();
        Renderer.updateGrid(Grid.cells);

        // Check for chain reactions
        setTimeout(() => {
          const newLines = Grid.checkLines();
          if (newLines.rows.length > 0 || newLines.cols.length > 0) {
            this.processLines();
          }
        }, 300);
      }, 400);

    }, 300);
  },

  rotateBlock(index) {
    if (index >= 0 && index < this.availableBlocks.length) {
      this.availableBlocks[index] = BlockGenerator.rotateBlock(this.availableBlocks[index]);
      Renderer.renderNextBlocks(this.availableBlocks);
    }
  },

  gameOver() {
    this.isGameOver = true;

    const isNewHigh = Storage.setHighScore(this.score);
    this.highScore = Storage.getHighScore();

    document.getElementById('final-score').textContent = this.score.toLocaleString();
    document.getElementById('game-over-modal').classList.remove('hidden');

    if (isNewHigh) {
      Renderer.showComboText('YENİ REKOR! 🎉', 'mega');
    }
  },

  pause() {
    this.isPaused = true;
    document.getElementById('pause-modal').classList.remove('hidden');
  },

  resume() {
    this.isPaused = false;
    document.getElementById('pause-modal').classList.add('hidden');
  },

  setupUI() {
    document.getElementById('btn-pause').addEventListener('click', () => this.pause());
    document.getElementById('btn-resume').addEventListener('click', () => this.resume());
    document.getElementById('btn-restart').addEventListener('click', () => this.reset());
    document.getElementById('btn-restart-pause').addEventListener('click', () => {
      this.resume();
      this.reset();
    });
    document.getElementById('btn-replay').addEventListener('click', () => this.reset());
    document.getElementById('btn-main-menu').addEventListener('click', () => this.reset());
    document.getElementById('btn-quit').addEventListener('click', () => this.reset());
    document.getElementById('btn-menu').addEventListener('click', () => this.reset());
  }
};

// Start game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Game.init();
});
