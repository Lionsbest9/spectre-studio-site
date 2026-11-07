// The hero stage: a floating stack of real AuditPro screens.
// Depth, light and a soft shadow give the page its 3D feel; the screens respond
// to the pointer (parallax), can be dragged 1:1 and spring home with the release
// velocity, and a tap brings a screen to the front. Budget: ~13 draw calls, no
// shadow maps, DPR capped at 1.5 and dropped to 1 when frames get slow, loop
// stopped when the stage is off screen or the tab is hidden.

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";

const CARD_W = 3.2;
const CARD_H = 2.0;
const SLOT_STEP = { x: 0.42, y: 0.3, z: -0.55 };
const SLOT_ORIGIN = { x: -0.55, y: -0.4 };

// ---------- springs (Apple style: response + damping ratio) ----------

function spring(x = 0, response = 0.45, ratio = 1) {
  return { x, v: 0, target: x, response, ratio };
}

function stepSpring(s, dt) {
  const w = (2 * Math.PI) / s.response;
  const k = w * w;
  const c = 2 * s.ratio * w;
  const a = -k * (s.x - s.target) - c * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
  const settled = Math.abs(s.v) < 0.0015 && Math.abs(s.x - s.target) < 0.0015;
  if (settled) {
    s.x = s.target;
    s.v = 0;
  }
  return !settled;
}

function rubberband(offset, dimension = 1.6, constant = 0.55) {
  return (offset * dimension * constant) / (dimension + constant * Math.abs(offset));
}

// ---------- generated textures ----------

function roundedAlpha(radius = 0.045) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 320;
  const g = c.getContext("2d");
  const r = radius * c.width;
  g.fillStyle = "#000";
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = "#fff";
  g.beginPath();
  g.roundRect(0, 0, c.width, c.height, r);
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.minFilter = THREE.LinearFilter;
  return t;
}

function softShadow() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(128, 128, 20, 128, 128, 128);
  grad.addColorStop(0, "rgba(10,14,24,0.55)");
  grad.addColorStop(0.55, "rgba(10,14,24,0.18)");
  grad.addColorStop(1, "rgba(10,14,24,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.minFilter = THREE.LinearFilter;
  return t;
}

function slotHome(slot) {
  return {
    x: SLOT_ORIGIN.x + slot * SLOT_STEP.x,
    y: SLOT_ORIGIN.y + slot * SLOT_STEP.y,
    z: slot * SLOT_STEP.z,
    rz: slot * 0.025,
  };
}

// ---------- the stack ----------

function Stack({ urls, reduced, pointer, onDragChange }) {
  const textures = useLoader(THREE.TextureLoader, urls);
  const alphaMap = useMemo(roundedAlpha, []);
  const shadowMap = useMemo(softShadow, []);
  const group = useRef(null);
  const meshes = useRef([]);
  const invalidate = useThree((s) => s.invalidate);
  const viewport = useThree((s) => s.viewport);

  useEffect(() => {
    for (const t of textures) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      t.needsUpdate = true;
    }
  }, [textures]);

  // mutable per-card state, never React state (per-frame motion)
  const cards = useMemo(
    () =>
      urls.map((_, i) => {
        const h = slotHome(i);
        return {
          slot: i,
          x: spring(reduced ? h.x : h.x - 0.3, 0.55, 1),
          y: spring(reduced ? h.y : h.y - 1.4, 0.55, 1),
          z: spring(reduced ? h.z : h.z - 0.8, 0.55, 1),
          rz: spring(h.rz, 0.45, 1),
          lift: spring(0, 0.35, 1),
          opacity: spring(reduced ? 1 : 0, 0.5, 1),
          born: 0.15 + i * 0.1,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const order = useRef(urls.map((_, i) => i)); // front first
  const groupRot = useRef({ x: spring(0, 0.9, 1), y: spring(0, 0.9, 1) });
  const drag = useRef(null);
  const clock = useRef(0);
  const plane = useMemo(() => new THREE.Plane(), []);
  const tmp = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), n: new THREE.Vector3() }), []);

  function retarget() {
    order.current.forEach((cardIndex, slot) => {
      const c = cards[cardIndex];
      const h = slotHome(slot);
      c.slot = slot;
      c.x.target = h.x;
      c.y.target = h.y;
      c.z.target = h.z;
      c.rz.target = h.rz;
    });
    invalidate();
  }

  function bringToFront(cardIndex) {
    const o = order.current;
    if (o[0] === cardIndex) return;
    o.splice(o.indexOf(cardIndex), 1);
    o.unshift(cardIndex);
    const c = cards[cardIndex];
    c.lift.x = 0;
    c.lift.target = 1.1; // pop out in front of the stack
    c.lift.ratio = 1;
    setTimeout(() => {
      c.lift.target = 0;
      invalidate();
    }, 220);
    for (const card of cards) {
      card.x.ratio = card.y.ratio = card.z.ratio = 1;
      card.x.response = card.y.response = card.z.response = 0.5;
    }
    retarget();
  }

  function localPoint(e, z) {
    // intersect the pointer ray with the card's plane (parallel to the group), in group space
    tmp.n.set(0, 0, 1).applyQuaternion(group.current.quaternion);
    tmp.a.set(0, 0, z).applyMatrix4(group.current.matrixWorld);
    plane.setFromNormalAndCoplanarPoint(tmp.n, tmp.a);
    if (!e.ray.intersectPlane(plane, tmp.b)) return null;
    return group.current.worldToLocal(tmp.b.clone());
  }

  function onDown(e, cardIndex) {
    e.stopPropagation();
    const c = cards[cardIndex];
    const p = localPoint(e, c.z.x);
    if (!p) return;
    e.target.setPointerCapture(e.pointerId);
    drag.current = {
      card: cardIndex,
      pointerId: e.pointerId,
      offX: c.x.x - p.x,
      offY: c.y.x - p.y,
      startX: c.x.x,
      startY: c.y.x,
      lastX: p.x,
      lastY: p.y,
      lastT: performance.now(),
      vx: 0,
      vy: 0,
      moved: 0,
      t0: performance.now(),
    };
    c.z.target = c.z.x; // hold depth while dragging
    onDragChange(true);
    invalidate();
  }

  function onMove(e) {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    const c = cards[d.card];
    const p = localPoint(e, c.z.x);
    if (!p) return;
    const home = slotHome(c.slot);
    const rawX = p.x + d.offX;
    const rawY = p.y + d.offY;
    const nx = home.x + rubberband(rawX - home.x);
    const ny = home.y + rubberband(rawY - home.y);
    const now = performance.now();
    const dt = Math.max(1, now - d.lastT) / 1000;
    const vx = (nx - c.x.x) / dt;
    const vy = (ny - c.y.x) / dt;
    d.vx = d.vx * 0.5 + vx * 0.5;
    d.vy = d.vy * 0.5 + vy * 0.5;
    d.moved += Math.hypot(nx - c.x.x, ny - c.y.x);
    d.lastT = now;
    c.x.x = c.x.target = nx;
    c.y.x = c.y.target = ny;
    c.x.v = c.y.v = 0;
    c.rz.target = home.rz + THREE.MathUtils.clamp(d.vx * 0.02, -0.08, 0.08);
    invalidate();
  }

  function onUp(e) {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    drag.current = null;
    onDragChange(false);
    const c = cards[d.card];
    try {
      e.target.releasePointerCapture?.(e.pointerId);
    } catch {
      /* already released */
    }
    const quick = performance.now() - d.t0 < 350 && d.moved < 0.06;
    if (quick) {
      bringToFront(d.card);
      return;
    }
    // spring home carrying the release velocity; a little bounce because it was thrown
    const bounce = reduced ? 1 : 0.78;
    c.x.ratio = c.y.ratio = bounce;
    c.x.response = c.y.response = 0.5;
    c.x.v = THREE.MathUtils.clamp(d.vx, -8, 8);
    c.y.v = THREE.MathUtils.clamp(d.vy, -8, 8);
    retarget();
  }

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    clock.current += dt;
    let moving = false;

    // group parallax toward the pointer, paused while dragging
    const gr = groupRot.current;
    if (!reduced && !drag.current) {
      gr.y.target = pointer.current.x * 0.16;
      gr.x.target = -pointer.current.y * 0.09;
    }
    moving = stepSpring(gr.x, dt) | moving;
    moving = stepSpring(gr.y, dt) | moving;
    const g = group.current;
    g.rotation.set(gr.x.x, -0.22 + gr.y.x, 0);
    if (!reduced) {
      g.position.y = 0.3 * scale + Math.sin(clock.current * 0.7) * 0.035;
      moving = true;
    }

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const m = meshes.current[i];
      if (!m) continue;
      if (clock.current < c.born) {
        m.visible = false;
        continue;
      }
      m.visible = true;
      if (c.opacity.target !== 1) c.opacity.target = 1;
      const dragging = drag.current && drag.current.card === i;
      if (!dragging) {
        moving = stepSpring(c.x, dt) | moving;
        moving = stepSpring(c.y, dt) | moving;
      }
      moving = stepSpring(c.z, dt) | moving;
      moving = stepSpring(c.rz, dt) | moving;
      moving = stepSpring(c.lift, dt) | moving;
      moving = stepSpring(c.opacity, dt) | moving;
      m.position.set(c.x.x, c.y.x, c.z.x + c.lift.x);
      m.rotation.set(0, 0, c.rz.x);
      const op = c.opacity.x;
      m.children[0].material.opacity = op * 0.9; // shadow
      m.children[1].material.opacity = op; // bezel
      m.children[2].material.opacity = op; // screen
      m.renderOrder = 10 - c.slot;
    }
    if (moving) state.invalidate();
  });

  const scale = Math.min(1, viewport.width / 4.7, viewport.height / 3.7);

  return (
    <group ref={group} scale={scale} position={[-0.2 * scale, 0.3 * scale, 0]} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onLostPointerCapture={onUp}>
      {urls.map((_, i) => (
        <group key={i} ref={(el) => (meshes.current[i] = el)} onPointerDown={(e) => onDown(e, i)}>
          <mesh position={[0.14, -0.22, -0.05]} scale={[1.3, 1.45, 1]}>
            <planeGeometry args={[CARD_W, CARD_H]} />
            <meshBasicMaterial map={shadowMap} transparent depthWrite={false} opacity={0} />
          </mesh>
          <mesh position={[0, 0, -0.012]} scale={[1.018, 1.028, 1]}>
            <planeGeometry args={[CARD_W, CARD_H]} />
            <meshStandardMaterial color="#141926" roughness={0.5} metalness={0.2} alphaMap={alphaMap} transparent opacity={0} />
          </mesh>
          <mesh>
            <planeGeometry args={[CARD_W, CARD_H]} />
            <meshBasicMaterial map={textures[i]} alphaMap={alphaMap} toneMapped={false} transparent opacity={0} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Drops the pixel ratio when frames get slow, raises it back when they recover.
function AdaptiveDpr({ max }) {
  const setDpr = useThree((s) => s.setDpr);
  const acc = useRef({ slow: 0, fast: 0, level: max });
  useFrame((_, delta) => {
    const a = acc.current;
    if (delta > 0.022) {
      a.slow++;
      a.fast = 0;
    } else if (delta < 0.0175) {
      a.fast++;
      a.slow = 0;
    }
    if (a.slow > 30 && a.level > 1) {
      a.level = 1;
      setDpr(1);
      a.slow = 0;
    } else if (a.fast > 240 && a.level < max) {
      a.level = max;
      setDpr(max);
      a.fast = 0;
    }
  });
  return null;
}

export default function Stage({ urls, caption }) {
  const host = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(true);
  const [dragging, setDragging] = useState(false);
  const reduced = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const maxDpr = Math.min(window.devicePixelRatio || 1, 1.5);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting && !document.hidden), { threshold: 0.05 });
    io.observe(host.current);
    const vis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", vis);
    const move = (e) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  const frameloop = !active ? "never" : reduced ? "demand" : "always";

  return (
    <div ref={host} className={`stage${dragging ? " is-dragging" : ""}`} aria-label={caption} role="img">
      <Canvas
        frameloop={frameloop}
        dpr={maxDpr}
        camera={{ position: [0, 0, 7.2], fov: 30, near: 0.5, far: 30 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ touchAction: "pan-y" }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[2.5, 3, 4]} intensity={0.55} />
        <directionalLight position={[-3, -1, 2]} intensity={0.18} color="#9fb3ff" />
        <Stack urls={urls} reduced={reduced} pointer={pointer} onDragChange={setDragging} />
        <AdaptiveDpr max={maxDpr} />
      </Canvas>
    </div>
  );
}
