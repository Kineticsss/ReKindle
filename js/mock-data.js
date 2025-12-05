// ===================================
// MOCK DATA FOR VIDEO PRESENTATION
// ===================================
// Run this in the browser console OR add it as a script tag before app.js
// This will populate the app with realistic demo data

function loadMockData() {
    console.log('Loading mock data for presentation...');
    
    // Set user information
    AppData.user.name = 'Alex';
    AppData.user.language = 'en';
    
    // Set journey start dates (14 days ago for smoking, 10 days ago for drinking)
    const now = new Date();
    const smokingStart = new Date(now);
    smokingStart.setDate(smokingStart.getDate() - 14);
    AppData.user.smokingStartDate = smokingStart.toISOString();
    
    const drinkingStart = new Date(now);
    drinkingStart.setDate(drinkingStart.getDate() - 10);
    AppData.user.drinkingStartDate = drinkingStart.toISOString();
    
    // Add mock craving logs
    const mockLogs = [
        {
            timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            type: 'smoking',
            intensity: 7,
            trigger: 'stress',
            notes: 'Had a tough meeting at work. Really wanted to smoke but used breathing exercise instead.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
            type: 'drinking',
            intensity: 5,
            trigger: 'social',
            notes: 'Friends invited me out. Felt the urge but ordered juice instead.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
            type: 'smoking',
            intensity: 8,
            trigger: 'habit',
            notes: 'After lunch break, usually my smoking time.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000).toISOString(), // Yesterday evening
            type: 'both',
            intensity: 6,
            trigger: 'boredom',
            notes: 'Watching TV at home, feeling restless.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            type: 'drinking',
            intensity: 9,
            trigger: 'emotion',
            notes: 'Had a bad day. Really struggled but talked to CalmBot.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            type: 'smoking',
            intensity: 4,
            trigger: 'stress',
            notes: 'Light craving during commute.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
            type: 'smoking',
            intensity: 7,
            trigger: 'social',
            notes: 'Coworker was smoking nearby.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            type: 'drinking',
            intensity: 8,
            trigger: 'social',
            notes: 'Birthday party, everyone was drinking.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
            type: 'both',
            intensity: 6,
            trigger: 'habit',
            notes: 'Weekend routine, usually drink and smoke.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
            type: 'smoking',
            intensity: 5,
            trigger: 'boredom',
            notes: 'Just felt like it, no specific reason.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
            type: 'drinking',
            intensity: 7,
            trigger: 'stress',
            notes: 'Work deadline pressure.',
            resisted: false
        },
        {
            timestamp: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
            type: 'smoking',
            intensity: 9,
            trigger: 'emotion',
            notes: 'Argument with family member. This was really hard.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
            type: 'smoking',
            intensity: 6,
            trigger: 'habit',
            notes: 'Morning coffee time.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(), // 11 days ago
            type: 'both',
            intensity: 8,
            trigger: 'social',
            notes: 'Friday night with friends.',
            resisted: true
        },
        {
            timestamp: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
            type: 'smoking',
            intensity: 5,
            trigger: 'boredom',
            notes: 'Waiting for bus.',
            resisted: true
        }
    ];
    
    // Clear existing logs and add mock logs
    AppData.cravingLogs = [];
    mockLogs.forEach(log => {
        AppData.cravingLogs.push({
            id: Date.now() + Math.random(),
            ...log
        });
    });
    
    // Add chat history with CalmBot
    AppData.chatHistory = [
        { message: "Hi there! I'm CalmBot, your supportive companion. How are you feeling today?", isBot: true },
        { message: "I'm feeling good today! 2 weeks smoke-free!", isBot: false },
        { message: "That's wonderful! I'm so proud of you. What's been helping you stay strong today?", isBot: true },
        { message: "The breathing exercises really help when I get cravings", isBot: false },
        { message: "That's fantastic! You've found what works for you. Keep it up! 💪", isBot: true }
    ];
    
    // Unlock some achievements
    AppData.achievements[0].unlocked = true; // First Day
    AppData.achievements[1].unlocked = true; // Week Warrior
    AppData.achievements[3].unlocked = true; // Resist 10
    
    // Add trusted contacts
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
    
    // Update stats
    AppData.updateStreaks();
    
    // Save everything
    AppData.save();
    
    // Refresh the display
    if (window.App) {
        App.updateDashboard();
        App.updateProgressPage();
        App.updateEmergencyPage();
    }
    
    console.log('✅ Mock data loaded successfully!');
    console.log('📊 Stats:', AppData.stats);
    console.log('📝 Logs:', AppData.cravingLogs.length, 'entries');
    console.log('🏆 Achievements unlocked:', AppData.achievements.filter(a => a.unlocked).length);
    
    // Show success notification
    if (window.Navigation) {
        Navigation.showNotification('Demo data loaded! Ready for presentation 🎬', 'success', 4000);
    }
}

// Auto-load on page load (comment out after presentation)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Uncomment the line below to auto-load mock data
        loadMockData();
    }, 500);
});

// Make function available in console
window.loadMockData = loadMockData;

console.log('💡 To load demo data, run: loadMockData()');