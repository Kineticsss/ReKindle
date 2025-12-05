const BreathingExercise = {
    isActive: false,
    currentPhase: 0,
    phases: [
        { name: 'Breathe In', duration: 4000, animation: 'breathe-in', text: 'Breathe In...' },
        { name: 'Hold', duration: 4000, animation: 'hold-breath', text: 'Hold...' },
        { name: 'Breathe Out', duration: 4000, animation: 'breathe-out', text: 'Breathe Out...' },
    ],
    cycleCount: 0,
    maxCycles: 3,

    init() {
        this.setupButton();
    },

    setupButton() {
        const startBtn = document.getElementById('startBreathingBtn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (!this.isActive) {
                    this.start();
                } else {
                    this.stop();
                }
            });
        }
    },

    start() {
        this.isActive = true;
        this.currentPhase = 0;
        this.cycleCount = 0;

        const startBtn = document.getElementById('startBreathingBtn');
        if (startBtn) {
            startBtn.textContent = 'Stop Exercise';
            startBtn.style.backgroundColor = 'var(--accent-red)';
        }

        this.runPhase();
    },

    stop() {
        this.isActive = false;

        const startBtn = document.getElementById('startBreathingBtn');
        if (startBtn) {
            startBtn.textContent = 'Start Exercise';
            startBtn.style.backgroundColor = 'var(--primary-purple)';
        }

        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const instruction = document.getElementById('breathingInstruction');

        if (circle) {
            circle.className = 'breathing-circle';
        }

        if (text) {
            text.textContent = 'Start';
        }

        if (instruction) {
            instruction.textContent = 'Ready to begin?';
        }
    },

    runPhase() {
        if (!this.isActive) return;

        const phase = this.phases[this.currentPhase];
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const instruction = document.getElementById('breathingInstruction');

        if (circle) {
            circle.className = 'breathing-circle';
            setTimeout(() => {
                circle.classList.add(phase.animation);
            }, 50);
        }

        if (text) {
            text.textContent = this.getCountdown(phase.duration / 1000);
        }

        if (instruction) {
            instruction.textContent = phase.text;
        }

        let timeLeft = phase.duration / 1000;
        const countdownInterval = setInterval(() => {
            timeLeft--;
            if (text) {
                text.textContent = timeLeft;
            }

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);

        if (AppData.user.settings.sound) {
            this.playBreathingSound(phase.name);
        }

        setTimeout(() => {
            if (!this.isActive) return;

            this.currentPhase++;

            if (this.currentPhase >= this.phases.length) {
                this.currentPhase = 0;
                this.cycleCount++;

                if (this.cycleCount >= this.maxCycles) {
                    this.complete();
                    return;
                }
            }

            this.runPhase();
        }, phase.duration);
    },

    complete() {
        this.isActive = false;

        const text = document.getElementById('breathingText');
        const instruction = document.getElementById('breathingInstruction');
        const circle = document.getElementById('breathingCircle');
        const startBtn = document.getElementById('startBreathingBtn');

        if (circle) {
            circle.className = 'breathing-circle success-animation';
        }

        if (text) {
            text.textContent = '✓';
        }

        if (instruction) {
            instruction.textContent = 'Great job! You completed the exercise.';
        }

        if (startBtn) {
            startBtn.textContent = 'Start Again';
            startBtn.style.backgroundColor = 'var(--primary-purple)';
        }

        Navigation.showNotification('Breathing exercise completed! 🧘', 'success');

        setTimeout(() => {
            if (text) {
                text.textContent = 'Start';
            }
            if (instruction) {
                instruction.textContent = 'Ready to begin?';
            }
            if (circle) {
                circle.className = 'breathing-circle';
            }
        }, 3000);
    },

    getCountdown(seconds) {
        return Math.ceil(seconds);
    },

    playBreathingSound(phaseName) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        let frequency;
        switch (phaseName) {
            case 'Breathe In':
                frequency = 440;
                break;
            case 'Hold':
                frequency = 523.25;
                break;
            case 'Breathe Out':
                frequency = 392;
                break;
            default:
                frequency = 440;
        }

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    },

    startBoxBreathing() {
        this.phases = [
            { name: 'Breathe In', duration: 4000, animation: 'breathe-in', text: 'Breathe In...' },
            { name: 'Hold', duration: 4000, animation: 'hold-breath', text: 'Hold...' },
            { name: 'Breathe Out', duration: 4000, animation: 'breathe-out', text: 'Breathe Out...' },
        ];
        this.start();
    },

    start478Breathing() {
        this.phases = [
            { name: 'Breathe In', duration: 4000, animation: 'breathe-in', text: 'Breathe In...' },
            { name: 'Hold', duration: 7000, animation: 'hold-breath', text: 'Hold...' },
            { name: 'Breathe Out', duration: 8000, animation: 'breathe-out', text: 'Breathe Out...' }
        ];
        this.start();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    BreathingExercise.init();
});

if (typeof window !== 'undefined') {
    window.BreathingExercise = BreathingExercise;
}