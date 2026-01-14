// src/components/canvas/elements/TextElement.tsx

import { Text } from 'react-konva';
import type { TextElement as TextElementType } from '../../../types/element';
import Konva from 'konva';

interface TextElementProps {
  element: TextElementType;
  isSelected: boolean;
  onSelect: (id: string, addToSelection: boolean) => void;
  onTransform: (id: string, attrs: any) => void;
}

export function TextElement({ 
  element, 
  isSelected, 
  onSelect, 
  onTransform 
}: TextElementProps) {
  
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
    
    // Reset scale
    node.scaleX(1);
    node.scaleY(1);
    
    onTransform(element.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(node.width() * scaleX, 10),
      rotation: node.rotation()
    });
  };
  
  return (
    <Text
      id={element.id}
      x={element.x}
      y={element.y}
      text={element.text}
      fontSize={element.fontSize}
      fontFamily={element.fontFamily}
      fontStyle={element.fontStyle}
      fill={element.fill}
      align={element.align}
      width={element.width}
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