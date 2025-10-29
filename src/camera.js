import { FIT_HEIGHT_AND_TILE_X, CAM_SMOOTH } from './config.js';
import { clamp } from './utils.js';
import { images } from './assets.js';
import { cam, viewW, viewH, worldW, worldH, xScale, yScale, setScale } from './state.js';

export function worldToScreen(wx, wy) {
  return { x: (wx - cam.x) * xScale, y: (wy - cam.y) * yScale };
}
export function screenToWorld(sx, sy) {
  return { x: sx / xScale + cam.x, y: sy / yScale + cam.y };
}

export function recomputeScales() {
  if (!images.scene.naturalWidth) return;
  if (FIT_HEIGHT_AND_TILE_X) {
    const ys = viewH / images.scene.naturalHeight;
    setScale(ys, ys);
  } else {
    setScale(1, 1);
  }
}

export function snapCameraToHero(hero) {
  const maxCamX = Math.max(0, worldW - (viewW / xScale));
  const maxCamY = Math.max(0, worldH - (viewH / yScale));
  cam.x = clamp(hero.x - (viewW / (2 * xScale)), 0, maxCamX);
  cam.y = clamp(hero.y - (viewH / (2 * yScale)), 0, maxCamY);
}

export function smoothFollow(hero) {
  const maxCamX = Math.max(0, worldW - (viewW / xScale));
  const maxCamY = Math.max(0, worldH - (viewH / yScale));
  const desiredCamX = clamp(hero.x - (viewW / (2 * xScale)), 0, maxCamX);
  const desiredCamY = clamp(hero.y - (viewH / (2 * yScale)), 0, maxCamY);
  cam.x += (desiredCamX - cam.x) * CAM_SMOOTH;
  cam.y += (desiredCamY - cam.y) * CAM_SMOOTH;
}
