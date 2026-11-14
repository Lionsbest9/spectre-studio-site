(function(){
var NUM="250791504912",MAIL="info@nmc-rw.com",TZ="Africa/Kigali";
var HRS={1:[8,18],2:[8,18],3:[8,18],4:[8,18],5:[8,18],6:[9,15],0:null};
var DN=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],DS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var DNF=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
var CARE=[
["Benign prostate","Benign prostatic hyperplasia","Benign prostatic hyperplasia (BPH) is a health issue that becomes more common with age. Also called an enlarged prostate, it can block the flow of urine out of the bladder and cause bladder, urinary tract or kidney problems.",["Frequent or urgent need to pee","Peeing more often at night","Trouble starting to pee","Weak stream, or one that stops and starts","Dribbling at the end of urination","Not being able to fully empty the bladder"]],
["Urinary stone disease","Kidney stones","Kidney stones (renal calculi, nephrolithiasis, urolithiasis) are hard deposits of minerals and salts that form inside the kidneys.",["Pain in the lower back, side or belly","Painful urination","Bloody urine","Cloudy or foul-smelling urine","Nausea and vomiting","Fever or chills"]],
["Prostate cancer","","Cancer that forms in the tissues of the prostate, a gland just below the bladder and in front of the rectum. It usually occurs in older men.",["Blood in the urine","Blood in the semen","Needing to urinate more often","Trouble getting started","Waking up to urinate more at night"]],
["Bladder cancer","","A growth of abnormal tissue, known as a tumour, develops in the bladder lining. In some cases the tumour spreads into the bladder muscle.",["Blood in the urine, usually painless","Frequent urination and urgency","Trouble urinating","Lower back pain"]],
["Kidney cancer","Renal cell carcinoma","Cancer that starts in the cells of the kidney. The most common type is renal cell carcinoma (RCC). Usually only one kidney is affected.",["Blood in the urine, or dark, rusty or brown urine","Pain or a dull ache in the side or lower back not due to injury","A lump in the abdomen","Constant tiredness","Rapid, unexplained weight loss","Fever not caused by a cold or flu"]],
["Incontinence","","Urinary incontinence means a person leaks urine by accident, from a slight loss after sneezing, coughing or laughing to complete inability to control urination.",["Waking up at night to urinate","A constant feeling of wetness","Feeling the bladder does not empty completely","Needing to rush to the restroom","Leaking urine during sexual activity"]],
["Female urology","Urogynecology","A medical subspecialty that focuses on the diagnosis and treatment of urinary tract conditions in women.",null],
["Urodynamics","Testing","A set of tests that evaluate how well the bladder and urethra store and release urine. It can help identify problems with the bladder, urethra and sphincters.",null]];
var INS=[["Eden Care","eden"],["MSH International","msh"],["MMI","mmi"],["Cigna","cigna"],["UAP","uap"],["RSSB","rssb"],["Radiant","radiant"]];
var PH=[["1","The stone gate and lane"],["6","Reception"],["2","Waiting area"],["3","Seats outside the rooms"],["10","Laboratory analyser"],["11","Laboratory"],["21","Treatment room"]];
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return[].slice.call((c||document).querySelectorAll(s))};
var rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
function kg(){var p=new Intl.DateTimeFormat("en-GB",{timeZone:TZ,weekday:"short",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date()),o={};p.forEach(function(x){o[x.type]=x.value});var h=+o.hour%24,m=+o.minute;return{d:DS.indexOf(o.weekday),h:h,m:m,t:h+m/60,txt:("0"+h).slice(-2)+":"+o.minute}}
function f(h){return("0"+h).slice(-2)+":00"}
/* status */
function status(){var n=kg(),h=HRS[n.d],s=$("#status"),t=$("#statusText"),cs=$("#clockState"),msg;
 if(h&&n.t>=h[0]&&n.t<h[1]){s.className="status open";msg="Open now, until "+f(h[1])+" (listed hours)"}
 else{s.className="status closed";var d=n.d,k=0,nx;if(h&&n.t<h[0]){msg="Closed, opens today at "+f(h[0])}else{for(k=1;k<8;k++){nx=(d+k)%7;if(HRS[nx]){msg="Closed, opens "+(k==1?"tomorrow":DN[nx])+" at "+f(HRS[nx][0]);break}}}
  if(n.d==6&&n.t>=15||n.d==0)msg+=" (Sunday: on appointment)"}
 t.textContent=msg;$("#clock").textContent=n.txt;cs.textContent=msg;moveNeedle(n)}
/* week */
var needle;function buildWeek(){var w=$("#week"),order=[1,2,3,4,5,6,0],n=kg();
 w.innerHTML=order.map(function(d){var h=HRS[d],L=6,R=20,s=h?((h[0]-L)/(R-L)*100):0,wd=h?((h[1]-h[0])/(R-L)*100):0;
 return'<div class="wd'+(d==n.d?" today":"")+(h?"":" appt")+'" role="row" data-d="'+d+'"><b>'+DS[d]+'</b><div class="bar" aria-hidden="true">'+(h?'<span style="left:'+s+'%;width:'+wd+'%"></span>':'')+'</div><small>'+(h?f(h[0])+" - "+f(h[1]):"On appointment")+'</small></div>'}).join("")+'<div class="wd axis" aria-hidden="true"><b></b><div class="ax"><span style="left:2%">06:00</span><span style="left:43%">12:00</span><span style="left:84%">18:00</span></div><small></small></div>';
 needle=document.createElement("i");needle.className="needle";moveNeedle(n)}
function moveNeedle(n){if(!needle)return;var row=$('.wd[data-d="'+n.d+'"] .bar');if(!row)return;$$(".wd").forEach(function(r){r.classList.toggle("today",+r.dataset.d==n.d)});var p=Math.max(0,Math.min(1,(n.t-6)/14));needle.style.left="calc("+p*100+"% - 1px)";row.appendChild(needle);row.style.overflow="visible"}
/* composer */
function fill(){var r=$("#reasons"),rs=["Prefer not to say","Consultation, not sure"].concat(CARE.map(function(c){return c[0]}));
 r.innerHTML=rs.map(function(x,i){return'<label><input type="radio" name="reason" value="'+x+'"'+(i==0?" checked":"")+'><span>'+x+'</span></label>'}).join("");
 var n=kg(),d=$("#day"),o=[];for(var i=0;i<8;i++){var dt=new Date(Date.now()+i*864e5),wd=new Intl.DateTimeFormat("en-GB",{timeZone:TZ,weekday:"long",day:"numeric",month:"short"}).format(dt);o.push([wd,new Intl.DateTimeFormat("en-GB",{timeZone:TZ,weekday:"short"}).format(dt)])}
 d.innerHTML='<option value="">First available</option>'+o.map(function(x){return'<option value="'+x[0]+'" data-w="'+x[1]+'">'+x[0]+'</option>'}).join("");
 $("#ins").innerHTML='<option value="">Not sure yet</option><option value="self">I will pay myself</option>'+INS.map(function(x){return'<option>'+x[0]+'</option>'}).join("")+'<option value="other">Another insurer</option>'}
var DOC="";
function val(n){var e=document.querySelector('input[name="'+n+'"]:checked');return e?e.value:""}
function msg(){var fr=val("lang")=="fr",who=val("who"),re=val("reason"),dy=$("#day").value,pt=val("part"),ins=$("#ins").value,nm=$("#nm").value.trim(),L=[];
 var sel=$("#day").selectedOptions[0],w=sel&&sel.dataset.w,hint=$("#dayHint");hint.textContent=w=="Sun"?"Sunday is on appointment: the clinic will tell you if it can fit you in.":"";
 if(fr){L.push("Bonjour Nyarutarama Medical Center, je voudrais prendre rendez-vous"+(DOC?" avec "+DOC:"")+(who=="me"?".":" pour une autre personne."));
  L.push("Motif : "+(re=="Prefer not to say"?"je l'expliquerai a la consultation":re=="Consultation, not sure"?"consultation, je ne sais pas encore":re)+".");
  var di=dy?(DNF[DS.indexOf(w)]+" "+dy.replace(/^\w+,?\s*/,"")):"des que possible";L.push("Souhait : "+di+(dy?", "+(pt=="morning"?"le matin":"l'apres-midi"):"")+".");
  L.push("Assurance : "+(ins==""?"pas encore sure":ins=="self"?"je paie moi-meme":ins=="other"?"autre assureur":ins)+".");if(nm)L.push("Nom : "+nm+". Merci.")}
 else{L.push("Hello Nyarutarama Medical Center, I would like to book an appointment"+(DOC?" with "+DOC:"")+(who=="me"?".":" for someone else."));
  L.push("Reason: "+(re=="Prefer not to say"?"I will explain at the visit":re=="Consultation, not sure"?"a consultation, I am not sure yet":re)+".");
  L.push("Preferred: "+(dy?dy+", "+pt:"first available")+".");
  L.push("Insurance: "+(ins==""?"not sure yet":ins=="self"?"I will pay myself":ins=="other"?"another insurer":ins)+".");if(nm)L.push("Name: "+nm+". Thank you.")}
 return L.join("\n")}
function upd(){var m=msg();$("#bubble").textContent=m;var e=encodeURIComponent(m);$("#waGo").href="https://wa.me/"+NUM+"?text="+e;$("#mailGo").href="mailto:"+MAIL+"?subject="+encodeURIComponent("Appointment request")+"&body="+e;$$("[data-wa]").forEach(function(a){a.href="#book"})}
function setReason(v){var i=$$('input[name="reason"]').filter(function(x){return x.value==v})[0];if(i){i.checked=true}upd()}
function go(){document.getElementById("book").scrollIntoView({behavior:rm?"auto":"smooth"})}
/* care */
function buildAcc(){$("#acc").innerHTML=CARE.map(function(c,i){return'<div class="ai"><button aria-expanded="false" aria-controls="p'+i+'" id="b'+i+'"><i>0'+(i+1)+'</i><span>'+c[0]+'</span><b></b></button><div class="pan" id="p'+i+'" role="region" aria-labelledby="b'+i+'"><div><div class="pb"><div><p>'+c[2]+'</p>'+(c[1]?'<p class="fine">Also known as: '+c[1]+'</p>':'')+'<button class="btn btn-wa" data-reason="'+c[0]+'">Ask about this</button></div>'+(c[3]?'<div><h5>Symptoms listed by the clinic</h5><ul>'+c[3].map(function(s){return"<li>"+s+"</li>"}).join("")+'</ul></div>':'<div><h5>Symptom list</h5><p class="fine"><span class="tc">to confirm</span> not published on the clinic\'s site.</p></div>')+'</div></div></div></div>'}).join("");
 $$(".ai>button").forEach(function(b){b.onclick=function(){var it=b.parentNode,o=it.classList.toggle("open");b.setAttribute("aria-expanded",o)}});
 $$("[data-reason]").forEach(function(b){b.onclick=function(){setReason(b.dataset.reason);go()}})}
/* insurers */
function buildIns(){var t=$("#tiles");t.innerHTML=INS.map(function(x){return'<button class="tile" aria-pressed="false" data-n="'+x[0]+'"><img src="img/p/ins-'+x[1]+'.webp" width="84" height="84" alt="" loading="lazy">'+x[0]+'</button>'}).join("")+'<button class="tile miss" data-n="other">Not listed here?</button>';
 function pick(n){$$(".tile").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.n==n)});var v=$("#verdict");
  if(n=="other")v.innerHTML='<span>The clinic\'s site shows seven partners. For any other insurer, ask the clinic before you come. <span class="tc">to confirm</span></span><button class="btn btn-wa" data-i="other">Ask about my insurer</button>';
  else v.innerHTML='<span><b>'+n+'</b> is shown among the clinic\'s insurance partners. This page cannot confirm cover: tap to ask the clinic whether it applies to your visit and what pre-approval it needs. <span class="tc">to confirm</span></span><button class="btn btn-wa" data-i="'+n+'">Ask if '+n+' covers my visit</button>';
  if(innerWidth<900)v.scrollIntoView({block:"nearest",behavior:rm?"auto":"smooth"});$("button[data-i]",v).onclick=function(){$("#ins").value=this.dataset.i;upd();go()}}
 $$(".tile").forEach(function(b){b.onclick=function(){pick(b.dataset.n)}});
 $("#iq").oninput=function(){var q=this.value.toLowerCase().trim(),m=0;$$(".tile:not(.miss)").forEach(function(b){var s=b.dataset.n.toLowerCase().indexOf(q)>-1;b.hidden=!s;if(s)m++});if(q&&m==1){var o=$$(".tile:not(.miss)").filter(function(b){return!b.hidden})[0];pick(o.dataset.n)}else if(q&&!m)pick("other")}}
/* lightbox */
var LB=[],li=0,last;
function openLB(i,el){li=i;last=el;var o=$("#lb");o.hidden=false;show();$("#lbx").focus();document.body.style.overflow="hidden"}
function show(){var x=LB[li];$("#lbi").src=x.s;$("#lbi").alt=x.c;$("#lbc").textContent=x.c;var m=LB.length>1;$("#lbp").style.visibility=$("#lbn").style.visibility=m?"visible":"hidden"}
function closeLB(){$("#lb").hidden=true;document.body.style.overflow="";if(last)last.focus()}
function step(d){li=(li+d+LB.length)%LB.length;show()}
function buildLB(){var m=$("#mosaic");m.innerHTML=PH.map(function(p,i){return'<button class="mo" data-i="'+i+'"><img src="img/p/'+p[0]+'-s.webp" alt="'+p[1]+'" loading="lazy" width="640" height="360"><span>'+p[1]+'</span></button>'}).join("");
 $$(".mo").forEach(function(b){b.onclick=function(){LB=PH.map(function(p){return{s:"img/p/"+p[0]+".webp",c:p[1]+" (photo: the clinic's own site)"}});openLB(+b.dataset.i,b)}});
 $$(".ph").forEach(function(b){b.onclick=function(){LB=[{s:b.dataset.lb,c:b.dataset.cap+" (portrait: the clinic's own site)"}];openLB(0,b)}});
 $("#lbx").onclick=closeLB;$("#lbp").onclick=function(){step(-1)};$("#lbn").onclick=function(){step(1)};
 $("#lb").addEventListener("click",function(e){if(e.target==this)closeLB()});
 document.addEventListener("keydown",function(e){if($("#lb").hidden)return;if(e.key=="Escape")closeLB();else if(e.key=="ArrowLeft"&&LB.length>1)step(-1);else if(e.key=="ArrowRight"&&LB.length>1)step(1);else if(e.key=="Tab"){var fs=$$("#lb button").filter(function(b){return b.style.visibility!="hidden"}),a=document.activeElement;if(e.shiftKey&&a==fs[0]){e.preventDefault();fs[fs.length-1].focus()}else if(!e.shiftKey&&a==fs[fs.length-1]){e.preventDefault();fs[0].focus()}}});
 var sx=null;$("#lb").addEventListener("touchstart",function(e){sx=e.touches[0].clientX},{passive:true});$("#lb").addEventListener("touchend",function(e){if(sx==null||LB.length<2)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)step(dx<0?1:-1);sx=null})}
/* visit */
function visit(){var A="Nyarutarama Medical Center, 19 KG 529 St, Kimihurura, Kigali";$("#copyAddr").onclick=function(){var b=this;(navigator.clipboard?navigator.clipboard.writeText(A):Promise.reject()).then(function(){b.textContent="Copied"},function(){b.textContent="Copy failed, long-press the address"});setTimeout(function(){b.textContent="Copy address"},2200)};
 $("#shareAddr").href="https://wa.me/?text="+encodeURIComponent(A+"\nhttps://www.google.com/maps/place/Nyarutarama+medical+center/@-1.950568,30.0993109,17z")}
/* ask doctor */
function docs(){$$("[data-ask-doc]").forEach(function(b){b.onclick=function(){DOC=b.dataset.askDoc;upd();go()}})}
/* motion */
function motion(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});$$("[data-reveal]").forEach(function(s){io.observe(s)});
 var dock=$("#dock");function hid(id){var r=document.getElementById(id).getBoundingClientRect();return r.top<innerHeight*.7&&r.bottom>120}addEventListener("scroll",function(){dock.classList.toggle("show",scrollY>520&&!hid("book")&&!hid("visit"))},{passive:true});
 if(rm||!matchMedia("(pointer:fine)").matches)return;var a=$("#arch");a.addEventListener("pointermove",function(e){var r=a.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;a.style.setProperty("--ry",(x*8)+"deg");a.style.setProperty("--rx",(-y*6)+"deg")});a.addEventListener("pointerleave",function(){a.style.setProperty("--ry","0deg");a.style.setProperty("--rx","0deg")})}
buildWeek();fill();buildAcc();buildIns();buildLB();visit();docs();motion();upd();status();
document.addEventListener("input",upd);document.addEventListener("change",upd);
setInterval(function(){if(!document.hidden)status()},30000);
$$("[data-wa]").forEach(function(a){a.onclick=function(e){e.preventDefault();go()}});
})();
