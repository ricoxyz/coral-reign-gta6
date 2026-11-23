// Golden-hour sunset sky dome, sun disc, sandy beach, and animated ocean waves
import { PALETTE, WORLD_CONFIG } from '../core/config.js';

export function buildOceanAndSky(scene) {
  const THREE = window.THREE;
  const group = new THREE.Group();

  // Golden-hour gradient canvas texture for sky dome
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 64;
  skyCanvas.height = 256;
  const ctx = skyCanvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0.0, '#0f0c29');
  grad.addColorStop(0.32, '#4a194d');
  grad.addColorStop(0.58, '#b8326a');
  grad.addColorStop(0.78, '#ff6e40');
  grad.addColorStop(0.94, '#ffbf46');
  grad.addColorStop(1.0, '#1a2844');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 256);

  const skyTex = new THREE.CanvasTexture(skyCanvas);
  const skyGeo = new THREE.SphereGeometry(1400, 32, 24);
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false });
  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  group.add(skyDome);

  // Glowing sunset sun disc + halo on horizon
  const sunGeo = new THREE.CircleGeometry(78, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffdf70, transparent: true, opacity: 0.92 });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.position.set(420, 145, -780);
  sunMesh.lookAt(0, 10, 0);
  group.add(sunMesh);

  const haloGeo = new THREE.CircleGeometry(155, 32);
  const haloMat = new THREE.MeshBasicMaterial({ color: 0xff5a79, transparent: true, opacity: 0.35 });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.position.set(422, 145, -785);
  haloMesh.lookAt(0, 10, 0);
  group.add(haloMesh);

  // Base urban ground plane
  const groundGeo = new THREE.PlaneGeometry(2400, 2400);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x161923, roughness: 0.85, metalness: 0.1 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  ground.receiveShadow = true;
  group.add(ground);

  // Sandy coastal beach strip along eastern Solana Strip
  const beachGeo = new THREE.PlaneGeometry(WORLD_CONFIG.beachWidth, 2200, 8, 32);
  const beachMat = new THREE.MeshStandardMaterial({
    color: PALETTE.sandGold,
    roughness: 0.9,
    metalness: 0.05,
  });
  const beach = new THREE.Mesh(beachGeo, beachMat);
  beach.rotation.x = -Math.PI / 2;
  beach.position.set(WORLD_CONFIG.oceanX - WORLD_CONFIG.beachWidth * 0.5, 0.02, 0);
  group.add(beach);

  // Shimmering ocean water mesh
  const waterGeo = new THREE.PlaneGeometry(900, 2400, 28, 60);
  const waterMat = new THREE.MeshStandardMaterial({
    color: PALETTE.oceanShallow,
    emissive: 0x052844,
    roughness: 0.18,
    metalness: 0.72,
    transparent: true,
    opacity: 0.94,
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(WORLD_CONFIG.oceanX + 450, -0.15, 0);
  group.add(water);

  // Lighting: warm golden directional sunlight + twilight hemisphere light
  const hemiLight = new THREE.HemisphereLight(0xff9a6c, 0x1a2642, 0.85);
  group.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xffb86b, 1.25);
  sunLight.position.set(220, 180, -260);
  group.add(sunLight);

  scene.add(group);

  return {
    water,
    update(time) {
      const pos = water.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        const wave = Math.sin(vx * 0.06 + time * 2.2) * 0.25 + Math.cos(vy * 0.04 + time * 1.7) * 0.2;
        pos.setZ(i, wave);
      }
      pos.needsUpdate = true;
    },
  };
}
