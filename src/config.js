// ===== ФЛАГИ / НАСТРОЙКИ =====
export const ENABLE_WRAP_X = false;
export const CAM_SMOOTH = 0.08;
export const HERO_SPEED = 50;
export const FIT_HEIGHT_AND_TILE_X = true;
export const WALKABLE_THRESHOLD = 240;
export const SEEK_RADIUS_PX = 60;
export const DEBUG_SHOW_NAV = false;
export const DEBUG_SHOW_TARGET = true;
export const WALKABLE_MODE = 'brightness';

// ---- анимация героя ----
export const HERO_SPRITE_COLS = 8;
export const HERO_SPRITE_ROWS = 1;
export const HERO_IDLE_FRAME = 0;
export const HERO_WALK_FPS = 10;
export const HERO_WALK_FPS_MAX = 16;

// размер героя относительно экрана
export const HERO_VH = 0.18;     // 20% (было 2 — видимо опечатка), 0..1
export const HERO_MIN_PX = 0;
export const HERO_MAX_PX = 500;

// ---- розмір NPC відносно екрана ----
export const NPC_VH   = 0.18;   // 18% висоти екрана (підбери смак)
export const NPC_MIN_PX = 36;   // мінімальна висота у px
export const NPC_MAX_PX = 96;   // максимальна висота у px

// рендер
export const DPR = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
