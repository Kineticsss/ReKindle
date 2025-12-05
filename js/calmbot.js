// ===================================
// CALMBOT CHAT MODULE
// ===================================

const CalmBot = {
    responses: {
        struggling: [
            "I hear you. Cravings can be really tough. Remember, they're temporary - they usually pass in 5-10 minutes. What usually helps you get through them?",
            "It's okay to struggle. Every moment you're fighting is a moment you're getting stronger. Have you tried the breathing exercise? It might help calm your mind.",
            "I'm here with you. Struggling doesn't mean failing - it means you're trying, and that matters. What triggered this craving?",
            "You're being so brave by reaching out. Cravings are hard, but you've gotten through every single one before this. You can do it again."
        ],
        good: [
            "That's wonderful! I'm so proud of you. What's been helping you stay strong today?",
            "Amazing! Keep up the great work. Every good day is building toward a healthier you.",
            "I love hearing that! You're doing fantastic. Remember to celebrate these moments.",
            "That's the spirit! You're proof that recovery is possible. Keep going! 💪"
        ],
        tips: [
            "Here are some quick tips: 1) Distract yourself with an activity you enjoy, 2) Call a friend or trusted person, 3) Do the breathing exercise, 4) Drink water or have a healthy snack, 5) Go for a short walk. Which one sounds doable right now?",
            "When a craving hits: Delay - wait 10 minutes. Distract - do something else. Drink water - stay hydrated. Deep breathe - use our breathing tool. Which strategy would you like to try?",
            "Remember the 5 D's: Delay, Distract, Deep breathing, Drink water, Discuss with someone. Want me to walk you through one of these?",
            "Physical activity can really help! Even 5 minutes of movement - walking, stretching, or dancing - can reduce cravings. Can you try moving your body a bit?"
        ],
        motivation: [
            "You are stronger than you know. Every day you choose recovery, you're choosing yourself. That's powerful! 💪",
            "Remember why you started this journey. You deserve a healthy, free life. And you're getting there, one day at a time.",
            "Progress isn't always linear, and that's okay. What matters is that you keep trying. I believe in you! 🌟",
            "Think about how far you've already come. That person who started this journey would be so proud of who you are today. Keep going! ✨",
            "You've already proven you can do hard things. This is just another challenge you'll overcome. I'm rooting for you! 🎯"
        ],
        default: [
            "I'm here to listen. Tell me what's on your mind.",
            "How can I support you today?",
            "I'm listening. What would you like to talk about?",
            "I'm here for you. What do you need right now?"
        ],
        gratitude: [
            "You're welcome! I'm always here when you need support. You're doing great! 😊",
            "Anytime! That's what I'm here for. Keep up the amazing work!",
            "I'm glad I could help. Remember, you're not alone in this journey. 💚"
        ],
        relapse: [
            "A slip doesn't erase all your progress. You're not back at square one - you've learned so much. What matters now is what you do next. Are you okay?",
            "Relapses can happen, and they don't define you. This is a learning opportunity, not a failure. Let's figure out what triggered it and how to move forward. You've got this.",
            "I know this feels hard right now, but progress isn't ruined by one setback. You've built so much strength already. Tomorrow is a new day to continue your journey. How can I help you right now?"
        ],
        emergency: [
            "If you're in crisis, please reach out to a professional immediately. You can call the NCMH Crisis Hotline at 0917-899-8727. You're important, and help is available. 💚",
            "I'm concerned about you. Please contact a crisis hotline or trusted person right away. NCMH: 0917-899-8727 | In Touch: (02) 8893-7603. You deserve support.",
            "Your safety is the priority. Please call a crisis line now: NCMH 0917-899-8727. I care about you, and professional help is available 24/7."
        ]
    },

    keywords: {
        struggling: ['struggling', 'hard', 'difficult', 'craving', 'want', 'need', 'urge'],
        good: ['good', 'great', 'fine', 'okay', 'well', 'better', 'happy'],
        tips: ['help', 'tip', 'advice', 'how', 'what can', 'cope', 'manage'],
        motivation: ['motivation', 'inspire', 'encourage', 'strength', 'keep going'],
        gratitude: ['thank', 'thanks', 'appreciate'],
        relapse: ['relapse', 'gave in', 'failed', 'messed up', 'broke', 'used'],
        emergency: ['suicide', 'kill myself', 'hurt myself', 'die', 'end it']
    },

    init() {
        this.setupChat();
        this.setupQuickResponses();
    },

    // Setup chat functionality
    setupChat() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    },

    // Setup quick response buttons
    setupQuickResponses() {
        const quickBtns = document.querySelectorAll('.quick-response-btn');

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const responseType = btn.getAttribute('data-response');
                this.handleQuickResponse(responseType);
            });
        });
    },

    // Send user message
    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();

        if (!message) return;

        // Add user message
        this.addMessage(message, false);

        // Clear input
        chatInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Get bot response after delay
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, true);
        }, 1000 + Math.random() * 1000); // Random delay for realism
    },

    // Handle quick response buttons
    handleQuickResponse(type) {
        const messages = {
            struggling: "I'm struggling with cravings right now.",
            good: "I'm doing well today!",
            tips: "Can you give me some coping tips?",
            motivation: "I need some motivation."
        };

        const userMessage = messages[type];
        this.addMessage(userMessage, false);

        // Show typing indicator
        this.showTypingIndicator();

        // Get response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.getResponseByType(type);
            this.addMessage(response, true);
        }, 1000);
    },

    // Add message to chat
    addMessage(message, isBot) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isBot ? 'bot' : 'user'}`;

        messageDiv.innerHTML = `
            <div class="message-avatar">${isBot ? '🤖' : '👤'}</div>
            <div class="message-bubble">
                <p>${message}</p>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Save to history
        AppData.addChatMessage(message, isBot);
    },

    // Show typing indicator
    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing-indicator-msg';
        typingDiv.id = 'typingIndicator';

        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-bubble">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },

    // Hide typing indicator
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    },

    // Generate response based on message
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Check for emergency keywords first
        if (this.containsKeywords(lowerMessage, this.keywords.emergency)) {
            return this.getRandomResponse(this.responses.emergency);
        }

        // Check for relapse keywords
        if (this.containsKeywords(lowerMessage, this.keywords.relapse)) {
            return this.getRandomResponse(this.responses.relapse);
        }

        // Check for gratitude
        if (this.containsKeywords(lowerMessage, this.keywords.gratitude)) {
            return this.getRandomResponse(this.responses.gratitude);
        }

        // Check for struggling
        if (this.containsKeywords(lowerMessage, this.keywords.struggling)) {
            return this.getRandomResponse(this.responses.struggling);
        }

        // Check for tips
        if (this.containsKeywords(lowerMessage, this.keywords.tips)) {
            return this.getRandomResponse(this.responses.tips);
        }

        // Check for motivation
        if (this.containsKeywords(lowerMessage, this.keywords.motivation)) {
            return this.getRandomResponse(this.responses.motivation);
        }

        // Check for good/positive
        if (this.containsKeywords(lowerMessage, this.keywords.good)) {
            return this.getRandomResponse(this.responses.good);
        }

        // Add stats if user asks about progress
        if (lowerMessage.includes('progress') || lowerMessage.includes('stats') || lowerMessage.includes('streak')) {
            return this.generateStatsResponse();
        }

        // Default response
        return this.getRandomResponse(this.responses.default);
    },

    // Get response by type
    getResponseByType(type) {
        if (this.responses[type]) {
            return this.getRandomResponse(this.responses[type]);
        }
        return this.getRandomResponse(this.responses.default);
    },

    // Check if message contains keywords
    containsKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    },

    // Get random response from array
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    },

    // Generate stats response
    generateStatsResponse() {
        const stats = AppData.stats;
        let response = "Let me share your progress with you! 📊\n\n";

        if (stats.smokingStreak > 0) {
            response += `🚭 You've been smoke-free for ${stats.smokingStreak} days! `;
        }

        if (stats.drinkingStreak > 0) {
            response += `🍃 You've been alcohol-free for ${stats.drinkingStreak} days! `;
        }

        if (stats.cravingsResisted > 0) {
            response += `\n\n💪 You've resisted ${stats.cravingsResisted} cravings so far. That's incredible strength!`;
        }

        if (stats.moneySaved > 0) {
            response += `\n\n💰 You've saved ₱${stats.moneySaved} by staying clean. Think about what you could do with that!`;
        }

        response += "\n\nYou should be really proud of yourself. Keep up the amazing work! 🌟";

        return response;
    },

    // Load chat history
    loadChatHistory() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        // Clear existing messages except the initial one
        const initialMessage = chatMessages.querySelector('.chat-message');
        chatMessages.innerHTML = '';
        if (initialMessage) {
            chatMessages.appendChild(initialMessage);
        }

        // Load history
        AppData.chatHistory.forEach(msg => {
            this.addMessage(msg.message, msg.isBot);
        });
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    CalmBot.init();
});

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.CalmBot = CalmBot;
}