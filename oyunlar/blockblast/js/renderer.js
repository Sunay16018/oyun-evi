const Renderer = {
  gridElement: null,
  nextBlocksElement: null,

  init() {
    this.gridElement = document.getElementById('grid');
    this.nextBlocksElement = document.getElementById('next-blocks');
    this.renderGrid();
  },

  renderGrid() {
    this.gridElement.innerHTML = '';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.x = x;
        cell.dataset.y = y;
        this.gridElement.appendChild(cell);
      }
    }
  },

  updateGrid() {
    const cells = this.gridElement.querySelectorAll('.cell');
    cells.forEach(cell => {
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);
      const block = Grid.cells[y][x];

      cell.innerHTML = '';
      cell.className = 'cell';

      if (block) {
        const blockDiv = document.createElement('div');
        blockDiv.className = `block-placed ${block.class}`;
        cell.appendChild(blockDiv);
      }
    });
  },

  renderNextBlocks(blocks) {
    this.nextBlocksElement.innerHTML = '';

    blocks.forEach((block, index) => {
      const preview = document.createElement('div');
      preview.className = 'block-preview';
      preview.dataset.index = index;
      preview.dataset.blockId = block.id;

      const shape = block.shape;
      preview.style.display = 'grid';
      preview.style.gridTemplateColumns = `repeat(${shape[0].length}, var(--mini-size))`;
      preview.style.gridTemplateRows = `repeat(${shape.length}, var(--mini-size))`;

      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          const mini = document.createElement('div');
          if (shape[y][x]) {
            mini.className = `mini-block ${block.class}`;
          }
          preview.appendChild(mini);
        }
      }

      this.nextBlocksElement.appendChild(preview);
    });
  },

  highlightCells(positions, valid) {
    const cells = this.gridElement.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.classList.remove('highlight-valid', 'highlight-invalid');
    });

    positions.forEach(pos => {
      const cell = this.gridElement.querySelector(`[data-x="${pos.x}"][data-y="${pos.y}"]`);
      if (cell) {
        cell.classList.add(valid ? 'highlight-valid' : 'highlight-invalid');
      }
    });
  },

  clearHighlights() {
    const cells = this.gridElement.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.classList.remove('highlight-valid', 'highlight-invalid');
    });
  },

  animateClear(clearedCells) {
    clearedCells.forEach(({ x, y }) => {
      const cell = this.gridElement.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      if (cell) {
        const block = cell.querySelector('.block-placed');
        if (block) {
          block.classList.add('block-clearing');
        }
      }
    });
  },

  showComboText(text, type = 'normal') {
    const comboEl = document.getElementById('combo-text');
    comboEl.textContent = text;
    comboEl.className = 'combo-text show';

    if (type === 'mega') {
      comboEl.style.color = '#ff4757';
      comboEl.style.fontSize = '2.5rem';
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 400);
    } else if (type === 'chain') {
      comboEl.style.color = '#ffa502';
    } else {
      comboEl.style.color = '#ffa502';
      comboEl.style.fontSize = '2rem';
    }

    setTimeout(() => {
      comboEl.className = 'combo-text';
      comboEl.textContent = '';
    }, 1500);
  },

  showScorePopup(x, y, score) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = `+${score}`;

    const cell = this.gridElement.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (cell) {
      const rect = cell.getBoundingClientRect();
      popup.style.left = rect.left + 'px';
      popup.style.top = rect.top + 'px';
      document.body.appendChild(popup);

      setTimeout(() => popup.remove(), 1000);
    }
  },

  updateScore(score, highScore, combo, level) {
    document.getElementById('score').textContent = score.toLocaleString();
    document.getElementById('high-score').textContent = highScore.toLocaleString();
    document.getElementById('combo').textContent = `x${combo}`;
    document.getElementById('level').textContent = `${level} ${'⭐'.repeat(Math.min(level, 3))}`;
    document.getElementById('lb-score-1').textContent = score.toLocaleString();
  }
};
