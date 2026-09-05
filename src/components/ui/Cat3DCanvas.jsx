import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Cat3DCanvas = forwardRef(function Cat3DCanvas(
  {
    modelUrl = '/3d/maxwell_the_cat_with_bones_animation.glb',
    autoRotate = false,
    onAngleChange,
    onClick,
  },
  ref
) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Three.js internal references
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const mixerRef = useRef(null);
  const animIdRef = useRef(null);
  const shadowMeshRef = useRef(null);

  // Target angle animation state
  const targetAzimuthRef = useRef(null);
  const spinTrickRef = useRef(null);

  useImperativeHandle(ref, () => ({
    setAngle: (deg) => {
      if (!controlsRef.current) return;
      let rad = THREE.MathUtils.degToRad(deg);
      if (rad > Math.PI) rad -= 2 * Math.PI;
      targetAzimuthRef.current = rad;
    },
    triggerSpinTrick: () => {
      if (!controlsRef.current || spinTrickRef.current) return;
      const startAngle = controlsRef.current.getAzimuthalAngle();
      const startTime = performance.now();
      const duration = 850; // ms
      spinTrickRef.current = { startAngle, startTime, duration };
    },
  }));

  // Initial Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 3.8);
    cameraRef.current = camera;

    // 3. WebGL Renderer with Alpha (Transparent Background)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false; // Prevent page scroll hijack
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.22;
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.8;
    controlsRef.current = controls;

    // 5. Lighting Setup
    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.9);
    keyLight.position.set(3.5, 5, 4);
    scene.add(keyLight);

    // Fill Light (Soft)
    const fillLight = new THREE.DirectionalLight(0xf2efff, 1.8);
    fillLight.position.set(-3.5, 2, 3);
    scene.add(fillLight);

    // Rim/Back Light (Warm Accent)
    const rimLight = new THREE.DirectionalLight(0xff6633, 2.5);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // Top Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    // Bottom Bounce Light
    const bottomLight = new THREE.DirectionalLight(0xffffff, 1.1);
    bottomLight.position.set(0, -3, 0);
    scene.add(bottomLight);

    // 6. Contact Shadow Disc beneath the cat
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.58)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.22)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const shadowTexture = new THREE.CanvasTexture(canvas);
    const shadowGeo = new THREE.PlaneGeometry(2.5, 2.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.15;
    scene.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;

    // 7. Render Animation Loop
    let lastAngleReported = -999;
    const clock = new THREE.Clock();

    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Update Skeletal AnimationMixer if present
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Gentle floating levitation motion on model
      if (modelRef.current) {
        modelRef.current.position.y = Math.sin(elapsedTime * 1.8) * 0.05 + 0.05;
        if (shadowMeshRef.current) {
          shadowMeshRef.current.scale.setScalar(1 - Math.sin(elapsedTime * 1.8) * 0.04);
        }
      }

      // Handle Spin Trick Animation
      if (spinTrickRef.current) {
        const { startAngle, startTime, duration } = spinTrickRef.current;
        const now = performance.now();
        const progress = Math.min(1, (now - startTime) / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        const newAzimuth = startAngle + ease * Math.PI * 2;

        const dist = camera.position.distanceTo(controls.target);
        const pol = controls.getPolarAngle();
        camera.position.x = controls.target.x + dist * Math.sin(pol) * Math.sin(newAzimuth);
        camera.position.z = controls.target.z + dist * Math.sin(pol) * Math.cos(newAzimuth);
        camera.lookAt(controls.target);

        if (progress >= 1) {
          spinTrickRef.current = null;
        }
      }
      // Handle Target Azimuth smooth interpolation
      else if (targetAzimuthRef.current !== null) {
        const curAzimuth = controls.getAzimuthalAngle();
        let diff = targetAzimuthRef.current - curAzimuth;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));

        if (Math.abs(diff) > 0.01) {
          const step = diff * 0.12;
          const newAzimuth = curAzimuth + step;
          const dist = camera.position.distanceTo(controls.target);
          const pol = controls.getPolarAngle();
          camera.position.x = controls.target.x + dist * Math.sin(pol) * Math.sin(newAzimuth);
          camera.position.z = controls.target.z + dist * Math.sin(pol) * Math.cos(newAzimuth);
          camera.lookAt(controls.target);
        } else {
          targetAzimuthRef.current = null;
        }
      } else {
        controls.update();
      }

      // Report current angle in degrees
      if (controlsRef.current && onAngleChange) {
        const rad = controlsRef.current.getAzimuthalAngle();
        let deg = THREE.MathUtils.radToDeg(rad);
        deg = ((deg % 360) + 360) % 360;
        const rounded = Math.round(deg);
        if (Math.abs(rounded - lastAngleReported) >= 1) {
          lastAngleReported = rounded;
          onAngleChange(rounded);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();
    };
  }, []);

  // Load / Reload GLB Model whenever modelUrl changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    setLoading(true);
    setLoadError(null);

    // Clean up previous model and mixer
    if (modelRef.current) {
      scene.remove(modelRef.current);
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
      modelRef.current = null;
    }
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;

        // Auto-center model at origin (0, 0, 0)
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);

        // Auto-normalize bounding scale
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const targetScale = 2.4 / maxDim;
          model.scale.setScalar(targetScale);
        }

        // Slightly adjust Y so paws sit directly above the shadow
        model.position.y += 0.05;

        // Material optimization
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.side = THREE.DoubleSide;
              if (child.material.roughness !== undefined) {
                child.material.roughness = Math.min(child.material.roughness, 0.7);
              }
            }
          }
        });

        // Bone / Skeletal Animation
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
          mixerRef.current = mixer;
        }

        scene.add(model);
        modelRef.current = model;
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('Failed to load 3D model:', err);
        setLoadError('Gagal memuat model 3D');
        setLoading(false);
      }
    );
  }, [modelUrl]);

  // Update autoRotate dynamically when prop changes
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: 'grab',
        touchAction: 'none',
      }}
    >
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            color: 'var(--text-muted)',
            fontSize: '12px',
            fontFamily: "'JetBrains Mono', monospace",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '2px solid var(--border)',
              borderTopColor: 'var(--accent)',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span>Memuat 3D Model...</span>
        </div>
      )}

      {loadError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--danger, #ef4444)',
            fontSize: '12px',
            fontFamily: "'JetBrains Mono', monospace",
            zIndex: 10,
          }}
        >
          {loadError}
        </div>
      )}
    </div>
  );
});

export default Cat3DCanvas;
