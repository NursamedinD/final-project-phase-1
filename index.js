const canvas = document.getElementById("gameContainer");
const ctx = canvas.getContext("2d");
const scoreText = document.querySelector(".scoreBar");
const resetBtn = document.querySelector("#resetBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const startBtn = document.querySelector('#startBtn');
  
let gameinterval;
let started
let paused = false;
let snake = [{x: 10, y: 10}];
let score = 0;
let snakeSpeed = 5;
let gridSize = 20;
// let snakeColor = "red"
// let foodColor = "yellow"

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
    pauseBtn.textContent = "Pause"
    paused = false;
  }
}

function updateGame() {
  console.log("Game running...");
}

pauseBtn.addEventListener("click", gamePause);

gameStart();