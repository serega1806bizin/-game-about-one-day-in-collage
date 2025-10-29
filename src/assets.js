import { loadImage, waitDecode } from './utils.js';

export const images = {
  scene: loadImage('../scene.png'),
  hero:  loadImage('../hero.png'),
  nav:   loadImage('../navmask.png'),
};

export async function loadAllAssets() {
  await Promise.all([waitDecode(images.scene), waitDecode(images.hero), waitDecode(images.nav)]);
}
