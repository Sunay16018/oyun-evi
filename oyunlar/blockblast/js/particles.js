const Particles = {
  container: null,

  init() {
    this.container = document.getElementById('particles-container');
  },

  createExplosion(x, y, color, count = 8) {
    const rect = this.container.getBoundingClientRect();
    const cellSize = 50;
    const centerX = x * (cellSize + 2) + cellSize / 2 + 8;
    const centerY = y * (cellSize + 2) + cellSize / 2 + 8;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.background = color;
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';

      const angle = (Math.PI * 2 * i) / count;
      const distance = 30 + Math.random() * 50;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');

      this.container.appendChild(particle);

      setTimeout(() => particle.remove(), 600);
    }
  },

  createComboExplosion(lines) {
    const allPositions = [];

    lines.rows.forEach(row => {
      for (let x = 0; x < 8; x++) {
        allPositions.push({ x, y: row });
      }
    });

    lines.cols.forEach(col => {
      for (let y = 0; y < 8; y++) {
        if (!allPositions.some(p => p.x === col && p.y === y)) {
          allPositions.push({ x: col, y });
        }
      }
    });

    allPositions.forEach((pos, i) => {
      setTimeout(() => {
        const colors = ['#ff4757', '#ff6348', '#ffa502', '#2ed573', '#1e90ff', '#5352ed', '#e84393', '#00d2d3'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        this.createExplosion(pos.x, pos.y, color, 6);
      }, i * 30);
    });
  }
};
