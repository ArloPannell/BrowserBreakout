export default class Paddle {
  constructor(paddleWidth, paddleHeight, canvas) {
    this._paddleHeight = paddleHeight;
    this._paddleWidth = paddleWidth;
    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d");
  }

  drawPaddle(paddleX) {
    this._ctx.beginPath();
    this._ctx.rect(
      paddleX,
      this._canvas.height - 5 - this._paddleHeight, // change this back to 5
      this._paddleWidth,
      this._paddleHeight
    );
    this._ctx.fillStyle = "#0095dd";
    this._ctx.fill();
    this._ctx.closePath();
  }
}
