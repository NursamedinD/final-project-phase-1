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
let direction = { x: 1, y: 0 };
let score = 0;
let snakeSpeed = 5;
let gridSize = 20;
let berry = getRandomBerryPosition();


let settingsLoaded = false

const fetchSettings = async () => {
  try {
    const response = await fetch('https://snake-settings.onrender.com/settings');
    if (!response.ok) throw new Error('Failed to fetch settings');
    const settings = await response.json();

    gridSize = settings.gridSize;
    snakeSpeed = settings.snakeSpeed;
    snake = Array.from({ length: settings.initialSnakeLength }, (_, i) => ({ x: 10 - i, y: 10 }));

    console.log("Settings set:", settings);
    settingsLoaded = true
  } catch (error) {
    console.error("Settings failed to load:", error);
  }
};


fetchSettings();

const settingsForm = document.getElementById('settingsForm');

settingsForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const newGridSize = Number(document.getElementById('gridSizeInput').value);
  const newSnakeSpeed = Number(document.getElementById('speedInput').value);

  const updatedSettings = {
    gridSize: newGridSize,
    snakeSpeed: newSnakeSpeed
  };

  try {
    const response = await fetch('https://snake-settings.onrender.com/settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedSettings)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Settings updated successfully:", result);

    gridSize = result.gridSize;
    snakeSpeed = result.snakeSpeed;

    resetSettings();
    clearInterval(gameinterval);
    gameinterval = setInterval(updateGame, 1000 / snakeSpeed);

  } catch (error) {
    console.error("Error updating settings:", error);
  }
});


function getRandomBerryPosition() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize))
  };
}

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
  // adds new snake head based on its current direction~

  if (snake.length > 0 && snake[0]) {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
  } else {
    console.error("Snake array is empty");
  }

}

function collisionCheck() {
  if (snake.length === 0 || !snake[0]) {
    console.error("Snake is empty or undefined");
    return;
  }

  if (snake[0].x < 0 || snake[0].x >= canvas.width / gridSize || snake[0].y < 0 || snake[0].y >= canvas.height / gridSize) {
    gameOver();
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      gameOver();
    }
  }
}

function gameStart() {
  if (!settingsLoaded) {
    console.error("Settings are not yet loaded. Please wait.");
    return;
  }


  if (!started && !paused) {
    clearInterval(gameinterval);
    gameinterval = setInterval(updateGame, 1000 / snakeSpeed);
    started = true;
  }
}

function gamePause() {
  if (!paused) {
    clearInterval(gameinterval);
    pauseBtn.textContent = "Resume";
    paused = true;
  } else {
    gameinterval = setInterval(updateGame, 1000 / snakeSpeed);
    pauseBtn.textContent = "Pause"
    paused = false;
  }

}

function gameOver() {
  clearInterval(gameinterval);
  alert(`Game Over! Your score: ${score}`);

  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  berry = getRandomBerryPosition();
  score = 0;
  scoreText.textContent = score;
  started = false;
  paused = false;
  pauseBtn.textContent = 'Pause';
}

function resetSettings() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  berry = getRandomBerryPosition();
  score = 0;
  scoreText.textContent = score;
  clearInterval(gameinterval);

  started = false;
  // resetSettings();
}


function updateGame() {
  if (started && !paused) {

    if (!snake || snake.length === 0) {
      console.error("Snake is empty!");
      return;
    }

    moveSnake();
    collisionCheck();

    if (snake[0].x === berry.x && snake[0].y === berry.y) {
      score++;
      scoreText.textContent = score;
      berry = getRandomBerryPosition();
    } else {
      snake.pop();
    }

    drawGame();
  }
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) {
        direction = { x: 0, y: -1 };
      }
      break;
    case "ArrowDown":
      if (direction.y === 0) {
        direction = { x: 0, y: 1 };
      }
      break;
    case "ArrowLeft":
      if (direction.x === 0) {
        direction = { x: -1, y: 0 };
      }
      break;
    case "ArrowRight":
      if (direction.x === 0) {
        direction = { x: 1, y: 0 };
      }
      break;
  }


});


pauseBtn.addEventListener("click", gamePause);
startBtn.addEventListener("click", () => {
  if (!started) {
    gameStart();
  }
});

resetBtn.addEventListener("click", () => {
  resetSettings();
  drawGame();
});

drawGame();