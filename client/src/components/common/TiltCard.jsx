import React, { useState, useRef } from 'react';

/**
 * TiltCard
 * Interactive 3D perspective tilt card with dynamic cursor-following specular sheen.
 */
const TiltCard = ({
  children,
  className = '',
  maxRotation = 8, // max rotation in degrees
  scale = 1.02,
  perspective = 1000,
}) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  });
  const [sheenPosition, setSheenPosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    // Normalised coordinates (-0.5 to 0.5)
    const normalizedX = (x / width) - 0.5;
    const normalizedY = (y / height) - 0.5;

    // Calculate rotations (inverted X for natural tilt)
    const rotateY = normalizedX * maxRotation;
    const rotateX = -normalizedY * maxRotation;

    setStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 0.1s ease-out',
    });

    setSheenPosition({
      x: (x / width) * 100,
      y: (y / height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
    });
    setSheenPosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`relative transform-gpu will-change-transform overflow-hidden ${className}`}
    >
      {children}

      {/* Dynamic 3D Specular Light Sheen Overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 240px at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(217, 154, 43, 0.22), transparent 70%)`,
          opacity: sheenPosition.opacity,
        }}
      />
    </div>
  );
};

export default TiltCard;
