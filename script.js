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
let moveCount = 0;  // Track how many moves happened

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

function moveCircle() {
  moveCount++;

  const isBig = moveCount % 7 === 0;
  const circleSize = isBig ? bigSize : normalSize;
  circle.style.width = `${circleSize}px`;
  circle.style.height = `${circleSize}px`;
  circle.style.borderRadius = '50%';

  const { x, y } = getRandomPosition(circleSize);
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;

  const randomWord = getRandomWord();
  circle.innerHTML = `<span>${randomWord}</span>`;

  circle.dataset.isBig = isBig ? 'true' : 'false';
}

function startGame() {
  score = 0;
  timeLeft = 60;
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  restartBtn.style.display = "none";
  circle.style.display = "block";

  moveCircle();

  gameInterval = setInterval(() => {
    moveCircle();
  }, 3000);

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

function showBonusMessage() {
  const bonusMessage = document.createElement('div');
  bonusMessage.classList.add('bonus-message');
  bonusMessage.textContent = "1 point + 2 BONUS!";
  document.body.appendChild(bonusMessage);

  setTimeout(() => {
    bonusMessage.remove();
  }, 2000);
}

circle.addEventListener("click", () => {
  if (timeLeft > 0) {
    const isBig = circle.dataset.isBig === 'true';

    if (correctWords.includes(currentWord)) {
      if (isBig) {
        score += 3;
        showBonusMessage();  // Show bonus message for big circle
      } else {
        score += 1;
      }
    } else {
      score--;
      if (score < 0) {
        score = 0;
        endGame();
      }
    }

    scoreDisplay.textContent = `Score: ${score}`;
    moveCircle();
  }
});

restartBtn.addEventListener("click", startGame);

window.onload = startGame;
