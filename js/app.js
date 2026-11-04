/**
 * Main Application Orchestrator for Monkeytype-inspired Typing Platform
 */

let engine = null;
let currentWords = [];

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Settings
  const settings = window.Settings.init();

  // 2. Setup Typing Engine
  engine = new window.TypingEngine({
    wordsWrapper: document.getElementById('wordsWrapper'),
    caret: document.getElementById('caret'),
    hiddenInput: document.getElementById('hiddenInput'),
    typingBox: document.getElementById('typingBox'),
    timerEl: document.getElementById('hudTimer'),
    liveWpmEl: document.getElementById('liveWpm'),
    liveAccEl: document.getElementById('liveAcc'),
    capsLockWarning: document.getElementById('capsLockWarning'),
    onComplete: handleTestComplete
  });

  // 3. Setup UI Controls & Listeners
  initModeControls();
  initCommandPalette();
  initCustomModal();
  initThemeSelector();

  // 4. Start first test
  restartTest();

  // 5. Global Window exposure for shortcuts
  window.restartTest = restartTest;
});

function initModeControls() {
  const settings = window.Settings.get();

  // Mode buttons
  const modeButtons = document.querySelectorAll('.config-btn[data-mode]');
  modeButtons.forEach(btn => {
    const mode = btn.dataset.mode;
    btn.classList.toggle('active', mode === settings.mode);
    btn.addEventListener('click', () => {
      if (mode === 'custom') {
        openCustomModal();
        return;
      }
      window.Settings.update({ mode });
      updateConfigBarUI();
      restartTest();
    });
  });

  // Modifier buttons (Punctuation & Numbers)
  const puncBtn = document.getElementById('btnPunctuation');
  if (puncBtn) {
    puncBtn.classList.toggle('active', !!settings.punctuation);
    puncBtn.addEventListener('click', () => {
      const next = !window.Settings.get().punctuation;
      window.Settings.update({ punctuation: next });
      puncBtn.classList.toggle('active', next);
      restartTest();
    });
  }

  const numBtn = document.getElementById('btnNumbers');
  if (numBtn) {
    numBtn.classList.toggle('active', !!settings.numbers);
    numBtn.addEventListener('click', () => {
      const next = !window.Settings.get().numbers;
      window.Settings.update({ numbers: next });
      numBtn.classList.toggle('active', next);
      restartTest();
    });
  }

  updateConfigBarUI();
}

function updateConfigBarUI() {
  const settings = window.Settings.get();
  const subGroup = document.getElementById('subOptionGroup');
  if (!subGroup) return;

  subGroup.innerHTML = '';

  let options = [];
  let currentVal = null;

  if (settings.mode === 'time') {
    options = [15, 30, 60, 120];
    currentVal = settings.timeOption || 30;
  } else if (settings.mode === 'words') {
    options = [10, 25, 50, 100];
    currentVal = settings.wordOption || 50;
  } else if (settings.mode === 'quote') {
    options = ['short', 'medium', 'long'];
    currentVal = settings.quoteOption || 'medium';
  }

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = `config-btn ${currentVal === opt ? 'active' : ''}`;
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      if (settings.mode === 'time') {
        window.Settings.update({ timeOption: opt });
      } else if (settings.mode === 'words') {
        window.Settings.update({ wordOption: opt });
      } else if (settings.mode === 'quote') {
        window.Settings.update({ quoteOption: opt });
      }
      updateConfigBarUI();
      restartTest();
    });
    subGroup.appendChild(btn);
  });
}

function restartTest() {
  // Hide results card & show typing box
  const resultsCard = document.getElementById('resultsCard');
  const typingBox = document.getElementById('typingBox');
  const testHud = document.getElementById('testHud');
  const bottomBar = document.getElementById('bottomBar');

  if (resultsCard) resultsCard.hidden = true;
  if (typingBox) typingBox.style.display = 'block';
  if (testHud) testHud.style.display = 'flex';
  if (bottomBar) bottomBar.style.display = 'flex';

  const settings = window.Settings.get();

  // Generate words
  const generated = window.WordGenerator.generate({
    mode: settings.mode,
    timeOption: settings.timeOption,
    wordOption: settings.wordOption,
    quoteOption: settings.quoteOption,
    punctuation: settings.punctuation,
    numbers: settings.numbers,
    difficulty: settings.difficulty,
    customText: settings.customText
  });

  if (Array.isArray(generated)) {
    currentWords = generated;
    engine.start(currentWords, {
      mode: settings.mode,
      timeOption: settings.timeOption
    });
  } else if (generated && generated.words) {
    currentWords = generated.words;
    engine.start(currentWords, {
      mode: settings.mode,
      timeOption: settings.timeOption,
      quoteAuthor: generated.author
    });
  }

  // Focus typing box
  engine.focusInput();
}

function handleTestComplete(summary) {
  // Save result to statistics
  const { isNewPB, currentPB } = window.Statistics.saveResult(summary);

  // Hide typing area
  const resultsCard = document.getElementById('resultsCard');
  const typingBox = document.getElementById('typingBox');
  const testHud = document.getElementById('testHud');
  const bottomBar = document.getElementById('bottomBar');

  if (typingBox) typingBox.style.display = 'none';
  if (testHud) testHud.style.display = 'none';
  if (bottomBar) bottomBar.style.display = 'none';
  if (resultsCard) resultsCard.hidden = false;

  // Populate Results UI
  document.getElementById('resWpm').textContent = summary.wpm;
  document.getElementById('resAcc').textContent = `${summary.acc}%`;
  document.getElementById('resRawWpm').textContent = summary.rawWpm;
  document.getElementById('resChars').textContent = `${summary.correctChars}/${summary.incorrectChars}/${summary.extraChars}/${summary.missedChars}`;
  document.getElementById('resConsistency').textContent = `${summary.consistency}%`;
  document.getElementById('resTime').textContent = `${summary.time}s`;
  document.getElementById('resTestType').textContent = summary.mode;

  // Personal Best Indicator
  const pbBanner = document.getElementById('resPbBanner');
  if (pbBanner) {
    if (isNewPB) {
      pbBanner.hidden = false;
      pbBanner.textContent = '🎉 All-Time Personal Best!';
    } else {
      pbBanner.hidden = true;
    }
  }

  // Draw smooth WPM canvas chart
  setTimeout(() => {
    window.Statistics.drawWpmChart('resultsChartCanvas', summary.wpmHistory);
  }, 50);
}

/* ============================================================
   COMMAND PALETTE & QUICK ACTIONS
   ============================================================ */
function initCommandPalette() {
  const modal = document.getElementById('commandPaletteModal');
  const input = document.getElementById('commandInput');
  const list = document.getElementById('commandList');
  const closeBtn = document.getElementById('commandModalClose');

  if (!modal || !input || !list) return;

  const commands = [
    { label: 'Theme: Serika Dark', action: () => setTheme('serika-dark') },
    { label: 'Theme: Carbon', action: () => setTheme('carbon') },
    { label: 'Theme: Nord', action: () => setTheme('nord') },
    { label: 'Theme: Dracula', action: () => setTheme('dracula') },
    { label: 'Theme: Cyberpunk', action: () => setTheme('cyberpunk') },
    { label: 'Theme: Matrix', action: () => setTheme('matrix') },
    { label: 'Theme: Paper Light', action: () => setTheme('paper-light') },
    { label: 'Theme: Sunset', action: () => setTheme('sunset') },
    { label: 'Theme: Botanical', action: () => setTheme('botanical') },
    { label: 'Theme: Gruvbox', action: () => setTheme('gruvbox') },
    { label: 'Mode: Time 15s', action: () => { window.Settings.update({ mode: 'time', timeOption: 15 }); updateConfigBarUI(); restartTest(); } },
    { label: 'Mode: Time 30s', action: () => { window.Settings.update({ mode: 'time', timeOption: 30 }); updateConfigBarUI(); restartTest(); } },
    { label: 'Mode: Time 60s', action: () => { window.Settings.update({ mode: 'time', timeOption: 60 }); updateConfigBarUI(); restartTest(); } },
    { label: 'Mode: Words 25', action: () => { window.Settings.update({ mode: 'words', wordOption: 25 }); updateConfigBarUI(); restartTest(); } },
    { label: 'Mode: Words 50', action: () => { window.Settings.update({ mode: 'words', wordOption: 50 }); updateConfigBarUI(); restartTest(); } },
    { label: 'Mode: Quotes', action: () => { window.Settings.update({ mode: 'quote', quoteOption: 'medium' }); updateConfigBarUI(); restartTest(); } },
    { label: 'Toggle Punctuation', action: () => { window.Settings.update({ punctuation: !window.Settings.get().punctuation }); restartTest(); } },
    { label: 'Toggle Numbers', action: () => { window.Settings.update({ numbers: !window.Settings.get().numbers }); restartTest(); } },
    { label: 'Toggle Smooth Caret', action: () => { window.Settings.update({ smoothCaret: !window.Settings.get().smoothCaret }); } },
    { label: 'Toggle Focus Mode', action: () => { window.Settings.update({ focusMode: !window.Settings.get().focusMode }); } },
    { label: 'Caret: Line', action: () => { window.Settings.update({ caretStyle: 'line' }); } },
    { label: 'Caret: Block', action: () => { window.Settings.update({ caretStyle: 'block' }); } },
    { label: 'Caret: Underline', action: () => { window.Settings.update({ caretStyle: 'underline' }); } },
    { label: 'Font: Space Mono', action: () => { window.Settings.update({ fontFamily: 'Space Mono' }); } },
    { label: 'Font: JetBrains Mono', action: () => { window.Settings.update({ fontFamily: 'JetBrains Mono' }); } },
    { label: 'Restart Test', action: () => restartTest() }
  ];

  function renderCommands(query = '') {
    list.innerHTML = '';
    const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
    if (filtered.length === 0) {
      list.innerHTML = '<li style="padding:0.75rem; color:var(--sub-color); text-align:center;">No matching commands found.</li>';
      return;
    }

    filtered.forEach((cmd, i) => {
      const li = document.createElement('li');
      li.className = `command-item ${i === 0 ? 'selected' : ''}`;
      li.textContent = cmd.label;
      li.addEventListener('click', () => {
        cmd.action();
        closeCommandPalette();
      });
      list.appendChild(li);
    });
  }

  input.addEventListener('input', () => {
    renderCommands(input.value);
  });

  input.addEventListener('keydown', (e) => {
    const items = list.querySelectorAll('.command-item');
    let selectedIdx = Array.from(items).findIndex(el => el.classList.contains('selected'));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (selectedIdx < items.length - 1) {
        items[selectedIdx].classList.remove('selected');
        items[selectedIdx + 1].classList.add('selected');
        items[selectedIdx + 1].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (selectedIdx > 0) {
        items[selectedIdx].classList.remove('selected');
        items[selectedIdx - 1].classList.add('selected');
        items[selectedIdx - 1].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = items[selectedIdx];
      if (current) current.click();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCommandPalette);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCommandPalette();
  });

  window.openCommandPalette = function() {
    modal.classList.add('open');
    input.value = '';
    renderCommands();
    setTimeout(() => input.focus(), 50);
  };

  window.closeCommandPalette = function() {
    modal.classList.remove('open');
    engine && engine.focusInput();
  };
}

function setTheme(themeId) {
  window.Settings.update({ theme: themeId });
  showToast(`Theme switched to ${themeId}`);
}

function initThemeSelector() {
  const btn = document.getElementById('themeIndicatorBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      // Cycle through next theme or open command palette
      const themes = window.Settings.THEMES;
      const current = window.Settings.get().theme;
      const idx = themes.findIndex(t => t.id === current);
      const nextTheme = themes[(idx + 1) % themes.length];
      setTheme(nextTheme.id);
    });
  }
}

/* ============================================================
   CUSTOM TEXT MODAL
   ============================================================ */
function initCustomModal() {
  const modal = document.getElementById('customTextModal');
  const applyBtn = document.getElementById('customApplyBtn');
  const closeBtn = document.getElementById('customCloseBtn');
  const textarea = document.getElementById('customTextInput');

  if (!modal || !applyBtn) return;

  applyBtn.addEventListener('click', () => {
    const val = textarea.value.trim();
    if (val) {
      window.Settings.update({ mode: 'custom', customText: val });
      updateConfigBarUI();
      closeCustomModal();
      restartTest();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCustomModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCustomModal();
  });

  window.openCustomModal = function() {
    modal.classList.add('open');
    if (textarea) {
      textarea.value = window.Settings.get().customText || '';
      setTimeout(() => textarea.focus(), 50);
    }
  };

  window.closeCustomModal = function() {
    modal.classList.remove('open');
    engine && engine.focusInput();
  };
}

function showToast(msg) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}
