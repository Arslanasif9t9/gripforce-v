import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import type { Group } from "three";

const NEON = "#a3ff12";

/**
 * Stylized matte-black dumbbell with neon accents, floating over a dark floor.
 * Reacts to the cursor (tilt) and slowly rotates on its own; the whole scene is
 * hand-modeled — no external model file, so nothing can 404.
 */
export default function Hero3D() {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapRef}
      data-scene-ready="false"
      className="relative h-[380px] w-full sm:h-[460px] lg:h-[560px]"
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.6, 5], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        onCreated={() => wrapRef.current?.setAttribute("data-scene-ready", "true")}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 3]} intensity={1.4} />
        <pointLight position={[-4, 1.5, -2]} intensity={40} color={NEON} />
        <pointLight position={[3, -2, 2]} intensity={18} color={NEON} />
        <Dumbbell />
        <ContactShadows position={[0, -1.35, 0]} opacity={0.55} scale={9} blur={2.6} far={4} />
        <Environment resolution={256}>
          <Lightformer intensity={2.2} position={[0, 5, 0]} scale={[10, 10, 1]} />
          <Lightformer intensity={1.4} color={NEON} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[14, 1.4, 1]} />
          <Lightformer intensity={0.9} color={NEON} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[14, 1, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Dumbbell() {
  const outer = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (spin.current) spin.current.rotation.y += dt * 0.28;
    if (outer.current) {
      const t = outer.current.rotation;
      t.x += (0.28 + pointer.current.y * 0.22 - t.x) * Math.min(dt * 3.5, 1);
      t.z += (-0.42 + pointer.current.x * 0.14 - t.z) * Math.min(dt * 3.5, 1);
      outer.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.07;
    }
  });

  return (
    <group ref={outer} rotation={[0.28, 0, -0.42]}>
      <group ref={spin}>
        {/* Handle (along X) */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 2.35, 32]} />
          <meshStandardMaterial color="#171717" metalness={0.85} roughness={0.32} />
        </mesh>
        {/* Grip rings */}
        {[-0.42, 0, 0.42].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.145, 0.018, 12, 40]} />
            <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={1.6} />
          </mesh>
        ))}
        {/* Collars */}
        {[-1.02, 1.02].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, 0.24, 0.14, 32]} />
            <meshStandardMaterial color="#242424" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}
        {/* Plates, mirrored on both ends */}
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 1.22, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.62, 0.62, 0.3, 48]} />
              <meshStandardMaterial color="#141414" metalness={0.62} roughness={0.42} />
            </mesh>
            {/* Neon ring around the big plate */}
            <mesh position={[side * 1.22, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.635, 0.02, 12, 64]} />
              <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={2.2} />
            </mesh>
            <mesh position={[side * 1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.47, 0.47, 0.26, 48]} />
              <meshStandardMaterial color="#1b1b1b" metalness={0.6} roughness={0.45} />
            </mesh>
            <mesh position={[side * 1.73, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.34, 0.34, 0.22, 48]} />
              <meshStandardMaterial color="#222222" metalness={0.6} roughness={0.45} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
