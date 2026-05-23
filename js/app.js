// Voting page logic. Picks two things, shows them, saves the winner to the
// shared database. (The leaderboard lives on its own page — see leaderboard.js.)
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

// Save the winner, then move on. We show the next matchup immediately so it
// feels instant, and write to the database in the background.
async function vote(winner, loser) {
  showNewMatchup();

  const { error } = await db.from("votes").insert({ winner: winner, loser: loser });
  if (error) {
    console.error("Could not save vote:", error.message);
  }
}

// When a button is clicked, the thing on it wins over the other one.
leftButton.addEventListener("click", () => vote(currentPair[0], currentPair[1]));
rightButton.addEventListener("click", () => vote(currentPair[1], currentPair[0]));

// Kick things off.
showNewMatchup();
