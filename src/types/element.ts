export type ElementType = 'text' | 'rectangle' | 'circle' | 'image';

export interface AnimationConfig {
  type: 'none' | 'fadeIn' | 'slideRight' | 'slideLeft' | 'scaleUp';
  duration: number;
  delay: number;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  
  // Position & Transform
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  
  // Visibility & Interaction
  visible: boolean;
  locked: boolean;
  opacity: number;
  
  // Layer order
  zIndex: number;
  
  // Selection
  draggable: boolean;

  // UPDATED: Separate In and Out animations
  inAnimation?: AnimationConfig;
  outAnimation?: AnimationConfig;
}

// ... (Rest of the file remains unchanged: TextElement, RectangleElement, etc.)

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: 'normal' | 'italic' | 'bold';
  fill: string;
  align: 'left' | 'center' | 'right';
}

export interface RectangleElement extends BaseElement {
  type: 'rectangle';
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
}

export interface CircleElement extends BaseElement {
  type: 'circle';
  radius: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
}

export type GraphicElement = 
  | TextElement 
  | RectangleElement 
  | CircleElement 
  | ImageElement;

export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
}

export interface GraphicDocument {
  id: string;
  name: string;
  canvas: CanvasConfig;
  elements: GraphicElement[];
  createdAt: Date;
  updatedAt: Date;
}