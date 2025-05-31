// Get elements
const clickButton = document.getElementById("clickButton");
const clicksDisplay = document.getElementById("clicks");

// Set initial click count
let clickCount = 0;

// Add event listener to button
clickButton.addEventListener("click", function() {
  clickCount++;
  clicksDisplay.textContent = clickCount; // Update click count on page
});
