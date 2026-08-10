import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

function PaperMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    // Icosahedron provides a nice uniform geodesic sphere
    // Detail 32 provides enough vertex density for sharp, thin paper folds without looking like low-poly triangles.
    const geo = new THREE.IcosahedronGeometry(1.2, 32); 
    const posAttribute = geo.attributes.position;
    const vertex = new THREE.Vector3();
    const noise3D = createNoise3D();
    
    for (let i = 0; i < posAttribute.count; i++) {
      vertex.fromBufferAttribute(posAttribute, i);
      
      const px = vertex.x;
      const py = vertex.y;
      const pz = vertex.z;
      
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
      
      posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    // Crucial for flat shading lighting calculation and sharp paper edges
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial 
        color="#eaddcf" // Warm kraft paper beige
        roughness={0.95} // Matte paper feel
        metalness={0.02} // Very slight edge highlight
        flatShading={true} // Essential for angular, geometric paper folds
        side={THREE.DoubleSide} // Crucial: tangential displacement creates inverted overlapping triangles that must remain visible
      />
    </mesh>
  );
}

export default function CrumpledPaper3D() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 0, 4.4], fov: 40 }}>
        {/* Ambient Fill Light */}
        <ambientLight intensity={0.5} color="#ffe8cc" />
        
        {/* Soft Directional Key Light from above/front matching reference */}
        <directionalLight 
          position={[2.5, 3.5, 3.0]} 
          intensity={1.1} 
          castShadow 
          shadow-mapSize-width={2048} // High-res shadows for crisp paper edges
          shadow-mapSize-height={2048} 
          shadow-bias={-0.0003}
        />
        
        {/* Subdued fill light from opposite side to reveal fold details in shadows */}
        <directionalLight 
          position={[-3, -1, 1]} 
          intensity={0.4} 
          color="#a18b70"
        />

        {/* Real 3D generated paper mesh */}
        <PaperMesh />
        
        {/* Realistic ground contact shadow */}
        <ContactShadows 
          position={[0, -1.25, 0]} 
          opacity={0.8} 
          scale={3.5} 
          blur={1.8} 
          far={2.5} 
          color="#382512" // Deep warm brown shadow to ground the object
        />
      </Canvas>
    </div>
  );
}
