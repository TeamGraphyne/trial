// src/components/toolbar/EditorToolbar.tsx

import { nanoid } from "nanoid";
import { useEditorStore } from "../../store/editorStore";
import type {
  TextElement,
  RectangleElement,
  CircleElement,
} from "../../types/element";
import { exportToHTML } from "../../utils/htmlExporter";

export function EditorToolbar() {
  const tool = useEditorStore((state) => state.tool);
  const setTool = useEditorStore((state) => state.setTool);
  const addElement = useEditorStore((state) => state.addElement);
  const selectedElementIds = useEditorStore(
    (state) => state.selectedElementIds
  );
  const deleteSelectedElements = useEditorStore(
    (state) => state.deleteSelectedElements
  );
  const bringToFront = useEditorStore((state) => state.bringToFront);
  const sendToBack = useEditorStore((state) => state.sendToBack);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const history = useEditorStore((state) => state.history);
  const historyIndex = useEditorStore((state) => state.historyIndex);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const hasSelection = selectedElementIds.length > 0;

  const mode = useEditorStore((state) => state.mode);
  const setMode = useEditorStore((state) => state.setMode);
  const document = useEditorStore((state) => state.document);

  const addText = () => {
    const textElement: TextElement = {
      id: nanoid(),
      type: "text",
      name: "Text",
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: document.elements.length,
      draggable: true,
      text: "Double click to edit",
      fontSize: 24,
      fontFamily: "Arial",
      fontStyle: "normal",
      fill: "#ffffff",
      align: "left",
      inAnimation: { type: 'none', duration: 0, delay: 0 },
      outAnimation: { type: 'none', duration: 0, delay: 0 }
    };
    addElement(textElement);
  };

  const addRectangle = () => {
    const rectElement: RectangleElement = {
      id: nanoid(),
      type: "rectangle",
      name: "Rectangle",
      x: 150,
      y: 150,
      width: 200,
      height: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: document.elements.length,
      draggable: true,
      fill: "#3b82f6",
      stroke: "#1e40af",
      strokeWidth: 2,
      cornerRadius: 0,
      
      inAnimation: { type: 'none', duration: 0, delay: 0 },
      
      outAnimation: { type: 'none', duration: 0, delay: 0 }
    };
    addElement(rectElement);
  };

  const addCircle = () => {
    const circleElement: CircleElement = {
      id: nanoid(),
      type: "circle",
      name: "Circle",
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: document.elements.length,
      draggable: true,
      radius: 50,
      fill: "#ef4444",
      stroke: "#991b1b",
      strokeWidth: 2,
      
      inAnimation: { type: 'none', duration: 0, delay: 0 },
      outAnimation: { type: 'none', duration: 0, delay: 0 }
    };
  };

  const handleBringToFront = () => {
    selectedElementIds.forEach((id) => bringToFront(id));
  };
  const handleSendToBack = () => {
    selectedElementIds.forEach((id) => sendToBack(id));
  };
  return (
    <div className="editor-toolbar">
      <div className="toolbar-section">
        <h3>Tools</h3>
        <div className="tool-buttons">
          <button
            className={tool === "select" ? "active" : ""}
            onClick={() => setTool("select")}
            title="Select"
          >
            ➤
          </button>
        </div>
        <div className="toolbar-section">
          <h3>Add Elements</h3>
          <div className="tool-buttons">
            <button onClick={addText} title="Add Text">
              T
            </button>
            <button onClick={addRectangle} title="Add Rectangle">
              ▭
            </button>
            <button onClick={addCircle} title="Add Circle">
              ●
            </button>
          </div>
        </div>


        <div className="toolbar-section">
          <h3>Actions</h3>
          <div className="tool-buttons">
            <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
              ↶
            </button>
            <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
              ↷
            </button>
            <button
              onClick={deleteSelectedElements}
              disabled={!hasSelection}
              title="Delete (Del)"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="toolbar-section">
          <h3>Arrange</h3>
          <div className="tool-buttons">
            <button
              onClick={handleBringToFront}
              disabled={!hasSelection}
              title="Bring to Front"
            >
              ⬆️
            </button>
            <button
              onClick={handleSendToBack}
              disabled={!hasSelection}
              title="Send to Back"
            >
              ⬇️
            </button>
          </div>
        </div>
        <div className="toolbar-section">
          <h3>Preview & Export</h3>
          <div className="tool-buttons">
            <button
              className={mode === 'preview' ? "active" : ""}
              onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
              title={mode === 'edit' ? "Play Animation" : "Stop Animation"}
            >
              {mode === 'edit' ? "▶️" : "Lb"}
            </button>
            <button
              onClick={() => exportToHTML(document)}
              title="Export HTML"
            >
              📤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
