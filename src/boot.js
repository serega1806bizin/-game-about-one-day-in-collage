import { loadAllAssets, images } from "./assets.js";
import { prepareNavMask } from "./navmask.js";
import { bindPointer } from "./input.js";
import { initHeroSprite, applyHeroSizeFromScreen, updateHero } from "./hero.js";
import { recomputeScales, snapCameraToHero } from "./camera.js";
import { startLoop } from "./loop.js";
import { updateCars, resetCars } from "./cars.js";
import { initNpc, updateNpc, applyNpcSizeFromScreen } from "./npc.js";
import { initNpc2 } from "./npc.js";
import { initNpc3 } from "./npc.js";


import {
  canvas,
  hero,
  cam,
  setWorldSize,
  resizeCanvasTo,
  viewW,
  viewH,
  worldW,
} from "./state.js";
import { loadFlags } from "./state.js";
import { getCurrentScene, changeScene } from "./sceneManager.js"; // ← ДОБАВИЛИ changeScene




export async function boot() {
  resizeCanvasTo(window.innerWidth, window.innerHeight);
  window.addEventListener("resize", () => {
    resizeCanvasTo(window.innerWidth, window.innerHeight);
    recomputeScales();
    applyHeroSizeFromScreen(hero);
    applyNpcSizeFromScreen(); // ← ДОДАТИ ЦЕ
  });
  loadFlags();

  await loadAllAssets();

  setWorldSize(images.scene.naturalWidth, images.scene.naturalHeight);
  prepareNavMask();
  recomputeScales();
  initHeroSprite(hero);
  applyHeroSizeFromScreen(hero);
  snapCameraToHero(hero);
  bindPointer(hero);

  // ініціалізація NPC після завантаження
  initNpc();
  initNpc2();
  initNpc3();

  window.heroRef = hero;

  startLoop((dt) => {
    updateHero(hero, dt);

    const scene = getCurrentScene();

    // --- обновления, специфические для сцены 1 (как и было)
    if (scene === 1) {
      updateCars(dt, () => gameOver());
      updateNpc(dt);
    }

    // --- ЛОГИКА ПЕРЕХОДОВ ПО КРАЯМ ---

    const EDGE_MARGIN = 30; // отступ от края, можно подстроить

    // СЦЕНА 3: правый край → сцена 2
    if (scene === 3) {
      const heroRight = hero.x + hero.w * (1 - hero.anchorX);
      if (heroRight >= worldW - EDGE_MARGIN) {
        console.log("➡️ Сцена 3: правый край, переходим на сцену 2");
        changeScene(2);
        hero.x = 1400;
        hero.y = 420;
        snapCameraToHero(hero);
        return; // чтобы в этом кадре больше ничего не делать
      }
    }

    // СЦЕНА 4: левый край → сцена 2
    if (scene === 4) {
      const heroLeft = hero.x - hero.w * hero.anchorX;
      if (heroLeft <= EDGE_MARGIN) {
        console.log("⬅️ Сцена 4: левый край, переходим на сцену 2");
        changeScene(2);
        hero.x = 1400;
        hero.y = 420;
        snapCameraToHero(hero);
        return;
      }
    }
  }, hero);
}

function gameOver() {
  const el = document.getElementById("gameover");
  if (el) el.classList.add("show");
}

window.__restartGame = function () {
  const el = document.getElementById("gameover");
  if (el) el.classList.remove("show");
  resetCars();
  hero.x = 1250;
  hero.y = 470;
  hero.targetX = hero.x;
  hero.targetY = hero.y;
};
