import { images } from "./assets.js";
import { setWorldSize, hero } from "./state.js";
import { prepareNavMask } from "./navmask.js";
import { recomputeScales, snapCameraToHero } from "./camera.js";
import { resetCars } from "./cars.js";
import { setHeroScale, applyHeroSizeFromScreen } from "./hero.js"; // <-- НОВЕ

let currentScene = 1;

export function changeScene(targetScene) {
  if (currentScene === 1 && targetScene === 2) resetCars();

  if (targetScene === 2) {
    images.scene = images.scene2;
    images.nav   = images.nav2;
    setHeroScale(hero, 2);     // <-- тут збільшуємо
  } else {
    images.scene = images.scene1;
    images.nav   = images.nav1;
    setHeroScale(hero, 1);     // <-- повертаємо як було
  }

  prepareNavMask();
  setWorldSize(images.scene.naturalWidth, images.scene.naturalHeight);
  recomputeScales();

  // старт-позиції (як у тебе було)
  if (targetScene === 2) {
    hero.x = 200;  hero.y = 520;
  } else {
    hero.x = 1250; hero.y = 470;
  }
  hero.targetX = hero.x; hero.targetY = hero.y;

  // після зміни масштабу варто ще раз підлаштувати габарити під нові scale+екран
  applyHeroSizeFromScreen(hero);
  snapCameraToHero(hero);

  currentScene = targetScene;
}


export function getCurrentScene() {
  return currentScene;
}
