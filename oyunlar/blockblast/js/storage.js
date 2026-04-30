const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },
  getHighScore() {
    return this.get('blokPatlat_highScore', 0);
  },
  setHighScore(score) {
    const current = this.getHighScore();
    if (score > current) {
      this.set('blokPatlat_highScore', score);
      return true;
    }
    return false;
  }
};
