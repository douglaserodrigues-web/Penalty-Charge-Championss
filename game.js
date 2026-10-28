import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
const $=id=>document.getElementById(id),scene=new THREE.Scene();scene.background=new THREE.Color(0x86b8df);scene.fog=new THREE.Fog(0x86b8df,110,250);
const camera=new THREE.PerspectiveCamera(57,innerWidth/innerHeight,.1,500);camera.position.set(0,2.9,17);camera.lookAt(0,1.3,-8);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.5;document.body.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff,0x395c3d,2.5));const sun=new THREE.DirectionalLight(0xffffff,3);sun.position.set(-20,35,22);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-30;sun.shadow.camera.right=30;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-30;scene.add(sun);
const mat=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.85});const turf=mat(0x238746),white=new THREE.MeshBasicMaterial({color:0xf7f7ee});
const pitch=new THREE.Mesh(new THREE.PlaneGeometry(90,110),turf);pitch.rotation.x=-Math.PI/2;pitch.receiveShadow=true;scene.add(pitch);
// Faixas do gramado e linha central
for(let z=-52;z<55;z+=9){const stripe=new THREE.Mesh(new THREE.PlaneGeometry(90,4.5),new THREE.MeshBasicMaterial({color:0x6cc86c,transparent:true,opacity:.12,depthWrite:false}));stripe.rotation.x=-Math.PI/2;stripe.position.set(0,.007,z);scene.add(stripe)}
// Holofotes, publicidade e torcida estilizada, com geometria leve
function addAtmosphere(){const adColors=[0x0b263d,0x104d42,0x194a79];for(let i=0;i<26;i++){const z=-43+i*3.4;for(const x of [-41,41]){const board=new THREE.Mesh(new THREE.BoxGeometry(.22,1.15,3.2),new THREE.MeshBasicMaterial({color:adColors[i%3]}));board.position.set(x,.62,z);scene.add(board)}}for(const x of [-34,34])for(const z of [-33,33]){const pole=new THREE.Mesh(new THREE.CylinderGeometry(.13,.2,19,8),mat(0x69777c));pole.position.set(x,9.5,z);scene.add(pole);const lamp=new THREE.Mesh(new THREE.BoxGeometry(5,.8,1.4),new THREE.MeshBasicMaterial({color:0xfff7d5}));lamp.position.set(x,19,z);scene.add(lamp);const glow=new THREE.PointLight(0xffffff,18,75,2);glow.position.set(x,18,z);scene.add(glow)}}addAtmosphere();
// Detalhes visuais leves: faixas, refletores, público instanciado e telões.
const detailGroup=new THREE.Group();scene.add(detailGroup);
const grassA=new THREE.MeshStandardMaterial({color:0x226f3b,roughness:1});
const grassB=new THREE.MeshStandardMaterial({color:0x2d914c,roughness:1});
for(let i=0;i<12;i++){
 const strip=new THREE.Mesh(new THREE.PlaneGeometry(89.8,9.1),i%2?grassA:grassB);
 strip.rotation.x=-Math.PI/2;strip.position.set(0,.009,-50+i*9.1);strip.receiveShadow=true;detailGroup.add(strip);
}
// Círculo da marca de pênalti e arco.
const dot=new THREE.Mesh(new THREE.CircleGeometry(.11,24),new THREE.MeshBasicMaterial({color:0xffffff}));dot.rotation.x=-Math.PI/2;dot.position.set(0,.031,11);detailGroup.add(dot);
const arcPoints=[];for(let i=0;i<=40;i++){let a=Math.PI*.18+i/40*Math.PI*.64;arcPoints.push(new THREE.Vector3(Math.cos(a)*9.15,.035,11-Math.sin(a)*9.15));}
detailGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(arcPoints),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.65})));
// Público com InstancedMesh: milhares de pessoas, poucas draw calls.
const crowdGeo=new THREE.IcosahedronGeometry(.18,0);
const crowdMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.85});
const crowd=new THREE.InstancedMesh(crowdGeo,crowdMat,3200);crowd.instanceMatrix.setUsage(THREE.StaticDrawUsage);
const dummy=new THREE.Object3D();const colors=[0xe8f5ef,0x19b86c,0x17475a,0xf0cf63,0x86c9ff,0x15252e];
for(let i=0;i<3200;i++){
 const side=i%4;const row=Math.floor(i/4)%22;const pos=(i*0.61803398875%1-.5)*88;
 if(side<2){dummy.position.set(pos,1.05+row*.38,side===0?-48-row*.75:48+row*.75)}
 else{dummy.position.set(side===2?-49-row*.75:49+row*.75,1.05+row*.38,pos)}
 dummy.scale.setScalar(.75+(i%7)*.055);dummy.updateMatrix();crowd.setMatrixAt(i,dummy.matrix);crowd.setColorAt(i,new THREE.Color(colors[i%colors.length]));
}crowd.instanceMatrix.needsUpdate=true;detailGroup.add(crowd);
const bannerMat=new THREE.MeshBasicMaterial({color:0x0a2333});
for(const x of [-28,28]){const sign=new THREE.Mesh(new THREE.BoxGeometry(12,3,.35),bannerMat);sign.position.set(x,11,-55);detailGroup.add(sign)}
const rimLight=new THREE.DirectionalLight(0xb1d9ff,1.1);rimLight.position.set(12,18,-15);scene.add(rimLight);

function line(x1,z1,x2,z2){const len=Math.hypot(x2-x1,z2-z1);const o=new THREE.Mesh(new THREE.PlaneGeometry(.11,len),white);o.rotation.x=-Math.PI/2;o.rotation.z=-Math.atan2(x2-x1,z2-z1);o.position.set((x1+x2)/2,.018,(z1+z2)/2);scene.add(o)}
// Trave: largura 7.32m, altura 2.44m, linha do gol em z=-8.
const GOALZ=-8,HALFW=3.66,H=2.44;
function bar(x,y,z,sx,sy,sz){const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat(0xffffff));o.position.set(x,y,z);o.castShadow=true;scene.add(o)}
bar(-HALFW,H/2,GOALZ,.13,H,.13);bar(HALFW,H/2,GOALZ,.13,H,.13);bar(0,H,GOALZ,HALFW*2+.13,.13,.13);
const netMat=new THREE.LineBasicMaterial({color:0xd5e8de,transparent:true,opacity:.5});for(let i=0;i<=20;i++){let x=-HALFW+i*HALFW*2/20;let p=[new THREE.Vector3(x,0,GOALZ),new THREE.Vector3(x,H,GOALZ),new THREE.Vector3(x,H,GOALZ-1.7),new THREE.Vector3(x,0,GOALZ-1.7)];scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p),netMat))}for(let i=0;i<=9;i++){let y=i*H/9;scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-HALFW,y,GOALZ),new THREE.Vector3(HALFW,y,GOALZ),new THREE.Vector3(HALFW,y,GOALZ-1.7),new THREE.Vector3(-HALFW,y,GOALZ-1.7)]),netMat))}
line(-HALFW,GOALZ,HALFW,GOALZ);line(-8.5,GOALZ,-8.5,8);line(8.5,GOALZ,8.5,8);line(-8.5,8,8.5,8);
const ballGroup=new THREE.Group();scene.add(ballGroup);let ballVisual=new THREE.Mesh(new THREE.SphereGeometry(.22,24,16),mat(0xffffff));ballGroup.add(ballVisual);ballGroup.position.set(0,.22,11);
let keeper=new THREE.Group();scene.add(keeper);keeper.position.set(0,0,GOALZ+1.2);let keeperVisual=new THREE.Mesh(new THREE.CapsuleGeometry(.37,1.12,8,16),mat(0xffa126));keeperVisual.position.y=1;keeper.add(keeperVisual);
let difficulty='normal',gameMode='classic',round=1,points=0,maxShots=5;let mixer=null,actions={},currentAction=null;const clock=new THREE.Clock();let ready=false,playing=false,shots=0,goals=0,charging=false,power=.35,chargeDir=1,aimX=0,aimY=1.2,flight=null,resetAt=0,saveSide=0;
function status(t){$('status').textContent=t}function normalizeModel(model,maxDim){model.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(model),s=new THREE.Vector3();b.getSize(s);const scale=maxDim/Math.max(s.x,s.y,s.z,1e-5);model.scale.multiplyScalar(scale);model.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(model);model.position.y-=bb.min.y;return model}
const gltf=new GLTFLoader(),fbx=new FBXLoader();const loadGLB=url=>new Promise((resolve,reject)=>gltf.load(url,resolve,undefined,reject));const loadFBX=url=>new Promise((resolve,reject)=>fbx.load(url,resolve,undefined,reject));
async function loadAssets(){const notes=[];status('Carregando bola...');try{const g=await loadGLB('./jogo%203d/bola/ball.glb');ballGroup.remove(ballVisual);ballVisual=normalizeModel(g.scene,.44);ballGroup.add(ballVisual);notes.push('Bola 3D ✓')}catch(e){console.warn('Bola:',e);notes.push('Bola substituta ✓')}
status('Carregando goleiro...');try{const model=await loadFBX('./goleiro/Ch31_nonPBR.fbx');keeper.remove(keeperVisual);keeperVisual=normalizeModel(model,1.9);keeper.add(keeperVisual);keeperVisual.traverse(o=>{if(o.isMesh){o.castShadow=true;o.frustumCulled=false}});mixer=new THREE.AnimationMixer(keeperVisual);notes.push('Goleiro 3D ✓');for(const [key,name] of Object.entries({idle:'Goalkeeper Idle.fbx',dive:'Goalkeeper Diving Save.fbx',catch:'Goalkeeper Catch.fbx'})){try{const anim=await loadFBX('./goleiro/'+name);if(anim.animations.length){
const clip=anim.animations[0].clone();
// Root motion do Mixamo desloca o goleiro e causa flutuação.
clip.tracks=clip.tracks.filter(t=>!(t.name.toLowerCase().includes('hips.position')||t.name.toLowerCase().includes('root.position')));
actions[key]=mixer.clipAction(clip);
}}catch(e){console.warn('Animação',name,e)}}playAnim('idle')}catch(e){console.warn('Goleiro:',e);notes.push('Goleiro substituto ✓')}
status('Montando arquibancadas 3D...');
// Arquibancadas geradas fora do campo: não obstruem câmera nem traves.
const standMat=mat(0x294a58),seatMats=[mat(0x1b6380),mat(0x257d65),mat(0xe4e8e9)];
function stand(x,z,w,d,rows,rotation=0){
 const group=new THREE.Group();group.position.set(x,0,z);group.rotation.y=rotation;
 for(let i=0;i<rows;i++){
  const step=new THREE.Mesh(new THREE.BoxGeometry(w,.45,d/rows),standMat);
  step.position.set(0,.22+i*.42,-d/2+(i+.5)*d/rows);group.add(step);
  const seat=new THREE.Mesh(new THREE.BoxGeometry(w,.13,d/rows*.76),seatMats[i%seatMats.length]);
  seat.position.set(0,.51+i*.42,step.position.z);group.add(seat);
 }
 scene.add(group);
}
stand(0,-46,88,24,15);stand(0,46,88,24,15,Math.PI);
stand(-48,0,110,20,12,-Math.PI/2);stand(48,0,110,20,12,Math.PI/2);
const flood=new THREE.AmbientLight(0xffffff,.35);scene.add(flood);
notes.push('Arquibancadas 3D sem obstruções ✓');
ready=true;$('start').disabled=false;$('start').textContent='INICIAR PARTIDA';status(notes.join(' · ')+'\nPronto para jogar!')}
function playAnim(name){if(!mixer||!actions[name])return;if(currentAction&&currentAction!==actions[name])currentAction.fadeOut(.15);currentAction=actions[name];currentAction.reset().fadeIn(.15).play()}
function updateScore(){$('score').textContent=`GOLS ${goals} · CHUTES ${shots}/${maxShots}`+(gameMode==='precision'?` · PONTOS ${points}`:'')+(gameMode==='cup'?` · RODADA ${round}/3`:'')}
function message(s){$('message').textContent=s}
function resetBall(){flight=null;ballGroup.position.set(0,.22,11);ballGroup.rotation.set(0,0,0);keeper.position.x=0;keeper.position.y=0;keeper.rotation.set(0,0,0);keeperVisual.rotation.set(0,0,0);playAnim('idle');message('');if(shots>=maxShots){if(gameMode==='cup'&&round<3&&goals>=2){round++;shots=0;goals=0;difficulty=round===2?'normal':'hard';updateScore();message('CLASSIFICADO!');return;}playing=false;$('overlay').style.display='grid';$('panel').querySelector('h1').textContent=`FIM DE JOGO · ${goals}/${maxShots} GOLS`+(gameMode==='cup'?` · ${round===3&&goals>=2?'CAMPEÃO! 🏆':'ELIMINADO'}`:gameMode==='precision'?` · ${points} PONTOS`:'');$('start').textContent='JOGAR NOVAMENTE';status('Clique para tentar outra vez!')}}
function shoot(){if(!playing||flight||shots>=maxShots)return;shots++;updateScore();const strength=Math.max(.25,power);const targetX=aimX;const targetY=aimY;saveSide=(Math.random()<.5?-1:1);flight={t:0,duration:1.1-strength*.38,start:ballGroup.position.clone(),target:new THREE.Vector3(targetX,targetY,GOALZ-.7),strength,decided:false};playAnim('idle');}
// A mira corresponde às coordenadas do gol projetadas na tela.
const aimWorld=new THREE.Vector3();
function updateAimMarker(){
 aimWorld.set(aimX,aimY,GOALZ+.1).project(camera);
 $('aim').style.left=((aimWorld.x+1)*50)+'%';
 $('aim').style.top=((1-aimWorld.y)*50)+'%';
 $('aim').title=`Mira: ${aimX.toFixed(1)}m / ${aimY.toFixed(1)}m`;
}
function pointerAim(e){
 if(!playing||flight)return;
 const rect=renderer.domElement.getBoundingClientRect();
 const nx=((e.clientX-rect.left)/rect.width)*2-1;
 const ny=1-((e.clientY-rect.top)/rect.height)*2;
 const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(nx,ny),camera);
 const goalPlane=new THREE.Plane(new THREE.Vector3(0,0,1),-GOALZ);
 const hit=new THREE.Vector3();
 if(ray.ray.intersectPlane(goalPlane,hit)){
  aimX=THREE.MathUtils.clamp(hit.x,-HALFW+.24,HALFW-.24);
  aimY=THREE.MathUtils.clamp(hit.y,.3,H-.18);
  updateAimMarker();
 }
}
updateAimMarker();
window.addEventListener('pointermove',pointerAim);window.addEventListener('pointerdown',e=>{if(e.target.closest('button,select,label,#overlay'))return;if(playing&&!flight)charging=true});window.addEventListener('pointerup',()=>{if(charging){charging=false;shoot()}});window.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();if(!e.repeat&&playing&&!flight)charging=true}if(playing&&!flight&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)){e.preventDefault();aimX=THREE.MathUtils.clamp(aimX+(e.code==='ArrowLeft'?-0.2:e.code==='ArrowRight'?0.2:0),-3.42,3.42);aimY=THREE.MathUtils.clamp(aimY+(e.code==='ArrowDown'?-0.15:e.code==='ArrowUp'?0.15:0),.3,2.26);updateAimMarker()}if(e.code==='KeyR'){shots=0;goals=0;round=1;points=0;updateScore();resetBall()}});window.addEventListener('keyup',e=>{if(e.code==='Space'&&charging){charging=false;shoot()}});
$('start').onclick=()=>{if(!ready)return;difficulty=$('difficulty').value;gameMode=$('gameMode').value;round=1;points=0;maxShots=gameMode==='cup'?5:5;$('mode').textContent=gameMode==='cup'?'🏆 COPA DOS CAMPEÕES':gameMode==='precision'?'🎯 DESAFIO DE PRECISÃO':'🏆 PÊNALTIS CLÁSSICOS';shots=0;goals=0;power=.35;updateScore();playing=true;$('overlay').style.display='none';resetBall();updateAimMarker()};
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);updateAimMarker()});
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);if(mixer)mixer.update(dt);if(charging){power+=dt*chargeDir*.75;if(power>.99){power=.99;chargeDir=-1}if(power<.2){power=.2;chargeDir=1}}$('fill').style.width=Math.round(power*100)+'%';
if(flight){flight.t+=dt;const t=Math.min(1,flight.t/flight.duration);ballGroup.position.lerpVectors(flight.start,flight.target,t);ballGroup.position.y+=Math.sin(t*Math.PI)*1.2*flight.strength;ballGroup.rotation.x-=dt*12;keeper.position.x=THREE.MathUtils.lerp(0,saveSide*2.3,Math.min(1,t*1.8));keeperVisual.rotation.z=THREE.MathUtils.lerp(0,-saveSide*.35,Math.min(1,t*1.8));keeper.position.y=0;if(t>=1&&!flight.decided){flight.decided=true;const onTarget=Math.abs(flight.target.x)<HALFW-.22&&flight.target.y>.25&&flight.target.y<H-.15;const keeperReach={easy:.48,normal:.8,hard:1.15}[difficulty];const saved=onTarget&&Math.abs(flight.target.x-keeper.position.x)<keeperReach&&flight.target.y<(difficulty==='hard'?2.4:2.15);if(onTarget&&!saved){goals++;if(gameMode==='precision')points+=Math.round(100+Math.abs(flight.target.x)*40+flight.target.y*30);message('GOOOOL! ⚽')}else message(saved?'DEFENDEU! 🧤':'PARA FORA!');updateScore();resetAt=performance.now()+1700}if(flight.decided&&performance.now()>resetAt)resetBall()}
renderer.render(scene,camera)}animate();loadAssets().catch(e=>{console.error(e);status('Erro inesperado: '+e.message);$('start').disabled=false;$('start').textContent='TENTAR INICIAR';ready=true});

// Menu Ultimate: cartões sincronizados com os selects originais do jogo.
function syncCards(group,value){document.querySelectorAll(`[data-${group}]`).forEach(el=>{const active=el.dataset[group]===value;el.classList.toggle('selected',active);el.setAttribute('aria-pressed',String(active))})}
for(const el of document.querySelectorAll('[data-difficulty]'))el.addEventListener('click',()=>{$('difficulty').value=el.dataset.difficulty;syncCards('difficulty',el.dataset.difficulty)});
for(const el of document.querySelectorAll('[data-gamemode]'))el.addEventListener('click',()=>{$('gameMode').value=el.dataset.gamemode;syncCards('gamemode',el.dataset.gamemode)});
syncCards('difficulty',$('difficulty').value);syncCards('gamemode',$('gameMode').value);