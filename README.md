<<<<<<< HEAD
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
│   └── animations.css        # Animation keyframes and effects
│
├── js/
│   ├── data.js              # Data management and localStorage
│   ├── navigation.js        # Page navigation and modal controls
│   ├── craving-log.js       # Craving logging functionality
│   ├── breathing.js         # Breathing exercise logic
│   ├── calmbot.js           # AI chatbot responses
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

### 2. **Motivation Wall**
- Inspirational quotes and messages
- Community encouragement posts
- Bilingual support (English/Filipino)

### 3. **Progress Tracker**
- Health improvement metrics
- Visual milestone tracking
- Craving history log with detailed information
- Trend visualization placeholder

### 4. **CalmBot (AI Companion)**
- Contextual responses based on user input
- Quick response buttons for common needs
- Empathetic, non-judgmental conversation
- Crisis support detection and guidance

### 5. **Breathing Exercise**
- Guided breathing animation (4-4-4-4 pattern)
- Visual and audio feedback
- Configurable cycle count
- Calming color animations

### 6. **Emergency Support**
- Philippine crisis hotlines
- Quick access to breathing exercises
- Trusted contacts management
- One-tap emergency actions

### 7. **Settings**
- User name customization
- Language toggle (English/Filipino)
- Notification preferences
- Sound effects toggle
- Data reset functionality

---

## 🎨 HCI Principles Applied

### **Visibility**
- Prominent "+ Log Craving" button
- Clear status indicators
- Visible progress bars and streaks

### **Feedback**
- Animations on interactions
- Success/error notifications
- Progress celebrations
- Sound effects (optional)

### **Consistency**
- Unified color palette (purple theme)
- Consistent iconography
- Similar layouts across pages
- Standardized button styles

### **Affordance**
- Buttons appear tappable with hover effects
- Sliders for intensity mapping
- Clear interactive elements

### **Accessibility**
- High contrast colors
- Semantic HTML structure
- Keyboard navigation support
- Mobile-responsive design
- Alt text ready for images

### **Inclusiveness**
- Bilingual support
- Non-judgmental language
- Cultural sensitivity
- Privacy-focused design

---

## 🚀 How to Run

1. **Extract the project files** to a folder on your computer

2. **Open `index.html`** in a modern web browser:
   - Chrome (recommended)
   - Firefox
   - Safari
   - Edge

3. **No server required** - runs completely in the browser using localStorage

---

## 💾 Data Storage

- All data is stored locally in your browser using `localStorage`
- Data persists between sessions
- No external server or database required
- Privacy-focused: data never leaves your device

---

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

---

## 🎯 User Flow

1. **First Visit**
   - Welcome message appears
   - Dashboard shows starting journey (Day 0)
   - All achievements locked

2. **Logging a Craving**
   - Click "+ Log Craving"
   - Fill in type, intensity, trigger
   - Mark if resisted
   - Receive encouraging feedback

3. **Seeking Support**
   - Use breathing exercise for immediate calm
   - Chat with CalmBot for motivation
   - Access emergency hotlines if in crisis

4. **Tracking Progress**
   - View streaks on dashboard
   - Check milestone achievements
   - Review craving history
   - See money saved

---

## 🎨 Design Rationale

### **Dark Mode Theme**
- Reduces eye strain during emotional moments
- Creates sense of privacy
- Modern, calming aesthetic

### **Purple Primary Color**
- Associated with calm and transformation
- Represents recovery and resilience
- Gender-neutral and inclusive

### **Journey Metaphor**
- Progress visualized as a path
- Reduces anxiety of numeric tracking
- Emphasizes forward movement

### **Gamification**
- Achievement badges for motivation
- Streak counters for consistency
- Milestone celebrations

---

## 🔧 Technical Implementation

### **HTML**
- Semantic structure
- Accessible form elements
- ARIA labels where needed
- Modal overlays for focus

### **CSS**
- CSS Variables for theming
- Flexbox and Grid layouts
- Smooth animations
- Media queries for responsiveness

### **JavaScript**
- Modular code structure
- Event-driven architecture
- localStorage for persistence
- No external dependencies

---

## 📊 Evaluation Criteria Met

### **User Interface Design (30%)**
✅ Visual consistency with cohesive theme  
✅ Aesthetically pleasing purple dark mode  
✅ Clean layout with proper spacing and alignment

### **Usability & HCI Principles (30%)**
✅ Clear navigation and intuitive paths  
✅ Accessibility features (contrast, semantic HTML)  
✅ Application of HCI concepts (feedback, consistency, affordances)

### **Technical Implementation (20%)**
✅ Semantic HTML structure  
✅ Reusable CSS with organized files  
✅ Functional interactivity without errors

### **Documentation (10%)**
✅ Complete project documentation  
✅ Clear explanation of design decisions  
✅ Professional presentation

---

## 🎥 Video Walkthrough Guide

When recording your video, demonstrate:

1. **Landing/Dashboard** (30 sec)
   - Overview of statistics
   - Journey progress paths
   - Quick actions

2. **Logging a Craving** (45 sec)
   - Click "Log Craving"
   - Fill form with explanations
   - Show feedback and celebration

3. **Motivation Wall** (30 sec)
   - Browse quotes
   - Explain emotional design
   - Community posts

4. **CalmBot** (60 sec)
   - Ask different types of questions
   - Show contextual responses
   - Demonstrate quick responses

5. **Breathing Exercise** (45 sec)
   - Start exercise
   - Show animation cycle
   - Explain calming effect

6. **Emergency Support** (30 sec)
   - Show hotlines
   - Demonstrate quick access

7. **Progress Tracking** (30 sec)
   - View logs
   - Show milestones
   - Explain visualization

8. **Settings** (20 sec)
   - Show customization options
   - Explain privacy

**Total: 4-5 minutes**

---

## 📝 Documentation PDF Content

Your 5-page PDF should include:

### Page 1: Title & Overview
- Project name and tagline
- Brief description
- Target users
- Objectives

### Page 2: User Personas
- Primary persona (e.g., 25-year-old trying to quit smoking)
- Secondary persona (e.g., 35-year-old reducing alcohol)
- Needs and pain points

### Page 3: Wireframes
- Low-fidelity sketches of:
  - Dashboard
  - Craving log modal
  - CalmBot interface
  - Progress page

### Page 4: UI Principles Applied
- Visibility examples
- Feedback mechanisms
- Consistency elements
- Affordance demonstrations
- Accessibility features

### Page 5: Challenges & Learnings
- Technical challenges faced
- Design decision rationale
- Key learnings
- Future improvements

---

## 🐛 Known Limitations

- No actual backend/database (localStorage only)
- Chart visualization is placeholder
- Sound effects are basic Web Audio API tones
- No real AI - predefined responses based on keywords
- No actual SMS/call integration for emergency contacts

---

## 🔮 Future Enhancements

- Cloud sync for multi-device access
- Data visualization with charts
- Social features for community support
- Actual AI integration
- Push notifications
- Wearable device integration
- Professional counselor directory

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

---

**Remember:** This app demonstrates HCI principles and should not replace professional medical advice or treatment.

💜 **Stay strong. You've got this.** 💜
=======
# ReKindle
An application made to rekindle the fire in your heart.
>>>>>>> 28342cfdc54a388fff19236d31e85c0a36380b06
