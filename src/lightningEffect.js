// src/lightningEffect.js
const canvas = document.getElementById("lightningCanvas");

let ctx = null;
let width = 0;
let height = 0;
let bolts = [];
let flashStrength = 0;
let running = false;

if (canvas) {
  ctx = canvas.getContext("2d");
  setupSize();
  window.addEventListener("resize", setupSize);
}

function setupSize() {
  if (!canvas || !ctx) return;
  width = window.innerWidth;
  height = window.innerHeight;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// генерація однієї блискавки
function generateBolt(startX) {
  const lines = [];
  const baseLength = height * (0.7 + Math.random() * 0.2);

  function createBranch(x, y, length, branchChance, depth) {
    const points = [{ x, y }];
    let currentX = x;
    let currentY = y;
    const segments = Math.max(6, Math.floor(length / 18));

    for (let i = 0; i < segments; i++) {
      const sway =
        (Math.random() - 0.5) *
        (depth === 0 ? 60 : 35); // головний стовбур "гуляє" сильніше
      const step = (length / segments) * (0.8 + Math.random() * 0.4);

      const nextX = currentX + sway;
      const nextY = currentY + step;

      points.push({ x: nextX, y: nextY });

      // відгалуження
      if (depth < 2 && Math.random() < branchChance) {
        const branchLen = length * (0.35 + Math.random() * 0.3);
        createBranch(
          nextX,
          nextY,
          branchLen,
          branchChance * 0.5,
          depth + 1
        );
      }

      currentX = nextX;
      currentY = nextY;

      if (currentY > height) break;
    }

    lines.push(points);
  }

  const x = typeof startX === "number" ? startX : width * 0.5;
  createBranch(x, 0, baseLength, 0.4, 0);

  return {
    lines,
    life: 0,
    maxLife: 22 + Math.random() * 15,
  };
}

function drawBolts() {
  if (!ctx) return;

  for (let i = bolts.length - 1; i >= 0; i--) {
    const bolt = bolts[i];
    bolt.life++;

    if (bolt.life > bolt.maxLife) {
      bolts.splice(i, 1);
      continue;
    }

    const t = bolt.life / bolt.maxLife;
    let intensity = (1 - t) * (1 - t);
    intensity *= 0.8 + Math.random() * 0.4;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const lineWidth = 1.5 + 3.5 * intensity;
    ctx.lineWidth = lineWidth;

    ctx.shadowBlur = 20 + 45 * intensity;
    ctx.shadowColor = "rgba(210,235,255,1)";

    const alpha = 0.4 + 0.6 * intensity;
    ctx.strokeStyle = `rgba(210,235,255,${alpha})`;

    for (const line of bolt.lines) {
      if (!line.length) continue;
      ctx.beginPath();
      ctx.moveTo(line[0].x, line[0].y);
      for (let j = 1; j < line.length; j++) {
        ctx.lineTo(line[j].x, line[j].y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }
}

function drawFlash() {
  if (!ctx) return;
  if (flashStrength <= 0.01) {
    flashStrength = 0;
    return;
  }

  const alpha = flashStrength * 0.6;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  flashStrength *= 0.86;
}

function loop() {
  if (!running || !ctx) return;

  ctx.clearRect(0, 0, width, height);
  drawBolts();
  drawFlash();

  if (bolts.length === 0 && flashStrength <= 0.01) {
    running = false;
    ctx.clearRect(0, 0, width, height);
    return;
  }

  requestAnimationFrame(loop);
}

// 🔥 ПУБЛІЧНА ФУНКЦІЯ — ВИКЛИК МОЛНІЇ
export function triggerLightning(strikeX) {
  if (!canvas || !ctx) return;

  bolts.push(generateBolt(strikeX));
  flashStrength = 1.0;

  // легка вібрація, якщо доступна
  if ("vibrate" in navigator) {
    navigator.vibrate([80, 30, 120]);
  }

  if (!running) {
    running = true;
    requestAnimationFrame(loop);
  }
}
