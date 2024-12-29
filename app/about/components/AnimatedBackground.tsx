"use client";

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size with device pixel ratio for HD
  const resizeCanvas = () => {
    const pixelRatio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Set display size (css pixels)
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    
    // Normalize coordinate system to use css pixels
    ctx.scale(pixelRatio, pixelRatio);
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

    // Create particles
    const particleCount = 50;
    const particles: Particle[] = [];
    const connectionDistance = 150; // Maximum distance for connecting particles

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 1, // Random velocity X
        dy: (Math.random() - 0.5) * 1, // Random velocity Y
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#60a5fa';
        ctx.fill();

        // Connect particles
        particles.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="animated-background fixed inset-0 w-full h-full z-[1]">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{
          backgroundColor: '#f8fafc',
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default AnimatedBackground;