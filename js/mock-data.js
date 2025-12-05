const DEMO_MODE = {
    enabled: false,
    autoLoad: true,
    showConsoleInfo: true
};

function loadMockData() {
    console.log('🎬 Loading demo data for presentation...');
    
    const hasRealData = AppData.cravingLogs.length > 0 ||
                        AppData.stats.smokingStreak > 0 ||
                        AppData.stats.drinkingStreak > 0;
    
    if (hasRealData && !confirm('You have existing data. Replace with demo data?')) {
        console.log('❌ Demo data loading cancelled');
        return;
    }
    
    AppData.user.name = 'Alex';
    AppData.user.language = 'en';
    
    const now = new Date();
    const smokingStart = new Date(now);
    smokingStart.setDate(smokingStart.getDate() - 14);
    AppData.user.smokingStartDate = smokingStart.toISOString();
    
    const drinkingStart = new Date(now);
    drinkingStart.setDate(drinkingStart.getDate() - 10);
    AppData.user.drinkingStartDate = drinkingStart.toISOString();

    const mockLogs = [
        {
            timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
            type: 'smoking',
            intensity: 7,
            trigger: 'stress',
            notes: 'Had a tough meeting at work. Really wanted to smoke but used breathing exercise instead.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
            type: 'drinking',
            intensity: 5,
            trigger: 'social',
            notes: 'Friends invited me out. Felt the urge but ordered juice instead.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
            type: 'smoking',
            intensity: 8,
            trigger: 'habit',
            notes: 'After lunch break, usually my smoking time.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000).toISOString(),
            type: 'both',
            intensity: 6,
            trigger: 'boredom',
            notes: 'Watching TV at home, feeling restless.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'drinking',
            intensity: 9,
            trigger: 'emotion',
            notes: 'Had a bad day. Really struggled but talked to CalmBot.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'smoking',
            intensity: 4,
            trigger: 'stress',
            notes: 'Light craving during commute.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'smoking',
            intensity: 7,
            trigger: 'social',
            notes: 'Coworker was smoking nearby.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'drinking',
            intensity: 8,
            trigger: 'social',
            notes: 'Birthday party, everyone was drinking.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'both',
            intensity: 6,
            trigger: 'habit',
            notes: 'Weekend routine, usually drink and smoke.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'smoking',
            intensity: 5,
            trigger: 'boredom',
            notes: 'Just felt like it, no specific reason.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'drinking',
            intensity: 7,
            trigger: 'stress',
            notes: 'Work deadline pressure.',
            resisted: false
        },
        {
            timestamp: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'smoking',
            intensity: 9,
            trigger: 'emotion',
            notes: 'Argument with family member. This was really hard.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'smoking',
            intensity: 6,
            trigger: 'habit',
            notes: 'Morning coffee time.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'both',
            intensity: 8,
            trigger: 'social',
            notes: 'Friday night with friends.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'smoking',
            intensity: 5,
            trigger: 'boredom',
            notes: 'Waiting for bus.',
            resisted: true
        }
    ];

    AppData.cravingLogs = [];
    mockLogs.forEach(log => {
        AppData.cravingLogs.push({
            id: Date.now() + Math.random(),
            ...log
        });
    });

    AppData.chatHistory = [
        { message: "Hi there! I'm CalmBot, your supportive companion. How are you feeling today?", isBot: true },
        { message: "I'm feeling good today! 2 weeks smoke-free!", isBot: false },
        { message: "That's wonderful! I'm so proud of you. What's been helping you stay strong today?", isBot: true },
        { message: "The breathing exercises really help when I get cravings", isBot: false },
        { message: "That's fantastic! You've found what works for you. Keep it up! 💪", isBot: true }
    ];

    AppData.achievements[0].unlocked = true;
    AppData.achievements[1].unlocked = true;
    AppData.achievements[3].unlocked = true;

    AppData.trustedContacts = [
        {
            id: 1,
            name: 'Maria (Sister)',
            phone: '+63 917 123 4567',
            relationship: 'Family'
        },
        {
            id: 2,
            name: 'Juan (Best Friend)',
            phone: '+63 918 765 4321',
            relationship: 'Friend'
        }
    ];

    localStorage.setItem('rekindle_onboarded', 'true');
    localStorage.setItem('rekindle_welcomed', 'true');

    AppData.updateStreaks();

    AppData.save();

    if (window.App) {
        App.updateDashboard();
        App.updateProgressPage();
        App.updateEmergencyPage();
    }
    
    console.log('✅ Demo data loaded successfully!');
    console.log('📊 Stats:', AppData.stats);
    console.log('📝 Logs:', AppData.cravingLogs.length, 'entries');
    console.log('🏆 Achievements unlocked:', AppData.achievements.filter(a => a.unlocked).length);

    if (window.Navigation) {
        Navigation.showNotification('🎬 Demo data loaded! Ready for presentation', 'success', 4000);
    }
}

function clearDemoData() {
    if (confirm('Clear all demo data and start fresh?')) {
        if (typeof AppData !== 'undefined' && AppData.resetAllData) {
            AppData.resetAllData();
        } else {
            localStorage.clear();
            location.reload();
        }
    }
}

function toggleDemoMode(enable) {
    DEMO_MODE.enabled = enable;
    console.log(`🎬 Demo mode ${enable ? 'ENABLED' : 'DISABLED'}`);
    
    if (enable) {
        loadMockData();
    } else {
        console.log('💡 Refresh page to start with clean data');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (DEMO_MODE.enabled && DEMO_MODE.autoLoad) {
            const hasData = localStorage.getItem('rekindle_data');
            const isOnboarded = localStorage.getItem('rekindle_onboarded');

            if (!hasData || !isOnboarded) {
                console.log('🎬 Auto-loading demo data...');
                loadMockData();
            } else if (DEMO_MODE.showConsoleInfo) {
                console.log('ℹ️ Demo mode enabled but data exists. Use loadMockData() to replace.');
            }
        }

        if (DEMO_MODE.showConsoleInfo) {
            console.log('%c🔥 ReKindle Demo Controls 🔥', 'color: #8B5CF6; font-size: 16px; font-weight: bold;');
            console.log('%cAvailable Commands:', 'color: #A78BFA; font-size: 14px; font-weight: bold;');
            console.log('  loadMockData()      - Load demo data for presentation');
            console.log('  clearDemoData()     - Clear all data and start fresh');
            console.log('  toggleDemoMode(true/false) - Enable/disable demo mode');
            console.log('%cDemo Mode Status:', 'color: #A78BFA; font-size: 14px; font-weight: bold;');
            console.log('  ' + (DEMO_MODE.enabled ? '✅ ENABLED' : '❌ DISABLED'));
        }
    }, 500);
});

window.loadMockData = loadMockData;
window.clearDemoData = clearDemoData;
window.toggleDemoMode = toggleDemoMode;
window.DEMO_MODE = DEMO_MODE;