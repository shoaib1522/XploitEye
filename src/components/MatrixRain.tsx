import React, { useEffect, useRef } from 'react';
import './MatrixRain.css';

interface AnimatedBackgroundProps {
  intensity?: number;
  speed?: number;
  particleCount?: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  intensity = 0.8, 
  speed = 1, 
  particleCount = 80 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      trail: Array<{ x: number; y: number; opacity: number }>;
      pulsePhase: number;
      orbitRadius: number;
      orbitSpeed: number;
      glowIntensity: number;
    }> = [];
    
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isMouseActive = false;

    const colors = [
      'rgba(79, 172, 254, ',   // Bright blue
      'rgba(139, 92, 246, ',   // Purple
      'rgba(16, 185, 129, ',   // Green
      'rgba(59, 130, 246, ',   // Blue
      'rgba(168, 85, 247, ',   // Violet
      'rgba(34, 197, 94, ',    // Emerald
      'rgba(255, 59, 59, ',    // Red
      'rgba(255, 165, 0, ',    // Orange
      'rgba(0, 255, 255, '     // Cyan
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed * 0.8,
          vy: (Math.random() - 0.5) * speed * 0.8,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.7 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          trail: [],
          pulsePhase: Math.random() * Math.PI * 2,
          orbitRadius: Math.random() * 50 + 20,
          orbitSpeed: (Math.random() - 0.5) * 0.02,
          glowIntensity: Math.random() * 0.5 + 0.5
        });
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.15 * intensity;
            
            // Create gradient line
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            
            gradient.addColorStop(0, particles[i].color + opacity + ')');
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.5})`);
            gradient.addColorStop(1, particles[j].color + opacity + ')');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = Math.max(0.5, (1 - distance / 150) * 2);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            
            // Add electric effect for very close particles
            if (distance < 80) {
              ctx.shadowBlur = 10;
              ctx.shadowColor = particles[i].color + '0.3)';
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
          }
        }
      }
    };

    const drawParticles = () => {
      particles.forEach(particle => {
        // Update trail
        particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity });
        if (particle.trail.length > 8) {
          particle.trail.shift();
        }

        // Draw trail
        particle.trail.forEach((point, index) => {
          const trailOpacity = (point.opacity * (index / particle.trail.length)) * 0.3;
          ctx.fillStyle = particle.color + trailOpacity + ')';
          ctx.beginPath();
          ctx.arc(point.x, point.y, particle.size * (index / particle.trail.length), 0, Math.PI * 2);
          ctx.fill();
        });

        // Enhanced particle with pulsing and glow effects
        const pulseSize = 1 + Math.sin(time * 0.01 + particle.pulsePhase) * 0.3;
        const currentSize = particle.size * pulseSize;
        
        // Mouse interaction effect
        let mouseInfluence = 1;
        if (isMouseActive) {
          const mouseDistance = Math.sqrt(
            Math.pow(particle.x - mouseX, 2) + Math.pow(particle.y - mouseY, 2)
          );
          if (mouseDistance < 200) {
            mouseInfluence = 1 + (1 - mouseDistance / 200) * 0.5;
          }
        }
        
        // Create multi-layered glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentSize * 4 * mouseInfluence
        );
        
        const coreOpacity = particle.opacity * intensity * particle.glowIntensity * mouseInfluence;
        gradient.addColorStop(0, particle.color + coreOpacity + ')');
        gradient.addColorStop(0.3, particle.color + (coreOpacity * 0.8) + ')');
        gradient.addColorStop(0.6, particle.color + (coreOpacity * 0.4) + ')');
        gradient.addColorStop(1, particle.color + '0)');

        // Outer glow
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize * 3 * mouseInfluence, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner bright core
        const coreGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentSize
        );
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${coreOpacity * 0.8})`);
        coreGradient.addColorStop(0.7, particle.color + (coreOpacity * 0.6) + ')');
        coreGradient.addColorStop(1, particle.color + '0)');
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        ctx.fill();

        // Enhanced movement with orbital motion
        const orbitX = Math.cos(time * particle.orbitSpeed + particle.pulsePhase) * particle.orbitRadius * 0.1;
        const orbitY = Math.sin(time * particle.orbitSpeed + particle.pulsePhase) * particle.orbitRadius * 0.1;
        
        particle.x += particle.vx + orbitX * 0.01;
        particle.y += particle.vy + orbitY * 0.01;

        // Enhanced edge bouncing with energy preservation
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.9;
          particle.glowIntensity = Math.min(1, particle.glowIntensity + 0.2);
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.9;
          particle.glowIntensity = Math.min(1, particle.glowIntensity + 0.2);
        }

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Dynamic opacity and glow animation
        particle.opacity += Math.sin(time * 0.005 + particle.pulsePhase) * 0.005;
        particle.opacity = Math.max(0.2, Math.min(0.8, particle.opacity));
        
        particle.glowIntensity += (Math.random() - 0.5) * 0.02;
        particle.glowIntensity = Math.max(0.3, Math.min(1.2, particle.glowIntensity));
      });
    };

    const animate = () => {
      // Keep background completely black
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      time++;
      
      // Reduce mouse influence over time
      if (isMouseActive && time % 60 === 0) {
        isMouseActive = false;
      }

      drawConnections();
      drawParticles();

      animationId = requestAnimationFrame(animate);
    };
    
    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseActive = true;
    };

    // Initialize
    resizeCanvas();
    animate();

    // Handle window resize and mouse interaction
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [intensity, speed, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="animated-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default AnimatedBackground;
