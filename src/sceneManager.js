import { images } from "./assets.js";
import { setWorldSize, hero } from "./state.js";
import { prepareNavMask } from "./navmask.js";
import { recomputeScales, snapCameraToHero } from "./camera.js";
import { resetCars } from "./cars.js";
import { setHeroSpeed, setHeroScale, applyHeroSizeFromScreen } from "./hero.js";
import { HERO_SPEED } from "./config.js";

let currentScene = 1;

function applySceneAssets(targetScene) {
  console.log("🔄 applySceneAssets:", targetScene);

  switch (targetScene) {
    case 1:
      console.log("→ Сцена 1");
      images.scene = images.scene1;
      images.nav = images.nav1;
      console.log(" scale = 1");

      setHeroSpeed(hero, HERO_SPEED);
      hero.x = 1250;
      hero.y = 470;
      break;

    case 2:
      console.log("→ Сцена 2");
      images.scene = images.scene2;
      images.nav = images.nav2;

      setHeroScale(hero, 1.3);
      console.log(" scale = 2");

      setHeroSpeed(hero, 220);

      hero.x = 200;
      hero.y = 520;
      break;

    case 3:
      console.log("→ Сцена 3");
      images.scene = images.scene3;
      images.nav = images.nav3;

      setHeroScale(hero, 1);
      console.log(" scale = 2.5");

      setHeroSpeed(hero, 220);

      hero.x = 2000;
      hero.y = 420;
      break;

    case 4:
      console.log("→ Сцена 4");
      images.scene = images.scene4;
      images.nav = images.nav4;

      setHeroScale(hero, 1);
      console.log(" scale = 1.5");

      setHeroSpeed(hero, 220);

      hero.x = 100;
      hero.y = 420;
      break;

    default:
      console.warn("Unknown scene:", targetScene);
      return false;
  }

  console.log(" hero.scale now =", hero.scale);
  return true;
}

export function changeScene(targetScene) {
  console.log("=== changeScene →", targetScene, "===");

  if (targetScene === currentScene) {
    console.log(" Scene is the same, skip");
    return;
  }

  if (currentScene === 1 && targetScene === 2) {
    resetCars();
    console.log(" Cars reset (scene 1 → 2)");
  }

  if (!applySceneAssets(targetScene)) return;

  prepareNavMask();
  console.log(" Navmask prepared");

  if (images.scene && images.scene.naturalWidth) {
    setWorldSize(images.scene.naturalWidth, images.scene.naturalHeight);
    console.log(
      " World size set:",
      images.scene.naturalWidth,
      images.scene.naturalHeight
    );
  }

  recomputeScales();
  console.log(" Scales recomputed");

  hero.targetX = hero.x;
  hero.targetY = hero.y;

  console.log(" Applying hero size…");
  applyHeroSizeFromScreen(hero);

  snapCameraToHero(hero);

  currentScene = targetScene;

  console.log("=== SCENE CHANGED. currentScene =", currentScene, "===\n");
}

export function getCurrentScene() {
  return currentScene;
}
