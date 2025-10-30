import { images } from "./assets.js";
import { worldW } from "./state.js";
import { worldToScreen } from "./camera.js";

export const cars = [];

const LANE_Y = 555; 
const DIR = 1;
const MIN_S = 110,
  MAX_S = 180; 
const SPAWN_MIN = 4;
const SPAWN_MAX = 10; 
const MAX_CARS = 4; 
const MIN_GAP_PX = 220;

let nextSpawnIn = randSpawn();
function randSpawn() {
  return SPAWN_MIN + Math.random() * (SPAWN_MAX - SPAWN_MIN);
}

export function resetCars() {
  cars.length = 0;
  nextSpawnIn = randSpawn();
}

function canSpawnAt(x, w) {
  for (const c of cars) {
    if (c.dir !== DIR) continue;
    if (c.x > x && c.x - (x + w) < MIN_GAP_PX) return false;
  }
  return true;
}

function spawnCar() {
  if (cars.length >= MAX_CARS) return;

  const baseW = images.car.naturalWidth || 100;
  const baseH = images.car.naturalHeight || 40;
  const scale = 0.35;
  const w = Math.round(baseW * scale);
  const h = Math.round(baseH * scale);

  const x = -w - 40;
  if (!canSpawnAt(x, w)) return;

  cars.push({
    x,
    y: LANE_Y,
    w,
    h,
    dir: DIR,
    speed: MIN_S + Math.random() * (MAX_S - MIN_S),
  });
}

export function updateCars(dt, onHit) {
  if (images.car.complete) {
    nextSpawnIn -= dt;
    if (nextSpawnIn <= 0) {
      spawnCar();
      nextSpawnIn = randSpawn();
    }
  }

  for (let i = cars.length - 1; i >= 0; i--) {
    const c = cars[i];
    c.x += c.dir * c.speed * dt;

    if (c.x > worldW + c.w + 80) {
      cars.splice(i, 1);
      continue;
    }

    if (onHit && hitHero(c)) onHit();
  }
}

const LANE_HALF_THICKNESS = 14;

function hitHero(c) {
  const h = window.heroRef;
  if (!h) return false;

  const heroTopY = h.y - h.h * h.anchorY;
  const heroFeetY = heroTopY + h.h * 0.96;

  if (Math.abs(heroFeetY - c.y) > LANE_HALF_THICKNESS) {
    return false;
  }

  const hx1 = h.x - h.w * h.anchorX + h.w * 0.2;
  const hx2 = hx1 + h.w * 0.6;

  const cx1 = c.x + c.w * 0.05;
  const cx2 = c.x + c.w * 0.95;

  return !(hx2 < cx1 || hx1 > cx2);
}

export function renderCars(ctx) {
  if (!images.car.complete) return;
  for (const c of cars) {
    const { x, y } = worldToScreen(c.x, c.y);
    const drawX = Math.round(x);
    const drawY = Math.round(y - c.h);

    ctx.save();
    ctx.translate(drawX + c.w / 2, drawY + c.h / 2);
    ctx.scale(-1, 1);
    ctx.drawImage(images.car, -c.w / 2, -c.h / 2, c.w, c.h);
    ctx.restore();
  }
}
