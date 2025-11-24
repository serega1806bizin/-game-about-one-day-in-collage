// assets.js
import { loadImage, waitDecode } from "./utils.js";

export const carSprites = [
  loadImage("../Car.png"),
  loadImage("../Car2.png"),
];

// ВСЕ КАРТИНКИ СЦЕН И НАВМАСОК
export const images = {
  scene1: loadImage("../scene1.png"),
  nav1:   loadImage("../navmask.png"),

  scene2: loadImage("../scene2.png"),
  nav2:   loadImage("../navmask2.png"),

  // твои новые сцены
  scene3: loadImage("../scene3.png"),
  nav3:   loadImage("../navmask3.png"),

  scene4: loadImage("../scene4.png"),
  nav4:   loadImage("../navmask4.png"),

  scene5: loadImage("../scene5.png"),
  nav5:   loadImage("../navmask5.png"),

  hero:   loadImage("../hero.png"),
  choose: loadImage("../choose.png"),
  npc1:   loadImage("../npc1.png"),
  npc2: loadImage("../npc2.png"),
  npc3: loadImage("../npc3.png"),
  scene6: loadImage("../scene6.png"),
  nav6:   loadImage("../navmask6.png"),
  nav7:   loadImage("../navmask7.png"),
  scene7: loadImage("../scene7.png"),
  scene8: loadImage("../scene8.png"),
  nav8:   loadImage("../navmask8.png"),
  scene9: loadImage("../scene9.png"),
  nav9:   loadImage("../navmask9.png"),
  scene10: loadImage("../scene10.png"),
};

// «текущая» карта, з которой працюють камера / рендер / навмаска
images.scene = images.scene1;
images.nav   = images.nav1;

export async function loadAllAssets() {
  await Promise.all([
    waitDecode(images.scene1),
    waitDecode(images.nav1),
    waitDecode(images.scene2),
    waitDecode(images.nav2),
    waitDecode(images.scene3),
    waitDecode(images.nav3),
    waitDecode(images.scene4),
    waitDecode(images.nav4),
    waitDecode(images.scene5),
    waitDecode(images.nav5),
    waitDecode(images.hero),
    waitDecode(images.choose),
    waitDecode(images.npc1),
    waitDecode(images.npc3),
    waitDecode(images.scene6),
    waitDecode(images.nav6),
    waitDecode(images.nav7),
    waitDecode(images.scene7),
    waitDecode(images.scene8),
    waitDecode(images.nav8),
    waitDecode(images.scene9),
    waitDecode(images.nav9),
    waitDecode(images.scene10),

    ...carSprites.map((s) => waitDecode(s.img ? s.img : s)),
  ]);

  // диагностика машин, как и было
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
