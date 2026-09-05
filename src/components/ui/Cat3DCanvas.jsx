import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Configuration per 3D model for scale, orientation, and floor alignment
const MODEL_CONFIGS = {
  '/3d/maxwell_the_cat_with_bones_animation.glb': {
    targetHeight: 1.7,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    floorY: -0.85,
    cameraDist: 3.3,
    cameraY: 0.25,
  },
  '/3d/cat_box_meme.glb': {
    targetHeight: 1.65,
    rotX: -Math.PI / 2, // Fix OBJ orientation so box sits upright
    rotY: 0,
    rotZ: 0,
    floorY: -0.85,
    cameraDist: 3.3,
    cameraY: 0.25,
  },
  '/3d/oiiaioooooiai_cat.glb': {
    targetHeight: 1.55, // Enlarge Oiia cat to match Maxwell's presence
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    floorY: -0.85,
    cameraDist: 3.3,
    cameraY: 0.25,
  },
};

const Cat3DCanvas = forwardRef(function Cat3DCanvas(
  {
    modelUrl = '/3d/maxwell_the_cat_with_bones_animation.glb',
    autoRotate = true,
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
  const modelBaseYRef = useRef(null);
  const spinTrickRef = useRef(null);

  useImperativeHandle(ref, () => ({
    triggerSpinTrick: () => {
      if (!controlsRef.current || spinTrickRef.current) return;
      const startAngle = controlsRef.current.getAzimuthalAngle();
      const startTime = performance.now();
      const duration = 850;
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

    // 2. Camera: Framed closer to the ground so the model is centered and grounded
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 3.4);
    cameraRef.current = camera;

    // 3. WebGL Renderer with Alpha
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
    controls.target.set(0, -0.05, 0);
    controls.minPolarAngle = Math.PI * 0.22;
    controls.maxPolarAngle = Math.PI * 0.68;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.4;
    controlsRef.current = controls;

    // 5. Lighting Setup
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(3.5, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf2efff, 1.8);
    fillLight.position.set(-3.5, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff6633, 2.6);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const bottomLight = new THREE.DirectionalLight(0xffffff, 1.2);
    bottomLight.position.set(0, -3, 0);
    scene.add(bottomLight);

    // 6. Contact Shadow Disc at Floor Level (-0.85)
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.68)');
    gradient.addColorStop(0.45, 'rgba(0, 0, 0, 0.32)');
    gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.08)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const shadowTexture = new THREE.CanvasTexture(canvas);
    const shadowGeo = new THREE.PlaneGeometry(2.8, 2.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.85;
    scene.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;

    // 7. Render Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Update Skeletal AnimationMixer if present
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Very subtle breathing hover right at floor level (no floating high up)
      if (modelRef.current && modelBaseYRef.current !== null) {
        const hoverOffset = Math.sin(elapsedTime * 2.0) * 0.015;
        modelRef.current.position.y = modelBaseYRef.current + hoverOffset;
        if (shadowMeshRef.current) {
          shadowMeshRef.current.scale.setScalar(1 - hoverOffset * 0.5);
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
      } else {
        controls.update();
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
      modelBaseYRef.current = null;
    }
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }

    const config = MODEL_CONFIGS[modelUrl] || {
      targetHeight: 1.65,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      floorY: -0.85,
    };

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;

        // 1. Apply orientation correction FIRST (e.g. for cat in box Z-up fix)
        model.rotation.x = config.rotX || 0;
        model.rotation.y = config.rotY || 0;
        model.rotation.z = config.rotZ || 0;
        model.updateMatrixWorld(true);

        // 2. Measure dimensions
        const rawBox = new THREE.Box3().setFromObject(model);
        const rawSize = new THREE.Vector3();
        rawBox.getSize(rawSize);

        // 3. Compute scale by target height
        const currentHeight = rawSize.y > 0 ? rawSize.y : Math.max(rawSize.x, rawSize.z);
        const scale = config.targetHeight / currentHeight;
        model.scale.setScalar(scale);
        model.updateMatrixWorld(true);

        // 4. Measure scaled bounding box
        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);

        // 5. Center horizontally at origin (0, 0)
        model.position.x = -scaledCenter.x;
        model.position.z = -scaledCenter.z;

        // 6. EXACT FLOOR ALIGNMENT:
        // Position lowest vertex of the model right on the floor level (-0.85)
        const targetFloorY = config.floorY;
        model.position.y = targetFloorY - scaledBox.min.y;

        // Save base Y position for subtle floating
        modelBaseYRef.current = model.position.y;

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
