// Case-study scene: the section is three screens tall and its stage stays pinned while you
// scroll. Each chapter turns the laptop to a new angle and shows the matching AuditPro screen.
// The canvas renders only while the section is on screen.

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Laptop, ShadowDisc, useScreens, useSoftShadow, LAPTOP } from "./devices.jsx";
import { prefersReducedMotion, webglAvailable } from "./motion.js";

const POSES = [
  { yaw: -0.5, pitch: 0.02, x: 0.1, lift: 0 },
  { yaw: 0.0, pitch: -0.05, x: 0, lift: 0.12 },
  { yaw: 0.5, pitch: 0.02, x: -0.1, lift: 0 },
];

function Scene({ screens, progress, chapter, reduced }) {
  const textures = useScreens(screens);
  const shadow = useSoftShadow();
  const group = useRef(null);
  const lid = useRef(null);
  const viewport = useThree((s) => s.viewport);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (lid.current) lid.current.rotation.x = LAPTOP.open;
    // continuous pose between chapters, from the scroll position
    const p = THREE.MathUtils.clamp(progress.current, 0, 1) * (POSES.length - 1);
    const i = Math.min(POSES.length - 2, Math.floor(p));
    const f = reduced ? Math.round(p - i) : THREE.MathUtils.smootherstep(p - i, 0, 1);
    const a = POSES[i];
    const b = POSES[i + 1];
    const yaw = THREE.MathUtils.lerp(a.yaw, b.yaw, f);
    const pitch = THREE.MathUtils.lerp(a.pitch, b.pitch, f);
    const x = THREE.MathUtils.lerp(a.x, b.x, f);
    const lift = THREE.MathUtils.lerp(a.lift, b.lift, f);
    const k = 1 - Math.exp(-8 * Math.min(delta, 0.05));
    g.rotation.y += (yaw - g.rotation.y) * k;
    g.rotation.x += (pitch - g.rotation.x) * k;
    g.position.x += (x - g.position.x) * k;
    g.position.y += (lift - g.position.y) * k;
    if (Math.abs(yaw - g.rotation.y) > 0.0005 || Math.abs(x - g.position.x) > 0.0005) state.invalidate();
  });

  const scale = Math.min(1, viewport.width / 5.3, viewport.height / 3.9);

  return (
    <>
      <Environment resolution={64} frames={1}>
        <Lightformer position={[0, 4, 3]} scale={[8, 3, 1]} intensity={2.2} />
        <Lightformer position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} intensity={1.1} color="#dfe6ff" />
      </Environment>
      <directionalLight position={[3, 5, 4]} intensity={1.3} />
      <ambientLight intensity={0.35} />
      <group scale={scale} position={[0, -0.5 * scale, 0]}>
        <group ref={group} rotation={[POSES[0].pitch, POSES[0].yaw, 0]}>
          <Laptop textures={textures} index={chapter} lidRef={lid} />
          <ShadowDisc map={shadow} position={[0, 0.002, 0.05]} scale={[5.2, 3.6, 1]} />
        </group>
      </group>
    </>
  );
}

export default function CaseScene({ screens, chapters, caption, still, sectionId }) {
  const progress = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [visible, setVisible] = useState(false);
  const reduced = useMemo(prefersReducedMotion, []);
  const [gl] = useState(webglAvailable);
  const maxDpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const invalidateRef = useRef(null);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(section);
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const span = r.height - innerHeight;
      const p = span > 0 ? THREE.MathUtils.clamp(-r.top / span, 0, 1) : 0;
      progress.current = p;
      const c = Math.min(chapters.length - 1, Math.floor(p * chapters.length + 0.0001));
      setChapter((prev) => (prev === c ? prev : c));
      invalidateRef.current?.();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    read();
    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sectionId, chapters.length]);

  // chapter copy lives in the page's HTML; mark the current one
  useEffect(() => {
    document.querySelectorAll(`#${sectionId} [data-chapter]`).forEach((el) => {
      el.classList.toggle("is-current", Number(el.dataset.chapter) === chapter);
    });
    document.querySelectorAll(`#${sectionId} [data-dot]`).forEach((el) => {
      el.classList.toggle("is-current", Number(el.dataset.dot) === chapter);
    });
  }, [chapter, sectionId]);

  if (!gl) {
    return (
      <div className="case-still">
        <img src={still[chapter] ?? still[0]} alt={caption} width="1280" height="800" />
      </div>
    );
  }

  return (
    <div className="case-canvas" role="img" aria-label={caption}>
      <Canvas
        frameloop={visible ? "demand" : "never"}
        dpr={maxDpr}
        camera={{ position: [0, 2.1, 6.6], fov: 30, near: 0.5, far: 40 }}
        onCreated={({ camera, invalidate }) => {
          camera.lookAt(0, 0.4, 0);
          invalidateRef.current = invalidate;
        }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene screens={screens} progress={progress} chapter={chapter} reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}
