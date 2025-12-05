const Charts = {
    init() {
        console.log('Charts module initialized');
        this.setupChartTriggers();
    },

    setupChartTriggers() {
        // Trigger when Weekly tab is clicked
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                if (targetTab === 'weekly') {
                    setTimeout(() => {
                        this.renderWeeklyChart();
                    }, 100);
                }
            });
        });

        // Also trigger when navigating to progress page
        const progressNavLink = document.querySelector('.nav-link[data-page="progress"]');
        if (progressNavLink) {
            progressNavLink.addEventListener('click', () => {
                setTimeout(() => {
                    const weeklyTab = document.getElementById('tab-weekly');
                    if (weeklyTab && weeklyTab.classList.contains('active')) {
                        this.renderWeeklyChart();
                    }
                }, 300);
            });
        }
    },

    renderWeeklyChart() {
        const canvas = document.getElementById('weeklyChart');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        // Make sure canvas is visible
        if (canvas.offsetParent === null) {
            console.log('Canvas not visible yet');
            return;
        }

        const ctx = canvas.getContext('2d');
        
        // Get weekly data
        const weekData = this.getWeeklyData();
        console.log('Week data:', weekData);
        
        // Get actual canvas size
        const rect = canvas.getBoundingClientRect();
        const width = canvas.width;
        const height = canvas.height;
        
        // Chart dimensions
        const padding = 50;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Find max value for scaling
        const maxValue = Math.max(...weekData.map(d => Math.max(d.total, d.resisted)), 5);
        
        // Draw background
        ctx.fillStyle = '#1A1A2E';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid lines
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw bars
        const barGroupWidth = chartWidth / weekData.length;
        const barWidth = Math.min(barGroupWidth * 0.35, 40);
        const barSpacing = 8;
        
        weekData.forEach((day, index) => {
            const x = padding + (index * barGroupWidth) + (barGroupWidth - (barWidth * 2 + barSpacing)) / 2;
            
            // Total cravings bar (purple)
            if (day.total > 0) {
                const totalHeight = (day.total / maxValue) * chartHeight;
                ctx.fillStyle = '#8B5CF6';
                ctx.fillRect(x, height - padding - totalHeight, barWidth, totalHeight);
            }
            
            // Resisted bar (green)
            if (day.resisted > 0) {
                const resistedHeight = (day.resisted / maxValue) * chartHeight;
                ctx.fillStyle = '#10B981';
                ctx.fillRect(x + barWidth + barSpacing, height - padding - resistedHeight, barWidth, resistedHeight);
            }
            
            // Day label
            ctx.fillStyle = '#D1D5DB';
            ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(day.label, x + barWidth + barSpacing/2, height - padding + 25);
        });
        
        // Draw Y-axis labels
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = Math.round((maxValue / 5) * (5 - i));
            const y = padding + (chartHeight / 5) * i;
            ctx.fillText(value.toString(), padding - 15, y + 4);
        }
        
        // Chart title
        ctx.fillStyle = '#A78BFA';
        ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Weekly Craving Trends', width / 2, 25);
        
        // Update summary stats
        this.updateWeeklySummary(weekData);
        this.generateInsights(weekData);
        
        console.log('Chart rendered successfully');
    },

    getWeeklyData() {
        const data = [];
        const now = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            
            const logsForDay = AppData.cravingLogs.filter(log => {
                const logDate = new Date(log.timestamp);
                return logDate >= date && logDate < nextDate;
            });
            
            data.push({
                label: this.getDayLabel(date, i === 0),
                total: logsForDay.length,
                resisted: logsForDay.filter(log => log.resisted).length,
                date: date
            });
        }
        
        return data;
    },

    getDayLabel(date, isToday) {
        if (isToday) return 'Today';
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    },

    updateWeeklySummary(weekData) {
        const totalLogged = weekData.reduce((sum, day) => sum + day.total, 0);
        const totalResisted = weekData.reduce((sum, day) => sum + day.resisted, 0);
        const successRate = totalLogged > 0 ? Math.round((totalResisted / totalLogged) * 100) : 0;
        
        const weeklyTotalEl = document.getElementById('weeklyTotal');
        const weeklyResistedEl = document.getElementById('weeklyResisted');
        const weeklyRateEl = document.getElementById('weeklyRate');
        
        if (weeklyTotalEl) weeklyTotalEl.textContent = totalLogged;
        if (weeklyResistedEl) weeklyResistedEl.textContent = totalResisted;
        if (weeklyRateEl) weeklyRateEl.textContent = successRate + '%';
    },

    generateInsights(weekData) {
        const insightsEl = document.getElementById('weeklyInsights');
        if (!insightsEl) return;
        
        insightsEl.innerHTML = '';
        const insights = [];
        
        // Calculate trends
        const firstHalf = weekData.slice(0, 3).reduce((sum, d) => sum + d.total, 0);
        const secondHalf = weekData.slice(4).reduce((sum, d) => sum + d.total, 0);
        
        // Trend insight
        if (secondHalf < firstHalf && firstHalf > 0) {
            insights.push({
                type: 'positive',
                text: '🎉 Great progress! Your cravings decreased this week compared to earlier days.'
            });
        } else if (secondHalf > firstHalf && secondHalf > 0) {
            insights.push({
                type: 'warning',
                text: '⚠️ Cravings increased in recent days. Consider reviewing your triggers and coping strategies.'
            });
        }
        
        // Success rate insight
        const totalLogged = weekData.reduce((sum, day) => sum + day.total, 0);
        const totalResisted = weekData.reduce((sum, day) => sum + day.resisted, 0);
        const successRate = totalLogged > 0 ? (totalResisted / totalLogged) * 100 : 0;
        
        if (successRate >= 80 && totalLogged > 0) {
            insights.push({
                type: 'positive',
                text: `💪 Outstanding! You resisted ${successRate.toFixed(0)}% of your cravings this week.`
            });
        } else if (successRate >= 50 && totalLogged > 0) {
            insights.push({
                type: 'positive',
                text: `✨ Good work! You resisted ${successRate.toFixed(0)}% of cravings. Keep building on this momentum.`
            });
        }
        
        // Find best day
        const bestDay = weekData.reduce((best, day) => {
            if (day.total === 0) return best;
            const rate = day.resisted / day.total;
            const bestRate = best.total > 0 ? best.resisted / best.total : 0;
            return rate > bestRate ? day : best;
        }, weekData[0]);
        
        if (bestDay.total > 0 && bestDay.resisted / bestDay.total >= 0.5) {
            insights.push({
                type: 'positive',
                text: `⭐ ${bestDay.label} was your strongest day! What made it successful?`
            });
        }
        
        // No activity insight
        if (totalLogged === 0) {
            insights.push({
                type: 'positive',
                text: '🌟 Amazing! No cravings logged this week. You\'re doing incredibly well!'
            });
        }
        
        // Render insights
        if (insights.length > 0) {
            insights.forEach(insight => {
                const insightEl = document.createElement('div');
                insightEl.className = `insight-item ${insight.type}`;
                insightEl.textContent = insight.text;
                insightsEl.appendChild(insightEl);
            });
        } else {
            insightsEl.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: var(--space-md);">Keep logging your journey to see personalized insights!</p>';
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        Charts.init();
    }, 500);
});

// Make available globally
window.Charts = Charts;
window.renderChart = () => Charts.renderWeeklyChart();
console.log('💡 Charts.js loaded - Type renderChart() to manually render');