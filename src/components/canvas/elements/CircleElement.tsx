// src/components/canvas/elements/CircleElement.tsx

import { Circle } from 'react-konva';
import type { CircleElement as CircleElementType } from '../../../types/element';
import Konva from 'konva';

interface CircleElementProps {
  element: CircleElementType;
  isSelected: boolean;
  onSelect: (id: string, addToSelection: boolean) => void;
  onTransform: (id: string, attrs: any) => void;
}

export function CircleElement({ 
  element, 
  isSelected, 
  onSelect, 
  onTransform 
}: CircleElementProps) {
  
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const addToSelection = e.evt.ctrlKey || e.evt.metaKey;
    onSelect(element.id, addToSelection);
  };
  
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onTransform(element.id, {
      x: e.target.x() - element.radius,
      y: e.target.y() - element.radius
    });
  };
  
  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const scaleX = node.scaleX();
    
    node.scaleX(1);
    node.scaleY(1);
    
    onTransform(element.id, {
      x: node.x() - element.radius * scaleX,
      y: node.y() - element.radius * scaleX,
      radius: Math.max(element.radius * scaleX, 5),
      rotation: node.rotation()
    });
  };
  
  return (
    <Circle
      id={element.id}
      x={element.x + element.radius}
      y={element.y + element.radius}
      radius={element.radius}
      fill={element.fill}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth}
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