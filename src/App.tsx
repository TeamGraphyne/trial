import { EditorToolbar } from './components/toolbar/EditorToolbar';
import { CanvasEditor } from './components/canvas/CanvasEditor';
import { LayersPanel } from './components/panels/LayersPanel';
import { PropertiesPanel } from './components/panels/PropertiesPanel';
import { PreviewPlayer } from './components/preview/PreviewPlayer';
import { useEditorStore } from './store/editorStore';
import './App.css';

function App() {
  const mode = useEditorStore((state) => state.mode);

  return (
    <div className="app">
      <EditorToolbar />
      
      <div className="editor-content">
        <div className="left-sidebar">
          <LayersPanel />
        </div>
        
        <div className="canvas-area">
          {mode === 'edit' ? <CanvasEditor /> : <PreviewPlayer />}
        </div>
        
        <div className="right-sidebar">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}

export default App;