import {
  DEBUG_SHOW_NAV,
  DEBUG_SHOW_TARGET,
  FIT_HEIGHT_AND_TILE_X,
} from "./config.js";
import { ctx, viewW, viewH, cam, xScale, yScale } from "./state.js";
import { images } from "./assets.js";
import { clamp } from "./utils.js";
import { worldToScreen } from "./camera.js";
import { isWalkable } from "./navmask.js";
import { nav } from "./state.js";
import { renderCars } from "./cars.js";
import { renderNpc } from "./npc.js";
import { getCurrentScene } from "./sceneManager.js";

export function render(hero) {
  ctx.clearRect(0, 0, viewW, viewH);

  // фон
  if (images.scene.complete && images.scene.naturalWidth) {
    const tex = images.scene;
    const texW = tex.naturalWidth;
    const texH = tex.naturalHeight;

    if (FIT_HEIGHT_AND_TILE_X) {
      const scaledW = texW * xScale;
      const offsetX = -cam.x * xScale;
      ctx.drawImage(
        tex,
        0,
        0,
        texW,
        texH,
        Math.round(offsetX),
        0,
        Math.ceil(scaledW),
        viewH
      );
    } else {
      const sx = Math.floor(
        clamp(cam.x, 0, Math.max(0, texW - viewW / xScale))
      );
      const sy = Math.floor(
        clamp(cam.y, 0, Math.max(0, texH - viewH / yScale))
      );
      const sw = Math.min(Math.floor(viewW / xScale), texW);
      const sh = Math.min(Math.floor(viewH / yScale), texH);
      ctx.drawImage(
        tex,
        sx,
        sy,
        sw,
        sh,
        0,
        0,
        Math.ceil(sw * xScale),
        Math.ceil(sh * yScale)
      );
    }
  } else {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, viewW, viewH);
  }

  // NPC — рисуем только на сцене 1
  if (getCurrentScene() === 1) {
    renderNpc();
  }

  // DEBUG: маска прохідності
  if (DEBUG_SHOW_NAV && nav.canvas) {
    const sx = Math.floor(clamp(cam.x, 0, Math.max(0, nav.w - viewW / xScale)));
    const sy = Math.floor(clamp(cam.y, 0, Math.max(0, nav.h - viewH / yScale)));
    const sw = Math.min(Math.floor(viewW / xScale), nav.w);
    const sh = Math.min(Math.floor(viewH / yScale), nav.h);
    ctx.globalAlpha = 0.3;
    ctx.drawImage(
      nav.canvas,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      Math.ceil(sw * xScale),
      Math.ceil(sh * yScale)
    );
    ctx.globalAlpha = 1.0;
  }

  // герой
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
      ctx.drawImage(
        hero.img,
        sx,
        sy,
        sw,
        sh,
        -hero.w / 2,
        -hero.h / 2,
        hero.w,
        hero.h
      );
      ctx.restore();
    }
  }

  // Машины — тоже только на сцене 1
  if (getCurrentScene() === 1) {
    renderCars(ctx);
  }

  // DEBUG: цель героя
  if (DEBUG_SHOW_TARGET) {
    const tx = worldToScreen(hero.targetX, hero.targetY);
    ctx.beginPath();
    ctx.arc(tx.x, tx.y, 6, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = isWalkable(hero.targetX, hero.targetY)
      ? "#31d158"
      : "#ff3b3b";
    ctx.stroke();
  }
}
