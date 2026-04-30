const Input = {
  draggedBlock: null,
  draggedBlockIndex: null,
  draggedElement: null,
  dragOffset: { x: 0, y: 0 },
  originalElement: null,
  isDragging: false,
  hoverGridPos: null,

  init() {
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));

    document.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.onTouchEnd.bind(this));

    document.addEventListener('dblclick', this.onDoubleClick.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  },

  onMouseDown(e) {
    const preview = e.target.closest('.block-preview');
    if (preview) {
      this.startDrag(preview, e.clientX, e.clientY);
    }
  },

  onMouseMove(e) {
    if (this.isDragging) {
      this.updateDrag(e.clientX, e.clientY);
    }
  },

  onMouseUp(e) {
    if (this.isDragging) {
      this.endDrag(e.clientX, e.clientY);
    }
  },

  onTouchStart(e) {
    const preview = e.target.closest('.block-preview');
    if (preview) {
      e.preventDefault();
      const touch = e.touches[0];
      this.startDrag(preview, touch.clientX, touch.clientY);
    }
  },

  onTouchMove(e) {
    if (this.isDragging) {
      e.preventDefault();
      const touch = e.touches[0];
      this.updateDrag(touch.clientX, touch.clientY);
    }
  },

  onTouchEnd(e) {
    if (this.isDragging) {
      const touch = e.changedTouches[0];
      this.endDrag(touch.clientX, touch.clientY);
    }
  },

  startDrag(element, clientX, clientY) {
    const index = parseInt(element.dataset.index);
    const block = Game.availableBlocks[index];
    if (!block) return;

    this.draggedBlock = block;
    this.draggedBlockIndex = index;
    this.isDragging = true;

    const clone = element.cloneNode(true);
    clone.classList.add('dragging');
    clone.style.position = 'fixed';
    clone.style.zIndex = '1000';
    clone.style.pointerEvents = 'none';
    document.body.appendChild(clone);

    this.draggedElement = clone;
    this.dragOffset = {
      x: clone.offsetWidth / 2,
      y: clone.offsetHeight / 2
    };

    this.updateDrag(clientX, clientY);
    element.style.opacity = '0.3';
    this.originalElement = element;
  },

  updateDrag(clientX, clientY) {
    if (!this.draggedElement) return;

    this.draggedElement.style.left = (clientX - this.dragOffset.x) + 'px';
    this.draggedElement.style.top = (clientY - this.dragOffset.y) + 'px';

    const gridRect = Renderer.gridElement.getBoundingClientRect();
    const cellSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell-size')) || 48;
    const gap = 2;
    const pad = 6;

    const relativeX = clientX - gridRect.left;
    const relativeY = clientY - gridRect.top;

    const gridX = Math.floor((relativeX - pad) / (cellSize + gap));
    const gridY = Math.floor((relativeY - pad) / (cellSize + gap));

    if (gridX >= 0 && gridX < 8 && gridY >= 0 && gridY < 8) {
      const positions = this.getBlockPositions(this.draggedBlock, gridX, gridY);
      const valid = Grid.canPlace(this.draggedBlock, gridX, gridY);
      Renderer.highlightCells(positions, valid);
      this.hoverGridPos = { x: gridX, y: gridY };
    } else {
      Renderer.clearHighlights();
      this.hoverGridPos = null;
    }
  },

  endDrag(clientX, clientY) {
    this.isDragging = false;

    if (this.draggedElement) {
      this.draggedElement.remove();
      this.draggedElement = null;
    }

    if (this.originalElement) {
      this.originalElement.style.opacity = '1';
    }

    Renderer.clearHighlights();

    if (this.hoverGridPos && Grid.canPlace(this.draggedBlock, this.hoverGridPos.x, this.hoverGridPos.y)) {
      Game.placeBlock(this.draggedBlockIndex, this.hoverGridPos.x, this.hoverGridPos.y);
    }

    this.draggedBlock = null;
    this.hoverGridPos = null;
  },

  getBlockPositions(block, gridX, gridY) {
    const positions = [];
    const shape = block.shape;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          positions.push({ x: gridX + x, y: gridY + y });
        }
      }
    }

    return positions;
  },

  onDoubleClick(e) {
    const preview = e.target.closest('.block-preview');
    if (preview && !this.isDragging) {
      const index = parseInt(preview.dataset.index);
      Game.rotateBlock(index);
    }
  },

  onKeyDown(e) {
    if (e.key === 'r' || e.key === 'R') {
      if (Game.selectedBlockIndex !== undefined) {
        Game.rotateBlock(Game.selectedBlockIndex);
      }
    }
  }
};
