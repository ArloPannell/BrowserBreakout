export default class Lives {
  constructor(canvas) {
    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d");
  }

  drawLives(lives) {
    this._ctx.font = "16px Arial";
    this._ctx.fillStyle = "#0095dd";
    this._ctx.fillText(`lives: ${lives}`, this._canvas.width - 65, 20);
  }
}
