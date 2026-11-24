// Art-Deco pastel hotels, resorts, balconies, awnings & rooftop signs
import { getDistrictAt } from './districts.js';
import { ROAD_X, ROAD_Z } from './roads.js';

const HOTEL_BRANDS = ['HOTEL SOLANA', 'CORAL PALMS', 'MARINA CLUB', 'SOLANA ROYALE', 'DELFIN DORADO', 'PALMA CASINO', 'CLUB MIRADOR', 'STARLIGHT CLUB'];
const mkTex = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d')); return new window.THREE.CanvasTexture(c); };

function createWindowFacadeTexture(topHex, botHex, trimHex, awnHex) {
 const tex = mkTex(128, 256, (c) => {
  const g = c.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, topHex); g.addColorStop(1, botHex);
  c.fillStyle = g; c.fillRect(0, 0, 128, 256);
  c.fillStyle = 'rgba(255,255,255,.75)'; c.fillRect(5, 0, 9, 256); c.fillRect(58, 0, 12, 256); c.fillRect(114, 0, 9, 256);
  for (let y = 26; y < 228; y += 22) {
   c.fillStyle = '#fff'; c.fillRect(12, y + 12, 46, 3); c.fillRect(70, y + 12, 46, 3);
   for (let x = 18; x < 106; x += 20) if (x !== 58) {
    c.fillStyle = (x * 13 + y * 7) % 5 === 0 ? '#ffe9a6' : '#1b6d96'; c.fillRect(x, y, 14, 11);
    c.fillStyle = trimHex; c.fillRect(x - 1, y - 2, 16, 2.5);
   }
  }
  c.fillStyle = awnHex; c.fillRect(0, 232, 128, 12);
  c.fillStyle = '#fff'; for (let ax = 4; ax < 128; ax += 16) c.fillRect(ax, 232, 7, 12);
  c.fillStyle = trimHex; c.fillRect(0, 10, 128, 6); c.fillStyle = '#fff'; c.fillRect(0, 16, 128, 3);
 });
 tex.wrapS = tex.wrapT = window.THREE.RepeatWrapping; return tex;
}

const createNeonSignTexture = (text, bgHex, borderHex) => mkTex(256, 64, (c) => {
 c.fillStyle = bgHex; c.fillRect(0, 0, 256, 64); c.strokeStyle = borderHex; c.lineWidth = 6; c.strokeRect(4, 4, 248, 56);
 c.fillStyle = '#fff'; c.font = '900 24px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 128, 33);
});

export function buildCityBuildings(scene, rng) {
 const THREE = window.THREE, group = new THREE.Group(), colliders = [];
 const Std = (p) => new THREE.MeshStandardMaterial(p), Bas = (p) => new THREE.MeshBasicMaterial(p);
 const facades = [
  ['#f2dec0', '#dec29b', '#ff4d73', '#ff4d73'], ['#f598b2', '#e07292', '#00c4c7', '#e84870'],
  ['#7de0cc', '#56c2ad', '#ff6e38', '#00a396'], ['#f7b585', '#e38e56', '#0fa8b8', '#e85d2a'],
  ['#8dd0f5', '#64b2e0', '#ff4d73', '#1f78c4'], ['#f5d584', '#e0b858', '#ff4d73', '#e87b1e'],
 ].map((p) => createWindowFacadeTexture(...p));
 const crownCols = [0xff5a79, 0x00d8d6, 0xff9233, 0x2ec4b6, 0xff4d79, 0xffbe3d], signBgs = ['#ff2a5f', '#008c9e', '#e0532c', '#184e77'];
 const balconyMat = Std({ color: 0xffffff, roughness: .3 });
 let brandIdx = 0;
 const B = (w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); group.add(m); return m; };

 for (let ix = 0; ix < ROAD_X.length - 1; ix++) for (let iz = 0; iz < ROAD_Z.length - 1; iz++) {
  const cx = (ROAD_X[ix] + ROAD_X[ix + 1]) * .5, cz = (ROAD_Z[iz] + ROAD_Z[iz + 1]) * .5;
  const dist = getDistrictAt(cx, cz), isOc = cx > 140;
  B(82, .35, 82, Std({ color: isOc ? 0xd9c3a3 : 0xc4b092, roughness: .72 }), cx, .17, cz);
  const subs = isOc ? [[-18, -20, 22, 22], [-18, 20, 22, 22]] : [[-20, -20, 28, 28], [20, -20, 26, 28], [-20, 20, 28, 26], [20, 20, 28, 26]];
  subs.forEach(([dx, dz, w, d], s) => {
   const bx = cx + dx, bz = cz + dz, [minH, maxH] = isOc ? [11, 23] : dist.heightRange;
   const h = minH + rng() * (maxH - minH), pi = (ix * 3 + iz * 2 + s) % 6;
   const bMat = Std({ map: facades[pi], roughness: .42, metalness: .08 }), cMat = Bas({ color: crownCols[pi] });
   B(w, h, d, bMat, bx, h * .5 + .35, bz); B(w + 1.4, .75, d + 1.4, cMat, bx, 3.6, bz);
   for (let by = 8.5; by < h - 3; by += 6.5) B(w + .9, .42, d + .9, balconyMat, bx, by, bz);
   const midH = h * .34;
   B(w * .72, midH, d * .72, bMat, bx, h + midH * .5 + .35, bz); B(w * .76, 1.05, d * .76, cMat, bx, h + midH + .5, bz);
   if (s % 2 === 0 && (bx > 30 || Math.abs(bz) < 220)) {
    const tex = createNeonSignTexture(HOTEL_BRANDS[brandIdx % 8], signBgs[brandIdx % 4], '#ffe066'); brandIdx++;
    B(15, 3.8, .7, Bas({ map: tex }), bx, h + midH + 2.7, bz).rotation.y = bx > 60 ? Math.PI * .18 : 0;
   }
   colliders.push({ minX: bx - w * .5, maxX: bx + w * .5, minZ: bz - d * .5, maxZ: bz + d * .5 });
  });
  if (isOc) for (const [w, h, col, y] of [[28, 38, 0xfff8eb, .37], [23, 33, 0x00e5ff, .39]]) {
   const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), Bas({ color: col }));
   p.rotation.x = -Math.PI / 2; p.position.set(cx + 18, y, cz); group.add(p);
  }
 }
 [['HOTEL SOLANA', '#ff2a5f', 98.5, 11.2, -3, .38], ['CORAL PALMS', '#008c9e', 98.5, 15.8, -32, .34], ['MARINA CLUB', '#e0532c', 132, 16.2, -32, -.35]].forEach(([t, bg, x, y, z, ry]) => {
  B(13.5, 3.6, .9, Bas({ map: createNeonSignTexture(t, bg, '#ffe066') }), x, y, z).rotation.y = ry;
 });
 scene.add(group); return { group, colliders };
}
