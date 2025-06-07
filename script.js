const circle = document.getElementById("circle");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const gameContainer = document.querySelector(".game-container");

const correctWords = [
  "Accommodate", "Achieve", "Across", "Aggressive", "A lot",
  "Amateur", "Apparent", "Argument", "Basically", "Beginning",
  "Believe", "Business", "Calendar", "Category", "Collectible",
  "Column", "Committed", "Conscience", "Conscious", "Definitely",
  "Discipline", "Drunkenness", "Embarrass", "Equipment", "Exaggerate",
  "Exceed", "Experience", "Explanation", "Familiar", "Finally",
  "Foreign", "Friend", "Generally", "Government", "Grammar",
  "Guarantee", "Harass", "Height", "Humorous", "Immediate",
  "Independent", "Interrupt", "Irresistible", "Knowledge", "Leisure",
  "Library", "License", "Maintenance", "Maneuver", "Medieval",
  "Memento", "Millennium", "Miniature", "Minimum", "Miscellaneous",
  "Necessary", "Noticeable", "Occasion", "Occasionally", "Occurred",
  "Occurrence", "Opportunity", "Pastime", "Perseverance", "Personnel",
  "Playwright", "Possession", "Preferred", "Prejudice", "Principal",
  "Privilege", "Probably", "Proceed", "Professor", "Pronunciation",
  "Publicly", "Questionnaire", "Receive", "Recommend", "Referred",
  "Repetition", "Restaurant", "Ridiculous", "Rhythm", "Schedule",
  "Secretary", "Separate", "Similar", "Special", "Strength",
  "Success", "Supersede", "Surprise", "Temperature", "Twelfth",
  "Tomorrow", "Until", "Vacuum", "Weather", "Weird",
  "Wherever", "Which", "Withhold", "Writing", "Yield"
];

const incorrectWords = [
  "Acommodate", "Acheive", "Accross", "Aggresive", "Alot",
  "Amature", "Apparant", "Arguement", "Basicly", "Begining",
  "Belive", "Buisness", "Calender", "Catagory", "Collectable",
  "Colum", "Commited", "Conscence", "Concious", "Definately",
  "Disipline", "Drunkeness", "Embarass", "Equiptment", "Exagerate",
  "Excede", "Experiance", "Explanaton", "Familar", "Finaly",
  "Foriegn", "Freind", "Generalley", "Goverment", "Grammer",
  "Gaurantee", "Harrass", "Hieght", "Humerous", "Imediate",
  "Independant", "Interupt", "Irresistable", "Knowlege", "Liesure",
  "Libary", "Lisense", "Maintanance", "Maneouvre", "Midieval",
  "Momento", "Millenium", "Minature", "Minimun", "Miscelaneous",
  "Necesary", "Noticable", "Ocasion", "Occasionly", "Ocurred",
  "Occurence", "Oppertunity", "Pasttime", "Perseverence", "Personel",
  "Playwrite", "Posession", "Prefered", "Predjudice", "Principle",
  "Priviledge", "Probly", "Procede", "Proffessor", "Pronounciation",
  "Publically", "Questionaire", "Recieve", "Reccomend", "Refered",
  "Repitition", "Restaraunt", "Rediculous", "Rythm", "Schedual",
  "Secratary", "Seperate", "Similiar", "Specal", "Strenght",
  "Sucess", "Supercede", "Suprise", "Temprature", "Twelth",
  "Tommorow", "Untill", "Vacume", "Wether", "Wierd",
  "Whereever", "Wich", "Withold", "Writting", "Yeild"
];

let currentWord = "";
let score = 0;
let timeLeft = 30;
let gameInterval;
let timerInterval;
let moveCount = 0;
let isMoving = false;
let bonusMessageVisible = false;

let difficulty = "Medium";  // Default difficulty

const normalSize = 120;
const bigSize = 240;

function getRandomPosition(circleSize) {
  const containerRect = gameContainer.getBoundingClientRect();
  const x = Math.random() * (containerRect.width - circleSize);
  const y = Math.random() * (containerRect.height - circleSize - 200) + 200;
  return { x, y };
}

function getRandomWord() {
  if (Math.random() < 0.5) {
    currentWord = correctWords[Math.floor(Math.random() * correctWords.length)];
  } else {
    currentWord = incorrectWords[Math.floor(Math.random() * incorrectWords.length)];
  }
  return currentWord;
}

function adjustCircleSize(word) {
  const maxWidth = 0.8 * gameContainer.clientWidth;
  const wordLength = word.length;
  const fontSize = parseInt(window.getComputedStyle(circle).fontSize);
  const estimatedWidth = wordLength * fontSize * 0.6;

  const newSize = Math.min(estimatedWidth + 40, maxWidth);
  circle.style.width = `${newSize}px`;
  circle.style.height = `${newSize}px`;
}

function moveCircle() {
  if (isMoving) return;
  isMoving = true;

  moveCount++;
  const isBig = moveCount % 7 === 0;
  const circleSize = isBig ? bigSize : normalSize;
  circle.style.width = `${circleSize}px`;
  circle.style.height = `${circleSize}px`;
  circle.style.borderRadius = '10%';

  const { x, y } = getRandomPosition(circleSize);
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;

  const randomWord = getRandomWord();
  adjustCircleSize(randomWord);
  circle.innerHTML = `<span>${randomWord}</span>`;
  circle.dataset.isBig = isBig ? 'true' : 'false';

  setTimeout(() => {
    isMoving = false;
  }, 3000);
}

function showBonusMessage(message, color) {
  if (bonusMessageVisible) return;
  bonusMessageVisible = true;

  const bonusMessage = document.createElement('div');
  bonusMessage.classList.add('bonus-message');
  bonusMessage.textContent = message;
  bonusMessage.style.color = color;
  document.body.appendChild(bonusMessage);

  setTimeout(() => {
    bonusMessage.remove();
    bonusMessageVisible = false;
  }, 3000);
}

function titleScreen() {
  gameContainer.innerHTML = `
    <h1>Tapspire!</h1>
  `;

  const easyBtn = document.createElement("button");
  easyBtn.textContent = "Easy";
  easyBtn.addEventListener('click', () => {
    difficulty = "Easy";
    startGame();
  });

  const mediumBtn = document.createElement("button");
  mediumBtn.textContent = "Medium";
  mediumBtn.addEventListener('click', () => {
    difficulty = "Medium";
    startGame();
  });

  const hardBtn = document.createElement("button");
  hardBtn.textContent = "Hard";
  hardBtn.addEventListener('click', () => {
    difficulty = "Hard";
    startGame();
  });

  gameContainer.appendChild(easyBtn);
  gameContainer.appendChild(mediumBtn);
  gameContainer.appendChild(hardBtn);
}

function startGame() {
  score = 0;
  timeLeft = difficulty === "Easy" ? 120 : difficulty === "Medium" ? 60 : 40;
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}s`;

  restartBtn.style.display = "none";
  circle.style.display = "block";

  moveCircle();

  gameInterval = setInterval(() => {
    moveCircle();
  }, 5000);

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

restartBtn.addEventListener("click", startGame);

window.onload = titleScreen;

// Fireworks Animation

// Function to create the fireworks effect
function createFireworks() {
  const fireworksContainer = document.createElement("div");
  fireworksContainer.classList.add("fireworks");

  // Add multiple sparks to the fireworks container
  for (let i = 0; i < 10; i++) {
    const spark = document.createElement("div");
    spark.classList.add("firework-spark");
    const angle = Math.random() * 360;
    const distance = Math.random() * 50 + 50;
    const duration = Math.random() * 0.5 + 1;
    spark.style.animationDuration = `${duration}s`;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    spark.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

    fireworksContainer.appendChild(spark);
  }

  document.body.appendChild(fireworksContainer);

  setTimeout(() => {
    fireworksContainer.remove();
  }, 2000);
}

// Check if the score reaches 10 and trigger fireworks
function checkScoreForFireworks() {
  if (score === 10) {
    createFireworks();
    showBonusMessage("Fireworks! 10 Points!", "gold");
  }
}

// Detect user clicks on the circle and update the score
circle.addEventListener("click", () => {
  score++;
  scoreDisplay.textContent = `Score: ${score}`;

  // Check if the score is 10 and trigger fireworks animation
  checkScoreForFireworks();
});


