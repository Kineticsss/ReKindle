// ===================================
// ENHANCED FEATURES JAVASCRIPT
// Add to app.js or create as separate file
// ===================================

const EnhancedFeatures = {
    init() {
        this.setupOnboarding();
        this.setupTabs();
        this.setupFAQ();
        this.setupAccessibility();
        this.setupBackToTop();
    },

    // ===================================
    // ONBOARDING
    // ===================================
    setupOnboarding() {
        const onboardingForm = document.getElementById('onboardingForm');
        
        // Check if user has completed onboarding
        const hasOnboarded = localStorage.getItem('rekindle_onboarded');
        
        if (!hasOnboarded) {
            // Show onboarding modal
            setTimeout(() => {
                Navigation.openModal('onboardingModal');
            }, 500);
        }
        
        if (onboardingForm) {
            // Set max date to today
            const startDateInput = document.getElementById('startDate');
            if (startDateInput) {
                const today = new Date().toISOString().split('T')[0];
                startDateInput.setAttribute('max', today);
                startDateInput.value = today;
            }
            
            onboardingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleOnboarding();
            });
        }
    },

    handleOnboarding() {
        const name = document.getElementById('onboardingName').value;
        const goals = Array.from(document.querySelectorAll('input[name="goal"]:checked'))
            .map(cb => cb.value);
        const motivation = document.getElementById('motivationReason').value;
        const startDate = document.getElementById('startDate').value;
        
        // Validate
        if (!name || goals.length === 0) {
            Navigation.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Save to AppData
        AppData.user.name = name;
        AppData.user.motivation = motivation;
        
        if (goals.includes('smoking')) {
            AppData.user.smokingStartDate = new Date(startDate).toISOString();
        }
        
        if (goals.includes('drinking')) {
            AppData.user.drinkingStartDate = new Date(startDate).toISOString();
        }
        
        AppData.updateStreaks();
        AppData.save();
        
        // Mark as onboarded
        localStorage.setItem('rekindle_onboarded', 'true');
        
        // Close modal
        Navigation.closeModal('onboardingModal');
        
        // Show welcome
        Navigation.showNotification(`Welcome, ${name}! Your journey begins now. 🚀`, 'success', 4000);
        
        // Update display
        if (window.App) {
            App.updateDashboard();
        }
    },

    // ===================================
    // TABBED INTERFACE
    // ===================================
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab);
                
                // Update ARIA attributes
                tabButtons.forEach(btn => {
                    btn.setAttribute('aria-selected', 'false');
                    btn.classList.remove('active');
                });
                button.setAttribute('aria-selected', 'true');
                button.classList.add('active');
            });
            
            // Keyboard navigation
            button.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    const buttons = Array.from(tabButtons);
                    const currentIndex = buttons.indexOf(button);
                    let nextIndex;
                    
                    if (e.key === 'ArrowRight') {
                        nextIndex = (currentIndex + 1) % buttons.length;
                    } else {
                        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
                    }
                    
                    buttons[nextIndex].click();
                    buttons[nextIndex].focus();
                }
            });
        });
    },

    switchTab(tabName) {
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Show selected tab
        const targetContent = document.getElementById(`tab-${tabName}`);
        if (targetContent) {
            targetContent.classList.add('active');
            
            // Update content based on tab
            this.updateTabContent(tabName);
        }
    },

    updateTabContent(tabName) {
        switch(tabName) {
            case 'daily':
                this.updateDailyTab();
                break;
            case 'weekly':
                this.updateWeeklyTab();
                break;
            case 'monthly':
                this.updateMonthlyTab();
                break;
            case 'all':
                this.updateAllTimeTab();
                break;
        }
    },

    updateDailyTab() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayLogs = AppData.cravingLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            logDate.setHours(0, 0, 0, 0);
            return logDate.getTime() === today.getTime();
        });
        
        // Update stats
        const todayCravingsEl = document.getElementById('todayCravings');
        const todayResistedEl = document.getElementById('todayResisted');
        
        if (todayCravingsEl) {
            todayCravingsEl.textContent = todayLogs.length;
        }
        
        if (todayResistedEl) {
            todayResistedEl.textContent = todayLogs.filter(log => log.resisted).length;
        }
        
        // Update log list
        const todayLogHistory = document.getElementById('todayLogHistory');
        if (todayLogHistory) {
            if (todayLogs.length === 0) {
                todayLogHistory.innerHTML = '<p class="empty-state">No logs today yet. You\'re doing great! 🌟</p>';
            } else {
                todayLogHistory.innerHTML = '';
                todayLogs.forEach(log => {
                    todayLogHistory.innerHTML += CravingLog.formatLog(log);
                });
            }
        }
    },

    updateWeeklyTab() {
        // Placeholder for weekly data
        console.log('Weekly tab updated');
    },

    updateMonthlyTab() {
        // Already has content, just ensure it's current
        if (window.App) {
            App.updateMilestones();
        }
    },

    updateAllTimeTab() {
        // Update all-time logs
        if (window.App) {
            App.updateLogHistory();
            App.updateMilestones();
        }
    },

    // ===================================
    // FAQ COLLAPSIBLE
    // ===================================
    setupFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Close all other FAQs
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                    const btn = item.querySelector('.faq-question');
                    if (btn) {
                        btn.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current FAQ
                if (!isActive) {
                    faqItem.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                } else {
                    question.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Keyboard support
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    },

    // ===================================
    // ACCESSIBILITY FEATURES
    // ===================================
    setupAccessibility() {
        let textSize = 'normal'; // normal, large, xlarge, small
        
        // Text size controls
        const increaseBtn = document.getElementById('increaseText');
        const decreaseBtn = document.getElementById('decreaseText');
        const resetBtn = document.getElementById('resetText');
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                document.body.classList.remove('text-small', 'text-large', 'text-xlarge');
                
                if (textSize === 'normal') {
                    document.body.classList.add('text-large');
                    textSize = 'large';
                } else if (textSize === 'large') {
                    document.body.classList.add('text-xlarge');
                    textSize = 'xlarge';
                }
                
                localStorage.setItem('rekindle_textsize', textSize);
                Navigation.showNotification('Text size increased', 'success', 1500);
            });
        }
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                document.body.classList.remove('text-small', 'text-large', 'text-xlarge');
                
                if (textSize === 'normal') {
                    document.body.classList.add('text-small');
                    textSize = 'small';
                } else if (textSize === 'large') {
                    textSize = 'normal';
                } else if (textSize === 'xlarge') {
                    document.body.classList.add('text-large');
                    textSize = 'large';
                }
                
                localStorage.setItem('rekindle_textsize', textSize);
                Navigation.showNotification('Text size decreased', 'success', 1500);
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.body.classList.remove('text-small', 'text-large', 'text-xlarge');
                textSize = 'normal';
                localStorage.setItem('rekindle_textsize', textSize);
                Navigation.showNotification('Text size reset', 'success', 1500);
            });
        }
        
        // High contrast mode
        const highContrastBtn = document.getElementById('highContrast');
        if (highContrastBtn) {
            highContrastBtn.addEventListener('click', () => {
                document.body.classList.toggle('high-contrast');
                const isHighContrast = document.body.classList.contains('high-contrast');
                
                localStorage.setItem('rekindle_highcontrast', isHighContrast);
                Navigation.showNotification(
                    isHighContrast ? 'High contrast enabled' : 'High contrast disabled',
                    'success',
                    1500
                );
            });
        }
        
        // Load saved preferences
        const savedTextSize = localStorage.getItem('rekindle_textsize');
        if (savedTextSize && savedTextSize !== 'normal') {
            document.body.classList.add(`text-${savedTextSize}`);
            textSize = savedTextSize;
        }
        
        const savedHighContrast = localStorage.getItem('rekindle_highcontrast');
        if (savedHighContrast === 'true') {
            document.body.classList.add('high-contrast');
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + H = Help page
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                Navigation.navigateTo('help');
            }
            
            // Alt + D = Dashboard
            if (e.altKey && e.key === 'd') {
                e.preventDefault();
                Navigation.navigateTo('dashboard');
            }
            
            // Alt + L = Log craving
            if (e.altKey && e.key === 'l') {
                e.preventDefault();
                Navigation.openModal('cravingModal');
            }
            
            // Alt + B = Breathing exercise
            if (e.altKey && e.key === 'b') {
                e.preventDefault();
                Navigation.openModal('breathingModal');
            }
        });
    },

    // ===================================
    // BACK TO TOP BUTTON
    // ===================================
    setupBackToTop() {
        // Create back to top button
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopBtn);
        
        // Show/hide based on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },

    // ===================================
    // FORM VALIDATION
    // ===================================
    validateForm(formElement) {
        let isValid = true;
        const inputs = formElement.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            // Remove previous error messages
            const existingError = input.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            input.classList.remove('input-error');
            
            // Check validity
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('input-error');
                
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                input.parentElement.appendChild(errorMsg);
            }
        });
        
        return isValid;
    },

    // ===================================
    // LOADING OVERLAY
    // ===================================
    showLoading(message = 'Loading...') {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.id = 'loadingOverlay';
        
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
    },

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.remove();
        }
    }
};

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', () => {
    EnhancedFeatures.init();
});

// Make available globally
if (typeof window !== 'undefined') {
    window.EnhancedFeatures = EnhancedFeatures;
}

// ===================================
// KEYBOARD SHORTCUTS HELP
// ===================================
console.log('%c🔥 ReKindle Keyboard Shortcuts 🔥', 'color: #8B5CF6; font-size: 14px; font-weight: bold;');
console.log('Alt + H: Open Help page');
console.log('Alt + D: Go to Dashboard');
console.log('Alt + L: Log a craving');
console.log('Alt + B: Start breathing exercise');
console.log('Esc: Close modals');
console.log('Arrow keys: Navigate tabs');