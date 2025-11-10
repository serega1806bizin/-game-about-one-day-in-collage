// input.js
import { canvas, worldH } from './state.js';
import { screenToWorld } from './camera.js';
import { clamp } from './utils.js';
import { projectTargetToWalkable, isColorZone } from './navmask.js'; // <-- ИМПОРТ isColorZone
import { showPopup } from './dialog.js'; // <-- ИМПОРТ showPopup

const BLUE_ZONE = { r: 0, g: 0, b: 255 }; // Синяя зона для магазина

export function bindPointer(hero) {
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    let { x: wx, y: wy } = screenToWorld(sx, sy);

    const padY = hero.h * hero.anchorY;
    wy = clamp(wy, padY, worldH - (hero.h - padY));
    
    // 1. ПРОВЕРКА КЛИКА ПО СИНЕЙ ЗОНЕ (МАГАЗИН)
    if (isColorZone(wx, wy, BLUE_ZONE.r, BLUE_ZONE.g, BLUE_ZONE.b)) {
      console.log('Клик по синей зоне: Вызываем попап');
      showPopup();
      return; // Останавливаем обычное движение
    }

    // 2. ОБЫЧНОЕ ДВИЖЕНИЕ
    const snapped = projectTargetToWalkable(hero.x, hero.y, wx, wy);
    if (snapped.ok) {
      hero.targetX = snapped.x;
      hero.targetY = snapped.y;
    } else {
      console.log('🚫 Клик вне дороги — цель не поменяна');
    }
  });
}