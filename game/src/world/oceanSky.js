// Sun-soaked golden-hour tropical sky dome, radiant sun disc, golden beach, surf foam, and sparkling turquoise ocean
import { PALETTE, WORLD_CONFIG } from '../core/config.js';

export function buildOceanAndSky(scene) {
  const THREE = window.THREE;
  const group = new THREE.Group();

  // Bright, luminous golden-hour tropical sky gradient (azure -> sky blue -> warm peach -> apricot -> sunlit gold)
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 512;
  skyCanvas.height = 512;
  const ctx = skyCanvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, '#1e69c6');
  grad.addColorStop(0.20, '#3e92e6');
  grad.addColorStop(0.36, '#7dc4f7');
  grad.addColorStop(0.45, '#ffbe8a');
  grad.addColorStop(0.50, '#ffe39f');
  grad.addColorStop(0.55, '#ffd88a');
  grad.addColorStop(1.0, '#5ea9d6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Soft sunlit cumulus and golden-peach cirrus cloud bands above the horizon
  for (let i = 0; i < 28; i++) {
    const cx = (i * 73) % 512;
    const cy = 155 + (i % 7) * 14;
    const cw = 75 + (i % 5) * 32;
    const ch = 12 + (i % 3) * 6;
    const cGrad = ctx.createRadialGradient(cx, cy, 3, cx, cy, cw);
    cGrad.addColorStop(0, 'rgba(255, 250, 232, 0.72)');
    cGrad.addColorStop(0.5, 'rgba(255, 210, 158, 0.42)');
    cGrad.addColorStop(1, 'rgba(255, 190, 140, 0)');
    ctx.fillStyle = cGrad;
    ctx.fillRect(cx - cw, cy - ch, cw * 2, ch * 2);
  }

  const skyTex = new THREE.CanvasTexture(skyCanvas);
  const skyGeo = new THREE.SphereGeometry(1450, 36, 24);
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false, fog: false });
  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  group.add(skyDome);

  // Radiant golden-hour sun + warm atmospheric bloom halo
  const sunTexCanvas = document.createElement('canvas');
  sunTexCanvas.width = 256;
  sunTexCanvas.height = 256;
  const sctx = sunTexCanvas.getContext('2d');
  const sGrad = sctx.createRadialGradient(128, 128, 16, 128, 128, 126);
  sGrad.addColorStop(0.0, 'rgba(255, 255, 242, 1.0)');
  sGrad.addColorStop(0.28, 'rgba(255, 236, 150, 0.96)');
  sGrad.addColorStop(0.56, 'rgba(255, 180, 92, 0.58)');
  sGrad.addColorStop(0.82, 'rgba(255, 140, 82, 0.22)');
  sGrad.addColorStop(1.0, 'rgba(255, 140, 82, 0.0)');
  sctx.fillStyle = sGrad;
  sctx.fillRect(0, 0, 256, 256);

  const sunSpriteMat = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(sunTexCanvas),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
  });
  const sunGlow = new THREE.Mesh(new THREE.PlaneGeometry(360, 360), sunSpriteMat);
  sunGlow.position.set(275, 76, -540);
  sunGlow.lookAt(110, 12, 40);
  group.add(sunGlow);

  // Sun-warmed urban ground plane (no dark black terrain)
  const groundGeo = new THREE.PlaneGeometry(2400, 2400);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x767d8a, roughness: 0.85, metalness: 0.05 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.06;
  group.add(ground);

  // Vivid golden-sand coastal beach strip along eastern Solana Strip
  const beachGeo = new THREE.PlaneGeometry(WORLD_CONFIG.beachWidth + 24, 2200, 8, 32);
  const beachMat = new THREE.MeshStandardMaterial({
    color: 0xe8b86d,
    roughness: 0.82,
    metalness: 0.04,
  });
  const beach = new THREE.Mesh(beachGeo, beachMat);
  beach.rotation.x = -Math.PI / 2;
  beach.position.set(WORLD_CONFIG.oceanX - WORLD_CONFIG.beachWidth * 0.45, 0.03, 0);
  group.add(beach);

  // Crisp white coastal surf foam band along shoreline
  const surfMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.85,
  });
  const surf = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 2200), surfMat);
  surf.rotation.x = -Math.PI / 2;
  surf.position.set(WORLD_CONFIG.oceanX + 1.5, 0.05, 0);
  group.add(surf);

  // Shallow turquoise lagoon band right off the beach
  const lagoon = new THREE.Mesh(
    new THREE.PlaneGeometry(45, 2200),
    new THREE.MeshBasicMaterial({ color: 0x00c2d1, transparent: true, opacity: 0.72 })
  );
  lagoon.rotation.x = -Math.PI / 2;
  lagoon.position.set(WORLD_CONFIG.oceanX + 24, 0.01, 0);
  group.add(lagoon);

  // Sparkling turquoise-azure ocean water mesh with golden sun reflection
  const waterGeo = new THREE.PlaneGeometry(960, 2400, 32, 64);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0088b8,
    emissive: 0x043d5e,
    roughness: 0.18,
    metalness: 0.55,
    transparent: true,
    opacity: 0.96,
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(WORLD_CONFIG.oceanX + 480, -0.10, 0);
  group.add(water);

  // Shimmering golden sun-reflection path across the turquoise waves
  const sunPathCanvas = document.createElement('canvas');
  sunPathCanvas.width = 128;
  sunPathCanvas.height = 512;
  const spCtx = sunPathCanvas.getContext('2d');
  const spGrad = spCtx.createLinearGradient(0, 0, 128, 0);
  spGrad.addColorStop(0.0, 'rgba(255, 224, 120, 0)');
  spGrad.addColorStop(0.5, 'rgba(255, 244, 168, 0.65)');
  spGrad.addColorStop(1.0, 'rgba(255, 224, 120, 0)');
  spCtx.fillStyle = spGrad;
  spCtx.fillRect(0, 0, 128, 512);
  const sunPath = new THREE.Mesh(
    new THREE.PlaneGeometry(115, 1400),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(sunPathCanvas),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  sunPath.rotation.x = -Math.PI / 2;
  sunPath.rotation.z = -0.14;
  sunPath.position.set(WORLD_CONFIG.oceanX + 140, 0.04, -180);
  group.add(sunPath);

  // Bright Sun-Soaked Lighting: calibrated ambient + warm golden directional sun + tropical fill (rich pastel depth, zero washout!)
  const ambientLight = new THREE.AmbientLight(0xffe9c8, 0.35);
  group.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xffdca8, 0x3b668c, 0.72);
  group.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xffb866, 0.95);
  sunLight.position.set(280, 190, -340);
  group.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0x68c4f0, 0.38);
  fillLight.position.set(-240, 140, 280);
  group.add(fillLight);

  scene.add(group);

  return {
    water,
    surf,
    sunGlow,
    update(time) {
      const pos = water.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        const wave = Math.sin(vx * 0.06 + time * 2.2) * 0.25 + Math.cos(vy * 0.04 + time * 1.7) * 0.2;
        pos.setZ(i, wave);
      }
      pos.needsUpdate = true;
      surf.position.x = WORLD_CONFIG.oceanX + 1.5 + Math.sin(time * 1.6) * 0.9;
    },
  };
}
