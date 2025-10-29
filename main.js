// ====================== ФЛАГИ / НАСТРОЙКИ ======================
const ENABLE_WRAP_X = false;              // заворачивать героя по X
const CAM_SMOOTH = 0.08;                  // плавность камеры (0..1)
const HERO_SPEED = 50;                   // px/s
const FIT_HEIGHT_AND_TILE_X = true;       // фон растягивается по высоте окна (НЕ тайлится)
const WALKABLE_THRESHOLD = 240;           // !!! яркость >= 240 -> проходимо
const SEEK_RADIUS_PX = 60;                // радиус поиска ближайшей проходимой точки
const DEBUG_SHOW_NAV = false;             // показать маску поверх сцены
const DEBUG_SHOW_TARGET = true;           // показать кружок цели
const WALKABLE_MODE = 'brightness';       // проверяем яркость

// ---- анимация героя ----
const HERO_SPRITE_COLS = 8;   // количество кадров в РЯДУ hero.png
const HERO_SPRITE_ROWS = 1;   // рядов в hero.png (для 1-направления оставь 1)
const HERO_IDLE_FRAME = 0;    // индекс кадра простоя
const HERO_WALK_FPS = 10;     // базовая скорость анимации
const HERO_WALK_FPS_MAX = 16; // верхняя граница FPS при большом HERO_SPEED

// размер героя относительно экрана
const HERO_VH = 2;     // 20% высоты экрана
const HERO_MIN_PX = 40;
const HERO_MAX_PX = 100;


// ====================== КАНВАС ======================
const DPR = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d', { alpha: false });

let viewW = 0, viewH = 0;                 // размеры окна (CSS px)
let worldW = 0, worldH = 0;               // размеры сцены (в мировых px исходника)
let xScale = 1, yScale = 1;               // экранных px на 1 мировой px
const cam = { x: 0, y: 0 };               // левый верх камеры (мировые координаты)

// ====================== ГЕРОЙ ======================
const hero = {
  x: 1250, y: 470,
  targetX: 1250, targetY: 470,
  speed: HERO_SPEED,
  img: null,
  w: 64, h: 64,
  anchorX: 0.5, anchorY: 0.9,

  // --- анимация ---
  animTime: 0,
  animFrame: 0,
  facingX: 1,        // 1 = вправо, -1 = влево (зеркалирование по X)
  srcW: 0,           // ширина одного кадра в hero.png
  srcH: 0,           // высота одного кадра в hero.png
  row: 0             // номер ряда (на случай многонаправленного спрайта)
};

// ====================== ИЗОБРАЖЕНИЯ ======================
const images = {
  scene: loadImage('scene.png'),
  hero:  loadImage('hero.png'),
  nav:   loadImage('navmask.png')
};

// оффскрин для чтения пикселей маски
let navCanvas = null, navCtx = null, navData = null, navW = 0, navH = 0;

// ====================== УТИЛИТЫ ======================
function loadImage(src) {
  // анти-кэш, чтобы точно подхватилось актуальное изображение
  const img = new Image();
  img.src = src + (src.includes('?') ? '&' : '?') + 'v=' + Date.now();
  return img;
}
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function wrap(v, w)     { return ((v % w) + w) % w; }

async function waitDecode(img) {
  if (img.decode) {
    try { await img.decode(); } catch {}
  } else {
    await new Promise(res => {
      if (img.complete && img.naturalWidth) return res();
      img.onload = res; img.onerror = res;
    });
  }
}

function resizeCanvas() {
  viewW = Math.floor(window.innerWidth);
  viewH = Math.floor(window.innerHeight);
  canvas.style.width = viewW + 'px';
  canvas.style.height = viewH + 'px';
  canvas.width = Math.floor(viewW * DPR);
  canvas.height = Math.floor(viewH * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function worldToScreen(wx, wy) {
  return { x: (wx - cam.x) * xScale, y: (wy - cam.y) * yScale };
}
function screenToWorld(sx, sy) {
  return { x: sx / xScale + cam.x, y: sy / yScale + cam.y };
}

// ====================== МАСКА ПРОХОДИМОСТИ ======================
function prepareNavMask() {
  if (!images.nav || !images.nav.naturalWidth) return;
  navW = images.nav.naturalWidth;
  navH = images.nav.naturalHeight;
  navCanvas = document.createElement('canvas');
  navCanvas.width = navW;
  navCanvas.height = navH;
  navCtx = navCanvas.getContext('2d');
  navCtx.drawImage(images.nav, 0, 0);
  navData = navCtx.getImageData(0, 0, navW, navH).data;
}

function isWalkable(wx, wy) {
  if (!navData) return false; // маски нет — всё запрещено

  const mx = Math.floor(clamp(wx, 0, navW - 1));
  const my = Math.floor(clamp(wy, 0, navH - 1));
  const idx = (my * navW + mx) * 4;
  const r = navData[idx], g = navData[idx + 1], b = navData[idx + 2], a = navData[idx + 3];

  if (WALKABLE_MODE === 'alpha') {
    return a >= WALKABLE_THRESHOLD;
  } else if (WALKABLE_MODE === 'combined') {
    const brightness = (r + g + b) / 3;
    const score = Math.max(brightness, a);
    return score >= WALKABLE_THRESHOLD;
  } else { // 'brightness'
    const brightness = (r + g + b) / 3;
    return brightness >= WALKABLE_THRESHOLD;
  }
}

// поиск ближайшей проходимой точки (кольца)
function findNearestWalkable(wx, wy, radiusPx = SEEK_RADIUS_PX, step = 2) {
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

// проекция цели вдоль прямой (от клика к герою)
function projectTargetToWalkable(fromX, fromY, toX, toY, step = 3, maxSteps = 300) {
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

// ====================== ВВОД ======================
canvas.addEventListener('pointerdown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const sx = e.clientX - rect.left;
  const sy = e.clientY - rect.top;
  let { x: wx, y: wy } = screenToWorld(sx, sy);

  // ограничение по Y реальной высотой мира (фон не тайлится по Y)
  const padY = hero.h * hero.anchorY;
  wy = clamp(wy, padY, worldH - (hero.h - padY));

  // ЖЁСТКО: ставим цель ТОЛЬКО если нашли проходимую точку
  const snapped = projectTargetToWalkable(hero.x, hero.y, wx, wy);
  if (snapped.ok) {
    hero.targetX = snapped.x;
    hero.targetY = snapped.y;
  } else {
    console.log('🚫 Клик вне дороги — цель не поменяна');
  }
});

// ====================== ЦИКЛ ======================
let last = performance.now();
function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

function update(dt) {
  const dx = hero.targetX - hero.x;
  const dy = hero.targetY - hero.y;
  const d = Math.hypot(dx, dy);

  if (d > 1) {
    const step = hero.speed * dt;
    const t = Math.min(1, step / d);
    const nextX = hero.x + dx * t;
    const nextY = hero.y + dy * t;

    // коллизии: не выходим за маску
    if (isWalkable(nextX, nextY)) {
      hero.x = nextX; hero.y = nextY;
    } else if (isWalkable(nextX, hero.y)) {
      hero.x = nextX;
    } else if (isWalkable(hero.x, nextY)) {
      hero.y = nextY;
    } else {
      // тупик — стопаем цель
      hero.targetX = hero.x;
      hero.targetY = hero.y;
    }
  }

  // -------- анимация --------
  const moving = d > 1;
  if (moving) {
    // разворот по X
    if (Math.abs(dx) > 0.0001) hero.facingX = Math.sign(dx);

    // подстраиваем fps от скорости
    const speedK = clamp(hero.speed / 280, 0.7, 1.3); // 280 — базовый HERO_SPEED
    const fps = clamp(HERO_WALK_FPS * speedK, HERO_WALK_FPS, HERO_WALK_FPS_MAX);

    hero.animTime += dt * fps;
    const framesInRow = HERO_SPRITE_COLS;
    // кадр 0 — idle, ходьба по кадрам 1..framesInRow-1
    hero.animFrame = HERO_IDLE_FRAME + 1 + (Math.floor(hero.animTime) % (framesInRow - 1));
  } else {
    hero.animTime = 0;
    hero.animFrame = HERO_IDLE_FRAME;
  }

  // safety: если вдруг оказались вне белой зоны — вернём ближайшую
  if (!isWalkable(hero.x, hero.y)) {
    const safe = findNearestWalkable(hero.x, hero.y, 60);
    if (safe.ok) {
      hero.x = safe.x; hero.y = safe.y;
      hero.targetX = safe.x; hero.targetY = safe.y;
    } else {
      hero.targetX = hero.x;
      hero.targetY = hero.y;
    }
  }

  // заворачивание по X (отключено)
  if (ENABLE_WRAP_X && worldW > 0) {
    hero.x = wrap(hero.x, worldW);
    hero.targetX = wrap(hero.targetX, worldW);
  }

  // камера в пределах мира по X и Y
  const maxCamX = Math.max(0, worldW - (viewW / xScale));
  const maxCamY = Math.max(0, worldH - (viewH / yScale));
  const desiredCamX = clamp(hero.x - (viewW / (2 * xScale)), 0, maxCamX);
  const desiredCamY = clamp(hero.y - (viewH / (2 * yScale)), 0, maxCamY);
  cam.x += (desiredCamX - cam.x) * CAM_SMOOTH;
  cam.y += (desiredCamY - cam.y) * CAM_SMOOTH;
}

// ====================== РЕНДЕР ======================
function render() {
  ctx.clearRect(0, 0, viewW, viewH);

  // фон — одна картинка, без тайлинга
  if (images.scene.complete && images.scene.naturalWidth) {
    const tex = images.scene;
    const texW = tex.naturalWidth;
    const texH = tex.naturalHeight;

    if (FIT_HEIGHT_AND_TILE_X) {
      const scaledW = texW * xScale;     // xScale === yScale
      const offsetX = -cam.x * xScale;
      ctx.drawImage(tex, 0, 0, texW, texH,
                    Math.round(offsetX), 0,
                    Math.ceil(scaledW), viewH);
    } else {
      const sx = Math.floor(clamp(cam.x, 0, Math.max(0, texW - (viewW / xScale))));
      const sy = Math.floor(clamp(cam.y, 0, Math.max(0, texH - (viewH / yScale))));
      const sw = Math.min(Math.floor(viewW / xScale), texW);
      const sh = Math.min(Math.floor(viewH / yScale), texH);
      ctx.drawImage(tex, sx, sy, sw, sh, 0, 0, Math.ceil(sw * xScale), Math.ceil(sh * yScale));
    }
  } else {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, viewW, viewH);
  }

  // DEBUG: показать маску поверх сцены
  if (DEBUG_SHOW_NAV && navCanvas) {
    const sx = Math.floor(clamp(cam.x, 0, Math.max(0, navW - (viewW / xScale))));
    const sy = Math.floor(clamp(cam.y, 0, Math.max(0, navH - (viewH / yScale))));
    const sw = Math.min(Math.floor(viewW / xScale), navW);
    const sh = Math.min(Math.floor(viewH / yScale), navH);
    ctx.globalAlpha = 0.3;
    ctx.drawImage(navCanvas, sx, sy, sw, sh, 0, 0, Math.ceil(sw * xScale), Math.ceil(sh * yScale));
    ctx.globalAlpha = 1.0;
  }

  // герой (рисуем ТЕКУЩИЙ КАДР из спрайт-листа с учётом разворота по X)
  if (hero.img && hero.img.complete && hero.img.naturalWidth) {
    const { x, y } = worldToScreen(hero.x, hero.y);
    const drawX = Math.round(x - hero.w * hero.anchorX);
    const drawY = Math.round(y - hero.h * hero.anchorY);

    const sx = hero.animFrame * hero.srcW;
    const sy = hero.row * hero.srcH;
    const sw = hero.srcW;
    const sh = hero.srcH;

    ctx.imageSmoothingEnabled = true;

    if (hero.facingX >= 0) {
      ctx.drawImage(hero.img, sx, sy, sw, sh, drawX, drawY, hero.w, hero.h);
    } else {
      ctx.save();
      ctx.translate(drawX + hero.w / 2, drawY + hero.h / 2);
      ctx.scale(-1, 1);
      ctx.drawImage(hero.img, sx, sy, sw, sh, -hero.w / 2, -hero.h / 2, hero.w, hero.h);
      ctx.restore();
    }
  }

  // DEBUG: цель
  if (DEBUG_SHOW_TARGET) {
    const tx = worldToScreen(hero.targetX, hero.targetY);
    ctx.beginPath();
    ctx.arc(tx.x, tx.y, 6, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = isWalkable(hero.targetX, hero.targetY) ? '#31d158' : '#ff3b3b';
    ctx.stroke();
  }
}

// ====================== РАЗМЕР ГЕРОЯ ОТ ЭКРАНА ======================
function applyHeroSizeFromScreen() {
  // размеры ОДНОГО кадра в спрайте
  const frameW = (images.hero.naturalWidth  || 1) / HERO_SPRITE_COLS;
  const frameH = (images.hero.naturalHeight || 1) / HERO_SPRITE_ROWS;
  const aspect = frameW / frameH;

  let targetH = Math.round(viewH * HERO_VH);
  targetH = clamp(targetH, HERO_MIN_PX, HERO_MAX_PX);

  hero.h = targetH;
  hero.w = Math.round(targetH * aspect);
}

// ====================== ЗАПУСК ======================
async function boot() {
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    recomputeScales();
    applyHeroSizeFromScreen();
  });

  await Promise.all([waitDecode(images.scene), waitDecode(images.hero), waitDecode(images.nav)]);

  // размеры мира по исходнику
  worldW = images.scene.naturalWidth;
  worldH = images.scene.naturalHeight;

  // подготовим маску
  prepareNavMask();

  // масштабирование (xScale/yScale)
  recomputeScales();

  // размер героя и подготовка анимации

  hero.img = images.hero;
  hero.srcW = Math.floor(images.hero.naturalWidth  / HERO_SPRITE_COLS);
  hero.srcH = Math.floor(images.hero.naturalHeight / HERO_SPRITE_ROWS);
  applyHeroSizeFromScreen(); // <-- после srcW/srcH


  // стартовая камера — сразу к герою и в пределах мира
  const maxCamX = Math.max(0, worldW - (viewW / xScale));
  const maxCamY = Math.max(0, worldH - (viewH / yScale));
  cam.x = clamp(hero.x - (viewW / (2 * xScale)), 0, maxCamX);
  cam.y = clamp(hero.y - (viewH / (2 * yScale)), 0, maxCamY);

  requestAnimationFrame(loop);
}

function recomputeScales() {
  if (!images.scene.naturalWidth) return;
  if (FIT_HEIGHT_AND_TILE_X) {
    yScale = viewH / images.scene.naturalHeight;
    xScale = yScale; // сохраняем аспект
  } else {
    xScale = 1; yScale = 1;
  }
}

boot();
