import React, { useState, useEffect, useContext } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';

const CustomCursor = () => {
  const { theme } = useContext(ThemeContext);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoverType, setHoverType] = useState('default'); // 'default' | 'text' | 'action'
  const [isVisible, setIsVisible] = useState(false);

  // Smooth springs for the outer trailing ring
  const springConfigRing = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(-100, springConfigRing);
  const cursorY = useSpring(-100, springConfigRing);

  // Slower spring for the massive background spotlight
  const springConfigSpotlight = { damping: 40, stiffness: 100, mass: 1 };
  const spotX = useSpring(-250, springConfigSpotlight);
  const spotY = useSpring(-250, springConfigSpotlight);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX - 16); // Center the 32px ring
      cursorY.set(e.clientY - 16);
      spotX.set(e.clientX - 250); // Center the 500px spotlight
      spotY.set(e.clientY - 250);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('clickable');

      const isText = 
        target.tagName.toLowerCase() === 'h1' ||
        target.tagName.toLowerCase() === 'h2' ||
        target.tagName.toLowerCase() === 'p';

      if (isClickable) {
        setIsHovering(true);
        setHoverType('action');
      } else if (isText) {
        setIsHovering(true);
        setHoverType('text');
      } else {
        setIsHovering(false);
        setHoverType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, spotX, spotY, isVisible]);

  if (!isVisible) return null;

  const isLight = theme === 'light';

  // Colors based on theme
  const dotColor = isLight ? '#120058' : '#ffffff';
  const ringColor = isLight ? 'rgba(18, 0, 88, 0.4)' : 'rgba(255, 255, 255, 0.5)';
  const ringBgHover = isLight ? 'rgba(18, 0, 88, 0.08)' : 'rgba(255, 255, 255, 0.1)';
  const spotlightColor = isLight 
    ? 'radial-gradient(circle, rgba(118, 75, 162, 0.05) 0%, transparent 60%)'
    : 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 60%)';

  return (
    <>
      {/* 1. Massive Background Spotlight (Radar Glow) */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '500px', height: '500px',
          background: spotlightColor,
          borderRadius: '50%',
          zIndex: 0, // Behind content
          x: spotX, y: spotY,
          mixBlendMode: isLight ? 'multiply' : 'screen',
          pointerEvents: 'none'
        }}
      />

      {/* 2. Trailing Outer Ring (Radar Scope) */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '32px', height: '32px',
          border: `2px solid ${ringColor}`,
          borderRadius: '50%',
          zIndex: 99998,
          x: cursorX, y: cursorY,
          backgroundColor: isHovering && hoverType === 'action' ? ringBgHover : 'transparent',
          transform: isHovering ? (hoverType === 'action' ? 'scale(1.5)' : 'scale(1.2)') : 'scale(1)',
          backdropFilter: isHovering && hoverType === 'action' ? 'blur(2px)' : 'none',
          transition: 'transform 0.2s ease-out, background-color 0.2s, border-width 0.2s',
          borderWidth: isHovering && hoverType === 'action' ? '1px' : '2px',
          pointerEvents: 'none'
        }}
      >
        {/* Crosshair for 'Radar' feel */}
        {!isHovering && (
          <>
            <div style={{ position: 'absolute', top: '-4px', left: '13px', width: '2px', height: '4px', background: ringColor }} />
            <div style={{ position: 'absolute', bottom: '-4px', left: '13px', width: '2px', height: '4px', background: ringColor }} />
            <div style={{ position: 'absolute', left: '-4px', top: '13px', width: '4px', height: '2px', background: ringColor }} />
            <div style={{ position: 'absolute', right: '-4px', top: '13px', width: '4px', height: '2px', background: ringColor }} />
          </>
        )}
      </motion.div>

      {/* 3. Small Instant Exact Dot */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: mousePosition.y,
          left: mousePosition.x,
          width: '6px', height: '6px',
          backgroundColor: dotColor,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 99999,
          transition: 'opacity 0.2s, transform 0.2s',
          opacity: isHovering && hoverType === 'action' ? 0 : 1, // Hide dot when hovering buttons
          pointerEvents: 'none'
        }}
      />
    </>
  );
};

export default CustomCursor;
