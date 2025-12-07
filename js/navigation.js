const Navigation = {
    currentPage: 'dashboard',

    init() {
        this.setupNavLinks();
        this.setupMenuToggle();
        this.setupModals();
    },

    setupNavLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateTo(page);
                
                const navMenu = document.getElementById('navMenu');
                navMenu.classList.remove('active');
            });
        });
    },

    navigateTo(pageName) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.classList.add('page-enter');
            
            setTimeout(() => {
                targetPage.classList.remove('page-enter');
            }, 400);
        }
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        this.currentPage = pageName;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        this.updatePageContent(pageName);
    },

    updatePageContent(pageName) {
        switch(pageName) {
            case 'dashboard':
                if (window.App) {
                    window.App.updateDashboard();
                }
                break;
            case 'progress':
                if (window.App) {
                    window.App.updateProgressPage();
                }
                break;
            case 'motivation':
                break;
            case 'calmbot':
                break;
            case 'emergency':
                break;
        }
    },

    setupMenuToggle() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    },

    setupModals() {
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-modal');
                this.closeModal(modalId);
            });
        });

        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.closeModal(activeModal.id);
                }
            }
        });
    },

    openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

    if (modalId === 'cravingModal') {
        const intensitySlider = document.getElementById('cravingIntensity');
        const intensityValue = document.getElementById('intensityValue');
        if (intensitySlider && intensityValue) {
            intensityValue.textContent = intensitySlider.value;
        }
    }

        const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    },
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    },

    showNotification(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} notification-enter`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: ${type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            max-width: 300px;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('notification-exit');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    },

    confirm(message, callback) {
        if (confirm(message)) {
            callback();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();

    const logCravingBtn = document.getElementById('logCravingBtn');
    if (logCravingBtn) {
        logCravingBtn.addEventListener('click', () => {
            Navigation.openModal('cravingModal');
        });
    }

    const breathingBtn = document.getElementById('breathingBtn');
    if (breathingBtn) {
        breathingBtn.addEventListener('click', () => {
            Navigation.openModal('breathingModal');
        });
    }

    const motivationQuickBtn = document.getElementById('motivationQuickBtn');
    if (motivationQuickBtn) {
        motivationQuickBtn.addEventListener('click', () => {
            Navigation.navigateTo('motivation');
        });
    }

    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            Navigation.openModal('settingsModal');

            const userNameInput = document.getElementById('userNameInput');
            if (userNameInput) {
                userNameInput.value = AppData.user.name;
            }
            
            const languageSelect = document.getElementById('languageSelect');
            if (languageSelect) {
                languageSelect.value = AppData.user.language;
            }
            
            const notificationsToggle = document.getElementById('notificationsToggle');
            if (notificationsToggle) {
                notificationsToggle.checked = AppData.user.settings.notifications;
            }
            
            const soundToggle = document.getElementById('soundToggle');
            if (soundToggle) {
                soundToggle.checked = AppData.user.settings.sound;
            }
        });
    }

    const breathingEmergency = document.querySelector('.breathing-emergency');
    if (breathingEmergency) {
        breathingEmergency.addEventListener('click', () => {
            Navigation.openModal('breathingModal');
        });
    }

    const calmbotEmergency = document.querySelector('.calmbot-emergency');
    if (calmbotEmergency) {
        calmbotEmergency.addEventListener('click', () => {
            Navigation.navigateTo('calmbot');
        });
    }

    const userNameInput = document.getElementById('userNameInput');
    if (userNameInput) {
        userNameInput.addEventListener('change', (e) => {
            AppData.user.name = e.target.value || 'Friend';
            AppData.save();

            const userNameDisplay = document.getElementById('userName');
            if (userNameDisplay) {
                userNameDisplay.textContent = AppData.user.name;
            }
            
            Navigation.showNotification('Name updated!', 'success');
        });
    }
    
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            AppData.user.language = e.target.value;
            AppData.save();
            Navigation.showNotification('Language updated!', 'success');
        });
    }
    
    const notificationsToggle = document.getElementById('notificationsToggle');
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', (e) => {
            AppData.user.settings.notifications = e.target.checked;
            AppData.save();
        });
    }
    
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('change', (e) => {
            AppData.user.settings.sound = e.target.checked;
            AppData.save();
        });
    }

    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', () => {
            AppData.resetAllData();
        });
    }

    const addContactBtn = document.getElementById('addContactBtn');
    if (addContactBtn) {
        addContactBtn.addEventListener('click', () => {
            const name = prompt('Contact name:');
            if (name) {
                const phone = prompt('Contact phone number:');
                if (phone) {
                    const relationship = prompt('Relationship (e.g., Friend, Family):') || 'Friend';
                    
                    AppData.addTrustedContact({
                        name,
                        phone,
                        relationship
                    });
                    
                    Navigation.showNotification('Contact added!', 'success');

                    if (window.App) {
                        window.App.updateEmergencyPage();
                    }
                }
            }
        });
    }
});

if (typeof window !== 'undefined') {
    window.Navigation = Navigation;
}