# Hvila - Rest Timer

A Progressive Web App implementing the Pomodoro technique with guided exercise breaks designed to prevent neck and shoulder strain during extended work sessions.

**Hvila** (Old Norse: "rest" or "respite")

## Features

- Pomodoro-style work intervals with scheduled breaks
- Guided neck and shoulder exercises during break periods
- Three break types: micro-breaks (20s), exercise breaks (5min), long breaks (15min)
- Session and exercise counter with local persistence
- Offline functionality via service worker
- Responsive design for desktop and mobile
- Dark/light theme based on system preferences
- Push notifications and vibration support
- Keyboard navigation and screen reader support

## Installation

The app can be installed as a PWA on supported devices:

1. Open the application in a browser
2. Look for the install prompt or use the browser's "Add to Home Screen" option
3. The app will function offline once installed

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

Built with vanilla JavaScript using a class-based pattern for state management and event handling. The timer logic is separated into distinct phases with configuration constants for easy adjustment.

### Accessibility

- ARIA live regions for screen reader announcements
- Semantic HTML elements
- Keyboard navigation support
- High contrast mode compatibility
- Reduced motion support for animations

### Performance

- Efficient DOM element caching
- CSS-based animations using transform and opacity
- Minimal external dependencies
- Optimized service worker caching strategy

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

## License

MIT
