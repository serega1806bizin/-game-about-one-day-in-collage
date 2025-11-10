// npc.js
import { images } from './assets.js';
import { worldToScreen } from './camera.js';
import { ctx } from './state.js';

export const npc = {
  x: 680, // координати в сцені (підібери під свою карту)
  y: 475,
  frame: 0,
  animTime: 0,
  w: 0,
  h: 0,
  frameCount: 4, // скільки кадрів у спрайті
  fps: 4,
   scale: 2.0, 
};

export function initNpc() {
  const img = images.npc1;
  npc.w = img.naturalWidth / npc.frameCount;
  npc.h = img.naturalHeight;

}

export function updateNpc(dt) {
  npc.animTime += dt * npc.fps;
  npc.frame = Math.floor(npc.animTime) % npc.frameCount;
}

export function renderNpc() {
  const img = images.npc1;
  if (!img || !img.complete) return; // ← без цього може впасти

  const { x, y } = worldToScreen(npc.x, npc.y);
  const sx = npc.frame * npc.w;
  const sy = 0;

  ctx.drawImage(img, sx, sy, npc.w, npc.h, x - npc.w / 2, y - npc.h, npc.w, npc.h);
}

