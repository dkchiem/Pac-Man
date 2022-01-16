import { tileSize } from '../constants.js';
import { roundPrecision } from '../utils.js';
import { Dots } from './Dots.js';

let score = 0;

export const FacingDirection = {
  UP: -Math.PI / 2,
  RIGHT: 0,
  DOWN: Math.PI / 2,
  LEFT: -Math.PI,
};

export const MovingDirection = {
  UP: 'UP',
  RIGHT: 'RIGHT',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
};

export class Pacman {
  constructor(coordinate, speed, map) {
    this.x = coordinate[0];
    this.y = coordinate[1];
    this.speed = speed;
    this.map = map;
    this.facingDirection = FacingDirection.RIGHT;
    this.currentMovingDirection = MovingDirection.RIGHT;
    this.requestedMovingDirection = MovingDirection.RIGHT;
    this.time = 0;
  }

  draw() {
    const mouthOpenPercentage = (Math.sin(this.time) + 1) / 2;

    window.ctx.save();
    window.ctx.beginPath();
    window.ctx.fillStyle = 'yellow';
    window.ctx.arc(
      this.x * tileSize + tileSize / 2,
      this.y * tileSize + tileSize / 2,
      tileSize / 2 - 2,
      Math.PI * (mouthOpenPercentage / 4) + this.facingDirection,
      Math.PI * (2 - mouthOpenPercentage / 4) + this.facingDirection,
      false,
    );
    window.ctx.lineTo(
      this.x * tileSize + tileSize / 2,
      this.y * tileSize + tileSize / 2,
    );
    window.ctx.fill();
    window.ctx.restore();

    this.time += 0.2;
    if (this.time >= 2 * Math.PI) this.time = 0;

    this.move();
  }

  move() {
    // Turning wall collision
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (Number.isInteger(this.x) && Number.isInteger(this.y)) {
        if (!this.didCollide(this.x, this.y, this.requestedMovingDirection)) {
          this.currentMovingDirection = this.requestedMovingDirection;
        }
      }
    }

    // Eat dots
    if (Number.isInteger(this.x) && Number.isInteger(this.y)) {
      const dot = this.map.mapData[this.y][this.x];
      if (dot instanceof Dots) {
        dot.destroy(this.x, this.y);
        score += 1;
        document.querySelector('#score').innerText = `Score: ${score}`;
      }
    }

    // Collision with wall
    if (this.didCollide(this.x, this.y, this.currentMovingDirection)) {
      return;
    }

    // Facing direction
    this.facingDirection = FacingDirection[this.currentMovingDirection];

    switch (this.currentMovingDirection) {
      case MovingDirection.UP:
        this.y = roundPrecision(this.y - this.speed, 3);
        break;

      case MovingDirection.RIGHT:
        this.x = roundPrecision(this.x + this.speed, 3);
        break;

      case MovingDirection.DOWN:
        this.y = roundPrecision(this.y + this.speed, 3);
        break;

      case MovingDirection.LEFT:
        this.x = roundPrecision(this.x - this.speed, 3);
        break;

      default:
        break;
    }

    if (this.x >= this.map.mapData[0].length) this.x = 0;
    if (this.x < 0) this.x = this.map.mapData[0].length;
    if (this.y >= this.map.mapData.length) this.y = 0;
    if (this.y < 0) this.y = this.map.mapData.length;
  }

  didCollide(x, y, direction) {
    if (Number.isInteger(this.x) && Number.isInteger(this.y)) {
      switch (direction) {
        case MovingDirection.UP:
          return this.map.mapData[y - 1][x] === 1;

        case MovingDirection.RIGHT:
          return this.map.mapData[y][x + 1] === 1;

        case MovingDirection.DOWN:
          return this.map.mapData[y + 1][x] === 1;

        case MovingDirection.LEFT:
          return this.map.mapData[y][x - 1] === 1;

        default:
          return false;
      }
    }
  }
}
