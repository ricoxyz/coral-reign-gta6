// Fixed-timestep simulation & chase/aim camera controller for CORAL REIGN
export class GameLoop {
  constructor(state, updateFn, renderFn) {
    this.state = state;
    this.updateFn = updateFn;
    this.renderFn = renderFn;
    this.lastTime = performance.now();
    this.running = false;
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    const tick = (now) => {
      if (!this.running) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - this.lastTime) / 1000));
      this.lastTime = now;
      this.step(dt);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  step(dt) {
    if (this.state.mode === 'play') {
      this.state.time += dt;
      this.state.clockHour = (this.state.clockHour + dt * 0.008) % 24;
      this.updateFn(dt);
    }
    this.renderFn(dt);
  }
}

export function updateThirdPersonCamera(camera, state, vehicles) {
  if (state.customCamera) {
    camera.position.set(state.customCamera.x, state.customCamera.y, state.customCamera.z);
    camera.lookAt(state.customCamera.lookX, state.customCamera.lookY, state.customCamera.lookZ);
    return;
  }

  const p = state.player;
  let targetX = p.x;
  let targetY = p.y + 1.8;
  let targetZ = p.z;
  let heading = p.rotY + state.input.cameraYaw;
  let dist = p.inVehicle ? 11.5 : (p.aiming ? 4.8 : 6.8);
  let height = p.inVehicle ? 4.2 : (p.aiming ? 2.1 : 2.9);

  if (p.inVehicle) {
    const car = vehicles.find((v) => v.id === p.vehicleId);
    if (car) {
      targetX = car.x;
      targetY = car.y + 1.5;
      targetZ = car.z;
      heading = car.rotY + state.input.cameraYaw * 0.5;
    }
  }

  const camX = targetX - Math.sin(heading) * dist;
  const camZ = targetZ - Math.cos(heading) * dist;
  const camY = targetY + height;

  camera.position.lerp(new window.THREE.Vector3(camX, camY, camZ), 0.18);
  camera.lookAt(
    targetX + Math.sin(heading) * 8,
    targetY + 0.6,
    targetZ + Math.cos(heading) * 8
  );
}
