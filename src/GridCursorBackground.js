 import React, { useEffect, useRef } from 'react';
import './GridCursorBackground.css';

const GridCursorBackground = ({ darkMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Configuration
    const gridSize = 40;
    const fadeSpeed = 0.03;
    const maxTrails = 15;
    let trails = [];
    let lastPosition = { x: -1, y: -1 };

    // Color generation with mode-specific settings
    const getRandomColorVariation = () => {
      const baseHue = 200; // Blue base - change this to adjust color
      const hue = baseHue + Math.random() * 20 - 10; // ±10 variation
      const saturation = darkMode ? 80 : 70;
      const lightness = darkMode ? 65 : 45; // Brighter in dark mode
      return `hsla(${hue}, ${saturation}%, ${lightness}%, `;
    };

    const drawGrid = () => {
      // Clear with mode-appropriate background
      ctx.fillStyle = darkMode 
        ? 'rgba(20, 20, 30, 0.4)' 
        : 'rgba(240, 240, 245, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      const gridLineOpacity = darkMode ? 0.05 : 0.08;
      ctx.strokeStyle = darkMode 
        ? `rgba(255, 255, 255, ${gridLineOpacity})`
        : `rgba(100, 100, 120, ${gridLineOpacity})`;
      ctx.lineWidth = 0.5;

      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
        }
      }

      // Draw and update trails
      for (let i = trails.length - 1; i >= 0; i--) {
        const trail = trails[i];
        const px = trail.x * gridSize;
        const py = trail.y * gridSize;

        // Enhanced trail appearance
        ctx.save();
        
        // Glow effect (stronger in dark mode)
        ctx.shadowColor = trail.color + (darkMode ? trail.alpha * 0.6 : trail.alpha * 0.4) + ')';
        ctx.shadowBlur = darkMode ? 15 : 10;
        
        // Main rectangle
        ctx.fillStyle = trail.color + trail.alpha + ')';
        ctx.fillRect(px + 2, py + 2, gridSize - 4, gridSize - 4);
        
        // Border for better visibility in light mode
        if (!darkMode) {
          ctx.strokeStyle = trail.color.replace('hsla(', 'hsla(0, 0%, 20%, ');
          ctx.lineWidth = 0.8;
          ctx.strokeRect(px + 2, py + 2, gridSize - 4, gridSize - 4);
        }
        
        ctx.restore();

        // Fade out
        trail.alpha -= fadeSpeed;
        
        // Remove if faded out
        if (trail.alpha <= 0) {
          trails.splice(i, 1);
        }
      }
    };

    const animate = () => {
      drawGrid();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const newX = Math.floor(mouseX / gridSize);
      const newY = Math.floor(mouseY / gridSize);

      // Only add new trail if position changed
      if ((newX !== lastPosition.x || newY !== lastPosition.y) &&
          newX >= 0 && newY >= 0 && 
          newX < canvas.width/gridSize && newY < canvas.height/gridSize) {
        
        if (trails.length >= maxTrails) {
          trails.shift();
        }
        
        trails.push({
          x: newX,
          y: newY,
          alpha: 1.0,
          color: getRandomColorVariation()
        });
        
        lastPosition = { x: newX, y: newY };
      }
    };

    const handleResize = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    // Initialize
    handleResize();
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [darkMode]);

  return <canvas ref={canvasRef} className="grid-background-canvas" />;
};

export default GridCursorBackground;