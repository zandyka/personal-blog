import { useEffect, useRef, useState } from 'react';

/*
 * Potret yang dirender sebagai cetakan dither tiga warna (ala risograph):
 * bayangan = warna gelap tema, nada tengah = aksen, sorotan = warna terang tema.
 * Kursor menjadi loupe yang menampilkan foto aslinya berwarna.
 * Di perangkat sentuh, loupe berkeliling sendiri.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec4 uCrop;
uniform float uImgAspect;
uniform vec2 uMouse;
uniform float uLens;
uniform float uCell;
uniform float uDevelop;
uniform float uBgLevel;
uniform float uDpr;
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uRing;

vec2 toImage(vec2 p) {
  vec2 uv = p / uRes;
  float a = uRes.x / uRes.y;
  vec2 s = vec2(1.0);
  if (a > uImgAspect) s.y = uImgAspect / a; else s.x = a / uImgAspect;
  uv = (uv - 0.5) * s + 0.5;
  return mix(uCrop.xy, uCrop.zw, uv);
}

float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 cell = floor(p / uCell);
  vec3 src = texture2D(uTex, toImage((cell + 0.5) * uCell)).rgb;
  float l = dot(src, vec3(0.299, 0.587, 0.114));
  l = smoothstep(0.04, 0.9, pow(l, 0.82));

  // "Mencetak": tiap sel muncul pada waktunya sendiri.
  float r = hash(cell);
  float dev = smoothstep(r * 0.6, r * 0.6 + 0.4, uDevelop);
  l = mix(uBgLevel, l, dev);

  float q = clamp(floor(l * 2.0 + bayer8(cell)), 0.0, 2.0);
  vec3 col = q < 0.5 ? uC0 : (q < 1.5 ? uC1 : uC2);

  if (uLens > 0.5) {
    float d = distance(p, uMouse);
    vec2 zp = uMouse + (p - uMouse) / 1.12;
    vec3 photo = texture2D(uTex, toImage(zp)).rgb;
    float inside = 1.0 - smoothstep(uLens - uDpr, uLens, d);
    col = mix(col, photo, inside);
    float ring = smoothstep(uLens - 1.5 * uDpr, uLens - 0.5 * uDpr, d)
               * (1.0 - smoothstep(uLens + 0.5 * uDpr, uLens + 1.5 * uDpr, d));
    col = mix(col, uRing, ring);
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

const parseColor = (value, fallback) => {
  const v = (value || '').trim();
  let m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const n = parseInt(m[1], 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  m = v.match(/^#([0-9a-f]{3})$/i);
  if (m) return m[1].split('').map((c) => parseInt(c + c, 16) / 255);
  m = v.match(/rgba?\(([^)]+)\)/i);
  if (m) return m[1].split(',').slice(0, 3).map((c) => parseFloat(c) / 255);
  return fallback;
};

const readPalette = () => {
  const root = document.documentElement;
  const cs = getComputedStyle(root);
  const light = root.classList.contains('light');
  const bg = parseColor(cs.getPropertyValue('--bg'), [0.04, 0.03, 0.03]);
  const text = parseColor(cs.getPropertyValue('--text'), [0.96, 0.94, 0.94]);
  const mid = parseColor(cs.getPropertyValue(light ? '--accent' : '--accent-solid'), [0.55, 0.11, 0.18]);
  const ring = parseColor(cs.getPropertyValue('--accent'), [0.84, 0.35, 0.43]);
  return light
    ? { c0: text, c1: mid, c2: bg, ring, bgLevel: 1 }
    : { c0: bg, c1: mid, c2: text, ring, bgLevel: 0 };
};

function compile(gl, type, source) {
  const s = gl.createShader(type);
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn('DitherPortrait shader:', gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

export default function DitherPortrait({ src, crop = [0, 0, 1, 1], imageSize, alt = '', play = true }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const playRef = useRef(play);
  const wakeRef = useRef(() => {});
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    playRef.current = play;
    wakeRef.current();
  }, [play]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) {
      setFailed(true);
      return undefined;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      setFailed(true);
      return undefined;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true);
      return undefined;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {};
    ['uTex', 'uRes', 'uCrop', 'uImgAspect', 'uMouse', 'uLens', 'uCell', 'uDevelop', 'uBgLevel', 'uDpr', 'uC0', 'uC1', 'uC2', 'uRing']
      .forEach((name) => { u[name] = gl.getUniformLocation(prog, name); });

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(u.uTex, 0);

    const [iw, ih] = imageSize;
    const cropW = (crop[2] - crop[0]) * iw;
    const cropH = (crop[3] - crop[1]) * ih;
    gl.uniform4f(u.uCrop, crop[0], crop[1], crop[2], crop[3]);
    gl.uniform1f(u.uImgAspect, cropW / cropH);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const s = {
      loaded: false,
      visible: true,
      develop: reduce ? 1 : 0,
      lens: 0,
      lensV: 0,
      lensTarget: 0,
      mx: 0,
      my: 0,
      tx: 0,
      ty: 0,
      hover: false,
      w: 1,
      h: 1,
      dpr: 1,
      radius: 80,
      raf: 0,
      last: 0,
      start: performance.now(),
    };

    const applyPalette = () => {
      const p = readPalette();
      gl.uniform3fv(u.uC0, p.c0);
      gl.uniform3fv(u.uC1, p.c1);
      gl.uniform3fv(u.uC2, p.c2);
      gl.uniform3fv(u.uRing, p.ring);
      gl.uniform1f(u.uBgLevel, p.bgLevel);
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      s.dpr = Math.min(2, window.devicePixelRatio || 1);
      s.w = Math.max(1, Math.round(rect.width * s.dpr));
      s.h = Math.max(1, Math.round(rect.height * s.dpr));
      canvas.width = s.w;
      canvas.height = s.h;
      gl.viewport(0, 0, s.w, s.h);
      gl.uniform2f(u.uRes, s.w, s.h);
      gl.uniform1f(u.uDpr, s.dpr);
      const cssMin = Math.min(rect.width, rect.height);
      gl.uniform1f(u.uCell, Math.max(2, Math.round(cssMin / 200)) * s.dpr);
      s.radius = Math.min(118, Math.max(54, cssMin * 0.2)) * s.dpr;
      if (!s.hover) {
        s.mx = s.tx = s.w * 0.62;
        s.my = s.ty = s.h * 0.4;
      }
    };

    const draw = () => {
      gl.uniform1f(u.uDevelop, s.develop);
      gl.uniform1f(u.uLens, s.lens);
      gl.uniform2f(u.uMouse, s.mx, s.my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now) => {
      s.raf = 0;
      if (!s.loaded) return;
      const dt = s.last ? Math.min(0.05, (now - s.last) / 1000) : 1 / 60;
      s.last = now;

      if (playRef.current && s.develop < 1) s.develop = Math.min(1, s.develop + dt / 1.7);

      const wander = !finePointer && s.develop >= 1 && !reduce;
      if (wander) {
        const t = (now - s.start) / 1000;
        s.tx = s.w * (0.5 + Math.cos(t * 0.45) * 0.26);
        s.ty = s.h * (0.45 + Math.sin(t * 0.7) * 0.22);
        s.lensTarget = s.radius * 0.85;
      } else if (finePointer) {
        s.lensTarget = s.hover && s.develop > 0.6 ? s.radius : 0;
      }

      // pegas untuk ukuran loupe, lerp untuk posisi
      const k = 170;
      const c = 2 * Math.sqrt(k) * 0.8;
      s.lensV += (k * (s.lensTarget - s.lens) - c * s.lensV) * dt;
      s.lens = Math.max(0, s.lens + s.lensV * dt);
      const follow = 1 - Math.exp(-dt * 14);
      s.mx += (s.tx - s.mx) * follow;
      s.my += (s.ty - s.my) * follow;

      draw();

      const busy =
        (playRef.current && s.develop < 1) ||
        wander ||
        Math.abs(s.lensTarget - s.lens) > 0.4 ||
        Math.abs(s.lensV) > 0.4 ||
        Math.abs(s.tx - s.mx) + Math.abs(s.ty - s.my) > 0.4;
      if (busy && s.visible) s.raf = requestAnimationFrame(frame);
      else s.last = 0;
    };

    const wake = () => {
      if (!s.raf && s.visible) s.raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      s.loaded = true;
      draw();
      wake();
    };
    img.onerror = () => setFailed(true);
    img.src = encodeURI(src);

    applyPalette();
    resize();

    const ro = new ResizeObserver(() => {
      resize();
      if (s.loaded) draw();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(([entry]) => {
      s.visible = entry.isIntersecting;
      if (s.visible) wake();
    });
    io.observe(wrap);

    const mo = new MutationObserver(() => {
      applyPalette();
      if (s.loaded) draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const toLocal = (e) => {
      const rect = wrap.getBoundingClientRect();
      s.tx = (e.clientX - rect.left) * s.dpr;
      s.ty = (e.clientY - rect.top) * s.dpr;
    };
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      if (!s.hover) {
        toLocal(e);
        s.mx = s.tx;
        s.my = s.ty;
      }
      s.hover = true;
      toLocal(e);
      wake();
    };
    const onLeave = () => {
      s.hover = false;
      wake();
    };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(s.raf);
      wakeRef.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      img.onload = null;
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
    // crop & imageSize adalah konstanta dari pemanggil
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0 }}>
      {failed ? (
        <img src={src} alt={alt} style={{ filter: 'grayscale(1) contrast(1.1)' }} />
      ) : (
        <canvas ref={canvasRef} role="img" aria-label={alt} />
      )}
    </div>
  );
}
