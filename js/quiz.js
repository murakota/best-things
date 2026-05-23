// Quiz page logic. Shows a matchup with the vote counts HIDDEN and asks the
// player which thing the crowd ranks higher. Scores by streak of correct guesses.
const optionA = document.getElementById("optionA");
const optionB = document.getElementById("optionB");
const resultEl = document.getElementById("quiz-result");
const nextButton = document.getElementById("quiz-next");
const streakEl = document.getElementById("streak");
const bestEl = document.getElementById("best");
const emptyEl = document.getElementById("quiz-empty");

// Only quiz on things with at least this many battles, so rankings are fair.
const MIN_BATTLES = 5;
const BEST_KEY = "bestThingsQuizBest";

let pool = [];        // qualifying things: [{ name, win_percent, wins, battles }]
let current = null;   // the two things in the current question
let streak = 0;
let answered = false;

function loadBest() {
  return Number(localStorage.getItem(BEST_KEY) || 0);
}

function saveBest(value) {
  localStorage.setItem(BEST_KEY, String(value));
}

// Pick two different things that the crowd ranks differently.
function pickQuestion() {
  let a, b, tries = 0;
  do {
    a = pool[Math.floor(Math.random() * pool.length)];
    b = pool[Math.floor(Math.random() * pool.length)];
    tries++;
  } while ((a.name === b.name || a.win_percent === b.win_percent) && tries < 50);
  return { a, b };
}

function showQuestion() {
  answered = false;
  current = pickQuestion();

  optionA.textContent = current.a.name;
  optionB.textContent = current.b.name;
  optionA.className = "quiz-option";
  optionB.className = "quiz-option";
  optionA.disabled = false;
  optionB.disabled = false;
  resultEl.textContent = "";
  resultEl.className = "quiz-result";
  nextButton.hidden = true;
}

function guess(choice) {
  if (answered) return;
  answered = true;

  const { a, b } = current;
  const higher = a.win_percent >= b.win_percent ? a : b;
  const correct = choice.name === higher.name;

  // Reveal the actual percentages now.
  optionA.textContent = `${a.name} — ${a.win_percent}%`;
  optionB.textContent = `${b.name} — ${b.win_percent}%`;
  (higher === a ? optionA : optionB).classList.add("correct");
  if (!correct) {
    (choice === a ? optionA : optionB).classList.add("wrong");
  }

  optionA.disabled = true;
  optionB.disabled = true;

  if (correct) {
    streak++;
    resultEl.textContent = "Correct!";
    resultEl.className = "quiz-result good";
  } else {
    streak = 0;
    resultEl.textContent = `Nope — ${higher.name} ranks higher.`;
    resultEl.className = "quiz-result bad";
  }

  let best = loadBest();
  if (streak > best) {
    best = streak;
    saveBest(best);
  }
  streakEl.textContent = streak;
  bestEl.textContent = best;

  nextButton.hidden = false;
}

optionA.addEventListener("click", () => guess(current.a));
optionB.addEventListener("click", () => guess(current.b));
nextButton.addEventListener("click", showQuestion);

async function start() {
  bestEl.textContent = loadBest();

  const { data, error } = await db
    .from("leaderboard")
    .select("*")
    .gte("battles", MIN_BATTLES);

  if (error) {
    emptyEl.textContent = "Couldn't load the quiz — try refreshing.";
    emptyEl.hidden = false;
    console.error("Quiz load error:", error.message);
    return;
  }

  pool = data || [];
  const distinctRates = new Set(pool.map((t) => t.win_percent));

  // Need at least two things, with at least two different win rates.
  if (pool.length < 2 || distinctRates.size < 2) {
    emptyEl.textContent =
      "The quiz needs more votes first! Once enough things have been voted on, come back and test how well you know the crowd. Head to the Vote tab — and share the site!";
    emptyEl.hidden = false;
    document.querySelector(".quiz-question").hidden = true;
    document.querySelector(".quiz-options").hidden = true;
    return;
  }

  showQuestion();
}

start();
