// Neon Drift — mesin game balap 3D tanpa akhir (three.js).
// Dunia bergerak ke arah +Z; mobil pemain diam di z = 0 dan hanya bergeser di sumbu X.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries, toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';

const LANES = [-4.8, -1.6, 1.6, 4.8];
const LANE_SPEED = [22.5, 21.5, 20.5, 19.5];
const ROAD_HALF = 6.4;
const SPAWN_Z = -300;
const DESPAWN_Z = 26;
const FOG_NEAR = 70;
const FOG_FAR = 330;
const ZONE_LENGTH = 1800;

export const ZONES = [
  { name: 'Midnight Cyan', top: 0x03030a, mid: 0x1a0b3d, horizon: 0xff4f93, sunA: 0xffd98a, sunB: 0xff3b7f, grid: 0x6f52ff, edgeL: 0x22e6ff, edgeR: 0xff3fa4, fog: 0x0b0618 },
  { name: 'Crimson Dusk', top: 0x060208, mid: 0x3a0a22, horizon: 0xff7a3c, sunA: 0xfff0a8, sunB: 0xff4a2b, grid: 0xff3b6b, edgeL: 0xffb13b, edgeR: 0xff2e63, fog: 0x14050c },
  { name: 'Aurora', top: 0x01060a, mid: 0x06283a, horizon: 0x3dffc4, sunA: 0xe6fff4, sunB: 0x19c9ff, grid: 0x18d6a8, edgeL: 0x4dffd2, edgeR: 0x3aa0ff, fog: 0x031018 },
  { name: 'Ultraviolet', top: 0x040208, mid: 0x25094a, horizon: 0xb46bff, sunA: 0xffd0ff, sunB: 0x8a3bff, grid: 0xc04dff, edgeL: 0xff5cf0, edgeR: 0x7a6bff, fog: 0x0c0520 },
];
const PAL_KEYS = ['top', 'mid', 'horizon', 'sunA', 'sunB', 'grid', 'edgeL', 'edgeR', 'fog'];

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (dt, k) => 1 - Math.exp(-dt * k);
const wrap = (v, span) => ((v % span) + span) % span;

/* ------------------------------------------------------------------ shader */

const FOG_GLSL = /* glsl */ `
  uniform vec3 uFog;
  float fogAmount(vec3 p) {
    return smoothstep(${FOG_NEAR.toFixed(1)}, ${FOG_FAR.toFixed(1)}, length(p.xz - cameraPosition.xz));
  }
`;
const OUT_GLSL = /* glsl */ `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`;
const WORLD_VERT = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const SKY_FRAG = /* glsl */ `
  uniform vec3 uTop, uMid, uHorizon, uSunA, uSunB, uFog;
  uniform float uTime;
  varying vec3 vDir;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    vec3 col = mix(uMid, uTop, smoothstep(0.0, 0.5, h));
    col = mix(col, uHorizon * 0.85, pow(1.0 - clamp(h, 0.0, 1.0), 10.0) * 0.8);
    if (h > 0.03) {
      vec2 uv = vec2(atan(d.x, -d.z) * 38.0, h * 70.0);
      vec2 c = floor(uv);
      vec2 f = fract(uv) - 0.5;
      float r = hash(c);
      vec2 o = vec2(hash(c + 3.1), hash(c + 7.7)) - 0.5;
      float s = step(0.95, r) * smoothstep(0.1, 0.0, length(f - o * 0.7));
      s *= 0.55 + 0.45 * sin(uTime * 2.0 + r * 60.0);
      col += vec3(s) * smoothstep(0.03, 0.3, h) * 1.3;
    }
    vec3 sd = normalize(vec3(0.0, 0.115, -1.0));
    float ang = acos(clamp(dot(d, sd), -1.0, 1.0));
    float R = 0.135;
    float yy = clamp((d.y - (sd.y - R)) / (2.0 * R), 0.0, 1.0);
    float disc = 1.0 - smoothstep(R - 0.003, R, ang);
    float gap = max(0.0, 0.62 - yy * 1.15);
    disc *= smoothstep(gap, gap + 0.06, fract(yy * 10.0 - uTime * 0.05));
    vec3 sun = mix(uSunB, uSunA, smoothstep(0.1, 0.95, yy));
    col = mix(col, sun * 1.35, disc);
    col += uSunB * exp(-ang * 5.0) * 0.3;
    col = mix(uFog, col, smoothstep(-0.03, 0.0, h));
    gl_FragColor = vec4(col, 1.0);
    ${OUT_GLSL}
  }
`;

const ROAD_FRAG = /* glsl */ `
  uniform float uDist;
  uniform vec3 uEdgeL, uEdgeR, uHorizon;
  varying vec3 vPos;
  ${FOG_GLSL}
  float aaLine(float d, float w) {
    float aa = fwidth(d) * 1.2;
    return 1.0 - smoothstep(w, w + aa, abs(d));
  }
  void main() {
    float x = vPos.x;
    float s = uDist - vPos.z;
    float ahead = max(0.0, -vPos.z);
    vec3 col = vec3(0.011, 0.011, 0.02);
    float ph = fract(s / 12.0);
    float dash = smoothstep(0.0, 0.03, ph) * (1.0 - smoothstep(0.42, 0.45, ph));
    float lanes = max(max(aaLine(x + 3.2, 0.07), aaLine(x, 0.07)), aaLine(x - 3.2, 0.07)) * dash;
    lanes *= 1.0 - smoothstep(140.0, 260.0, ahead);
    col += vec3(0.7, 0.78, 1.0) * lanes * 0.85;
    float e = abs(x) - ${ROAD_HALF.toFixed(1)};
    vec3 ec = x < 0.0 ? uEdgeL : uEdgeR;
    col += ec * aaLine(e, 0.1) * 2.6;
    col += ec * exp(-abs(e) * 1.4) * 0.2;
    // pantulan cakrawala di aspal basah
    col += uHorizon * exp(-abs(x) * 0.2) * smoothstep(8.0, 250.0, ahead) * 0.2;
    col = mix(col, uFog, fogAmount(vPos));
    gl_FragColor = vec4(col, 1.0);
    ${OUT_GLSL}
  }
`;

const GROUND_FRAG = /* glsl */ `
  uniform float uDist;
  uniform vec3 uGrid;
  varying vec3 vPos;
  ${FOG_GLSL}
  void main() {
    vec2 g = vec2(vPos.x, uDist - vPos.z) / 8.0;
    vec2 a = abs(fract(g - 0.5) - 0.5) / fwidth(g);
    float line = 1.0 - min(min(a.x, a.y), 1.0);
    float side = 1.0 - smoothstep(50.0, 190.0, abs(vPos.x));
    vec3 col = vec3(0.008, 0.006, 0.016) + uGrid * line * 0.6 * side;
    col = mix(col, uFog, fogAmount(vPos));
    gl_FragColor = vec4(col, 1.0);
    ${OUT_GLSL}
  }
`;

const BUILDING_VERT = /* glsl */ `
  attribute float aSeed;
  varying vec3 vPos;
  varying vec2 vWall;
  varying vec3 vN;
  varying float vSeed;
  varying float vH;
  void main() {
    vec3 sc = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
    vN = normal;
    vSeed = aSeed;
    vH = sc.y;
    vWall = abs(normal.x) > 0.5 ? vec2(position.z * sc.z, position.y * sc.y) : vec2(position.x * sc.x, position.y * sc.y);
    vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const BUILDING_FRAG = /* glsl */ `
  uniform vec3 uEdgeL, uEdgeR;
  varying vec3 vPos;
  varying vec2 vWall;
  varying vec3 vN;
  varying float vSeed;
  varying float vH;
  ${FOG_GLSL}
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec3 col = vec3(0.012, 0.01, 0.024);
    if (abs(vN.y) < 0.5) {
      vec2 q = vWall / vec2(1.7, 3.1);
      vec2 cell = floor(q);
      vec2 f = fract(q);
      float lit = step(0.7, hash(cell + vSeed * 17.0));
      float win = step(0.3, f.x) * step(f.x, 0.7) * step(0.2, f.y) * step(f.y, 0.68);
      vec3 wc = mix(vec3(1.0, 0.74, 0.4), uEdgeL, step(0.7, hash(cell.yx + vSeed)));
      float wb = hash(cell * 1.7 + vSeed);
      col += wc * lit * win * (0.06 + 0.5 * wb * wb);
      col += vec3(0.01, 0.01, 0.022) * step(0.93, f.y);
      float rim = smoothstep(vH - 0.55, vH - 0.3, vWall.y);
      vec3 rc = mix(uEdgeL, uEdgeR, step(0.5, fract(vSeed * 7.3)));
      col += rc * rim * 1.8 * step(0.4, fract(vSeed * 3.1));
    }
    col = mix(col, uFog, fogAmount(vPos));
    gl_FragColor = vec4(col, 1.0);
    ${OUT_GLSL}
  }
`;

const PARTICLE_VERT = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  uniform float uScale;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / max(0.1, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const PARTICLE_FRAG = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor * a * a, 1.0);
    ${OUT_GLSL}
  }
`;

const SHIELD_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const SHIELD_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
    gl_FragColor = vec4(uColor * f * 2.2 * uAlpha, 1.0);
    ${OUT_GLSL}
  }
`;

/* ------------------------------------------------------------- pembangun */

function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function profileGeo(points, depth, bevel, taper) {
  const shape = new THREE.Shape();
  points.forEach(([u, v], i) => (i ? shape.lineTo(u, v) : shape.moveTo(u, v)));
  shape.closePath();
  let geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.8,
    bevelSegments: 3,
    steps: 1,
  });
  geo.translate(0, 0, -depth / 2);
  geo.rotateY(Math.PI / 2); // panjang → sumbu Z (depan = -Z), lebar → sumbu X
  if (taper) {
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) * taper(p.getY(i), p.getZ(i)));
  }
  geo.deleteAttribute('uv');
  geo.deleteAttribute('normal');
  geo = toCreasedNormals(geo, Math.PI / 3.2);
  return geo;
}

const CAR_SPECS = {
  sport: {
    body: [[-2.15, 0.3], [-2.2, 0.62], [-1.85, 0.78], [-0.9, 0.82], [0.95, 0.76], [1.8, 0.6], [2.22, 0.44], [2.25, 0.3], [2.0, 0.2], [-1.95, 0.2]],
    canopy: [[-1.5, 0.76], [-0.85, 1.14], [0.05, 1.16], [1.0, 0.76]],
    width: 1.62,
    canopyWidth: 1.16,
    wheelZ: 1.36,
    wheelR: 0.36,
    halfLen: 2.3,
    tailY: 0.64,
    headY: 0.5,
    taper: (y, z) => 1 - 0.16 * clamp((-z - 0.5) / 1.8, 0, 1) - 0.05 * clamp((z - 1.2) / 1.1, 0, 1),
  },
  sedan: {
    body: [[-2.2, 0.32], [-2.22, 0.78], [-1.9, 0.86], [1.5, 0.84], [2.1, 0.7], [2.25, 0.5], [2.25, 0.32], [2.05, 0.22], [-2.0, 0.22]],
    canopy: [[-1.7, 0.84], [-1.2, 1.32], [0.45, 1.32], [1.15, 0.84]],
    width: 1.62,
    canopyWidth: 1.3,
    wheelZ: 1.4,
    wheelR: 0.36,
    halfLen: 2.3,
    tailY: 0.7,
    headY: 0.58,
    taper: (y, z) => 1 - 0.08 * clamp((-z - 0.9) / 1.4, 0, 1),
  },
  van: {
    body: [[-2.5, 0.32], [-2.5, 1.0], [1.7, 1.0], [2.4, 0.8], [2.5, 0.5], [2.5, 0.32], [2.3, 0.22], [-2.3, 0.22]],
    canopy: [[-2.42, 1.0], [-2.42, 1.92], [1.15, 1.92], [1.75, 1.0]],
    width: 1.7,
    canopyWidth: 1.6,
    wheelZ: 1.6,
    wheelR: 0.4,
    halfLen: 2.6,
    tailY: 0.82,
    headY: 0.64,
    taper: null,
  },
};

function buildCarGeometry(spec) {
  const body = profileGeo(spec.body, spec.width, 0.1, spec.taper);
  const canopy = profileGeo(spec.canopy, spec.canopyWidth, 0.07, spec.taper);
  const wheels = [];
  const hw = spec.width / 2 - 0.02;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const w = new THREE.CylinderGeometry(spec.wheelR, spec.wheelR, 0.26, 20);
      w.rotateZ(Math.PI / 2);
      w.translate(sx * hw, spec.wheelR, sz * spec.wheelZ);
      wheels.push(w);
    }
  }
  const tail = new THREE.BoxGeometry(spec.width * 0.92, 0.07, 0.1);
  tail.translate(0, spec.tailY, spec.halfLen - 0.04);
  const heads = [-1, 1].map((sx) => {
    const g = new THREE.BoxGeometry(0.42, 0.07, 0.14);
    g.translate(sx * spec.width * 0.31, spec.headY, -spec.halfLen + 0.08);
    return g;
  });
  const skirts = [-1, 1].map((sx) => {
    const g = new THREE.BoxGeometry(0.035, 0.035, spec.wheelZ * 1.5);
    g.translate(sx * (spec.width / 2 + 0.105), 0.27, 0);
    return g;
  });
  return { body, canopy, wheels: mergeGeometries(wheels), tail, heads: mergeGeometries(heads), skirts: mergeGeometries(skirts) };
}

/* ------------------------------------------------------------------ mesin */

export function createNeonDrift(host, cb = {}) {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const audio = cb.audio;

  // Kanvas dibuat di sini (bukan oleh React) supaya konteks WebGL-nya bisa dilepas
  // sepenuhnya saat game ditutup tanpa mengganggu pemasangan berikutnya.
  const canvas = document.createElement('canvas');
  canvas.className = 'gm-canvas';
  host.appendChild(canvas);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (err) {
    canvas.remove();
    throw err;
  }
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(64, 1, 0.3, 1800);
  const disposables = [];
  const track = (o) => {
    disposables.push(o);
    return o;
  };

  // Palet yang berpindah halus antar zona; uniform memakai objek Color yang sama.
  const pal = {};
  const palTarget = {};
  PAL_KEYS.forEach((k) => {
    pal[k] = new THREE.Color(ZONES[0][k]);
    palTarget[k] = new THREE.Color(ZONES[0][k]);
  });
  const setZone = (i) => PAL_KEYS.forEach((k) => palTarget[k].set(ZONES[i][k]));

  scene.fog = new THREE.Fog(pal.fog.getHex(), FOG_NEAR, FOG_FAR);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.42;
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0x8f7dff, 0x150a1c, 0.9));
  const sunLight = new THREE.DirectionalLight(0xffc4dd, 1.5);
  sunLight.position.set(-3, 8, -14);
  scene.add(sunLight);
  const fill = new THREE.DirectionalLight(0x6fd8ff, 0.7);
  fill.position.set(5, 6, 9);
  scene.add(fill);

  /* ---- langit, jalan, tanah ---- */
  const uTime = { value: 0 };
  const uDist = { value: 0 };
  const uFog = { value: pal.fog };

  const sky = new THREE.Mesh(
    track(new THREE.SphereGeometry(900, 32, 16)),
    track(
      new THREE.ShaderMaterial({
        uniforms: {
          uTop: { value: pal.top },
          uMid: { value: pal.mid },
          uHorizon: { value: pal.horizon },
          uSunA: { value: pal.sunA },
          uSunB: { value: pal.sunB },
          uFog,
          uTime,
        },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: SKY_FRAG,
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
      }),
    ),
  );
  sky.renderOrder = -10;
  sky.frustumCulled = false;
  scene.add(sky);

  const groundGeo = track(new THREE.PlaneGeometry(1000, 900));
  groundGeo.rotateX(-Math.PI / 2);
  const ground = new THREE.Mesh(
    groundGeo,
    track(
      new THREE.ShaderMaterial({
        uniforms: { uDist, uGrid: { value: pal.grid }, uFog },
        vertexShader: WORLD_VERT,
        fragmentShader: GROUND_FRAG,
        depthWrite: false,
      }),
    ),
  );
  ground.position.set(0, -0.05, -100);
  ground.renderOrder = -5;
  ground.frustumCulled = false;
  scene.add(ground);

  const roadGeo = track(new THREE.PlaneGeometry(ROAD_HALF * 2 + 2.4, 900));
  roadGeo.rotateX(-Math.PI / 2);
  const road = new THREE.Mesh(
    roadGeo,
    track(
      new THREE.ShaderMaterial({
        uniforms: {
          uDist,
          uEdgeL: { value: pal.edgeL },
          uEdgeR: { value: pal.edgeR },
          uHorizon: { value: pal.horizon },
          uFog,
        },
        vertexShader: WORLD_VERT,
        fragmentShader: ROAD_FRAG,
      }),
    ),
  );
  road.position.set(0, 0, -100);
  road.renderOrder = -4;
  road.frustumCulled = false;
  scene.add(road);

  /* ---- gedung ---- */
  const B_COUNT = 90;
  const B_SPAN = 660;
  const bGeo = track(new THREE.BoxGeometry(1, 1, 1));
  bGeo.translate(0, 0.5, 0);
  const bSeed = new Float32Array(B_COUNT);
  const bData = [];
  for (let i = 0; i < B_COUNT; i++) {
    const side = i % 2 ? 1 : -1;
    bSeed[i] = Math.random();
    bData.push({
      x: side * rand(25, 96),
      base: (i / B_COUNT) * B_SPAN + rand(-3, 3),
      w: rand(8, 17),
      h: rand(12, 30) + (Math.random() < 0.3 ? rand(20, 46) : 0),
      d: rand(9, 18),
    });
  }
  bGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(bSeed, 1));
  const buildings = new THREE.InstancedMesh(
    bGeo,
    track(
      new THREE.ShaderMaterial({
        uniforms: { uEdgeL: { value: pal.edgeL }, uEdgeR: { value: pal.edgeR }, uFog },
        vertexShader: BUILDING_VERT,
        fragmentShader: BUILDING_FRAG,
      }),
    ),
    B_COUNT,
  );
  buildings.frustumCulled = false;
  scene.add(buildings);

  /* ---- gerbang neon & patok pinggir jalan ---- */
  const ARCH_COUNT = 6;
  const ARCH_SPAN = 540;
  const archMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  const arches = new THREE.InstancedMesh(track(new THREE.BoxGeometry(1, 1, 1)), archMat, ARCH_COUNT * 3);
  arches.frustumCulled = false;
  scene.add(arches);

  const POST_SIDE = 40;
  const POST_GAP = 10;
  const postMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  const posts = new THREE.InstancedMesh(track(new THREE.BoxGeometry(0.12, 0.62, 0.12)), postMat, POST_SIDE * 2);
  posts.frustumCulled = false;
  scene.add(posts);

  /* ---- tekstur cahaya ---- */
  const radialTex = track(
    canvasTexture(128, 128, (g, w, h) => {
      const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      gr.addColorStop(0, 'rgba(255,255,255,1)');
      gr.addColorStop(0.35, 'rgba(255,255,255,0.45)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
    }),
  );
  const trafficGlowTex = track(
    canvasTexture(64, 160, (g, w, h) => {
      const blob = (cy, r, color) => {
        const gr = g.createRadialGradient(w / 2, cy, 0, w / 2, cy, r);
        gr.addColorStop(0, color);
        gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr;
        g.fillRect(0, 0, w, h);
      };
      blob(22, 30, 'rgba(255,240,210,0.75)');
      blob(h - 26, 34, 'rgba(255,30,60,0.9)');
    }),
  );
  const beamTex = track(
    canvasTexture(64, 256, (g, w, h) => {
      const gr = g.createLinearGradient(0, h, 0, 0);
      gr.addColorStop(0, 'rgba(255,255,255,0.9)');
      gr.addColorStop(0.5, 'rgba(255,255,255,0.25)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
      g.globalCompositeOperation = 'destination-in';
      const m = g.createLinearGradient(0, 0, w, 0);
      m.addColorStop(0, 'rgba(0,0,0,0)');
      m.addColorStop(0.5, 'rgba(0,0,0,1)');
      m.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = m;
      g.fillRect(0, 0, w, h);
    }),
  );

  const flatPlane = (w, l) => {
    const g = track(new THREE.PlaneGeometry(w, l));
    g.rotateX(-Math.PI / 2);
    return g;
  };
  const additive = (opts) =>
    track(new THREE.MeshBasicMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, ...opts }));

  /* ---- mobil ---- */
  const geos = {};
  Object.keys(CAR_SPECS).forEach((k) => {
    geos[k] = buildCarGeometry(CAR_SPECS[k]);
    Object.values(geos[k]).forEach(track);
  });
  const glassMat = track(new THREE.MeshStandardMaterial({ color: 0x05060b, metalness: 0.95, roughness: 0.1, envMapIntensity: 2.2 }));
  const wheelMat = track(new THREE.MeshStandardMaterial({ color: 0x07070a, metalness: 0.3, roughness: 0.75 }));
  const headMat = track(new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 3.0, 2.4) }));
  const trafficGlowGeo = flatPlane(3.6, 8.6);
  const trafficGlowMat = additive({ map: trafficGlowTex, opacity: 0.55, fog: true });

  // Mobil pemain
  const player = new THREE.Group();
  const playerPaint = track(
    new THREE.MeshPhysicalMaterial({ color: 0x7c86a0, metalness: 0.9, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.25 }),
  );
  const playerTailMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  const playerGlowMat = additive({ map: radialTex, opacity: 0.6 });
  const playerSkirtMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  {
    const g = geos.sport;
    player.add(new THREE.Mesh(g.body, playerPaint));
    player.add(new THREE.Mesh(g.canopy, glassMat));
    player.add(new THREE.Mesh(g.wheels, wheelMat));
    player.add(new THREE.Mesh(g.tail, playerTailMat));
    player.add(new THREE.Mesh(g.heads, headMat));
    player.add(new THREE.Mesh(g.skirts, playerSkirtMat));
    const glow = new THREE.Mesh(flatPlane(4.4, 7.4), playerGlowMat);
    glow.position.y = 0.03;
    player.add(glow);
    const beam = new THREE.Mesh(flatPlane(6.5, 30), additive({ map: beamTex, opacity: 0.16, color: 0xfff1d8 }));
    beam.position.set(0, 0.04, -17);
    player.add(beam);
  }
  scene.add(player);

  const shieldMat = track(
    new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(0x66e0ff) }, uAlpha: { value: 0 } },
      vertexShader: SHIELD_VERT,
      fragmentShader: SHIELD_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const shieldMesh = new THREE.Mesh(track(new THREE.SphereGeometry(1, 28, 18)), shieldMat);
  shieldMesh.scale.set(1.7, 1.15, 3.1);
  shieldMesh.position.y = 0.7;
  shieldMesh.visible = false;
  player.add(shieldMesh);

  // Lalu lintas (pool)
  const TRAFFIC_COLORS = [0x23262e, 0x6d0f1f, 0x0f2b5c, 0xd9d4cb, 0x0c4a3c, 0xb8741a, 0x3b1d66, 0x8a8f99];
  const paints = TRAFFIC_COLORS.map((c) => track(new THREE.MeshStandardMaterial({ color: c, metalness: 0.65, roughness: 0.34, envMapIntensity: 1.3 })));
  const TAIL_RED = new THREE.Color(3.4, 0.1, 0.22);
  const TAIL_AMBER = new THREE.Color(3.6, 1.5, 0.05);
  const traffic = [];
  for (let i = 0; i < 18; i++) {
    const kind = i % 4 === 3 ? 'van' : 'sedan';
    const spec = CAR_SPECS[kind];
    const g = geos[kind];
    const group = new THREE.Group();
    const tailMat = track(new THREE.MeshBasicMaterial({ color: TAIL_RED.clone() }));
    group.add(new THREE.Mesh(g.body, paints[i % paints.length]));
    group.add(new THREE.Mesh(g.canopy, kind === 'van' ? paints[(i + 3) % paints.length] : glassMat));
    group.add(new THREE.Mesh(g.wheels, wheelMat));
    group.add(new THREE.Mesh(g.tail, tailMat));
    group.add(new THREE.Mesh(g.heads, headMat));
    const glow = new THREE.Mesh(trafficGlowGeo, trafficGlowMat);
    glow.position.y = 0.03;
    group.add(glow);
    group.visible = false;
    scene.add(group);
    traffic.push({ group, tailMat, halfLen: spec.halfLen, active: false, x: 0, z: 0, lane: 0, toLane: 0, speed: 20, changeT: 0, passed: false, flung: null });
  }

  /* ---- pickup ---- */
  const orbGeo = track(new THREE.OctahedronGeometry(0.42, 0));
  const shieldGeo = track(new THREE.IcosahedronGeometry(0.62, 0));
  const orbMat = track(new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 2.0, 0.5) }));
  const shieldPickMat = track(new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 2.2, 3.0), wireframe: true }));
  const orbSpriteMat = track(new THREE.SpriteMaterial({ map: radialTex, color: 0xffc94d, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.7, fog: false }));
  const shieldSpriteMat = track(new THREE.SpriteMaterial({ map: radialTex, color: 0x55d8ff, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.8, fog: false }));
  const pickups = [];
  for (let i = 0; i < 22; i++) {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(orbGeo, orbMat);
    const sprite = new THREE.Sprite(orbSpriteMat);
    sprite.scale.setScalar(2.6);
    group.add(mesh, sprite);
    group.visible = false;
    scene.add(group);
    pickups.push({ group, mesh, sprite, active: false, kind: 'orb', x: 0, z: 0, phase: 0 });
  }

  /* ---- partikel ---- */
  const P_MAX = 700;
  const pPos = new Float32Array(P_MAX * 3);
  const pCol = new Float32Array(P_MAX * 3);
  const pSize = new Float32Array(P_MAX);
  const pData = Array.from({ length: P_MAX }, () => ({ life: 0, max: 1, vx: 0, vy: 0, vz: 0, r: 1, g: 1, b: 1, size: 1, grav: 0, wf: 0, drag: 0 }));
  let pCursor = 0;
  const pGeo = track(new THREE.BufferGeometry());
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('aColor', new THREE.BufferAttribute(pCol, 3));
  pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
  const pMat = track(
    new THREE.ShaderMaterial({
      uniforms: { uScale: { value: 600 } },
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const points = new THREE.Points(pGeo, pMat);
  points.frustumCulled = false;
  scene.add(points);

  const emit = (x, y, z, vx, vy, vz, life, size, r, g, b, grav = 0, wf = 0, drag = 0) => {
    const i = pCursor;
    pCursor = (pCursor + 1) % P_MAX;
    const p = pData[i];
    pPos[i * 3] = x;
    pPos[i * 3 + 1] = y;
    pPos[i * 3 + 2] = z;
    p.vx = vx;
    p.vy = vy;
    p.vz = vz;
    p.life = life;
    p.max = life;
    p.size = size;
    p.r = r;
    p.g = g;
    p.b = b;
    p.grav = grav;
    p.wf = wf;
    p.drag = drag;
  };
  const tmpColor = new THREE.Color();
  const burst = (x, y, z, n, hex, power = 8, size = 0.5, life = 0.7) => {
    tmpColor.set(hex);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const e = Math.random() * Math.PI - Math.PI / 2;
      const s = power * rand(0.3, 1);
      emit(x, y, z, Math.cos(a) * Math.cos(e) * s, Math.abs(Math.sin(e)) * s + 1, Math.sin(a) * Math.cos(e) * s, life * rand(0.5, 1), size * rand(0.6, 1.3), tmpColor.r * 2.2, tmpColor.g * 2.2, tmpColor.b * 2.2, 12, 0.5, 1.2);
    }
  };

  /* ---- garis kecepatan ---- */
  const STREAKS = 90;
  const sPos = new Float32Array(STREAKS * 6);
  const sData = Array.from({ length: STREAKS }, () => ({ x: 0, y: 0, z: 0 }));
  const resetStreak = (s, far) => {
    const side = Math.random() < 0.5 ? -1 : 1;
    s.x = side * rand(7.6, 22);
    s.y = rand(0.2, 5.5);
    s.z = far ? rand(-260, -160) : rand(-260, 10);
  };
  sData.forEach((s) => resetStreak(s, false));
  const sGeo = track(new THREE.BufferGeometry());
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  const sMat = track(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  const streaks = new THREE.LineSegments(sGeo, sMat);
  streaks.frustumCulled = false;
  scene.add(streaks);

  /* ---- keadaan ---- */
  const input = { left: false, right: false, nitro: false, brake: false };
  const S = {
    mode: 'attract',
    paused: false,
    t: 0,
    runT: 0,
    runDist: 0,
    dist: 0,
    speed: 28,
    x: 0,
    steer: 0,
    nitro: 0.5,
    nitroLock: false,
    boost: 0,
    score: 0,
    combo: 0,
    comboT: 0,
    shield: false,
    shieldGlow: 0,
    invuln: 0,
    near: 0,
    topSpeed: 0,
    spawnAcc: 0,
    gapRand: 1,
    orbAt: 0,
    shieldAt: 0,
    zone: 0,
    crashT: 0,
    countT: 0,
    countStep: 0,
    shake: 0,
    scrape: 0,
    scraping: false,
    spin: 0,
    lift: 0,
    viewShift: 0,
  };
  const hud = { score: 0, speed: 0, nitro: 0, boosting: false, mult: 1, comboT: 0, shield: false, dist: 0 };

  const camPos = new THREE.Vector3(6, 2.6, 7);
  const camLook = new THREE.Vector3(0, 0.8, 0);
  const tmpV = new THREE.Vector3();
  const tmpM = new THREE.Matrix4();
  let portrait = false;

  const releaseCar = (c) => {
    c.active = false;
    c.flung = null;
    c.group.visible = false;
    c.group.rotation.set(0, 0, 0);
    c.group.position.y = 0;
  };
  const clearWorld = () => {
    traffic.forEach(releaseCar);
    pickups.forEach((p) => {
      p.active = false;
      p.group.visible = false;
    });
  };

  // Aturan anti-tembok: dalam rentang 40 m tidak boleh lebih dari dua lajur terisi,
  // supaya selalu ada celah yang bisa dilewati.
  const trySpawn = (z) => {
    const used = new Set();
    for (const c of traffic) {
      if (c.active && Math.abs(c.z - z) < 40) {
        used.add(c.lane);
        used.add(c.toLane);
      }
    }
    if (used.size >= 2) return false;
    const free = [0, 1, 2, 3].filter((l) => !used.has(l));
    const lane = free[Math.floor(Math.random() * free.length)];
    const idle = traffic.filter((c) => !c.active);
    if (!idle.length) return false;
    const c = idle[Math.floor(Math.random() * idle.length)];
    c.active = true;
    c.lane = lane;
    c.toLane = lane;
    c.x = LANES[lane];
    c.z = z;
    c.speed = LANE_SPEED[lane] + rand(-0.4, 0.4);
    c.changeT = rand(2.5, 9);
    c.passed = false;
    c.flung = null;
    c.tailMat.color.copy(TAIL_RED);
    c.group.visible = true;
    c.group.rotation.set(0, 0, 0);
    c.group.position.set(c.x, 0, c.z);
    return true;
  };

  const spawnPickup = (kind, x, z) => {
    const p = pickups.find((q) => !q.active);
    if (!p) return;
    p.active = true;
    p.kind = kind;
    p.x = x;
    p.z = z;
    p.phase = Math.random() * 6;
    p.mesh.geometry = kind === 'shield' ? shieldGeo : orbGeo;
    p.mesh.material = kind === 'shield' ? shieldPickMat : orbMat;
    p.sprite.material = kind === 'shield' ? shieldSpriteMat : orbSpriteMat;
    p.sprite.scale.setScalar(kind === 'shield' ? 4.2 : 2.6);
    p.group.visible = true;
  };

  const mult = () => 1 + Math.min(7, S.combo);
  const addScore = (v) => {
    S.score += v * mult();
  };

  const nearMiss = (insane) => {
    S.combo += 1;
    S.comboT = 1;
    S.near += 1;
    const pts = (insane ? 250 : 100) * mult();
    S.score += pts;
    S.nitro = Math.min(1, S.nitro + (insane ? 0.2 : 0.12));
    cb.onPopup?.(`${insane ? 'NYARIS BANGET' : 'NEAR MISS'}  +${pts}`, insane ? 'hot' : 'good');
    audio?.noise({ dur: 0.28, vol: 0.14, from: 2600, to: 500, q: 1.2 });
    audio?.tone({ freq: insane ? 990 : 780, to: insane ? 1480 : 1100, dur: 0.14, type: 'triangle', vol: 0.07 });
  };

  const crash = () => {
    S.mode = 'crash';
    S.crashT = 0;
    S.shake = 1.4;
    S.spin = (Math.random() < 0.5 ? -1 : 1) * rand(7, 11);
    S.lift = 6;
    burst(S.x, 0.8, -1, 110, 0xffb347, 18, 0.9, 1.2);
    burst(S.x, 0.8, -1, 60, 0xff3b6b, 12, 1.4, 0.9);
    audio?.stopEngine();
    audio?.stopMusic();
    audio?.noise({ dur: 0.9, vol: 0.4, from: 900, to: 60, type: 'lowpass', q: 0.4 });
    audio?.tone({ freq: 160, to: 30, dur: 0.7, type: 'sawtooth', vol: 0.2 });
    cb.onState?.('crash');
  };

  const hitCar = (c) => {
    if (S.shield) {
      S.shield = false;
      S.invuln = 1.3;
      S.shake = 0.8;
      c.flung = { vx: (c.x >= S.x ? 1 : -1) * rand(7, 11), vy: rand(7, 10), t: 1.6, spin: rand(-8, 8) };
      burst(c.x, 0.8, c.z, 70, 0x66e0ff, 14, 0.8, 0.9);
      cb.onPopup?.('PERISAI HANCUR', 'warn');
      audio?.noise({ dur: 0.5, vol: 0.3, from: 1400, to: 120, type: 'lowpass', q: 0.5 });
      audio?.tone({ freq: 520, to: 120, dur: 0.4, type: 'square', vol: 0.08 });
      return;
    }
    crash();
  };

  /* ---- pembaruan ---- */
  const updateDecor = () => {
    for (let i = 0; i < B_COUNT; i++) {
      const b = bData[i];
      const z = -B_SPAN + 220 + wrap(b.base + S.dist, B_SPAN);
      tmpM.makeScale(b.w, b.h, b.d).setPosition(b.x, 0, z);
      buildings.setMatrixAt(i, tmpM);
    }
    buildings.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < ARCH_COUNT; i++) {
      const z = -ARCH_SPAN + 80 + wrap(i * (ARCH_SPAN / ARCH_COUNT) + S.dist, ARCH_SPAN);
      const px = ROAD_HALF + 2.2;
      tmpM.makeScale(0.22, 8.4, 0.22).setPosition(-px, 4.2, z);
      arches.setMatrixAt(i * 3, tmpM);
      tmpM.makeScale(0.22, 8.4, 0.22).setPosition(px, 4.2, z);
      arches.setMatrixAt(i * 3 + 1, tmpM);
      tmpM.makeScale(px * 2 + 0.22, 0.22, 0.22).setPosition(0, 8.4, z);
      arches.setMatrixAt(i * 3 + 2, tmpM);
    }
    arches.instanceMatrix.needsUpdate = true;

    const pSpan = POST_SIDE * POST_GAP;
    for (let i = 0; i < POST_SIDE; i++) {
      const z = -pSpan + 70 + wrap(i * POST_GAP + S.dist, pSpan);
      tmpM.makeTranslation(-(ROAD_HALF + 0.9), 0.31, z);
      posts.setMatrixAt(i * 2, tmpM);
      tmpM.makeTranslation(ROAD_HALF + 0.9, 0.31, z);
      posts.setMatrixAt(i * 2 + 1, tmpM);
    }
    posts.instanceMatrix.needsUpdate = true;
  };

  const updateParticles = (dt) => {
    for (let i = 0; i < P_MAX; i++) {
      const p = pData[i];
      if (p.life <= 0) {
        pSize[i] = 0;
        continue;
      }
      p.life -= dt;
      const k = Math.max(0, p.life / p.max);
      if (p.drag) {
        const d = Math.exp(-p.drag * dt);
        p.vx *= d;
        p.vz *= d;
      }
      p.vy -= p.grav * dt;
      pPos[i * 3] += p.vx * dt;
      pPos[i * 3 + 1] = Math.max(0.03, pPos[i * 3 + 1] + p.vy * dt);
      pPos[i * 3 + 2] += (p.vz + S.speed * p.wf) * dt;
      pCol[i * 3] = p.r * k;
      pCol[i * 3 + 1] = p.g * k;
      pCol[i * 3 + 2] = p.b * k;
      pSize[i] = p.size * (0.4 + 0.6 * k);
    }
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.aColor.needsUpdate = true;
    pGeo.attributes.aSize.needsUpdate = true;
  };

  const updateStreaks = (dt, sn) => {
    const len = 2 + S.speed * 0.07 + S.boost * 5;
    for (let i = 0; i < STREAKS; i++) {
      const s = sData[i];
      s.z += S.speed * 1.35 * dt;
      if (s.z > 14) resetStreak(s, true);
      sPos[i * 6] = s.x;
      sPos[i * 6 + 1] = s.y;
      sPos[i * 6 + 2] = s.z;
      sPos[i * 6 + 3] = s.x;
      sPos[i * 6 + 4] = s.y;
      sPos[i * 6 + 5] = s.z - len;
    }
    sGeo.attributes.position.needsUpdate = true;
    sMat.opacity = clamp((sn - 0.3) * 0.18 + S.boost * 0.3, 0, 0.42);
    sMat.color.copy(pal.edgeL).lerp(tmpColor.set(0xffffff), 0.55);
  };

  const updateTraffic = (dt, running) => {
    for (const c of traffic) {
      if (!c.active) continue;
      if (c.flung) {
        const f = c.flung;
        f.t -= dt;
        f.vy -= 22 * dt;
        c.x += f.vx * dt;
        c.z += S.speed * 0.45 * dt;
        c.group.position.set(c.x, Math.max(0, c.group.position.y + f.vy * dt), c.z);
        c.group.rotation.y += f.spin * dt;
        c.group.rotation.z += f.spin * 0.6 * dt;
        if (f.t <= 0) releaseCar(c);
        continue;
      }
      c.z += (S.speed - c.speed) * dt;
      if (c.z > DESPAWN_Z) {
        releaseCar(c);
        continue;
      }

      // pindah lajur (dengan lampu sein)
      if (c.lane !== c.toLane) {
        const tx = LANES[c.toLane];
        const dir = Math.sign(tx - c.x);
        c.x += dir * 2.3 * dt;
        c.group.rotation.y = -dir * 0.07;
        c.tailMat.color.copy(Math.sin(S.t * 16) > 0 ? TAIL_AMBER : TAIL_RED);
        if ((tx - c.x) * dir <= 0) {
          c.x = tx;
          c.lane = c.toLane;
          c.group.rotation.y = 0;
          c.tailMat.color.copy(TAIL_RED);
          c.changeT = rand(4, 10);
        }
      } else if (running) {
        c.changeT -= dt;
        if (c.changeT <= 0) {
          c.changeT = rand(2, 5);
          if (c.z < -70 && c.z > -250) {
            const to = c.lane + (Math.random() < 0.5 ? -1 : 1);
            let crowd = 0;
            for (const o of traffic) if (o.active && o !== c && Math.abs(o.z - c.z) < 46) crowd += 1;
            if (to >= 0 && to <= 3 && crowd <= 1) c.toLane = to;
          }
        }
      }
      c.group.position.set(c.x, 0, c.z);

      if (!running) continue;
      const dx = Math.abs(c.x - S.x);
      if (!c.passed && c.z > c.halfLen + 2.1) {
        c.passed = true;
        if (dx < 2.75) nearMiss(dx < 2.25);
      }
      if (S.invuln <= 0 && dx < 1.72 && Math.abs(c.z) < c.halfLen + 2.0) hitCar(c);
    }
  };

  const updatePickups = (dt, running) => {
    for (const p of pickups) {
      if (!p.active) continue;
      p.z += S.speed * dt;
      if (p.z > DESPAWN_Z) {
        p.active = false;
        p.group.visible = false;
        continue;
      }
      p.group.position.set(p.x, 1.0 + Math.sin(S.t * 3 + p.phase) * 0.14, p.z);
      p.mesh.rotation.y = S.t * 2.4 + p.phase;
      p.mesh.rotation.x = S.t * 1.1;
      if (running && Math.abs(p.x - S.x) < 1.55 && Math.abs(p.z) < 2.5) {
        p.active = false;
        p.group.visible = false;
        if (p.kind === 'shield') {
          S.shield = true;
          S.shieldGlow = 1;
          burst(S.x, 0.9, 0, 40, 0x66e0ff, 9, 0.6, 0.6);
          cb.onPopup?.('PERISAI AKTIF', 'info');
          audio?.tone({ freq: 440, to: 880, dur: 0.3, type: 'triangle', vol: 0.12 });
          audio?.tone({ freq: 660, to: 1320, dur: 0.3, type: 'sine', vol: 0.08, delay: 0.08 });
        } else {
          S.nitro = Math.min(1, S.nitro + 0.07);
          addScore(20);
          burst(S.x, 0.9, -0.5, 10, 0xffd15c, 6, 0.45, 0.4);
          audio?.tone({ freq: 880 + Math.min(7, S.combo) * 60, to: 1500, dur: 0.09, type: 'sine', vol: 0.09 });
        }
      }
    }
  };

  const update = (dt, realDt) => {
    S.t += dt;
    uTime.value = S.t;
    const running = S.mode === 'run';

    /* kecepatan */
    let boosting = false;
    if (running) {
      S.runT += dt;
      const base = 45 + 55 * (1 - Math.exp(-S.runT / 80));
      if (S.nitro <= 0.01) S.nitroLock = true;
      if (S.nitroLock && (S.nitro > 0.18 || !input.nitro)) S.nitroLock = false;
      boosting = input.nitro && !S.nitroLock && S.nitro > 0.01;
      if (boosting) S.nitro = Math.max(0, S.nitro - 0.26 * dt);
      else S.nitro = Math.min(1, S.nitro + 0.018 * dt);
      const target = base * (input.brake ? 0.6 : 1) + (boosting ? 30 : 0);
      S.speed += (target - S.speed) * damp(dt, input.brake ? 3.5 : 2.2);
      S.topSpeed = Math.max(S.topSpeed, S.speed);
    } else if (S.mode === 'countdown') {
      S.speed += (45 - S.speed) * damp(dt, 1.5);
    } else if (S.mode === 'attract') {
      S.speed += (30 - S.speed) * damp(dt, 1.5);
    } else {
      S.speed *= Math.exp(-dt * (S.mode === 'crash' ? 1.5 : 2.4));
    }
    S.boost += ((boosting ? 1 : 0) - S.boost) * damp(dt, 6);
    const move = S.speed * dt;
    S.dist += move;
    if (running) S.runDist += move;
    uDist.value = wrap(S.dist, 2400);
    const sn = clamp((S.speed - 25) / 80, 0, 1);

    /* kemudi */
    const steerIn = running ? (input.right ? 1 : 0) - (input.left ? 1 : 0) : 0;
    S.steer += (steerIn - S.steer) * damp(dt, 10);
    if (S.mode === 'countdown' || S.mode === 'attract') S.x += (0 - S.x) * damp(dt, 2);
    S.x += S.steer * (10.5 + sn * 3.5) * dt;
    const lim = ROAD_HALF - 1.0;
    let scraping = false;
    if (Math.abs(S.x) > lim) {
      S.x = Math.sign(S.x) * lim;
      if (running && steerIn === Math.sign(S.x)) scraping = true;
    }
    if (scraping) {
      S.speed *= Math.exp(-dt * 0.55);
      if (!S.scraping && S.combo > 0) {
        S.combo = 0;
        S.comboT = 0;
        cb.onPopup?.('KOMBO PUTUS', 'warn');
      }
      S.scrape -= dt;
      for (let i = 0; i < 3; i++) {
        emit(S.x + Math.sign(S.x) * 0.95, rand(0.2, 0.7), rand(-1.6, 1.6), -Math.sign(S.x) * rand(1, 5), rand(1, 5), rand(4, 14), rand(0.2, 0.5), 0.3, 3, 1.7, 0.5, 14, 0.2);
      }
      if (S.scrape <= 0) {
        S.scrape = 0.09;
        audio?.noise({ dur: 0.1, vol: 0.07, from: 3200, q: 2 });
      }
      S.shake = Math.max(S.shake, 0.12);
    }
    S.scraping = scraping;

    /* skor & kombo */
    if (running) {
      S.score += move * mult();
      if (S.combo > 0) {
        S.comboT -= dt / 5;
        if (S.comboT <= 0) S.combo = 0;
      }
      S.invuln = Math.max(0, S.invuln - dt);
    }

    /* zona */
    if (running) {
      const z = Math.floor(S.runDist / ZONE_LENGTH) % ZONES.length;
      if (z !== S.zone) {
        S.zone = z;
        setZone(z);
        cb.onZone?.(ZONES[z].name, Math.floor(S.runDist / ZONE_LENGTH) + 1);
        audio?.tone({ freq: 392, to: 784, dur: 0.5, type: 'triangle', vol: 0.08 });
      }
    }
    const pk = damp(dt, 0.9);
    PAL_KEYS.forEach((k) => pal[k].lerp(palTarget[k], pk));
    scene.fog.color.copy(pal.fog);
    archMat.color.copy(pal.edgeR).multiplyScalar(2.4);
    postMat.color.copy(pal.edgeL).multiplyScalar(2.4);
    playerGlowMat.color.copy(pal.edgeL);
    playerSkirtMat.color.copy(pal.edgeL).multiplyScalar(2.6);
    playerTailMat.color.copy(pal.edgeR).multiplyScalar(3.2 + S.boost * 2);

    /* lalu lintas & pickup */
    if (running) {
      const diff = clamp(S.runDist / 7000, 0, 1);
      S.spawnAcc += (S.speed - 21) * dt;
      const gap = lerp(46, 21, diff) * S.gapRand;
      if (S.spawnAcc >= gap) {
        if (trySpawn(SPAWN_Z)) {
          S.spawnAcc = 0;
          S.gapRand = rand(0.75, 1.25);
        } else {
          S.spawnAcc = gap - 5;
        }
      }
      if (S.runDist >= S.orbAt) {
        const a = Math.floor(Math.random() * 4);
        const b = clamp(a + Math.floor(rand(-1, 2)), 0, 3);
        for (let i = 0; i < 5; i++) spawnPickup('orb', lerp(LANES[a], LANES[b], i / 4), SPAWN_Z - i * 8);
        S.orbAt = S.runDist + rand(200, 360);
      }
      if (S.runDist >= S.shieldAt) {
        if (!S.shield) spawnPickup('shield', LANES[Math.floor(Math.random() * 4)], SPAWN_Z);
        S.shieldAt = S.runDist + rand(1300, 2100);
      }
    }
    updateTraffic(dt, running);
    updatePickups(dt, running);
    updateDecor();

    /* mobil pemain */
    if (S.mode === 'crash' || S.mode === 'over') {
      S.crashT += realDt;
      S.lift -= 20 * dt;
      player.position.y = Math.max(0, player.position.y + S.lift * dt);
      if (player.position.y <= 0) S.spin *= Math.exp(-dt * 2.4);
      player.rotation.y += S.spin * dt;
      player.rotation.z = Math.sin(S.crashT * 9) * 0.25 * Math.exp(-S.crashT * 1.2);
      if (Math.random() < 0.7) {
        emit(S.x + rand(-0.6, 0.6), 0.9, rand(-1, 1), rand(-0.5, 0.5), rand(1.5, 3.5), 0, rand(0.6, 1.3), rand(1.2, 2.2), 0.5, 0.3, 0.25, -1, 0.2);
      }
      if (S.mode === 'crash' && S.crashT > 1.5) {
        S.mode = 'over';
        cb.onState?.('over', { score: Math.floor(S.score), dist: S.runDist, topSpeed: S.topSpeed * 3.6, near: S.near });
      }
    } else {
      player.position.y = 0;
      player.rotation.y = -S.steer * 0.17;
      player.rotation.z = -S.steer * 0.07;
      player.rotation.x = S.boost * 0.035 - (input.brake && running ? 0.03 : 0);
      if (S.boost > 0.2) {
        for (const sx of [-0.5, 0.5]) {
          emit(S.x + sx, 0.42, 2.35, rand(-0.3, 0.3), rand(0, 0.3), rand(5, 9), rand(0.1, 0.22), rand(0.2, 0.36), pal.edgeL.r * 1.7, pal.edgeL.g * 1.7, pal.edgeL.b * 1.7, 0, 0.08);
          emit(S.x + sx, 0.42, 2.3, 0, 0, rand(3, 5), 0.08, 0.2, 2.2, 2, 1.6, 0, 0.08);
        }
      }
    }
    player.position.x = S.x;
    const blink = S.invuln > 0 ? Math.sin(S.t * 40) > 0 : true;
    player.visible = blink;

    S.shieldGlow += ((S.shield ? 1 : 0) - S.shieldGlow) * damp(dt, 6);
    shieldMesh.visible = S.shieldGlow > 0.02;
    shieldMat.uniforms.uAlpha.value = S.shieldGlow * (0.75 + 0.25 * Math.sin(S.t * 5));

    updateParticles(dt);
    updateStreaks(dt, sn);

    /* kamera */
    let fovGoal;
    if (S.mode === 'attract' || S.mode === 'over') {
      const a = Math.sin(S.t * 0.22) * 1.35 + (S.mode === 'over' ? 0.4 : 0);
      const r = portrait ? 11 : 8.2;
      tmpV.set(S.x + Math.sin(a) * r, 2.3 + Math.sin(S.t * 0.31) * 0.5, Math.cos(a) * r);
      camPos.lerp(tmpV, damp(realDt, 1.6));
      camLook.lerp(tmpV.set(S.x, 0.75, -0.4), damp(realDt, 3));
      fovGoal = portrait ? 62 : 48;
    } else {
      tmpV.set(S.x * 0.62, portrait ? 4.6 : 3.05, (portrait ? 10.6 : 8.1) - S.boost * 0.9);
      camPos.lerp(tmpV, damp(realDt, S.mode === 'countdown' ? 2.2 : 6));
      camLook.lerp(tmpV.set(S.x * 0.86, 1.0, -15), damp(realDt, 6));
      fovGoal = (portrait ? 76 : 62) + sn * 10 + S.boost * 9;
    }
    S.shake = Math.max(0, S.shake - realDt * 1.6);
    const sh = S.shake + S.boost * 0.035 + sn * 0.012;
    camera.position.set(camPos.x + (Math.random() - 0.5) * sh, camPos.y + (Math.random() - 0.5) * sh, camPos.z);
    camera.lookAt(camLook);
    camera.rotation.z += -S.steer * 0.018;
    if (Math.abs(camera.fov - fovGoal) > 0.01) {
      camera.fov += (fovGoal - camera.fov) * damp(realDt, 4);
      camera.updateProjectionMatrix();
    }
    // Di menu, mobil digeser ke kanan supaya tidak tertutup panel.
    const shiftGoal = S.mode === 'attract' && !portrait ? 0.18 : 0;
    S.viewShift += (shiftGoal - S.viewShift) * damp(realDt, 3);
    if (S.viewShift > 0.002) camera.setViewOffset(width, height, -width * S.viewShift, 0, width, height);
    else if (camera.view && camera.view.enabled) camera.clearViewOffset();
    sky.position.copy(camera.position);

    /* hitung mundur */
    if (S.mode === 'countdown') {
      S.countT += realDt;
      const step = Math.floor(S.countT / 0.7);
      if (step !== S.countStep) {
        S.countStep = step;
        if (step < 3) {
          cb.onPopup?.(String(3 - step), 'count');
          audio?.tone({ freq: 440, dur: 0.14, type: 'square', vol: 0.09 });
        } else {
          cb.onPopup?.('GO!', 'count');
          audio?.tone({ freq: 880, dur: 0.4, type: 'square', vol: 0.11 });
          S.mode = 'run';
          for (let z = -110; z > SPAWN_Z; z -= rand(30, 46)) trySpawn(z);
          cb.onState?.('run');
        }
      }
    }

    audio?.setEngine(clamp(S.speed / 100, 0, 1), S.boost);

    hud.score = Math.floor(S.score);
    hud.speed = Math.round(S.speed * 3.6);
    hud.nitro = S.nitro;
    hud.boosting = boosting;
    hud.mult = mult();
    hud.comboT = S.combo > 0 ? S.comboT : 0;
    hud.shield = S.shield;
    hud.dist = S.runDist;
    cb.onHud?.(hud);
  };

  /* ---- render & kualitas adaptif ---- */
  let quality = coarse ? 1 : 2;
  let composer = null;
  let bloom = null;
  let width = 1;
  let height = 1;

  const buildComposer = () => {
    if (composer) {
      composer.renderTarget1.dispose();
      composer.renderTarget2.dispose();
      bloom?.dispose();
      composer = null;
      bloom = null;
    }
    if (quality === 0) return;
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    const rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: quality === 2 ? 4 : 0 });
    composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.5, 0.7, 0.9);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  };

  const pixelRatio = () => Math.min(window.devicePixelRatio || 1, quality === 2 ? 2 : quality === 1 ? 1.5 : 1.25);

  const resize = () => {
    width = Math.max(1, canvas.clientWidth);
    height = Math.max(1, canvas.clientHeight);
    portrait = height > width * 1.05;
    renderer.setPixelRatio(pixelRatio());
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    pMat.uniforms.uScale.value = height * renderer.getPixelRatio() * 0.9;
    buildComposer();
    render();
  };

  function render() {
    if (composer) composer.render();
    else renderer.render(scene, camera);
  }

  let raf = 0;
  let last = 0;
  let perfAcc = 0;
  let perfN = 0;
  let destroyed = false;

  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const raw = last ? (now - last) / 1000 : 1 / 60;
    last = now;
    if (S.paused) return;
    if (raw < 0.2) {
      perfAcc += raw;
      perfN += 1;
      if (perfN >= 150) {
        const avg = perfAcc / perfN;
        perfAcc = 0;
        perfN = 0;
        if (avg > 1 / 43 && quality > 0) {
          quality -= 1;
          resize();
        }
      }
    }
    const realDt = Math.min(0.05, raw);
    update(realDt * (S.mode === 'crash' ? 0.35 : 1), realDt);
    render();
  };

  const ro = new ResizeObserver(() => {
    if (!destroyed) resize();
  });
  ro.observe(canvas);
  updateDecor();
  resize();
  raf = requestAnimationFrame(frame);

  /* ---- API ---- */
  const startRun = () => {
    clearWorld();
    Object.assign(S, {
      mode: 'countdown',
      paused: false,
      runT: 0,
      runDist: 0,
      speed: Math.min(S.speed, 30),
      x: 0,
      steer: 0,
      nitro: 0.5,
      nitroLock: false,
      boost: 0,
      score: 0,
      combo: 0,
      comboT: 0,
      shield: false,
      invuln: 0,
      near: 0,
      topSpeed: 0,
      spawnAcc: 0,
      gapRand: 1,
      zone: 0,
      crashT: 0,
      countT: 0,
      countStep: -1,
      shake: 0,
      spin: 0,
      lift: 0,
    });
    S.orbAt = 120;
    S.shieldAt = rand(700, 1100);
    setZone(0);
    player.rotation.set(0, 0, 0);
    player.position.set(0, 0, 0);
    input.left = input.right = input.nitro = input.brake = false;
    audio?.startEngine();
    audio?.startMusic('drive');
    cb.onState?.('countdown');
  };

  const toMenu = () => {
    clearWorld();
    S.mode = 'attract';
    S.paused = false;
    S.shield = false;
    S.invuln = 0;
    S.boost = 0;
    S.steer = 0;
    S.x = 0;
    S.spin = 0;
    player.rotation.set(0, 0, 0);
    player.position.set(0, 0, 0);
    setZone(0);
    audio?.stopEngine();
    audio?.stopMusic();
    cb.onState?.('menu');
  };

  return {
    startRun,
    toMenu,
    press: (key, down) => {
      if (key in input) input[key] = down;
    },
    setPaused: (p) => {
      S.paused = p;
      last = 0;
    },
    get mode() {
      return S.mode;
    },
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (composer) {
        composer.renderTarget1.dispose();
        composer.renderTarget2.dispose();
        bloom?.dispose();
      }
      envRT.dispose();
      disposables.forEach((d) => d.dispose?.());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
