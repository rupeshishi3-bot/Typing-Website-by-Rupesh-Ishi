/**
 * Word Generator for Monkeytype-inspired Typing Platform
 * Generates stream of words customized to mode, difficulty, punctuation, and numbers
 */

function generateWords(options = {}) {
  const {
    mode = 'time',
    timeOption = 30,
    wordOption = 50,
    quoteOption = 'medium',
    punctuation = false,
    numbers = false,
    difficulty = 'normal',
    customText = ''
  } = options;

  // 1. Custom Text Mode
  if (mode === 'custom') {
    if (customText && customText.trim().length > 0) {
      return customText.trim().split(/\s+/).filter(Boolean);
    }
    return ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"];
  }

  // 2. Quote Mode
  if (mode === 'quote') {
    const quotesPool = (window.QUOTES && window.QUOTES[quoteOption]) || (window.QUOTES && window.QUOTES.medium) || [];
    if (quotesPool.length > 0) {
      const selected = quotesPool[Math.floor(Math.random() * quotesPool.length)];
      return {
        words: selected.text.trim().split(/\s+/).filter(Boolean),
        author: selected.author
      };
    }
    return ["simplicity", "is", "the", "prerequisite", "for", "reliability."];
  }

  // 3. Time or Word Mode
  let targetCount = 60;
  if (mode === 'words') {
    targetCount = parseInt(wordOption, 10) || 50;
  } else if (mode === 'time') {
    // Generate plenty of words so the user never runs out during the timer
    const seconds = parseInt(timeOption, 10) || 30;
    targetCount = Math.max(Math.round(seconds * 3.5), 60);
  }

  const baseDictionary = (difficulty === 'expert' && window.ADVANCED_WORDS) 
    ? window.ADVANCED_WORDS 
    : (window.COMMON_WORDS || ["the", "be", "to", "of", "and", "a", "in", "that", "have", "it"]);

  const punctuationMarks = [',', '.', '!', '?', ';', ':'];
  const words = [];

  let capitalizeNext = punctuation; // Start with capitalized first word if punctuation mode enabled

  for (let i = 0; i < targetCount; i++) {
    // Number insertion check
    if (numbers && Math.random() < 0.15) {
      const numType = Math.random();
      let numStr = '';
      if (numType < 0.4) {
        numStr = String(Math.floor(Math.random() * 90 + 10)); // 2-digit: 10-99
      } else if (numType < 0.75) {
        numStr = String(Math.floor(Math.random() * 900 + 100)); // 3-digit: 100-999
      } else {
        numStr = String(Math.floor(Math.random() * 9000 + 1000)); // 4-digit: 1000-9999
      }
      words.push(numStr);
      capitalizeNext = false;
      continue;
    }

    // Pick random word
    let word = baseDictionary[Math.floor(Math.random() * baseDictionary.length)].toLowerCase();

    // Punctuation and capitalization handling
    if (punctuation) {
      if (capitalizeNext) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
        capitalizeNext = false;
      }

      // Add trailing punctuation randomly (every 4-7 words, or at end)
      if (i > 0 && Math.random() < 0.22) {
        const mark = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
        word += mark;
        if (mark === '.' || mark === '!' || mark === '?') {
          capitalizeNext = true; // Capitalize subsequent word
        }
      }
    }

    words.push(word);
  }

  return words;
}

if (typeof window !== 'undefined') {
  window.WordGenerator = {
    generate: generateWords
  };
}
