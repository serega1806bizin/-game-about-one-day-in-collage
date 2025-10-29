import { WALKABLE_MODE, WALKABLE_THRESHOLD, SEEK_RADIUS_PX } from './config.js';
import { clamp } from './utils.js';
import { images } from './assets.js';
import { nav } from './state.js'; 
// чтобы обновить из другого модуля — экспортируем установщики
import * as S from './state.js';

export function prepareNavMask() {
  if (!images.nav || !images.nav.naturalWidth) return;

  nav.w = images.nav.naturalWidth;
  nav.h = images.nav.naturalHeight;

  nav.canvas = document.createElement('canvas');
  nav.canvas.width = nav.w;
  nav.canvas.height = nav.h;

  nav.ctx = nav.canvas.getContext('2d');
  nav.ctx.drawImage(images.nav, 0, 0);

  nav.data = nav.ctx.getImageData(0, 0, nav.w, nav.h).data;
}


export function isWalkable(wx, wy) {
  if (!nav.data) return false;

  const mx = Math.floor(clamp(wx, 0, nav.w - 1));
  const my = Math.floor(clamp(wy, 0, nav.h - 1));
  const idx = (my * nav.w + mx) * 4;
  const r = nav.data[idx], g = nav.data[idx + 1], b = nav.data[idx + 2], a = nav.data[idx + 3];

  if (WALKABLE_MODE === 'alpha') {
    return a >= WALKABLE_THRESHOLD;
  } else if (WALKABLE_MODE === 'combined') {
    const brightness = (r + g + b) / 3;
    const score = Math.max(brightness, a);
    return score >= WALKABLE_THRESHOLD;
  } else {
    const brightness = (r + g + b) / 3;
    return brightness >= WALKABLE_THRESHOLD;
  }
}

export function findNearestWalkable(wx, wy, radiusPx = SEEK_RADIUS_PX, step = 2) {
  if (isWalkable(wx, wy)) return { x: wx, y: wy, ok: true };

  for (let r = step; r <= radiusPx; r += step) {
    for (let x = wx - r; x <= wx + r; x += step) {
      if (isWalkable(x, wy - r)) return { x, y: wy - r, ok: true };
      if (isWalkable(x, wy + r)) return { x, y: wy + r, ok: true };
    }
    for (let y = wy - r + step; y <= wy + r - step; y += step) {
      if (isWalkable(wx - r, y)) return { x: wx - r, y, ok: true };
      if (isWalkable(wx + r, y)) return { x: wx + r, y, ok: true };
    }
  }
  return { x: wx, y: wy, ok: false };
}

export function projectTargetToWalkable(fromX, fromY, toX, toY, step = 3, maxSteps = 300) {
  let dx = toX - fromX, dy = toY - fromY;
  const len = Math.hypot(dx, dy) || 1;
  dx /= len; dy /= len;

  let x = toX, y = toY;
  for (let i = 0; i < maxSteps; i++) {
    if (isWalkable(x, y)) return { x, y, ok: true };
    x -= dx * step;
    y -= dy * step;
  }
  return findNearestWalkable(toX, toY, SEEK_RADIUS_PX);
}
