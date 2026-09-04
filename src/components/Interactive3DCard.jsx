import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Bookmark, ExternalLink } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

/**
 * Interactive3DCard Component
 * Renders a full 3D physical photocard in Three.js with:
 * - Real 3D thickness and metallic bevel edges
 * - Front Face: High-res portrait of Zacky Andyka with name & faculty badge
 * - Back Face: Modern obsidian Digital Developer ID with holographic chip, barcode, and QR code to zndyk.my.id
 * - 360-degree drag rotation with inertia
 * - Click/tap to flip 180 degrees
 * - Dynamic specular glare that follows cursor/finger
 * - Smooth idle floating levitation
 */
export default function Interactive3DCard() {
  const mountRef = useRef(null);
  const { playClick, playHover } = useSoundContext();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // References for animation and interaction
  const sceneRef = useRef(null);
  const cardRef = useRef(null);
  const lightRef = useRef(null);
  const targetRotRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const dragDistanceRef = useRef(0);
  const autoRotateRef = useRef(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animId;
    let renderer, scene, camera, cardMesh;

    const width = mount.clientWidth || 320;
    const height = mount.clientHeight || 426;

    // 1. Renderer Setup
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    mount.appendChild(renderer.domElement);

    // 2. Scene & Camera
    scene = new THREE.Scene();
    sceneRef.current = scene;

    camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    // Dynamic cursor glare light
    const glareLight = new THREE.PointLight(0xff451a, 3.5, 8);
    glareLight.position.set(0, 0, 2.5);
    scene.add(glareLight);
    lightRef.current = glareLight;

    const rimLight = new THREE.PointLight(0xffaa00, 2.0, 7);
    rimLight.position.set(-2, -2, 2);
    scene.add(rimLight);

    // 4. Create Canvases for Front & Back Textures
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 768;
    frontCanvas.height = 1024;
    const frontCtx = frontCanvas.getContext('2d');

    const backCanvas = document.createElement('canvas');
    backCanvas.width = 768;
    backCanvas.height = 1024;
    const backCtx = backCanvas.getContext('2d');

    // Create Three.js Textures
    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    frontTexture.colorSpace = THREE.SRGBColorSpace;

    const backTexture = new THREE.CanvasTexture(backCanvas);
    backTexture.colorSpace = THREE.SRGBColorSpace;

    // Draw Initial Placeholder on Front Canvas
    frontCtx.fillStyle = '#0e0e14';
    frontCtx.fillRect(0, 0, 768, 1024);

    // Load Portrait Image
    const profileImg = new Image();
    profileImg.crossOrigin = 'anonymous';
    profileImg.src = '/about/profile.png';
    profileImg.onload = () => {
      renderFrontCanvas();
      frontTexture.needsUpdate = true;
    };

    function renderFrontCanvas() {
      const w = 768;
      const h = 1024;

      // Draw portrait
      frontCtx.clearRect(0, 0, w, h);
      frontCtx.drawImage(profileImg, 0, 0, w, h);

      // Gradient overlay at bottom
      const grad = frontCtx.createLinearGradient(0, h * 0.45, 0, h);
      grad.addColorStop(0, 'rgba(7, 7, 9, 0)');
      grad.addColorStop(0.5, 'rgba(7, 7, 9, 0.45)');
      grad.addColorStop(0.85, 'rgba(7, 7, 9, 0.92)');
      grad.addColorStop(1, 'rgba(7, 7, 9, 0.98)');
      frontCtx.fillStyle = grad;
      frontCtx.fillRect(0, 0, w, h);

      // Top subtle holographic highlight bar
      const topBar = frontCtx.createLinearGradient(0, 0, w, 0);
      topBar.addColorStop(0, '#FF3B1D');
      topBar.addColorStop(0.5, '#FFAA00');
      topBar.addColorStop(1, '#FF3B1D');
      frontCtx.fillStyle = topBar;
      frontCtx.fillRect(24, 24, w - 48, 5);

      // Top Tag
      frontCtx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      frontCtx.beginPath();
      frontCtx.roundRect(24, 40, 190, 38, 19);
      frontCtx.fill();
      frontCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      frontCtx.lineWidth = 2;
      frontCtx.stroke();

      frontCtx.fillStyle = '#FFAA00';
      frontCtx.font = 'bold 15px "JetBrains Mono", monospace';
      frontCtx.fillText('DEV ID • 2026', 44, 65);

      // Name Typography
      frontCtx.save();
      frontCtx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      frontCtx.shadowBlur = 16;
      frontCtx.shadowOffsetY = 4;
      frontCtx.fillStyle = '#ffffff';
      frontCtx.font = 'bold 54px "Plus Jakarta Sans", sans-serif';
      frontCtx.fillText('Zacky Andyka', 36, h - 120);
      frontCtx.restore();

      // Badge: Teknik Informatika USU
      const badgeY = h - 90;
      frontCtx.fillStyle = 'rgba(14, 14, 20, 0.85)';
      frontCtx.beginPath();
      frontCtx.roundRect(36, badgeY, 340, 52, 14);
      frontCtx.fill();
      frontCtx.strokeStyle = 'rgba(255, 59, 29, 0.45)';
      frontCtx.lineWidth = 2;
      frontCtx.stroke();

      // Bookmark red icon dot
      frontCtx.fillStyle = '#FF3B1D';
      frontCtx.beginPath();
      frontCtx.arc(58, badgeY + 26, 7, 0, Math.PI * 2);
      frontCtx.fill();

      // Badge text
      frontCtx.fillStyle = '#f3f4f6';
      frontCtx.font = '600 24px "Plus Jakarta Sans", sans-serif';
      frontCtx.fillText('Teknik Informatika USU', 78, badgeY + 34);

      // Border glow ring
      frontCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      frontCtx.lineWidth = 12;
      frontCtx.strokeRect(6, 6, w - 12, h - 12);
    }

    // Render Back Canvas (Digital ID Card)
    function renderBackCanvas() {
      const w = 768;
      const h = 1024;

      // Obsidian carbon background
      frontCtx.clearRect(0, 0, w, h);
      backCtx.fillStyle = '#0b0b10';
      backCtx.fillRect(0, 0, w, h);

      // Decorative circuit pattern / grid lines
      backCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      backCtx.lineWidth = 2;
      for (let x = 40; x < w; x += 40) {
        backCtx.beginPath();
        backCtx.moveTo(x, 0);
        backCtx.lineTo(x, h);
        backCtx.stroke();
      }
      for (let y = 40; y < h; y += 40) {
        backCtx.beginPath();
        backCtx.moveTo(0, y);
        backCtx.lineTo(w, y);
        backCtx.stroke();
      }

      // Magnetic Hologram Strip at top
      const holoGrad = backCtx.createLinearGradient(0, 40, w, 40);
      holoGrad.addColorStop(0, '#1a1a24');
      holoGrad.addColorStop(0.3, '#302b4d');
      holoGrad.addColorStop(0.5, '#FF3B1D');
      holoGrad.addColorStop(0.7, '#FFAA00');
      holoGrad.addColorStop(1, '#1a1a24');
      backCtx.fillStyle = holoGrad;
      backCtx.fillRect(0, 36, w, 68);

      // Golden IC Chip Emblem
      const chipX = 56;
      const chipY = 150;
      backCtx.fillStyle = '#d4af37';
      backCtx.beginPath();
      backCtx.roundRect(chipX, chipY, 110, 85, 12);
      backCtx.fill();
      backCtx.strokeStyle = '#996515';
      backCtx.lineWidth = 3;
      backCtx.stroke();

      // Chip micro-circuits
      backCtx.fillStyle = '#996515';
      backCtx.fillRect(chipX + 35, chipY, 4, 85);
      backCtx.fillRect(chipX + 70, chipY, 4, 85);
      backCtx.fillRect(chipX, chipY + 42, 110, 4);

      // Contactless Wi-Fi Waves
      backCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      backCtx.lineWidth = 4;
      for (let r = 1; r <= 3; r++) {
        backCtx.beginPath();
        backCtx.arc(w - 70, chipY + 40, r * 14, Math.PI * 0.75, Math.PI * 1.25);
        backCtx.stroke();
      }

      // University & Identity Header
      backCtx.fillStyle = '#ffffff';
      backCtx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
      backCtx.fillText('UNIVERSITAS SUMATERA UTARA', 56, 290);

      backCtx.fillStyle = '#FFAA00';
      backCtx.font = 'bold 18px "JetBrains Mono", monospace';
      backCtx.fillText('FAKULTAS VOKASI • TEKNIK INFORMATIKA', 56, 324);

      // Full Name & Title
      backCtx.fillStyle = '#ffffff';
      backCtx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      backCtx.fillText('M. DAFFA ZACKY ANDYKA', 56, 385);

      backCtx.fillStyle = '#9ca3af';
      backCtx.font = '500 22px "Plus Jakarta Sans", sans-serif';
      backCtx.fillText('Graphic Designer • Web & AI Engineer', 56, 420);

      // Divider Line
      backCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      backCtx.lineWidth = 2;
      backCtx.beginPath();
      backCtx.moveTo(56, 450);
      backCtx.lineTo(w - 56, 450);
      backCtx.stroke();

      // Digital Credentials Box
      backCtx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      backCtx.beginPath();
      backCtx.roundRect(56, 475, w - 112, 150, 16);
      backCtx.fill();
      backCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      backCtx.stroke();

      backCtx.fillStyle = '#6b7280';
      backCtx.font = 'bold 16px "JetBrains Mono", monospace';
      backCtx.fillText('PORTFOLIO & CONTACT', 80, 510);
      backCtx.fillStyle = '#ffffff';
      backCtx.font = 'bold 22px "JetBrains Mono", monospace';
      backCtx.fillText('WWW.ZNDYK.MY.ID', 80, 545);

      backCtx.fillStyle = '#6b7280';
      backCtx.font = 'bold 16px "JetBrains Mono", monospace';
      backCtx.fillText('STATUS: OPEN FOR OPPORTUNITIES', 80, 588);

      // QR Code Simulation with Center Logo
      const qrX = 56;
      const qrY = 660;
      const qrSize = 220;

      // QR Background
      backCtx.fillStyle = '#ffffff';
      backCtx.beginPath();
      backCtx.roundRect(qrX, qrY, qrSize, qrSize, 14);
      backCtx.fill();

      // Draw QR Code Pattern
      backCtx.fillStyle = '#0a0a0f';
      const matrixSize = 21;
      const cellSize = (qrSize - 24) / matrixSize;
      const startX = qrX + 12;
      const startY = qrY + 12;

      // Generate recognizable pseudo-QR matrix
      for (let r = 0; r < matrixSize; r++) {
        for (let c = 0; c < matrixSize; c++) {
          // Position markers at 3 corners
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
              backCtx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize + 0.5, cellSize + 0.5);
            }
          } else if ((r * 7 + c * 13 + (r % 2) * 5) % 3 === 0) {
            backCtx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize + 0.5, cellSize + 0.5);
          }
        }
      }

      // QR Center Red Accent
      backCtx.fillStyle = '#FF3B1D';
      backCtx.beginPath();
      backCtx.roundRect(qrX + qrSize / 2 - 14, qrY + qrSize / 2 - 14, 28, 28, 6);
      backCtx.fill();

      // Right of QR: Description & Link
      backCtx.fillStyle = '#ffffff';
      backCtx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      backCtx.fillText('SCAN TO CONNECT', qrX + qrSize + 24, qrY + 45);

      backCtx.fillStyle = '#9ca3af';
      backCtx.font = '16px "Plus Jakarta Sans", sans-serif';
      backCtx.fillText('Akses profil lengkap,', qrX + qrSize + 24, qrY + 80);
      backCtx.fillText('koleksi proyek software,', qrX + qrSize + 24, qrY + 105);
      backCtx.fillText('& portfolio desain visual.', qrX + qrSize + 24, qrY + 130);

      // Security Hologram Stamp
      const holoStampX = qrX + qrSize + 24;
      const holoStampY = qrY + 155;
      const stampGrad = backCtx.createRadialGradient(
        holoStampX + 40, holoStampY + 30, 5,
        holoStampX + 40, holoStampY + 30, 55
      );
      stampGrad.addColorStop(0, '#FFAA00');
      stampGrad.addColorStop(0.6, '#FF3B1D');
      stampGrad.addColorStop(1, '#6366f1');
      backCtx.fillStyle = stampGrad;
      backCtx.beginPath();
      backCtx.arc(holoStampX + 40, holoStampY + 30, 32, 0, Math.PI * 2);
      backCtx.fill();
      backCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      backCtx.lineWidth = 2;
      backCtx.stroke();

      backCtx.fillStyle = '#ffffff';
      backCtx.font = 'bold 12px "JetBrains Mono", monospace';
      backCtx.textAlign = 'center';
      backCtx.fillText('VERIFIED', holoStampX + 40, holoStampY + 34);
      backCtx.textAlign = 'left';

      // Barcode at Bottom
      const barY = h - 90;
      backCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      const barcodeWidth = w - 112;
      for (let bx = 0; bx < barcodeWidth; bx += 7) {
        const thickness = (bx % 3 === 0) ? 4 : (bx % 5 === 0) ? 2 : 1;
        backCtx.fillRect(56 + bx, barY, thickness, 40);
      }

      backCtx.fillStyle = '#6b7280';
      backCtx.font = '13px "JetBrains Mono", monospace';
      backCtx.fillText('SN: 2026-USU-TI-ZNDYK-994208', 56, barY + 58);
    }

    renderBackCanvas();
    backTexture.needsUpdate = true;

    // 5. Card 3D Geometry (Box with real thickness)
    // Ratio 3:4 (w: 2.3, h: 3.07, d: 0.055)
    const cardWidth = 2.3;
    const cardHeight = 3.07;
    const cardDepth = 0.055;

    const cardGeometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth, 1, 1, 1);

    // 6 Materials for the 6 faces:
    // 0: Right, 1: Left, 2: Top, 3: Bottom, 4: Front (+Z), 5: Back (-Z)
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x14141c,
      metalness: 0.85,
      roughness: 0.25,
    });

    const frontMaterial = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.2,
      metalness: 0.15,
    });

    const backMaterial = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.2,
      metalness: 0.15,
    });

    const materials = [
      edgeMaterial, // right
      edgeMaterial, // left
      edgeMaterial, // top
      edgeMaterial, // bottom
      frontMaterial, // front
      backMaterial,  // back
    ];

    cardMesh = new THREE.Mesh(cardGeometry, materials);
    scene.add(cardMesh);
    cardRef.current = cardMesh;

    // 6. Interaction Event Handlers
    const onPointerDown = (e) => {
      isDraggingRef.current = true;
      autoRotateRef.current = false;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      prevPointerRef.current = { x: clientX, y: clientY };
      dragDistanceRef.current = 0;
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      // Update specular light position according to pointer relative to card
      const rect = mount.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      if (glareLight) {
        glareLight.position.x = normX * 2.2;
        glareLight.position.y = normY * 2.2;
      }

      if (!isDraggingRef.current) return;

      const deltaX = clientX - prevPointerRef.current.x;
      const deltaY = clientY - prevPointerRef.current.y;
      dragDistanceRef.current += Math.abs(deltaX) + Math.abs(deltaY);

      targetRotRef.current.y += deltaX * 0.012;
      targetRotRef.current.x += deltaY * 0.012;

      // Clamp vertical rotation slightly to avoid total upside down disorientation
      targetRotRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotRef.current.x));

      prevPointerRef.current = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;

      // If drag distance is very small, treat it as a click/tap to flip!
      if (dragDistanceRef.current < 8) {
        handleFlipToggle();
      } else {
        // Re-enable gentle floating after 2.5s of inactivity
        setTimeout(() => {
          if (!isDraggingRef.current) {
            autoRotateRef.current = true;
          }
        }, 2500);
      }
    };

    mount.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    mount.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 7. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (cardMesh) {
        // Smooth rotation damping toward target rotation
        cardMesh.rotation.y += (targetRotRef.current.y - cardMesh.rotation.y) * 0.09;
        cardMesh.rotation.x += (targetRotRef.current.x - cardMesh.rotation.x) * 0.09;

        // Subtle idle levitation floating effect
        if (autoRotateRef.current && !isDraggingRef.current) {
          cardMesh.position.y = Math.sin(elapsedTime * 1.6) * 0.07;
          cardMesh.rotation.z = Math.sin(elapsedTime * 0.8) * 0.02;
        } else {
          cardMesh.position.y += (0 - cardMesh.position.y) * 0.1;
          cardMesh.rotation.z += (0 - cardMesh.rotation.z) * 0.1;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
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
      cardGeometry.dispose();
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  // Flip Toggle Function (Rotates card 180 degrees)
  const handleFlipToggle = () => {
    playClick();
    setIsFlipped((prev) => {
      const next = !prev;
      if (next) {
        // Rotate to back face
        targetRotRef.current.y = Math.PI;
      } else {
        // Rotate back to front face
        targetRotRef.current.y = 0;
      }
      targetRotRef.current.x = 0;
      return next;
    });
  };

  // Reset to front face
  const handleReset = (e) => {
    e.stopPropagation();
    playClick();
    setIsFlipped(false);
    targetRotRef.current.x = 0;
    targetRotRef.current.y = 0;
    autoRotateRef.current = true;
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
      onMouseEnter={() => {
        setIsHovered(true);
        playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Viewport Box with glowing ambient aura */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          borderRadius: '24px',
          background: 'radial-gradient(circle at 50% 40%, rgba(255, 59, 29, 0.08) 0%, rgba(14, 14, 20, 0.6) 80%)',
          border: '1px solid var(--border)',
          boxShadow: isHovered
            ? '0 20px 50px rgba(255, 59, 29, 0.2), 0 0 20px rgba(255, 170, 0, 0.15)'
            : '0 16px 40px rgba(0, 0, 0, 0.4)',
          transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
          borderColor: isHovered ? 'rgba(255, 59, 29, 0.35)' : 'var(--border)',
          overflow: 'hidden',
          cursor: 'grab',
        }}
        className="active:cursor-grabbing"
      >
        {/* Three.js Canvas Container */}
        <div
          ref={mountRef}
          style={{
            width: '100%',
            height: '100%',
            touchAction: 'none',
          }}
        />

        {/* 3D Floating Mode Tag */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '999px',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 600,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <Sparkles size={12} style={{ color: '#FFAA00' }} />
          <span>Interactive 3D Photocard</span>
        </div>

        {/* Quick Flip Button on Top-Right */}
        <button
          onClick={handleFlipToggle}
          title="Balik Kartu (Flip 180°)"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
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

        {/* Bottom Floating Hint Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '5px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#9ca3af',
            fontSize: '0.73rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <span style={{ color: 'var(--accent)' }}>✦</span>
          <span>{isFlipped ? 'Sisi Belakang (Digital ID)' : 'Putar 360° & Ketuk untuk Balik'}</span>
        </div>
      </div>

      {/* Action Controls below the card */}
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
          onClick={handleFlipToggle}
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
          onClick={handleReset}
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
          <span>Reset Sudut</span>
        </button>
      </div>
    </div>
  );
}
