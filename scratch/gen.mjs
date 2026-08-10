import fs from 'fs';

const gridSize = 16;
const radius = 135;

function noise3D(x, y, z) {
  return (Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453) % 1;
}

const vertices = [];
for (let i = 0; i <= gridSize; i++) {
  const row = [];
  const u = i / gridSize; 
  for (let j = 0; j <= gridSize; j++) {
    const v = j / gridSize; 
    
    // map to sphere
    const theta = u * Math.PI; 
    const phi = v * 2 * Math.PI; 
    
    let x = Math.sin(theta) * Math.cos(phi);
    let y = Math.sin(theta) * Math.sin(phi);
    let z = Math.cos(theta);
    
    // Base crumple using sine waves
    let crunch = 1 
      + 0.12 * Math.sin(x * 8 + y * 5)
      + 0.15 * Math.sin(y * 10 + z * 8)
      - 0.08 * Math.abs(Math.cos(x * 15))
      + 0.1 * noise3D(x, y, z);
    
    x *= radius * crunch;
    y *= radius * crunch;
    z *= radius * crunch;
    
    // Add organic asymmetry
    x *= 1.15;
    y *= 0.95;
    z *= 1.05;
    
    // Twist a bit
    const angle = y * 0.005;
    const nx = x * Math.cos(angle) - z * Math.sin(angle);
    const nz = x * Math.sin(angle) + z * Math.cos(angle);
    x = nx; z = nz;
    
    row.push({x, y, z, u, v});
  }
  vertices.push(row);
}

const triangles = [];
for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    const v00 = vertices[i][j];
    const v10 = vertices[i+1][j];
    const v01 = vertices[i][j+1];
    const v11 = vertices[i+1][j+1];
    
    triangles.push([v00, v10, v01]);
    triangles.push([v10, v11, v01]);
  }
}

let out = '';
triangles.forEach((tri, index) => {
  const A = tri[0];
  const B = tri[1];
  const C = tri[2];
  
  const AB = {x: B.x-A.x, y: B.y-A.y, z: B.z-A.z};
  const AC = {x: C.x-A.x, y: C.y-A.y, z: C.z-A.z};
  const Nx = AB.y*AC.z - AB.z*AC.y;
  const Ny = AB.z*AC.x - AB.x*AC.z;
  const Nz = AB.x*AC.y - AB.y*AC.x;
  const Nlen = Math.sqrt(Nx*Nx + Ny*Ny + Nz*Nz);
  if (Nlen < 0.0001) return;
  const N = {x: Nx/Nlen, y: Ny/Nlen, z: Nz/Nlen};
  
  // Lighting: directional light from top-left-front
  const L = {x: -0.6, y: -0.4, z: 0.69};
  const dot = N.x*L.x + N.y*L.y + N.z*L.z;
  const intensity = Math.max(0, dot);
  const ambient = 0.35;
  const light = Math.min(1, ambient + intensity * 0.7);
  
  // Color calculation based on reference
  const mix = (a, b, t) => a + (b - a) * t;
  const r = Math.round(mix(120, 235, light));
  const g = Math.round(mix(95, 220, light));
  const b = Math.round(mix(70, 195, light));
  let color = "rgb(" + r + ", " + g + ", " + b + ")";
  
  let backColor = "rgb(" + Math.round(r*0.8) + ", " + Math.round(g*0.8) + ", " + Math.round(b*0.8) + ")";
  
  const S = 100;
  const m11 = AB.x / S; const m12 = AC.x / S; const m13 = N.x; const m14 = A.x;
  const m21 = AB.y / S; const m22 = AC.y / S; const m23 = N.y; const m24 = A.y;
  const m31 = AB.z / S; const m32 = AC.z / S; const m33 = N.z; const m34 = A.z;
  
  const matrix = "matrix3d(" + m11.toFixed(5) + ", " + m21.toFixed(5) + ", " + m31.toFixed(5) + ", 0, " + m12.toFixed(5) + ", " + m22.toFixed(5) + ", " + m32.toFixed(5) + ", 0, " + m13.toFixed(5) + ", " + m23.toFixed(5) + ", " + m33.toFixed(5) + ", 0, " + m14.toFixed(5) + ", " + m24.toFixed(5) + ", " + m34.toFixed(5) + ", 1)";
  
  const zIdx = Math.round(A.z + 1000);
  
  out += "        <div style={{\n          position: 'absolute',\n          left: '50%',\n          top: '50%',\n          width: '100px',\n          height: '100px',\n          backgroundColor: '" + color + "',\n          transform: '" + matrix + "',\n          transformOrigin: '0 0',\n          clipPath: 'polygon(0 0, 100% 0, 0 100%)',\n          backfaceVisibility: 'hidden',\n          outline: '1px solid " + color + "',\n          zIndex: " + zIdx + "\n        }} />\n";
});

const fileOut = "import React from 'react';\nimport styles from '../rough-note-contact.module.css';\n\nexport function CrumpledPaper({ transitioning = false }: { transitioning?: boolean }) {\n  return (\n    <div\n      className={`${styles.crumpledPaper} ${\n        transitioning ? styles.crumpledTransitioning : ''\n      }`}\n      data-paper-ball\n      aria-label=\"A crumpled sheet stamped RN\"\n      role=\"img\"\n      style={{\n        transformStyle: 'preserve-3d',\n        perspective: '1200px'\n      }}\n    >\n      <div style={{\n        position: 'absolute',\n        inset: 0,\n        transformStyle: 'preserve-3d',\n        transform: 'rotateX(-15deg) rotateY(25deg)'\n      }}>\n        <div style={{\n          position: 'absolute',\n          width: '240px',\n          height: '40px',\n          background: 'rgba(30, 20, 10, 0.4)',\n          borderRadius: '50%',\n          filter: 'blur(15px)',\n          left: '50%',\n          top: '90%',\n          transform: 'translateX(-50%) translateZ(-40px)',\n        }} />\n" + out + "      </div>\n    </div>\n  );\n}\n";

fs.writeFileSync('C:/Users/SACHIN/Downloads/Desktop/RoughNoteFive/rough-note-website/src/features/contact-journey/paper/CrumpledPaperGen.tsx', fileOut);
console.log('done');
