// Golden-hour sunset sky dome, sun disc, sandy beach, surf foam, and animated ocean waves
import { PALETTE, WORLD_CONFIG } from '../core/config.js';

export function buildOceanAndSky(scene) {
  const THREE = window.THREE;
  const group = new THREE.Group();

  // Golden-hour gradient + painted sunset cloud streaks for sky dome
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 256;
  skyCanvas.height = 512;
  const ctx = skyCanvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, '#0e102e');
  grad.addColorStop(0.28, '#381957');
  grad.addColorStop(0.48, '#8d2a64');
  grad.addColorStop(0.66, '#eb5463');
  grad.addColorStop(0.80, '#ff8d45');
  grad.addColorStop(0.91, '#ffd466');
  grad.addColorStop(1.0, '#1f2948');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  // Soft golden & coral cloud bands near the horizon
  for (let i = 0; i < 18; i++) {
    const cx = (i * 47) % 256;
    const cy = 260 + (i % 6) * 26;
    const cw = 65 + (i % 4) * 28;
    const ch = 6 + (i % 3) * 4;
    const cGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, cw);
    cGrad.addColorStop(0, 'rgba(255, 224, 148, 0.34)');
    cGrad.addColorStop(0.55, 'rgba(255, 118, 128, 0.18)');
    cGrad.addColorStop(1, 'rgba(255, 118, 128, 0)');
    ctx.fillStyle = cGrad;
    ctx.fillRect(cx - cw, cy - ch, cw * 2, ch * 2);
  }

  const skyTex = new THREE.CanvasTexture(skyCanvas);
  const skyGeo = new THREE.SphereGeometry(1450, 36, 24);
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false, fog: false });
  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  group.add(skyDome);

  // Radiant low-horizon sunset sun + layered atmospheric halo
  const sunTexCanvas = document.createElement('canvas');
  sunTexCanvas.width = 256;
  sunTexCanvas.height = 256;
  const sctx = sunTexCanvas.getContext('2d');
  const sGrad = sctx.createRadialGradient(128, 128, 12, 128, 128, 126);
  sGrad.addColorStop(0.0, 'rgba(255, 252, 220, 1.0)');
  sGrad.addColorStop(0.26, 'rgba(255, 214, 102, 0.95)');
  sGrad.addColorStop(0.50, 'rgba(255, 110, 72, 0.55)');
  sGrad.addColorStop(0.78, 'rgba(255, 64, 129, 0.2)');
  sGrad.addColorStop(1.0, 'rgba(255, 64, 129, 0.0)');
  sctx.fillStyle = sGrad;
  sctx.fillRect(0, 0, 256, 256);

  const sunSpriteMat = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(sunTexCanvas),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
  });
  const sunGlow = new THREE.Mesh(new THREE.PlaneGeometry(340, 340), sunSpriteMat);
  sunGlow.position.set(270, 56, -540);
  sunGlow.lookAt(110, 10, 40);
  group.add(sunGlow);

  // Base urban ground plane
  const groundGeo = new THREE.PlaneGeometry(2400, 2400);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x1a1e2b, roughness: 0.88, metalness: 0.08 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.06;
  group.add(ground);

  // Sandy coastal beach strip along eastern Solana Strip
  const beachGeo = new THREE.PlaneGeometry(WORLD_CONFIG.beachWidth + 14, 2200, 8, 32);
  const beachMat = new THREE.MeshStandardMaterial({
    color: PALETTE.sandGold,
    roughness: 0.88,
    metalness: 0.04,
  });
  const beach = new THREE.Mesh(beachGeo, beachMat);
  beach.rotation.x = -Math.PI / 2;
  beach.position.set(WORLD_CONFIG.oceanX - WORLD_CONFIG.beachWidth * 0.45, 0.02, 0);
  group.add(beach);

  // White coastal surf foam band along shoreline
  const surfMat = new THREE.MeshBasicMaterial({
    color: 0xe8fbff,
    transparent: true,
    opacity: 0.58,
  });
  const surf = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 2200), surfMat);
  surf.rotation.x = -Math.PI / 2;
  surf.position.set(WORLD_CONFIG.oceanX + 1.5, 0.04, 0);
  group.add(surf);

  // Shimmering ocean water mesh with sunset reflection
  const waterGeo = new THREE.PlaneGeometry(960, 2400, 32, 64);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x066c8c,
    emissive: 0x122645,
    roughness: 0.14,
    metalness: 0.82,
    transparent: true,
    opacity: 0.94,
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(WORLD_CONFIG.oceanX + 480, -0.14, 0);
  group.add(water);

  // Golden sun-reflection path across the ocean waves
  const sunPathCanvas = document.createElement('canvas');
  sunPathCanvas.width = 128;
  sunPathCanvas.height = 512;
  const spCtx = sunPathCanvas.getContext('2d');
  const spGrad = spCtx.createLinearGradient(0, 0, 128, 0);
  spGrad.addColorStop(0.0, 'rgba(255, 196, 86, 0)');
  spGrad.addColorStop(0.5, 'rgba(255, 214, 112, 0.45)');
  spGrad.addColorStop(1.0, 'rgba(255, 196, 86, 0)');
  spCtx.fillStyle = spGrad;
  spCtx.fillRect(0, 0, 128, 512);
  const sunPath = new THREE.Mesh(
    new THREE.PlaneGeometry(95, 1300),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(sunPathCanvas),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  sunPath.rotation.x = -Math.PI / 2;
  sunPath.rotation.z = -0.16;
  sunPath.position.set(WORLD_CONFIG.oceanX + 150, 0.03, -180);
  group.add(sunPath);

  // Lighting: warm golden directional sunlight + twilight hemisphere + cool neon fill
  const hemiLight = new THREE.HemisphereLight(0xffb485, 0x202d4f, 1.05);
  group.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xffb86b, 1.45);
  sunLight.position.set(270, 120, -480);
  group.add(sunLight);

  const rimLight = new THREE.DirectionalLight(0x5588ff, 0.45);
  rimLight.position.set(-220, 90, 240);
  group.add(rimLight);

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
