// The home page's one WebGL scene, fixed behind the content.
// Hero: 4,800 light points gather out of dust into the studio wordmark and part around the
// pointer; as the first chapter turns, a pearly spectral ring arrives and the points morph per
// chapter (browser window, data surface, lattice) with a few glints. After the hero the ring
// fades out and a twisting spectral ribbon drifts behind the light sections.
// About 5 draw calls, no shadow maps, DPR capped, the loop stops when the tab is hidden.

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scroll } from "./scroll.js";
import { prefersReducedMotion, webglAvailable } from "./motion.js";

const SPECTRAL = /* glsl */ `
  vec3 spectral(float t) {
    t = fract(t);
    vec3 c1 = vec3(0.30, 0.94, 1.00);
    vec3 c2 = vec3(0.49, 1.00, 0.70);
    vec3 c3 = vec3(1.00, 0.89, 0.48);
    vec3 c4 = vec3(1.00, 0.56, 0.38);
    float s = t * 4.0;
    if (s < 1.0) return mix(c1, c2, s);
    if (s < 2.0) return mix(c2, c3, s - 1.0);
    if (s < 3.0) return mix(c3, c4, s - 2.0);
    return mix(c4, c1, s - 3.0);
  }
`;

// ---------- pearly iridescent material (ring and ribbon) ----------

function makePearl({ repeat = 1.0, light = false } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 }, uRepeat: { value: repeat }, uLight: { value: light ? 1 : 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV; varying vec2 vUv;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal); vV = mv.xyz; vUv = uv;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uOpacity; uniform float uRepeat; uniform float uLight;
      varying vec3 vN; varying vec3 vV; varying vec2 vUv;
      ${SPECTRAL}
      void main() {
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(-vV))), 1.5);
        vec3 tint = spectral(f * 0.85 + vUv.x * uRepeat + uTime * 0.035);
        vec3 pearl = mix(vec3(0.93, 0.96, 1.0), tint, 0.45 + 0.5 * f);
        pearl += pow(f, 4.0) * 0.55;
        // on the light page the ribbon needs a little more body to read against bone
        pearl = mix(pearl, pearl * vec3(0.78, 0.86, 0.92), uLight * 0.35);
        gl_FragColor = vec4(pearl, uOpacity * (0.82 + 0.18 * f));
      }`,
  });
}

// ---------- point shapes ----------

const N = 4800;

function fibSphere(i, n, r) {
  const y = 1 - (i / (n - 1)) * 2;
  const rad = Math.sqrt(1 - y * y);
  const th = i * 2.399963;
  return [Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r];
}

function alongSegments(segs, n, jitter = 0.012) {
  const lens = segs.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]));
  const total = lens.reduce((s, l) => s + l, 0);
  const out = [];
  for (let i = 0; i < n; i++) {
    let d = (i / n) * total;
    let k = 0;
    while (k < segs.length - 1 && d > lens[k]) d -= lens[k++];
    const [a, b] = segs[k];
    const t = lens[k] ? d / lens[k] : 0;
    out.push([
      a[0] + (b[0] - a[0]) * t + (Math.random() - 0.5) * jitter,
      a[1] + (b[1] - a[1]) * t + (Math.random() - 0.5) * jitter,
      a[2] + (b[2] - a[2]) * t + (Math.random() - 0.5) * jitter,
    ]);
  }
  return out;
}

function browserWindow(n) {
  const w = 1.0, h = 0.7, z = 0;
  const segs = [];
  const rect = (x0, y0, x1, y1) => {
    segs.push([[x0, y0, z], [x1, y0, z]], [[x1, y0, z], [x1, y1, z]], [[x1, y1, z], [x0, y1, z]], [[x0, y1, z], [x0, y0, z]]);
  };
  rect(-w, -h, w, h); // frame
  segs.push([[-w, h - 0.18, z], [w, h - 0.18, z]]); // title bar
  rect(-w + 0.08, h - 0.1, -w + 0.12, h - 0.07);
  rect(-w + 0.17, h - 0.1, -w + 0.21, h - 0.07);
  rect(-w + 0.26, h - 0.1, -w + 0.3, h - 0.07);
  rect(-0.86, 0.22, -0.1, 0.36); // heading block
  for (let k = 0; k < 4; k++) segs.push([[-0.86, 0.06 - k * 0.12, z], [-0.1 - (k % 2) * 0.18, 0.06 - k * 0.12, z]]); // text lines
  rect(0.06, -0.56, 0.86, 0.36); // image block
  segs.push([[0.06, -0.56, z], [0.86, 0.36, z]], [[0.06, 0.36, z], [0.86, -0.56, z]]);
  return alongSegments(segs, n);
}

function dataSurface(n) {
  const out = [];
  const side = Math.ceil(Math.sqrt(n));
  for (let i = 0; i < n; i++) {
    const gx = (i % side) / (side - 1) - 0.5;
    const gz = Math.floor(i / side) / (side - 1) - 0.5;
    const x = gx * 2.0, zz = gz * 2.0;
    const y = Math.sin(x * 2.6) * 0.22 + Math.cos(zz * 3.1 + x) * 0.16;
    // tilt toward the camera so the surface reads as a chart
    out.push([x, y * 0.9 + zz * 0.42, zz * 0.62]);
  }
  return out;
}

function lattice(n) {
  const segs = [];
  const cube = (s) => {
    const c = [-s, s];
    const v = [];
    for (const x of c) for (const y of c) for (const z of c) v.push([x, y, z]);
    const e = [];
    for (let a = 0; a < 8; a++) for (let b = a + 1; b < 8; b++) {
      const d = [0, 1, 2].filter((k) => v[a][k] !== v[b][k]).length;
      if (d === 1) e.push([v[a], v[b]]);
    }
    return { v, e };
  };
  const outer = cube(0.72), inner = cube(0.36);
  segs.push(...outer.e, ...inner.e);
  for (let k = 0; k < 8; k++) segs.push([outer.v[k], inner.v[k]]);
  return alongSegments(segs, n, 0.01);
}

// The wordmark: sample the lit pixels of "Spectre" set in Instrument Serif italic. Most points
// sit on the letters; one in fourteen drifts in a loose cloud around them, like dust off a page.
const WORD_W = 3.4;
function wordPoints(n, text = "Spectre") {
  const W = 1400, H = 420;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = 'italic 400 330px "Instrument Serif", "Times New Roman", serif';
  ctx.fillText(text, W / 2, H / 2 + 8);
  const data = ctx.getImageData(0, 0, W, H).data;
  const lit = [];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (data[(y * W + x) * 4 + 3] > 150) lit.push(x, y);
  if (lit.length < 200) return null;
  const k = WORD_W / W;
  const out = [];
  for (let i = 0; i < n; i++) {
    if (i % 14 === 13) {
      // dust: a soft ellipse, thicker near the word
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 1.3);
      out.push([Math.cos(a) * r * WORD_W * 0.58, Math.sin(a) * r * 0.62, (Math.random() - 0.5) * 0.7]);
      continue;
    }
    const j = ((Math.random() * (lit.length / 2)) | 0) * 2;
    out.push([(lit[j] - W / 2) * k + (Math.random() - 0.5) * 0.008, -(lit[j + 1] - H / 2) * k + (Math.random() - 0.5) * 0.008, (Math.random() - 0.5) * 0.06]);
  }
  return out;
}

function PointField({ reduced }) {
  const pts = useRef(null);
  const geo = useMemo(() => {
    const shapes = [
      Array.from({ length: N }, (_, i) => fibSphere(i, N, 1.0)),
      browserWindow(N),
      dataSurface(N),
      lattice(N),
    ];
    const g = new THREE.BufferGeometry();
    const names = ["position", "aB", "aC", "aD"];
    shapes.forEach((pts, s) => {
      const arr = new Float32Array(N * 3);
      pts.forEach((p, i) => arr.set(p, i * 3));
      g.setAttribute(names[s], new THREE.BufferAttribute(arr, 3));
    });
    const rnd = new Float32Array(N);
    for (let i = 0; i < N; i++) rnd[i] = Math.random();
    g.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 3);
    return g;
  }, []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uW: { value: new THREE.Vector4(1, 0, 0, 0) },
          uTime: { value: 0 },
          uOpacity: { value: 1 },
          uSize: { value: 30 },
          uAppear: { value: 0 },
          uMouse: { value: new THREE.Vector3(99, 99, 0) },
          uPush: { value: 0 },
        },
        vertexShader: /* glsl */ `
          attribute vec3 aB; attribute vec3 aC; attribute vec3 aD; attribute float aRand;
          uniform vec4 uW; uniform float uTime; uniform float uSize;
          uniform float uAppear; uniform vec3 uMouse; uniform float uPush;
          varying vec3 vCol; varying float vR; varying float vA;
          ${SPECTRAL}
          void main() {
            vec3 p = position * uW.x + aB * uW.y + aC * uW.z + aD * uW.w;
            // gather: each point flies in from its own scattered start, staggered by aRand
            vec3 from = vec3(sin(aRand * 91.0), cos(aRand * 57.0) * 0.7, sin(aRand * 23.0)) * 2.8;
            float a = smoothstep(aRand * 0.55, aRand * 0.55 + 0.45, uAppear);
            p = mix(p + from, p, a);
            // the pointer parts the points like a hand through sand
            vec2 d = p.xy - uMouse.xy;
            float r2 = dot(d, d);
            float fall = exp(-r2 * 14.0) * uPush;
            p.xy += normalize(d + vec2(1e-4)) * fall * 0.16;
            p.z += fall * (aRand - 0.5) * 0.6;
            p += 0.012 * vec3(sin(uTime * 0.9 + aRand * 31.0), cos(uTime * 0.7 + aRand * 17.0), sin(uTime * 0.5 + aRand * 11.0));
            vA = a;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = uSize * (0.55 + aRand * 0.9) / -mv.z;
            gl_Position = projectionMatrix * mv;
            vCol = spectral(aRand * 0.5 + p.y * 0.18 + uTime * 0.03);
            vR = aRand;
          }`,
        fragmentShader: /* glsl */ `
          uniform float uOpacity; varying vec3 vCol; varying float vR; varying float vA;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(mix(vCol, vec3(1.0), 0.35), a * uOpacity * (0.55 + vR * 0.45) * (0.25 + 0.75 * vA));
          }`,
      }),
    []
  );
  const w = useMemo(() => new THREE.Vector4(), []);
  const smooth = useRef(0);
  const ready = useRef(false);
  const appear = useRef(reduced ? 1 : 0);
  const push = useRef(0);
  const moved = useRef(false);
  const ray = useMemo(() => ({ v: new THREE.Vector3(), dir: new THREE.Vector3() }), []);

  // swap the placeholder sphere for the wordmark once the serif is in
  useEffect(() => {
    let alive = true;
    const fill = () => {
      if (!alive || ready.current) return;
      const word = wordPoints(N);
      if (word) {
        const arr = geo.attributes.position.array;
        word.forEach((p, i) => arr.set(p, i * 3));
        geo.attributes.position.needsUpdate = true;
      }
      ready.current = true;
    };
    const load = document.fonts?.load('italic 330px "Instrument Serif"');
    if (load) load.then(fill, fill);
    else fill();
    const t = setTimeout(fill, 2500); // never hold the hero longer than this
    const onMove = (e) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen" || e.pointerType === "touch") moved.current = true;
    };
    const onLeave = () => (moved.current = false);
    addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      alive = false;
      clearTimeout(t);
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [geo]);

  useFrame((state, delta) => {
    const m = material;
    const dt = Math.min(delta, 0.05);
    // the gather runs on wall-clock time, so a slow device still finishes it in 1.6 s
    if (ready.current && appear.current < 1) appear.current = reduced ? 1 : Math.min(1, appear.current + Math.min(delta, 0.4) / 1.6);
    m.uniforms.uAppear.value = appear.current;
    // pointer in the point field's own space: cast onto the z = 0 plane, then into local
    const opening = 1 - Math.min(1, scroll.chapter);
    const want = !reduced && moved.current && appear.current > 0.9 ? opening : 0;
    push.current += (want - push.current) * (1 - Math.exp(-5 * dt));
    m.uniforms.uPush.value = push.current;
    if (pts.current && push.current > 0.001) {
      const cam = state.camera;
      ray.v.set(state.pointer.x, state.pointer.y, 0.5).unproject(cam);
      ray.dir.copy(ray.v).sub(cam.position).normalize();
      const t = -cam.position.z / ray.dir.z;
      ray.v.copy(cam.position).addScaledVector(ray.dir, t);
      pts.current.worldToLocal(ray.v);
      m.uniforms.uMouse.value.lerp(ray.v, 1 - Math.exp(-14 * dt));
    }
    const target = scroll.chapter;
    smooth.current = reduced ? Math.round(target) : smooth.current + (target - smooth.current) * (1 - Math.exp(-6 * Math.min(delta, 0.05)));
    const c = smooth.current;
    const k = Math.min(2, Math.floor(c));
    const f = THREE.MathUtils.smootherstep(c - k, 0, 1);
    w.set(0, 0, 0, 0);
    w.setComponent(k, 1 - f);
    w.setComponent(k + 1, f);
    m.uniforms.uW.value.copy(w);
    m.uniforms.uTime.value = reduced ? 0 : state.clock.elapsedTime;
    m.uniforms.uOpacity.value = scroll.dark;
    m.uniforms.uSize.value = 30 * state.viewport.dpr * (1 + 0.25 * opening);
  });

  return <points ref={pts} geometry={geo} material={material} />;
}

function Ring({ reduced }) {
  const mesh = useRef(null);
  const material = useMemo(() => makePearl({ repeat: 2.0 }), []);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = reduced ? 0 : state.clock.elapsedTime;
    material.uniforms.uTime.value = t;
    const c = scroll.chapter;
    material.uniforms.uOpacity.value = scroll.dark * THREE.MathUtils.smoothstep(c, 0.15, 0.85);
    mesh.current.visible = material.uniforms.uOpacity.value > 0.002;
    mesh.current.rotation.set(0.35 + Math.sin(c * 1.3) * 0.18, -0.45 + c * 0.32, 0.12 + t * 0.06);
    const s = 1 + Math.sin(c * Math.PI) * 0.05;
    mesh.current.scale.set(s, s, s * 0.32);
  });
  return (
    <mesh ref={mesh} material={material}>
      <torusGeometry args={[1.62, 0.12, 40, 220]} />
    </mesh>
  );
}

function Glints({ reduced }) {
  const ref = useRef(null);
  const COUNT = 6;
  const seeds = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => ({ a: (i / COUNT) * Math.PI * 2 + 0.4, r: 1.95 + (i % 3) * 0.22, s: 0.14 + (i % 2) * 0.1, ph: i * 1.7 })),
    []
  );
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uOpacity: { value: 1 } },
        vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `
          uniform float uOpacity; varying vec2 vUv;
          void main(){
            vec2 p = (vUv - 0.5) * 2.0;
            float star = 0.018 / (abs(p.x * p.y) + 0.012);
            star *= smoothstep(1.0, 0.0, length(p));
            gl_FragColor = vec4(vec3(0.9, 1.0, 1.0) * star, clamp(star, 0.0, 1.0) * uOpacity);
          }`,
      }),
    []
  );
  const m = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const p = useMemo(() => new THREE.Vector3(), []);
  const sc = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    if (!ref.current) return;
    const t = reduced ? 0 : state.clock.elapsedTime;
    material.uniforms.uOpacity.value = scroll.dark * THREE.MathUtils.smoothstep(scroll.chapter, 0.15, 0.85);
    seeds.forEach((g, i) => {
      const a = g.a + t * 0.08 + scroll.chapter * 0.5;
      p.set(Math.cos(a) * g.r, Math.sin(a) * g.r * 0.8, Math.sin(a * 2.0) * 0.4);
      const tw = 0.75 + Math.sin(t * 1.6 + g.ph) * 0.25;
      sc.set(g.s * tw, g.s * tw, 1);
      m.compose(p, q, sc);
      ref.current.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, material, COUNT]}>
      <planeGeometry args={[2, 2]} />
    </instancedMesh>
  );
}

function Ribbon({ reduced }) {
  const SEG = 260;
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array((SEG + 1) * 2 * 3), 3));
    g.setAttribute("normal", new THREE.BufferAttribute(new Float32Array((SEG + 1) * 2 * 3), 3));
    const uv = new Float32Array((SEG + 1) * 2 * 2);
    const idx = [];
    for (let i = 0; i <= SEG; i++) {
      uv.set([i / SEG, 0, i / SEG, 1], i * 4);
      if (i < SEG) {
        const a = i * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    return g;
  }, []);
  const material = useMemo(() => makePearl({ repeat: 1.4, light: true }), []);
  const tmp = useMemo(
    () => ({ p: new THREE.Vector3(), t: new THREE.Vector3(), n: new THREE.Vector3(), b: new THREE.Vector3(), up: new THREE.Vector3(0, 0, 1), q: new THREE.Quaternion() }),
    []
  );
  const viewport = useThree((s) => s.viewport);

  useFrame((state) => {
    const time = reduced ? 0 : state.clock.elapsedTime;
    // dim the ribbon while the work gallery is pinned so the screens stay the focus
    const show = (1 - scroll.dark) * (1 - 0.6 * Math.sin(Math.PI * Math.min(1, Math.max(0, scroll.galleryP))));
    material.uniforms.uOpacity.value = show * 0.9;
    material.uniforms.uTime.value = time;
    if (show <= 0.001) return;
    const pos = geo.attributes.position.array;
    const nor = geo.attributes.normal.array;
    const W = viewport.width * 0.62;
    const drift = scroll.pageP * 6.0;
    const width = Math.min(0.42, viewport.width * 0.05);
    for (let i = 0; i <= SEG; i++) {
      const u = i / SEG;
      const x = (u - 0.5) * 2 * W;
      const y = Math.sin(u * 5.2 + drift + time * 0.15) * viewport.height * 0.16 + Math.sin(u * 13.0 - time * 0.2) * 0.12 + viewport.height * 0.12;
      const z = Math.cos(u * 4.0 + drift) * 0.8 - 1.2;
      tmp.p.set(x, y, z);
      const u2 = Math.min(1, u + 1 / SEG);
      const x2 = (u2 - 0.5) * 2 * W;
      const y2 = Math.sin(u2 * 5.2 + drift + time * 0.15) * viewport.height * 0.16 + Math.sin(u2 * 13.0 - time * 0.2) * 0.12 + viewport.height * 0.12;
      const z2 = Math.cos(u2 * 4.0 + drift) * 0.8 - 1.2;
      tmp.t.set(x2 - x, y2 - y, z2 - z).normalize();
      if (tmp.t.lengthSq() < 1e-6) tmp.t.set(1, 0, 0);
      tmp.b.crossVectors(tmp.t, tmp.up).normalize();
      const twist = u * 7.0 + time * 0.35 + drift;
      tmp.q.setFromAxisAngle(tmp.t, twist);
      tmp.b.applyQuaternion(tmp.q);
      tmp.n.crossVectors(tmp.t, tmp.b).normalize();
      const k = i * 6;
      pos[k] = x + tmp.b.x * width; pos[k + 1] = y + tmp.b.y * width; pos[k + 2] = z + tmp.b.z * width;
      pos[k + 3] = x - tmp.b.x * width; pos[k + 4] = y - tmp.b.y * width; pos[k + 5] = z - tmp.b.z * width;
      nor[k] = nor[k + 3] = tmp.n.x; nor[k + 1] = nor[k + 4] = tmp.n.y; nor[k + 2] = nor[k + 5] = tmp.n.z;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.normal.needsUpdate = true;
  });
  return <mesh geometry={geo} material={material} />;
}

function HeroGroup({ reduced }) {
  const group = useRef(null);
  const viewport = useThree((s) => s.viewport);
  const pointer = useThree((s) => s.pointer);
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const wide = viewport.aspect > 1.05;
    // chapters 2-4: the ring sits beside the copy. Chapter 1: the wordmark is centred above the
    // title card, wide enough to read as the studio's name.
    const open = 1 - THREE.MathUtils.smoothstep(scroll.chapter, 0, 1);
    const cx = wide ? viewport.width * 0.2 : 0;
    const cy = wide ? 0 : viewport.height * 0.22;
    const cs = wide ? Math.min(1.05, viewport.height / 5.6) : Math.min(0.78, viewport.width / 4.6);
    const oy = wide ? viewport.height * 0.17 : viewport.height * 0.25;
    const os = wide ? Math.min((viewport.width * 0.6) / WORD_W, (viewport.height * 0.95) / WORD_W) : (viewport.width * 0.9) / WORD_W;
    const tx = cx + (0 - cx) * open;
    const ty = cy + (oy - cy) * open;
    const s = cs + (os - cs) * open;
    const k = 1 - Math.exp(-5 * Math.min(delta, 0.05));
    g.position.x += (tx + (reduced ? 0 : pointer.x * 0.12) - g.position.x) * k;
    g.position.y += (ty + (reduced ? 0 : pointer.y * 0.08) + (1 - scroll.dark) * 1.2 - g.position.y) * k;
    g.scale.setScalar(s);
    g.rotation.y += ((reduced ? 0 : pointer.x * (0.25 - 0.17 * open)) - g.rotation.y) * k;
    g.visible = scroll.dark > 0.002;
  });
  return (
    <group ref={group}>
      <Ring reduced={reduced} />
      <PointField reduced={reduced} />
      <Glints reduced={reduced} />
    </group>
  );
}

export default function Spectrum() {
  const [gl] = useState(webglAvailable);
  const reduced = useMemo(prefersReducedMotion, []);
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const vis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, []);
  // no GPU: the wordmark as type, grained with the same prism, fading with the hero
  if (!gl)
    return (
      <div className="spectrum-still">
        <span>Spectre</span>
      </div>
    );
  return (
    <Canvas
      className="spectrum-canvas"
      frameloop={visible ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      eventSource={document.body}
      eventPrefix="client"
    >
      <HeroGroup reduced={reduced} />
      <Ribbon reduced={reduced} />
    </Canvas>
  );
}
