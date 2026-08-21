/* ============================================================
   Typing Website by Rupesh Ishi — script.js
   Contains: passages data, setup wizard, typing engine,
   live WPM/accuracy tracking, virtual keyboard, results.
   ============================================================ */

/* ---------------------------------------------
   1. PASSAGES
   Kept in this file (not a separate JS "language")
   so script.js stays a single self-contained file.
--------------------------------------------- */
const PASSAGES = [
  "The quick brown fox jumps over the lazy dog while the sun sets behind the distant hills. Every evening the village grows quiet as families gather indoors, sharing stories passed down through generations. It is in these small moments that traditions survive and communities remain connected across time.",

  "Good communication is the foundation of every successful organization. When employees understand their responsibilities clearly and receive timely feedback, productivity naturally improves. Managers who listen carefully and respond with patience tend to build stronger teams than those who rely only on authority.",

  "India has a rich history of art, architecture and literature that spans thousands of years. From the intricate carvings of ancient temples to the vibrant colors of folk paintings, every region tells its own unique story. Preserving this heritage requires both government support and public awareness.",

  "Learning to type quickly and accurately is a valuable skill in the modern workplace. Whether drafting an email, preparing a report or filling an online form, the ability to type without looking at the keyboard saves time and reduces errors significantly over the course of a career.",

  "Water is essential for all forms of life on this planet. Rivers, lakes and oceans regulate climate, support agriculture and provide drinking water for billions of people. Protecting these resources from pollution and overuse is one of the most urgent challenges facing governments today.",

  "The examination hall was silent except for the soft rustle of paper and the occasional cough. Candidates sat hunched over their desks, eyes fixed on the clock, aware that every second counted. Years of preparation had led to this single, decisive morning.",

  "Technology continues to reshape the way people work, learn and communicate. Cloud computing allows documents to be accessed from anywhere, while video calls have replaced many face to face meetings. Despite these changes, the fundamentals of clear writing and careful listening remain just as important as ever.",

  "A balanced diet, regular exercise and sufficient sleep form the three pillars of good health. Doctors often remind patients that small, consistent habits matter more than occasional bursts of effort. Walking for thirty minutes each day, for instance, can meaningfully reduce the risk of several chronic illnesses.",

  "The railway station buzzed with activity as vendors called out prices and passengers hurried toward their platforms. Announcements echoed through the halls, guiding travellers to trains bound for cities across the country. Amid the noise, a sense of order persisted, shaped by years of routine.",

  "Effective governance depends on transparency, accountability and the active participation of citizens. Public institutions that publish clear records and respond promptly to queries tend to earn greater trust from the people they serve. Building such trust takes years, but it can be lost in a single careless decision.",

  "Reading widely from an early age helps children develop vocabulary, empathy and critical thinking skills. Libraries, whether physical or digital, remain one of the most powerful tools for reducing inequality in education. A single well stocked reading room can change the trajectory of an entire neighbourhood.",

  "The monsoon arrives each year with a mixture of relief and concern. Farmers welcome the rain that nourishes their fields, yet cities often struggle with flooding and disrupted transport. Balancing agricultural needs with urban infrastructure remains one of the country's ongoing planning challenges.",

  "Practice does not simply make perfect, it makes permanent. Repeating an action correctly, with attention to detail, builds the kind of muscle memory that eventually feels effortless. This is as true for typing on a keyboard as it is for playing a musical instrument or learning a new language.",

  "The committee reviewed each application carefully before making its final recommendations. Members debated the merits of every proposal, weighing cost against long term benefit. By the end of the session, a shortlist had been prepared for further consideration by the senior leadership.",

  "Punctuality is often the first quality noticed in a new employee. Arriving on time for meetings and submitting reports before deadlines signals discipline and respect for others. Over the years, small habits like these tend to matter far more than occasional bursts of brilliance.",

  "The old library at the corner of the street had stood for over a century. Its wooden shelves, worn smooth by generations of hands, still held rare manuscripts alongside modern paperbacks. Students often gathered there in the evenings, drawn by its quiet and unhurried atmosphere.",

  "Renewable energy sources such as solar and wind power are becoming increasingly affordable. As technology improves and production scales up, the cost of clean electricity continues to fall. Many countries now view this shift not just as an environmental necessity but as an economic opportunity.",

  "Team sports teach lessons that extend far beyond the playing field. Cooperation, discipline and the ability to accept both victory and defeat gracefully are skills that serve players well into adulthood. Coaches often say that character is built more in practice than in the final match.",

  "A well drafted contract protects both parties by clearly defining rights, obligations and remedies in advance. Ambiguous language, on the other hand, frequently becomes the source of costly disputes. Lawyers therefore spend considerable time ensuring every clause is precise and leaves little room for misinterpretation.",

  "The night sky, free from the glow of city lights, reveals thousands of stars invisible to most urban residents. Astronomers travel to remote observatories to study these distant points of light. For centuries, humans have looked upward, finding both wonder and navigation in the patterns above.",

  "Small businesses form the backbone of many local economies, providing jobs and services tailored to community needs. Unlike large corporations, they often adapt quickly to changing customer demands. Supporting local shops, therefore, has effects that ripple well beyond a single transaction.",

  "The postal service once formed the primary link between distant relatives and friends. Letters, carefully written and eagerly awaited, carried news that could take weeks to arrive. Though digital communication has largely replaced this tradition, many still cherish the personal touch of a handwritten note.",

  "Good time management begins with distinguishing between what is urgent and what is truly important. People who plan their day around priorities rather than distractions tend to accomplish more with less stress. This simple shift in approach can transform both productivity and peace of mind.",

  "Rainforests, though covering a small fraction of the earth's surface, are home to more than half of all known plant and animal species. Their destruction affects global climate patterns far beyond the regions where the clearing takes place. Conservation efforts increasingly depend on cooperation between governments and local communities.",

  "The interview process for government positions typically involves multiple rounds designed to assess both knowledge and temperament. Candidates are expected to demonstrate not only technical competence but also sound judgement under pressure. Preparation, therefore, extends well beyond memorising facts and figures.",

  "Traditional festivals bring entire neighbourhoods together in ways that everyday routines rarely manage. Streets are decorated, food is shared freely, and generations mix in celebration. These gatherings, passed down over decades, continue to strengthen the social fabric of communities across the country.",

  "Clear handwriting was once considered an essential mark of a well educated person. Though typing has largely replaced pen and paper in offices, many schools still emphasise legible writing as a foundational skill. The discipline required to form each letter carefully translates well into other areas of learning.",

  "Public transport systems, when efficient and affordable, significantly reduce traffic congestion and pollution in crowded cities. Investment in buses, metro lines and shared infrastructure often yields returns that extend well beyond daily commuting. Urban planners increasingly treat transport policy as central to quality of life.",

  "The apprentice spent years observing before being allowed to work independently. Mastery of the craft required patience that few were willing to commit to fully. Yet those who persisted often produced work of a quality that machines, even today, struggle to replicate."
];

/* ---------------------------------------------
   2. STATE
--------------------------------------------- */
const state = {
  step: 1,
  speed: 30,
  timed: true,
  duration: 5, // minutes

  passage: "",
  typed: "",
  startTime: null,
  timerId: null,
  liveStatsId: null,
  finished: false,
  mistakesTotal: 0,
  paragraphBoundaries: [], // word-index where each paragraph starts
  indentResults: [],       // true/false/null per paragraph boundary
  nextBoundaryPos: 0        // index into paragraphBoundaries not yet resolved
};

/* ---------------------------------------------
   3. DOM REFERENCES
--------------------------------------------- */
const $ = (id) => document.getElementById(id);

const landingScreen = $("landing");
const setupScreen = $("setup");
const testScreen = $("test");
const resultsScreen = $("results");
const mcqSetupScreen = $("mcqSetup");
const mcqTestScreen = $("mcqTest");
const mcqResultsScreen = $("mcqResults");
const emailSetupScreen = $("emailSetup");
const emailTestScreen = $("emailTest");
const emailResultsScreen = $("emailResults");

const themeToggle = $("themeToggle");
const themeToggleLabel = $("themeToggleLabel");

const stepPanels = document.querySelectorAll(".step-panel");
const stepDots = document.querySelectorAll(".step-dot");

const speedChips = $("speedChips");
const durationChips = $("durationChips");
const timedYes = $("timedYes");
const timedNo = $("timedNo");

const reviewSpeed = $("reviewSpeed");
const reviewTimed = $("reviewTimed");

const backBtn = $("backBtn");
const nextBtn = $("nextBtn");
const startBtn = $("startBtn");

const referenceText = $("referenceText");
const typingInput = $("typingInput");

const statTime = $("statTime");
const statWpm = $("statWpm");

const restartBtn = $("restartBtn");
const submitBtn = $("submitBtn");

const resultsEyebrow = $("resultsEyebrow");
const resultsWpm = $("resultsWpm");
const resultsAcc = $("resultsAcc");
const resultsTime = $("resultsTime");
const resultsChars = $("resultsChars");
const resultsMistakes = $("resultsMistakes");
const resultsGrossWpm = $("resultsGrossWpm");
const resultsMarks = $("resultsMarks");
const resultsPassBadge = $("resultsPassBadge");
const breakdownOmission = $("breakdownOmission");
const breakdownSubstitution = $("breakdownSubstitution");
const breakdownAddition = $("breakdownAddition");
const breakdownSpelling = $("breakdownSpelling");
const breakdownSpacing = $("breakdownSpacing");
const breakdownCase = $("breakdownCase");
const breakdownPunctuation = $("breakdownPunctuation");
const breakdownIndent = $("breakdownIndent");
const resultsMessage = $("resultsMessage");
const analysisText = $("analysisText");
const tryAgainBtn = $("tryAgainBtn");
const changeSettingsBtn = $("changeSettingsBtn");

const bestBadge = $("bestBadge");
const bestValue = $("bestValue");

/* ---------------------------------------------
   3c. EMAIL PRACTICE — DOM REFERENCES
--------------------------------------------- */
const emailStartBtn = $("emailStartBtn");

const emailStatTime = $("emailStatTime");
const emailStatTopic = $("emailStatTopic");
const refEmailTo = $("refEmailTo");
const refEmailSubject = $("refEmailSubject");
const refEmailBody = $("refEmailBody");
const refEmailAttachment = $("refEmailAttachment");
const emailInputTo = $("emailInputTo");
const emailInputSubject = $("emailInputSubject");
const emailInputBody = $("emailInputBody");
const emailInputAttachment = $("emailInputAttachment");
const emailRestartBtn = $("emailRestartBtn");
const emailSubmitBtn = $("emailSubmitBtn");

const emailResultsEyebrow = $("emailResultsEyebrow");
const emailResultsMarks = $("emailResultsMarks");
const emailResultsPassBadge = $("emailResultsPassBadge");
const emailResultsTo = $("emailResultsTo");
const emailResultsSubject = $("emailResultsSubject");
const emailResultsAttachment = $("emailResultsAttachment");
const emailResultsBody = $("emailResultsBody");
const emailResultsTime = $("emailResultsTime");
const emailResultsMistakes = $("emailResultsMistakes");
const emailResultsMessage = $("emailResultsMessage");
const emailAnalysisText = $("emailAnalysisText");
const emailTryAgainBtn = $("emailTryAgainBtn");
const emailChangeSettingsBtn = $("emailChangeSettingsBtn");

const emailBestBadge = $("emailBestBadge");
const emailBestValue = $("emailBestValue");


/* Page flag: only pages with a #typingInput textarea (the wpm
   practice pages) get the typing engine wired up. */
const isTypingTestPage = !!typingInput;

/* ---------------------------------------------
   5. SCREEN SWITCHING
   (Defined here, above the typing block, since it's used by every
   mode — typing, MCQ, and email — not just the typing engine.)
--------------------------------------------- */
function showScreen(target){
  // Generic on purpose: each real page only contains the .screen
  // sections for its own mode (e.g. a wpm page has setup/test/results,
  // /mcq/ has mcqSetup/mcqTest/mcqResults), so this just toggles
  // whatever .screen elements actually exist on the current page.
  document.querySelectorAll(".screen").forEach(s => { s.hidden = (s !== target); });
}

/* Shared by typing, MCQ, and email timers — defined here (global scope)
   since all three modes use it, not just the typing engine. */
function formatTime(totalSeconds){
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* Shared by MCQ (question order) and email (attachment options) — defined
   here (global scope) since both modes use it. */
function shuffle(arr){
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Shared by typing and email scoring — word-level diff/mistake engine.
   Defined here (global scope) since both modes use it. */
function levenshtein(a, b){
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++){
    for (let j = 1; j <= n; j++){
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

// Word-level alignment (edit-distance DP) between the passage and what
// was typed, so we can classify each difference the way an exam does.
function diffWords(passageWords, typedWords){
  const n = passageWords.length, m = typedWords.length;
  const coreOf = w => w.toLowerCase().replace(/[^a-z0-9]/g, "");
  const pCore = passageWords.map(coreOf);
  const tCore = typedWords.map(coreOf);

  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++){
    for (let j = 1; j <= m; j++){
      const subCost = pCore[i - 1] === tCore[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j - 1] + subCost,
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1
      );
    }
  }

  const ops = [];
  let i = n, j = m;
  while (i > 0 || j > 0){
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (pCore[i - 1] === tCore[j - 1] ? 0 : 1)){
      ops.unshift({ type: pCore[i - 1] === tCore[j - 1] ? "match" : "sub", pIdx: i - 1, tIdx: j - 1 });
      i--; j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1){
      ops.unshift({ type: "omit", pIdx: i - 1 });
      i--;
    } else {
      ops.unshift({ type: "add", tIdx: j - 1 });
      j--;
    }
  }
  return ops;
}

// Classifies every diff op into the exam's mistake categories.
function classifyMistakes(ops, passageWords, typedWords){
  const full = { omission: 0, addition: 0, substitution: 0, spelling: 0 };
  const half = { capitalization: 0, punctuation: 0 };
  let correctWords = 0;

  ops.forEach(op => {
    if (op.type === "omit"){
      full.omission++;
    } else if (op.type === "add"){
      full.addition++;
    } else if (op.type === "sub"){
      const pWord = passageWords[op.pIdx];
      const tWord = typedWords[op.tIdx];
      const pCore = pWord.toLowerCase().replace(/[^a-z0-9]/g, "");
      const tCore = tWord.toLowerCase().replace(/[^a-z0-9]/g, "");
      const dist = levenshtein(pCore, tCore);
      const closeEnoughToBeSpelling = pCore.length > 0 && dist <= Math.max(2, Math.ceil(pCore.length * 0.34));
      if (closeEnoughToBeSpelling){
        full.spelling++;
      } else {
        full.substitution++;
      }
    } else if (op.type === "match"){
      const pWord = passageWords[op.pIdx];
      const tWord = typedWords[op.tIdx];
      if (pWord === tWord){
        correctWords++;
      } else {
        const pAlnum = pWord.replace(/[^a-zA-Z0-9]/g, "");
        const tAlnum = tWord.replace(/[^a-zA-Z0-9]/g, "");
        const pPunct = pWord.replace(/[a-zA-Z0-9]/g, "");
        const tPunct = tWord.replace(/[a-zA-Z0-9]/g, "");
        if (pAlnum !== tAlnum) half.capitalization++;
        if (pPunct !== tPunct) half.punctuation++;
        correctWords++;
      }
    }
  });

  return { full, half, correctWords };
}

// Splits raw typed text into words plus the exact whitespace that follows
// each one — this lets us both detect real spacing mistakes AND tell
// them apart from the legitimate Tab-indent whitespace we insert.
function tokenizeTyped(rawTyped){
  const tokens = rawTyped.match(/\S+|\s+/g) || [];
  const words = [];
  const gapAfter = [];
  tokens.forEach(tok => {
    if (/\S/.test(tok)){
      words.push(tok);
      gapAfter.push("");
    } else if (words.length > 0){
      gapAfter[words.length - 1] = tok;
    }
  });
  return { words, gapAfter };
}

if (isTypingTestPage) {
  /* ---------------------------------------------
     4. SETUP WIZARD
  --------------------------------------------- */
  if (speedChips) {
    speedChips.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      speedChips.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      state.speed = Number(chip.dataset.speed);
    });
  }

  durationChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip || !state.timed) return;
    durationChips.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    state.duration = Number(chip.dataset.duration);
  });

  timedYes.addEventListener("click", () => setTimedMode(true));
  timedNo.addEventListener("click", () => setTimedMode(false));

  function setTimedMode(isTimed){
    state.timed = isTimed;
    timedYes.classList.toggle("active", isTimed);
    timedNo.classList.toggle("active", !isTimed);
    durationChips.dataset.disabled = String(!isTimed);
  }

  nextBtn.addEventListener("click", () => goToStep(state.step + 1));
  backBtn.addEventListener("click", () => goToStep(state.step - 1));

  const totalSteps = stepPanels.length; // 2 on wpm pages (Duration, Ready), 3 elsewhere

  function goToStep(n){
    if (n < 1 || n > totalSteps) return;
    state.step = n;

    stepPanels.forEach(p => p.classList.toggle("active", Number(p.dataset.step) === n));
    stepDots.forEach(d => {
      const dn = Number(d.dataset.dot);
      d.classList.toggle("active", dn === n);
      d.classList.toggle("done", dn < n);
    });

    backBtn.disabled = n === 1;
    nextBtn.hidden = n === totalSteps;
    startBtn.hidden = n !== totalSteps;

    if (n === totalSteps){
      reviewSpeed.textContent = `${state.speed} WPM`;
      reviewTimed.textContent = state.timed ? `Yes — ${state.duration} min` : "No, untimed";
    }
  }

  startBtn.addEventListener("click", startTest);
  changeSettingsBtn.addEventListener("click", () => {
    showScreen(setupScreen);
    goToStep(1);
  });

  /* ---------------------------------------------
     6. BUILDING THE PASSAGE
     Built from whole paragraphs (not cut mid-way)
     so each paragraph's start can require a Tab
     indent, matching the real exam passage layout.
  --------------------------------------------- */
  function buildPassage(){
    const minutes = state.timed ? state.duration : 10;
    // Buffered target: sized so a typist hitting their selected target speed
    // finishes with time to spare, instead of needing to sustain that exact
    // speed for the entire duration with zero pauses just to reach the end.
    const targetWords = Math.max(30, Math.round(minutes * state.speed * 0.75));
    const pool = [...PASSAGES].sort(() => Math.random() - 0.5);

    const paragraphs = [];
    const paragraphWordCounts = [];
    let total = 0;
    let i = 0;

    // How far past the target we'll tolerate before trimming a paragraph
    // down to a sentence boundary. Whole passages average 40-55 words, so
    // without this, the last paragraph alone could push the total 40-50
    // words past what the selected time actually allows for.
    const overshootAllowance = 12;

    while (total < targetWords){
      let para = pool[i % pool.length].trim();
      let wc = para.split(/\s+/).length;

      // Once at least one paragraph is already in, don't let a long whole
      // paragraph blow past the target — trim it to whole sentences instead,
      // so the passage stays close to what's actually typeable in the time.
      if (paragraphs.length > 0 && total + wc > targetWords + overshootAllowance){
        const sentences = para.match(/[^.!?]+[.!?]+(\s+|$)/g) || [para];
        let trimmed = "";
        let trimmedWc = 0;
        for (const sentence of sentences){
          const sWc = sentence.trim().split(/\s+/).length;
          if (trimmedWc > 0 && total + trimmedWc + sWc > targetWords + overshootAllowance) break;
          trimmed += sentence;
          trimmedWc += sWc;
        }
        if (trimmed.trim().length > 0){
          para = trimmed.trim();
          wc = trimmedWc;
        }
      }

      paragraphs.push(para);
      paragraphWordCounts.push(wc);
      total += wc;
      i++;
    }

    // Word index at which each paragraph begins — these are the points
    // where the exam expects a Tab-indent instead of typing straight in.
    const boundaries = [];
    let acc = 0;
    paragraphWordCounts.forEach(wc => { boundaries.push(acc); acc += wc; });

    const joined = paragraphs.join("\n");

    state.targetWords = total;
    state.paragraphBoundaries = boundaries;
    state.indentResults = boundaries.map(() => null);
    // Cached word list of the reference passage, used by the completion
    // check to know the exact length of the final word (which never has
    // trailing whitespace after it, since the passage doesn't end in one).
    state.passageWords = joined.split(/\s+/).filter(Boolean);

    return joined;
  }

  /* ---------------------------------------------
     7. RENDERING THE PASSAGE (reference side only —
     the typing side is a plain textarea, no live diff)
     Each paragraph gets a first-line indent, matching
     the real exam passage layout. Word spans are
     tracked by word-index (not character offset) so
     auto-scroll works regardless of paragraph breaks.
  --------------------------------------------- */
  function renderPassage(){
    const paragraphs = state.passage.split("\n");
    const frag = document.createDocumentFragment();

    paragraphs.forEach(paraText => {
      const p = document.createElement("p");
      p.className = "ref-para";
      p.textContent = paraText;
      frag.appendChild(p);
    });

    referenceText.innerHTML = "";
    referenceText.appendChild(frag);
  }

  /* ---------------------------------------------
     8. STARTING / RESTARTING A TEST
  --------------------------------------------- */
  function startTest(){
    state.passage = buildPassage();
    state.typed = "";
    state.startTime = null;
    state.finished = false;
    state.mistakesTotal = 0;
    state.nextBoundaryPos = 0;
    // state.indentResults was set inside buildPassage(), one entry per paragraph

    typingInput.value = "";
    renderPassage();
    referenceText.scrollTop = 0;
    statWpm.textContent = "0";

    clearInterval(state.timerId);
    clearInterval(state.liveStatsId);

    if (state.timed){
      statTime.textContent = formatTime(state.duration * 60);
    } else {
      statTime.textContent = "00:00";
    }

    showScreen(testScreen);
    typingInput.focus();
  }

  restartBtn.addEventListener("click", startTest);
  tryAgainBtn.addEventListener("click", startTest);

  /* ---------------------------------------------
     9. TYPING ENGINE
     No mistake/accuracy feedback is shown while
     typing — only time and live WPM. Mistakes are
     revealed in the analysis after submitting.

     Tab-indent rule: the exam expects a Tab press
     (not spaces) at the start of every paragraph,
     including the first. Each boundary is checked
     only once, at the moment the cursor is ready
     to start a fresh word there.
  --------------------------------------------- */
  typingInput.addEventListener("keydown", (e) => {
    if (state.finished) return;

    if (e.key === "Tab"){
      e.preventDefault(); // never let Tab leave the box
      // Tab always types its indent, exactly like a normal character key —
      // whether that's at a paragraph's start (where it's graded) or
      // anywhere else in the middle of typing (where it's just whitespace).
      insertIndent();
    }

    if (state.startTime === null){
      const isFirstAction = e.key === "Tab" || e.key.length === 1 || e.key === "Backspace";
      if (isFirstAction){
        state.startTime = Date.now();
        startTimers();
      }
    }

    const value = typingInput.value;
    const readyForNewWord = value.length === 0 || /\s$/.test(value);
    if (readyForNewWord){
      const currentWordCount = value.trim().length ? value.trim().split(/\s+/).length : 0;

      // Walk forward through boundaries the typed word count has now reached
      // or passed, resolving each one in order. Using ">=" here (instead of
      // requiring an exact match) means an earlier omission or extra word —
      // which permanently shifts the typed count away from the passage's
      // original word index — can never cause a later paragraph's indent
      // check to be silently skipped forever.
      while (
        state.nextBoundaryPos < state.paragraphBoundaries.length &&
        currentWordCount >= state.paragraphBoundaries[state.nextBoundaryPos]
      ){
        const boundaryIdx = state.nextBoundaryPos;
        if (state.indentResults[boundaryIdx] !== null){
          state.nextBoundaryPos++;
          continue;
        }
        if (e.key === "Tab"){
          state.indentResults[boundaryIdx] = true;
          state.nextBoundaryPos++;
        } else if (e.key.length === 1){
          state.indentResults[boundaryIdx] = false;
          state.nextBoundaryPos++;
        } else {
          // A non-typing key (Backspace, arrows, etc.) — don't resolve yet,
          // wait for the next real keystroke at this same word count.
          break;
        }
      }
    }
  });

  // Manually inserts a visible indent (spaces) at the cursor — using the
  // browser's native text-insertion path where available, since that's the
  // most reliable way to make it actually render and fire input events
  // correctly across browsers. Falls back to direct value manipulation.
  function insertIndent(){
    const indent = "    "; // 4 spaces
    typingInput.focus();

    const usedNativeInsert = document.execCommand && document.execCommand("insertText", false, indent);
    if (usedNativeInsert) return;

    const start = typingInput.selectionStart;
    const end = typingInput.selectionEnd;
    typingInput.value = typingInput.value.slice(0, start) + indent + typingInput.value.slice(end);
    typingInput.selectionStart = typingInput.selectionEnd = start + indent.length;
    typingInput.dispatchEvent(new Event("input", { bubbles: true }));
  }

  // No auto-finish on completion: even if the user finishes typing the
  // whole passage, the test stays open until they either click Submit or
  // (in timed mode) the clock runs out — matching the real exam, where
  // finishing early just means sitting and waiting, not an automatic end.
  typingInput.addEventListener("input", () => {
    if (state.finished) return;
    state.typed = typingInput.value;
  });

  /* ---------------------------------------------
     11. TIMERS + LIVE STATS
  --------------------------------------------- */
  function startTimers(){
    state.liveStatsId = setInterval(updateLiveStats, 500);

    if (state.timed){
      let remaining = state.duration * 60;
      statTime.textContent = formatTime(remaining);
      state.timerId = setInterval(() => {
        remaining--;
        statTime.textContent = formatTime(Math.max(remaining, 0));
        if (remaining <= 0){
          finishTest("timeup");
        }
      }, 1000);
    } else {
      state.timerId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        statTime.textContent = formatTime(elapsed);
      }, 1000);
    }
  }

  function updateLiveStats(){
    if (!state.startTime) return;
    const elapsedMinutes = (Date.now() - state.startTime) / 60000;
    const wordsTyped = state.typed.trim().length ? state.typed.trim().split(/\s+/).length : 0;
    const wpm = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;
    statWpm.textContent = wpm;
  }

  /* ---------------------------------------------
     12. WORD-LEVEL SCORING ENGINE
     Mirrors the real exam convention: mistakes are
     counted per word (omission, substitution,
     addition, spelling = full mistake; case/
     punctuation-only differences = half mistake),
     not per character.
  --------------------------------------------- */

  // A gap counts as a real spacing mistake only if it's longer than one
  // space AND it isn't the whitespace produced by a correctly-used Tab
  // indent at a paragraph boundary (which legitimately runs longer).
  function countSpacingMistakes(gapAfter, paragraphBoundaries, indentResults){
    let mistakes = 0;
    for (let i = 0; i < gapAfter.length; i++){
      const gap = gapAfter[i];
      if (gap.length <= 1) continue;
      const boundaryIdx = paragraphBoundaries.indexOf(i + 1);
      const isLegitIndentGap = boundaryIdx !== -1 && indentResults[boundaryIdx] === true;
      if (!isLegitIndentGap) mistakes++;
    }
    return mistakes;
  }

  /* ---------------------------------------------
     13. SUBMIT / FINISH
  --------------------------------------------- */
  submitBtn.addEventListener("click", () => finishTest("submitted"));

  function finishTest(reason){
    if (state.finished) return;
    state.finished = true;

    clearInterval(state.timerId);
    clearInterval(state.liveStatsId);

    const elapsedSeconds = state.startTime
      ? Math.max(1, Math.round((Date.now() - state.startTime) / 1000))
      : 1;
    const elapsedMinutes = elapsedSeconds / 60;

    const passageWords = state.passage.split(/\s+/).filter(Boolean);
    const { words: typedWords, gapAfter } = tokenizeTyped(state.typed);

    const ops = diffWords(passageWords, typedWords);
    const { full, half, correctWords } = classifyMistakes(ops, passageWords, typedWords);
    const spacingMistakes = countSpacingMistakes(gapAfter, state.paragraphBoundaries, state.indentResults);
    const indentMistakes = state.indentResults.filter(v => v === false).length;
    const indentTotal = state.paragraphBoundaries.length;

    // GCC-TBC style: every single mistake — wrong word, missing/extra word,
    // spacing, capitalization, punctuation, or a missed Tab-indent — cuts
    // exactly one mark. No fractional "half mistakes".
    const wordMistakes = full.omission + full.addition + full.substitution + full.spelling;
    const formatMistakes = half.capitalization + half.punctuation + spacingMistakes + indentMistakes;
    const totalMistakes = wordMistakes + formatMistakes;

    const grossWpm = Math.round(typedWords.length / elapsedMinutes) || 0;
    const netWpm = Math.max(0, Math.round(grossWpm - (totalMistakes / elapsedMinutes)));

    const accuracy = passageWords.length > 0
      ? Math.round((correctWords / passageWords.length) * 100)
      : 100;

    const marksTotal = 40;
    const marks = Math.max(0, marksTotal - totalMistakes); // 1 mark cut per mistake
    const passMarks = 16; // 40% of 40, per GCC-TBC's per-section passing rule
    const passed = marks >= passMarks;

    showResults({
      grossWpm, netWpm, accuracy, marks, marksTotal, passMarks, passed,
      seconds: elapsedSeconds, wordsTyped: typedWords.length,
      full, half, spacingMistakes, indentMistakes, indentTotal,
      wordMistakes, totalMistakes, reason
    });

    buildAnalysis(ops, passageWords, typedWords, gapAfter);
    saveBestScore(netWpm);
  }

  function buildAnalysis(ops, passageWords, typedWords, gapAfter){
    const frag = document.createDocumentFragment();
    let currentP = document.createElement("p");
    currentP.className = "an-para";
    frag.appendChild(currentP);

    let typedCount = 0; // how many typed words have been rendered so far

    function newParagraphIfNeeded(pIdx){
      if (pIdx !== undefined && pIdx !== 0 && state.paragraphBoundaries.includes(pIdx)){
        currentP = document.createElement("p");
        currentP.className = "an-para";
        frag.appendChild(currentP);
      }
    }

    function renderGapAfter(idx){
      const gap = gapAfter[idx] || "";
      if (!gap) return;
      const boundaryIdx = state.paragraphBoundaries.indexOf(idx + 1);
      const isLegitIndentGap = boundaryIdx !== -1 && state.indentResults[boundaryIdx] === true;
      if (isLegitIndentGap) return; // the indent itself is shown via the paragraph break + indent styling
      if (gap.length > 1){
        const span = document.createElement("span");
        span.className = "an-space-mistake";
        span.title = `Extra spacing — ${gap.length} spaces instead of 1`;
        span.textContent = " ";
        currentP.appendChild(span);
      } else {
        currentP.appendChild(document.createTextNode(" "));
      }
    }

    ops.forEach(op => {
      if (op.type === "match" || op.type === "sub"){
        newParagraphIfNeeded(op.pIdx);
        const pWord = passageWords[op.pIdx];
        const tWord = typedWords[op.tIdx];
        if (op.type === "sub" || (op.type === "match" && pWord !== tWord)){
          // Wrong word (substitution/spelling) or a correct word typed with
          // different case/punctuation: show exactly what was mistyped —
          // the original struck through, immediately followed by what was
          // actually typed underlined — instead of only colour-coding the
          // typed word and hiding the "why" behind a hover tooltip.
          const wrap = document.createElement("span");
          wrap.className = "an-word-pair";
          const origSpan = document.createElement("span");
          origSpan.className = "an-orig";
          origSpan.textContent = pWord;
          const typedSpan = document.createElement("span");
          typedSpan.className = op.type === "sub" ? "an-typed an-typed-wrong" : "an-typed an-typed-format";
          typedSpan.textContent = tWord;
          wrap.appendChild(origSpan);
          wrap.appendChild(typedSpan);
          currentP.appendChild(wrap);
        } else {
          const span = document.createElement("span");
          span.className = "an-word an-correct";
          span.textContent = tWord;
          currentP.appendChild(span);
        }
        renderGapAfter(typedCount);
        typedCount++;
      } else if (op.type === "add"){
        const span = document.createElement("span");
        span.className = "an-word an-extra";
        span.title = "Extra word (addition, not in passage)";
        span.textContent = typedWords[op.tIdx];
        currentP.appendChild(span);
        renderGapAfter(typedCount);
        typedCount++;
      } else if (op.type === "omit"){
        newParagraphIfNeeded(op.pIdx);
        const span = document.createElement("span");
        span.className = "an-word an-omitted";
        span.title = "Skipped — you didn't type this word (omission)";
        span.textContent = passageWords[op.pIdx];
        currentP.appendChild(span);
        currentP.appendChild(document.createTextNode(" "));
      }
    });

    analysisText.innerHTML = "";
    analysisText.appendChild(frag);
  }

  function showResults(r){
    resultsEyebrow.textContent =
      r.reason === "timeup" ? "Time's up" :
      r.reason === "completed" ? "Passage complete" : "Test submitted";

    resultsWpm.textContent = r.netWpm;
    resultsAcc.textContent = `${r.accuracy}%`;
    resultsTime.textContent = formatTime(r.seconds);
    resultsChars.textContent = r.wordsTyped;
    resultsMistakes.textContent = r.totalMistakes;
    resultsGrossWpm.textContent = r.grossWpm;
    resultsMarks.textContent = `${r.marks} / ${r.marksTotal}`;
    resultsPassBadge.textContent = r.passed ? "PASS" : "FAIL";
    resultsPassBadge.className = "pass-badge " + (r.passed ? "pass-badge-yes" : "pass-badge-no");

    breakdownOmission.textContent = r.full.omission;
    breakdownSubstitution.textContent = r.full.substitution;
    breakdownAddition.textContent = r.full.addition;
    breakdownSpelling.textContent = r.full.spelling;
    breakdownSpacing.textContent = r.spacingMistakes;
    breakdownCase.textContent = r.half.capitalization;
    breakdownPunctuation.textContent = r.half.punctuation;
    breakdownIndent.textContent = `${r.indentMistakes} / ${r.indentTotal}`;
    breakdownIndent.classList.toggle("breakdown-ok", r.indentMistakes === 0);

    resultsMessage.textContent = buildMessage(r);

    showScreen(resultsScreen);
  }

  function buildMessage(r){
    const indentNote = r.indentMistakes > 0
      ? ` You also lost ${r.indentMistakes} mark${r.indentMistakes > 1 ? "s" : ""} for not pressing Tab at the start of ${r.indentMistakes > 1 ? "some paragraphs" : "a paragraph"}.`
      : "";
    if (!r.passed){
      return `You scored ${r.marks}/${r.marksTotal} on the speed passage — below the 16-mark (40%) pass line. Every mistake (wrong word, spacing, case, punctuation, missed indent) costs exactly 1 mark, so accuracy matters more than raw speed.${indentNote}`;
    }
    if (r.netWpm >= state.speed){
      return `Nice work — you passed with ${r.marks}/${r.marksTotal} marks and hit your ${state.speed} WPM target on net speed.${indentNote}`;
    }
    return `You passed with ${r.marks}/${r.marksTotal} marks, though your net speed is still a bit under your ${state.speed} WPM target.${indentNote}`;
  }

  /* ---------------------------------------------
     13. PERSONAL BEST (localStorage)
  --------------------------------------------- */
  const BEST_KEY = "rupesh_typing_best_wpm";

  function loadBestScore(){
    const best = Number(localStorage.getItem(BEST_KEY) || 0);
    if (best > 0){
      bestValue.textContent = `${best} WPM`;
      bestBadge.hidden = false;
    }
  }

  function saveBestScore(wpm){
    const best = Number(localStorage.getItem(BEST_KEY) || 0);
    if (wpm > best){
      localStorage.setItem(BEST_KEY, String(wpm));
      bestValue.textContent = `${wpm} WPM`;
      bestBadge.hidden = false;
    }
  }

}
/* ---------------------------------------------
   14. THEME (light / dark)
--------------------------------------------- */
const THEME_KEY = "rupesh_typing_theme";

function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  themeToggleLabel.innerHTML = theme === "light" ? "&#9789; Dark" : "&#9728; Light";
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if (saved){
    applyTheme(saved);
    return;
  }
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(prefersLight ? "light" : "dark");
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  applyTheme(current === "light" ? "dark" : "light");
});

/* ---------------------------------------------
   15. MCQ QUESTION BANK
   Keyed by speed (WPM set). Only 30, 40, 50 exist
   in the real GCC-TBC exam.
   30 WPM bank populated from the official Jan 2026
   provisional answer key PDF (875 questions across
   35 exam batches). 40 & 50 to be added once their
   PDFs arrive — leave as empty arrays until then.
--------------------------------------------- */
const MCQ_BANK_30 = [
  { q: "------------ is an example of application software.", options: ["Linux", "WORD Processor", "OS", "Complier"], answer: 1 },
  { q: "--------------- is used for data reading on CD.", options: ["CD Drive", "Floppy Drive", "Hard Drive", "Pen drive"], answer: 0 },
  { q: "----------- is used to transfer data from one computer to other computer.", options: ["Pen Drive", "Floppy", "Optical Disk", "All of Above"], answer: 3 },
  { q: "-------------- types of computers does the data interpretation in form of 0 & 1.", options: ["Digital", "Analog", "Hybrid", "Logic"], answer: 0 },
  { q: "_______________ is Secondary storage device", options: ["Hard Disk", "Memory Card", "Pen Drive", "All of these"], answer: 3 },
  { q: "ctrl+s is used for", options: ["delete", "Save", "open", "delete"], answer: 1 },
  { q: "… … … … … … … … is the extension of Word files?", options: ["FIL", "DOT", "DOC", "TXT"], answer: 2 },
  { q: "Grammer mistakes does not checked by MS-Word", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "___________ can you disable extended selection mode", options: ["Press F8 again to disable", "Press Del to disable", "Press Esc to disable", "Press Enter to disable"], answer: 2 },
  { q: "___________ item appears dimly behind the main body text", options: ["Water Color", "Background", "Watermark", "Back Color"], answer: 2 },
  { q: "A Worksheet may contain many Workbook", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "_________ Collection is called as Workbook.", options: ["Worknote-Bo ok", "Work Document", "Chart Book", "Worksheet"], answer: 3 },
  { q: "__________ Means instruction to perform calculations.", options: ["Text", "Formula", "Number", "Cell Reference"], answer: 1 },
  { q: "___________ Means in built formula basically available in Excel.", options: ["Programs", "Value", "Figures", "Functions"], answer: 3 },
  { q: ".pptx is the extension of Power Point", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Picture can be inserted from ________Tab", options: ["File", "Insert", "Formulas", "Data"], answer: 1 },
  { q: "_____________ keys is used for Help option.", options: ["Help", "find", "search", "move"], answer: 0 },
  { q: "--------------------- to the text can be given by using shadow command.", options: ["Highlight", "Font Color", "Shadow", "None of these"], answer: 2 },
  { q: "MS- PowerPoint is useful for making ____________ at professional level.", options: ["Presentation", "Webpage", "Processing", "Video"], answer: 0 },
  { q: "________ option used to display ruler line.", options: ["View", "File", "Slide Show", "Window"], answer: 0 },
  { q: "All modems are located inside the computer.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "____________ Is a way of sending and receiving messages using a computer.", options: ["G-mail", "E-mail", "M-mail", "Google"], answer: 1 },
  { q: "In Computer E-Mail is a way of _________ messages.", options: ["Sending", "Copying", "Moving", "Downloading"], answer: 0 },
  { q: "Process of saving files to your computer from the internet is called ____________", options: ["Uploading", "Downloading", "Installing", "Unzip"], answer: 1 },
  { q: "\"HTML\" is acronym for what?", options: ["Hypertext Markup Loop", "High Tone Modifier Loop", "Hypertext Markup Language", "None of the above"], answer: 2 },
  { q: "________________ means P4, 1.7 GHz.", options: ["Pentium IV Processor, Clock Speed 1.7 GHz", "P-4, 1.7 Speed", "1.7 Speed, P-4", "P-IV-1.7 Speed"], answer: 0 },
  { q: "------------ an example of computer Antivirus.", options: ["Data", "Quick Heal", "Memory", "Floppy & CD"], answer: 1 },
  { q: "---------- and printer are commonly used output devices.", options: ["Monitor", "Unix", "Windows", "Webcam"], answer: 0 },
  { q: "-------------- are the input devices.", options: ["Keyboard", "Mouse", "Scanner", "All of Above"], answer: 3 },
  { q: "-------------- are the output devices.", options: ["Printer", "Monitor", "Speaker", "All of Above"], answer: 3 },
  { q: "___________ items are placed at the end of a document", options: ["Footer", "Foot Note", "End Note", "Header"], answer: 2 },
  { q: "_____________ Is made up of Rows and Columns.", options: ["Text Box", "Rectangles", "Borders", "Table"], answer: 3 },
  { q: "_____________ Means distance between Text Matter and Page Margins.", options: ["Indent", "Margin", "Gap", "Gutter"], answer: 0 },
  { q: "_______________ is not a font style.", options: ["Bold", "Italics", "Regular", "Superscript"], answer: 3 },
  { q: "________________ is the extension of Word files?", options: ["FIL", "DOT", ".Docx", "TXT"], answer: 2 },
  { q: "_____________ Means instruction to perform calculations.", options: ["Text", "Formula", "Number", "Cell Reference"], answer: 1 },
  { q: "_____________ Option is available only in MS-Excel Window.", options: ["Status Bar", "Title Bar", "Menu Bar", "Formula Bar"], answer: 3 },
  { q: "= Lower() Function use to convert text in to __________ case.", options: ["Capital", "Small", "Big", "Upper"], answer: 1 },
  { q: "= Now(), is a function used to get the current ______", options: ["system time", "time", "date", "None of these"], answer: 0 },
  { q: "= Today(), is a function used to get the current _____", options: ["Year", "Date", "Month", "Time"], answer: 1 },
  { q: "------------------- are printed notes of speech referred by the Speaker in the meeting.", options: ["Notes", "Speaker's Notes", "Listener's Notes", "Notations"], answer: 1 },
  { q: "------------------------ is present besides the PowerPoint logo on Title bar.", options: ["Status Bar", "Ribbon", "Quick Access Toolbar", "Title bar"], answer: 2 },
  { q: "---------------- is very useful software for making presentations (Slides, handout etc.) at professional level.", options: ["MS-Word", "MS-Excel", "MS-PowerPoi nt", "MS-Access"], answer: 2 },
  { q: "-------- means the effects given in Slide, regarding how the Objects appear during Slide show.", options: ["Animation", "Transition", "World Art", "Clip Art"], answer: 0 },
  { q: "------------------------- Menu is available only in PowerPoint.", options: ["Window", "View", "Slide show", "Format"], answer: 2 },
  { q: "\"WWW\" is an acronym for what?", options: ["Wide World Web", "Web Wide World", "World Web Wide", "World Wide Web"], answer: 3 },
  { q: ".................... Are types of Mouse.", options: ["Mechanical Mouse", "Optical Mouse", "Wireless Mouse", "All of these"], answer: 3 },
  { q: ".Com domain code is used to show ___ Site", options: ["Government", "Commercial", "Educational", "Professional"], answer: 1 },
  { q: ".com is an example of domain name address.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: ".com, .edu, .org, .net, .gov are part of domain code.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "HTTP is abbreviation of ___________", options: ["Hypertext transport policy", "Hypertext transport permission", "Hypertext transport port", "Hypertext transfer Protocol"], answer: 3 },
  { q: "--------- is an example of Operating system.", options: ["JAVA", "UNIX", "C++", "Internet"], answer: 1 },
  { q: "--------- is an example of programming language.", options: ["WORD", "EXCEL", "NOTEPAD", "C++"], answer: 3 },
  { q: "-------- is electronic circuit board which built in computer cabinet.", options: ["System Board", "RAM", "ROM", "CPU"], answer: 0 },
  { q: "------------- is the microcomputer.", options: ["Desktop", "Handheld", "Laptop", "All of Above"], answer: 3 },
  { q: "__________________ is not the Section Break Option?", options: ["Next Page", "Previous Page", "Odd Page", "Even Page"], answer: 1 },
  { q: "_____________________ is not valid version of MS Office", options: ["Office XP", "Office Vista", "Office 2007", "None of these"], answer: 1 },
  { q: "… … … … . of the following helps to reduce spelling error in the document?", options: ["Auto Format", "Auto Correct", "Smart Tags", "Auto Text"], answer: 1 },
  { q: "… … … … … . item appears dimly behind the main body text", options: ["Water Color", "Background", "Watermark", "Back Color"], answer: 2 },
  { q: "… … … … … .. can you disable extended selection mode", options: ["Press F8 again to disable", "Press Del to disable", "Press Esc to disable", "Press Enter to disable"], answer: 2 },
  { q: "= Upper() Function use to convert text in to __________ cases.", options: ["Capital", "Small", "Lower", "subscript"], answer: 0 },
  { q: "=lower(\"Hello\") , this function will convent the given text as", options: ["Hello", "hello", "hELLO", "HELLO"], answer: 1 },
  { q: "=Round() Function makes the number given in the bracket … … … … … to the number upto specific digit.", options: ["Maximum", "Minimum", "Round", "None of the above"], answer: 2 },
  { q: "=SUM(E8:E11) this function sort the values in cells range between E8 to E11.", options: ["true", "false"], answer: 1 },
  { q: "=Upper(\"Hello\") , this function will convent the given text as", options: ["Hello", "hello", "hELLO", "HELLO"], answer: 3 },
  { q: "--------------------- view is useful to type matter on slide.", options: ["Print Layout", "Outline", "Normal", "None of these"], answer: 2 },
  { q: "...................... is process in which all slides are displayed one after another?", options: ["Page Show", "Image Show", "Slide Show", "None of Above"], answer: 2 },
  { q: "...................... is used to create best presentation.", options: ["MS Word", "Excel worksheet", "Notepad", "PowerPoint"], answer: 3 },
  { q: "...................... Means the effects given in slide, regarding how the objects appeared during the slide show.", options: ["Animation", "Transition", "Word Art", "Clip Art"], answer: 0 },
  { q: "...................... shows slides in full screen", options: ["Zoom", "Show", "Slide Show", "All of these"], answer: 2 },
  { q: ".Edu domain code is used to show ___ Site", options: ["Government", "Commercial", "Educational", "Professional"], answer: 2 },
  { q: ".edu, .com, .org, .net, .gov are part of standard internet address domain code.", options: ["true", "false"], answer: 0 },
  { q: ".GIF is a compressed bitmap format which supports ______________colors.", options: ["256", "1024", "354", "400"], answer: 0 },
  { q: ".Gov domain code is used to show ___ Site", options: ["Government", "Commercial", "Educational", "Professional"], answer: 0 },
  { q: ".MIDI is a file extension of a sound file.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "----------------- is type of optical Disk.", options: ["Floppy Disk Drive", "CD", "Hard disk", "Pen drive"], answer: 1 },
  { q: "------- means raw type information.", options: ["Information", "DATA", "Program", "System"], answer: 1 },
  { q: "--------- means set of commands given to the computer.", options: ["Input", "Program", "Language", "Indications"], answer: 1 },
  { q: "---------- printer gives color prints output.", options: ["Monitor", "Xerox", "Inkjet", "Dot-matrix"], answer: 2 },
  { q: "----------- virus spoils COM and EXE extension files.", options: ["File", "Data", "System", "Processor"], answer: 0 },
  { q: "… … … … … .. is the shortcut key to display field codes?", options: ["Alt + F9", "Ctrl + F9", "Shift + F9", "Space + F9"], answer: 0 },
  { q: "… … … … … .. items are placed at the end of a document", options: ["Footer", "Foot Note", "End Note", "Header"], answer: 2 },
  { q: "… … … … … … cannot be resized.", options: ["Dialog Box", "Window", "Word", "Wizard"], answer: 0 },
  { q: "… … … … … … . Option is use to change of margins.", options: ["Data", "Insert", "Page Layout", "Home"], answer: 2 },
  { q: "… … … … … … .. Is made up of Rows and Columns.", options: ["Text Box", "Rectangles", "Borders", "Table"], answer: 3 },
  { q: "=Upper() Function use to convert text in to … … … … … cases.", options: ["Capital", "Small", "Lower", "Upper"], answer: 0 },
  { q: "'∑' is a sign of Auto sum", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "'∑' is a sign of____", options: ["Summarize Data", "Autosum", "Subtractions", "All of the above"], answer: 1 },
  { q: "MS Excel 2019 is powerful_____", options: ["spreadsheet package", "operating system", "programming language", "All of These"], answer: 0 },
  { q: "____ Means in built formula basically available in Excel", options: ["Programs", "Value", "Figures", "Functions"], answer: 3 },
  { q: "....................... is available only in PowerPoint.", options: ["Slide Show", "Window", "View", "Format"], answer: 0 },
  { q: "....................... view is not available in PowerPoint", options: ["Normal", "Draft", "Notes Page", "None of these"], answer: 1 },
  { q: "....................... are Transitions available in MS - PowerPoint", options: ["Fade", "Push", "Wipe", "All of these"], answer: 3 },
  { q: "....................... is Power Point file extension.", options: [".Docx", ".pptx", ".mdb", ".bmp"], answer: 1 },
  { q: "....................... option is used to see slide show at some particular time interval.", options: ["Time", "Rehearse Time", "Automatic", "Watch"], answer: 1 },
  { q: ".org domain code is used to show ___ Site", options: ["Government", "Commercial", "Educational", "Organizational"], answer: 3 },
  { q: "__ is the short form of Weblog", options: ["WB", "WL", "Blog", "None of these"], answer: 2 },
  { q: "___ Email Server is developed by Google Company", options: ["Hotmail", "Yahoo mail", "Gmail", "None of these"], answer: 2 },
  { q: "___ is necessary to connect our Computer with Internet.", options: ["Telephone Instrument", "Modem", "CD drive", "Pen Drive"], answer: 1 },
  { q: "___ is standard Internet protocol.", options: ["IPX", "SPX", "TCP/IP", "ITC"], answer: 2 },
  { q: "WWW stands for ___________", options: ["World Wise Web", "World wise work", "World Wide Web", "World wide Work"], answer: 2 },
  { q: "\"Alt\" Key is __________ Key.", options: ["Combination", "Insert", "Addition", "Change"], answer: 0 },
  { q: "\"Control\" Key is __________ Key.", options: ["Enter", "Insert", "Addition", "Combination"], answer: 3 },
  { q: "\"PARAM\" is the ------------- computer", options: ["Super", "Micro", "Mini", "Mainframe"], answer: 0 },
  { q: "\"UNICODE\" is types of ---------", options: ["Application", "Program", "Font", "File"], answer: 2 },
  { q: "… … … … … … .. Means distance between Text Matter and Page Margins.", options: ["Indent", "Margin", "Gap", "Gutter"], answer: 0 },
  { q: "… … … … … … … can be used to set margins and indents in Document", options: ["Status Area", "Ruler", "Status Bar", "Toolbar"], answer: 1 },
  { q: "… … … … … … … . is not a font style.", options: ["Bold", "Italics", "Regular", "Superscript"], answer: 3 },
  { q: "… … … … … … … … is the short cut key to open Font dialog box.", options: ["Ctrl + F", "Alt + Ctrl + F", "Ctrl + D", "Ctrl + Shift + D"], answer: 2 },
  { q: "… … … … … … … … . Is a blinking straight line where we can type the matter.", options: ["Insertion Pointer", "Bar Tab", "Insertion Tab", "Point"], answer: 0 },
  { q: "____ Option is available only in MS-Excel Window.", options: ["Status Bar", "Title Bar", "Menu Bar", "Formula Bar"], answer: 3 },
  { q: "_____ Means instruction to perform calculations", options: ["Text", "Formula", "Number", "Cell Reference"], answer: 1 },
  { q: "______ data type cannot be used as a data a cell.", options: ["Text", "Formula", "Tree", "Number"], answer: 2 },
  { q: "_______ Bar is given at the topmost side of 'opening Screen' in Excel", options: ["Status", "Title", "Access", "Tool"], answer: 1 },
  { q: "________ means set of different formatting effects.", options: ["Style", "Font Size", "Font Group", "Font"], answer: 0 },
  { q: "....................... various Transitions available in MS - PowerPoint.", options: ["Shred", "Switch", "Flip", "All of Above"], answer: 3 },
  { q: "....................... View is used to adjust or arrange the matter in the slide.", options: ["Slide", "Slide show", "Outline", "Slide Sorter"], answer: 2 },
  { q: "....................... view is useful to create a slide", options: ["Outline", "Normal", "Print Layout", "None of Above"], answer: 1 },
  { q: "...........................Menu is available only in PowerPoint.", options: ["Window", "View", "Slide Show", "Format"], answer: 2 },
  { q: ".ppt extension is for ______ software files.", options: ["Ms Excel", "Ms PowerPoint", "Ms Presenter", "Ms Word"], answer: 1 },
  { q: "___ Is the by default Web browser of Microsoft Company", options: ["Internet Explorer", "Netscape Navigator", "Mozilla Firfox", "Google Chrome"], answer: 0 },
  { q: "___ Is the machine that makes www documents available.", options: ["Server", "Printer", "Monitor", "Mouse"], answer: 0 },
  { q: "___ shortcut key is used for refresh in Internet Explorer", options: ["F1", "F12", "F3", "F5"], answer: 3 },
  { q: "____ Folder shows the received Emails of Email account.", options: ["Inbox", "Outbox", "Sent Mail", "Trash"], answer: 0 },
  { q: "____ is an example of Application Software.", options: ["Interpreter", "Operating System", "Compiler", "Browser"], answer: 3 },
  { q: ".Avi is extension of _____________ file.", options: ["Image", "Audio", "Audio Video", "None Of Above"], answer: 2 },
  { q: ".bmp is ----------- file extension.", options: ["MS-paint", "Photoshop", "Coral draw", "PageMaker"], answer: 0 },
  { q: "A folder is also called as Directory", options: ["TRUE", "FALSE"], answer: 0 },
  { q: ".Bmp is extension of _____________ file.", options: ["Bitmap", "Executable", "Wordpad", "None Of Above"], answer: 0 },
  { q: ".Docx is ___________ file extension.", options: ["Notepad", "Word 2003", "Word 2007 to 2019", "Word 97"], answer: 2 },
  { q: "… … … … … … … … … … . is not valid version of MS Office", options: ["Office XP", "Office Vista", "Office 2007", "None of above"], answer: 1 },
  { q: "In MS Word, Ctrl+S is for ___", options: ["Scenarios", "Size", "Save", "Spelling Check"], answer: 2 },
  { q: "In MS-Word 2019 _____________ Is not a alignment.", options: ["Left", "Right", "Bottom", "Justify"], answer: 2 },
  { q: "we can select page border style using option in _____ tab in MS Word 2019 .", options: ["page border tab", "page layout tab", "Border Tab", "alignment tab"], answer: 1 },
  { q: "you want to cut some matter to move another place … … … .used.", options: ["cut", "close", "delete", "up"], answer: 0 },
  { q: "________ options are available under freeze panes in view tab?", options: ["freeze panes", "freeze top row", "freeze first column", "All of these"], answer: 3 },
  { q: "_________ Can be used for different mathematical calculations in Excel.", options: ["Autofill", "Text", "Mid", "Formula"], answer: 3 },
  { q: "_________ Types of orientation are available in Ms-Excel", options: ["3", "2", "4", "5"], answer: 1 },
  { q: "__________ application is most suited for a bar chart", options: ["Word Processor", "Database", "DOS", "Spreadsheet"], answer: 3 },
  { q: "__________ Bar is given at the top side of 'Opening screen' in Excel", options: ["Status", "Title", "Access", "Tool"], answer: 1 },
  { q: ".pptx is the extension of ____________", options: ["Excel", "Access", "PowerPoint", "Word"], answer: 2 },
  { q: "_____ view is used to adjust or arrange the matter in the slide.", options: ["Slide", "Slide Show", "Outline", "Slide Sorter"], answer: 2 },
  { q: "______ are Transitions available in MS - Powerpoint", options: ["Fade", "Push", "Wipe", "All of these"], answer: 3 },
  { q: "______ option is used to see slide show at some particular time interval.", options: ["Time", "Rehearse Time", "Automatic", "Watch"], answer: 1 },
  { q: "______ view is useful to create a slide", options: ["Outline", "Normal", "Print Layout", "None of these"], answer: 1 },
  { q: "____ is Search Engine.", options: ["World Wide Web", "HTTP", "HTML", "Gopher"], answer: 3 },
  { q: "____ key is used to see all the list of Internet Addresses.", options: ["F1", "F2", "F3", "F4"], answer: 3 },
  { q: "____ Option is used to store incomplete or temporary message in E-Mail.", options: ["Draft", "Inbox", "Sent Box", "None of above"], answer: 0 },
  { q: "_____ is a worldwide system of network.", options: ["LAN", "Internet", "Bluetooth", "Infrared"], answer: 1 },
  { q: "_____ Is an application software.", options: ["Internet Explorer", "Interpreter", "Complier", "Hyperlink"], answer: 0 },
  { q: ".exe file can be used to attached with E-mail.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: ".Midi is extension of _____________ file.", options: ["Text", "Musical Instrument Digital Interface", "Bitmap", "None Of Above"], answer: 1 },
  { q: ".txt is ----------- file extension.", options: ["Word", "Notepad", "PowerPoint", "Photoshop"], answer: 1 },
  { q: "______ Is unit of computer memory", options: ["Bytes", "Mega", "Gita", "None Of Above"], answer: 0 },
  { q: "______ is used to transfer data from one PC to another", options: ["Scanner", "Printer", "Pen Drive", "All of above"], answer: 2 },
  { q: "\"Smiley face\" shape is in the ___________ Option of Insert Tab", options: ["Shape", "Status", "Formatting", "Standard"], answer: 0 },
  { q: "____ can be used to set margins and indents in Document.", options: ["Status area", "Ruler Line", "Status Bar", "Toolbar"], answer: 1 },
  { q: "____ is containing of Rows and Columns.", options: ["Text Box", "Rectangle", "Borders", "Table"], answer: 3 },
  { q: "____ means distance between 'Text Matter' and 'Page Margins'.", options: ["Indent", "Margin", "Gap", "Gutter"], answer: 0 },
  { q: "____ option cancels previous action in msword.", options: ["copy", "paste", "Formatting", "undo"], answer: 3 },
  { q: "__________ Can be used for different mathematical calculations in Excel.", options: ["Autofill", "Text", "Mid", "Formula"], answer: 3 },
  { q: "__________ data type cannot be used as a data a cell.", options: ["Text", "Formula", "Tree", "Number"], answer: 2 },
  { q: "__________ features displays total of selected cell values on status bar-", options: ["AutoCal", "Add", "Autosum", "Sum"], answer: 3 },
  { q: "__________ Function converts the number into nearest integer.", options: ["if()", "Min()", "Round()", "int()"], answer: 3 },
  { q: "__________ Function makes the number in the brackets round to the number upto specific digits.", options: ["= IF()", "= Max()", "= Round()", "= Ceiling()"], answer: 2 },
  { q: "______ View is useful to type matter on slide.", options: ["Normal", "Print Layout", "Outline", "None of the above"], answer: 0 },
  { q: "_______ is Power Point file extention.", options: [".docx", ".pptx", ".mdb", ".bmp"], answer: 1 },
  { q: "________ Layout can be used to insert picture with its description.", options: ["Comparison", "Title Slide", "Picture with Caption", "None of these"], answer: 2 },
  { q: "________ shows slides in full screen", options: ["Zoom", "Show", "Slide Show", "All of these"], answer: 2 },
  { q: "_________ option can be selected from the slides group too organize your slides into different sections.", options: ["Sections", "layout", "reset", "new slide"], answer: 0 },
  { q: "_____ Is an example of system software.", options: ["Word processor", "spreadsheet", "presentation", "Unix"], answer: 3 },
  { q: "_____ is the biggest Network in the word.", options: ["LAN", "MAN", "Internet", "WAN"], answer: 2 },
  { q: "______ Button is used to reload the web page on the Browser", options: ["Home", "Backward Arrow", "Refresh", "Forward Arrow"], answer: 2 },
  { q: "______ is brain of a computer system.", options: ["CPU", "Input Unit", "Output Unit", "Memory Unit"], answer: 0 },
  { q: "_______ is a Microsoft's web Browser that install with windows by default.", options: ["Internet Explorer", "Google Chrome", "Opera", "Mozilla Firefox"], answer: 0 },
  { q: "_______ was the first electronic messaging system.", options: ["Postcard", "Email", "Envelope", "None of these"], answer: 1 },
  { q: "________ Is not input devices.", options: ["Keyboard", "Mouse", "Printer", "Microphone"], answer: 2 },
  { q: "________ allows information to be shared.", options: ["Data", "notepad", "Network", "WordPad"], answer: 2 },
  { q: "________ Are input devices.", options: ["Keyboard", "Mouse", "Scanner", "All Of Above"], answer: 3 },
  { q: "________ Are types of flash memory cards", options: ["Sd", "Mmc", "Memory Stick", "All of these"], answer: 3 },
  { q: "ctrl+R is used for Right Alignment", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "_____ Bar is displayed in the bottom side of Microsoft word application window", options: ["Title Bar", "Status Bar", "Scroll Bar", "Format Bar"], answer: 1 },
  { q: "_____ Cannot be resized.", options: ["Dialog box", "Window", "Word", "Wizard"], answer: 0 },
  { q: "_____ command is present in home tab", options: ["sort", "page number", "margin", "orientation"], answer: 0 },
  { q: "_____ is the default number of lines to drop for drop cap.", options: ["3", "10", "15", "20"], answer: 0 },
  { q: "__________ Function makes the text given in the brackets converted into capital cases and inserted in the cell", options: ["Lower()", "Capital()", "Upper()", "Case()"], answer: 2 },
  { q: "__________ Function makes the text given in the brackets converted into small cases and inserted in the cell", options: ["Upper()", "Capital()", "Lower()", "Case()"], answer: 2 },
  { q: "__________ Functions converts the number into nearest integer.", options: ["=Int()", "=If()", "=Max()", "=Round()"], answer: 0 },
  { q: "__________ is the correct option to sort data after selecting it in MS Excel 2019 .", options: ["page layout tab and click on sort", "click on view tab -> sort button", "review tab -> sorting data", "data tab -> sort & filter"], answer: 3 },
  { q: "__________ Means in built formula basically available in Excel.", options: ["Programs", "Value", "Figures", "Functions"], answer: 3 },
  { q: "_________ View is used to adjust or arrange the matter in the slide.", options: ["Slide", "Slide show", "Outline", "Slide Sorter"], answer: 2 },
  { q: "__________ Transitions available in MS PowerPoint", options: ["Honeycomb", "Glitter", "Vortex", "All of these"], answer: 3 },
  { q: "__________ various Transitions available in MS PowerPoint", options: ["Shred", "Switch", "Flip", "All of these"], answer: 3 },
  { q: "__________ are Transitions available in MS PowerPoint", options: ["Fade", "Push", "Wipe", "All of these"], answer: 3 },
  { q: "__________ can be inserted in PowerPoint presentation.", options: ["Paper", "Page", "Hyperlink", "None of these"], answer: 2 },
  { q: "_______ is a world Wide system of network.", options: ["LAN", "Cyberspace", "World Wide Web", "Intercom"], answer: 2 },
  { q: "_______ Is an example of Microprocessor.", options: ["Linux", "Unix", "C++", "Cyrix"], answer: 3 },
  { q: "_______ Is an example of programming language.", options: ["Unix", "Windows NT", "C++", "Linux"], answer: 2 },
  { q: "________ is an example of external memory.", options: ["RAM", "ROM", "Cache", "DVD"], answer: 3 },
  { q: "________ were used in fourth generation computers.", options: ["Vacuum Tubes", "Transistors", "Integrated Circuits", "Microprocesso rs"], answer: 3 },
  { q: "________ is example of programming language", options: ["MS-Word", "C++", "Paint", "Notepad"], answer: 1 },
  { q: "_________ indicates signal is off", options: ["0", "1", "Off", "Switch"], answer: 0 },
  { q: "_________ is extension of Notepad file.", options: [".docx", ".xlsx", ".pptx", ".txt"], answer: 3 },
  { q: "_________ Is storage device", options: ["Mouse", "Pen Drive", "Scanner", "Keyboard"], answer: 1 },
  { q: "_________ Keys are combination keys", options: ["Ctrl", "Alt", "Shift", "All of these"], answer: 3 },
  { q: "_____ is used for to refresh the active window", options: ["F5", "F6", "F1", "F2"], answer: 0 },
  { q: "_____ is used to cancel the changes", options: ["ESC", "delete", "next", "None of these"], answer: 0 },
  { q: "_____ of the following is not valid version of MS Office?", options: ["Office 2003", "Office Vista", "Office 2019", "Office 2007"], answer: 1 },
  { q: "_____ option copies the selected text in MS Word 2019", options: ["paste", "selected", "copy", "format"], answer: 2 },
  { q: "_____ tab is used to insert the shapes into the document.", options: ["Insert", "Tools", "File", "Design"], answer: 0 },
  { q: "__________ means set of different formatting effects.", options: ["Style", "Font Size", "Font Group", "Font"], answer: 0 },
  { q: "__________ option helps us to fit more of the data on lesser number of the pages", options: ["Print Titles", "Scale to Fit", "Break", "Print Area"], answer: 1 },
  { q: "__________ Option is available only in MS_EXCEL Window.", options: ["Status Bar", "Formula Bar", "Menu bar", "Title Bar"], answer: 1 },
  { q: "__________ option is used to get 1,2,3,4 . . . . Numbers in Sr.No. Column.", options: ["Autofill", "MIN", "Average", "Today"], answer: 0 },
  { q: "__________ Types of orientation are available in Ms-Excel", options: ["3", "2", "4", "5"], answer: 1 },
  { q: "__________ is available only in Powerpoint.", options: ["Slide Show", "Window", "View", "Format"], answer: 0 },
  { q: "__________ is extension for Presentation in Office 2019", options: [".docx", ".pptx", ".accdb", ".prst"], answer: 1 },
  { q: "__________ is used to create best presentation.", options: ["MS Word", "Excel worksheet", "Notepad", "Powerpoint"], answer: 3 },
  { q: "__________ is used to create business presentations", options: ["MS Word", "MS Excel", "MS PowerPoint", "MS Presenter"], answer: 2 },
  { q: "__________ view is not available in PowerPoint", options: ["Normal", "Web Layout", "Reading View", "None of these"], answer: 1 },
  { q: "________ were used in second generation computers.", options: ["Vacuum Tubes", "Transistors", "Integrated Circuits", "Microprocesso rs"], answer: 1 },
  { q: "________ were used in third generation computers.", options: ["Vacuum Tubes", "Transistors", "Integrated Circuits", "Microprocesso rs"], answer: 2 },
  { q: "_________ Cables are more safe than coaxial cables", options: ["Twisted Pair", "Fiber-Optic", "Shield Twisted Pair", "None of these"], answer: 1 },
  { q: "_________ E-Mails are shown in trash menu.", options: ["Sent", "Inbox", "Delete", "Draft"], answer: 2 },
  { q: "_________ Is a collection of files and subfolders.", options: ["Data", "Group", "Set", "Folder"], answer: 3 },
  { q: "_________ operations are mathematical calculations", options: ["Bitwise", "Arithmetic", "Logical", "Binary"], answer: 1 },
  { q: "_________ Replaced i.c.", options: ["Transistors", "Integrated Circuits", "Microprocesso rs", "None Of Above"], answer: 2 },
  { q: "_________ Replaced transistors", options: ["Transistors", "Integrated Circuits", "Microprocesso rs", "None Of Above"], answer: 1 },
  { q: "_________ types of Hard Disk are easy to carry while travelling", options: ["Internal", "External", "SSD", "All of above"], answer: 1 },
  { q: "__________ Are display devices.", options: ["Projector", "Hdtv", "Monitor", "All Of Above"], answer: 3 },
  { q: "_____ tab is used to insert the wordart into the document.", options: ["Home", "Insert", "Data", "View"], answer: 1 },
  { q: "______ indicates two lines of spacing in between two lines of text in MS Word 2019 .", options: ["20", "2.0", "20", "1.2"], answer: 1 },
  { q: "______ is blinking straight line where we can type the matter", options: ["Arrow", "cursor", "blink", "None of these"], answer: 1 },
  { q: "______ is the default file extension for all word documents.", options: [".txt", ".word", ".docx", ".dos"], answer: 2 },
  { q: "______ item is printed at the bottom of each page", options: ["Header", "Foot Note", "Title", "Footer"], answer: 3 },
  { q: "___________ option is to be select to quit Microsoft Excel.", options: ["Close", "Exit", "Minimize", "Maximize"], answer: 1 },
  { q: "____________ application is most suited for a bar chart", options: ["Word Processor", "Database", "DOS", "Spreadsheet"], answer: 3 },
  { q: "____________ Bar is given at the top side of 'Opening screen' in Excel", options: ["Status", "Title", "Access", "Tool"], answer: 1 },
  { q: "__________Function converts the number into nearest integer.", options: ["if()", "Min()", "Round()", "int()"], answer: 3 },
  { q: "______Option is available only in MS_EXCEL Window.", options: ["Status Bar", "Formula Bar", "Menu bar", "Title Bar"], answer: 1 },
  { q: "___________ view is available in PowerPoint", options: ["Normal", "Notes Page", "Reading View", "All of these"], answer: 3 },
  { q: "___________ view is not available in Powerpoint", options: ["Normal", "Draft", "Notes Page", "None of these"], answer: 1 },
  { q: "____________ can be referred by the speaker while giving a presentation.", options: ["Speaker's Note", "layout", "Slide", "Document"], answer: 0 },
  { q: "____________ Menu is available only in Power Point.", options: ["Windows", "View", "Slide Show", "Format"], answer: 2 },
  { q: "____________ pointer helps to draw line to understand our speech or statements while slide show.", options: ["Pen", "Arrow", "New", "Animation"], answer: 0 },
  { q: "_________ Is a special function key available on the keyboard.", options: ["Pause", "Tab", "Esc", "F10"], answer: 3 },
  { q: "_________ Is an example of input unit.", options: ["Monitor", "Mouse", "Printer", "Speaker"], answer: 1 },
  { q: "_________ Is shown on the desktop of Windows 10.", options: ["Recycle Bin", "Disk Drives", "Compilers", "Drivers"], answer: 0 },
  { q: "_________ Is standard Internet Protocol", options: ["IPX", "SPX", "ITC", "TCP / IP"], answer: 3 },
  { q: "_________ is WAN type of network.", options: ["Internet", "Browser", "Webpage", "Home page"], answer: 0 },
  { q: "__________ Are not display devices.", options: ["Projector", "Hdtv", "Plotter", "None Of Above"], answer: 2 },
  { q: "__________ are not names of Antivirus program.", options: ["Norton", "Quick Heal", "Net Protector", "MS-Word"], answer: 3 },
  { q: "__________ Are types of micro computers.", options: ["Desktop", "Laptop", "Handheld", "All Of Above"], answer: 3 },
  { q: "__________ are types of mouse", options: ["Mechanical", "Optical", "Wireless", "All of these"], answer: 3 },
  { q: "__________ device is specially used to play games on computer", options: ["Mouse", "Joystick", "Keyboard", "None of above"], answer: 1 },
  { q: "______ of the following is not a type of page margin?", options: ["Right", "Center", "Left", "Top"], answer: 1 },
  { q: "______ option is used to create document like newspaper format.", options: ["Bulletes and Numbering", "Tables", "Columns", "Tab stops"], answer: 2 },
  { q: "______ option is used to select the whole word in document.", options: ["double click on that word", "single click on that word", "double click on page border", "right click on that word"], answer: 0 },
  { q: "______ shows print preview in MS Word 2019", options: ["insert tab", "design tab", "review tab", "file menu"], answer: 3 },
  { q: "_______ Is not a font face.", options: ["Bold", "Arial", "Calibri", "Times New Roman"], answer: 0 },
  { q: "___Means in built formula basically available in Excel", options: ["Programs", "Value", "Figures", "Functions"], answer: 3 },
  { q: "… … . is used to cancel the changes in MS-Excel", options: ["ESC", "delete", "next", "None of these"], answer: 0 },
  { q: "15 points is the default height of _____", options: ["Column", "worksheet", "row", "cell"], answer: 2 },
  { q: "A bar displays content and formula in active cell is called ---- bar", options: ["Status", "Formula", "Address", "Title"], answer: 1 },
  { q: "A bar which is displayed at the right side of the name box is called as ___ in MS Excel 2019 .", options: ["name bar", "address bar", "formula bar", "no such bar is displayed in MS Excel 2019 ."], answer: 2 },
  { q: "____________ view is not available in PowerPoint", options: ["Normal", "Notes Page", "Draft", "None of these"], answer: 2 },
  { q: "_____________ means the effects given in slide, regarding how the objects appeared during slide show.", options: ["Animation", "Transition", "Word art", "clipart"], answer: 0 },
  { q: "_____________ option is used to see slide show at some particular time pause.", options: ["Time", "Rehearse Time", "Automatic", "Watch"], answer: 1 },
  { q: "______________ can be created using PowerPoint.", options: ["Document", "Database", "Handouts", "Picture"], answer: 2 },
  { q: "______________ view is available in PowerPoint", options: ["Slide Mater", "Handout Mater", "Notes Master", "All of these"], answer: 3 },
  { q: "_________ Means contains some commercial information.", options: ["gov", "net", "edu", "com"], answer: 3 },
  { q: "_________ means contains some education information.", options: ["edu", "com", "gov", "net"], answer: 0 },
  { q: "_________ means government Web Site.", options: ["edu", "net", "gov", "com"], answer: 2 },
  { q: "_________ shortcut key is used for refresh in Internet Explorer.", options: ["F1", "F5", "F12", "F3"], answer: 1 },
  { q: "_________ Shows a location address on the Browser.", options: ["Server", "Postal Address", "E-Mail Address", "Address Bar"], answer: 3 },
  { q: "__________ is called photoelectric scanners.", options: ["Pen Scanner", "Bar code reader", "Portable Scanner", "Flatbed scanner"], answer: 1 },
  { q: "__________ is interconnected network.", options: ["printer", "Internet", "Web site", "Home page"], answer: 1 },
  { q: "__________ Is not output device", options: ["Monitor", "Pen Drive", "Printer", "Plotter"], answer: 1 },
  { q: "__________ Is output device", options: ["Monitor", "Printer", "Plotter", "All Of Above"], answer: 3 },
  { q: "__________ Is permanent memory", options: ["Ram", "Rom", "Cache", "None Of Above"], answer: 1 },
  { q: "_______ Is the shortcut key to \"Center Align\".", options: ["Ctrl + G", "Ctrl + C", "Ctrl + E", "Ctrl + H"], answer: 2 },
  { q: "_______ Line spacing means between two lines there is the spacing of only one line.", options: ["1.0 (Single)", "1.5", "2.0 (Double)", "4"], answer: 0 },
  { q: "_______ shortcut key is used to spell check in MS-Word", options: ["F1", "F2", "F7", "F8"], answer: 2 },
  { q: "_______ Tab we can do page setting in MS-Word", options: ["Page Layout", "Print Layout", "A4", "Home"], answer: 0 },
  { q: "_________ Is containing of Rows and columns.", options: ["Table", "Border", "Text Box", "Rectangle"], answer: 0 },
  { q: "A dark coloured strip showing the title at the top of Ms- Excel window is called as … … … ..", options: ["Status Bar", "Title Bar", "Scroll Bar", "None of the above"], answer: 1 },
  { q: "A formula in Excel always has to start with (fx).", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "A single worksheet has _____ columns", options: ["16000", "16384", "17000", "17384"], answer: 1 },
  { q: "A single worksheet has _____ rows", options: ["10,48,576", "11,00,000", "12,00,000", "None of these"], answer: 0 },
  { q: "A Workbook may contain many ___________", options: ["Worksheet", "Column", "Row", "Pages"], answer: 0 },
  { q: "_______________ can be recorded in PowerPoint", options: ["Video", "Audio", "Both A & B", "None of These"], answer: 1 },
  { q: "_______________ tab is available only in PowerPoint.", options: ["Window", "Slide Show", "Format", "Home"], answer: 1 },
  { q: "__________________ are transitions available in PowerPoint", options: ["Fade", "Push", "Wipe", "All of these"], answer: 3 },
  { q: "__________________ transition are available in PowerPoint", options: ["Entrance", "Exit", "Emphasis", "Flip"], answer: 3 },
  { q: "____________________ is a type of slide in PowerPoint", options: ["Title only", "status", "Line", "Circle"], answer: 0 },
  { q: "__________ Can be used to send and receive messages.", options: ["Word Processor", "Image editor", "Windows", "E-mail"], answer: 3 },
  { q: "__________ Is an example of Application Software.", options: ["Interpreter", "Operating System", "Browser", "Compiler"], answer: 2 },
  { q: "__________ means raw information given to computer as input.", options: ["Characters", "Information", "Data", "Analysis"], answer: 2 },
  { q: "__________ Means respond to received mail.", options: ["Forward", "Compose", "Delete", "Reply"], answer: 3 },
  { q: "__________ Means sending received E-Mail to some other mail id.", options: ["Compose", "Forward", "Reply", "Delete"], answer: 1 },
  { q: "__________ Is secondary memory", options: ["Ram", "Rom", "Cache", "None Of Above"], answer: 3 },
  { q: "__________ means raw type of information", options: ["Program", "Data", "Information", "System"], answer: 1 },
  { q: "__________ Printer is used to print images like engineering drawing, maps etc.", options: ["Plotter", "Inkjet", "Dot Matrix", "Laser"], answer: 0 },
  { q: "___________ Are most powerful and efficient computers", options: ["Super Computer", "Mainframe Computer", "Mini Computer", "Micro Computer"], answer: 0 },
  { q: "___________ Are types of computer", options: ["Digital", "Analogue", "Both A And B", "None Of Above"], answer: 2 },
  { q: "_________ is search Engine.", options: ["World Wide Web", "Gopher", "HTTP", "HTML"], answer: 1 },
  { q: "_________ is the biggest Network in the world.", options: ["LAN", "WAN", "MAN", "INTERNET"], answer: 3 },
  { q: "_________ Line spacing is invalid in MS-Word.", options: ["Multiple", "Single", "Double", "Five"], answer: 3 },
  { q: "___________ alignment is default alignment for word document", options: ["Left", "Right", "Justify", "center"], answer: 0 },
  { q: "___________ is the combination of Rows and Columns.", options: ["Border", "Table", "TextBox", "Rectangle"], answer: 1 },
  { q: "Additon of cells B4 & F7 can be done using _____ Formula", options: ["=B4*F7", "=B4+F7", "=B4@F7", "=B4/F7"], answer: 1 },
  { q: "After starting MS-Excel 2019, we see _____ file by default", options: ["Book1", "Document1", "Presentation1", "None of these"], answer: 0 },
  { q: "Alignments of cell in Excel sheet can be done by_______", options: ["Files / Cells", "Format / Cells", "FTP / Align", "None of these"], answer: 1 },
  { q: "All commands are given in tab and ribbon format in MS Excel 2019 .", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "All commands are given in the form of Tabs and Ribbon in Excel 2019.", options: ["true", "false"], answer: 0 },
  { q: "_______________________ __ Menu is available only in PowerPoint.", options: ["Window", "View", "Slide show", "Format"], answer: 2 },
  { q: "___________View is used to add the Notes in the slide, for our reference.", options: ["Slide", "Slide show", "Notes Page", "Slide Sorter"], answer: 2 },
  { q: "… … … .means the effects given in slide, regarding how the objects appeared during slide show.", options: ["Animation", "Transition", "Word Art", "Clip Art"], answer: 0 },
  { q: "… … … … … .. option can be used to creat a new slide show with the current slide but presented in a different order.", options: ["Custom Show", "Slide Show Setup", "Slide Show view", "Action Settings"], answer: 0 },
  { q: "A default blank presentation file has name 'Presentation1'", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "___________ Is a secondary memory.", options: ["RAM", "ROM", "Cache", "Optical Disk"], answer: 3 },
  { q: "___________ Is an example of programming language.", options: ["Binary", "Java", "Bite Code", "Bit Code"], answer: 1 },
  { q: "___________ Shows information on the screen of a computer.", options: ["Monitor", "Mouse", "Printer", "Scanner"], answer: 0 },
  { q: "___________ Unit controls all parts of a computer.", options: ["Input", "Output", "Control", "Memory"], answer: 2 },
  { q: "___________ Virus disturbs the boot sectors of the disk.", options: ["Boot", "File", "Blog", "Bug"], answer: 0 },
  { q: "___________ Are types of keyboard.", options: ["Ergonomic", "Flexible", "Wireless", "All of these"], answer: 3 },
  { q: "___________ Are types of mouse.", options: ["Mechanical", "Optical", "Wireless", "All Of Above"], answer: 3 },
  { q: "___________ Is considered as brain of computer.", options: ["Hard Disk", "Ram", "Microprocesso r", "None Of Above"], answer: 2 },
  { q: "___________ Is impact printer.", options: ["Laser", "Inkjet", "Dot Matrix", "None of these"], answer: 2 },
  { q: "___________ is necessary to connect our computer with Internet.", options: ["Telephone Instrument", "Pen Drive", "Modem", "CD Drive"], answer: 2 },
  { q: "___________ Means distance between 'Text Matter' and 'Page margins'.", options: ["Indent", "Margin", "Gap", "Gutter"], answer: 0 },
  { q: "____________ is containing of Rows and Columns.", options: ["Text Box", "Rectangles", "Borders", "Table"], answer: 3 },
  { q: "_____________ Is type of Application Software", options: ["Windows", "Ms-Word", "Dos", "Unix"], answer: 1 },
  { q: "_________________ is the shortcut key for manual line break.", options: ["CTRL + Enter", "Alt + Enter", "Shift + Enter", "Space + Enter"], answer: 2 },
  { q: "_________________ is not a type of page margin.", options: ["Left", "Right", "Center", "Top"], answer: 2 },
  { q: "Ascending Sorting means … … … … … … … .. Sorting.", options: ["A to z", "Z to A", "Both A & B", "None of the above"], answer: 0 },
  { q: "Ascending-Descending are types of _______", options: ["Indent", "Alignment", "Sorting", "All of these"], answer: 2 },
  { q: "At a time only one Cell can be active.", options: ["true", "false"], answer: 0 },
  { q: "At the Left side of the Zoom Slider, we see _______Bar", options: ["Scroll bar", "Title Bar", "Task Bar", "Status Bar"], answer: 3 },
  { q: "At the right side of the sheet tabs, we get the horizontal … … … … … … … . Bar", options: ["Tool Bar", "Scroll Bar", "Title Bar", "Status Bar"], answer: 1 },
  { q: "A new presentation can be created from___________", options: ["Blank presentation", "Existing presentation", "Design template", "All of these"], answer: 3 },
  { q: "A slide show of pictures can be created in _____________", options: ["PowerPoint", "Excel", "Access", "Word"], answer: 0 },
  { q: "Align Text command is available in ___________ group in PowerPoint", options: ["Clipboard", "Slides", "Font", "Paragraph"], answer: 3 },
  { q: "All commands are available in ______________ in PowerPoint", options: ["Status Bar", "Ribbons", "Title Bar", "None of these"], answer: 1 },
  { q: "Animation effects can be applied to _____ in a presentation.", options: ["Selected slides", "current slide", "All slides", "All of These"], answer: 3 },
  { q: "____________ are two important parts of E-Mail", options: ["Subject and body", "Subject and reference", "Reference and message", "Reference and body"], answer: 0 },
  { q: "____________ Is a free E-Mail program that you can access from any web Browser.", options: ["Gmail", "Hotmail", "Yahoo mail", "All of above"], answer: 3 },
  { q: "____________ is an example of an antivirus program.", options: ["Unix", "Linux", "Windows", "Quick Heal"], answer: 3 },
  { q: "____________ is necessary to connect our Computer with Internet", options: ["Modem", "Telephone Instrument", "CD Drive", "Pen Drive"], answer: 0 },
  { q: "____________ is NOT an example of Operating system", options: ["Windows 10", "DOS", "Unix", "Norton"], answer: 3 },
  { q: "___________ Is not type of printer", options: ["Plotter", "Laser", "Solid", "Dot Matrix"], answer: 2 },
  { q: "___________ Is primary memory.", options: ["RAM", "ROM", "CACHE", "All Of Above"], answer: 3 },
  { q: "___________ Is volatile memory.", options: ["RAM", "ROM", "CACHE", "None Of Above"], answer: 0 },
  { q: "____________ Are activities of virus", options: ["Deleting Files", "Erasing Data", "Corrupting Data", "All Of Above"], answer: 3 },
  { q: "____________ Are parts of binary system", options: ["5", "3", "4", "None Of Above"], answer: 3 },
  { q: "_____________________ is the short cut key to open the Open dialog box?", options: ["F12", "Shift F12", "Alt + F12", "Ctrl + F12"], answer: 3 },
  { q: "_____________key used for left align", options: ["ctrl+L", "ctrl+R", "ctrl+V", "ctrl+J"], answer: 0 },
  { q: "________means readymade formats provided by words.", options: ["WordArt", "font styles", "Font size", "Template"], answer: 3 },
  { q: "______are the filter option", options: ["AutoFilter", "CustomerFilt er", "AdvanceFilter", "All of these"], answer: 3 },
  { q: "______bar displays name of document with program name", options: ["Menu", "Task", "Title", "status"], answer: 2 },
  { q: "Auto Sum option is available in ______", options: ["Formula", "Data", "Insert", "None of these"], answer: 0 },
  { q: "Autofill Option is used to get 1,2,3,4 … … . Numbers in … … … … .. Column.", options: ["Serial Number", "Down", "Up", "None of the above"], answer: 0 },
  { q: "Autosum button is available in data tab in MS Excel 2019 .", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "In Ms-Excel XFD is the heading of column", options: ["true", "false"], answer: 0 },
  { q: "Below the ______ area, we get sheet Tabs", options: ["worksheet", "Cell", "Row", "Column"], answer: 0 },
  { q: "Arrange command is availabe in ______ group in PowerPoint", options: ["Font", "Paragraph", "Drawing", "Editing"], answer: 2 },
  { q: "As soon as clipart in inserted, free rotate button / option is available.", options: ["true", "false"], answer: 0 },
  { q: "Background Command group is in ____________ Tab.", options: ["Insert", "Design", "Tools", "File"], answer: 1 },
  { q: "Background group is in _____Tab.", options: ["Insert", "Design", "Tools", "File"], answer: 1 },
  { q: "Background Styles command is available in ___________ tab in PowerPoint", options: ["Home", "Insert", "Transition", "Design"], answer: 3 },
  { q: "____________ Is the biggest Network in the world.", options: ["LAN", "MAN", "WAN", "Internet"], answer: 3 },
  { q: "____________ is the most common internet protocol.", options: ["HTML", "TCP/IP", "IPX/SPX", "NetBEUL"], answer: 1 },
  { q: "____________ is Web Browser software", options: ["Internet Explorer", "MS Word", "MS Excel", "MS PowerPoint"], answer: 0 },
  { q: "____________ shortcut key is used to see all the list of Internet Addresses.", options: ["F1", "F2", "F4", "F6"], answer: 2 },
  { q: "_____________ Is a gadget provided by Windows 10.", options: ["MS Word", "MS Excel", "MS PowerPoint", "Calendar"], answer: 3 },
  { q: "____________ Can contain many files.", options: ["Folder", "Basket", "Box", "None Of Above"], answer: 0 },
  { q: "____________ Disturbs data, stop or disturb functioning of pc", options: ["Virus", "Antivirus", "Software", "Hardware"], answer: 0 },
  { q: "____________ Is not operating system.", options: ["Windows", "Linux", "Ms-Office", "All Of Above"], answer: 2 },
  { q: "____________ Is not type of electronic device", options: ["Computer", "Mobile", "Typewriter", "None Of Above"], answer: 2 },
  { q: "____________ Is pointing device.", options: ["Mouse", "Keyboard", "Scanner", "None Of Above"], answer: 0 },
  { q: "______comes under View tab in MS Word 2019", options: ["print layout", "mailing", "spelling", "table"], answer: 0 },
  { q: "______is the sortcut key for closing document in MS-Word", options: ["CTRL+A", "CTRL+Z", "CTRL+Y", "CTRL+W"], answer: 3 },
  { q: "______is used for performing menu operations through GUI", options: ["Toolbar", "Taskbar", "Stock chart", "None of these"], answer: 0 },
  { q: "______press when help dialog box is appear", options: ["F4", "F3", "F1", "F2"], answer: 2 },
  { q: "_____shortcut key is used for cut the text in MS Word 2019", options: ["ctrl + x", "ctrl + t", "ctrl + c", "ctrl + u"], answer: 0 },
  { q: "Below the worksheet area, we get _________", options: ["Name Box", "Tabs", "Formula Bar", "Sheet Tabs"], answer: 3 },
  { q: "Bold is used to make the selected text as ___", options: ["Bold", "Italic", "Bold & Italic", "Black"], answer: 0 },
  { q: "By Pressing Ctrl + S , _____________ action is done.", options: ["Open file", "new file", "Save file", "Exit file"], answer: 2 },
  { q: "By Pressing Home Key Cell Pointer move to first Cell of current Row.", options: ["true", "false"], answer: 0 },
  { q: "By using ____ option, only selected matter is removed but format remains as it is in the cells.", options: ["Contents", "Cell contents", "Comments", "None of the above"], answer: 0 },
  { q: "Below the slide pane we get the ___________ Pane", options: ["Slide", "Outline", "File", "Notes"], answer: 3 },
  { q: "Below the slide pane we get the Outline Pane.", options: ["True", "False"], answer: 1 },
  { q: "Blank slides contain some default -------------- for inserting Text / Picture/Objects etc.", options: ["Dotted Lines", "Dotted Circle", "Dotted box", "Dots"], answer: 2 },
  { q: "Blank, Comparison, Title only etc. are the types of slide layouts in PowerPoint.", options: ["true", "false"], answer: 0 },
  { q: "Blinds, Honecomb, Cube, Doors are some of the Transition effects in PowerPoint.", options: ["true", "false"], answer: 0 },
  { q: "_____________ Is called as calculator of computer.", options: ["Microprocess or", "RAM", "ROM", "ALU"], answer: 3 },
  { q: "______________ is NOT a valid measurement unit of computer memory", options: ["KB", "MB", "GB", "VB"], answer: 3 },
  { q: "_______________ Allows to create a webpage with interactive content.", options: ["Java", "C", "HTML", "XML"], answer: 2 },
  { q: "_______________ contains deleted E-Mail", options: ["Compose", "Sent Mails", "Spam", "Trash"], answer: 3 },
  { q: "_______________ is a group of computers set up to communicate with one another", options: ["Social Networking", "Network", "A & B both", "None of above"], answer: 1 },
  { q: "____________ Is type of electronic device", options: ["Computer", "Laptop", "Mobile", "All Of Above"], answer: 3 },
  { q: "____________ Printer use ink ribbon.", options: ["Inkjet", "Dot Matrix", "Plotter", "Laser"], answer: 1 },
  { q: "____________ Printer use liquid ink.", options: ["Inkjet", "Character", "Plotter", "Laser"], answer: 0 },
  { q: "____________ Printer use toner.", options: ["Inkjet", "Character", "Plotter", "Laser"], answer: 3 },
  { q: "_____________ Are faster than micro computers", options: ["Mainframe Computer", "Mini Computer", "Micro Computer", "Hybrid Computers"], answer: 1 },
  { q: "_____tab is used for ruler show and hide", options: ["Data", "Formula", "View", "Insert"], answer: 2 },
  { q: "____Following option is not available in insert-picture.", options: ["Chart", "Graph", "Clipart", "word art"], answer: 1 },
  { q: "____indicates two lines of spacing in between two lines of text", options: ["1", "2.5", "2", "3"], answer: 2 },
  { q: "… .. Is a Paragraph Format in which the first line of the paragraph is started from outer side than other lines of paragraph.", options: ["Left Indent", "Right Indent", "Hanging Indent", "First Line Indent"], answer: 2 },
  { q: "… ...command facility is used to correct the common spelling mistakes.", options: ["Auto Text", "Auto Correct", "Auto Format", "None"], answer: 1 },
  { q: "By using ___________ Option we get the Printouts.", options: ["Preview", "Print", "Page Layout", "All of these"], answer: 1 },
  { q: "By using _____option, we can add the cell comments", options: ["contents", "Cell contents", "Comments", "None of the above"], answer: 2 },
  { q: "By using … … … … … … Command we can save the current workbook.", options: ["Open", "New", "Save", "Close"], answer: 2 },
  { q: "By using Exit option, what action is done in Excel", options: ["Quit Excel", "Open Excel", "Close file", "Open file"], answer: 0 },
  { q: "Open, Save ,Undo, Redo etc. options can be part of ?", options: ["review tab", "data tab", "Quick Access Toolbar", "Page layout tab"], answer: 2 },
  { q: "BMP means Bitmap Image", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Bullets option is available in ______ group in Powerpoint.", options: ["Clipboard", "Slides", "Paragraph", "Font"], answer: 2 },
  { q: "By default the font size of the Title Text box of Title slide is --------------", options: ["40", "44", "42", "43"], answer: 1 },
  { q: "By pressing __________________ key we can stop the running slide show.", options: ["Close", "Exit", "Escape", "None of these"], answer: 2 },
  { q: "By using exit option in PowerPoint, what action is performed?", options: ["Open PowerPoint", "Open a file in PowerPoint", "Exit PowerPoint", "None of these"], answer: 2 },
  { q: "_______________ Is Search Engine.", options: ["World Wide Web", "HTTP", "Google", "HTML"], answer: 2 },
  { q: "________________ allows the clients to share its recourses.", options: ["Server", "Client", "Modem", "None of above"], answer: 0 },
  { q: "________________ Browser is developed in Google Corporation.", options: ["Chrome", "Firefox", "Opera", "Internet Explorer"], answer: 0 },
  { q: "________________ Browser is developed in Microsoft Corporation.", options: ["Chrome", "Firefox", "Opera", "Internet Explorer"], answer: 3 },
  { q: "________________ is an E-Mail program.", options: ["MS Word", "Outlook express", "MS Excel", "MS Access"], answer: 1 },
  { q: "_____________ Are faster than mini computers.", options: ["Mainframe Computer", "Mini Computer", "Micro Computer", "Hybrid Computers"], answer: 0 },
  { q: "_____________ Device is used to scan images, printed text, handwriting from papers.", options: ["Keyboard", "Mouse", "Scanner", "All Of Above"], answer: 2 },
  { q: "_____________ is the microcomputer.", options: ["Desktop", "Handheld", "Laptop", "All of these"], answer: 3 },
  { q: "______________ Are characteristics of computer", options: ["Speed", "Accuracy", "Diligence", "All Of Above"], answer: 3 },
  { q: "______________ Are operating systems.", options: ["Windows", "Linux", "Mac Os", "All Of Above"], answer: 3 },
  { q: "… .Dialog box is displayed after clicking on save command in File menu when we try to save document first time", options: ["Print", "Open", "Save as", "Font"], answer: 2 },
  { q: "… … can be used to set margins and indents in Document.", options: ["Status area", "Ruler Line", "Status Bar", "Toolbar"], answer: 1 },
  { q: "… … . Bar is displayed in the bottom side of Microsoft word application window", options: ["Title Bar", "Status Bar", "Scroll Bar", "Format Bar"], answer: 1 },
  { q: "… … . layout view helps in understanding the position of the text matter on the page", options: ["update", "print", "insert", "delete"], answer: 1 },
  { q: "… … .. is the default number of lines to drop for drop cap.", options: ["3", "10", "15", "20"], answer: 0 },
  { q: "Can we save Excel file in Pdf?", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Cell Address / Cell Reference is the combination of Column Label and Row Number.", options: ["true", "false"], answer: 0 },
  { q: "Cell address contains column label and row number in MS Excel 2019", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Cell Address/Cell Reference is the combination of ________________", options: ["Column Label and Row Number.", "Row and column", "column Label", "Row Number"], answer: 0 },
  { q: "Cell addresses used in Formula are called as __________", options: ["Formulas", "Cell Reference", "Parameters", "Functionlist"], answer: 1 },
  { q: "Cannot insert table in Power Point Presentation", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "Changes made in _________ are applied to all the slides.", options: ["Main slide", "First Slide", "Slide Master", "Last Slide"], answer: 2 },
  { q: "Changes made in __________________ are applied to all slides.", options: ["First Slide", "Main Slide", "Last Slide", "Slide Master"], answer: 3 },
  { q: "Character Spacing option is available in ___________ group in PowerPoint", options: ["Clipboard", "Slides", "Font", "Paragraph"], answer: 2 },
  { q: "In PowerPoint we can apply your own backgroud styles using --", options: ["Insert - Background - Background styles", "Design - Background - Background Styles", "Insert - Background", "None of these"], answer: 1 },
  { q: "________________ is an internet search tool.", options: ["Gmail", "Facebook", "Chrome", "Gopher"], answer: 3 },
  { q: "________________ Is text which is automatically inserted at the bottom of every E-Mail.", options: ["Signature", "People widget", "People text", "Personal information"], answer: 0 },
  { q: "________________ is the powerful PC and data is stored in it.", options: ["Client", "Server", "Modem", "None of these"], answer: 1 },
  { q: "________________ system is use send electronic message.", options: ["E-mail", "Online service", "Voice mail messages", "Shared resources"], answer: 0 },
  { q: "__________________ is acronym for the address webpage.", options: ["LOC", "IPSA", "VRL", "URL"], answer: 3 },
  { q: "______________ Is not a characteristic of computer", options: ["Speed", "Accuracy", "Low Storage", "Ample Storage"], answer: 2 },
  { q: "_______________ Is placed at the bottom of screen on desktop.", options: ["Wallpaper", "Screen Saver", "Taskbar", "None Of Above"], answer: 2 },
  { q: "________________ Is character printer.", options: ["Plotter", "Laser", "Solid", "Dot Matrix"], answer: 3 },
  { q: "_________________ is type of optical Disk.", options: ["Floppy Disk Drive", "CD", "Hard disk", "Pen drive"], answer: 1 },
  { q: "______________Device is used to draw diagrams, lines, circles etc.", options: ["Keyboard", "Mouse", "Scanner", "All Of Above"], answer: 1 },
  { q: "… … .. tab is used to insert the shapes into the document.", options: ["Insert", "Tools", "File", "Design"], answer: 0 },
  { q: "… … .. tab is used to insert the wordart into the document.", options: ["Home", "Insert", "Data", "View"], answer: 1 },
  { q: "… … ... item is printed at the bottom of each page", options: ["Header", "Foot Note", "Title", "Footer"], answer: 3 },
  { q: "… … ..can be used to set margins and indents in Document", options: ["Ruler", "Status area", "status bar", "tool bar"], answer: 0 },
  { q: "… … ..option of table is used to arrange data in ascending order.", options: ["sort", "merge", "add", "None of these"], answer: 0 },
  { q: "Cell in MS Excel 2019 is a ____", options: ["intersection of only rows", "intersection of only columns", "intersection of rows and columns", "None of these"], answer: 2 },
  { q: "CELL is a information function", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Cell is the intersection of __________", options: ["two cells", "workbook", "worksheet", "row and column"], answer: 3 },
  { q: "Cell Pointer is the … … … … .. Border around the Active Cell.", options: ["Thin", "Thick", "Long", "Outside"], answer: 1 },
  { q: "Cell value typed in selected cell displayed in ________", options: ["Status Bar", "Formula Bar", "Title Bar", "None of these"], answer: 1 },
  { q: "Click on ............... option in slide group of Home Tab to create a new slide.", options: ["Slide Layout", "Transition", "Animation", "New Slide"], answer: 3 },
  { q: "Clip Art command is available in ___________ tab in PowerPoint", options: ["Home", "Insert", "Transition", "View"], answer: 1 },
  { q: "Clip Art Option is given in ___________ Tab.", options: ["Edit", "Insert", "View", "Window"], answer: 1 },
  { q: "Clipart option is given in Edit Tab.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "ClipArt option is given in Insert Tab.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "__________________ is the protocol, to transfer the data in the form of text", options: ["SMTP", "HTTP", "FTP", "PPPT"], answer: 1 },
  { q: "______________________ is used to search content online.", options: ["Social networks", "Search engine", "Screeners", "Routers"], answer: 1 },
  { q: "______________________ Is used to view deleted E-Mails.", options: ["Inbox", "Spam", "Trash", "Outbox"], answer: 2 },
  { q: "______________________ Is used to view received E-Mails.", options: ["Outbox", "Inbox", "Sent", "Spam"], answer: 1 },
  { q: "______________________ Is used to view sent E-Mails.", options: ["Sent Mails", "Spam", "Trash", "Inbox"], answer: 0 },
  { q: "_which is Email client software?", options: ["Chrome", "Internet Explorer", "Microsoft outlook", "Gopher"], answer: 2 },
  { q: "0' and '1' are part of ___________ system", options: ["Unary", "Binary", "Trinary", "None Of Above"], answer: 1 },
  { q: "0 or 1 called ---------", options: ["Bit", "Bytes", "Word", "Value"], answer: 0 },
  { q: "0 to 9 numbers are also called as ------------", options: ["Number keys", "Function Keys", "Alpha Keys", "Insert Keys"], answer: 0 },
  { q: "1 tb = ____________", options: ["100 Mb", "100 Gb", "1024 Mb", "1024 Gb"], answer: 3 },
  { q: "… … .tab is used for ruler show and hide", options: ["Data", "Formula", "View", "Insert"], answer: 2 },
  { q: "… … … group of insert ribbon you can create Smart Art Graphics.", options: ["Illustrations", "Pages", "Link", "Table"], answer: 0 },
  { q: "… … … . Is not a font face.", options: ["Bold", "Arial", "Calibri", "Times New Roman"], answer: 0 },
  { q: "… … … . Line spacing means between two lines there is the spacing of only one line.", options: ["1.0 (Single)", "1.5", "2.0 (Double)", "4"], answer: 0 },
  { q: "… … … .. Command is used to see two different parts of same document on screen.", options: ["Home Tab - Print Layout", "View Tab - Window Group - split", "Home Tab - Paragraph Group", "Insert Tab - Quick Parts"], answer: 1 },
  { q: "Cell value typed in Selected cell displayed in_____", options: ["Status Bar", "Formula Bar", "Title Bar", "None of these"], answer: 1 },
  { q: "Chart option is available in ____ in MS Excel 2019 .", options: ["Insert tab", "Home tab", "page layout tab", "view tab"], answer: 0 },
  { q: "Chart Option is Available in __________ Menu", options: ["View", "Insert", "Data", "Home"], answer: 1 },
  { q: "Ctrl + Pg Dn key combination can be used to go on the next sheet.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Ctrl + T is used for creating Table in Excel", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Close command will close only currently open presentation", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Closing and exiting in powerpoint are same", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "Comment command is available in ___________ tab in PowerPoint", options: ["Insert", "Review", "View", "Home"], answer: 1 },
  { q: "Convert to SmartArt command is available in ___________ group in PowerPoint", options: ["Font", "Paragraph", "Drawing", "Editing"], answer: 1 },
  { q: "Ctrl + D is shortcut key for", options: ["Delete", "Permanently Delete", "Duplicate Slide", "None of these"], answer: 2 },
  { q: "_______________connects the current page of Web Site to another specific page of Web Site.", options: ["Downloading", "Uploading", "Hyperlink", "Testing"], answer: 2 },
  { q: "_______________is NOT an image file format.", options: [".BMP", ".JPEG", ".GIF", ".CDR"], answer: 3 },
  { q: "______________is NOT an example of antivirus.", options: ["Quick Heal", "Net Protector", "C++", "Norton"], answer: 2 },
  { q: "_____________computers work on bits.", options: ["Analog", "Digital", "Virtual", "Rational"], answer: 1 },
  { q: "_____________is an application software.", options: ["Windows", "Linux", "Unix", "Spreadsheet"], answer: 3 },
  { q: "1 tb = … … … … … …", options: ["100 Mb", "100 Gb", "1024 Mb", "1024 Gb"], answer: 3 },
  { q: "1 Byte = ____ Bits", options: ["2", "4", "8", "12"], answer: 2 },
  { q: "1 gb = … … … … … …", options: ["1000 Bits", "1024 Bits", "1024 Mb", "1024 Tb"], answer: 2 },
  { q: "1 Gigabyte = ________", options: ["1000 Kilo Byte", "1024 Mega Byte", "1024 Tera Byte", "1024 Bytes"], answer: 1 },
  { q: "For protection of computer from virus ------- program should be used.", options: ["Anti Virus", "Virus", "Memory", "HDD"], answer: 0 },
  { q: "… … … .. group in Home tab is useful for changing font,font size of selected matter.", options: ["fontstyle", "size", "Fontsize", "Font"], answer: 3 },
  { q: "… … … .. Tab in MSWord can be used to change character size and typeface?", options: ["View", "Tools", "Format", "Data"], answer: 2 },
  { q: "… … … … . Number of minimum lines you can Drop in Drop Cap option .", options: ["1", "3", "4", "5"], answer: 1 },
  { q: "… … … … . Shortcut key is used to paste a matter in MS-WORD", options: ["Ctrl + V", "Alt + V", "Ctrl + C", "Ctrl + D"], answer: 0 },
  { q: "… … … … .. Is containing of Rows and columns.", options: ["Table", "Border", "Text Box", "Rectangle"], answer: 0 },
  { q: "Custom Series Option is used to make Series of Data.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Custom View option is available in____", options: ["View", "Review", "open", "Home"], answer: 0 },
  { q: "DB is financial function.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Default file name in Excel workbook is", options: ["Document1", "File1", "Book1", "None of these"], answer: 2 },
  { q: "Delete Sheet Command is given in _________ Tab - Cells group.", options: ["File", "View", "Home", "Tools"], answer: 2 },
  { q: "Ctrl+D is a shortcut key of _________", options: ["Creating a duplicate object", "Changing the layout of the active", "Deleting a slide from the presentation", "Inserting a new Slide"], answer: 0 },
  { q: "Ctrl+M is used to insert a new ___________", options: ["Letter", "Presentation", "Document", "Slide"], answer: 3 },
  { q: "Data consisting of comparison chart can be presented in _________ slide.", options: ["Title only", "Title & content", "Two content", "Comparison"], answer: 3 },
  { q: "Data consisting of lists/ bullets can be presented in _________ slide.", options: ["Title only", "Title & content", "Two content", "Table"], answer: 2 },
  { q: "Data consisting of text and numbers are best represented using ____ slide.", options: ["Table slide", "Title slide", "Comparison slide", "None of these"], answer: 0 },
  { q: "_____________is measured in pixels.", options: ["Computer memory", "Speed of RAM", "Size of CPU", "Screen resolution"], answer: 3 },
  { q: "_____________is NOT a function of Operating System.", options: ["Hardware Management", "Memory Management", "File Management", "Checking error in a program"], answer: 3 },
  { q: "____________is an internal memory.", options: ["CD", "RAM", "DVD", "Flash Drive"], answer: 1 },
  { q: "___________files can not be edited.", options: ["PDF", "MS-Word", "MS-Excel", "MS-PowerPoi nt"], answer: 0 },
  { q: "___________is NOT an operating system.", options: ["Linux", "Unix", "Mac", "Java"], answer: 3 },
  { q: "1 KB = ________ Bytes", options: ["100", "1000", "1024", "1048"], answer: 2 },
  { q: "1 kb = __________", options: ["1024 Bytes", "512 Bytes", "1024 Mb", "None of these"], answer: 0 },
  { q: "1 kb = … … … … …", options: ["1024 Bytes", "512 Bytes", "1024 Mb", "None Of Above"], answer: 0 },
  { q: "1 mb = ___________", options: ["100 Bytes", "1024 Kb", "1000 Bytes", "None of these"], answer: 1 },
  { q: "1 Megabyte = ________", options: ["1024 Kilo Byte", "1000 Kilo Byte", "1022 Kilo Byte", "1024 Bits"], answer: 0 },
  { q: "… … … … … Command is used to see two different parts of same document on screen.", options: ["View Tab → Window group → split", "Home Tab → Paragraph group", "Quick Parts", "Insert Tab"], answer: 0 },
  { q: "… … … … … … .. Is type of Application Software", options: ["Windows", "Ms-Word", "Dos", "Unix"], answer: 1 },
  { q: "… … … … … … … … . is the shortcut-key for manual line break.", options: ["CTRL + Enter", "Alt + Enter", "Shift + Enter", "Space + Enter"], answer: 2 },
  { q: "… … … … … … … … . Can be used to set margins and indents in Document.", options: ["Status Area", "Ruler Line", "Status bar", "Toolbar"], answer: 1 },
  { q: "If you what first character large than other words in a document … … .effect used", options: ["Capital case", "drop cap", "change case", "font case"], answer: 1 },
  { q: "Delete sheet Command is given in _________tab.", options: ["File", "View", "Home", "Tools"], answer: 2 },
  { q: "Delete Sheet Command is given in Home … … … .. Group.", options: ["Tab Cells", "Editing", "Number", "Font"], answer: 0 },
  { q: "Descending Sorting means … … … … … … … . Sorting", options: ["A to z", "Z to A", "Both A & B", "None of the above"], answer: 1 },
  { q: "Doughnut is one of the type of _________ in Excel.", options: ["Picture", "Symbol", "Chart", "None of these"], answer: 2 },
  { q: "Doughnut is one of the type of chart in Excel", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Default name of presentation is", options: ["Document 1", "Workbook 1", "Presentation1", "None of these"], answer: 2 },
  { q: "Default Orientation in PowerPoint is", options: ["Portrait", "Landscape", "Horizontal", "None of these"], answer: 1 },
  { q: "Default zoom available in PowerPoint is", options: ["0.5", "1", "1.5", "Fit to Window"], answer: 3 },
  { q: "Design and Layout are given to the slides according to __________ selected", options: ["Template", "Page", "Picture", "Chart"], answer: 0 },
  { q: "Design and Layout Theme are given to the slides according to Template selected.", options: ["true", "false"], answer: 0 },
  { q: "___________means set of instructions given to the computer.", options: ["software", "Hardware", "Program", "Process"], answer: 2 },
  { q: "__________is a valid file extension of image.", options: [".AVI", ".JPEG", ".MPEG", ".MIDI"], answer: 1 },
  { q: "__________is another format similar to PDF.", options: ["XML", "XHTML", "XPS", "Xreader"], answer: 2 },
  { q: "_________is a characteristic of a computer.", options: ["Tiredness", "Less storage", "Inaccurate", "Automation"], answer: 3 },
  { q: "_________is NOT a gadget provided by Windows 10.", options: ["Calendar", "Clock", "Currency", "MS-Word"], answer: 3 },
  { q: "1024 bytes = … … … … … …", options: ["1 Kb", "1 Mb", "1 Gb", "1 Tb"], answer: 0 },
  { q: "1024 GB = 1 _____________", options: ["Terabyte", "Gigabyte", "Megabyte", "Kilobyte"], answer: 0 },
  { q: "1024 kb = ___________", options: ["1 Kb", "1 Mb", "1 Gb", "1 Tb"], answer: 1 },
  { q: "1024 kilobyte = _____________", options: ["1 Kilobyte", "1 Megabyte", "1 Gigabyte", "1 Terabyte"], answer: 1 },
  { q: "1024 mb = _____________", options: ["1 Kb", "1 Mb", "1 Gb", "1 Tb"], answer: 2 },
  { q: "… … … … … … … … .. is not a type of page margin.", options: ["Left", "Right", "Center", "Top"], answer: 2 },
  { q: "… … … … … … option will be used for desired type of the Drop Cap.", options: ["cap", "Drop", "Caption", "Drop Cap"], answer: 3 },
  { q: "… … … … means readymade formats provided by words.", options: ["WordArt", "font styles", "Font size", "Template"], answer: 3 },
  { q: "… … … … tab group is useful for changing font,font size of the selected matter.", options: ["Home", "Insert", "View", "Data"], answer: 0 },
  { q: "… … … application software is used for word processing", options: ["MS-Word", "MS-Excel", "MS-Powerpoin t", "All of these"], answer: 0 },
  { q: "Each Excel file is called a Workbook because ___________", options: ["It contains Text and Data", "It can be modified", "It can contain Many Sheets", "User has to work hard to create it"], answer: 2 },
  { q: "Each row in Excel has given one Number.", options: ["true", "false"], answer: 0 },
  { q: "Each row in Excel has given one ______________", options: ["Number", "Character", "Picture", "Icon"], answer: 0 },
  { q: "Every Worksheet has vertical and horizontal lines called … … … … … … .", options: ["Cell", "Pixel", "Table", "Grid"], answer: 3 },
  { q: "Page break is viewed in ___________ MS-Excel .", options: ["Normal", "Page Break Preview", "Print Break Preview", "Form"], answer: 1 },
  { q: "Design/ Transition/ Animations/ Slide show tabs are available in __________", options: ["MS-Word", "MS-Excel", "MS-PowerPoi nt", "MS-Access"], answer: 2 },
  { q: "Each entity (page) of PowerPoint is referred as __________", options: ["Slide", "Page", "Sheet", "None of these"], answer: 0 },
  { q: "Exit command is used to __________ a presentation.", options: ["close", "open", "create", "edit"], answer: 0 },
  { q: "Exit command will close all open presentation", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "F1 Function key is used to __________ in PowerPoint", options: ["Add slide", "start slide show", "Display help", "delete slide"], answer: 2 },
  { q: "_________Shortcut key is used to stop loading of webpage in Internet Explorer", options: ["Tab", "Esc", "Ctrl", "Shift"], answer: 1 },
  { q: "_______are also called as personal computers.", options: ["Super Computers", "Mainframe Computers", "Mini Computers", "Micro Computers"], answer: 3 },
  { q: "… .. Is the by default Web browser of Microsoft Company", options: ["Internet Explorer", "Netscape Navigator", "Mozilla Firefox", "Google Chrome"], answer: 0 },
  { q: "… … . Is one of example of Social Network Service", options: ["Facebook", "Twitter", "Whatsapp", "All of the above"], answer: 3 },
  { q: "… … . Protocol is used to transfer the information of web pages on www.", options: ["HTTP", "FTP", "TCP/IP", "None of these"], answer: 0 },
  { q: "1024 MB = 1 - _______________", options: ["KB", "GB", "TB", "MB"], answer: 1 },
  { q: "1024 Mega Byte = 1 _________", options: ["Kilo Byte", "Yotta Byte", "Tera Byte", "Giga Byte"], answer: 3 },
  { q: "A folder can contain _____", options: ["Files", "Folder", "Both A and B", "None of above"], answer: 2 },
  { q: "A Internet is a combination of ______", options: ["website", "Sub network", "pictures", "protocol"], answer: 0 },
  { q: "A taskbar _______________", options: ["cannot be locked", "can be locked", "can be deleted", "None of above"], answer: 1 },
  { q: "… … … are the filter option", options: ["AutoFilter", "CustomerFilt er", "AdvanceFilter", "All the above"], answer: 3 },
  { q: "… … … bar displays name of document with program name", options: ["Menu", "Task", "Title", "status"], answer: 2 },
  { q: "… … … is the shortcut key for closing document in MS-Word", options: ["CTRL+A", "CTRL+Z", "CTRL+Y", "CTRL+W"], answer: 3 },
  { q: "… … … is used for performing menu operations through GUI", options: ["Toolbar", "Taskbar", "Stock chart", "None of these"], answer: 0 },
  { q: "… … … press when help dialog box is appear", options: ["F4", "F3", "F1", "F2"], answer: 2 },
  { q: "Excel file Extension XLSX means _____________", options: ["Microsoft Excel Workbook", "Microsoft Excel Template", "Web Page", "Microsoft Office Workplace"], answer: 0 },
  { q: "Excel is generally used for data analysis in offices.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Excel is not generally used for data analysis in offices.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "File name of current sheet is shown on ___________________", options: ["Reference Area", "Title Bar", "Page", "On Cell"], answer: 1 },
  { q: "Fill Command is provided in _________ Tab", options: ["Home", "Tools", "File", "Format"], answer: 0 },
  { q: "F5 function key is used to __________ in PowerPoint", options: ["Add slide", "start slide show", "Delete slide", "end slide show"], answer: 1 },
  { q: "Fade is a ____________ effect in PowerPoint", options: ["Background", "Action", "Animation", "Slide"], answer: 2 },
  { q: "File name is displayed at _______ in PowerPoint.", options: ["Menu Bar", "Status Bar", "Ribbons", "Title Bar"], answer: 3 },
  { q: "Files of MS PowerPoint are called as ____________", options: ["Document", "Spreadsheet", "File", "Presentation"], answer: 3 },
  { q: "Fill Color is under ____________ Tab in PowerPoint", options: ["Home", "Insert", "Design", "Review"], answer: 0 },
  { q: "… … .. is a worldwide system of network.", options: ["LAN", "Internet", "World Wide Web", "Cyberspace"], answer: 1 },
  { q: "… … .. Key is used to see the list of the Typed Internet Addresses", options: ["F1", "F2", "F3", "F4"], answer: 3 },
  { q: "… … … is brain of a computer system.", options: ["CPU", "Input Unit", "Output Unit", "Memory Unit"], answer: 0 },
  { q: "… … … . is a world Wide system of network.", options: ["LAN", "Cyberspace", "World Wide Web", "Intercom"], answer: 2 },
  { q: "… … … .. Is a free Email program that you can access from any web browser.", options: ["Yahoo Mail", "Rediff Mail", "Hot Mail", "All of the above"], answer: 3 },
  { q: "A to Z characters are also called as ____________", options: ["Number keys", "Function Keys", "Alpha Keys", "Insert Keys"], answer: 2 },
  { q: "A Web page means Collection of Information.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Accuracy is one of the characteristics of computer", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Actual data processing is done by _________ unit of computer", options: ["Control", "Input", "Output", "Arithmetic & Logical"], answer: 3 },
  { q: "All programs can be started from ___________ menu.", options: ["Start", "Main", "Functional", "None Of Above"], answer: 0 },
  { q: "… … … view helps to set outline of current document", options: ["Page Layout", "outline view", "normal", "web layout"], answer: 1 },
  { q: "… … indicates two lines of spacing in between two lines of text", options: ["1", "2.5", "2", "3"], answer: 2 },
  { q: "A file which is open can be closed with the _____ command from the File Menu", options: ["menu", "close", "title", "None of these"], answer: 1 },
  { q: "A file which is open can be closed with the _____command", options: ["open", "delete", "close", "Esc"], answer: 2 },
  { q: "A number of letter that appears little below the normal text is called _______", options: ["Toptext", "Superscript", "Subscript", "Supertext"], answer: 2 },
  { q: "For Normal Arial Font, Row height is ____ points by default", options: ["10", "11", "15", "14"], answer: 2 },
  { q: "Formula can be use for _____________ In Excel.", options: ["Mathematical Calculations", "Addition", "Subtractions", "Multiplications"], answer: 0 },
  { q: "Formula means instruction to perform ___________", options: ["Addition", "Substruction", "Multiplication", "Calculation"], answer: 3 },
  { q: "Function always starts with __________ Symbol.", options: ["*", "?", "!", "="], answer: 3 },
  { q: "Functions means inbuilt formula basically available in _____________", options: ["MS-Word", "MS-Excel", "MS-PowerPoi nt", "None of these"], answer: 1 },
  { q: "Fly from left Bottom is ________ effect.", options: ["Animation", "Action", "Background", "None of the above"], answer: 0 },
  { q: "Fly in is a ___________ effect in PowerPoint.", options: ["Action", "Animation", "Background", "None of these"], answer: 1 },
  { q: "Fly through is a ____________ effect in PowerPoint.", options: ["Animation", "Action", "Background", "Slide"], answer: 0 },
  { q: "Following slides are present in PowerPoint.", options: ["Title", "Blank", "Two content", "All of these"], answer: 3 },
  { q: "Font color of text in a slide can be changed using font color command from ______ tab.", options: ["Insert", "Home", "View", "Review"], answer: 1 },
  { q: "… … … .. Is a Microsoft's web browser that installs with windows by default.", options: ["Windows Explorer", "Navigator", "File Manger", "Internet Explorer"], answer: 3 },
  { q: "… … … .. Is an example of hardware.", options: ["Compiler", "Interpreter", "Program", "Floppy Drive"], answer: 3 },
  { q: "… … … … .are used for Engineering drawing, maps etc.", options: ["Inkjet printers", "Plotters", "Dot Matrix Printers", "Laser Printers"], answer: 1 },
  { q: "… … … … .software are used to perform a specific task.", options: ["System", "Application", "Virtual", "Compiler"], answer: 1 },
  { q: "… … … … … .. Is an example of programming language.", options: ["Binary", "Java", "Bite Code", "Bit Code"], answer: 1 },
  { q: "Alphanumeric keys contains - ________________", options: ["Letter", "Numbers", "Letter & Numbers", "Letters, Numbers & Special Characters"], answer: 3 },
  { q: "Alt & Ctrl keys are _______________________ __", options: ["Function keys", "Option Keys", "Combination Keys", "All of these"], answer: 2 },
  { q: "Alt + F4 can be used for ------------", options: ["Open a File", "Open Program", "Close active Item or Active file", "None of above"], answer: 2 },
  { q: "Alu means _________", options: ["Automatic Logic Unit", "Arithmatic Long Unit", "Arithmatic And Logical Unit", "None of these"], answer: 2 },
  { q: "ALU stands for Arithmetic & Logic Unit", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "A selected text that is raised above the baseline is known as_____", options: ["Raised", "Outlined", "Capscript", "Superscript"], answer: 3 },
  { q: "A smallest item of information about a record is_____", options: ["Row", "Column", "Field", "None of these"], answer: 2 },
  { q: "A thick border around the active cell is called____", options: ["Cell pointer", "selection", "Border", "Outline"], answer: 0 },
  { q: "After clicking on Header and Footer we can edit it.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "After Clicking on Header and Footer we can't edit it.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "Grids has vertical and horizontal lines", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Grids on worksheet in MS Excel 2019 are ___", options: ["vertical and horizontal lines", "images", "graphs", "None of these"], answer: 0 },
  { q: "Group of selected cell is called as______________", options: ["Cell Range", "Row", "Column Width", "Table"], answer: 0 },
  { q: "Hard Copy is the … … … ..", options: ["soft copy", "Printed Version of worksheet", "Both A & B", "None of the above"], answer: 1 },
  { q: "Header and Footer is Used to print common text on each page.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "For getting Microsoft PowerPoint Help one can use shortcut key ----------", options: ["F1", "F2", "F3", "F4"], answer: 0 },
  { q: "For rehearsal of presentation ___________ command can be used", options: ["Slide Show", "Custom Slide Show", "Rehearse Timing", "All of these"], answer: 2 },
  { q: "For running slide show we can use the shortcut key ---------------", options: ["F4", "F6", "F5", "F7"], answer: 2 },
  { q: "Format Painter command is available in ___________ group in PowerPoint", options: ["Clipboard", "Slides", "Font", "Paragraph"], answer: 0 },
  { q: "Frequently used commands like New, Save, Undo, Redo etc. are present on Quick Access Toolbar.", options: ["true", "false"], answer: 0 },
  { q: "… … … … … .. Unit controls all parts of a computer.", options: ["Input", "Output", "Control", "Memory"], answer: 2 },
  { q: "… … … … … ..means set of instructions given to the computer.", options: ["software", "Hardware", "Program", "Process"], answer: 2 },
  { q: "… … … … … ..means unprocessed information.", options: ["Set", "Data", "Collection", "Program"], answer: 1 },
  { q: "… … … … … .files can not be edited.", options: ["PDF", "MS-Word", "MS-Excel", "MS-PowerPoi nt"], answer: 0 },
  { q: "… … … … … … is NOT an example of Operating system", options: ["Windows 10", "DOS", "Unix", "Norton"], answer: 3 },
  { q: "An internet mail message has ______ parts", options: ["2", "3", "4", "5"], answer: 0 },
  { q: "Analytical engine could perform______", options: ["Graphics", "Calculations", "Multimedia", "None of these"], answer: 1 },
  { q: "ANSI stands for", options: ["All New Small Integration", "A national Small Institutes", "American National Standard Institute", "None of these"], answer: 2 },
  { q: "Arithmetical process on information provided by input unit is done by --------- unit", options: ["Arithmetic & Logic", "Logic", "Control", "Output"], answer: 0 },
  { q: "Arrow keys is also called as ___________", options: ["Combination", "Navigation", "Addition", "Changing"], answer: 1 },
  { q: "After clicking on______in document resizing handles are appeared around it", options: ["Picture", "Paragraph", "text", "scroll bar"], answer: 0 },
  { q: "After Clicking with mouse on top area of column in Table ___________ Will get selected.", options: ["Row", "Column", "Cell", "Table"], answer: 1 },
  { q: "All the letters of selected matter are converted to small cases with____", options: ["Upper case", "Lower case", "Toggle case", "change case"], answer: 1 },
  { q: "Alt+___ used for to close the active window.", options: ["F1", "F4", "F3", "F5"], answer: 1 },
  { q: "Alt+P key is used for____", options: ["View tab active", "home tab active", "Page Layout Tab Active", "Data tab Active"], answer: 2 },
  { q: "Help option is available in _________ Menu", options: ["Insert", "File", "View", "Tools"], answer: 1 },
  { q: "How many kinds of Alignment are available in MS-Excel.", options: ["3", "5", "6", "4"], answer: 2 },
  { q: "How many types of Orientation are available in MS-Excel?", options: ["One", "Two", "Three", "Four"], answer: 1 },
  { q: "How many types of horizontal alignments are possible in MS Excel 2019 ?", options: ["4", "3", "2", "horizontal alignments can not be done"], answer: 1 },
  { q: "How many types of vertical alignments are possible in MS Excel 2019 ?", options: ["1", "2", "3", "4"], answer: 2 },
  { q: "From following which is not Presentation view?", options: ["Normal", "Slide Master", "Slide Sorter", "Notes Page"], answer: 1 },
  { q: "From which menu you can access picture, Chart, Clip art etc. in PowerPoint?", options: ["View", "Design", "Home", "Insert"], answer: 3 },
  { q: "From which tab we can insert a audio?", options: ["Home", "View", "Insert", "Review"], answer: 2 },
  { q: "From which tab we can insert a SmartArt?", options: ["Insert", "Home", "View", "Review"], answer: 0 },
  { q: "From which tab we can insert a video?", options: ["Home", "Insert", "Review", "View"], answer: 1 },
  { q: "… … … … … … .. Software is a software that basically makes the computer work.", options: ["System", "Application", "Virtual", "Compiler"], answer: 0 },
  { q: "… … … … … … ..is an application software.", options: ["Windows", "Linux", "Unix", "Spreadsheet"], answer: 3 },
  { q: "… … … … … … ..is measured in pixels.", options: ["Computer memory", "Speed of RAM", "Size of CPU", "Screen resolution"], answer: 3 },
  { q: "… … … … … … .computers work on bits.", options: ["Analog", "Digital", "Virtual", "Rational"], answer: 1 },
  { q: "25MB attachment can be send through ____", options: ["Gmail", "Google", "Word", "PowerPoint"], answer: 0 },
  { q: "Arrow keys is also called as Navigation Keys", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Arrow keys on keyboard are called as … … … …", options: ["Toggle Keys", "Navigation Keys", "Numeric Keypad", "None Of Above"], answer: 1 },
  { q: "Artificial intelligence is incorporated in ______________", options: ["Second Generation", "Third Generation", "Fourth Generation", "Fifth Generation"], answer: 3 },
  { q: "Automation is one of the characteristics of computer", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Backspace key is used ________", options: ["Delete Text", "Add Text", "Pause Test", "Insert Test"], answer: 0 },
  { q: "Any information that gets from page bottom is called____", options: ["End note", "Foot note", "Header", "footer"], answer: 1 },
  { q: "Arial, Times New Roman are the examples of ___", options: ["Word Art", "Font Styles", "Indents", "None of these"], answer: 3 },
  { q: "At the bottom of the Ms-Word we can see a______strip", options: ["vertical", "rectangular", "horizontal", "None of these"], answer: 2 },
  { q: "Background color or effects applied on a document is not visible in … … … .. Preview.", options: ["Reading View", "Print Layout view", "Web layout view", "Print Preview"], answer: 3 },
  { q: "Basic shapes comes under______tab", options: ["Review", "View", "Insert", "Page Layout"], answer: 2 },
  { q: "Hyperlink is used to create link the sheet", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "IF is a database function.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "IF is not a logical function", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "If we increase the height of the row, the text matter automatically gets shifted to the ____ of the Cell", options: ["Bottom", "Middle", "Up", "Down"], answer: 0 },
  { q: "if you want to sort data after selecting it in MS Excel 2019 _______ is correct option", options: ["page layout tab and click on sort", "click on view tab -> sort button", "data tab -> sort", "insert tab -> sort and filter"], answer: 2 },
  { q: "From which tab you can access the slides layout?", options: ["File", "Insert", "Home", "View"], answer: 2 },
  { q: "Group command is available in ___________ group in PowerPoint", options: ["Font", "Paragraph", "Drawing", "Editing"], answer: 2 },
  { q: "Guides command is chosen in the ................... Tab to display Guides", options: ["View", "File", "Slide Show", "Window"], answer: 0 },
  { q: "Header and Footer are not available in PowerPoint", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "Header and Footer are visible on each slide in PowerPoint", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "8 bits= ____________", options: ["1 Byte", "1024 Bytes", "4 Bytes", "1 Kilobytes"], answer: 0 },
  { q: "A ______ is a program that provides tools for accessing web sites.", options: ["MS Word", "www", "Web Browser", "Photoshop"], answer: 2 },
  { q: "A broadband connection is considered as \"Always On\" connection", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "A computer monitor is made up of _________________", options: ["Register", "Microprocess or", "Cathode Ray Tube", "Transistor"], answer: 2 },
  { q: "A computer on internet are identified by …", options: ["email address", "street address", "IP Address", "None of the above"], answer: 2 },
  { q: "Baud Rate is measured in ____________", options: ["Bits per second", "Bytes pe Second", "Bits per minute", "Bytes per minute"], answer: 0 },
  { q: "Binary coding system consist of _________", options: ["1 - 100", "0 and 1", "Alphabets", "Both alphanumeric"], answer: 1 },
  { q: "BMP means ---------", options: ["Bit files", "Byte Files", "Bitmap Files", "Bios Files"], answer: 2 },
  { q: "box containing _______ is called as cabinet.", options: ["UPS", "CPU", "SMPS", "HDD"], answer: 1 },
  { q: "Cache Memory is a Temporary Memory", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Below the Ruler Line, we can get a white colored rectangular area. This area called … … … … .", options: ["Page Area", "Status bar", "Title Bar", "Menu Bar"], answer: 0 },
  { q: "Bold, Italic, Regular are known as", options: ["Font Styles", "Font Effects", "Word Art", "Text Effects"], answer: 0 },
  { q: "Border and shading is used to set text as a list", options: ["True", "False"], answer: 1 },
  { q: "Borders can be applied for _______________", options: ["Cells", "Paragraph", "Text", "All of these"], answer: 3 },
  { q: "By default _____ line not shown on the screen", options: ["scale", "ruler", "top", "None of these"], answer: 1 },
  { q: "If you want to sort data after selecting it in MS Excel 2019 which of the following is correct option ?", options: ["page layout tab and click on sort", "right click on cell -> sort", "review tab -> sorting data", "click on view tab -> sort button"], answer: 1 },
  { q: "IF() function is used to place data according to any condition.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "In MS Excel 2019 the font color option in font group can change ___", options: ["only cell border color", "only cell background color", "color of text and its underline", "only text color"], answer: 2 },
  { q: "In MS Excel 2019 which group contains the \"clear\" option ?", options: ["alignment group", "cells group", "editing group", "Styles group"], answer: 2 },
  { q: "In MS Excel 2019 which group contains the AutoSum option ?", options: ["alignment group", "cells group", "editing group", "Styles group"], answer: 2 },
  { q: "Header and Footer command is available in ___________ tab in PowerPoint", options: ["Home", "Insert", "Transition", "View"], answer: 1 },
  { q: "Header and Footer options are given in __________ tab.", options: ["Windows", "Insert", "Slide Show", "Format"], answer: 1 },
  { q: "How can you insert bar graph in a presentation?", options: ["Insert=> Chart => Bar", "Insert=>Imag e", "Edit=>Image", "Edit=>Chart"], answer: 0 },
  { q: "How can you see all your chart at once?", options: ["through slide view", "through reading view", "through slide sorter view", "through normal view"], answer: 2 },
  { q: "How do you identify that a placeholder is active to type text?", options: ["the object is highlighted", "The object is not highlighted", "The object is deleted", "The object is replaced"], answer: 0 },
  { q: "A domain name ending with \".gov\" is ____________", options: ["Educational Web Site", "Government Web Site", "Network Web Site", "Military Web Site"], answer: 1 },
  { q: "A domain name ending with \".org\" is ____________", options: ["A network site", "A commercial site", "An organization", "A government Site"], answer: 2 },
  { q: "A File download means moves a copy of file from _________", options: ["Web Site to computer", "Computer to Web Site", "Server to server", "Client to client"], answer: 0 },
  { q: "A File download means moves a copy of file on local host to remote host.", options: ["True", "False"], answer: 1 },
  { q: "A file having .JPG extension represents … … … … … … … ..file.", options: ["Audio", "Portable Document Format", "Video", "Image"], answer: 3 },
  { q: "Cache Memory is known as _______ memory in computer.", options: ["Temporary", "Processor", "Flash", "Permanent"], answer: 0 },
  { q: "Calculator like number keys on keyboard are called as … … … … … .", options: ["Toggle Keys", "Navigation Keys", "Numeric Keypad", "None Of Above"], answer: 2 },
  { q: "Capacity of ____________ is less as compared to mainframe computers.", options: ["Hybrid Computers", "Mini Computer", "Micro Computer", "Super Computer"], answer: 1 },
  { q: "Capacity of cd is __________", options: ["100 Mb", "700 Mb", "2 Gb", "None Of Above"], answer: 1 },
  { q: "Capacity of dvd is __________", options: ["700 Mb", "4.7 Gb", "10 Gb", "None Of Above"], answer: 1 },
  { q: "By default page orientation in word is______", options: ["vertical", "landscape", "portrait", "horizontal"], answer: 2 },
  { q: "By default, on which page the header or the footer is printed?", options: ["On first page", "On alternate page", "On every page", "None of these"], answer: 2 },
  { q: "By using _____option we can see the size of the document on screen", options: ["Font", "zoom", "Height", "weight"], answer: 1 },
  { q: "By using word processors you can create ___________ Type of file", options: ["Presentation", "Database", "Document", "Worksheet"], answer: 2 },
  { q: "Calibri, Mangal are the examples of _______________", options: ["Word Art", "Font", "Font Style", "Indents"], answer: 1 },
  { q: "In MS Excel 2019 which group contains the cell styles option ?", options: ["alignment group", "cells group", "editing group", "Styles group"], answer: 3 },
  { q: "In MS Excel 2019 which group contains the conditional formatting option ?", options: ["alignment group", "Styles group", "cells group", "editing group"], answer: 1 },
  { q: "In MS Excel 2019 which group contains the copy, cut, paste options ?", options: ["font group", "clipboard group", "Styles group", "editing group"], answer: 1 },
  { q: "In MS Excel 2019 which group contains the format as a Table option ?", options: ["alignment group", "cells group", "editing group", "Styles group"], answer: 3 },
  { q: "In MS Excel 2019 which group contains the insert, delete and format options ?", options: ["alignment group", "Styles group", "cells group", "editing group"], answer: 3 },
  { q: "How many types of orientation are available in MS-PowerPoint", options: ["1", "2", "3", "4"], answer: 1 },
  { q: "How to create another copy of a slide?", options: ["Press Ctrl+A=> Paste in New slide", "Press Ctrl+A=> Ctrl+C=> Press Ctrl+V in new slide", "Press Ctrl+I=>Ctrl+V in new slide", "Press Ctrl+ C in new slide"], answer: 1 },
  { q: "Hyperlink command is available in ___________ tab in PowerPoint", options: ["Home", "Insert", "Transition", "View"], answer: 1 },
  { q: "Hyperlinks can be inserted in PowerPoint Presnetation.", options: ["false", "true"], answer: 1 },
  { q: "If the current slide gets full then new slide has to be inserted _______", options: ["Manually", "Automatically", "Directly", "None of these"], answer: 0 },
  { q: "A file having .MPEG extension represents Text file.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "A file having .PDF extension represents … … … … … … … ..file.", options: ["Portable Document Format", "Portable Directory Format", "Text", "Image"], answer: 0 },
  { q: "A letter of memo sent to a person or group on the internet___", options: ["Gmail", "Hotmail", "Yahoo mail", "All of above"], answer: 3 },
  { q: "A program used to access the internet is known as … … … ..", options: ["Web site", "Search Engine", "Browser", "Word Processor"], answer: 2 },
  { q: "A search engine is used to get ____________ from internet.", options: ["information", "Connection", "Files", "None of above"], answer: 0 },
  { q: "Caps Lock on means-", options: ["All text capital", "All text small", "Only first character capital", "Only first character small"], answer: 0 },
  { q: "CD & ---------- disk are example of optical disk", options: ["Floppy", "Hard Disk", "Pen Drive", "DVD"], answer: 3 },
  { q: "CD stands for ______", options: ["Circular Disk", "Compact Drive", "Circular Drive", "Compact Disc"], answer: 3 },
  { q: "Characteristic of artificial intelligence __________", options: ["Can Think", "Take Decisions", "Both A And B", "None Of Above"], answer: 2 },
  { q: "Characteristic of microprocessor __________", options: ["Very Fast", "Very Small In Size", "Both A And B", "None Of Above"], answer: 2 },
  { q: "Caps Lock On is used in Word for____", options: ["All text capital", "All text small", "Only first character capital", "Only first character small"], answer: 0 },
  { q: "Change the __________________ to create a document in wide format", options: ["Page Orientation", "Page margins", "Paper Style", "Paper Source"], answer: 0 },
  { q: "Change the … … … … … … … … ... to create a document in wide format", options: ["Page Orientation", "Page margins", "Paper Style", "Paper Source"], answer: 0 },
  { q: "Click _____button to clear all the Tabs from the Tab stops list", options: ["Clear", "Clear All", "delete", "cut"], answer: 1 },
  { q: "Clipart pane will appear on the_____side of the screen", options: ["Top", "center", "right", "Left"], answer: 2 },
  { q: "In MS Excel 2019 which group contains the sort & filter, find and select options ?", options: ["alignment group", "font group", "cells group", "editing group"], answer: 3 },
  { q: "In MS Excel 2019 which group contains the wrap text, merge and center options ?", options: ["alignment group", "font group", "cells group", "editing group"], answer: 0 },
  { q: "In a single worksheet we have _____________ Columns", options: ["16,384", "15,584", "13,384", "12,284"], answer: 0 },
  { q: "In a workbook default sheet names are displayed on _______________", options: ["Sheet panes", "Sheet cells", "Sheet Tab", "Sheet Templates"], answer: 2 },
  { q: "In a Worksheet, Actual Data is entered in ____________", options: ["Column", "Row", "Line", "Cell"], answer: 3 },
  { q: "If we want a slide show to run from the current slide then click ___________ button.", options: ["From beginning", "From current slide", "Run", "Start from beginning"], answer: 1 },
  { q: "If we want to run slide show from the first slide the steps we should follow are .................", options: ["F6 - slide show - start slide show - from beginning", "from beginning", "Slide show - from beginning", "Slide show - start slide show - from beginning"], answer: 3 },
  { q: "If you ____ a slide it will not be shown in the full screen slide show.", options: ["show", "close", "hide", "exit"], answer: 2 },
  { q: "If you do not wish to show particular slide in slide show, ___________ command can be used", options: ["Delete", "Hide", "Show", "None of Above"], answer: 1 },
  { q: "If you make the changes in _____ the changes apply to whole presentation.", options: ["Slide Show", "Slide sorter", "Slide Master", "None of the above"], answer: 2 },
  { q: "A search engine is used to get information from __________", options: ["Internet", "MS Office", "Browser", "Gmail"], answer: 0 },
  { q: "A search engine is used to get information from internet.", options: ["True", "False"], answer: 0 },
  { q: "A search tool is a program that finds _______________that match keywords that you enter.", options: ["Server", "Client", "Network", "Web Site"], answer: 3 },
  { q: "A search tool is a program that finds web sites, web pages and internet files that match keywords that you enter.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "A web page retrieved using a ____", options: ["HTML", "Modem", "MS Access", "Web Browser"], answer: 3 },
  { q: "Characteristic of transistors __________", options: ["Faster Than Vaccum Tubes", "Smaller In Size", "Both A And B", "None Of Above"], answer: 2 },
  { q: "CHARACTERISTRIC OF I.C. is that it __________", options: ["Bulky", "Slow", "Never Became Warm", "None of these"], answer: 2 },
  { q: "Charater Printer is also called as ____________", options: ["Ink Jet Priters", "Dot Matrix Priters", "Laser Printers", "Plotters"], answer: 1 },
  { q: "Collection of 1024 GB data means 1 ---------- Data.", options: ["Terabyte", "Gigabyte", "Kilobytes", "Bytes only"], answer: 0 },
  { q: "Collection of information stored in the computer is called as ____________", options: ["Note", "File", "Word", "None Of Above"], answer: 1 },
  { q: "Color and pattern used to fill a closed shape is called _____", options: ["Shape", "WordArt", "Fill Style", "Fill Back"], answer: 2 },
  { q: "control+home is used for Find and Replace", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "Copy and Paste operation can be used to move a block of text.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "Ctrl + A _______", options: ["Select All", "Align Right", "Align Left", "Change Font"], answer: 0 },
  { q: "Ctrl + B ______", options: ["Search the selected text", "Paste the selected text", "Open file", "Bold the selected text"], answer: 3 },
  { q: "In Excel Short Cut key for Redo is __________", options: ["Ctrl + Y", "Ctrl+ Z", "Ctrl + S", "Ctrl + X"], answer: 0 },
  { q: "In Excel _______ Is present by Default", options: ["Border", "Gridline", "Graph", "Filter"], answer: 1 },
  { q: "In Excel _____________ Means instruction to perform calculations.", options: ["Text", "Formula", "Number", "Cell Reference"], answer: 1 },
  { q: "In Excel __________________ Is not type of View.", options: ["Normal", "Page Layout", "Print Layout", "Custom"], answer: 2 },
  { q: "In Excel _________is not type of view", options: ["Normal", "Page Layout", "Print Layout", "Custom"], answer: 2 },
  { q: "If you want all the presentation to have same look then use _________", options: ["Outline View", "Reading View", "slide layout", "installed design template"], answer: 3 },
  { q: "Images cannot be deleted once added in a slide", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "In ---------------- view we can see only one slide at a time and can do editing in the same.", options: ["Slide Sorter", "Normal", "Outline View", "Slide Show"], answer: 1 },
  { q: "In ----------- we can do Rehearsal of the time required for each slide.", options: ["Set up show", "Slide Transition", "Rehearse Timings", "Custom Animation"], answer: 2 },
  { q: "In ................... we can see all the slides in the presentation file in thumbnail view.", options: ["Outline Pane", "Slides Pane", "Notes page", "Slide Sorter"], answer: 1 },
  { q: "A website is a complete collection of pages and folders.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Addition document included in an Email are commonly called … …", options: ["Postings", "Forums", "Attachments", "Links"], answer: 2 },
  { q: "All web addresses start with ____________", options: ["smtp://", "http://", "ftp://", "html://"], answer: 1 },
  { q: "All web addresses start with http://", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "ALU stands for ____________________", options: ["Arithmetic and Legal Unit", "Arithmetic and Logical Unit", "Addition Logic Unit", "None of these"], answer: 1 },
  { q: "Comparison process is done in _________ Operations.", options: ["Arithmetic", "Logical", "Binary", "Bits"], answer: 1 },
  { q: "Compressed files are required to _____________ before using.", options: ["Zip", "Decompress", "Both A And B", "None Of Above"], answer: 1 },
  { q: "Computer calculates numbers in binary number system", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Computer can be used for", options: ["Letter Typing", "Drawing", "Graphs Making", "All Of Above"], answer: 3 },
  { q: "Computer can have __________ storage", options: ["Small Data", "Ample Data", "Both A And B", "None Of Above"], answer: 1 },
  { q: "Ctrl + I is used for _____________", options: ["Italic", "Left Indent", "Save Document", "Close Document"], answer: 0 },
  { q: "Ctrl + J is used for ____________", options: ["Align Justify", "Insert Hyperlink", "Search", "Print"], answer: 0 },
  { q: "Ctrl + L means ______________", options: ["New Document", "Close Document", "Right Indent", "Left Alignment"], answer: 3 },
  { q: "Ctrl + R is used for ____________", options: ["Re-Open the last closed document", "Re-Print the last printed page", "Re-Apply the last paragraph formatting", "Right align the selected Paragraph"], answer: 3 },
  { q: "Ctrl + S _______", options: ["Print document", "Close document", "Save As", "Save document"], answer: 3 },
  { q: "In Excel … … … … … … . Means instruction to perform calculations.", options: ["Text", "Formula", "Number", "Cell Reference"], answer: 1 },
  { q: "In Excel … … … … … … … … … Is not type of View.", options: ["Normal", "Page Layout", "Print Layout", "Custom"], answer: 2 },
  { q: "In excel column are … … … … … …", options: ["Straight", "Curve", "Horizontal", "Shape"], answer: 2 },
  { q: "In Excel Ctrl + U Command is used for _____________", options: ["Bold", "Italic", "Underline", "Paste"], answer: 2 },
  { q: "In Excel Ctrl + X Command is used for _____________", options: ["Copy", "Cut", "Search", "Paste"], answer: 1 },
  { q: "In ....................... view you can rearrange the slides.", options: ["Slide Sorter View", "Slide Master", "Outline View", "None of Above"], answer: 0 },
  { q: "In ....................... view we can see only one slide at a time and can do editing in the same.", options: ["Slide Sorter", "Normal", "Outline View", "Slide Show"], answer: 1 },
  { q: "In ______ you can view the presentation with Transition and Animation effects.", options: ["Outline", "Slide Show", "Note Page", "Slide Sorter"], answer: 1 },
  { q: "In _________ view slide numbers gets displayed", options: ["Slide sorter", "Normal", "Reading", "Slide show"], answer: 0 },
  { q: "In _________ view you can rearrange the slides.", options: ["Slide Sorter View", "Slide Master", "Outline View", "None of these"], answer: 0 },
  { q: "An ______ Is a program that provides tools for accessing web sites.", options: ["Gmail", "Google Chrome", "Googletalk", "All of above"], answer: 1 },
  { q: "An internet address is called WWW", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "An ISP connects you to the internet.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Analog computers produce more accurate and faster results.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "Animation refers to a combination of text, graphics, sound animation and video.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "Computer can make mistake only if ___________ is wrong", options: ["Input", "Processor", "Ram", "None Of Above"], answer: 0 },
  { q: "Computer can perform following tasks", options: ["Data Entry Using Typing", "Save Data", "Internet Surfing", "All Of Above"], answer: 3 },
  { q: "Computer dosent get tired of _____________ work", options: ["Repeatative", "Monotonous", "Different", "All Of Above"], answer: 3 },
  { q: "Computer have _____________", options: ["Emotions", "Feelings", "Both A And B", "None Of Above"], answer: 3 },
  { q: "Computer is an ____________ device", options: ["Electric", "Electronic", "Mechanical", "None Of Above"], answer: 1 },
  { q: "Ctrl + U _________", options: ["Underline the previously deleted text", "Undo the last changes", "Underline the document name", "Underline the selected text"], answer: 3 },
  { q: "Ctrl + W is used for _________", options: ["Save and Print the Document", "Save and Close Word Application", "Close document", "Without Save, Close Document"], answer: 2 },
  { q: "Ctrl + X ________", options: ["Cut", "Home", "Copy", "Paste"], answer: 0 },
  { q: "Ctrl + Y ________", options: ["Undo the last action", "Redo the last action", "add a new page", "Paste"], answer: 1 },
  { q: "Ctrl + Z ________", options: ["Undo the last action", "Redo the last action", "add a new page", "Paste"], answer: 0 },
  { q: "In Excel Cut option is used to _________", options: ["Copy and Paste", "cut and paste", "Cut", "New"], answer: 2 },
  { q: "In Excel Default Alignment are _______________", options: ["Both Numbers and Text on Left", "Both Numbers and Text on Right", "Numbers on Right and Text on Left", "Numbers on Left and Text on Right"], answer: 2 },
  { q: "In Excel Default Column Width is ____________", options: ["8.43 points", "12.65 points", "6.75 points", "2.25 points"], answer: 0 },
  { q: "In Excel Default Row Height is _______", options: ["25 picos", "15 points", "5 cm", "1\""], answer: 1 },
  { q: "In Excel Format Painter is used to copy the Format and paste the format in Desired Cell of text", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "In __________ view at a time only one slide is shown.", options: ["Normal", "Reading", "Outline", "Notes"], answer: 0 },
  { q: "In __________ view sequence of slides can be changed.", options: ["Reading", "Normal", "Slide sorter", "Outline"], answer: 2 },
  { q: "In __________ we can do Rehearsal of the time required for each slide.", options: ["Set Up Show", "Rehearse Timings", "Slide Transition", "Custom Animation"], answer: 1 },
  { q: "In __________________ we can see all the slides in the presentation file in thumbnail view.", options: ["Outline Pane", "Slides Pane", "Notes page", "Slide Sorter"], answer: 1 },
  { q: "In a PowerPoint presentation___", options: ["Sound clips can be inserted but not movie clips", "Movie clips can be inserted but not sound clips", "Both cannot be inserted", "Both can be inserted"], answer: 3 },
  { q: "Any unwanted or unsolicited Email is spam", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Assembly Language is a low level programming language.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "ATM Centers system works entirely on Mobile", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "ATM Centers system works on Internet", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Attachment buttons show __________ icon on it.", options: ["U pin", "M Pin", "N pin", "W Pin"], answer: 0 },
  { q: "Computer is basically divided into ___________ and ____________", options: ["Hardcopy, Softcopy", "Hardware, Software", "Software, Antivirus", "None Of Above"], answer: 1 },
  { q: "Computer keyboard is having set of --------- key on right side.", options: ["Number", "Text", "Function", "Control"], answer: 0 },
  { q: "Computer keyboard layout is same as ___________ keyboard.", options: ["Typewriter", "Musical", "Both A And B", "None Of Above"], answer: 0 },
  { q: "Computer Memory is calculated in ___________", options: ["Bits", "Byte", "File", "Data"], answer: 1 },
  { q: "Computer not only work fast but accurate also.", options: ["True", "False"], answer: 0 },
  { q: "Ctrl+___ is used for Left Align", options: ["A", "L", "C", "D"], answer: 1 },
  { q: "ctrl+___ is used for to cut the selection", options: ["Y", "X", "Z", "B"], answer: 1 },
  { q: "Ctrl+_____ key used for selecting the whole or complete document", options: ["A", "B", "C", "D"], answer: 0 },
  { q: "Ctrl+ … ... is used for Double Line Spacing", options: ["2", "3", "4", "5"], answer: 0 },
  { q: "Ctrl+ … ... with an arrow key used for to select a block of text", options: ["SHIFT", "delete", "undo", "redo"], answer: 0 },
  { q: "In Excel options to change the font Size ,color and Font face are available in ______________", options: ["Alignment", "Number", "Font Group", "Clipboard"], answer: 2 },
  { q: "In Excel Redo Short Cut key __________", options: ["Ctrl+ Z", "Ctrl + Y", "Ctrl + S", "Ctrl + X"], answer: 1 },
  { q: "In Excel Sequencially Selected cells are called _______________", options: ["Cell span", "Line", "Cell range", "None of these"], answer: 2 },
  { q: "In Excel Short cut Command for Replace _____________", options: ["Ctrl + V", "Ctrl + H", "Ctrl + F", "Ctrl + G"], answer: 1 },
  { q: "In Excel Spelling option is available in ________ Menu", options: ["Insert", "Review", "Data", "View"], answer: 1 },
  { q: "In a slide selected text matter can be given a different color using ___ command from Home Tab.", options: ["Font Size", "Font Color", "Font style", "None of these"], answer: 1 },
  { q: "In a slide show using ESC we can ____________", options: ["Enter a slide show", "Exit from Slide Show", "to go to next slide", "None of These"], answer: 1 },
  { q: "In Insert=>Media option which of the following are present?", options: ["Only Audio", "Only Video", "Audio & Video", "None of these"], answer: 2 },
  { q: "In Ms Powerpoint 2019 Drawing Group is under Home Tab.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "In Ms Powerpoint 2019 under the Design tab … … … .. Option are avilable in Page setup group.", options: ["Thems", "Page Orientation", "Backgroup", "None of these"], answer: 1 },
  { q: "Automated Transactions for the purchase of goods over the internet is called … …", options: ["Commerce", "Purchase", "E-shopping", "Web shopping"], answer: 2 },
  { q: "AVI stands for_______________", options: ["Actual Video Interface", "Audio Varying Interface", "Auto Video Interaction", "Audio Video Interface"], answer: 3 },
  { q: "BCC Means Blank Carbon Copy", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "BCC Means____", options: ["Blank Carbon Copy", "Blind Carbon Copy", "Bank Carbon Copy", "Branch Carbon Copy"], answer: 1 },
  { q: "Before sending email to anyone you should have your own _____", options: ["Photo ID", "Email ID", "Address ID", "Web ID"], answer: 1 },
];

/* ---------------------------------------------
   40 WPM bank populated from the official Jan 2026
   provisional answer key PDF (868 verified questions,
   3 excluded from the source due to corrupted/
   duplicate option text found during review). 50 to
   be added once its PDF arrives — leave as empty
   array until then.
--------------------------------------------- */
const MCQ_BANK_40 = [
  { q: "________________works for Modulation and Demodulation.", options: ["Router", "Modem", "Bridge", "Hub"], answer: 1 },
  { q: "______________device is used to draw diagrams, lines, circles etc.", options: ["Plotter", "Biometric", "Mouse", "ALL OF ABOVE"], answer: 2 },
  { q: "____________acts as a wall in between our computer and Internet.", options: ["Network", "Server", "Client", "Firewall"], answer: 3 },
  { q: "____________are the shortcuts when clicked the web site linked get open.", options: ["Graphics", "Processor", "Hyperlink", "Editor"], answer: 2 },
  { q: "Bookman Old Style and Calibri are the example of ...............", options: ["Cell Styles", "Format Styles", "Wrap Styles", "Fonts"], answer: 3 },
  { q: "By ............... click we can select a line.", options: ["Single", "Double", "Triple", "Dragging"], answer: 1 },
  { q: "By clicking ........ tool, we can apply 3D effect.", options: ["3-D Rotations", "Right Rotation", "Left Rotation", "None of these"], answer: 0 },
  { q: "By default, on which page the header or the footer is printed?", options: ["Next Page", "Previous Page", "Odd Page", "Even Page"], answer: 2 },
  { q: "By using Font Dialog Box - Advanced Tab we can set the following options?", options: ["Scale", "Spacing", "Position", "All of these"], answer: 3 },
  { q: "Comments can be added to cells using _____", options: ["Cell Tip", "Soft Tip", "Web Tip", "Smart Tip"], answer: 0 },
  { q: "Comparisons such as greater than, less than, between etc. Are available in ______ option of conditional formatting.", options: ["Top/Bottom rules", "Color Scales", "Data Bars", "Highlight Cells Rules"], answer: 3 },
  { q: "Conditional Formatting to Remove Conditional Formatting in the Full Sheet .......... Click on this option.", options: ["Clear Rules from Selected Cells", "Clear Rules from Entire Sheet", "Both", "None"], answer: 1 },
  { q: "Conditional Formatting to Remove Conditional Formatting of Selected Cells ............ Click on this option.", options: ["Clear Rules from Selected Cells", "Clear Rules from Entire Sheet", "Both", "None"], answer: 0 },
  { q: "ctrl + page down is used to go to next worksheet in MS Excel 2019", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "In multi media the height of the alphabates is measured in ____________", options: ["pixels", "points", "Hertz", "Bytes"], answer: 1 },
  { q: "DPI means Dot per Square Inch.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Draft view is ----- available in PowerPoint", options: ["not", "available", "Both A and B", "None of Above"], answer: 0 },
  { q: "DTP Stand For -----", options: ["Desk Top Page", "Desk Top Publishing", "Desk Top Public", "Disc Top Publication"], answer: 1 },
  { q: "Each character is to be look differently is done with _________", options: ["Font", "Text", "size", "None of these"], answer: 0 },
  { q: "________________ is an internet search tool.", options: ["Gmail", "Facebook", "Chrome", "Gopher"], answer: 3 },
  { q: "_________________ is a hardware device.", options: ["Virus", "Hard Disk", "Norton", "Quick heal"], answer: 1 },
  { q: "__________________ Is used to view deleted emails.", options: ["Inbox", "Spam", "Outbox", "Trash"], answer: 3 },
  { q: "__________________ Is used to view received emails.", options: ["Inbox", "Outbox", "Sent", "Find"], answer: 0 },
  { q: "__________________ helps you to organize & manage the programs and files on the hard disk.", options: ["Wallpaper", "Screen Saver", "Windows Explorer", "Documents"], answer: 2 },
  { q: "____________is a type of tight permission.", options: ["Biometric", "email", "login", "payments"], answer: 0 },
  { q: "____________is an example of Application Software.", options: ["Interpreter", "Operating System", "Compiler", "Browser"], answer: 3 },
  { q: "___________Controls the process of break, send, reassemble the messages over internet.", options: ["Clients", "Users", "Protocols", "Servers"], answer: 2 },
  { q: "___________is used to increase the security level.", options: ["editing", "password", "filter", "spooler"], answer: 1 },
  { q: "__________contains information about user or website which is frequently used.", options: ["ecommerce", "mails", "node", "Cookies"], answer: 3 },
  { q: "By using _________________ Combination Key we can Undo any mistakes.", options: ["Ctrl + A", "Shift + A", "Ctrl + Z", "Shift + Z"], answer: 2 },
  { q: "By using __________________ we can change the appearance of document.", options: ["Screening", "Proffing", "Printing", "Fomatting"], answer: 3 },
  { q: "By using … … … … … … … … … … … indent command you can set starting of first line of paragraph is to be made by leaving some space from starting of other lines in paragraph.", options: ["First Line", "Default", "Left", "Right"], answer: 0 },
  { q: "Callouts buttons are in the … … … … … … … … . Option of Insert Tab.", options: ["Standard", "Formatting", "Status", "Shapes"], answer: 3 },
  { q: "In Ms-Word, which of the following is not a type of page margin.", options: ["Center", "Left", "Right", "Top"], answer: 0 },
  { q: "ctrl + pg up is used to go to next workbook in MS Excel 2019", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "Ctrl + PgDn combination is used to move to the next worksheet.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Ctrl + T is used for creating Table in Excel", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Custom series option can be used to create series of Months or days.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Data sheet is used for storing the chart in MS-Excel.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "Each character is to be look differently is done with Font", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Exiting and ______ in PowerPoint are same", options: ["Alt + F2", "Ctrl + F4", "Alt + F4", "Shift + F4"], answer: 2 },
  { q: "Extension of PowerPoint Show is ________________", options: [".ppsx", ".potx.", ".pptx", ".ppts"], answer: 0 },
  { q: "F1 Function key is used to __________ in PowerPoint", options: ["Add slide", "start slide show", "Display help", "delete slide"], answer: 2 },
  { q: "Following color modes are available in PowerPoint.", options: ["Color", "Gray scale", "Black and White", "All of these"], answer: 3 },
  { q: "__________________ is the protocol, to transfer the data in the form of text", options: ["SMTP", "HTTP", "FTP", "PPPT"], answer: 1 },
  { q: "__________________ is used to store data in computer", options: ["Memory", "Software", "Arithmetic & logical Unit", "All of these"], answer: 0 },
  { q: "__________________ printer can print 200 to 2000 lines per minute.", options: ["Line", "Character", "Laser", "Plotter"], answer: 0 },
  { q: "___________________ printer prints character by character.", options: ["Line", "Character", "Laser", "Plotter"], answer: 1 },
  { q: "______________________ Is used to view deleted E-Mails.", options: ["Inbox", "Spam", "Trash", "Outbox"], answer: 2 },
  { q: "__________indicates the website is of commercial type.", options: [".org", ".com", ".gov", ".mil"], answer: 1 },
  { q: "__________is software which is only used for browsing.", options: ["Server", "Browser", "Player", "Editor"], answer: 1 },
  { q: "__________is used to connect computer to Internet.", options: ["Player", "Modem", "Router", "Spooler"], answer: 1 },
  { q: "_________indicates the website is of international type.", options: [".org", ".com", ".int", ".mil"], answer: 2 },
  { q: "_________is a acronym of the word \" Web-log\".", options: ["WB", "Blog", "WL", "WC"], answer: 1 },
  { q: "Can we crop the image in Ms-word", options: ["True", "False"], answer: 0 },
  { q: "can we insert rows in table", options: ["True", "False"], answer: 0 },
  { q: "Can we use Existing list in Mail Merge", options: ["True", "False"], answer: 0 },
  { q: "Can you apply the background color to table", options: ["True", "False"], answer: 0 },
  { q: "Caption option is used to get reference of specific place in Document.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "Default Column Width in Excel is _____________", options: ["7.43", "8.43", "6.43", "9.43"], answer: 1 },
  { q: "Default file name in Excel workbook is", options: ["Document1", "File1", "Book1", "None of these"], answer: 2 },
  { q: "Define the Big number of given range … … … … … .. Do.", options: ["=min()", "=Max()", "=Range()", "=round()"], answer: 1 },
  { q: "Delete sheet Command is given in _________tab.", options: ["Tools", "Home", "View", "File"], answer: 1 },
  { q: "Delete sheet command is in ________ tab - cells group.", options: ["File", "View", "Home", "Tools"], answer: 2 },
  { q: "For running slide show we can use the shortcut key .............", options: ["F4", "F6", "F5", "F7"], answer: 2 },
  { q: "From which bar you can access Picture, Text Box, Chart etc?", options: ["File", "Review", "Insert", "View"], answer: 2 },
  { q: "Guides command is chosen in the ................... Tab to display Guides", options: ["View", "File", "Slide Show", "Window"], answer: 0 },
  { q: "Handout Master views in _____", options: ["Master Views", "Drawing View", "Formatting View", "Standard View"], answer: 0 },
  { q: "_____________are used for virus detection and deletion.", options: ["Antivirus", "hardware", "Flash Drives", "DVD"], answer: 0 },
  { q: "_____________is a popular image format to upload images on Internet.", options: [".GIF", ".MPEG", ".XLSX", ".TIFF"], answer: 0 },
  { q: "___________is valid type of printer.", options: ["icon", "key", "image", "Laser"], answer: 3 },
  { q: "___________means handling operations related to files and folders.", options: ["File Management", "Memory Management", "Hardware Management", "Software Management"], answer: 0 },
  { q: "___________means handling operations related to storage of data in a computer.", options: ["File Management", "Memory Management", "Hardware Management", "Software Management"], answer: 1 },
  { q: "_________is an email server developed by Microsoft company.", options: ["Hotmail", "Yahoo mail", "Gmail", "None of these"], answer: 0 },
  { q: "_________is an email service provider by Google.", options: ["rediffmail", "Hotmail", "Gmail", "Yahoo"], answer: 2 },
  { q: "_________is an example through which people can share their thoughts, links and views on internet.", options: ["E-Commerce", "E-mails", "Chatting", "Social Networking"], answer: 3 },
  { q: "________domain is used by military.", options: [".edu", ".mil", ".gov", ".org"], answer: 1 },
  { q: "_______is the computer through which internet is provided to other computers.", options: ["Server", "Client", "Bridge", "Connector"], answer: 0 },
  { q: "Change the __________________ to create a document in wide format", options: ["Page Orientation", "Paper Size", "Page Layout", "All of these"], answer: 0 },
  { q: "Closing a Document means where a file which is 'open' can be closed with the command 'Close' from the File Menu.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Column width gets adjusted according to the matter width by using _________________ Option.", options: ["Auto Fit", "Auto Format", "Auto Text", "Auto Cut"], answer: 0 },
  { q: "Courier is an example of font", options: ["True", "False"], answer: 0 },
  { q: "create _____________ to assign a name to specific point in document", options: ["Header", "Footer", "Bookmark", "Cross Reference"], answer: 2 },
  { q: "Doughnut is one of the type of chart in Excel", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Doughnut is one of the type of … … … … . in Excel.", options: ["Picture", "Symbol", "Chart", "None of these"], answer: 2 },
  { q: "Each Excel file is called a Workbook because ______________", options: ["User has to work hard to create it", "It can contain Many Sheets", "It can be modified", "It contains Text and Data"], answer: 1 },
  { q: "Each row in Ms-Excel, is referred by a specific number.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Evaluate Formula option is used to step by step ________ and analyze formula in MS-Excel.", options: ["Evaluate", "Exempt", "Expand", "Explain"], answer: 0 },
  { q: "Header & Footer options are given in _________ tab in PowerPoint", options: ["Windows", "Insert", "Slide Show", "Format"], answer: 1 },
  { q: "Header and Footer options are available in _____tab", options: ["Window", "insert", "Slide Show", "Format"], answer: 1 },
  { q: "Horizontal and Vertical ruler meet each other at _____________ point.", options: ["Common", "Zero Set", "Main", "None of these"], answer: 1 },
  { q: "How to Hide Slide in Powerpoint?", options: ["View>> Hide Slide", "View>> Hide Slide>> Hide Slide", "Insert>> View>> Hide Slide", "SlideShow>> Hide Slide"], answer: 3 },
  { q: "If we right click on text matter _____ menu will be open", options: ["File", "Quick Access", "Edit", "Window"], answer: 1 },
  { q: "___________of a computer is also called as Visual Display Unit.", options: ["Keyboard", "Mouse", "Monitor", "Printer"], answer: 2 },
  { q: "___________Shortcut key is used to stop loading of webpage in Internet Explorer.", options: ["Esc", "Pg Up", "End", "Home"], answer: 0 },
  { q: "__________button is seen on the extreme left hand side of task bar in windows 10.", options: ["Finish", "Escape", "Start", "Delete"], answer: 2 },
  { q: "__________has highest storage capacity than other external memory devices.", options: ["CD", "DVD", "Pen Drive", "Hard Disk"], answer: 3 },
  { q: "_________are used for Engineering drawing, maps etc.", options: ["Inkjet printers", "Plotters", "Dot Matrix Printers", "Laser Printers"], answer: 1 },
  { q: "0' and '1' are part of ___________ system", options: ["Unary", "Binary", "Trinary", "None of these"], answer: 1 },
  { q: "1 TB = ___________", options: ["1000 GB", "1024 YB", "2014 PB", "1024 GB"], answer: 3 },
  { q: "1 Byte = ____ Bits", options: ["1024", "1000", "8", "10"], answer: 2 },
  { q: "1 Exa Byte = 1024 ______", options: ["Peta Byte", "Exa Byte", "Zetta Byte", "None of Above"], answer: 0 },
  { q: "DOT Matrix printer is an example of printer.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Ctrl + _____________ letter is used to bold the text", options: ["L", "B", "O", "D"], answer: 1 },
  { q: "Ctrl + __________________ this is used to underline text", options: ["B", "U", "I", "Uline"], answer: 1 },
  { q: "Ctrl+____ is used for Double Line Spacing", options: ["2", "3", "4", "5"], answer: 0 },
  { q: "Ctrl+____ with an arrow key used for to select a block of text", options: ["SHIFT", "delete", "undo", "redo"], answer: 0 },
  { q: "Evaluate Formula option is used to step by step evaluate and ________ formula in MS-Excel.", options: ["add", "analyze", "append", "submit"], answer: 1 },
  { q: "Every Worksheet has vertical and horizontal lines called _____________", options: ["Cell", "Pixel", "Table", "Grid"], answer: 3 },
  { q: "File in excel 2019 has __________ extension.", options: [".doc", ".xls", ".xlsx", ".xlx"], answer: 2 },
  { q: "Fill command is present in ____________ tab", options: ["Home", "Tools", "File", "Format"], answer: 0 },
  { q: "Fill Command is provided in ____________ Tab", options: ["Home", "Tools", "File", "Format"], answer: 0 },
  { q: "If we right click on text matter Quick access menu will open", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "If we right click on text matter Quick menu will open", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "If we click on any transition effect then the ________ of this effect will be immediately shown on the selected slide.", options: ["View", "Start", "Preview", "None of these"], answer: 2 },
  { q: "If we make the zoom of the document larger or smaller it affects the printing size of the slide.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "If we move frame then______ also moves", options: ["Data", "Object", "All data", "None of these"], answer: 0 },
  { q: "_________type is used for high-quality, accurate images.", options: ["Plotter", "Line", "Character", "Laser"], answer: 0 },
  { q: "192.168.1.1 is example of _____________", options: ["IP address", "Net Address", "pc address", "None of Above"], answer: 0 },
  { q: "64 bit microprocessor can access ____________ bytes at a time", options: ["64", "2", "8", "16"], answer: 2 },
  { q: "A __________ is collection of both Hardware and Software.", options: ["My Files", "Document", "Program", "Computer System"], answer: 3 },
  { q: "A collection of files and sub folders is called as _________", options: ["File", "Folder", "Subfolder", "My Files"], answer: 1 },
  { q: "1 GB = __________", options: ["1000 MB", "1024 ZB", "1024 MB", "1024 TB"], answer: 2 },
  { q: "1 KB = ________ Bytes", options: ["1000", "1012", "1024", "1032"], answer: 2 },
  { q: "1 Peta Byte = 1024 _______", options: ["Tera Byte", "Mega Byte", "Giga Byte", "None of Above"], answer: 0 },
  { q: "1 Tera Byte = 1024 _______", options: ["Mega Byte", "Giga Byte", "Yotta Byte", "None of Above"], answer: 1 },
  { q: "1 YB (yotta byte) = __________", options: ["1024 ZB", "512 TB", "1024 MB", "NONE OF ABOVE"], answer: 0 },
  { q: "Ctrl+Y shortcut key is used to ________", options: ["Cut", "Undo", "Redo", "Paste"], answer: 2 },
  { q: "Data in ________ cable is transferred through light pulses.", options: ["Coaxial", "Shieled Twisted Pair", "Fiber Optic", "Twisted Pair"], answer: 2 },
  { q: "Default file name of ms-word is ____________", options: ["Document", "Book", "Presentation", "Database"], answer: 0 },
  { q: "Dialog Box can not be resized.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Different types of Underlines are available in _______ Group of Home Tab.", options: ["Print", "Font", "Save as", "Mail merge"], answer: 1 },
  { q: "For example using = Min ( B4:B10) formula, we get the smallest number in cell B4 to B 10,", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Formula is nothing but the instruction regarding the calculations.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Formulas must be provided in the Output Cell using Input Cell to use the Goal Seek.", options: ["true", "false"], answer: 0 },
  { q: "Formulas with Absolute refereces always _________", options: ["None of these", "Refer to same cells, regardless of the location of the formula", "Refer to different cells", "Produce Zero as the default"], answer: 1 },
  { q: "From the following functions --------- is a Logical function.", options: ["AND", "OR", "NOT", "All of these"], answer: 1 },
  { q: "If we right click on a text in any slide _____ menu will be open.", options: ["File", "Quick", "Edit", "Window"], answer: 1 },
  { q: "If we want exactly circle shape Frame then chick on _______ button of tool box", options: ["Ellipse Frame Tool", "Polygon", "Zoom", "None of these"], answer: 0 },
  { q: "If you ____ a slide it will not be shown in the full screen slide show.", options: ["show", "close", "hide", "exit"], answer: 2 },
  { q: "If you do not wish to show particular slide in slide show, ___________ command can be used", options: ["Delete", "Hide", "Show", "None of these"], answer: 1 },
  { q: "If you make the changes in _____ the changes apply to whole presentation.", options: ["Slide Show", "Slide sorter", "Slide Master", "None of these"], answer: 2 },
  { q: "A collection of wires that connects several devices is called ___", options: ["Printer", "Scanner", "Keyboard", "Switch"], answer: 3 },
  { q: "A compressed files take up less space but it takes longer to transmit them.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "A domain name ending with \".com\" is _________", options: ["An organization", "A commercial site", "A government Site", "A Educational site"], answer: 1 },
  { q: "A domain name ending with \".mil\" is _________", options: ["A military website", "A commercial site", "A network site", "An organization"], answer: 0 },
  { q: "A domain name ending with \".net\" is _________", options: ["A government Site", "A commercial site", "A network site", "An organization"], answer: 2 },
  { q: "1 Yotta Byte = 1024 ______", options: ["Peta Byte", "Exa Byte", "Zetta Byte", "None of Above"], answer: 2 },
  { q: "1 Zetta Byte = 1024 ______", options: ["Peta Byte", "Exa Byte", "Zetta Byte", "None of Above"], answer: 1 },
  { q: "1024 Exa Byte = 1 ____", options: ["Tera Byte", "Zetta Byte", "Exa Byte", "None of Above"], answer: 1 },
  { q: "1024 GB = __________", options: ["1 PB", "1 ZB", "1 YB", "1 TB"], answer: 3 },
  { q: "1024 Giga Byte = 1 _________", options: ["Kilo Byte", "Tera Byte", "Mega Byte", "Zetta Byte"], answer: 1 },
  { q: "Different types of Underlines are available in _________________ Group of Home Tab.", options: ["Print", "Font", "Save as", "Mail merge"], answer: 1 },
  { q: "Don ’ t Hypenate is used to avoid the automatic hyphenation.", options: ["True", "False"], answer: 0 },
  { q: "Draw a line through the middle of the selected text is called strikethrough.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Drop Cap means .............", options: ["Small Caps", "Title Case", "All Caps", "None of these"], answer: 3 },
  { q: "Due to _____Option Columns width is adjusted due to its content in the table.", options: ["Autofit", "AutoFormat", "AutoText", "AutoCut"], answer: 0 },
  { q: "From the following functions ............. is from Lookup category.", options: ["AND", "OR", "NOT", "Match"], answer: 3 },
  { q: "From the following functions, ______ is not from Lookup category.", options: ["AND", "VLookup", "Hlookup", "Match"], answer: 0 },
  { q: "Given the syntax of the Lookup Function ............ is the column where the Lookup Value given is found.", options: ["Lookup Value", "Lookup Vector", "Column Index", "True / False"], answer: 1 },
  { q: "How many default sheet spreadsheet application?", options: ["3", "2", "4", "1"], answer: 0 },
  { q: "If you select Insert >> Picture >> File", options: ["You can insert pictures and clipart", "You can insert clipart only", "you can insert pictures only", "None of above"], answer: 2 },
  { q: "If you want to set transition effect to all the slides which of the following views is _________", options: ["Slide sorter view", "Notes page view", "outline view", "Slide view"], answer: 0 },
  { q: "In ................... view all slides are displayed in small size like thumbnails.", options: ["Slide Show", "Slide Sorter", "Normal", "Notes Pages"], answer: 1 },
  { q: "In ______ you can view the presentation with Transition and Animation effects.", options: ["Outline", "Slide Show", "Note Page", "Slide Sorter"], answer: 1 },
  { q: "In ________ view the slides are displayed in small size like thumbnails.", options: ["Reading", "Normal", "Notes Page", "Slide sorter"], answer: 3 },
  { q: "A File download means moves a copy of file on local host to remote host.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "A file having .png extension represents _______________file.", options: ["Audio", "Video", "Image", "MS-Word"], answer: 2 },
  { q: "A letter of memo sent to a person or group on the internet__", options: ["Gmail", "Hotmail", "Yahoo mail", "All of above"], answer: 3 },
  { q: "A program used to access the internet is known as ___", options: ["Web site", "Search Engine", "Browser", "Word Processor"], answer: 2 },
  { q: "A search engine is used to get information from _________", options: ["MS Office", "Internet", "Browser", "Gmail"], answer: 1 },
  { q: "1024 pb = __________", options: ["1 ZB", "1 GB", "1 EB", "1 TB"], answer: 2 },
  { q: "1024 Peta Byte = 1 ____", options: ["Tera Byte", "Zetta Byte", "Exa Byte", "None of Above"], answer: 2 },
  { q: "1024 TB = 1 ______", options: ["YB", "PB", "ZB", "None of Above"], answer: 1 },
  { q: "1024 Terabyte = __________", options: ["1 KILOBYTE", "1 MEGABYTE", "1 GIGABYTE", "1 PETABYTE"], answer: 3 },
  { q: "1024 Zetta Byte = 1 ____", options: ["Peta Byte", "Exa Byte", "Yotta Byte", "None of Above"], answer: 2 },
  { q: "Entire Row will be selected, if we double click at Left-Bottom corner of a cell", options: ["True", "FALSE"], answer: 1 },
  { q: "Envelop can create and print by using __________ tab", options: ["File", "Mailing", "Insert", "Home"], answer: 1 },
  { q: "Exit option present in __________ menu", options: ["Insert", "File", "Data", "Review"], answer: 1 },
  { q: "Find and replace option available _________________ tab", options: ["Review", "Home", "Insert", "View"], answer: 1 },
  { q: "Footnote and Endnotes are exactly same.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "How to calculate average value?", options: ["=sum()", "=Max()", "=IF()", "=Average()"], answer: 3 },
  { q: "How to select single complete column in MS Excel 2019 ?", options: ["ctrl + a", "ctrl + c", "Alt + c", "Click on column header"], answer: 3 },
  { q: "If any condition given to AND function is False, then AND function returns ________", options: ["True", "False"], answer: 1 },
  { q: "IF Functions is used no. of times in MS-Excel is called as ________functions", options: ["Combined if", "Nested If", "Joint if", "Add if"], answer: 1 },
  { q: "If the condition is True, then NOT function gives result as ________", options: ["True", "False"], answer: 1 },
  { q: "In ____________ view sequence of matter can be changed by selecting the slide.", options: ["Outline", "Normal", "Notes Page", "Slide sorter"], answer: 0 },
  { q: "In ______________ view all slides are displayed in small size like thumbnails.", options: ["Slide Show", "Slide Sorter", "Normal", "Notes Pages"], answer: 1 },
  { q: "In __________________ we can see all the slides in the presentation file in thumbnail view.", options: ["Proofing", "Review", "Notes page", "Slide Sorter"], answer: 3 },
  { q: "In ____________view we can see ony one slide at a time and can edit the same.", options: ["Slide Sorter View", "Normal", "Outline", "Slide Show"], answer: 1 },
  { q: "A search engine is used to get information from internet.", options: ["True", "False"], answer: 0 },
  { q: "A search tool is a program that finds ___________that match keywords that you enter.", options: ["Server", "Client", "Website", "Node"], answer: 2 },
  { q: "A website is a complete collection of webpages and folders.", options: ["True", "False"], answer: 0 },
  { q: "After starting the computer the screen which we can see is called as _________", options: ["Processor", "Document", "Desktop", "My computer"], answer: 2 },
  { q: "All the files that are deleted goes into __________", options: ["Recycle Bin", "My Computer", "Documents", "Saved Documents"], answer: 0 },
  { q: "A set of Rule is called?", options: ["Browser", "File", "Variable", "Protocol"], answer: 3 },
  { q: "A folder is also called as Directory", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "A Internet is a combination of ______", options: ["website", "Sub network", "pictures", "protocol"], answer: 0 },
  { q: "A to Z characters are also called as ____________", options: ["Number keys", "Function Keys", "Alpha Keys", "Insert Keys"], answer: 2 },
  { q: "A Web page means Collection of Information.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "For Closing the Print Preview Option, which of the following key we have to Press.", options: ["Alt", "Esc", "Ctl", "Delete"], answer: 1 },
  { q: "For Display Help we use following Shortcut keys", options: ["F1", "F2", "F3", "F4"], answer: 0 },
  { q: "For Mail merge database list is to be inserted", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "For Mathematical Equation Insert Tab-________option used in Word", options: ["Formula", "Equation", "Symbol", "None of these"], answer: 1 },
  { q: "For movement of document in MS-Word we can use ___________", options: ["Scroll Bar", "title bar", "status bar", "None of these"], answer: 0 },
  { q: "If the Match Type is not mentioned in the formula, then it is considered as ________ by default.", options: ["0", "-1", "1", "10"], answer: 2 },
  { q: "If the size of the cell is too small to accommodate the desired matter __________ is used to set text in cell", options: ["Text Orientation", "Merge and Center", "Wrap Text", "Vertical Alignment"], answer: 2 },
  { q: "If there are conditions you can use when using Nasted If one has to use a number of Functions,", options: ["true", "false"], answer: 0 },
  { q: "If we increase the height of the row, the text matter automatically gets shifted to the ____ of the Cell", options: ["Bottom", "Middle", "Up", "Down"], answer: 0 },
  { q: "If we merge two cells containing data in them in MS Excel 2019 , which data is kept in merged cell?", options: ["we can not merge cells in MS Excel 2019", "right most cell data", "nothing is kept in merge cell", "upper left most data"], answer: 3 },
  { q: "In _______we can do Rehearsal of the time required for each slide.", options: ["Set Up Show", "Rehearse Timings", "Slide Transition", "Custom Animation"], answer: 1 },
  { q: "In a PowerPoint Closing and existing are different", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "In a slide using Ctrl+I we can give ___________ effect to a text selected.", options: ["italic", "bold", "underline", "new"], answer: 0 },
  { q: "In general when the zoom is .............. it is similar to the Print size of the slide.", options: ["75 percent", "125 percent", "100 percent", "200 percent"], answer: 2 },
  { q: "In Microsoft PowerPoint, two kinds of sound effects files that can be added to the presentation are", options: [".wav files and .mid files", ".wav files and .gif files", ".wav files and .jpg files", ".jpg files and .gif files"], answer: 0 },
  { q: "All web addresses start with _________", options: ["http://", "smtp://", "ftp://", "html://"], answer: 0 },
  { q: "All web addresses start with http://", options: ["True", "False"], answer: 0 },
  { q: "An ______ Is a program that provides tools for accessing web sites.", options: ["Google Chrome", "Let's talk", "Google talk", "All of above"], answer: 0 },
  { q: "An email program's can stored Email addresses in __________________", options: ["Inbox", "Address Book", "Close", "Outbox"], answer: 1 },
  { q: "An internet device is used to connect two or more network is called_______", options: ["Gateway", "Router", "Hub", "Scanner"], answer: 1 },
  { q: "Accuracy is one of the characteristics of computer", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Alphanumeric is a combination of __________", options: ["Letters", "Numbers", "Letters and numbers", "Letters, numbers and special characters."], answer: 3 },
  { q: "Alphanumeric keys contains - ________________", options: ["Letter", "Numbers", "Letter & Numbers", "Letters, Numbers & Special Characters"], answer: 3 },
  { q: "Alt & Ctrl keys are _______________________ __", options: ["Function keys", "Option Keys", "Combination Keys", "All of these"], answer: 2 },
  { q: "ALU stands for Arithmetic & Logic Unit", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Formula always start with the___________ sign", options: ["(=)", "(+)", "($)", "(*)"], answer: 0 },
  { q: "Formula Bar is always available in Ms-Word.", options: ["True", "FALSE"], answer: 1 },
  { q: "From Which Tooll Bar we can get the Uudo Command.", options: ["Window", "Quick Access Toolbar", "Format", "File"], answer: 1 },
  { q: "Generally ___ Alignment is used for paragraph having more than one line.", options: ["Left", "Right", "Center", "Justify"], answer: 3 },
  { q: "Generally we are using the shortcut key Ctrl + Home for .........................................", options: ["Move the curser to the beginning of Document", "Move the cursor to beginning of line", "to move the cursor to beginning of group", "All of the above"], answer: 0 },
  { q: "If we use multiple IF functions in one into another, it is called as --------", options: ["Clear rules form selected cells", "Clear Rules from Entire Sheet", "Both", "None of these"], answer: 1 },
  { q: "If we want to delete any scenario, we use ________ option.", options: ["Remove", "Close", "Delete", "Format"], answer: 2 },
  { q: "If we wish to copy the formula to adjacent cells or cells just below, we can copy it by dragging ________ in MS-Excel.", options: ["VLOOKUP", "HLOOKUP", "DATEDIF", "FILL HANDLE"], answer: 3 },
  { q: "If we wish to do some operation ________ on a particular table, then subtotals facility of MS-Excel is used.", options: ["individually", "group wise", "randomly", "evenly"], answer: 1 },
  { q: "If we wish to do some operation group wise on a particular table, then ________ facility of MS-Excel is used.", options: ["Merge", "Filter", "Sort", "Subtotals"], answer: 3 },
  { q: "In MS-Office ______________ tab is available only in PowerPoint.", options: ["Transitions", "Animations", "Slide Show", "All of these"], answer: 3 },
  { q: "In MS-Office applications which application is used to create presentation.", options: ["Word", "Excel", "Presenter", "None of these"], answer: 3 },
  { q: "In Normal view we can see any one slide at a time and can edit the same.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "In Power point hyperlink option is available in ______", options: ["insert Tab- illustrations group", "Insert Tab- Links group", "Home Tab- Images group", "None of these"], answer: 1 },
  { q: "In Power point photo option is available in Insert Tab images group", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Antivirus are designed to stop ________", options: ["Deleting Files", "Erasing data", "Insert unnecessary data", "All of these"], answer: 3 },
  { q: "Anyone can create and register website for personal / organization use.", options: ["true", "false"], answer: 0 },
  { q: "Application and System is a type of __________", options: ["Virus", "Software", "Hardware", "Antivirus"], answer: 1 },
  { q: "Attachment buttons show _________ icon on it.", options: ["M Pin", "U pin", "N pin", "W Pin"], answer: 1 },
  { q: "Automated Transactions for the purchase of goods over the internet is called ______", options: ["E-learning", "E-commerce", "E-mail", "E-communicati on"], answer: 1 },
  { q: "__________ is NOT part of Computer Hardware", options: ["Keyboard", "System Unit", "System OS", "Storage Devices"], answer: 2 },
  { q: "____________ is impact printer", options: ["Ink Jet Priters", "Dot Matrix Priters", "Laser Printers", "Plotters"], answer: 1 },
  { q: "HTTP is abbreviation of ___________", options: ["Hypertext transport policy", "Hypertext transport permission", "Hypertext transport port", "Hypertext transfer Protocol"], answer: 3 },
  { q: "Capacity of CD is ________", options: ["500 MB", "4.7 GB", "700 MB", "1 TB"], answer: 2 },
  { q: "Capacity of CD-RW is ________", options: ["500 MB", "4.7 GB", "700 MB", "1 TB"], answer: 2 },
  { q: "_______ box is used for typing text.", options: ["Text", "Letter", "Symbol", "Word"], answer: 0 },
  { q: "___________ key should be pressed to start a new paragraph in MS-Word", options: ["Down Cursor Key", "Enter Key", "Shift + Enter", "Ctrl + Enter"], answer: 1 },
  { q: "In MS Word, Ctrl+S is for … ..", options: ["Scenarios", "Size", "Save", "Spelling Check"], answer: 2 },
  { q: "In MS-Word 2019 … … … … … … .. Is not a alignment.", options: ["Left", "Right", "Bottom", "Justify"], answer: 2 },
  { q: "In Page Layout Tab- Page Setup group is about Columns, how many options we get in this options.", options: ["One, Two, Three, Left & Right", "Only Left", "Only Right", "None of these"], answer: 0 },
  { q: "= Lower( ) Function gives Text in capital letter.", options: ["true", "false"], answer: 1 },
  { q: "= Sum (F8:F12) this function sort the values in cells range between F8 to F12.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "--------- application software is used to calculate mathematical calculations.", options: ["MS - Word", "MS - Powerpoint", "Spreadsheet", "Image Editor"], answer: 2 },
  { q: "----- cannot be used while typing formula.", options: ["Number", "Spaces", "Characters", "Special Characters"], answer: 1 },
  { q: "------- sorting method is used for Z to A sequence.", options: ["Ascending", "Descending", "Vertical", "Horizontal"], answer: 1 },
  { q: "MS- PowerPoint is useful for making ____________ at professional level.", options: ["Presentation", "Webpage", "Processing", "Video"], answer: 0 },
  { q: "______ bar is above Tool bar", options: ["Access", "Tool", "Quick", "Menu"], answer: 3 },
  { q: "_______ controls all the main slide control tasks for your presentation.", options: ["Task Pane", "Task Bar", "Control Panel", "None of these"], answer: 0 },
  { q: "________ means the effects given in Slide, regarding how the Objects appeared during Slide show.", options: ["Transitions", "Layout", "Animation", "None of these"], answer: 2 },
  { q: "_________ command is available in File menu", options: ["Preference", "paragraph", "cut", "find"], answer: 0 },
  { q: "_________ Is a way of sending and receiving messages using a computer.", options: ["E-mail", "G-mail", "M-mail", "A-mail"], answer: 0 },
  { q: "8 bits it is equal to _______ byte.", options: ["1", "10", "100", "1000"], answer: 0 },
  { q: "In Computer Email is a way of _________ messages.", options: ["Copying", "Sending", "Delete", "Downloading"], answer: 1 },
  { q: "\"HTML\" is acronym for what?", options: ["Hypertext Markup Language", "High Tone Modifier Loop", "Hypertext Markup Loop", "None of the above"], answer: 0 },
  { q: "\"WWW\" is an acronym for what?", options: ["Wide World Web", "World Wide Web", "World Web Wide", "Web Wide World"], answer: 1 },
  { q: "WWW stands for … … … … … ..", options: ["World Wise Web", "World wise work", "World Wide Web", "World wide Work"], answer: 2 },
  { q: "\"Alt\" Key is ---------- Key.", options: ["Combination", "Insert", "Addition", "Change"], answer: 0 },
  { q: "\"Control\" Key is ---------- Key.", options: ["Enter", "Insert", "Addition", "Combination"], answer: 3 },
  { q: "\"PARAM\" is the ------------- computer", options: ["Super", "Micro", "Mini", "Mainframe"], answer: 0 },
  { q: ".Avi is extension of _____________ file.", options: ["Image", "Audio", "Audio Video", "None of these"], answer: 2 },
  { q: "you want to cut some matter to move another place _______used.", options: ["cut", "close", "delete", "up"], answer: 0 },
  { q: "\"Line tool\" button is in the ____________________ option of Insert Tab.", options: ["Standard", "Formatting", "Status", "Shape"], answer: 3 },
  { q: "\"Save As\" dialog box is mainly used to save the open file with different name.", options: ["true", "false"], answer: 0 },
  { q: "___ Is a blinking straight line where we can type the matter.", options: ["Cursor", "Bar tab", "Insertion Tab", "Point"], answer: 0 },
  { q: "____ option cancels previous action in msword.", options: ["copy", "paste", "Formatting", "undo"], answer: 3 },
  { q: "_____ cannot be used while typing formula.", options: ["Number", "Spaces", "Characters", "Special Characters"], answer: 1 },
  { q: "_______ sorting method is used for Z to A sequence.", options: ["Ascending", "Descending", "Vertical", "Horizontal"], answer: 1 },
  { q: "_________ application software is used to calculate mathematical calculations.", options: ["MS - Word", "MS - Powerpoint", "Spreadsheet", "Image Editor"], answer: 2 },
  { q: "= Min (B4:B10) This will give you the smallest number of numbers in the B4 to B10 cell range.", options: ["true", "false"], answer: 0 },
  { q: "= LEN() is used to find the length of the string.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "------------- means the effects given in Slide, regarding how the Objects appeared during Slide show.", options: ["Animation", "Slide Show", "Slide Transition", "ClipArt"], answer: 0 },
  { q: "------------ Menu is available only in Power Point.", options: ["Windows", "View", "Slide Show", "Format"], answer: 2 },
  { q: "-------- view is used to adjust or arrange the matter in the slide.", options: ["Slide", "Slide Show", "Outline View", "Slide Sorter View"], answer: 2 },
  { q: "._______ Includes a combination of Text, Audio, Still Images, Video & Animation", options: ["Multimedia", "Graphics", "Web Authoring", "Project Managers"], answer: 0 },
  { q: "------------- view is useful to type matter on slide.", options: ["Print Layout", "Outline", "Normal", "Nome of the above"], answer: 2 },
  { q: ".bmp type of file can be created using ____________", options: ["Notepad", "MS-Word", "MS-Excel", "MS-Paint"], answer: 3 },
  { q: ".DOCX is an extension of a file created by using_________________", options: ["MS-Word version 97 To 2003", "MS-Word version 2007 To 2019", "image file", "Audio File"], answer: 1 },
  { q: ".edu .in is example of __________", options: ["educational website", "Educational website in www", "Educational website in India", "None of Above"], answer: 2 },
  { q: ".edu, .com, .org, .net, .gov are part of standard internet address domain code.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: ".gov .uk is example of _____________ website", options: ["Government of United Kingdom", "Government of India", "Government of France", "None of Above"], answer: 0 },
  { q: ".bmp is ----------- file extension.", options: ["MS-paint", "Photoshop", "Coral draw", "PageMaker"], answer: 0 },
  { q: "______ is unit of computer memory.", options: ["cm", "mm", "bit", "None of these"], answer: 2 },
  { q: "______ is used to decode Bar Code", options: ["Bar Code Decoders", "Bar Code Readers", "Bar Code Printer", "None of Above"], answer: 1 },
  { q: "_______ type of computer uses meter to show the comparison between two things.", options: ["Analogue", "Digital", "Super", "Mainframe"], answer: 0 },
  { q: "_______ company has devloped AVI for Windows Operating system.", options: ["Microsoft", "Adobe", "Google", "Oracle"], answer: 0 },
  { q: "_____ command is present in home tab", options: ["sort", "page number", "margin", "orientation"], answer: 0 },
  { q: "_____ option copies the selected text in MS Word 2019", options: ["paste", "selected", "copy", "format"], answer: 2 },
  { q: "_____ space means there is the spacing of only one line which is by default.", options: ["2.5", "1.5", "2", "1"], answer: 3 },
  { q: "______ group of insert ribbon you can create Smart Art Graphics.", options: ["Illustrations", "Pages", "Link", "Table"], answer: 0 },
  { q: "______ option is used to select the whole word in document.", options: ["double click on that word", "single click on that word", "double click on page border", "right click on that word"], answer: 0 },
  { q: "= Now() function is used to insert current system time and date in current cell.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "= Round() Function makes the number given in the bracket __________ to the number up to specific digit.", options: ["Maximum", "Minimum", "Round", "None of these"], answer: 2 },
  { q: "= Sum (F8:F12) this function sort the values in cells range between F8 to F12.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "= SUM(E8:E11) this function is used to sort the values in between the range E8 to E11", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "= Sum(F8:F11) this function remove the values in cells range between F8 to F11.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "-------------- view used to show slide presentation.", options: ["Slide Show", "Presentation", "File", "Template"], answer: 0 },
  { q: "\"Auto flow\" command is available in ________________ menu bar", options: ["Layout", "File", "Edit", "Type"], answer: 3 },
  { q: "\"Select all\" command is available in ________ menu", options: ["Layout", "File", "Edit", "Type"], answer: 2 },
  { q: "...................... is used to create best presentation.", options: ["MS Word", "Excel worksheet", "Notepad", "PowerPoint"], answer: 3 },
  { q: "....................... are printed notes of speech, footnote made for speech.", options: ["Slide", "Speaker's Note", "Worksheet", "None of these"], answer: 1 },
  { q: ".MIDI is a file extension of a sound file.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: ".mil is example of ___________ website", options: ["Military", "college", "school", "None of these"], answer: 0 },
  { q: ".org .in is example of __________", options: ["domain name", "domain code", "domain system", "All of Above"], answer: 1 },
  { q: ".wav is __________ type of file.", options: ["image", "text", "audio", "video"], answer: 2 },
  { q: "___ is necessary to connect our Computer with Internet.", options: ["Telephone Instrument", "Modem", "CD drive", "Pen Drive"], answer: 1 },
  { q: "_______ device is used to get the output on paper.", options: ["Mouse", "Monitor", "Printer", "Modem"], answer: 2 },
  { q: "_______ is most commonly used input device", options: ["Keyboard", "Mouse", "Webcam", "Scanner"], answer: 0 },
  { q: "_______ memory is of size of finger nail", options: ["HDD", "FDD", "Flash Memory Card", "RAM"], answer: 2 },
  { q: "________ Is not input devices", options: ["Mouse", "Webcamera", "Microphone", "Headphone"], answer: 3 },
  { q: "________ allows information to be shared.", options: ["Data", "notepad", "Network", "WordPad"], answer: 2 },
  { q: "______ shows print preview in MS Word 2019", options: ["insert tab", "design tab", "review tab", "file menu"], answer: 3 },
  { q: "_______ is application software is used for word processing", options: ["Ms-Excel", "Ms-word", "Ms-Access", "Ms-Powerpoin t"], answer: 1 },
  { q: "_______ is shortcut key used for select all", options: ["Ctrl+I", "Ctrl+S", "Ctrl+A", "Ctrl+N"], answer: 2 },
  { q: "_______ items are placed at the end the document .", options: ["Header", "Footer", "End Note", "Page number"], answer: 2 },
  { q: "_______ Key is use to start a new paragraph in MS-Word.", options: ["Down cursor key", "Shift + Enter", "Enter Key", "Ctrl + Enter"], answer: 2 },
  { q: "= TODAY() function is used to insert current system date into cell.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "= Upper() function is used to convert the provided text into __________", options: ["Small", "Capital", "Small Caps", "Title only"], answer: 1 },
  { q: "------ data type cannot be used as a data a cell.", options: ["Number", "Tree", "Formula", "Text"], answer: 1 },
  { q: "In a spreadsheet, what will be name of the 5th row and 5th column cell ?", options: ["E5", "5E", "E6", "D5"], answer: 0 },
  { q: "In a spreadsheet, what will be name of the 7th row and 4th column cell ?", options: ["D4", "G4", "D7", "G7"], answer: 2 },
  { q: ".pptx is the extension of Power Point", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "_____ view is used to adjust or arrange the matter in the slide.", options: ["Slide", "Slide Show", "Outline", "Slide Sorter"], answer: 2 },
  { q: "______ are Transitions available in MS - Powerpoint", options: ["Fade", "Push", "Wipe", "All of these"], answer: 3 },
  { q: "________ is an audio file.", options: [".jpj", ".bitmap", ".mp3", ".png"], answer: 2 },
  { q: "________ is NOT a type of chart.", options: ["Polygon", "Scatter", "Pie", "Line"], answer: 0 },
  { q: "___ is standard Internet protocol.", options: ["IPX", "SPX", "TCP/IP", "ITC"], answer: 2 },
  { q: "___ shortcut key is used for refresh in Internet Explorer", options: ["F1", "F12", "F3", "F5"], answer: 3 },
  { q: "____ Folder shows the deleted Emails from Email account.", options: ["Inbox", "Outbox", "Sent Mail", "Trash"], answer: 3 },
  { q: "____ is used to store permanent information.", options: ["CPU", "VDU", "DVD-ROM", "DVD-RW"], answer: 2 },
  { q: "____ key is used to see all the list of Internet Addresses.", options: ["F1", "F2", "F3", "F4"], answer: 3 },
  { q: "________ are characteristics of computer", options: ["Speed", "Accuracy", "Diligence", "All of Above"], answer: 3 },
  { q: "________ device is knows as a brain of computer.", options: ["Input Unit", "Output Unit", "CPU", "All of Above"], answer: 2 },
  { q: "________ device is used to feed data and instructions to the computer", options: ["Control", "Input", "Output", "Arithmetical & Logical"], answer: 1 },
  { q: "________ disks uses laser technology to store the data.", options: ["Optical", "Magnetic", "Floppy", "Hard"], answer: 0 },
  { q: "________ is a small bunch of data stored on our computer by the web site.", options: ["Site", "Cookies", "Email", "Computer"], answer: 1 },
  { q: "_______ option is used to add the same space between lines", options: ["Spacing", "Line spacing", "Letter", "Adding"], answer: 1 },
  { q: "_______ Tab in MSWord can be used to change character size and typeface?", options: ["View", "Tools", "Home", "Data"], answer: 2 },
  { q: "________ apperas ghosted text behind the main body text", options: ["Highlighter", "Selector", "Watermark", "Image"], answer: 2 },
  { q: "________ facility is used to mark each point in a list with order and unorder list.", options: ["List", "Bullets and Numbering", "Symbols", "Numbering"], answer: 1 },
  { q: "________ means distance between 'Text Matter' and 'Page margins'.", options: ["Indent", "Margin", "Gap", "Gutter"], answer: 0 },
  { q: "In Excel _____ option is used for different mathematical processes.", options: ["Auto Fill", "Auto Text", "Mid Text", "Formula"], answer: 3 },
  { q: "In MS- Excel Accounting number format can be applied by using ___ group in home tab.", options: ["alignment", "styles", "cells", "number"], answer: 3 },
  { q: "In MS-Excel Comma style to a value in a cell can be applied by using ___ group in home tab.", options: ["cells", "number", "styles", "alignment"], answer: 1 },
  { q: "In MS-Excel Percent style to value in a cell can be applied by using ___ group in home tab.", options: ["styles", "number", "cells", "alignment"], answer: 1 },
  { q: "MS Excel 2019 is powerful_____", options: ["spreadsheet package", "operating system", "programming language", "All of these"], answer: 0 },
  { q: "______ option is used to see slide show at some particular time interval.", options: ["Time", "Rehearse Time", "Automatic", "Watch"], answer: 1 },
  { q: "______ various Transitions available in MS - PowerPoint.", options: ["Shred", "Switch", "Flip", "All of these"], answer: 3 },
  { q: "______ view is useful to create a slide", options: ["Outline", "Normal", "Print Layout", "None of these"], answer: 1 },
  { q: "______ View is useful to type matter on slide.", options: ["Normal", "Print Layout", "Outline", "None of these"], answer: 0 },
  { q: "_______ are printed notes of speech, footnote made for speech.", options: ["Slide", "Speaker's Note", "Worksheet", "None of these"], answer: 1 },
  { q: "____ shortcut key is used for stop in Internet Explorer.", options: ["Esc", "Tab", "Ctrl", "Shift"], answer: 0 },
  { q: "____ type of printer prints character by character.", options: ["Laser", "Dot Matrix", "Inkjet", "Plotter"], answer: 1 },
  { q: "______ Button is used to reopen the web page on the Browser", options: ["Home", "Backward Arrow", "Refresh", "Forward Arrow"], answer: 2 },
  { q: "______ is a program which disturbs data files and command files.", options: ["Application program", "System program", "Virus", "Instruction"], answer: 2 },
  { q: "______ is shortcut key for refresh webpage.", options: ["F3", "F4", "F5", "F6"], answer: 2 },
  { q: "________ is light sensitive input device", options: ["Light Mouse", "Light Pen", "Touch Pen", "None of Above"], answer: 1 },
  { q: "________ is most commonly used output device", options: ["Printer", "Monitor", "Projector", "HDTV"], answer: 1 },
  { q: "________ is NOT input device", options: ["Finger Print Scanner", "Projector", "Webcam", "Scanner"], answer: 1 },
  { q: "________ is NOT secondary memory", options: ["CD", "RAM", "HDD", "DVD"], answer: 1 },
  { q: "________ is the ability of working on more than one tasks at a time.", options: ["Unix", "Multitasking", "Networking", "Multiprocessin g"], answer: 1 },
  { q: "________ spilts the text in two or more columns", options: ["Convert", "Columns", "Text", "Change"], answer: 1 },
  { q: "________ tab contain page setting", options: ["Page", "Layout", "Page Layout", "View"], answer: 2 },
  { q: "________ tab genrally used for editing and formatting text", options: ["File", "Home", "Data", "View"], answer: 1 },
  { q: "_________ has ability to combine name and address with standard format", options: ["Formula", "Mailing", "Letter", "Format"], answer: 1 },
  { q: "_________ can be applied to table, text page and image", options: ["line", "Border", "color", "None"], answer: 1 },
  { q: "To ________ the chart in MS-Excel, chart Sheet is used.", options: ["formulate", "store", "modify", "print"], answer: 1 },
  { q: "\"LOWER\" is a Text function.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "____ Option is available only in MS-Excel Window.", options: ["Status Bar", "Title Bar", "Menu Bar", "Formula Bar"], answer: 3 },
  { q: "______ Means in built formula basically available in Excel.", options: ["Programs", "Value", "Figures", "Functions"], answer: 3 },
  { q: "In MS-Excel, if we choose style 'Stop'and enter the data against the condition, excel gives error message with two buttons ________ and 'Cancel'.", options: ["Format", "Error", "Retry", "Alert"], answer: 2 },
  { q: "_______ is Power Point file extention.", options: [".docx", ".pptx", ".mdb", ".bmp"], answer: 1 },
  { q: "__________ audio editor software.", options: ["MS-paint", "Adobe Photoshop", "Audacity", "Corel Draw"], answer: 2 },
  { q: "_______ is process in which all slides are displayed one after another?", options: ["Page Show", "Image Show", "Slide Show", "None of these"], answer: 2 },
  { q: "_______ shows slides in full screen", options: ["Zoom", "Show", "Slide Show", "All of these"], answer: 2 },
  { q: "________ is powerful software for making presentation material.", options: ["MS-PowerPo int", "MS- Word", "MS-Outlook", "MS-Excel"], answer: 0 },
  { q: "_______ device can be seen in shops/Malls sale counters", options: ["MICR", "Bar code reader", "Pen drive", "Hard Disk"], answer: 1 },
  { q: "_______ is collection of graphic characters.", options: ["Typeface", "Graphicface", "GraphicChara cter", "None of Above"], answer: 0 },
  { q: "_______ key is used to go to next line.", options: ["Tab", "Enter", "F1", "F5"], answer: 1 },
  { q: "________ are examples of email service provider.", options: ["google", "hotmail", "yahoo", "All of Above"], answer: 3 },
  { q: "________ is example of cyber crime.", options: ["Website Hack", "Bank Account Hack", "Mobile Hack", "All of Above"], answer: 3 },
  { q: "________ is the smallest sized scanner to scan text matter.", options: ["Bar-code device", "Portable Scanner", "Xerox", "Flatbed Scanner"], answer: 1 },
  { q: "________ is used for input of text.", options: ["Scanner", "Keyboard", "Mouse", "Webcam"], answer: 1 },
  { q: "________ is used specifically in computer games", options: ["Bar Code", "MICR", "Joystick", "None of these"], answer: 2 },
  { q: "________ printer is impact printer", options: ["character", "laser", "inkjet", "All of these"], answer: 0 },
  { q: "________ scanners are mostly seen at the billing counters in shops", options: ["Portable Scanner", "Pen Scanner", "Flatbed Scanner", "Bar-code Scanner"], answer: 3 },
  { q: "_________ formula is used to add the numbers in cell of table.", options: ["Sum", "Subtract", "Multiply", "Auto"], answer: 0 },
  { q: "_________ is switch the pages into the portrait and landscape layouts", options: ["View", "Orientation", "Switch", "Insert"], answer: 1 },
  { q: "_________ is used for checking grammer with spellings.", options: ["check language", "translate", "spelling & grammer", "None of these"], answer: 2 },
  { q: "_________ is used to insert content from Clipboard.", options: ["Copy", "Cut", "Paste", "Add"], answer: 2 },
  { q: "_________ is used to translate text into different language", options: ["Translate", "Transfer", "Transform", "Convert"], answer: 0 },
  { q: "_______ Bar is given at the topmost side of 'opening Screen' in Excel", options: ["Tool", "Access", "Title", "Status"], answer: 2 },
  { q: "_______ can be used to different mathematical calculations in Excel.", options: ["Autofill", "Text", "Mid", "Formula"], answer: 3 },
  { q: "_______ is not a logical function.", options: ["AND", "OR", "NOT", "Match"], answer: 3 },
  { q: "_______ is the serial number of a row from table array from which corresponding value is to be given as output.", options: ["Row Index Number", "Index Number", "Column Number", "Row Number"], answer: 0 },
  { q: "_______ option is used to get 1,2,3,4 ... Numbers in Sr. No. Column", options: ["Today", "Average", "Min", "Autofill"], answer: 3 },
  { q: "________ means the effects given in Slide, regarding how the Objects appear during Slide show.", options: ["Animation", "Transition", "World Art", "Clip Art"], answer: 0 },
  { q: "________ shows slides in full screen", options: ["Zoom", "Show", "Slide Show", "All of these"], answer: 2 },
  { q: "__________ using this you can combine the different shapes in to one shape", options: ["Insert", "View", "Group", "Home Tab"], answer: 2 },
  { q: "_________ are ready to use slides with readymade designs.", options: ["New slide", "Template", "Blank Slide", "Existing Slide"], answer: 1 },
  { q: "__________ various Transitions available in MS PowerPoint", options: ["Shred", "Switch", "Flip", "All of these"], answer: 3 },
  { q: "________ type of computer is easy to carry .", options: ["Mini Computer", "Desktop", "Laptop", "Super"], answer: 2 },
  { q: "________ unit is used to store date in the memory of computer.", options: ["cmc", "alu", "bit", "vdu"], answer: 2 },
  { q: "_________ Can be used to send and receive messages.", options: ["Word Processor", "Image editor", "E-mail", "Windows"], answer: 2 },
  { q: "_________ Is a free email program that you can access from any web browser.", options: ["Gmail", "Hotmail", "Yahoo mail", "All of above"], answer: 3 },
  { q: "_________ Is an example of Application Software.", options: ["Interpreter", "Operating System", "Compiler", "Browser"], answer: 3 },
  { q: "________ system helps in faster clearing of cheque in banks", options: ["Scanner", "Bar Code Readers", "Voice Input", "MICR"], answer: 3 },
  { q: "________ system recognizes commands given by speech", options: ["Voice", "Light", "MICR", "Bar Code"], answer: 0 },
  { q: "________ type of internal memory can permanently store data even through the Electricity supply is switched OFF.", options: ["ROM", "RAM", "External", "Secondary"], answer: 0 },
  { q: "_________ indicates signal is off", options: ["0", "1", "Off", "Switch"], answer: 0 },
  { q: "_________ are types of computer", options: ["Analogue", "Digital", "Both A and B", "None of Above"], answer: 2 },
  { q: "_________ option is used for checking grammar with spellings", options: ["Grammar & spelling", "Spelling", "Check", "Grammar"], answer: 0 },
  { q: "_________ shortcut key is used to give Center alignment", options: ["Alt+E", "Ctrl+E", "Ctrl + L", "Ctrl+T"], answer: 1 },
  { q: "_________ shortcut key is used to give left alignment", options: ["Alt+L", "Ctrl+ I", "Ctrl + L", "Ctrl+T"], answer: 2 },
  { q: "_________ shortcut key is used to give right alignment", options: ["Ctrl+L", "Ctrl+ R", "Ctrl+Right", "Alt +R"], answer: 1 },
  { q: "_________ Shortcut key is used to paste a matter in MS-WORD", options: ["Ctrl + V", "Alt + V", "Ctrl + C", "Ctrl + D"], answer: 0 },
  { q: "________ is valid numeric form in Match function of MS-Excel.", options: ["Match Type(0)", "Match Type(1)", "Match Type(-1)", "All of these"], answer: 3 },
  { q: "________ is NOT valid numeric form in Match function of MS-Excel.", options: ["Match Type(10)", "Match Type(0)", "Match Type(1)", "Match Type(-1)"], answer: 0 },
  { q: "________ are logical functions in MS-Excel.", options: ["AND", "OR", "NOT", "All of these"], answer: 3 },
  { q: "________ command is used for error checking in MS-Excel.", options: ["show error", "display error", "debug", "Trace error"], answer: 3 },
  { q: "________ command is used to display only the records satisfying certain condition and hiding other records in MS-Excel.", options: ["Merge", "Filter", "Wrap", "Sort"], answer: 1 },
  { q: "___________ chart display trends overtime", options: ["Pie", "Line", "Bar", "Area"], answer: 1 },
  { q: "__________ application of Microsoft is used to create slide show.", options: ["MS-PowerPo int", "MS-Word", "MS-Access", "MS-Excel"], answer: 0 },
  { q: "___________ is the representation of a numbers and text.", options: ["Chart", "Wortart", "Picture", "Cliparts"], answer: 0 },
  { q: "___________ is video editing software", options: ["Windows Movie Maker", "Adobe after effects", "Corel Video Studio", "All of Above"], answer: 3 },
  { q: "__________ are Transitions available in MS PowerPoint", options: ["Fade", "Push", "Wipe", "All of these"], answer: 3 },
  { q: "_________ Is standard Internet Protocol.", options: ["IPX", "SPX", "TCP / IP", "ITC"], answer: 2 },
  { q: "_________ Is the biggest Network in the world.", options: ["LAN", "CAN", "Internet", "WAN"], answer: 2 },
  { q: "_________ is the most common Internet Protocol.", options: ["TCP/IP", "HTML", "IPX/SPX", "Net/Up"], answer: 0 },
  { q: "_________ means contains some education information.", options: [".com", ".edu", ".gov", ".in"], answer: 1 },
  { q: "_________ are font formatting's", options: ["Bold", "Italic", "Underline", "All of Above"], answer: 3 },
  { q: "_________ computer is usually used in offices for work at desk.", options: ["Desktop", "Laptop", "Handheld", "None of these"], answer: 0 },
  { q: "_________ device is mostly used to provide directions to the computer, while playing the computer games.", options: ["Mouse", "Keyboard", "Joystick", "Printer"], answer: 2 },
  { q: "_________ device is used to translate Digital data into Analog data.", options: ["Memory", "HDD", "Mother Board", "Modem"], answer: 3 },
  { q: "_________ input system uses voice recognition system", options: ["Voice", "Text", "Video", "None of Above"], answer: 0 },
  { q: "_________ is input device", options: ["Printer", "Projector", "Light Pen", "OHP"], answer: 2 },
  { q: "_________ tab is used for mail merge", options: ["Data", "Mailing", "Review", "View"], answer: 1 },
  { q: "__________ bar is at the bottom of the window", options: ["Status", "Title", "Home", "Tool"], answer: 0 },
  { q: "__________ bar is at the top of the window", options: ["File", "Home", "Insert", "Title"], answer: 3 },
  { q: "__________ can be used to set margins and indents in Document.", options: ["Status Area", "Ruler Line", "Status Bar", "Toolbar"], answer: 1 },
  { q: "__________ cancels command given earlier", options: ["Repeat", "Redo", "Undo", "Cancel"], answer: 2 },
  { q: "________ command is used to sort the data in MS-Excel.", options: ["Sort", "Merge", "Filter", "Wrap"], answer: 0 },
  { q: "________ command removes all auditing arrows in MS-Excel.", options: ["Remove", "Delete arrows", "Cut arrows", "Remove all arrows"], answer: 3 },
  { q: "________ function checks negative condition.", options: ["AND", "OR", "NOT", "SUM"], answer: 2 },
  { q: "________ is a correct syntax of AND function in MS-Excel.", options: ["AND (A+B+C)", "AND(IF)", "AND (Logical Test1, Logical Test 2 … … ..)", "AND(A:A5)"], answer: 2 },
  { q: "________ is a correct syntax of NOT function in MS-Excel.", options: ["NOT (A+B+C)", "NOT (IF)", "NOT (A1:A5))", "NOT (Logical Test)"], answer: 3 },
  { q: "___________ software has been developed by microsoft company to create a multi media presentation.", options: ["Aftereffects", "Photopaint", "Moviemaker", "Flash"], answer: 2 },
  { q: "__________ can be inserted in PowerPoint presentation.", options: ["Paper", "Page", "Hyperlink", "None of these"], answer: 2 },
  { q: "__________ is added to a slide to illustrate and compare data", options: ["Chart", "Images", "Clip art", "Line"], answer: 0 },
  { q: "__________ is available only in Powerpoint.", options: ["Slide Show", "Window", "View", "Format"], answer: 0 },
  { q: "____________ click screen clipping to insert picture of any part of the screen", options: ["Screenshot", "View", "File", "Copy"], answer: 0 },
  { q: "_________ Cables are more safe than coaxial cables.", options: ["Fiber-Optic", "Twisted optics", "Shield Twisted optics", "None of above"], answer: 0 },
  { q: "_________ domain means military Web Site", options: ["mil", "edu", "com", "gov"], answer: 0 },
  { q: "_________ is a type of flash drive.", options: ["CD", "Pen drive", "Hard Disk", "Floppy disc"], answer: 1 },
  { q: "_________ is necessary to connect our Computer with Internet.", options: ["Telephone Instrument", "Modem", "CD Drive", "Pen Drive"], answer: 1 },
  { q: "_________ Is standard Internet Protocol", options: ["IPX", "SPX", "ITC", "TCP / IP"], answer: 3 },
  { q: "_________ is most commonly used pointing device.", options: ["Scanner", "Keyboard", "Mouse", "Webcam"], answer: 2 },
  { q: "_________ is most powerful computer", options: ["Micro", "Mini", "Mainframe", "Super"], answer: 3 },
  { q: "_________ is not characteristic of computer", options: ["Ample Storage", "Automation", "To think and Emote", "Versatility"], answer: 2 },
  { q: "_________ is open platform by Internet for people to interact and share their thoughts.", options: ["Shopping cart", "Social Networking", "Ecommerce", "Trading sites"], answer: 1 },
  { q: "_________ is type of printer", options: ["character", "laser", "inkjet", "All of Above"], answer: 3 },
  { q: "__________ from this button we can open and save file", options: ["Main", "File", "Formula", "View"], answer: 1 },
  { q: "__________ is collection of programs", options: ["Software", "Hardware", "System", "Information"], answer: 0 },
  { q: "__________ is graphic and process diagrams to visually communicate information", options: ["Chart", "Object", "Smartart", "Data"], answer: 2 },
  { q: "__________ item is printed at the bottom of each page", options: ["Header", "Footer", "End", "Bottom"], answer: 1 },
  { q: "__________ made up of rows and columns", options: ["Cell", "Table", "Word", "None of these"], answer: 1 },
  { q: "________ is a correct syntax of OR function in MS-Excel.", options: ["OR (IF)", "OR (Logical Test1, Logical Test 2 … … ..)", "OR (A+B+C)", "OR (A1:A5)"], answer: 1 },
  { q: "________ is a date function n MS-Excel.", options: ["Max ()", "Min ()", "Today ()", "AND ()"], answer: 2 },
  { q: "________ is a type of chart in MS-Excel.", options: ["Scatter", "Pie", "Line", "All of these"], answer: 3 },
  { q: "________ is the correct option to sort data after selecting it in MS Excel 2019 .", options: ["page layout tab and click on sort", "click on view tab -> sort button", "review tab -> sorting data", "data tab -> sort"], answer: 3 },
  { q: "________ is used for storing the chart in MS-Excel.", options: ["Table", "functions", "Chart sheet", "Formulae"], answer: 2 },
  { q: "__________ is extension for Presentation in Office 2019", options: [".docx", ".pptx", ".accdb", ".prst"], answer: 1 },
  { q: "__________ is not available in PowerPoint.", options: ["Spelling Checker", "Thesaurus", "Translate", "None of these"], answer: 3 },
  { q: "__________ is used to create best presentation.", options: ["MS Word", "Excel worksheet", "Notepad", "Powerpoint"], answer: 3 },
  { q: "__________ is used to create business presentations", options: ["MS Word", "MS Excel", "MS PowerPoint", "MS Presenter"], answer: 2 },
  { q: "_____________ is used to remove one letter immediately at the back cursor", options: ["Delete", "Backspace", "Back", "Enter"], answer: 0 },
  { q: "_________ is WAN type of network.", options: ["Internet", "Browser", "Webpage", "Home page"], answer: 0 },
  { q: "_________ means government Web Site.", options: ["edu", "net", "gov", "com"], answer: 2 },
  { q: "_________ memory device is built in a computer's CPU Cabinet.", options: ["CD", "Pen drive", "Hard Disk", "Floppy disc"], answer: 2 },
  { q: "_________ shortcut key is used to see all the list of Internet Addresses.", options: ["F1", "F2", "F3", "F4"], answer: 3 },
  { q: "__________ are examples of E-Commerce sites.", options: ["Amazon", "Flipkart", "Snapdeal", "All of Above"], answer: 3 },
  { q: "_________ is used for projection on screen on large wall", options: ["Printer", "Monitor", "Projector", "HDTV"], answer: 2 },
  { q: "_________ is used in banks for cheque number printing", options: ["Voice", "Light", "MICR", "Bar Code"], answer: 2 },
  { q: "_________ keys are called Toggle keys", options: ["Scroll Lock", "Num Lock", "Shift", "Both A and B"], answer: 3 },
  { q: "_________ Keys are combination keys", options: ["Ctrl", "Alt", "Shift", "All of these"], answer: 3 },
  { q: "_________ Keys are NOT combination keys", options: ["Ctrl", "Tab", "Alt", "Shift"], answer: 1 },
  { q: "__________ means set of data", options: ["File", "Computer", "Instruction", "Command"], answer: 0 },
  { q: "__________ option is used to delete the rows and columns", options: ["Table", "Delete", "Backspace", "Remove"], answer: 1 },
  { q: "__________ tab contain page setup, page background, Thems, Paragrah and arrage.", options: ["Page Layout", "Page", "Data", "Review"], answer: 0 },
  { q: "___________ used to search the specific letter or word from the document", options: ["Find", "Search", "View", "Show"], answer: 0 },
  { q: "___________ Can be used to set margins and indents in Document.", options: ["Status area", "Ruler line", "Status bar", "Title Bar"], answer: 1 },
  { q: "________ is used to give better effect to numerical data in MS-Excel.", options: ["Wrap Text", "Merge", "Chart", "Filter"], answer: 2 },
  { q: "________ means such column of table in which Lookup value is to be searched.", options: ["Lookup value", "Lookup Cell", "LookUp Vector Column", "Lookup Range"], answer: 2 },
  { q: "________ option is used for applying sum, average, count, etc. on the data from different Excel sheets.", options: ["Data Conversion", "Data Updation", "Data Consolidation", "Data Entry"], answer: 2 },
  { q: "________ option is used to step by step evaluate and analyze formula in MS-Excel.", options: ["Formula", "Check Formula", "Evaluate Formula", "Find Formula"], answer: 2 },
  { q: "________ option shows formula in MS-Excel.", options: ["Show Formula", "Show Cell Formula", "Show from", "Formula view"], answer: 0 },
  { q: "__________ view is not available in PowerPoint", options: ["Normal", "Web Layout", "Reading View", "None of these"], answer: 1 },
  { q: "___________ are transitions available in PowerPoint", options: ["Fade", "Push", "Wipe", "All of these"], answer: 3 },
  { q: "___________ inserts current date and/or time to the current presentation.", options: ["Current Date", "Current Time", "Date & Time", "None of these"], answer: 2 },
  { q: "______________ is a video file type.", options: [".mp4", ".txt", ".png", ".mp3"], answer: 0 },
  { q: "______________ is a tag used in HTML to insert Multimedia Object.", options: ["<input>", "<head>", "<Object>", "<html>"], answer: 2 },
  { q: "__________ are parts of email", options: ["to", "subject", "body", "All of Above"], answer: 3 },
  { q: "__________ corrupts the file.", options: ["Antivirus", "Screen Saver", "Virus", "Memory"], answer: 2 },
  { q: "__________ is a input device used in computer games or navigation system.", options: ["Joystick", "Voice Input", "Keyboard", "Monitor"], answer: 0 },
  { q: "__________ is a light sensitive input device.", options: ["Keyboard", "Light Pen", "Monitor", "Voice Input"], answer: 1 },
  { q: "__________ is a part of operating system that lets the user communicate with the computer.", options: ["Hard Disk", "DVD", "User Interface", "Memory"], answer: 2 },
  { q: "_________ memory cannot be changed or modified", options: ["RAM", "ROM", "Cache", "All of Above"], answer: 1 },
  { q: "_________ memory is erased on power cut", options: ["Cache", "ROM", "RAM", "All of Above"], answer: 2 },
  { q: "_________ memory is NOT erased on power cut", options: ["HDD", "ROM", "Both A and B", "None of Above"], answer: 2 },
  { q: "_________ needs to be kept confidential for security.", options: ["passwords", "nodes", "server", "email ID"], answer: 0 },
  { q: "_________ operations are mathematical calculations", options: ["Bitwise", "Arithmatic", "Logical", "Binary"], answer: 1 },
  { q: "___________ change the overall design of the entire document", options: ["Page Layout", "Theme", "Review", "Data"], answer: 1 },
  { q: "___________ effect is increase the size of first character in Paragraph", options: ["Drop cap", "Style", "Text", "Font"], answer: 0 },
  { q: "___________ facility is used to add unorder list in your document", options: ["Bullets", "Numbering", "Unorder", "Order"], answer: 0 },
  { q: "___________ Highlights interesting cells as per condition given", options: ["Highlighter", "Condition Highlighter", "Conditional Formatting", "Format painter"], answer: 2 },
  { q: "___________ is most of the used for documentation and formatting", options: ["Ms-Excel", "Ms-Word", "Ms-access", "Ms-Powerpoin t"], answer: 1 },
  { q: "_________ is a logical function.", options: ["AND", "OR", "NOT", "All of these"], answer: 3 },
  { q: "____________ function is used to search lookup value in the given Lookup Vector Column.", options: ["Hlook", "Lookup(Vect or)", "Vlook", "Look"], answer: 1 },
  { q: "_____________ Is use to Find Cell data.", options: ["Ctrl+K", "Ctrl+F", "Ctrl+S", "Ctrl+X"], answer: 1 },
  { q: "_______________is used to show the full contents (text/Number)in any column.", options: ["column width", "Row Height", "Autofit Row", "Autofit Column Width"], answer: 3 },
  { q: "__________Function converts the number into nearest integer.", options: ["Round()", "Min()", "if()", "int()"], answer: 3 },
  { q: "______________ is an animation creator software.", options: ["MS-paint", "Macromedia Flash", "Gold Wave", "Corel Draw"], answer: 1 },
  { q: "___________ is size of on screen show.", options: ["4 : 3", "16 : 9", "16 : 10", "All of these"], answer: 3 },
  { q: "_______________ is a mixture of sound, animation, graphics, text and video.", options: ["MovieMedia", "Multimedia", "Moving Media", "MultiMixing"], answer: 1 },
  { q: "___________ means to set the style of the text it has multiple types.", options: ["Font", "Size", "color", "None of these"], answer: 0 },
  { q: "___________ tab is available only in PowerPoint.", options: ["Window", "Slide Show", "Format", "Home"], answer: 1 },
  { q: "__________ is checking the essential parts of computers.", options: ["Memory Management", "File Management", "Hardware Management", "None of the options"], answer: 2 },
  { q: "__________ is created specifically for online cyber crimes.", options: ["Cyber Law", "Crime Law", "New Law", "None of Above"], answer: 0 },
  { q: "__________ is example of search engine", options: ["google", "khoj", "altavista", "All of Above"], answer: 3 },
  { q: "__________ is measurement used to measure font", options: ["inch", "cm", "point", "None of Above"], answer: 2 },
  { q: "__________ is used to search information on internet", options: ["search engine", "search machine", "Information Search", "information machine"], answer: 0 },
  { q: "_________ provides legal validity to all types of Digital records.", options: ["Interior Techinic Act", "Inetworld Technology Acting", "Labour Law", "Information Technology Act"], answer: 3 },
  { q: "_________ type of computers combine features of both analog and digital computers.", options: ["Hybrid", "Super", "Mainframe", "All of Above"], answer: 0 },
  { q: "_________ Unit of computer is used to convey the result to the user.", options: ["Arithmetic Logic", "Control", "Input", "Output"], answer: 3 },
  { q: "__________ are most powerful and efficient computers.", options: ["Super Computers", "Mainframe", "Mini Computers", "Micro Computers"], answer: 0 },
  { q: "__________ Are not display devices.", options: ["Printer", "Hdtv", "Projector", "None of these"], answer: 0 },
  { q: "___________ is the combination of Rows and Columns.", options: ["Border", "Table", "TextBox", "Rectangle"], answer: 1 },
  { q: "___________ is used to mark each and every point for order list", options: ["Border", "Numbering", "Order", "Unorder"], answer: 1 },
  { q: "___________ is used to add clip art in your document", options: ["Insert", "Review", "View", "Page layout"], answer: 0 },
  { q: "___________ is used to reverse action of undo", options: ["Redo", "Repeat", "Reverse", "Cancel"], answer: 0 },
  { q: "___________ joins the selected cells into one larger cell and centers the contents in new cell", options: ["Merge & Center", "Merge", "Center", "Connect"], answer: 0 },
  { q: "_________Function makes the text given in the brackets converted into capital cases and inserted in the cell", options: ["Case()", "Lower()", "Capital()", "Upper()"], answer: 3 },
  { q: "________Function makes the text given in the brackets converted into small cases and inserted in the cell", options: ["Case()", "Lower()", "Capital()", "Upper()"], answer: 1 },
  { q: "_______is the Function in Lookup category.", options: ["AND", "OR", "NOT", "Match"], answer: 3 },
  { q: "_______is the Function not available in Lookup category.", options: ["AND", "VLookup", "HLookup", "Match"], answer: 0 },
  { q: "______Function makes the number given in the brackets round to the number upto specific digits.", options: ["Case()", "Round()", "Max()", "if()"], answer: 1 },
  { q: "___________ view is available in PowerPoint", options: ["Normal", "Notes Page", "Reading View", "All of these"], answer: 3 },
  { q: "____________ can be referred by the speaker while giving a presentation.", options: ["Speaker's Note", "layout", "Slide", "Document"], answer: 0 },
  { q: "____________ is the shortcut key to open a PowerPoint presentation.", options: ["Ctrl+O", "Ctrl+N", "Ctrl+S", "Ctrl+M"], answer: 0 },
  { q: "____________ pointer helps to draw line to understand our speech or statements while slide show.", options: ["Pen", "Arrow", "New", "Animation"], answer: 0 },
  { q: "____________ view is not available in PowerPoint", options: ["Normal", "Notes Page", "Draft", "None of these"], answer: 2 },
  { q: "__________ is widely used software for image editing", options: ["Paint", "PhotoShop", "CorelDraw", "PageMaker"], answer: 1 },
  { q: "__________ key combination opens the start menu in windows 10.", options: ["Ctrl + F10", "Ctrl + Esc", "Ctrl + F5", "Ctrl + Home"], answer: 1 },
  { q: "__________ protocol transfer hyper text tags and data to user understandable GUI.", options: ["HTTP", "HGUI", "HTUI", "None of Above"], answer: 0 },
  { q: "__________ type of CD is similar to use of Floppy disc.", options: ["CD-ROM", "CD-R", "CD-RW", "None of these"], answer: 2 },
  { q: "___________ Is given on address bar in Internet Explorer.", options: ["Website Address", "Web URL", "E-mail Address", "Both A & B"], answer: 3 },
  { q: "__________ are second fastest computers after super computers.", options: ["Mainframe", "Mini Computers", "Micro Computers", "Super Computers"], answer: 0 },
  { q: "__________ are superlative in terms of capacity and most expensive..", options: ["Super Computers", "Mainframe", "Mini Computers", "Micro Computers"], answer: 0 },
  { q: "__________ are types of micro computers.", options: ["DESKTOP", "LAPTOP", "HANDHELD", "ALL OF ABOVE"], answer: 3 },
  { q: "__________ can be fit into the palm and by moving it over the image, the image is scanned.", options: ["Flatbed Scanner", "Pen Scanner", "Fax Machine", "Portable Scanner"], answer: 3 },
  { q: "__________ can process billions instructions per second.", options: ["Mainframe", "Mini Computers", "Micro Computers", "Super Computers"], answer: 3 },
  { q: "___________ make all content visible within a cell displaying it on multiple lines", options: ["Multiple", "Text spacing", "Multitext", "Wrap Text"], answer: 3 },
  { q: "___________ means placing a coloured rectangle over on text", options: ["Highlighter", "Selection", "Editing", "Colouring"], answer: 0 },
  { q: "___________ option is used to send your saved document", options: ["Save", "Send", "File", "Open"], answer: 2 },
  { q: "___________ shortcut key is used for cut the selection text.", options: ["Ctrl+ C", "Ctrl+V", "Ctrl+X", "Ctrl+A"], answer: 2 },
  { q: "___________ shortcut key is used for Underline", options: ["Ctrl+B", "Ctrl+I", "Ctrl+U", "Alt +U"], answer: 2 },
  { q: "______Option is available only in MS_EXCEL Window.", options: ["Status Bar", "Formula Bar", "Menu bar", "Title Bar"], answer: 1 },
  { q: "___Means in built formula basically available in Excel", options: ["Programs", "Value", "Figures", "Functions"], answer: 3 },
  { q: "= lower() function is used to convert the provided text into small cases.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "= Upper() function is used to convert the provided text into ----------", options: ["Small", "Capital", "Small Caps", "Title only"], answer: 1 },
  { q: "=LEN() is used to find the length of the string.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "_____________ inserts decorative text in your presentation.", options: ["Word Art", "Decorative Word", "Art Word", "Art Text"], answer: 0 },
  { q: "_____________ is a type of slide in PowerPoint", options: ["Title only", "status", "Line", "Circle"], answer: 0 },
  { q: "_____________ option is used to see slide show at some particular time pause.", options: ["Time", "Rehearse Time", "Automatic", "Watch"], answer: 1 },
  { q: "____________Includes a combination of Text, Audio, Still Images, Video & Animation", options: ["Web Authoring", "Graphics", "Multimedia", "Project Managers"], answer: 2 },
  { q: "________device is used to draw objects like lines, rectangle, oval shapes", options: ["Mouse", "Joystick", "MICR", "Bar Code"], answer: 0 },
  { q: "___________ and ____________ are used in internet", options: ["server, megaserver", "machine, telephone", "server, client", "machine, client"], answer: 2 },
  { q: "___________ Are used to give output in printed form.", options: ["Scanners", "Printers", "Monitors", "CPU"], answer: 1 },
  { q: "___________ bytes= 1 kilobytes", options: ["1000", "1040", "1042", "1024"], answer: 3 },
  { q: "___________ can effect the boot sector of the computer.", options: ["Boot sector Virus", "File Virus", "Antivirus", "Memory"], answer: 0 },
  { q: "___________ Computers have size of a notebook and can be accommodated in a briefcase.", options: ["Mainframe", "Super", "Laptop", "Mini"], answer: 2 },
  { q: "__________ computer can perform both Digital and Analogue operations", options: ["Digital", "Analogue", "Hybrid", "None of Above"], answer: 2 },
  { q: "__________ computer operated on digital data such as numbers..", options: ["Analogue", "Digital", "BOTH A AND B", "NONE OF ABOVE"], answer: 1 },
  { q: "__________ convert hard copy to optically scanned digital image", options: ["Printer", "Scanner", "Webcam", "None of Above"], answer: 1 },
  { q: "__________ indicates the current position, where the character which we type is going to appear.", options: ["Mouse", "Keyboard", "Office Assistant", "Curser"], answer: 3 },
  { q: "__________ is a brain of computer", options: ["CPU", "MMC", "FDD", "All of Above"], answer: 0 },
  { q: "____________ increase the margin between the border and cell", options: ["Increase", "Increase Indent", "Decrease Indent", "Indentation"], answer: 1 },
  { q: "____________ is used to magnify the data", options: ["Zoom", "Resize", "Font style", "View"], answer: 0 },
  { q: "____________ key is use for creating the new paragraph after the previous paragraph in the doucment.", options: ["Enter Key", "Down Cursor Key", "Shift Key", "Ctrl"], answer: 0 },
  { q: "____________ make it easy to sort ,filter and format data within the sheet", options: ["Data", "Table", "Information", "Text"], answer: 1 },
  { q: "____________ option is used to adjust column width automatically so as to fit all text in column", options: ["Autofit", "Fit", "Adjust", "Correct"], answer: 0 },
  { q: "=round() function rounds off the given number upto a specific digit limit.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "A Collection of worksheets is known as ----------", options: ["Workbook", "Worknote-bo ok", "Work document", "Chart Book"], answer: 0 },
  { q: "A Column letter of the grid, also called as............, identified each column.", options: ["Column Heading", "Column Reference", "Name reference", "Cell reference"], answer: 0 },
  { q: "A dark colored strip showing the title at the top of MS- Excel window is called as _______", options: ["Status Bar", "Title Bar", "Scroll Bar", "None of these"], answer: 1 },
  { q: "A formula in Excel always has to start with (fx).", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "_____________ tab is not present in PowerPoint.", options: ["Design", "Data", "Review", "View"], answer: 1 },
  { q: "_____________ view is useful to type matter on slide.", options: ["Print Layout", "Outline", "Normal", "Nome of the above"], answer: 2 },
  { q: "Animation refferes to a combination of text, graphics, sound animation and video.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "Audio / Sound data can be input through _______ device.", options: ["Mouse", "Microphone", "Hard Disk", "Microprocesso r"], answer: 1 },
  { q: "Audio file can be played in _________ program.", options: ["media player", "paint", "corel", "ms-word"], answer: 0 },
  { q: "___________ Is a digital circuit which performs addition of binary numbers.", options: ["Subtractor", "Adder", "Register", "Accumulator"], answer: 1 },
  { q: "___________ is another name of client", options: ["node", "point", "server", "None of Above"], answer: 0 },
  { q: "___________ is collection of interconnected networks.", options: ["Adhoc network", "Wireless network", "Mobile network", "Internet"], answer: 3 },
  { q: "___________ is default browser in windows", options: ["Mozilla", "Navigator", "Internet Explorer", "None of Above"], answer: 2 },
  { q: "___________ is examples of cloud storage", options: ["Google Drive", "Yahoo Briefcase", "Microsoft One Drive", "All of Above"], answer: 3 },
  { q: "__________ is called photoelectric scanners.", options: ["Pen Scanner", "Bar code reader", "Portable Scanner", "Flatbed scanner"], answer: 1 },
  { q: "__________ is interconnected network.", options: ["printer", "Internet", "Web site", "Home page"], answer: 1 },
  { q: "__________ Is not output device", options: ["Speakers", "Monitor", "Printer", "None of these"], answer: 3 },
  { q: "__________ Is permanent memory", options: ["Ram", "Rom", "Cache", "None of these"], answer: 1 },
  { q: "__________ is primary memory", options: ["RAM", "HDD", "FDD", "All of Above"], answer: 0 },
  { q: "_____________ access toolbar contain save, undo and redo option", options: ["Home", "Quick", "View", "Review"], answer: 1 },
  { q: "_____________ create a large capital letter as a beginning of paragraph", options: ["Insert", "Dropcap", "Page layout", "Add"], answer: 1 },
  { q: "_____________ default alignment in ms-word", options: ["Right", "Left", "Center", "Justify"], answer: 1 },
  { q: "_____________ function key is used for spelling and grammer", options: ["F7", "F6", "F5", "F4"], answer: 0 },
  { q: "_____________ is used to change the color of text", options: ["Color", "Font Color", "Change", "Font"], answer: 1 },
  { q: "A group of more than one selected cells is known as ________", options: ["Cell Range", "Row", "Column", "Table"], answer: 0 },
  { q: "A long horizontal box appeared at the right side of the name box is called as formula bar.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "A single worksheet has _____ columns", options: ["16000", "16384", "17000", "17384"], answer: 1 },
  { q: "A single worksheet has _____ rows", options: ["10,48,576", "11,00,000", "12,00,000", "None of these"], answer: 0 },
  { q: "A thick border displayed around the active cell is known as _______", options: ["Cell Pointer", "Selection", "Border", "Outline"], answer: 0 },
  { q: "Basic Shapes insert from ---------------", options: ["Insert =>Shapes", "Insert =>Basic Shapes", "Home =>Basic Shapes", "Page Layout =>Insert Shapes"], answer: 0 },
  { q: "_____________ will not be shown during full screen presentation.", options: ["First Slide", "Last Slide", "Hide Slide", "None of these"], answer: 2 },
  { q: "______________ view is available in PowerPoint", options: ["Slide Mater", "Handout Mater", "Notes Master", "All of these"], answer: 3 },
  { q: "______________ view used to show slide presentation.", options: ["Slide Show", "Presentation", "File", "Template"], answer: 0 },
  { q: "_______________ is applied to objects such as text, Shapes.", options: ["Animation", "Transition", "Both A and B", "None of Above"], answer: 0 },
  { q: "___________ is main computer in network which provides information to other computers.", options: ["node", "server", "client", "None of Above"], answer: 1 },
  { q: "___________ is opening, copying and deleting files and folders etc.", options: ["Memory Management", "File Management", "Hardware Management", "None of these"], answer: 1 },
  { q: "___________ uses the technique of Non-impact printing.", options: ["Ink-Jet Printer", "Line Printer", "Both A & B", "None of the options"], answer: 2 },
  { q: "___________ Virus disturbs the files having .com or .exe extensions.", options: ["Boot", "Bug", "File", "Blog"], answer: 2 },
  { q: "____________ cards is used in digital Cameras, Mobile Phones, MP3 Players etc.", options: ["MICR", "Bar code reader", "Flash drive", "Flash Memory"], answer: 3 },
  { q: "__________ is secondary memory.", options: ["HARD DISK", "PEN DRIVE", "CD/DVD", "ALL OF ABOVE"], answer: 3 },
  { q: "__________ law is created for crimes that happen on cyber space.", options: ["Cyber Law", "Cyber crime", "Hacking", "Browsing"], answer: 0 },
  { q: "__________ memory Device is permanently fixed into CPU cabinet of Computer", options: ["Floppy Disk", "Hard Disk", "CD", "Pen Drive"], answer: 1 },
  { q: "__________ Memory is temporary memory", options: ["ROM", "Virtual", "RAM", "External"], answer: 2 },
  { q: "__________ memory is temporary memory which acts as buffer between ram and processor.", options: ["RAM", "ROM", "CACHE", "NONE OF ABOVE"], answer: 2 },
  { q: "_____________ is used to change the size of paper", options: ["Paper setup", "Page size", "Page Setup", "View"], answer: 2 },
  { q: "_____________ is used to connect two or more documents with each other", options: ["Connect", "Hyperlink", "Join", "Attach"], answer: 1 },
  { q: "_____________ option is used to clear formatting", options: ["Format", "Clear formatting", "Clear", "Remove"], answer: 1 },
  { q: "______________ effect drawn line between the text", options: ["Line", "Strikethrough", "linethrough", "through"], answer: 1 },
  { q: "______________ is extension of Ms-word", options: [".xlsx", ".docx", ".ppt", ".word"], answer: 1 },
  { q: "A Worksheet may contain more than 3 worksheets", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "According to the desired output, if we want to calculate input value then _________ facility in Excel can be used.", options: ["Goal Seek", "Scenario Manager", "Data Table", "None of these"], answer: 0 },
  { q: "Addition of cells B4 & F7 can be done using _____ Formula", options: ["=B4*F7", "=B4+F7", "=B4@F7", "=B4/F7"], answer: 1 },
  { q: "After applying filter in MS-Excel, records remain hidden permanently.", options: ["True", "False"], answer: 1 },
  { q: "After formula being copied and paste In new cell, the cell references which automatically get changed are called as _____", options: ["Link", "Relative References", "Concerned References", "Absolute References"], answer: 1 },
  { q: "_______________ is applied to slides.", options: ["Animation", "Transition", "Both A and B", "None of Above"], answer: 1 },
  { q: "_______________ is slide layout in PowerPoint", options: ["Master Slide", "Main Slide", "Title Slide", "None of Above"], answer: 2 },
  { q: "_______________ is slide layout in PowerPoint", options: ["Master Slide", "Main Slide", "Title Slide", "None of these"], answer: 2 },
  { q: "_______________ is useful for making presentation at professional level.", options: ["MS-PowerPo int", "MS-Word", "MS-Excel", "MS-Access"], answer: 0 },
  { q: "_______________ transition are available in PowerPoint", options: ["Entrance", "Exit", "Emphasis", "Flip"], answer: 3 },
  { q: "____________ computer consist of features related to analog as well as digital computer", options: ["Super", "Mainframe", "Micro", "Hybrid"], answer: 1 },
  { q: "____________ input devices can be seen in ATM machines and mobile phones.", options: ["Joystick", "Light Pen", "Touchscreen", "Mouse"], answer: 2 },
  { q: "____________ is a digital circuit which performs subtraction of binary numbers", options: ["Subtractor", "Adder", "Register", "Accumulator"], answer: 0 },
  { q: "____________ is a type of output device.", options: ["Voice Input", "Speaker", "Keyboard", "None of these"], answer: 1 },
  { q: "____________ is accepting information from server", options: ["server", "client", "node", "None of Above"], answer: 1 },
  { q: "__________ memory works like waiting area for data to be processed", options: ["Cache", "ROM", "RAM", "None of Above"], answer: 0 },
  { q: "__________ number system includes only 2 digits.", options: ["Octal", "Decimal", "Binary", "Hexa-Decimal"], answer: 2 },
  { q: "__________ printer create annoying sound and mostly used in railway ticket counters.", options: ["Ink", "Dot Matrix", "Dye Sublimation", "Toner"], answer: 1 },
  { q: "__________ printer is used to print images like engineering drawing, maps etc.", options: ["Plotter", "Dot Matrix", "Inkjet", "Laser"], answer: 0 },
  { q: "__________ printers use heat sensitive paper to create impressions.", options: ["Thermal Printers", "Dot Matrix Printers", "Laser Printers", "Plotters"], answer: 0 },
  { q: "______________ is the shortcut key is used for print", options: ["Ctrl+A", "Ctrl+P", "Ctrl+S", "Alt +P"], answer: 1 },
  { q: "_______________ option is used converts text to columns", options: ["Change", "Convert", "Text to column", "Data"], answer: 2 },
  { q: "_______________ is used to apply image as a background", options: ["Image", "Page Layout", "Background", "Picture"], answer: 3 },
  { q: "________________ is containing of Rows and Columns.", options: ["Text Box", "Rectangle", "Borders", "Table"], answer: 3 },
  { q: "________________ is shortcut key is used for Undo", options: ["Ctrl+C", "Ctrl+C", "Ctrl+Z", "Ctrl+N"], answer: 2 },
  { q: "After protecting workbook, we can add worksheet in the workbook.", options: ["True", "False"], answer: 1 },
  { q: "After starting MS-Excel 2019, we see _____ file by default", options: ["Book1", "Document1", "Presentation1", "None of these"], answer: 0 },
  { q: "Alignments of cell in Excel sheet can be done by_______", options: ["Files / Cells", "Format / Cells", "FTP / Align", "None of these"], answer: 1 },
  { q: "All commands are given in tab and ribbon format in MS Excel 2019 .", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "All of these are Excel Features except ------------", options: ["Office Assistant", "The Help Wizard", "Charts", "The Indent Tab"], answer: 3 },
  { q: "By using _____option, we can add the cell comments", options: ["contents", "Cell contents", "Comments", "None of these"], answer: 2 },
  { q: "Chart Legend Can be ___________", options: ["Can be move", "Cannot be move", "Never Move", "Move to center of chart"], answer: 0 },
  { q: "________________ view presentation as a slide show that fits within the window and confortable for reading.", options: ["Normal", "Slide Sorter", "Notes Page", "Reading View"], answer: 3 },
  { q: "_________________ is used to show the animation pane to create custom animation.", options: ["Transition Pane", "Slide Pane", "Animation Pane", "None of these"], answer: 2 },
  { q: "____________________ is a type of slide in PowerPoint", options: ["Title only", "status", "Line", "Circle"], answer: 0 },
  { q: "____________ is example of social networking", options: ["Facebook", "Blog", "Twitter", "All of Above"], answer: 3 },
  { q: "____________ is largest network in world.", options: ["Internet", "worldnet", "hugenet", "None of Above"], answer: 0 },
  { q: "____________ is necessary to connect our Computer with Internet", options: ["Modem", "Telephone Instrument", "CD Drive", "Pen Drive"], answer: 0 },
  { q: "____________ is online open platform for people", options: ["Social Networking", "Networking", "Internet", "None of Above"], answer: 0 },
  { q: "____________ is provided to the computer as input.", options: ["Data", "Paper", "Both A & B", "None of the options"], answer: 0 },
  { q: "__________ printers use toner to print on paper.", options: ["Ink Jet Priters", "Dot Matrix Priters", "Laser Printers", "Plotters"], answer: 2 },
  { q: "__________ unit controls flow of data", options: ["Control Unit", "Memory unit", "ALU", "None of Above"], answer: 0 },
  { q: "__________ uses magnetic ink", options: ["Voice", "Light", "MICR", "Bar Code"], answer: 2 },
  { q: "___________ application can be used to edit photo images.", options: ["Photoshop", "MS-word", "notepad", "None of these"], answer: 0 },
  { q: "_________________ is the shortcut-key for manual line break.", options: ["CTRL + Enter", "Alt + Enter", "Shift + Enter", "Space + Enter"], answer: 2 },
  { q: "_________________ is shortcut key is used to save the document", options: ["Ctrl+A", "Ctrl+S", "Ctrl+D", "Ctrl+E"], answer: 1 },
  { q: "__________________ option is used to get reference of specific place in Document.", options: ["Bookmark", "footnote", "Caption", "Field"], answer: 0 },
  { q: "_____________________ key is used to delete the only text of the table.", options: ["Delete", "Insert", "Shift", "Enter"], answer: 0 },
  { q: "______________option is use to change the selected text into uppercase or lowercase", options: ["Case", "Changecase", "Change", "Convert"], answer: 1 },
  { q: "All the commands in Excel are given in the form of a Ribbon.", options: ["true", "false"], answer: 1 },
  { q: "All Worksheet Formulas --------------", options: ["Manipulate Labels", "Return a Formula Result", "Manipulate Values", "Use the addition operator"], answer: 1 },
  { q: "Alt Key is used to select Multiple range of cells.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "AND Function checks for multiple conditions and if any one condition is true, then returns the result as TRUE.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "AND function returns the error as ________", options: ["Wrong!!", "Error!!", "Mistake!!", "#VALUE!"], answer: 3 },
  { q: "_____________________ to the text can be given by using shadow command.", options: ["Highlight", "Font Color", "Shadow", "None of these"], answer: 2 },
  { q: "_____________________ view is useful to type matter on slide.", options: ["Print Layout", "Outline", "Normal", "None of these"], answer: 2 },
  { q: "_______________________ _ is present besides the PowerPoint logo on Title bar.", options: ["Status Bar", "Ribbon", "Quick Access Toolbar", "Title bar"], answer: 2 },
  { q: "___________View is used to add the Notes in the slide, for our reference.", options: ["Slide", "Slide show", "Notes Page", "Slide Sorter"], answer: 2 },
  { q: "Engineering drawings, maps are printed on large media using _________", options: ["Ink Jet Priters", "Dot Matrix Priters", "Laser Printers", "Plotters"], answer: 3 },
  { q: "____________ Is required To use Internet on computer", options: ["Web Server", "Web Site", "Electrical Connection", "None of these"], answer: 3 },
  { q: "____________ is the most common internet protocol.", options: ["HTML", "TCP/IP", "IPX/SPX", "NetBEUL"], answer: 1 },
  { q: "____________ is used to draw Engineering Drawings, Maps etc.", options: ["Plotter", "Line", "Character", "Laser"], answer: 0 },
  { q: "____________ is Web Browser software", options: ["Internet Explorer", "MS Word", "MS Excel", "MS PowerPoint"], answer: 0 },
  { q: "____________ memory is a temporary type of memory", options: ["CPU", "Cache", "External", "Internal"], answer: 1 },
  { q: "___________ Are types of keyboard.", options: ["Ergonomic", "Flexible", "Wireless", "All of these"], answer: 3 },
  { q: "___________ Are types of mouse.", options: ["Mechanical", "Optical", "Wireless", "All of these"], answer: 3 },
  { q: "___________ bytes means 1 Kilo-Byte.", options: ["1000", "1040", "1042", "1024"], answer: 3 },
  { q: "___________ can process billions instructions per second.", options: ["Mainframe", "Mini Computers", "Micro Computers", "Super Computers"], answer: 3 },
  { q: "___________ computer is smallest in size and usually fits in palm", options: ["Desktop", "Laptop", "Handheld", "None of these"], answer: 2 },
  { q: "______________option is used to replace the text in document", options: ["Change", "Replace", "Edit", "Find"], answer: 1 },
  { q: "____________option will be used for desired type of the Drop Cap.", options: ["cap", "Drop", "Caption", "Drop Cap"], answer: 3 },
  { q: "___________option is used to correct the spelling mistakes of word in the paragraph", options: ["Find", "Spelling and Grammer Check", "Checking", "correcting"], answer: 1 },
  { q: "__________option adjusts the gap between two characters .", options: ["Spacing", "Kerning", "Joining", "None of these"], answer: 1 },
  { q: "_________means number of alphabet that appear little above of the normal text", options: ["Subscript", "Superscript", "Hyphen", "Script"], answer: 1 },
  { q: "AND logical function gives result as ________ if all the conditions are true.", options: ["False", "True"], answer: 1 },
  { q: "AND/OR/NOT these are ________ functions in MS-Excel.", options: ["Analytical", "Logical", "Conditional", "Arithmetic"], answer: 1 },
  { q: "Autofill Option is used to get 1,2,3,4_____ Numbers in _________ Column.", options: ["Serial Number", "Down", "Up", "None of these"], answer: 0 },
  { q: "Autosum button is available in data tab in MS Excel 2019 .", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "Aver() function in MS Excel 2019 will find average of the numbers from given cells ?", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "A ___________ slide show displays the only slides you select.", options: ["From Beginning", "From Current Slide", "Broadcast Slide Show", "Custom Slide Show"], answer: 3 },
  { q: "A new presentation can be created from", options: ["Blank Presentation", "From Existing Presentation", "From Design Template", "All of these"], answer: 3 },
  { q: "All the slides created in the current file can be seen together in _________ view.", options: ["Slide sorter", "Normal", "File", "Slide Show"], answer: 0 },
  { q: "Animation means the effects given in Slide, regarding how the Objects appeared during Slide show.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "From the following options ________ is not a multimedia file.", options: [".wav", ".mp3", ".xls", ".avi"], answer: 2 },
  { q: "_____________ device is used to control the game actions.", options: ["Joystick", "Touchscreen", "Light Pen", "Mouse"], answer: 0 },
  { q: "_____________ Browser is developed in Google Corporation.", options: ["Internet Explorer", "Firefox", "Chrome", "Opera"], answer: 2 },
  { q: "_____________ Browser is developed in Microsoft Corporation.", options: ["Chrome", "Firefox", "Internet Explorer", "Opera"], answer: 2 },
  { q: "_____________ can be used to decorate your desktop.", options: ["Wallpaper", "Screen Saver", "My Computer", "Windows Explorer"], answer: 0 },
  { q: "_____________ Identifies the location of a website on the internet.", options: ["Address Book", "Hyperlink", "Uniform Resource Locator", "Uniform Resource Identifier"], answer: 2 },
  { q: "___________ disk contains metallic platters.", options: ["Floppy Disk", "Hard Disk", "Optical Disk", "Magnetic Tapes"], answer: 1 },
  { q: "___________ images are in the form of columns and rows.", options: ["vector drawn images", "bit map images", "line art images", "None of these"], answer: 1 },
  { q: "___________ Is not type of printer", options: ["Plotter", "Laser", "Solid", "Dot Matrix"], answer: 2 },
  { q: "___________ is the image form, we see moving image on screen.", options: ["still image", "movement", "audio", "motion image"], answer: 3 },
  { q: "________option is used to copy formatting from one place and apply it to another", options: ["Copy", "Formatting", "Format Painter", "Copy Formatting"], answer: 2 },
  { q: "_______is used for Center Alignment in word in MS Word 2019 .", options: ["ctrl + b", "ctrl + c", "ctrl + d", "ctrl + e"], answer: 3 },
  { q: "______view helps to set outline of current document", options: ["Page Layout", "outline view", "normal", "web layout"], answer: 1 },
  { q: "_____can be used to set margins and indents in Document", options: ["Ruler", "Staus area", "status bar", "tool bar"], answer: 0 },
  { q: "_____option of table is used to arrange data in ascending order.", options: ["sort", "merge", "add", "None of these"], answer: 0 },
  { q: "AVERAGE function is used to calculate the average of all the values of the range.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "A-Z sequence means ___________ sorting of a text.", options: ["Descending", "Ascending", "Vertical", "Vertical d) Numeric"], answer: 1 },
  { q: "Before using subtotal tool, the table must be sorted according to the column on which the subtotal is based.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Before using the Lookup Function it is necessary to sort it according to the Table Lookup Vector Column.", options: ["true", "false"], answer: 0 },
  { q: "By default, ________ protection is given by Excel to all cells.", options: ["Grouped", "Ungrouped", "Free", "Locked"], answer: 3 },
  { q: "At the bottom side of the Animation Pane, with ------ button we can change the sequence of objects to be animated", options: ["sequence", "Preferences", "Re-order", "Priorities"], answer: 2 },
  { q: "Blank, Comparison, Title only etc. are the types of slide layouts in PowerPoint.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Hardware that creates sound from a Mathematical representation-", options: ["Set top Box", "Speaker", "Sound Synthesizer", "Receiver"], answer: 2 },
  { q: "Blinds, Honeycomb, Cube, Doors are some of the Transition effects in PowerPoint.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "BMP means ________", options: ["Bitmap", "Presentation", "Document", "Folder"], answer: 0 },
  { q: "_____________ is a set of program to detect virus in an Antivirus Program.", options: ["DVD", "Virus Scan", "CD", "Hard Disk"], answer: 1 },
  { q: "_____________ is a type of Digital Computer.", options: ["Super", "Mainframe", "Micro", "All of these"], answer: 3 },
  { q: "_____________ is an internet search tool.", options: ["Gmail", "Facebook", "Gopher", "Chrome"], answer: 2 },
  { q: "_____________ is result after processing the input.", options: ["Input", "Output", "Logic", "Storage"], answer: 1 },
  { q: "_____________ is the powerful PC and data is stored in it.", options: ["Date Line", "Client", "Server", "None of these"], answer: 2 },
  { q: "___________ Is volatile memory.", options: ["RAM", "ROM", "CACHE", "None of these"], answer: 0 },
  { q: "___________ memory is mostly used in handheld computers", options: ["HDD", "FDD", "Flash", "All of Above"], answer: 2 },
  { q: "___________ memory is temporary memory which acts as buffer between ram and processor.", options: ["RAM", "ROM", "CACHE", "None of these"], answer: 2 },
  { q: "___________ printers are faster than dot matrix and inkjet printers.", options: ["PLOTTER", "DYE SUBLIMATI ON", "LASER", "NONE OF ABOVE"], answer: 2 },
  { q: "____________ Are parts of binary system", options: ["5", "3", "4", "None of these"], answer: 3 },
  { q: "_____shortcut key is used for cut the text in MS Word 2019", options: ["ctrl + x", "ctrl + t", "ctrl + c", "ctrl + u"], answer: 0 },
  { q: "____shortcut is used for Redo.", options: ["Ctrl+A", "Ctrl+Z", "Ctrl+Y", "Ctrl+w"], answer: 2 },
  { q: "__command/facility is used to correct the common spelling mistakes.", options: ["Auto Text", "Auto Corrent", "Auto Format", "None of these"], answer: 1 },
  { q: "1.0 (Single ) means the line spacing of only one line, which is actually by default.", options: ["True", "FALSE"], answer: 0 },
  { q: "In Outiline view, text in a document is displayed in different levels like Heading, Body Text etc.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "By default, Locked protection is given by Excel to all ________", options: ["Tables", "functions", "Cells", "Data"], answer: 2 },
  { q: "By using ------ command selected cell range can be named with different name.", options: ["Formula Tab - Name Manager", "Data Tab - Filter", "Insert Tab - Name Manager", "None of these"], answer: 0 },
  { q: "By using ---------- option in advance filter, the duplicate records can be avoided", options: ["List Range", "Criterion Range", "Copy to", "Unique Records only"], answer: 3 },
  { q: "By using ------------- tools, data in different worksheets can be combined and its summary can be created in another worksheet.", options: ["Data Consolidatio n", "Data Validation", "Conditional Formatting", "None of these"], answer: 0 },
  { q: "By using ____ option, only selected matter is removed but format remains as it is in the cells.", options: ["Contents", "Cell contents", "Comments", "None of these"], answer: 0 },
  { q: "Idea Processing-Planning- Production-Testing are different ________ in Multi media project.", options: ["Hardware", "Software", "stages", "None of these"], answer: 2 },
  { q: "By default the font size of the title Text box of Title slide is _______", options: ["40", "43", "42", "44"], answer: 3 },
  { q: "By pressing ________________ key we can stop the running slide show.", options: ["Close", "Exit", "Escape", "None of these"], answer: 2 },
  { q: "By pressing close key we can stop the running slide show.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "If we want any immediately undone command to get redone is used_____", options: ["Undo", "Move", "Before", "Redo"], answer: 3 },
  { q: "_____________ is used for internet surfing", options: ["word", "browser", "excel", "None of Above"], answer: 1 },
  { q: "_____________ is used to read printer barcodes.", options: ["Barcode reader", "Light Pen", "Touchscreen", "Mouse"], answer: 0 },
  { q: "_____________ Software is a software that basically makes the computer work.", options: ["System", "Application", "Virtual", "Compiler"], answer: 0 },
  { q: "_____________ system is use send electronic message.", options: ["Online service", "E-mail", "Voice mail messages", "Shared mail"], answer: 1 },
  { q: "______________ creates simple text files that do not include character and paragraph formatting.", options: ["MS-Paint", "Notepad", "Documents", "MS-Word"], answer: 1 },
  { q: "____________ can be used to prevent computer from Virus attack.", options: ["Proxy", "Antivirus Program", "System Software", "None of above"], answer: 1 },
  { q: "____________ Can contain many files.", options: ["Folder", "Basket", "Box", "None of these"], answer: 0 },
  { q: "____________ Generation used silicon chips as Integrated Circuits ( I. C. )", options: ["First", "Second", "Third", "Fourth"], answer: 2 },
  { q: "____________ Is not operating system.", options: ["Windows", "Linux", "Ms-Office", "All of these"], answer: 2 },
  { q: "____________ offers online buying things from home.", options: ["Shops", "Server", "MS-Word", "Ecommerce"], answer: 3 },
  { q: "After clicking on Header and Footer we can edit it.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "After clicking shades area in Scroll bar the matter gets scroll which can be up to one screen.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "After clicking with mouse on top area of column in Table ______________ will get selected.", options: ["Row", "Column", "Cell", "Table"], answer: 1 },
  { q: "After double clicking on Header and Footer we can edit it.", options: ["true", "false"], answer: 0 },
  { q: "In Ms-Word, where we find the \"Close\" option?", options: ["View", "Edit", "Windows", "File"], answer: 3 },
  { q: "By using ______ command selected cell range can be named with different name.", options: ["Formula Tab - Name Manager", "Data Tab - Filter", "Insert Tab - Name Manager", "None of these"], answer: 0 },
  { q: "By using __________ filter option, output of the filtered records can be placed at another location.", options: ["Advance Filter", "Custom Filter", "Auto Filter", "None of these"], answer: 0 },
  { q: "By using Exit option, what action is done in Excel", options: ["Quit Excel", "Open Excel", "Close file", "Open file"], answer: 0 },
  { q: "Can we save Excel file in Pdf?", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Cell Address / Cell Reference is the combination of Column Label and Row Number.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "By pressing escape key we can _____ the running slide show.", options: ["Close", "start", "stop", "None of these"], answer: 2 },
  { q: "By pressing escape key we can stop the running _____", options: ["file", "slide show", "sheet", "window"], answer: 1 },
  { q: "By right clicking on Text matter________ menu will be open", options: ["File", "Quick", "Edit", "Window"], answer: 1 },
  { q: "By this tool we got the Elliptical Frame in a Power Point", options: ["polygon tool", "Elliptical Frame", "Ellipse Tool", "None of these"], answer: 1 },
  { q: "Changes made in ________ applid to all slides.", options: ["First slide", "Slide Master", "Main slide", "Last Slide"], answer: 1 },
  { q: "______________ is a set of data.", options: ["File", "Computer", "Command", "None of the options"], answer: 0 },
  { q: "______________ is a type of CD that is erasable.", options: ["CD-ROM", "CD-R", "CD-RW", "None of these"], answer: 2 },
  { q: "______________ is storing all information by a specific method in RAM.", options: ["Memory Management", "File Management", "Hardware Management", "None of these"], answer: 0 },
  { q: "______________ protocol is used to transfer files of information in www.", options: ["HTTP", "FTP", "TCP/IP", "None of Above"], answer: 1 },
  { q: "______________ scans the computer memory for virus.", options: ["Scanners", "Speaker", "Anti Virus", "None of the options"], answer: 2 },
  { q: "_____________ are also called personal computers (p.c.).", options: ["MAINFRAME COMPUTER", "SUPER COMPUTER", "MICRO COMPUTER", "MINI COMPUTER"], answer: 2 },
  { q: "_____________ are second fastest computers after super computers.", options: ["Mainframe", "Mini Computers", "Micro Computers", "Super Computers"], answer: 0 },
  { q: "_____________ are used in weather forecasting.", options: ["Mainframe", "Mini Computers", "Micro Computers", "Super Computers"], answer: 3 },
  { q: "_____________ can be used to send and receive messages.", options: ["Word Processor", "Windows", "Image Editor", "Email"], answer: 3 },
  { q: "_____________ device is used to scan images, printed text, handwriting from papers.", options: ["Joystick", "Gamepad", "Scanner", "ALL OF ABOVE"], answer: 2 },
  { q: "After double clicking on selection area on the left bottom corner of cell, entire ____________ will get selected.", options: ["Row", "Column", "Cell", "Table"], answer: 0 },
  { q: "After inserting a picture in document, they have______resize handles .", options: ["6", "8", "12", "10"], answer: 1 },
  { q: "After saving the document we can not change the data?", options: ["True", "FALSE"], answer: 1 },
  { q: "After using Undo Command to redo the action _________ Command used.", options: ["Ctrl +Y", "Ctrl +Z", "Ctrl+A", "Drop-Left"], answer: 0 },
  { q: "Arial, Arial Black are the examples of _____", options: ["Word Art", "Fonts", "Font Styles", "Indents"], answer: 1 },
  { q: "Cell address contains column label and row number in MS Excel 2019", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Cell in MS Excel 2019 is a ____", options: ["intersection of only rows", "intersection of only columns", "intersection of rows and columns", "None of these"], answer: 2 },
  { q: "Cell pointer move to one cell up used --------------", options: ["Press Enter Key", "Press Shift+Enter Key", "Press Shift + Alt", "Press Alt+Shift Key"], answer: 1 },
  { q: "Cell value typed in selected cell displayed in ________", options: ["None", "Title Bar", "Formula Bar", "Status Bar"], answer: 2 },
  { q: "Chart option is available in ____ in MS Excel 2019 .", options: ["Insert tab", "Home tab", "page layout tab", "view tab"], answer: 0 },
  { q: "Click on _____option in slide group of Home Tab to create a new slide.", options: ["Slide Layout", "Transition", "Animation", "New Slide"], answer: 3 },
  { q: "Clipart option is available in Insert tab", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Closing and existing in PowerPoint are same", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "Convert to SmartArt command is available in ___________ group in PowerPoint", options: ["Font", "Paragraph", "Drawing", "Editing"], answer: 1 },
  { q: "In existing chart if you want to add more data you need to modify _________", options: ["None of these", "Double click on the chart area", "Source", "Chart"], answer: 2 },
  { q: "_______________ Allows to create a webpage with interactive content.", options: ["Java", "C", "HTML", "XML"], answer: 2 },
  { q: "_______________ are the animated objects that appear automatically on screen.", options: ["Wallpaper", "Monitor", "My Files", "Screen Saver"], answer: 3 },
  { q: "_______________ device consist of speech recognition software.", options: ["Voice Input", "Light Pen", "Monitor", "Keyboard"], answer: 0 },
  { q: "_______________ is a character set which is used for character encoding .", options: ["C-DAC", "UNICODE", "MS-Word", "Documents"], answer: 1 },
  { q: "_______________ is acronym for the address webpage.", options: ["LOC", "IPSA", "URL", "VRL"], answer: 2 },
  { q: "______________ are not a characteristic of computer.", options: ["Speed", "Accuracy", "Huge Data Storage", "None of these"], answer: 3 },
  { q: "______________ is common name of flash drive.", options: ["Pen Drive", "Memory Drive", "Hard Drive", "All of Above"], answer: 0 },
  { q: "________________ Is character printer.", options: ["Plotter", "Laser", "Solid", "Dot Matrix"], answer: 3 },
  { q: "_________________ is type of optical Disk.", options: ["Floppy Disk Drive", "CD", "Hard disk", "Pen drive"], answer: 1 },
  { q: "__________________ can be used to make text more attractive.", options: ["font", "size", "color", "All of these"], answer: 3 },
  { q: "Arranged data in ascending and descending order is called as________________", options: ["Arranging", "Managing", "Sorting", "Formatting"], answer: 2 },
  { q: "Autocorrect is used for checking spelling and grammar", options: ["True", "False"], answer: 1 },
  { q: "AutoCorrect was originally designed to replace __________________ words as you type.", options: ["macros", "template", "mail merge", "None of these"], answer: 3 },
  { q: "Baud Rate is measured in _______________ form.", options: ["Bytes per Second", "Bytes per Minute", "Bits per Minute", "Bits per Second"], answer: 3 },
  { q: "Below the Ruler Line, we can get a white colored rectangular area. This area called _________", options: ["Page Area", "Status bar", "Title Bar", "Menu Bar"], answer: 0 },
  { q: "Clear command is present in ------------ tab", options: ["Insert", "Data", "Home", "View"], answer: 2 },
  { q: "Column are label as _____________", options: ["1,2,3,4,......... ..", "I,II,III, ............", "A,B,C,D, ..........", "a,b,c,d, ........."], answer: 2 },
  { q: "Column Index Number is the serial number of a _______ from table array from which corresponding value is to be given as output.", options: ["row", "column", "cell", "text"], answer: 1 },
  { q: "Column width and Row height measured in ............", options: ["Cm", "Inch", "Meter", "Point"], answer: 3 },
  { q: "Column, Line, Pie, Bar are the subtypes of ________", options: ["Table", "Sheet", "Tree", "Graph"], answer: 3 },
  { q: "Data consisting of text and numbers are best represented using ____ slide.", options: ["Table slide", "Title slide", "Comparison slide", "None of these"], answer: 0 },
  { q: "Data consisting of title some text can be presented in _________ slide.", options: ["Title only", "Title & content", "Two content", "Table"], answer: 1 },
  { q: "Design and Layout Theme are given to the slides according to Template selected.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Design/ Transition/ Animations/ Slide show tabs are available in __________", options: ["MS-Word", "MS-Excel", "MS-PowerPoi nt", "MS-Access"], answer: 2 },
  { q: "In multi media musical instruments can be attached to _______________ port of the computer.", options: ["MIDI", "USB", "LAN", "None of these"], answer: 0 },
  { q: "_______________ is the protocol, to transfer the data in the form of text.", options: ["HTTP", "SMTP", "FTP", "PPPT"], answer: 0 },
  { q: "_______________ means we can open or work on more than one application programs.", options: ["Unix", "Multitasking", "networking", "processing"], answer: 1 },
  { q: "_______________ option from Recycle Bin can recover an item which is accidentally deleted.", options: ["Delete", "Restore", "Home", "Saved Documents"], answer: 1 },
  { q: "________________ can permanently damage software applications", options: ["Virus", "System Software", "Application Software", "Antivirus"], answer: 0 },
  { q: "________________ Identifies the location of a Web Site on the internet.", options: ["Anchor Tag", "Hyperlink", "Uniform Resource Identifier", "Uniform Resource Locator"], answer: 3 },
];

/* ---------------------------------------------
   50 WPM bank populated from the official Jan 2026
   provisional answer key PDF (123 verified questions,
   2 excluded from the source due to corrupted/
   duplicate option text found during review).
--------------------------------------------- */
const MCQ_BANK_50 = [
  { q: "CD is used to store ..............", options: ["Audio file", "Video file", "Data file", "All of these"], answer: 3 },
  { q: "Hard copy is output of ......................", options: ["Monitor", "Printer", "Scanner", "None of these"], answer: 1 },
  { q: "Binary coding system consist of ..................", options: ["1 - 100", "0 and 1", "Alphabets", "Both alphanumeric"], answer: 1 },
  { q: "Primary memory is divided into ........................", options: ["RAM", "ROM", "CACHE", "All of these"], answer: 3 },
  { q: "................ is the smallest sized scanner to scan text matter.", options: ["Bar-code device", "Portable Scanner", "Xerox", "Flatbed Scanner"], answer: 1 },
  { q: "In MS Word You can add page break using ..................", options: ["Ctrl + Enter", "Enter", "Shift + Enter", "Alt + Enter"], answer: 0 },
  { q: "Arial, Times New Roman are the example of .............", options: ["Word Art", "Fonts", "Font Styles", "Indent"], answer: 1 },
  { q: "In Ms-word spelling mistakes displayed with the ................ color", options: ["Red", "Green", "Yellow", "Black"], answer: 0 },
  { q: "We can use ............. to write any Note instruction or any additional text.", options: ["Text Box", "AutoSum", "Sort & Filter", "Find & select"], answer: 0 },
  { q: "Baud Rate is measured in .............................. form.", options: ["Bytes per Second", "Bytes per Minute", "Bits per Minute", "Bits per Second"], answer: 3 },
  { q: "In MS-Excel, using name manager, we can ................ selected cell range.", options: ["Name", "Rename", "remove name", "All of these"], answer: 3 },
  { q: "Using ................ function we can check around 32 conditions.", options: ["AND", "AVERAGE", "NOT", "SUM"], answer: 0 },
  { q: "Which is a correct answer for =lower(\"clean India\") in MS Excel 2010 ?", options: ["Clean india", "CLEAN INDIA", "Clean India", "clean india"], answer: 3 },
  { q: "..............................is used to show the full contents (text/Number)in any column.", options: ["Autofit Column Width", "Autofit Row", "Row Height", "column width"], answer: 0 },
  { q: ".............. sorting method is used for Z to A sequence.", options: ["Ascending", "Descending", "Vertical", "Horizontal"], answer: 1 },
  { q: "........................ is the shortcut key to open a PowerPoint presentation.", options: ["Ctrl+O", "Ctrl+N", "Ctrl+S", "Ctrl+M"], answer: 0 },
  { q: "We can insert Object like .................... in a slide from insert tab.", options: ["Shapes", "Text", "Document", "Slide"], answer: 0 },
  { q: "While the slide show is running .................. option will show the next slide.", options: ["Next", "Previous", "Go", "Pointer"], answer: 0 },
  { q: "To create a presentation based on pictures ............ can be used", options: ["Chart", "Photo Album", "Clip art", "Shapes tool"], answer: 1 },
  { q: "In PowerPoint, additional slide can be added using ........................ option", options: ["Master slide", "Main slide", "New slide", "None of these"], answer: 2 },
  { q: "Emails sent to other accounts are shown in .................. menu.", options: ["Inbox", "Spam", "Sent Item", "Trash"], answer: 2 },
  { q: "Fifth generation computers use............................", options: ["Vacuum Tubes", "Transistors", "Artificial Intelligence", "Laser rays"], answer: 2 },
  { q: "GUI is graphical user interface", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "To show Large Network site .................. domain code is used.", options: ["in", "net", "com", "gov"], answer: 1 },
  { q: ".................. Cables are more safe than coaxial cables.", options: ["Fiber-Optic", "Twisted optics", "Shield Twisted optics", "None of these"], answer: 0 },
  { q: "Mouse mainly have ............ buttons", options: ["Five", "Four", "Three", "Two"], answer: 2 },
  { q: "................ device is knows as a brain of computer.", options: ["Input Unit", "Output Unit", "CPU", "All of these"], answer: 2 },
  { q: "Internal Hard disk contains only one magnetic disk.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "F1 - f12 keys are called ..................", options: ["Formula Keys", "Shortcut Keys", "Function Keys", "None of these"], answer: 2 },
  { q: "....... is the default file extension for all word documents.", options: [".txt", ".word", ".dos", ".docx"], answer: 3 },
  { q: "Headers and Footers are displayed in ...................................... View.", options: ["Web layout", "Print layout", "Normal", "outline"], answer: 1 },
  { q: "we can see full screen from ..................Tab", options: ["Review", "View", "Layout", "References"], answer: 1 },
  { q: ".................. formula is used to add the numbers in cell of table.", options: ["Sum", "Subtract", "Multiply", "Auto"], answer: 0 },
  { q: "............................ effect drawn line between the text", options: ["Line", "Strikethrough", "linethrough", "through"], answer: 1 },
  { q: "Where you find the option to include word art in MS Excel 2010 ?", options: ["embed tab", "include tab", "addart tab", "Insert tab"], answer: 3 },
  { q: "Which keyboard key should be used to delete cell contents in MS Excel 2010 ?", options: ["end", "home", "delete", "shift"], answer: 2 },
  { q: "................ is a correct syntax of OR function in MS-Excel.", options: ["OR (IF)", "OR (Logical Test1, Logical Test 2 … … ..)", "OR (A+B+C)", "OR (A1:A5)"], answer: 1 },
  { q: "Formulas must be provided in the Output Cell using Input Cell to use the Goal Seek.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "If more than one If Functions is used in one, then it should be called ..........", options: ["Multiple Ifs", "Simple Ifs", "Nested Ifs", "What if"], answer: 2 },
  { q: "Slide show presentation can be created using ................ application.", options: ["MS-Excel", "MS- Word", "MS-Access", "MS-PowerPoi nt"], answer: 3 },
  { q: "Ruler Command is chosen in the ......................... Tab to Display Ruler Line.", options: ["View", "File", "Slide Show", "Window"], answer: 0 },
  { q: "In PowerPoint, screenshots can be added using ................option.", options: ["Insert- charts", "Insert-Image s", "Insert-symbols", "Insert-illustrati on"], answer: 1 },
  { q: "In PageMaker, Which command is used to view the slides in a large size", options: ["Zoom In", "Maximum", "Zoom Out", "None of these"], answer: 0 },
  { q: "PageMaker is a software from ................ company", options: ["Adobe", "Microsoft", "IBM", "Mozilla"], answer: 0 },
  { q: "Hardware that creates sound from a Mathematical representation.", options: ["Sound Synthesizer", "Speaker", "Set Top Box", "Receiver"], answer: 0 },
  { q: "From the following which one has high storage capacity.", options: ["Hard Disk", "CD", "DVD-ROM", "Floppy"], answer: 0 },
  { q: "HTTP use to transfer files from one machine to another on Internet.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "A domain name ending with \".net\" is ..................", options: ["A government Site", "A commercial site", "A network site", "An organization"], answer: 2 },
  { q: "USB stands for .................... serial bus", options: ["Universal", "Universe", "Uniform", "United"], answer: 0 },
  { q: "By using .................... option in Start Menu, we can search any file in the Computer.", options: ["Shutdown", "Programs", "Search Programs and Files", "Documents"], answer: 2 },
  { q: ".............................. is a mixture of sound, animation, graphics, text and video.", options: ["MovieMedia", "Multimedia", "Moving Media", "MultiMixing"], answer: 1 },
  { q: "Ctrl + v = ........................", options: ["Cut selected items", "Copy selected items", "Paste Copied or Cut items", "Undo an action"], answer: 2 },
  { q: "We should always keep ON security settings of the Browser.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "The Blue Background appeared after starting Windows, is called as ..........................", options: ["Desktop", "Task Bar", "Background", "Table Top"], answer: 0 },
  { q: "There is a difference in the Backspace & Delete Keys", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "The common letter sent on different addresses is called..............", options: ["Mail Merge", "Merge", "Letters", "E-mail"], answer: 0 },
  { q: "After using Undo Command to redo the action .................. Command used.", options: ["Ctrl +Y", "Ctrl +Z", "Ctrl+A", "Drop-Left"], answer: 0 },
  { q: "................ means distance between 'Text Matter' and 'Page margins'.", options: ["Indent", "Margin", "Gap", "Gutter"], answer: 0 },
  { q: "Below the Ruler Line, we can get a white colored rectangular area. This area called ..................", options: ["Page Area", "Status bar", "Title Bar", "Menu Bar"], answer: 0 },
  { q: "To insert new worksheet in a workbook home tab - cells group - insert command is used.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "The Default page Orientation in Excel is ........................", options: ["Horizontal", "Landscape", "Portrait", "Vertical"], answer: 2 },
  { q: "In a spreadsheet, what will be name of the 7th row and 4th column cell ?", options: ["D4", "G4", "D7", "G7"], answer: 2 },
  { q: "In MS-Excel, sort command has ................ types.", options: ["3", "2", "5", "7"], answer: 0 },
  { q: "= TODAY() function is used to insert current system date into cell.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "In Page Maker which menu contains Frames option?", options: ["file", "utilities", "element", "None of these"], answer: 2 },
  { q: "In PowerPoint, Font size is increased by using ................ option", options: ["Font command from home tab", "Home tab -alignment", "home tab- styles", "None of these"], answer: 0 },
  { q: "In PageMaker Image command is available in ................................ menu", options: ["Element", "View", "File", "Type"], answer: 0 },
  { q: "We can create a new presentation file by clicking ...................... option in the file menu.", options: ["Save", "New", "Print", "Close"], answer: 1 },
  { q: "To insert a new slide in a presentation we use .......................", options: ["Insert >> Slide", "Home >> Slides >> New Slides", "Open", "Duplicate"], answer: 1 },
  { q: "We cannot change the computer systems Date & Time.", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "For .......................... process microprocessors are used.", options: ["Arithmetic & logical", "Virtual", "Binary", "Secondary"], answer: 0 },
  { q: "Every website has a unique address. Which is called?", options: ["Hyperlinks", "IP Address", "Domain", "URL"], answer: 3 },
  { q: "If you move the mouse pointer on hyper-links, the pointer changes its shape to a ..................", options: ["Hand", "Thumb", "Arrow", "Left Arrow"], answer: 0 },
  { q: "While transferring data on network, speed is measured in .................. unit.", options: ["Hertz", "Baud Rate", "Kilometers", "Millimeters"], answer: 1 },
  { q: "................ allows information to be shared.", options: ["Data", "notepad", "Network", "WordPad"], answer: 2 },
  { q: "In Windows 7 .......................... is shortcut key for Start Menu.", options: ["Shift + Esc", "Alt + Esc", "Ctrl + Esc", "Esc"], answer: 2 },
  { q: "BSNL is an Internet Service Provider.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Idea Processing-Planning- Production-Testing are different ................ in Multi media project.", options: ["Hardware", "Software", "stages", "None of these"], answer: 2 },
  { q: "One Tweet can contain 140 characters only.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "In Home Tab - ....... group, there are various types of Font Colors.", options: ["Mail-Merge", "Font", "Print", "Save As"], answer: 1 },
  { q: "...................... chart display trends overtime", options: ["Pie", "Line", "Bar", "Area"], answer: 1 },
  { q: "We can't type the mathametical and chemical equation in Ms-word", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "After saving the document we can not change the data?", options: ["TRUE", "FALSE"], answer: 1 },
  { q: "........................ is used to magnify the data", options: ["Zoom", "Resize", "Font style", "View"], answer: 0 },
  { q: "The = TODAY() functions enter the ..............", options: ["System Time", "System Clock", "System Date", "System Date and Time"], answer: 2 },
  { q: "In MS-Excel, we can use cell ................ to give cell address.", options: ["reference", "position", "Name", "number"], answer: 2 },
  { q: "Underline or double underline can be given using button in home tab in MS Excel 2010 .", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "................ is a correct syntax of AND function in MS-Excel.", options: ["AND (A+B+C)", "AND(IF)", "AND (Logical Test1, Logical Test 2 … … ..)", "AND(A:A5)"], answer: 2 },
  { q: "Syntax of if Function is \"=IF (logical test, Value if True, Value if False)\".", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "In PageMaker Polygon tool can draw polygon of minimum ........ sides.", options: ["1", "2", "3", "4"], answer: 2 },
  { q: "In PageMaker ................ tool is used to type text.", options: ["text", "crop", "pointer", "line"], answer: 0 },
  { q: "...................... inserts current date and/or time to the current presentation.", options: ["Current Date", "Current Time", "Date & Time", "None of these"], answer: 2 },
  { q: "Using ........................ option in PowerPoint we can play animation after certain number of seconds.", options: ["Speed", "Delay", "Timing", "None of these"], answer: 1 },
  { q: "Normally, in PageMaker window, ................ is present at the left side.", options: ["Menu bar", "Tool bar", "Tool Box", "Command bar"], answer: 2 },
  { q: "A domain name ending with \".mil\" is ..................", options: ["A military website", "A commercial site", "A network site", "An organization"], answer: 0 },
  { q: "Modulation and Demodulation is done by ....................", options: ["modulator", "demodulator", "modem", "None of these"], answer: 2 },
  { q: "Modem convert .................. signal to .................. signals and vice versa.", options: ["Telephonic Signals to Analog Signals", "Analog Signal To Telephonic Signals", "Analog Signals To Digital Signals", "None of these"], answer: 2 },
  { q: ".......................... system is use send electronic message.", options: ["Online service", "E-mail", "Voice mail messages", "Shared mail"], answer: 1 },
  { q: "........ type of printer prints character by character.", options: ["Laser", "Dot Matrix", "Inkjet", "Plotter"], answer: 1 },
  { q: "The size of ............ computers is so small, that we can use them on our palm.", options: ["Desktop", "Mainframe", "Handheld", "Mini"], answer: 2 },
  { q: "Hard disk is secondary storage Memory.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Using .......... type of input device you can point an item, write or touch on the screen.", options: ["Keyboard", "Light Pen", "Monitor", "Voice Input"], answer: 1 },
  { q: "Latest version of Operating system always has latest ......................", options: ["latest songs", "latest pictures", "less security features", "Latest security features"], answer: 3 },
  { q: "Secure Socket Layer is used for ................", options: ["Website Browsing", "Website Security", "Chatting", "Hacking"], answer: 1 },
  { q: "YOUR TEXT HERE' in the Dashed Box means ..............?", options: ["Get Mathematical Formulas etc.", "Word Art Option- different fonts etc.", "Get Video, Audio etc", "None of these"], answer: 1 },
  { q: "For Closing the Print Preview Option, which of the following key we have to Press.", options: ["Alt", "Esc", "Ctl", "Delete"], answer: 1 },
  { q: "...................... effect is increase the size of first character in Paragraph", options: ["Drop cap", "Style", "Text", "Font"], answer: 0 },
  { q: "...................... shortcut key is used for Underline", options: ["Ctrl+B", "Ctrl+I", "Ctrl+U", "Alt +U"], answer: 2 },
  { q: ".......................... option is used to clear formatting", options: ["Format", "Clear formatting", "Clear", "Remove"], answer: 1 },
  { q: "Which do you press to cut the content of excel sheet?", options: ["Cut", "Ctrl+C", "Ctrl+X", "Ctrl+Alt+X"], answer: 2 },
  { q: "To Select Whole/Complete Sheet use .......... Key Combination", options: ["Ctrl + A", "Ctrl +D", "Ctrl + B", "Ctrl + S"], answer: 0 },
  { q: "In Cell Entered Text aligned automatically ................", options: ["Left Aligned", "Center Aligned", "Right Aligned", "Justify Aligned"], answer: 0 },
  { q: "The formula bar in MS Excel 2010 shows contents of cell and formula entered in cell.", options: ["TRUE", "FALSE"], answer: 0 },
  { q: "Which is a correct answer for =upper(\"clean India\") in MS Excel 2010 ?", options: ["Clean india", "CLEAN INDIA", "Clean India", "clean india"], answer: 1 },
  { q: "In PageMaker, file menu contains................ command.", options: ["paragraph", "cut", "Preference", "find"], answer: 2 },
  { q: "To cut some part of image which is inserted............ tool is use", options: ["Text", "Crop", "Rectangle", "Line"], answer: 1 },
  { q: "...................... is process in which all slides are displayed one after another?", options: ["Page Show", "Image Show", "Slide Show", "None of these"], answer: 2 },
  { q: "By default, graphics larger than ...... are stored in the PageMaker publication:", options: ["1 MB", "256 KB", "16 KB", "Files are never stored in the publication"], answer: 1 },
  { q: "We can see the object in big size using ....................... command.", options: ["Zoom In", "Zoom Out", "Size in", "Size Out"], answer: 0 },
  { q: "The type or format of the file is determined by .............. contained in the file.", options: ["Paper", "Data", "Material", "Documents"], answer: 1 },
  { q: "To go to previous page ...... key is used in Internet Explorer.", options: ["Backspace", "Esc", "Home", "Page Up"], answer: 0 },
  { q: "Antivirus are designed to stop ................", options: ["Deleting Files", "Erasing data", "Insert unnecessary data", "All of these"], answer: 3 },
  { q: "We cannot delete a file from Recycle Bin.", options: ["TRUE", "FALSE"], answer: 1 },
];

const MCQ_BANK = {
  30: MCQ_BANK_30,
  40: MCQ_BANK_40,
  50: MCQ_BANK_50
};

const MCQ_QUESTIONS_PER_TEST = 25;
const MCQ_TIMED_SECONDS = 25 * 60; // 25 minutes, per official GCC-TBC objective section timing

/* ---------------------------------------------
   16. MCQ STATE
--------------------------------------------- */
const mcqState = {
  step: 1,
  speed: 30,
  timing: "timed", // 'timed' | 'untimed'

  questions: [],
  currentIndex: 0,
  answers: [],
  startTime: null,
  finished: false,

  timeLeft: MCQ_TIMED_SECONDS, // countdown (timed) or elapsed (untimed)
  timerHandle: null
};

/* ---------------------------------------------
   17. MCQ DOM REFERENCES
--------------------------------------------- */
const mcqStepPanels = document.querySelectorAll("[data-mcqstep]");
const mcqStepDots = document.querySelectorAll("[data-mcqdot]");

const mcqSpeedChips = $("mcqSpeedChips");
const mcqBankNotice = $("mcqBankNotice");
const mcqTimingTimed = $("mcqTimingTimed");
const mcqTimingUntimed = $("mcqTimingUntimed");
const mcqTimingHint = $("mcqTimingHint");

const mcqReviewSpeed = $("mcqReviewSpeed");
const mcqReviewMode = $("mcqReviewMode");

const mcqBackBtn = $("mcqBackBtn");
const mcqNextBtn = $("mcqNextBtn");
const mcqStartBtn = $("mcqStartBtn");

const mcqStatProgress = $("mcqStatProgress");
const mcqStatTime = $("mcqStatTime");
const mcqTimeLabel = $("mcqTimeLabel");
const mcqStatSpeed = $("mcqStatSpeed");
const mcqProgressFill = $("mcqProgressFill");

const mcqQuestionLabel = $("mcqQuestionLabel");
const mcqQuestionText = $("mcqQuestionText");
const mcqOptionsEl = $("mcqOptions");
const mcqFeedback = $("mcqFeedback");

const mcqExitBtn = $("mcqExitBtn");
const mcqPrevBtn = $("mcqPrevBtn");
const mcqNextQBtn = $("mcqNextQBtn");
const mcqSubmitBtn = $("mcqSubmitBtn");

const mcqResultsScore = $("mcqResultsScore");
const mcqResultsPercent = $("mcqResultsPercent");
const mcqResultsPassBadge = $("mcqResultsPassBadge");
const mcqResultsCorrect = $("mcqResultsCorrect");
const mcqResultsIncorrect = $("mcqResultsIncorrect");
const mcqResultsSkipped = $("mcqResultsSkipped");
const mcqResultsTotal = $("mcqResultsTotal");
const mcqResultsSpeed = $("mcqResultsSpeed");
const mcqResultsTime = $("mcqResultsTime");
const mcqResultsMessage = $("mcqResultsMessage");
const mcqReviewList = $("mcqReviewList");

const mcqTryAgainBtn = $("mcqTryAgainBtn");
const mcqChangeSettingsBtn = $("mcqChangeSettingsBtn");

const mcqBestBadge = $("mcqBestBadge");
const mcqBestValue = $("mcqBestValue");


/* Page flag: only /mcq/ has the MCQ options container. */
const isMcqPage = !!mcqOptionsEl;

if (isMcqPage) {
  /* ---------------------------------------------
     18. MCQ SETUP WIZARD
  --------------------------------------------- */
  function mcqBankReady(speed){
    return (MCQ_BANK[speed] || []).length >= MCQ_QUESTIONS_PER_TEST;
  }

  function updateMcqBankNotice(){
    if (mcqBankReady(mcqState.speed)){
      mcqBankNotice.textContent = "";
      mcqStartBtn.disabled = false;
    } else {
      mcqBankNotice.textContent = `The ${mcqState.speed} WPM question bank isn't loaded yet — check back soon.`;
      mcqStartBtn.disabled = true;
    }
  }

  mcqSpeedChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    mcqSpeedChips.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    mcqState.speed = Number(chip.dataset.mcqspeed);
    loadMcqBestScore(mcqState.speed);
    updateMcqBankNotice();
  });

  mcqTimingTimed.addEventListener("click", () => setMcqTiming("timed"));
  mcqTimingUntimed.addEventListener("click", () => setMcqTiming("untimed"));

  function setMcqTiming(timing){
    mcqState.timing = timing;
    mcqTimingTimed.classList.toggle("active", timing === "timed");
    mcqTimingUntimed.classList.toggle("active", timing === "untimed");
    mcqTimingHint.textContent = timing === "timed"
      ? "Just like the real exam: 25 minutes for all 25 questions. The test auto-submits when time runs out."
      : "No countdown — take as long as you need to work through all 25 questions.";
  }

  mcqNextBtn.addEventListener("click", () => goToMcqStep(mcqState.step + 1));
  mcqBackBtn.addEventListener("click", () => goToMcqStep(mcqState.step - 1));

  function goToMcqStep(n){
    if (n < 1 || n > 3) return;
    mcqState.step = n;

    mcqStepPanels.forEach(p => p.classList.toggle("active", Number(p.dataset.mcqstep) === n));
    mcqStepDots.forEach(d => {
      const dn = Number(d.dataset.mcqdot);
      d.classList.toggle("active", dn === n);
      d.classList.toggle("done", dn < n);
    });

    mcqBackBtn.disabled = n === 1;
    mcqNextBtn.hidden = n === 3;
    mcqStartBtn.hidden = n !== 3;

    if (n === 3){
      mcqReviewSpeed.textContent = `${mcqState.speed} WPM`;
      mcqReviewMode.textContent = mcqState.timing === "timed" ? "Timed — 25:00" : "Untimed";
      updateMcqBankNotice();
    }
  }

  mcqStartBtn.addEventListener("click", startMcqTest);
  mcqChangeSettingsBtn.addEventListener("click", () => {
    stopMcqTimer();
    showScreen(mcqSetupScreen);
    goToMcqStep(1);
  });
  mcqExitBtn.addEventListener("click", () => {
    stopMcqTimer();
    showScreen(mcqSetupScreen);
    goToMcqStep(1);
  });

  /* ---------------------------------------------
     19. MCQ TEST ENGINE
  --------------------------------------------- */
  function buildMcqQuestions(){
    const pool = MCQ_BANK[mcqState.speed] || [];
    const shuffled = shuffle(pool);
    return shuffled.slice(0, MCQ_QUESTIONS_PER_TEST);
  }

  function startMcqTest(){
    if (!mcqBankReady(mcqState.speed)) return;

    mcqState.questions = buildMcqQuestions();
    mcqState.currentIndex = 0;
    mcqState.answers = mcqState.questions.map(() => null);
    mcqState.finished = false;
    mcqState.startTime = Date.now();
    mcqState.timeLeft = mcqState.timing === "timed" ? MCQ_TIMED_SECONDS : 0;

    mcqStatSpeed.textContent = `${mcqState.speed} WPM`;
    mcqTimeLabel.textContent = mcqState.timing === "timed" ? "Time left" : "Time elapsed";

    startMcqTimer();
    renderMcqQuestion();
    showScreen(mcqTestScreen);
  }

  function startMcqTimer(){
    stopMcqTimer();
    updateMcqTimerDisplay();
    mcqState.timerHandle = setInterval(() => {
      if (mcqState.timing === "timed"){
        mcqState.timeLeft--;
        updateMcqTimerDisplay();
        if (mcqState.timeLeft <= 0){
          stopMcqTimer();
          submitMcqTest();
        }
      } else {
        mcqState.timeLeft++;
        updateMcqTimerDisplay();
      }
    }, 1000);
  }

  function stopMcqTimer(){
    if (mcqState.timerHandle){
      clearInterval(mcqState.timerHandle);
      mcqState.timerHandle = null;
    }
  }

  function updateMcqTimerDisplay(){
    mcqStatTime.textContent = formatTime(mcqState.timeLeft);
    if (mcqState.timing === "timed" && mcqState.timeLeft <= 60){
      mcqStatTime.style.color = "var(--coral)";
    } else {
      mcqStatTime.style.color = "";
    }
  }

  function renderMcqQuestion(){
    const idx = mcqState.currentIndex;
    const total = mcqState.questions.length;
    const question = mcqState.questions[idx];

    mcqQuestionLabel.textContent = `Question ${idx + 1} of ${total}`;
    mcqStatProgress.textContent = `${idx + 1} / ${total}`;
    mcqProgressFill.style.width = `${((idx + 1) / total) * 100}%`;

    mcqQuestionText.textContent = question.q;
    mcqOptionsEl.innerHTML = "";
    mcqFeedback.hidden = true;

    const letters = ["A", "B", "C", "D", "E", "F"];
    const chosen = mcqState.answers[idx];

    question.options.forEach((optText, optIndex) => {
      const btn = document.createElement("button");
      btn.className = "mcq-option";
      btn.innerHTML = `<span class="mcq-option-letter">${letters[optIndex] || optIndex + 1}</span><span>${escapeHtml(optText)}</span>`;
      if (optIndex === chosen) btn.classList.add("selected");
      btn.addEventListener("click", () => selectMcqOption(optIndex));
      mcqOptionsEl.appendChild(btn);
    });

    mcqPrevBtn.disabled = idx === 0;
    const isLast = idx === total - 1;
    mcqNextQBtn.hidden = isLast;
    mcqSubmitBtn.hidden = !isLast;
    mcqNextQBtn.disabled = false;
    mcqSubmitBtn.disabled = false;
  }

  function escapeHtml(str){
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function selectMcqOption(optIndex){
    const idx = mcqState.currentIndex;
    mcqState.answers[idx] = optIndex;
    renderMcqQuestion();
  }

  mcqPrevBtn.addEventListener("click", () => {
    if (mcqState.currentIndex > 0){
      mcqState.currentIndex--;
      renderMcqQuestion();
    }
  });

  mcqNextQBtn.addEventListener("click", () => {
    if (mcqState.currentIndex < mcqState.questions.length - 1){
      mcqState.currentIndex++;
      renderMcqQuestion();
    }
  });

  mcqSubmitBtn.addEventListener("click", submitMcqTest);

  /* ---------------------------------------------
     20. MCQ RESULTS
  --------------------------------------------- */
  function submitMcqTest(){
    if (mcqState.finished) return;
    mcqState.finished = true;
    stopMcqTimer();

    const total = mcqState.questions.length;
    let correct = 0, incorrect = 0, skipped = 0;

    mcqState.questions.forEach((q, i) => {
      const ans = mcqState.answers[i];
      if (ans === null || ans === undefined) skipped++;
      else if (ans === q.answer) correct++;
      else incorrect++;
    });

    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const elapsedSec = mcqState.timing === "timed"
      ? MCQ_TIMED_SECONDS - Math.max(mcqState.timeLeft, 0)
      : mcqState.timeLeft;
    const passed = percent >= 40; // matches GCC-TBC 40% sectional passing rule

    mcqResultsScore.textContent = `${correct}/${total}`;
    mcqResultsPercent.textContent = `${percent}%`;
    mcqResultsPassBadge.textContent = passed ? "PASS" : "FAIL";
    mcqResultsPassBadge.className = "mcq-pass-banner " + (passed ? "pass-badge-yes" : "pass-badge-no");
    mcqResultsCorrect.textContent = String(correct);
    mcqResultsIncorrect.textContent = String(incorrect);
    mcqResultsSkipped.textContent = String(skipped);
    mcqResultsTotal.textContent = String(total);
    mcqResultsSpeed.textContent = `${mcqState.speed} WPM`;
    mcqResultsTime.textContent = formatTime(elapsedSec);
    mcqResultsMessage.textContent = passed
      ? `Solid work — you scored ${correct}/${total} on the ${mcqState.speed} WPM set. The GCC-TBC objective section needs 40% (10/25) to pass.`
      : `You got ${correct}/${total} on the ${mcqState.speed} WPM set. The GCC-TBC objective section needs 40% (10/25) to pass — review the answers below and try again.`;

    renderMcqReview();
    saveMcqBestScore(mcqState.speed, percent);
    showScreen(mcqResultsScreen);
  }

  function renderMcqReview(){
    mcqReviewList.innerHTML = "";
    mcqState.questions.forEach((q, i) => {
      const ans = mcqState.answers[i];
      const skipped = ans === null || ans === undefined;
      const correct = !skipped && ans === q.answer;

      const item = document.createElement("div");
      item.className = "mcq-review-item " + (skipped ? "is-skipped" : correct ? "is-correct" : "is-incorrect");

      const yourAnswerText = skipped ? "Skipped" : q.options[ans];
      const yourAnswerClass = skipped ? "" : correct ? "is-right" : "is-wrong";

      item.innerHTML = `
        <p class="mcq-review-q">${i + 1}. ${escapeHtml(q.q)}</p>
        <div class="mcq-review-row"><span>Your answer</span><span class="mcq-review-your ${yourAnswerClass}">${escapeHtml(yourAnswerText)}</span></div>
        ${!correct ? `<div class="mcq-review-row"><span>Correct answer</span><span class="mcq-review-correct">${escapeHtml(q.options[q.answer])}</span></div>` : ""}
      `;
      mcqReviewList.appendChild(item);
    });
  }

  mcqTryAgainBtn.addEventListener("click", startMcqTest);

  /* ---------------------------------------------
     21. MCQ PERSONAL BEST (localStorage, per speed)
  --------------------------------------------- */
  function mcqBestKey(speed){ return `rupesh_mcq_best_${speed}`; }

  function loadMcqBestScore(speed){
    const best = Number(localStorage.getItem(mcqBestKey(speed)) || 0);
    if (best > 0){
      mcqBestValue.textContent = `${best}%`;
      mcqBestBadge.hidden = false;
    } else {
      mcqBestBadge.hidden = true;
    }
  }

  function saveMcqBestScore(speed, percent){
    const best = Number(localStorage.getItem(mcqBestKey(speed)) || 0);
    if (percent > best){
      localStorage.setItem(mcqBestKey(speed), String(percent));
    }
    loadMcqBestScore(speed);
  }

}
/* ---------------------------------------------
   23. EMAIL PRACTICE — REFERENCE SAMPLES
   Mirrors the GCC-TBC exam's Email section: 8 minutes,
   5 marks, reproduce To / Subject / Body / Attachment
   exactly as shown.
--------------------------------------------- */
const EMAIL_SAMPLES = [
  {
    label: "Meeting notice",
    to: "allstaff@brightwaysolutions.com",
    subject: "Team Meeting Scheduled for Friday, 10 AM",
    body: "Dear Team, A team meeting has been scheduled for Friday at 10 AM in the conference room. Kindly attend on time with your progress reports. Regards, Admin Office",
    attachment: "meeting_agenda.pdf",
    attachmentDecoys: ["meeting_minutes.docx", "agenda_draft.pdf", "conference_room_layout.jpg"]
  },
  {
    label: "Report submission",
    to: "manager.review@brightwaysolutions.com",
    subject: "Submission of Monthly Sales Report",
    body: "Dear Sir, Please find attached the sales report for October as requested. Kindly review it and let me know if any changes are needed. Thank you, Rohan Deshmukh",
    attachment: "october_sales_report.xlsx",
    attachmentDecoys: ["september_sales_report.xlsx", "sales_summary.pdf", "regional_sales_chart.png"]
  },
  {
    label: "Leave application",
    to: "hr.department@brightwaysolutions.com",
    subject: "Application for Casual Leave",
    body: "Dear HR Team, I would like to request casual leave for two days, from the fourteenth to the fifteenth of this month, due to a family function. Thank you, Priya Kulkarni",
    attachment: "None",
    attachmentDecoys: ["leave_form.pdf", "medical_certificate.pdf", "id_proof_copy.jpg"]
  },
  {
    label: "Vendor enquiry",
    to: "sales@omegaofficesupplies.com",
    subject: "Enquiry Regarding Bulk Stationery Order",
    body: "Dear Sir or Madam, Please share your latest price list and bulk discounts for office stationery, along with your delivery timeline. Regards, Procurement Team",
    attachment: "stationery_requirements.pdf",
    attachmentDecoys: ["price_list_request.docx", "vendor_form.pdf", "previous_order_invoice.pdf"]
  },
  {
    label: "Invoice submission",
    to: "accounts@brightwaysolutions.com",
    subject: "Invoice for September Consulting Services",
    body: "Dear Accounts Team, Please find attached the invoice for consulting services rendered in September. Kindly process the payment before the tenth of next month. Regards, Neha Sharma",
    attachment: "invoice_september_2025.pdf",
    attachmentDecoys: ["invoice_august_2025.pdf", "payment_receipt.pdf", "service_agreement.docx"]
  },
  {
    label: "Training invitation",
    to: "training.desk@brightwaysolutions.com",
    subject: "Invitation to Excel Skills Training Session",
    body: "Dear Team, You are invited to a hands on Excel skills training session on Wednesday at 3 PM in the training hall. Please confirm your attendance by Monday. Regards, Learning and Development",
    attachment: "training_schedule.pdf",
    attachmentDecoys: ["training_feedback_form.docx", "excel_practice_sheet.xlsx", "venue_map.jpg"]
  },
  {
    label: "Holiday notice",
    to: "allstaff@brightwaysolutions.com",
    subject: "Office Closed on Account of Public Holiday",
    body: "Dear Team, Please note that the office will remain closed on Thursday on account of a public holiday. Normal working hours will resume on Friday. Regards, Admin Office",
    attachment: "None",
    attachmentDecoys: ["holiday_calendar_2025.pdf", "office_circular.docx", "attendance_policy.pdf"]
  },
  {
    label: "Password reset",
    to: "it.support@brightwaysolutions.com",
    subject: "Request for Email Password Reset",
    body: "Dear IT Support, I am unable to access my official email account and would like to request a password reset at the earliest. Please let me know the next steps. Regards, Arjun Mehta",
    attachment: "None",
    attachmentDecoys: ["employee_id_card.jpg", "it_request_form.pdf", "screenshot_error.png"]
  },
  {
    label: "Feedback request",
    to: "clientcare@brightwaysolutions.com",
    subject: "Request for Feedback on Recent Service",
    body: "Dear Customer, We hope you are satisfied with our recent service. Kindly take a moment to fill out the attached feedback form so we can serve you better. Regards, Customer Care Team",
    attachment: "feedback_form.pdf",
    attachmentDecoys: ["service_summary.docx", "customer_survey.xlsx", "discount_coupon.pdf"]
  },
  {
    label: "Welcome email",
    to: "new.employee@brightwaysolutions.com",
    subject: "Welcome to Brightway Solutions",
    body: "Dear Aditi, Welcome aboard. We are delighted to have you join our team from Monday. Please find your onboarding checklist attached for your reference. Regards, HR Department",
    attachment: "onboarding_checklist.pdf",
    attachmentDecoys: ["employee_handbook.pdf", "offer_letter_copy.pdf", "id_card_form.docx"]
  },
  {
    label: "Resignation notice",
    to: "hr.manager@brightwaysolutions.com",
    subject: "Resignation from Position of Executive Assistant",
    body: "Dear HR Team, I am writing to formally resign from my position, effective thirty days from today. Please let me know the handover process and any formalities I need to complete. Regards, Sanjay Patil",
    attachment: "Resignation_Letter.pdf",
    attachmentDecoys: ["Relieving_Order.pdf", "Experience_Certificate.pdf", "Exit_Interview_Form.docx"]
  },
  {
    label: "Project status update",
    to: "projectlead@brightwaysolutions.com",
    subject: "Status Update on Website Redesign Project",
    body: "Dear Sir, The website redesign project is on track and eighty percent complete. Please find the detailed status report attached for your review. Regards, Kavita Rao",
    attachment: "Project_Report.pdf",
    attachmentDecoys: ["Project_Timeline.xlsx", "Design_Mockups.pdf", "Client_Feedback_Notes.docx"]
  },
  {
    label: "Medical leave application",
    to: "hr.support@brightwaysolutions.com",
    subject: "Application for Medical Leave",
    body: "Dear HR Team, I am unwell and unable to attend office for the next three days. I have attached the medical certificate issued by my doctor for your records. Regards, Amit Joshi",
    attachment: "Medical_Certificate.pdf",
    attachmentDecoys: ["Leave_Application.pdf", "Doctor_Prescription.jpg", "Fitness_Certificate.pdf"]
  },
  {
    label: "Expense reimbursement",
    to: "finance.team@brightwaysolutions.com",
    subject: "Reimbursement Request for Travel Expenses",
    body: "Dear Accounts Team, Kindly find attached the expense report for my client visit last week. I would appreciate reimbursement at your earliest convenience. Regards, Meera Nair",
    attachment: "Expense_Report.pdf",
    attachmentDecoys: ["Travel_Receipts.pdf", "Hotel_Invoice.pdf", "Cab_Bills_Scan.jpg"]
  },
  {
    label: "Event registration",
    to: "events@brightwaysolutions.com",
    subject: "Registration Confirmation for Annual Conference",
    body: "Dear Team, Please find attached the completed registration form for the annual conference to be held next month. Kindly confirm receipt at the earliest. Regards, Rahul Verma",
    attachment: "Registration_Form.pdf",
    attachmentDecoys: ["Event_Proposal.pdf", "Conference_Brochure.pdf", "Travel_Itinerary.docx"]
  },
  {
    label: "IT issue report",
    to: "helpdesk@brightwaysolutions.com",
    subject: "Reporting a Recurring System Error",
    body: "Dear IT Support, I am facing a recurring error message while logging into the billing system. A screenshot of the issue is attached for your reference. Regards, Fatima Sheikh",
    attachment: "Issue_Screenshot.pdf",
    attachmentDecoys: ["Error_Log.docx", "System_Specifications.pdf", "IT_Request_Form.pdf"]
  },
  {
    label: "Service quotation",
    to: "procurement@omegaofficesupplies.com",
    subject: "Quotation for Annual Maintenance Contract",
    body: "Dear Sir, As requested, please find attached our quotation for the annual maintenance contract covering all office equipment. We look forward to your confirmation. Regards, Vikram Singh",
    attachment: "Service_Quotation.pdf",
    attachmentDecoys: ["Maintenance_Schedule.pdf", "Terms_And_Conditions.docx", "Previous_Contract_Copy.pdf"]
  }
];
// Shared filename pool the attachment dropdown draws its decoys from —
// mirrors the real exam's long "Select Attachment" list (one big list
// of plausible files, not just 3 decoys tied to that one email).
const ATTACHMENT_POOL = [
  "Leave_Application.pdf", "Medical_Certificate.pdf", "Project_Report.pdf",
  "Meeting_Agenda.pdf", "Resignation_Letter.pdf", "Expense_Report.pdf",
  "Registration_Form.pdf", "Issue_Screenshot.pdf", "Event_Proposal.pdf",
  "Service_Quotation.pdf", "Sales_Report_October.xlsx", "Invoice_September_2025.pdf",
  "Training_Schedule.pdf", "Feedback_Form.pdf", "Onboarding_Checklist.pdf",
  "Holiday_Calendar_2025.pdf", "Vendor_Price_List.docx", "Offer_Letter_Copy.pdf",
  "Employee_Handbook.pdf", "Client_Feedback_Notes.docx", "Travel_Itinerary.docx",
  "Payment_Receipt.pdf", "Conference_Brochure.pdf", "System_Error_Log.docx",
  "Maintenance_Schedule.pdf", "ID_Proof_Copy.jpg", "Relieving_Order.pdf",
  "Experience_Certificate.pdf", "Doctor_Prescription.jpg", "Hotel_Invoice.pdf"
];
const EMAIL_TIME_SECONDS = 5 * 60;

const emailState = {
  topicIndex: 0,
  startTime: null,
  timerHandle: null,
  timeLeft: EMAIL_TIME_SECONDS,
  finished: false
};

/* Page flag: only /email/ has the email "To" input. */
const isEmailPage = !!emailInputTo;

if (isEmailPage) {

  emailStartBtn.addEventListener("click", startEmailTest);
  emailChangeSettingsBtn.addEventListener("click", () => {
    stopEmailTimer();
    showScreen(emailSetupScreen);
  });
  emailRestartBtn.addEventListener("click", startEmailTest);
  emailTryAgainBtn.addEventListener("click", startEmailTest);

  /* ---------------------------------------------
     24. EMAIL TEST ENGINE
  --------------------------------------------- */
  function startEmailTest(){
    emailState.topicIndex = Math.floor(Math.random() * EMAIL_SAMPLES.length);
    const sample = EMAIL_SAMPLES[emailState.topicIndex];
    emailState.finished = false;
    emailState.startTime = Date.now();
    emailState.timeLeft = EMAIL_TIME_SECONDS;

    emailStatTopic.textContent = sample.label;
    refEmailTo.textContent = sample.to;
    refEmailSubject.textContent = sample.subject;
    refEmailBody.textContent = sample.body;
    refEmailAttachment.textContent = sample.attachment;

    emailInputTo.value = "";
    emailInputSubject.value = "";
    emailInputBody.value = "";
    buildEmailAttachmentOptions(sample);

    startEmailTimer();
    showScreen(emailTestScreen);
    emailInputTo.focus();
  }

  // GCC-TBC has candidates select/attach the correct file rather than
  // type a filename, so the practice attachment field is a dropdown of
  // shuffled real + decoy filenames instead of free text.
  function buildEmailAttachmentOptions(sample){
    // Build a long, exam-style list: the correct file, this sample's own
    // decoys, plus extra filler pulled from the shared pool — landing
    // around 10 options total like the real "Select Attachment" dropdown.
    const ownDecoys = sample.attachmentDecoys || [];
    const usedLower = new Set([sample.attachment.toLowerCase(), ...ownDecoys.map(d => d.toLowerCase())]);
    const filler = shuffle(ATTACHMENT_POOL.filter(name => !usedLower.has(name.toLowerCase())));
    const targetCount = 10;
    const needed = Math.max(0, targetCount - 1 - ownDecoys.length);
    const choices = shuffle([sample.attachment, ...ownDecoys, ...filler.slice(0, needed)]);
    emailInputAttachment.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = "— Select attachment —";
    emailInputAttachment.appendChild(placeholder);
    choices.forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name === "None" ? "No attachment needed" : name;
      emailInputAttachment.appendChild(opt);
    });
  }

  function startEmailTimer(){
    stopEmailTimer();
    updateEmailTimerDisplay();
    emailState.timerHandle = setInterval(() => {
      emailState.timeLeft--;
      updateEmailTimerDisplay();
      if (emailState.timeLeft <= 0){
        stopEmailTimer();
        finishEmailTest("timeup");
      }
    }, 1000);
  }

  function stopEmailTimer(){
    if (emailState.timerHandle){
      clearInterval(emailState.timerHandle);
      emailState.timerHandle = null;
    }
  }

  function updateEmailTimerDisplay(){
    emailStatTime.textContent = formatTime(emailState.timeLeft);
    emailStatTime.style.color = emailState.timeLeft <= 60 ? "var(--coral)" : "";
  }

  emailSubmitBtn.addEventListener("click", () => finishEmailTest("submitted"));

  // Loose match for To/Subject/Attachment — case and stray-space
  // insensitive, since those fields are scored as right/wrong (not
  // word-by-word) in the real exam.
  function normalizeField(str){
    return (str || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  function finishEmailTest(reason){
    if (emailState.finished) return;
    emailState.finished = true;
    stopEmailTimer();

    const sample = EMAIL_SAMPLES[emailState.topicIndex];
    const elapsedSeconds = emailState.startTime
      ? Math.max(1, Math.round((Date.now() - emailState.startTime) / 1000))
      : 1;

    // GCC-TBC email marking: 5 marks total, half a mark deducted for
    // every mistake (To / Subject / Attachment count as one mistake
    // each if wrong; the Body is checked word by word like the exam's
    // other sections). Marks drop to 0 once mistakes exceed the total.
    const toMistake = normalizeField(emailInputTo.value) === normalizeField(sample.to) ? 0 : 1;
    const subjectMistake = normalizeField(emailInputSubject.value) === normalizeField(sample.subject) ? 0 : 1;
    const attachmentMistake = normalizeField(emailInputAttachment.value) === normalizeField(sample.attachment) ? 0 : 1;
    const passageWords = sample.body.split(/\s+/).filter(Boolean);
    const { words: typedWords } = tokenizeTyped(emailInputBody.value);
    const ops = diffWords(passageWords, typedWords);
    const { full, half } = classifyMistakes(ops, passageWords, typedWords);
    const bodyMistakes = full.omission + full.addition + full.substitution + full.spelling + half.capitalization + half.punctuation;

    const marksTotal = 5;
    const totalMistakes = toMistake + subjectMistake + attachmentMistake + bodyMistakes;
    const marks = Math.max(0, marksTotal - totalMistakes * 0.5);
    const passMarks = 2; // 40% of 5, per GCC-TBC's per-section passing rule
    const passed = marks >= passMarks;

    showEmailResults({
      marks, marksTotal, passMarks, passed,
      toMistake, subjectMistake, attachmentMistake,
      bodyMistakes, totalMistakes, seconds: elapsedSeconds, reason
    });

    buildEmailBodyAnalysis(ops, passageWords, typedWords);
    saveEmailBestScore(marks);
  }

  function buildEmailBodyAnalysis(ops, passageWords, typedWords){
    const frag = document.createDocumentFragment();
    ops.forEach(op => {
      if (op.type === "match" || op.type === "sub"){
        const pWord = passageWords[op.pIdx];
        const tWord = typedWords[op.tIdx];
        const span = document.createElement("span");
        if (op.type === "sub"){
          span.className = "an-word an-wrong";
          span.title = `Reference: "${pWord}"`;
        } else if (pWord === tWord){
          span.className = "an-word an-correct";
        } else {
          span.className = "an-word an-format";
          span.title = `Reference: "${pWord}" (case/punctuation differs)`;
        }
        span.textContent = tWord;
        frag.appendChild(span);
        frag.appendChild(document.createTextNode(" "));
      } else if (op.type === "add"){
        const span = document.createElement("span");
        span.className = "an-word an-extra";
        span.title = "Extra word (addition, not in reference)";
        span.textContent = typedWords[op.tIdx];
        frag.appendChild(span);
        frag.appendChild(document.createTextNode(" "));
      } else if (op.type === "omit"){
        const span = document.createElement("span");
        span.className = "an-word an-omitted";
        span.title = "Skipped — you didn't type this word (omission)";
        span.textContent = passageWords[op.pIdx];
        frag.appendChild(span);
        frag.appendChild(document.createTextNode(" "));
      }
    });
    emailAnalysisText.innerHTML = "";
    emailAnalysisText.appendChild(frag);
  }

  function showEmailResults(r){
    emailResultsEyebrow.textContent =
      r.reason === "timeup" ? "Time's up" : "Email submitted";

    emailResultsMarks.textContent = r.marks % 1 === 0 ? r.marks : r.marks.toFixed(1);
    emailResultsPassBadge.textContent = r.passed ? "PASS" : "FAIL";
    emailResultsPassBadge.className = "pass-badge " + (r.passed ? "pass-badge-yes" : "pass-badge-no");

    emailResultsTo.textContent = r.toMistake === 0 ? "Correct" : "Mistake (-0.5)";
    emailResultsSubject.textContent = r.subjectMistake === 0 ? "Correct" : "Mistake (-0.5)";
    emailResultsAttachment.textContent = r.attachmentMistake === 0 ? "Correct" : "Mistake (-0.5)";
    emailResultsBody.textContent = `${r.bodyMistakes} mistake${r.bodyMistakes === 1 ? "" : "s"}`;
    emailResultsTime.textContent = formatTime(r.seconds);
    emailResultsMistakes.textContent = r.totalMistakes;

    emailResultsMessage.textContent = buildEmailMessage(r);
    showScreen(emailResultsScreen);
  }

  function buildEmailMessage(r){
    if (!r.passed){
      return `You scored ${r.marks}/${r.marksTotal} — below the 2-mark (40%) pass line. Every mistake, in the To address, Subject, Attachment name, or Body wording, cuts half a mark, so accuracy matters more than speed here.`;
    }
    const notes = [];
    if (r.toMistake) notes.push("the To address");
    if (r.subjectMistake) notes.push("the Subject line");
    if (r.attachmentMistake) notes.push("the Attachment name");
    if (r.bodyMistakes > 0) notes.push("the Body");
    if (notes.length === 0){
      return `Perfect score — ${r.marks}/${r.marksTotal}. Every field matched the reference email exactly.`;
    }
    return `You passed with ${r.marks}/${r.marksTotal} marks. Double-check ${notes.join(", ")} next time for a perfect score.`;
  }

  /* ---------------------------------------------
     25. EMAIL PERSONAL BEST (localStorage)
  --------------------------------------------- */
  const EMAIL_BEST_KEY = "rupesh_email_best_marks";

  function loadEmailBestScore(){
    const best = Number(localStorage.getItem(EMAIL_BEST_KEY) || 0);
    if (best > 0){
      emailBestValue.textContent = `${best % 1 === 0 ? best : best.toFixed(1)}/5`;
      emailBestBadge.hidden = false;
    }
  }

  function saveEmailBestScore(marks){
    const best = Number(localStorage.getItem(EMAIL_BEST_KEY) || 0);
    if (marks > best){
      localStorage.setItem(EMAIL_BEST_KEY, String(marks));
      emailBestValue.textContent = `${marks % 1 === 0 ? marks : marks.toFixed(1)}/5`;
      emailBestBadge.hidden = false;
    }
  }

}

/* ---------------------------------------------
   22. INIT — page aware
   Each real HTML page only contains the markup
   for its own section, so we only boot the
   matching engine on that page.
--------------------------------------------- */
initTheme();

if (isTypingTestPage) {
  loadBestScore();

  // Speed comes from the page itself (data-speed on <body>, set
  // per the URL/folder the page lives at, e.g. /typing/english/30-wpm/)
  // so a refresh, direct link, bookmark or shared URL always works.
  const pageSpeed = Number(document.body.dataset.speed);
  if (pageSpeed) state.speed = pageSpeed;

  showScreen(setupScreen);
  goToStep(1);
}

if (isMcqPage) {
  setMcqTiming("timed");
  goToMcqStep(1);
  loadMcqBestScore(mcqState.speed);
  updateMcqBankNotice();
  showScreen(mcqSetupScreen);
}

if (isEmailPage) {
  loadEmailBestScore();
  showScreen(emailSetupScreen);
}
