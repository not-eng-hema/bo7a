const canvas = document.getElementById("gameCanvas");
const myh1 = document.getElementById("myscore");
const ctx = canvas.getContext("2d");
let running = false;

canvas.width = 600;
canvas.height = 600;
let score = 0;

const collectible = {
  x: Math.random() * (canvas.width - 50),
  y: Math.random() * (canvas.height - 50),
  size: 50,
};
const collectibleImg = new Image();
collectibleImg.src = "sheep.png";

const player = {
  x: 50,
  y: 50,
  size: 50,
  speed: 4,
  dx: 0,
  dy: 0,
};

const enemy = {
  x: 300,
  y: 200,
  size: 70,
  speed: 2,
};
const playerImg = new Image();
playerImg.src = "bo7a.png";

const enemyImg = new Image();
enemyImg.src = "cow.png";
const caughtSound = new Audio("dead.wav");
const catshSound = new Audio("maaaa.wav");
const startSound = new Audio("hi.wav");

const keys = {};

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function movePlayer() {
  if (!running) return;
  if (keys["ArrowUp"]) player.dy = -player.speed;
  else if (keys["ArrowDown"]) player.dy = player.speed;
  else player.dy = 0;

  if (keys["ArrowLeft"]) player.dx = -player.speed;
  else if (keys["ArrowRight"]) player.dx = player.speed;
  else player.dx = 0;

  player.x += player.dx;
  player.y += player.dy;

  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

function moveEnemy() {
  if (!running) return;
  if (enemy.x < player.x) enemy.x += enemy.speed;
  if (enemy.x > player.x) enemy.x -= enemy.speed;
  if (enemy.y < player.y) enemy.y += enemy.speed;
  if (enemy.y > player.y) enemy.y -= enemy.speed;
}

function checkCollision() {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < player.size) {
    caughtSound.play();
    player.x = 50;
    player.y = 50;
    enemy.y = 300;
    enemy.x = 200;
   
    running = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);
  ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.size, enemy.size);
  ctx.drawImage(
    collectibleImg,
    collectible.x,
    collectible.y,
    collectible.size,
    collectible.size
  );
}

function checkCollection() {
  const dx = player.x - collectible.x;
  const dy = player.y - collectible.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < player.size) {
    collectible.x = Math.random() * (canvas.width - collectible.size);
    collectible.y = Math.random() * (canvas.height - collectible.size);
    catshSound.play();
    score++;
    myh1.textContent = score;
  }
}

function update() {
  if (!running) return; 
  movePlayer();
  moveEnemy();
  checkCollision();
  checkCollection();
  draw();
  requestAnimationFrame(update);
}


function start() {
  if (!running) {
    running = true;
    startSound.play();
    update();
     score = 0;
    myh1.textContent = score;
  }
}

function stop() {
  running = false;
}
