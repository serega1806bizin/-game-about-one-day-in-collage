import { loadAllAssets, images } from './assets.js';
import { prepareNavMask } from './navmask.js';
import { bindPointer } from './input.js';
import { initHeroSprite, applyHeroSizeFromScreen, updateHero } from './hero.js';
import { recomputeScales, snapCameraToHero } from './camera.js';
import { startLoop } from './loop.js';
import { canvas, hero, cam, setWorldSize, resizeCanvasTo, viewW, viewH } from './state.js';

export async function boot() {
  // первичный размер канвы
  resizeCanvasTo(window.innerWidth, window.innerHeight);
  window.addEventListener('resize', () => {
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

  // запуск цикла
  startLoop(dt => updateHero(hero, dt), hero);
}
