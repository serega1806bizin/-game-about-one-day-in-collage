// ==== флаги ====
const ENABLE_WRAP_X = false;              // заворачивать героя по X
const CAM_SMOOTH = 0.08;                  // плавность камеры (0..1)
const HERO_SPEED = 280;                   // px/s
const FIT_HEIGHT_AND_TILE_X = true;       // режим B: фон растягивается по высоте окна и тайлится по X
const WALKABLE_THRESHOLD = 200;           // порог яркости/альфы для проходимости маски (0..255)
const SEEK_RADIUS_PX = 40;                // радиус поиска ближайшей проходимой точки, если клик был вне дороги

// ==== канвас ====
const DPR = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d', { alpha: false });

let viewW = 0, viewH = 0;                 // размеры окна (экран, CSS-пиксели)
let worldW = 0, worldH = 0;               // размеры сцены (в мировых координатах = натуральные пиксели исходника)
let xScale = 1, yScale = 1;               // экранные пиксели на один мировой пиксель
const cam = { x: 0, y: 0 };               // левый верх камеры, в мировых координатах

// ==== герой ====
const hero = {
  x: 200, y: 200,
  targetX: 200, targetY: 200,
  speed: HERO_SPEED,
  img: null,
  w: 64, h: 64,
  anchorX: 0.5, anchorY: 0.9
};

// ==== картинки ====
const images = {
  scene: loadImage('scene.png'),
  hero:  loadImage('hero.png'),
  nav:   loadImage('navmask.png')   // навигационная маска (белое = можно идти)
};

// оффскрин для чтения пикселей маски
let navCanvas = null, navCtx = null, navData = null, navW = 0, navH = 0;

// ==== утилиты ====
function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function wrap(v, w)     { return ((v % w) + w) % w; }
function distance(ax, ay, bx, by) { return Math.hypot(bx - ax, by - ay); }

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
  // пересчёт масштабов зависит от режима; сами xScale/yScale зададим в boot(), когда узнаем размеры текстур
}

function worldToScreen(wx, wy) {
  // экранные координаты с учётом масштаба (для FIT режима обязательно)
  return { x: (wx - cam.x) * xScale, y: (wy - cam.y) * yScale };
}
function screenToWorld(sx, sy) {
  // обратное преобразование
  return { x: sx / xScale + cam.x, y: sy / yScale + cam.y };
}

// ==== навигационная маска (проверка проходимости) ====
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
  if (!navData) return true;

  const mx = Math.floor(clamp(wx, 0, navW - 1)); // было: wrap(wx, navW)
  const my = Math.floor(clamp(wy, 0, navH - 1));

  const idx = (my * navW + mx) * 4;
  const r = navData[idx], g = navData[idx + 1], b = navData[idx + 2], a = navData[idx + 3];
  const brightness = (r + g + b) / 3;
  const score = Math.max(brightness, a);
  return score >= WALKABLE_THRESHOLD;
}


// если кликнули в непроходимую точку — найдём ближайшую разрешённую
function findNearestWalkable(wx, wy, radiusPx = SEEK_RADIUS_PX, step = 2) {
  if (isWalkable(wx, wy)) return { x: wx, y: wy, ok: true };
  // спираль/кольца: пробуем точки по окружностям возрастающего радиуса
  for (let r = step; r <= radiusPx; r += step) {
    // обходим по квадрату, чтобы дешевле (достаточно)
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

// ==== ввод ====
canvas.addEventListener('pointerdown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const sx = e.clientX - rect.left;
  const sy = e.clientY - rect.top;
  let { x: wx, y: wy } = screenToWorld(sx, sy);

  // границы по Y: мы не тайлим вертикаль, потому ограничиваем реальной высотой мира
  const padX = hero.w * hero.anchorX;
  const padY = hero.h * hero.anchorY;
  wy = clamp(wy, padY, worldH - (hero.h - padY));

  // если кликаем в "вне дороги" — подвинем цель к ближайшей разрешённой точке
  const near = findNearestWalkable(wx, wy);
  hero.targetX = near.x;
  hero.targetY = near.y;
});

// ==== цикл ====
let last = performance.now();
function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

function update(dt) {
  // желаемый шаг героя
  const dx = hero.targetX - hero.x;
  const dy = hero.targetY - hero.y;
  const d = Math.hypot(dx, dy);

  if (d > 1) {
    const step = hero.speed * dt;
    const t = Math.min(1, step / d);
    const nextX = hero.x + dx * t;
    const nextY = hero.y + dy * t;

    // коллизии с дорогой: если прямой шаг нельзя — пробуем "скользить" по осям
    if (isWalkable(nextX, nextY)) {
      hero.x = nextX; hero.y = nextY;
    } else if (isWalkable(nextX, hero.y)) {
      hero.x = nextX;
    } else if (isWalkable(hero.x, nextY)) {
      hero.y = nextY;
    } else {
      // глухо — остановимся и сбросим цель на ближайшую валидную
      const near = findNearestWalkable(hero.x, hero.y);
      hero.targetX = near.x;
      hero.targetY = near.y;
    }
  }

  // опционально "заворачиваем" героя по X
  if (ENABLE_WRAP_X && worldW > 0) {
    hero.x = wrap(hero.x, worldW);
    hero.targetX = wrap(hero.targetX, worldW);
  }

  // камера: по X — бесконечная, по Y — в пределах мира
  const maxCamX = Math.max(0, worldW - (viewW / xScale));
  const desiredCamX = clamp(hero.x - (viewW / (2 * xScale)), 0, maxCamX);

  const maxCamY = Math.max(0, worldH - (viewH / yScale));
  const desiredCamY = clamp(hero.y - (viewH / (2 * yScale)), 0, maxCamY);

  cam.x += (desiredCamX - cam.x) * CAM_SMOOTH;
  cam.y += (desiredCamY - cam.y) * CAM_SMOOTH;
}

function render() {
  ctx.clearRect(0, 0, viewW, viewH);

  if (images.scene.complete && images.scene.naturalWidth) {
    const tex = images.scene;
    const texW = tex.naturalWidth;
    const texH = tex.naturalHeight;

    if (FIT_HEIGHT_AND_TILE_X) {
      // РЕЖИМ: растягиваем по высоте, НО НЕ ТАЙЛИМ по X
      const scaledW = texW * xScale;     // xScale === yScale в этом режиме
      const offsetX = -cam.x * xScale;   // камера в мировых, на экран умножаем масштаб
      ctx.drawImage(tex, 0, 0, texW, texH,
                    Math.round(offsetX), 0,
                    Math.ceil(scaledW), viewH);
    } else {
      // РЕЖИМ A: 1:1 по пикселям, вырезаем нужный прямоугольник без повторов
      const sx = Math.floor(clamp(cam.x, 0, Math.max(0, texW - (viewW / xScale))));
      const sy = Math.floor(clamp(cam.y, 0, Math.max(0, texH - (viewH / yScale))));
      const sw = Math.min(Math.floor(viewW / xScale), texW);
      const sh = Math.min(Math.floor(viewH / yScale), texH);

      ctx.drawImage(
        tex,
        sx, sy, sw, sh,
        0, 0,
        Math.ceil(sw * xScale), Math.ceil(sh * yScale)
      );
    }
  } else {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, viewW, viewH);
  }

  // ---- герой (без изменений) ----
  if (hero.img && hero.img.complete && hero.img.naturalWidth) {
    const { x, y } = worldToScreen(hero.x, hero.y);
    const drawX = x - hero.w * hero.anchorX;
    const drawY = y - hero.h * hero.anchorY;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(hero.img, drawX, drawY, hero.w, hero.h);
  }
}

// ==== размер героя относительно экрана ====
const HERO_VH = 0.2;     // доля высоты окна: 0.12 = 12% высоты
const HERO_MIN_PX = 40;   // нижний порог в пикселях
const HERO_MAX_PX = 220;  // верхний порог в пикселях

function applyHeroSizeFromScreen() {
  // пропорции исходного спрайта
  const aspect = (images.hero.naturalWidth || 1) / (images.hero.naturalHeight || 1);

  // целевая высота = процент от высоты окна
  let targetH = Math.round(viewH * HERO_VH);

  // клампы на всякий случай (чтобы не был слишком мелким/огромным)
  targetH = clamp(targetH, HERO_MIN_PX, HERO_MAX_PX);

  hero.h = targetH;
  hero.w = Math.round(targetH * aspect);
}

// ==== запуск ====
async function boot() {
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    // пересчёт масштабов при ресайзе окна
    recomputeScales();
     applyHeroSizeFromScreen();
  });

  await Promise.all([waitDecode(images.scene), waitDecode(images.hero), waitDecode(images.nav)]);

  // размеры мира по исходнику
  worldW = images.scene.naturalWidth;
  worldH = images.scene.naturalHeight;

  // подготовим маску
  prepareNavMask();

  // масштабирование (important: задаём xScale/yScale ОДИН раз и при ресайзе)
  recomputeScales();

  // размер героя (экранный — фиксированный в px; мировые координаты не меняем)
  hero.img = images.hero;
  hero.img = images.hero;
applyHeroSizeFromScreen();

  // стартовая камера
  cam.x = hero.x - (viewW / (2 * xScale));
  cam.y = clamp(hero.y - (viewH / (2 * yScale)), 0, Math.max(0, worldH - (viewH / yScale)));

  requestAnimationFrame(loop);
}

function recomputeScales() {
  if (!images.scene.naturalWidth) return;

  if (FIT_HEIGHT_AND_TILE_X) {
    // фон растянут по высоте окна => единица мира по Y соответствует viewH/texH экранных пикселей
    yScale = viewH / images.scene.naturalHeight;
    xScale = yScale; // сохраняем аспект
  } else {
    // режим A: один к одному (камера по Y — реальная)
    xScale = 1; yScale = 1;
  }
}

boot();
