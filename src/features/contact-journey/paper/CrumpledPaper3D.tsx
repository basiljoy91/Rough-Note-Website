/* Three.js animation buffers are intentionally mutated inside useFrame. */
/* eslint-disable react-hooks/immutability */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import styles from '../rough-note-contact.module.css';

// --- Deterministic PRNG and Perlin Noise from Claude ---
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeNoise3D(rand: () => number) {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = p[i]; p[i] = p[j]; p[j] = t;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
  function grad(hash: number, x: number, y: number, z: number) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
  return function noise3D(x: number, y: number, z: number) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    const u = fade(x), v = fade(y), w = fade(z);
    const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z;
    const B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
    return lerp(
      lerp(lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
           lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u), v),
      lerp(lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u),
           lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u), v),
      w
    );
  };
}

function makePaperTexture(rand: () => number) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);
  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rand() - 0.5) * 26;
    const v = 128 + n;
    img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 900; i++) {
    const x = rand() * size, y = rand() * size;
    const len = 6 + rand() * 22;
    const ang = rand() * Math.PI * 2;
    ctx.strokeStyle = rand() < 0.5 ? '#ffffff' : '#000000';
    ctx.lineWidth = 0.6 + rand() * 0.8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

function makeLogoTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  // 1. Draw white background (so vertexColors are unchanged)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // 2. Draw RN stamp in the center
  ctx.save();
  ctx.translate(size / 2, size / 2);

  // Scale vertically to compensate for rectangular stretch (W / H)
  const W = 1.55, H = 2.05;
  ctx.scale(1, W / H);

  ctx.strokeStyle = 'rgba(61, 33, 24, 0.85)';
  ctx.fillStyle = 'rgba(61, 33, 24, 0.85)';

  // Draw outer circle
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 58, 0, Math.PI * 2);
  ctx.stroke();

  // Draw inner circle
  ctx.lineWidth = 5.0;
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.stroke();

  // Draw "RN" text
  ctx.font = 'bold 42px "Patrick Hand", "Caveat", cursive, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RN', 0, 0);

  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function buildAdjacency(index: Uint16Array | Uint32Array, vertCount: number): Float64Array[] {
  const adj = new Array(vertCount);
  for (let i = 0; i < vertCount; i++) adj[i] = new Set();
  for (let i = 0; i < index.length; i += 3) {
    const a = index[i], b = index[i + 1], c = index[i + 2];
    adj[a].add(b); adj[a].add(c);
    adj[b].add(a); adj[b].add(c);
    adj[c].add(a); adj[c].add(b);
  }
  return adj.map(s => Float64Array.from(s));
}

function smoothstep(a: number, b: number, x: number): number {
  if (a === b) return x < a ? 0 : 1;
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface PaperMeshProps {
  transitioning?: boolean;
}

function PaperMesh({ transitioning = false }: PaperMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  const seed = 20260811;

  const {
    geometry,
    flatPositions,
    folds,
    calibScale,
    adjacency,
    wrinkleVal,
    vertCount,
    work,
    smoothed,
    paperTex,
    logoTex,
    centerVertexIndex
  } = useMemo(() => {
    const rand = mulberry32(seed);
    const noiseA = makeNoise3D(mulberry32(seed ^ 0x9e3779b9));
    const noiseB = makeNoise3D(mulberry32(seed ^ 0x2545f491));

    // Flat sheet dimensions (portrait, page-like proportions)
    const W = 1.55, H = 2.05;
    const segX = 42, segY = 56;
    const geo = new THREE.PlaneGeometry(W, H, segX, segY);
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const vertCount = posAttr.count;
    const index = geo.index!.array as Uint16Array | Uint32Array;

    const flatPositions = new Float32Array(vertCount * 3);
    for (let i = 0; i < vertCount; i++) {
      flatPositions[i * 3] = posAttr.getX(i);
      flatPositions[i * 3 + 1] = posAttr.getY(i);
      flatPositions[i * 3 + 2] = posAttr.getZ(i);
    }

    const adjacency = buildAdjacency(index, vertCount);

    // Dry-run construction pass
    const scratch = new Array(vertCount);
    for (let i = 0; i < vertCount; i++) {
      scratch[i] = new THREE.Vector3(flatPositions[i * 3], flatPositions[i * 3 + 1], flatPositions[i * 3 + 2]);
    }
    let radius = Math.hypot(W, H) / 2 + 0.15;
    const numFolds = 50;
    const folds = [];
    for (let f = 0; f < numFolds; f++) {
      const normal = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize();
      const offset = radius * (0.14 + rand() * 0.52);
      const strength = rand() < 0.7 ? (0.82 + rand() * 0.15) : (0.4 + rand() * 0.35);
      const compact = 0.945 + rand() * 0.045;
      let affected = 0;
      for (let i = 0; i < vertCount; i++) {
        const v = scratch[i];
        const d = v.dot(normal) - offset;
        if (d > 0) {
          affected++;
          v.addScaledVector(normal, -2 * d * strength);
          v.multiplyScalar(compact);
        }
      }
      folds.push({
        normal, offset, strength, compact,
        affectedFraction: affected / vertCount,
        chronologicalIndex: f,
        releaseRank: 0,
        openStart: 0,
        openEnd: 0
      });
      radius *= 0.983;
    }

    // Crumpled-state bounding info
    const centroid0 = new THREE.Vector3();
    for (let i = 0; i < vertCount; i++) centroid0.add(scratch[i]);
    centroid0.multiplyScalar(1 / vertCount);
    let maxLen0 = 0;
    for (let i = 0; i < vertCount; i++) maxLen0 = Math.max(maxLen0, scratch[i].distanceTo(centroid0));
    const targetCrumpledRadius = 1.15;
    const calibScale = targetCrumpledRadius / maxLen0;

    // Release schedule
    const N = folds.length;
    folds.forEach((fd, idx) => {
      const lateness = idx / (N - 1);
      const deepCentral = fd.affectedFraction < 0.16 && lateness > 0.55 ? 1 : 0;
      const releaseRank = deepCentral
        ? 0.72 + lateness * 0.28 + (1 - fd.affectedFraction) * 0.15
        : 0.45 * fd.affectedFraction + 0.5 * lateness;
      fd.releaseRank = releaseRank;
    });
    const order = folds.slice().sort((a, b) => a.releaseRank - b.releaseRank);
    order.forEach((fd, rank) => {
      const jitter = (rand() - 0.5) * 0.04;
      const startBase = (rank / N) * 0.82 + jitter;
      const duration = 0.1 + fd.affectedFraction * 0.22 + rand() * 0.05;
      fd.openStart = THREE.MathUtils.clamp(startBase, 0, 0.82);
      fd.openEnd = THREE.MathUtils.clamp(fd.openStart + duration, fd.openStart + 0.04, 1.0);
    });

    // Wrinkle noise
    const wrinkleVal = new Float32Array(vertCount);
    for (let i = 0; i < vertCount; i++) {
      const x = flatPositions[i * 3], y = flatPositions[i * 3 + 1], z = flatPositions[i * 3 + 2];
      wrinkleVal[i] = noiseA(x * 3.4, y * 3.4, z * 3.4 + 5) * 0.026
                    + noiseB(x * 9 - 3, y * 9 - 3, z * 9 - 3) * 0.009;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(vertCount * 3), 3));

    const paperTex = makePaperTexture(mulberry32(seed ^ 0x1234567));
    const logoTex = makeLogoTexture();

    // Allocate scratch buffers
    const work = new Float32Array(vertCount * 3);
    const smoothed = new Float32Array(vertCount * 3);

    // Find the center vertex (closest to 0,0)
    let centerVertexIndex = 0;
    let minD = Infinity;
    for (let i = 0; i < vertCount; i++) {
      const fx = flatPositions[i * 3];
      const fy = flatPositions[i * 3 + 1];
      const d = fx * fx + fy * fy;
      if (d < minD) {
        minD = d;
        centerVertexIndex = i;
      }
    }

    return {
      geometry: geo,
      flatPositions,
      folds,
      calibScale,
      adjacency,
      wrinkleVal,
      vertCount,
      work,
      smoothed,
      paperTex,
      logoTex,
      centerVertexIndex
    };
  }, []);

  const baseColor = useMemo(() => new THREE.Color('#f5ead6'), []); // brighter warmer base cream
  const deepColor = useMemo(() => new THREE.Color('#d0b895'), []); // clean warm tan recess (existing darker fold shading preserved)
  const peakColor = useMemo(() => new THREE.Color('#fffbf2'), []); // brighter off-white peak
  const flatColor = useMemo(() => new THREE.Color('#f4ebd8'), []); // flat tint

  useFrame((state, delta) => {
    // Lock camera target
    state.camera.lookAt(0, 0.05, 0);

    const targetProgress = transitioning ? 1 : 0;
    const speed = transitioning ? (1 / 7.2) : (1 / 2.0); // unfolds in 7.2s, folds back in 2.0s

    if (progressRef.current !== targetProgress) {
      if (progressRef.current < targetProgress) {
        progressRef.current = Math.min(targetProgress, progressRef.current + delta * speed);
      } else {
        progressRef.current = Math.max(targetProgress, progressRef.current - delta * speed);
      }
    }

    const s = easeInOutCubic(progressRef.current);

    // 1) Replay the fold stack
    work.set(flatPositions);
    for (let fi = 0; fi < folds.length; fi++) {
      const fd = folds[fi];
      const openness = smoothstep(fd.openStart, fd.openEnd, s);
      if (openness >= 1) continue;
      const eff = fd.strength * (1 - openness);
      const effCompact = 1 - (1 - fd.compact) * (1 - openness);
      const nx = fd.normal.x, ny = fd.normal.y, nz = fd.normal.z, off = fd.offset;
      for (let i = 0; i < vertCount; i++) {
        const bi = i * 3;
        const x = work[bi], y = work[bi + 1], z = work[bi + 2];
        const d = x * nx + y * ny + z * nz - off;
        if (d > 0) {
          const k = 2 * d * eff;
          let nxv = x - nx * k, nyv = y - ny * k, nzv = z - nz * k;
          nxv *= effCompact; nyv *= effCompact; nzv *= effCompact;
          work[bi] = nxv; work[bi + 1] = nyv; work[bi + 2] = nzv;
        }
      }
    }

    // 2) Smoothing pass
    const smoothFactor = 0.14;
    for (let i = 0; i < vertCount; i++) {
      const neighbors = adjacency[i];
      let ax = 0, ay = 0, az = 0;
      for (let k = 0; k < neighbors.length; k++) {
        const bi = neighbors[k] * 3;
        ax += work[bi]; ay += work[bi + 1]; az += work[bi + 2];
      }
      const inv = 1 / neighbors.length;
      ax *= inv; ay *= inv; az *= inv;
      const bi = i * 3;
      smoothed[bi] = work[bi] + (ax - work[bi]) * smoothFactor;
      smoothed[bi + 1] = work[bi + 1] + (ay - work[bi + 1]) * smoothFactor;
      smoothed[bi + 2] = work[bi + 2] + (az - work[bi + 2]) * smoothFactor;
    }

    // 3) Wrinkle noise
    const ampT = smoothstep(0.6, 1.0, s);
    const amp = THREE.MathUtils.lerp(1.0, 0.14, ampT);
    let cx = 0, cy = 0, cz = 0;
    for (let i = 0; i < vertCount; i++) {
      const bi = i * 3;
      cx += smoothed[bi]; cy += smoothed[bi + 1]; cz += smoothed[bi + 2];
    }
    cx /= vertCount; cy /= vertCount; cz /= vertCount;

    let minR = Infinity, maxR = -Infinity;
    const dists = new Float32Array(vertCount);
    for (let i = 0; i < vertCount; i++) {
      const bi = i * 3;
      const dx = smoothed[bi] - cx;
      const dy = smoothed[bi + 1] - cy;
      const dz = smoothed[bi + 2] - cz;
      const len = Math.hypot(dx, dy, dz) || 1e-6;
      const invLen = amp * wrinkleVal[i] / len;
      smoothed[bi] += dx * invLen;
      smoothed[bi + 1] += dy * invLen;
      smoothed[bi + 2] += dz * invLen;
      const d2 = Math.hypot(smoothed[bi] - cx, smoothed[bi + 1] - cy, smoothed[bi + 2] - cz);
      dists[i] = d2;
      if (d2 < minR) minR = d2;
      if (d2 > maxR) maxR = d2;
    }

    // 4) Global rigid framing transform
    const frameT = smoothstep(0, 1, s);
    const scale = THREE.MathUtils.lerp(calibScale, 1.0, frameT);

    const centerBi = centerVertexIndex * 3;
    const tx0 = -calibScale * smoothed[centerBi];
    const ty0 = -calibScale * smoothed[centerBi + 1];
    const tz0 = -calibScale * smoothed[centerBi + 2];

    const tx = THREE.MathUtils.lerp(tx0, 0, frameT);
    const ty = THREE.MathUtils.lerp(ty0, 0, frameT);
    const tz = THREE.MathUtils.lerp(tz0, 0, frameT);

    // Apply positions & colors
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const colorAttr = geometry.attributes.color as THREE.BufferAttribute;
    const colorMixToFlat = smoothstep(0.75, 1.0, s);

    for (let i = 0; i < vertCount; i++) {
      const bi = i * 3;
      const finalX = smoothed[bi] * scale + tx;
      const finalY = smoothed[bi + 1] * scale + ty;
      const finalZ = smoothed[bi + 2] * scale + tz;
      posAttr.setXYZ(i, finalX, finalY, finalZ);

      const t = (dists[i] - minR) / Math.max(1e-4, (maxR - minR));
      const c = baseColor.clone();
      if (t < 0.5) {
        c.lerp(deepColor, (0.5 - t) * 1.0);
      } else {
        c.lerp(peakColor, (t - 0.5) * 0.75);
      }
      c.lerp(flatColor, colorMixToFlat);
      colorAttr.setXYZ(i, c.r, c.g, c.b);
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <group position={[0, 0.3, 0.2]}>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          vertexColors={true}
          roughness={0.86}
          metalness={0.0}
          flatShading={false}
          bumpMap={paperTex}
          bumpScale={0.006}
          clearcoat={0.05}
          clearcoatRoughness={0.45}
          side={THREE.DoubleSide}
          map={logoTex}
        />
      </mesh>
    </group>
  );
}

export default function CrumpledPaper3D({ transitioning = false }: { transitioning?: boolean }) {
  return (
    <div className={styles.canvasContainer}>
      <Canvas shadows camera={{ position: [2.5, 1.9, 4.6], fov: 38 }}>
        {/* Ambient Fill Light */}
        <ambientLight intensity={0.75} color="#fff3df" />

        {/* Soft Directional Key Light from above/front */}
        <directionalLight
          position={[-3.0, 5.0, 3.2]}
          intensity={1.55}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={15}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-radius={16}
          shadow-bias={-0.0018}
          color="#fff6e6"
        />

        {/* Cool fill light */}
        <directionalLight
          position={[3.4, 1.8, -1.6]}
          intensity={0.62}
          color="#dce8ff"
        />

        {/* Rim light */}
        <directionalLight
          position={[-1.3, 1.1, -3.6]}
          intensity={0.32}
          color="#ffffff"
        />

        {/* Bounce light */}
        <hemisphereLight
          color="#fff6e0"
          groundColor="#a4926e"
          intensity={0.42}
        />

        {/* Real 3D generated paper mesh */}
        <PaperMesh transitioning={transitioning} />

        {/* Realistic ground shadow plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial opacity={0.2} />
        </mesh>
      </Canvas>
    </div>
  );
}
