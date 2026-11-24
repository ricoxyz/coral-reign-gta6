// Cinematic Camera & Tactical Scenario Director for CORAL REIGN: Palma Dorada
export const CAMERA_MODES=[
 ['chase_dynamic','DYNAMIC PURSUIT',62,11.2,3.9,0,0],['chase_low','STREET DRIFT',66,9.4,2.75,0,0],
 ['tactical_ots','OVER-THE-SHOULDER',58,0,0,4.8,2.15],['skyline_orbit','CINEMATIC SKYLINE',60,15.5,6.4,0,0],
].map(([id,label,fov,distDrive,heightDrive,distFoot,heightFoot])=>({id,label,fov,distDrive,heightDrive,...(distFoot?{distFoot,heightFoot}:{})}));

export function initCameraDirector(state,systems){
 state.cameraModeIndex=0;
 const api={cycleMode:()=>cycleCameraMode(state),applyPreset:(p,c=1)=>applyDirectorPreset(state,systems,p,c),stageEncounter:(z)=>stageTacticalEncounter(state,systems,z),updateFraming:(cam,dt)=>updateCinematicFraming(cam,state,dt)};
 window.__CORAL_DIRECTOR__=window.__CORAL_SHOT__=api;
 const q=new URLSearchParams(window.location.search),preset=q.get('shot')||q.get('preset');
 if(preset)applyDirectorPreset(state,systems,preset,Number(q.get('cam')||'1'));
 return api;
}

export function cycleCameraMode(state){
 state.cameraModeIndex=((state.cameraModeIndex||0)+1)%CAMERA_MODES.length;
 state.customCamera=null;return CAMERA_MODES[state.cameraModeIndex];
}

export function updateCinematicFraming(camera,state,dt){
 const md=CAMERA_MODES[state.cameraModeIndex||0]||CAMERA_MODES[0];
 if(camera&&Math.abs(camera.fov-md.fov)>.1){camera.fov+=(md.fov-camera.fov)*Math.min(1,dt*6);camera.updateProjectionMatrix();}
}

export function stageTacticalEncounter(state,systems,id='palma_pier_ambush'){
 const byId=(k)=>state.entities.vehicles.find((v)=>v.id===k);
 const hero=byId('player_car'),peds=state.entities.pedestrians||[],cb=systems.combat,hl=systems.helicopter;
 systems.world?.oceanSky?.setAtmosphere?.(id==='palma_pier_ambush'?'twilight':'sunset');

 if(id==='ocean_drive_pursuit'){
  state.mode='play';state.clockHour=18.65;state.wanted.stars=4;
  Object.assign(state.player,{inVehicle:true,vehicleId:'player_car',x:219.8,z:34});
  if(hero)Object.assign(hero,{x:219.8,z:34,rotY:Math.PI+.34,driftAngle:-.06,speed:32.8,mph:118,gear:5,rpm:86,hp:86,isPlayerControlled:false});
  cb?.spawnDriftEffects(219.8,34,Math.PI+.28);
  [['mission_convoy',219,-14,Math.PI,0],['police_1',214.1,27.6,Math.PI+.18,0],['police_2',224.8,28.2,Math.PI-.26,0],['police_3',216.4,7.8,Math.PI*.38,0],['police_4',222.8,5.4,-Math.PI*.36,0],['traffic_0',214,-4.5,Math.PI,0],['traffic_1',227.2,11.5,0,0],['traffic_2',210.5,13.5,.68,1],['traffic_3',225.4,-8.5,0,0]].forEach(([vid,x,z,rotY,wr])=>{
   const v=byId(vid);if(v)Object.assign(v,{x,z,rotY,wrecked:Boolean(wr),...(wr?{speed:0,tiltZ:.11,tiltX:-.05}:{})});
  });
  if(cb){
   cb.spawnExplosion(210.5,.85,13.5,1.55);
   cb.spawnMuzzleBurst(215.35,1.28,28.2,218.8,1.15,32.4,1.15);cb.spawnTracer(215.35,1.28,28.2,218.8,1.15,32.6,0xffc845);
   cb.spawnMuzzleBurst(223.55,1.28,28.8,220.6,1.18,32.6,1.15);cb.spawnTracer(223.55,1.28,28.8,220.6,1.18,32.8,0xffae2b);
   cb.spawnTracer(224,1.25,26.8,219.6,1.2,9.5,0xffd25a);
  }
  [[234.2,27.5,.4],[238.5,22,-.35],[241.5,16.5,.25],[236,12,-.45],[244,9.5,.2],[206.8,25.5,-.15]].forEach(([x,z,rotY],i)=>{if(peds[i])Object.assign(peds[i],{x,z,rotY,fleeing:i===5});});
  if(hl){hl.heli.position.set(215.6,12.6,12);hl.heli.lookAt(198,5.5,24);hl.heli.rotation.z-=.08;hl.groundPool.position.set(219.8,.14,33.8);hl.alignSpotlightToPool?.();}
 }else if(id==='palma_pier_ambush'){
  state.mode='play';state.clockHour=20.75;state.wanted.stars=2;
  Object.assign(state.player,{inVehicle:false,vehicleId:null,x:218.2,z:373.5,rotY:Math.PI+.18,aiming:true,muzzleTimer:10});
  if(hero)Object.assign(hero,{x:225.2,z:365.4,rotY:Math.PI-.52,isPlayerControlled:false});
  [['police_1',213.8,346.5,.28],['police_2',226,345.8,-.32]].forEach(([vid,x,z,rotY])=>{const v=byId(vid);if(v)Object.assign(v,{x,z,rotY});});
  const suv=state.entities.vehicles.find((v)=>v.archetypeId==='mercado_4x4');
  if(suv)Object.assign(suv,{x:210.4,z:357.2,rotY:.68,isPlayerControlled:false,wrecked:true,tiltZ:-.09,tiltX:.04,speed:0});
  const ens=state.entities.enemies||[];
  [[217.6,367.4,true,0],[214.2,362.5,false,58],[218.8,361.8,false,72],[222.8,363.2,false,44],[216.6,358.2,false,85],[220.8,357.8,false,90]].forEach(([x,z,downed,hp],i)=>{
   if(ens[i])Object.assign(ens[i],{x,z,downed,hp,alive:!downed,rotY:downed?.9:Math.atan2(218.2-x,373.5-z)});
  });
  [[207.4,369.5,.25],[230.6,366,-.25],[207.8,358,.18],[231.2,356.5,-.2]].forEach(([x,z,rotY],i)=>{if(peds[i])Object.assign(peds[i],{x,z,rotY,fleeing:true});});
  if(cb){
   cb.spawnTracer(217.8,1.38,372.5,218.8,1.32,361.8,0xffd25a);cb.spawnTracer(214.1,1.24,367.8,214.2,1.34,362.5,0xffc845);cb.spawnTracer(222.8,1.36,363.2,218.5,1.42,372.2,0xff7e24);
  }
  state.dialogue.speaker='VALERIA · TACTICAL LEAD';
  state.dialogue.line='"Enforcer down at the night market! Pin the syndicate guards and grab the Coral Vortex GT ([F])!"';
 }
}

export function applyDirectorPreset(state,systems,shot,cam=1){
 state.activeShot=shot;
 const atmos=(m)=>systems.world?.oceanSky?.setAtmosphere?.(m);
 if(shot==='cover'||shot==='play'){
  stageTacticalEncounter(state,systems,'ocean_drive_pursuit');
  state.customCamera=cam===2?{x:217,y:2.25,z:41,lookX:219.5,lookY:2.95,lookZ:-12}:{x:222.2,y:2.26,z:41.2,lookX:215.8,lookY:2.95,lookZ:-12};
 }else if(shot==='combat'||shot==='end'){
  stageTacticalEncounter(state,systems,'palma_pier_ambush');
  state.customCamera={x:219.55,y:1.52,z:376.35,lookX:216,lookY:1.42,lookZ:358};
 }else if(shot==='map'){
  atmos('sunset');state.mode='pause_map';
  const hero=state.entities.vehicles.find((v)=>v.id==='player_car');
  if(hero)Object.assign(hero,{x:220,z:110,isPlayerControlled:false});
  state.player.x=220;state.player.z=110;state.customCamera={x:92,y:28,z:95,lookX:150,lookY:6,lookZ:-35};
 }else if(shot==='title'||shot==='start'){
  atmos('sunset');state.mode='title';state.wanted.stars=2;state.customCamera={x:114.5,y:5.8,z:72,lookX:54,lookY:31,lookZ:-175};
 }
}
