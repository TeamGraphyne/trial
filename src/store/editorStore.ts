// src/store/editorStore.ts

import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { 
  GraphicElement, 
  GraphicDocument, 
  TextElement, 
  RectangleElement, 
  CircleElement 
} from '../types/element';

interface EditorState {
  // State
  document: GraphicDocument;
  selectedElementIds: string[];
  tool: 'select' | 'text' | 'rectangle' | 'circle';
  zoom: number;
  
  // History
  history: GraphicDocument[];
  historyIndex: number;
  
  // Actions
  addElement: (element: GraphicElement) => void;
  updateElement: (id: string, updates: Partial<GraphicElement>) => void;
  deleteElement: (id: string) => void;
  deleteSelectedElements: () => void;
  selectElement: (id: string, addToSelection?: boolean) => void;
  deselectAll: () => void;
  duplicateElement: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  setTool: (tool: 'select' | 'text' | 'rectangle' | 'circle') => void;
  setZoom: (zoom: number) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  document: {
    id: nanoid(),
    name: 'Untitled Graphic',
    canvas: {
      width: 1920,
      height: 1080,
      backgroundColor: '#000000'
    },
    elements: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  selectedElementIds: [],
  tool: 'select',
  zoom: 1,
  history: [],
  historyIndex: -1,
  
  // Actions
  addElement: (element) => {
    set((state) => ({
      document: {
        ...state.document,
        elements: [...state.document.elements, element],
        updatedAt: new Date()
      },
      selectedElementIds: [element.id]
    }));
    get().saveHistory();
  },
  
  updateElement: (id, updates) => {
    set((state) => ({
      document: {
        ...state.document,
        elements: state.document.elements.map((el) =>
          el.id === id ? { ...el, ...updates } : el
        ),
        // updatedAt: new Date()
      }
    }));
  },
  
  deleteElement: (id) => {
    set((state) => ({
      document: {
        ...state.document,
        elements: state.document.elements.filter((el) => el.id !== id)
      },
      selectedElementIds: state.selectedElementIds.filter((sid) => sid !== id)
    }));
    get().saveHistory();
  },
  
  deleteSelectedElements: () => {
    const { selectedElementIds } = get();
    set((state) => ({
      document: {
        ...state.document,
        elements: state.document.elements.filter(
          (el) => !selectedElementIds.includes(el.id)
        )
      },
      selectedElementIds: []
    }));
    get().saveHistory();
  },
  
  selectElement: (id, addToSelection = false) => {
    set((state) => ({
      selectedElementIds: addToSelection
        ? state.selectedElementIds.includes(id)
          ? state.selectedElementIds
          : [...state.selectedElementIds, id]
        : [id]
    }));
  },
  
  deselectAll: () => {
    set({ selectedElementIds: [] });
  },
  
  duplicateElement: (id) => {
    const { document } = get();
    const element = document.elements.find((el) => el.id === id);
    if (element) {
      const duplicate = {
        ...element,
        id: nanoid(),
        x: element.x + 20,
        y: element.y + 20,
        name: `${element.name} Copy`
      };
      get().addElement(duplicate);
    }
  },
  
  bringToFront: (id) => {
    const { document } = get();
    const maxZIndex = Math.max(...document.elements.map((el) => el.zIndex), 0);
    get().updateElement(id, { zIndex: maxZIndex + 1 });
  },
  
  sendToBack: (id) => {
    const { document } = get();
    const minZIndex = Math.min(...document.elements.map((el) => el.zIndex), 0);
    get().updateElement(id, { zIndex: minZIndex - 1 });
  },
  
  setTool: (tool) => {
    set({ tool });
  },
  
  setZoom: (zoom) => {
    set({ zoom: Math.max(0.1, Math.min(3, zoom)) });
  },
  
  // History
  saveHistory: () => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(state.document)));
      
      // Limit history to 50 steps
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  },
  
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      set({
        document: JSON.parse(JSON.stringify(history[historyIndex - 1])),
        historyIndex: historyIndex - 1
      });
    }
  },
  
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({
        document: JSON.parse(JSON.stringify(history[historyIndex + 1])),
        historyIndex: historyIndex + 1
      });
    }
  }
}));

// Initialize history with first state
useEditorStore.getState().saveHistory();