// Kamera Sistemi

class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.smoothing = 0.1;
        this.minX = 0;
        this.maxX = 0;
        this.shakeAmount = 0;
        this.shakeTimer = 0;
    }

    update(target, levelWidth) {
        // Kamera hedef pozisyonu
        this.targetX = target.x - CANVAS_WIDTH / 2 + target.width / 2;
        this.targetY = target.y - CANVAS_HEIGHT / 2 + target.height / 2;

        // Sınırlar
        this.targetX = Math.max(this.minX, Math.min(this.targetX, levelWidth - CANVAS_WIDTH));
        this.targetY = Math.max(-100, Math.min(this.targetY, 0));

        // Yumuşak takip
        this.x += (this.targetX - this.x) * this.smoothing;
        this.y += (this.targetY - this.y) * this.smoothing;

        // Sarsıntı efekti
        if (this.shakeTimer > 0) {
            this.shakeTimer--;
            this.x += (Math.random() - 0.5) * this.shakeAmount;
            this.y += (Math.random() - 0.5) * this.shakeAmount;
            this.shakeAmount *= 0.9;
        }
    }

    shake(amount, duration) {
        this.shakeAmount = amount;
        this.shakeTimer = duration;
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.shakeAmount = 0;
        this.shakeTimer = 0;
    }

    setBounds(minX, maxX) {
        this.minX = minX;
        this.maxX = maxX;
    }
}
