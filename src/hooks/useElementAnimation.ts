import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { useEditorStore } from '../store/editorStore';
import type { GraphicElement } from '../types/element';

export function useElementAnimation(element: GraphicElement, nodeRef: React.RefObject<Konva.Shape | Konva.Group>) {
//   

}