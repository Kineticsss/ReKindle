// ===================================
// MAIN APPLICATION MODULE
// ===================================

const App = {
    init() {
        console.log('ReKindle App Initialized');
        this.updateDashboard();
        this.updateProgressPage();
        this.updateEmergencyPage();
        this.loadAchievements();
        
        // Update every minute
        setInterval(() => {
            this.updateDashboard();
        }, 60000);
    },

    // Update dashboard with current data
    updateDashboard() {
        // Update user name
        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
            userNameEl.textContent = AppData.user.name;
        }

        // Update stats
        this.updateStats();
        this.updateJourneyProgress();
        this.loadAchievements();
    },

    // Update stats cards
    updateStats() {
        const smokingStreakEl = document.getElementById('smokingStreak');
        const drinkingStreakEl = document.getElementById('drinkingStreak');
        const moneySavedEl = document.getElementById('moneySaved');
        const cravingsResistedEl = document.getElementById('cravingsResisted');

        if (smokingStreakEl) {
            this.animateNumber(smokingStreakEl, AppData.stats.smokingStreak);
        }

        if (drinkingStreakEl) {
            this.animateNumber(drinkingStreakEl, AppData.stats.drinkingStreak);
        }

        if (moneySavedEl) {
            this.animateNumber(moneySavedEl, AppData.stats.moneySaved, '₱');
        }

        if (cravingsResistedEl) {
            this.animateNumber(cravingsResistedEl, AppData.stats.cravingsResisted);
        }
    },

    // Animate number change
    animateNumber(element, targetValue, prefix = '') {
        const currentValue = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
        
        if (currentValue === targetValue) return;

        const duration = 500;
        const steps = 20;
        const increment = (targetValue - currentValue) / steps;
        const stepDuration = duration / steps;

        let current = currentValue;
        let step = 0;

        const interval = setInterval(() => {
            step++;
            current += increment;

            if (step >= steps) {
                element.textContent = prefix + Math.round(targetValue);
                clearInterval(interval);
            } else {
                element.textContent = prefix + Math.round(current);
            }
        }, stepDuration);
    },

    // Update journey progress bars
    updateJourneyProgress() {
        const smokingProgressEl = document.getElementById('smokingProgress');
        const drinkingProgressEl = document.getElementById('drinkingProgress');
        const smokingStatusEl = document.getElementById('smokingStatus');
        const drinkingStatusEl = document.getElementById('drinkingStatus');

        // Calculate progress (max 30 days = 100%)
        const smokingProgress = Math.min((AppData.stats.smokingStreak / 30) * 100, 100);
        const drinkingProgress = Math.min((AppData.stats.drinkingStreak / 30) * 100, 100);

        if (smokingProgressEl) {
            smokingProgressEl.style.width = smokingProgress + '%';
        }

        if (drinkingProgressEl) {
            drinkingProgressEl.style.width = drinkingProgress + '%';
        }

        // Update status text
        if (smokingStatusEl) {
            smokingStatusEl.textContent = this.getStatusText(AppData.stats.smokingStreak);
        }

        if (drinkingStatusEl) {
            drinkingStatusEl.textContent = this.getStatusText(AppData.stats.drinkingStreak);
        }
    },

    // Get status text based on streak
    getStatusText(days) {
        if (days === 0) {
            return 'Just starting your journey';
        } else if (days === 1) {
            return '1 day strong! 💪';
        } else if (days < 7) {
            return `${days} days and counting! Keep going! 🌱`;
        } else if (days < 30) {
            return `${days} days! You\'re doing amazing! ⭐`;
        } else {
            return `${days} days! You\'re a champion! 🏆`;
        }
    },

    // Load achievements
    loadAchievements() {
        const achievementList = document.getElementById('achievementList');
        if (!achievementList) return;

        achievementList.innerHTML = '';

        AppData.achievements.forEach(achievement => {
            const achievementEl = document.createElement('div');
            achievementEl.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;

            achievementEl.innerHTML = `
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-info">
                    <p class="achievement-name">${achievement.name}</p>
                    <p class="achievement-desc">${achievement.desc}</p>
                </div>
            `;

            achievementList.appendChild(achievementEl);
        });
    },

    // Update progress page
    updateProgressPage() {
        this.updateLogHistory();
        this.updateMilestones();
    },

    // Update log history
    updateLogHistory() {
        const logHistoryEl = document.getElementById('logHistory');
        if (!logHistoryEl) return;

        const recentLogs = AppData.getRecentLogs(5);

        if (recentLogs.length === 0) {
            logHistoryEl.innerHTML = '<p class="empty-state">No logs yet. Start by logging your first craving!</p>';
            return;
        }

        logHistoryEl.innerHTML = '';
        recentLogs.forEach(log => {
            logHistoryEl.innerHTML += CravingLog.formatLog(log);
        });
    },

    // Update milestones
    updateMilestones() {
        const milestones = document.querySelectorAll('.milestone');
        const maxStreak = Math.max(AppData.stats.smokingStreak, AppData.stats.drinkingStreak);

        milestones.forEach((milestone, index) => {
            const milestoneValues = [1, 3, 7, 30];
            if (maxStreak >= milestoneValues[index]) {
                milestone.classList.remove('locked');
                milestone.classList.add('completed');
            } else {
                milestone.classList.remove('completed');
                milestone.classList.add('locked');
            }
        });
    },

    // Update emergency page
    updateEmergencyPage() {
        const contactsList = document.getElementById('contactsList');
        if (!contactsList) return;

        if (AppData.trustedContacts.length === 0) {
            contactsList.innerHTML = '<p class="empty-state">Add someone you trust for quick access during tough moments</p>';
            return;
        }

        contactsList.innerHTML = '';
        AppData.trustedContacts.forEach(contact => {
            const contactEl = document.createElement('div');
            contactEl.className = 'hotline-card';

            contactEl.innerHTML = `
                <div class="hotline-icon">👤</div>
                <div class="hotline-info">
                    <h3>${contact.name}</h3>
                    <p class="hotline-number">${contact.phone}</p>
                    <p class="hotline-desc">${contact.relationship}</p>
                </div>
                <button class="call-btn" onclick="window.location.href='tel:${contact.phone}'">Call</button>
            `;

            contactsList.appendChild(contactEl);
        });
    },

    // Show welcome message for first-time users
    showWelcomeMessage() {
        const isFirstTime = !localStorage.getItem('rekindle_welcomed');
        
        if (isFirstTime) {
            setTimeout(() => {
                Navigation.showNotification(
                    'Welcome to ReKindle! Let\'s start your recovery journey together. 💜',
                    'success',
                    5000
                );
                localStorage.setItem('rekindle_welcomed', 'true');
            }, 1000);
        }
    },

    // Export data as JSON (for backup)
    exportData() {
        const dataStr = JSON.stringify({
            user: AppData.user,
            stats: AppData.stats,
            cravingLogs: AppData.cravingLogs,
            achievements: AppData.achievements,
            trustedContacts: AppData.trustedContacts,
            exportDate: new Date().toISOString()
        }, null, 2);

        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `rekindle-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        Navigation.showNotification('Data exported successfully!', 'success');
    },

    // Import data from JSON (for restore)
    importData(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate data structure
                if (!importedData.user || !importedData.stats) {
                    throw new Error('Invalid data format');
                }
                
                // Restore data
                Object.assign(AppData.user, importedData.user);
                Object.assign(AppData.stats, importedData.stats);
                AppData.cravingLogs = importedData.cravingLogs || [];
                AppData.trustedContacts = importedData.trustedContacts || [];
                
                if (importedData.achievements) {
                    AppData.achievements.forEach((achievement, index) => {
                        if (importedData.achievements[index]) {
                            achievement.unlocked = importedData.achievements[index].unlocked;
                        }
                    });
                }
                
                AppData.save();
                
                Navigation.showNotification('Data imported successfully!', 'success');
                
                // Refresh display
                this.updateDashboard();
                this.updateProgressPage();
                
            } catch (error) {
                console.error('Import error:', error);
                Navigation.showNotification('Failed to import data. Please check the file.', 'error');
            }
        };
        
        reader.readAsText(file);
    },

    // Generate summary report
    generateSummaryReport() {
        const stats = AppData.stats;
        const achievementProgress = AppData.getAchievementProgress();
        const cravingStats = CravingLog.getCravingStats();

        let report = '📊 REKINDLE PROGRESS REPORT\n';
        report += '═'.repeat(40) + '\n\n';
        report += `Generated: ${new Date().toLocaleDateString()}\n\n`;
        
        report += '🎯 STREAKS\n';
        report += `Smoke-Free Days: ${stats.smokingStreak}\n`;
        report += `Alcohol-Free Days: ${stats.drinkingStreak}\n\n`;
        
        report += '💰 SAVINGS\n';
        report += `Money Saved: ₱${stats.moneySaved}\n\n`;
        
        report += '💪 CRAVINGS\n';
        report += `Total Resisted: ${stats.cravingsResisted}\n`;
        
        if (cravingStats) {
            report += `Resistance Rate: ${cravingStats.resistanceRate}%\n`;
            report += `Average Intensity: ${cravingStats.avgIntensity}/10\n\n`;
        }
        
        report += '🏆 ACHIEVEMENTS\n';
        report += `Unlocked: ${achievementProgress.unlocked}/${achievementProgress.total}\n`;
        report += `Progress: ${achievementProgress.percentage}%\n\n`;
        
        report += '═'.repeat(40) + '\n';
        report += 'Keep up the amazing work! 🌟\n';

        return report;
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for data to be initialized
    setTimeout(() => {
        App.init();
        App.showWelcomeMessage();
    }, 100);
});

// Make App available globally
if (typeof window !== 'undefined') {
    window.App = App;
}

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
             .then(reg => console.log('Service Worker registered'))
             .catch(err => console.log('Service Worker registration failed'));
    });
}