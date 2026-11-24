// Fixed-timestep simulation & chase/aim camera controller for CORAL REIGN
export class GameLoop {
 constructor(state, updateFn, renderFn) { this.state = state; this.updateFn = updateFn; this.renderFn = renderFn; this.lastTime = performance.now(); this.running = false; }
 start() {
  this.running = true; this.lastTime = performance.now();
  const tick = (now) => {
   if (!this.running) return;
   const dt = Math.min(.05, Math.max(.001, (now - this.lastTime) / 1000));
   this.lastTime = now; this.step(dt); requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
 }
 step(dt) {
  if (this.state.mode === 'play') { this.state.time += dt; this.state.clockHour = (this.state.clockHour + dt * .008) % 24; this.updateFn(dt); }
  this.renderFn(dt);
 }
}

export function updateThirdPersonCamera(camera, state, vehicles) {
 if (state.customCamera) {
  camera.position.set(state.customCamera.x, state.customCamera.y, state.customCamera.z);
  camera.lookAt(state.customCamera.lookX, state.customCamera.lookY, state.customCamera.lookZ); return;
 }
 const p = state.player;
 let tx = p.x, ty = p.y + 1.8, tz = p.z, heading = p.rotY + state.input.cameraYaw;
 const dist = p.inVehicle ? 11.5 : p.aiming ? 4.8 : 6.8, height = p.inVehicle ? 4.2 : p.aiming ? 2.1 : 2.9;
 if (p.inVehicle) {
  const car = vehicles.find((v) => v.id === p.vehicleId);
  if (car) { tx = car.x; ty = car.y + 1.5; tz = car.z; heading = car.rotY + state.input.cameraYaw * .5; }
 }
 camera.position.lerp(new window.THREE.Vector3(tx - Math.sin(heading) * dist, ty + height, tz - Math.cos(heading) * dist), .18);
 camera.lookAt(tx + Math.sin(heading) * 8, ty + .6, tz + Math.cos(heading) * 8);
}
