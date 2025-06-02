const circle = document.getElementById("circle");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const gameContainer = document.querySelector(".game-container");

let score = 0;
let timeLeft = 30;
let gameInterval;
let timerInterval;

function getRandomPosition() {
  const containerRect = gameContainer.getBoundingClientRect();
  const circleSize = 60; // same as CSS width/height

  const x = Math.random() * (containerRect.width - circleSize);
  const y = Math.random() * (containerRect.height - circleSize - 100) + 100; 
  // subtract 100px to avoid overlapping score/timer/title area

  return { x, y };
}

function moveCircle() {
  const { x, y } = getRandomPosition();
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
}

function startGame() {
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  restartBtn.style.display = "none";
  circle.style.display = "block";

  moveCircle();

  gameInterval = setInterval(() => {
    moveCircle();
  }, 1000);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  circle.style.display = "none";
  restartBtn.style.display = "inline-block";
  timerDisplay.textContent = `Game Over! Final Score: ${score}`;
}

circle.addEventListener("click", () => {
  if (timeLeft > 0) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    moveCircle();
  }
});

restartBtn.addEventListener("click", startGame);

// Start the game automatically when the page loads
window.onload = startGame;
