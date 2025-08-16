export default class Ball {
  constructor(canvas) {
    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d");
  }
  drawBall(ballSpecs, x, y) {
    this._ctx.beginPath();
    this._ctx.arc(x, y, ballSpecs[0].ballRadius, 0, Math.PI * 2);
    this._ctx.fillStyle = "#0095dd";
    this._ctx.fill();
    this._ctx.closePath();
  }
}
