const CravingLog = {
    init() {
        this.setupForm();
        this.setupIntensitySlider();
        console.log('🔥 CravingLog initialized');
    },

    setupForm() {
        const cravingForm = document.getElementById('cravingForm');
        
        if (cravingForm) {
            cravingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCravingSubmit();
            });
        }
    },

    setupIntensitySlider() {
        this.updateIntensityDisplay();
        
        const intensitySlider = document.getElementById('cravingIntensity');
        
        if (intensitySlider) {
            intensitySlider.addEventListener('input', (e) => {
                const intensityValue = document.getElementById('intensityValue');
                if (intensityValue) {
                    intensityValue.textContent = e.target.value;
                }
            });
            
            intensitySlider.addEventListener('change', (e) => {
                const intensityValue = document.getElementById('intensityValue');
                if (intensityValue) {
                    intensityValue.textContent = e.target.value;
                }
            });
            
            console.log('✅ Intensity slider initialized');
        } else {
            console.error('❌ Intensity slider not found');
        }
    },
    
    updateIntensityDisplay() {
        const intensitySlider = document.getElementById('cravingIntensity');
        const intensityValue = document.getElementById('intensityValue');
        
        if (intensitySlider && intensityValue) {
            intensityValue.textContent = intensitySlider.value;
        }
    },
    handleCravingSubmit() {
        const type = document.getElementById('cravingType').value;
        const intensity = parseInt(document.getElementById('cravingIntensity').value);
        const trigger = document.getElementById('cravingTrigger').value;
        const notes = document.getElementById('cravingNotes').value;
        const resisted = document.getElementById('resistedCraving').checked;

        console.log('Submitting craving:', { type, intensity, trigger, notes, resisted });

        if (!type || !trigger) {
            Navigation.showNotification('Please fill all required fields', 'error');
            return;
        }

        const logData = {
            type,
            intensity,
            trigger,
            notes,
            resisted
        };

        const newLog = AppData.addCravingLog(logData);

        if (resisted) {
            Navigation.showNotification('Amazing! You resisted! 💪', 'success');
            this.celebrateResistance();
        } else {
            Navigation.showNotification('Logged. Remember, progress isn\'t linear. Keep going! 💚', 'success');
        }

        Navigation.closeModal('cravingModal');

        document.getElementById('cravingForm').reset();
        document.getElementById('intensityValue').textContent = '5';

        if (window.App) {
            window.App.updateDashboard();
            window.App.updateProgressPage();
        }

        const newAchievements = AppData.checkAchievements();
        if (newAchievements.length > 0) {
            this.showAchievementUnlock(newAchievements);
        }
    },

    celebrateResistance() {
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.classList.add('celebrate');
            setTimeout(() => {
                dashboard.classList.remove('celebrate');
            }, 600);
        }

        if (AppData.user.settings.sound) {
            this.playSuccessSound();
        }
    },

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

    playAchievementSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        const notes = [523.25, 659.25, 783.99];
        
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

    getCravingStats() {
        const logs = AppData.cravingLogs;
        
        if (logs.length === 0) {
            return null;
        }

        const totalIntensity = logs.reduce((sum, log) => sum + log.intensity, 0);
        const avgIntensity = (totalIntensity / logs.length).toFixed(1);

        const triggers = {};
        logs.forEach(log => {
            triggers[log.trigger] = (triggers[log.trigger] || 0) + 1;
        });
        
        const mostCommonTrigger = Object.entries(triggers)
            .sort((a, b) => b[1] - a[1])[0];

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

document.addEventListener('DOMContentLoaded', () => {
    CravingLog.init();
});

if (typeof window !== 'undefined') {
    window.CravingLog = CravingLog;
}

console.log('✅ craving-log.js loaded');