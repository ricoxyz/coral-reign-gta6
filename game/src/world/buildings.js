// Sun-Drenched Art-Deco pastel hotels, oceanfront resorts, crisp white balconies, colorful awnings & rooftop signs
import { getDistrictAt } from './districts.js';
import { ROAD_X, ROAD_Z } from './roads.js';

const HOTEL_BRANDS = ['HOTEL SOLANA', 'CORAL PALMS', 'MARINA CLUB', 'SOLANA ROYALE', 'DELFIN DORADO', 'PALMA CASINO', 'CLUB MIRADOR', 'STARLIGHT CLUB'];

function createWindowFacadeTexture(topHex, bottomHex, trimHex, awningHex) {
 const c = document.createElement('canvas'); c.width = 128; c.height = 256;
 const ctx = c.getContext('2d'), g = ctx.createLinearGradient(0, 0, 0, 256);
 g.addColorStop(0, topHex); g.addColorStop(1, bottomHex);
 ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 256);
 ctx.fillStyle = 'rgba(255,255,255,.75)';
 ctx.fillRect(5, 0, 9, 256); ctx.fillRect(58, 0, 12, 256); ctx.fillRect(114, 0, 9, 256);
 for (let y = 26; y < 228; y += 22) {
  ctx.fillStyle = '#fff'; ctx.fillRect(12, y + 12, 46, 3); ctx.fillRect(70, y + 12, 46, 3);
  for (let x = 18; x < 106; x += 20) {
   if (x === 58) continue;
   ctx.fillStyle = ((x * 13 + y * 7) % 5) === 0 ? '#ffe9a6' : '#1b6d96';
   ctx.fillRect(x, y, 14, 11);
   ctx.fillStyle = trimHex; ctx.fillRect(x - 1, y - 2, 16, 2.5);
  }
 }
 ctx.fillStyle = awningHex; ctx.fillRect(0, 232, 128, 12);
 ctx.fillStyle = '#fff'; for (let ax = 4; ax < 128; ax += 16) ctx.fillRect(ax, 232, 7, 12);
 ctx.fillStyle = trimHex; ctx.fillRect(0, 10, 128, 6);
 ctx.fillStyle = '#fff'; ctx.fillRect(0, 16, 128, 3);
 const tex = new window.THREE.CanvasTexture(c);
 tex.wrapS = tex.wrapT = window.THREE.RepeatWrapping;
 return tex;
}

function createNeonSignTexture(text, bgHex, borderHex) {
 const c = document.createElement('canvas'); c.width = 256; c.height = 64;
 const ctx = c.getContext('2d');
 ctx.fillStyle = bgHex; ctx.fillRect(0, 0, 256, 64);
 ctx.strokeStyle = borderHex; ctx.lineWidth = 6; ctx.strokeRect(4, 4, 248, 56);
 ctx.fillStyle = '#fff'; ctx.font = '900 24px "Segoe UI", sans-serif';
 ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 128, 33);
 return new window.THREE.CanvasTexture(c);
}

export function buildCityBuildings(scene, rng) {
 const THREE = window.THREE;
 const group = new THREE.Group(), colliders = [];
 const facadePresets = [
  ['#f2dec0', '#dec29b', '#ff4d73', '#ff4d73'], ['#f598b2', '#e07292', '#00c4c7', '#e84870'],
  ['#7de0cc', '#56c2ad', '#ff6e38', '#00a396'], ['#f7b585', '#e38e56', '#0fa8b8', '#e85d2a'],
  ['#8dd0f5', '#64b2e0', '#ff4d73', '#1f78c4'], ['#f5d584', '#e0b858', '#ff4d73', '#e87b1e'],
 ].map((p) => createWindowFacadeTexture(...p));
 const crownColors = [0xff5a79, 0x00d8d6, 0xff9233, 0x2ec4b6, 0xff4d79, 0xffbe3d];
 const signBgs = ['#ff2a5f', '#008c9e', '#e0532c', '#184e77'];
 const balconyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
 let brandIdx = 0;

 const B = (w, h, d, mat, x, y, z) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); group.add(m); return m;
 };

 for (let ix = 0; ix < ROAD_X.length - 1; ix++) {
  for (let iz = 0; iz < ROAD_Z.length - 1; iz++) {
   const cx = (ROAD_X[ix] + ROAD_X[ix + 1]) * 0.5, cz = (ROAD_Z[iz] + ROAD_Z[iz + 1]) * 0.5;
   const district = getDistrictAt(cx, cz), isOcean = cx > 140;
   B(82, 0.35, 82, new THREE.MeshStandardMaterial({ color: isOcean ? 0xd9c3a3 : 0xc4b092, roughness: 0.72 }), cx, 0.17, cz);

   const subs = isOcean ? [[-18, -20, 22, 22], [-18, 20, 22, 22]] : [[-20, -20, 28, 28], [20, -20, 26, 28], [-20, 20, 28, 26], [20, 20, 28, 26]];
   subs.forEach(([dx, dz, w, d], s) => {
    const bx = cx + dx, bz = cz + dz;
    const [minH, maxH] = isOcean ? [11, 23] : district.heightRange;
    const h = minH + rng() * (maxH - minH), pIdx = (ix * 3 + iz * 2 + s) % 6;
    const bMat = new THREE.MeshStandardMaterial({ map: facadePresets[pIdx], roughness: 0.42, metalness: 0.08 });
    const cMat = new THREE.MeshBasicMaterial({ color: crownColors[pIdx] });

    B(w, h, d, bMat, bx, h * 0.5 + 0.35, bz);
    B(w + 1.4, 0.75, d + 1.4, cMat, bx, 3.6, bz);
    for (let by = 8.5; by < h - 3; by += 6.5) B(w + 0.9, 0.42, d + 0.9, balconyMat, bx, by, bz);

    const midH = h * 0.34;
    B(w * 0.72, midH, d * 0.72, bMat, bx, h + midH * 0.5 + 0.35, bz);
    B(w * 0.76, 1.05, d * 0.76, cMat, bx, h + midH + 0.5, bz);

    if (s % 2 === 0 && (bx > 30 || Math.abs(bz) < 220)) {
     const signTex = createNeonSignTexture(HOTEL_BRANDS[brandIdx % 8], signBgs[brandIdx % 4], '#ffe066');
     brandIdx++;
     B(15, 3.8, 0.7, new THREE.MeshBasicMaterial({ map: signTex }), bx, h + midH + 2.7, bz).rotation.y = bx > 60 ? Math.PI * 0.18 : 0;
    }
    colliders.push({ minX: bx - w * 0.5, maxX: bx + w * 0.5, minZ: bz - d * 0.5, maxZ: bz + d * 0.5 });
   });

   if (isOcean) {
    for (const [w, h, col, y] of [[28, 38, 0xfff8eb, 0.37], [23, 33, 0x00e5ff, 0.39]]) {
     const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col }));
     p.rotation.x = -Math.PI / 2; p.position.set(cx + 18, y, cz); group.add(p);
    }
   }
  }
 }

 [['HOTEL SOLANA', '#ff2a5f', 98.5, 11.2, -3, 0.38], ['CORAL PALMS', '#008c9e', 98.5, 15.8, -32, 0.34], ['MARINA CLUB', '#e0532c', 132, 16.2, -32, -0.35]].forEach(([text, bg, x, y, z, rotY]) => {
  B(13.5, 3.6, 0.9, new THREE.MeshBasicMaterial({ map: createNeonSignTexture(text, bg, '#ffe066') }), x, y, z).rotation.y = rotY;
 });

 scene.add(group);
 return { group, colliders };
}
