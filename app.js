const toggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('#navigation');
function closeNavigation(){toggle.setAttribute('aria-expanded','false');navigation.classList.remove('is-open');document.body.classList.remove('menu-open');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));navigation.classList.toggle('is-open',open);document.body.classList.toggle('menu-open',open);});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeNavigation));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeNavigation();}});
window.matchMedia('(min-width: 701px)').addEventListener('change',event=>{if(event.matches)closeNavigation();});
const menus={
 diner:{title:'HET DINER.',meta:'Woensdag — zaterdag · Vanaf 19:00 · €75 p.p.',courses:[['Om te beginnen','Een reeks kleine hapjes uit de open keuken.'],['Uit het seizoen','Vis, groenten en fruit in verrassende combinaties.'],['Van de keuken','Een warm tussengerecht, met aandacht voor wat er nu op zijn best is.'],['Het hoofdgerecht','Een keuze uit vis, vlees of een groentegerecht.'],['Iets zoets','Twee zoete afsluiters. Liever kaas? Vraag naar de mogelijkheden.']]},
 lunch:{title:'DE LUNCH.',meta:'Donderdag & vrijdag · Vanaf 12:00 · €45 p.p.',courses:[['Vooraf','Een hapje om de middag goed te beginnen.'],['Voorgerecht','Een seizoensgebonden voorgerecht, geïnspireerd op het diner.'],['Hoofdgerecht','Kies uit de gerechten van het moment.'],['Dessert','Een zoete afsluiter, of kaas met supplement.']]}
};
const dialog=document.querySelector('#menu-dialog');
document.querySelectorAll('[data-menu]').forEach(button=>button.addEventListener('click',()=>{
 const menu=menus[button.dataset.menu];
 document.querySelector('#dialog-title').textContent=menu.title;
 document.querySelector('#dialog-meta').textContent=menu.meta;
 document.querySelector('#dialog-content').replaceChildren(...menu.courses.map(([label,text])=>{const item=document.createElement('div');item.className='menu-course';const title=document.createElement('small');title.textContent=label;const body=document.createElement('p');body.textContent=text;item.append(title,body);return item;}));
 dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();});
document.querySelector('#year').textContent=new Date().getFullYear();

// One observer introduces the supporting content; scroll position drives the
// cards and bar panels, so reversing the scroll naturally reverses their motion.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const strip = document.querySelector('.photo-strip');
const photoGroup = document.createElement('div');
photoGroup.className = 'photo-group';
photoGroup.append(...strip.children);
const photoTrack = document.createElement('div');
photoTrack.className = 'photo-track';
const duplicate = photoGroup.cloneNode(true);
duplicate.setAttribute('aria-hidden', 'true');
duplicate.querySelectorAll('img').forEach(img => { img.alt = ''; });
photoTrack.append(photoGroup, duplicate);
strip.append(photoTrack);
strip.classList.add('is-marquee');
strip.setAttribute('aria-label', 'Een kijkje bij Elders, bewegende fotogalerij');
const setPhotoSpeed = () => photoTrack.style.setProperty('--photo-duration', `${photoGroup.offsetWidth / 17}s`);
new ResizeObserver(setPhotoSpeed).observe(photoGroup);
setPhotoSpeed();

// Scroll progress is the source of truth: every reveal retraces on upward scroll.
const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => { const p=clamp(value); return p*p*(3-2*p); };
const stack = document.querySelector('.menu-stack-scroll');
const cardStage = document.querySelector('.menu-cards');
const cards = [...document.querySelectorAll('.menu-card')];
const barScroll = document.querySelector('.bar-scroll');
const barStage = document.querySelector('.bar-stage');
const panels = [...document.querySelectorAll('.bar-panel')];
const barHeading = document.querySelector('.bar-heading');
const barHint = document.querySelector('.bar-scroll-hint');
const scenery = [...document.querySelectorAll('.hero-image, .booking > img')];
const textElements = [...document.querySelectorAll('h1,h2,h3,p,address,a,button,.price,.image-note,.walk-in,.sunday-stamp')]
  .filter(el => !el.closest('dialog,.ticker,.skip-link') && !el.parentElement.closest('a,button,address'));
const textRecords = textElements.map((el,i) => {
  el.classList.add('scroll-text');
  return {el,style:el.matches('h1,h2,h3,.price')?'rise':el.matches('.eyebrow')?'track':el.matches('a,button')?'float':i%2?'slide':'fade',card:el.closest('.menu-card'),bar:el.closest('.bar-heading'),top:0};
});
function documentTop(el){let top=0;for(let node=el;node;node=node.offsetParent)top+=node.offsetTop;return top;}
function measure(){textRecords.forEach(record=>record.top=documentTop(record.el));scheduleMotion();}
function animateText(record, progress){
  const {el,style}=record;
  const p=ease(progress),remaining=1-p;
  el.style.opacity=String(p);
  el.style.translate=style==='slide'?`${remaining* -28}px 0`:`0 ${remaining*(style==='rise'?75:style==='float'?25:18)}px`;
  el.style.scale=style==='rise'?String(.8+p*.2):'1';
  if(style==='track')el.style.letterSpacing=`${.075+remaining*.15}em`;
}
let frame=0,lastTime=0,wheelActive=false,wheelTarget=window.scrollY;
const finePointer=window.matchMedia('(pointer:fine)');
function renderScrollMotion(now){
  frame=0;
  const dt=Math.min(50,now-(lastTime||now-16));lastTime=now;
  if(reducedMotion.matches)return;
  if(wheelActive){
    const current=window.scrollY;
    const next=current+(wheelTarget-current)*(1-Math.exp(-dt/190));
    window.scrollTo({top:Math.abs(wheelTarget-next)<.7?wheelTarget:next,behavior:'instant'});
    if(Math.abs(wheelTarget-window.scrollY)<1)wheelActive=false;
  }
  const height=innerHeight;
  const stackBounds=stack.getBoundingClientRect();
  const stackProgress=clamp(-stackBounds.top/Math.max(1,stack.offsetHeight-cardStage.offsetHeight));
  const cardProgress=cards.map((card,i)=>i===0?ease((height*.9-stackBounds.top)/(height*.7)):ease((stackProgress-(i-1)*.4-.07)/.35));
  const activeCard=cardProgress.reduce((active,p,i)=>p>.9?i:active,0);
  cards.forEach((card,i)=>{
    const p=cardProgress[i],direction=i%2?1:-1;
    const covered=cardProgress[i+1]||0;
    card.style.transform=`translateY(calc(-50% + ${(1-p)*(height+150)}px)) rotate(${direction*(-5+p*7)}deg) scale(${.96+p*.04-covered*.035})`;
    card.style.opacity='1';
    card.inert=i!==activeCard;
  });
  const barBounds=barScroll.getBoundingClientRect();
  const barProgress=clamp(-barBounds.top/Math.max(1,barScroll.offsetHeight-barStage.offsetHeight));
  const opening=ease((barProgress-.05)/.87);
  panels.forEach((panel,i)=>{
    const direction=i===0?-1:1;
    panel.style.transform=`translate3d(${direction*opening*103}%,0,0)`;
    panel.querySelector('img').style.transform=`translate3d(${direction*(1-opening)*3}%,0,0) scale(${1.28-opening*.28})`;
  });
  barHeading.style.transform=`translateY(${(1-opening)*40}px) scale(${.85+opening*.15})`;
  barHint.style.opacity=String(1-ease(barProgress*5));
  textRecords.forEach(record=>{
    let p;
    if(record.card)p=cardProgress[cards.indexOf(record.card)];
    else if(record.bar)p=clamp((barProgress-.18)/.52);
    else if(record.top<height*.7){
      // The opening composition gently recedes as the visitor leaves it.
      p=1-clamp((window.scrollY-height*.25)/(height*.9));
    }else {
      const start=record.top-height*.97;
      const end=Math.min(record.top-height*.4,document.documentElement.scrollHeight-height-15);
      p=clamp((window.scrollY-start)/Math.max(1,end-start));
    }
    animateText(record,p);
  });
  scenery.forEach(img=>{
    const rect=img.parentElement.getBoundingClientRect();
    if(rect.bottom>0&&rect.top<height)img.style.transform=`translateY(${Math.max(-24,Math.min(24,-rect.top*.04))}px)`;
  });
  if(wheelActive)scheduleMotion();
}
function scheduleMotion(){if(!frame&&!reducedMotion.matches)frame=requestAnimationFrame(renderScrollMotion);}
// A gentle desktop wheel response. Touch, keyboard, horizontal gestures and
// scrollable overlays retain native behavior; reduced motion bypasses this.
window.addEventListener('wheel',event=>{
  if(reducedMotion.matches||!finePointer.matches||event.ctrlKey||event.metaKey||event.shiftKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||document.querySelector('dialog[open]')||document.body.classList.contains('menu-open'))return;
  if(event.target.closest('.photo-strip'))return;
  event.preventDefault();
  if(!wheelActive)wheelTarget=window.scrollY;
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  wheelTarget=Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,wheelTarget+delta*.714));
  wheelActive=true;scheduleMotion();
},{passive:false});
function cancelWheel(){wheelActive=false;wheelTarget=window.scrollY;}
window.addEventListener('keydown',cancelWheel);
window.addEventListener('pointerdown',cancelWheel,{passive:true});
window.addEventListener('touchstart',cancelWheel,{passive:true});
window.addEventListener('scroll',scheduleMotion,{passive:true});
window.addEventListener('resize',measure);
window.addEventListener('load',measure);
document.fonts.ready.then(measure);
new ResizeObserver(measure).observe(document.querySelector('main'));
function resetMotion(){
  cancelWheel();
  [...textElements,...cards,...panels,...panels.map(p=>p.querySelector('img')),barHeading,barHint,...scenery].forEach(el=>{
    ['transform','opacity','translate','scale','letter-spacing'].forEach(property=>el.style.removeProperty(property));
  });
  cards.forEach(card=>card.inert=false);
}
reducedMotion.addEventListener('change',()=>{resetMotion();measure();});
if(reducedMotion.matches)resetMotion();
measure();
