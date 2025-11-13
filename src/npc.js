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

export const npc2 = {
  x: 1200,   // координати по сцені 2 (підбереш під себе)
  y: 490,
  w: 0,
  h: 0,
  img: null,
  scale: 40 // при потребі підправиш
};



// 1) ініціалізація після завантаження картинок
export function initNpc() {
  const img = images.npc1;
  if (!img || !img.naturalWidth) return;

  npc.srcW = Math.floor(img.naturalWidth / npc.frameCount);
  npc.srcH = img.naturalHeight;

  applyNpcSizeFromScreen(); // одразу підлаштувати під поточний екран
}

export function initNpc2() {
  const img = images.npc2;
  if (!img || !img.complete) return;

  npc2.img = img;

  const scale = 0.3; // розмір підбери — це коефіцієнт
  npc2.w = img.naturalWidth * scale;
  npc2.h = img.naturalHeight * scale;
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

export function renderNpc2() {
  if (!npc2.img) return;

  const { x, y } = worldToScreen(npc2.x, npc2.y);

  ctx.drawImage(
    npc2.img,
    Math.round(x - npc2.w / 2),
    Math.round(y - npc2.h),
    npc2.w,
    npc2.h
  );
}

// === NPC3 (статичный) ===
export const npc3 = {
  x: 320,    // СТАВИМ ПРЯМО НА ГЕРОЯ ДЛЯ ПРОВЕРКИ
  y: 475,
  w: 0,
  h: 0,
  img: null,
  scale: 0.25,
};

export function initNpc3() {
  const img = images.npc3;
  console.log("NPC3 IMG =", img);

  if (!img || !img.complete || img.naturalWidth === 0) {
    console.log("❌ NPC3 image NOT ready");
    return;
  }

  npc3.img = img;
  npc3.w = img.naturalWidth * npc3.scale;
  npc3.h = img.naturalHeight * npc3.scale;

  console.log("✅ NPC3 initialized", npc3.w, npc3.h);
}

export function renderNpc3() {
  if (!npc3.img) {
    console.log("❌ NPC3 no IMG, cancel render");
    return;
  }

  const { x, y } = worldToScreen(npc3.x, npc3.y);

  ctx.drawImage(
    npc3.img,
    x - npc3.w / 2,
    y - npc3.h,
    npc3.w,
    npc3.h
  );
}
