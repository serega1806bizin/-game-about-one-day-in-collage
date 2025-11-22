import { images } from "./assets.js";
import { setWorldSize, hero } from "./state.js";
import { prepareNavMask } from "./navmask.js";
import { recomputeScales, snapCameraToHero } from "./camera.js";
import { resetCars } from "./cars.js";
import { setHeroSpeed, setHeroScale, applyHeroSizeFromScreen } from "./hero.js";
import { HERO_SPEED } from "./config.js";
import { startLessonScene } from "./lessonStory.js";

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

    case 5:
      console.log("→ Сцена 5");
      images.scene = images.scene5;
      images.nav = images.nav5;

      setHeroScale(hero, 1.5);
      console.log(" scale = 1.5");

      setHeroSpeed(hero, 220);
      hero.x = 450;
      hero.y = 650;
      break;

    case 6:
      images.scene = images.scene6;
      images.nav = images.nav6;

      setWorldSize(images.scene.naturalWidth, images.scene.naturalHeight);

      // Координаты героя при входе на сцену 6
      hero.x = 500; // або інші, ти вибереш
      hero.y = 450;
      setTimeout(() => startLessonScene(), 500);

      break;
    
    case 7:
      images.scene = images.scene7;
      images.nav = images.nav7;

      setWorldSize(images.scene.naturalWidth, images.scene.naturalHeight);

      // Координаты героя при входе на сцену 6
      hero.x = 2000; // або інші, ти вибереш
      hero.y = 450;

      break;
    
    case 8:
      images.scene = images.scene8;
      images.nav = images.nav8;

      setWorldSize(images.scene.naturalWidth, images.scene.naturalHeight);

      // Координаты героя при входе на сцену 6
      hero.x = 100; // або інші, ти вибереш
      hero.y = 450;

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
