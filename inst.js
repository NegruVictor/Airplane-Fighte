// DOM elements
let buttonStart = document.getElementById('start');
let buttonReset = document.getElementById('reset');
let appendSeconds = document.getElementById("sec");
let appendMin = document.getElementById("min");

// Timer variables
let minute = 0;
let seconds = 0;
let tens = 0;
let Interval;

// Game variables
let obstaclesPassed = 0;
let canvas = document.getElementById("airplaneCanvas");
let context = canvas.getContext("2d");
let animationFrameId;
let fallingObjects = [];

// Constant variables
const TEN = 10;
const TIMER_INTERVAL = 10;
const TIMER_MILLISECONDS = 99;
const TIMER_SECONDS = 9;
const TIMER_MINUTE = 59;
const FALLING_OBJECT_INTERVAL = 500;
const AIRPLANE_TIP_OFFSET = 2;
const AIRPLANE_BOTTOM_OFFSET = 5;
const OFFSET_X_GAME_OVER_TEXT = 100;

// Airplane properties
let airplane = {
  x: 250,
  y: canvas.height / 1.3,
  width: 100,
  height: 70,
  speed: 5
};

// Falling object properties
let fallingObject = {
  width: 10,
  height: 30,
  speed: 2
};

// Load airplane image
let airplaneImage = new Image();
airplaneImage.onload = function () {
  drawAirplane();
};
airplaneImage.src = 'airplane.png';

// Event listeners
buttonStart.onclick = function () {
  clearInterval(Interval);
  Interval = setInterval(startTimer, TIMER_INTERVAL);
  update();
  startGeneratingObjects();
  buttonStart.disabled = true;
};

buttonReset.onclick = function () {
  resetGame();
};

window.addEventListener("keydown", function (event) {
  handleKeyPress(event);
});

// Timer functions
function startTimer() {
  ++tens;
  if (tens > TIMER_MILLISECONDS) {
    ++seconds;
    updateTimerDisplay();
    tens = 0;
  }
  if (seconds > TIMER_SECONDS) {
    updateTimerDisplay();
  }
  if (seconds > TIMER_MINUTE) {
    ++minute;
    updateTimerDisplay();
  }
}

function updateTimerDisplay() {
  appendSeconds.innerHTML = seconds < TIMER_INTERVAL ? "0" + seconds : seconds;
  appendMin.innerHTML = minute < TIMER_INTERVAL ? "0" + minute : minute;
}

// Game functions
function drawAirplane() {
  context.save();
  context.beginPath();
  context.moveTo(airplane.x + TEN, airplane.y + airplane.height - TEN);
  context.lineTo(airplane.x + airplane.width / AIRPLANE_TIP_OFFSET, airplane.y + AIRPLANE_BOTTOM_OFFSET);
  context.lineTo(airplane.x + airplane.width - TEN, airplane.y + airplane.height - TEN);
  context.closePath();
  context.clip();
  context.drawImage(airplaneImage, airplane.x, airplane.y, airplane.width, airplane.height);
  context.restore();
}

function drawFallingObjects() {
  context.fillStyle = 'grey';
  for (let obj of fallingObjects) {
    context.fillRect(obj.x, obj.y, fallingObject.width, fallingObject.height);
  }
}

function checkCollision() {
  for (let obj of fallingObjects) {
    if (checkRectangleCollision(airplane, obj)) {
      gameOver();
    }
  }
}

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawAirplane();
  drawFallingObjects();

  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    fallingObjects[i].y += fallingObject.speed;
    if (fallingObjects[i].y > canvas.height) {
      fallingObjects.splice(i, 1);
      ++obstaclesPassed;
    }
  }

  animationFrameId = requestAnimationFrame(update);
  checkCollision();
}

// Input functions
function handleKeyPress(event) {
  if (event.key === "ArrowRight") {
    airplane.x += airplane.speed;
  } else if (event.key === "ArrowLeft") {
    airplane.x -= airplane.speed;
  }
}

// Falling object functions
function generateFallingObject() {
  fallingObjects.push({
    x: Math.random() * (canvas.width - fallingObject.width),
    y: 0
  });
}

function startGeneratingObjects() {
  intervalID = setInterval(generateFallingObject, FALLING_OBJECT_INTERVAL);
}

function stopGeneratingObjects() {
  clearInterval(intervalID);
}

// Collision detection function
function checkRectangleCollision(airplane, object) {
  const AIRPLANE_OFFSET_X = 20;
  const AIRPLANE_OFFSET_Y = 20;
  const AIRPLANE_MARGIN_X = 90;
  const AIRPLANE_MARGIN_Y = 10;
  const OBJECT_MARGIN = 30;

  let airplaneX = (airplane.width - AIRPLANE_OFFSET_X) + airplane.x - AIRPLANE_MARGIN_X;
  let airplaneY = airplane.y + airplane.height - AIRPLANE_OFFSET_Y;
  let airplaneWidth = airplane.width - AIRPLANE_MARGIN_Y;
  let airplaneHeight = airplane.height - AIRPLANE_MARGIN_Y;
  let objectX = object.x;
  let objectY = object.y;
  let objectWidth = fallingObject.width;
  let objectHeight = fallingObject.height;

  return (
    airplaneX < objectX + objectWidth - OBJECT_MARGIN &&
    airplaneX + airplaneWidth > objectX &&
    airplaneY < objectY + objectHeight &&
    airplaneY + airplaneHeight > objectY
  );
}

// Game control functions
function resetGame() {
  clearInterval(Interval);
  minute = "00";
  seconds = "00";
  appendMin.innerHTML = minute;
  appendSeconds.innerHTML = seconds;
  obstaclesPassed = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);
  stopGeneratingObjects();
  cancelAnimationFrame(animationFrameId);
  drawAirplane();
  fallingObjects = [];
  buttonStart.disabled = false;
}

function gameOver() {
  cancelAnimationFrame(animationFrameId);
  clearInterval(Interval);
  document.getElementById("score").innerHTML = "Score: " + obstaclesPassed + " obstacles overcome";
  document.getElementById("timerScore").innerHTML = "Timer score: " + minute + " min. : " + seconds + " sec.";
  stopGeneratingObjects();
  context.font = "30px Arial";
  context.fillStyle = "red";
  context.fillText("Game Over", canvas.width / 2 - OFFSET_X_GAME_OVER_TEXT , canvas.height / 2);
}
