import { MovingDirection } from './utils.js';
import { tileSize } from './constants.js';
import { map1 } from './map.js';

import { Dots } from './items/Dots.js';
import { BigDots } from './items/BigDots.js';
import { Pacman, FacingDirection } from './items/Pacman.js';
import { Ghost } from './items/Ghost.js';
import { Title } from './items/Title.js';

window.canvas = document.querySelector('canvas');
window.ctx = window.canvas.getContext('2d');

const currentMap = map1;
let gameRunning = false;

// Items
const dots = new Dots(map1, map1.getItems(0));
const bigDots = new BigDots(map1, map1.getItems(4));
const pacman = new Pacman(map1.getItems(2)[0], 0.1, map1);
const ghost1 = new Ghost(pacman, map1, 'cyan.png', map1.getItems(3)[0], 0.1);
const ghost2 = new Ghost(pacman, map1, 'orange.png', map1.getItems(3)[2], 0.1);
const ghost3 = new Ghost(pacman, map1, 'red.png', map1.getItems(3)[2], 0.1);
const title = new Title('Pacman');

window.canvas.width = currentMap.width;
window.canvas.height = currentMap.height;

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

const beginningSound = new Audio('../sounds/beginning.wav');
beginningSound.volume = 0.6;
beginningSound.play();

function start() {
  let count = 4;

  const counter = setInterval(() => {
    count--;
    title.title = `${count}`;

    if (count === 0) {
      clearInterval(counter);
      gameRunning = true;
    }
  }, 1000);
}

function render() {
  window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);

  // const live = document.createElement('img');
  // live.src = '../images/heart.svg';
  // document.querySelector('#live-bar').appendChild(live);

  const livebar = document.querySelector('#livebar');
  const liveHTML = '<div class="live"></div>';
  if (pacman.lives >= 0) {
    livebar.innerHTML = liveHTML.repeat(pacman.lives);
  }

  if (pacman.lives === 0) {
    document.querySelector('#replay').style.display = 'block';
    title.title = 'Game Over';
    gameRunning = false;
  }

  map1.draw();
  dots.draw();
  bigDots.draw();

  if (gameRunning) {
    ghost1.draw();
    ghost2.draw();
    ghost3.draw();
    pacman.draw();
  } else {
    title.draw();
  }

  if (dots.coordinates.length === 0) {
    dots.reset();
    bigDots.reset();
  }

  requestAnimationFrame(render);
}

start();
render();
