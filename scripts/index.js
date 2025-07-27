const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: true };
  }
}

let y = canvas.height - 30;
let x = canvas.width / 2;

let dx = 2;
let dy = -2;

const ballRadius = 10;

let interval = 0;

let score = 0;
let lives = 3;
let frameDelay = 0;

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText(`score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText(`lives: ${lives}`, canvas.width - 65, 20);
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(
    paddleX,
    canvas.height - 5 - paddleHeight,
    paddleWidth,
    paddleHeight
  );
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095dd";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

function drawCountdown(timer) {
  drawFrame();
  ctx.font = "24px Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText(
    `Starting next life in ${timer / 1000}...`,
    8,
    canvas.height / 2
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function nextLifeCountdown() {
  while (frameDelay > 0) {
    let timer = frameDelay;
    drawCountdown(timer);
    await sleep(1000);
    frameDelay -= 1000;
  }
}

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLives();
  drawScore();
  drawBricks();
  drawBall();
  drawPaddle();
  drawLives();
  collisionDetection();
}

async function mainGame() {
  await sleep(frameDelay);
  drawFrame();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - 5 - paddleHeight) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      lives--;
      frameDelay = 3000;
      if (!lives) {
        drawFrame();
        await sleep(30);
        alert(`GAME OVER... your score was: ${score}`);
        document.location.reload();
      } else {
        nextLifeCountdown();
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  x += dx;
  y += dy;

  if (rightPressed) {
    paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
  } else if (leftPressed) {
    paddleX = Math.max(paddleX - 7, 0);
  }
  requestAnimationFrame(mainGame);
} // mainGame()

function keyDownHandler(evt) {
  if (evt.key === "Right" || evt.key === "ArrowRight") {
    rightPressed = true;
  } else if (evt.key === "Left" || evt.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(evt) {
  if (evt.key === "Right" || evt.key === "ArrowRight") {
    rightPressed = false;
  } else if (evt.key === "Left" || evt.key === "ArrowLeft") {
    leftPressed = false;
  }
}

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(evt) {
  const relativeX = evt.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function collisionDetection() {
  //  Loop through all bricks
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      // calculation of brick hit, turn around
      if (b.status) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = false;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            drawBricks(); // clear the last brick, and let it clear before ending the game
            setTimeout(() => {
              alert(`YOU WIN, CONGRATULATIONS! Your score: ${score}`);
              document.location.reload();
            }, 300);
          }
        }
      }
    }
  }
}

function startGame() {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  mainGame();
}

const runButton = document.getElementById("runButton");
runButton.addEventListener("click", () => {
  startGame();
  runButton.disabled = true;
});
