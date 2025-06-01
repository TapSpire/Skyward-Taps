const player = document.getElementById('player');
let posX = 50;
let posY = 50;

function movePlayer(e) {
  const step = 10;
  if (e.key === 'ArrowRight') {
    posX += step;
  } else if (e.key === 'ArrowLeft') {
    posX -= step;
  } else if (e.key === 'ArrowUp') {
    posY += step;
  } else if (e.key === 'ArrowDown') {
    posY -= step;
  }

  player.style.left = posX + 'px';
  player.style.bottom = posY + 'px';
}

window.addEventListener('keydown', movePlayer);
