// Pembangun mobil prosedural untuk Neon Drift.
// Bodi dibentuk dengan "loft": deretan penampang melintang halus dari belakang ke depan,
// sehingga siluetnya (kap, sepatbor, atap) cukup diatur lewat beberapa kurva.
// Semua desain di sini orisinal, bukan tiruan mobil pabrikan tertentu.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const gauss = (x, w) => Math.exp(-(x * x) / (w * w));

// Kurva halus (Hermite kubik) dari titik kunci [s, nilai].
function curve(keys) {
  const n = keys.length;
  const m = keys.map((k, i) => {
    const a = keys[Math.max(0, i - 1)];
    const b = keys[Math.min(n - 1, i + 1)];
    return (b[1] - a[1]) / (b[0] - a[0] || 1);
  });
  return (s) => {
    if (s <= keys[0][0]) return keys[0][1];
    if (s >= keys[n - 1][0]) return keys[n - 1][1];
    let i = 0;
    while (s > keys[i + 1][0]) i += 1;
    const [s0, v0] = keys[i];
    const [s1, v1] = keys[i + 1];
    const h = s1 - s0;
    const t = (s - s0) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * v0 + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * v1 + (t3 - t2) * h * m[i + 1];
  };
}

/* ------------------------------------------------------------ spesifikasi */

// s = 0 di ekor, s = 1 di hidung. Satuan meter.
const SPECS = {
  vanta: {
    hl: 2.28,
    deck: [[0, 0.8], [0.08, 0.86], [0.25, 0.88], [0.45, 0.84], [0.62, 0.76], [0.8, 0.63], [0.93, 0.5], [1, 0.4]],
    floor: [[0, 0.3], [0.12, 0.2], [0.5, 0.15], [0.9, 0.16], [1, 0.21]],
    halfW: [[0, 0.9], [0.15, 1.0], [0.32, 0.99], [0.5, 0.94], [0.72, 0.985], [0.86, 0.97], [0.95, 0.88], [1, 0.74]],
    wheelF: 0.798,
    wheelR: 0.215,
    fenderF: 0.075,
    fenderR: 0.05,
    hoodDip: 0.05,
    cabin: [0.3, 0.76],
    roof: 1.13,
    cabW: 0.74,
    canopyH: [[0, 0], [0.12, 0.34], [0.42, 0.93], [0.6, 1], [0.8, 0.72], [1, 0]],
    canopyW: [[0, 0.4], [0.2, 0.76], [0.55, 1], [0.85, 0.9], [1, 0.55]],
    nTop: 2.7,
    nBot: 4.6,
    radius: 0.35,
    wing: 'lip',
    exhaust: [-0.2, 0.2],
  },
  kirin: {
    hl: 2.22,
    deck: [[0, 0.82], [0.08, 0.88], [0.25, 0.9], [0.45, 0.85], [0.62, 0.75], [0.8, 0.6], [0.93, 0.46], [1, 0.36]],
    floor: [[0, 0.32], [0.12, 0.19], [0.5, 0.13], [0.9, 0.14], [1, 0.18]],
    halfW: [[0, 0.93], [0.15, 1.02], [0.32, 0.99], [0.5, 0.9], [0.72, 0.99], [0.86, 0.985], [0.95, 0.9], [1, 0.76]],
    wheelF: 0.8,
    wheelR: 0.21,
    fenderF: 0.11,
    fenderR: 0.07,
    hoodDip: 0.07,
    cabin: [0.3, 0.74],
    roof: 1.15,
    cabW: 0.7,
    canopyH: [[0, 0], [0.12, 0.4], [0.42, 0.95], [0.58, 1], [0.8, 0.7], [1, 0]],
    canopyW: [[0, 0.36], [0.2, 0.74], [0.55, 1], [0.85, 0.9], [1, 0.55]],
    nTop: 2.9,
    nBot: 5,
    radius: 0.35,
    wing: 'gt',
    exhaust: [-0.34, -0.12, 0.12, 0.34],
  },
  aurelia: {
    hl: 2.4,
    deck: [[0, 0.84], [0.06, 0.93], [0.2, 0.95], [0.4, 0.91], [0.56, 0.88], [0.75, 0.82], [0.92, 0.68], [1, 0.52]],
    floor: [[0, 0.3], [0.12, 0.21], [0.5, 0.17], [0.9, 0.18], [1, 0.24]],
    halfW: [[0, 0.86], [0.14, 0.98], [0.3, 0.97], [0.5, 0.93], [0.72, 0.96], [0.86, 0.95], [0.95, 0.87], [1, 0.72]],
    wheelF: 0.81,
    wheelR: 0.2,
    fenderF: 0.05,
    fenderR: 0.06,
    hoodDip: 0.035,
    cabin: [0.14, 0.58],
    roof: 1.25,
    cabW: 0.76,
    canopyH: [[0, 0], [0.16, 0.46], [0.45, 0.96], [0.62, 1], [0.82, 0.68], [1, 0]],
    canopyW: [[0, 0.5], [0.2, 0.84], [0.55, 1], [0.85, 0.92], [1, 0.6]],
    nTop: 2.8,
    nBot: 4.4,
    radius: 0.36,
    wing: 'none',
    exhaust: [-0.5, -0.36, 0.36, 0.5],
  },
  spectre: {
    hl: 2.36,
    deck: [[0, 0.72], [0.08, 0.8], [0.28, 0.83], [0.5, 0.76], [0.66, 0.66], [0.82, 0.53], [0.94, 0.42], [1, 0.34]],
    floor: [[0, 0.34], [0.14, 0.18], [0.5, 0.12], [0.9, 0.13], [1, 0.17]],
    halfW: [[0, 0.95], [0.15, 1.04], [0.32, 1.02], [0.52, 0.9], [0.72, 1.0], [0.86, 1.0], [0.95, 0.92], [1, 0.78]],
    wheelF: 0.8,
    wheelR: 0.2,
    fenderF: 0.12,
    fenderR: 0.08,
    hoodDip: 0.08,
    cabin: [0.36, 0.8],
    roof: 1.06,
    cabW: 0.66,
    canopyH: [[0, 0], [0.1, 0.3], [0.4, 0.9], [0.58, 1], [0.8, 0.7], [1, 0]],
    canopyW: [[0, 0.3], [0.2, 0.7], [0.55, 1], [0.85, 0.88], [1, 0.5]],
    nTop: 2.6,
    nBot: 5.2,
    radius: 0.36,
    wing: 'active',
    fin: true,
    exhaust: [0],
  },
  // --- lalu lintas ---
  sedan: {
    hl: 2.32,
    deck: [[0, 0.9], [0.08, 0.97], [0.3, 0.98], [0.6, 0.95], [0.82, 0.9], [0.95, 0.8], [1, 0.64]],
    floor: [[0, 0.3], [0.1, 0.22], [0.5, 0.2], [0.9, 0.22], [1, 0.28]],
    halfW: [[0, 0.82], [0.1, 0.9], [0.5, 0.9], [0.86, 0.9], [0.96, 0.84], [1, 0.72]],
    wheelF: 0.8,
    wheelR: 0.2,
    fenderF: 0.015,
    fenderR: 0.015,
    hoodDip: 0,
    cabin: [0.14, 0.7],
    roof: 1.43,
    cabW: 0.8,
    canopyH: [[0, 0], [0.16, 0.82], [0.3, 1], [0.7, 1], [0.88, 0.58], [1, 0]],
    canopyW: [[0, 0.82], [0.2, 0.96], [0.6, 1], [0.9, 0.94], [1, 0.82]],
    nTop: 3.4,
    nBot: 4,
    radius: 0.33,
    wing: 'none',
    roofCap: true,
    traffic: true,
  },
  suv: {
    hl: 2.42,
    deck: [[0, 1.02], [0.06, 1.1], [0.4, 1.1], [0.7, 1.06], [0.9, 0.98], [1, 0.78]],
    floor: [[0, 0.36], [0.1, 0.3], [0.5, 0.28], [0.9, 0.3], [1, 0.36]],
    halfW: [[0, 0.86], [0.08, 0.95], [0.5, 0.95], [0.88, 0.95], [0.97, 0.88], [1, 0.76]],
    wheelF: 0.8,
    wheelR: 0.2,
    fenderF: 0.02,
    fenderR: 0.02,
    hoodDip: 0,
    cabin: [0.03, 0.7],
    roof: 1.74,
    cabW: 0.84,
    canopyH: [[0, 0], [0.06, 0.9], [0.14, 1], [0.72, 1], [0.9, 0.56], [1, 0]],
    canopyW: [[0, 0.9], [0.2, 0.98], [0.6, 1], [0.9, 0.95], [1, 0.84]],
    nTop: 3.8,
    nBot: 4,
    radius: 0.38,
    wing: 'none',
    roofCap: true,
    traffic: true,
  },
  van: {
    hl: 2.62,
    deck: [[0, 1.1], [0.05, 1.2], [0.5, 1.2], [0.8, 1.16], [0.93, 1.02], [1, 0.8]],
    floor: [[0, 0.36], [0.1, 0.32], [0.5, 0.3], [0.9, 0.32], [1, 0.38]],
    halfW: [[0, 0.9], [0.06, 0.98], [0.5, 0.98], [0.9, 0.98], [0.97, 0.9], [1, 0.8]],
    wheelF: 0.82,
    wheelR: 0.2,
    fenderF: 0,
    fenderR: 0,
    hoodDip: 0,
    cabin: [0.015, 0.84],
    roof: 2.08,
    cabW: 0.94,
    canopyH: [[0, 0], [0.03, 0.94], [0.08, 1], [0.84, 1], [0.94, 0.6], [1, 0]],
    canopyW: [[0, 0.95], [0.2, 1], [0.8, 1], [0.94, 0.95], [1, 0.86]],
    nTop: 5,
    nBot: 4.5,
    radius: 0.38,
    wing: 'none',
    roofCap: true,
    boxy: true,
    traffic: true,
  },
};

export const PLAYER_CARS = [
  { id: 'vanta', name: 'Vanta GT', cls: 'Supercar', blurb: 'Mesin tengah, seimbang di semua hal.', stats: { speed: 0.72, handling: 0.74, nitro: 0.7 }, mods: { speed: 1, handling: 1, nitro: 1 } },
  { id: 'kirin', name: 'Kirin RS', cls: 'Track Supercar', blurb: 'Sayap besar, menempel di jalan saat pindah lajur.', stats: { speed: 0.64, handling: 0.95, nitro: 0.62 }, mods: { speed: 0.97, handling: 1.16, nitro: 0.92 } },
  { id: 'aurelia', name: 'Aurelia V12', cls: 'Hyper GT', blurb: 'Kap panjang, kecepatan puncak tertinggi.', stats: { speed: 0.95, handling: 0.58, nitro: 0.72 }, mods: { speed: 1.06, handling: 0.9, nitro: 1 } },
  { id: 'spectre', name: 'Spectre X', cls: 'Hypercar', blurb: 'Rendah dan lebar, nitro paling tahan lama.', stats: { speed: 0.84, handling: 0.8, nitro: 0.96 }, mods: { speed: 1.02, handling: 1.04, nitro: 1.3 } },
];

export const PAINTS = [
  { id: 'glacier', name: 'Glacier White', color: 0xd9dbe2, rough: 0.34, metal: 0.35 },
  { id: 'rosso', name: 'Rosso Corsa', color: 0xb80f1c, rough: 0.3, metal: 0.45 },
  { id: 'abyss', name: 'Abyss Blue', color: 0x0c2f9e, rough: 0.28, metal: 0.65 },
  { id: 'volt', name: 'Volt Lime', color: 0x86c400, rough: 0.34, metal: 0.4 },
  { id: 'solar', name: 'Solar Orange', color: 0xe85d04, rough: 0.3, metal: 0.5 },
  { id: 'amethyst', name: 'Amethyst', color: 0x4c1fb5, rough: 0.28, metal: 0.7 },
  { id: 'champagne', name: 'Champagne', color: 0xb99a5b, rough: 0.3, metal: 0.8 },
  { id: 'stealth', name: 'Stealth Matte', color: 0x17181c, rough: 0.62, metal: 0.5 },
];

/* --------------------------------------------------------------- geometri */

function tint(geo, hex) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  if (g.attributes.uv) g.deleteAttribute('uv');
  const c = new THREE.Color(hex);
  const n = g.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    arr[i * 3] = c.r;
    arr[i * 3 + 1] = c.g;
    arr[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return g;
}

function box(w, h, d, x, y, z, hex, rx = 0, ry = 0, rz = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  if (rx) g.rotateX(rx);
  if (ry) g.rotateY(ry);
  if (rz) g.rotateZ(rz);
  g.translate(x, y, z);
  return tint(g, hex);
}

function makeShape(spec) {
  const deck = curve(spec.deck);
  const floor = curve(spec.floor);
  const halfW = curve(spec.halfW);
  const fender = (s) => spec.fenderF * gauss(s - spec.wheelF, 0.1) + spec.fenderR * gauss(s - spec.wheelR, 0.11);
  const dip = (s) => spec.hoodDip * smooth(0.56, 0.8, s) * (1 - smooth(0.93, 1, s));
  // pembulatan ujung depan dan belakang
  const cap = (s) => {
    const e = Math.min(s / 0.045, (1 - s) / 0.06, 1);
    return Math.sqrt(1 - (1 - e) * (1 - e));
  };
  // titik pada penampang: th = 0 di tengah bawah, PI di tengah atas
  const point = (s, th, out) => {
    const f = cap(s);
    const w = halfW(s) * (0.78 + 0.22 * f);
    const fl = floor(s);
    const dk = deck(s);
    const cx = Math.sin(th);
    const cy = -Math.cos(th);
    const top = cy > 0;
    const n = top ? spec.nTop : spec.nBot;
    let x = w * Math.sign(cx) * Math.abs(cx) ** (2 / n);
    const yu = Math.sign(cy) * Math.abs(cy) ** (2 / n);
    const ax = Math.abs(x) / w;
    const topY = dk + fender(s) * smooth(0.45, 0.95, ax) - dip(s) * (1 - smooth(0.2, 0.8, ax));
    const yMid = fl + (dk - fl) * 0.42;
    let y = top ? yMid + (topY - yMid) * yu : yMid + (yMid - fl) * yu;
    if (top) x *= 1 - (spec.boxy ? 0.03 : 0.09) * yu;
    const yc = fl + (dk - fl) * 0.46;
    y = yc + (y - yc) * (0.55 + 0.45 * f);
    out.x = x;
    out.y = y;
    out.z = spec.hl - s * 2 * spec.hl;
    return out;
  };
  return { deck, floor, halfW, point };
}

function loft(rings, closedRing, capStart, capEnd) {
  const nr = rings[0].length;
  const pos = [];
  rings.forEach((r) => r.forEach((p) => pos.push(p.x, p.y, p.z)));
  const idx = [];
  const cols = closedRing ? nr : nr - 1;
  for (let i = 0; i < rings.length - 1; i++) {
    for (let j = 0; j < cols; j++) {
      const a = i * nr + j;
      const b = i * nr + ((j + 1) % nr);
      const c = (i + 1) * nr + j;
      const d = (i + 1) * nr + ((j + 1) % nr);
      idx.push(a, c, b, b, c, d);
    }
  }
  const fan = (ringIndex, flip) => {
    const r = rings[ringIndex];
    const c = new THREE.Vector3();
    r.forEach((p) => c.add(p));
    c.multiplyScalar(1 / nr);
    const ci = pos.length / 3;
    pos.push(c.x, c.y, c.z);
    for (let j = 0; j < nr; j++) {
      const a = ringIndex * nr + j;
      const b = ringIndex * nr + ((j + 1) % nr);
      if (flip) idx.push(ci, a, b);
      else idx.push(ci, b, a);
    }
  };
  if (capStart) fan(0, true);
  if (capEnd) fan(rings.length - 1, false);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function buildBody(spec, shape) {
  const NS = 44;
  const NR = 32;
  const rings = [];
  for (let i = 0; i <= NS; i++) {
    // stasiun dirapatkan di kedua ujung agar pembulatannya halus
    const u = i / NS;
    const s = 0.5 - 0.5 * Math.cos(Math.PI * u) * (0.75 + 0.25 * Math.abs(Math.cos(Math.PI * u)));
    const ring = [];
    for (let j = 0; j < NR; j++) ring.push(shape.point(clamp(s, 0, 1), (j / NR) * TAU, new THREE.Vector3()));
    rings.push(ring);
  }
  return loft(rings, true, true, true);
}

function buildCanopy(spec, shape, scale = 1, arc = Math.PI / 2, lift = 0) {
  const [c0, c1] = spec.cabin;
  const H = curve(spec.canopyH);
  const Wd = curve(spec.canopyW);
  const NS = 26;
  const NR = 18;
  const n = spec.boxy ? 4.2 : spec.roofCap ? 3 : 2.5;
  const rings = [];
  const peak = shape.deck(c0 + (c1 - c0) * 0.55);
  for (let i = 0; i <= NS; i++) {
    const t = i / NS;
    const s = c0 + (c1 - c0) * t;
    const base = shape.deck(s) - 0.06;
    const h = Math.max(0.001, (spec.roof - peak) * H(t) + 0.06) * scale;
    const w = spec.cabW * Wd(t) * Math.min(1, 0.25 + Math.sqrt(Math.max(0, Math.sin(Math.PI * t))) * 1.1) * scale;
    const ring = [];
    for (let j = 0; j <= NR; j++) {
      const ph = arc - (j / NR) * arc * 2; // kanan → kiri supaya normal menghadap ke luar
      const sx = Math.sin(ph);
      const cy = Math.cos(ph);
      ring.push(new THREE.Vector3(w * Math.sign(sx) * Math.abs(sx) ** (2 / n), base + lift + h * Math.abs(cy) ** (2 / n), spec.hl - s * 2 * spec.hl));
    }
    rings.push(ring);
  }
  return loft(rings, false, false, false);
}

function buildWheel(radius, width) {
  const parts = [];
  // ban: profil diputar mengelilingi sumbu
  const prof = [
    [radius - 0.085, -width / 2],
    [radius - 0.02, -width / 2],
    [radius, -width / 2 + 0.035],
    [radius, width / 2 - 0.035],
    [radius - 0.02, width / 2],
    [radius - 0.085, width / 2],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const tire = new THREE.LatheGeometry(prof, 26);
  tire.rotateZ(-Math.PI / 2); // sumbu putar → X, sisi luar di +X
  parts.push(tint(tire, 0x0a0a0c));
  const barrel = new THREE.CylinderGeometry(radius - 0.085, radius - 0.085, width * 0.8, 22, 1, true);
  barrel.rotateZ(Math.PI / 2);
  parts.push(tint(barrel, 0x15161a));
  const disc = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, 0.025, 20);
  disc.rotateZ(Math.PI / 2);
  const face = width / 2 - 0.04;
  disc.translate(face - 0.012, 0, 0);
  parts.push(tint(disc, 0x4a4d55));
  // pelek: sepuluh jari tipis berpasangan + bibir pelek
  const spokes = 5;
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * TAU;
    for (const off of [-0.11, 0.11]) {
      const g = new THREE.BoxGeometry(0.022, radius - 0.1, 0.02);
      g.translate(0, (radius - 0.1) / 2, 0);
      g.rotateX(a + off);
      g.translate(face, 0, 0);
      parts.push(tint(g, 0x6d727d));
    }
  }
  const lip = new THREE.TorusGeometry(radius - 0.088, 0.012, 6, 26);
  lip.rotateY(Math.PI / 2);
  lip.translate(face + 0.008, 0, 0);
  parts.push(tint(lip, 0x8a909c));
  const caliper = new THREE.BoxGeometry(0.03, 0.09, 0.14);
  caliper.translate(face - 0.02, radius * 0.42, 0);
  parts.push(tint(caliper, 0xc9151e));
  const hub = new THREE.CylinderGeometry(0.06, 0.07, 0.05, 12);
  hub.rotateZ(Math.PI / 2);
  hub.translate(face + 0.005, 0, 0);
  parts.push(tint(hub, 0x2a2c33));
  return mergeGeometries(parts);
}

function finish(geo) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  if (g.attributes.uv) g.deleteAttribute('uv');
  if (g.attributes.color) g.deleteAttribute('color');
  return g;
}

export function buildCar(id) {
  const spec = SPECS[id];
  const shape = makeShape(spec);
  const { hl } = spec;
  const tmp = new THREE.Vector3();
  const zOf = (s) => hl - s * 2 * hl;
  const sideX = (s) => shape.point(s, Math.PI * 0.42, tmp).x; // lebar bodi setinggi poros roda
  const topAt = (s, ax) => {
    // tinggi permukaan atas pada pecahan lebar ax (0 = tengah, 1 = tepi)
    const n = spec.nTop;
    const cx = Math.min(0.999, ax ** (n / 2));
    return shape.point(s, Math.PI - Math.asin(cx), tmp).y;
  };

  const paintParts = [finish(buildBody(spec, shape))];
  const glass = finish(buildCanopy(spec, shape));
  if (spec.roofCap) paintParts.push(finish(buildCanopy(spec, shape, 1.012, spec.boxy ? Math.PI * 0.33 : Math.PI * 0.27, 0.004)));

  const detail = [];
  const wheelGeoF = buildWheel(spec.radius, 0.27);
  const wheelGeoR = buildWheel(spec.radius + (spec.traffic ? 0 : 0.01), spec.traffic ? 0.27 : 0.33);
  const wheels = [];
  for (const [s, geo, rear] of [
    [spec.wheelF, wheelGeoF, false],
    [spec.wheelR, wheelGeoR, true],
  ]) {
    const r = rear && !spec.traffic ? spec.radius + 0.01 : spec.radius;
    const width = rear && !spec.traffic ? 0.33 : 0.27;
    // muka pelek berada sedikit di luar sisi bodi supaya terlihat
    const x = sideX(s) - width / 2 + 0.055;
    for (const side of [-1, 1]) {
      wheels.push({ geo, x: side * x, y: r, z: zOf(s), side, r, front: !rear });
      // lengkung sepatbor: cakram gelap tipis menempel di sisi bodi, di belakang roda
      const arch = new THREE.CylinderGeometry(r + 0.075, r + 0.075, 0.008, 26);
      arch.rotateZ(Math.PI / 2);
      arch.translate(side * (sideX(s) - 0.001), r + 0.01, zOf(s));
      detail.push(tint(arch, 0x030304));
    }
  }

  const CARBON = 0x0b0b0d;
  const wNose = shape.halfW(0.97);
  const wTail = shape.halfW(0.03);
  if (!spec.traffic) {
    // splitter depan, rok samping, diffuser belakang
    detail.push(box(wNose * 1.9, 0.035, 0.42, 0, shape.floor(0.96) + 0.005, zOf(0.955), CARBON));
    for (const side of [-1, 1]) {
      detail.push(box(0.07, 0.07, hl * 0.86, side * (shape.halfW(0.5) - 0.01), shape.floor(0.5) + 0.03, zOf(0.5), CARBON));
      // lubang udara di depan roda belakang
      detail.push(box(0.05, 0.2, 0.46, side * (sideX(0.36) + 0.012), shape.deck(0.36) * 0.56, zOf(0.36), 0x040405, 0, side * 0.1, 0));
      // spion
      detail.push(box(0.2, 0.07, 0.11, side * (spec.cabW * 0.98 + 0.12), shape.deck(spec.cabin[1] - 0.1) + 0.12, zOf(spec.cabin[1] - 0.09), CARBON));
    }
    detail.push(box(wTail * 1.5, 0.2, 0.3, 0, shape.floor(0.03) + 0.07, zOf(0.035), CARBON, -0.25));
    for (let i = -2; i <= 2; i++) detail.push(box(0.025, 0.17, 0.3, i * wTail * 0.3, shape.floor(0.03) + 0.06, zOf(0.03), 0x1c1d22, -0.25));
  } else {
    // bumper gelap untuk lalu lintas
    detail.push(box(wNose * 1.75, 0.16, 0.2, 0, shape.floor(0.97) + 0.14, zOf(0.985), 0x0d0d10));
    detail.push(box(wTail * 1.75, 0.16, 0.2, 0, shape.floor(0.03) + 0.14, zOf(0.012), 0x0d0d10));
  }

  // sayap
  const deckTail = shape.deck(0.06);
  if (spec.wing === 'gt') {
    detail.push(box(wTail * 2.15, 0.035, 0.36, 0, deckTail + 0.42, zOf(0.04), CARBON, 0.14));
    for (const side of [-1, 1]) {
      detail.push(box(0.04, 0.42, 0.2, side * wTail * 0.6, deckTail + 0.21, zOf(0.07), CARBON, 0.2));
      detail.push(box(0.03, 0.2, 0.42, side * wTail * 1.08, deckTail + 0.42, zOf(0.04), CARBON));
    }
  } else if (spec.wing === 'active') {
    detail.push(box(wTail * 1.86, 0.03, 0.34, 0, deckTail + 0.2, zOf(0.045), CARBON, 0.1));
    for (const side of [-1, 1]) detail.push(box(0.05, 0.2, 0.16, side * wTail * 0.45, deckTail + 0.1, zOf(0.06), CARBON, 0.2));
  } else if (spec.wing === 'lip') {
    detail.push(box(wTail * 1.7, 0.04, 0.16, 0, deckTail + 0.06, zOf(0.03), CARBON, 0.3));
  }
  if (spec.fin) detail.push(box(0.03, 0.2, 1.1, 0, shape.deck(0.2) + 0.1, zOf(0.19), CARBON, 0.1));

  // knalpot
  const exhaust = [];
  if (spec.exhaust) {
    for (const ex of spec.exhaust) {
      const y = shape.deck(0.02) * (spec.exhaust.length === 1 ? 0.72 : 0.5);
      const g = new THREE.CylinderGeometry(0.055, 0.06, 0.16, 12, 1, true);
      g.rotateX(Math.PI / 2);
      g.translate(ex, y, hl - 0.03);
      detail.push(tint(g, 0x70747e));
      exhaust.push([ex, y]);
    }
  }

  // lampu: bilah LED tipis mengikuti permukaan
  const heads = [];
  const tails = [];
  for (const side of [-1, 1]) {
    if (spec.traffic) {
      const g = new THREE.BoxGeometry(0.36, 0.11, 0.1);
      g.translate(side * wNose * 0.62, shape.deck(0.97) * 0.86, zOf(0.975) - 0.02);
      heads.push(g);
      const t = new THREE.BoxGeometry(0.34, 0.12, 0.08);
      t.translate(side * wTail * 0.66, shape.deck(0.03) * 0.88, zOf(0.022) + 0.02);
      tails.push(t);
    } else {
      const s = 0.925;
      const y0 = topAt(s, 0.66);
      const slope = Math.atan2(topAt(s + 0.03, 0.66) - topAt(s - 0.03, 0.66), 0.06 * 2 * hl);
      const g = new THREE.BoxGeometry(0.34, 0.03, 0.22);
      g.rotateX(slope);
      g.rotateY(side * -0.32);
      g.translate(side * shape.halfW(s) * 0.66, y0 + 0.012, zOf(s));
      heads.push(g);
      const d = new THREE.BoxGeometry(0.2, 0.02, 0.03);
      d.translate(side * wNose * 0.74, shape.floor(0.97) + 0.14, zOf(0.985) - 0.04);
      heads.push(d);
    }
  }
  if (!spec.traffic) {
    // bilah lampu belakang selebar bodi
    const bar = new THREE.BoxGeometry(wTail * 1.72, 0.035, 0.07);
    bar.translate(0, shape.deck(0.02) - 0.13, hl - 0.045);
    tails.push(bar);
    for (const side of [-1, 1]) {
      const t = new THREE.BoxGeometry(0.035, 0.12, 0.07);
      t.translate(side * wTail * 0.86, shape.deck(0.02) - 0.17, hl - 0.05);
      tails.push(t);
    }
  }

  return {
    spec,
    halfLen: hl,
    paint: mergeGeometries(paintParts),
    glass,
    detail: mergeGeometries(detail),
    heads: mergeGeometries(heads),
    tails: mergeGeometries(tails),
    wheels,
    exhaust,
    width: shape.halfW(0.3),
  };
}

// Semua roda digabung jadi satu geometri diam (untuk lalu lintas).
export function mergeWheels(car) {
  return mergeGeometries(
    car.wheels.map((w) => {
      const g = w.geo.clone();
      if (w.side < 0) g.rotateY(Math.PI);
      g.translate(w.x, w.y, w.z);
      return g;
    }),
  );
}
