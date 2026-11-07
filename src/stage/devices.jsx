// A laptop and a phone built from rounded boxes, with real screenshots on their screens.
// Shared by the hero and the case-study scene.
// RoundedBox corner radius must stay below half of the box's thinnest side, or the shape
// turns inside-out and swallows whatever sits on its faces.

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export const LAPTOP = { w: 3.4, d: 2.26, base: 0.11, lid: 0.065, open: -1.86 };

export function useScreens(urls) {
  const textures = useLoader(THREE.TextureLoader, urls);
  useEffect(() => {
    for (const t of textures) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
    }
  }, [textures]);
  return textures;
}

export function useSoftShadow() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(128, 128, 8, 128, 128, 128);
    grad.addColorStop(0, "rgba(14,17,23,0.5)");
    grad.addColorStop(0.5, "rgba(14,17,23,0.16)");
    grad.addColorStop(1, "rgba(14,17,23,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

const ALU = { color: "#c7cad1", metalness: 0.65, roughness: 0.32 };

// Two stacked screen planes so a new screenshot cross-fades in over the old one.
function Screen({ textures, index, width, height }) {
  const front = useRef(null);
  const back = useRef(null);
  const fade = useRef({ shown: index, prev: index, t: 1 });
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const f = fade.current;
    if (index !== f.shown) {
      f.prev = f.shown;
      f.shown = index;
      f.t = 0;
      invalidate();
    }
  }, [index, invalidate]);

  useFrame((_, dt) => {
    const f = fade.current;
    if (!front.current || !back.current) return;
    front.current.map = textures[f.shown];
    back.current.map = textures[f.prev];
    if (f.t < 1) {
      f.t = Math.min(1, f.t + Math.min(dt, 0.05) * 3.2);
      invalidate();
    }
    front.current.opacity = f.t;
  });

  return (
    <group>
      <mesh position={[0, 0, -0.0006]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial ref={back} map={textures[index]} toneMapped={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial ref={front} map={textures[index]} toneMapped={false} transparent opacity={1} />
      </mesh>
    </group>
  );
}

export function Laptop({ textures, index, lidRef, onScreenTap, ...props }) {
  const { w, d, base, lid } = LAPTOP;
  const screenW = w - 0.2;
  const screenH = screenW / 1.6;
  return (
    <group {...props}>
      <RoundedBox args={[w, base, d]} radius={0.045} smoothness={4} position={[0, base / 2, 0]}>
        <meshStandardMaterial {...ALU} />
      </RoundedBox>
      <mesh position={[0, base + 0.001, -0.18]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.86, d * 0.44]} />
        <meshStandardMaterial color="#2b2e35" roughness={0.7} />
      </mesh>
      <mesh position={[0, base + 0.001, 0.68]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.3, d * 0.24]} />
        <meshStandardMaterial color="#b9bcc4" metalness={0.5} roughness={0.42} />
      </mesh>
      {/* the lid hinges on the back edge; rotation.x = 0 is closed */}
      <group ref={lidRef} position={[0, base, -d / 2]}>
        <RoundedBox args={[w, lid, d]} radius={0.028} smoothness={4} position={[0, lid / 2, d / 2]}>
          <meshStandardMaterial {...ALU} />
        </RoundedBox>
        <mesh position={[0, -0.0008, d / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w - 0.06, d - 0.06]} />
          <meshBasicMaterial color="#0b0d12" />
        </mesh>
        <group
          position={[0, -0.0016, d / 2 + 0.03]}
          rotation={[Math.PI / 2, 0, 0]}
          onClick={(e) => {
            if (e.delta > 6) return;
            e.stopPropagation();
            onScreenTap?.();
          }}
          onPointerOver={() => onScreenTap && (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "")}
        >
          <Screen textures={textures} index={index} width={screenW} height={screenH} />
        </group>
      </group>
    </group>
  );
}

export function Phone({ texture, ...props }) {
  const pw = 0.8;
  const ph = 1.7;
  return (
    <group {...props}>
      <RoundedBox args={[pw, ph, 0.085]} radius={0.04} smoothness={5}>
        <meshStandardMaterial color="#16181d" metalness={0.4} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0, 0.0435]}>
        <planeGeometry args={[pw - 0.07, (pw - 0.07) / 0.4618]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function ShadowDisc({ map, ...props }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} {...props}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={map} transparent depthWrite={false} />
    </mesh>
  );
}
