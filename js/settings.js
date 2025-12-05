const EnhancedSettings = {
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

        if (this.defaults.theme === 'auto') {
            this.applySystemTheme();
        }
    },

    saveSettings() {
        localStorage.setItem('rekindle_display_settings', JSON.stringify(this.defaults));

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

    setupEventListeners() {
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

        const notificationsToggle = document.getElementById('notificationsToggle');
        if (notificationsToggle) {
            notificationsToggle.checked = this.defaults.notifications;
            notificationsToggle.addEventListener('change', (e) => {
                this.defaults.notifications = e.target.checked;
                this.saveSettings();
            });
        }

        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.checked = this.defaults.sound;
            soundToggle.addEventListener('change', (e) => {
                this.defaults.sound = e.target.checked;
                this.saveSettings();
            });
        }

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

        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.exportData();
            });
        }

        const resetDataBtn = document.getElementById('resetDataBtn');
        if (resetDataBtn) {
            resetDataBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all your data? This cannot be undone.')) {
                    this.resetAllData();
                }
            });
        }

        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                if (this.defaults.theme === 'auto') {
                    this.applySystemTheme();
                }
            });
        }
    },

    applySettings() {
        this.applyTheme();
        this.applyTextSize();
        this.applyHighContrast();
        this.applyReducedMotion();
    },

    applyTheme() {
        const body = document.body;

        body.classList.remove('light-mode', 'dark-mode');
        
        if (this.defaults.theme === 'light') {
            body.classList.add('light-mode');
        } else if (this.defaults.theme === 'dark') {
            body.classList.add('dark-mode');
        } else if (this.defaults.theme === 'auto') {
            this.applySystemTheme();
        }
    },

    applySystemTheme() {
        const body = document.body;
        body.classList.remove('light-mode', 'dark-mode');
        
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            body.classList.add('light-mode');
        } else {
            body.classList.add('dark-mode');
        }
    },

    applyTextSize() {
        const body = document.body;

        body.classList.remove('text-small', 'text-normal', 'text-large', 'text-xlarge');

        if (this.defaults.textSize !== 'normal') {
            body.classList.add(`text-${this.defaults.textSize}`);
        }
    },

    applyHighContrast() {
        const body = document.body;
        
        if (this.defaults.highContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }
    },

    applyReducedMotion() {
        const body = document.body;
        
        if (this.defaults.reducedMotion) {
            body.classList.add('reduced-motion');
        } else {
            body.classList.remove('reduced-motion');
        }
    },

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

    resetAllData() {
        localStorage.clear();
        
        this.defaults = {
            theme: 'dark',
            textSize: 'normal',
            highContrast: false,
            reducedMotion: false,
            notifications: true,
            sound: true,
            language: 'en'
        };

        Navigation.showNotification('All data has been reset. Reloading...', 'success', 2000);
        
        setTimeout(() => {
            location.reload();
        }, 2000);
    },

    getSettings() {
        return { ...this.defaults };
    },

    updateSetting(key, value) {
        if (this.defaults.hasOwnProperty(key)) {
            this.defaults[key] = value;
            this.saveSettings();

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

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        EnhancedSettings.init();
    }, 100);
});

if (typeof window !== 'undefined') {
    window.EnhancedSettings = EnhancedSettings;
}

function openSettingsModal() {
    Navigation.openModal('settingsModal');

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
    if (languageSelect) {
        languageSelect.value = this.defaults.language;
        languageSelect.addEventListener('change', (e) => {
            this.defaults.language = e.target.value;
            AppData.user.language = e.target.value;
            this.saveSettings();
            AppData.save();

            if (window.Translations) {
                Translations.setLanguage(e.target.value);
            }
            
            Navigation.showNotification('Language updated!', 'success', 2000);
        });
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
        if (window.DEMO_MODE && window.DEMO_MODE.enabled) {
            this.addDemoModeSection();
            this.addDemoModeIndicator();
        }
    },

    addDemoModeSection() {
        const settingsContent = document.querySelector('.settings-content');
        if (!settingsContent) return;

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

        const aboutSection = Array.from(settingsContent.children)
            .find(section => section.querySelector('h3')?.textContent === 'About');
        
        if (aboutSection) {
            settingsContent.insertBefore(demoSection, aboutSection);
        } else {
            settingsContent.appendChild(demoSection);
        }

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
        const settingsBtn = document.getElementById('settingsBtn');
        if (!settingsBtn) return;

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

        const style = document.createElement('style');
        style.textContent = `
            @keyframes demoPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);

        settingsBtn.style.position = 'relative';
        settingsBtn.appendChild(indicator);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        DemoModeIndicator.init();
    }, 1000);
});

window.DemoModeIndicator = DemoModeIndicator;