import { useEditorStore } from '../../store/editorStore';
import type { ElementType } from '../../types/element';

export function LayersPanel() {
  const document = useEditorStore((state) => state.document);
  const selectedElementIds = useEditorStore((state) => state.selectedElementIds);
  const selectElement = useEditorStore((state) => state.selectElement);
  const updateElement = useEditorStore((state) => state.updateElement);
  const deleteElement = useEditorStore((state) => state.deleteElement);
  
  // Sort by zIndex (descending) to show top elements first
  const sortedElements = [...document.elements].sort((a, b) => b.zIndex - a.zIndex);
  
  const isSelected = (id: string) => selectedElementIds.includes(id);
  
  const handleSelectLayer = (id: string, e: React.MouseEvent) => {
    const addToSelection = e.ctrlKey || e.metaKey;
    selectElement(id, addToSelection);
  };
  
  const toggleVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const element = document.elements.find((el) => el.id === id);
    if (element) {
      updateElement(id, { visible: !element.visible });
    }
  };
  
  const toggleLock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const element = document.elements.find((el) => el.id === id);
    if (element) {
      updateElement(id, { locked: !element.locked });
    }
  };
  
  const handleDeleteLayer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElement(id);
  };
  
  const getIcon = (type: ElementType): string => {
    const icons: Record<ElementType, string> = {
      text: 'T',
      rectangle: '▭',
      circle: '●',
      image: '🖼️'
    };
    return icons[type] || '?';
  };
  
  return (
    <div className="layers-panel">
      <div className="panel-header">
        <h3>Layers</h3>
        <span className="layer-count">{document.elements.length}</span>
      </div>
      
      <div className="layers-list">
        {sortedElements.length === 0 && (
          <div className="empty-state">
            No layers yet. Add some elements!
          </div>
        )}
        
        {sortedElements.map((element) => {
          const selected = isSelected(element.id);
          
          return (
            <div
              key={element.id}
              className={`layer-item ${selected ? 'selected' : ''}`}
              onClick={(e) => handleSelectLayer(element.id, e)}
            >
              <span className="layer-icon">{getIcon(element.type)}</span>
              <span className="layer-name">{element.name}</span>
              
              <div className="layer-actions">
                <button
                  className={`visibility-btn ${!element.visible ? 'hidden' : ''}`}
                  onClick={(e) => toggleVisibility(element.id, e)}
                  title="Toggle Visibility"
                >
                  {element.visible ? '👁️' : '🚫'}
                </button>
                <button
                  className={`lock-btn ${element.locked ? 'locked' : ''}`}
                  onClick={(e) => toggleLock(element.id, e)}
                  title="Toggle Lock"
                >
                  {element.locked ? '🔒' : '🔓'}
                </button>
                <button
                  className="delete-btn"
                  onClick={(e) => handleDeleteLayer(element.id, e)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}