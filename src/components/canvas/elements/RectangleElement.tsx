// src/components/canvas/elements/RectangleElement.tsx
import { useRef } from 'react'; // Add useRef
import { Rect } from 'react-konva';
import type { RectangleElement as RectangleElementType } from '../../../types/element';
import Konva from 'konva';
import { useElementAnimation } from '../../../hooks/useElementAnimation';

interface RectangleElementProps {
  element: RectangleElementType;
  isSelected: boolean;
  onSelect: (id: string, addToSelection: boolean) => void;
  onTransform: (id: string, attrs: any) => void;
}

export function RectangleElement({ 
  element, 
  isSelected, 
  onSelect, 
  onTransform 
}: RectangleElementProps) {
  const shapeRef = useRef<Konva.Rect>(null);
  
  useElementAnimation(element, shapeRef as React.RefObject<Konva.Shape | Konva.Group>);
  
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const addToSelection = e.evt.ctrlKey || e.evt.metaKey;
    onSelect(element.id, addToSelection);
  };
  
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onTransform(element.id, {
      x: e.target.x(),
      y: e.target.y()
    });
  };
  
  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    node.scaleX(1);
    node.scaleY(1);
    
    onTransform(element.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(node.width() * scaleX, 10),
      height: Math.max(node.height() * scaleY, 10),
      rotation: node.rotation()
    });
  };
  
  return (
    <Rect ref={shapeRef}
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      fill={element.fill}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth}
      cornerRadius={element.cornerRadius}
      rotation={element.rotation}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      opacity={element.opacity}
      visible={element.visible}
      draggable={!element.locked && isSelected}
      onMouseDown={handleMouseDown}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    />
  );
}