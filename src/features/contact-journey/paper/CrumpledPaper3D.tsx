import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

function PaperMesh({ transitioning = false }: { transitioning?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const logoRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  
  const { geometry, crumpledPositions, flatPositions, unfoldDelays } = useMemo(() => {
    // Icosahedron provides a nice uniform geodesic sphere
    // Detail 32 provides enough vertex density for sharp, thin paper folds without looking like low-poly triangles.
    const geo = new THREE.IcosahedronGeometry(1.2, 32); 
    const posAttribute = geo.attributes.position;
    
    // Arrays for animation
    const crumpledPositions = new Float32Array(posAttribute.count * 3);
    const flatPositions = new Float32Array(posAttribute.count * 3);
    const unfoldDelays = new Float32Array(posAttribute.count);
    
    const vertex = new THREE.Vector3();
    const noise3D = createNoise3D();
    
    for (let i = 0; i < posAttribute.count; i++) {
      vertex.fromBufferAttribute(posAttribute, i);
      
      const px = vertex.x;
      const py = vertex.y;
      const pz = vertex.z;
      
      // Calculate Flat Positions (Mapping Sphere to Flat Disc using polar coordinates)
      // Base radius is 1.2. The front is pz = 1.2 (phi = 0), the back is pz = -1.2 (phi = PI)
      let phi = Math.acos(pz / 1.2); 
      let theta = Math.atan2(py, px);
      
      // Outer edges of the flat sheet unfold first, center last
      let delay = (1.0 - (phi / Math.PI)) * 0.4;
      
      // Unfold radius
      let flatR = phi * 1.5; 
      
      // Irregular paper edges and wrinkles
      let edgeNoise = noise3D(Math.cos(theta), Math.sin(theta), 0);
      flatR *= 1.0 + edgeNoise * 0.1;
      
      let fx = flatR * Math.cos(theta);
      let fy = flatR * Math.sin(theta);
      let fz = noise3D(fx * 1.5, fy * 1.5, 0) * 0.15; // natural planar wrinkles
      // Slight macro bend
      fz += Math.sin(fx * 1.0) * Math.cos(fy * 1.0) * 0.15;
      
      flatPositions[i * 3] = fx;
      flatPositions[i * 3 + 1] = fy;
      flatPositions[i * 3 + 2] = fz;
      unfoldDelays[i] = delay;
      
      // Calculate Crumpled Stage-02 Positions (Unchanged algorithm)
      const originalNormal = vertex.clone().normalize();
      
      // Calculate tangent vectors for lateral displacement (this creates overlapping folds)
      const up = Math.abs(originalNormal.y) > 0.99 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
      const tangent1 = new THREE.Vector3().crossVectors(originalNormal, up).normalize();
      const tangent2 = new THREE.Vector3().crossVectors(originalNormal, tangent1).normalize();
      
      // 1. TANGENTIAL FOLDS (Causes vertices to slide over each other, creating true overlapping layers)
      // Large folding motions
      let rawTan1 = noise3D(px * 1.1, py * 1.1, pz * 1.1);
      let rawTan2 = noise3D(px * 1.1 + 10, py * 1.1 + 10, pz * 1.1 + 10);
      
      // Applying a power function tightens the fold zones, making the overlapping paper edges sharper and thinner
      let tanNoise1 = Math.sign(rawTan1) * Math.pow(Math.abs(rawTan1), 1.4) * 0.45;
      let tanNoise2 = Math.sign(rawTan2) * Math.pow(Math.abs(rawTan2), 1.4) * 0.45;
      
      // Secondary tangential folds for smaller overlapping edges
      let tanNoise3 = noise3D(px * 2.2, py * 2.2, pz * 2.2) * 0.15;
      let tanNoise4 = noise3D(px * 2.2 + 20, py * 2.2 + 20, pz * 2.2 + 20) * 0.15;
      
      vertex.add(tangent1.multiplyScalar(tanNoise1 + tanNoise3));
      vertex.add(tangent2.multiplyScalar(tanNoise2 + tanNoise4));
      
      // 2. RADIAL MACRO DEPTH (Pushing the folded clumps inward and outward)
      // Using Math.pow(abs(noise), < 1) flattens the "inflated blobs" into broad planar paper sheets,
      // while keeping the deep V-shaped valleys sharp.
      let radNoisePrimary = noise3D(px * 1.0 + 30, py * 1.0 + 30, pz * 1.0 + 30);
      let radialDisp = Math.pow(Math.abs(radNoisePrimary), 0.4) * 0.20; 
      
      // 3. CENTRAL FRONT STRUCTURE
      // Broad flattened paper surface overlaid with folds
      const craterDist = Math.sqrt(px * px + py * py);
      if (pz > 0.3 && craterDist < 0.85) {
        // Flatten and push inward
        let depth = Math.max(0, 0.85 - craterDist) * 0.5;
        
        // Add overlapping planar steps
        let layerNoise = noise3D(px * 1.8, py * 1.8, pz * 1.8);
        let steps = (Math.floor(craterDist * 2.5 + layerNoise) / 2.5) * 0.15;
        
        radialDisp -= (depth + steps);
      }
      
      // 4. OVERALL SILHOUETTE (Keep it compact and dense)
      const shapeNoiseX = noise3D(py * 0.6, pz * 0.6, 0) * 0.05;
      const shapeNoiseY = noise3D(px * 0.6, 0, pz * 0.6) * 0.05;
      const shapeNoiseZ = noise3D(px * 0.6, py * 0.6, 0) * 0.05;
      
      vertex.x *= 1.0 + shapeNoiseX;
      vertex.y *= 1.0 + shapeNoiseY;
      vertex.z *= 1.0 + shapeNoiseZ;
      
      // Apply radial displacement along the original normal
      vertex.add(originalNormal.multiplyScalar(radialDisp));
      
      crumpledPositions[i * 3] = vertex.x;
      crumpledPositions[i * 3 + 1] = vertex.y;
      crumpledPositions[i * 3 + 2] = vertex.z;
      
      posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    // Crucial for flat shading lighting calculation and sharp paper edges
    geo.computeVertexNormals();
    return { geometry: geo, crumpledPositions, flatPositions, unfoldDelays };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const targetProgress = transitioning ? 1 : 0;
    const speed = 0.5; // Smooth cinematic unfold
    
    if (progressRef.current !== targetProgress) {
      if (progressRef.current < targetProgress) {
        progressRef.current = Math.min(1, progressRef.current + delta * speed);
      } else {
        progressRef.current = Math.max(0, progressRef.current - delta * speed * 2.0); // closes slightly faster
      }
      
      const globalProgress = progressRef.current;
      // easeInOut for natural momentum
      const easedGlobal = globalProgress < 0.5 
          ? 2 * globalProgress * globalProgress 
          : 1 - Math.pow(-2 * globalProgress + 2, 2) / 2;

      if (logoRef.current) {
        // Keeps the RN logo attached to the front of the paper as it flattens
        logoRef.current.position.z = 1.2 - (easedGlobal * 1.15);
      }

      const posAttribute = geometry.attributes.position;
      
      for (let i = 0; i < posAttribute.count; i++) {
        const cx = crumpledPositions[i * 3];
        const cy = crumpledPositions[i * 3 + 1];
        const cz = crumpledPositions[i * 3 + 2];
        
        const fx = flatPositions[i * 3];
        const fy = flatPositions[i * 3 + 1];
        const fz = flatPositions[i * 3 + 2];
        
        const delay = unfoldDelays[i];
        
        // Map global progress to a local window based on the vertex delay
        // Sequential cascading release
        let localT = (easedGlobal - delay) / 0.6;
        localT = Math.max(0, Math.min(1, localT));
        
        // smoothstep local transition
        let localProgress = localT * localT * (3 - 2 * localT);
        
        // Push outward (bulge) during the unfold to simulate hinges rotating
        let hingeArc = Math.sin(localProgress * Math.PI) * 0.5;
        
        let currentX = cx + (fx - cx) * localProgress;
        let currentY = cy + (fy - cy) * localProgress;
        let currentZ = cz + (fz - cz) * localProgress + hingeArc;
        
        posAttribute.setXYZ(i, currentX, currentY, currentZ);
      }
      
      posAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial 
          color="#f4e8d4" // Brighter warm cream / cleaner natural beige
          roughness={0.95} // Matte paper feel
          metalness={0.02} // Very slight edge highlight
          flatShading={true} // Essential for angular, geometric paper folds
          side={THREE.DoubleSide} // Crucial: tangential displacement creates inverted overlapping triangles that must remain visible
        />
      </mesh>
      
      {/* RN Logo attached to the paper */}
      <group ref={logoRef} position={[0, 0, 1.2]}>
        <Html transform scale={0.4} style={{ pointerEvents: 'none' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            border: '4px solid #3d2118',
            color: '#3d2118',
            fontFamily: '"Patrick Hand", "Caveat", cursive',
            fontSize: '32px',
            fontWeight: 'bold',
            position: 'relative',
            opacity: 0.85
          }}>
            <div style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              border: '2px solid #3d2118',
            }} />
            RN
          </div>
        </Html>
      </group>
    </group>
  );
}

export default function CrumpledPaper3D({ transitioning = false }: { transitioning?: boolean }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 0, 4.4], fov: 40 }}>
        {/* Ambient Fill Light */}
        <ambientLight intensity={0.65} color="#fff5e8" />
        
        {/* Soft Directional Key Light from above/front matching reference */}
        <directionalLight 
          position={[2.5, 3.5, 3.0]} 
          intensity={1.15} 
          castShadow 
          shadow-mapSize-width={2048} // High-res shadows for crisp paper edges
          shadow-mapSize-height={2048} 
          shadow-bias={-0.0003}
          color="#ffffff"
        />
        
        {/* Subdued fill light from opposite side to reveal fold details in warm tan shadows */}
        <directionalLight 
          position={[-3, -1, 1]} 
          intensity={0.5} 
          color="#aa8c6e"
        />

        {/* Real 3D generated paper mesh */}
        <PaperMesh transitioning={transitioning} />
        
        {/* Realistic ground contact shadow */}
        <ContactShadows 
          position={[0, -1.25, 0]} 
          opacity={0.8} 
          scale={12.0} // Large enough to cover the unfolded sheet
          blur={1.8} 
          far={2.5} 
          color="#382512" // Deep warm brown shadow to ground the object
        />
      </Canvas>
    </div>
  );
}
