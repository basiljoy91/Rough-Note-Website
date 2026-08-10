import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

function PaperMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    // Icosahedron provides a nice uniform geodesic sphere, detail 16 gives plenty of vertices for dense folds
    const geo = new THREE.IcosahedronGeometry(1.2, 16); 
    const posAttribute = geo.attributes.position;
    const vertex = new THREE.Vector3();
    const noise3D = createNoise3D();
    
    for (let i = 0; i < posAttribute.count; i++) {
      vertex.fromBufferAttribute(posAttribute, i);
      
      const px = vertex.x;
      const py = vertex.y;
      const pz = vertex.z;
      
      // Base noise for fine wrinkles
      let n1 = noise3D(px * 3.0, py * 3.0, pz * 3.0) * 0.08;
      
      // Sharp ridges (using absolute value of noise)
      // Math.abs creates sharp valleys, 1.0 - Math.abs creates sharp ridges
      let rawN2 = noise3D(px * 1.8, py * 1.8, pz * 1.8);
      let n2 = (1.0 - Math.abs(rawN2)) * 0.2;
      
      // Large structural folds
      let n3 = noise3D(px * 0.9, py * 0.9, pz * 0.9) * 0.3;
      
      let displacement = n1 + n2 + n3;
      
      // Central Recessed/Crater Structure (Prominent on front face: z > 0)
      const craterDist = Math.sqrt(px * px + py * py);
      if (pz > 0 && craterDist < 0.7) {
        // Deepen the crater towards the center
        const depth = Math.max(0, 0.7 - craterDist) * 1.1;
        // Add stepped folds inside the crater
        const craterSteps = Math.abs(Math.sin(craterDist * 12)) * 0.08;
        displacement -= (depth + craterSteps);
      }
      
      // Irregular, asymmetrical silhouette overall
      const shapeNoiseX = noise3D(py * 0.5, pz * 0.5, 0) * 0.15;
      const shapeNoiseY = noise3D(px * 0.5, 0, pz * 0.5) * 0.15;
      
      vertex.x *= 0.95 + shapeNoiseX;
      vertex.y *= 0.90 + shapeNoiseY;
      
      // Apply displacement along normal
      vertex.add(vertex.clone().normalize().multiplyScalar(displacement));
      
      posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    // Crucial for flat shading lighting calculation
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial 
        color="#e6d4ba" // Warm kraft paper cream/beige
        roughness={0.9} 
        metalness={0.0} 
        flatShading={true} // Creates the angular, faceted crumpled planes
      />
    </mesh>
  );
}

export default function CrumpledPaper3D() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 0, 4.2], fov: 45 }}>
        {/* Ambient Fill Light */}
        <ambientLight intensity={0.6} color="#ffe8cc" />
        
        {/* Soft Directional Key Light from above/front matching reference */}
        <directionalLight 
          position={[2, 3.5, 3]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
          shadow-bias={-0.0005}
        />
        
        {/* Subdued fill light to reveal details in shadows */}
        <directionalLight 
          position={[-3, -1, 1]} 
          intensity={0.4} 
          color="#a18b70"
        />

        {/* Real 3D generated paper mesh */}
        <PaperMesh />
        
        {/* Realistic ground contact shadow */}
        <ContactShadows 
          position={[0, -1.3, 0]} 
          opacity={0.8} 
          scale={3.5} 
          blur={1.8} 
          far={2.5} 
          color="#382512" // Deep warm brown shadow
        />
      </Canvas>
    </div>
  );
}
