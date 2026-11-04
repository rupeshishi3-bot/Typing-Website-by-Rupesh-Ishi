# Rupesh Ishi Typing

A minimalist, highly customizable Monkeytype-inspired typing test platform built with pure HTML5, CSS3, and modern Vanilla JavaScript.

Designed for distraction-free typing speed improvement with instant visual feedback, smooth caret animations, live analytics, and 10+ custom color palettes.

## Features

- **Minimalist, Distraction-Free UI**: Clean dark aesthetic, warm typography, zero clutter.
- **Advanced Typing Engine**: Character-by-character live validation, smooth caret animation, instant backspace correction, and multi-line word scrolling.
- **Multiple Test Modes**:
  - **Time Mode**: 15s, 30s, 60s, 120s
  - **Word Mode**: 10, 25, 50, 100 words
  - **Quote Mode**: Short, medium, and long curated literary and philosophical quotes
  - **Custom Text**: Practice any custom text, paragraph, or code snippet
- **Modifiers**:
  - `@ punctuation`: Smart capitalizations, commas, periods, quotation marks
  - `# numbers`: Injects realistic multi-digit numbers throughout test
- **Live HUD**: Real-time timer countdown, live WPM, live Accuracy, and Caps Lock detection.
- **Detailed Results Screen**:
  - Net WPM, Raw WPM, Accuracy %, Consistency score
  - Exact character breakdown (correct, incorrect, extra, missed)
  - Native Canvas WPM progression line curve
  - All-time personal best comparison
- **Deep Customization (`settings.html`)**:
  - **10 Color Themes**: Serika Dark, Carbon, Nord, Dracula, Cyberpunk, Matrix, Paper Light, Sunset, Botanical, Gruvbox
  - **Typography**: Space Mono, JetBrains Mono, Roboto Mono, Fira Code
  - **Caret Styles**: Line, Block, Underline, Outline, Off (with smooth or step motion)
  - **Modes**: Focus mode, Confidence mode (no backspace), Freedom mode
  - **Audio Synthesizer**: Web Audio API mechanical key clicks with volume control
  - **Settings Backup**: Export and import preferences as JSON
- **Personal Analytics (`stats.html`)**:
  - Personal records table across all modes
  - Historical test log stored in `localStorage`
  - Mistyped keys diagnostic heat-map
  - Local browser storage with zero external dependencies
- **Command Line (Palette)**: Press `Ctrl+Shift+P` or `Esc` anywhere to quickly switch themes, modes, and settings from the keyboard.
- **Mobile Responsive**: Fully responsive layout optimized for Android and touch devices with seamless keyboard input synchronization.

## Technology Stack

- **HTML5** & semantic markup
- **CSS3** with CSS custom properties and responsive media queries
- **Vanilla JavaScript (ES2022)**
- **Web Audio API** for real-time sound synthesis
- **HTML5 Canvas** for smooth charting without external libraries
- **100% Static**: Directly deployable on GitHub Pages with zero build step or backend required.
