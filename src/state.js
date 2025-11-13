import {
  DPR,
  HERO_SPEED,
  HERO_SPRITE_COLS,
  HERO_SPRITE_ROWS,
} from "./config.js";

export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d", { alpha: false });
export const flags = {
  talkedTo: { npc1: false },
};

export function loadFlags() {
  try {
    const raw = localStorage.getItem("gameFlags");
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved?.talkedTo)
        flags.talkedTo = { ...flags.talkedTo, ...saved.talkedTo };
    }
  } catch {}
}

export function saveFlags() {
  try {
    localStorage.setItem(
      "gameFlags",
      JSON.stringify({ talkedTo: flags.talkedTo })
    );
  } catch {}
}

export let viewW = 0,
  viewH = 0; // CSS px
export let worldW = 0,
  worldH = 0; // мировые px исходника
export let xScale = 1,
  yScale = 1; // экранных px на 1 мировой px

export const cam = { x: 0, y: 0 }; // левый верх камеры

export const hero = {
  x: 1250,
  y: 470,
  targetX: 1250,
  targetY: 470,
  speed: HERO_SPEED,
  img: null,
  w: 64,
  h: 64,
  anchorX: 0.5,
  anchorY: 0.9,

  // анимация
  animTime: 0,
  animFrame: 0,
  facingX: 1,
  srcW: 0,
  srcH: 0,
  row: 0,
  scale: 0.7,
};

// оффскрин навмаски
export const nav = {
  canvas: null,
  ctx: null,
  data: null,
  w: 0,
  h: 0,
};
// геттеры/сеттеры для размеров (чтобы не таскать DPR по коду)
export function resizeCanvasTo(viewWidth, viewHeight) {
  viewW = Math.floor(viewWidth);
  viewH = Math.floor(viewHeight);
  canvas.style.width = viewW + "px";
  canvas.style.height = viewH + "px";
  canvas.width = Math.floor(viewW * DPR);
  canvas.height = Math.floor(viewH * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

export function setWorldSize(w, h) {
  worldW = w;
  worldH = h;
}
export function setScale(xs, ys) {
  xScale = xs;
  yScale = ys;
}
