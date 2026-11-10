/**
 * Typing Engine for Monkeytype-inspired Typing Platform
 * Core logic for character-by-character validation, smooth caret positioning,
 * live stats, audio feedback, and responsive input synchronization.
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

    this.mode = 'time';
    this.timeLimit = 30; // seconds for time mode
    this.timeRemaining = 30;
    this.elapsedSeconds = 0;

    this.correctChars = 0;
    this.totalErrors = 0;  // Total mistake keypresses made (both corrected and uncorrected)
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
      const vol = settings.soundVolume !== undefined ? settings.soundVolume : 0.08;

      if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        gain.gain.setValueAtTime(vol * 1.3, now);
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
    // Focus capture on typing box or unfocused overlay
    if (this.typingBox) {
      this.typingBox.addEventListener('click', () => this.focusInput());
    }

    const unfocused = document.getElementById('unfocusedOverlay');
    if (unfocused) {
      unfocused.addEventListener('click', (e) => {
        e.stopPropagation();
        this.focusInput();
      });
    }

    // Physical Keyboard Events (Desktop)
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // Hidden Input for mobile touch keyboards and IME input
    if (this.hiddenInput) {
      this.hiddenInput.addEventListener('input', (e) => this.handleInput(e));
      this.hiddenInput.addEventListener('focus', () => {
        const overlay = document.getElementById('unfocusedOverlay');
        if (overlay) overlay.hidden = true;
      });
      this.hiddenInput.addEventListener('blur', () => {
        // Only show overlay if test is actively running and not finished
        if (!this.isFinished && this.isActive) {
          const overlay = document.getElementById('unfocusedOverlay');
          if (overlay) overlay.hidden = false;
        }
      });
    }

    // Window resize recalculation for smooth caret coordinates and word wrapping
    window.addEventListener('resize', () => {
      const currentWordEl = this.wordsWrapper ? this.wordsWrapper.children[this.currentWordIdx] : null;
      if (currentWordEl) this.scrollWordIntoView(currentWordEl);
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
    }, 25);
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
    this.totalErrors = 0;
    this.extraChars = 0;
    this.missedChars = 0;
    this.totalKeyStrokes = 0;

    this.wpmHistory = [];
    this.secondKeyStrokes = 0;
    this.secondErrors = 0;

    if (this.wordsWrapper) {
      this.wordsWrapper.style.transform = 'translateY(0px)';
    }

    if (this.hiddenInput) {
      this.hiddenInput.value = '';
    }

    if (this.liveWpmEl) {
      this.liveWpmEl.textContent = '0';
    }
    if (this.liveAccEl) {
      this.liveAccEl.textContent = '100%';
    }

    const unfocused = document.getElementById('unfocusedOverlay');
    if (unfocused) unfocused.hidden = true;

    document.body.classList.remove('focus-mode');
  }

  getWordEl(index) {
    if (!this.wordsWrapper) return null;
    const el = this.wordsWrapper.children[index];
    return (el && el.classList && el.classList.contains('word')) ? el : null;
  }

  renderWords() {
    if (!this.wordsWrapper) return;
    this.wordsWrapper.innerHTML = '';

    const frag = document.createDocumentFragment();

    this.words.forEach((wordText, wordIdx) => {
      const wordEl = document.createElement('div');
      wordEl.className = 'word' + (wordIdx === 0 ? ' active' : '');
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

    // Re-attach caret inside wordsWrapper AFTER words so word indices strictly match children indices
    if (this.caret) {
      this.wordsWrapper.appendChild(this.caret);
    }
  }

  appendMoreWords() {
    const settings = window.Settings ? window.Settings.get() : {};
    const more = window.WordGenerator.generate({
      mode: 'words',
      wordOption: 30,
      punctuation: settings.punctuation,
      numbers: settings.numbers,
      difficulty: settings.difficulty
    });

    const frag = document.createDocumentFragment();
    more.forEach((wordText) => {
      const wordIdx = this.words.length;
      this.words.push(wordText);

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

    if (this.caret && this.caret.parentNode === this.wordsWrapper) {
      this.wordsWrapper.insertBefore(frag, this.caret);
    } else {
      this.wordsWrapper.appendChild(frag);
    }
  }

  handleKeyDown(e) {
    // Check Caps Lock
    if (this.capsLockWarning && typeof e.getModifierState === 'function') {
      this.capsLockWarning.hidden = !e.getModifierState('CapsLock');
    }

    // If any modal is open, do not intercept keys for the typing test
    const openModal = document.querySelector('.modal-backdrop.open');
    if (openModal) {
      if (e.key === 'Escape') {
        e.preventDefault();
        openModal.classList.remove('open');
        this.focusInput();
      }
      return;
    }

    // If focus is in any input or textarea other than our hiddenInput, do not intercept
    if (e.target && e.target !== this.hiddenInput && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
      return;
    }

    // Dismiss unfocused overlay immediately on keypress
    const unfocused = document.getElementById('unfocusedOverlay');
    if (unfocused && !unfocused.hidden) {
      unfocused.hidden = true;
      this.focusInput();
    }

    // Command palette shortcut Ctrl+Shift+P
    if (e.ctrlKey && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
      e.preventDefault();
      window.openCommandPalette && window.openCommandPalette();
      return;
    }

    // Ignore other modifier combinations
    if (e.ctrlKey || e.metaKey || e.altKey) {
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
      window.restartTest && window.restartTest();
      return;
    }

    if (this.isFinished) return;

    // Start timers on first keypress
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
      if (settings.confidenceMode) return;
      this.handleBackspace();
      return;
    }

    // 2. Space Key
    if (e.key === ' ') {
      e.preventDefault();
      this.handleSpace();
      return;
    }

    // 3. Regular Character Keys (printable ASCII and UTF-8 characters)
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

  handleInput(e) {
    if (this.isFinished) return;

    const unfocused = document.getElementById('unfocusedOverlay');
    if (unfocused && !unfocused.hidden) {
      unfocused.hidden = true;
    }

    if (!this.isActive) {
      this.startTimers();
    }

    // Handle soft keyboard backspace (e.g. on Android)
    if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
      const settings = window.Settings ? window.Settings.get() : {};
      if (!settings.confidenceMode) {
        this.handleBackspace();
      }
      if (this.hiddenInput) this.hiddenInput.value = '';
      return;
    }

    // Process typed string
    const data = e.data || (this.hiddenInput ? this.hiddenInput.value : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        const char = data[i];
        if (char === ' ') {
          this.handleSpace();
        } else {
          this.processCharInput(char);
        }
      }
    }

    if (this.hiddenInput) this.hiddenInput.value = '';
  }

  startTimers() {
    this.isActive = true;
    this.startTime = Date.now();

    // Enable focus mode if enabled in settings
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
    const currentWordEl = this.wordsWrapper ? this.wordsWrapper.children[this.currentWordIdx] : null;
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
        this.totalErrors++;
        this.secondErrors++;
        this.playSound('error');
        window.Statistics && window.Statistics.recordMistype(expectedChar);
      }
      this.currentLetterIdx++;
    } else {
      // Extra characters beyond word length
      if (currentWordEl.children.length < letterCount + 10) {
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
    if (this.wordEntries[this.currentWordIdx]) {
      this.wordEntries[this.currentWordIdx].typed += char;
    }

    this.updateWordErrorState(currentWordEl, originalWord);
    this.updateCaretPosition();
    this.scrollWordIntoView(currentWordEl);
    this.updateLiveStats();

    // Auto-complete in word, quote, custom, or practice mode when the final character of the final word is reached
    if ((this.mode === 'words' || this.mode === 'quote' || this.mode === 'custom' || this.mode === 'practice') &&
        this.currentWordIdx === this.words.length - 1 &&
        this.currentLetterIdx >= originalWord.length) {
      this.finish();
    }
  }

  handleBackspace() {
    const currentWordEl = this.wordsWrapper ? this.wordsWrapper.children[this.currentWordIdx] : null;
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
          if (this.extraChars > 0) this.extraChars--;
        }
      } else {
        // Reset normal letter
        const letterEl = currentWordEl.children[this.currentLetterIdx];
        if (letterEl) {
          if (letterEl.classList.contains('correct') && this.correctChars > 0) {
            this.correctChars--;
          }
          letterEl.className = 'letter';
        }
      }

      if (this.wordEntries[this.currentWordIdx]) {
        this.wordEntries[this.currentWordIdx].typed = this.wordEntries[this.currentWordIdx].typed.slice(0, -1);
      }
      this.updateWordErrorState(currentWordEl, originalWord);
      this.updateCaretPosition();
      this.updateLiveStats();
    } else {
      // At beginning of word: check if user can backspace to previous word
      const settings = window.Settings ? window.Settings.get() : {};
      if (this.currentWordIdx > 0) {
        const prevWordEl = this.wordsWrapper.children[this.currentWordIdx - 1];
        if (prevWordEl && (prevWordEl.classList.contains('error-word') || settings.freedomMode)) {
          currentWordEl.classList.remove('active');
          this.currentWordIdx--;
          const prevWord = this.wordsWrapper.children[this.currentWordIdx];
          prevWord.classList.add('active');
          this.currentLetterIdx = prevWord.children.length;
          this.updateCaretPosition();
          this.scrollWordIntoView(prevWord);
          this.updateLiveStats();
        }
      }
    }
  }

  handleSpace() {
    const currentWordEl = this.wordsWrapper ? this.wordsWrapper.children[this.currentWordIdx] : null;
    if (!currentWordEl) return;

    // Prevent advancing on empty space if nothing has been typed in current word
    if (this.currentLetterIdx === 0) return;

    const originalWord = this.words[this.currentWordIdx];
    const letterCount = originalWord.length;

    // Check for missed un-typed characters in the word
    if (this.currentLetterIdx < letterCount) {
      for (let i = this.currentLetterIdx; i < letterCount; i++) {
        const letterEl = currentWordEl.children[i];
        letterEl.classList.add('incorrect');
        this.missedChars++;
      }
    }

    this.updateWordErrorState(currentWordEl, originalWord);
    const hasError = currentWordEl.classList.contains('error-word');

    // Record correctness in wordEntries
    if (this.wordEntries[this.currentWordIdx]) {
      this.wordEntries[this.currentWordIdx].isCorrect = !hasError;
    }

    // Keystroke accounting for space
    this.totalKeyStrokes++;
    if (!hasError) {
      this.correctChars++;
      this.playSound('click');
    } else {
      this.playSound('error');
    }

    // Advance to next word
    currentWordEl.classList.remove('active');
    this.currentWordIdx++;
    this.currentLetterIdx = 0;

    // In time mode, if running low on remaining words, dynamically append more
    if (this.mode === 'time' && this.currentWordIdx >= this.words.length - 10) {
      this.appendMoreWords();
    }

    // Check if test reached end of word list (non-time modes)
    if (this.currentWordIdx >= this.words.length) {
      this.finish();
      return;
    }

    const nextWordEl = this.wordsWrapper.children[this.currentWordIdx];
    if (nextWordEl && nextWordEl.classList.contains('word')) {
      nextWordEl.classList.add('active');
      this.updateCaretPosition();
      this.scrollWordIntoView(nextWordEl);
    }
    this.updateHud();
    this.updateLiveStats();
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
    let targetHeight = 28;

    if (this.currentLetterIdx < currentWordEl.children.length) {
      const letterEl = currentWordEl.children[this.currentLetterIdx];
      targetLeft = letterEl.offsetLeft;
      targetTop = letterEl.offsetTop;
      targetHeight = letterEl.offsetHeight;
    } else {
      // At the end of the word
      const lastLetter = currentWordEl.children[currentWordEl.children.length - 1];
      if (lastLetter) {
        targetLeft = lastLetter.offsetLeft + lastLetter.offsetWidth;
        targetTop = lastLetter.offsetTop;
        targetHeight = lastLetter.offsetHeight;
      } else {
        targetLeft = currentWordEl.offsetLeft;
        targetTop = currentWordEl.offsetTop;
        targetHeight = currentWordEl.offsetHeight;
      }
    }

    if (!targetHeight || targetHeight <= 0) targetHeight = 28;

    this.caret.style.left = `${Math.round(targetLeft)}px`;
    this.caret.style.top = `${Math.round(targetTop + targetHeight * 0.12)}px`;
    this.caret.style.height = `${Math.round(targetHeight * 0.78)}px`;

    // Add typing class to pause blinking while typing
    this.caret.classList.add('typing');
    clearTimeout(this.caretTypingTimeout);
    this.caretTypingTimeout = setTimeout(() => {
      this.caret.classList.remove('typing');
    }, 450);
  }

  scrollWordIntoView(wordEl) {
    if (!wordEl || !this.wordsWrapper) return;

    const firstWord = this.wordsWrapper.firstElementChild;
    if (!firstWord) return;

    const currentWordTop = wordEl.offsetTop;
    const firstWordTop = firstWord.offsetTop;
    const currentLineOffset = currentWordTop - firstWordTop;

    // Detect actual line step between wrapped lines directly from DOM
    let lineStep = 0;
    const totalWords = this.wordsWrapper.children.length;
    for (let i = 0; i < totalWords; i++) {
      const el = this.wordsWrapper.children[i];
      if (el.classList && el.classList.contains('word')) {
        const diff = el.offsetTop - firstWordTop;
        if (diff > 4) {
          lineStep = diff;
          break;
        }
      }
    }

    if (!lineStep || lineStep <= 0) {
      lineStep = wordEl.offsetHeight || 38;
    }

    // Line index (0 = line 1, 1 = line 2, 2 = line 3, etc.)
    const lineIndex = Math.round(currentLineOffset / lineStep);

    // Keep active line in the middle (line index 1) once user advances beyond line 1
    if (lineIndex > 1) {
      const scrollOffset = (lineIndex - 1) * lineStep;
      this.wordsWrapper.style.transform = `translateY(-${Math.round(scrollOffset)}px)`;
    } else {
      this.wordsWrapper.style.transform = 'translateY(0px)';
    }
  }

  calculateNetWpm() {
    const elapsedMinutes = Math.max((Date.now() - (this.startTime || Date.now())) / 60000, 0.008);
    const wpm = (this.correctChars / 5) / elapsedMinutes;
    return Math.max(Math.round(wpm), 0);
  }

  calculateRawWpm() {
    const elapsedMinutes = Math.max((Date.now() - (this.startTime || Date.now())) / 60000, 0.008);
    const rawWpm = (this.totalKeyStrokes / 5) / elapsedMinutes;
    return Math.max(Math.round(rawWpm), 0);
  }

  calculateAccuracy() {
    const total = this.correctChars + this.totalErrors + this.extraChars + this.missedChars;
    if (total === 0) return 100;
    const acc = (this.correctChars / total) * 100;
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
    let totalTime;
    if (this.mode === 'time') {
      totalTime = this.timeLimit;
    } else {
      totalTime = Math.max(Math.round((Date.now() - (this.startTime || Date.now())) / 1000), 1);
    }

    const durationMinutes = Math.max(totalTime / 60, 0.016);
    const netWpm = Math.max(Math.round((this.correctChars / 5) / durationMinutes), 0);
    const rawWpm = Math.max(Math.round((this.totalKeyStrokes / 5) / durationMinutes), 0);
    const accuracy = this.calculateAccuracy();
    const consistency = this.calculateConsistency();

    // Ensure at least 2 points in wpmHistory so canvas chart always draws
    if (this.wpmHistory.length === 0) {
      this.wpmHistory.push({ second: 1, wpm: netWpm, rawWpm: rawWpm, errors: this.totalErrors });
      this.wpmHistory.push({ second: totalTime, wpm: netWpm, rawWpm: rawWpm, errors: 0 });
    } else if (this.wpmHistory.length === 1) {
      this.wpmHistory.push({ second: totalTime, wpm: netWpm, rawWpm: rawWpm, errors: 0 });
    } else if (this.wpmHistory[this.wpmHistory.length - 1].second !== totalTime) {
      this.wpmHistory.push({
        second: totalTime,
        wpm: netWpm,
        rawWpm: rawWpm,
        errors: this.secondErrors
      });
    }

    // Update state of current/final active word
    const currentWordEl = this.wordsWrapper ? this.wordsWrapper.children[this.currentWordIdx] : null;
    if (currentWordEl && this.wordEntries[this.currentWordIdx]) {
      this.wordEntries[this.currentWordIdx].isCorrect = !currentWordEl.classList.contains('error-word');
    }

    // Extract error words for practice drill
    const errorWordsSet = new Set();
    this.wordEntries.forEach(entry => {
      if (entry.typed && (entry.isCorrect === false || entry.typed !== entry.original)) {
        const clean = entry.original.replace(/[.,!?;:"]/g, '').toLowerCase().trim();
        if (clean.length > 0) errorWordsSet.add(clean);
      }
    });
    const errorWords = Array.from(errorWordsSet);

    const testSummary = {
      wpm: netWpm,
      rawWpm: rawWpm,
      acc: accuracy,
      consistency: consistency,
      correctChars: this.correctChars,
      incorrectChars: this.totalErrors,
      extraChars: this.extraChars,
      missedChars: this.missedChars,
      totalChars: this.totalKeyStrokes,
      time: totalTime,
      mode: `${this.mode} ${this.mode === 'time' ? this.timeLimit : this.words.length}`,
      date: Date.now(),
      wpmHistory: this.wpmHistory,
      quoteAuthor: this.quoteAuthor,
      errorWords: errorWords
    };

    this.onComplete(testSummary);
  }
}

if (typeof window !== 'undefined') {
  window.TypingEngine = TypingEngine;
}
