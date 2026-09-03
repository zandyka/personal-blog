import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

export default function ProfileModel3D({ height = 420 }) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    mouseX: 0, mouseY: 0,
    isHovered: false,
    clickBurst: false,
    time: 0,
  });

  const init = useCallback(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.z = 5;

    // --- Main Gem (icosahedron) ---
    const gemGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const gemMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color('#FF3B1D'),
      emissive: new THREE.Color('#FFAA00'),
      emissiveIntensity: 0.18,
      shininess: 120,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    scene.add(gem);

    // --- Wireframe Overlay ---
    const wireGeo = new THREE.IcosahedronGeometry(1.45, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FFAA00'),
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // --- Inner Glow Core ---
    const coreGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FF3B1D'),
      transparent: true,
      opacity: 0.12,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // --- Outer Ring (torus) ---
    const torusGeo = new THREE.TorusGeometry(2.1, 0.025, 8, 80);
    const torusMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FF3B1D'),
      transparent: true,
      opacity: 0.3,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 2.5;
    scene.add(torus);

    // second ring
    const torus2Geo = new THREE.TorusGeometry(2.3, 0.015, 8, 80);
    const torus2Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FFAA00'),
      transparent: true,
      opacity: 0.2,
    });
    const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
    torus2.rotation.x = Math.PI / 3;
    torus2.rotation.y = Math.PI / 4;
    scene.add(torus2);

    // --- Orbiting Particles ---
    const particles = [];
    const particleCount = 14;
    for (let i = 0; i < particleCount; i++) {
      const pGeo = new THREE.SphereGeometry(0.045, 6, 6);
      const isLime = i % 2 === 0;
      const pMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(isLime ? '#FF3B1D' : '#FFAA00'),
        transparent: true,
        opacity: 0.85,
      });
      const p = new THREE.Mesh(pGeo, pMat);
      const orbitRadius = 2.0 + (i % 3) * 0.25;
      const angle = (i / particleCount) * Math.PI * 2;
      const yOffset = Math.sin(i * 1.1) * 0.5;
      p.userData = { angle, orbitRadius, yOffset, speed: 0.25 + i * 0.04 };
      scene.add(p);
      particles.push(p);
    }

    // --- Lights ---
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    const limeLight = new THREE.PointLight(0xFF3B1D, 4, 12);
    limeLight.position.set(3, 2, 2);
    scene.add(limeLight);

    const purpleLight = new THREE.PointLight(0xFFAA00, 3, 10);
    purpleLight.position.set(-3, -2, -1);
    scene.add(purpleLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.8, 8);
    fillLight.position.set(0, 3, 3);
    scene.add(fillLight);

    // --- Mouse Events ---
    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      stateRef.current.mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      stateRef.current.mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onMouseEnter = () => { stateRef.current.isHovered = true; };
    const onMouseLeave = () => { stateRef.current.isHovered = false; stateRef.current.mouseX = 0; stateRef.current.mouseY = 0; };
    const onClick = () => {
      stateRef.current.clickBurst = true;
      setTimeout(() => { stateRef.current.clickBurst = false; }, 700);
    };

    // Touch support
    const onTouchMove = (e) => {
      const touch = e.touches[0];
      const rect = mount.getBoundingClientRect();
      stateRef.current.mouseX = ((touch.clientX - rect.left) / rect.width - 0.5) * 2;
      stateRef.current.mouseY = ((touch.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    mount.addEventListener('mousemove', onMouseMove);
    mount.addEventListener('mouseenter', onMouseEnter);
    mount.addEventListener('mouseleave', onMouseLeave);
    mount.addEventListener('click', onClick);
    mount.addEventListener('touchmove', onTouchMove, { passive: true });
    mount.addEventListener('touchstart', onClick, { passive: true });

    // --- Resize ---
    const onResize = () => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    // --- Animation Loop ---
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const s = stateRef.current;
      s.time += 0.016;
      const t = s.time;

      const speed = s.clickBurst ? 0.09 : (s.isHovered ? 0.022 : 0.007);
      gem.rotation.y += speed;
      wire.rotation.y += speed * 0.65;
      wire.rotation.x += speed * 0.25;

      // Float bob
      const bob = Math.sin(t * 0.9) * 0.14;
      gem.position.y = bob;
      wire.position.y = bob;
      core.position.y = bob;

      // Mouse tilt (smooth interpolation)
      gem.rotation.x += (s.mouseY * 0.38 - gem.rotation.x) * 0.06;
      gem.rotation.z += (-s.mouseX * 0.22 - gem.rotation.z) * 0.06;
      wire.rotation.x = gem.rotation.x;
      wire.rotation.z = gem.rotation.z;

      // Core pulse
      const coreScale = 1 + Math.sin(t * 1.8) * 0.12;
      core.scale.set(coreScale, coreScale, coreScale);

      // Torus rings rotation
      torus.rotation.z += 0.004;
      torus2.rotation.z -= 0.003;
      torus2.rotation.x += 0.002;

      // Particles orbit
      particles.forEach((p) => {
        p.userData.angle += p.userData.speed * 0.016;
        p.position.x = Math.cos(p.userData.angle) * p.userData.orbitRadius;
        p.position.z = Math.sin(p.userData.angle) * p.userData.orbitRadius;
        p.position.y = p.userData.yOffset + bob * 0.4;
      });

      // Animate lights
      limeLight.position.x = Math.cos(t * 0.6) * 3.5;
      limeLight.position.z = Math.sin(t * 0.6) * 3.5;
      purpleLight.position.x = Math.cos(t * 0.4 + Math.PI) * 3.5;
      purpleLight.position.z = Math.sin(t * 0.4 + Math.PI) * 3.5;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      mount.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('mouseenter', onMouseEnter);
      mount.removeEventListener('mouseleave', onMouseLeave);
      mount.removeEventListener('click', onClick);
      mount.removeEventListener('touchmove', onTouchMove);
      mount.removeEventListener('touchstart', onClick);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      gemMat.dispose(); wireMat.dispose(); coreMat.dispose();
      gemGeo.dispose(); wireGeo.dispose(); coreGeo.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div
        ref={mountRef}
        style={{ width: '100%', height: `${height}px`, cursor: 'grab', borderRadius: '20px' }}
      />
      {/* Hint tooltip */}
      <p style={{
        textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)',
        marginTop: '8px', letterSpacing: '0.5px',
      }}>
        ↕ Hover &amp; click to interact
      </p>
    </div>
  );
}