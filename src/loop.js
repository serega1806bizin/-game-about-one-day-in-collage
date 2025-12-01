// loop.js
import { render } from './render.js';
import { smoothFollow } from './camera.js';
import { isPaused } from './gameData.js'; // <-- ИМПОРТ

let last = performance.now();


export function startLoop(updateFn, hero) {
  function loop(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    
    if (!isPaused) { 
        updateFn(dt);    
        smoothFollow(hero); 
    }

    render(hero);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

