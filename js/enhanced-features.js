const EnhancedFeatures = {
    init() {
        this.setupOnboarding();
        this.setupTabs();
        this.setupFAQ();
        this.setupAccessibility();
        this.setupBackToTop();
    },

    setupOnboarding() {
        const onboardingForm = document.getElementById('onboardingForm');

        const hasOnboarded = localStorage.getItem('rekindle_onboarded');
        
        if (!hasOnboarded) {
            setTimeout(() => {
                Navigation.openModal('onboardingModal');
            }, 500);
        }
        
        if (onboardingForm) {
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

        if (!name || goals.length === 0) {
            Navigation.showNotification('Please fill in all required fields', 'error');
            return;
        }

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

        localStorage.setItem('rekindle_onboarded', 'true');

        Navigation.closeModal('onboardingModal');

        Navigation.showNotification(`Welcome, ${name}! Your journey begins now. 🚀`, 'success', 4000);

        if (window.App) {
            App.updateDashboard();
        }
    },

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab);

                tabButtons.forEach(btn => {
                    btn.setAttribute('aria-selected', 'false');
                    btn.classList.remove('active');
                });
                button.setAttribute('aria-selected', 'true');
                button.classList.add('active');
            });

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
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        const targetContent = document.getElementById(`tab-${tabName}`);
        if (targetContent) {
            targetContent.classList.add('active');

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

    if (!AppData || !AppData.cravingLogs) {
        const todayCravingsEl = document.getElementById('todayCravings');
        const todayResistedEl = document.getElementById('todayResisted');
        const todayLogHistory = document.getElementById('todayLogHistory');
        
        if (todayCravingsEl) todayCravingsEl.textContent = '0';
        if (todayResistedEl) todayResistedEl.textContent = '0';
        if (todayLogHistory) {
            todayLogHistory.innerHTML = '<p class="empty-state">No logs today yet. You\'re doing great! 🌟</p>';
        }
        return;
    }
    
    const todayLogs = AppData.cravingLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === today.getTime();
    });

    const todayCravingsEl = document.getElementById('todayCravings');
    const todayResistedEl = document.getElementById('todayResisted');
    
    if (todayCravingsEl) {
        todayCravingsEl.textContent = todayLogs.length;
    }
    
    if (todayResistedEl) {
        todayResistedEl.textContent = todayLogs.filter(log => log.resisted).length;
    }

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
        if (!AppData || !AppData.cravingLogs || AppData.cravingLogs.length === 0) {
            const weeklyTotal = document.getElementById('weeklyTotal');
            const weeklyResisted = document.getElementById('weeklyResisted');
            const weeklyRate = document.getElementById('weeklyRate');
            const weeklyInsights = document.getElementById('weeklyInsights');
            
            if (weeklyTotal) weeklyTotal.textContent = '0';
            if (weeklyResisted) weeklyResisted.textContent = '0';
            if (weeklyRate) weeklyRate.textContent = '0%';
            if (weeklyInsights) {
                weeklyInsights.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: var(--space-md);">No data yet. Start logging to see insights!</p>';
            }

            const canvas = document.getElementById('weeklyChart');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
        }

        if (window.Charts && typeof window.Charts.renderWeeklyChart === 'function') {
            setTimeout(() => {
                window.Charts.renderWeeklyChart();
            }, 100);
        }
    },

    updateAllTimeTab() {
        if (!AppData || !AppData.cravingLogs || AppData.cravingLogs.length === 0) {
            const logHistory = document.getElementById('logHistory');
            if (logHistory) {
                logHistory.innerHTML = '<p class="empty-state">No logs yet. Start by logging your first craving!</p>';
            }

            const milestones = document.querySelectorAll('.milestone');
            milestones.forEach(milestone => {
                milestone.classList.remove('completed');
                milestone.classList.add('locked');
            });
            return;
        }

        if (window.App) {
            App.updateLogHistory();
            App.updateMilestones();
        }
    },

    setupFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');

                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                    const btn = item.querySelector('.faq-question');
                    if (btn) {
                        btn.setAttribute('aria-expanded', 'false');
                    }
                });

                if (!isActive) {
                    faqItem.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                } else {
                    question.setAttribute('aria-expanded', 'false');
                }
            });

            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    },

    setupAccessibility() {
        let textSize = 'normal';

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

        const savedTextSize = localStorage.getItem('rekindle_textsize');
        if (savedTextSize && savedTextSize !== 'normal') {
            document.body.classList.add(`text-${savedTextSize}`);
            textSize = savedTextSize;
        }
        
        const savedHighContrast = localStorage.getItem('rekindle_highcontrast');
        if (savedHighContrast === 'true') {
            document.body.classList.add('high-contrast');
        }

        document.addEventListener('keydown', (e) => {

            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                Navigation.navigateTo('help');
            }

            if (e.altKey && e.key === 'd') {
                e.preventDefault();
                Navigation.navigateTo('dashboard');
            }

            if (e.altKey && e.key === 'l') {
                e.preventDefault();
                Navigation.openModal('cravingModal');
            }

            if (e.altKey && e.key === 'b') {
                e.preventDefault();
                Navigation.openModal('breathingModal');
            }

            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                Navigation.navigateTo('motivation');
            }

            if (e.altKey && e.key === 'p') {
                e.preventDefault();
                Navigation.navigateTo('progress');
            }

            if (e.altKey && e.key === 'c') {
                e.preventDefault();
                Navigation.navigateTo('calmbot');
            }

            if (e.altKey && e.key === 'e') {
                e.preventDefault();
                Navigation.navigateTo('emergency');
            }

            if (e.altKey && e.key === 's') {
                e.preventDefault();
                Navigation.openModal('settingsModal');
            }

            if (e.key === 'Escape') {
                Navigation.closeAllModals();
            }
        });
    },

    setupBackToTop() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopBtn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },

    validateForm(formElement) {
        let isValid = true;
        const inputs = formElement.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            const existingError = input.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            input.classList.remove('input-error');

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

document.addEventListener('DOMContentLoaded', () => {
    EnhancedFeatures.init();
});

if (typeof window !== 'undefined') {
    window.EnhancedFeatures = EnhancedFeatures;
}

document.addEventListener('DOMContentLoaded', () => {
    const progressLink = document.querySelector('.nav-link[data-page="progress"]');
    if (progressLink) {
        progressLink.addEventListener('click', () => {
            setTimeout(() => {
                if (EnhancedFeatures?.updateDailyTab) {
                    EnhancedFeatures.updateDailyTab();
                }
            }, 200);
        });
    }
});

console.log('%c🔥 ReKindle Keyboard Shortcuts 🔥', 'color: #8B5CF6; font-size: 14px; font-weight: bold;');
console.log('Alt + H: Open Help page');
console.log('Alt + D: Go to Dashboard');
console.log('Alt + L: Log a craving');
console.log('Alt + B: Start breathing exercise');
console.log('Alt + M: Open motivation quotes');
console.log('Esc: Close modals');
console.log('Arrow keys: Navigate tabs');