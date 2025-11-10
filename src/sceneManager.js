// sceneManager.js
import { images } from './assets.js';
import { setWorldSize, hero } from './state.js';
import { prepareNavMask } from './navmask.js';
import { recomputeScales, snapCameraToHero } from './camera.js';

let currentScene = 1;

export function changeScene(targetScene) {
  console.log(`🔄 Перехід на сцену ${targetScene}`);

  if (targetScene === 2) {
    // друга сцена = scene2 + navmask3
    images.scene = images.scene2;
    images.nav   = images.nav3;
  } else {
    // перша сцена = scene + navmask
    images.scene = images.scene;
    images.nav   = images.nav;
  }

  // оновлюємо дані світу
  prepareNavMask();
  setWorldSize(images.scene.naturalWidth, images.scene.naturalHeight);
  recomputeScales();

  // позиція героя при вході в сцену
  if (targetScene === 2) {
    hero.x = 200;
    hero.y = 520;
  } else {
    hero.x = 1250;
    hero.y = 470;
  }
  hero.targetX = hero.x;
  hero.targetY = hero.y;

  snapCameraToHero(hero);
  currentScene = targetScene;
}

export function getCurrentScene() {
  return currentScene;
}
