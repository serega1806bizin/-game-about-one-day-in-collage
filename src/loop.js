// loop.js
import { render } from './render.js';
import { smoothFollow } from './camera.js';
import { isPaused } from './gameData.js'; // <-- ИМПОРТ
import { updateNpc } from './npc.js';

let last = performance.now();


export function startLoop(updateFn, hero) {
  function loop(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    
    if (!isPaused) { // <-- ПРОВЕРКА ПАУЗЫ: обновление происходит только если игра не на паузе
        updateFn(dt);       // твой update: движение/анимация героя и т.п.
        smoothFollow(hero); // камера
    }

    render(hero);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

