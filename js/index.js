const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreText = document.querySelector(".scoreBar");
const resetBtn = document.querySelector("#resetBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const startBtn = document.querySelector('#startBtn');

let gameinterval;
let started = false;
let paused = false;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0};
let score = 0;
let snakeSpeed = 5;
let gridSize = 20;
let berry = { x: Math.floor(Math.random() * 25), y: Math.floor(Math.random() * 25) };


const fetchSettings = async () => {
  try {
    const response = await fetch('http://localhost:3000/settings');
    const settings = await response.json();
    gridSize = settings.gridSize;
    snakeSpeed = settings.speed;
    console.log("Settings set:", settings);
  } catch (error) {
    console.error("Settings failed to load:", error);
  }
};

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach(segment => {
    ctx.fillStyle = "red";
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  })

  ctx.fillStyle = "yellow";
  ctx.fillRect(berry.x * gridSize, berry.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y};
  snake.unshift(head);
  snake.pop();
}


function gameStart() {
  if (!started)
    gameinterval = setInterval(updateGame, 1000 / snakeSpeed);
  started = true;
}

function gamePause() {
  if (!paused) {
    clearInterval(gameinterval);
    pauseBtn.textContent = "Resume";
    paused = true;
  } else {
    gameStart();
    pauseBtn.textContent = "II"
    paused = false;
  }

}

function gameOver() {
  clearInterval(gameinterval);
  alert('Game Over! Your score: ${score}');

  snake = [{x: 10, y:10 }];
  direction = {x: 1, y: 0};
  berry = {x: Math.floor(Math.random() *25), y: Math.floor(Math.random() * 25) };
  score = 0;
  started = false;
  paused = false;
  pauseBtn.textContent = 'Pause'
}

function updateGame() {
  console.log("Game running...");
}

pauseBtn.addEventListener("click", gamePause);
startBtn.addEventListener("click", gameStart);

drawGame();