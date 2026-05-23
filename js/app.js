// Voting page logic. Picks two things, shows them, records the winner.
// (The leaderboard lives on its own page — see leaderboard.js.)
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");

// Whichever two things are on screen right now.
let currentPair = [];

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
  showNewMatchup();
}

// When a button is clicked, the thing on it wins over the other one.
leftButton.addEventListener("click", () => vote(currentPair[0], currentPair[1]));
rightButton.addEventListener("click", () => vote(currentPair[1], currentPair[0]));

// Kick things off.
showNewMatchup();
