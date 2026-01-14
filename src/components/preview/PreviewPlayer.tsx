import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useEditorStore } from '../../store/editorStore';
import type { GraphicElement } from '../../types/element';

export function PreviewPlayer() {
  const document = useEditorStore((state) => state.document);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Initial State: Hide all elements that have an IN animation
    document.elements.forEach(el => {
      const domEl = containerRef.current?.querySelector(`[data-element="${el.id}"]`);
      if (domEl && el.inAnimation?.type !== 'none') {
        gsap.set(domEl, { opacity: 0 }); // Start hidden
      }
    });

    const playIn = () => {
      document.elements.forEach((el) => {
        const domEl = containerRef.current?.querySelector(`[data-element="${el.id}"]`);
        if (!domEl || !el.inAnimation || el.inAnimation.type === 'none') return;

        const { type, duration, delay } = el.inAnimation;
        
        // Reset starting positions for In Animation
        if (type === 'fadeIn') gsap.set(domEl, { opacity: 0 });
        if (type === 'slideRight') gsap.set(domEl, { x: -100, opacity: 0 });
        if (type === 'slideLeft') gsap.set(domEl, { x: 100, opacity: 0 });
        if (type === 'scaleUp') gsap.set(domEl, { scale: 0, opacity: 0 });

        // Play Animation
        gsap.to(domEl, { 
          x: 0, scale: 1, opacity: el.opacity ?? 1, 
          duration, delay, 
          ease: 'power2.out' 
        });
      });
    };

    const playOut = () => {
      document.elements.forEach((el) => {
        const domEl = containerRef.current?.querySelector(`[data-element="${el.id}"]`);
        if (!domEl || !el.outAnimation || el.outAnimation.type === 'none') return;

        const { type, duration, delay } = el.outAnimation;
        const config: any = { duration, delay, ease: 'power2.in' };

        // Define Out destinations
        if (type === 'fadeIn') config.opacity = 0; // fadeOut actually
        if (type === 'slideRight') { config.x = 100; config.opacity = 0; }
        if (type === 'slideLeft') { config.x = -100; config.opacity = 0; }
        if (type === 'scaleUp') { config.scale = 0; config.opacity = 0; } // scaleDown

        gsap.to(domEl, config);
      });
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '1') playIn();
      if (e.key === '2') playOut();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [document.elements]);

  // ... (renderElement and return JSX remain the same as previous steps)
  // Just ensure you render the component with correct styles
  const renderElement = (el: GraphicElement) => {
    // ... (Same rendering logic as previous turn)
    return null; // Placeholder
  };
  
  // (Assuming you have the render logic from the previous step, omitted here for brevity but it is required)
   const renderStyles = {
        width: document.canvas.width,
        height: document.canvas.height,
        backgroundColor: document.canvas.backgroundColor, // Should be transparent if meant for overlay
        position: 'relative' as const,
        overflow: 'hidden',
  };

  return <div ref={containerRef} style={renderStyles}>{/* Elements mapped here */}</div>;
}