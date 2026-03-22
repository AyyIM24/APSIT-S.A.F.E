import React, { useRef, useEffect, useContext } from 'react';
import * as THREE from 'three';
import { ThemeContext } from '../contexts/ThemeContext';

/**
 * ThreeBackground — Three.js floating icosahedron particles with mouse parallax
 * 90-120 small particles slowly rotating and drifting in purple/blue palette.
 * Full-screen, behind all content, pointer-events: none.
 */
const ThreeBackground = () => {
  const mountRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const popupGroup = new THREE.Group();
    scene.add(popupGroup);

    const purpleLightColor = theme === 'light' ? 0xc084fc : 0x764ba2;
    const purpleLight = new THREE.PointLight(purpleLightColor, 2, 100);
    purpleLight.position.set(10, 10, 20);
    scene.add(purpleLight);

    const ambientLightColor = theme === 'light' ? 0xd8b4fe : 0x667eea;
    const ambientLight = new THREE.AmbientLight(ambientLightColor, 0.6);
    scene.add(ambientLight);

    const blueLightColor = theme === 'light' ? 0xe9d5ff : 0x667eea;
    const blueLight = new THREE.PointLight(blueLightColor, 1.5, 80);
    blueLight.position.set(-15, -10, 15);
    scene.add(blueLight);

    // Create particle group for parallax
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    // Create particles
    const particleCount = 90 + Math.floor(Math.random() * 30);
    const colors = theme === 'light' 
      ? [0xd8b4fe, 0xc084fc, 0xe9d5ff, 0xf3f0ff]
      : [0x667eea, 0x764ba2, 0xa68ada, 0xcdc6ea];
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const size = 0.3 + Math.random() * 0.5;
      const geometry = new THREE.IcosahedronGeometry(size, 0);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const material = new THREE.MeshPhongMaterial({
        color,
        transparent: true,
        opacity: 0.35 + Math.random() * 0.3,
        shininess: 80,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30
      );

      mesh.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.01,
        driftX: (Math.random() - 0.5) * 0.015,
        driftY: (Math.random() - 0.5) * 0.012,
        driftZ: (Math.random() - 0.5) * 0.008,
      };

      particleGroup.add(mesh);
      particles.push(mesh);
    }

    // Mouse Tracking for Parallax
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event) => {
      // Normalized coordinates (-1 to 1)
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // 30fps cap
    let animId;
    let lastTime = 0;
    const FPS_INTERVAL = 1000 / 30;

    const animate = (timestamp) => {
      animId = requestAnimationFrame(animate);
      const delta = timestamp - lastTime;
      if (delta < FPS_INTERVAL) return;
      lastTime = timestamp - (delta % FPS_INTERVAL);

      // Particle idle drift
      particles.forEach(p => {
        p.rotation.x += p.userData.rotSpeedX;
        p.rotation.y += p.userData.rotSpeedY;
        p.rotation.z += p.userData.rotSpeedZ;
        p.position.x += p.userData.driftX;
        p.position.y += p.userData.driftY;
        p.position.z += p.userData.driftZ;
        if (Math.abs(p.position.x) > 32) p.userData.driftX *= -1;
        if (Math.abs(p.position.y) > 22) p.userData.driftY *= -1;
        if (Math.abs(p.position.z) > 18) p.userData.driftZ *= -1;
      });

      // Smooth Parallax applied to the entire group
      const targetRotX = mouseY * 0.2;
      const targetRotY = mouseX * 0.2;
      particleGroup.rotation.x += (targetRotX - particleGroup.rotation.x) * 0.05;
      particleGroup.rotation.y += (targetRotY - particleGroup.rotation.y) * 0.05;
      
      // Slight camera pan
      const targetCamX = mouseX * 2;
      const targetCamY = mouseY * 2;
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Light orbit
      const t = timestamp * 0.0003;
      purpleLight.position.x = Math.sin(t) * 15;
      purpleLight.position.y = Math.cos(t) * 10;
      blueLight.position.x = Math.cos(t * 0.7) * 12;
      blueLight.position.y = Math.sin(t * 0.7) * 8;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particles.forEach(p => { p.geometry.dispose(); p.material.dispose(); });
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ThreeBackground;
