// Sculpted curved tropical palm trees, neon streetlamps, stunt ramps, yachts, & Palma Pier Ferris wheel
import { ROAD_Z } from './roads.js';

export function createPalmTreeMesh(THREE, scale = 1) {
  const palm = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x7c5333, roughness: 0.85 });
  const frondMat = new THREE.MeshStandardMaterial({
    color: 0x26b86f,
    emissive: 0x09301b,
    roughness: 0.45,
    side: THREE.DoubleSide,
  });

  // Segmented curved trunk
  const segments = 5;
  let curY = 0;
  let curX = 0;
  for (let i = 0; i < segments; i++) {
    const segH = 1.65 * scale;
    const rBottom = (0.34 - i * 0.04) * scale;
    const rTop = (0.3 - i * 0.04) * scale;
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, segH, 7), trunkMat);
    seg.position.set(curX, curY + segH * 0.5, 0);
    seg.rotation.z = -i * 0.05;
    palm.add(seg);
    curY += segH * 0.96;
    curX += i * 0.09 * scale;
  }

  // Crown of 8 two-segment arching tapered palm fronds
  const crown = new THREE.Group();
  crown.position.set(curX, curY, 0);
  for (let f = 0; f < 8; f++) {
    const angle = (f / 8) * Math.PI * 2;
    const holder = new THREE.Group();
    holder.rotation.y = angle;

    const innerLeaf = new THREE.Mesh(new THREE.ConeGeometry(0.45 * scale, 2.2 * scale, 4), frondMat);
    innerLeaf.rotation.z = -Math.PI * 0.42;
    innerLeaf.position.set(1.0 * scale, 0.1 * scale, 0);
    holder.add(innerLeaf);

    const outerLeaf = new THREE.Mesh(new THREE.ConeGeometry(0.38 * scale, 2.1 * scale, 4), frondMat);
    outerLeaf.rotation.z = -Math.PI * 0.62;
    outerLeaf.position.set(2.45 * scale, -0.45 * scale, 0);
    holder.add(outerLeaf);

    crown.add(holder);
  }
  palm.add(crown);
  return palm;
}

export function buildWorldProps(scene) {
  const THREE = window.THREE;
  const group = new THREE.Group();
  const palmCrowns = [];
  const stuntRamps = [];

  // Line Solana Strip (x=110), Oceanfront Drive (x=220), Beachfront (x=242), and Avenue 0 with tropical palms
  const palmLines = [
    { x: 110, sides: [-14.2, 14.2], lamps: true },
    { x: 220, sides: [-14.2, 14.2], lamps: true },
    { x: 246, sides: [0], lamps: false },
    { x: 0, sides: [-14.2, 14.2], lamps: true },
  ];

  for (let a = 0; a < palmLines.length; a++) {
    const line = palmLines[a];
    for (let z = -380; z <= 380; z += 26) {
      let nearIntersection = false;
      for (let j = 0; j < ROAD_Z.length; j++) {
        if (Math.abs(z - ROAD_Z[j]) < 16) nearIntersection = true;
      }
      if (nearIntersection) continue;

      for (const side of line.sides) {
        const scale = 0.95 + ((Math.abs(z) % 5) * 0.08);
        const palm = createPalmTreeMesh(THREE, scale);
        palm.position.set(line.x + side, 0, z);
        palm.rotation.y = (z * 0.3) % (Math.PI * 2);
        group.add(palm);
        palmCrowns.push(palm);
      }

      if (line.lamps) {
        const lampPole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.14, 5.5, 6),
          new THREE.MeshStandardMaterial({ color: 0x222c3c, metalness: 0.8 })
        );
        lampPole.position.set(line.x + 12.8, 2.75, z + 11);
        group.add(lampPole);

        const globeColor = ((z / 26) | 0) % 2 === 0 ? 0xff4d79 : 0x00f0ff;
        const globe = new THREE.Mesh(
          new THREE.SphereGeometry(0.4, 8, 8),
          new THREE.MeshBasicMaterial({ color: globeColor })
        );
        globe.position.set(line.x + 12.8, 5.65, z + 11);
        group.add(globe);
      }
    }
  }

  // 10 Stunt Jump Ramps with glowing neon chevrons across Palma Dorada
  const rampCoords = [
    { x: 110, z: -85, rotY: 0 },
    { x: 220, z: -155, rotY: 0 },
    { x: 110, z: 160, rotY: Math.PI },
    { x: 0, z: -270, rotY: 0 },
    { x: -110, z: 50, rotY: 0 },
    { x: 220, z: 270, rotY: Math.PI },
    { x: -220, z: -165, rotY: 0 },
    { x: 55, z: -330, rotY: Math.PI / 2 },
    { x: -55, z: 220, rotY: -Math.PI / 2 },
    { x: 165, z: 0, rotY: Math.PI / 2 },
  ];

  const rampMat = new THREE.MeshStandardMaterial({
    color: 0xff7e29,
    emissive: 0x551800,
    roughness: 0.35,
  });

  for (let i = 0; i < rampCoords.length; i++) {
    const rc = rampCoords[i];
    const ramp = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.4, 9.5), rampMat);
    ramp.position.set(rc.x + 6, 0.55, rc.z);
    ramp.rotation.y = rc.rotY;
    ramp.rotation.x = 0.22;
    group.add(ramp);
    stuntRamps.push({ id: `ramp_${i}`, x: rc.x + 6, z: rc.z, radius: 5.5 });
  }

  // Luxury coastal yachts moored off Coral Marina & Solana Beach
  const hullMat = new THREE.MeshStandardMaterial({ color: 0xf5f9ff, roughness: 0.2, metalness: 0.3 });
  const deckMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  for (let y = 0; y < 6; y++) {
    const yacht = new THREE.Group();
    const hull = new THREE.Mesh(new THREE.BoxGeometry(5.5, 2.2, 16), hullMat);
    hull.position.y = 0.9;
    yacht.add(hull);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.0, 8.5), hullMat);
    cabin.position.set(0, 2.5, -1);
    yacht.add(cabin);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.25, 8.8), deckMat);
    trim.position.set(0, 3.55, -1);
    yacht.add(trim);
    yacht.position.set(310 + (y % 2) * 30, -0.1, -260 + y * 115);
    yacht.rotation.y = 0.18 * (y - 2);
    group.add(yacht);
  }

  // Palma Pier Wooden Boardwalk & Glowing Neon Ferris Wheel landmark
  const pierDeck = new THREE.Mesh(
    new THREE.BoxGeometry(95, 0.8, 18),
    new THREE.MeshStandardMaterial({ color: 0x5c3d28, roughness: 0.8 })
  );
  pierDeck.position.set(295, 1.1, 315);
  group.add(pierDeck);

  const ferrisRim = new THREE.Mesh(
    new THREE.TorusGeometry(19, 0.75, 8, 32),
    new THREE.MeshBasicMaterial({ color: 0xff4d79 })
  );
  ferrisRim.position.set(318, 22, 315);
  group.add(ferrisRim);

  const ferrisInner = new THREE.Mesh(
    new THREE.TorusGeometry(12, 0.4, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0x00f0ff })
  );
  ferrisInner.position.set(318, 22, 315);
  group.add(ferrisInner);

  scene.add(group);
  return {
    group,
    stuntRamps,
    update(time) {
      const sway = Math.sin(time * 1.8) * 0.035;
      for (let i = 0; i < palmCrowns.length; i++) {
        palmCrowns[i].rotation.z = sway * ((i % 2 === 0) ? 1 : -1);
      }
      ferrisRim.rotation.z = time * 0.25;
      ferrisInner.rotation.z = -time * 0.25;
    },
  };
}
