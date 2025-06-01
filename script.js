const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 80,
  width: 50,
  height: 50,
  speed: 5
};

let bullets = [];
let clouds = [];
let planes = [];

function drawPlayer() {
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
  ctx.fillStyle = 'yellow';
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function drawObstacles() {
  ctx.fillStyle = 'white';
  clouds.forEach(c => ctx.fillRect(c.x, c.y, c.width, c.height));

  ctx.fillStyle = 'gray';
  planes.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));
}

function movePlayer() {
  if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
  if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;
}

function updateBullets() {
  bullets = bullets.filter(b => b.y > -10);
  bullets.forEach(b => b.y -= 10);
}

function updateObstacles() {
  clouds.forEach(c => c.y += 2);
  planes.forEach(p => p.y += 4);

  // Collision with player
  clouds.forEach(c => {
    if (isColliding(player, c)) gameOver();
  });

  planes.forEach(p => {
    if (isColliding(player, p)) gameOver();
  });

  // Collision with bullets
  bullets.forEach((b, bi) => {
    clouds.forEach((c, ci) => {
      if (isColliding(b, c)) {
        clouds.splice(ci, 1);
        bullets.splice(bi, 1);
      }
    });
  });
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function gameOver() {
  alert("Game Over!");
  document.location.reload();
}

function spawnObstacles() {
  if (Math.random() < 0.05) {
    clouds.push({
      x: Math.random() * (canvas.width - 60),
      y: -30,
      width: 60,
      height: 30
    });
  }

  if (Math.random() < 0.01) {
    planes.push({
      x: Math.random() * (canvas.width - 80),
      y: -40,
      width: 80,
      height: 20
    });
  }
}

function shootBullet() {
  bullets.push({
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 10,
    height: 20
  });
}

let keys = {};
document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (e.key === ' ') shootBullet();
});
document.addEventListener('keyup', e => keys[e.key] = false);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  movePlayer();
  updateBullets();
  updateObstacles();
  spawnObstacles();
  drawPlayer();
  drawBullets();
  drawObstacles();
  requestAnimationFrame(gameLoop);
}

gameLoop();
