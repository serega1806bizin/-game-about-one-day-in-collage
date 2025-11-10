// input.js
import { canvas, worldH } from './state.js';
import { screenToWorld } from './camera.js';
import { clamp } from './utils.js';
import { projectTargetToWalkable, isColorZone } from './navmask.js';
import { showPopup } from './dialog.js';
import { startNpcDialog } from './npcDialog.js'; // <-- додаємо імпорт

const BLUE_ZONE = { r: 0, g: 0, b: 255 }; // синя зона — магазин
const GREEN_ZONE = { r: 0, g: 255, b: 85 }; // зелена зона — NPC

export function bindPointer(hero) {
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    let { x: wx, y: wy } = screenToWorld(sx, sy);

    const padY = hero.h * hero.anchorY;
    wy = clamp(wy, padY, worldH - (hero.h - padY));

    // --- 1. Клік по синій зоні (магазин)
    if (isColorZone(wx, wy, BLUE_ZONE.r, BLUE_ZONE.g, BLUE_ZONE.b)) {
      console.log('🟦 Клік по синій зоні — магазин');
      showPopup();
      return;
    }

    // --- 2. Клік по зеленій зоні (NPC)
    if (isColorZone(wx, wy, GREEN_ZONE.r, GREEN_ZONE.g, GREEN_ZONE.b)) {
      console.log('🟩 Клік по зеленій зоні — NPC діалог');
      startNpcDialog();
      return;
    }

    // --- 3. Звичайне пересування
    const snapped = projectTargetToWalkable(hero.x, hero.y, wx, wy);
    if (snapped.ok) {
      hero.targetX = snapped.x;
      hero.targetY = snapped.y;
    } else {
      console.log('🚫 Клік поза прохідною зоною');
    }
  });
}
