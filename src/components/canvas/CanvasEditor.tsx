// src/components/canvas/CanvasEditor.tsx

import { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Line, Transformer } from 'react-konva';
import { useEditorStore } from '../../store/editorStore';
import { TextElement } from './elements/TextElement';
import { RectangleElement } from './elements/RectangleElement';
import { CircleElement } from './elements/CircleElement';
import type { GraphicElement } from '../../types/element';
import Konva from 'konva';

export function CanvasEditor() {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  
  const document = useEditorStore((state) => state.document);
  const selectedElementIds = useEditorStore((state) => state.selectedElementIds);
  const zoom = useEditorStore((state) => state.zoom);
  const selectElement = useEditorStore((state) => state.selectElement);
  const deselectAll = useEditorStore((state) => state.deselectAll);
  const updateElement = useEditorStore((state) => state.updateElement);
  const deleteSelectedElements = useEditorStore((state) => state.deleteSelectedElements);
  const duplicateElement = useEditorStore((state) => state.duplicateElement);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  
  // Sort elements by zIndex
  const sortedElements = [...document.elements].sort((a, b) => a.zIndex - b.zIndex);
  
  // Generate grid lines
  const gridLines = [];
  const gridSize = 50;
  const { width, height } = document.canvas;
  
  // Vertical lines
  for (let i = 0; i <= width / gridSize; i++) {
    gridLines.push({
      key: `v-${i}`,
      points: [i * gridSize, 0, i * gridSize, height],
      stroke: '#333',
      strokeWidth: 0.5,
      opacity: 0.3
    });
  }
  
  // Horizontal lines
  for (let i = 0; i <= height / gridSize; i++) {
    gridLines.push({
      key: `h-${i}`,
      points: [0, i * gridSize, width, i * gridSize],
      stroke: '#333',
      strokeWidth: 0.5,
      opacity: 0.3
    });
  }
  
  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    
    const transformer = transformerRef.current;
    const stage = stageRef.current;
    
    const selectedNodes = selectedElementIds
      .map((id) => stage.findOne(`#${id}`))
      .filter(Boolean);
    
    transformer.nodes(selectedNodes as Konva.Node[]);
  }, [selectedElementIds, document.elements]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete
      if (e.key === 'Delete') {
        e.preventDefault();
        deleteSelectedElements();
      }
      
      // Duplicate (Ctrl+D)
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        selectedElementIds.forEach((id) => {
          duplicateElement(id);
        });
      }
      
      // Undo (Ctrl+Z)
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      
      // Redo (Ctrl+Shift+Z or Ctrl+Y)
      if ((e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        redo();
      }
      
      // Select All (Ctrl+A)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        document.elements.forEach((el) => selectElement(el.id, true));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementIds, document.elements, deleteSelectedElements, duplicateElement, undo, redo, selectElement]);
  
  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Clicked on stage - deselect if clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      deselectAll();
    }
  };
  
  const handleElementSelect = (id: string, addToSelection: boolean) => {
    selectElement(id, addToSelection);
  };
  
  const handleElementTransform = (id: string, attrs: any) => {
    updateElement(id, attrs);
  };
  
  const renderElement = (element: GraphicElement) => {
    const isSelected = selectedElementIds.includes(element.id);
    
    switch (element.type) {
      case 'text':
        return (
          <TextElement
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={handleElementSelect}
            onTransform={handleElementTransform}
          />
        );
      case 'rectangle':
        return (
          <RectangleElement
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={handleElementSelect}
            onTransform={handleElementTransform}
          />
        );
      case 'circle':
        return (
          <CircleElement
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={handleElementSelect}
            onTransform={handleElementTransform}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="canvas-editor">
      <div className="canvas-container">
        <Stage
          ref={stageRef}
          width={document.canvas.width * zoom}
          height={document.canvas.height * zoom}
          scaleX={zoom}
          scaleY={zoom}
          onMouseDown={handleStageMouseDown}
        >
          <Layer>
            {/* Background */}
            <Rect
              x={0}
              y={0}
              width={document.canvas.width}
              height={document.canvas.height}
              fill={document.canvas.backgroundColor}
            />
            
            {/* Grid */}
            {gridLines.map((line) => (
              <Line key={line.key} {...line} />
            ))}
            
            {/* Elements */}
            {sortedElements.map(renderElement)}
            
            {/* Transformer */}
            {selectedElementIds.length > 0 && (
              <Transformer
                ref={transformerRef}
                rotateEnabled={true}
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit minimum size
                  if (newBox.width < 10 || newBox.height < 10) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>
      </div>
      
      {/* Zoom controls */}
      <div className="zoom-controls">
        <button onClick={() => useEditorStore.getState().setZoom(zoom + 0.1)}>+</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={() => useEditorStore.getState().setZoom(zoom - 0.1)}>-</button>
        <button onClick={() => useEditorStore.getState().setZoom(1)}>R</button>
      </div>
    </div>
  );
}