// Neon Drift — mesin game balap 3D tanpa akhir (three.js).
// Dunia bergerak ke arah +Z; mobil pemain diam di z = 0 dan hanya bergeser di sumbu X.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { buildCar, mergeWheels, PLAYER_CARS, PAINTS } from './cars';

const LANES = [-4.8, -1.6, 1.6, 4.8];
const LANE_SPEED = [22.5, 21.5, 20.5, 19.5];
const ROAD_HALF = 6.4;
const BARRIER_X = 8.1;
const LAMP_GAP = 44;
const SPAWN_Z = -300;
const DESPAWN_Z = 26;
const FOG_NEAR = 60;
const FOG_FAR = 340;
const ZONE_LENGTH = 1800;
const DIST_WRAP = 26400; // kelipatan semua pola jalan (marka 12 m, lampu 44 m, sambungan 6 m)

export const ZONES = [
  { name: 'Sunset Boulevard', top: 0x0a0f2e, mid: 0x4b2a5c, horizon: 0xff8648, sun: 0xffc27a, fog: 0x2b1b30, lamp: 0xffd3a1, accentL: 0x22e6ff, accentR: 0xff3fa4, ambient: 0x74608f, key: 0xffa066, cloud: 0xff9470, sunPow: 1, stars: 0.12 },
  { name: 'Blue Hour', top: 0x02040f, mid: 0x0c1a44, horizon: 0x3b6cd0, sun: 0x9fc4ff, fog: 0x0a1230, lamp: 0xffd8a0, accentL: 0x4dffd2, accentR: 0x3aa0ff, ambient: 0x3f5ba8, key: 0x8fb4ff, cloud: 0x5778c8, sunPow: 0.35, stars: 0.7 },
  { name: 'Midnight District', top: 0x010107, mid: 0x090617, horizon: 0x6c2580, sun: 0xff7ad9, fog: 0x0a0616, lamp: 0xfff0d8, accentL: 0xff5cf0, accentR: 0x7a6bff, ambient: 0x483a78, key: 0xa98cff, cloud: 0x35205a, sunPow: 0.12, stars: 1 },
  { name: 'First Light', top: 0x090c28, mid: 0x3c2a5a, horizon: 0xffb469, sun: 0xfff0c2, fog: 0x2a2236, lamp: 0xffdcb0, accentL: 0xffd15c, accentR: 0xff6b6b, ambient: 0x7c6c8e, key: 0xffd0a0, cloud: 0xffac8c, sunPow: 0.9, stars: 0.28 },
];
const COLOR_KEYS = ['top', 'mid', 'horizon', 'sun', 'fog', 'lamp', 'accentL', 'accentR', 'ambient', 'key', 'cloud'];
const NUM_KEYS = ['sunPow', 'stars'];

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (dt, k) => 1 - Math.exp(-dt * k);
const wrap = (v, span) => ((v % span) + span) % span;

/* ------------------------------------------------------------------ shader */

const NOISE_GLSL = /* glsl */ `
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float a = 0.5;
    float s = 0.0;
    for (int i = 0; i < 4; i++) {
      s += a * vnoise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return s;
  }
`;
const FOG_GLSL = /* glsl */ `
  uniform vec3 uFog;
  float fogAmount(vec3 p) {
    return smoothstep(${FOG_NEAR.toFixed(1)}, ${FOG_FAR.toFixed(1)}, length(p.xz - cameraPosition.xz));
  }
`;
// Cahaya lampu jalan: kolam cahaya berkala di kiri (s ≡ 0) dan kanan (s ≡ setengah jarak).
const LAMP_GLSL = /* glsl */ `
  uniform vec3 uLamp;
  uniform vec3 uAmbient;
  uniform float uDist;
  const float LAMP_GAP = ${LAMP_GAP.toFixed(1)};
  const float LAMP_X = 5.6;
  vec2 lampDist(float s) {
    float a = mod(s, LAMP_GAP);
    a = min(a, LAMP_GAP - a);
    float b = mod(s + LAMP_GAP * 0.5, LAMP_GAP);
    b = min(b, LAMP_GAP - b);
    return vec2(a, b);
  }
  float lampPool(float x, float s, float r) {
    vec2 d = lampDist(s);
    vec2 dl = vec2(x + LAMP_X, d.x);
    vec2 dr = vec2(x - LAMP_X, d.y);
    return exp(-dot(dl, dl) / (r * r)) + exp(-dot(dr, dr) / (r * r));
  }
`;
const OUT_GLSL = /* glsl */ `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`;
const WORLD_VERT = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vLocal;
  void main() {
    vLocal = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const SKY_FRAG = /* glsl */ `
  uniform vec3 uTop, uMid, uHorizon, uSun, uFog, uCloud;
  uniform float uTime, uSunPow, uStars;
  varying vec3 vDir;
  ${NOISE_GLSL}
  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.2, h));
    col = mix(col, uTop, smoothstep(0.12, 0.7, h));
    vec3 sunDir = normalize(vec3(0.04, 0.04, -1.0));
    float sd = max(dot(d, sunDir), 0.0);
    col += uSun * (pow(sd, 420.0) * 3.0 + pow(sd, 30.0) * 0.5 + pow(sd, 5.0) * 0.2) * uSunPow;
    float cloud = 0.0;
    if (h > 0.0) {
      vec2 cuv = d.xz / (h + 0.14) * 0.5;
      cuv.x += uTime * 0.003;
      cloud = smoothstep(0.48, 0.8, fbm(cuv * 1.4)) * smoothstep(0.0, 0.1, h) * (1.0 - smoothstep(0.3, 0.75, h));
      vec3 cc = mix(uMid * 0.55, uCloud, pow(sd, 3.0) * 0.7 + 0.22);
      col = mix(col, cc, cloud * 0.7);
      vec2 uv = vec2(atan(d.x, -d.z) * 40.0, h * 74.0);
      vec2 c = floor(uv);
      vec2 f = fract(uv) - 0.5;
      float r = hash21(c);
      vec2 o = vec2(hash21(c + 3.1), hash21(c + 7.7)) - 0.5;
      float s = step(0.94, r) * smoothstep(0.09, 0.0, length(f - o * 0.7));
      s *= 0.55 + 0.45 * sin(uTime * 2.0 + r * 60.0);
      col += vec3(s) * smoothstep(0.06, 0.4, h) * uStars * (1.0 - cloud) * 1.2;
    }
    // siluet perbukitan jauh
    float ridge = 0.022 + 0.034 * fbm(vec2(atan(d.x, -d.z) * 5.0, 1.7));
    col = mix(col, uFog * 0.6, (1.0 - smoothstep(ridge - 0.003, ridge, h)) * 0.92);
    col = mix(uFog, col, smoothstep(-0.03, 0.0, h));
    gl_FragColor = vec4(col, 1.0);
    ${OUT_GLSL}
  }
`;

const ROAD_FRAG = /* glsl */ `
  uniform vec3 uHorizon, uAccentL, uAccentR;
  varying vec3 vPos;
  ${NOISE_GLSL}
  ${FOG_GLSL}
  ${LAMP_GLSL}
  float aaLine(float d, float w) {
    float aa = fwidth(d) * 1.2;
    return 1.0 - smoothstep(w, w + aa, abs(d));
  }
  void main() {
    float x = vPos.x;
    float s = uDist - vPos.z;
    vec2 xs = vec2(x, s);
    float dist = length(vPos.xz - cameraPosition.xz);
    float near = 1.0 - smoothstep(30.0, 120.0, dist);
    float grain = mix(0.5, vnoise(xs * 9.0), near);
    float patchy = vnoise(xs * vec2(0.7, 0.22));
    vec3 alb = vec3(0.05, 0.051, 0.057) * (0.7 + 0.55 * grain) * (0.78 + 0.4 * patchy);
    // jejak ban: lebih gelap dan lebih licin
    float lanePos = mod(x + 6.4, 3.2) - 1.6;
    float tr = abs(lanePos) - 0.8;
    float track = exp(-tr * tr / 0.09) * step(abs(x), 6.4);
    alb *= 1.0 - 0.24 * track;
    // marka jalan dengan bagian yang aus
    float ph = fract(s / 12.0);
    float dash = smoothstep(0.0, 0.02, ph) * (1.0 - smoothstep(0.38, 0.4, ph));
    float lanes = max(max(aaLine(x + 3.2, 0.075), aaLine(x, 0.075)), aaLine(x - 3.2, 0.075)) * dash;
    lanes *= 1.0 - smoothstep(170.0, 300.0, dist);
    float edges = aaLine(abs(x) - 6.4, 0.09);
    float wear = 0.5 + 0.5 * vnoise(xs * vec2(15.0, 1.6));
    alb = mix(alb, vec3(0.52, 0.52, 0.49), max(lanes, edges) * wear);
    alb *= mix(1.0, 0.72, smoothstep(6.6, 6.9, abs(x)));

    float pool = lampPool(x, s, 8.5);
    vec3 col = alb * (uAmbient * 0.6 + uLamp * pool * 2.3);

    // pantulan aspal basah: makin kuat pada sudut pandang landai
    vec3 V = normalize(cameraPosition - vPos);
    float fres = pow(1.0 - clamp(V.y, 0.0, 1.0), 5.0);
    float gloss = clamp(0.5 + 0.5 * patchy - 0.25 * grain + 0.35 * track, 0.0, 1.2);
    col += uHorizon * fres * 0.24 * gloss;
    vec2 ld = lampDist(s);
    float streak = exp(-pow(x + LAMP_X, 2.0) / 3.0) * exp(-ld.x * ld.x / 480.0) + exp(-pow(x - LAMP_X, 2.0) / 3.0) * exp(-ld.y * ld.y / 480.0);
    col += uLamp * streak * (0.03 + fres * 0.6) * gloss;
    col += mix(uAccentL, uAccentR, step(0.0, x)) * exp(-abs(abs(x) - ${BARRIER_X.toFixed(1)}) * 1.3) * 0.07;

    col = mix(col, uFog, fogAmount(vPos));
    gl_FragColor = vec4(col, 1.0);
    ${OUT_GLSL}
  }
`;

const GROUND_FRAG = /* glsl */ `
  varying vec3 vPos;
  ${NOISE_GLSL}
  ${FOG_GLSL}
  ${LAMP_GLSL}
  void main() {
    float s = uDist - vPos.z;
    float n = fbm(vec2(vPos.x, s) * 0.12);
    vec3 alb = mix(vec3(0.018, 0.022, 0.02), vec3(0.04, 0.045, 0.036), n);
    vec3 col = alb * (uAmbient * 0.6 + uLamp * lampPool(vPos.x * 0.55, s, 9.0) * 1.2);
    col = mix(col, uFog, fogAmount(vPos));
    gl_FragColor = vec4(col, 1.0);
    ${OUT_GLSL}
  }
`;

// Pembatas beton dengan garis LED di sisi dalam bagian atas.
const BARRIER_FRAG = /* glsl */ `
  uniform vec3 uAccent;
  varying vec3 vPos;
  varying vec3 vLocal;
  ${NOISE_GLSL}
  ${FOG_GLSL}
  ${LAMP_GLSL}
  void main() {
    float s = uDist - vPos.z;
    float j = fract(s / 6.0);
    float joint = smoothstep(0.0, 0.012, j) * (1.0 - smoothstep(0.988, 1.0, j));
    vec3 alb = vec3(0.3, 0.3, 0.31) * (0.72 + 0.28 * vnoise(vec2(s * 3.0, vPos.y * 14.0)));
    alb *= mix(0.5, 1.0, joint) * (0.55 + 0.45 * smoothstep(0.0, 0.5, vPos.y));
    vec3 col = alb * (uAmbient * 0.6 + uLamp * lampPool(vPos.x, s, 9.5) * 2.4);
    float inner = 1.0 - step(0.2, vLocal.x);
    float strip = smoothstep(0.7, 0.72, vPos.y) * (1.0 - smoothstep(0.78, 0.8, vPos.y)) * inner;
    col += uAccent * strip * 2.0;
    col += uAccent * inner * smoothstep(0.2, 0.7, vPos.y) * (1.0 - smoothstep(0.7, 0.72, vPos.y)) * 0.05;
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
  uniform vec3 uAccentL, uAccentR, uAmbient, uHorizon;
  varying vec3 vPos;
  varying vec2 vWall;
  varying vec3 vN;
  varying float vSeed;
  varying float vH;
  ${NOISE_GLSL}
  ${FOG_GLSL}
  void main() {
    vec3 col = vec3(0.02, 0.021, 0.028) * (0.6 + uAmbient);
    if (abs(vN.y) < 0.5) {
      vec2 q = vWall / vec2(1.7, 3.1);
      vec2 cell = floor(q);
      vec2 f = fract(q);
      float density = 0.55 + 0.3 * fract(vSeed * 5.7);
      float lit = step(density, hash21(cell + vSeed * 17.0));
      float win = step(0.26, f.x) * step(f.x, 0.74) * step(0.2, f.y) * step(f.y, 0.66);
      float warm = hash21(cell.yx + vSeed);
      vec3 wc = mix(vec3(1.0, 0.72, 0.4), vec3(0.75, 0.88, 1.0), step(0.62, warm));
      float wb = hash21(cell * 1.7 + vSeed);
      col += wc * lit * win * (0.05 + 0.42 * wb * wb);
      // kaca gelap memantulkan cakrawala
      col += uHorizon * win * (1.0 - lit) * 0.03 * smoothstep(0.0, vH, vWall.y);
      col += vec3(0.012) * step(0.94, f.y);
      // papan neon di sebagian gedung
      float sign = step(0.6, fract(vSeed * 3.1)) * smoothstep(vH - 0.55, vH - 0.3, vWall.y);
      col += mix(uAccentL, uAccentR, step(0.5, fract(vSeed * 7.3))) * sign * 1.5;
      // lampu peringatan merah di puncak gedung tinggi
      col += vec3(2.4, 0.1, 0.1) * step(46.0, vH) * smoothstep(vH - 1.2, vH - 0.9, vWall.y) * step(abs(fract(vWall.x / 6.0) - 0.5), 0.06);
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

// Sentuhan akhir sinematik: vinyet, butiran halus, sedikit aberasi warna saat nitro.
const FINAL_SHADER = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uBoost: { value: 0 } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uBoost;
    varying vec2 vUv;
    void main() {
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      float ca = (0.001 + uBoost * 0.0028) * r2 * 4.0;
      vec3 col;
      col.r = texture2D(tDiffuse, vUv + c * ca).r;
      col.g = texture2D(tDiffuse, vUv).g;
      col.b = texture2D(tDiffuse, vUv - c * ca).b;
      col *= 1.0 - r2 * 0.85;
      float g = fract(sin(dot(vUv * vec2(1920.0, 1080.0) + uTime * 61.0, vec2(12.9898, 78.233))) * 43758.5453);
      col += (g - 0.5) * 0.022;
      col = mix(col, col * col * (3.0 - 2.0 * col), 0.22);
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

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

function signTexture(lines, arrow) {
  return canvasTexture(512, 224, (g, w, h) => {
    g.fillStyle = '#0a5b3a';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = '#e8f3ec';
    g.lineWidth = 8;
    g.strokeRect(10, 10, w - 20, h - 20);
    g.fillStyle = '#f2f7f3';
    g.textBaseline = 'middle';
    g.font = '700 54px Arial, Helvetica, sans-serif';
    g.fillText(lines[0], 36, 78);
    g.font = '600 38px Arial, Helvetica, sans-serif';
    g.fillText(lines[1], 36, 150);
    g.font = '700 96px Arial, Helvetica, sans-serif';
    g.textAlign = 'right';
    g.fillText(arrow, w - 34, h / 2 + 4);
  });
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
  renderer.toneMappingExposure = 1.18;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.25, 1800);
  const disposables = [];
  const track = (o) => {
    disposables.push(o);
    return o;
  };

  // Palet yang berpindah halus antar zona; uniform memakai objek Color yang sama.
  const pal = {};
  const palTarget = {};
  COLOR_KEYS.forEach((k) => {
    pal[k] = new THREE.Color(ZONES[0][k]);
    palTarget[k] = new THREE.Color(ZONES[0][k]);
  });
  const palNum = {};
  const palNumTarget = {};
  NUM_KEYS.forEach((k) => {
    palNum[k] = { value: ZONES[0][k] };
    palNumTarget[k] = ZONES[0][k];
  });
  let envDue = [];
  const setZone = (i, instant) => {
    COLOR_KEYS.forEach((k) => {
      palTarget[k].set(ZONES[i][k]);
      if (instant) pal[k].copy(palTarget[k]);
    });
    NUM_KEYS.forEach((k) => {
      palNumTarget[k] = ZONES[i][k];
      if (instant) palNum[k].value = ZONES[i][k];
    });
    // pantulan di cat mobil mengikuti langit yang sedang berubah
    envDue = instant ? [] : [1.2, 3.4];
  };

  scene.fog = new THREE.Fog(pal.fog.getHex(), FOG_NEAR, FOG_FAR);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x08080c, 0.85);
  scene.add(hemi);
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(1.5, 3, -14);
  scene.add(keyLight);
  const fill = new THREE.DirectionalLight(0x8fb4ff, 0.55);
  fill.position.set(-3, 8, 10);
  scene.add(fill);
  // dua lampu titik yang mengikuti lampu jalan terdekat: kilau menyapu bodi mobil
  const lampLights = [new THREE.PointLight(0xffffff, 46, 30, 1.6), new THREE.PointLight(0xffffff, 46, 30, 1.6)];
  lampLights.forEach((l) => scene.add(l));

  /* ---- langit, jalan, tanah ---- */
  const uTime = { value: 0 };
  const uDist = { value: 0 };
  const uFog = { value: pal.fog };
  const uLamp = { value: pal.lamp };
  const uAmbient = { value: pal.ambient };

  const skyGeo = track(new THREE.SphereGeometry(900, 40, 20));
  const skyMat = track(
    new THREE.ShaderMaterial({
      uniforms: {
        uTop: { value: pal.top },
        uMid: { value: pal.mid },
        uHorizon: { value: pal.horizon },
        uSun: { value: pal.sun },
        uCloud: { value: pal.cloud },
        uFog,
        uTime,
        uSunPow: palNum.sunPow,
        uStars: palNum.stars,
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
  );
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.renderOrder = -10;
  sky.frustumCulled = false;
  scene.add(sky);

  // Peta lingkungan untuk pantulan: langit yang sama + deretan lampu jalan.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.add(new THREE.Mesh(skyGeo, skyMat));
  const envLampMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  const envLampGeo = track(new THREE.BoxGeometry(1.6, 0.3, 1.2));
  for (let i = 0; i < 7; i++) {
    for (const side of [-1, 1]) {
      const m = new THREE.Mesh(envLampGeo, envLampMat);
      m.position.set(side * 6, 9, -66 + i * 22 + (side > 0 ? 11 : 0));
      envScene.add(m);
    }
  }
  const envFloor = new THREE.Mesh(track(new THREE.PlaneGeometry(600, 600)), track(new THREE.MeshBasicMaterial({ color: 0x050507 })));
  envFloor.rotation.x = -Math.PI / 2;
  envFloor.position.y = -0.2;
  envScene.add(envFloor);
  let envRT = null;
  const refreshEnv = () => {
    envLampMat.color.copy(palTarget.lamp).multiplyScalar(3);
    const next = pmrem.fromScene(envScene, 0.015, 0.5, 1200, { size: 128 });
    scene.environment = next.texture;
    envRT?.dispose();
    envRT = next;
  };
  scene.environmentIntensity = 1.0;

  const flat = (w, l) => {
    const g = track(new THREE.PlaneGeometry(w, l));
    g.rotateX(-Math.PI / 2);
    return g;
  };

  const ground = new THREE.Mesh(
    flat(1100, 900),
    track(new THREE.ShaderMaterial({ uniforms: { uDist, uFog, uLamp, uAmbient }, vertexShader: WORLD_VERT, fragmentShader: GROUND_FRAG, depthWrite: false })),
  );
  ground.position.set(0, -0.06, -100);
  ground.renderOrder = -5;
  ground.frustumCulled = false;
  scene.add(ground);

  const road = new THREE.Mesh(
    flat(BARRIER_X * 2 + 0.2, 900),
    track(
      new THREE.ShaderMaterial({
        uniforms: { uDist, uFog, uLamp, uAmbient, uHorizon: { value: pal.horizon }, uAccentL: { value: pal.accentL }, uAccentR: { value: pal.accentR } },
        vertexShader: WORLD_VERT,
        fragmentShader: ROAD_FRAG,
      }),
    ),
  );
  road.position.set(0, 0, -100);
  road.renderOrder = -4;
  road.frustumCulled = false;
  scene.add(road);

  /* ---- pembatas beton ---- */
  const barrierShape = new THREE.Shape();
  [[0, 0], [0, 0.1], [0.13, 0.32], [0.17, 0.8], [0.34, 0.8], [0.38, 0.32], [0.52, 0.1], [0.52, 0]].forEach(([x, y], i) => (i ? barrierShape.lineTo(x, y) : barrierShape.moveTo(x, y)));
  const barrierGeo = track(new THREE.ExtrudeGeometry(barrierShape, { depth: 900, bevelEnabled: false }));
  for (const side of [-1, 1]) {
    const m = new THREE.Mesh(
      barrierGeo,
      track(
        new THREE.ShaderMaterial({
          uniforms: { uDist, uFog, uLamp, uAmbient, uAccent: { value: side < 0 ? pal.accentL : pal.accentR } },
          vertexShader: WORLD_VERT,
          fragmentShader: BARRIER_FRAG,
          side: THREE.DoubleSide,
        }),
      ),
    );
    m.scale.x = side;
    m.position.set(side * BARRIER_X, 0, -550);
    m.frustumCulled = false;
    scene.add(m);
  }

  /* ---- gedung ---- */
  const B_COUNT = 96;
  const B_SPAN = 700;
  const bGeo = track(new THREE.BoxGeometry(1, 1, 1));
  bGeo.translate(0, 0.5, 0);
  const bSeed = new Float32Array(B_COUNT);
  const bData = [];
  for (let i = 0; i < B_COUNT; i++) {
    const side = i % 2 ? 1 : -1;
    bSeed[i] = Math.random();
    bData.push({
      x: side * rand(34, 120),
      base: (i / B_COUNT) * B_SPAN + rand(-3, 3),
      w: rand(10, 20),
      h: rand(12, 32) + (Math.random() < 0.3 ? rand(22, 60) : 0),
      d: rand(10, 20),
    });
  }
  bGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(bSeed, 1));
  const buildings = new THREE.InstancedMesh(
    bGeo,
    track(
      new THREE.ShaderMaterial({
        uniforms: { uAccentL: { value: pal.accentL }, uAccentR: { value: pal.accentR }, uAmbient, uHorizon: { value: pal.horizon }, uFog },
        vertexShader: BUILDING_VERT,
        fragmentShader: BUILDING_FRAG,
      }),
    ),
    B_COUNT,
  );
  buildings.frustumCulled = false;
  scene.add(buildings);

  /* ---- lampu jalan ---- */
  const LAMPS = 12; // per sisi
  const LAMP_SPAN = LAMPS * LAMP_GAP;
  const metal = track(new THREE.MeshStandardMaterial({ color: 0x1a1b20, metalness: 0.7, roughness: 0.5 }));
  const poleParts = [new THREE.BoxGeometry(0.2, 9.3, 0.2), new THREE.BoxGeometry(3.2, 0.13, 0.15), new THREE.BoxGeometry(0.42, 0.42, 0.42)];
  poleParts[0].translate(9.1, 4.65, 0);
  poleParts[1].translate(7.55, 9.25, 0);
  poleParts[2].translate(9.1, 0.21, 0);
  const poles = new THREE.InstancedMesh(track(mergeGeometries(poleParts)), metal, LAMPS * 2);
  poles.frustumCulled = false;
  scene.add(poles);
  const lampHeadMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  const lampHeadGeo = track(new THREE.BoxGeometry(0.95, 0.08, 0.36));
  lampHeadGeo.translate(6.05, 9.16, 0);
  const lampHeads = new THREE.InstancedMesh(lampHeadGeo, lampHeadMat, LAMPS * 2);
  lampHeads.frustumCulled = false;
  scene.add(lampHeads);

  /* ---- gerbang penunjuk arah ---- */
  const gantry = new THREE.Group();
  {
    const parts = [new THREE.BoxGeometry(0.34, 8, 0.34), new THREE.BoxGeometry(0.34, 8, 0.34), new THREE.BoxGeometry(19.4, 0.5, 0.45)];
    parts[0].translate(-9.5, 4, 0);
    parts[1].translate(9.5, 4, 0);
    parts[2].translate(0, 7.8, 0);
    gantry.add(new THREE.Mesh(track(mergeGeometries(parts)), metal));
    const signGeo = track(new THREE.PlaneGeometry(5.6, 2.45));
    [
      [-3.3, ['PUSAT KOTA', 'Lajur kiri · 2 km'], '↑'],
      [3.3, ['BANDARA', 'Keluar 12 · 800 m'], '↗'],
    ].forEach(([x, lines, arrow]) => {
      const m = new THREE.Mesh(signGeo, track(new THREE.MeshBasicMaterial({ map: track(signTexture(lines, arrow)), color: 0x9aa0a6 })));
      m.position.set(x, 7.9, 0.26);
      gantry.add(m);
    });
  }
  scene.add(gantry);

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
  const shadowTex = track(
    canvasTexture(64, 64, (g, w, h) => {
      const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      gr.addColorStop(0, 'rgba(0,0,0,0.95)');
      gr.addColorStop(0.6, 'rgba(0,0,0,0.78)');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
    }),
  );
  const trafficGlowTex = track(
    canvasTexture(64, 192, (g, w, h) => {
      const blob = (cy, r, color) => {
        const gr = g.createRadialGradient(w / 2, cy, 0, w / 2, cy, r);
        gr.addColorStop(0, color);
        gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr;
        g.fillRect(0, 0, w, h);
      };
      blob(26, 34, 'rgba(255,240,214,0.85)');
      blob(h - 26, 34, 'rgba(255,24,50,0.9)');
    }),
  );
  const beamTex = track(
    canvasTexture(64, 256, (g, w, h) => {
      const img = g.createImageData(w, h);
      for (let y = 0; y < h; y++) {
        const v = 1 - y / (h - 1); // 0 di dekat mobil, 1 di ujung jauh
        const along = Math.min(1, v / 0.1) * (1 - v) ** 1.6;
        for (let x = 0; x < w; x++) {
          const across = Math.sin((Math.PI * x) / (w - 1)) ** 1.8;
          const k = (y * w + x) * 4;
          img.data[k] = 255;
          img.data[k + 1] = 255;
          img.data[k + 2] = 255;
          img.data[k + 3] = Math.round(255 * along * across);
        }
      }
      g.putImageData(img, 0, 0);
    }),
  );
  const additive = (opts) => track(new THREE.MeshBasicMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, ...opts }));
  const shadowMat = track(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.9, fog: false }));

  /* ---- mobil ---- */
  const glassMat = track(new THREE.MeshPhysicalMaterial({ color: 0x06070a, metalness: 0.9, roughness: 0.12, clearcoat: 0.6, clearcoatRoughness: 0.1, specularIntensity: 0.55, envMapIntensity: 1.5 }));
  const detailMat = track(new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.55, roughness: 0.5, side: THREE.DoubleSide }));
  const headMat = track(new THREE.MeshBasicMaterial({ color: new THREE.Color(4.2, 4.0, 3.4) }));
  const playerPaint = track(new THREE.MeshPhysicalMaterial({ color: PAINTS[0].color, metalness: PAINTS[0].metal, roughness: PAINTS[0].rough, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.25 }));
  const playerTailMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  const playerGlowMat = additive({ map: radialTex, opacity: 0.28 });
  const beamMat = additive({ map: beamTex, opacity: 0.34, color: 0xfff1dc });
  const tailSpillMat = additive({ map: radialTex, opacity: 0.3, color: 0xff1a2e });
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
  const shieldBubbleGeo = track(new THREE.SphereGeometry(1, 28, 18));
  const shadowGeo = flat(1, 1);
  const beamGeo = flat(7, 34);
  const glowGeo = flat(4.6, 7.6);
  const spillGeo = flat(3.4, 4.4);

  const player = new THREE.Group();
  scene.add(player);
  const playerCars = PLAYER_CARS.map((info) => {
    const car = buildCar(info.id);
    ['paint', 'glass', 'detail', 'heads', 'tails'].forEach((k) => track(car[k]));
    car.wheels.forEach((w) => track(w.geo));
    const group = new THREE.Group();
    group.add(new THREE.Mesh(car.paint, playerPaint));
    group.add(new THREE.Mesh(car.glass, glassMat));
    group.add(new THREE.Mesh(car.detail, detailMat));
    group.add(new THREE.Mesh(car.heads, headMat));
    group.add(new THREE.Mesh(car.tails, playerTailMat));
    const wheels = car.wheels.map((w) => {
      const holder = new THREE.Group();
      holder.position.set(w.x, w.y, w.z);
      holder.rotation.y = w.side < 0 ? Math.PI : 0;
      const mesh = new THREE.Mesh(w.geo, detailMat);
      holder.add(mesh);
      group.add(holder);
      return { holder, mesh, side: w.side, front: w.front, base: holder.rotation.y };
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.scale.set(car.width * 2 + 0.9, 1, car.halfLen * 2 + 1.1);
    shadow.position.y = 0.02;
    shadow.renderOrder = 1;
    group.add(shadow);
    const glow = new THREE.Mesh(glowGeo, playerGlowMat);
    glow.position.y = 0.03;
    glow.renderOrder = 2;
    group.add(glow);
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, 0.04, -car.halfLen - 16.5);
    beam.renderOrder = 2;
    group.add(beam);
    const spill = new THREE.Mesh(spillGeo, tailSpillMat);
    spill.position.set(0, 0.035, car.halfLen + 1.5);
    spill.renderOrder = 2;
    group.add(spill);
    const shield = new THREE.Mesh(shieldBubbleGeo, shieldMat);
    shield.scale.set(1.75, 1.1, car.halfLen + 0.9);
    shield.position.y = 0.66;
    shield.visible = false;
    group.add(shield);
    group.visible = false;
    player.add(group);
    return { info, car, group, wheels, shield };
  });
  let active = playerCars[0];
  active.group.visible = true;

  // Lalu lintas (pool)
  const TRAFFIC_COLORS = [0x8d939c, 0xd0d2d6, 0x121316, 0x4b4f57, 0x14254a, 0x74131e, 0x9a8d78, 0x1d4a55];
  const paints = TRAFFIC_COLORS.map((c) => track(new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.45, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.12, envMapIntensity: 1.1 })));
  const trafficGeo = {};
  ['sedan', 'suv', 'van'].forEach((id) => {
    const car = buildCar(id);
    const detail = mergeGeometries([car.detail, mergeWheels(car)]);
    [car.paint, car.glass, car.heads, car.tails, detail].forEach(track);
    trafficGeo[id] = { car, detail };
  });
  const TAIL_RED = new THREE.Color(1.0, 0.0, 0.02);
  const TAIL_AMBER = new THREE.Color(2.6, 0.9, 0.02);
  const trafficGlowGeo = flat(3.8, 10.5);
  const trafficGlowMat = additive({ map: trafficGlowTex, opacity: 0.5, fog: true });
  const TRAFFIC_TYPES = ['sedan', 'suv', 'sedan', 'van', 'sedan', 'suv'];
  const traffic = [];
  for (let i = 0; i < 18; i++) {
    const kind = TRAFFIC_TYPES[i % TRAFFIC_TYPES.length];
    const { car, detail } = trafficGeo[kind];
    const group = new THREE.Group();
    const tailMat = track(new THREE.MeshBasicMaterial({ color: TAIL_RED.clone() }));
    group.add(new THREE.Mesh(car.paint, paints[(i * 3) % paints.length]));
    group.add(new THREE.Mesh(car.glass, glassMat));
    group.add(new THREE.Mesh(detail, detailMat));
    group.add(new THREE.Mesh(car.heads, headMat));
    group.add(new THREE.Mesh(car.tails, tailMat));
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.scale.set(car.width * 2 + 0.9, 1, car.halfLen * 2 + 1.1);
    shadow.position.y = 0.02;
    shadow.renderOrder = 1;
    group.add(shadow);
    const glow = new THREE.Mesh(trafficGlowGeo, trafficGlowMat);
    glow.position.y = 0.03;
    glow.renderOrder = 2;
    group.add(glow);
    group.visible = false;
    scene.add(group);
    traffic.push({ group, tailMat, halfLen: car.halfLen, active: false, x: 0, z: 0, lane: 0, toLane: 0, speed: 20, changeT: 0, passed: false, flung: null });
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
  points.renderOrder = 5;
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
      emit(x, y, z, Math.cos(a) * Math.cos(e) * s, Math.abs(Math.sin(e)) * s + 1, Math.sin(a) * Math.cos(e) * s, life * rand(0.5, 1), size * rand(0.6, 1.3), tmpColor.r * 1.25, tmpColor.g * 1.25, tmpColor.b * 1.25, 12, 0.5, 1.2);
    }
  };

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
    wheelA: 0,
    brakeGlow: 0,
    audioT: 0,
  };
  const hud = { score: 0, speed: 0, nitro: 0, boosting: false, mult: 1, comboT: 0, shield: false, dist: 0 };

  const camPos = new THREE.Vector3(6, 2.2, 7);
  const camLook = new THREE.Vector3(0, 0.7, 0);
  const tmpV = new THREE.Vector3();
  const tmpM = new THREE.Matrix4();
  const flipM = new THREE.Matrix4().makeRotationY(Math.PI);
  let portrait = false;
  let width = 1;
  let height = 1;

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
    burst(S.x, 0.8, -1, 80, 0xffb347, 18, 0.55, 1.2);
    burst(S.x, 0.8, -1, 40, 0xff3b6b, 12, 0.8, 0.9);
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
      const z = -B_SPAN + 240 + wrap(b.base + S.dist, B_SPAN);
      tmpM.makeScale(b.w, b.h, b.d).setPosition(b.x, 0, z);
      buildings.setMatrixAt(i, tmpM);
    }
    buildings.instanceMatrix.needsUpdate = true;

    // lampu: kiri di s ≡ 0, kanan di s ≡ setengah jarak (sama dengan shader jalan)
    for (let i = 0; i < LAMPS; i++) {
      const zl = -LAMP_SPAN + 88 + wrap(i * LAMP_GAP + S.dist, LAMP_SPAN);
      const zr = -LAMP_SPAN + 88 + wrap(i * LAMP_GAP + S.dist + LAMP_GAP / 2, LAMP_SPAN);
      tmpM.copy(flipM).setPosition(0, 0, zl);
      poles.setMatrixAt(i * 2, tmpM);
      lampHeads.setMatrixAt(i * 2, tmpM);
      tmpM.identity().setPosition(0, 0, zr);
      poles.setMatrixAt(i * 2 + 1, tmpM);
      lampHeads.setMatrixAt(i * 2 + 1, tmpM);
    }
    poles.instanceMatrix.needsUpdate = true;
    lampHeads.instanceMatrix.needsUpdate = true;

    // lampu titik mengikuti lampu jalan yang sedang dilewati
    lampLights[0].position.set(-5.6, 8.6, wrap(S.dist + 36, LAMP_GAP) - 36);
    lampLights[1].position.set(5.6, 8.6, wrap(S.dist + 36 + LAMP_GAP / 2, LAMP_GAP) - 36);

    gantry.position.z = -620 + wrap(S.dist + 240, 720);
  };

  let pIdle = false;
  const updateParticles = (dt) => {
    let alive = 0;
    for (let i = 0; i < P_MAX; i++) {
      const p = pData[i];
      if (p.life <= 0) {
        pSize[i] = 0;
        continue;
      }
      alive += 1;
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
    // satu unggahan terakhir setelah semua partikel padam, lalu berhenti sampai ada yang baru
    if (!alive && pIdle) return;
    pIdle = !alive;
    points.visible = alive > 0;
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.aColor.needsUpdate = true;
    pGeo.attributes.aSize.needsUpdate = true;
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
      const reach = c.halfLen + active.car.halfLen;
      if (!c.passed && c.z > reach + 0.2) {
        c.passed = true;
        if (dx < 2.8) nearMiss(dx < 2.3);
      }
      if (S.invuln <= 0 && !god && dx < 1.76 && Math.abs(c.z) < reach - 0.3) hitCar(c);
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
      if (running && Math.abs(p.x - S.x) < 1.6 && Math.abs(p.z) < 2.6) {
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

  // Pengemudi otomatis dan mode kebal: hanya untuk simulasi saat pengembangan.
  let auto = false;
  let god = false;
  const autopilot = () => {
    let bestLane = 0;
    let bestGap = -1;
    for (let l = 0; l < 4; l++) {
      let gap = 200;
      for (const c of traffic) {
        if (!c.active || c.flung) continue;
        if (Math.abs(c.x - LANES[l]) < 2.2 && c.z < 8 && c.z > -160) gap = Math.min(gap, -c.z + 8);
      }
      gap -= Math.abs(LANES[l] - S.x) * 2.5;
      if (gap > bestGap) {
        bestGap = gap;
        bestLane = l;
      }
    }
    const d = LANES[bestLane] - S.x;
    input.left = d < -0.35;
    input.right = d > 0.35;
  };

  const update = (dt, realDt) => {
    S.t += dt;
    uTime.value = S.t;
    const running = S.mode === 'run';
    if (auto && running) autopilot();
    const mods = active.info.mods;

    /* kecepatan */
    let boosting = false;
    if (running) {
      S.runT += dt;
      const base = (45 + 55 * (1 - Math.exp(-S.runT / 80))) * mods.speed;
      if (S.nitro <= 0.01) S.nitroLock = true;
      if (S.nitroLock && (S.nitro > 0.18 || !input.nitro)) S.nitroLock = false;
      boosting = input.nitro && !S.nitroLock && S.nitro > 0.01;
      if (boosting) S.nitro = Math.max(0, S.nitro - (0.26 / mods.nitro) * dt);
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
    uDist.value = wrap(S.dist, DIST_WRAP);
    const sn = clamp((S.speed - 25) / 80, 0, 1);

    /* kemudi */
    const steerIn = running ? (input.right ? 1 : 0) - (input.left ? 1 : 0) : 0;
    S.steer += (steerIn - S.steer) * damp(dt, 10);
    if (S.mode === 'countdown' || S.mode === 'attract') S.x += (0 - S.x) * damp(dt, 2);
    S.x += S.steer * (10.5 + sn * 3.5) * mods.handling * dt;
    const lim = ROAD_HALF - 1.05;
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
        emit(S.x + Math.sign(S.x) * 1.0, rand(0.2, 0.7), rand(-1.6, 1.6), -Math.sign(S.x) * rand(1, 5), rand(1, 5), rand(4, 14), rand(0.2, 0.5), 0.3, 3, 1.7, 0.5, 14, 0.2);
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
    COLOR_KEYS.forEach((k) => pal[k].lerp(palTarget[k], pk));
    NUM_KEYS.forEach((k) => {
      palNum[k].value += (palNumTarget[k] - palNum[k].value) * pk;
    });
    if (envDue.length) {
      for (let i = 0; i < envDue.length; i++) envDue[i] -= realDt;
      if (envDue[0] <= 0) {
        envDue.shift();
        refreshEnv();
      }
    }
    scene.fog.color.copy(pal.fog);
    hemi.color.copy(pal.ambient);
    keyLight.color.copy(pal.key);
    keyLight.intensity = 0.3 + palNum.sunPow.value * 0.9;
    lampHeadMat.color.copy(pal.lamp).multiplyScalar(4.5);
    lampLights[0].color.copy(pal.lamp);
    lampLights[1].color.copy(pal.lamp);
    playerGlowMat.color.copy(pal.accentL);
    S.brakeGlow += ((input.brake && running ? 1 : 0) - S.brakeGlow) * damp(dt, 14);
    playerTailMat.color.setRGB(0.95 + S.brakeGlow * 1.7 + S.boost * 0.25, S.brakeGlow * 0.03, 0.02);
    tailSpillMat.opacity = 0.22 + S.brakeGlow * 0.4;

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
    const hl = active.car.halfLen;
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
      player.rotation.y = -S.steer * 0.15;
      player.rotation.z = S.steer * 0.035; // bodi sedikit rebah ke luar tikungan
      player.rotation.x = S.boost * 0.028 - S.brakeGlow * 0.022;
      if (S.boost > 0.2) {
        for (const [ex, ey] of active.car.exhaust) {
          emit(S.x + ex, ey, hl + 0.1, rand(-0.3, 0.3), rand(0, 0.3), rand(5, 9), rand(0.1, 0.22), rand(0.2, 0.34), 0.5, 1.2, 2.6, 0, 0.08);
          emit(S.x + ex, ey, hl + 0.05, 0, 0, rand(3, 5), 0.08, 0.2, 2.4, 2.1, 1.6, 0, 0.08);
        }
      }
      S.wheelA += (S.speed / 0.35) * dt;
      for (const w of active.wheels) {
        w.mesh.rotation.x = -w.side * S.wheelA;
        if (w.front) w.holder.rotation.y = w.base - S.steer * 0.3;
      }
    }
    player.position.x = S.x;
    player.visible = S.invuln > 0 ? Math.sin(S.t * 40) > 0 : true;

    S.shieldGlow += ((S.shield ? 1 : 0) - S.shieldGlow) * damp(dt, 6);
    active.shield.visible = S.shieldGlow > 0.02;
    shieldMat.uniforms.uAlpha.value = S.shieldGlow * (0.75 + 0.25 * Math.sin(S.t * 5));

    updateParticles(dt);

    /* kamera */
    let fovGoal;
    if (S.mode === 'attract' || S.mode === 'over') {
      const a = Math.sin(S.t * 0.2) * 1.2 + 0.5 + (S.mode === 'over' ? 0.4 : 0);
      const r = portrait ? 11 : 8.8;
      tmpV.set(S.x + Math.sin(a) * r, 1.55 + Math.sin(S.t * 0.31) * 0.45, Math.cos(a) * r);
      camPos.lerp(tmpV, damp(realDt, 1.6));
      camLook.lerp(tmpV.set(S.x, 0.62, -0.2), damp(realDt, 3));
      fovGoal = portrait ? 58 : 42;
    } else {
      tmpV.set(S.x * 0.62, portrait ? 4.2 : 2.55, (portrait ? 10.4 : 7.3) - S.boost * 0.8);
      camPos.lerp(tmpV, damp(realDt, S.mode === 'countdown' ? 2.2 : 6));
      camLook.lerp(tmpV.set(S.x * 0.86, 0.95, -15), damp(realDt, 6));
      fovGoal = (portrait ? 74 : 60) + sn * 11 + S.boost * 9;
    }
    S.shake = Math.max(0, S.shake - realDt * 1.6);
    const sh = S.shake + S.boost * 0.03 + sn * 0.01;
    camera.position.set(camPos.x + (Math.random() - 0.5) * sh, camPos.y + (Math.random() - 0.5) * sh, camPos.z);
    camera.lookAt(camLook);
    camera.rotation.z += -S.steer * 0.02;
    if (Math.abs(camera.fov - fovGoal) > 0.01) {
      camera.fov += (fovGoal - camera.fov) * damp(realDt, 4);
      camera.updateProjectionMatrix();
    }
    // Di menu, mobil digeser ke kanan supaya tidak tertutup panel.
    const shiftGoal = S.mode === 'attract' && !portrait ? 0.21 : 0;
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

    S.audioT -= realDt;
    if (S.audioT <= 0) {
      S.audioT = 0.08;
      audio?.setEngine(clamp(S.speed / 100, 0, 1), S.boost);
    }

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
  let finalPass = null;

  const buildComposer = () => {
    if (composer) {
      composer.renderTarget1.dispose();
      composer.renderTarget2.dispose();
      bloom?.dispose();
      finalPass?.dispose?.();
      composer = null;
      bloom = null;
      finalPass = null;
    }
    if (quality === 0) return;
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    // Tanpa MSAA: di target HDR biayanya ~6 ms per frame pada GPU laptop. Tepi dihaluskan dengan FXAA.
    const rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType });
    composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.34, 0.6, 1.0);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const fxaa = new ShaderPass(FXAAShader);
    fxaa.material.uniforms.resolution.value.set(1 / size.x, 1 / size.y);
    composer.addPass(fxaa);
    finalPass = new ShaderPass(FINAL_SHADER);
    composer.addPass(finalPass);
  };

  const pixelRatio = () => Math.min(window.devicePixelRatio || 1, quality === 2 ? 2 : quality === 1 ? 1.5 : 1.25);

  function render() {
    if (composer) {
      finalPass.uniforms.uTime.value = S.t;
      finalPass.uniforms.uBoost.value = S.boost;
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  }

  const resize = () => {
    width = Math.max(1, canvas.clientWidth);
    height = Math.max(1, canvas.clientHeight);
    portrait = height > width * 1.05;
    renderer.setPixelRatio(pixelRatio());
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    pMat.uniforms.uScale.value = Math.min(height, width * 0.62) * renderer.getPixelRatio() * 0.9;
    buildComposer();
    render();
  };

  let raf = 0;
  let last = 0;
  let perfAcc = 0;
  let perfN = 0;
  let perfHold = 3; // detik yang dilewati setelah mulai/ganti kualitas (masa pemanasan)
  let lastDrop = null; // rata-rata frame sebelum penurunan terakhir
  let adaptDone = false;
  let destroyed = false;

  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const raw = last ? (now - last) / 1000 : 1 / 60;
    last = now;
    if (S.paused) return;
    // Kualitas adaptif: hanya dinilai saat balapan berjalan, setelah masa pemanasan, dan
    // sendatan sesaat (kompilasi shader, pindah tab) tidak ikut dihitung.
    if (!adaptDone && S.mode === 'run' && raw < 0.1) {
      if (perfHold > 0) {
        perfHold -= raw;
      } else {
        perfAcc += raw;
        perfN += 1;
        if (perfN >= 180) {
          const avg = perfAcc / perfN;
          perfAcc = 0;
          perfN = 0;
          if (lastDrop && avg > lastDrop.avg * 0.88) {
            // penurunan tadi tidak membantu (perangkat terbatas di CPU, bukan GPU): kembalikan
            quality = lastDrop.from;
            adaptDone = true;
            resize();
          } else if (avg > 1 / 52 && quality > 0) {
            lastDrop = { avg, from: quality };
            quality -= 1;
            perfHold = 2;
            resize();
          } else {
            lastDrop = null;
          }
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
  setZone(0, true);
  refreshEnv();
  updateDecor();
  resize();
  // Semua shader (termasuk lalu lintas dan pickup yang belum terlihat) dikompilasi saat
  // menu tampil, supaya tidak tersendat ketika balapan dimulai.
  renderer.compile(scene, camera);
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
      crashT: 0,
      countT: 0,
      countStep: -1,
      shake: 0,
      spin: 0,
      lift: 0,
    });
    S.orbAt = 120;
    S.shieldAt = rand(700, 1100);
    if (S.zone !== 0) setZone(0);
    S.zone = 0;
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
    if (S.zone !== 0) setZone(0);
    S.zone = 0;
    audio?.stopEngine();
    audio?.stopMusic();
    cb.onState?.('menu');
  };

  const api = {
    startRun,
    toMenu,
    press: (key, down) => {
      if (key in input) input[key] = down;
    },
    setPaused: (p) => {
      S.paused = p;
      last = 0;
    },
    setCar: (id) => {
      const next = playerCars.find((c) => c.info.id === id);
      if (!next || next === active) return;
      active.group.visible = false;
      active.shield.visible = false;
      active = next;
      active.group.visible = true;
    },
    setPaint: (id) => {
      const p = PAINTS.find((x) => x.id === id);
      if (!p) return;
      playerPaint.color.set(p.color);
      playerPaint.roughness = p.rough;
      playerPaint.metalness = p.metal;
      playerPaint.clearcoat = p.rough > 0.5 ? 0.15 : 1;
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
      envRT?.dispose();
      pmrem.dispose();
      disposables.forEach((d) => d.dispose?.());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
  if (import.meta.env.DEV || import.meta.env.VITE_PG_DEBUG) {
    api.debug = {
      auto: (v) => (auto = v),
      god: (v) => (god = v),
      // untuk mengukur biaya tiap bagian saat audit performa
      quality: (n) => {
        quality = n;
        adaptDone = true;
        resize();
      },
      show: (name, v) => {
        const o = { sky, ground, road, buildings, poles, lampHeads, gantry }[name];
        if (o) o.visible = v;
      },
      drawCalls: () => {
        renderer.info.autoReset = false;
        renderer.info.reset();
        renderer.render(scene, camera);
        const out = { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles };
        renderer.info.autoReset = true;
        return out;
      },
      state: () => ({ mode: S.mode, dist: Math.round(S.runDist), speed: Math.round(S.speed * 3.6), zone: S.zone, quality }),
    };
  }
  return api;
}
