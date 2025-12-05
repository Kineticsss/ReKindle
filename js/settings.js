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

const DemoModeIndicator = {
    init() {
        // Add demo mode section to settings if demo is enabled
        if (window.DEMO_MODE && window.DEMO_MODE.enabled) {
            this.addDemoModeSection();
            this.addDemoModeIndicator();
        }
    },

    addDemoModeSection() {
        // Find the app info section (last section)
        const settingsContent = document.querySelector('.settings-content');
        if (!settingsContent) return;

        // Create demo mode section
        const demoSection = document.createElement('div');
        demoSection.className = 'settings-section';
        demoSection.innerHTML = `
            <div class="section-header">
                <span class="section-icon">🎬</span>
                <h3>Demo Mode</h3>
            </div>
            
            <div class="setting-row" style="background: rgba(192, 132, 252, 0.1); border-color: rgba(192, 132, 252, 0.3);">
                <div class="setting-header">
                    <div class="setting-label">
                        <label>Demo Mode Active</label>
                        <p class="setting-hint">Mock data is loaded for presentation purposes</p>
                    </div>
                    <button class="action-button secondary-action" id="reloadDemoBtn" style="min-width: 160px;">
                        <span>🔄</span> Reload Demo
                    </button>
                </div>
            </div>

            <div class="setting-row">
                <div class="setting-header">
                    <div class="setting-label">
                        <label>Clear Demo Data</label>
                        <p class="setting-hint">Remove all demo data and start fresh</p>
                    </div>
                    <button class="action-button danger-action" id="clearDemoBtn" style="min-width: 160px;">
                        <span>🗑️</span> Clear Demo
                    </button>
                </div>
            </div>

            <div style="padding: 1rem; background: rgba(139, 92, 246, 0.1); border-radius: 0.5rem; border: 1px solid rgba(139, 92, 246, 0.2);">
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0; line-height: 1.6;">
                    <strong style="color: var(--primary-light);">💡 Note:</strong> 
                    Demo data automatically reloads on page refresh. 
                    To disable, set <code style="background: var(--bg-input); padding: 0.125rem 0.375rem; border-radius: 0.25rem;">DEMO_MODE.enabled = false</code> in mock-data.js
                </p>
            </div>
        `;

        // Insert before the About section
        const aboutSection = Array.from(settingsContent.children)
            .find(section => section.querySelector('h3')?.textContent === 'About');
        
        if (aboutSection) {
            settingsContent.insertBefore(demoSection, aboutSection);
        } else {
            settingsContent.appendChild(demoSection);
        }

        // Add event listeners
        const reloadDemoBtn = document.getElementById('reloadDemoBtn');
        const clearDemoBtn = document.getElementById('clearDemoBtn');

        if (reloadDemoBtn) {
            reloadDemoBtn.addEventListener('click', () => {
                if (window.loadMockData) {
                    Navigation.closeModal('settingsModal');
                    window.loadMockData();
                }
            });
        }

        if (clearDemoBtn) {
            clearDemoBtn.addEventListener('click', () => {
                Navigation.closeModal('settingsModal');
                if (window.clearDemoData) {
                    window.clearDemoData();
                }
            });
        }
    },

    addDemoModeIndicator() {
        // Add a small indicator badge to the settings button
        const settingsBtn = document.getElementById('settingsBtn');
        if (!settingsBtn) return;

        // Create demo indicator
        const indicator = document.createElement('span');
        indicator.className = 'demo-indicator';
        indicator.innerHTML = '🎬';
        indicator.title = 'Demo Mode Active';
        indicator.style.cssText = `
            position: absolute;
            top: -4px;
            right: -4px;
            font-size: 0.8rem;
            background: linear-gradient(135deg, #8B5CF6, #C084FC);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #1A1A2E;
            animation: demoPulse 2s ease infinite;
        `;

        // Add pulsing animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes demoPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);

        // Make settings button position relative
        settingsBtn.style.position = 'relative';
        settingsBtn.appendChild(indicator);
    }
};

// Initialize demo mode UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        DemoModeIndicator.init();
    }, 1000);
});

// Make available globally
window.DemoModeIndicator = DemoModeIndicator;