import { useEffect, useRef } from "react";
import "./MagicRings.css";

export default function MagicRings() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return undefined;

    let animationFrame;
    let width = 0;
    let height = 0;
    let time = 0;

    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      energy: 0,
    };

    const ripples = [];

    const stars = Array.from({ length: 240 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: 0.4 + Math.random() * 1.7,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.5,
      hue: [185, 205, 260, 285, 145][Math.floor(Math.random() * 5)],
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const setPointer = (x, y) => {
      pointer.targetX = x;
      pointer.targetY = y;
      pointer.energy = Math.min(1, pointer.energy + 0.22);
    };

    const addRipple = (x, y) => {
      ripples.push({
        x,
        y,
        radius: 8,
        opacity: 1,
        hue: Math.random() > 0.5 ? 186 : 278,
      });

      pointer.energy = 1;
    };

    const onMouseMove = (event) => setPointer(event.clientX, event.clientY);

    const onMouseDown = (event) => {
      setPointer(event.clientX, event.clientY);
      addRipple(event.clientX, event.clientY);
    };

    const onTouchMove = (event) => {
      const touch = event.touches?.[0];
      if (touch) setPointer(touch.clientX, touch.clientY);
    };

    const onTouchStart = (event) => {
      const touch = event.touches?.[0];
      if (!touch) return;

      setPointer(touch.clientX, touch.clientY);
      addRipple(touch.clientX, touch.clientY);
    };

    const drawAurora = (baseY, hue, offset, amplitude, lineWidth) => {
      ctx.save();
      ctx.beginPath();

      for (let x = -60; x <= width + 60; x += 14) {
        const y =
          baseY +
          Math.sin(x * 0.006 + time * 0.7 + offset) * amplitude +
          Math.sin(x * 0.014 - time * 0.45 + offset) * (amplitude * 0.42) +
          ((pointer.x - width / 2) / width) * 30;

        if (x === -60) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.lineTo(width + 60, height + 80);
      ctx.lineTo(-60, height + 80);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, baseY - 150, width, baseY + 220);
      gradient.addColorStop(0, `hsla(${hue}, 100%, 65%, 0)`);
      gradient.addColorStop(0.35, `hsla(${hue}, 100%, 65%, 0.13)`);
      gradient.addColorStop(0.65, `hsla(${hue}, 100%, 65%, 0.06)`);
      gradient.addColorStop(1, `hsla(${hue}, 100%, 65%, 0)`);

      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      for (let x = -60; x <= width + 60; x += 14) {
        const y =
          baseY +
          Math.sin(x * 0.006 + time * 0.7 + offset) * amplitude +
          Math.sin(x * 0.014 - time * 0.45 + offset) * (amplitude * 0.42) +
          ((pointer.x - width / 2) / width) * 30;

        if (x === -60) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = `hsla(${hue}, 100%, 72%, 0.34)`;
      ctx.lineWidth = lineWidth;
      ctx.shadowBlur = 24;
      ctx.shadowColor = `hsla(${hue}, 100%, 62%, 0.7)`;
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      time += 0.008 + pointer.energy * 0.006;
      pointer.energy *= 0.975;

      pointer.x += (pointer.targetX - pointer.x) * 0.07;
      pointer.y += (pointer.targetY - pointer.y) * 0.07;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2 + (pointer.x - width / 2) * 0.045;
      const centerY = height * 0.3 + (pointer.y - height / 2) * 0.03;
      const unit = Math.min(width, height);

      // Star field
      stars.forEach((star) => {
        const alpha =
          0.16 +
          ((Math.sin(time * star.speed + star.phase) + 1) / 2) * 0.7;

        const x = star.x * width + (pointer.x - width / 2) * star.size * 0.025;
        const y = star.y * height + (pointer.y - height / 2) * star.size * 0.025;

        ctx.fillStyle = `hsla(${star.hue}, 100%, 85%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Neon pointer glow
      const pointerGlow = ctx.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        330
      );

      pointerGlow.addColorStop(0, "rgba(34, 211, 238, 0.18)");
      pointerGlow.addColorStop(0.28, "rgba(168, 85, 247, 0.09)");
      pointerGlow.addColorStop(0.58, "rgba(190, 242, 100, 0.035)");
      pointerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = pointerGlow;
      ctx.fillRect(0, 0, width, height);

      // Aurora layers
      drawAurora(height * 0.74, 186, 0.2, 48, 1.4);
      drawAurora(height * 0.78, 278, 1.8, 62, 1.2);
      drawAurora(height * 0.83, 145, 3.4, 40, 1);

      // Central glow
      const coreGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        unit * 0.58
      );

      coreGlow.addColorStop(0, "rgba(34, 211, 238, 0.20)");
      coreGlow.addColorStop(0.26, "rgba(139, 92, 246, 0.11)");
      coreGlow.addColorStop(0.54, "rgba(236, 72, 153, 0.045)");
      coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = coreGlow;
      ctx.fillRect(0, 0, width, height);

      // Interactive colorful rings
      const rings = [
        { radius: unit * 0.13, hue: 185, alpha: 0.58, speed: 0.8, tilt: 0.12 },
        { radius: unit * 0.21, hue: 278, alpha: 0.42, speed: -0.55, tilt: -0.18 },
        { radius: unit * 0.3, hue: 145, alpha: 0.34, speed: 0.38, tilt: 0.08 },
        { radius: unit * 0.4, hue: 330, alpha: 0.22, speed: -0.24, tilt: -0.1 },
      ];

      rings.forEach((ring, index) => {
        const wobble = Math.sin(time * 1.6 + index) * 9;
        const rotation =
          ring.tilt +
          time * ring.speed * 0.09 +
          ((pointer.x / width) - 0.5) * 0.16;

        ctx.save();
        ctx.translate(centerX, centerY + wobble);
        ctx.rotate(rotation);
        ctx.scale(1, 0.42);

        ctx.beginPath();
        ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${ring.hue}, 100%, 70%, ${ring.alpha})`;
        ctx.lineWidth = index === 0 ? 2.4 : 1.2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${ring.hue}, 100%, 65%, 0.8)`;
        ctx.stroke();
        ctx.restore();
      });

      // Cursor attraction lines
      ctx.save();
      ctx.strokeStyle = "rgba(103, 232, 249, 0.14)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 10]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(pointer.x, pointer.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Tap / click ripples
      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        const ripple = ripples[index];

        ctx.save();
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${ripple.hue}, 100%, 70%, ${ripple.opacity})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 22;
        ctx.shadowColor = `hsla(${ripple.hue}, 100%, 65%, 0.9)`;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius * 0.58, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217, 249, 157, ${ripple.opacity * 0.7})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        ripple.radius += 4.2;
        ripple.opacity -= 0.018;

        if (ripple.opacity <= 0) ripples.splice(index, 1);
      }

      // Center target
      ctx.save();
      ctx.translate(centerX, centerY);

      ctx.shadowBlur = 22;
      ctx.shadowColor = "#67e8f9";

      ctx.strokeStyle = "rgba(103, 232, 249, 0.72)";
      ctx.lineWidth = 1.3;

      ctx.beginPath();
      ctx.arc(0, 0, 25 + Math.sin(time * 3.2) * 3, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-52, 0);
      ctx.lineTo(52, 0);
      ctx.moveTo(0, -52);
      ctx.lineTo(0, 52);
      ctx.stroke();

      ctx.fillStyle = "#d9f99d";
      ctx.beginPath();
      ctx.arc(0, 0, 4.8 + Math.sin(time * 4) * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  return (
    <div className="magic-rings-wrapper">
      <canvas ref={canvasRef} className="magic-rings-canvas" />
      <div className="magic-rings-overlay" />
      <div className="magic-rings-grain" />
    </div>
  );
}