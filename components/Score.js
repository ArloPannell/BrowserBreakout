export default class Score {
  constructor(canvas) {
    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d");
  }
  drawScore(score) {
    this._ctx.font = "16px Arial";
    this._ctx.fillStyle = "#0095dd";
    this._ctx.fillText(`score: ${score}`, 8, 20);
  }
}
