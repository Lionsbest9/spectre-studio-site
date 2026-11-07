// Hero scene: the laptop opens on load, the devices lean toward the pointer, a horizontal
// drag turns them (springing back with the release velocity), a tap on the laptop screen
// shows the next AuditPro screen. One WebGL context, ~16 draw calls, no shadow maps.

import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Laptop, Phone, ShadowDisc, useScreens, useSoftShadow, LAPTOP } from "./devices.jsx";
import { spring, stepSpring, rubberband, prefersReducedMotion, webglAvailable } from "./motion.js";

const REST_YAW = -0.38;

function Scene({ screens, phone, index, onTap, reduced, paused, drag, pointer }) {
  const textures = useScreens(screens);
  const [phoneTex] = useScreens([phone]);
  const shadow = useSoftShadow();
  const group = useRef(null);
  const lid = useRef(null);
  const phoneRef = useRef(null);
  const s = useRef({
    yaw: spring(REST_YAW, 0.7, 1),
    pitch: spring(0, 0.8, 1),
    lid: spring(reduced ? LAPTOP.open : 0, 0.95, 0.82),
    t: 0,
  });
  const viewport = useThree((st) => st.viewport);

  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => (s.current.lid.target = LAPTOP.open), 380);
    return () => clearTimeout(id);
  }, [reduced]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const st = s.current;
    const d = drag.current;
    if (d.active) {
      st.yaw.x = st.yaw.target = REST_YAW + rubberband(d.dx * 0.006, 0.7);
      st.yaw.v = 0;
    } else if (d.released) {
      d.released = false;
      st.yaw.target = REST_YAW;
      st.yaw.v = d.vx * 0.006;
      st.yaw.ratio = reduced ? 1 : 0.72;
    } else if (!reduced && !paused) {
      st.yaw.target = REST_YAW + pointer.current.x * 0.18;
      st.yaw.ratio = 1;
    }
    st.pitch.target = reduced || paused ? 0 : -pointer.current.y * 0.07;
    let moving = stepSpring(st.yaw, dt);
    moving = stepSpring(st.pitch, dt) || moving;
    moving = stepSpring(st.lid, dt) || moving;

    if (group.current) group.current.rotation.set(st.pitch.x, st.yaw.x, 0);
    if (lid.current) lid.current.rotation.x = st.lid.x;
    if (!reduced && !paused) {
      st.t += dt;
      if (phoneRef.current) phoneRef.current.position.y = 1.0 + Math.sin(st.t * 1.1) * 0.05;
      moving = true;
    }
    if (moving || d.active) state.invalidate();
  });

  const scale = Math.min(1, viewport.width / 6.4, viewport.height / 4.6);

  return (
    <>
      <Environment resolution={64} frames={1}>
        <Lightformer position={[0, 4, 3]} scale={[8, 3, 1]} intensity={2.2} />
        <Lightformer position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} intensity={1.1} color="#dfe6ff" />
        <Lightformer position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} intensity={0.8} />
      </Environment>
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <ambientLight intensity={0.35} />
      <group scale={scale} position={[0, -0.95 * scale, 0]}>
        <group ref={group}>
          <Laptop textures={textures} index={index} lidRef={lid} onScreenTap={onTap} position={[-0.35, 0, 0]} />
          <group ref={phoneRef} position={[2.05, 1.0, 0.85]} rotation={[0, -0.42, 0.06]}>
            <Phone texture={phoneTex} />
          </group>
          <ShadowDisc map={shadow} position={[-0.35, 0.002, 0.05]} scale={[5.2, 3.6, 1]} />
          <ShadowDisc map={shadow} position={[2.05, 0.002, 0.9]} scale={[1.3, 0.8, 1]} />
        </group>
      </group>
    </>
  );
}

class GlBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function HeroDevices({ screens, phone, caption, still }) {
  const host = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const drag = useRef({ active: false, released: false, x0: 0, dx: 0, vx: 0, lastX: 0, lastT: 0, id: null });
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(true);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const reduced = useMemo(prefersReducedMotion, []);
  const [gl] = useState(webglAvailable);
  const maxDpr = Math.min(window.devicePixelRatio || 1, 1.5);

  useEffect(() => {
    if (!host.current) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting && !document.hidden), { threshold: 0.05 });
    io.observe(host.current);
    const vis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", vis);
    const move = (e) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / innerHeight - 0.5) * 2;
    };
    addEventListener("pointermove", move, { passive: true });
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      removeEventListener("pointermove", move);
    };
  }, [gl]);

  const next = () => setIndex((i) => (i + 1) % screens.length);

  const onDown = (e) => {
    const d = drag.current;
    d.active = true;
    d.id = e.pointerId;
    d.x0 = d.lastX = e.clientX;
    d.lastT = performance.now();
    d.dx = d.vx = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(true);
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d.active || e.pointerId !== d.id) return;
    const now = performance.now();
    const v = ((e.clientX - d.lastX) / Math.max(1, now - d.lastT)) * 1000;
    d.vx = d.vx * 0.6 + v * 0.4;
    d.lastX = e.clientX;
    d.lastT = now;
    d.dx = e.clientX - d.x0;
  };
  const onUp = (e) => {
    const d = drag.current;
    if (!d.active || e.pointerId !== d.id) return;
    d.active = false;
    d.released = true;
    setDragging(false);
  };

  const fallback = (
    <div className="hero-still">
      <img src={still} alt={caption} width="1280" height="800" />
    </div>
  );
  if (!gl) return fallback;

  const frameloop = !active ? "never" : reduced || paused ? "demand" : "always";

  return (
    <GlBoundary fallback={fallback}>
      <div
        ref={host}
        className={`devices${dragging ? " is-dragging" : ""}`}
        role="img"
        aria-label={caption}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onLostPointerCapture={onUp}
      >
        <Canvas
          frameloop={frameloop}
          dpr={maxDpr}
          camera={{ position: [0, 2.3, 7.4], fov: 30, near: 0.5, far: 40 }}
          onCreated={({ camera }) => camera.lookAt(0, 0.35, 0)}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <Scene
              screens={screens}
              phone={phone}
              index={index}
              onTap={next}
              reduced={reduced}
              paused={paused}
              drag={drag}
              pointer={pointer}
            />
          </Suspense>
        </Canvas>
        <div className="device-controls">
          <button type="button" className="chip" onClick={next} onPointerDown={(e) => e.stopPropagation()}>
            Next screen
          </button>
          <button
            type="button"
            className="chip chip-icon"
            aria-pressed={paused}
            aria-label={paused ? "Resume motion" : "Pause motion"}
            title={paused ? "Resume motion" : "Pause motion"}
            onClick={() => setPaused((p) => !p)}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {paused ? (
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" /></svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.5 2.5h3v11h-3zm6 0h3v11h-3z" /></svg>
            )}
          </button>
        </div>
      </div>
    </GlBoundary>
  );
}
