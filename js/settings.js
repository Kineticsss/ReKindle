const EnhancedSettings = {
    // Default settings
    defaults: {
        theme: 'dark',
        textSize: 'normal',
        highContrast: false,
        reducedMotion: false,
        notifications: true,
        sound: true,
        language: 'en'
    },

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.applySettings();
    },

    // Load settings from localStorage
    loadSettings() {
        const saved = localStorage.getItem('rekindle_display_settings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                Object.assign(this.defaults, settings);
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
        
        // Also check for system preference
        if (this.defaults.theme === 'auto') {
            this.applySystemTheme();
        }
    },

    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('rekindle_display_settings', JSON.stringify(this.defaults));
        
        // Also save to AppData for compatibility
        if (typeof AppData !== 'undefined') {
            AppData.user.settings = {
                ...AppData.user.settings,
                theme: this.defaults.theme,
                textSize: this.defaults.textSize,
                highContrast: this.defaults.highContrast,
                reducedMotion: this.defaults.reducedMotion,
                notifications: this.defaults.notifications,
                sound: this.defaults.sound
            };
            AppData.save();
        }
    },

    // Setup all event listeners
    setupEventListeners() {
        // Theme selector
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = this.defaults.theme;
            themeSelect.addEventListener('change', (e) => {
                this.defaults.theme = e.target.value;
                this.applyTheme();
                this.saveSettings();
                Navigation.showNotification('Theme updated!', 'success', 2000);
            });
        }

        // Text size selector
        const textSizeSelect = document.getElementById('textSizeSelect');
        if (textSizeSelect) {
            textSizeSelect.value = this.defaults.textSize;
            textSizeSelect.addEventListener('change', (e) => {
                this.defaults.textSize = e.target.value;
                this.applyTextSize();
                this.saveSettings();
                Navigation.showNotification('Text size updated!', 'success', 2000);
            });
        }

        // High contrast toggle
        const highContrastToggle = document.getElementById('highContrastToggle');
        if (highContrastToggle) {
            highContrastToggle.checked = this.defaults.highContrast;
            highContrastToggle.addEventListener('change', (e) => {
                this.defaults.highContrast = e.target.checked;
                this.applyHighContrast();
                this.saveSettings();
                Navigation.showNotification(
                    e.target.checked ? 'High contrast enabled' : 'High contrast disabled',
                    'success',
                    2000
                );
            });
        }

        // Reduced motion toggle
        const reducedMotionToggle = document.getElementById('reducedMotionToggle');
        if (reducedMotionToggle) {
            reducedMotionToggle.checked = this.defaults.reducedMotion;
            reducedMotionToggle.addEventListener('change', (e) => {
                this.defaults.reducedMotion = e.target.checked;
                this.applyReducedMotion();
                this.saveSettings();
                Navigation.showNotification(
                    e.target.checked ? 'Animations reduced' : 'Animations enabled',
                    'success',
                    2000
                );
            });
        }

        // Notifications toggle
        const notificationsToggle = document.getElementById('notificationsToggle');
        if (notificationsToggle) {
            notificationsToggle.checked = this.defaults.notifications;
            notificationsToggle.addEventListener('change', (e) => {
                this.defaults.notifications = e.target.checked;
                this.saveSettings();
            });
        }

        // Sound toggle
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.checked = this.defaults.sound;
            soundToggle.addEventListener('change', (e) => {
                this.defaults.sound = e.target.checked;
                this.saveSettings();
            });
        }

        // User name input
        const userNameInput = document.getElementById('userNameInput');
        if (userNameInput) {
            userNameInput.value = AppData.user.name;
            userNameInput.addEventListener('change', (e) => {
                AppData.user.name = e.target.value || 'Friend';
                AppData.save();
                
                const userNameDisplay = document.getElementById('userName');
                if (userNameDisplay) {
                    userNameDisplay.textContent = AppData.user.name;
                }
                
                Navigation.showNotification('Name updated!', 'success', 2000);
            });
        }

        // Language select
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.defaults.language;
            languageSelect.addEventListener('change', (e) => {
                this.defaults.language = e.target.value;
                AppData.user.language = e.target.value;
                this.saveSettings();
                AppData.save();
                Navigation.showNotification('Language updated!', 'success', 2000);
            });
        }

        // Export data button
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.exportData();
            });
        }

        // Reset data button
        const resetDataBtn = document.getElementById('resetDataBtn');
        if (resetDataBtn) {
            resetDataBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all your data? This cannot be undone.')) {
                    this.resetAllData();
                }
            });
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                if (this.defaults.theme === 'auto') {
                    this.applySystemTheme();
                }
            });
        }
    },

    // Apply all settings
    applySettings() {
        this.applyTheme();
        this.applyTextSize();
        this.applyHighContrast();
        this.applyReducedMotion();
    },

    // Apply theme
    applyTheme() {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('light-mode', 'dark-mode');
        
        if (this.defaults.theme === 'light') {
            body.classList.add('light-mode');
        } else if (this.defaults.theme === 'dark') {
            body.classList.add('dark-mode');
        } else if (this.defaults.theme === 'auto') {
            this.applySystemTheme();
        }
    },

    // Apply system theme preference
    applySystemTheme() {
        const body = document.body;
        body.classList.remove('light-mode', 'dark-mode');
        
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            body.classList.add('light-mode');
        } else {
            body.classList.add('dark-mode');
        }
    },

    // Apply text size
    applyTextSize() {
        const body = document.body;
        
        // Remove existing text size classes
        body.classList.remove('text-small', 'text-normal', 'text-large', 'text-xlarge');
        
        // Apply new text size
        if (this.defaults.textSize !== 'normal') {
            body.classList.add(`text-${this.defaults.textSize}`);
        }
    },

    // Apply high contrast
    applyHighContrast() {
        const body = document.body;
        
        if (this.defaults.highContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }
    },

    // Apply reduced motion
    applyReducedMotion() {
        const body = document.body;
        
        if (this.defaults.reducedMotion) {
            body.classList.add('reduced-motion');
        } else {
            body.classList.remove('reduced-motion');
        }
    },

    // Export data as JSON
    exportData() {
        const dataToExport = {
            user: AppData.user,
            stats: AppData.stats,
            cravingLogs: AppData.cravingLogs,
            achievements: AppData.achievements,
            trustedContacts: AppData.trustedContacts,
            settings: this.defaults,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `rekindle-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        Navigation.showNotification('Data exported successfully!', 'success', 3000);
    },

    // Reset all data
    resetAllData() {
        // Clear localStorage
        localStorage.clear();
        
        // Reset settings to defaults
        this.defaults = {
            theme: 'dark',
            textSize: 'normal',
            highContrast: false,
            reducedMotion: false,
            notifications: true,
            sound: true,
            language: 'en'
        };
        
        // Reload page
        Navigation.showNotification('All data has been reset. Reloading...', 'success', 2000);
        
        setTimeout(() => {
            location.reload();
        }, 2000);
    },

    // Get current settings
    getSettings() {
        return { ...this.defaults };
    },

    // Update specific setting
    updateSetting(key, value) {
        if (this.defaults.hasOwnProperty(key)) {
            this.defaults[key] = value;
            this.saveSettings();
            
            // Apply the specific setting
            switch(key) {
                case 'theme':
                    this.applyTheme();
                    break;
                case 'textSize':
                    this.applyTextSize();
                    break;
                case 'highContrast':
                    this.applyHighContrast();
                    break;
                case 'reducedMotion':
                    this.applyReducedMotion();
                    break;
            }
        }
    }
};

// Initialize settings when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other modules to load
    setTimeout(() => {
        EnhancedSettings.init();
    }, 100);
});

// Make available globally
if (typeof window !== 'undefined') {
    window.EnhancedSettings = EnhancedSettings;
}

// ===================================
// SETTINGS BUTTON HANDLER
// Add this to navigation.js or keep here
// ===================================

// Open settings modal and populate values
function openSettingsModal() {
    Navigation.openModal('settingsModal');
    
    // Populate all form fields with current values
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect && EnhancedSettings) {
        themeSelect.value = EnhancedSettings.defaults.theme;
    }
    
    const textSizeSelect = document.getElementById('textSizeSelect');
    if (textSizeSelect && EnhancedSettings) {
        textSizeSelect.value = EnhancedSettings.defaults.textSize;
    }
    
    const highContrastToggle = document.getElementById('highContrastToggle');
    if (highContrastToggle && EnhancedSettings) {
        highContrastToggle.checked = EnhancedSettings.defaults.highContrast;
    }
    
    const reducedMotionToggle = document.getElementById('reducedMotionToggle');
    if (reducedMotionToggle && EnhancedSettings) {
        reducedMotionToggle.checked = EnhancedSettings.defaults.reducedMotion;
    }
    
    const userNameInput = document.getElementById('userNameInput');
    if (userNameInput && AppData) {
        userNameInput.value = AppData.user.name;
    }
    
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect && AppData) {
        languageSelect.value = AppData.user.language;
    }
    
    const notificationsToggle = document.getElementById('notificationsToggle');
    if (notificationsToggle && AppData) {
        notificationsToggle.checked = AppData.user.settings.notifications;
    }
    
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle && AppData) {
        soundToggle.checked = AppData.user.settings.sound;
    }
}

// Update settings button click handler in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettingsModal);
    }
});