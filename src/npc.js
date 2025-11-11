// npc.js
import { images } from './assets.js';
import { worldToScreen } from './camera.js';
import { ctx, viewH } from './state.js';
import { clamp } from './utils.js';
import { NPC_VH, NPC_MIN_PX, NPC_MAX_PX } from './config.js';

export const npc = {
  x: 680,
  y: 475,
  frame: 0,
  animTime: 0,
  // вихідні (джерельні) розміри кадра спрайта:
  srcW: 0,
  srcH: 0,
  // екранні (призначення drawImage destW/destH):
  w: 0,
  h: 0,
  frameCount: 4,
  fps: 4,
};

// 1) ініціалізація після завантаження картинок
export function initNpc() {
  const img = images.npc1;
  if (!img || !img.naturalWidth) return;

  npc.srcW = Math.floor(img.naturalWidth / npc.frameCount);
  npc.srcH = img.naturalHeight;

  applyNpcSizeFromScreen(); // одразу підлаштувати під поточний екран
}

// 2) перерахунок адаптивного розміру (викликаємо на resize)
export function applyNpcSizeFromScreen() {
  // цільова висота — частка від висоти вікна, але в межах MIN..MAX
  let targetH = Math.round(viewH * NPC_VH);
  targetH = clamp(targetH, NPC_MIN_PX, NPC_MAX_PX);

  const aspect = npc.srcW > 0 ? npc.srcW / npc.srcH : 1;
  npc.h = targetH;
  npc.w = Math.round(targetH * aspect);
}

// 3) оновлення анімації
export function updateNpc(dt) {
  npc.animTime += dt * npc.fps;
  npc.frame = Math.floor(npc.animTime) % npc.frameCount;
}

// 4) рендер
export function renderNpc() {
  const img = images.npc1;
  if (!img || !img.complete || npc.srcW === 0) return;

  const { x, y } = worldToScreen(npc.x, npc.y);
  const sx = npc.frame * npc.srcW;
  const sy = 0;

  // центр по X, низ по Y
  ctx.drawImage(img, sx, sy, npc.srcW, npc.srcH,
    Math.round(x - npc.w / 2), Math.round(y - npc.h),
    npc.w, npc.h);
}
