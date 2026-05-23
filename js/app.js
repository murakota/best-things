// Grab the parts of the page we need to read or update.
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const leaderboardList = document.getElementById("leaderboard");

// The "key" we store our scores under in the browser's localStorage.
const STORAGE_KEY = "bestThingsScores";

// Whichever two things are on screen right now.
let currentPair = [];

// localStorage only stores text, so we convert to/from JSON.
function loadScores() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
}

function saveScores(scores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

// Pick two *different* things at random.
function pickTwoThings() {
  const first = Math.floor(Math.random() * THINGS.length);
  let second = Math.floor(Math.random() * THINGS.length);
  while (second === first) {
    second = Math.floor(Math.random() * THINGS.length);
  }
  return [THINGS[first], THINGS[second]];
}

// Put a fresh matchup on the screen.
function showNewMatchup() {
  currentPair = pickTwoThings();
  leftButton.textContent = currentPair[0];
  rightButton.textContent = currentPair[1];
}

// Record a win for the chosen thing (both things get a "battle").
function vote(winner, loser) {
  const scores = loadScores();

  if (!scores[winner]) scores[winner] = { wins: 0, battles: 0 };
  if (!scores[loser]) scores[loser] = { wins: 0, battles: 0 };

  scores[winner].wins += 1;
  scores[winner].battles += 1;
  scores[loser].battles += 1;

  saveScores(scores);
  showLeaderboard();
  showNewMatchup();
}

// Sort the things by win rate and list the top 10.
function showLeaderboard() {
  const scores = loadScores();

  const ranked = Object.keys(scores).map(function (name) {
    const { wins, battles } = scores[name];
    return { name, wins, battles, winRate: wins / battles };
  });

  ranked.sort((a, b) => b.winRate - a.winRate);

  leaderboardList.innerHTML = "";
  ranked.slice(0, 10).forEach(function (item) {
    const li = document.createElement("li");
    const percent = Math.round(item.winRate * 100);
    li.textContent = `${item.name} — ${percent}% (${item.wins}/${item.battles})`;
    leaderboardList.appendChild(li);
  });
}

// When a button is clicked, the thing on it wins over the other one.
leftButton.addEventListener("click", () => vote(currentPair[0], currentPair[1]));
rightButton.addEventListener("click", () => vote(currentPair[1], currentPair[0]));

// Kick things off.
showNewMatchup();
showLeaderboard();
