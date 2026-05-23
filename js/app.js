// Voting page logic. Loads the list of things from the database, shows a random
// pair, and saves the winner. The database is the single source of truth for
// what counts as a valid "thing".
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");

// Ignore clicks that come faster than this many milliseconds apart.
// Stops autoclickers / frantic mashing while feeling instant to a human.
// Raise it to throttle harder, lower it to allow faster voting.
const VOTE_COOLDOWN_MS = 300;
let lastVoteAt = 0;

// Filled in once we've loaded the list from the database.
let things = [];
let currentPair = [];

// Pick two *different* things at random.
function pickTwoThings() {
  const first = Math.floor(Math.random() * things.length);
  let second = Math.floor(Math.random() * things.length);
  while (second === first) {
    second = Math.floor(Math.random() * things.length);
  }
  return [things[first], things[second]];
}

// Put a fresh matchup on the screen.
function showNewMatchup() {
  currentPair = pickTwoThings();
  leftButton.textContent = currentPair[0];
  rightButton.textContent = currentPair[1];
}

// Save the winner, then move on. We advance immediately so it feels instant,
// and write to the database in the background.
async function vote(winner, loser) {
  showNewMatchup();

  const { error } = await db.from("votes").insert({ winner: winner, loser: loser });
  if (error) {
    console.error("Could not save vote:", error.message);
  }
}

// Gate every click through the cooldown: clicks that arrive too soon after the
// last accepted vote are ignored, so an autoclicker can't rack up votes.
function handleVote(winner, loser) {
  const now = Date.now();
  if (now - lastVoteAt < VOTE_COOLDOWN_MS) return;
  lastVoteAt = now;
  vote(winner, loser);
}

// When a button is clicked, the thing on it wins over the other one.
leftButton.addEventListener("click", () => handleVote(currentPair[0], currentPair[1]));
rightButton.addEventListener("click", () => handleVote(currentPair[1], currentPair[0]));

// Load the list of things from the database, then start the first matchup.
async function start() {
  leftButton.textContent = "Loading…";
  rightButton.textContent = "Loading…";

  const { data, error } = await db.from("things").select("name");

  if (error || !data || data.length < 2) {
    leftButton.textContent = "Couldn't load";
    rightButton.textContent = "Try refreshing";
    console.error("Could not load things:", error ? error.message : "not enough data");
    return;
  }

  things = data.map((row) => row.name);
  showNewMatchup();
}

start();
