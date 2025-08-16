import Paddle from "../components/Paddle.js";
import Score from "../components/Score.js";
import Lives from "../components/Lives.js";
import Bricks from "../components/Bricks.js";
import Ball from "../components/Ball.js";

import { levels, ballSpecs, paddleSpecs } from "../utils/settings.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let paddleX = (canvas.width - paddleSpecs[0].paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

const objPaddle = new Paddle(
  paddleSpecs[0].paddleWidth,
  paddleSpecs[0].paddleHeight,
  canvas
);

let y = canvas.height - 30;
let x = canvas.width / 2;

let dx = 2;
let dy = -2;

const objBall = new Ball(canvas);

let interval = 0;

let score = 0;
const objScore = new Score(canvas);

let lives = 3;
const objLives = new Lives(canvas);

let frameDelay = 0;

function scoreUpdate() {
  score++;
  return score;
}
function directionXChange() {
  dx = -dx;
}
function directionYChange() {
  dy = -dy;
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

const objBricks = new Bricks(canvas);
objBricks.buildBricks(levels[0]);

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  objLives.drawLives(lives);
  objScore.drawScore(score);
  objBricks.drawBricks(levels[0]);
  objBall.drawBall(ballSpecs, x, y);
  objPaddle.drawPaddle(paddleX);
  objBricks.collisionDetection(levels[0], x, y, scoreUpdate, directionYChange);
}

async function mainGame() {
  await sleep(frameDelay);
  drawFrame();
  if (
    x + dx > canvas.width - ballSpecs[0].ballRadius ||
    x + dx < ballSpecs[0].ballRadius
  ) {
    directionXChange();
  }
  if (y + dy < ballSpecs[0].ballRadius) {
    directionYChange();
  } else if (
    y + dy >
    canvas.height - ballSpecs[0].ballRadius - 5 - paddleSpecs[0].paddleHeight
  ) {
    if (x > paddleX && x < paddleX + paddleSpecs[0].paddleWidth) {
      directionYChange();
    } else if (y + dy > canvas.height - ballSpecs[0].ballRadius) {
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
      }
    }
  }
  x += dx;
  y += dy;

  if (rightPressed) {
    paddleX = Math.min(paddleX + 7, canvas.width - paddleSpecs[0].paddleWidth);
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
  console.log(evt.key);
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
    paddleX = relativeX - paddleSpecs[0].paddleWidth / 2;
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
