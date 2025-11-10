// input.js
import { canvas, worldH } from './state.js';
import { screenToWorld } from './camera.js';
import { clamp } from './utils.js';
import { projectTargetToWalkable, isColorZone } from './navmask.js';
import { showPopup } from './dialog.js';
import { startNpcDialog } from './npcDialog.js'; // <-- додаємо імпорт
import { changeScene, getCurrentScene } from './sceneManager.js';

const RED_ZONE = { r: 255, g: 0, b: 0 };
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

    if (isColorZone(wx, wy, RED_ZONE.r, RED_ZONE.g, RED_ZONE.b)) {
      const current = getCurrentScene();
      if (current === 1) {
        changeScene(2); // з першої → у другу (scene2 + navmask3)
      } else {
        changeScene(1); // з другої → назад у першу
      }
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
