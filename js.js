const choices = ["rock", "paper", "scissors"];
let playerScore = 0;
let computerScore = 0;
let roundsToWin = 5;
let playing = true;
let winStreak = 0;
let longestStreak = 0;
let matchHistory = [];

const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");
const resultEl = document.getElementById("result");
const lastRoundEl = document.getElementById("lastRound");
const bestOfSelect = document.getElementById("bestOf");
const resetBtn = document.getElementById("resetBtn");
const streakEl = document.getElementById("streak");
const historyEl = document.getElementById("history");
const achievementsEl = document.getElementById("achievements");

// Event Listeners
document.querySelectorAll(".choice").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!playing) return;
    playRound(btn.dataset.choice, btn);
  });
});

bestOfSelect.addEventListener("change", () => resetGame());
resetBtn.addEventListener("click", () => resetGame());

// Play a Round
function playRound(playerChoice, btn) {
  const computerChoice = getComputerChoice();
  let result = "";

  if (playerChoice === computerChoice) {
    result = "Tie!";
    winStreak = 0;
    btn.classList.add("tie");
  } else if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper")
  ) {
    result = "You win!";
    playerScore++;
    winStreak++;
    if (winStreak > longestStreak) longestStreak = winStreak;
    btn.classList.add("winner");
  } else {
    result = "Computer wins!";
    computerScore++;
    winStreak = 0;
    btn.classList.add("loser");
  }

  // Remove class after short delay
  setTimeout(() => {
    btn.classList.remove("winner", "loser", "tie");
  }, 500);

  addMatchHistory(playerChoice, computerChoice, result);
  updateScoreboard();
  lastRoundEl.textContent = `You: ${playerChoice} | CPU: ${computerChoice}`;
  resultEl.textContent = result;

  checkAchievements();
  endIfMatchOver();
}

// Computer choice (optional smarter AI for infinite mode)
function getComputerChoice() {
  // Infinite or normal mode
  if (roundsToWin === "inf" || parseInt(roundsToWin)) {
    // Count player's past moves
    const counts = { rock: 0, paper: 0, scissors: 0 };
    matchHistory.forEach(round => counts[round.player]++);
    
    // Find most frequent move
    let predictedMove = choices[Math.floor(Math.random() * 3)]; // default random
    if (matchHistory.length >= 3) {
      predictedMove = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    // 20% random chance to not counter (for unpredictability)
    if (Math.random() < 0.5) {
      return choices[Math.floor(Math.random() * 3)];
    }

    // Return counter to predicted move
    if (predictedMove === "rock") return "paper";
    if (predictedMove === "paper") return "scissors";
    if (predictedMove === "scissors") return "rock";
  }

  // Fallback random
  return choices[Math.floor(Math.random() * 3)];
}

// Match History
function addMatchHistory(player, computer, result) {
  matchHistory.unshift({ player, computer, result });
  if (matchHistory.length > 5) matchHistory.pop();

  historyEl.innerHTML = matchHistory
    .map((round, i) => `<div>R${matchHistory.length - i}: You ${round.player} vs CPU ${round.computer} → ${round.result}</div>`)
    .join("");
}

// Update Scoreboard
function updateScoreboard() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
  streakEl.textContent = `Streak: ${winStreak} (Best: ${longestStreak})`;
}

// End game check
function endIfMatchOver() {
  if (roundsToWin === "inf") return;

  const need = Math.ceil(roundsToWin / 2);
  if (playerScore >= need || computerScore >= need) {
    playing = false;
    resultEl.textContent = playerScore > computerScore ? "You win the match! 🎉" : "CPU wins the match!";
    resetBtn.style.display = "inline-block";
  }
}

// Reset Game
function resetGame() {
  playerScore = 0;
  computerScore = 0;
  playing = true;
  winStreak = 0;
  matchHistory = [];
  roundsToWin = bestOfSelect.value;

  updateScoreboard();
  resultEl.textContent = roundsToWin === "inf" ? "Infinite Mode – keep playing!" : "Make your move";
  lastRoundEl.textContent = "";
  resetBtn.style.display = "none";
  historyEl.innerHTML = "";
  achievementsEl.innerHTML = "";
}

// Achievements
function checkAchievements() {
  let unlocked = [];
  if (playerScore === 1) unlocked.push("🏆 First Win!");
  if (winStreak === 3) unlocked.push("🔥 3 Wins in a Row!");
  if (longestStreak >= 5) unlocked.push("⚡ 5+ Streak Master!");
  if (playerScore >= 10 && roundsToWin === "inf") unlocked.push("💯 10 Wins in Infinite Mode!");

  achievementsEl.innerHTML = unlocked
    .map(a => `<div class="achievement unlocked">${a}</div>`)
    .join("");
}
