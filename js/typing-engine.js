/**
 * Typing Engine for Monkeytype-inspired Typing Platform
 * Core logic for character validation, smooth caret positioning, live stats, and audio feedback
 */

class TypingEngine {
  constructor(options = {}) {
    this.wordsWrapper = options.wordsWrapper || document.getElementById('wordsWrapper');
    this.caret = options.caret || document.getElementById('caret');
    this.hiddenInput = options.hiddenInput || document.getElementById('hiddenInput');
    this.typingBox = options.typingBox || document.getElementById('typingBox');
    this.timerEl = options.timerEl || document.getElementById('hudTimer');
    this.liveWpmEl = options.liveWpmEl || document.getElementById('liveWpm');
    this.liveAccEl = options.liveAccEl || document.getElementById('liveAcc');
    this.capsLockWarning = options.capsLockWarning || document.getElementById('capsLockWarning');

    this.onComplete = options.onComplete || (() => {});

    // State
    this.words = [];
    this.currentWordIdx = 0;
    this.currentLetterIdx = 0;
    this.wordEntries = []; // array of { typed: string, original: string, isCorrect: boolean }

    this.isActive = false;
    this.isFinished = false;
    this.startTime = null;
    this.timerInterval = null;
    this.liveStatsInterval = null;

    this.timeLimit = 30; // seconds for time mode
    this.timeRemaining = 30;
    this.elapsedSeconds = 0;

    this.correctChars = 0;
    this.incorrectChars = 0;
    this.extraChars = 0;
    this.missedChars = 0;
    this.totalKeyStrokes = 0;

    this.wpmHistory = []; // [ { second: 1, wpm: 65, rawWpm: 70, errors: 1 } ]
    this.secondKeyStrokes = 0;
    this.secondErrors = 0;

    // Web Audio Synthesizer
    this.audioCtx = null;

    this.bindEvents();
  }

  initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  playSound(type = 'click') {
    const settings = window.Settings ? window.Settings.get() : {};
    if (settings.soundOnClick === 'off') return;

    try {
      this.initAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;
      const vol = settings.soundVolume !== undefined ? settings.soundVolume : 0.1;

      if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        gain.gain.setValueAtTime(vol * 1.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.065);
      } else {
        // Crisp mechanical click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.025);
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch (e) {}
  }

  bindEvents() {
    // Focus capture
    if (this.typingBox) {
      this.typingBox.addEventListener('click', () => this.focusInput());
    }

    // Physical Keyboard Events
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // Hidden Input for mobile touch keyboards
    if (this.hiddenInput) {
      this.hiddenInput.addEventListener('input', (e) => {
        // Mobile input synchronization
        const val = this.hiddenInput.value;
        if (val) {
          const char = val.slice(-1);
          this.processCharInput(char);
          this.hiddenInput.value = '';
        }
      });
    }

    // Resize recalculation for smooth caret coordinates
    window.addEventListener('resize', () => {
      this.updateCaretPosition();
    });
  }

  focusInput() {
    if (this.hiddenInput) {
      this.hiddenInput.focus({ preventScroll: true });
    }
    const unfocused = document.getElementById('unfocusedOverlay');
    if (unfocused) unfocused.hidden = true;
  }

  start(wordsList, options = {}) {
    this.reset();

    this.words = [...wordsList];
    this.mode = options.mode || 'time';
    this.timeLimit = options.timeOption || 30;
    this.timeRemaining = this.timeLimit;
    this.quoteAuthor = options.quoteAuthor || null;

    // Render words in DOM
    this.renderWords();

    // Initial HUD update
    this.updateHud();

    // Position caret at start
    setTimeout(() => {
      this.updateCaretPosition();
      this.focusInput();
    }, 20);
  }

  reset() {
    clearInterval(this.timerInterval);
    clearInterval(this.liveStatsInterval);
    this.timerInterval = null;
    this.liveStatsInterval = null;

    this.currentWordIdx = 0;
    this.currentLetterIdx = 0;
    this.wordEntries = [];

    this.isActive = false;
    this.isFinished = false;
    this.startTime = null;
    this.elapsedSeconds = 0;

    this.correctChars = 0;
    this.incorrectChars = 0;
    this.extraChars = 0;
    this.missedChars = 0;
    this.totalKeyStrokes = 0;

    this.wpmHistory = [];
    this.secondKeyStrokes = 0;
    this.secondErrors = 0;

    if (this.wordsWrapper) {
      this.wordsWrapper.style.transform = 'translateY(0px)';
    }

    const unfocused = document.getElementById('unfocusedOverlay');
    if (unfocused) unfocused.hidden = true;

    document.body.classList.remove('focus-mode');
  }

  renderWords() {
    if (!this.wordsWrapper) return;
    this.wordsWrapper.innerHTML = '';

    const frag = document.createDocumentFragment();

    this.words.forEach((wordText, wordIdx) => {
      const wordEl = document.createElement('div');
      wordEl.className = 'word';
      wordEl.dataset.wordIndex = wordIdx;

      for (let i = 0; i < wordText.length; i++) {
        const letterEl = document.createElement('span');
        letterEl.className = 'letter';
        letterEl.textContent = wordText[i];
        letterEl.dataset.letterIndex = i;
        wordEl.appendChild(letterEl);
      }

      frag.appendChild(wordEl);
      this.wordEntries.push({ typed: '', original: wordText, isCorrect: false });
    });

    this.wordsWrapper.appendChild(frag);
  }

  handleKeyDown(e) {
    // Check Caps Lock
    if (this.capsLockWarning) {
      this.capsLockWarning.hidden = !e.getModifierState('CapsLock');
    }

    // Ignore shortcut keys
    if (e.ctrlKey || e.metaKey || e.altKey) {
      if (e.ctrlKey && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        window.openCommandPalette && window.openCommandPalette();
      }
      return;
    }

    // Tab key handling (Quick restart shortcut Tab + Enter or Tab)
    if (e.key === 'Tab') {
      e.preventDefault();
      this.tabPressed = true;
      return;
    }

    if (e.key === 'Enter') {
      if (this.tabPressed) {
        e.preventDefault();
        this.tabPressed = false;
        window.restartTest && window.restartTest();
        return;
      }
      if (this.isFinished) {
        e.preventDefault();
        window.restartTest && window.restartTest();
        return;
      }
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      const modal = document.querySelector('.modal-backdrop.open');
      if (modal) {
        modal.classList.remove('open');
      } else {
        window.restartTest && window.restartTest();
      }
      return;
    }

    if (this.isFinished) return;

    // First keypress starts timers
    if (!this.isActive) {
      const isStartKey = e.key.length === 1 || e.key === ' ' || e.key === 'Backspace';
      if (isStartKey) {
        this.startTimers();
      }
    }

    const settings = window.Settings ? window.Settings.get() : {};

    // 1. Backspace Key
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (settings.confidenceMode) return; // Confidence mode forbids backspace
      this.handleBackspace();
      return;
    }

    // 2. Space Key
    if (e.key === ' ') {
      e.preventDefault();
      this.handleSpace();
      return;
    }

    // 3. Regular Character Keys
    if (e.key.length === 1) {
      e.preventDefault();
      this.processCharInput(e.key);
    }
  }

  handleKeyUp(e) {
    if (e.key === 'Tab') {
      setTimeout(() => { this.tabPressed = false; }, 400);
    }
  }

  startTimers() {
    this.isActive = true;
    this.startTime = Date.now();

    // Enable focus mode if requested in settings
    const settings = window.Settings ? window.Settings.get() : {};
    if (settings.focusMode) {
      document.body.classList.add('focus-mode');
    }

    // Timer Interval (1 second ticks)
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;

      // Record second snapshot for WPM chart
      const currentNetWpm = this.calculateNetWpm();
      const currentRawWpm = this.calculateRawWpm();
      this.wpmHistory.push({
        second: this.elapsedSeconds,
        wpm: currentNetWpm,
        rawWpm: currentRawWpm,
        errors: this.secondErrors
      });
      this.secondErrors = 0;
      this.secondKeyStrokes = 0;

      if (this.mode === 'time') {
        this.timeRemaining--;
        if (this.timeRemaining <= 0) {
          this.timeRemaining = 0;
          this.updateHud();
          this.finish();
          return;
        }
      }
      this.updateHud();
    }, 1000);

    // Live Stats Interval (100ms smooth updates)
    this.liveStatsInterval = setInterval(() => {
      this.updateLiveStats();
    }, 100);
  }

  processCharInput(char) {
    const currentWordEl = this.wordsWrapper.children[this.currentWordIdx];
    if (!currentWordEl) return;

    const originalWord = this.words[this.currentWordIdx];
    const settings = window.Settings ? window.Settings.get() : {};

    // Stop on error setting
    if (settings.stopOnError === 'letter') {
      const targetLetter = originalWord[this.currentLetterIdx];
      if (targetLetter && char !== targetLetter) {
        this.playSound('error');
        return;
      }
    }

    this.totalKeyStrokes++;
    this.secondKeyStrokes++;

    const letterCount = originalWord.length;

    if (this.currentLetterIdx < letterCount) {
      // Normal within-word letter typing
      const expectedChar = originalWord[this.currentLetterIdx];
      const letterEl = currentWordEl.children[this.currentLetterIdx];

      if (char === expectedChar) {
        letterEl.className = 'letter correct';
        this.correctChars++;
        this.playSound('click');
      } else {
        letterEl.className = 'letter incorrect';
        this.incorrectChars++;
        this.secondErrors++;
        this.playSound('error');
        window.Statistics && window.Statistics.recordMistype(expectedChar);
      }
      this.currentLetterIdx++;
    } else {
      // Extra characters beyond word length
      if (currentWordEl.children.length < letterCount + 10) { // Limit extra spam
        const extraEl = document.createElement('span');
        extraEl.className = 'letter extra';
        extraEl.textContent = char;
        currentWordEl.appendChild(extraEl);
        this.extraChars++;
        this.secondErrors++;
        this.playSound('error');
      }
      this.currentLetterIdx++;
    }

    // Update active word entry
    this.wordEntries[this.currentWordIdx].typed += char;

    this.updateWordErrorState(currentWordEl, originalWord);
    this.updateCaretPosition();
    this.scrollWordIntoView(currentWordEl);

    // Auto-complete in word or quote mode when final character is typed
    if ((this.mode === 'words' || this.mode === 'quote' || this.mode === 'custom') &&
        this.currentWordIdx === this.words.length - 1 &&
        this.currentLetterIdx >= originalWord.length) {
      this.finish();
    }
  }

  handleBackspace() {
    const currentWordEl = this.wordsWrapper.children[this.currentWordIdx];
    if (!currentWordEl) return;

    const originalWord = this.words[this.currentWordIdx];

    if (this.currentLetterIdx > 0) {
      this.currentLetterIdx--;
      const letterCount = originalWord.length;

      if (this.currentLetterIdx >= letterCount) {
        // Remove extra letter element
        const lastExtra = currentWordEl.lastElementChild;
        if (lastExtra && lastExtra.classList.contains('extra')) {
          currentWordEl.removeChild(lastExtra);
        }
      } else {
        // Reset normal letter
        const letterEl = currentWordEl.children[this.currentLetterIdx];
        if (letterEl) {
          letterEl.className = 'letter';
        }
      }

      this.wordEntries[this.currentWordIdx].typed = this.wordEntries[this.currentWordIdx].typed.slice(0, -1);
      this.updateWordErrorState(currentWordEl, originalWord);
      this.updateCaretPosition();
    } else {
      // At beginning of word: check if freedom mode allows backspacing to previous word
      const settings = window.Settings ? window.Settings.get() : {};
      if (settings.freedomMode && this.currentWordIdx > 0) {
        this.currentWordIdx--;
        const prevWordEl = this.wordsWrapper.children[this.currentWordIdx];
        const prevOriginal = this.words[this.currentWordIdx];
        this.currentLetterIdx = prevWordEl.children.length;
        this.updateCaretPosition();
        this.scrollWordIntoView(prevWordEl);
      }
    }
  }

  handleSpace() {
    const currentWordEl = this.wordsWrapper.children[this.currentWordIdx];
    if (!currentWordEl) return;

    // Prevent advancing on empty space if hasn't typed anything in current word
    if (this.currentLetterIdx === 0) return;

    const originalWord = this.words[this.currentWordIdx];
    const letterCount = originalWord.length;

    // Check missed characters
    if (this.currentLetterIdx < letterCount) {
      for (let i = this.currentLetterIdx; i < letterCount; i++) {
        const letterEl = currentWordEl.children[i];
        letterEl.classList.add('incorrect');
        this.missedChars++;
      }
    }

    this.updateWordErrorState(currentWordEl, originalWord);

    // Advance to next word
    this.currentWordIdx++;
    this.currentLetterIdx = 0;

    // Check if test reached end of word list
    if (this.currentWordIdx >= this.words.length) {
      this.finish();
      return;
    }

    const nextWordEl = this.wordsWrapper.children[this.currentWordIdx];
    this.updateCaretPosition();
    this.scrollWordIntoView(nextWordEl);
    this.updateHud();
  }

  updateWordErrorState(wordEl, originalWord) {
    let hasError = false;
    for (let i = 0; i < wordEl.children.length; i++) {
      const child = wordEl.children[i];
      if (child.classList.contains('incorrect') || child.classList.contains('extra')) {
        hasError = true;
        break;
      }
    }
    wordEl.classList.toggle('error-word', hasError);
  }

  updateCaretPosition() {
    if (!this.caret || !this.wordsWrapper) return;

    const currentWordEl = this.wordsWrapper.children[this.currentWordIdx];
    if (!currentWordEl) return;

    let targetLeft = 0;
    let targetTop = 0;

    const wrapperRect = this.wordsWrapper.getBoundingClientRect();

    if (this.currentLetterIdx < currentWordEl.children.length) {
      const letterEl = currentWordEl.children[this.currentLetterIdx];
      const letterRect = letterEl.getBoundingClientRect();
      targetLeft = letterRect.left - wrapperRect.left;
      targetTop = letterRect.top - wrapperRect.top + (letterRect.height * 0.15);
    } else {
      // At the end of the word
      const lastLetter = currentWordEl.children[currentWordEl.children.length - 1];
      if (lastLetter) {
        const lastRect = lastLetter.getBoundingClientRect();
        targetLeft = lastRect.right - wrapperRect.left;
        targetTop = lastRect.top - wrapperRect.top + (lastRect.height * 0.15);
      } else {
        const wordRect = currentWordEl.getBoundingClientRect();
        targetLeft = wordRect.left - wrapperRect.left;
        targetTop = wordRect.top - wrapperRect.top;
      }
    }

    this.caret.style.left = `${targetLeft}px`;
    this.caret.style.top = `${targetTop}px`;

    // Add typing class to pause blinking while striking keys
    this.caret.classList.add('typing');
    clearTimeout(this.caretTypingTimeout);
    this.caretTypingTimeout = setTimeout(() => {
      this.caret.classList.remove('typing');
    }, 450);
  }

  scrollWordIntoView(wordEl) {
    if (!wordEl || !this.wordsWrapper || !this.typingBox) return;

    const wordTop = wordEl.offsetTop;
    const currentTransform = Math.abs(parseInt(this.wordsWrapper.style.transform.replace(/[^\d.-]/g, '') || '0', 10));

    // If word wraps onto the second line down, shift whole container up by one line height
    const lineHeight = wordEl.offsetHeight * 1.5 || 38;
    if (wordTop - currentTransform > lineHeight) {
      const shift = wordTop - lineHeight;
      this.wordsWrapper.style.transform = `translateY(-${shift}px)`;
    }
  }

  calculateNetWpm() {
    const elapsedMinutes = Math.max((Date.now() - (this.startTime || Date.now())) / 60000, 0.015);
    const wpm = (this.correctChars / 5) / elapsedMinutes;
    return Math.max(Math.round(wpm), 0);
  }

  calculateRawWpm() {
    const elapsedMinutes = Math.max((Date.now() - (this.startTime || Date.now())) / 60000, 0.015);
    const rawWpm = (this.totalKeyStrokes / 5) / elapsedMinutes;
    return Math.max(Math.round(rawWpm), 0);
  }

  calculateAccuracy() {
    if (this.totalKeyStrokes === 0) return 100;
    const acc = (this.correctChars / this.totalKeyStrokes) * 100;
    return Math.min(Math.max(Math.round(acc * 10) / 10, 0), 100);
  }

  calculateConsistency() {
    if (this.wpmHistory.length < 3) return 100;
    const wpms = this.wpmHistory.map(h => h.wpm);
    const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    if (mean === 0) return 100;

    const variance = wpms.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpms.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / mean) * 100; // Coefficient of variation
    const consistency = Math.max(Math.round(100 - cv), 0);
    return Math.min(consistency, 100);
  }

  updateHud() {
    if (!this.timerEl) return;

    if (this.mode === 'time') {
      this.timerEl.textContent = this.timeRemaining;
    } else if (this.mode === 'words') {
      this.timerEl.textContent = `${this.currentWordIdx}/${this.words.length}`;
    } else {
      this.timerEl.textContent = `${this.currentWordIdx}/${this.words.length}`;
    }
  }

  updateLiveStats() {
    if (!this.isActive) return;
    const settings = window.Settings ? window.Settings.get() : {};

    if (this.liveWpmEl && settings.showLiveWpm) {
      this.liveWpmEl.textContent = this.calculateNetWpm();
    }
    if (this.liveAccEl && settings.showLiveAcc) {
      this.liveAccEl.textContent = `${Math.round(this.calculateAccuracy())}%`;
    }
  }

  finish() {
    if (this.isFinished) return;
    this.isFinished = true;
    this.isActive = false;

    clearInterval(this.timerInterval);
    clearInterval(this.liveStatsInterval);

    document.body.classList.remove('focus-mode');

    // Final calculations
    const netWpm = this.calculateNetWpm();
    const rawWpm = this.calculateRawWpm();
    const accuracy = this.calculateAccuracy();
    const consistency = this.calculateConsistency();
    const totalTime = Math.max(Math.round((Date.now() - (this.startTime || Date.now())) / 1000), 1);

    // Append last snapshot to wpm history
    if (this.wpmHistory.length === 0 || this.wpmHistory[this.wpmHistory.length - 1].second !== totalTime) {
      this.wpmHistory.push({
        second: totalTime,
        wpm: netWpm,
        rawWpm: rawWpm,
        errors: this.secondErrors
      });
    }

    const testSummary = {
      wpm: netWpm,
      rawWpm: rawWpm,
      acc: accuracy,
      consistency: consistency,
      correctChars: this.correctChars,
      incorrectChars: this.incorrectChars,
      extraChars: this.extraChars,
      missedChars: this.missedChars,
      totalChars: this.totalKeyStrokes,
      time: totalTime,
      mode: `${this.mode} ${this.mode === 'time' ? this.timeLimit : this.words.length}`,
      date: Date.now(),
      wpmHistory: this.wpmHistory,
      quoteAuthor: this.quoteAuthor
    };

    this.onComplete(testSummary);
  }
}

if (typeof window !== 'undefined') {
  window.TypingEngine = TypingEngine;
}
