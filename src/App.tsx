import { EditorToolbar } from './components/toolbar/EditorToolbar';
import { CanvasEditor } from './components/canvas/CanvasEditor';
import { LayersPanel } from './components/panels/LayersPanel';
import { PropertiesPanel } from './components/panels/PropertiesPanel';
import './App.css';

function App() {
  return (
    <div className="app">
      <EditorToolbar />
      
      <div className="editor-content">
        <div className="left-sidebar">
          <LayersPanel />
        </div>
        
        <div className="canvas-area">
          <CanvasEditor />
        </div>
        
        <div className="right-sidebar">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}

export default App;