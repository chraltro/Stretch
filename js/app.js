/**
 * Neck & Shoulder Relief Timer Application
 * A Pomodoro-style timer focused on preventing neck and shoulder strain
 */

// Configuration constants
const CONFIG = {
    WORK_TIME: 25 * 60,        // 25 minutes
    MICRO_BREAK: 2 * 60,       // 2 minutes
    EXERCISE_BREAK: 5 * 60,    // 5 minutes
    LONG_BREAK: 15 * 60,       // 15 minutes
    STORAGE_KEY: 'timerState',
    CIRCUMFERENCE: 2 * Math.PI * 100
};

// Exercise database - neck and shoulder focused
const EXERCISES = {
    micro: [
        {
            title: "Shoulder Rolls",
            desc: "Roll shoulders backward 10 times slowly\nRoll shoulders forward 10 times\nFocus on releasing tension with each roll"
        },
        {
            title: "Neck Side Stretch",
            desc: "Tilt head to right shoulder, hold 20 sec\nTilt head to left shoulder, hold 20 sec\nKeep shoulders relaxed and down"
        },
        {
            title: "Chin Tucks",
            desc: "Pull chin straight back (not down)\nHold for 5 seconds\nRepeat 8-10 times\nThis helps align your neck"
        }
    ],
    exercise: [
        {
            title: "Complete Neck Release",
            desc: "1. Neck rotations: 5 slow circles each way\n2. Ear to shoulder stretch: 30 sec each side\n3. Resistance exercise: Push hand against head, hold 10 sec each direction\n4. Upper trap stretch: Pull head gently to side"
        },
        {
            title: "Shoulder & Upper Back",
            desc: "1. Shoulder blade squeezes: 15 reps, hold 5 sec\n2. Wall angels: 15 slow reps\n3. Doorway chest stretch: 30 sec each side\n4. Cat-cow stretches: 10 reps"
        },
        {
            title: "Posture Reset",
            desc: "1. Stand against wall, flatten back\n2. Arms at 90° against wall, slide up/down 10x\n3. Forward fold with clasped hands\n4. Gentle spinal twists: 30 sec each side"
        }
    ],
    long: [
        {
            title: "Deep Recovery Break",
            desc: "Time for a proper break:\n• Walk away from your desk\n• Do full body stretches\n• Consider using a tennis ball for shoulder blade massage\n• Check your workstation ergonomics"
        }
    ]
};

// Application state
class TimerState {
    constructor() {
        this.currentTime = CONFIG.WORK_TIME;
        this.totalTime = CONFIG.WORK_TIME;
        this.isRunning = false;
        this.currentPhase = 'work';
        this.interval = null;
        this.sessionCount = 0;
        this.stats = {
            sessions: 0,
            exercises: 0
        };
    }

    reset() {
        this.currentTime = CONFIG.WORK_TIME;
        this.totalTime = CONFIG.WORK_TIME;
        this.isRunning = false;
        this.currentPhase = 'work';
        this.sessionCount = 0;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    save() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
                stats: this.stats,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('Could not save state to localStorage:', error);
        }
    }

    load() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                this.stats = { ...this.stats, ...parsed.stats };
                return true;
            }
        } catch (error) {
            console.warn('Could not load state from localStorage:', error);
        }
        return false;
    }
}

// DOM element cache
class DOMElements {
    constructor() {
        this.timer = document.getElementById('timer');
        this.phase = document.getElementById('phase');
        this.progress = document.getElementById('progress');
        this.startBtn = document.getElementById('startBtn');
        this.skipBtn = document.getElementById('skipBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.exerciseInfo = document.getElementById('exerciseInfo');
        this.exerciseTitle = document.getElementById('exerciseTitle');
        this.exerciseDesc = document.getElementById('exerciseDesc');
        this.notification = document.getElementById('notification');
        this.sessionsCount = document.getElementById('sessionsCount');
        this.exercisesCount = document.getElementById('exercisesCount');
    }
}

// Notification manager
class NotificationManager {
    constructor() {
        this.bellSound = new Audio('bell.wav');
        this.requestPermission();
    }

    requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    show(message) {
        // Play bell sound
        this.bellSound.play().catch(err => console.log('Error playing sound:', err));

        // Show in-app notification
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');

        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Stretch', {
                body: message,
                icon: 'icons/icon-192.png',
                badge: 'icons/icon-192.png',
                vibrate: [200, 100, 200],
                tag: 'relief-timer'
            });
        }

        // Vibration for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }

        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
}

// Main application class
class ReliefTimer {
    constructor() {
        this.state = new TimerState();
        this.dom = new DOMElements();
        this.notifications = new NotificationManager();
        
        this.init();
    }

    init() {
        // Load saved state
        this.state.load();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize display
        this.updateDisplay();
        this.updateStats();
        this.updateBackgroundTheme();
        
        // Set up PWA features
        this.setupPWA();
        
        // Prevent sleep on mobile
        this.setupWakeLock();
    }

    setupEventListeners() {
        this.dom.startBtn.addEventListener('click', () => this.toggleTimer());
        this.dom.skipBtn.addEventListener('click', () => this.skipPhase());
        this.dom.resetBtn.addEventListener('click', () => this.resetTimer());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                this.toggleTimer();
            } else if (event.code === 'Escape') {
                this.resetTimer();
            }
        });
    }

    setupPWA() {
        // Register service worker for offline functionality
        if ('serviceWorker' in navigator && location.protocol === 'https:') {
            navigator.serviceWorker.register('sw.js').catch(error => {
                console.warn('Service worker registration failed:', error);
            });
        }
    }

    setupWakeLock() {
        if ('wakeLock' in navigator) {
            let wakeLock = null;
            
            const requestWakeLock = async () => {
                try {
                    wakeLock = await navigator.wakeLock.request('screen');
                } catch (error) {
                    console.warn('Wake Lock error:', error);
                }
            };
            
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && this.state.isRunning) {
                    requestWakeLock();
                }
            });
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateDisplay() {
        // Update timer display
        this.dom.timer.textContent = this.formatTime(this.state.currentTime);
        
        // Update circular progress
        const progress = (this.state.totalTime - this.state.currentTime) / this.state.totalTime;
        const offset = CONFIG.CIRCUMFERENCE - (progress * CONFIG.CIRCUMFERENCE);
        this.dom.progress.style.strokeDashoffset = offset;

        // Warning animation when time is low
        if (this.state.currentTime <= 10 && this.state.currentTime > 0) {
            this.dom.timer.classList.add('warning');
        } else {
            this.dom.timer.classList.remove('warning');
        }
    }

    updateStats() {
        this.dom.sessionsCount.textContent = this.state.stats.sessions;
        this.dom.exercisesCount.textContent = this.state.stats.exercises;
    }

    showExercise() {
        const exerciseType = this.getExerciseType();
        if (!exerciseType) return;

        const exerciseList = EXERCISES[exerciseType];
        const exercise = exerciseList[Math.floor(Math.random() * exerciseList.length)];
        
        this.dom.exerciseTitle.textContent = exercise.title;
        this.dom.exerciseDesc.textContent = exercise.desc;
        this.dom.exerciseInfo.classList.add('active');
    }

    hideExercise() {
        this.dom.exerciseInfo.classList.remove('active');
    }

    getExerciseType() {
        const phaseMap = {
            'microBreak': 'micro',
            'exerciseBreak': 'exercise',
            'longBreak': 'long'
        };
        return phaseMap[this.state.currentPhase];
    }

    nextPhase() {
        this.hideExercise();
        this.dom.phase.classList.remove('active');
        
        if (this.state.currentPhase === 'work') {
            this.state.sessionCount++;
            this.state.stats.sessions++;
            
            if (this.state.sessionCount % 4 === 0) {
                // Long break after 4 sessions
                this.setPhase('longBreak', CONFIG.LONG_BREAK, 'Long Break', 'Time for a long break! Walk and stretch.');
            } else if (this.state.sessionCount % 2 === 0) {
                // Exercise break after every 2nd session
                this.setPhase('exerciseBreak', CONFIG.EXERCISE_BREAK, 'Exercise Break', 'Neck & shoulder exercises time!');
                this.state.stats.exercises++;
            } else {
                // Micro break after every session
                this.setPhase('microBreak', CONFIG.MICRO_BREAK, 'Quick Break', 'Quick neck stretch!');
            }
            
            this.showExercise();
        } else {
            // Back to work
            this.setPhase('work', CONFIG.WORK_TIME, 'Focus Time', 'Back to work! Check your posture.');
        }
        
        this.updateStats();
        this.state.save();
        this.updateDisplay();
    }

    setPhase(phase, time, displayText, notificationText) {
        this.state.currentPhase = phase;
        this.state.currentTime = time;
        this.state.totalTime = time;
        this.dom.phase.textContent = displayText;
        this.dom.phase.classList.add('active');
        this.notifications.show(notificationText);
        
        // Update background theme based on phase
        this.updateBackgroundTheme();
    }

    updateBackgroundTheme() {
        // Remove all phase classes
        document.body.classList.remove('phase-work', 'phase-microBreak', 'phase-exerciseBreak', 'phase-longBreak');
        
        // Add current phase class
        const phaseClassMap = {
            'work': 'phase-work',
            'microBreak': 'phase-microBreak', 
            'exerciseBreak': 'phase-exerciseBreak',
            'longBreak': 'phase-longBreak'
        };
        
        const phaseClass = phaseClassMap[this.state.currentPhase];
        if (phaseClass) {
            document.body.classList.add(phaseClass);
        }
    }

    tick() {
        if (this.state.currentTime > 0) {
            this.state.currentTime--;
            this.updateDisplay();
        } else {
            this.nextPhase();
        }
    }

    toggleTimer() {
        if (this.state.isRunning) {
            // Pause timer
            clearInterval(this.state.interval);
            this.state.interval = null;
            this.dom.startBtn.textContent = 'Start';
            this.dom.phase.textContent = 'Paused';
            this.dom.phase.classList.remove('active');
        } else {
            // Start timer
            this.state.interval = setInterval(() => this.tick(), 1000);
            this.dom.startBtn.textContent = 'Pause';
            
            if (this.state.currentPhase === 'work') {
                this.dom.phase.textContent = 'Focus Time';
                this.dom.phase.classList.add('active');
            }
        }
        
        this.state.isRunning = !this.state.isRunning;
    }

    skipPhase() {
        this.notifications.show('Phase skipped');
        this.state.currentTime = 0;
        this.tick();
    }

    resetTimer() {
        this.state.reset();
        this.dom.startBtn.textContent = 'Start';
        this.dom.phase.textContent = 'Ready';
        this.dom.phase.classList.remove('active');
        this.hideExercise();
        this.updateDisplay();
        this.updateBackgroundTheme();
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReliefTimer();
});