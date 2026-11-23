// Art-Deco hotels, neon casinos, stepped financial skyscrapers, and rooftop helipads
import { getDistrictAt } from './districts.js';
import { ROAD_X, ROAD_Z } from './roads.js';

const HOTEL_BRANDS = [
  'HOTEL CORAL', 'SOLANA ROYALE', 'PALMA CASINO', 'CLUB MIRADOR',
  'DELFIN DORADO', 'MARINA LUX', 'STARLIGHT CLUB', 'EL SOL PALACE',
];

function createWindowFacadeTexture(baseHex, neonHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 128, 256);

  // Art-Deco vertical pilasters
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillRect(6, 0, 8, 256);
  ctx.fillRect(58, 0, 12, 256);
  ctx.fillRect(114, 0, 8, 256);

  // Illuminated windows grid
  for (let y = 14; y < 242; y += 16) {
    for (let x = 18; x < 106; x += 20) {
      if (x === 58) continue;
      const lit = ((x * 13 + y * 7) % 11) > 2;
      if (lit) {
        ctx.fillStyle = ((x + y) % 3 === 0) ? neonHex : '#ffe8a3';
      } else {
        ctx.fillStyle = '#101829';
      }
      ctx.fillRect(x, y, 12, 10);
    }
  }

  // Horizontal neon trim band
  ctx.fillStyle = neonHex;
  ctx.fillRect(0, 24, 128, 4);
  ctx.fillRect(0, 232, 128, 5);

  const tex = new window.THREE.CanvasTexture(canvas);
  tex.wrapS = window.THREE.RepeatWrapping;
  tex.wrapT = window.THREE.RepeatWrapping;
  return tex;
}

function createNeonSignTexture(text, bgHex, borderHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 256, 64);
  ctx.strokeStyle = borderHex;
  ctx.lineWidth = 5;
  ctx.strokeRect(4, 4, 248, 56);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = borderHex;
  ctx.shadowBlur = 10;
  ctx.fillText(text, 128, 33);
  return new window.THREE.CanvasTexture(canvas);
}

export function buildCityBuildings(scene, rng) {
  const THREE = window.THREE;
  const group = new THREE.Group();
  const colliders = [];

  const facadePresets = [
    createWindowFacadeTexture('#212a42', '#ff4d79'),
    createWindowFacadeTexture('#1a3047', '#00f0ff'),
    createWindowFacadeTexture('#382644', '#ffbf3c'),
    createWindowFacadeTexture('#263849', '#4eff91'),
    createWindowFacadeTexture('#442d35', '#ff7e29'),
  ];

  let brandIdx = 0;

  for (let ix = 0; ix < ROAD_X.length - 1; ix++) {
    for (let iz = 0; iz < ROAD_Z.length - 1; iz++) {
      const centerX = (ROAD_X[ix] + ROAD_X[ix + 1]) * 0.5;
      const centerZ = (ROAD_Z[iz] + ROAD_Z[iz + 1]) * 0.5;
      const district = getDistrictAt(centerX, centerZ);

      // Sidewalk block platform
      const padGeo = new THREE.BoxGeometry(82, 0.35, 82);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x2c3242, roughness: 0.7 });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(centerX, 0.17, centerZ);
      group.add(pad);

      // 2 to 4 sculpted stepped buildings per block
      const subPositions = [
        { dx: -20, dz: -20, w: 28, d: 28 },
        { dx: 20, dz: -20, w: 26, d: 28 },
        { dx: -20, dz: 20, w: 28, d: 26 },
        { dx: 20, dz: 20, w: 28, d: 26 },
      ];

      for (let s = 0; s < subPositions.length; s++) {
        const sub = subPositions[s];
        const bx = centerX + sub.dx;
        const bz = centerZ + sub.dz;
        const [minH, maxH] = district.heightRange;
        const h = minH + rng() * (maxH - minH);

        const tex = facadePresets[(ix + iz + s) % facadePresets.length];
        const bMat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.35,
          metalness: 0.3,
        });

        // Base podium tier
        const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(sub.w, h, sub.d), bMat);
        baseMesh.position.set(bx, h * 0.5 + 0.35, bz);
        group.add(baseMesh);

        // Art-Deco stepped upper tier
        const midH = h * 0.32;
        const midMesh = new THREE.Mesh(new THREE.BoxGeometry(sub.w * 0.72, midH, sub.d * 0.72), bMat);
        midMesh.position.set(bx, h + midH * 0.5 + 0.35, bz);
        group.add(midMesh);

        // Glowing neon crown band + spire
        const neonColor = (ix + iz + s) % 2 === 0 ? 0xff4d79 : 0x00f0ff;
        const crownMat = new THREE.MeshBasicMaterial({ color: neonColor });
        const crown = new THREE.Mesh(
          new THREE.BoxGeometry(sub.w * 0.76, 0.9, sub.d * 0.76),
          crownMat
        );
        crown.position.set(bx, h + midH + 0.5, bz);
        group.add(crown);

        // Rooftop billboard on boulevard-facing buildings
        if (s % 2 === 0 && (bx > 40 || Math.abs(bz) < 220)) {
          const brandName = HOTEL_BRANDS[brandIdx % HOTEL_BRANDS.length];
          brandIdx++;
          const signTex = createNeonSignTexture(
            brandName,
            '#0d1428',
            neonColor === 0xff4d79 ? '#ff4d79' : '#00f0ff'
          );
          const signMesh = new THREE.Mesh(
            new THREE.BoxGeometry(14, 3.6, 0.6),
            new THREE.MeshBasicMaterial({ map: signTex })
          );
          signMesh.position.set(bx, h + midH + 2.6, bz);
          signMesh.rotation.y = bx > 60 ? Math.PI * 0.15 : 0;
          group.add(signMesh);
        }

        colliders.push({
          minX: bx - sub.w * 0.5,
          maxX: bx + sub.w * 0.5,
          minZ: bz - sub.d * 0.5,
          maxZ: bz + sub.d * 0.5,
        });
      }
    }
  }

  scene.add(group);
  return { group, colliders };
}
