// assets.js
import { loadImage, waitDecode } from "./utils.js";

export const carSprites = [
  loadImage("img/Car.png"),
  loadImage("img/Car2.png"),
];

// ВСЕ КАРТИНКИ СЦЕН И НАВМАСОК
export const images = {
  scene1: loadImage("img/scene1.png"),
  nav1:   loadImage("img/navmask.png"),

  scene2: loadImage("img/scene2.png"),
  nav2:   loadImage("img/navmask2.png"),

  // твои новые сцены
  scene3: loadImage("img/scene3.png"),
  nav3:   loadImage("img/navmask3.png"),

  scene4: loadImage("img/scene4.png"),
  nav4:   loadImage("img/navmask4.png"),

  scene5: loadImage("img/scene5.png"),
  nav5:   loadImage("img/navmask5.png"),

  hero:   loadImage("img/hero.png"),
  choose: loadImage("img/choose.png"),

  npc1:   loadImage("img/npc1.png"),
  npc2: loadImage("img/npc2.png"),
  npc3: loadImage("img/npc3.png"),

  lera: loadImage("img/lera.png"),
  eva: loadImage("img/eva.png"),
  serhii: loadImage("img/serhii.png"),
  scene6: loadImage("img/scene6.png"),
  nav6:   loadImage("img/navmask6.png"),
  nav7:   loadImage("img/navmask7.png"),
  scene7: loadImage("img/scene7.png"),
  scene8: loadImage("img/scene8.png"),
  nav8:   loadImage("img/navmask8.png"),
  scene9: loadImage("img/scene9.png"),
  nav9:   loadImage("img/navmask9.png"),
  scene10: loadImage("img/scene10.png"),
  scene11: loadImage("img/scene11.png"),
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
    waitDecode(images.scene11),

    waitDecode(images.serhii),
    waitDecode(images.eva),
    waitDecode(images.lera),

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
