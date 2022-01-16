import { tileSize } from './constants.js';
import { map1 } from './map.js';

import { Dots } from './items/Dots.js';
import { Pacman, FacingDirection, MovingDirection } from './items/Pacman.js';
import { Ghost } from './items/Ghost.js';

const canvas = document.querySelector('canvas');
window.ctx = canvas.getContext('2d');

const currentMap = map1;

// Items
const dots = new Dots(map1, map1.getItems(0));
const pacman = new Pacman(map1.getItems(2)[0], 0.1, map1);
const ghosts = new Ghost(map1, map1.getItems(3));

canvas.width = currentMap.width;
canvas.height = currentMap.height;

window.addEventListener('keydown', (e) => {
  e.preventDefault();
  switch (e.keyCode) {
    // Up
    case 87:
      if (pacman.currentMovingDirection === MovingDirection.DOWN)
        pacman.currentMovingDirection = MovingDirection.UP;
      pacman.requestedMovingDirection = MovingDirection.UP;
      break;

    // Right
    case 68:
      if (pacman.currentMovingDirection === MovingDirection.LEFT)
        pacman.currentMovingDirection = MovingDirection.RIGHT;
      pacman.requestedMovingDirection = MovingDirection.RIGHT;
      break;

    // Down
    case 83:
      if (pacman.currentMovingDirection === MovingDirection.UP)
        pacman.currentMovingDirection = MovingDirection.DOWN;
      pacman.requestedMovingDirection = MovingDirection.DOWN;
      break;

    // Left
    case 65:
      if (pacman.currentMovingDirection === MovingDirection.RIGHT)
        pacman.currentMovingDirection = MovingDirection.LEFT;
      pacman.requestedMovingDirection = MovingDirection.LEFT;
      break;

    default:
      break;
  }
});

function render() {
  window.ctx.clearRect(0, 0, canvas.width, canvas.height);

  map1.draw();
  dots.draw();
  ghosts.draw();
  pacman.draw();

  requestAnimationFrame(render);
}

render();
