/**
 * Settings Manager for Monkeytype-inspired Typing Platform
 * Persists all customization in localStorage
 */

const SETTINGS_KEY = 'monkey_settings';

const DEFAULT_SETTINGS = {
  theme: 'serika-dark',
  mode: 'time',             // 'time' | 'words' | 'quote' | 'custom'
  timeOption: 30,           // 15, 30, 60, 120
  wordOption: 50,           // 10, 25, 50, 100
  quoteOption: 'medium',    // 'short', 'medium', 'long'
  punctuation: false,
  numbers: false,
  difficulty: 'normal',     // 'normal', 'expert', 'master'
  fontFamily: 'Space Mono',
  fontSize: 'medium',       // 'small', 'medium', 'large', 'xlarge'
  caretStyle: 'line',       // 'line', 'block', 'underline', 'outline', 'off'
  smoothCaret: true,
  soundOnClick: 'click',    // 'off', 'click', 'beep', 'pop'
  soundVolume: 0.1,
  showLiveWpm: true,
  showLiveAcc: true,
  showTimer: true,
  focusMode: false,
  confidenceMode: false,    // no backspace allowed
  freedomMode: false,       // backspace any word
  stopOnError: 'off',       // 'off', 'letter', 'word'
  customText: ''
};

const THEMES_LIST = [
  { id: 'serika-dark', name: 'Serika Dark', primary: '#e2b714', bg: '#323437' },
  { id: 'carbon', name: 'Carbon', primary: '#f66e0d', bg: '#313131' },
  { id: 'nord', name: 'Nord', primary: '#88c0d0', bg: '#242933' },
  { id: 'dracula', name: 'Dracula', primary: '#ff79c6', bg: '#282a36' },
  { id: 'cyberpunk', name: 'Cyberpunk', primary: '#05d9e8', bg: '#0b0a1a' },
  { id: 'matrix', name: 'Matrix', primary: '#15ff00', bg: '#080d08' },
  { id: 'paper-light', name: 'Paper Light', primary: '#0969da', bg: '#f6f8fa' },
  { id: 'sunset', name: 'Sunset', primary: '#f39c12', bg: '#1a162b' },
  { id: 'botanical', name: 'Botanical', primary: '#7eb09b', bg: '#1b2621' },
  { id: 'gruvbox', name: 'Gruvbox', primary: '#fabd2f', bg: '#282828' }
];

const FONTS_LIST = [
  'Space Mono',
  'JetBrains Mono',
  'Roboto Mono',
  'Fira Code',
  'monospace'
];

let currentSettings = { ...DEFAULT_SETTINGS };

function initSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      currentSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to parse settings from localStorage, using defaults', e);
  }
  applySettings(currentSettings);
  return currentSettings;
}

function getSettings() {
  return currentSettings;
}

function updateSettings(patch) {
  currentSettings = { ...currentSettings, ...patch };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings));
  } catch (e) {
    console.warn('Failed to save settings', e);
  }
  applySettings(currentSettings);
  window.dispatchEvent(new CustomEvent('settings-changed', { detail: currentSettings }));
}

function applySettings(settings) {
  const html = document.documentElement;

  // 1. Apply Theme
  html.setAttribute('data-theme', settings.theme || 'serika-dark');

  // 2. Apply Font Family
  if (settings.fontFamily) {
    document.documentElement.style.setProperty('--font-family', `"${settings.fontFamily}", monospace`);
  }

  // 3. Apply Font Size
  const sizeMap = {
    small: '1.25rem',
    medium: '1.6rem',
    large: '1.9rem',
    xlarge: '2.2rem'
  };
  const lineHeightMap = {
    small: '1.9rem',
    medium: '2.4rem',
    large: '2.8rem',
    xlarge: '3.3rem'
  };
  const boxHeightMap = {
    small: '5.7rem',
    medium: '7.2rem',
    large: '8.4rem',
    xlarge: '9.9rem'
  };

  const selectedSize = settings.fontSize || 'medium';
  const typingBox = document.querySelector('.typing-box');
  if (typingBox) {
    if (typeof window !== 'undefined' && window.innerWidth > 900) {
      typingBox.style.fontSize = sizeMap[selectedSize] || sizeMap.medium;
      typingBox.style.lineHeight = lineHeightMap[selectedSize] || lineHeightMap.medium;
      typingBox.style.height = boxHeightMap[selectedSize] || boxHeightMap.medium;
    } else {
      typingBox.style.fontSize = '';
      typingBox.style.lineHeight = '';
      typingBox.style.height = '';
    }
  }

  // 4. Apply Caret Style
  const caret = document.querySelector('.caret');
  if (caret) {
    caret.className = 'caret';
    if (settings.caretStyle) {
      caret.classList.add(`style-${settings.caretStyle}`);
    }
    if (!settings.smoothCaret) {
      caret.style.transition = 'none';
    } else {
      caret.style.transition = 'left 0.09s ease-out, top 0.12s ease-out';
    }
  }

  // 5. Update Theme Indicator Button
  const themeBtn = document.getElementById('themeIndicatorText');
  if (themeBtn) {
    const curTheme = THEMES_LIST.find(t => t.id === settings.theme);
    themeBtn.textContent = curTheme ? curTheme.name.toLowerCase() : settings.theme;
  }
}

function exportSettings() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentSettings, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `monkeytype_settings_${Date.now()}.json`);
  dlAnchor.click();
}

function importSettings(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
    updateSettings(parsed);
    return true;
  } catch (e) {
    alert("Invalid settings JSON file.");
    return false;
  }
}

// Global exposure
if (typeof window !== 'undefined') {
  window.Settings = {
    init: initSettings,
    get: getSettings,
    update: updateSettings,
    apply: applySettings,
    THEMES: THEMES_LIST,
    FONTS: FONTS_LIST,
    export: exportSettings,
    import: importSettings
  };
}
