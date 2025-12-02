// ===============================
//   SUPER BEAUTIFUL CONFETTI
// ===============================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let canvas, ctx, W, H, dpi;
let pieces = [];
const colors = ['#7c3aed','#22d3ee','#f59e0b','#ef4444','#84cc16','#e879f9'];

function resizeConfetti() {
  dpi = window.devicePixelRatio || 1;
  W = canvas.width = Math.floor(innerWidth * dpi);
  H = canvas.height = Math.floor(innerHeight * dpi);
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnBurst(cx, cy, count = 220) {
  for (let i = 0; i < count; i++) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(2, 6) * dpi;

    pieces.push({
      x: cx * dpi,
      y: cy * dpi,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - rand(3, 7) * dpi,
      g: rand(0.05, .18) * dpi,
      w: rand(6, 14) * dpi,
      h: rand(8, 20) * dpi,
      r: rand(0, Math.PI * 2),
      dr: rand(-0.2, 0.2),
      c: colors[(Math.random() * colors.length) | 0],
      life: rand(120, 220)
    });
  }
}

function startDrizzle() {
  for (let i = 0; i < 80; i++) {
    pieces.push({
      x: rand(0, W),
      y: rand(-H, 0),
      vx: rand(-0.5, 0.5),
      vy: rand(1.5, 3),
      g: rand(0.02, 0.06),
      w: rand(4, 10),
      h: rand(6, 14),
      r: rand(0, 6.28),
      dr: rand(-0.05, 0.05),
      c: colors[(Math.random() * colors.length) | 0],
      life: rand(200, 420)
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  for (let i = pieces.length - 1; i >= 0; i--) {
    const p = pieces[i];

    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.dr;

    if (p.y > H + 40 || p.life-- < 0) {
      pieces.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }

  requestAnimationFrame(draw);
}

// ===============================
//   ПУБЛІЧНА ФУНКЦІЯ ДЛЯ ВИКЛИКУ
// ===============================
export function triggerSuperConfetti() {
  if (prefersReducedMotion) return;

  if (!canvas) {
    canvas = document.getElementById('confetti');
    ctx = canvas.getContext('2d');
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);
    requestAnimationFrame(draw);
  }

  // великий вибух з центру екрана
  spawnBurst(innerWidth / 2, innerHeight * 0.35, 220);

  // легкий дощ зверху
  startDrizzle();
}
