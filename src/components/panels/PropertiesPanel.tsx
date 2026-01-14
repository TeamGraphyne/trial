import { useEditorStore } from '../../store/editorStore';
import type { AnimationConfig } from '../../types/element';

export function PropertiesPanel() {
  const document = useEditorStore((state) => state.document);
  const selectedElementIds = useEditorStore((state) => state.selectedElementIds);
  const updateElement = useEditorStore((state) => state.updateElement);
  
  // ... (selection logic) ...
  const selectedElements = document.elements.filter((el) =>
    selectedElementIds.includes(el.id)
  );
  const element = selectedElements[0];
  
  if (selectedElements.length === 0) return <div className="properties-panel">Select an element</div>;
  if (selectedElements.length > 1) return <div className="properties-panel">Multiple selected</div>;

  const handleChange = (key: string, value: any) => {
    updateElement(element.id, { [key]: value });
  };

  // Helper component for Animation Section
  const AnimationSection = ({ 
    title, 
    animKey, 
    config 
  }: { 
    title: string, 
    animKey: 'inAnimation' | 'outAnimation', 
    config?: AnimationConfig 
  }) => (
    <div className="property-section">
      <h4>{title}</h4>
      <div className="property-row">
        <label>Type</label>
        <select
          value={config?.type || 'none'}
          onChange={(e) => handleChange(animKey, { ...config, type: e.target.value })}
        >
          <option value="none">None</option>
          <option value="fadeIn">Fade In</option>
          <option value="slideRight">Slide Right</option>
          <option value="slideLeft">Slide Left</option>
          <option value="scaleUp">Scale Up</option>
        </select>
      </div>
      {config?.type !== 'none' && (
        <>
          <div className="property-row">
            <label>Duration (s)</label>
            <input
              type="number" step="0.1" min="0.1"
              value={config?.duration || 1}
              onChange={(e) => handleChange(animKey, { ...config, duration: parseFloat(e.target.value) })}
            />
          </div>
          <div className="property-row">
            <label>Delay (s)</label>
            <input
              type="number" step="0.1" min="0"
              value={config?.delay || 0}
              onChange={(e) => handleChange(animKey, { ...config, delay: parseFloat(e.target.value) })}
            />
          </div>
        </>
      )}
    </div>
  );
  
  return (
    <div className="properties-panel">
      <div className="panel-header"><h3>Properties</h3></div>
      <div className="properties-content">
        {/* ... Existing Transform Sections ... */}
        
        {/* NEW: Animation Sections */}
        <AnimationSection 
          title="In Animation (Press 1)" 
          animKey="inAnimation" 
          config={element.inAnimation} 
        />
        
        <AnimationSection 
          title="Out Animation (Press 2)" 
          animKey="outAnimation" 
          config={element.outAnimation} 
        />
        
        {/* ... Rest of specific properties (Text, Rect, etc.) ... */}
      </div>
    </div>
  );
}