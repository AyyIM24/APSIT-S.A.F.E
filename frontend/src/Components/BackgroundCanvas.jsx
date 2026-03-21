import React, { useRef, useEffect } from 'react';

/**
 * BackgroundCanvas — PRD §4.1
 * Full-screen floating orb canvas behind all content.
 * Uses requestAnimationFrame with 30fps cap.
 */
const BackgroundCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let lastTime = 0;
    const FPS_INTERVAL = 1000 / 30; // 30fps cap

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create 7 orbs with project palette colors
    const orbs = Array.from({ length: 7 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 120 + Math.random() * 130,
      color: [
        'rgba(102, 126, 234, 0.12)',
        'rgba(118, 75, 162, 0.10)',
        'rgba(166, 138, 218, 0.08)',
        'rgba(102, 126, 234, 0.15)',
        'rgba(118, 75, 162, 0.12)',
        'rgba(166, 138, 218, 0.10)',
        'rgba(209, 193, 249, 0.08)',
      ][Math.floor(Math.random() * 7)],
      vx: 0.2 + Math.random() * 0.4,
      vy: 0.2 + Math.random() * 0.4,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
    }));

    const draw = (timestamp) => {
      animId = requestAnimationFrame(draw);

      const delta = timestamp - lastTime;
      if (delta < FPS_INTERVAL) return;
      lastTime = timestamp - (delta % FPS_INTERVAL);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = timestamp * 0.001;

      orbs.forEach(orb => {
        // Sinusoidal drift
        orb.x += Math.sin(time + orb.phaseX) * orb.vx;
        orb.y += Math.cos(time + orb.phaseY) * orb.vy;

        // Wrap around viewport
        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

        // Radial gradient for soft edges
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
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

export default BackgroundCanvas;
