// Leaderboard page logic. Reads the saved scores and lists them by win rate.
const leaderboardList = document.getElementById("leaderboard");
const emptyMessage = document.getElementById("empty");

function showLeaderboard() {
  const scores = loadScores();
  const names = Object.keys(scores);

  // Nothing voted on yet: show the hint, leave the list empty.
  if (names.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }
  emptyMessage.style.display = "none";

  // Turn the scores object into a sortable array.
  const ranked = names.map(function (name) {
    const { wins, battles } = scores[name];
    return { name, wins, battles, winRate: wins / battles };
  });

  // Highest win rate first.
  ranked.sort((a, b) => b.winRate - a.winRate);

  // Build the full ranked list.
  leaderboardList.innerHTML = "";
  ranked.forEach(function (item) {
    const li = document.createElement("li");
    const percent = Math.round(item.winRate * 100);
    li.textContent = `${item.name} — ${percent}% (${item.wins}/${item.battles})`;
    leaderboardList.appendChild(li);
  });
}

showLeaderboard();
