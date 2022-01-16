import { tileSize } from '../constants.js';

export class Dots {
  constructor(map, coordinates) {
    this.map = map;
    this.coordinates = coordinates;
  }

  draw() {
    this.coordinates.forEach((coordinate) => {
      this.map.mapData[coordinate[1]][coordinate[0]] = this;
      window.ctx.beginPath();
      window.ctx.arc(
        coordinate[0] * tileSize + tileSize / 2,
        coordinate[1] * tileSize + tileSize / 2,
        5,
        0,
        Math.PI * 2,
        true,
      );
      window.ctx.save();
      window.ctx.fillStyle = 'white';
      window.ctx.fill();
      window.ctx.restore();
    });
  }

  destroy(x, y) {
    this.map.mapData[y][x] = 0;
    this.coordinates = this.coordinates.filter((coordinate) => {
      return !(coordinate[0] === x && coordinate[1] === y);
    });
  }
}
