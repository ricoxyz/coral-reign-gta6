// Sun-Drenched Art-Deco pastel hotels, oceanfront resorts, crisp white balconies, colorful awnings & rooftop signs
import { getDistrictAt } from './districts.js';
import { ROAD_X, ROAD_Z } from './roads.js';

const HOTEL_BRANDS = [
  'HOTEL CORAL', 'SOLANA ROYALE', 'PALMA CASINO', 'CLUB MIRADOR',
  'DELFIN DORADO', 'MARINA LUX', 'STARLIGHT CLUB', 'EL SOL PALACE',
];

function createWindowFacadeTexture(topHex, bottomHex, trimHex, awningHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Sun-drenched pastel Art-Deco stucco gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 256);
  bgGrad.addColorStop(0, topHex);
  bgGrad.addColorStop(1, bottomHex);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 128, 256);

  // Crisp white Art-Deco vertical pilasters & fluted columns
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fillRect(5, 0, 9, 256);
  ctx.fillRect(58, 0, 12, 256);
  ctx.fillRect(114, 0, 9, 256);

  // Horizontal white Art-Deco balcony ledges
  ctx.fillStyle = '#ffffff';
  for (let y = 26; y < 236; y += 22) {
    ctx.fillRect(12, y + 12, 46, 3);
    ctx.fillRect(70, y + 12, 46, 3);
  }

  // Sun-reflecting aqua/sky-blue coastal glass windows with golden-hour highlights
  for (let y = 26; y < 228; y += 22) {
    for (let x = 18; x < 106; x += 20) {
      if (x === 58) continue;
      const sunReflect = ((x * 13 + y * 7) % 5) === 0;
      ctx.fillStyle = sunReflect ? '#ffe9a6' : '#1b6d96';
      ctx.fillRect(x, y, 14, 11);
      // Window frame & top sun-shade eyebrow
      ctx.fillStyle = trimHex;
      ctx.fillRect(x - 1, y - 2, 16, 2.5);
    }
  }

  // Colorful striped storefront awning at ground floor
  ctx.fillStyle = awningHex;
  ctx.fillRect(0, 232, 128, 12);
  ctx.fillStyle = '#ffffff';
  for (let ax = 4; ax < 128; ax += 16) {
    ctx.fillRect(ax, 232, 7, 12);
  }

  // Top Art-Deco frieze band
  ctx.fillStyle = trimHex;
  ctx.fillRect(0, 10, 128, 6);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 16, 128, 3);

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
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 248, 56);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 4;
  ctx.fillText(text, 128, 33);
  return new window.THREE.CanvasTexture(canvas);
}

export function buildCityBuildings(scene, rng) {
  const THREE = window.THREE;
  const group = new THREE.Group();
  const colliders = [];

  // Sun-soaked Art-Deco pastel palettes: warm ivory, coral-pink, seafoam-mint, sunlit peach-terracotta, tropical sky-aqua
  const facadePresets = [
    createWindowFacadeTexture('#f2dec0', '#dec29b', '#ff4d73', '#ff4d73'), // Warm Ivory & Coral Pink
    createWindowFacadeTexture('#f598b2', '#e07292', '#00c4c7', '#e84870'), // Pastel Coral-Pink & Seafoam
    createWindowFacadeTexture('#7de0cc', '#56c2ad', '#ff6e38', '#00a396'), // Seafoam Mint & Terracotta
    createWindowFacadeTexture('#f7b585', '#e38e56', '#0fa8b8', '#e85d2a'), // Sunlit Peach-Terracotta & Turquoise
    createWindowFacadeTexture('#8dd0f5', '#64b2e0', '#ff4d73', '#1f78c4'), // Tropical Sky Blue & Coral
    createWindowFacadeTexture('#f5d584', '#e0b858', '#ff4d73', '#e87b1e'), // Sunlit Marigold Cream & Coral
  ];

  const crownColors = [0xff5a79, 0x00d8d6, 0xff9233, 0x2ec4b6, 0xff4d79, 0xffbe3d];
  const signBgs = ['#ff4d79', '#008c9e', '#e0532c', '#184e77'];

  let brandIdx = 0;

  for (let ix = 0; ix < ROAD_X.length - 1; ix++) {
    for (let iz = 0; iz < ROAD_Z.length - 1; iz++) {
      const centerX = (ROAD_X[ix] + ROAD_X[ix + 1]) * 0.5;
      const centerZ = (ROAD_Z[iz] + ROAD_Z[iz + 1]) * 0.5;
      const district = getDistrictAt(centerX, centerZ);
      const isOceanfrontBlock = centerX > 140; // Open coastal resort strip between Solana Strip & Beach!

      // Sunlit cream travertine sidewalk block platform
      const padGeo = new THREE.BoxGeometry(82, 0.35, 82);
      const padMat = new THREE.MeshStandardMaterial({
        color: isOceanfrontBlock ? 0xd9c3a3 : 0xc4b092,
        roughness: 0.72,
      });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(centerX, 0.17, centerZ);
      group.add(pad);

      // Oceanfront blocks have airy low-rise beach clubs & boutique Art-Deco hotels so sunset/ocean remain visible!
      const subPositions = isOceanfrontBlock
        ? [
            { dx: -18, dz: -20, w: 22, d: 22 },
            { dx: -18, dz: 20, w: 22, d: 22 },
          ]
        : [
            { dx: -20, dz: -20, w: 28, d: 28 },
            { dx: 20, dz: -20, w: 26, d: 28 },
            { dx: -20, dz: 20, w: 28, d: 26 },
            { dx: 20, dz: 20, w: 28, d: 26 },
          ];

      for (let s = 0; s < subPositions.length; s++) {
        const sub = subPositions[s];
        const bx = centerX + sub.dx;
        const bz = centerZ + sub.dz;
        const [minH, maxH] = isOceanfrontBlock ? [11, 23] : district.heightRange;
        const h = minH + rng() * (maxH - minH);

        const presetIdx = (ix * 3 + iz * 2 + s) % facadePresets.length;
        const tex = facadePresets[presetIdx];
        const bMat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.42,
          metalness: 0.08,
        });

        // Base podium tier
        const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(sub.w, h, sub.d), bMat);
        baseMesh.position.set(bx, h * 0.5 + 0.35, bz);
        group.add(baseMesh);

        // Crisp white wrap-around balconies & colorful ground-floor storefront awning
        const balconyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
        const awningColor = crownColors[presetIdx];
        const awningMat = new THREE.MeshStandardMaterial({ color: awningColor, roughness: 0.4 });
        const groundAwning = new THREE.Mesh(
          new THREE.BoxGeometry(sub.w + 1.4, 0.75, sub.d + 1.4),
          awningMat
        );
        groundAwning.position.set(bx, 3.6, bz);
        group.add(groundAwning);

        for (let by = 8.5; by < h - 3; by += 6.5) {
          const bal = new THREE.Mesh(
            new THREE.BoxGeometry(sub.w + 0.9, 0.42, sub.d + 0.9),
            balconyMat
          );
          bal.position.set(bx, by, bz);
          group.add(bal);
        }

        // Art-Deco stepped upper tier
        const midH = h * 0.34;
        const midMesh = new THREE.Mesh(new THREE.BoxGeometry(sub.w * 0.72, midH, sub.d * 0.72), bMat);
        midMesh.position.set(bx, h + midH * 0.5 + 0.35, bz);
        group.add(midMesh);

        // Bright Art-Deco crown band + white parapet spire
        const crownColor = crownColors[presetIdx];
        const crownMat = new THREE.MeshBasicMaterial({ color: crownColor });
        const crown = new THREE.Mesh(
          new THREE.BoxGeometry(sub.w * 0.76, 1.05, sub.d * 0.76),
          crownMat
        );
        crown.position.set(bx, h + midH + 0.5, bz);
        group.add(crown);

        // Vertical Art-Deco accent fin on Solana Strip & Downtown towers
        if (bx > 20 || h > 42) {
          const strip = new THREE.Mesh(new THREE.BoxGeometry(0.75, h, 0.75), crownMat);
          strip.position.set(bx + sub.w * 0.5, h * 0.5 + 0.35, bz + sub.d * 0.5);
          group.add(strip);
        }

        // Readable high-contrast rooftop hotel signs on boulevard-facing buildings
        if (s % 2 === 0 && (bx > 30 || Math.abs(bz) < 220)) {
          const brandName = HOTEL_BRANDS[brandIdx % HOTEL_BRANDS.length];
          const signBg = signBgs[brandIdx % signBgs.length];
          brandIdx++;
          const signTex = createNeonSignTexture(brandName, signBg, '#ffe066');
          const signMesh = new THREE.Mesh(
            new THREE.BoxGeometry(15, 3.8, 0.7),
            new THREE.MeshBasicMaterial({ map: signTex })
          );
          signMesh.position.set(bx, h + midH + 2.7, bz);
          signMesh.rotation.y = bx > 60 ? Math.PI * 0.18 : 0;
          group.add(signMesh);
        }

        colliders.push({
          minX: bx - sub.w * 0.5,
          maxX: bx + sub.w * 0.5,
          minZ: bz - sub.d * 0.5,
          maxZ: bz + sub.d * 0.5,
        });
      }

      // Sparkling turquoise resort pool courtyard + coral sun deck on oceanfront blocks
      if (isOceanfrontBlock) {
        const poolDeck = new THREE.Mesh(
          new THREE.PlaneGeometry(28, 38),
          new THREE.MeshBasicMaterial({ color: 0xfff8eb })
        );
        poolDeck.rotation.x = -Math.PI / 2;
        poolDeck.position.set(centerX + 18, 0.37, centerZ);
        group.add(poolDeck);

        const pool = new THREE.Mesh(
          new THREE.PlaneGeometry(23, 33),
          new THREE.MeshBasicMaterial({ color: 0x00e5ff })
        );
        pool.rotation.x = -Math.PI / 2;
        pool.position.set(centerX + 18, 0.39, centerZ);
        group.add(pool);
      }
    }
  }

  scene.add(group);
  return { group, colliders };
}
