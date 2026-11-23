// Sculpted multi-part aerodynamic 3D vehicles with sloped hoods, angled windshields,
// wheel arches, rotating rims, spoilers, headlights/taillights, and police lightbars
import { VEHICLE_ARCHETYPES } from '../core/config.js';

export function buildSculptedVehicleMesh(archetype) {
  const THREE = window.THREE;
  const root = new THREE.Group();

  const L = archetype.length || 4.8;
  const W = archetype.width || 2.15;
  const H = archetype.height || 1.3;

  const paintMat = new THREE.MeshStandardMaterial({
    color: archetype.color,
    roughness: 0.2,
    metalness: 0.78,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: archetype.accent,
    roughness: 0.32,
    metalness: 0.65,
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x0b1628,
    emissive: 0x05182e,
    roughness: 0.08,
    metalness: 0.9,
  });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x12141a, roughness: 0.85 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xdbe6ff, metalness: 0.9, roughness: 0.2 });

  // Lower aerodynamic chassis skirt
  const lowerChassis = new THREE.Mesh(new THREE.BoxGeometry(W, H * 0.42, L), paintMat);
  lowerChassis.position.y = H * 0.36;
  root.add(lowerChassis);

  // Sloped front hood wedge
  const hood = new THREE.Mesh(new THREE.BoxGeometry(W * 0.94, H * 0.24, L * 0.36), paintMat);
  hood.position.set(0, H * 0.56, L * 0.28);
  hood.rotation.x = 0.16;
  root.add(hood);

  // Racing stripe / side accent trim
  const sideTrim = new THREE.Mesh(new THREE.BoxGeometry(W * 1.03, H * 0.12, L * 0.88), accentMat);
  sideTrim.position.set(0, H * 0.34, 0);
  root.add(sideTrim);

  // Sculpted cabin greenhouse with sloped front & rear windshields
  const isHeavy = archetype.cls === 'HEAVY' || archetype.cls === 'SUV';
  const cabinLen = isHeavy ? L * 0.62 : L * 0.46;
  const cabinH = isHeavy ? H * 0.52 : H * 0.44;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(W * 0.84, cabinH, cabinLen), paintMat);
  cabin.position.set(0, H * 0.74, isHeavy ? -L * 0.08 : -L * 0.05);
  root.add(cabin);

  // Angled front windshield glass
  const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(W * 0.8, cabinH * 0.88, 0.12), glassMat);
  frontGlass.position.set(0, H * 0.75, cabin.position.z + cabinLen * 0.5);
  frontGlass.rotation.x = -0.52;
  root.add(frontGlass);

  // Side windows glass band
  const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(W * 0.86, cabinH * 0.72, cabinLen * 0.82), glassMat);
  sideGlass.position.set(0, H * 0.76, cabin.position.z);
  root.add(sideGlass);

  // Aerodynamic rear wing spoiler for Exotic / Sports / Police
  if (archetype.cls === 'EXOTIC' || archetype.cls === 'SPORTS' || archetype.cls === 'POLICE') {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(W * 0.96, 0.1, 0.45), accentMat);
    wing.position.set(0, H * 0.88, -L * 0.44);
    wing.rotation.x = 0.14;
    root.add(wing);

    for (const sx of [-W * 0.34, W * 0.34]) {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, 0.25), accentMat);
      strut.position.set(sx, H * 0.72, -L * 0.43);
      root.add(strut);
    }
  }

  // Twin glowing xenon headlights (+Z is forward)
  const headMat = new THREE.MeshBasicMaterial({ color: 0xe6ffff });
  for (const hx of [-W * 0.34, W * 0.34]) {
    const hLight = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.18, 0.12), headMat);
    hLight.position.set(hx, H * 0.44, L * 0.5 + 0.02);
    root.add(hLight);
  }

  // Full-width neon LED taillight bar (-Z is rear)
  const tailMat = new THREE.MeshBasicMaterial({ color: 0xff1e42 });
  const tailBar = new THREE.Mesh(new THREE.BoxGeometry(W * 0.88, 0.18, 0.12), tailMat);
  tailBar.position.set(0, H * 0.46, -L * 0.5 - 0.02);
  root.add(tailBar);

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

  // Police Cruiser Red/Blue Strobe Lightbar & PointLight reflection
  let sirenRed = null;
  let sirenBlue = null;
  let sirenLight = null;
  if (archetype.cls === 'POLICE') {
    const barBase = new THREE.Mesh(new THREE.BoxGeometry(W * 0.68, 0.12, 0.32), accentMat);
    barBase.position.set(0, H + 0.05, -0.1);
    root.add(barBase);

    sirenRed = new THREE.Mesh(
      new THREE.BoxGeometry(W * 0.3, 0.18, 0.28),
      new THREE.MeshBasicMaterial({ color: 0xff1744 })
    );
    sirenRed.position.set(-W * 0.17, H + 0.12, -0.1);
    root.add(sirenRed);

    sirenBlue = new THREE.Mesh(
      new THREE.BoxGeometry(W * 0.3, 0.18, 0.28),
      new THREE.MeshBasicMaterial({ color: 0x00b0ff })
    );
    sirenBlue.position.set(W * 0.17, H + 0.12, -0.1);
    root.add(sirenBlue);

    sirenLight = new THREE.PointLight(0xff1744, 2.2, 22);
    sirenLight.position.set(0, H + 0.8, 0);
    root.add(sirenLight);
  }

  root.userData = { wheels, sirenRed, sirenBlue, sirenLight };
  return root;
}

export function getArchetypeById(id) {
  return VEHICLE_ARCHETYPES.find((a) => a.id === id) || VEHICLE_ARCHETYPES[0];
}
