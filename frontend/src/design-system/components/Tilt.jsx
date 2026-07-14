import React, { useRef } from 'react';

/**
 * Tilt — A high-performance 3D soft tilt and spotlight shine wrapper.
 * Updates CSS variables directly on mousemove to maintain a smooth 60fps.
 */
const Tilt = ({
  children,
  className = '',
  style = {},
  spotlight = true,
  disabled = false,
  intensity = 15, // Higher = less tilt (divisor)
  ...props
}) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (disabled || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Calculate rotation angles
    const tiltX = (yc - y) / intensity;
    const tiltY = (x - xc) / intensity;

    // Apply values as CSS variables to trigger GPU-accelerated styling
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    // Smooth reset
    cardRef.current.style.setProperty('--tilt-x', '0deg');
    cardRef.current.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card ${spotlight ? 'spotlight-card' : ''} ${className}`}
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
        transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), background 0.1s ease',
        transformStyle: 'preserve-3d',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Tilt;
