import { render } from './render.js';
import { smoothFollow } from './camera.js';

let last = performance.now();

export function startLoop(updateFn, hero) {
  function loop(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;

    updateFn(dt);       // твой update: движение/анимация героя и т.п.
    smoothFollow(hero); // камера

    render(hero);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
