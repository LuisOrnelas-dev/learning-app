import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FaClipboardCheck, FaUserTie, FaSignature, FaFileAlt, FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash, FaDownload, FaPrint } from 'react-icons/fa';

// Component for theoretical evaluation
const TheoreticalEvaluation = ({ module, onComplete, formData }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Generate questions based on the module using the new service
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  
  // Load questions asynchronously
  useEffect(() => {
    const loadQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const { EvaluationService } = await import('../services/evaluationService');
        const generatedQuestions = await EvaluationService.generateWeekQuestions(
          module.title, 
          module.resources || [], 
          formData
        );
        setQuestions(generatedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
        // Usar preguntas de fallback en caso de error
        setQuestions([]);
      } finally {
        setLoadingQuestions(false);
      }
    };
    
    loadQuestions();
  }, [module.title, module.resources, formData]);

  const calculateScore = useCallback(() => {
    let correct = 0;
    console.log('Calculating score with:', { answers, questions: questions.length });
    
    questions.forEach(question => {
      console.log('Checking question:', { 
        id: question.id, 
        userAnswer: answers[question.id], 
        correctAnswer: question.correct,
        isCorrect: answers[question.id] === question.correct 
      });
      
      if (answers[question.id] === question.correct) {
        correct++;
      }
    });
    
    const finalScore = Math.round((correct / questions.length) * 100);
    console.log('Final score calculation:', { correct, total: questions.length, score: finalScore });
    return finalScore;
  }, [answers, questions]);

  const handleAnswer = useCallback((questionId, answerIndex) => {
    console.log('Answer selected:', { questionId, answerIndex, selectedAnswer: answerIndex });
    setSelectedAnswer(answerIndex);
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionId]: answerIndex
      };
      console.log('Updated answers:', newAnswers);
      return newAnswers;
    });
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Finish evaluation
      const finalScore = calculateScore();
      console.log('Final score calculated:', finalScore);
      setScore(finalScore);
      setShowResults(true);
      
      // Save evaluation using the service
      const evaluation = {
        type: 'theoretical',
        module: module.title,
        employee: formData.fullName,
        employeeId: formData.employeeId,
        score: finalScore,
        answers: answers,
        passed: finalScore >= 70
      };
      
      const { EvaluationService } = require('../services/evaluationService');
      const saved = EvaluationService.saveEvaluation(evaluation);
      
      // Save to localStorage for simple history
      const examHistory = JSON.parse(localStorage.getItem('examHistory') || '[]');
      const examRecord = {
        id: `exam_${Date.now()}`,
        weekTitle: module.title,
        score: finalScore,
        totalQuestions: questions.length,
        correctAnswers: Math.round((finalScore / 100) * questions.length),
        date: new Date().toLocaleDateString(),
        passed: finalScore >= 70
      };
      examHistory.push(examRecord);
      localStorage.setItem('examHistory', JSON.stringify(examHistory));
      console.log('💾 Exam saved to history:', examRecord);
      
      if (saved) {
        // Don't call onComplete immediately, let user see results first
        console.log('Evaluation saved successfully');
      } else {
        alert('Error saving evaluation. Please try again.');
      }
    }
  }, [currentQuestion, questions.length, calculateScore, module.title, formData, answers]);

  const resetEvaluation = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, []);

  if (showResults) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className={`text-6xl mb-4 ${score >= 70 ? 'text-green-500' : 'text-red-500'}`}>
            {score >= 70 ? <FaCheckCircle /> : <FaTimesCircle />}
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {score >= 70 ? 'Evaluation Passed!' : 'Evaluation Failed'}
          </h3>
          <p className="text-xl font-semibold text-gray-600">
            Score: {score || 0}%
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Minimum required: 70%
          </p>
          <p className="text-gray-600 mt-4">
            {score >= 70 
              ? 'Congratulations! You have successfully completed this module. Click "Complete & Return to Course" to continue with your training.' 
              : 'You need to score 70% or higher to pass. Please review the material and try again.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Module</h3>
            <p className="text-gray-600">{module.title}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Employee</h3>
            <p className="text-gray-600">{formData.fullName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Date</h3>
            <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Questions Answered</h3>
            <p className="text-gray-600">{Object.keys(answers).length} / {questions.length}</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetEvaluation}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-4"
          >
            Retake Evaluation
          </button>
          <button
            onClick={() => {
              // Save the evaluation result and close the modal
              const evaluation = {
                type: 'theoretical',
                module: module.title,
                employee: formData.fullName,
                employeeId: formData.employeeId,
                score: score || 0,
                answers: answers,
                passed: (score || 0) >= 70
              };
              
              // Call onComplete to close modal and return to course
              onComplete(evaluation);
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Complete & Return to Course
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while generating questions
  if (loadingQuestions) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <FaFileAlt className="text-4xl text-blue-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-2xl font-bold mb-2">Generating Evaluation Questions</h3>
          <p className="text-gray-600">Creating personalized questions for: {module.title}</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">🧠 Using AI to generate challenging questions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if no questions loaded
  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <FaFileAlt className="text-4xl text-red-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Error Loading Questions</h3>
          <p className="text-gray-600">Could not generate questions for: {module.title}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <FaFileAlt className="text-4xl text-blue-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Theoretical Evaluation</h3>
        <p className="text-gray-600">Module: {module.title}</p>
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4">
          {questions[currentQuestion].question}
        </h4>
        
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(questions[currentQuestion].id, index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  selectedAnswer === index 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        
        <button
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null}
          className={`px-6 py-2 text-white rounded-lg disabled:opacity-50 ${
            currentQuestion === questions.length - 1 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {currentQuestion === questions.length - 1 ? 'Finish Evaluation' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

// Component for practical evaluation (onfloor)
const PracticalEvaluation = ({ module, onComplete, formData }) => {
  const [evaluationData, setEvaluationData] = useState({
    supervisorName: '',
    supervisorId: '',
    evaluationDate: new Date().toISOString().split('T')[0],
    observations: '',
    safetyCompliance: false,
    technicalSkills: false,
    problemSolving: false,
    communication: false,
    overallRating: '',
    signature: '',
    employeeSignature: ''
  });

  const [showSignature, setShowSignature] = useState(false);
  const [signatureData, setSignatureData] = useState('');

  const handleInputChange = useCallback((field, value) => {
    setEvaluationData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSignature = useCallback(() => {
    if (signatureData.trim()) {
      setEvaluationData(prev => ({
        ...prev,
        signature: signatureData
      }));
      setShowSignature(false);
      setSignatureData('');
    }
  }, [signatureData]);

  const handleEmployeeSignature = useCallback(() => {
    if (signatureData.trim()) {
      setEvaluationData(prev => ({
        ...prev,
        employeeSignature: signatureData
      }));
      setShowSignature(false);
      setSignatureData('');
    }
  }, [signatureData]);

  const handleSubmit = useCallback(() => {
    const evaluation = {
      id: Date.now(),
      type: 'practical',
      module: module.title,
      employee: formData.fullName,
      employeeId: formData.employeeId,
      date: new Date().toISOString(),
      ...evaluationData,
      passed: evaluationData.overallRating >= 7
    };

    const existingEvaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
    existingEvaluations.push(evaluation);
    localStorage.setItem('evaluations', JSON.stringify(existingEvaluations));

    onComplete(evaluation);
  }, [evaluationData, module.title, formData, onComplete]);

  const isFormComplete = useMemo(() => {
    return evaluationData.supervisorName && 
           evaluationData.supervisorId && 
           evaluationData.observations && 
           evaluationData.overallRating && 
           evaluationData.signature && 
           evaluationData.employeeSignature;
  }, [evaluationData]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <FaClipboardCheck className="text-4xl text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Practical Evaluation (Onfloor)</h3>
        <p className="text-gray-600">Module: {module.title}</p>
        <p className="text-sm text-gray-500 mt-2">
          This evaluation must be completed by a qualified supervisor
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supervisor Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg border-b pb-2">Supervisor Information</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supervisor Name *
            </label>
            <input
              type="text"
              value={evaluationData.supervisorName}
              onChange={(e) => handleInputChange('supervisorName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Full name of supervisor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supervisor ID *
            </label>
            <input
              type="text"
              value={evaluationData.supervisorId}
              onChange={(e) => handleInputChange('supervisorId', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="ID or employee number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evaluation Date
            </label>
            <input
              type="date"
              value={evaluationData.evaluationDate}
              onChange={(e) => handleInputChange('evaluationDate', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg border-b pb-2">Evaluation Criteria</h4>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={evaluationData.safetyCompliance}
                onChange={(e) => handleInputChange('safetyCompliance', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm">Safety protocol compliance</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={evaluationData.technicalSkills}
                onChange={(e) => handleInputChange('technicalSkills', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm">Demonstrated technical skills</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={evaluationData.problemSolving}
                onChange={(e) => handleInputChange('problemSolving', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm">Problem-solving capability</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={evaluationData.communication}
                onChange={(e) => handleInputChange('communication', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm">Effective communication</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating (1-10) *
            </label>
            <select
              value={evaluationData.overallRating}
              onChange={(e) => handleInputChange('overallRating', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select rating</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Observations */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observations and Comments *
        </label>
        <textarea
          value={evaluationData.observations}
          onChange={(e) => handleInputChange('observations', e.target.value)}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Describe observations during the practical evaluation..."
        />
      </div>

      {/* Signatures */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Supervisor Signature *</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
            {evaluationData.signature ? (
              <div className="text-center">
                <FaSignature className="text-2xl text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Signature registered</p>
              </div>
            ) : (
              <button
                onClick={() => setShowSignature(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Signature
              </button>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Employee Signature *</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
            {evaluationData.employeeSignature ? (
              <div className="text-center">
                <FaSignature className="text-2xl text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Signature registered</p>
              </div>
            ) : (
              <button
                onClick={() => setShowSignature(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Signature
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {showSignature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Signature</h3>
            <textarea
              value={signatureData}
              onChange={(e) => setSignatureData(e.target.value)}
              placeholder="Write your full name as signature..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              rows={3}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSignature(false);
                  setSignatureData('');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSignature}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Confirm Supervisor Signature
              </button>
              <button
                onClick={handleEmployeeSignature}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Confirm Employee Signature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          disabled={!isFormComplete}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Complete Practical Evaluation
        </button>
      </div>
    </div>
  );
};

// Main evaluation system component
const EvaluationSystem = ({ module, onComplete, formData }) => {
  const [evaluationType, setEvaluationType] = useState(null);
  const [evaluationHistory, setEvaluationHistory] = useState([]);

  const loadEvaluationHistory = useCallback(() => {
    const evaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
    const moduleEvaluations = evaluations.filter(evaluation => evaluation.module === module.title);
    setEvaluationHistory(moduleEvaluations);
  }, [module.title]);

  const handleEvaluationComplete = useCallback((evaluation) => {
    loadEvaluationHistory();
    onComplete(evaluation);
  }, [loadEvaluationHistory, onComplete]);

  return (
    <div className="space-y-6">
      {!evaluationType ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <FaClipboardCheck className="text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Evaluation System</h3>
            <p className="text-gray-600">Module: {module.title}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setEvaluationType('theoretical')}
              className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <FaFileAlt className="text-3xl text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Theoretical Evaluation</h4>
              <p className="text-sm text-gray-600">
                Knowledge test on module concepts and procedures
              </p>
            </button>

            <button
              onClick={() => setEvaluationType('practical')}
              className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all"
            >
              <FaUserTie className="text-3xl text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Practical Evaluation</h4>
              <p className="text-sm text-gray-600">
                Onfloor evaluation with supervisor signature required
              </p>
            </button>
          </div>

          {/* Evaluation History */}
          <div className="mt-8">
            <h4 className="font-semibold text-lg mb-4">Evaluation History</h4>
            <EvaluationHistory module={module.title} />
          </div>
        </div>
      ) : evaluationType === 'theoretical' ? (
        <TheoreticalEvaluation 
          module={module} 
          onComplete={handleEvaluationComplete}
          formData={formData}
        />
      ) : (
        <PracticalEvaluation 
          module={module} 
          onComplete={handleEvaluationComplete}
          formData={formData}
        />
      )}
    </div>
  );
};

// Component to display evaluation history
const EvaluationHistory = ({ module }) => {
  const [evaluations, setEvaluations] = useState([]);
  const [showDetails, setShowDetails] = useState({});

  React.useEffect(() => {
    const storedEvaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
    const moduleEvaluations = storedEvaluations.filter(evaluation => evaluation.module === module);
    setEvaluations(moduleEvaluations);
  }, [module]);

  const handleToggleDetails = useCallback((id) => {
    setShowDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const downloadEvaluation = useCallback((evaluation) => {
    const evaluationText = `
EVALUATION - ${evaluation.module}
=====================================
Employee: ${evaluation.employee}
ID: ${evaluation.employeeId}
Date: ${new Date(evaluation.date).toLocaleDateString()}
Type: ${evaluation.type === 'theoretical' ? 'Theoretical' : 'Practical'}
Score: ${evaluation.score || evaluation.overallRating}/10
Status: ${evaluation.passed ? 'PASSED' : 'FAILED'}

${evaluation.type === 'practical' ? `
Supervisor: ${evaluation.supervisorName}
Supervisor ID: ${evaluation.supervisorId}
Observations: ${evaluation.observations}

Evaluated Criteria:
- Safety: ${evaluation.safetyCompliance ? '✓' : '✗'}
- Technical Skills: ${evaluation.technicalSkills ? '✓' : '✗'}
- Problem Solving: ${evaluation.problemSolving ? '✓' : '✗'}
- Communication: ${evaluation.communication ? '✓' : '✗'}
` : ''}
    `;

    const blob = new Blob([evaluationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation_${evaluation.module}_${evaluation.employee}_${new Date(evaluation.date).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  if (evaluations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FaFileAlt className="text-3xl mx-auto mb-4 opacity-50" />
        <p>No evaluations registered for this module</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {evaluations.map((evaluation) => (
        <div key={evaluation.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="font-semibold">
                {evaluation.type === 'theoretical' ? 'Theoretical Evaluation' : 'Practical Evaluation'}
              </h5>
              <p className="text-sm text-gray-600">
                {new Date(evaluation.date).toLocaleDateString()} - 
                Score: {evaluation.score || evaluation.overallRating}/10
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                evaluation.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {evaluation.passed ? 'PASSED' : 'FAILED'}
              </span>
              
              <button
                onClick={() => handleToggleDetails(evaluation.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {showDetails[evaluation.id] ? <FaEyeSlash /> : <FaEye />}
              </button>
              
              <button
                onClick={() => downloadEvaluation(evaluation)}
                className="p-1 hover:bg-gray-100 rounded text-blue-600"
                title="Download evaluation"
              >
                <FaDownload />
              </button>
            </div>
          </div>

          {showDetails[evaluation.id] && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              {evaluation.type === 'practical' ? (
                <div className="space-y-2 text-sm">
                  <p><strong>Supervisor:</strong> {evaluation.supervisorName}</p>
                  <p><strong>Observations:</strong> {evaluation.observations}</p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="font-semibold">Evaluated Criteria:</p>
                      <ul className="text-xs space-y-1 mt-1">
                        <li>Safety: {evaluation.safetyCompliance ? '✓' : '✗'}</li>
                        <li>Technical Skills: {evaluation.technicalSkills ? '✓' : '✗'}</li>
                        <li>Problem Solving: {evaluation.problemSolving ? '✓' : '✗'}</li>
                        <li>Communication: {evaluation.communication ? '✓' : '✗'}</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold">Signatures:</p>
                      <p className="text-xs mt-1">
                        Supervisor: {evaluation.signature ? '✓' : '✗'}<br/>
                        Employee: {evaluation.employeeSignature ? '✓' : '✗'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <p><strong>Score:</strong> {evaluation.score}%</p>
                  <p><strong>Correct answers:</strong> {
                    Object.values(evaluation.answers || {}).filter((answer, index) => 
                      answer === [0, 0, 0][index]
                    ).length
                  } of 3</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export { EvaluationHistory };
export default EvaluationSystem; 