import { tileSize } from '../constants.js';

export class Ghost {
  constructor(map, coordinates) {
    this.map = map;
    this.coordinates = coordinates;
  }

  draw() {
    const ghostImage = new Image();
    ghostImage.src = '../../images/ghost-red.png';

    this.coordinates.forEach((coordinate) => {
      this.map.mapData[coordinate[1]][coordinate[0]] = this;
      window.ctx.save();
      window.ctx.drawImage(
        ghostImage,
        coordinate[0] * tileSize,
        coordinate[1] * tileSize,
        tileSize,
        tileSize,
      );
      window.ctx.restore();
    });
  }

  // destroy(x, y) {
  //   this.map.mapData[y][x] = 0;
  //   this.coordinates = this.coordinates.filter((coordinate) => {
  //     return !(coordinate[0] === x && coordinate[1] === y);
  //   });
  // }
}
