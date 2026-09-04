import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Hand } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

/**
 * InteractiveLanyard Component
 * Features:
 * - 3D physics-based hanging ID badge on a flexible lanyard strap
 * - Full drag-and-pull interaction: grab the badge, pull it anywhere, watch the strap bend and swing
 * - Damped pendulum physics on release with natural oscillations and gravity
 * - 3D flip on tap to view the back of the ID badge (QR code & digital portfolio details)
 * - Dynamic lighting and specular sheen
 */
export default function InteractiveLanyard() {
  const mountRef = useRef(null);
  const { playClick, playHover } = useSoundContext();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Interaction & Physics refs
  const physicsRef = useRef({
    // Card position and physics state
    pos: new THREE.Vector3(0, -0.45, 0),
    vel: new THREE.Vector3(0, 0, 0),
    rot: new THREE.Euler(0, 0, 0),
    rotVel: new THREE.Vector3(0, 0, 0),
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
    const height = mount.clientHeight || 520;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const topSpot = new THREE.DirectionalLight(0xffffff, 1.6);
    topSpot.position.set(1, 5, 4);
    scene.add(topSpot);

    const redGlow = new THREE.PointLight(0xff3b1d, 3.0, 9);
    redGlow.position.set(-2, 1, 3);
    scene.add(redGlow);

    const amberGlow = new THREE.PointLight(0xffaa00, 2.5, 9);
    amberGlow.position.set(2, -1, 3);
    scene.add(amberGlow);

    // 3. Texture Generation: Lanyard Strap Texture
    const strapCanvas = document.createElement('canvas');
    strapCanvas.width = 128;
    strapCanvas.height = 1024;
    const strapCtx = strapCanvas.getContext('2d');

    // Black fabric strap background
    strapCtx.fillStyle = '#111116';
    strapCtx.fillRect(0, 0, 128, 1024);

    // Side stitching lines
    strapCtx.strokeStyle = 'rgba(255, 59, 29, 0.5)';
    strapCtx.lineWidth = 3;
    strapCtx.beginPath();
    strapCtx.moveTo(8, 0);
    strapCtx.lineTo(8, 1024);
    strapCtx.moveTo(120, 0);
    strapCtx.lineTo(120, 1024);
    strapCtx.stroke();

    // Center repeating logo / monogram
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

      // Subtle diamond icon
      strapCtx.fillStyle = '#FFAA00';
      strapCtx.beginPath();
      strapCtx.arc(64, y + 60, 4, 0, Math.PI * 2);
      strapCtx.fill();
    }

    const strapTexture = new THREE.CanvasTexture(strapCanvas);
    strapTexture.wrapS = THREE.RepeatWrapping;
    strapTexture.wrapT = THREE.RepeatWrapping;
    strapTexture.colorSpace = THREE.SRGBColorSpace;

    // 4. Texture Generation: Card Front & Back
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 768;
    frontCanvas.height = 1152;
    const frontCtx = frontCanvas.getContext('2d');

    const backCanvas = document.createElement('canvas');
    backCanvas.width = 768;
    backCanvas.height = 1152;
    const backCtx = backCanvas.getContext('2d');

    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    frontTexture.colorSpace = THREE.SRGBColorSpace;

    const backTexture = new THREE.CanvasTexture(backCanvas);
    backTexture.colorSpace = THREE.SRGBColorSpace;

    // Load Portrait
    const profileImg = new Image();
    profileImg.crossOrigin = 'anonymous';
    profileImg.src = '/about/profile.png';
    profileImg.onload = () => {
      drawFrontBadge();
      frontTexture.needsUpdate = true;
    };

    function drawFrontBadge() {
      const w = 768;
      const h = 1152;
      frontCtx.clearRect(0, 0, w, h);

      // Dark card base
      frontCtx.fillStyle = '#0b0b10';
      frontCtx.fillRect(0, 0, w, h);

      // Top slot hole indicator
      frontCtx.fillStyle = '#1c1c26';
      frontCtx.beginPath();
      frontCtx.roundRect(w / 2 - 50, 24, 100, 20, 10);
      frontCtx.fill();
      frontCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      frontCtx.lineWidth = 2;
      frontCtx.stroke();

      // Left Vertical Brand Bar
      const sideBarWidth = 140;
      const gradSide = frontCtx.createLinearGradient(0, 0, 0, h);
      gradSide.addColorStop(0, '#FF3B1D');
      gradSide.addColorStop(0.5, '#FFAA00');
      gradSide.addColorStop(1, '#FF3B1D');
      frontCtx.fillStyle = gradSide;
      frontCtx.fillRect(20, 60, sideBarWidth, h - 80);

      // Big Vertical Text on Left Sidebar: "ZACKY ANDYKA"
      frontCtx.save();
      frontCtx.translate(90, h - 140);
      frontCtx.rotate(-Math.PI / 2);
      frontCtx.fillStyle = '#000000';
      frontCtx.font = '900 68px "Plus Jakarta Sans", sans-serif';
      frontCtx.letterSpacing = '2px';
      frontCtx.fillText('ZNDYK', 0, 0);
      frontCtx.restore();

      // Right: Photo Area
      const photoX = 180;
      const photoY = 60;
      const photoW = w - photoX - 20;
      const photoH = h - 340;

      frontCtx.save();
      frontCtx.beginPath();
      frontCtx.roundRect(photoX, photoY, photoW, photoH, 16);
      frontCtx.clip();
      frontCtx.drawImage(profileImg, photoX, photoY, photoW, photoH);

      // Subtle shadow gradient over photo
      const photoGrad = frontCtx.createLinearGradient(0, photoY + photoH * 0.6, 0, photoY + photoH);
      photoGrad.addColorStop(0, 'transparent');
      photoGrad.addColorStop(1, 'rgba(11, 11, 16, 0.85)');
      frontCtx.fillStyle = photoGrad;
      frontCtx.fillRect(photoX, photoY, photoW, photoH);
      frontCtx.restore();

      // Photo frame border
      frontCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      frontCtx.lineWidth = 3;
      frontCtx.beginPath();
      frontCtx.roundRect(photoX, photoY, photoW, photoH, 16);
      frontCtx.stroke();

      // Bottom Info Card Section (Light / Clean contrast container like image)
      const bottomY = h - 260;
      frontCtx.fillStyle = '#ffffff';
      frontCtx.beginPath();
      frontCtx.roundRect(20, bottomY, w - 40, 230, 20);
      frontCtx.fill();

      // Bottom Section Content
      frontCtx.fillStyle = '#09090b';
      frontCtx.font = '900 38px "Plus Jakarta Sans", sans-serif';
      frontCtx.fillText('ZACKY ANDYKA', 44, bottomY + 54);

      frontCtx.fillStyle = '#FF3B1D';
      frontCtx.font = 'bold 20px "JetBrains Mono", monospace';
      frontCtx.fillText('WEB & AI ENGINEER • GRAPHIC DESIGN', 44, bottomY + 86);

      frontCtx.fillStyle = '#52525b';
      frontCtx.font = '600 19px "Plus Jakarta Sans", sans-serif';
      frontCtx.fillText('Universitas Sumatera Utara • F. Vokasi', 44, bottomY + 116);

      // Barcode at bottom
      const barY = bottomY + 140;
      const barW = w - 88;
      frontCtx.fillStyle = '#09090b';
      for (let bx = 0; bx < barW; bx += 8) {
        const lineThick = (bx % 3 === 0) ? 5 : (bx % 5 === 0) ? 3 : 1.5;
        frontCtx.fillRect(44 + bx, barY, lineThick, 46);
      }

      frontCtx.fillStyle = '#71717a';
      frontCtx.font = '13px "JetBrains Mono", monospace';
      frontCtx.fillText('ID: 2026-USU-TI-ZNDYK-001', 44, barY + 66);

      // Green Active Status Dot
      frontCtx.fillStyle = '#22c55e';
      frontCtx.beginPath();
      frontCtx.arc(w - 70, bottomY + 50, 8, 0, Math.PI * 2);
      frontCtx.fill();
    }

    function drawBackBadge() {
      const w = 768;
      const h = 1152;
      backCtx.clearRect(0, 0, w, h);

      // Dark obsidian background
      backCtx.fillStyle = '#0a0a0f';
      backCtx.fillRect(0, 0, w, h);

      // Top slot hole indicator
      backCtx.fillStyle = '#1c1c26';
      backCtx.beginPath();
      backCtx.roundRect(w / 2 - 50, 24, 100, 20, 10);
      backCtx.fill();

      // Hologram magnetic strip
      const magGrad = backCtx.createLinearGradient(0, 70, w, 70);
      magGrad.addColorStop(0, '#1f1f2e');
      magGrad.addColorStop(0.3, '#FF3B1D');
      magGrad.addColorStop(0.7, '#FFAA00');
      magGrad.addColorStop(1, '#1f1f2e');
      backCtx.fillStyle = magGrad;
      backCtx.fillRect(0, 64, w, 80);

      // Back Header
      backCtx.fillStyle = '#ffffff';
      backCtx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      backCtx.fillText('OFFICIAL DIGITAL CREDENTIAL', 50, 200);

      backCtx.fillStyle = '#a1a1aa';
      backCtx.font = '18px "Plus Jakarta Sans", sans-serif';
      backCtx.fillText('Portfolio, AI Research & Creative Works', 50, 230);

      // Golden Chip
      const chipX = 50;
      const chipY = 270;
      backCtx.fillStyle = '#d4af37';
      backCtx.beginPath();
      backCtx.roundRect(chipX, chipY, 110, 85, 12);
      backCtx.fill();
      backCtx.strokeStyle = '#8c6d17';
      backCtx.lineWidth = 3;
      backCtx.stroke();

      backCtx.fillStyle = '#8c6d17';
      backCtx.fillRect(chipX + 35, chipY, 4, 85);
      backCtx.fillRect(chipX + 70, chipY, 4, 85);
      backCtx.fillRect(chipX, chipY + 42, 110, 4);

      // Wi-Fi wave icon
      backCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      backCtx.lineWidth = 3;
      for (let r = 1; r <= 3; r++) {
        backCtx.beginPath();
        backCtx.arc(w - 70, chipY + 42, r * 14, Math.PI * 0.75, Math.PI * 1.25);
        backCtx.stroke();
      }

      // QR Code Box
      const qrSize = 260;
      const qrX = w / 2 - qrSize / 2;
      const qrY = 410;

      backCtx.fillStyle = '#ffffff';
      backCtx.beginPath();
      backCtx.roundRect(qrX, qrY, qrSize, qrSize, 20);
      backCtx.fill();

      // Draw QR Pattern
      backCtx.fillStyle = '#0a0a0f';
      const matrixSize = 21;
      const cellSize = (qrSize - 32) / matrixSize;
      const sX = qrX + 16;
      const sY = qrY + 16;

      for (let r = 0; r < matrixSize; r++) {
        for (let c = 0; c < matrixSize; c++) {
          const isCornerTL = r < 7 && c < 7;
          const isCornerTR = r < 7 && c >= matrixSize - 7;
          const isCornerBL = r >= matrixSize - 7 && c < 7;

          if (isCornerTL || isCornerTR || isCornerBL) {
            const inOuter = (r === 0 || r === 6 || c === 0 || c === 6) && isCornerTL;
            const inOuterTR = (r === 0 || r === 6 || c === matrixSize - 7 || c === matrixSize - 1) && isCornerTR;
            const inOuterBL = (r === matrixSize - 7 || r === matrixSize - 1 || c === 0 || c === 6) && isCornerBL;
            const inInner = r >= 2 && r <= 4 && c >= 2 && c <= 4 && isCornerTL;
            const inInnerTR = r >= 2 && r <= 4 && c >= matrixSize - 5 && c <= matrixSize - 3 && isCornerTR;
            const inInnerBL = r >= matrixSize - 5 && r >= matrixSize - 3 && c >= 2 && c <= 4 && isCornerBL;

            if (inOuter || inOuterTR || inOuterBL || inInner || inInnerTR || inInnerBL) {
              backCtx.fillRect(sX + c * cellSize, sY + r * cellSize, cellSize + 0.5, cellSize + 0.5);
            }
          } else if ((r * 7 + c * 13 + (r % 2) * 5) % 3 === 0) {
            backCtx.fillRect(sX + c * cellSize, sY + r * cellSize, cellSize + 0.5, cellSize + 0.5);
          }
        }
      }

      // Red center logo on QR
      backCtx.fillStyle = '#FF3B1D';
      backCtx.beginPath();
      backCtx.roundRect(qrX + qrSize / 2 - 16, qrY + qrSize / 2 - 16, 32, 32, 6);
      backCtx.fill();

      // Scan Instructions
      backCtx.fillStyle = '#ffffff';
      backCtx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      backCtx.textAlign = 'center';
      backCtx.fillText('SCAN TO VISIT LIVE PORTFOLIO', w / 2, qrY + qrSize + 45);

      backCtx.fillStyle = '#FFAA00';
      backCtx.font = 'bold 22px "JetBrains Mono", monospace';
      backCtx.fillText('WWW.ZNDYK.MY.ID', w / 2, qrY + qrSize + 80);

      backCtx.fillStyle = '#71717a';
      backCtx.font = '16px "Plus Jakarta Sans", sans-serif';
      backCtx.fillText('Fakultas Vokasi • Universitas Sumatera Utara', w / 2, qrY + qrSize + 115);
      backCtx.textAlign = 'left';

      // Verified security stamp
      const sealX = w / 2 - 80;
      const sealY = h - 220;
      backCtx.fillStyle = 'rgba(255, 59, 29, 0.12)';
      backCtx.beginPath();
      backCtx.roundRect(sealX, sealY, 160, 48, 24);
      backCtx.fill();
      backCtx.strokeStyle = 'rgba(255, 59, 29, 0.4)';
      backCtx.lineWidth = 2;
      backCtx.stroke();

      backCtx.fillStyle = '#FF3B1D';
      backCtx.font = 'bold 16px "JetBrains Mono", monospace';
      backCtx.textAlign = 'center';
      backCtx.fillText('✓ VERIFIED CREATIVE', w / 2, sealY + 30);
      backCtx.textAlign = 'left';

      // Bottom Barcode
      const barY = h - 100;
      backCtx.fillStyle = '#ffffff';
      for (let bx = 0; bx < w - 100; bx += 7) {
        const lineThick = (bx % 3 === 0) ? 4 : (bx % 5 === 0) ? 2.5 : 1;
        backCtx.fillRect(50 + bx, barY, lineThick, 36);
      }
    }

    drawFrontBadge();
    drawBackBadge();

    // 5. 3D Meshes Construction
    // A. Card Mesh
    const cardW = 2.1;
    const cardH = 3.15;
    const cardD = 0.05;
    const cardGeo = new THREE.BoxGeometry(cardW, cardH, cardD);

    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0x14141c,
      metalness: 0.85,
      roughness: 0.2,
    });

    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.25,
      metalness: 0.1,
    });

    const backMat = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.25,
      metalness: 0.1,
    });

    const cardMesh = new THREE.Mesh(cardGeo, [
      edgeMat, // +x
      edgeMat, // -x
      edgeMat, // +y
      edgeMat, // -y
      frontMat, // +z (front)
      backMat,  // -z (back)
    ]);
    scene.add(cardMesh);

    // B. Metal Clip / Clasp at top of card
    const clipGroup = new THREE.Group();

    // Swivel clasp ring
    const ringGeo = new THREE.TorusGeometry(0.12, 0.025, 8, 24);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x22222a,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ringMesh = new THREE.Mesh(ringGeo, metalMat);
    ringMesh.position.set(0, cardH / 2 + 0.12, 0);
    clipGroup.add(ringMesh);

    // Metal hook / carabiner latch
    const hookGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.32, 12);
    const hookMesh = new THREE.Mesh(hookGeo, metalMat);
    hookMesh.position.set(0, cardH / 2 + 0.3, 0);
    clipGroup.add(hookMesh);

    // Top loop connecting to lanyard
    const topLoopGeo = new THREE.TorusGeometry(0.1, 0.025, 8, 24);
    const topLoopMesh = new THREE.Mesh(topLoopGeo, metalMat);
    topLoopMesh.position.set(0, cardH / 2 + 0.48, 0);
    clipGroup.add(topLoopMesh);

    cardMesh.add(clipGroup);

    // C. Flexible Lanyard Strap Mesh (Ribbon Curve)
    const strapSegments = 16;
    const strapCurvePoints = [];
    const topAnchor = new THREE.Vector3(0, 2.7, 0);

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

    // Top anchor bracket / bar
    const barGeo = new THREE.CylinderGeometry(0.03, 0.03, 3.2, 12);
    const barMesh = new THREE.Mesh(barGeo, metalMat);
    barMesh.rotation.z = Math.PI / 2;
    barMesh.position.copy(topAnchor);
    scene.add(barMesh);

    // 6. Physics Simulation Logic
    const p = physicsRef.current;
    p.pos.set(0, -0.45, 0);
    p.vel.set(0, 0, 0);

    // Target anchor point on card where strap attaches: card top
    const getCardAttachPoint = () => {
      const topOffset = new THREE.Vector3(0, cardH / 2 + 0.48, 0);
      topOffset.applyEuler(p.rot);
      return new THREE.Vector3().addVectors(p.pos, topOffset);
    };

    // Update strap geometry along curve
    const updateStrap = () => {
      const attachPt = getCardAttachPoint();
      const points = [];
      for (let i = 0; i <= strapSegments; i++) {
        const t = i / strapSegments;
        // Interpolate position from top anchor to attachment point
        const pt = new THREE.Vector3().lerpVectors(topAnchor, attachPt, t);

        // Add subtle catenary sag / cloth curvature in the middle
        const sag = Math.sin(t * Math.PI) * 0.15 * (1 - Math.min(1, Math.abs(attachPt.x)));
        pt.z += sag;
        points.push(pt);
      }

      strapCurve.points = points;
      const newStrapGeo = new THREE.TubeGeometry(strapCurve, 32, 0.07, 8, false);
      strapMesh.geometry.dispose();
      strapMesh.geometry = newStrapGeo;
    };

    // 7. Mouse & Touch Interaction
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

        // Setup plane facing camera at card's depth for dragging
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

      // Move specular glow light
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

        // Calculate velocity while dragging
        const now = performance.now();
        const dt = Math.max(0.01, (now - p.lastPointerTime) / 1000);
        p.vel.subVectors(targetPos, p.pos).divideScalar(dt);
        p.vel.clampLength(0, 25); // cap speed

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

        // Check if it was a simple tap/click (dragged less than 0.1 units)
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

    // 8. Animation & Physics Loop
    let lastTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min(0.033, (now - lastTime) / 1000);
      lastTime = now;

      // Natural Equilibrium rest position
      const restPos = new THREE.Vector3(0, -0.45, 0);

      if (!p.isDragging) {
        // --- Pendulum & Spring Physics Simulation ---
        // Spring force pulling card back toward rest position
        const springK = 38.0; // Spring stiffness
        const damping = 0.94; // Air resistance / friction
        const gravity = -9.8; // Gravity

        // Force = -k * (x - rest)
        const springForce = new THREE.Vector3().subVectors(restPos, p.pos).multiplyScalar(springK);

        // Gravity pull downwards
        springForce.y += gravity * 0.8;

        // Apply acceleration to velocity: v += a * dt
        p.vel.add(springForce.multiplyScalar(dt));
        p.vel.multiplyScalar(Math.pow(damping, dt * 60)); // smooth damping

        // Update position: pos += v * dt
        p.pos.addScaledVector(p.vel, dt);

        // Subtle ambient micro-breeze when nearly at rest
        if (p.vel.length() < 0.2) {
          const time = now * 0.0015;
          p.pos.x += Math.sin(time * 2.2) * 0.001;
          p.pos.z += Math.cos(time * 1.8) * 0.001;
        }
      }

      // --- Rotational Dynamics ---
      // Tilt card according to lateral pull displacement & velocity
      const tiltZ = -p.pos.x * 0.35 - p.vel.x * 0.04;
      const tiltX = (p.pos.y - restPos.y) * 0.25 - p.vel.y * 0.03;

      // Smoothly interpolate rotations
      p.rot.z += (tiltZ - p.rot.z) * 0.12;
      p.rot.x += (tiltX - p.rot.x) * 0.12;
      p.rot.y += (p.targetRotY - p.rot.y) * 0.1;

      // Apply to mesh
      cardMesh.position.copy(p.pos);
      cardMesh.rotation.copy(p.rot);

      // Update the hanging lanyard strap
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
    // Give a playful impulse swing
    physicsRef.current.vel.x = (Math.random() > 0.5 ? 1 : -1) * 8.0;
    physicsRef.current.vel.y = -3.0;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '340px',
        margin: '0 auto',
        userSelect: 'none',
      }}
    >
      {/* 3D Viewport Box */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '490px',
          borderRadius: '24px',
          background: 'radial-gradient(circle at 50% 15%, rgba(255, 59, 29, 0.08) 0%, rgba(14, 14, 20, 0.7) 75%)',
          border: '1px solid var(--border)',
          boxShadow: isDragging
            ? '0 24px 60px rgba(255, 59, 29, 0.25), 0 0 30px rgba(255, 170, 0, 0.2)'
            : '0 16px 40px rgba(0, 0, 0, 0.45)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          borderColor: isDragging ? 'rgba(255, 59, 29, 0.5)' : 'var(--border)',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Top Spotlight Bar Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent 10%, #FF3B1D 35%, #FFAA00 50%, #FF3B1D 65%, transparent 90%)',
            boxShadow: '0 0 16px #FF3B1D',
            zIndex: 10,
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

        {/* Badge Tag at Top Left */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '999px',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 600,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <Sparkles size={12} style={{ color: '#FFAA00' }} />
          <span>Interactive 3D Lanyard</span>
        </div>

        {/* Quick Flip Button at Top Right */}
        <button
          onClick={handleFlip}
          title="Balik Kartu (Flip 180°)"
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.25s, background-color 0.25s',
            zIndex: 10,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(180deg)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotate(0deg)')}
        >
          <RotateCw size={14} />
        </button>

        {/* Interactive Floating Hint */}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '5px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#9ca3af',
            fontSize: '0.72rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <Hand size={12} style={{ color: 'var(--accent)' }} />
          <span>Tarik kartu untuk mengayun • Ketuk untuk balik</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '12px',
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
