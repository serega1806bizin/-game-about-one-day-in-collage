import { loadImage, waitDecode } from "./utils.js";

export const carSprites = [
  loadImage("../Car.png"),
  loadImage("../Car2.png"),
  // добавляй другие PNG тут
];

export const images = {
  scene: loadImage("../scene1.png"),
  nav: loadImage("../navmask.png"),
  scene2: loadImage("../scene2.png"),
  nav2: loadImage("../navmask2.png"),
  hero: loadImage("../hero.png"),
  choose: loadImage("../choose.png"),
  npc1: loadImage("../npc1.png"),
};



export async function loadAllAssets() {
  await Promise.all([
    waitDecode(images.scene),
    waitDecode(images.hero),
    waitDecode(images.nav),
    waitDecode(images.choose),
    ...carSprites.map((s) => waitDecode(s.img ? s.img : s)),
  ]);

  // диагностика
  const list = carSprites.map((s) => (s.img ? s.img : s));
  console.table(
    list.map((img) => ({
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    }))
  );
}
