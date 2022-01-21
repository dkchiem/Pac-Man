import { tileSize } from '../constants.js';
import { roundPrecision, MovingDirection } from '../utils.js';

import { BigDots } from './BigDots.js';
import { Dots } from './Dots.js';
import { Ghost } from './Ghost.js';

export const FacingDirection = {
  UP: -Math.PI / 2,
  RIGHT: 0,
  DOWN: Math.PI / 2,
  LEFT: -Math.PI,
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
    this.chompping = false;
    this.powered = false;
    this.score = 0;
    this.lives = 3;

    setInterval(() => {
      if (this.chompping) {
        const chompSound = new Audio('/sounds/chomp.mp3');
        chompSound.play();
      }
    }, 250);
  }

  draw() {
    const mouthOpenPercentage = (Math.sin(this.time) + 1) / 2;

    window.ctx.save();
    window.ctx.beginPath();
    window.ctx.fillStyle = '#FFEE00';
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
      const tile = this.map.mapData[this.y][this.x];
      if (tile instanceof Dots) {
        tile.destroy(this.x, this.y);
        this.score += 10;
        this.chompping = true;
      } else if (tile instanceof BigDots) {
        const powerUpSound = new Audio('/sounds/power-up.wav');
        powerUpSound.volume = 0.6;
        powerUpSound.play();
        tile.destroy(this.x, this.y);
        this.score += 50;
        if (!this.powered) {
          this.powered = true;
          setTimeout(() => {
            this.powered = false;
          }, 8000);
        }
        this.chompping = false;
      } else {
        this.chompping = false;
      }
      document.querySelector('#score').innerText = `Score: ${this.score}`;
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

  die() {
    this.x = this.map.getItems(2)[0][0];
    this.y = this.map.getItems(2)[0][1];
    this.lives--;
  }
}
