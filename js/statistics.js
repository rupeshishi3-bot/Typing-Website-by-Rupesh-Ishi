/**
 * Statistics & Analytics Engine for Monkeytype-inspired Typing Platform
 * Stored locally in browser's localStorage
 */

const HISTORY_KEY = 'monkey_history';
const PB_KEY = 'monkey_pbs';
const MISTYPES_KEY = 'monkey_mistypes';

function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveResult(result) {
  // result: { wpm, rawWpm, acc, correctChars, incorrectChars, extraChars, missedChars, time, mode, date, wpmHistory, quoteAuthor }
  const history = getHistory();
  history.unshift(result);
  if (history.length > 200) history.pop(); // Keep last 200 tests

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Storage quota exceeded for history', e);
  }

  // Update Personal Best
  const pbs = getPersonalBests();
  const key = `${result.mode}`;
  let isNewPB = false;
  if (!pbs[key] || result.wpm > pbs[key].wpm) {
    pbs[key] = {
      wpm: result.wpm,
      rawWpm: result.rawWpm,
      acc: result.acc,
      date: result.date
    };
    try {
      localStorage.setItem(PB_KEY, JSON.stringify(pbs));
    } catch (e) {}
    isNewPB = true;
  }

  return { isNewPB, currentPB: pbs[key] };
}

function getPersonalBests() {
  try {
    const raw = localStorage.getItem(PB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function recordMistype(char) {
  if (!char || char.length !== 1) return;
  const c = char.toLowerCase();
  try {
    const raw = localStorage.getItem(MISTYPES_KEY);
    const mistypes = raw ? JSON.parse(raw) : {};
    mistypes[c] = (mistypes[c] || 0) + 1;
    localStorage.setItem(MISTYPES_KEY, JSON.stringify(mistypes));
  } catch (e) {}
}

function getMistypes() {
  try {
    const raw = localStorage.getItem(MISTYPES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function getSummaryStats() {
  const history = getHistory();
  const totalTests = history.length;
  if (totalTests === 0) {
    return {
      totalTests: 0,
      totalTime: 0,
      avgWpm: 0,
      avgAcc: 100,
      bestWpm: 0
    };
  }

  let totalTime = 0;
  let totalWpm = 0;
  let totalAcc = 0;
  let bestWpm = 0;

  history.forEach(h => {
    totalTime += (h.time || 0);
    totalWpm += (h.wpm || 0);
    totalAcc += (h.acc || 0);
    if ((h.wpm || 0) > bestWpm) bestWpm = h.wpm;
  });

  return {
    totalTests,
    totalTime: Math.round(totalTime),
    avgWpm: Math.round(totalWpm / totalTests),
    avgAcc: Math.round((totalAcc / totalTests) * 10) / 10,
    bestWpm
  };
}

function clearAllData() {
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(PB_KEY);
  localStorage.removeItem(MISTYPES_KEY);
}

/**
 * Draws smooth WPM progression curve on HTML5 Canvas
 */
function drawWpmChart(canvasId, wpmHistory = []) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !wpmHistory || wpmHistory.length < 2) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  ctx.clearRect(0, 0, w, h);

  const padding = 28;
  const plotWidth = w - padding * 2;
  const plotHeight = h - padding * 2;

  // Calculate scales
  const maxWpm = Math.max(...wpmHistory.map(d => Math.max(d.wpm || 0, d.rawWpm || 0)), 30) + 10;
  const pointCount = wpmHistory.length;

  const getX = (index) => padding + (index / (pointCount - 1)) * plotWidth;
  const getY = (val) => h - padding - (val / maxWpm) * plotHeight;

  // Background Grid Lines
  ctx.strokeStyle = "rgba(100, 102, 105, 0.18)";
  ctx.lineWidth = 1;
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const yVal = Math.round((maxWpm / gridSteps) * i);
    const yPos = getY(yVal);
    ctx.beginPath();
    ctx.moveTo(padding, yPos);
    ctx.lineTo(w - padding, yPos);
    ctx.stroke();

    // Axis label
    ctx.fillStyle = "rgba(100, 102, 105, 0.7)";
    ctx.font = "10px monospace";
    ctx.textAlign = "right";
    ctx.fillText(`${yVal}`, padding - 6, yPos + 3);
  }

  // 1. Draw Raw WPM Line (Subtle Gray/Muted)
  ctx.beginPath();
  ctx.moveTo(getX(0), getY(wpmHistory[0].rawWpm || wpmHistory[0].wpm));
  for (let i = 1; i < pointCount; i++) {
    const prevX = getX(i - 1);
    const prevY = getY(wpmHistory[i - 1].rawWpm || wpmHistory[i - 1].wpm);
    const curX = getX(i);
    const curY = getY(wpmHistory[i].rawWpm || wpmHistory[i].wpm);
    const midX = (prevX + curX) / 2;
    ctx.quadraticCurveTo(prevX, prevY, midX, (prevY + curY) / 2);
  }
  ctx.lineTo(getX(pointCount - 1), getY(wpmHistory[pointCount - 1].rawWpm || wpmHistory[pointCount - 1].wpm));
  ctx.strokeStyle = "rgba(100, 102, 105, 0.4)";
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // 2. Draw Net WPM Smooth Line (Vibrant Theme Accent)
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim() || '#e2b714';
  ctx.beginPath();
  ctx.moveTo(getX(0), getY(wpmHistory[0].wpm));
  for (let i = 1; i < pointCount; i++) {
    const prevX = getX(i - 1);
    const prevY = getY(wpmHistory[i - 1].wpm);
    const curX = getX(i);
    const curY = getY(wpmHistory[i].wpm);
    const midX = (prevX + curX) / 2;
    ctx.quadraticCurveTo(prevX, prevY, midX, (prevY + curY) / 2);
  }
  ctx.lineTo(getX(pointCount - 1), getY(wpmHistory[pointCount - 1].wpm));

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Gradient fill under curve
  ctx.lineTo(getX(pointCount - 1), h - padding);
  ctx.lineTo(getX(0), h - padding);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, padding, 0, h - padding);
  grad.addColorStop(0, "rgba(226, 183, 20, 0.22)");
  grad.addColorStop(1, "rgba(226, 183, 20, 0.0)");
  ctx.fillStyle = grad;
  ctx.fill();

  // 3. Draw Errors as red cross dots
  const errorColor = getComputedStyle(document.documentElement).getPropertyValue('--error-color').trim() || '#ca4754';
  wpmHistory.forEach((pt, i) => {
    if (pt.errors && pt.errors > 0) {
      const x = getX(i);
      const y = getY(pt.wpm);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = errorColor;
      ctx.fill();
    }
  });
}

if (typeof window !== 'undefined') {
  window.Statistics = {
    getHistory,
    saveResult,
    getPersonalBests,
    recordMistype,
    getMistypes,
    getSummaryStats,
    clearAllData,
    drawWpmChart
  };
}
