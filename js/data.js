// ===================================
// DATA MANAGEMENT MODULE
// ===================================

const AppData = {
    // User data
    user: {
        name: 'Friend',
        language: 'en',
        smokingStartDate: null,
        drinkingStartDate: null,
        settings: {
            notifications: true,
            sound: true
        }
    },

    // Stats
    stats: {
        smokingStreak: 0,
        drinkingStreak: 0,
        moneySaved: 0,
        cravingsResisted: 0,
        totalLogs: 0
    },

    // Craving logs
    cravingLogs: [],

    // Achievements
    achievements: [
        { id: 'first_day', name: 'First Day', desc: 'Complete your first day clean', icon: '🏆', unlocked: false },
        { id: 'week_warrior', name: 'Week Warrior', desc: 'Stay clean for 7 days', icon: '⭐', unlocked: false },
        { id: 'month_master', name: 'Month Master', desc: 'Achieve 30 days of recovery', icon: '💎', unlocked: false },
        { id: 'resist_10', name: 'Strong Resist', desc: 'Resist 10 cravings', icon: '💪', unlocked: false },
        { id: 'resist_50', name: 'Resistance Hero', desc: 'Resist 50 cravings', icon: '🦸', unlocked: false }
    ],

    // Chat history
    chatHistory: [],

    // Trusted contacts
    trustedContacts: [],

    // Initialize data from localStorage
    init() {
        const savedData = localStorage.getItem('rekindle_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                Object.assign(this.user, parsed.user || {});
                Object.assign(this.stats, parsed.stats || {});
                this.cravingLogs = parsed.cravingLogs || [];
                this.chatHistory = parsed.chatHistory || [];
                this.trustedContacts = parsed.trustedContacts || [];
                
                if (parsed.achievements) {
                    this.achievements.forEach((achievement, index) => {
                        if (parsed.achievements[index]) {
                            achievement.unlocked = parsed.achievements[index].unlocked;
                        }
                    });
                }
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
        
        // Calculate streaks
        this.updateStreaks();
    },

    // Save data to localStorage
    save() {
        const dataToSave = {
            user: this.user,
            stats: this.stats,
            cravingLogs: this.cravingLogs,
            chatHistory: this.chatHistory,
            trustedContacts: this.trustedContacts,
            achievements: this.achievements
        };
        
        try {
            localStorage.setItem('rekindle_data', JSON.stringify(dataToSave));
        } catch (e) {
            console.error('Error saving data:', e);
        }
    },

    // Update streaks based on logs
    updateStreaks() {
        const now = new Date();
        
        // Calculate smoking streak
        if (this.user.smokingStartDate) {
            const startDate = new Date(this.user.smokingStartDate);
            const daysDiff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
            this.stats.smokingStreak = Math.max(0, daysDiff);
        }
        
        // Calculate drinking streak
        if (this.user.drinkingStartDate) {
            const startDate = new Date(this.user.drinkingStartDate);
            const daysDiff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
            this.stats.drinkingStreak = Math.max(0, daysDiff);
        }

        // Calculate money saved (estimated)
        const smokingDailyCost = 100; // ₱100 per day
        const drinkingDailyCost = 150; // ₱150 per day
        
        this.stats.moneySaved = 
            (this.stats.smokingStreak * smokingDailyCost) +
            (this.stats.drinkingStreak * drinkingDailyCost);

        // Count resisted cravings
        this.stats.cravingsResisted = this.cravingLogs.filter(log => log.resisted).length;
        
        this.checkAchievements();
    },

    // Add a craving log
    addCravingLog(logData) {
        const log = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type: logData.type,
            intensity: logData.intensity,
            trigger: logData.trigger,
            notes: logData.notes || '',
            resisted: logData.resisted || false
        };
        
        this.cravingLogs.unshift(log);
        this.stats.totalLogs++;
        
        if (log.resisted) {
            this.stats.cravingsResisted++;
        }
        
        this.checkAchievements();
        this.save();
        
        return log;
    },

    // Check and unlock achievements
    checkAchievements() {
        let newlyUnlocked = [];

        // First day achievement
        if (!this.achievements[0].unlocked && 
            (this.stats.smokingStreak >= 1 || this.stats.drinkingStreak >= 1)) {
            this.achievements[0].unlocked = true;
            newlyUnlocked.push(this.achievements[0]);
        }

        // Week warrior
        if (!this.achievements[1].unlocked && 
            (this.stats.smokingStreak >= 7 || this.stats.drinkingStreak >= 7)) {
            this.achievements[1].unlocked = true;
            newlyUnlocked.push(this.achievements[1]);
        }

        // Month master
        if (!this.achievements[2].unlocked && 
            (this.stats.smokingStreak >= 30 || this.stats.drinkingStreak >= 30)) {
            this.achievements[2].unlocked = true;
            newlyUnlocked.push(this.achievements[2]);
        }

        // Resist 10
        if (!this.achievements[3].unlocked && this.stats.cravingsResisted >= 10) {
            this.achievements[3].unlocked = true;
            newlyUnlocked.push(this.achievements[3]);
        }

        // Resist 50
        if (!this.achievements[4].unlocked && this.stats.cravingsResisted >= 50) {
            this.achievements[4].unlocked = true;
            newlyUnlocked.push(this.achievements[4]);
        }

        return newlyUnlocked;
    },

    // Add chat message
    addChatMessage(message, isBot = false) {
        const chatMessage = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            message: message,
            isBot: isBot
        };
        
        this.chatHistory.push(chatMessage);
        this.save();
        
        return chatMessage;
    },

    // Add trusted contact
    addTrustedContact(contact) {
        const newContact = {
            id: Date.now(),
            name: contact.name,
            phone: contact.phone,
            relationship: contact.relationship || 'Friend'
        };
        
        this.trustedContacts.push(newContact);
        this.save();
        
        return newContact;
    },

    // Remove trusted contact
    removeTrustedContact(contactId) {
        this.trustedContacts = this.trustedContacts.filter(c => c.id !== contactId);
        this.save();
    },

    // Update user settings
    updateSettings(settings) {
        Object.assign(this.user.settings, settings);
        this.save();
    },

    // Set journey start date
    setJourneyStartDate(type, date = new Date()) {
        if (type === 'smoking') {
            this.user.smokingStartDate = date.toISOString();
        } else if (type === 'drinking') {
            this.user.drinkingStartDate = date.toISOString();
        }
        
        this.updateStreaks();
        this.save();
    },

    // Reset all data
    resetAllData() {
        if (confirm('Are you sure you want to reset all your data? This cannot be undone.')) {
            localStorage.removeItem('rekindle_data');
            
            // Reset to defaults
            this.user = {
                name: 'Friend',
                language: 'en',
                smokingStartDate: null,
                drinkingStartDate: null,
                settings: {
                    notifications: true,
                    sound: true
                }
            };
            
            this.stats = {
                smokingStreak: 0,
                drinkingStreak: 0,
                moneySaved: 0,
                cravingsResisted: 0,
                totalLogs: 0
            };
            
            this.cravingLogs = [];
            this.chatHistory = [];
            this.trustedContacts = [];
            
            this.achievements.forEach(achievement => {
                achievement.unlocked = false;
            });
            
            // Reload page
            location.reload();
        }
    },

    // Get recent logs
    getRecentLogs(limit = 10) {
        return this.cravingLogs.slice(0, limit);
    },

    // Get logs by type
    getLogsByType(type) {
        return this.cravingLogs.filter(log => log.type === type || log.type === 'both');
    },

    // Get achievement progress
    getAchievementProgress() {
        const total = this.achievements.length;
        const unlocked = this.achievements.filter(a => a.unlocked).length;
        return {
            total,
            unlocked,
            percentage: Math.round((unlocked / total) * 100)
        };
    }
};

// Initialize data on load
document.addEventListener('DOMContentLoaded', () => {
    AppData.init();
    
    // Set initial journey dates if not set
    if (!AppData.user.smokingStartDate) {
        AppData.setJourneyStartDate('smoking', new Date());
    }
    if (!AppData.user.drinkingStartDate) {
        AppData.setJourneyStartDate('drinking', new Date());
    }
});