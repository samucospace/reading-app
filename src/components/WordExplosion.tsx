import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface WordExplosionProps {
  word: string;
  originX?: number;
  originY?: number;
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  life: number;
  decay: number;
  shape: 'circle' | 'star' | 'square';
  rotation: number;
  rotationSpeed: number;
}

interface LetterFragment {
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  scale: number;
  alpha: number;
  color: string;
}

const BRIGHT_COLORS = [
  '#FF5964', // bright coral
  '#FFD166', // warm yellow
  '#06D6A0', // emerald mint
  '#118AB2', // vivid sky
  '#8338EC', // vibrant violet
  '#FF006E', // neon pink
  '#FB5607', // energetic orange
  '#3A86FF', // electric blue
];

export const WordExplosion: React.FC<WordExplosionProps> = ({
  word,
  originX,
  originY,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Also trigger festive canvas-confetti bursts from left and right
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6, x: 0.3 },
      colors: BRIGHT_COLORS,
      disableForReducedMotion: false,
    });
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6, x: 0.7 },
      colors: BRIGHT_COLORS,
      disableForReducedMotion: false,
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const centerX = originX ?? width / 2;
    const centerY = originY ?? height / 2 - 40;

    // Build letter fragments
    const letters = word.split('');
    const letterSpacing = 65;
    const totalWordWidth = letters.length * letterSpacing;
    const startX = centerX - totalWordWidth / 2 + letterSpacing / 2;

    const fragments: LetterFragment[] = letters.map((char, index) => {
      const angle = (index / letters.length) * Math.PI * 2 + (Math.random() - 0.5);
      const speed = 7 + Math.random() * 8;
      return {
        char,
        x: startX + index * letterSpacing,
        y: centerY,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
        vy: Math.sin(angle) * speed - 6 - Math.random() * 5, // blast upwards
        rotation: 0,
        vRot: (Math.random() - 0.5) * 0.25,
        scale: 1.2,
        alpha: 1,
        color: BRIGHT_COLORS[index % BRIGHT_COLORS.length],
      };
    });

    // Build explosion particles
    const particles: Particle[] = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 16;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        color: BRIGHT_COLORS[Math.floor(Math.random() * BRIGHT_COLORS.length)],
        radius: 4 + Math.random() * 8,
        alpha: 1,
        life: 1,
        decay: 0.012 + Math.random() * 0.015,
        shape: Math.random() > 0.6 ? 'star' : Math.random() > 0.5 ? 'square' : 'circle',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
      });
    }

    // Shockwave ring
    let shockwaveRadius = 10;
    let shockwaveAlpha = 0.9;

    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 1800; // 1.8 seconds celebration

    function drawStar(
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
      context.fill();
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw expanding shockwave
      if (shockwaveAlpha > 0.01) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, shockwaveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 215, 0, ${shockwaveAlpha})`;
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.restore();

        shockwaveRadius += 14;
        shockwaveAlpha *= 0.91;
      }

      // Draw confetti particles
      particles.forEach((p) => {
        if (p.alpha <= 0) return;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.38; // gravity
        p.vx *= 0.98; // air resistance
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        if (p.shape === 'star') {
          drawStar(ctx, 0, 0, 5, p.radius, p.radius / 2);
        } else if (p.shape === 'square') {
          ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Draw flying letter fragments
      fragments.forEach((frag) => {
        frag.x += frag.vx;
        frag.y += frag.vy;
        frag.vy += 0.42; // gravity
        frag.vx *= 0.98;
        frag.rotation += frag.vRot;
        frag.scale = Math.max(0.4, frag.scale * 0.995);
        frag.alpha = Math.max(0, frag.alpha - 0.011);

        ctx.save();
        ctx.translate(frag.x, frag.y);
        ctx.rotate(frag.rotation);
        ctx.scale(frag.scale, frag.scale);
        ctx.globalAlpha = frag.alpha;

        // Draw letter with glow shadow
        ctx.font = 'bold 72px Fredoka, Quicksand, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.shadowColor = frag.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(frag.char, 0, 0);

        ctx.lineWidth = 6;
        ctx.strokeStyle = frag.color;
        ctx.strokeText(frag.char, 0, 0);

        ctx.restore();
      });

      const elapsed = performance.now() - startTime;
      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [word, originX, originY, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
