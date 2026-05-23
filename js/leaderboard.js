// Leaderboard page logic. Reads the aggregated rankings from the database
// (the "leaderboard" view does the win/loss counting for us in SQL).
const leaderboardList = document.getElementById("leaderboard");
const emptyMessage = document.getElementById("empty");

async function showLeaderboard() {
  const { data, error } = await db
    .from("leaderboard")
    .select("*")
    .order("win_percent", { ascending: false });

  if (error) {
    emptyMessage.textContent = "Couldn't load the leaderboard — try refreshing.";
    emptyMessage.style.display = "block";
    console.error("Leaderboard error:", error.message);
    return;
  }

  if (!data || data.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }
  emptyMessage.style.display = "none";

  leaderboardList.innerHTML = "";
  data.forEach(function (row) {
    const li = document.createElement("li");
    li.textContent = `${row.name} — ${row.win_percent}% (${row.wins}/${row.battles})`;
    leaderboardList.appendChild(li);
  });
}

showLeaderboard();
