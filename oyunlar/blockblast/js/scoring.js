const Scoring = {
  baseScore: 0,
  combo: 0,
  comboMultiplier: 1,
  level: 1,
  comboTimer: null,

  reset() {
    this.baseScore = 0;
    this.combo = 0;
    this.comboMultiplier = 1;
    this.level = 1;
    this.clearComboTimer();
  },

  addScore(blockScore, clearedCells, lines) {
    const totalCleared = clearedCells.length;
    let multiplier = this.comboMultiplier;

    const totalLines = lines.rows.length + lines.cols.length;
    if (totalLines >= 2) multiplier *= 1.5;
    if (totalLines >= 3) multiplier *= 2.0;
    if (totalLines >= 4) multiplier *= 3.0;

    const points = Math.floor(blockScore * totalCleared * multiplier);
    this.baseScore += points;

    this.level = Math.floor(this.baseScore / 500) + 1;

    return { points, multiplier, totalCleared };
  },

  incrementCombo() {
    this.combo++;
    this.comboMultiplier = 1 + (this.combo * 0.5);

    this.clearComboTimer();
    this.comboTimer = setTimeout(() => {
      this.resetCombo();
    }, 2000);

    return this.combo;
  },

  resetCombo() {
    this.combo = 0;
    this.comboMultiplier = 1;
    this.clearComboTimer();
  },

  clearComboTimer() {
    if (this.comboTimer) {
      clearTimeout(this.comboTimer);
      this.comboTimer = null;
    }
  },

  getComboText() {
    if (this.combo >= 10) return { text: 'MEGA PATLAMA!', type: 'mega' };
    if (this.combo >= 5) return { text: `Zincir x${this.combo}!`, type: 'chain' };
    if (this.combo >= 3) return { text: `ÜÇLÜ GÜÇ! x${this.combo}`, type: 'triple' };
    if (this.combo >= 2) return { text: `ÇİFT PATLAMA! x${this.combo}`, type: 'double' };
    return null;
  }
};
