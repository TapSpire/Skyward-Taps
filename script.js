const player = document.getElementById('player');
let posX = 50;
let posY = 50;
const step = 10;

function movePlayerByKey(key) {
  if (key === 'ArrowRight') {
    posX += step;
  } else if (key === 'ArrowLeft') {
    posX -= step;
  } else if (key === 'ArrowUp') {
    posY += step;
  } else if (key === 'ArrowDown') {
    posY -= step;
  }

  player.style.left = posX + 'px';
  player.style.bottom = posY + 'px';
}

// Keyboard support
window.addEventListener('keydown', (e) => movePlayerByKey(e.key));

// Touch button support
document.querySelectorAll('.control-btn').forEach(button => {
  button.addEventListener('touchstart', (e) => {
    e.preventDefault(); // prevent scrolling on mobile
    const direction = button.getAttribute('data-direction');
    movePlayerByKey(direction);
  });
});
