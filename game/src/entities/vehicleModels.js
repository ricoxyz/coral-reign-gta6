// Sculpted multi-part aerodynamic 3D vehicles with sloped hoods, fastback windshields,
// wheel arches, rotating rims, spoilers, bullbars, brake lights, and police lightbars
import { VEHICLE_ARCHETYPES } from '../core/config.js';

export function buildSculptedVehicleMesh(archetype) {
  const THREE = window.THREE;
  const root = new THREE.Group();

  const L = archetype.length || 4.8;
  const W = archetype.width || 2.15;
  const H = archetype.height || 1.3;

  const paintMat = new THREE.MeshStandardMaterial({
    color: archetype.color,
    emissive: archetype.cls === 'EXOTIC' ? 0x280600 : 0x000000,
    roughness: 0.25,
    metalness: 0.22,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: archetype.accent,
    roughness: 0.28,
    metalness: 0.18,
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x0b1628,
    emissive: 0x051020,
    roughness: 0.08,
    metalness: 0.45,
  });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x11141a, roughness: 0.88 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xdbe6ff, metalness: 0.9, roughness: 0.2 });

  // Lower aerodynamic chassis + front splitter lip
  const lowerChassis = new THREE.Mesh(new THREE.BoxGeometry(W, H * 0.4, L), paintMat);
  lowerChassis.position.y = H * 0.36;
  root.add(lowerChassis);

  const splitter = new THREE.Mesh(new THREE.BoxGeometry(W * 1.02, 0.09, 0.35), accentMat);
  splitter.position.set(0, H * 0.16, L * 0.51);
  root.add(splitter);

  // Sloped front hood wedge
  const hood = new THREE.Mesh(new THREE.BoxGeometry(W * 0.94, H * 0.22, L * 0.38), paintMat);
  hood.position.set(0, H * 0.54, L * 0.28);
  hood.rotation.x = 0.15;
  root.add(hood);

  // Police high-contrast crisp white-and-navy patrol livery or sports racing side trim
  if (archetype.cls === 'POLICE') {
    const whiteDoors = new THREE.Mesh(new THREE.BoxGeometry(W * 1.03, H * 0.41, L * 0.52), accentMat);
    whiteDoors.position.set(0, H * 0.37, -L * 0.02);
    root.add(whiteDoors);

    // Crisp gold police shield stripe along white doors
    const goldStripe = new THREE.Mesh(
      new THREE.BoxGeometry(W * 1.04, 0.08, L * 0.50),
      new THREE.MeshBasicMaterial({ color: 0xffc83b })
    );
    goldStripe.position.set(0, H * 0.41, -L * 0.02);
    root.add(goldStripe);

    // Front steel pushbar bullbar
    const pushBar = new THREE.Mesh(
      new THREE.BoxGeometry(W * 0.66, H * 0.32, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x1e2634, metalness: 0.5, roughness: 0.3 })
    );
    pushBar.position.set(0, H * 0.35, L * 0.54);
    root.add(pushBar);
  } else {
    const sideTrim = new THREE.Mesh(new THREE.BoxGeometry(W * 1.03, H * 0.11, L * 0.86), accentMat);
    sideTrim.position.set(0, H * 0.32, 0);
    root.add(sideTrim);

    if (archetype.cls === 'EXOTIC') {
      // Twin golden racing stripes on hood and roof so the Coral Vortex GT pops unmistakably
      for (const rx of [-0.22, 0.22]) {
        const hoodStripe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, L * 0.36), accentMat);
        hoodStripe.position.set(rx, H * 0.65, L * 0.28);
        hoodStripe.rotation.x = 0.15;
        root.add(hoodStripe);
      }
    }
  }

  // Sculpted cabin greenhouse with sloped front & fastback rear windshields
  const isHeavy = archetype.cls === 'HEAVY' || archetype.cls === 'SUV';
  const cabinLen = isHeavy ? L * 0.62 : L * 0.44;
  const cabinH = isHeavy ? H * 0.5 : H * 0.42;
  const cabinRoofMat = archetype.cls === 'POLICE' ? accentMat : paintMat;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(W * 0.82, cabinH, cabinLen), cabinRoofMat);
  cabin.position.set(0, H * 0.72, isHeavy ? -L * 0.08 : -L * 0.04);
  root.add(cabin);

  const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(W * 0.78, cabinH * 0.9, 0.12), glassMat);
  frontGlass.position.set(0, H * 0.72, cabin.position.z + cabinLen * 0.52);
  frontGlass.rotation.x = -0.58;
  root.add(frontGlass);

  const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(W * 0.76, cabinH * 0.86, 0.12), glassMat);
  rearGlass.position.set(0, H * 0.71, cabin.position.z - cabinLen * 0.52);
  rearGlass.rotation.x = 0.62;
  root.add(rearGlass);

  const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(W * 0.84, cabinH * 0.7, cabinLen * 0.82), glassMat);
  sideGlass.position.set(0, H * 0.73, cabin.position.z);
  root.add(sideGlass);

  // Aerodynamic rear wing spoiler for Exotic / Sports / Police
  if (archetype.cls === 'EXOTIC' || archetype.cls === 'SPORTS' || archetype.cls === 'POLICE') {
    const wingMat = archetype.cls === 'POLICE' ? paintMat : accentMat;
    const wing = new THREE.Mesh(new THREE.BoxGeometry(W * 0.92, 0.08, 0.38), wingMat);
    wing.position.set(0, H * 0.86, -L * 0.44);
    wing.rotation.x = 0.14;
    root.add(wing);

    for (const sx of [-W * 0.34, W * 0.34]) {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.26, 0.22), wingMat);
      strut.position.set(sx, H * 0.72, -L * 0.43);
      root.add(strut);
    }
  }

  // Twin glowing xenon headlights (+Z is forward)
  const headMat = new THREE.MeshBasicMaterial({ color: 0xeaffff });
  for (const hx of [-W * 0.34, W * 0.34]) {
    const hLight = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.12), headMat);
    hLight.position.set(hx, H * 0.42, L * 0.5 + 0.02);
    root.add(hLight);
  }

  // Full-width neon LED taillight bar + twin exhaust ports (-Z is rear)
  const tailMat = new THREE.MeshBasicMaterial({ color: 0xff2248 });
  const tailBar = new THREE.Mesh(new THREE.BoxGeometry(W * 0.88, 0.16, 0.12), tailMat);
  tailBar.position.set(0, H * 0.45, -L * 0.5 - 0.02);
  root.add(tailBar);

  // Subtle ground shadow plate under chassis for grounded visual contact
  const shadowPlate = new THREE.Mesh(
    new THREE.PlaneGeometry(W * 1.12, L * 1.06),
    new THREE.MeshBasicMaterial({ color: 0x050810, transparent: true, opacity: 0.48, depthWrite: false })
  );
  shadowPlate.rotation.x = -Math.PI / 2;
  shadowPlate.position.y = 0.06;
  root.add(shadowPlate);

  // 4 Rotating wheels with alloy rims
  const wheels = [];
  const wheelCoords = [
    { x: -W * 0.49, z: L * 0.31 },
    { x: W * 0.49, z: L * 0.31 },
    { x: -W * 0.49, z: -L * 0.31 },
    { x: W * 0.49, z: -L * 0.31 },
  ];

  for (let i = 0; i < wheelCoords.length; i++) {
    const wc = wheelCoords[i];
    const wGroup = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.32, 14), tireMat);
    tire.rotation.z = Math.PI / 2;
    wGroup.add(tire);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.34, 8), rimMat);
    rim.rotation.z = Math.PI / 2;
    wGroup.add(rim);
    wGroup.position.set(wc.x, 0.38, wc.z);
    root.add(wGroup);
    wheels.push(wGroup);
  }

  // Police Cruiser Bold Red/Blue Strobe Lightbar (oversized high-visibility roof beacon + glowing halo)
  let sirenRed = null;
  let sirenBlue = null;
  let sirenLight = null;
  if (archetype.cls === 'POLICE') {
    const barBase = new THREE.Mesh(new THREE.BoxGeometry(W * 0.82, 0.13, 0.38), paintMat);
    barBase.position.set(0, H * 0.98, -0.06);
    root.add(barBase);

    sirenRed = new THREE.Mesh(
      new THREE.BoxGeometry(W * 0.38, 0.25, 0.34),
      new THREE.MeshBasicMaterial({ color: 0xff1744 })
    );
    sirenRed.position.set(-W * 0.21, H * 1.08, -0.06);
    root.add(sirenRed);

    sirenBlue = new THREE.Mesh(
      new THREE.BoxGeometry(W * 0.38, 0.25, 0.34),
      new THREE.MeshBasicMaterial({ color: 0x00c8ff })
    );
    sirenBlue.position.set(W * 0.21, H * 1.08, -0.06);
    root.add(sirenBlue);

    sirenLight = new THREE.PointLight(0xff1744, 0.8, 12);
    sirenLight.position.set(0, H + 1.3, 0);
    root.add(sirenLight);
  }

  root.userData = { wheels, sirenRed, sirenBlue, sirenLight };
  return root;
}

export function getArchetypeById(id) {
  return VEHICLE_ARCHETYPES.find((a) => a.id === id) || VEHICLE_ARCHETYPES[0];
}
