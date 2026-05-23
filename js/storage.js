// Shared helpers for reading/writing scores in the browser's localStorage.
// Loaded by BOTH the voting page and the leaderboard page so they share data.
const STORAGE_KEY = "bestThingsScores";

// localStorage only stores text, so we convert to/from JSON.
function loadScores() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
}

function saveScores(scores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}
