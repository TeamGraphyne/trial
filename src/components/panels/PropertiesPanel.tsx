import { useEditorStore } from '../../store/editorStore';

export function PropertiesPanel() {
  const document = useEditorStore((state) => state.document);
  const selectedElementIds = useEditorStore((state) => state.selectedElementIds);
  const updateElement = useEditorStore((state) => state.updateElement);
  
  const selectedElements = document.elements.filter((el) =>
    selectedElementIds.includes(el.id)
  );
  
  const element = selectedElements[0];
  
  if (selectedElements.length === 0) {
    return (
      <div className="properties-panel">
        <div className="panel-header">
          <h3>Properties</h3>
        </div>
        <div className="empty-state">
          Select an element to edit properties
        </div>
      </div>
    );
  }
  
  if (selectedElements.length > 1) {
    return (
      <div className="properties-panel">
        <div className="panel-header">
          <h3>Properties</h3>
        </div>
        <div className="empty-state">
          {selectedElements.length} elements selected
        </div>
      </div>
    );
  }
  
  const handleChange = (key: string, value: any) => {
    updateElement(element.id, { [key]: value });
  };
  
  return (
    <div className="properties-panel">
      <div className="panel-header">
        <h3>Properties</h3>
      </div>
      
      <div className="properties-content">
        {/* Transform Properties */}
        <div className="property-section">
          <h4>Transform</h4>
          
          <div className="property-row">
            <label>X</label>
            <input
              type="number"
              value={Math.round(element.x)}
              onChange={(e) => handleChange('x', parseFloat(e.target.value))}
            />
          </div>
          
          <div className="property-row">
            <label>Y</label>
            <input
              type="number"
              value={Math.round(element.y)}
              onChange={(e) => handleChange('y', parseFloat(e.target.value))}
            />
          </div>
          
          <div className="property-row">
            <label>Width</label>
            <input
              type="number"
              value={Math.round(element.width)}
              onChange={(e) => handleChange('width', parseFloat(e.target.value))}
            />
          </div>
          
          <div className="property-row">
            <label>Height</label>
            <input
              type="number"
              value={Math.round(element.height)}
              onChange={(e) => handleChange('height', parseFloat(e.target.value))}
            />
          </div>
          
          <div className="property-row">
            <label>Rotation</label>
            <input
              type="number"
              value={Math.round(element.rotation)}
              onChange={(e) => handleChange('rotation', parseFloat(e.target.value))}
            />
          </div>
          
          <div className="property-row">
            <label>Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={element.opacity}
              onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
            />
            <span>{Math.round(element.opacity * 100)}%</span>
          </div>
        </div>
        
        {/* Text-specific Properties */}
        {element.type === 'text' && (
          <div className="property-section">
            <h4>Text</h4>
            
            <div className="property-row">
              <label>Content</label>
              <textarea
                value={element.text}
                onChange={(e) => handleChange('text', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="property-row">
              <label>Font Size</label>
              <input
                type="number"
                value={element.fontSize}
                onChange={(e) => handleChange('fontSize', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="property-row">
              <label>Font Family</label>
              <select
                value={element.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier">Courier</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
            
            <div className="property-row">
              <label>Font Style</label>
              <select
                value={element.fontStyle}
                onChange={(e) => handleChange('fontStyle', e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="italic">Italic</option>
              </select>
            </div>
            
            <div className="property-row">
              <label>Color</label>
              <input
                type="color"
                value={element.fill}
                onChange={(e) => handleChange('fill', e.target.value)}
              />
            </div>
            
            <div className="property-row">
              <label>Align</label>
              <select
                value={element.align}
                onChange={(e) => handleChange('align', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Rectangle-specific Properties */}
        {element.type === 'rectangle' && (
          <div className="property-section">
            <h4>Fill & Stroke</h4>
            
            <div className="property-row">
              <label>Fill Color</label>
              <input
                type="color"
                value={element.fill}
                onChange={(e) => handleChange('fill', e.target.value)}
              />
            </div>
            
            <div className="property-row">
              <label>Stroke Color</label>
              <input
                type="color"
                value={element.stroke}
                onChange={(e) => handleChange('stroke', e.target.value)}
              />
            </div>
            
            <div className="property-row">
              <label>Stroke Width</label>
              <input
                type="number"
                value={element.strokeWidth}
                onChange={(e) => handleChange('strokeWidth', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="property-row">
              <label>Corner Radius</label>
              <input
                type="number"
                value={element.cornerRadius}
                onChange={(e) => handleChange('cornerRadius', parseFloat(e.target.value))}
              />
            </div>
          </div>
        )}
        
        {/* Circle-specific Properties */}
        {element.type === 'circle' && (
          <div className="property-section">
            <h4>Fill & Stroke</h4>
            
            <div className="property-row">
              <label>Radius</label>
              <input
                type="number"
                value={element.radius}
                onChange={(e) => handleChange('radius', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="property-row">
              <label>Fill Color</label>
              <input
                type="color"
                value={element.fill}
                onChange={(e) => handleChange('fill', e.target.value)}
              />
            </div>
            
            <div className="property-row">
              <label>Stroke Color</label>
              <input
                type="color"
                value={element.stroke}
                onChange={(e) => handleChange('stroke', e.target.value)}
              />
            </div>
            
            <div className="property-row">
              <label>Stroke Width</label>
              <input
                type="number"
                value={element.strokeWidth}
                onChange={(e) => handleChange('strokeWidth', parseFloat(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}