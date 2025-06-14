const circle = document.getElementById("circle");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const gameContainer = document.querySelector(".game-container");
const bonusSound = document.getElementById("bonus-sound");
const textContent = [
  '0', '1', '2', '1', '0',        
  '1', '2', '4', '2', '1',  
  '2', '4', '8', '4', '2',  
  '1', '2', '4', '2', '1',  
  '0', '1', '2', '1', '0',  
];

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
let awarded_15 = false;
let awarded_30 = false;
let awarded_60 = false;
let timeLeft = 120;  // Always starts at 120 seconds
let gameInterval;
let timerInterval;
let bonusMessageVisible = false;
let lastClickedTextValue = 0;

const normalSize = 120;

function createGrid() 
{
  const grid = document.querySelector('.grid');
  for (let i = 0; i < 25; i++) { // Create 25 squares
    const square = document.createElement('div');
    square.classList.add('square');
    
    const span = document.createElement('span');
    span.textContent = textContent[i];  // Fill with text from the array
    square.appendChild(span);

    // Add a click event to animate and change text color
    square.addEventListener('click', function() {
      square.classList.add('clicked');  // Add effect on click
      lastClickedTextValue = parseInt(span.textContent); // Get the value for scoring
    });
    
    grid.appendChild(square);
  }
}

function getRandomWord() 
{
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

function showBonusMessage(message, color) 
{
  if (bonusMessageVisible) return;
  bonusMessageVisible = true;

  const bonusMessage = document.createElement('div');
  bonusMessage.classList.add('bonus-message');
  bonusMessage.textContent = message;
  bonusMessage.style.color = color;
  document.body.appendChild(bonusMessage);

  setTimeout(() => 
  {
    bonusMessage.remove();
    bonusMessageVisible = false;
  }, 3000);
}

function startGame() {
  createGrid();
  score = 0;
  timeLeft = 120;
  scoreDisplay.textContent = `$: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}s`;

  restartBtn.style.display = "none";
  
  // Hide circle but keep it interactive
  const circle = document.getElementById("circle");
  const wordHolder = document.getElementById("wordHolder");
  
  circle.style.opacity = "0";  // Invisible but clickable
  circle.style.pointerEvents = "auto";  // Ensure pointer events are active for the circle
  
  // Ensure wordHolder is not covering the circle
  wordHolder.style.pointerEvents = "auto";  // If wordHolder is interactive, ensure pointer events are allowed on it
  
  const randomWord = getRandomWord();
  document.getElementById("wordHolder").textContent = randomWord;

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

window.onload = startGame;

// Fireworks Animation


function createFireworks() 
{
  const fireworksContainer = document.createElement("div");
  fireworksContainer.classList.add("fireworks");

  // Add multiple sparks to the fireworks container
  for (let i = 0; i < 10; i++) 
  {
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

function checkScoreForFireworks() 
{
  if (score === 15 && awarded_15 == false) 
  {
    createFireworks();
    showBonusMessage("TIME-BONUS! 15s", "gold");
    timeLeft += 15;
    awarded_15 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }

  if (score === 30 && awarded_30 == false) 
  {
    createFireworks();
    showBonusMessage("TIME-BONUS! 30s", "gold");
    timeLeft += 30;
    awarded_30 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }

  if (score === 60 && awarded_60 == false) 
  {
    createFireworks();
    showBonusMessage("TIME-BONUS! 60s", "gold");
    timeLeft += 60;
    awarded_60 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }
}

circle.addEventListener("click", () => {
  let hoverText = document.createElement("div");
  hoverText.classList.add("hover-feedback");

  const correctSound = document.getElementById("correct-sound");
  const clickSound = document.getElementById("click-sound");

  if (correctWords.includes(currentWord)) 
  {
    score++;
    score += lastClickedTextValue;
    correctSound.currentTime = 0;
    correctSound.play();
    showBonusMessage("Correct!", "green");
    hoverText.textContent = "Good!";
    hoverText.style.color = "green";
  } 
  else if (incorrectWords.includes(currentWord)) 
  {
    score--;
    score -= lastClickedTextValue;
    clickSound.currentTime = 0;
    clickSound.play();
    showBonusMessage("Oops! That's a misspelling!", "red");
    hoverText.textContent = "Ouch!!!!";
    hoverText.style.color = "red";
  }

  // Position and animate hover text
  const circleRect = circle.getBoundingClientRect();
  hoverText.style.position = "absolute";
  hoverText.style.left = `${circleRect.left + circleRect.width / 2}px`;
  hoverText.style.top = `${circleRect.top - 20}px`;
  hoverText.style.transform = "translateX(-50%)";
  hoverText.style.fontWeight = "bold";
  hoverText.style.fontSize = "20px";
  hoverText.style.pointerEvents = "none";
  hoverText.style.zIndex = "1000";
  hoverText.style.transition = "opacity 1s ease-out, transform 1s ease-out";
  hoverText.style.opacity = "1";

  document.body.appendChild(hoverText);

  setTimeout(() => {
    hoverText.style.opacity = "0";
    hoverText.style.transform = "translateX(-50%) translateY(-30px)";
  }, 50);

  setTimeout(() => {
    hoverText.remove();
  }, 1000);

  scoreDisplay.textContent = `Score: ${score}`;
  checkScoreForFireworks() 
});







