// ===================================
// CRAVING LOG MODULE
// ===================================

const CravingLog = {
    init() {
        this.setupForm();
        this.setupIntensitySlider();
    },

    // Setup craving form submission
    setupForm() {
        const cravingForm = document.getElementById('cravingForm');
        
        if (cravingForm) {
            cravingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCravingSubmit();
            });
        }
    },

    // Setup intensity slider display
    setupIntensitySlider() {
        const intensitySlider = document.getElementById('cravingIntensity');
        const intensityValue = document.getElementById('intensityValue');
        
        if (intensitySlider && intensityValue) {
            intensitySlider.addEventListener('input', (e) => {
                intensityValue.textContent = e.target.value;
            });
        }
    },

    // Handle craving form submission
    handleCravingSubmit() {
        // Get form values
        const type = document.getElementById('cravingType').value;
        const intensity = parseInt(document.getElementById('cravingIntensity').value);
        const trigger = document.getElementById('cravingTrigger').value;
        const notes = document.getElementById('cravingNotes').value;
        const resisted = document.getElementById('resistedCraving').checked;

        // Validate
        if (!type || !trigger) {
            Navigation.showNotification('Please fill all required fields', 'error');
            return;
        }

        // Create log data
        const logData = {
            type,
            intensity,
            trigger,
            notes,
            resisted
        };

        // Add to data
        const newLog = AppData.addCravingLog(logData);

        // Show success message
        if (resisted) {
            Navigation.showNotification('Amazing! You resisted! 💪', 'success');
            this.celebrateResistance();
        } else {
            Navigation.showNotification('Logged. Remember, progress isn\'t linear. Keep going! 💚', 'success');
        }

        // Close modal
        Navigation.closeModal('cravingModal');

        // Reset form
        document.getElementById('cravingForm').reset();
        document.getElementById('intensityValue').textContent = '5';

        // Update dashboard
        if (window.App) {
            window.App.updateDashboard();
            window.App.updateProgressPage();
        }

        // Check for new achievements
        const newAchievements = AppData.checkAchievements();
        if (newAchievements.length > 0) {
            this.showAchievementUnlock(newAchievements);
        }
    },

    // Celebrate resistance with animation
    celebrateResistance() {
        // Add confetti or celebration animation
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.classList.add('celebrate');
            setTimeout(() => {
                dashboard.classList.remove('celebrate');
            }, 600);
        }

        // Play sound if enabled
        if (AppData.user.settings.sound) {
            this.playSuccessSound();
        }
    },

    // Show achievement unlock
    showAchievementUnlock(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                const message = `🎉 Achievement Unlocked: ${achievement.name}!`;
                Navigation.showNotification(message, 'success', 4000);
                
                if (AppData.user.settings.sound) {
                    this.playAchievementSound();
                }
            }, index * 1000);
        });
    },

    // Play success sound (simple beep)
    playSuccessSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    },

    // Play achievement sound
    playAchievementSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Play a pleasant achievement melody
        const notes = [523.25, 659.25, 783.99]; // C, E, G
        
        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine';

            const startTime = audioContext.currentTime + (index * 0.2);
            gainNode.gain.setValueAtTime(0.2, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    },

    // Format log for display
    formatLog(log) {
        const date = new Date(log.timestamp);
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const typeEmoji = {
            'smoking': '🚭',
            'drinking': '🍺',
            'both': '🚭🍺'
        };

        const triggerLabels = {
            'stress': 'Stress',
            'social': 'Social Setting',
            'boredom': 'Boredom',
            'habit': 'Habit/Routine',
            'emotion': 'Strong Emotion',
            'other': 'Other'
        };

        return `
            <div class="log-item slide-in">
                <div class="log-header">
                    <span class="log-type">${typeEmoji[log.type]} ${log.type.charAt(0).toUpperCase() + log.type.slice(1)}</span>
                    <span class="log-date">${dateStr} ${timeStr}</span>
                </div>
                <div class="log-details">
                    <p><strong>Intensity:</strong> ${log.intensity}/10</p>
                    <p><strong>Trigger:</strong> ${triggerLabels[log.trigger]}</p>
                    ${log.notes ? `<p><strong>Notes:</strong> ${log.notes}</p>` : ''}
                    ${log.resisted ? '<span class="log-badge">Resisted ✨</span>' : ''}
                </div>
            </div>
        `;
    },

    // Get craving statistics
    getCravingStats() {
        const logs = AppData.cravingLogs;
        
        if (logs.length === 0) {
            return null;
        }

        // Calculate average intensity
        const totalIntensity = logs.reduce((sum, log) => sum + log.intensity, 0);
        const avgIntensity = (totalIntensity / logs.length).toFixed(1);

        // Most common trigger
        const triggers = {};
        logs.forEach(log => {
            triggers[log.trigger] = (triggers[log.trigger] || 0) + 1;
        });
        
        const mostCommonTrigger = Object.entries(triggers)
            .sort((a, b) => b[1] - a[1])[0];

        // Resistance rate
        const resistedCount = logs.filter(log => log.resisted).length;
        const resistanceRate = Math.round((resistedCount / logs.length) * 100);

        return {
            totalLogs: logs.length,
            avgIntensity,
            mostCommonTrigger: mostCommonTrigger ? mostCommonTrigger[0] : 'N/A',
            resistanceRate,
            resistedCount
        };
    },

    // Get trend data for charts
    getTrendData(days = 7) {
        const now = new Date();
        const trendData = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const logsForDay = AppData.cravingLogs.filter(log => {
                const logDate = new Date(log.timestamp);
                return logDate >= date && logDate < nextDate;
            });

            trendData.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                count: logsForDay.length,
                resisted: logsForDay.filter(log => log.resisted).length
            });
        }

        return trendData;
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    CravingLog.init();
});

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.CravingLog = CravingLog;
}