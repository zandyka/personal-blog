import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSoundContext } from './ui/SoundProvider';

/**
 * InteractiveLanyard Component
 * Features:
 * - Slightly reduced scale for elegant proportions and longer hanging strap
 * - Atmospheric background lighting behind the lanyard
 * - 3D ID badge inside a protective plastic card holder frame with top slot hole
 * - Custom user ID card graphics for front (/about/id_card_front.png) and back (/about/id_card_back.png)
 * - Transparent / frameless container (no box border, no outer card frame)
 * - Realistic metal swivel clip & carabiner hooking through the badge hole
 * - Flexible physics-based lanyard strap that bends & ripples as you drag
 * - Harmonic pendulum spring physics simulation on release with natural inertia & air damping
 * - Tap/click directly on the card to flip 180 degrees
 */
export default function InteractiveLanyard() {
  const mountRef = useRef(null);
  const { playClick, playHover } = useSoundContext();
  const [isDragging, setIsDragging] = useState(false);

  // Physics & interaction state
  const physicsRef = useRef({
    pos: new THREE.Vector3(0, -0.42, 0),
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
    // Zoomed-out camera (z = 7.5) to scale down lanyard gracefully with ample breathing room
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.28, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Lights (Key, Fill, Rim & Back Atmosphere)
    const compStyle = getComputedStyle(document.documentElement);
    const themeAccent = compStyle.getPropertyValue('--accent').trim() || '#FF3B1D';
    const themeAccent2 = compStyle.getPropertyValue('--accent-2').trim() || '#FFAA00';

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const topSpot = new THREE.DirectionalLight(0xffffff, 1.5);
    topSpot.position.set(1.5, 6, 4);
    scene.add(topSpot);

    const backFill = new THREE.DirectionalLight(0xffffff, 0.9);
    backFill.position.set(-1.5, 2, -4);
    scene.add(backFill);

    // Atmosphere backlight behind the badge with dynamic theme colors
    const backRimLight = new THREE.PointLight(new THREE.Color(themeAccent2), 5.5, 9);
    backRimLight.position.set(0, -0.2, -1.0);
    scene.add(backRimLight);

    const backRedLight = new THREE.PointLight(new THREE.Color(themeAccent), 4.5, 8);
    backRedLight.position.set(0, -0.5, -1.2);
    scene.add(backRedLight);

    const redGlow = new THREE.PointLight(new THREE.Color(themeAccent), 3.2, 9);
    redGlow.position.set(-2, 1, 3);
    scene.add(redGlow);

    const amberGlow = new THREE.PointLight(new THREE.Color(themeAccent2), 2.5, 9);
    amberGlow.position.set(2, -1, 3);
    scene.add(amberGlow);

    // Dynamically update Three.js lights when theme toggles
    const themeObserver = new MutationObserver(() => {
      try {
        const nextCompStyle = getComputedStyle(document.documentElement);
        const nextAccent = nextCompStyle.getPropertyValue('--accent').trim();
        const nextAccent2 = nextCompStyle.getPropertyValue('--accent-2').trim();
        if (nextAccent) {
          backRedLight.color.set(nextAccent);
          redGlow.color.set(nextAccent);
        }
        if (nextAccent2) {
          backRimLight.color.set(nextAccent2);
          amberGlow.color.set(nextAccent2);
        }
      } catch {}
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // 3. Lanyard Strap Repeating Texture
    const strapCanvas = document.createElement('canvas');
    strapCanvas.width = 128;
    strapCanvas.height = 1024;
    const strapCtx = strapCanvas.getContext('2d');

    strapCtx.fillStyle = '#111116';
    strapCtx.fillRect(0, 0, 128, 1024);

    strapCtx.strokeStyle = themeAccent;
    strapCtx.lineWidth = 3;
    strapCtx.beginPath();
    strapCtx.moveTo(8, 0);
    strapCtx.lineTo(8, 1024);
    strapCtx.moveTo(120, 0);
    strapCtx.lineTo(120, 1024);
    strapCtx.stroke();

    strapCtx.fillStyle = '#ffffff';
    strapCtx.font = 'bold 24px "Space Grotesk", sans-serif';
    strapCtx.textAlign = 'center';
    for (let y = 80; y < 1024; y += 160) {
      strapCtx.save();
      strapCtx.translate(64, y);
      strapCtx.rotate(Math.PI / 2);
      strapCtx.fillStyle = '#ffffff';
      strapCtx.fillText('ZNDYK', 0, 8);
      strapCtx.restore();

      strapCtx.fillStyle = themeAccent2;
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

    // 5. 3D ID Card with Protective Holder Frame (Casing)
    const cardGroup = new THREE.Group();

    // Inner graphic card: width 2.1, height 2.8 (3:4 ratio)
    const cardW = 2.1;
    const cardH = 2.8;

    // Outer holder frame: width 2.26, height 3.02, depth 0.05
    const holderW = 2.26;
    const holderH = 3.02;
    const holderD = 0.05;

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x14141c,
      roughness: 0.35,
      metalness: 0.2,
    });

    // A. Main Holder Body (Backing & Outer Rim)
    const holderBodyGeo = new THREE.BoxGeometry(holderW, holderH, holderD);
    const holderBodyMesh = new THREE.Mesh(holderBodyGeo, frameMat);
    cardGroup.add(holderBodyMesh);

    // B. Holder Top Extension Tab with Lanyard Slot Hole
    const tabH = 0.34;
    const tabW = 1.05;
    const tabGeo = new THREE.BoxGeometry(tabW, tabH, holderD);
    const tabMesh = new THREE.Mesh(tabGeo, frameMat);
    tabMesh.position.set(0, holderH / 2 + tabH / 2 - 0.02, 0);
    cardGroup.add(tabMesh);

    // Slot hole inside the top tab (dark cutout through which the clip hooks)
    const slotHoleGeo = new THREE.BoxGeometry(0.48, 0.12, holderD + 0.01);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
    const slotHoleMesh = new THREE.Mesh(slotHoleGeo, holeMat);
    slotHoleMesh.position.set(0, holderH / 2 + tabH / 2 - 0.02, 0);
    cardGroup.add(slotHoleMesh);

    // Slot hole border rim
    const slotRimGeo = new THREE.RingGeometry(0.18, 0.26, 16);
    const slotRimMat = new THREE.MeshStandardMaterial({ color: 0x242430, metalness: 0.8, roughness: 0.3 });
    const slotRimFront = new THREE.Mesh(slotRimGeo, slotRimMat);
    slotRimFront.position.set(0, holderH / 2 + tabH / 2 - 0.02, holderD / 2 + 0.002);
    cardGroup.add(slotRimFront);

    const slotRimBack = new THREE.Mesh(slotRimGeo, slotRimMat);
    slotRimBack.position.set(0, holderH / 2 + tabH / 2 - 0.02, -holderD / 2 - 0.002);
    slotRimBack.rotation.y = Math.PI;
    cardGroup.add(slotRimBack);

    // C. Inner Graphic Card (Front Face +Z)
    const frontCardGeo = new THREE.PlaneGeometry(cardW, cardH);
    const frontCardMat = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.22,
      metalness: 0.12,
    });
    const frontCardMesh = new THREE.Mesh(frontCardGeo, frontCardMat);
    frontCardMesh.position.set(0, -0.04, holderD / 2 + 0.003);
    cardGroup.add(frontCardMesh);

    // D. Inner Graphic Card (Back Face -Z)
    const backCardGeo = new THREE.PlaneGeometry(cardW, cardH);
    const backCardMat = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.22,
      metalness: 0.12,
    });
    const backCardMesh = new THREE.Mesh(backCardGeo, backCardMat);
    backCardMesh.position.set(0, -0.04, -holderD / 2 - 0.003);
    backCardMesh.rotation.y = Math.PI;
    cardGroup.add(backCardMesh);

    // E. Protective Gloss Layer (Clear Acrylic Glaze)
    const glossMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.08,
    });
    const glossMeshFront = new THREE.Mesh(frontCardGeo, glossMat);
    glossMeshFront.position.set(0, -0.04, holderD / 2 + 0.005);
    cardGroup.add(glossMeshFront);

    scene.add(cardGroup);

    // F. Metal Swivel Clip & Carabiner Hook
    const clipGroup = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f28,
      metalness: 0.9,
      roughness: 0.22,
    });

    const clipBaseY = holderH / 2 + tabH / 2 - 0.02;

    const hookRingGeo = new THREE.TorusGeometry(0.13, 0.028, 8, 24);
    const hookRingMesh = new THREE.Mesh(hookRingGeo, metalMat);
    hookRingMesh.position.set(0, clipBaseY, 0);
    clipGroup.add(hookRingMesh);

    const claspStemGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.28, 12);
    const claspStemMesh = new THREE.Mesh(claspStemGeo, metalMat);
    claspStemMesh.position.set(0, clipBaseY + 0.22, 0);
    clipGroup.add(claspStemMesh);

    const topLoopGeo = new THREE.TorusGeometry(0.1, 0.028, 8, 24);
    const topLoopMesh = new THREE.Mesh(topLoopGeo, metalMat);
    topLoopMesh.position.set(0, clipBaseY + 0.42, 0);
    clipGroup.add(topLoopMesh);

    cardGroup.add(clipGroup);

    // G. Flexible Lanyard Strap Mesh
    const strapSegments = 16;
    // Higher top anchor (y = 2.85) for longer, sleeker hanging strap
    const topAnchor = new THREE.Vector3(0, 2.85, 0);

    const strapCurvePoints = [];
    for (let i = 0; i <= strapSegments; i++) {
      const t = i / strapSegments;
      strapCurvePoints.push(new THREE.Vector3().lerpVectors(topAnchor, new THREE.Vector3(0, 1.4, 0), t));
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

    // 6. Physics Simulation State
    const p = physicsRef.current;
    p.pos.set(0, -0.42, 0);
    p.vel.set(0, 0, 0);

    const getCardAttachPoint = () => {
      const topOffset = new THREE.Vector3(0, clipBaseY + 0.42, 0);
      topOffset.applyEuler(p.rot);
      return new THREE.Vector3().addVectors(p.pos, topOffset);
    };

    const updateStrap = () => {
      const attachPt = getCardAttachPoint();
      const points = [];
      for (let i = 0; i <= strapSegments; i++) {
        const t = i / strapSegments;
        const pt = new THREE.Vector3().lerpVectors(topAnchor, attachPt, t);

        const sag = Math.sin(t * Math.PI) * 0.14 * (1 - Math.min(1, Math.abs(attachPt.x) * 0.7));
        pt.z += sag;
        points.push(pt);
      }

      strapCurve.points = points;
      const newStrapGeo = new THREE.TubeGeometry(strapCurve, 32, 0.07, 8, false);
      strapMesh.geometry.dispose();
      strapMesh.geometry = newStrapGeo;
    };

    // 7. Mouse & Touch Drag Interaction
    const raycaster = p.raycaster;

    const onPointerDown = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const rect = mount.getBoundingClientRect();
      p.pointerPos.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      p.pointerPos.y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(p.pointerPos, camera);
      const intersects = raycaster.intersectObjects([cardGroup], true);

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

        // Tap/click toggles 180° flip
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

    // 8. Physics & Animation Loop
    let lastTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min(0.033, (now - lastTime) / 1000);
      lastTime = now;

      const restPos = new THREE.Vector3(0, -0.42, 0);

      if (!p.isDragging) {
        const springK = 36.0;
        const damping = 0.945;
        const gravity = -9.8;

        const springForce = new THREE.Vector3().subVectors(restPos, p.pos).multiplyScalar(springK);
        springForce.y += gravity * 0.8;

        p.vel.add(springForce.multiplyScalar(dt));
        p.vel.multiplyScalar(Math.pow(damping, dt * 60));
        p.pos.addScaledVector(p.vel, dt);

        if (p.vel.length() < 0.2) {
          const time = now * 0.0015;
          p.pos.x += Math.sin(time * 2.0) * 0.001;
          p.pos.z += Math.cos(time * 1.6) * 0.001;
        }
      }

      const tiltZ = -p.pos.x * 0.35 - p.vel.x * 0.04;
      const tiltX = (p.pos.y - restPos.y) * 0.25 - p.vel.y * 0.03;

      p.rot.z += (tiltZ - p.rot.z) * 0.12;
      p.rot.x += (tiltX - p.rot.x) * 0.12;
      p.rot.y += (p.targetRotY - p.rot.y) * 0.1;

      cardGroup.position.copy(p.pos);
      cardGroup.rotation.copy(p.rot);

      updateStrap();

      renderer.render(scene, camera);
    };

    animate();

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
      themeObserver.disconnect();
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
      holderBodyGeo.dispose();
      tabGeo.dispose();
      slotHoleGeo.dispose();
      slotRimGeo.dispose();
      frontCardGeo.dispose();
      backCardGeo.dispose();
      frameMat.dispose();
      frontCardMat.dispose();
      backCardMat.dispose();
      glossMat.dispose();
      metalMat.dispose();
      strapMesh.geometry.dispose();
      barGeo.dispose();
      renderer.dispose();
    };
  }, []);

  const handleFlip = () => {
    playClick();
    physicsRef.current.targetRotY = physicsRef.current.targetRotY === 0 ? Math.PI : 0;
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
      {/* 3D Viewport — Completely borderless & seamless */}
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
        {/* Bright atmospheric background light directly behind the lanyard */}
        {/* Layer 1: Wide warm ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '48%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '340px',
            height: '340px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent-glow) 0%, var(--accent-2-dim) 45%, transparent 72%)',
            filter: 'blur(42px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {/* Layer 2: Radiant bright amber core halo */}
        <div
          style={{
            position: 'absolute',
            top: '48%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '210px',
            height: '210px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent-border) 0%, var(--accent-dim) 52%, transparent 78%)',
            filter: 'blur(22px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Top subtle horizontal spotlight line where lanyard hangs from */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
            boxShadow: '0 0 14px rgba(255, 255, 255, 0.35)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />

        {/* Three.js Canvas */}
        <div
          ref={mountRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            touchAction: 'none',
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}
