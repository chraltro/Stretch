/**
 * Neck & Shoulder Relief Timer Application
 * A Pomodoro-style timer focused on preventing neck and shoulder strain
 */

/**
 * Default configuration constants
 * @constant {Object}
 */
const DEFAULT_CONFIG = {
    WORK_TIME: 25 * 60,        // 25 minutes
    MICRO_BREAK: 2 * 60,       // 2 minutes
    EXERCISE_BREAK: 5 * 60,    // 5 minutes
    LONG_BREAK: 15 * 60,       // 15 minutes
    STORAGE_KEY: 'timerState',
    SETTINGS_KEY: 'timerSettings',
    CIRCUMFERENCE: 2 * Math.PI * 100
};

/**
 * Timer profile presets
 * @constant {Object}
 */
const TIMER_PROFILES = {
    standard: {
        name: 'Standard',
        workTime: 25 * 60,
        microBreak: 2 * 60,
        exerciseBreak: 5 * 60,
        longBreak: 15 * 60
    },
    deepFocus: {
        name: 'Deep Focus',
        workTime: 52 * 60,
        microBreak: 3 * 60,
        exerciseBreak: 17 * 60,
        longBreak: 30 * 60
    },
    shortSprints: {
        name: 'Short Sprints',
        workTime: 15 * 60,
        microBreak: 1 * 60,
        exerciseBreak: 3 * 60,
        longBreak: 10 * 60
    },
    custom: {
        name: 'Custom',
        workTime: 25 * 60,
        microBreak: 2 * 60,
        exerciseBreak: 5 * 60,
        longBreak: 15 * 60
    }
};

/**
 * Active configuration (can be modified by settings)
 */
let CONFIG = { ...DEFAULT_CONFIG };

/**
 * Exercise database - neck and shoulder focused
 * Expanded with more variety for better engagement
 * @constant {Object}
 */
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
        },
        {
            title: "Upper Trap Stretch",
            desc: "Sit tall, place right hand on left side of head\nGently pull head toward right shoulder\nHold 15-20 seconds, repeat other side\nFeel stretch along side of neck"
        },
        {
            title: "Wrist & Forearm Relief",
            desc: "Extend arm, pull fingers back gently\nHold 10 seconds each hand\nMake fists, then spread fingers wide\nRepeat 5 times to release typing tension"
        },
        {
            title: "Eye Rest",
            desc: "Look away from screen at distant object\nHold for 20 seconds (20-20-20 rule)\nBlink rapidly 10 times\nGently massage temples in circles"
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
        },
        {
            title: "Desk Warrior Sequence",
            desc: "1. Standing backbend: hands on lower back, arch gently\n2. Side stretches: reach overhead, lean left/right\n3. Hip flexor stretch: lunge position, 30 sec each\n4. Ankle circles: 10 each direction, both feet"
        },
        {
            title: "Energy Boost Circuit",
            desc: "1. Jumping jacks: 20 reps\n2. Desk push-ups: 10 reps\n3. Chair squats: 15 reps\n4. Standing knee raises: 10 each leg\n5. Deep breathing: 5 slow breaths"
        },
        {
            title: "Tension Release Flow",
            desc: "1. Jaw massage: circles on jaw muscles\n2. Scalp massage: fingertips, gentle circles\n3. Neck rolls: very slow, full range\n4. Shoulder shrugs: up to ears, drop with sigh\n5. Hand shakes: shake out tension"
        }
    ],
    long: [
        {
            title: "Deep Recovery Break",
            desc: "Time for a proper break:\n• Walk away from your desk\n• Do full body stretches\n• Consider using a tennis ball for shoulder blade massage\n• Check your workstation ergonomics"
        },
        {
            title: "Mindful Movement Session",
            desc: "Take this time to truly reset:\n• 5-minute walk (indoor or outdoor)\n• Dynamic stretching routine\n• Practice deep breathing or meditation\n• Hydrate and have a healthy snack\n• Adjust your workspace setup"
        },
        {
            title: "Active Recovery",
            desc: "Use this break to boost circulation:\n• Light cardio: stairs, walk, or jog in place\n• Full body dynamic stretches\n• Foam roll or massage any tight areas\n• Practice balance exercises\n• End with progressive muscle relaxation"
        }
    ]
};

/**
 * Settings manager for user preferences
 * @class
 */
class Settings {
    constructor() {
        this.profile = 'standard';
        this.soundEnabled = true;
        this.soundVolume = 0.7;
        this.notificationsEnabled = true;
        this.autoStartBreaks = false;
        this.autoStartWork = false;
        this.dailyGoal = 8; // sessions per day
        this.customTimes = { ...TIMER_PROFILES.standard };
    }

    /**
     * Save settings to localStorage
     */
    save() {
        try {
            localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify({
                profile: this.profile,
                soundEnabled: this.soundEnabled,
                soundVolume: this.soundVolume,
                notificationsEnabled: this.notificationsEnabled,
                autoStartBreaks: this.autoStartBreaks,
                autoStartWork: this.autoStartWork,
                dailyGoal: this.dailyGoal,
                customTimes: this.customTimes
            }));
        } catch (error) {
            console.warn('Could not save settings:', error);
        }
    }

    /**
     * Load settings from localStorage
     * @returns {boolean} True if settings were loaded
     */
    load() {
        try {
            const saved = localStorage.getItem(CONFIG.SETTINGS_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(this, parsed);
                return true;
            }
        } catch (error) {
            console.warn('Could not load settings:', error);
        }
        return false;
    }

    /**
     * Apply current profile settings to CONFIG
     */
    applyProfile() {
        const profile = this.profile === 'custom' ? this.customTimes : TIMER_PROFILES[this.profile];
        if (profile) {
            CONFIG.WORK_TIME = profile.workTime;
            CONFIG.MICRO_BREAK = profile.microBreak;
            CONFIG.EXERCISE_BREAK = profile.exerciseBreak;
            CONFIG.LONG_BREAK = profile.longBreak;
        }
    }

    /**
     * Export all settings and data
     * @returns {Object} All user data
     */
    exportData() {
        const state = localStorage.getItem(CONFIG.STORAGE_KEY);
        const settings = localStorage.getItem(CONFIG.SETTINGS_KEY);
        return {
            version: '1.0',
            exportDate: new Date().toISOString(),
            settings: settings ? JSON.parse(settings) : null,
            state: state ? JSON.parse(state) : null
        };
    }

    /**
     * Import settings and data
     * @param {Object} data - Data to import
     * @returns {boolean} Success status
     */
    importData(data) {
        try {
            if (data.settings) {
                localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(data.settings));
                Object.assign(this, data.settings);
            }
            if (data.state) {
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data.state));
            }
            return true;
        } catch (error) {
            console.error('Could not import data:', error);
            return false;
        }
    }
}

/**
 * Application state manager
 * @class
 */
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
            exercises: 0,
            totalWorkTime: 0,
            totalBreakTime: 0
        };
        this.streak = {
            current: 0,
            longest: 0,
            lastDate: null
        };
    }

    /**
     * Reset timer to initial state
     */
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

    /**
     * Update streak based on current date
     */
    updateStreak() {
        const today = new Date().toDateString();
        const lastDate = this.streak.lastDate;

        if (lastDate === today) {
            return; // Already updated today
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastDate === yesterdayStr) {
            // Continue streak
            this.streak.current++;
        } else if (lastDate && lastDate !== yesterdayStr) {
            // Streak broken
            this.streak.current = 1;
        } else {
            // First time or new streak
            this.streak.current = 1;
        }

        if (this.streak.current > this.streak.longest) {
            this.streak.longest = this.streak.current;
        }

        this.streak.lastDate = today;
    }

    /**
     * Save state to localStorage
     */
    save() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
                stats: this.stats,
                streak: this.streak,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('Could not save state to localStorage:', error);
        }
    }

    /**
     * Load state from localStorage
     * @returns {boolean} True if state was loaded
     */
    load() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                this.stats = { ...this.stats, ...parsed.stats };
                if (parsed.streak) {
                    this.streak = { ...this.streak, ...parsed.streak };
                }
                return true;
            }
        } catch (error) {
            console.warn('Could not load state from localStorage:', error);
        }
        return false;
    }
}

/**
 * DOM element cache for efficient access
 * @class
 */
class DOMElements {
    constructor() {
        this.timer = document.getElementById('timer');
        this.phase = document.getElementById('phase');
        this.progress = document.getElementById('progress');
        this.startBtn = document.getElementById('startBtn');
        this.skipBtn = document.getElementById('skipBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.exerciseInfo = document.getElementById('exerciseInfo');
        this.exerciseTitle = document.getElementById('exerciseTitle');
        this.exerciseDesc = document.getElementById('exerciseDesc');
        this.notification = document.getElementById('notification');
        this.sessionsCount = document.getElementById('sessionsCount');
        this.exercisesCount = document.getElementById('exercisesCount');
        this.streakCount = document.getElementById('streakCount');
        this.goalProgress = document.getElementById('goalProgress');
        this.settingsModal = document.getElementById('settingsModal');
    }
}

/**
 * Notification manager for alerts and sounds
 * @class
 */
class NotificationManager {
    constructor(settings) {
        this.settings = settings;
        this.bellSound = null;
        this.initSound();
        this.requestPermission();
    }

    /**
     * Initialize audio element
     */
    initSound() {
        try {
            this.bellSound = new Audio('bell.wav');
            this.bellSound.volume = this.settings.soundVolume;
        } catch (error) {
            console.warn('Could not initialize sound:', error);
        }
    }

    /**
     * Update sound volume
     * @param {number} volume - Volume level (0-1)
     */
    setVolume(volume) {
        if (this.bellSound) {
            this.bellSound.volume = Math.max(0, Math.min(1, volume));
        }
    }

    /**
     * Request notification permission
     */
    requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().catch(err => {
                console.warn('Notification permission denied:', err);
            });
        }
    }

    /**
     * Show notification with sound and alerts
     * @param {string} message - Message to display
     */
    show(message) {
        // Play bell sound
        if (this.settings.soundEnabled && this.bellSound) {
            this.bellSound.play().catch(err => {
                console.warn('Error playing sound:', err);
            });
        }

        // Show in-app notification
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.classList.add('show');

            // Hide notification after 5 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }

        // Browser notification
        if (this.settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification('Hvila', {
                    body: message,
                    icon: 'icons/icon-192.png',
                    badge: 'icons/icon-192.png',
                    vibrate: [200, 100, 200],
                    tag: 'relief-timer',
                    silent: !this.settings.soundEnabled
                });
            } catch (error) {
                console.warn('Could not show browser notification:', error);
            }
        }

        // Vibration for mobile
        if ('vibrate' in navigator) {
            try {
                navigator.vibrate([200, 100, 200]);
            } catch (error) {
                console.warn('Vibration not supported:', error);
            }
        }
    }
}

/**
 * Main application class
 * @class
 */
class ReliefTimer {
    constructor() {
        this.settings = new Settings();
        this.state = new TimerState();
        this.dom = new DOMElements();

        // Load settings first
        this.settings.load();
        this.settings.applyProfile();

        // Initialize notifications with settings
        this.notifications = new NotificationManager(this.settings);

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        // Load saved state
        this.state.load();

        // Update streak
        this.state.updateStreak();

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

        // Check for updates
        this.checkForUpdates();
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        this.dom.startBtn.addEventListener('click', () => this.toggleTimer());
        this.dom.skipBtn.addEventListener('click', () => this.skipPhase());
        this.dom.resetBtn.addEventListener('click', () => this.resetTimer());

        // Settings button
        if (this.dom.settingsBtn) {
            this.dom.settingsBtn.addEventListener('click', () => this.openSettings());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            // Ignore if typing in input field
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
                return;
            }

            if (event.code === 'Space') {
                event.preventDefault();
                this.toggleTimer();
            } else if (event.code === 'Escape') {
                this.closeSettings();
            } else if (event.code === 'KeyS' && !event.ctrlKey && !event.metaKey) {
                event.preventDefault();
                this.skipPhase();
            } else if (event.code === 'KeyR' && !event.ctrlKey && !event.metaKey) {
                event.preventDefault();
                this.resetTimer();
            } else if (event.code === 'Comma') {
                event.preventDefault();
                this.openSettings();
            }
        });

        // Settings form event listeners (will be set when modal is created)
        this.setupSettingsListeners();
    }

    /**
     * Set up settings modal event listeners
     */
    setupSettingsListeners() {
        // Will be called when settings modal is opened
        document.addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal' || e.target.id === 'closeSettings') {
                this.closeSettings();
            }
        });
    }

    /**
     * Set up PWA features including service worker and install prompt
     */
    setupPWA() {
        // Register service worker for offline functionality
        if ('serviceWorker' in navigator) {
            // Allow service worker in both HTTPS and localhost
            if (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                navigator.serviceWorker.register('sw.js')
                    .then(registration => {
                        console.log('Service worker registered:', registration);
                    })
                    .catch(error => {
                        console.warn('Service worker registration failed:', error);
                    });
            }
        }

        // Handle install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // Show install button if not already installed
            this.showInstallPrompt(deferredPrompt);
        });

        // Handle successful installation
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            this.notifications.show('App installed! You can now use Hvila offline.');
            deferredPrompt = null;
        });
    }

    /**
     * Show PWA install prompt
     * @param {Event} deferredPrompt - Install prompt event
     */
    showInstallPrompt(deferredPrompt) {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }

        // Show install notification
        const notification = document.getElementById('notification');
        if (notification) {
            notification.innerHTML = `
                Install Hvila for offline use
                <button id="installBtn" style="margin-left: 10px; padding: 5px 10px; cursor: pointer;">Install</button>
                <button id="dismissInstall" style="margin-left: 5px; padding: 5px 10px; cursor: pointer;">Dismiss</button>
            `;
            notification.classList.add('show');

            document.getElementById('installBtn')?.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`User response to install prompt: ${outcome}`);
                    notification.classList.remove('show');
                }
            });

            document.getElementById('dismissInstall')?.addEventListener('click', () => {
                notification.classList.remove('show');
            });
        }
    }

    /**
     * Check for service worker updates
     */
    checkForUpdates() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.update().catch(err => {
                    console.warn('Could not check for updates:', err);
                });

                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker?.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            this.showUpdateNotification();
                        }
                    });
                });
            });
        }
    }

    /**
     * Show update notification
     */
    showUpdateNotification() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.innerHTML = `
                New version available!
                <button id="updateBtn" style="margin-left: 10px; padding: 5px 10px; cursor: pointer;">Refresh</button>
            `;
            notification.classList.add('show');

            document.getElementById('updateBtn')?.addEventListener('click', () => {
                window.location.reload();
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

    /**
     * Update statistics display
     */
    updateStats() {
        this.dom.sessionsCount.textContent = this.state.stats.sessions;
        this.dom.exercisesCount.textContent = this.state.stats.exercises;

        // Update streak if element exists
        if (this.dom.streakCount) {
            this.dom.streakCount.textContent = `${this.state.streak.current} day${this.state.streak.current !== 1 ? 's' : ''}`;
        }

        // Update goal progress if element exists
        if (this.dom.goalProgress) {
            const today = new Date().toDateString();
            const todaySessions = this.state.streak.lastDate === today ?
                (this.state.sessionCount || 0) : 0;
            const progress = Math.min(100, (todaySessions / this.settings.dailyGoal) * 100);
            this.dom.goalProgress.style.width = `${progress}%`;
            this.dom.goalProgress.setAttribute('aria-valuenow', progress);

            // Show motivational message if goal reached
            if (todaySessions >= this.settings.dailyGoal && todaySessions === this.state.sessionCount) {
                this.notifications.show(`Goal reached! ${this.settings.dailyGoal} sessions completed today!`);
            }
        }
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

    /**
     * Move to next phase (work/break)
     */
    nextPhase() {
        this.hideExercise();
        this.dom.phase.classList.remove('active');

        const wasWorking = this.state.currentPhase === 'work';

        if (wasWorking) {
            this.state.sessionCount++;
            this.state.stats.sessions++;
            this.state.updateStreak();

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

            // Auto-start break if enabled
            if (this.settings.autoStartBreaks && !this.state.isRunning) {
                setTimeout(() => this.toggleTimer(), 1000);
            }
        } else {
            // Back to work
            this.setPhase('work', CONFIG.WORK_TIME, 'Focus Time', 'Back to work! Check your posture.');

            // Auto-start work if enabled
            if (this.settings.autoStartWork && !this.state.isRunning) {
                setTimeout(() => this.toggleTimer(), 1000);
            }
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

    /**
     * Reset timer to initial state
     */
    resetTimer() {
        this.state.reset();
        this.dom.startBtn.textContent = 'Start';
        this.dom.phase.textContent = 'Ready';
        this.dom.phase.classList.remove('active');
        this.hideExercise();
        this.updateDisplay();
        this.updateBackgroundTheme();
    }

    /**
     * Open settings modal
     */
    openSettings() {
        // Create modal if it doesn't exist
        if (!document.getElementById('settingsModal')) {
            this.createSettingsModal();
        }

        // Populate current settings
        this.populateSettings();

        // Show modal
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close settings modal
     */
    closeSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    /**
     * Create settings modal HTML
     */
    createSettingsModal() {
        const modalHTML = `
            <div id="settingsModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Settings</h2>
                        <button id="closeSettings" class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="settingsForm">
                            <div class="setting-group">
                                <label for="profile">Timer Profile</label>
                                <select id="profile" name="profile">
                                    <option value="standard">Standard (25/5/15)</option>
                                    <option value="deepFocus">Deep Focus (52/17/30)</option>
                                    <option value="shortSprints">Short Sprints (15/3/10)</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>

                            <div class="setting-group">
                                <label>
                                    <input type="checkbox" id="soundEnabled" name="soundEnabled">
                                    Enable Sound
                                </label>
                            </div>

                            <div class="setting-group">
                                <label for="soundVolume">Sound Volume</label>
                                <input type="range" id="soundVolume" name="soundVolume" min="0" max="1" step="0.1">
                                <span id="volumeValue">70%</span>
                            </div>

                            <div class="setting-group">
                                <label>
                                    <input type="checkbox" id="notificationsEnabled" name="notificationsEnabled">
                                    Enable Notifications
                                </label>
                            </div>

                            <div class="setting-group">
                                <label>
                                    <input type="checkbox" id="autoStartBreaks" name="autoStartBreaks">
                                    Auto-start Breaks
                                </label>
                            </div>

                            <div class="setting-group">
                                <label>
                                    <input type="checkbox" id="autoStartWork" name="autoStartWork">
                                    Auto-start Work Sessions
                                </label>
                            </div>

                            <div class="setting-group">
                                <label for="dailyGoal">Daily Goal (sessions)</label>
                                <input type="number" id="dailyGoal" name="dailyGoal" min="1" max="20" value="8">
                            </div>

                            <div class="setting-group">
                                <button type="button" id="exportData" class="secondary-btn">Export Data</button>
                                <button type="button" id="importData" class="secondary-btn">Import Data</button>
                                <input type="file" id="importFile" accept=".json" style="display: none;">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="saveSettings" class="primary-btn">Save Settings</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add event listeners
        document.getElementById('saveSettings')?.addEventListener('click', () => this.saveSettings());
        document.getElementById('closeSettings')?.addEventListener('click', () => this.closeSettings());
        document.getElementById('exportData')?.addEventListener('click', () => this.exportData());
        document.getElementById('importData')?.addEventListener('click', () => {
            document.getElementById('importFile')?.click();
        });
        document.getElementById('importFile')?.addEventListener('change', (e) => this.importData(e));

        // Volume slider real-time update
        document.getElementById('soundVolume')?.addEventListener('input', (e) => {
            const value = e.target.value;
            document.getElementById('volumeValue').textContent = `${Math.round(value * 100)}%`;
            this.notifications.setVolume(parseFloat(value));
        });
    }

    /**
     * Populate settings form with current values
     */
    populateSettings() {
        document.getElementById('profile').value = this.settings.profile;
        document.getElementById('soundEnabled').checked = this.settings.soundEnabled;
        document.getElementById('soundVolume').value = this.settings.soundVolume;
        document.getElementById('volumeValue').textContent = `${Math.round(this.settings.soundVolume * 100)}%`;
        document.getElementById('notificationsEnabled').checked = this.settings.notificationsEnabled;
        document.getElementById('autoStartBreaks').checked = this.settings.autoStartBreaks;
        document.getElementById('autoStartWork').checked = this.settings.autoStartWork;
        document.getElementById('dailyGoal').value = this.settings.dailyGoal;
    }

    /**
     * Save settings from form
     */
    saveSettings() {
        this.settings.profile = document.getElementById('profile').value;
        this.settings.soundEnabled = document.getElementById('soundEnabled').checked;
        this.settings.soundVolume = parseFloat(document.getElementById('soundVolume').value);
        this.settings.notificationsEnabled = document.getElementById('notificationsEnabled').checked;
        this.settings.autoStartBreaks = document.getElementById('autoStartBreaks').checked;
        this.settings.autoStartWork = document.getElementById('autoStartWork').checked;
        this.settings.dailyGoal = parseInt(document.getElementById('dailyGoal').value);

        // Apply profile
        this.settings.applyProfile();

        // Update notification manager
        this.notifications.setVolume(this.settings.soundVolume);

        // Reset timer to apply new times
        if (!this.state.isRunning) {
            this.state.currentTime = CONFIG.WORK_TIME;
            this.state.totalTime = CONFIG.WORK_TIME;
            this.updateDisplay();
        }

        // Save to localStorage
        this.settings.save();

        this.notifications.show('Settings saved!');
        this.closeSettings();
    }

    /**
     * Export data to JSON file
     */
    exportData() {
        const data = this.settings.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hvila-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.notifications.show('Data exported successfully!');
    }

    /**
     * Import data from JSON file
     * @param {Event} event - File input change event
     */
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (this.settings.importData(data)) {
                    this.settings.load();
                    this.settings.applyProfile();
                    this.state.load();
                    this.updateStats();
                    this.updateDisplay();
                    this.notifications.show('Data imported successfully!');
                    this.closeSettings();
                    window.location.reload(); // Reload to apply all changes
                } else {
                    this.notifications.show('Error importing data!');
                }
            } catch (error) {
                console.error('Import error:', error);
                this.notifications.show('Invalid file format!');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReliefTimer();
});