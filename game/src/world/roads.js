// Multi-lane sunset boulevards with wet sheen, crosswalks, arches & traffic signals
export const ROAD_X = [-330, -220, -110, 0, 110, 220];
export const ROAD_Z = [-440, -330, -220, -110, 0, 110, 220, 330, 440];

export function buildRoadNetwork(scene) {
 const THREE = window.THREE, group = new THREE.Group();
 const c = document.createElement('canvas'); c.width = c.height = 256;
 const ctx = c.getContext('2d'), wg = ctx.createLinearGradient(0, 0, 256, 0);
 ctx.fillStyle = '#252b38'; ctx.fillRect(0, 0, 256, 256);
 [[0, '#272d3b'], [.28, '#32394a'], [.5, '#29303f'], [.72, '#343a4d'], [1, '#272d3b']].forEach(([s, col]) => wg.addColorStop(s, col));
 ctx.fillStyle = wg; ctx.fillRect(16, 0, 224, 256);
 ctx.fillStyle = '#ffd042'; ctx.fillRect(122, 0, 4, 256); ctx.fillRect(130, 0, 4, 256);
 ctx.fillStyle = 'rgba(255,255,255,.92)'; for (let y = 12; y < 256; y += 64) { ctx.fillRect(66, y, 5, 32); ctx.fillRect(185, y, 5, 32); }
 ctx.fillStyle = '#e8dcc8'; ctx.fillRect(0, 0, 9, 256); ctx.fillRect(247, 0, 9, 256);
 ctx.fillStyle = '#00e5ff'; ctx.fillRect(9, 0, 3, 256); ctx.fillStyle = '#ff5e7e'; ctx.fillRect(244, 0, 3, 256);

 const Std = (p) => new THREE.MeshStandardMaterial(p), Bas = (p) => new THREE.MeshBasicMaterial(p), Box = (w, h, d) => new THREE.BoxGeometry(w, h, d), Pln = (w, h) => new THREE.PlaneGeometry(w, h), HPI = Math.PI / 2;
 const roadTex = new THREE.CanvasTexture(c); roadTex.wrapS = roadTex.wrapT = THREE.RepeatWrapping; roadTex.repeat.set(1, 44);
 const matNS = Std({ map: roadTex, roughness: .9, metalness: .04 });
 for (const rx of ROAD_X) { const m = new THREE.Mesh(Pln(24, 1100), matNS); m.rotation.x = -HPI; m.position.set(rx, .04, 0); group.add(m); }

 const texEW = roadTex.clone(); texEW.needsUpdate = true; texEW.repeat.set(1, 30);
 const matEW = Std({ map: texEW, roughness: .9, metalness: .04 });
 for (const rz of ROAD_Z) { const m = new THREE.Mesh(Pln(22, 720), matEW); m.rotation.set(-HPI, 0, HPI); m.position.set(-45, .05, rz); group.add(m); }

 const crossGeo = Box(24.5, .08, 24.5), crossMat = Std({ color: 0x2c3342, roughness: .85, metalness: .04 });
 const poleMat = Std({ color: 0x4a5568, metalness: .6, roughness: .3 }), stripeMat = Bas({ color: 0xf8fbff });
 const addM = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); group.add(m); return m; };

 ROAD_X.forEach((ix, i) => ROAD_Z.forEach((iz, j) => {
  addM(crossGeo, crossMat, ix, .03, iz);
  if (ix >= 0) for (let s = -8; s <= 8; s += 3.2) addM(Pln(1.4, 3.2), stripeMat, ix + s, .085, iz + 12.6).rotation.x = -HPI;
  if ((i + j) % 2 === 0) {
   addM(new THREE.CylinderGeometry(.18, .22, 6.8, 8), poleMat, ix + 13, 3.4, iz + 13);
   addM(Box(6.5, .22, .22), poleMat, ix + 9.8, 6.4, iz + 13);
   addM(Box(.65, 1.3, .65), Bas({ color: (i + j) % 4 === 0 ? 0x00ff88 : 0xff3355 }), ix + 7.5, 5.9, iz + 13);
  }
 }));

 const archMat = Std({ color: 0x00e5ff, emissive: 0x005577, roughness: .2 });
 for (let k = -1; k <= 1; k++) addM(new THREE.TorusGeometry(14, .55, 10, 28, Math.PI), archMat, 110 + k * 24, .2, -330).rotation.y = HPI;
 scene.add(group);
 return { group };
}
