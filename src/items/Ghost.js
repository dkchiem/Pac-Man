import { tileSize } from '../constants.js';
import {
  roundPrecision,
  countDecimals,
  MovingDirection,
  MovingDirectionMovements,
} from '../utils.js';

const scaredImage = new Image();
scaredImage.src = '../../images/ghosts/scared.png';

const eyesImage = new Image();
eyesImage.src = '../../images/ghosts/eyes.png';

export class Ghost {
  constructor(pacman, map, imageFile, coordinate, speed) {
    this.pacman = pacman;
    this.map = map;
    this.x = coordinate[0];
    this.y = coordinate[1];
    this.speed = speed;
    this.movingDirection = this.randomMovingDirection(MovingDirection);
    this.time = 0;
    this.dead = false;
    this.image = new Image();
    this.image.src = `../../images/ghosts/${imageFile}`;
  }

  draw() {
    window.ctx.save();
    window.ctx.drawImage(
      this.getImage(),
      this.x * tileSize,
      this.y * tileSize,
      tileSize - 2,
      tileSize - 2,
    );
    window.ctx.restore();

    this.move();
  }

  move() {
    if (this.didCollide(this.x, this.y, this.movingDirection)) {
      this.movingDirection = this.randomMovingDirection(
        this.possibleDirections(),
      );
    }

    if (Number.isInteger(this.x) && Number.isInteger(this.y)) {
      this.movingDirection = this.randomMovingDirection(
        this.possibleDirections(),
      );
      if (!this.dead) {
        if (this.pacman.powered) {
          this.collideWithPacman(this.pacman, () => {
            const eatGhostSound = new Audio('../../sounds/eat-ghost.wav');
            eatGhostSound.volume = 0.6;
            eatGhostSound.play();
            this.pacman.score += 200;
            this.dead = true;
            setTimeout(() => {
              this.dead = false;
            }, 8000);
          });
        } else {
          this.collideWithPacman(this.pacman, () => {
            const deathSound = new Audio('../../sounds/death.wav');
            deathSound.volume = 0.6;
            deathSound.play();
            this.pacman.die();
          });
        }
      }
    }

    let trueSpeed = this.speed;

    if (this.dead) {
      trueSpeed = roundPrecision(this.speed * 2, 3);
    } else if (this.pacman.powered) {
      trueSpeed = roundPrecision(this.speed / 2, 3);
    } else {
      trueSpeed = this.speed;
      this.x = roundPrecision(this.x, 1);
      this.y = roundPrecision(this.y, 1);
    }

    switch (this.movingDirection) {
      case MovingDirection.UP:
        this.y = roundPrecision(this.y - trueSpeed, 3);
        break;

      case MovingDirection.RIGHT:
        this.x = roundPrecision(this.x + trueSpeed, 3);
        break;

      case MovingDirection.DOWN:
        this.y = roundPrecision(this.y + trueSpeed, 3);
        break;

      case MovingDirection.LEFT:
        this.x = roundPrecision(this.x - trueSpeed, 3);
        break;

      default:
        break;
    }

    if (this.x >= this.map.mapData[0].length) this.x = 0;
    if (this.x < 0) this.x = this.map.mapData[0].length;
    if (this.y >= this.map.mapData.length) this.y = 0;
    if (this.y < 0) this.y = this.map.mapData.length;
  }

  getImage() {
    if (this.dead) {
      return eyesImage;
    } else if (this.pacman.powered) {
      return scaredImage;
    } else {
      return this.image;
    }
  }

  collideWithPacman(pacman, callback) {
    if (
      this.x <= pacman.x + 1 &&
      this.x + 1 >= pacman.x &&
      this.y <= pacman.y + 1 &&
      this.y + 1 >= pacman.y
    ) {
      callback();
    }
  }

  possibleDirections() {
    return Object.values(MovingDirectionMovements)
      .filter((direction) => {
        return this.canGo(this.x + direction[0], this.y + direction[1]);
      })
      .map((direction) => {
        return Object.keys(MovingDirectionMovements).find(
          (key) => MovingDirectionMovements[key] === direction,
        );
      })
      .filter((direction) => {
        return (
          direction !== this.getOppositeMovingDirection(this.movingDirection)
        );
      });
  }

  canGo(x, y) {
    if (this.map.mapData[Math.round(y)][Math.round(x)] === undefined) {
      return false;
    }
    return (
      this.map.mapData[Math.round(y)][Math.round(x)] !== 1 &&
      this.map.mapData[Math.round(y)][Math.round(x)] !== 9
    );
  }

  getOppositeMovingDirection(movingDirection) {
    switch (movingDirection) {
      case MovingDirection.UP:
        return MovingDirection.DOWN;

      case MovingDirection.RIGHT:
        return MovingDirection.LEFT;

      case MovingDirection.DOWN:
        return MovingDirection.UP;

      case MovingDirection.LEFT:
        return MovingDirection.RIGHT;

      default:
        return null;
    }
  }

  randomMovingDirection(movingDirections) {
    var keys = Object.keys(movingDirections);
    return movingDirections[keys[(keys.length * Math.random()) << 0]];
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
