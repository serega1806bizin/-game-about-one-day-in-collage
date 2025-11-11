import {
  HERO_SPRITE_COLS,
  HERO_SPRITE_ROWS,
  HERO_IDLE_FRAME,
  HERO_WALK_FPS,
  HERO_WALK_FPS_MAX,
  HERO_VH,
  HERO_MIN_PX,
  HERO_MAX_PX,
} from "./config.js";
import { images } from "./assets.js";
import { viewH } from "./state.js";
import { clamp } from "./utils.js";
import { isWalkable, findNearestWalkable } from "./navmask.js";

export function initHeroSprite(hero) {
  hero.img = images.hero;
  hero.srcW = Math.floor(images.hero.naturalWidth / HERO_SPRITE_COLS);
  hero.srcH = Math.floor(images.hero.naturalHeight / HERO_SPRITE_ROWS);
  applyHeroSizeFromScreen(hero); // после srcW/srcH
}

export function applyHeroSizeFromScreen(hero) {
  const frameW = (images.hero.naturalWidth || 1) / HERO_SPRITE_COLS;
  const frameH = (images.hero.naturalHeight || 1) / HERO_SPRITE_ROWS;
  const aspect = frameW / frameH;

  let targetH = Math.round(viewH * HERO_VH);
  targetH = clamp(targetH, HERO_MIN_PX, HERO_MAX_PX);

  hero.h = targetH;
  hero.w = Math.round(targetH * aspect);
  hero.w = Math.round(hero.w * (hero.scale || 1));
  hero.h = Math.round(hero.h * (hero.scale || 1));
}

export function setHeroScale(hero, k) {
  hero.scale = k;
  applyHeroSizeFromScreen(hero); 
}

export function updateHero(hero, dt) {
  const dx = hero.targetX - hero.x;
  const dy = hero.targetY - hero.y;
  const d = Math.hypot(dx, dy);

  if (d > 1) {
    const step = hero.speed * dt;
    const t = Math.min(1, step / d);
    const nextX = hero.x + dx * t;
    const nextY = hero.y + dy * t;

    if (isWalkable(nextX, nextY)) {
      hero.x = nextX;
      hero.y = nextY;
    } else if (isWalkable(nextX, hero.y)) {
      hero.x = nextX;
    } else if (isWalkable(hero.x, nextY)) {
      hero.y = nextY;
    } else {
      hero.targetX = hero.x;
      hero.targetY = hero.y;
    }
  }

  // анимация
  const moving = d > 1;
  if (moving) {
    if (Math.abs(dx) > 0.0001) hero.facingX = Math.sign(dx);
    const speedK = clamp(hero.speed / 280, 0.7, 1.3);
    const fps = clamp(HERO_WALK_FPS * speedK, HERO_WALK_FPS, HERO_WALK_FPS_MAX);
    hero.animTime += dt * fps;
    const framesInRow = HERO_SPRITE_COLS;
    hero.animFrame =
      HERO_IDLE_FRAME + 1 + (Math.floor(hero.animTime) % (framesInRow - 1));
  } else {
    hero.animTime = 0;
    hero.animFrame = HERO_IDLE_FRAME;
  }

  // safety
  if (!isWalkable(hero.x, hero.y)) {
    const safe = findNearestWalkable(hero.x, hero.y, 60);
    if (safe.ok) {
      hero.x = safe.x;
      hero.y = safe.y;
      hero.targetX = safe.x;
      hero.targetY = safe.y;
    } else {
      hero.targetX = hero.x;
      hero.targetY = hero.y;
    }
  }
}
