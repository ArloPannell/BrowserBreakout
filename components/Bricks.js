export default class Bricks {
  constructor(canvas) {
    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d");
    this._bricks = [];
  }

  deleteBricks() {
    this._bricks = [];
  }

  buildBricks(level) {
    for (let c = 0; c < level.brickColumnCount; c++) {
      this._bricks[c] = [];
      for (let r = 0; r < level.brickRowCount; r++) {
        this._bricks[c][r] = { x: 0, y: 0, status: true };
      }
    }
  }

  drawBricks(level) {
    for (let c = 0; c < level.brickColumnCount; c++) {
      for (let r = 0; r < level.brickRowCount; r++) {
        if (this._bricks[c][r].status) {
          const brickX =
            c * (level.brickWidth + level.brickPadding) + level.brickOffsetLeft;
          const brickY =
            r * (level.brickHeight + level.brickPadding) + level.brickOffsetTop;
          this._bricks[c][r].x = brickX;
          this._bricks[c][r].y = brickY;
          this._ctx.beginPath();
          this._ctx.rect(brickX, brickY, level.brickWidth, level.brickHeight);
          this._ctx.fillStyle = "#0095dd";
          this._ctx.fill();
          this._ctx.closePath();
        }
      }
    }
  }

  collisionDetection(level, x, y, scoreUpdate, directionYChange) {
    //  Loop through all bricks
    for (let c = 0; c < level.brickColumnCount; c++) {
      for (let r = 0; r < level.brickRowCount; r++) {
        const b = this._bricks[c][r];
        // calculation of brick hit, turn around
        if (b.status) {
          if (
            x > b.x &&
            x < b.x + level.brickWidth &&
            y > b.y &&
            y < b.y + level.brickHeight
          ) {
            directionYChange();
            b.status = false;
            const score = scoreUpdate();
            if (score === level.brickRowCount * level.brickColumnCount) {
              this.drawBricks(level); // clear the last brick, and let it clear before ending the game
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
} // end class
