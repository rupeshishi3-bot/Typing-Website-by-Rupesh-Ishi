/**
 * Automated test script to verify all 9 scenarios from STAGE 3
 * Tests TypingEngine, WordGenerator, Statistics, and UI state
 */

import fs from 'fs';
import path from 'path';

// Minimal in-memory localStorage polyfill
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, val) {
    this.store[key] = String(val);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

// DOM Mock Elements
class MockElement {
  constructor(tagName = 'div', id = '', className = '') {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.classList = {
      _classes: new Set(className ? className.split(/\s+/).filter(Boolean) : []),
      add: (...cls) => cls.forEach(c => this.classList._classes.add(c)),
      remove: (...cls) => cls.forEach(c => this.classList._classes.delete(c)),
      contains: (c) => this.classList._classes.has(c),
      toggle: (c, force) => {
        if (force !== undefined) {
          if (force) this.classList._classes.add(c);
          else this.classList._classes.delete(c);
          return force;
        }
        if (this.classList._classes.has(c)) {
          this.classList._classes.delete(c);
          return false;
        } else {
          this.classList._classes.add(c);
          return true;
        }
      }
    };
    this.children = [];
    this.parentNode = null;
    this.style = {};
    this.dataset = {};
    this.textContent = '';
    this.value = '';
    this.eventListeners = {};
    this.offsetTop = 0;
    this.offsetLeft = 0;
    this.offsetWidth = 50;
    this.offsetHeight = 32;
    this.hidden = false;
  }

  set className(val) {
    this.classList._classes = new Set(val ? String(val).split(/\s+/).filter(Boolean) : []);
  }

  get className() {
    return Array.from(this.classList._classes).join(' ');
  }

  get firstElementChild() {
    return this.children[0] || null;
  }

  get lastElementChild() {
    return this.children[this.children.length - 1] || null;
  }

  set innerHTML(val) {
    if (val === '') {
      this.children = [];
    }
  }

  appendChild(child) {
    if (child.isFragment) {
      for (const item of child.children) {
        item.parentNode = this;
        this.children.push(item);
      }
      child.children = [];
      return child;
    }
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  insertBefore(newNode, referenceNode) {
    const idx = this.children.indexOf(referenceNode);
    if (idx === -1) {
      return this.appendChild(newNode);
    }
    if (newNode.isFragment) {
      const items = [...newNode.children];
      newNode.children = [];
      for (let i = 0; i < items.length; i++) {
        items[i].parentNode = this;
        this.children.splice(idx + i, 0, items[i]);
      }
      return newNode;
    }
    newNode.parentNode = this;
    this.children.splice(idx, 0, newNode);
    return newNode;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentNode = null;
    }
    return child;
  }

  addEventListener(event, cb) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(cb);
  }

  removeEventListener(event, cb) {
    if (!this.eventListeners[event]) return;
    this.eventListeners[event] = this.eventListeners[event].filter(fn => fn !== cb);
  }

  dispatchEvent(evt) {
    const listeners = this.eventListeners[evt.type] || [];
    for (const cb of listeners) {
      cb.call(this, evt);
    }
  }

  focus() {
    global.document.activeElement = this;
  }

  getBoundingClientRect() {
    return {
      top: this.offsetTop,
      left: this.offsetLeft,
      width: this.offsetWidth,
      height: this.offsetHeight,
      bottom: this.offsetTop + this.offsetHeight,
      right: this.offsetLeft + this.offsetWidth
    };
  }
}

class MockDocumentFragment {
  constructor() {
    this.isFragment = true;
    this.children = [];
  }
  appendChild(child) {
    this.children.push(child);
    return child;
  }
}

// Build Global Environment
global.window = global;
global.window.addEventListener = (event, cb) => {};
global.window.removeEventListener = (event, cb) => {};
global.window.innerWidth = 1200;
global.window.innerHeight = 800;
global.window.getComputedStyle = () => ({
  getPropertyValue: (prop) => {
    if (prop === '--main-color') return '#e2b714';
    if (prop === '--error-color') return '#ca4754';
    if (prop === '--sub-color') return '#7d828a';
    if (prop === '--text-color') return '#d1d0c5';
    return '';
  }
});
global.localStorage = new MockLocalStorage();
global.document = {
  activeElement: null,
  body: new MockElement('body'),
  documentElement: new MockElement('html'),
  elementsById: {},
  createElement: (tag) => new MockElement(tag),
  createDocumentFragment: () => new MockDocumentFragment(),
  getElementById: (id) => global.document.elementsById[id] || null,
  querySelector: (sel) => {
    if (sel.startsWith('#')) return global.document.getElementById(sel.slice(1));
    if (sel === '.modal-backdrop.open') return null; // no modals open by default
    return null;
  },
  querySelectorAll: (sel) => []
};

// Create required DOM IDs for TypingEngine
const requiredIds = [
  'wordsWrapper', 'typingBox', 'hiddenInput', 'caret', 'liveHud',
  'liveWpm', 'liveAcc', 'hudTimer', 'unfocusedOverlay',
  'capsLockWarning', 'quoteInfo', 'quoteAuthor'
];

requiredIds.forEach(id => {
  const el = new MockElement('div', id);
  global.document.elementsById[id] = el;
});

// Load the scripts
const loadScript = (relativePath) => {
  const fullPath = path.resolve(process.cwd(), relativePath);
  const code = fs.readFileSync(fullPath, 'utf8');
  const fn = new Function('window', 'document', 'localStorage', code);
  fn(global.window, global.document, global.localStorage);
};

console.log('Loading client-side modules...');
loadScript('data/words.js');
loadScript('js/word-generator.js');
loadScript('js/statistics.js');
loadScript('js/settings.js');
loadScript('js/typing-engine.js');

console.log('Modules loaded successfully.');

// Test Suite
const results = [];
function record(testName, passed, details) {
  results.push({ testName, passed, details });
  console.log(`${passed ? '✅ PASS' : '❌ FAIL'}: ${testName} - ${details}`);
}

async function runAllTests() {
  const engine = new global.TypingEngine();
  
  // Simulated word element layout coordinates
  function simulateLayout() {
    const wordEls = engine.wordsWrapper.children.filter(c => c.classList.contains('word'));
    let curX = 0;
    let curY = 0;
    for (let i = 0; i < wordEls.length; i++) {
      const wEl = wordEls[i];
      wEl.offsetLeft = curX;
      wEl.offsetTop = curY;
      wEl.offsetHeight = 32;
      wEl.offsetWidth = (wEl.children.length || 5) * 14;
      curX += wEl.offsetWidth + 12;
      if (curX > 450) { // wrap to next line
        curX = 0;
        curY += 38;
      }
      // letter positions inside word
      let lX = 0;
      for (let j = 0; j < wEl.children.length; j++) {
        const lEl = wEl.children[j];
        lEl.offsetLeft = lX;
        lEl.offsetTop = 0;
        lEl.offsetWidth = 14;
        lEl.offsetHeight = 32;
        lX += 14;
      }
    }
  }

  // --- SCENARIO 1: Start a 30-second test ---
  console.log('\n--- Scenario 1: Start 30s timed test ---');
  const words30 = global.WordGenerator.generate({ mode: 'time', timeOption: 30 });
  engine.start(words30, { mode: 'time', timeOption: 30 });
  simulateLayout();

  const initialWordsCount = engine.words.length;
  const initialTimerText = engine.timerEl.textContent;
  record('Scenario 1 - Mode & Timer setup', 
    engine.mode === 'time' && engine.timeLimit === 30 && String(initialTimerText) === '30' && initialWordsCount >= 60,
    `Mode: ${engine.mode}, limit: ${engine.timeLimit}s, initial timer: ${initialTimerText}, words pool: ${initialWordsCount}`
  );

  // --- SCENARIO 2: Type several words correctly ---
  console.log('\n--- Scenario 2: Type several words correctly ---');
  const firstWord = engine.words[0];
  for (let ch of firstWord) {
    engine.handleKeyDown({ key: ch, ctrlKey: false, altKey: false, metaKey: false, preventDefault: () => {} });
  }
  // Space to complete first word
  engine.handleKeyDown({ key: ' ', ctrlKey: false, altKey: false, metaKey: false, preventDefault: () => {} });

  // Second word
  const secondWord = engine.words[1];
  for (let ch of secondWord) {
    engine.handleKeyDown({ key: ch, ctrlKey: false, altKey: false, metaKey: false, preventDefault: () => {} });
  }
  engine.handleKeyDown({ key: ' ', ctrlKey: false, altKey: false, metaKey: false, preventDefault: () => {} });

  const totalTypedCorrect = firstWord.length + secondWord.length + 2; // letters + spaces
  record('Scenario 2 - Type words correctly',
    engine.isActive === true && engine.currentWordIdx === 2 && engine.correctChars === totalTypedCorrect && engine.totalErrors === 0,
    `Active: ${engine.isActive}, current word index: ${engine.currentWordIdx}, correct chars: ${engine.correctChars}, errors: ${engine.totalErrors}`
  );

  // --- SCENARIO 3: Type some characters incorrectly ---
  console.log('\n--- Scenario 3: Type characters incorrectly ---');
  const thirdWord = engine.words[2];
  const wrongChar = thirdWord[0] === 'z' ? 'x' : 'z';
  engine.handleKeyDown({ key: wrongChar, ctrlKey: false, altKey: false, metaKey: false, preventDefault: () => {} });

  const errorsAfterMistake = engine.totalErrors;
  const accuracyLive = engine.calculateAccuracy();
  record('Scenario 3 - Incorrect character detection & accuracy response',
    errorsAfterMistake === 1 && accuracyLive < 100,
    `Total errors: ${errorsAfterMistake}, live accuracy: ${accuracyLive}%`
  );

  // --- SCENARIO 4: Use Backspace ---
  console.log('\n--- Scenario 4: Use Backspace ---');
  const letterIdxBeforeBackspace = engine.currentLetterIdx;
  engine.handleKeyDown({ key: 'Backspace', ctrlKey: false, altKey: false, metaKey: false, preventDefault: () => {} });
  const letterIdxAfterBackspace = engine.currentLetterIdx;
  // Total errors must NOT decrease on backspace (accuracy reflects genuine keystroke history)
  record('Scenario 4 - Backspace correction without corrupting error count',
    letterIdxAfterBackspace === letterIdxBeforeBackspace - 1 && engine.totalErrors === 1,
    `Letter idx before: ${letterIdxBeforeBackspace}, after: ${letterIdxAfterBackspace}, totalErrors preserved: ${engine.totalErrors}`
  );

  // Re-type the third word correctly and advance
  for (let ch of thirdWord) {
    engine.handleKeyDown({ key: ch, ctrlKey: false, altKey: false, metaKey: false, preventDefault: () => {} });
  }
  engine.handleKeyDown({ key: ' ', ctrlKey: false, altKey: false, metaKey: false, preventDefault: () => {} });

  // --- SCENARIO 5: Allow a test to finish ---
  console.log('\n--- Scenario 5: Allow test to finish ---');
  let completedSummary = null;
  engine.onComplete = (summary) => {
    completedSummary = summary;
  };
  // Simulate test completing
  engine.finish();
  record('Scenario 5 - Test completion and results summary calculation',
    engine.isFinished === true && engine.isActive === false && completedSummary !== null && completedSummary.wpm >= 0 && completedSummary.acc > 0,
    `Finished: ${engine.isFinished}, WPM: ${completedSummary?.wpm}, Raw: ${completedSummary?.rawWpm}, Acc: ${completedSummary?.acc}%, chars: ${completedSummary?.correctChars}/${completedSummary?.incorrectChars}/${completedSummary?.extraChars}/${completedSummary?.missedChars}`
  );

  // --- SCENARIO 6: Restart the test ---
  console.log('\n--- Scenario 6: Restart test ---');
  engine.reset();
  simulateLayout();
  record('Scenario 6 - Restart resets HUD, states, and coordinates',
    engine.isActive === false && engine.isFinished === false && engine.currentWordIdx === 0 && engine.currentLetterIdx === 0 &&
    engine.liveWpmEl.textContent === '0' && engine.liveAccEl.textContent === '100%' && engine.wordsWrapper.style.transform === 'translateY(0px)',
    `WPM HUD: ${engine.liveWpmEl.textContent}, Acc HUD: ${engine.liveAccEl.textContent}, transform: ${engine.wordsWrapper.style.transform}, wordIdx: ${engine.currentWordIdx}`
  );

  // --- SCENARIO 7: Change between time and words modes ---
  console.log('\n--- Scenario 7: Change between time and words modes ---');
  const words25 = global.WordGenerator.generate({ mode: 'words', wordOption: 25 });
  engine.start(words25, { mode: 'words', wordOption: 25 });
  record('Scenario 7A - Words mode (25 words)',
    engine.mode === 'words' && engine.words.length === 25,
    `Mode: ${engine.mode}, words generated: ${engine.words.length}`
  );

  const words100 = global.WordGenerator.generate({ mode: 'words', wordOption: 100 });
  engine.start(words100, { mode: 'words', wordOption: 100 });
  record('Scenario 7B - Words mode (100 words)',
    engine.mode === 'words' && engine.words.length === 100,
    `Mode: ${engine.mode}, words generated: ${engine.words.length}`
  );

  const words60s = global.WordGenerator.generate({ mode: 'time', timeOption: 60 });
  engine.start(words60s, { mode: 'time', timeOption: 60 });
  record('Scenario 7C - Return to Time mode (60s)',
    engine.mode === 'time' && engine.timeLimit === 60 && engine.words.length >= 100,
    `Mode: ${engine.mode}, timeLimit: ${engine.timeLimit}, words generated: ${engine.words.length}`
  );

  // --- SCENARIO 8: Test punctuation and numbers ---
  console.log('\n--- Scenario 8: Test punctuation and numbers ---');
  const wordsWithBoth = global.WordGenerator.generate({
    mode: 'words',
    wordOption: 50,
    punctuation: true,
    numbers: true
  });
  const hasPunctuation = wordsWithBoth.some(w => /[,.?!;:]/.test(w) || /^[A-Z]/.test(w));
  const hasNumbers = wordsWithBoth.some(w => /^[0-9]+$/.test(w));
  record('Scenario 8 - Punctuation and Numbers generation',
    hasPunctuation === true && hasNumbers === true,
    `Has punctuation/caps: ${hasPunctuation}, Has numbers: ${hasNumbers}, sample: ${wordsWithBoth.slice(0, 8).join(' ')}`
  );

  // --- SCENARIO 9: Test line wrapping and scrolling without clipping ---
  console.log('\n--- Scenario 9: 3-line scroll and narrow mobile viewport layout ---');
  const words50 = global.WordGenerator.generate({ mode: 'words', wordOption: 50 });
  engine.start(words50, { mode: 'words', wordOption: 50 });
  simulateLayout();

  // Find word index on line 2 (offset >= 76)
  const wordEls = engine.wordsWrapper.children.filter(c => c.classList.contains('word'));
  let wordOnLine2Idx = -1;
  for (let i = 0; i < wordEls.length; i++) {
    if (wordEls[i].offsetTop >= 76) {
      wordOnLine2Idx = i;
      break;
    }
  }

  // Type up to that word
  for (let i = 0; i <= wordOnLine2Idx; i++) {
    const w = engine.words[i];
    for (let ch of w) {
      engine.handleKeyDown({ key: ch, ctrlKey: false, altKey: false, metaKey: false, preventDefault: () => {} });
    }
    engine.handleKeyDown({ key: ' ', ctrlKey: false, altKey: false, metaKey: false, preventDefault: () => {} });
  }

  const scrollTransform = engine.wordsWrapper.style.transform;
  const hasScrolled = scrollTransform.includes('translateY(-');
  record('Scenario 9 - 3-line view step scrolling on line transition',
    hasScrolled === true,
    `Scrolled transform on line 2/3 transition: ${scrollTransform}, current word index: ${engine.currentWordIdx}`
  );

  // Reset engine to clear all timers so node exits immediately
  engine.reset();

  // Final summary
  console.log('\n=======================================');
  console.log('       STAGE 3 TEST HARNESS SUMMARY     ');
  console.log('=======================================');
  const passedCount = results.filter(r => r.passed).length;
  console.log(`Total tests: ${results.length} | Passed: ${passedCount} | Failed: ${results.length - passedCount}`);
  if (passedCount === results.length) {
    console.log('ALL 9 STAGE 3 SCENARIOS EXECUTED AND PASSED SUCCESSFULLY!');
  } else {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
