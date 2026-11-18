import { createGameState, updateGameState, drawGame, loadGameState, saveGameState } from './gameLogic.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const keys = {};
window.addEventListener('keydown', e => { keys[e.key] = true; if (e.key === 'Escape') togglePause(); });
window.addEventListener('keyup', e => keys[e.key] = false);

const mouse = { x: 0, y: 0, down: false };
canvas.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
canvas.addEventListener('mousedown', () => mouse.down = true);
canvas.addEventListener('mouseup', () => mouse.down = false);
canvas.addEventListener('contextmenu', e => e.preventDefault());

let state = createGameState();
let lastTime = 0;
let paused = false;

function gameLoop(time) {
  const dt = Math.min((time - lastTime) / 1000, 1/30);
  lastTime = time;
  
  if (!paused && !state.titleScreen.active && !state.gameOver.active) {
    updateGameState(state, dt, keys, mouse);
  }
  drawGame(ctx, state);
  requestAnimationFrame(gameLoop);
}

function togglePause() {
  if (state.titleScreen.active || state.gameOver.active) return;
  paused = !paused;
  document.getElementById('pause-menu').classList.toggle('active', paused);
}

document.getElementById('btn-new-game').onclick = () => {
  state = createGameState();
  state.titleScreen.active = false;
  paused = false;
};

document.getElementById('btn-resume').onclick = togglePause;

document.getElementById('btn-quit').onclick = () => {
  paused = false;
  state = createGameState();
};

document.getElementById('btn-retry').onclick = () => {
  state = createGameState();
  state.titleScreen.active = false;
  state.gameOver.active = false;
};

document.getElementById('btn-title').onclick = () => {
  state = createGameState();
};

requestAnimationFrame(gameLoop);