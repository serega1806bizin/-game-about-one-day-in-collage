import { loadAllAssets, images } from "./assets.js";
import { prepareNavMask } from "./navmask.js";
import { bindPointer } from "./input.js";
import { initHeroSprite, applyHeroSizeFromScreen, updateHero } from "./hero.js";
import { recomputeScales, snapCameraToHero } from "./camera.js";
import { startLoop } from "./loop.js";
import { updateCars, resetCars } from "./cars.js";
import { initNpc, updateNpc } from "./npc.js"; // <-- додай сюди
import { canvas, hero, cam, setWorldSize, resizeCanvasTo, viewW, viewH } from "./state.js";

export async function boot() {
  resizeCanvasTo(window.innerWidth, window.innerHeight);
  window.addEventListener("resize", () => {
    resizeCanvasTo(window.innerWidth, window.innerHeight);
    recomputeScales();
    applyHeroSizeFromScreen(hero);
  });

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

  window.heroRef = hero;

  startLoop((dt) => {
    updateHero(hero, dt);           // рух героя
    updateCars(dt, () => gameOver()); // машини
    updateNpc(dt);                  // <-- оновлення анімації NPC
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
