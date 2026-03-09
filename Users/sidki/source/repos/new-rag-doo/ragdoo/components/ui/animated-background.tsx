// components/ui/animated-background.tsx - Mind-Bending Animated Background
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  connections: number[];
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [geometricShapes, setGeometricShapes] = useState<Array<{ left: number; top: number; delay: number }>>([]);
  const [floatingOrbs, setFloatingOrbs] = useState<Array<{ 
    width: number; 
    height: number; 
    left: number; 
    top: number; 
    background: string;
    x: number[];
    y: number[];
    duration: number;
  }>>([]);
  const [neuralPaths, setNeuralPaths] = useState<Array<{ d: string }>>([]);

  useEffect(() => {
    setIsMounted(true);
    
    // Generate stable random values for geometric shapes
    const shapes = [...Array(8)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setGeometricShapes(shapes);

    // Generate stable random values for floating orbs
    const orbs = [...Array(5)].map(() => ({
      width: Math.random() * 400 + 300,
      height: Math.random() * 400 + 300,
      left: Math.random() * 100,
      top: Math.random() * 100,
      background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '139, 92, 246' : Math.random() > 0.5 ? '59, 130, 246' : '6, 182, 212'}, 0.1) 0%, transparent 70%)`,
      x: [0, Math.random() * 200 - 100, Math.random() * 100 - 50],
      y: [0, Math.random() * 200 - 100, Math.random() * 100 - 50],
      duration: Math.random() * 20 + 15
    }));
    setFloatingOrbs(orbs);

    // Generate stable neural network paths
    const paths = [...Array(20)].map(() => {
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const midX = Math.random() * 100;
      const midY = Math.random() * 100;
      const endX = Math.random() * 100;
      const endY = Math.random() * 100;
      return {
        d: `M${startX},${startY} Q${midX},${midY} ${endX},${endY}`
      };
    });
    setNeuralPaths(paths);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const numParticles = Math.min(150, Math.floor((canvas.width * canvas.height) / 15000));
      
      for (let i = 0; i < numParticles; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 100,
          maxLife: 100 + Math.random() * 100,
          size: Math.random() * 3 + 1,
          color: ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981'][Math.floor(Math.random() * 4)],
          connections: []
        });
      }
    };

    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Boundary bouncing
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Reset particle if life exceeded
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }

        // Calculate opacity based on life
        const opacity = Math.sin((particle.life / particle.maxLife) * Math.PI) * 0.8;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Draw connections to nearby particles
        particlesRef.current.slice(i + 1).forEach((otherParticle, j) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const connectionOpacity = (1 - distance / 120) * opacity * 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${connectionOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Don't render anything until mounted to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Canvas for particle system */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none -z-10"
        style={{ background: 'transparent' }}
      />

      {/* Additional animated elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Floating geometric shapes */}
        {geometricShapes.map((shape, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-purple-500/10 rounded-2xl"
            style={{
              left: `${shape.left}%`,
              top: `${shape.top}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 20 + shape.delay * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Gradient orbs */}
        {floatingOrbs.map((orb, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: orb.width,
              height: orb.height,
              background: orb.background,
              left: `${orb.left}%`,
              top: `${orb.top}%`,
            }}
            animate={{
              x: orb.x,
              y: orb.y,
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Neural network paths */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {neuralPaths.map((path, i) => (
            <motion.path
              key={i}
              d={path.d}
              stroke="url(#neural-gradient)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                repeatType: "reverse",
                delay: (i % 4) * 0.5,
              }}
            />
          ))}
        </svg>
      </div>
    </>
  );
}
