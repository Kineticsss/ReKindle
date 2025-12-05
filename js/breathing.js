// ===================================
// BREATHING EXERCISE MODULE
// ===================================

const BreathingExercise = {
    isActive: false,
    currentPhase: 0,
    phases: [
        { name: 'Breathe In', duration: 4000, animation: 'breathe-in', text: 'Breathe In...' },
        { name: 'Hold', duration: 4000, animation: 'hold-breath', text: 'Hold...' },
        { name: 'Breathe Out', duration: 4000, animation: 'breathe-out', text: 'Breathe Out...' },
        { name: 'Hold', duration: 4000, animation: 'hold-breath', text: 'Hold...' }
    ],
    cycleCount: 0,
    maxCycles: 3,

    init() {
        this.setupButton();
    },

    // Setup start button
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

    // Start breathing exercise
    start() {
        this.isActive = true;
        this.currentPhase = 0;
        this.cycleCount = 0;

        const startBtn = document.getElementById('startBreathingBtn');
        if (startBtn) {
            startBtn.textContent = 'Stop Exercise';
            startBtn.style.backgroundColor = 'var(--accent-red)';
        }

        // Start the first phase
        this.runPhase();
    },

    // Stop breathing exercise
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

    // Run a breathing phase
    runPhase() {
        if (!this.isActive) return;

        const phase = this.phases[this.currentPhase];
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const instruction = document.getElementById('breathingInstruction');

        // Update UI
        if (circle) {
            circle.className = 'breathing-circle';
            // Add animation class after a brief delay
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

        // Countdown timer
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

        // Play sound at start of phase if enabled
        if (AppData.user.settings.sound) {
            this.playBreathingSound(phase.name);
        }

        // Move to next phase
        setTimeout(() => {
            if (!this.isActive) return;

            this.currentPhase++;

            // Check if completed a full cycle
            if (this.currentPhase >= this.phases.length) {
                this.currentPhase = 0;
                this.cycleCount++;

                // Check if completed all cycles
                if (this.cycleCount >= this.maxCycles) {
                    this.complete();
                    return;
                }
            }

            this.runPhase();
        }, phase.duration);
    },

    // Complete breathing exercise
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

        // Show success notification
        Navigation.showNotification('Breathing exercise completed! 🧘', 'success');

        // Reset after a delay
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

    // Get countdown number
    getCountdown(seconds) {
        return Math.ceil(seconds);
    },

    // Play breathing sound
    playBreathingSound(phaseName) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Different tones for different phases
        let frequency;
        switch (phaseName) {
            case 'Breathe In':
                frequency = 440; // A note
                break;
            case 'Hold':
                frequency = 523.25; // C note
                break;
            case 'Breathe Out':
                frequency = 392; // G note
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

    // Alternative: Simple box breathing (4-4-4-4)
    startBoxBreathing() {
        this.phases = [
            { name: 'Breathe In', duration: 4000, animation: 'breathe-in', text: 'Breathe In...' },
            { name: 'Hold', duration: 4000, animation: 'hold-breath', text: 'Hold...' },
            { name: 'Breathe Out', duration: 4000, animation: 'breathe-out', text: 'Breathe Out...' },
            { name: 'Hold', duration: 4000, animation: 'hold-breath', text: 'Hold...' }
        ];
        this.start();
    },

    // Alternative: Relaxing breathing (4-7-8)
    start478Breathing() {
        this.phases = [
            { name: 'Breathe In', duration: 4000, animation: 'breathe-in', text: 'Breathe In...' },
            { name: 'Hold', duration: 7000, animation: 'hold-breath', text: 'Hold...' },
            { name: 'Breathe Out', duration: 8000, animation: 'breathe-out', text: 'Breathe Out...' }
        ];
        this.start();
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    BreathingExercise.init();
});

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.BreathingExercise = BreathingExercise;
}