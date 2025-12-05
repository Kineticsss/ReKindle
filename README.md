# ReKindle - Recovery Companion App
## HCI Final Project

A companion web application designed to help users overcome addictive habits through motivational support and behavior tracking.

---

## 📁 Project Structure

```
rekindle-project/
│
├── index.html                 # Main HTML file
│
├── css/
│   ├── styles.css            # Main stylesheet (base styles, layout, navigation)
│   ├── components.css        # Component-specific styles (modals, cards, etc.)
│   ├── animations.css        # Animation keyframes and effects
│   ├── enhanced-features.css # Enhanced UI features and accessibility
│   └── light-mode.css        # Light mode theme styles
│
├── js/
│   ├── data.js              # Data management and localStorage
│   ├── navigation.js        # Page navigation and modal controls
│   ├── craving-log.js       # Craving logging functionality
│   ├── breathing.js         # Breathing exercise logic
│   ├── calmbot.js           # AI chatbot responses
│   ├── charts.js            # Weekly chart visualization
│   ├── enhanced-features.js # FAQ, tabs, accessibility
│   ├── settings.js          # Enhanced settings system
│   ├── translations.js      # Bilingual support (EN/FIL)
│   ├── mock-data.js         # Demo data for presentations
│   ├── interaction.js       # Additional interactions (placeholder)
│   └── app.js               # Main application initialization
│
└── README.md                 # This file
```

---

## ✨ Features Implemented

### 1. **Dashboard (Home Page)**
- Real-time statistics display (streaks, money saved, cravings resisted)
- Dual journey progress paths (smoking and drinking recovery)
- Quick action buttons for common tasks
- Recent achievements preview
- **Keyboard shortcuts (Alt+L, Alt+B, Alt+M)**

### 2. **Motivation Wall**
- Inspirational quotes and messages
- Community encouragement posts
- **Bilingual support (English/Filipino)**

### 3. **Progress Tracker**
- **Enhanced tabbed interface (Daily/Weekly/Monthly/All Time)**
- Health improvement metrics
- Visual milestone tracking
- Craving history log with detailed information
- **Interactive weekly chart with canvas rendering**
- **AI-generated weekly insights**
- **Today's summary with real-time stats**

### 4. **CalmBot (AI Companion)**
- Contextual responses based on user input
- Quick response buttons for common needs
- Empathetic, non-judgmental conversation
- Crisis support detection and guidance
- **Progress stats reporting**
- **Bilingual responses (EN/FIL)**

### 5. **Breathing Exercise**
- Guided breathing animation (4-4-4-4 pattern)
- Visual lung animation
- Audio feedback (optional)
- Configurable cycle count
- Calming color animations

### 6. **Emergency Support**
- Philippine crisis hotlines
- Quick access to breathing exercises
- Trusted contacts management
- One-tap emergency actions

### 7. **Enhanced Settings**
- User name customization
- **Language toggle (English/Filipino)**
- **Theme selection (Dark/Light/Auto)**
- **Text size adjustment (4 levels)**
- **High contrast mode**
- **Reduced motion toggle**
- Notification preferences
- Sound effects toggle
- **Data export functionality**
- Data reset functionality

### 8. **Accessibility Features**
- **Keyboard navigation support**
- **Screen reader friendly**
- **Focus indicators**
- **Collapsible FAQ sections**
- **Skip to content link**
- **High contrast mode**
- **Text size controls**
- **Reduced motion support**

### 9. **Internationalization**
- **Full English translation**
- **Full Filipino (Tagalog) translation**
- **Language switcher in settings**
- **Persistent language preference**

### 10. **Demo Mode** 
- **Pre-loaded sample data for presentations**
- **Quick data reload function**
- **Console commands for demo control**
- **Visual demo mode indicator**

---

## 🎨 HCI Principles Applied

### **Visibility**
- Prominent "+ Log Craving" button
- Clear status indicators
- Visible progress bars and streaks
- **⭐ Tab-based navigation for content organization**

### **Feedback**
- Animations on interactions
- Success/error notifications
- Progress celebrations
- Sound effects (optional)
- **⭐ Visual breathing animations**
- **⭐ Chart visualizations**

### **Consistency**
- Unified color palette (purple theme)
- Consistent iconography
- Similar layouts across pages
- Standardized button styles
- **⭐ Consistent modal patterns**

### **Affordance**
- Buttons appear tappable with hover effects
- Sliders for intensity mapping
- Clear interactive elements
- **⭐ Visual feedback on all interactive elements**

### **Accessibility**
- High contrast colors
- Semantic HTML structure
- Keyboard navigation support
- Mobile-responsive design
- Alt text ready for images
- **⭐ ARIA labels and roles**
- **⭐ Focus management in modals**
- **⭐ Screen reader announcements**

### **Inclusiveness**
- Bilingual support (EN/FIL)
- Non-judgmental language
- Cultural sensitivity
- Privacy-focused design
- **⭐ Multiple theme options**
- **⭐ Customizable text sizes**

---

## 🚀 How to Run

1. **Extract the project files** to a folder on your computer

2. **Open `index.html`** in a modern web browser:
   - Chrome (recommended)
   - Firefox
   - Safari
   - Edge

3. **No server required** - runs completely in the browser using `localStorage`

4. **Optional: Load demo data** for presentation purposes:
   - Open browser console (F12)
   - Type `loadMockData()` and press Enter
   - This loads realistic sample data

---

## 💾 Data Storage

- All data is stored locally in your browser using `localStorage`
- Data persists between sessions
- No external server or database required
- Privacy-focused: data never leaves your device
- **Data export to JSON for backup**
- **Data import capability (via code)**

---

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

**Enhanced mobile experience with:**
- Touch-friendly buttons
- Optimized tab scrolling
- Mobile-friendly modals
- Responsive charts

---

## 🎯 User Flow

1. **First Visit**
   - Welcome onboarding modal
   - **⭐ Set name, goals, and start date**
   - Dashboard shows starting journey
   - All achievements locked

2. **Logging a Craving**
   - Click "+ Log Craving" or press Alt+L
   - Fill in type, intensity, trigger
   - Mark if resisted
   - Receive encouraging feedback
   - **⭐ Achievement unlocks if milestones reached**

3. **Seeking Support**
   - Use breathing exercise for immediate calm (Alt+B)
   - Chat with CalmBot for motivation
   - Access emergency hotlines if in crisis

4. **Tracking Progress**
   - View streaks on dashboard
   - Check daily/weekly/monthly tabs
   - View interactive charts
   - Read AI-generated insights
   - Review craving history
   - See money saved

5. **Customization**
   - Open settings (⚙️ icon or Alt+S)
   - Change language, theme, text size
   - Export data for backup
   - Adjust accessibility settings

---

## ⌨️ Keyboard Shortcuts

- **Alt + D** - Go to Dashboard
- **Alt + L** - Log a Craving
- **Alt + B** - Start Breathing Exercise
- **Alt + M** - View Motivation Wall
- **Alt + P** - View Progress
- **Alt + C** - Open CalmBot
- **Alt + E** - Emergency Support
- **Alt + H** - Help & Tips
- **Alt + S** - Open Settings
- **Esc** - Close modals
- **Arrow Keys** - Navigate tabs

---

## 🎬 Demo Mode

---

## 🐛 Known Limitations

- No actual backend/database (localStorage only)
- ~~Chart visualization is placeholder~~ ⭐ FIXED: Now has working canvas charts
- Sound effects are basic Web Audio API tones
- No real AI - predefined responses based on keywords
- No actual SMS/call integration for emergency contacts
- **Demo data reloads on page refresh** (by design)

---

## 🔮 Future Enhancements

- Cloud sync for multi-device access
- ~~Data visualization with charts~~ ✅ IMPLEMENTED
- Social features for community support
- Actual AI integration (GPT/Claude API)
- Push notifications
- Wearable device integration
- Professional counselor directory
- **More languages (Spanish, Chinese, etc.)**
- **Dark/Light theme auto-switching based on time**
- **Advanced analytics dashboard**

---

## 🧪 Testing Notes

### To Test Demo Mode:
1. Open browser console (F12)
2. Type `loadMockData()`
3. Explore all features with sample data
4. Type `clearDemoData()` to reset

### To Test Translations:
1. Open Settings (⚙️)
2. Change language to Filipino
3. Navigate through all pages
4. Verify translations appear correctly

### To Test Accessibility:
1. Navigate using only keyboard (Tab, Enter, Esc)
2. Enable high contrast mode in settings
3. Increase text size to Extra Large
4. Test with screen reader (NVDA/JAWS)

---

## 📞 Support

For questions about this project, contact:

- **Student:** Kent Ian V. Ramirez
- **Course:** IT 321 – Human-Computer Interaction
- **Section:** CS – 3101

---

## 📄 License

This is an academic project for educational purposes.

---

## 🙏 Acknowledgments

- HCI principles from course materials
- Color psychology research
- Filipino mental health resources
- Cognitive behavioral therapy concepts
- Canvas charting techniques
- Web accessibility guidelines (WCAG)
- Internationalization best practices

---

## 🔥 Quick Start for Presentation

1. Open `index.html` in Chrome
2. Press F12 to open console
3. Type `loadMockData()` and press Enter
4. Close console (F12 again)
5. You're ready to present with realistic data!

**Remember:** This app demonstrates HCI principles and should not replace professional medical advice or treatment.

💜 **Stay strong. You've got this.** 💜
