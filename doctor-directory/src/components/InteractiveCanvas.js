import React, { useState, useRef, useEffect } from 'react';
import { FaEraser, FaPen, FaUndo, FaRedo, FaDownload, FaTrash, FaSave, FaPlay } from 'react-icons/fa';

const InteractiveCanvas = ({ instructions, title, onSave }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set initial background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state
    saveToHistory();
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(imageData);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      loadFromHistory(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      loadFromHistory(historyIndex + 1);
    }
  };

  const loadFromHistory = (index) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = history[index];
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `${title}_practice.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveWork = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    onSave && onSave({
      title,
      imageData,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <FaPlay className="mr-2 text-blue-600" />
          Interactive Practice: {title}
        </h3>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
        >
          {showInstructions ? 'Hide' : 'Show'} Instructions
        </button>
      </div>

      {showInstructions && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Practice Instructions:</h4>
          <div className="text-blue-700 text-sm space-y-2">
            {instructions.split('\n').map((instruction, index) => (
              <p key={index} className="flex items-start">
                <span className="mr-2 mt-1">•</span>
                {instruction}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTool('pen')}
            className={`p-2 rounded ${tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            title="Pen Tool"
          >
            <FaPen />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            title="Eraser"
          >
            <FaEraser />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded border cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-gray-600 w-8">{brushSize}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 bg-white text-gray-700 rounded disabled:opacity-50 hover:bg-gray-100"
            title="Undo"
          >
            <FaUndo />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 bg-white text-gray-700 rounded disabled:opacity-50 hover:bg-gray-100"
            title="Redo"
          >
            <FaRedo />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            title="Clear Canvas"
          >
            <FaTrash />
          </button>
          <button
            onClick={saveWork}
            className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
            title="Save Work"
          >
            <FaSave />
          </button>
          <button
            onClick={downloadCanvas}
            className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            title="Download"
          >
            <FaDownload />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair w-full h-96 bg-white"
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Practice Tips */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">Practice Tips:</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Use the pen tool to draw diagrams, flowcharts, or write notes</li>
          <li>• Use the eraser to correct mistakes</li>
          <li>• Change colors to organize different concepts</li>
          <li>• Save your work to track your progress</li>
          <li>• Download your practice to keep for reference</li>
        </ul>
      </div>
    </div>
  );
};

export default InteractiveCanvas; 