import { images } from "./assets.js";
import { setWorldSize, hero } from "./state.js";
import { prepareNavMask } from "./navmask.js";
import { recomputeScales, snapCameraToHero } from "./camera.js";
import { resetCars } from "./cars.js";
import { setHeroSpeed, setHeroScale, applyHeroSizeFromScreen } from "./hero.js";
import { HERO_SPEED } from "./config.js";

let currentScene = 1;

function applySceneAssets(targetScene) {
  switch (targetScene) {
    case 1:
      images.scene = images.scene1;
      images.nav   = images.nav1;
      setHeroScale(hero, 1);
      setHeroSpeed(hero, HERO_SPEED);
      hero.x = 1250;
      hero.y = 470;
      break;

    case 2:
      images.scene = images.scene2;
      images.nav   = images.nav2;
      setHeroScale(hero, 2);
      setHeroSpeed(hero, 220);   // тут герой бегает быстрее
      hero.x = 200;
      hero.y = 520;
      break;

    case 3:
      images.scene = images.scene3;
      images.nav   = images.nav3;
      setHeroScale(hero, 2);
      setHeroSpeed(hero, HERO_SPEED);
      hero.x = 200;
      hero.y = 520;
      break;

    case 4:
      images.scene = images.scene4;
      images.nav   = images.nav4;
      setHeroScale(hero, 2);
      setHeroSpeed(hero, 220);
      hero.x = 200;
      hero.y = 520;
      break;

    default:
      console.warn("Unknown scene:", targetScene);
      return false;
  }

  return true;
}

export function changeScene(targetScene) {
  if (targetScene === currentScene) return;

  // при выезде на дорогу сбрасываем машины
  if (currentScene === 1 && targetScene === 2) {
    resetCars();
  }

  if (!applySceneAssets(targetScene)) return;

  // перестраиваем навмаску и масштаб
  prepareNavMask();

  if (images.scene && images.scene.naturalWidth) {
    setWorldSize(images.scene.naturalWidth, images.scene.naturalHeight);
  }

  recomputeScales();

  hero.targetX = hero.x;
  hero.targetY = hero.y;

  applyHeroSizeFromScreen(hero);
  snapCameraToHero(hero);

  currentScene = targetScene;
}

export function getCurrentScene() {
  return currentScene;
}
