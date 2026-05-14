// Ses Sistemi (Web Audio API ile)

class AudioManager {
    constructor() {
        this.ctx = null;
        this.initialized = false;
        this.sounds = {};
        this.musicPlaying = false;
        this.masterVolume = 0.5;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
    }

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            this.generateSounds();
        } catch (e) {
            console.warn('Web Audio API desteklenmiyor');
        }
    }

    generateSounds() {
        // Ses efektlerini programatik olarak oluştur
        this.sounds['jump'] = this.createJumpSound();
        this.sounds['coin'] = this.createCoinSound();
        this.sounds['powerup'] = this.createPowerUpSound();
        this.sounds['stomp'] = this.createStompSound();
        this.sounds['break'] = this.createBreakSound();
        this.sounds['bump'] = this.createBumpSound();
        this.sounds['die'] = this.createDieSound();
        this.sounds['kick'] = this.createKickSound();
        this.sounds['fireball'] = this.createFireballSound();
        this.sounds['pipe'] = this.createPipeSound();
        this.sounds['star'] = this.createStarSound();
        this.sounds['one_up'] = this.createOneUpSound();
    }

    createTone(frequency, duration, type = 'square', volume = 0.3) {
        return { frequency, duration, type, volume };
    }

    playTone(tone) {
        if (!this.initialized) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = tone.type;
        osc.frequency.setValueAtTime(tone.frequency, this.ctx.currentTime);

        gain.gain.setValueAtTime(tone.volume * this.sfxVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + tone.duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + tone.duration);
    }

    playSequence(tones) {
        if (!this.initialized) return;

        let time = this.ctx.currentTime;
        tones.forEach(tone => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = tone.type || 'square';
            osc.frequency.setValueAtTime(tone.frequency, time);

            gain.gain.setValueAtTime((tone.volume || 0.3) * this.sfxVolume, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + tone.duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(time);
            osc.stop(time + tone.duration);

            time += tone.delay || tone.duration;
        });
    }

    createJumpSound() {
        return () => {
            this.playSequence([
                { frequency: 440, duration: 0.1, delay: 0 },
                { frequency: 550, duration: 0.1, delay: 0.05 },
                { frequency: 660, duration: 0.15, delay: 0.05 }
            ]);
        };
    }

    createCoinSound() {
        return () => {
            this.playSequence([
                { frequency: 990, duration: 0.1, delay: 0 },
                { frequency: 1320, duration: 0.2, delay: 0.05 }
            ]);
        };
    }

    createPowerUpSound() {
        return () => {
            this.playSequence([
                { frequency: 440, duration: 0.1, delay: 0 },
                { frequency: 550, duration: 0.1, delay: 0.08 },
                { frequency: 660, duration: 0.1, delay: 0.08 },
                { frequency: 880, duration: 0.2, delay: 0.08 }
            ]);
        };
    }

    createStompSound() {
        return () => {
            this.playTone(this.createTone(150, 0.1, 'square', 0.4));
        };
    }

    createBreakSound() {
        return () => {
            this.playTone(this.createTone(100, 0.15, 'sawtooth', 0.4));
        };
    }

    createBumpSound() {
        return () => {
            this.playTone(this.createTone(200, 0.1, 'square', 0.3));
        };
    }

    createDieSound() {
        return () => {
            this.playSequence([
                { frequency: 440, duration: 0.2, delay: 0 },
                { frequency: 380, duration: 0.2, delay: 0.15 },
                { frequency: 320, duration: 0.2, delay: 0.15 },
                { frequency: 260, duration: 0.4, delay: 0.15 }
            ]);
        };
    }

    createKickSound() {
        return () => {
            this.playTone(this.createTone(200, 0.1, 'square', 0.4));
        };
    }

    createFireballSound() {
        return () => {
            this.playTone(this.createTone(800, 0.1, 'sawtooth', 0.2));
        };
    }

    createPipeSound() {
        return () => {
            this.playSequence([
                { frequency: 300, duration: 0.1, delay: 0 },
                { frequency: 250, duration: 0.15, delay: 0.05 }
            ]);
        };
    }

    createStarSound() {
        return () => {
            this.playSequence([
                { frequency: 880, duration: 0.1, delay: 0 },
                { frequency: 990, duration: 0.1, delay: 0.08 },
                { frequency: 1100, duration: 0.1, delay: 0.08 },
                { frequency: 1320, duration: 0.2, delay: 0.08 }
            ]);
        };
    }

    createOneUpSound() {
        return () => {
            this.playSequence([
                { frequency: 660, duration: 0.1, delay: 0 },
                { frequency: 880, duration: 0.1, delay: 0.1 },
                { frequency: 990, duration: 0.1, delay: 0.1 },
                { frequency: 1100, duration: 0.2, delay: 0.1 }
            ]);
        };
    }

    playSound(name) {
        if (this.sounds[name]) {
            this.sounds[name]();
        }
    }

    setMasterVolume(vol) {
        this.masterVolume = vol;
    }

    setMusicVolume(vol) {
        this.musicVolume = vol;
    }

    setSfxVolume(vol) {
        this.sfxVolume = vol;
    }
}
