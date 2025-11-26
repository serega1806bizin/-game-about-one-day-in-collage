// input.js
import { canvas, worldH } from "./state.js";
import { screenToWorld } from "./camera.js";
import { clamp } from "./utils.js";
import { projectTargetToWalkable, isColorZone } from "./navmask.js";
import { showPopup, showQuestionPopup, showDoorIsClosed, showLessonEnd, showOcupied } from "./dialog.js";
import { startNpcDialog } from "./npcDialog.js"; // <-- додаємо імпорт
import { changeScene, getCurrentScene } from "./sceneManager.js";
import { snapCameraToHero } from "./camera.js";
import { isLesson1Done } from "./lesson1Story.js";
import { isLesson2Done } from "./lesson2Story.js";

const RED_ZONE = { r: 255, g: 0, b: 0 };
const BLUE_ZONE = { r: 0, g: 0, b: 255 };
const BLUE_ZONE2 = { r: 42, g: 0, b: 255 };
const GREEN_ZONE = { r: 85, g: 255, b: 0 };
const GREEN_ZONE2 = { r: 0, g: 255, b: 85 };
const GREEN_ZONE3 = { r: 0, g: 255, b: 0 };
const YELLOW_ZONE = { r: 255, g: 255, b: 0 };
const ORANGE_ZONE = { r: 255, g: 170, b: 0 };

export function bindPointer(hero) {
  canvas.addEventListener("pointerdown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    let { x: wx, y: wy } = screenToWorld(sx, sy);

    const padY = hero.h * hero.anchorY;
    wy = clamp(wy, padY, worldH - (hero.h - padY));

    if (isColorZone(wx, wy, BLUE_ZONE.r, BLUE_ZONE.g, BLUE_ZONE.b)) {
      const current = getCurrentScene();

      if (current === 1) {
        console.log("🟦 Сцена 1: магазин (вода)");
        showPopup();
      } else if (current === 2) {
        console.log('🟦 Сцена 2: питання "де пара?"');
        showQuestionPopup();
      } else if (current === 7) {
        changeScene(8);
        return;
      } else if (current === 4) {
        showDoorIsClosed();
        return;
      }

      return;
    }

    if (isColorZone(wx, wy, BLUE_ZONE2.r, BLUE_ZONE2.g, BLUE_ZONE2.b)) {
      const current = getCurrentScene();

      if (current === 3) {
        showDoorIsClosed();
        console.log("🟦 Сцена 3: закрито");
        return;
      }

      return;
    }

    if (isColorZone(wx, wy, GREEN_ZONE.r, GREEN_ZONE.g, GREEN_ZONE.b)) {
      const current = getCurrentScene();

      if (current === 1) {
        console.log("🟩 Сцена 1: NPC діалог");
        startNpcDialog();
      } else if (current === 2) {
        console.log("🟩 Сцена 2: перехід на сцену 3");
        changeScene(3);
      } else if (current === 3) {
        if (!isLesson1Done) {
          changeScene(6);
        } else {
          showLessonEnd();
        }
      }

      return;
    }

    if (isColorZone(wx, wy, GREEN_ZONE3.r, GREEN_ZONE3.g, GREEN_ZONE3.b)) {
      const current = getCurrentScene();

      if (current === 7) {
        console.log("🟩 Сцена 7: перехід на сцену 10");
        if (!isLesson2Done) {
          changeScene(10);
          hero.y = 1200;
          hero.targetX = hero.x;
          hero.targetY = hero.y;
          snapCameraToHero(hero);
        } else {
          showLessonEnd();
        }
        return;
      }


      return;
    }

    if (isColorZone(wx, wy, GREEN_ZONE2.r, GREEN_ZONE2.g, GREEN_ZONE2.b)) {
    
      const current = getCurrentScene();

      if (current === 1) {
        console.log("🟩 Сцена 1: NPC діалог");
        startNpcDialog();
        return;
      }

      if (current === 8) {
        changeScene(9);
        return;
      }

    }

    // --- 3. Клік по червоній зоні
    if (isColorZone(wx, wy, RED_ZONE.r, RED_ZONE.g, RED_ZONE.b)) {
      const current = getCurrentScene();

      if (current === 1) {
        console.log("🟥 Сцена 1: перехід на сцену 2");
        changeScene(2);
        hero.x = 200;
        hero.y = 520;
        hero.targetX = hero.x;
        hero.targetY = hero.y;
        snapCameraToHero(hero);
        return;
      } else if (current === 2) {
        console.log("🟥 Сцена 2: перехід на сцену 4");
        changeScene(4);
      } else if (current === 7) {
        changeScene(9);
        return;
      } else if (current === 9) {
        changeScene(7);
        return;
      } else if (current === 3) {
        showOcupied();
      }
      return;
    }

    if (isColorZone(wx, wy, YELLOW_ZONE.r, YELLOW_ZONE.g, YELLOW_ZONE.b)) {
      const current = getCurrentScene();
      if (current === 2) {
        changeScene(7);
        return;
      }

      if (current === 8) {
        changeScene(7);
        return;
      }

      if (current === 7) {
        showDoorIsClosed();
        return;
      }

      if (current === 9) {
        changeScene(11);
        return;
      }

      changeScene(5);
      return;
    }

    if (isColorZone(wx, wy, ORANGE_ZONE.r, ORANGE_ZONE.g, ORANGE_ZONE.b)) {
      const current = getCurrentScene();

      if (current === 7) {
        changeScene(2);
        hero.x = 1250;
        hero.y = 470;
        hero.targetX = hero.x;
        hero.targetY = hero.y;
        return;
      }
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
