import { loadAllAssets, images } from "./assets.js";
import { prepareNavMask } from "./navmask.js";
import { bindPointer } from "./input.js";
import { initHeroSprite, applyHeroSizeFromScreen, updateHero } from "./hero.js";
import { recomputeScales, snapCameraToHero } from "./camera.js";
import { startLoop } from "./loop.js";
import { updateCars, resetCars } from "./cars.js";
import {
  canvas,
  hero,
  cam,
  setWorldSize,
  resizeCanvasTo,
  viewW,
  viewH,
} from "./state.js";

export async function boot() {
  // первичный размер канвы
  resizeCanvasTo(window.innerWidth, window.innerHeight);
  window.addEventListener("resize", () => {
    resizeCanvasTo(window.innerWidth, window.innerHeight);
    recomputeScales();
    applyHeroSizeFromScreen(hero);
  });

  // загрузка ассетов
  await loadAllAssets();

  // мир по размеру сцены
  setWorldSize(images.scene.naturalWidth, images.scene.naturalHeight);

  // навигационная маска
  prepareNavMask();

  // масштаб
  recomputeScales();

  // герой
  initHeroSprite(hero);
  applyHeroSizeFromScreen(hero);

  // камера на героя
  snapCameraToHero(hero);

  // ввод
  bindPointer(hero);

  window.heroRef = hero;

  // запуск циклу з оновленням героя + машин
  startLoop((dt) => {
    updateHero(hero, dt); // рух героя (твоє) :contentReference[oaicite:4]{index=4}
    updateCars(dt, () => gameOver()); // перевірка зіткнення → модалка
  }, hero);
}

function gameOver() {
  const el = document.getElementById('gameover');
  if (el) el.classList.add('show');
}
window.__restartGame = function () {
  const el = document.getElementById('gameover');
  if (el) el.classList.remove('show');
  resetCars();
  // повернемо героя на старт
  hero.x = 1250; hero.y = 470;
  hero.targetX = hero.x; hero.targetY = hero.y;
}
