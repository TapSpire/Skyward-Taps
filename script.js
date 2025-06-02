// Core game logic

const questionEl = document.getElementById("question");
const wordsContainer = document.getElementById("words-container");
const restartBtn = document.getElementById("restart-btn");
const statusEl = document.getElementById("status");
const scoreEl = document.getElementById("score");

let score = 0;
let gameOver = false;

function shuffleArray(arr) {
  // Fisher-Yates shuffle
  for(let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startGame() {
  score = 0;
  gameOver = false;
  statusEl.textContent = "";
  scoreEl.textContent = "Score: 0";
  restartBtn.style.display = "none";
  
  questionEl.textContent = gameData.question;

  // Combine correct and incorrect words and shuffle
  const words = shuffleArray([...gameData.correctWords, ...gameData.incorrectWords]);

  // Clear previous words
  wordsContainer.innerHTML = "";

  // Create word buttons
  words.forEach(word => {
    const wordEl = document.createElement("div");
    wordEl.classList.add("word");
    wordEl.textContent = word;
    wordEl.addEventListener("click", () => handleWordClick(word));
    wordsContainer.appendChild(wordEl);
  });
}

function handleWordClick(word) {
  if (gameOver) return;

  if (gameData.correctWords.includes(word)) {
    score++;
    scoreEl.textContent = `Score: ${score}`;
  } else {
    // Incorrect word clicked, game over
    gameOver = true;
    statusEl.textContent = "Game Over! You clicked a wrong word.";
    restartBtn.style.display = "inline-block";
  }
}

restartBtn.addEventListener("click", startGame);

// Initialize the game on page load
window.onload = startGame;
