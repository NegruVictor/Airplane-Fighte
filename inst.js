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
  Interval = setInterval(startTimer, 10);
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
  tens++;
  if (tens > 99) {
    seconds++;
    updateTimerDisplay();
    tens = 0;
  }
  if (seconds > 9) {
    updateTimerDisplay();
  }
  if (seconds > 59) {
    minute++;
    updateTimerDisplay();
  }
}

function updateTimerDisplay() {
  appendSeconds.innerHTML = seconds < 10 ? "0" + seconds : seconds;
  appendMin.innerHTML = minute < 10 ? "0" + minute : minute;
}

// Game functions
function drawAirplane() {
  context.save();
  context.beginPath();
  context.moveTo(airplane.x + 10, airplane.y + airplane.height - 10);
  context.lineTo(airplane.x + airplane.width / 2, airplane.y + 5);
  context.lineTo(airplane.x + airplane.width - 10, airplane.y + airplane.height - 10);
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
      obstaclesPassed++;
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
  intervalID = setInterval(generateFallingObject, 500);
}

function stopGeneratingObjects() {
  clearInterval(intervalID);
}

// Collision detection function
function checkRectangleCollision(airplane, object) {
  let airplaneX = (airplane.width - 20) + airplane.x - 90;
  let airplaneY = airplane.y + airplane.height - 20;
  let airplaneWidth = airplane.width - 10;
  let airplaneHeight = airplane.height - 10;
  let objectX = object.x;
  let objectY = object.y;
  let objectWidth = fallingObject.width;
  let objectHeight = fallingObject.height;

  return (
    airplaneX < objectX + objectWidth - 30 &&
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
  context.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
}
