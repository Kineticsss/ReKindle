// ===================================
// NAVIGATION MODULE
// ===================================

const Navigation = {
    currentPage: 'dashboard',

    init() {
        this.setupNavLinks();
        this.setupMenuToggle();
        this.setupModals();
    },

    // Setup navigation links
    setupNavLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateTo(page);
                
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                navMenu.classList.remove('active');
            });
        });
    },

    // Navigate to a page
    navigateTo(pageName) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        
        // Show selected page
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.classList.add('page-enter');
            
            // Remove animation class after completion
            setTimeout(() => {
                targetPage.classList.remove('page-enter');
            }, 400);
        }
        
        // Update active nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        this.currentPage = pageName;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update page content if needed
        this.updatePageContent(pageName);
    },

    // Update page content when navigating
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
                // Motivation page is static, no updates needed
                break;
            case 'calmbot':
                // Chat page maintains its state
                break;
            case 'emergency':
                // Emergency page is static
                break;
        }
    },

    // Setup mobile menu toggle
    setupMenuToggle() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    },

    // Setup modal controls
    setupModals() {
        // Close modal buttons
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-modal');
                this.closeModal(modalId);
            });
        });
        
        // Close modal when clicking outside
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.closeModal(activeModal.id);
                }
            }
        });
    },

    // Open modal
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus first input if exists
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    },

    // Close modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset forms in modal
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    },

    // Show notification
    showNotification(message, type = 'success', duration = 3000) {
        // Create notification element
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
        
        // Remove after duration
        setTimeout(() => {
            notification.classList.add('notification-exit');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    },

    // Confirm dialog
    confirm(message, callback) {
        if (confirm(message)) {
            callback();
        }
    }
};

// Quick action button handlers
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
    
    // Log craving button
    const logCravingBtn = document.getElementById('logCravingBtn');
    if (logCravingBtn) {
        logCravingBtn.addEventListener('click', () => {
            Navigation.openModal('cravingModal');
        });
    }
    
    // Breathing button
    const breathingBtn = document.getElementById('breathingBtn');
    if (breathingBtn) {
        breathingBtn.addEventListener('click', () => {
            Navigation.openModal('breathingModal');
        });
    }
    
    // Quick motivation button
    const motivationQuickBtn = document.getElementById('motivationQuickBtn');
    if (motivationQuickBtn) {
        motivationQuickBtn.addEventListener('click', () => {
            Navigation.navigateTo('motivation');
        });
    }
    
    // Settings button
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            Navigation.openModal('settingsModal');
            
            // Populate settings
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
    
    // Emergency breathing button
    const breathingEmergency = document.querySelector('.breathing-emergency');
    if (breathingEmergency) {
        breathingEmergency.addEventListener('click', () => {
            Navigation.openModal('breathingModal');
        });
    }
    
    // Emergency calmbot button
    const calmbotEmergency = document.querySelector('.calmbot-emergency');
    if (calmbotEmergency) {
        calmbotEmergency.addEventListener('click', () => {
            Navigation.navigateTo('calmbot');
        });
    }
    
    // Settings form handling
    const userNameInput = document.getElementById('userNameInput');
    if (userNameInput) {
        userNameInput.addEventListener('change', (e) => {
            AppData.user.name = e.target.value || 'Friend';
            AppData.save();
            
            // Update display
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
    
    // Reset data button
    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', () => {
            AppData.resetAllData();
        });
    }
    
    // Add contact button
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
                    
                    // Update contacts list
                    if (window.App) {
                        window.App.updateEmergencyPage();
                    }
                }
            }
        });
    }
});

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Navigation = Navigation;
}