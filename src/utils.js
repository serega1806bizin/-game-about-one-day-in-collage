export function loadImage(src) {
  const img = new Image();
  img.src = src + (src.includes('?') ? '&' : '?') + 'v=' + Date.now();
  return img;
}
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const wrap  = (v, w)     => ((v % w) + w) % w;

export async function waitDecode(img) {
  if (img.decode) {
    try { await img.decode(); } catch {}
  } else {
    await new Promise(res => {
      if (img.complete && img.naturalWidth) return res();
      img.onload = res; img.onerror = res;
    });
  }
}
