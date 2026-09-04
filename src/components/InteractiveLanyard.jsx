import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Hand } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

/**
 * InteractiveLanyard Component
 * - 3D physics-based hanging ID card on flexible lanyard strap
 * - Custom user ID card graphics for front (/about/id_card_front.png) and back (/about/id_card_back.png)
 * - Borderless / frameless transparent viewport
 * - Full drag-to-pull physics with natural pendulum harmonic oscillation on release
 * - Tap to flip 180 degrees
 */
export default function InteractiveLanyard() {
  const mountRef = useRef(null);
  const { playClick, playHover } = useSoundContext();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Physics & interaction state
  const physicsRef = useRef({
    pos: new THREE.Vector3(0, -0.32, 0),
    vel: new THREE.Vector3(0, 0, 0),
    rot: new THREE.Euler(0, 0, 0),
    targetRotY: 0,
    isDragging: false,
    dragPlane: new THREE.Plane(),
    raycaster: new THREE.Raycaster(),
    dragOffset: new THREE.Vector3(),
    pointerPos: new THREE.Vector2(),
    lastPointerPos: new THREE.Vector2(),
    lastPointerTime: 0,
    dragDistance: 0,
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animId;
    const width = mount.clientWidth || 340;
    const height = mount.clientHeight || 530;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 5.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    const topSpot = new THREE.DirectionalLight(0xffffff, 1.4);
    topSpot.position.set(1.5, 6, 4);
    scene.add(topSpot);

    const backFill = new THREE.DirectionalLight(0xffffff, 0.8);
    backFill.position.set(-1.5, 2, -4);
    scene.add(backFill);

    const redGlow = new THREE.PointLight(0xff3b1d, 3.0, 9);
    redGlow.position.set(-2, 1, 3);
    scene.add(redGlow);

    const amberGlow = new THREE.PointLight(0xffaa00, 2.5, 9);
    amberGlow.position.set(2, -1, 3);
    scene.add(amberGlow);

    // 3. Lanyard Strap Repeating Texture
    const strapCanvas = document.createElement('canvas');
    strapCanvas.width = 128;
    strapCanvas.height = 1024;
    const strapCtx = strapCanvas.getContext('2d');

    strapCtx.fillStyle = '#111116';
    strapCtx.fillRect(0, 0, 128, 1024);

    strapCtx.strokeStyle = 'rgba(255, 59, 29, 0.6)';
    strapCtx.lineWidth = 3;
    strapCtx.beginPath();
    strapCtx.moveTo(8, 0);
    strapCtx.lineTo(8, 1024);
    strapCtx.moveTo(120, 0);
    strapCtx.lineTo(120, 1024);
    strapCtx.stroke();

    strapCtx.fillStyle = '#ffffff';
    strapCtx.font = 'bold 24px "JetBrains Mono", monospace';
    strapCtx.textAlign = 'center';
    for (let y = 80; y < 1024; y += 160) {
      strapCtx.save();
      strapCtx.translate(64, y);
      strapCtx.rotate(Math.PI / 2);
      strapCtx.fillStyle = '#ffffff';
      strapCtx.fillText('ZNDYK', 0, 8);
      strapCtx.restore();

      strapCtx.fillStyle = '#FFAA00';
      strapCtx.beginPath();
      strapCtx.arc(64, y + 60, 4, 0, Math.PI * 2);
      strapCtx.fill();
    }

    const strapTexture = new THREE.CanvasTexture(strapCanvas);
    strapTexture.wrapS = THREE.RepeatWrapping;
    strapTexture.wrapT = THREE.RepeatWrapping;
    strapTexture.colorSpace = THREE.SRGBColorSpace;

    // 4. Load User's Custom Front & Back ID Card Textures
    const textureLoader = new THREE.TextureLoader();

    const frontTexture = textureLoader.load('/about/id_card_front.png');
    frontTexture.colorSpace = THREE.SRGBColorSpace;
    frontTexture.generateMipmaps = true;
    frontTexture.minFilter = THREE.LinearMipmapLinearFilter;

    const backTexture = textureLoader.load('/about/id_card_back.png');
    backTexture.colorSpace = THREE.SRGBColorSpace;
    backTexture.generateMipmaps = true;
    backTexture.minFilter = THREE.LinearMipmapLinearFilter;

    // 5. 3D Card Geometry & Materials
    // Ratio 3:4 (width 2.1, height 2.8)
    const cardW = 2.1;
    const cardH = 2.8;
    const cardD = 0.045;
    const cardGeo = new THREE.BoxGeometry(cardW, cardH, cardD);

    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0x14141c,
      metalness: 0.85,
      roughness: 0.25,
    });

    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.22,
      metalness: 0.12,
    });

    const backMat = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.22,
      metalness: 0.12,
    });

    const cardMesh = new THREE.Mesh(cardGeo, [
      edgeMat, // +x
      edgeMat, // -x
      edgeMat, // +y
      edgeMat, // -y
      frontMat, // +z (front face)
      backMat,  // -z (back face)
    ]);
    scene.add(cardMesh);

    // Metal Clip / Clasp at top of card
    const clipGroup = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1c1c24,
      metalness: 0.9,
      roughness: 0.2,
    });

    // Swivel ring
    const ringGeo = new THREE.TorusGeometry(0.12, 0.025, 8, 24);
    const ringMesh = new THREE.Mesh(ringGeo, metalMat);
    ringMesh.position.set(0, cardH / 2 + 0.1, 0);
    clipGroup.add(ringMesh);

    // Carabiner clip stem
    const hookGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.28, 12);
    const hookMesh = new THREE.Mesh(hookGeo, metalMat);
    hookMesh.position.set(0, cardH / 2 + 0.26, 0);
    clipGroup.add(hookMesh);

    // Top loop attached to strap
    const topLoopGeo = new THREE.TorusGeometry(0.1, 0.025, 8, 24);
    const topLoopMesh = new THREE.Mesh(topLoopGeo, metalMat);
    topLoopMesh.position.set(0, cardH / 2 + 0.42, 0);
    clipGroup.add(topLoopMesh);

    cardMesh.add(clipGroup);

    // 6. Flexible Lanyard Strap (Ribbon Curve)
    const strapSegments = 16;
    const topAnchor = new THREE.Vector3(0, 2.45, 0);

    const strapCurvePoints = [];
    for (let i = 0; i <= strapSegments; i++) {
      const t = i / strapSegments;
      strapCurvePoints.push(new THREE.Vector3().lerpVectors(topAnchor, new THREE.Vector3(0, 1.2, 0), t));
    }

    const strapCurve = new THREE.CatmullRomCurve3(strapCurvePoints);
    const strapGeo = new THREE.TubeGeometry(strapCurve, 32, 0.07, 8, false);
    const strapMat = new THREE.MeshStandardMaterial({
      map: strapTexture,
      roughness: 0.6,
      metalness: 0.1,
    });
    const strapMesh = new THREE.Mesh(strapGeo, strapMat);
    scene.add(strapMesh);

    // Top anchor light beam / rod
    const barGeo = new THREE.CylinderGeometry(0.025, 0.025, 3.2, 12);
    const barMesh = new THREE.Mesh(barGeo, metalMat);
    barMesh.rotation.z = Math.PI / 2;
    barMesh.position.copy(topAnchor);
    scene.add(barMesh);

    // 7. Physics State Initialization
    const p = physicsRef.current;
    p.pos.set(0, -0.32, 0);
    p.vel.set(0, 0, 0);

    const getCardAttachPoint = () => {
      const topOffset = new THREE.Vector3(0, cardH / 2 + 0.42, 0);
      topOffset.applyEuler(p.rot);
      return new THREE.Vector3().addVectors(p.pos, topOffset);
    };

    const updateStrap = () => {
      const attachPt = getCardAttachPoint();
      const points = [];
      for (let i = 0; i <= strapSegments; i++) {
        const t = i / strapSegments;
        const pt = new THREE.Vector3().lerpVectors(topAnchor, attachPt, t);

        // Subtle ribbon sag curvature
        const sag = Math.sin(t * Math.PI) * 0.14 * (1 - Math.min(1, Math.abs(attachPt.x) * 0.7));
        pt.z += sag;
        points.push(pt);
      }

      strapCurve.points = points;
      const newStrapGeo = new THREE.TubeGeometry(strapCurve, 32, 0.07, 8, false);
      strapMesh.geometry.dispose();
      strapMesh.geometry = newStrapGeo;
    };

    // 8. Pointer Drag Handlers
    const raycaster = p.raycaster;

    const onPointerDown = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const rect = mount.getBoundingClientRect();
      p.pointerPos.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      p.pointerPos.y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(p.pointerPos, camera);
      const intersects = raycaster.intersectObjects([cardMesh], true);

      if (intersects.length > 0) {
        p.isDragging = true;
        setIsDragging(true);
        p.dragDistance = 0;
        p.lastPointerPos.copy(p.pointerPos);
        p.lastPointerTime = performance.now();

        p.dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()).negate(), p.pos);

        const planeIntersect = new THREE.Vector3();
        raycaster.ray.intersectPlane(p.dragPlane, planeIntersect);
        p.dragOffset.subVectors(p.pos, planeIntersect);
      }
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const rect = mount.getBoundingClientRect();
      const currentPointer = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -(((clientY - rect.top) / rect.height) * 2 - 1)
      );

      redGlow.position.x = currentPointer.x * 3.5;
      redGlow.position.y = currentPointer.y * 3.5;

      if (!p.isDragging) return;

      raycaster.setFromCamera(currentPointer, camera);
      const planeIntersect = new THREE.Vector3();

      if (raycaster.ray.intersectPlane(p.dragPlane, planeIntersect)) {
        const targetPos = new THREE.Vector3().addVectors(planeIntersect, p.dragOffset);

        // Limit maximum pull distance from top anchor so it doesn't break
        const maxDist = 3.6;
        const fromAnchor = new THREE.Vector3().subVectors(targetPos, topAnchor);
        if (fromAnchor.length() > maxDist) {
          fromAnchor.setLength(maxDist);
          targetPos.addVectors(topAnchor, fromAnchor);
        }

        const now = performance.now();
        const dt = Math.max(0.01, (now - p.lastPointerTime) / 1000);
        p.vel.subVectors(targetPos, p.pos).divideScalar(dt);
        p.vel.clampLength(0, 24);

        p.dragDistance += targetPos.distanceTo(p.pos);
        p.pos.copy(targetPos);

        p.lastPointerPos.copy(currentPointer);
        p.lastPointerTime = now;
      }
    };

    const onPointerUp = () => {
      if (p.isDragging) {
        p.isDragging = false;
        setIsDragging(false);

        // If simple tap without dragging, flip card
        if (p.dragDistance < 0.12) {
          handleFlip();
        }
      }
    };

    mount.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    mount.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 9. Animation & Physics Simulation Loop
    let lastTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min(0.033, (now - lastTime) / 1000);
      lastTime = now;

      const restPos = new THREE.Vector3(0, -0.32, 0);

      if (!p.isDragging) {
        // Damped harmonic pendulum spring physics
        const springK = 36.0;
        const damping = 0.945;
        const gravity = -9.8;

        const springForce = new THREE.Vector3().subVectors(restPos, p.pos).multiplyScalar(springK);
        springForce.y += gravity * 0.8;

        p.vel.add(springForce.multiplyScalar(dt));
        p.vel.multiplyScalar(Math.pow(damping, dt * 60));
        p.pos.addScaledVector(p.vel, dt);

        // Ambient idle breathing sway
        if (p.vel.length() < 0.2) {
          const time = now * 0.0015;
          p.pos.x += Math.sin(time * 2.0) * 0.001;
          p.pos.z += Math.cos(time * 1.6) * 0.001;
        }
      }

      // Tilt card according to displacement & velocity
      const tiltZ = -p.pos.x * 0.35 - p.vel.x * 0.04;
      const tiltX = (p.pos.y - restPos.y) * 0.25 - p.vel.y * 0.03;

      p.rot.z += (tiltZ - p.rot.z) * 0.12;
      p.rot.x += (tiltX - p.rot.x) * 0.12;
      p.rot.y += (p.targetRotY - p.rot.y) * 0.1;

      cardMesh.position.copy(p.pos);
      cardMesh.rotation.copy(p.rot);

      updateStrap();

      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      mount.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      if (renderer && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      frontTexture.dispose();
      backTexture.dispose();
      strapTexture.dispose();
      cardGeo.dispose();
      ringGeo.dispose();
      hookGeo.dispose();
      topLoopGeo.dispose();
      strapMesh.geometry.dispose();
      barGeo.dispose();
      renderer.dispose();
    };
  }, []);

  const handleFlip = () => {
    playClick();
    setIsFlipped((prev) => {
      const next = !prev;
      physicsRef.current.targetRotY = next ? Math.PI : 0;
      return next;
    });
  };

  const handleSwingFlick = () => {
    playClick();
    physicsRef.current.vel.x = (Math.random() > 0.5 ? 1 : -1) * 8.5;
    physicsRef.current.vel.y = -3.5;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '360px',
        margin: '0 auto',
        userSelect: 'none',
      }}
    >
      {/* 3D Viewport Box — Completely borderless & seamless (NO frame/box) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '520px',
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          overflow: 'visible',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Top subtle horizontal spotlight line where lanyard hangs from */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '12%',
            right: '12%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.45) 50%, transparent 100%)',
            boxShadow: '0 0 14px rgba(255, 255, 255, 0.35)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />

        {/* Three.js Canvas */}
        <div
          ref={mountRef}
          style={{
            width: '100%',
            height: '100%',
            touchAction: 'none',
          }}
        />
      </div>

      {/* Control Buttons below */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '6px',
          width: '100%',
        }}
      >
        <button
          onClick={handleFlip}
          onMouseEnter={playHover}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 16px',
            borderRadius: '999px',
            background: 'rgba(255, 59, 29, 0.12)',
            border: '1px solid rgba(255, 59, 29, 0.3)',
            color: '#FF3B1D',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <RotateCw size={12} />
          <span>{isFlipped ? 'Lihat Sisi Depan' : 'Lihat Sisi Belakang'}</span>
        </button>

        <button
          onClick={handleSwingFlick}
          onMouseEnter={playHover}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '7px 14px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <span>Ayukan Kartu 🎯</span>
        </button>
      </div>
    </div>
  );
}
