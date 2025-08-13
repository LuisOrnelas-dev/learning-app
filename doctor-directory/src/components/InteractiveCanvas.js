import React, { useState, useRef, useEffect } from 'react';
import { FaEraser, FaPen, FaUndo, FaRedo, FaDownload, FaTrash, FaSave, FaPlay, FaClipboardCheck } from 'react-icons/fa';

const InteractiveCanvas = ({ instructions, title, onSave, formData }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluationCriteria, setEvaluationCriteria] = useState([]);
  const [selfAssessment, setSelfAssessment] = useState({});
  const [isLoadingCriteria, setIsLoadingCriteria] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    saveToHistory();
    generateDynamicEvaluationCriteria();
  }, [instructions, title, formData]);

  const generateDynamicEvaluationCriteria = async () => {
    if (!instructions || !title || !formData) return;
    
    setIsLoadingCriteria(true);
    try {
      const { ContentGenerationService } = await import('../services/contentGenerationService');
      const dynamicCriteria = await ContentGenerationService.generateEvaluationCriteria(title, instructions, formData);
      
      if (dynamicCriteria && Array.isArray(dynamicCriteria)) {
        console.log('✅ Dynamic evaluation criteria loaded:', dynamicCriteria);
        setEvaluationCriteria(dynamicCriteria);
      } else {
        console.warn('⚠️ Dynamic criteria failed, using fallback');
        setEvaluationCriteria([]);
      }
    } catch (error) {
      console.error('❌ Error generating dynamic criteria:', error);
      setEvaluationCriteria([]);
    } finally {
      setIsLoadingCriteria(false);
    }
  };

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
    // Prevent default behavior to avoid scrolling on touch devices
    e.preventDefault();
    
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    let x, y;
    if (e.touches && e.touches[0]) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    // Prevent default behavior to avoid scrolling on touch devices
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    let x, y;
    if (e.touches && e.touches[0]) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
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

  const handleSelfAssessment = (criteriaId, score) => {
    setSelfAssessment(prev => ({
      ...prev,
      [criteriaId]: score
    }));
  };

  const calculateTotalScore = () => {
    const scores = Object.values(selfAssessment);
    if (scores.length === 0) return 0;
    return scores.reduce((sum, score) => sum + score, 0);
  };

  const calculatePercentage = () => {
    const totalPossible = evaluationCriteria.reduce((sum, criteria) => sum + criteria.maxScore, 0);
    if (totalPossible === 0) return 0;
    return Math.round((calculateTotalScore() / totalPossible) * 100);
  };

  const getPerformanceFeedback = () => {
    const percentage = calculatePercentage();
    if (percentage >= 90) return { text: 'Excellent! You have mastered this topic.', color: 'text-green-600' };
    if (percentage >= 80) return { text: 'Very good! You have a solid understanding.', color: 'text-blue-600' };
    if (percentage >= 70) return { text: 'Good! You have a good grasp of the concepts.', color: 'text-yellow-600' };
    if (percentage >= 60) return { text: 'Fair. Review the areas where you scored lower.', color: 'text-orange-600' };
    return { text: 'Needs improvement. Consider reviewing the material again.', color: 'text-red-600' };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <FaPlay className="mr-2 text-blue-600" />
          Interactive Practice: {title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
          >
            {showInstructions ? 'Hide' : 'Show'} Instructions
          </button>
          <button
            onClick={() => setShowEvaluation(!showEvaluation)}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 flex items-center gap-1"
          >
            <FaClipboardCheck className="text-sm" />
            {showEvaluation ? 'Hide' : 'Show'} Evaluation
          </button>
        </div>
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

      {showEvaluation && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-3">Self-Assessment Criteria:</h4>
          
          {isLoadingCriteria ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
              <p className="text-green-700 text-sm">Generating evaluation criteria with AI...</p>
            </div>
          ) : evaluationCriteria.length > 0 ? (
            <div className="space-y-4">
              {evaluationCriteria.map((criteria) => (
                <div key={criteria.id} className="border border-green-200 rounded-lg p-3 bg-white">
                  <h5 className="font-medium text-green-700 mb-2">{criteria.instruction}</h5>
                  <div className="space-y-2">
                    {criteria.criteria.map((criterion, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{criterion}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              onClick={() => handleSelfAssessment(criteria.id, score)}
                              className={`w-6 h-6 rounded text-xs font-medium ${
                                selfAssessment[criteria.id] === score
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-sm text-gray-600">
                      Score: {selfAssessment[criteria.id] || 0}/{criteria.maxScore}
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-green-700">Overall Performance</h5>
                    <p className={`text-sm font-medium ${getPerformanceFeedback().color}`}>
                      {getPerformanceFeedback().text}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {calculatePercentage()}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {calculateTotalScore()}/{evaluationCriteria.reduce((sum, c) => sum + c.maxScore, 0)} points
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm">No evaluation criteria available. Try refreshing the page.</p>
            </div>
          )}
        </div>
      )}

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

      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair w-full h-96 bg-white"
          style={{ touchAction: 'none' }}
        />
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">Practice Tips:</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Use the pen tool to draw diagrams, flowcharts, or write notes</li>
          <li>• Use the eraser to correct mistakes</li>
          <li>• Change colors to organize different concepts</li>
          <li>• Save your work to track your progress</li>
          <li>• Download your practice to keep for reference</li>
          <li>• Use the AI-generated evaluation criteria to assess your work quality</li>
          <li>• <strong>Touch devices:</strong> Use your finger or stylus to draw directly on the canvas</li>
        </ul>
      </div>
    </div>
  );
};

export default InteractiveCanvas;
