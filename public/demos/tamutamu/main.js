(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const PHONE='250781537077';

/* Kigali time (UTC+2, no DST) */
function kigali(){const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Kigali',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());const g=t=>p.find(x=>x.type===t).value;return{wd:g('weekday'),h:+g('hour')%24,m:+g('minute')}}
const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],FULL={Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday'};
const OPEN=7,CLOSE=24; // 07:00 to midnight, to confirm
const hoursUl=$('#hours');
hoursUl.innerHTML='<li><span>Google panel</span><span>Open until midnight</span></li><li><span>Opening time</span><span class="tbc">to confirm</span></li>';
function tick(){
  const k=kigali(),mins=k.h*60+k.m,isOpen=mins>=OPEN*60&&mins<CLOSE*60;
  const el=$('#openNow');el.className='open';
  $('span',el).textContent='Hours to confirm';
  
  $('#clock').textContent=String(k.h).padStart(2,'0')+':'+String(k.m).padStart(2,'0');
}
tick();setInterval(()=>{if(!document.hidden)tick()},20000);

/* header progress, stuck state, dock, active section */
const top=$('#top'),dock=$('#dock'),bar=$('.bar');
let ticking=false;
function onScroll(){
  ticking=false;
  const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;
  bar.style.setProperty('--p',max>0?(y/max).toFixed(4):0);
  top.classList.toggle('stuck',y>40);
  dock.classList.toggle('show',y>innerHeight*.6);
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
new IntersectionObserver(e=>dock.classList.toggle('away',e[0].isIntersecting),{threshold:.15}).observe($('#table'));
const links=$$('nav a[data-s]');
const secObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.dataset.s===e.target.dataset.s))}),{rootMargin:'-40% 0px -55% 0px'});
$$('section[data-s]').forEach(s=>secObs.observe(s));

/* reveals */
if(!reduce){
  const rv=$$('.sh,.note,.composer,.chips,.quotes blockquote,.find .card,.foot>div');
  rv.forEach((e,i)=>{e.classList.add('rv');e.style.setProperty('--d',(i%3)*.08+'s')});
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  rv.forEach(e=>io.observe(e));
}

/* hero photo stack: springs that answer the pointer, paused off screen */
const stack=$('#stack');
if(stack&&!reduce&&matchMedia('(hover:hover)').matches){
  const ph=$$('.ph',stack),depth=[18,-26,34];const st=ph.map(()=>({x:0,y:0,vx:0,vy:0}));
  let tx=0,ty=0,run=false,vis=true;
  const loop=()=>{
    let moving=false;
    ph.forEach((p,i)=>{const s=st[i],gx=tx*depth[i],gy=ty*depth[i];
      s.vx=(s.vx+(gx-s.x)*.08)*.82;s.vy=(s.vy+(gy-s.y)*.08)*.82;s.x+=s.vx;s.y+=s.vy;
      if(Math.abs(s.vx)+Math.abs(s.vy)+Math.abs(gx-s.x)+Math.abs(gy-s.y)>.05)moving=true;
      p.style.setProperty('--x',s.x.toFixed(2)+'px');p.style.setProperty('--y',s.y.toFixed(2)+'px')});
    document.documentElement.style.setProperty('--echo',(tx*-14).toFixed(1)+'px');
    if(moving&&vis&&!document.hidden)requestAnimationFrame(loop);else run=false;
  };
  const kick=()=>{if(!run&&vis){run=true;requestAnimationFrame(loop)}};
  addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;kick()},{passive:true});
  new IntersectionObserver(e=>{vis=e[0].isIntersecting;if(vis)kick()}).observe(stack);
}

/* WhatsApp composer */
const f=$('#composer'),size=$('#size'),day=$('#day'),time=$('#time'),nm=$('#name'),msg=$('#msg'),send=$('#send');
const dt=new Date(Date.now()+864e5);day.min=new Date().toISOString().slice(0,10);day.value=dt.toISOString().slice(0,10);
function build(){
  const kind=$('input[name=kind]:checked').value,n=Math.max(1,Math.min(200,+size.value||1));
  const picks=$$('.picks input:checked').map(i=>i.value);
  let when='';if(day.value){const d=new Date(day.value+'T12:00:00');when=' on '+d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}
  if(time.value)when+=' at '+time.value;
  let t=`Hello Tamu Tamu, I would like to ask for ${kind} for ${n} ${n===1?'person':'people'}${when}.`;
  if(picks.length)t+=` We would like to try: ${picks.join(', ')}.`;
  t+=' Is there space, and what would you advise?';
  if(nm.value.trim())t+=` Name: ${nm.value.trim()}.`;
  msg.textContent=t;send.href=`https://wa.me/${PHONE}?text=${encodeURIComponent(t)}`;send.target='_blank';
}
f.addEventListener('input',build);f.addEventListener('change',build);
$('#minus').onclick=()=>{size.value=Math.max(1,(+size.value||1)-1);build()};
$('#plus').onclick=()=>{size.value=Math.min(200,(+size.value||1)+1);build()};
f.addEventListener('submit',e=>e.preventDefault());build();

/* lightbox */
const lb=$('#lb'),lbi=$('#lbi'),lbc=$('#lbc'),btns=$$('.g');let cur=0,opener=null;
const show=i=>{cur=(i+btns.length)%btns.length;const im=$('img',btns[cur]);lbi.src=im.currentSrc||im.src;lbi.alt=im.alt;lbc.textContent=$('span',btns[cur]).textContent+'  ·  '+(cur+1)+' / '+btns.length};
const open=i=>{opener=document.activeElement;show(i);lb.hidden=false;document.body.style.overflow='hidden';$('#lbx').focus()};
const close=()=>{lb.hidden=true;document.body.style.overflow='';opener&&opener.focus()};
btns.forEach((b,i)=>b.addEventListener('click',()=>open(i)));
$('#lbx').onclick=close;$('#lbp').onclick=()=>show(cur-1);$('#lbn').onclick=()=>show(cur+1);
lb.addEventListener('click',e=>{if(e.target===lb)close()});
addEventListener('keydown',e=>{if(lb.hidden)return;
  if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(cur-1);else if(e.key==='ArrowRight')show(cur+1);
  else if(e.key==='Tab'){const els=$$('button',lb);const a=document.activeElement,fi=els[0],la=els[els.length-1];if(e.shiftKey&&a===fi){e.preventDefault();la.focus()}else if(!e.shiftKey&&a===la){e.preventDefault();fi.focus()}}});
let sx=null;lb.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',e=>{if(sx===null)return;const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(cur+(d<0?1:-1));sx=null});
})();
