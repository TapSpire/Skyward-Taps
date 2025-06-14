const circle = document.getElementById("circle");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const gameContainer = document.querySelector(".game-container");
const bonusSound = document.getElementById("bonus-sound");

// Array of images to load into the squares (Replace with your own image URLs)
const imageUrls = [
  'https://via.placeholder.com/100', // Placeholder image
  'https://via.placeholder.com/100/ff0000', // Another placeholder
  'https://via.placeholder.com/100/00ff00', // Another placeholder
  'https://via.placeholder.com/100/0000ff'  // Another placeholder
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
let awarded_5 = false;
let awarded_10 = false;
let awarded_25 = false;
let timeLeft = 30;
let gameInterval;
let timerInterval;
let moveCount = 0;
let isMoving = false;
let bonusMessageVisible = false;

let difficulty = "Easy";  // Default difficulty

const normalSize = 120;
const bigSize = 240;

// Function to create the grid
function createGrid() {
  const grid = document.querySelector('.grid');
  for (let i = 0; i < 25; i++) { // Create 25 squares
    const square = document.createElement('div');
    square.classList.add('square');
    
    // Add a click event to load an image into the square
    square.addEventListener('click', function() {
      loadImage(square);
    });
    
    grid.appendChild(square);
  }
}

// Function to load an image into a clicked square
function loadImage(square) {
  // Get a random image URL from the imageUrls array
  const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];

  // Create an image element and set the src to the random image
  const img = document.createElement('img');
  img.src = randomImageUrl;

  // Clear the current contents of the square (if any) and append the image
  square.innerHTML = ''; // Reset the square
  square.appendChild(img);
}

function getRandomPosition(circleSize) 
{
  const containerRect = gameContainer.getBoundingClientRect();
  const paddingTop = 100; // space for header & timer
  const maxX = containerRect.width - circleSize;
  const maxY = containerRect.height - circleSize - paddingTop;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY + paddingTop;

  return { x, y };
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

function adjustCircleSize(word) 
{
  const maxWidth = 0.8 * gameContainer.clientWidth;
  const wordLength = word.length;
  const fontSize = parseInt(window.getComputedStyle(circle).fontSize);
  const estimatedWidth = wordLength * fontSize * 0.6;

  const newSize = Math.min(estimatedWidth + 40, maxWidth);
  circle.style.width = `${newSize}px`;
  circle.style.height = `${newSize}px`;
}

function moveCircle() 
{
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

  setTimeout(() => 
  {
    isMoving = false;
  }, 3000);
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

function startGame() 
{
  createGrid();
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
    if (timeLeft <= 0) 
    {
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

// Function to create the fireworks effect
function createFireworks() {
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


// Check if the score reaches 10 and trigger fireworks
function checkScoreForFireworks() 
{
  if (score === 5 && awarded_5 == false) 
  {
    createFireworks();
    showBonusMessage("Fireworks! 30-second BONUS!", "gold");
    timeLeft += 30;
    awarded_5 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }

  if (score === 10 && awarded_10 == false) 
  {
    createFireworks();
    showBonusMessage("Fireworks! 60-second BONUS!", "gold");
    timeLeft += 60;
    awarded_10 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }

  if (score === 25 && awarded_25 == false) 
  {
    createFireworks();
    showBonusMessage("Fireworks! 120-second BONUS!", "gold");
    timeLeft += 120;
    awarded_25 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }
}



// Detect user clicks on the circle and update the score
circle.addEventListener("click", () => {
  let hoverText = document.createElement("div");
  hoverText.classList.add("hover-feedback");

  const correctSound = document.getElementById("correct-sound");
  const clickSound = document.getElementById("click-sound");

  if (correctWords.includes(currentWord)) 
  {
    score++;
    correctSound.currentTime = 0;
    correctSound.play();
    showBonusMessage("Correct!", "green");
    hoverText.textContent = "Good!";
    hoverText.style.color = "green";
  } 
  else if (incorrectWords.includes(currentWord)) 
  {
    score--;
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
  checkScoreForFireworks();
});





