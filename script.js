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

function getRandomPosition() {
  const containerRect = gameContainer.getBoundingClientRect();
  const circleSize = 120;

  const x = Math.random() * (containerRect.width - circleSize);
  const y = Math.random() * (containerRect.height - circleSize - 200) + 200;

  return { x, y };
}

function getRandomWord() {
  // 50% chance to get a correct or incorrect word
  if (Math.random() < 0.5) 
  {
    currentWord = correctWords[Math.floor(Math.random() * correctWords.length)];
  } 
  else 
  {
    currentWord = incorrectWords[Math.floor(Math.random() * incorrectWords.length)];
  }
  return currentWord;
}

function moveCircle() {
  moveCount++;

  // Every 7th move, make circle big
  const isBig = moveCount % 7 === 0;

  const circleSize = isBig ? bigSize : normalSize;

  // Update circle size style (width, height, border-radius)
  circle.style.width = `${circleSize}px`;
  circle.style.height = `${circleSize}px`;
  circle.style.borderRadius = '50%';  // keep circle shape

  // Get position based on new size
  const { x, y } = getRandomPosition(circleSize);

  // Set position
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;

  // Set word text
  const randomWord = getRandomWord();
  circle.textContent = randomWord;

  // Save size info on circle for use in click handler (optional)
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

circle.addEventListener("click", () => 
  {
  if (timeLeft > 0) 
  {
    const isBig = circle.dataset.isBig === 'true';

    if (correctWords.includes(currentWord)) 
    {
      // If big circle, +3 points; else +1
      score += isBig ? 3 : 1;
    } 
    else 
    {
      score--;
      if (score < 0) 
      {
        score = 0;
        endGame();
      }
    }
    scoreDisplay.textContent = `Score: ${score}`;
    moveCircle();
  }
});

restartBtn.addEventListener("click", startGame);

// Start the game automatically when the page loads
window.onload = startGame;
