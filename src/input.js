import { canvas, worldH } from './state.js';
import { screenToWorld } from './camera.js';
import { clamp } from './utils.js';
import { projectTargetToWalkable } from './navmask.js';

export function bindPointer(hero) {
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    let { x: wx, y: wy } = screenToWorld(sx, sy);

    const padY = hero.h * hero.anchorY;
    wy = clamp(wy, padY, worldH - (hero.h - padY));

    const snapped = projectTargetToWalkable(hero.x, hero.y, wx, wy);
    if (snapped.ok) {
      hero.targetX = snapped.x;
      hero.targetY = snapped.y;
    } else {
      console.log('🚫 Клик вне дороги — цель не поменяна');
    }
  });
}
