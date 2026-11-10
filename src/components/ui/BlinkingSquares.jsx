import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;

uniform vec2  uRes;
uniform float uTime;
uniform float uGrid;
uniform vec2  uDir;
uniform float uFalloff;
uniform float uFadeStart;
uniform float uFadeEnd;
uniform float uSquareSize;
uniform float uMinBright;
uniform float uTwinkleSpeed;
uniform float uTwinkleStrength;
uniform float uIntensity;
uniform float uAlpha;
uniform vec3  uSquare;
uniform vec3  uBg;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 cellsXY = vec2(uGrid * aspect, uGrid);
  if (aspect < 1.0) cellsXY = vec2(uGrid, uGrid / max(aspect, 0.0001));

  vec2 gridUv = vUv * cellsXY;
  vec2 cellId = floor(gridUv);
  vec2 cellUv = fract(gridUv) - 0.5;

  vec2 cellCenter = (cellId + 0.5) / cellsXY;
  vec2 centered = cellCenter * 2.0 - 1.0;
  float t = clamp(dot(centered, uDir) * 0.5 + 0.5, 0.0, 1.0);

  float fs = clamp(uFadeStart, 0.0, 0.999);
  float fe = clamp(uFadeEnd, fs + 0.001, 1.0);
  float remap = clamp((t - fs) / (fe - fs), 0.0, 1.0);
  float density = pow(remap, max(uFalloff, 0.0001));

  float gate = hash21(cellId + 11.7);
  float bRnd = hash21(cellId + 47.3);
  float pRnd = hash21(cellId + 91.1);

  float lit = step(gate, density);

  float half_ = clamp(uSquareSize, 0.05, 0.98) * 0.5;
  float inside = step(abs(cellUv.x), half_) * step(abs(cellUv.y), half_);

  float baseBright = mix(clamp(uMinBright, 0.0, 1.0), 1.0, bRnd);

  float phase = pRnd * 6.2831853;
  float speed = uTwinkleSpeed * (0.6 + 0.8 * bRnd);
  float pulse = 0.5 + 0.5 * sin(uTime * speed + phase);
  float twinkle = mix(1.0 - uTwinkleStrength, 1.0, pulse);

  float mask = inside * lit * baseBright * twinkle * uIntensity;

  vec3 col = mix(uBg, uSquare, clamp(mask, 0.0, 1.0));
  gl_FragColor = vec4(col, mask * uAlpha);
}
`;

function hexToRgb(hex) {
  if (!hex) return [1, 1, 1];
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) / 255;
    const g = parseInt(clean[1] + clean[1], 16) / 255;
    const b = parseInt(clean[2] + clean[2], 16) / 255;
    return [r, g, b];
  }
  const match = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clean);
  return match
    ? [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255]
    : [1, 1, 1];
}

function getDirectionVec(direction) {
  switch (direction) {
    case 'left': return [-1, 0];
    case 'top': return [0, 1];
    case 'bottom': return [0, -1];
    case 'all':
    case 'none': return [0, 0];
    case 'right':
    default: return [1, 0];
  }
}

export default function BlinkingSquares({
  direction = 'right',
  gridSize = 52,
  squareColor = '#ffffff',
  backgroundColor = '#000000',
  falloff = 1.25,
  fadeStart = 0.15,
  fadeEnd = 1.0,
  squareSize = 0.57,
  minBrightness = 0.55,
  twinkleSpeed = 1.4,
  twinkleStrength = 0.94,
  intensity = 1.0,
  opacity = 0.15,
  dpr = 1.5,
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const uniformsRef = useRef(null);

  // Sync color & opacity updates directly to uniforms without recreating WebGL context
  useEffect(() => {
    if (uniformsRef.current) {
      const [sqR, sqG, sqB] = hexToRgb(squareColor);
      uniformsRef.current.uSquare.value.set(sqR, sqG, sqB);
      uniformsRef.current.uAlpha.value = opacity;
    }
  }, [squareColor, opacity]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL initialization failed for BlinkingSquares', e);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dpr));
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const [sqR, sqG, sqB] = hexToRgb(squareColor);
    const [bgR, bgG, bgB] = hexToRgb(backgroundColor);
    const [dirX, dirY] = getDirectionVec(direction);

    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(width, height) },
      uGrid: { value: gridSize },
      uDir: { value: new THREE.Vector2(dirX, dirY) },
      uFalloff: { value: falloff },
      uFadeStart: { value: fadeStart },
      uFadeEnd: { value: fadeEnd },
      uSquareSize: { value: squareSize },
      uMinBright: { value: minBrightness },
      uTwinkleSpeed: { value: twinkleSpeed },
      uTwinkleStrength: { value: twinkleStrength },
      uIntensity: { value: intensity },
      uAlpha: { value: opacity },
      uSquare: { value: new THREE.Vector3(sqR, sqG, sqB) },
      uBg: { value: new THREE.Vector3(bgR, bgG, bgB) },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      renderer.setSize(width, height);
      uniforms.uRes.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [
    direction,
    gridSize,
    falloff,
    fadeStart,
    fadeEnd,
    squareSize,
    minBrightness,
    twinkleSpeed,
    twinkleStrength,
    intensity,
    dpr,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}