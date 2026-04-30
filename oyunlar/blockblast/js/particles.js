const Particles = {
  container: null,

  init() {
    this.container = document.getElementById('particles-container');
  },

  createExplosion(x, y, color, count = 8) {
    const cellSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell-size')) || 48;
    const gap = 2;
    const offset = 6;
    const centerX = x * (cellSize + gap) + cellSize / 2 + offset;
    const centerY = y * (cellSize + gap) + cellSize / 2 + offset;

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

    const colors = ['#ff4757', '#ff6348', '#ffa502', '#2ed573', '#1e90ff', '#5352ed', '#e84393', '#00d2d3'];
    allPositions.forEach((pos, i) => {
      setTimeout(() => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        this.createExplosion(pos.x, pos.y, color, 6);
      }, i * 30);
    });
  }
};
