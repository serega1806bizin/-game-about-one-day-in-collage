// input.js
import { canvas, worldH } from "./state.js";
import { screenToWorld } from "./camera.js";
import { clamp } from "./utils.js";
import { projectTargetToWalkable, isColorZone } from "./navmask.js";
import { showPopup, showQuestionPopup } from "./dialog.js";
import { startNpcDialog } from "./npcDialog.js"; // <-- додаємо імпорт
import { changeScene, getCurrentScene } from "./sceneManager.js";

const RED_ZONE = { r: 255, g: 0, b: 0 };
const BLUE_ZONE = { r: 0, g: 0, b: 255 }; // синя зона — магазин
const GREEN_ZONE = { r: 85, g: 255, b: 0 }; // зелена зона — NPC
const GREEN_ZONE2 = { r: 0, g: 255, b: 85 }; // зелена зона — NPC

export function bindPointer(hero) {
  canvas.addEventListener("pointerdown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    let { x: wx, y: wy } = screenToWorld(sx, sy);

    const padY = hero.h * hero.anchorY;
    wy = clamp(wy, padY, worldH - (hero.h - padY));

    // --- 1. Клік по синій зоні (магазин)
    // --- 1. Клік по синій зоні
    if (isColorZone(wx, wy, BLUE_ZONE.r, BLUE_ZONE.g, BLUE_ZONE.b)) {
      const current = getCurrentScene();

      if (current === 1) {
        console.log("🟦 Сцена 1: магазин (вода)");
        showPopup(); // стара логіка
      } else if (current === 2) {
        console.log('🟦 Сцена 2: питання "де пара?"');
        showQuestionPopup(); // НОВА модалка
      }

      return;
    }

    // --- 2. Клік по зеленій зоні
    if (isColorZone(wx, wy, GREEN_ZONE.r, GREEN_ZONE.g, GREEN_ZONE.b)) {
      const current = getCurrentScene();

      if (current === 1) {
        console.log("🟩 Сцена 1: NPC діалог");
        startNpcDialog();
      } else if (current === 2) {
        console.log("🟩 Сцена 2: перехід на сцену 3");
        changeScene(3);
      }

      return;
    }

    if (isColorZone(wx, wy, GREEN_ZONE2.r, GREEN_ZONE2.g, GREEN_ZONE2.b)) {
      console.log("🟩 Сцена 1: NPC діалог");
      startNpcDialog();
    }

    // --- 3. Клік по червоній зоні
    if (isColorZone(wx, wy, RED_ZONE.r, RED_ZONE.g, RED_ZONE.b)) {
      const current = getCurrentScene();

      if (current === 1) {
        console.log("🟥 Сцена 1: перехід на сцену 2");
        changeScene(2);
      } else if (current === 2) {
        console.log("🟥 Сцена 2: перехід на сцену 4");
        changeScene(4);
      }

      return;
    }

    // --- 3. Звичайне пересування
    const snapped = projectTargetToWalkable(hero.x, hero.y, wx, wy);
    if (snapped.ok) {
      hero.targetX = snapped.x;
      hero.targetY = snapped.y;
    } else {
      console.log("🚫 Клік поза прохідною зоною");
    }
  });
}
