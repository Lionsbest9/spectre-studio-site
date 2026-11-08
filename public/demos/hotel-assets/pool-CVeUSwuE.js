import{D as e,O as t,S as n,_ as r,m as i,t as a,v as o,x as s,y as c}from"./three.module-BuwqUnba.js";import{i as l,r as u}from"./preload-helper-CBi3aOpi.js";var d=8,f=`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`,p=`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntro;
  uniform vec2 uAspect;
  uniform vec3 uRipples[${d}]; // xy = position in uv, z = start time (-1 = empty)

  // pool rectangle in uv space (set per layout)
  uniform vec2 P0;
  uniform vec2 P1;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

  float height(vec2 uv) {
    vec2 p = uv * uAspect;
    float t = uTime;
    float h = 0.0;
    h += sin(p.x * 9.0 + t * 0.9) * 0.010;
    h += sin(p.y * 13.0 - t * 1.1 + p.x * 3.0) * 0.008;
    h += sin((p.x + p.y) * 21.0 + t * 1.7) * 0.004;
    for (int i = 0; i < ${d}; i++) {
      vec3 r = uRipples[i];
      if (r.z < 0.0) continue;
      float age = t - r.z;
      if (age < 0.0 || age > 5.0) continue;
      float d = length((uv - r.xy) * uAspect);
      float front = age * 0.32;
      float env = exp(-age * 0.9) * exp(-abs(d - front) * 9.0);
      h += sin((d - front) * 70.0) * 0.05 * env;
    }
    return h;
  }

  float caustic(vec2 p, float t) {
    vec2 q = p * 7.0;
    float c = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      q += vec2(sin(q.y * 1.3 + t * 0.6 + fi), cos(q.x * 1.1 - t * 0.5 + fi * 1.7)) * 0.55;
      c += abs(sin(q.x) * cos(q.y));
    }
    return pow(1.0 - c / 3.0, 6.0);
  }

  void main() {
    vec2 uv = vUv;
    vec3 col;
    float inPool = step(P0.x, uv.x) * step(uv.x, P1.x) * step(P0.y, uv.y) * step(uv.y, P1.y);

    // deck and coping outside the water
    vec2 dEdge = min(uv - P0, P1 - uv);
    float edge = min(dEdge.x, dEdge.y);
    if (inPool < 0.5) {
      float coping = smoothstep(-0.022, -0.018, edge);
      vec2 slab = floor(uv * uAspect * 26.0);
      float n = hash(slab) * 0.018;
      vec3 deck = vec3(0.055, 0.105, 0.09) + n;
      vec3 stone = vec3(0.20, 0.25, 0.22) + n;
      col = mix(deck, stone, coping);
      // warm spill from the lamps onto the deck
      col += vec3(1.0, 0.82, 0.4) * 0.08 * exp(-length((uv - vec2((P0.x + P1.x) * 0.5, P1.y)) * uAspect) * 3.0);
    } else {
      float e = 0.0015;
      float h = height(uv);
      vec2 grad = vec2(height(uv + vec2(e, 0.0)) - h, height(uv + vec2(0.0, e)) - h) / e;
      vec3 n = normalize(vec3(-grad * 0.6, 1.0));

      // tiled floor seen through the water
      vec2 fuv = (uv - P0) / (P1 - P0) + n.xy * 0.035;
      vec2 tile = fract(fuv * vec2(10.0, 12.0) * vec2((P1.x - P0.x) / 0.27, (P1.y - P0.y) / 0.42));
      float grout = smoothstep(0.0, 0.06, tile.x) * smoothstep(0.0, 0.06, tile.y)
                  * smoothstep(1.0, 0.94, tile.x) * smoothstep(1.0, 0.94, tile.y);
      vec3 floorCol = mix(vec3(0.30, 0.72, 0.64), vec3(0.10, 0.40, 0.38), grout);
      // the near end (under the headline) sits deeper and darker, the far end is lit
      floorCol *= mix(0.42, 1.0, fuv.y);
      // lamps on the far wall
      float l1 = exp(-length((fuv - vec2(0.30, 0.99)) * vec2(1.4, 1.0)) * 3.2);
      float l2 = exp(-length((fuv - vec2(0.70, 0.99)) * vec2(1.4, 1.0)) * 3.2);
      vec3 lamp = vec3(1.0, 0.82, 0.42) * (l1 + l2) * 1.1;
      vec3 under = floorCol + lamp * 0.6;
      under += vec3(0.56, 0.83, 0.66) * caustic(fuv + n.xy * 0.2, uTime) * (0.35 + (l1 + l2) * 0.9);

      // surface: fresnel toward the night sky, one soft highlight from the moon
      vec3 view = normalize(vec3(0.0, -0.55, 0.8));
      float fres = pow(1.0 - max(dot(n, -view * vec3(1.0, -1.0, 1.0)), 0.0), 3.0);
      vec3 sky = vec3(0.02, 0.06, 0.07);
      vec3 sun = normalize(vec3(-0.3, 0.6, 0.75));
      float spec = pow(max(dot(reflect(-sun, n), vec3(0.0, 0.0, 1.0)), 0.0), 220.0);
      col = mix(under, sky, clamp(fres * 0.5 + 0.06, 0.0, 1.0)) + spec * vec3(1.0, 0.95, 0.8) * 0.9;
      // shadow line just inside the coping
      col *= smoothstep(0.0, 0.02, edge) * 0.35 + 0.65;
    }

    // vignette into the page colour and the intro fade
    float v = smoothstep(0.95, 0.3, length((uv - (P0 + P1) * 0.5) * uAspect));
    col = mix(vec3(0.051, 0.122, 0.102), col, v);
    col *= uIntro;
    gl_FragColor = vec4(col, 1.0);
  }
`;function m(m){let h=new a({canvas:m,antialias:!1,powerPreference:`low-power`});h.setClearColor(859930,1);let g=new s,_=new r(38,1,.1,50),v=Array.from({length:d},()=>new t(0,0,-1)),y={uTime:{value:u()?2.2:0},uIntro:{value:+!!u()},uAspect:{value:new e(1.6,1)},uRipples:{value:v},P0:{value:new e(.517,.3)},P1:{value:new e(.783,.7)}},b=new i(new o(30,20),new n({vertexShader:f,fragmentShader:p,uniforms:y}));b.rotation.x=-Math.PI/2,g.add(b);let x=0,S=0,C=(e,t,n=y.uTime.value)=>{v[x].set(e,t,n),x=(x+1)%d},w=new c,T=new e,E=e=>{let t=m.getBoundingClientRect();return T.set((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1),w.setFromCamera(T,_),w.intersectObject(b)[0]?.uv},D=m.closest(`.hero`);D.addEventListener(`pointermove`,e=>{let t=y.uTime.value;if(t-S<.12)return;let n=E(e);n&&(C(n.x,n.y),S=t)},{passive:!0}),D.addEventListener(`pointerdown`,e=>{let t=E(e);t&&C(t.x,t.y)});let O=0;u()&&(C(.4,.5,.2),C(.65,.62,1)),l({canvas:m,renderer:h,frame:e=>{y.uTime.value+=e;let t=y.uTime.value;y.uIntro.value<1&&(y.uIntro.value=Math.min(1,y.uIntro.value+e*.6)),O-=e,O<=0&&(C(.2+Math.random()*.6,.3+Math.random()*.5,t),O=2.2+Math.random()*2);let n=Math.sin(t*.07)*.25;_.position.set(n,16,4),_.lookAt(n*.5,0,0),h.render(g,_)},onResize:(e,t)=>{_.aspect=e/t;let n=e<t;_.fov=n?54:40,n?(y.P0.value.set(.39,.52),y.P1.value.set(.61,.84)):(y.P0.value.set(.535,.31),y.P1.value.set(.785,.71)),_.updateProjectionMatrix(),y.uAspect.value.set(30/20,1)}})}export{m as startPool};