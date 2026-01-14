// src/components/canvas/elements/RectangleElement.tsx

import { Rect } from 'react-konva';
import type { RectangleElement as RectangleElementType } from '../../../types/element';
import Konva from 'konva';

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
    <Rect
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