import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';

const BUBBLE_COUNT = 15;

function createBubbleData() {
  let seed = 20260814;
  const random = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };

  return Array.from({ length: BUBBLE_COUNT }, () => {
    const angle = random() * Math.PI * 2;
    const radius = 1.5 + random() * 3.5;
    return {
      x: Math.cos(angle) * radius,
      y: (random() - 0.5) * 5,
      z: (random() - 0.5) * 3,
      scale: 0.04 + random() * 0.12,
      speed: 0.15 + random() * 0.25,
      offset: random() * Math.PI * 2
    };
  });
}

const BUBBLES = createBubbleData();

function BubbleGroup() {
  const groupRef = useRef<THREE.Group>(null);

  // Animation: slight upward drift and organic wobble
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const data = BUBBLES[i];
      // Subtle sinusoidal float (prevents them from drifting off screen forever)
      const wobbleY = Math.sin(time * data.speed + data.offset) * 0.3;
      const wobbleX = Math.cos(time * data.speed * 0.8 + data.offset) * 0.15;
      const wobbleZ = Math.sin(time * data.speed * 0.5 + data.offset) * 0.1;

      child.position.set(data.x + wobbleX, data.y + wobbleY, data.z + wobbleZ);

      // Extremely subtle scale pulsing/breathing
      const scaleWobble = 1.0 + Math.sin(time * data.speed * 1.5) * 0.03;
      child.scale.setScalar(data.scale * scaleWobble);
    });
  });

  return (
    <group ref={groupRef}>
      {BUBBLES.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 32, 32]} />
          {/* Glass/Water like material that blends well with warm paper */}
          <meshPhysicalMaterial
            transparent={true}
            opacity={0.12} // mostly transparent
            roughness={0.05} // shiny
            metalness={0.1} // slight reflection
            clearcoat={1.0} // hard specular highlight like a droplet
            clearcoatRoughness={0.1}
            ior={1.1} // subtle refraction if environment allows
            color="#ffffff"
          />
        </mesh>
      ))}
    </group>
  );
}

export function Bubbles3D() {
  const [mounted, setMounted] = useState(false);

  // Delay appearance so it acts as a short visual "breath" after Stage 04 transition completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 1800); // Gives time for the fade-in and settling of Step 02
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none', // Do not block form interactions!
      zIndex: 20,
      animation: 'bubbleFadeIn 2.5s ease-in-out' // Soft appearance
    }}>
      <style>{`
        @keyframes bubbleFadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <Canvas style={{ pointerEvents: 'none' }} camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 2]}>
        {/* Soft lighting that fits the existing warm environment */}
        <ambientLight intensity={0.3} color="#ffe8cc" />
        <directionalLight position={[2, 5, 4]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-3, -2, 2]} intensity={0.4} color="#dca87d" />

        <BubbleGroup />

        {/* Environment map provides the realistic reflections on the droplets */}
        <Environment preset="apartment" environmentIntensity={0.2} />
      </Canvas>
    </div>
  );
}
