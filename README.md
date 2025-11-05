# Hvila - Rest Timer

A Progressive Web App implementing the Pomodoro technique with guided exercise breaks designed to prevent neck and shoulder strain during extended work sessions.

**Hvila** (Old Norse: "rest" or "respite")

## Features

### Core Timer Functionality
- Pomodoro-style work intervals with scheduled breaks
- Three break types: micro-breaks (2min), exercise breaks (5min), long breaks (15min)
- Customizable timer profiles: Standard, Deep Focus, Short Sprints, or Custom
- Auto-start options for breaks and work sessions
- Visual progress ring with smooth animations

### Exercise System
- 15+ guided neck and shoulder exercises during break periods
- Expanded exercise database including:
  - Micro-breaks: Quick stretches for neck, shoulders, wrists, and eyes
  - Exercise breaks: Complete movement sequences and energy boosters
  - Long breaks: Recovery routines and mindful movement sessions
- Random exercise selection for variety
- Step-by-step instructions with each exercise

### Progress Tracking
- Daily streak tracking to build consistent habits
- Configurable daily goals (sessions per day)
- Visual progress bar showing goal completion
- Session and exercise counters with local persistence
- Motivational messages when goals are achieved

### Settings & Customization
- Comprehensive settings panel with:
  - Timer profile selection (Standard 25/5/15, Deep Focus 52/17/30, Short Sprints 15/3/10)
  - Sound volume control and toggle
  - Notification preferences
  - Auto-start configuration
  - Daily goal setting
- Data export/import functionality for backups
- All settings persist across sessions

### PWA Features
- Offline functionality via service worker
- Install prompt with user-friendly interface
- Update notifications when new versions are available
- Works on desktop and mobile devices
- Runs in standalone mode when installed

### User Experience
- Responsive design for all screen sizes
- Dark/light theme based on system preferences
- Smooth animations and transitions
- Keyboard shortcuts for all main actions
- Push notifications and vibration support
- Accessible design with ARIA labels and screen reader support

## Installation

The app can be installed as a PWA on supported devices:

1. Open the application in a browser
2. Look for the install prompt or use the browser's "Add to Home Screen" option
3. The app will function offline once installed

## Keyboard Shortcuts

Hvila supports keyboard shortcuts for efficient operation:

| Key | Action |
|-----|--------|
| `Space` | Start/Pause timer |
| `S` | Skip current phase |
| `R` | Reset timer |
| `,` | Open settings |
| `Esc` | Close settings/dialogs |

## Usage Tips

### Getting Started
1. Click the settings button (⚙️) to configure your preferences
2. Choose a timer profile that fits your work style
3. Set your daily goal for motivation
4. Press Space or click Start to begin your first session

### Timer Profiles

- **Standard (25/5/15)**: Classic Pomodoro technique, ideal for most work
- **Deep Focus (52/17/30)**: Longer sessions for deep, uninterrupted work
- **Short Sprints (15/3/10)**: Quick bursts for tasks requiring frequent breaks
- **Custom**: Set your own work and break durations

### Building Streaks

- Use Hvila daily to build your streak
- Streaks reset if you skip a day
- Track your longest streak in the stats section
- Set achievable daily goals to maintain motivation

### Data Management

- Export your data regularly for backups
- Import data to restore settings and stats
- Useful when switching devices or browsers
- Data includes all settings, stats, and streak information

## Project Structure

```
hvila/
├── index.html           # Semantic HTML structure
├── manifest.json        # PWA configuration
├── sw.js                # Service worker for offline support
├── css/
│   └── styles.css       # All styles with CSS custom properties
├── js/
│   └── app.js           # Application logic
└── icons/               # PWA icons (72px to 512px)
```

## Technical Implementation

### Architecture

Built with vanilla JavaScript using a class-based pattern for state management and event handling. Key architectural components:

- **Settings Class**: Manages user preferences with localStorage persistence
- **TimerState Class**: Handles timer state, statistics, and streak tracking
- **NotificationManager Class**: Controls sound, notifications, and volume
- **ReliefTimer Class**: Main application controller orchestrating all components
- **DOMElements Class**: Efficient caching of DOM references

The application uses a modular design with clear separation of concerns, making it easy to maintain and extend.

### Code Quality

- **JSDoc Documentation**: Comprehensive inline documentation for all classes and methods
- **Error Handling**: Try-catch blocks with graceful fallbacks for all localStorage operations
- **Type Safety**: Parameter validation and type checking throughout
- **Clean Code**: Consistent naming conventions and well-structured methods
- **Performance**: Optimized event listeners and efficient DOM manipulation

### Accessibility

- ARIA live regions for screen reader announcements
- Semantic HTML5 elements
- Full keyboard navigation support
- Descriptive ARIA labels and roles
- High contrast mode compatibility
- Reduced motion support for animations
- Focus management for modal dialogs

### Performance

- Efficient DOM element caching prevents repeated queries
- CSS-based animations using transform and opacity for GPU acceleration
- Minimal external dependencies (vanilla JS only)
- Optimized service worker caching strategy with stale-while-revalidate
- Debounced event handlers where appropriate
- Lazy loading of settings modal (created on first use)

## Browser Support

Modern browsers with ES6+ support. PWA features require HTTPS in production (localhost exempt for development).

## Development

No build process required. Serve the files through any web server:

```bash
# Example with Python
python -m http.server 8000

# Example with Node.js http-server
npx http-server
```

For development with service worker features, use a local HTTPS server or rely on localhost exceptions.

### Development Guidelines

- **Code Style**: Follow existing patterns and naming conventions
- **Documentation**: Add JSDoc comments for all public methods
- **Testing**: Test on multiple browsers and screen sizes
- **Accessibility**: Ensure all features are keyboard accessible
- **Performance**: Profile changes to avoid performance regressions

### Adding New Features

1. Update relevant classes in `js/app.js`
2. Add necessary HTML elements in `index.html`
3. Style with CSS in `css/styles.css`
4. Update service worker cache version in `sw.js`
5. Document changes in README.md
6. Test thoroughly across devices

### File Organization

- **index.html**: Main structure and semantic HTML
- **js/app.js**: All application logic and state management
- **css/styles.css**: App-specific styles
- **shared/theme.css**: Shared theme system (Norrøn design)
- **sw.js**: Service worker for offline functionality
- **manifest.json**: PWA configuration

## Changelog

### Version 3.0 - Enhanced Edition (2025-11-05)

**Major Features Added:**
- Settings panel with comprehensive customization options
- Three timer profile presets plus custom configuration
- Streak tracking and daily goal system
- Data export/import functionality
- PWA install prompt and update notifications
- 15+ exercise routines (up from 9)
- Keyboard shortcuts panel
- Visual goal progress indicator

**Code Quality Improvements:**
- Added JSDoc documentation throughout
- Enhanced error handling with try-catch blocks
- Better state management with modular classes
- Improved accessibility with ARIA labels
- Optimized performance with better caching

**UI/UX Enhancements:**
- Settings modal with smooth animations
- Improved button interactions
- Better visual feedback
- Enhanced responsive design
- Keyboard shortcuts guide

### Version 2.0 - Initial Release

**Core Features:**
- Pomodoro timer with break intervals
- Basic exercise routines
- Session tracking
- PWA support
- Dark/light theme

## License

MIT
