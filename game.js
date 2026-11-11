import * as THREE from 'three';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={screen:'home',name:'Aster',gender:'f',coat:'#d77e56',height:1,build:1,hp:100,maxHp:100,level:1,xp:0,coins:12,missions:0,kills:0,iron:0,ember:0,activeQuest:0,questStage:0,weapon:1,selectedSlot:0,quality:'balanced',audio:70,music:true,tonics:2,moon:0,dodging:0,dodgeCooldown:0};
const screens=$$('.screen');function show(id){screens.forEach(x=>x.classList.toggle('active',x.id===id));state.screen=id;$('#hud').classList.toggle('visible',id==='world');}
const scene=new THREE.Scene();scene.background=new THREE.Color('#9ab7ae');scene.fog=new THREE.Fog('#9ab7ae',38,104);
const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});renderer.setPixelRatio(1);renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.BasicShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;$('#game').appendChild(renderer.domElement);
const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,180);camera.position.set(12,18,24);camera.lookAt(0,0,0);
scene.add(new THREE.HemisphereLight('#e2f4dc','#51493b',2.0));const sun=new THREE.DirectionalLight('#ffe3ae',2.8);sun.position.set(-14,28,12);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-35;sun.shadow.camera.right=35;sun.shadow.camera.top=35;sun.shadow.camera.bottom=-35;scene.add(sun);
const mat=(color,rough=.9)=>new THREE.MeshStandardMaterial({color,roughness:rough,flatShading:true});
const mats={grass:mat('#718f69'),lime:mat('#a8aa69'),darkGrass:mat('#4b685a'),earth:mat('#987d5d'),stone:mat('#aaa58c'),roof:mat('#824e43'),wood:mat('#735843'),cream:mat('#dbccaa'),blue:mat('#698c94'),gold:mat('#e6b75f'),red:mat('#c65f4d'),shadow:mat('#354948')};
const ground=new THREE.Mesh(new THREE.CircleGeometry(57,12),mats.grass);ground.rotation.x=-Math.PI/2;ground.position.y=-.28;ground.receiveShadow=true;scene.add(ground);
const patch=(x,z,r,c)=>{const m=new THREE.Mesh(new THREE.CircleGeometry(r,8),mat(c));m.rotation.x=-Math.PI/2;m.position.set(x,-.245,z);scene.add(m)};
for(let i=0;i<32;i++){const a=i*2.399,r=8+(i%7)*5;patch(Math.cos(a)*r,Math.sin(a)*r,1.3+(i%4)*.7,i%3?'#829468':'#a2a070')}
const roadMat=mat('#b69b72');const road=new THREE.Mesh(new THREE.BoxGeometry(4,.06,47),roadMat);road.position.set(0,-.17,-14);scene.add(road);const road2=new THREE.Mesh(new THREE.BoxGeometry(26,.07,3.8),roadMat);road2.position.set(-8,-.165,0);scene.add(road2);
for(let i=0;i<17;i++){const a=i/17*Math.PI*2,r=51+Math.random()*5,h=9+Math.random()*13;const m=new THREE.Mesh(new THREE.ConeGeometry(5+Math.random()*4,h,5),mat(i%2?'#627c75':'#788e83'));m.position.set(Math.cos(a)*r,h/2-1,Math.sin(a)*r);m.rotation.y=a;scene.add(m)}
function box(parent,x,y,z,w,h,d,material){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function tree(x,z,scale=1){const g=new THREE.Group();g.position.set(x,0,z);box(g,0,.8*scale,0,.32*scale,1.6*scale,.32*scale,mats.wood);for(let n=0;n<3;n++){const crown=new THREE.Mesh(new THREE.IcosahedronGeometry((1.05-n*.13)*scale,0),mat(['#496a57','#58785d','#70885d'][n]));crown.position.set((n%2-.5)*.24*scale,(1.6+n*.53)*scale,(n-1)*.18*scale);crown.castShadow=true;g.add(crown)}scene.add(g)}
for(let i=0;i<64;i++){const a=Math.random()*6.28,r=14+Math.random()*37,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<4&&z<10&&z>-28)continue;tree(x,z,.72+Math.random()*.65)}
function house(x,z,color){const g=new THREE.Group();g.position.set(x,0,z);box(g,0,1.15,0,4.4,2.4,3.6,mats.cream);const roof=new THREE.Mesh(new THREE.ConeGeometry(3.25,2.3,4),mat(color));roof.position.y=3;roof.rotation.y=Math.PI/4;roof.castShadow=true;g.add(roof);box(g,0,.75,1.83,.8,1.5,.1,mats.wood);for(const xx of [-1.25,1.25])box(g,xx,1.6,1.84,.7,.65,.1,mats.blue);scene.add(g);return g}house(-7,1,'#875348');house(-11,-4,'#667b77');house(7,3,'#9b7955');
const well=new THREE.Group();well.position.set(-2.8,0,0);const ring=new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.12,.8,8),mats.stone);ring.position.y=.35;well.add(ring);const water=new THREE.Mesh(new THREE.CylinderGeometry(.76,.76,.08,8),mat('#4f8582'));water.position.y=.78;well.add(water);box(well,0,1.55,0,.12,1.7,.12,mats.wood);box(well,0,2.3,0,2,.12,.12,mats.wood);scene.add(well);
function lantern(x,z){const g=new THREE.Group();g.position.set(x,0,z);box(g,0,.9,0,.12,1.8,.12,mats.wood);const l=new THREE.Mesh(new THREE.OctahedronGeometry(.28),mat('#ffc879'));l.position.y=1.9;g.add(l);const light=new THREE.PointLight('#ffc879',1.2,5);light.position.y=2;g.add(light);scene.add(g)}lantern(-4,-2);lantern(5,-3);lantern(-2,-9);
function crystal(x,z,c='#79d0bd'){const g=new THREE.Group();g.position.set(x,0,z);for(let j=0;j<3;j++){const m=new THREE.Mesh(new THREE.OctahedronGeometry(.52-j*.07,0),mat(c,.35));m.scale.set(.55,1.55+j*.25,.55);m.position.set((j-1)*.52,.62+j*.13,(j%2)*.3);m.rotation.z=(j-1)*.2;m.castShadow=true;g.add(m)}scene.add(g);return g}const crystalA=crystal(6,-11);const crystalB=crystal(-8,-15,'#8dc6dd');const altar=crystal(0,-31,'#eb7959');
const player=new THREE.Group();scene.add(player);function makePlayer(){while(player.children.length)player.remove(player.children[0]);const scale=state.height,build=state.build;const skin=mat(state.gender==='f'?'#dca987':'#c99876'),coat=mat(state.coat),pants=mat('#394d56'),hair=mat(state.gender==='f'?'#433738':'#392f2d');const body=new THREE.Mesh(new THREE.CapsuleGeometry(.43*build,.75*scale,3,5),coat);body.position.y=1.13*scale;body.castShadow=true;player.add(body);const head=new THREE.Mesh(new THREE.IcosahedronGeometry(.39*scale,1),skin);head.position.y=2.12*scale;head.castShadow=true;player.add(head);const cap=new THREE.Mesh(new THREE.SphereGeometry(.4*scale,7,5,0,Math.PI*2,0,Math.PI*.56),hair);cap.position.y=2.26*scale;player.add(cap);for(const side of [-1,1]){const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.18*build,.58*scale,2,4),pants);leg.position.set(side*.23*build,.43*scale,0);player.add(leg);const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.15,.55*scale,2,4),coat);arm.position.set(side*.53*build,1.24*scale,0);arm.rotation.z=side*-.14;player.add(arm)}const blade=new THREE.Mesh(new THREE.BoxGeometry(.12,.9,.16),mats.gold);blade.position.set(.82,1.15,.18);blade.rotation.z=-.4;player.add(blade);player.userData.blade=blade}makePlayer();player.position.set(0,0,5);
for(let i=0;i<8;i++){const bird=new THREE.Mesh(new THREE.TetrahedronGeometry(.17),mat('#e9d8ae'));bird.position.set(-13+i*3,.7,-8-(i%3)*5);bird.rotation.z=.3;scene.add(bird)}
function makeNPC(x,z,kind,name,coatColor){const g=new THREE.Group();g.position.set(x,0,z);g.userData={kind,name};const coat=mat(coatColor),skin=mat('#d6a77d'),hair=mat(kind==='keeper'?'#d7c58c':'#443d3b');const body=new THREE.Mesh(new THREE.CapsuleGeometry(.38,.7,3,5),coat);body.position.y=1.05;g.add(body);const head=new THREE.Mesh(new THREE.IcosahedronGeometry(.35,1),skin);head.position.y=2;g.add(head);const h=new THREE.Mesh(new THREE.SphereGeometry(.36,7,5,0,Math.PI*2,0,Math.PI*.56),hair);h.position.y=2.15;g.add(h);if(kind==='keeper'){const staff=new THREE.Mesh(new THREE.CylinderGeometry(.045,.065,2.5,5),mats.wood);staff.position.set(.57,1.1,0);g.add(staff);const orb=new THREE.Mesh(new THREE.OctahedronGeometry(.17),mats.gold);orb.position.set(.57,2.4,0);g.add(orb)}g.traverse(o=>{if(o.isMesh)o.castShadow=true});scene.add(g);return g}const npcs=[makeNPC(2.1,0,'keeper','Mara','#6f8272'),makeNPC(-9,-7,'merchant','Tovin','#72899a'),makeNPC(10,-22,'scout','Iven','#a26a52')];
function enemy(x,z,boss=false){const g=new THREE.Group();g.position.set(x,0,z);g.userData={boss,hp:boss?240:65,max:boss?240:65,phase:Math.random()*6,attack:0,dodge:0};const core=new THREE.Mesh(new THREE.IcosahedronGeometry(boss?1.35:.72,boss?1:0),mat(boss?'#642f3a':'#536e66'));core.position.y=boss?1.65:1;core.castShadow=true;g.add(core);const armor=new THREE.Mesh(new THREE.IcosahedronGeometry(boss?1.48:.82,0),mat(boss?'#a24943':'#8f5949'));armor.scale.set(1,.75,.9);armor.position.y=boss?1.75:1.05;g.add(armor);for(const s of [-1,1]){const horn=new THREE.Mesh(new THREE.ConeGeometry(boss?.3:.18,boss?1:.6,4),mat('#e7a35c'));horn.position.set(s*(boss?1.02:.58),boss?2.8:1.72,.1);horn.rotation.z=-s*.48;g.add(horn);const eye=new THREE.Mesh(new THREE.BoxGeometry(.17,.11,.08),mat('#ffd36f'));eye.position.set(s*(boss?.5:.27),boss?1.85:1.16,.65);g.add(eye)}if(boss)for(let i=0;i<3;i++){const spike=new THREE.Mesh(new THREE.ConeGeometry(.28,.8,4),mat('#e8b866'));spike.position.set((i-1)*.65,2.9,-.35);spike.rotation.z=(i-1)*.28;g.add(spike)}g.traverse(o=>{if(o.isMesh)o.castShadow=true});scene.add(g);return g}const mobs=[enemy(8,-13),enemy(-6,-19),enemy(12,-5)];const demon=enemy(0,-38,true);demon.visible=false;
const keys={};let last=performance.now(),nearest=null,dialogOpen=false,attacking=0,damageTimer=0,toastTimer=0,qualityScale=1,selectedItem='';
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2300)}
function updateHUD(){$('#playerLabel').textContent=`${state.name.toUpperCase()} · LV ${state.level}`;$('#hpLabel').textContent=`${state.hp} / ${state.maxHp}`;$('#hpFill').style.width=`${100*state.hp/state.maxHp}%`;$('#vitalHP').textContent=state.hp;$('#vitalCoins').textContent=state.coins;$('#xpFill').style.width=`${Math.min(100,state.xp/10)}%`;$('#statLevel').textContent=state.level;$('#statMissions').textContent=state.missions;$('#statEnemies').textContent=state.kills;$('#journalGreeting').textContent=`${state.name}, the land remembers every kindness.`;$('#ironCount').textContent=`× ${state.iron}`;$('#emberCount').textContent=`× ${state.ember}`;$('#questTitle').textContent=state.activeQuest===4?'The last ember':state.activeQuest===3?'A crown in cinders':state.activeQuest===2?'The missing warmth':state.activeQuest===1?'A strange silence':'No fixed road';$('#questDesc').textContent=state.activeQuest===0?'Speak with Mara by the old well.':state.activeQuest===1?'Gather 2 ember shards from the wildlings.':state.activeQuest===2?'Bring the shards back to Mara.':state.activeQuest===3?'Find the Demon King beyond the broken pass.':'The Demon King is defeated.';$('#objectiveText').textContent=state.activeQuest>=4?'The fire has gone quiet. '+state.name+' brought the dawn back to the valley.':`Beyond the village lies an ashen pass. The Demon King waits where the mountain has split open. Find the keeper, gather strength, and follow the ember road.`}
function gainXP(n){state.xp+=n;if(state.xp>=100){state.xp-=100;state.level++;state.maxHp+=15;state.hp=state.maxHp;toast(`Level ${state.level}! Your strength grows.`)}updateHUD()}
function setQuality(q){state.quality=q;qualityScale=q==='high'?1:q==='low'?.58:.76;renderer.setSize(Math.max(320,Math.round(innerWidth*qualityScale)),Math.max(240,Math.round(innerHeight*qualityScale)),false);renderer.domElement.style.width='100%';renderer.domElement.style.height='100%'}
function openPanel(id){returnScreen=state.screen;show(id);if(id==='inventory')populateInventory();if(id==='journal')updateHUD()}
function populateInventory(){const items=[['⚔','Traveler blade',state.weapon>1?'Forged · +18 damage':'A weathered but trusty edge.'],['🧪','Small tonic',`Restores 35 health. You carry ${state.tonics}.`],['◈','Iron shard',`A dark-metal sliver. ${state.iron} gathered.`],['✦','Ember core',`Warm with old magic. ${state.ember} gathered.`],['✧','Moonstone',`Found along the old path. ${state.moon} gathered.`]];$('#itemList').innerHTML=items.map((it,i)=>`<div class="item ${selectedItem===it[1]?'selected':''}" data-item="${it[1]}"><span class="item-icon">${it[0]}</span><span class="item-count">× ${[1,state.tonics,state.iron,state.ember,state.moon][i]}</span><div class="item-name">${it[1]}</div></div>`).join('');$$('.item').forEach(el=>el.onclick=()=>{selectedItem=el.dataset.item;const it=items.find(a=>a[1]===selectedItem);$('#itemDetail').textContent=it[2];populateInventory()})}
function strike(){if(attacking>0||dialogOpen)return;attacking=.38;player.userData.blade.rotation.z=-1.9;let hit=false;for(const m of [...mobs,demon]){if(!m.visible||m.userData.hp<=0)continue;const d=player.position.distanceTo(m.position);if(d<4.2){if(m.userData.dodge>0){toast('The foe slipped past your strike.');continue}m.userData.hp-=state.weapon>1?48:30;m.position.x+=(player.position.x-m.position.x)*-.09;m.userData.attack=0;hit=true;if(m.userData.hp<=0){m.visible=false;state.kills++;state.coins+=m.userData.boss?120:4;state.iron+=m.userData.boss?3:1;state.ember+=m.userData.boss?2:Math.random()>.5?1:0;gainXP(m.userData.boss?120:25);toast(m.userData.boss?'The Cinder Sovereign falls!':'Foe defeated · gathered a shard');if(m.userData.boss){state.activeQuest=4;updateHUD();$('#bossbar').classList.remove('show')}else if(state.activeQuest===1){const count=mobs.filter(v=>!v.visible&&v!==demon).length;if(state.ember>=2||count>=2){state.activeQuest=2;toast('The embers are gathered. Return to Mara.')}updateHUD()}}else toast('A clean hit!')}}if(!hit)toast('Your blade cuts through the air.');if(state.activeQuest===3&&player.position.distanceTo(demon.position)<23){demon.visible=true;$('#bossbar').classList.add('show')}}
function openDialog(npc){dialogOpen=true;$('#npcName').textContent=npc.userData.name;const name=state.name;let text='',actions=[];if(npc.userData.kind==='keeper'){if(state.activeQuest===0){text=`“${name}, you have the look of someone who still listens. The wildlings have gone quiet. Would you find what they’re guarding?”`;actions=[['Take the thread',()=>{state.activeQuest=1;state.questStage=0;toast('New thread · A strange silence')}]]}else if(state.activeQuest===1){text=`“The shards sing when they’re close. Find two ember cores, ${name}. Stay light on your feet.”`;actions=[['I’m on it',()=>toast('The wildlings roam north of the village.')]]}else if(state.activeQuest===2){text=`“You found them! I can feel the hearth waking. Take this, ${name} — you’ll need a sharper edge for the road ahead.”`;actions=[['Accept Sunsteel',()=>{state.activeQuest=3;state.missions++;state.coins+=35;state.iron=Math.max(2,state.iron);state.weapon=2;state.maxHp+=20;state.hp=state.maxHp;updateHUD();toast('Quest complete · Sunsteel blade equipped')}]]}else if(state.activeQuest===3){text=`“The pass opens north. The Demon King is no story, ${name}. Make the old road remember you.”`;actions=[['I’ll end this',()=>toast('Follow the road north into the broken pass.')]]}else{text=`“The valley is quiet again, ${name}. You gave us a morning we thought we’d lost.”`;actions=[['Ask for a new thread',()=>{state.activeQuest=1;state.missions++;state.iron=0;state.ember=0;toast('New thread · Wildling patrol')}]]}}else if(npc.userData.kind==='merchant'){text=`“A road is a long thing, ${name}. Keep your blade close and your heart closer. I’ll trade a tonic for 8 coins.”`;actions=[['Buy tonic · 8 ◈',()=>{if(state.coins>=8){state.coins-=8;state.tonics++;updateHUD();toast('Tonic added to your pack')}else toast('Not enough coins.')}]]}else{text=`“I saw the ash king’s shadow pass the ridge, ${name}. The old road leads right to its door. Don’t wait for night.”`;actions=[['Thank you',()=>toast('A new marker appears on the road.')]]}$('#dialogText').textContent=text;$('#dialogActions').innerHTML='';actions.forEach(([label,fn])=>{const b=document.createElement('button');b.className='btn primary small';b.textContent=label;b.onclick=()=>{fn();closeDialog()};$('#dialogActions').append(b)});const close=document.createElement('button');close.className='btn small';close.textContent='Later';close.onclick=closeDialog;$('#dialogActions').append(close);$('#dialog').classList.add('show')}
function closeDialog(){dialogOpen=false;$('#dialog').classList.remove('show')}

// Screen flow and character creation
let returnScreen='home';
function showSettings(){returnScreen=state.screen==='world'?'world':state.screen;openPanel('settings')}
function beginAdventure(){
  state.name=($('#nameInput').value.trim()||'Aster').slice(0,18);
  state.height=Number($('#heightInput').value)||1;state.build=Number($('#buildInput').value)||1;
  player.position.set(0,0,5);makePlayer();updateHUD();show('world');toast(`The valley welcomes you, ${state.name}.`)
}
$('#newGameBtn').onclick=()=>show('editor');
$$('[data-back-home]').forEach(b=>b.onclick=()=>show('home'));
$('#startGameBtn').onclick=beginAdventure;
$('#nameInput').addEventListener('input',e=>{state.name=e.target.value.trim()||'Aster'});
$$('[data-gender]').forEach(b=>b.onclick=()=>{$$('[data-gender]').forEach(x=>x.classList.toggle('active',x===b));state.gender=b.dataset.gender;makePlayer()});
$$('[data-coat]').forEach(b=>b.onclick=()=>{$$('[data-coat]').forEach(x=>x.classList.toggle('active',x===b));state.coat=b.dataset.coat;makePlayer()});
$('#heightInput').oninput=e=>{state.height=Number(e.target.value);makePlayer()};
$('#buildInput').oninput=e=>{state.build=Number(e.target.value);makePlayer()};
$('#qualitySelect').onchange=e=>setQuality(e.target.value);
$('#audioRange').oninput=e=>{$('#audioValue').textContent=`${e.target.value}%`;state.audio=Number(e.target.value)};
$('#musicToggle').onchange=e=>{state.music=e.target.checked;toast(state.music?'Ambient music enabled.':'Ambient music muted.')};
$('#pauseSettings').onclick=showSettings;
$('#resumeBtn').onclick=()=>show('world');
$('#pauseBtn').onclick=()=>show('pause');
$('#mapBtn').onclick=()=>openPanel('journal');
$('#invBtn').onclick=()=>openPanel('inventory');
$('#charBtn').onclick=()=>openPanel('journal');
$$('[data-close]').forEach(b=>b.onclick=()=>show(returnScreen==='settings'?'home':returnScreen));
$('#craftBtn').onclick=()=>{
  if(state.weapon>1){toast('Sunsteel is already forged.');return}
  if(state.iron<2||state.ember<1){toast('Need 2 iron shards and 1 ember core. Defeat wildlings to gather materials.');return}
  state.iron-=2;state.ember--;state.weapon=2;$('#equipLabel').textContent='Sunsteel blade';updateHUD();populateInventory();toast('Sunsteel forged · your strikes are stronger.')
};
$$('[data-slot]').forEach(b=>b.onclick=()=>{state.selectedSlot=Number(b.dataset.slot);$$('[data-slot]').forEach(x=>x.classList.toggle('active',x===b));if(state.selectedSlot===1){if(state.tonics>0&&state.hp<state.maxHp){state.tonics--;state.hp=Math.min(state.maxHp,state.hp+35);updateHUD();populateInventory();toast('You drink a tonic · 35 health restored.')}else toast(state.tonics?'You are already at full health.':'No tonics left.')}else if(state.selectedSlot===0)strike();else toast(state.selectedSlot===2?'No ember skill learned yet.':'No crafting materials equipped.')});

// Input: WASD movement, E interaction, Space attack, Shift dodge, number keys for hotbar.
function interact(){if(dialogOpen){closeDialog();return}if(nearest){openDialog(nearest);return}if(state.activeQuest===3&&player.position.distanceTo(demon.position)<24){demon.visible=true;$('#bossbar').classList.add('show');toast('The Cinder Sovereign turns to face you.') }else toast('Nothing nearby answers.')}
function togglePause(){if(state.screen==='world')show('pause');else if(state.screen==='pause')show('world')}
window.addEventListener('keydown',e=>{
  if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();
  const k=e.key.toLowerCase();if(state.screen!=='world'){
    if(k==='escape'){if(state.screen==='pause')show('world');else if(state.screen==='settings')show(returnScreen==='world'?'world':'home');else if(state.screen==='inventory'||state.screen==='journal')show('world')}
    return
  }
  keys[k]=true;if(e.repeat)return;
  if(k==='e')interact();else if(k===' '||k==='f')strike();else if(k==='escape'||k==='p')togglePause();else if(k==='i')openPanel('inventory');else if(k==='m'||k==='j')openPanel('journal');else if(k==='1'||k==='2'||k==='3'||k==='4')document.querySelector(`[data-slot="${Number(k)-1}"]`)?.click();
});
window.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
window.addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
$$('[data-move]').forEach(b=>{
  const start=e=>{e.preventDefault();const d=b.dataset.move;if(d==='attack')strike();else keys[`mobile_${d}`]=true};
  const stop=e=>{e.preventDefault();keys[`mobile_${b.dataset.move}`]=false};
  b.addEventListener('pointerdown',start);b.addEventListener('pointerup',stop);b.addEventListener('pointercancel',stop);b.addEventListener('pointerleave',stop);
});

// World simulation: enemies pressure the player, with a readable wind-up and dodge window.
function damagePlayer(amount){
  if(damageTimer>0||state.screen!=='world')return;
  state.hp=Math.max(0,state.hp-amount);damageTimer=.55;updateHUD();
  if(state.hp<=0){state.hp=state.maxHp;player.position.set(0,0,5);updateHUD();toast('You wake by the village well, restored but humbled.');return}
  toast('A foe strikes you!')
}
function updateWorld(dt){
  if(state.screen!=='world')return;
  const up=keys.w||keys.arrowup||keys.mobile_up,down=keys.s||keys.arrowdown||keys.mobile_down,left=keys.a||keys.arrowleft||keys.mobile_left,right=keys.d||keys.arrowright||keys.mobile_right;
  const move=new THREE.Vector3((right?1:0)-(left?1:0),0,(down?1:0)-(up?1:0));
  if(move.lengthSq()>0){move.normalize();player.position.addScaledVector(move,dt*(keys.shift?8:5.2));player.rotation.y=Math.atan2(move.x,move.z);player.userData.walk=Math.sin(performance.now()*.012)*.08}
  player.position.x=THREE.MathUtils.clamp(player.position.x,-51,51);player.position.z=THREE.MathUtils.clamp(player.position.z,-51,48);
  if(keys.shift&&move.lengthSq()>0&&state.dodgeCooldown<=0){state.dodging=.24;state.dodgeCooldown=1;player.position.addScaledVector(move,1.8)}
  state.dodging=Math.max(0,(state.dodging||0)-dt);state.dodgeCooldown=Math.max(0,(state.dodgeCooldown||0)-dt);
  damageTimer=Math.max(0,damageTimer-dt);attacking=Math.max(0,attacking-dt);
  if(attacking<=0&&player.userData.blade)player.userData.blade.rotation.z=-.4;
  const targets=[...npcs,...mobs.filter(m=>m.visible&&m.userData.hp>0),...(demon.visible&&demon.userData.hp>0?[demon]:[])];
  nearest=null;let nearestD=3.1;for(const n of npcs){const d=player.position.distanceTo(n.position);if(d<nearestD){nearest=n;nearestD=d}}
  const prompt=$('#interaction');prompt.classList.toggle('show',!!nearest&&!dialogOpen);if(nearest)prompt.textContent=`[ E ] Talk to ${nearest.userData.name}`;
  for(const m of [...mobs,demon]){
    if(!m.visible||m.userData.hp<=0)continue;
    const dist=player.position.distanceTo(m.position);const boss=m.userData.boss;
    if(boss&&state.activeQuest!==3)continue;
    const aggro=boss?18:11;
    if(dist<aggro&&dist>1.65){const dir=player.position.clone().sub(m.position).setY(0).normalize();m.position.addScaledVector(dir,dt*(boss?1.35:1.05));m.rotation.y=Math.atan2(dir.x,dir.z)}
    m.userData.phase+=dt;
    if(dist<(boss?3.5:2.35)&&m.userData.attack<=0){m.userData.attack=boss?1.55:1.9;m.userData.windup=.42}
    if(m.userData.attack>0){m.userData.attack-=dt;if(m.userData.attack<.22&&m.userData.attack> .22-dt){if(state.dodging<=0)damagePlayer(boss?18:10)}}
    m.userData.dodge=Math.max(0,m.userData.dodge-dt);
    if(Math.random()<dt*.018&&dist<5)m.userData.dodge=.32;
  }
  if(state.activeQuest===3&&player.position.distanceTo(demon.position)<22){demon.visible=true;$('#bossbar').classList.add('show')}
  if(demon.visible&&demon.userData.hp>0)$('#bossFill').style.width=`${100*demon.userData.hp/demon.userData.max}%`;
  const focus=state.activeQuest===0||state.activeQuest===2?npcs[0].position:state.activeQuest===1?mobs.find(m=>m.visible)?.position||npcs[0].position:state.activeQuest===3?demon.position:player.position;
  $('#compassLabel').textContent=`N · ${Math.round(player.position.distanceTo(focus))}M`;
  const desired=new THREE.Vector3(player.position.x+9,player.position.y+13,player.position.z+18);
  camera.position.lerp(desired,Math.min(1,dt*3));camera.lookAt(player.position.x,player.position.y+1.1,player.position.z-3);
}
function animate(now){requestAnimationFrame(animate);const dt=Math.min(.05,(now-last)/1000||0);last=now;updateWorld(dt);renderer.render(scene,camera)}
function resize(){const w=Math.max(320,Math.round(innerWidth*qualityScale)),h=Math.max(240,Math.round(innerHeight*qualityScale));renderer.setSize(w,h,false);renderer.domElement.style.width='100%';renderer.domElement.style.height='100%';camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
window.addEventListener('resize',resize);
setQuality(state.quality);updateHUD();requestAnimationFrame(animate);

