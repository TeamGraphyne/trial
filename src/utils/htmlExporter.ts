import type { GraphicDocument } from "../types/element";

export function exportToHTML(graphicDoc: GraphicDocument) {
  const elementsHTML = graphicDoc.elements.map(el => {
    const inAnim = el.inAnimation || { type: 'none', duration: 0, delay: 0 };
    const outAnim = el.outAnimation || { type: 'none', duration: 0, delay: 0 };
    
    // Embed both configurations in data attributes
    const dataAttrs = `
      data-id="${el.id}" 
      data-in-type="${inAnim.type}" data-in-dur="${inAnim.duration}" data-in-del="${inAnim.delay}"
      data-out-type="${outAnim.type}" data-out-dur="${outAnim.duration}" data-out-del="${outAnim.delay}"
    `;
    
    // ... (CSS styles logic from previous turn) ...
    let style = `position: absolute; left: ${el.x}px; top: ${el.y}px; opacity: 0; transform: rotate(${el.rotation}deg); z-index: ${el.zIndex};`; // NOTE: Opacity 0 initially for IN animation

    // ... (HTML generation for Text/Rect/Circle) ...
    return `<div class="element" ${dataAttrs} style="${style}">...content...</div>`;
  }).join('\n');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <style> body { background: transparent; overflow: hidden; } #canvas { width: 1920px; height: 1080px; position: relative; } </style>
</head>
<body>
  <div id="canvas">${elementsHTML}</div>
  <script>
    const elements = document.querySelectorAll('.element');

    function playIn() {
      elements.forEach(el => {
        const type = el.dataset.inType;
        if (type === 'none') { gsap.set(el, { opacity: 1 }); return; }
        
        const duration = parseFloat(el.dataset.inDur);
        const delay = parseFloat(el.dataset.inDel);
        
        // Reset
        gsap.set(el, { opacity: 0, x: 0, scale: 1 });

        if (type === 'fadeIn') gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration, delay });
        if (type === 'slideRight') gsap.fromTo(el, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration, delay });
        // ... other types
      });
    }

    function playOut() {
      elements.forEach(el => {
        const type = el.dataset.outType;
        if (type === 'none') return;
        
        const duration = parseFloat(el.dataset.outDur);
        const delay = parseFloat(el.dataset.outDel);

        if (type === 'fadeIn') gsap.to(el, { opacity: 0, duration, delay }); // fadeOut
        if (type === 'slideRight') gsap.to(el, { x: 100, opacity: 0, duration, delay });
        // ... other types
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === '1') playIn();
      if (e.key === '2') playOut();
    });
  </script>
</body>
</html>`;

  // ... (blob download logic)
}