# Hvila (Rest Timer)

A Progressive Web App (PWA) Pomodoro timer designed to help prevent neck and shoulder strain through guided exercise breaks. Built with vanilla JavaScript following modern web development best practices.

**Hvila** (Old Norse: "rest" or "respite") - Your companion for balanced work-rest cycles.

## Features

- **Pomodoro-style timer** with neck/shoulder focused breaks
- **Progressive exercise system** with micro-breaks, exercise breaks, and long breaks
- **Offline functionality** through service worker caching
- **Responsive design** that works on desktop and mobile
- **Accessibility features** with ARIA labels and keyboard navigation
- **Dark/light mode support** based on system preferences
- **Push notifications** and vibration support
- **Session tracking** with local storage persistence

## Project Structure

```
relief-timer/
├── index.html              # Main HTML file with semantic structure
├── manifest.json           # PWA manifest for app installation
├── sw.js                   # Service worker for offline functionality
├── css/
│   └── styles.css          # All styles with CSS custom properties
├── js/
│   └── app.js              # Main application logic
├── icons/                  # PWA icons (various sizes)
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   └── icon-512.png
└── screenshots/            # PWA screenshots
    ├── desktop.png
    └── mobile.png
```

## Key Improvements Made

### 1. **Semantic HTML Structure**
- Used proper semantic elements (`<main>`, `<header>`, `<section>`, `<footer>`)
- Added ARIA labels and live regions for accessibility
- Improved heading hierarchy

### 2. **Modular CSS Architecture**
- Separated CSS into external file
- Used CSS custom properties for theming
- Implemented proper cascade and specificity
- Added responsive design and accessibility features

### 3. **Modern JavaScript Patterns**
- Class-based architecture with separation of concerns
- Configuration constants for easy maintenance
- Proper error handling and logging
- Memory management for intervals and event listeners

### 4. **Progressive Web App Features**
- Complete PWA manifest with proper metadata
- Service worker for offline functionality and caching
- Push notification support
- App installation prompts

### 5. **Accessibility Enhancements**
- Screen reader support with ARIA attributes
- Keyboard navigation support
- High contrast mode support
- Reduced motion preferences support

### 6. **Performance Optimizations**
- Efficient DOM element caching
- Optimized animation and transition properties
- Proper event delegation
- Minimal external dependencies

## Installation

1. Clone or download the project files
2. Serve the files through a web server (required for PWA features)
3. The app will be installable on supported devices

## Browser Support

- Modern browsers with ES6+ support
- PWA features require HTTPS (except localhost)
- Service workers supported in Chrome, Firefox, Safari, Edge

## Development

The app is built with vanilla JavaScript and requires no build process. For development:

1. Use a local server to serve the files
2. Enable developer tools for PWA debugging
3. Test offline functionality by disabling network

## License

This project is open source and available under the MIT License.
