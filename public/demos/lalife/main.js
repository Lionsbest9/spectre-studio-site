(function(){
'use strict';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

/* reveals */
var rv=$$('.sec .sh,.way,.composer,.it,.also,.doc,.langs,.finder,.visit');
rv.forEach(function(e){e.classList.add('rv')});
if('IntersectionObserver' in window&&!reduce){
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{rootMargin:'0px 0px -8% 0px'});
  rv.forEach(function(e,i){e.style.transitionDelay=(i%4)*60+'ms';io.observe(e)});
}else rv.forEach(function(e){e.classList.add('in')});

/* chart draw */
var chart=$('#chart');
if(reduce){chart.classList.add('go')}else{
  chart.classList.add('go');
}

/* pointer tilt on the chart (fine pointers only, off under reduced motion) */
if(!reduce&&matchMedia('(pointer:fine)').matches){
  var hero=$('#hero');
  hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;chart.style.setProperty('--ry',(x*7).toFixed(2)+'deg');chart.style.setProperty('--rx',(-y*5).toFixed(2)+'deg')});
  hero.addEventListener('pointerleave',function(){chart.style.setProperty('--ry','0deg');chart.style.setProperty('--rx','0deg')});
}

/* scroll state: progress, active chapter, needle */
var bar=$('.bar'),links=$$('.top nav a'),rls=$$('.rl'),needle=$('#needle');
var secs=['top','book','services','doctors','insurance','visit'].map(function(id){return {id:id,el:document.getElementById(id)||$('#hero')}});
function tick(){
  var h=document.documentElement,max=h.scrollHeight-innerHeight;
  bar.style.setProperty('--p',max>0?(scrollY/max).toFixed(4):0);
  rv.forEach(function(e){if(!e.classList.contains('in')&&e.getBoundingClientRect().top<innerHeight*0.95)e.classList.add('in')});
  var cur='top',line=innerHeight*0.4;
  secs.forEach(function(s){if(s.el.getBoundingClientRect().top<line)cur=s.id});
  links.forEach(function(a){a.classList.toggle('on',a.dataset.s===cur)});
  rls.forEach(function(r){var on=r.dataset.s===cur;r.classList.toggle('on',on);if(on&&needle)needle.style.transform='translateY('+(r.offsetTop+(r.offsetHeight-9)/2)+'px)'});
}
var raf=0;addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(function(){raf=0;tick()})},{passive:true});
addEventListener('resize',tick);tick();

/* accordion: one open at a time */
var its=$$('.it');
its.forEach(function(d){d.addEventListener('toggle',function(){if(d.open)its.forEach(function(o){if(o!==d)o.open=false})})});

/* tones */
var ctx=null,cols={125:70,250:158,500:246,1000:334,2000:422,4000:510,8000:598};
var probe=$('#probe'),pcol=$('#probeCol'),btns=$$('.tb button'),stopT=0,osc=null;
function play(btn){
  var f=+btn.dataset.f;
  try{
    ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
    if(ctx.state==='suspended')ctx.resume();
    if(osc){try{osc.stop()}catch(e){}}
    var o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime;
    o.type='sine';o.frequency.value=f;
    var peak=f<=250?0.14:0.07;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+.06);g.gain.setValueAtTime(peak,t+.9);g.gain.linearRampToValueAtTime(0,t+1.1);
    o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+1.15);osc=o;
  }catch(e){}
  btns.forEach(function(b){b.classList.toggle('on',b===btn);b.setAttribute('aria-pressed',b===btn)});
  pcol.setAttribute('x',cols[f]-15);probe.setAttribute('opacity','1');
  clearTimeout(stopT);stopT=setTimeout(function(){btns.forEach(function(b){b.classList.remove('on')});probe.setAttribute('opacity','0')},1200);
}
btns.forEach(function(b){b.addEventListener('click',function(){play(b)})});
document.addEventListener('visibilitychange',function(){if(document.hidden&&ctx&&ctx.state==='running')ctx.suspend()});

/* WhatsApp composer */
var form=$('#composer'),prev=$('#preview');
function msg(){
  var d=new FormData(form),name=(d.get('name')||'').trim(),who=d.get('who'),svc=d.get('svc'),day=(d.get('day')||'').trim();
  var t='Hello La Life Polyclinic, '+(name?'my name is '+name+'. ':'')+'I would like to book a visit for '+who+': '+svc+'.';
  if(day)t+=' A day that suits me: '+day+'.';
  var ins=(d.get('ins')||'').trim();if(ins)t+=' Insurance: '+ins+'.';
  t+=' Please tell me the next free time. Thank you.';
  return t;
}
function show(){prev.textContent=msg()}
form.addEventListener('input',show);form.addEventListener('change',show);show();
form.addEventListener('submit',function(e){
  e.preventDefault();
  window.open('https://wa.me/250788520986?text='+encodeURIComponent(msg()),'_blank','noopener');
});

/* department chips + copy */
$$('.onetrip button').forEach(function(b){b.addEventListener('click',function(){var d=its[+b.dataset.open];d.open=true;setTimeout(function(){d.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})},60)})});
$('#copy').addEventListener('click',function(){var b=this,t=msg();(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){b.textContent='Copied. Paste it wherever you prefer.'},function(){b.textContent='Select the message above and copy it'});setTimeout(function(){b.textContent='Copy the message instead'},3000)});

/* insurer finder */
var q=$('#insq'),li=$$('#ins li'),none=$('#insnone');
function norm(s){return s.toLowerCase().replace(/[^a-z0-9]/g,'')}
q.addEventListener('input',function(){
  var v=norm(q.value),n=0;
  li.forEach(function(x){var m=v&&norm(x.textContent).indexOf(v)>-1;x.classList.toggle('hit',!!m);x.classList.toggle('dim',!!v&&!m);if(m)n++});
  none.hidden=!(v&&!n);
});

/* Kigali clock */
var ck=$('#clock');
function clock(){try{ck.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Kigali'}).format(new Date())}catch(e){}}
clock();setInterval(clock,20000);
})();
