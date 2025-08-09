import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaUser, FaCog, FaGraduationCap, FaGlobe, FaClock, FaBullseye, FaTools, FaBook, FaRobot, FaSpinner, FaFileExport, FaComments, FaTimes, FaPaperPlane, FaKey, FaChartBar, FaCalendar, FaCheckCircle, FaClipboardCheck, FaDownload, FaTimesCircle, FaFileAlt, FaUserTie } from "react-icons/fa";
import { OpenAIService } from './services/openaiService';
import { DemoService } from './services/demoService';
import { OllamaService } from './services/ollamaService';
import { EvaluationService } from './services/evaluationService';
import { ResourceEnrichmentService } from './services/resourceEnrichmentService';
import EvaluationSystem, { EvaluationHistory } from './components/EvaluationSystem';
import ApiConfig from './components/ApiConfig';
import VideoPlayer from './components/VideoPlayer';
import PDFViewer from './components/PDFViewer';
import InlinePDFViewer from './components/InlinePDFViewer';
import InteractiveCanvas from './components/InteractiveCanvas';

// Debounce hook para optimizar búsquedas
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function HexpolTrainingForm() {
  // 1. Estado del formulario optimizado
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    employeeId: '',
    position: '',
    currentRole: '',
    targetTime: '1',
    knowledgeSource: 'internal',
    mechanical: 'none',
    electrical: 'none',
    hydraulics: 'none',
    pneumatics: 'none',
    controls: 'none',
    safetyEhs: 'none',
    learningStyle: '',
    language: 'english',
    hoursPerWeek: '1-2',
    preferredSchedule: 'morning',
    developmentGoal: '',
    equipmentUsed: []
  });

  // Memoizar trainingResources organizados por semana
  const [trainingResources, setTrainingResources] = useState(() => {
    const generateWeekContent = (weekNumber) => {
      // Contenido realista por semana
      const weekContentMap = {
        1: {
          title: "Safety Fundamentals & Equipment Overview",
          resources: [
            {
              id: "1-1",
              title: "Industrial Safety Standards & PPE Requirements",
              type: "video",
              duration: "25 min",
              url: "https://training.hexpol.com/safety-fundamentals",
              completed: false,
              description: "Comprehensive overview of safety protocols, personal protective equipment, and workplace safety regulations."
            },
            {
              id: "1-2",
              title: "Equipment Safety Walkthrough - Farrel F270",
              type: "interactive",
              duration: "40 min",
              url: "#",
              completed: false,
              description: "Interactive 3D simulation of the Farrel F270 mixer with safety checkpoints and emergency procedures."
            },
            {
              id: "1-3",
              title: "Safety Assessment & Certification",
              type: "pdf",
              duration: "15 min",
              url: "/documents/safety-assessment-week1.pdf",
              completed: false,
              description: "Safety knowledge evaluation and certification test covering all safety fundamentals."
            }
          ]
        },
        2: {
          title: "Hydraulic Systems & Basic Operations",
          resources: [
            {
              id: "2-1",
              title: "Hydraulic System Fundamentals & Components",
              type: "video",
              duration: "30 min",
              url: "https://training.hexpol.com/hydraulic-systems",
              completed: false,
              description: "Understanding hydraulic principles, pumps, valves, and system components in industrial machinery."
            },
            {
              id: "2-2",
              title: "Hydraulic System Troubleshooting Simulation",
              type: "interactive",
              duration: "45 min",
              url: "#",
              completed: false,
              description: "Interactive troubleshooting scenarios for common hydraulic system issues and maintenance procedures."
            },
            {
              id: "2-3",
              title: "Hydraulic System Maintenance Guide",
              type: "pdf",
              duration: "20 min",
              url: "/documents/hydraulic-maintenance-guide.pdf",
              completed: false,
              description: "Comprehensive maintenance procedures and preventive care for hydraulic systems."
            }
          ]
        },
        3: {
          title: "Electrical Systems & Control Panels",
          resources: [
            {
              id: "3-1",
              title: "Electrical Safety & Lockout/Tagout Procedures",
              type: "video",
              duration: "35 min",
              url: "https://training.hexpol.com/electrical-safety",
              completed: false,
              description: "Electrical safety protocols, lockout/tagout procedures, and electrical hazard recognition."
            },
            {
              id: "3-2",
              title: "Control Panel Operations & Programming",
              type: "interactive",
              duration: "50 min",
              url: "#",
              completed: false,
              description: "Hands-on control panel operation, parameter setting, and basic programming for industrial equipment."
            },
            {
              id: "3-3",
              title: "Electrical Troubleshooting Manual",
              type: "pdf",
              duration: "25 min",
              url: "/documents/electrical-troubleshooting.pdf",
              completed: false,
              description: "Step-by-step electrical troubleshooting procedures and diagnostic techniques."
            }
          ]
        },
        4: {
          title: "Pneumatic Systems & Air Controls",
          resources: [
            {
              id: "4-1",
              title: "Pneumatic System Principles & Components",
              type: "video",
              duration: "28 min",
              url: "https://training.hexpol.com/pneumatic-systems",
              completed: false,
              description: "Understanding pneumatic systems, air compressors, valves, and control mechanisms."
            },
            {
              id: "4-2",
              title: "Pneumatic System Maintenance Simulation",
              type: "interactive",
              duration: "40 min",
              url: "#",
              completed: false,
              description: "Interactive maintenance procedures for pneumatic systems including filter changes and valve maintenance."
            },
            {
              id: "4-3",
              title: "Pneumatic System Troubleshooting Guide",
              type: "pdf",
              duration: "18 min",
              url: "/documents/pneumatic-troubleshooting.pdf",
              completed: false,
              description: "Diagnostic procedures and common solutions for pneumatic system issues."
            }
          ]
        },
        5: {
          title: "Farrel F270 Advanced Operations",
          resources: [
            {
              id: "5-1",
              title: "F270 Operating Procedures & Best Practices",
              type: "video",
              duration: "45 min",
              url: "https://training.hexpol.com/f270-operations",
              completed: false,
              description: "Advanced operating procedures, parameter optimization, and production best practices for the F270."
            },
            {
              id: "5-2",
              title: "F270 Advanced Control & Optimization",
              type: "interactive",
              duration: "60 min",
              url: "#",
              completed: false,
              description: "Advanced control system operation, recipe management, and production optimization techniques."
            },
            {
              id: "5-3",
              title: "F270 Operator Manual & Quick Reference",
              type: "pdf",
              duration: "30 min",
              url: "/documents/f270-operator-manual.pdf",
              completed: false,
              description: "Complete operator manual with quick reference guides and troubleshooting charts."
            }
          ]
        },
        6: {
          title: "Quality Control & Process Monitoring",
          resources: [
            {
              id: "6-1",
              title: "Quality Control Procedures & Standards",
              type: "video",
              duration: "32 min",
              url: "https://training.hexpol.com/quality-control",
              completed: false,
              description: "Quality control procedures, measurement techniques, and industry standards compliance."
            },
            {
              id: "6-2",
              title: "Process Monitoring & Data Analysis",
              type: "interactive",
              duration: "55 min",
              url: "#",
              completed: false,
              description: "Real-time process monitoring, data collection, and statistical process control implementation."
            },
            {
              id: "6-3",
              title: "Quality Documentation & Reporting",
              type: "pdf",
              duration: "22 min",
              url: "/documents/quality-documentation.pdf",
              completed: false,
              description: "Quality documentation procedures, report generation, and compliance requirements."
            }
          ]
        },
        7: {
          title: "Preventive Maintenance & Predictive Analytics",
          resources: [
            {
              id: "7-1",
              title: "Preventive Maintenance Strategies & Scheduling",
              type: "video",
              duration: "38 min",
              url: "https://training.hexpol.com/preventive-maintenance",
              completed: false,
              description: "Preventive maintenance strategies, scheduling systems, and maintenance planning."
            },
            {
              id: "7-2",
              title: "Predictive Analytics & Condition Monitoring",
              type: "interactive",
              duration: "65 min",
              url: "#",
              completed: false,
              description: "Advanced condition monitoring, predictive analytics, and IoT sensor integration."
            },
            {
              id: "7-3",
              title: "Maintenance Planning & Documentation",
              type: "pdf",
              duration: "28 min",
              url: "/documents/maintenance-planning.pdf",
              completed: false,
              description: "Maintenance planning procedures, documentation standards, and work order management."
            }
          ]
        },
        8: {
          title: "Emergency Procedures & Incident Response",
          resources: [
            {
              id: "8-1",
              title: "Emergency Response Procedures & Protocols",
              type: "video",
              duration: "42 min",
              url: "https://training.hexpol.com/emergency-procedures",
              completed: false,
              description: "Emergency response procedures, evacuation protocols, and incident reporting requirements."
            },
            {
              id: "8-2",
              title: "Emergency Scenario Simulations",
              type: "interactive",
              duration: "70 min",
              url: "#",
              completed: false,
              description: "Realistic emergency scenario simulations including equipment failures and safety incidents."
            },
            {
              id: "8-3",
              title: "Emergency Response Manual & Checklists",
              type: "pdf",
              duration: "35 min",
              url: "/documents/emergency-response-manual.pdf",
              completed: false,
              description: "Comprehensive emergency response manual with checklists and contact procedures."
            }
          ]
        },
        9: {
          title: "Advanced Troubleshooting & Diagnostics",
          resources: [
            {
              id: "9-1",
              title: "Advanced Diagnostic Techniques & Tools",
              type: "video",
              duration: "48 min",
              url: "https://training.hexpol.com/advanced-diagnostics",
              completed: false,
              description: "Advanced diagnostic techniques, specialized tools, and systematic troubleshooting approaches."
            },
            {
              id: "9-2",
              title: "Complex Problem-Solving Scenarios",
              type: "interactive",
              duration: "75 min",
              url: "#",
              completed: false,
              description: "Complex troubleshooting scenarios with multiple system interactions and root cause analysis."
            },
            {
              id: "9-3",
              title: "Troubleshooting Reference Manual",
              type: "pdf",
              duration: "40 min",
              url: "/documents/troubleshooting-reference.pdf",
              completed: false,
              description: "Comprehensive troubleshooting reference with diagnostic flowcharts and solutions database."
            }
          ]
        },
        10: {
          title: "Team Leadership & Communication",
          resources: [
            {
              id: "10-1",
              title: "Leadership Skills & Team Management",
              type: "video",
              duration: "35 min",
              url: "https://training.hexpol.com/leadership-skills",
              completed: false,
              description: "Leadership development, team management techniques, and effective communication strategies."
            },
            {
              id: "10-2",
              title: "Cross-Training & Knowledge Transfer",
              type: "interactive",
              duration: "60 min",
              url: "#",
              completed: false,
              description: "Interactive scenarios for training team members and transferring technical knowledge."
            },
            {
              id: "10-3",
              title: "Leadership Assessment & Development Plan",
              type: "pdf",
              duration: "25 min",
              url: "/documents/leadership-assessment.pdf",
              completed: false,
              description: "Leadership assessment tools and personal development planning resources."
            }
          ]
        },
        11: {
          title: "Continuous Improvement & Innovation",
          resources: [
            {
              id: "11-1",
              title: "Lean Manufacturing & Process Improvement",
              type: "video",
              duration: "40 min",
              url: "https://training.hexpol.com/lean-manufacturing",
              completed: false,
              description: "Lean manufacturing principles, process improvement methodologies, and efficiency optimization."
            },
            {
              id: "11-2",
              title: "Innovation & Technology Integration",
              type: "interactive",
              duration: "80 min",
              url: "#",
              completed: false,
              description: "Emerging technologies, automation integration, and innovation implementation strategies."
            },
            {
              id: "11-3",
              title: "Continuous Improvement Toolkit",
              type: "pdf",
              duration: "30 min",
              url: "/documents/continuous-improvement.pdf",
              completed: false,
              description: "Continuous improvement methodologies, tools, and implementation frameworks."
            }
          ]
        },
        12: {
          title: "Certification & Advanced Specialization",
          resources: [
            {
              id: "12-1",
              title: "Final Assessment & Certification Preparation",
              type: "video",
              duration: "45 min",
              url: "https://training.hexpol.com/certification-prep",
              completed: false,
              description: "Final assessment preparation, certification requirements, and advanced skill validation."
            },
            {
              id: "12-2",
              title: "Advanced Specialization Modules",
              type: "interactive",
              duration: "90 min",
              url: "#",
              completed: false,
              description: "Advanced specialization modules in specific areas of expertise and advanced techniques."
            },
            {
              id: "12-3",
              title: "Certification Documentation & Portfolio",
              type: "pdf",
              duration: "35 min",
              url: "/documents/certification-portfolio.pdf",
              completed: false,
              description: "Certification documentation, portfolio development, and continuing education planning."
            }
          ]
        }
      };

      const weekContent = weekContentMap[weekNumber] || {
        title: `Week ${weekNumber} - Advanced Topics`,
        resources: [
          {
            id: `${weekNumber}-1`,
            title: `Week ${weekNumber} - Advanced Concepts`,
            type: "video",
            duration: "30 min",
            url: `https://training.hexpol.com/week${weekNumber}`,
            completed: false,
            description: `Advanced concepts and specialized training for week ${weekNumber}.`
          },
          {
            id: `${weekNumber}-2`,
            title: `Week ${weekNumber} - Specialized Applications`,
            type: "interactive",
            duration: "45 min",
            url: "#",
            completed: false,
            description: `Specialized applications and advanced techniques for week ${weekNumber}.`
          },
          {
            id: `${weekNumber}-3`,
            title: `Week ${weekNumber} - Advanced Assessment`,
            type: "pdf",
            duration: "25 min",
            url: `/documents/week${weekNumber}-advanced.pdf`,
            completed: false,
            description: `Advanced assessment and evaluation for week ${weekNumber}.`
          }
        ]
      };

      return {
        week: weekNumber,
        title: weekContent.title,
        resources: weekContent.resources
      };
    };

    // Generar contenido para 12 semanas (3 meses por defecto)
    return Array.from({ length: 12 }, (_, index) => generateWeekContent(index + 1));
  });

  const [suggestions, setSuggestions] = useState([]);
  const [equipmentInput, setEquipmentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // 2. Estados para la generación del curso
  const [generatedCourse, setGeneratedCourse] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key'));
  const [showApiConfig, setShowApiConfig] = useState(() => !localStorage.getItem('openai_api_key'));
  const [generationStatus, setGenerationStatus] = useState('');
  const [demoMode, setDemoMode] = useState(() => !localStorage.getItem('openai_api_key'));
  const [localMode, setLocalMode] = useState(false);

  const [activeTab, setActiveTab] = useState('form');
  const [evaluationStats, setEvaluationStats] = useState(null);
  const [activeWeek, setActiveWeek] = useState(1);
  const [completedWeeks, setCompletedWeeks] = useState(new Set());

  // 3. Estados para el progreso y chatbot
  const [overallProgress, setOverallProgress] = useState(0);
  const [showChatbot, setShowChatbot] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFullPlan, setShowFullPlan] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => [
    {
      id: 1,
      type: 'bot',
      message: 'Hello! I\'m your virtual tutor from TechFlow Academy. I\'m here to help you with your training. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Estados para My Journey y Goals History
  const [openGoals, setOpenGoals] = useState([
    {
      id: 1,
      title: "Master Hydraulic Systems",
      description: "Complete advanced hydraulic troubleshooting certification",
      targetDate: "2024-03-15",
      progress: 65,
      category: "Technical Skills",
      priority: "High"
    },
    {
      id: 2,
      title: "Safety Leadership",
      description: "Lead safety improvement initiatives in the department",
      targetDate: "2024-04-20",
      progress: 30,
      category: "Leadership",
      priority: "Medium"
    },
    {
      id: 3,
      title: "Equipment Optimization",
      description: "Implement preventive maintenance protocols for Farrel F270",
      targetDate: "2024-05-10",
      progress: 45,
      category: "Equipment",
      priority: "High"
    }
  ]);

  const [goalsHistory, setGoalsHistory] = useState([
    {
      id: 1,
      title: "Basic Electrical Training",
      description: "Complete fundamental electrical systems course",
      completedDate: "2024-01-15",
      category: "Technical Skills",
      status: "Completed",
      score: 92
    },
    {
      id: 2,
      title: "Safety Certification",
      description: "Obtain OSHA safety certification",
      completedDate: "2023-12-10",
      category: "Safety",
      status: "Completed",
      score: 88
    },
    {
      id: 3,
      title: "Team Communication",
      description: "Improve team communication and collaboration skills",
      completedDate: "2023-11-20",
      category: "Soft Skills",
      status: "Completed",
      score: 85
    }
  ]);

      // States for evaluation system
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [currentEvaluationModule, setCurrentEvaluationModule] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState([]);
  const [completedEvaluations, setCompletedEvaluations] = useState(new Set());
  
  // Estados para modales de contenido
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [inlinePDFContent, setInlinePDFContent] = useState(null);
  const [generatingResourceId, setGeneratingResourceId] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [showInteractiveCanvas, setShowInteractiveCanvas] = useState(false);
  const [interactiveInstructions, setInteractiveInstructions] = useState('');
  const [interactiveTitle, setInteractiveTitle] = useState('');
  
  // Log para debuggear el estado
  useEffect(() => {
    if (inlinePDFContent) {
      console.log('=== INLINE PDF CONTENT CHANGED ===');
      console.log('Content loaded:', inlinePDFContent.title, '(', inlinePDFContent.content.length, 'characters)');
      console.log('Content preview:', inlinePDFContent.content.substring(0, 100) + '...');
    }
  }, [inlinePDFContent]);

  // Log para monitorear el estado de generación
  useEffect(() => {
    console.log('=== GENERATING RESOURCE STATE CHANGED ===');
    console.log('generatingResourceId changed to:', generatingResourceId);
  }, [generatingResourceId]);

  // Debounce para equipmentInput
  const debouncedEquipmentInput = useDebounce(equipmentInput, 300);

  // Actualizar trainingResources cuando se genera el curso
  useEffect(() => {
    if (generatedCourse) {
      console.log('Updating training resources from generated course...');
      console.log('Generated course preview:', generatedCourse.substring(0, 500) + '...');
      
      // Extraer semanas y recursos del markdown
      const weeks = [];
      const lines = generatedCourse.split('\n');
      let currentWeek = null;
      let currentResources = [];

      for (const line of lines) {
        // Detectar semanas
        if (line.startsWith('## Week')) {
          if (currentWeek) {
            weeks.push({
              ...currentWeek,
              resources: currentResources
            });
          }
          
          const weekMatch = line.match(/## Week (\d+): (.+)/);
          if (weekMatch) {
            currentWeek = {
              weekNumber: parseInt(weekMatch[1]),
              title: weekMatch[2].trim()
            };
            currentResources = [];
            console.log('Found week:', currentWeek);
          }
        }
        
        // Detectar recursos con enlaces
        const resourceMatch = line.match(/\*\*(video|pdf|interactive)\*\*:?\s*\[([^\]]+)\]\(([^)]+)\)/);
        if (resourceMatch && currentWeek) {
          const [, type, title, url] = resourceMatch;
          currentResources.push({
            id: `${currentWeek.weekNumber}-${currentResources.length + 1}`,
            title: title.trim(),
            type: type.toLowerCase(),
            duration: '30 min',
            url: url.trim(),
            completed: false,
            description: `${type} training resource for ${currentWeek.title}`
          });
          console.log('Found resource with link:', { title, type, url });
        }
        
        // Detectar recursos con formato generado
        const generatedMatch = line.match(/\*\*(video|pdf|interactive)\*\*:?\s*\[([^\]]+)\]\(generated:([^)]+)\)/);
        if (generatedMatch && currentWeek) {
          const [, type, title, encodedContent] = generatedMatch;
          currentResources.push({
            id: `${currentWeek.weekNumber}-${currentResources.length + 1}`,
            title: title.trim(),
            type: type.toLowerCase(),
            duration: '30 min',
            url: `generated:${encodedContent}`,
            completed: false,
            description: `${type} training resource for ${currentWeek.title}`
          });
          console.log('Found generated resource:', { title, type, contentLength: encodedContent.length });
        }
        
        // Detectar recursos sin enlaces
        const resourceNoLinkMatch = line.match(/\*\*(video|pdf|interactive)\*\*:?\s*([^\n]+)/);
        if (resourceNoLinkMatch && currentWeek) {
          const [, type, title] = resourceNoLinkMatch;
          currentResources.push({
            id: `${currentWeek.weekNumber}-${currentResources.length + 1}`,
            title: title.trim(),
            type: type.toLowerCase(),
            duration: '30 min',
            url: null,
            completed: false,
            description: `${type} training resource for ${currentWeek.title}`
          });
          console.log('Found resource without link:', { title, type });
        }
      }

      // Agregar la última semana
      if (currentWeek) {
        weeks.push({
          ...currentWeek,
          resources: currentResources
        });
      }

      // Si no se encontraron recursos, crear recursos por defecto
      if (weeks.length > 0 && weeks.every(week => week.resources.length === 0)) {
        console.log('No resources found, creating default resources...');
        weeks.forEach(week => {
          week.resources = [
            {
              id: `${week.weekNumber}-1`,
              title: `${week.title} - Video Training`,
              type: 'video',
              duration: '30 min',
              url: null,
              completed: false,
              description: `Video training for ${week.title}`
            },
            {
              id: `${week.weekNumber}-2`,
              title: `${week.title} - Technical Documentation`,
              type: 'pdf',
              duration: '45 min',
              url: null,
              completed: false,
              description: `Technical documentation for ${week.title}`
            },
            {
              id: `${week.weekNumber}-3`,
              title: `${week.title} - Interactive Module`,
              type: 'interactive',
              duration: '60 min',
              url: null,
              completed: false,
              description: `Interactive training module for ${week.title}`
            }
          ];
        });
      }

      console.log('Setting training resources:', weeks);
      setTrainingResources(weeks);
    }
  }, [generatedCourse]);

  // Memoizar el cálculo de progreso
  const calculateProgress = useCallback(() => {
    let progress = 0;
    
    // Progreso del formulario (30%)
    const formFields = ['fullName', 'email', 'employeeId', 'position', 'currentRole', 'targetTime', 'learningStyle', 'developmentGoal'];
    const completedFields = formFields.filter(field => formData[field] && formData[field].length > 0).length;
    progress += (completedFields / formFields.length) * 30;
    
    // Progreso de recursos completados (50%)
    const completedResources = trainingResources.filter(resource => resource.completed).length;
    progress += (completedResources / trainingResources.length) * 50;
    
    // Progreso de evaluaciones completadas (20%)
    const totalEvaluations = trainingResources.length; // One evaluation per module
    const completedEvaluationsCount = completedEvaluations.size;
    progress += (completedEvaluationsCount / totalEvaluations) * 20;
    
    return Math.round(progress);
  }, [formData, trainingResources, completedEvaluations]);

      // Functions for evaluation system
  const handleStartEvaluation = useCallback((module) => {
    setCurrentEvaluationModule(module);
    setShowEvaluation(true);
  }, []);

  const handleEvaluationComplete = useCallback((evaluation) => {
    // Validate evaluation before saving
    const validation = EvaluationService.validateEvaluation(evaluation);
    if (!validation.isValid) {
      alert(`Evaluation errors:\n${validation.errors.join('\n')}`);
      return;
    }

    // Save evaluation using service
    const saved = EvaluationService.saveEvaluation(evaluation);
    if (!saved) {
      alert('Error saving evaluation. Please try again.');
      return;
    }

    setEvaluationResults(prev => [...prev, evaluation]);
    setCompletedEvaluations(prev => new Set([...prev, evaluation.module]));
    setShowEvaluation(false);
    setCurrentEvaluationModule(null);
    
    // Evaluación completada exitosamente - sin popup
    console.log('Evaluation completed successfully:', evaluation);
  }, []);

  const checkModuleCompletion = useCallback((module) => {
    const moduleResources = trainingResources.find(week => week.title === module.title)?.resources || [];
    const allResourcesCompleted = moduleResources.every(resource => resource.completed);
    const evaluationCompleted = completedEvaluations.has(module.title);
    
    return allResourcesCompleted && evaluationCompleted;
  }, [trainingResources, completedEvaluations]);

      // Function to load evaluation statistics
  const loadEvaluationStats = useCallback(() => {
    const stats = EvaluationService.getEvaluationStats();
    setEvaluationStats(stats);
  }, []);

  // Cargar estadísticas cuando cambie la pestaña
  useEffect(() => {
    if (activeTab === 'evaluations') {
      loadEvaluationStats();
    }
  }, [activeTab, loadEvaluationStats]);

  // Memoizar recursos filtrados para la semana activa
  const filteredResources = useMemo(() => {
    const currentWeekResources = trainingResources.find(week => week.weekNumber === activeWeek);
    if (!currentWeekResources) return [];
    
    return activeFilter === 'all' 
      ? currentWeekResources.resources 
      : currentWeekResources.resources.filter(resource => resource.type === activeFilter);
  }, [trainingResources, activeWeek, activeFilter]);

  // Memoizar lista de equipos
  const allEquipment = useMemo(() => [
    "Farrel F270", "Banbury", "Extruders", "Internal mixers",
    "Mills", "Calenders", "Cutting lines", "Cooling systems",
    "Testing equipment", "Control systems", "Presses", "Conveyors"
  ], []);

  // Optimizar búsqueda de equipos con debounce
  useEffect(() => {
    if (debouncedEquipmentInput.length > 1) {
      const filtered = allEquipment.filter(equipment => 
        equipment.toLowerCase().includes(debouncedEquipmentInput.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [debouncedEquipmentInput, allEquipment]);

  // Actualizar progreso cuando cambien los datos (optimizado)
  useEffect(() => {
    const newProgress = calculateProgress();
    setOverallProgress(newProgress);
  }, [calculateProgress]);

  // Función optimizada para manejar mensajes del chatbot
  const handleChatMessage = useCallback(async (message) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: message,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    try {
      const context = `Employee: ${formData.fullName}, Role: ${formData.currentRole}, Learning Style: ${formData.learningStyle}, Current Progress: ${overallProgress}%`;
      let response;
      
      if (localMode) {
        response = await OllamaService.generateChatbotResponse(message, context);
      } else if (demoMode) {
        response = await DemoService.generateChatbotResponse(message, context);
      } else {
        response = await OpenAIService.generateChatbotResponse(message, context);
      }
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: response,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const fallbackResponses = [
        "I understand your question. I'll help you find the information you need.",
        "Excellent progress. Would you like me to explain something specific about the content?",
        "Based on your profile, I recommend reviewing that section. Do you need additional help?",
        "Very good! You're progressing correctly. Is there anything else I can help you with?",
        "Perfect, that's an excellent question. Let me explain the details."
      ];
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: randomResponse,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botMessage]);
    }
  }, [formData.fullName, formData.currentRole, formData.learningStyle, overallProgress, localMode, demoMode]);

  // Función optimizada para enviar mensaje del chat
  const sendChatMessage = useCallback((e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      handleChatMessage(chatInput.trim());
    }
  }, [chatInput, handleChatMessage]);

  // Función optimizada para renderizar recursos de entrenamiento
  const renderTrainingResources = useCallback(() => {
    const currentWeekResources = trainingResources.find(week => week.weekNumber === activeWeek);
    if (!currentWeekResources) return <div>No content available for this week.</div>;
    
    const allResourcesCompleted = currentWeekResources.resources.every(resource => resource.completed);
    const evaluationCompleted = completedEvaluations.has(currentWeekResources.title);
    
    return (
      <>
        {filteredResources.map((resource, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{resource.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{resource.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <span className={`capitalize px-2 py-1 rounded mr-2 ${
                    resource.type === 'video' ? 'bg-red-100 text-red-800' :
                    resource.type === 'pdf' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {resource.type}
                  </span>
                  <span className="flex items-center">
                    <FaClock className="mr-1" />
                    {resource.duration}
                  </span>
                </div>
              </div>
              <button
                onClick={() => markAsCompleted(resource.id)}
                className={`px-3 py-1 rounded-full text-sm ml-4 ${
                  resource.completed
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {resource.completed ? "✓ Completed" : "Mark as done"}
              </button>
            </div>
            
            {/* Mostrar diferente contenido según el tipo */}
            <div className="mt-4">
              {/* Indicador de generación */}
              {generatingResourceId === resource.id && resource.type === "pdf" && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin text-blue-600 mr-3 text-xl" />
                    <div>
                      <p className="text-blue-800 font-medium">Generating technical content...</p>
                      <p className="text-blue-600 text-sm">This may take 10-30 seconds depending on content length</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Mostrar contenido PDF inline si existe */}
              {inlinePDFContent && resource.type === "pdf" && inlinePDFContent.title === resource.title && (
                <div key={`${resource.id}-${inlinePDFContent.content.length}`}>
                  <p className="text-sm text-green-600 mb-2">✅ Content loaded! Length: {inlinePDFContent.content.length} characters</p>
                  <InlinePDFViewer
                    key={`pdf-viewer-${resource.id}-${Date.now()}`}
                    content={inlinePDFContent.content}
                    title={inlinePDFContent.title}
                    onClose={() => setInlinePDFContent(null)}
                  />
                </div>
              )}
              
              {resource.type === "video" && (
                <div className="bg-black bg-opacity-5 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🎥</span>
                      <div>
                        <p className="font-medium">Video Training</p>
                        <p className="text-sm text-gray-600">Click to watch the training video</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleResourceClick(resource)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                    >
                      <span className="mr-2">▶</span>
                      Watch Now
                    </button>
                  </div>
                </div>
              )}
              
              {resource.type === "pdf" && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📄</span>
                      <div>
                        <p className="font-medium">Document Download</p>
                        <p className="text-sm text-gray-600">Download and read the training material</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleResourceClick(resource)}
                      disabled={generatingResourceId === resource.id}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        generatingResourceId === resource.id
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {generatingResourceId === resource.id ? (
                        <>
                          <FaSpinner className="mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">📄</span>
                          View Content
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              {resource.type === "interactive" && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🎮</span>
                      <div>
                        <p className="font-medium">Interactive Practice Canvas</p>
                        <p className="text-sm text-gray-600">Draw, write, and practice with interactive tools</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleResourceClick(resource)}
                      disabled={generatingResourceId === resource.id}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        generatingResourceId === resource.id
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {generatingResourceId === resource.id ? (
                        <>
                          <FaSpinner className="mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">🎨</span>
                          Open Canvas
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Mostrar canvas interactivo si está activo */}
                  {showInteractiveCanvas && interactiveTitle === resource.title && (
                    <div key={`canvas-${resource.id}-${showInteractiveCanvas}`} className="mt-4">
                      <InteractiveCanvas
                        key={`interactive-canvas-${resource.id}-${Date.now()}`}
                        instructions={interactiveInstructions}
                        title={interactiveTitle}
                        onSave={handleCanvasSave}
                      />
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => {
                            console.log('Closing canvas for resource:', resource.id);
                            setShowInteractiveCanvas(false);
                            setInteractiveInstructions('');
                            setInteractiveTitle('');
                            // Forzar re-renderizado
                            setTimeout(() => {
                              console.log('Canvas should be closed now');
                            }, 0);
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          Close Canvas
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {/* Evaluation Section */}
        {!showEvaluation ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mt-6 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="text-center mb-4">
              <FaClipboardCheck className="text-3xl text-purple-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Module Evaluation</h3>
              <p className="text-gray-600">
                {allResourcesCompleted 
                  ? "All resources are completed! You can now take the evaluation."
                  : "Complete all module resources to access the evaluation."
                }
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              {allResourcesCompleted ? (
                <button
                  onClick={() => handleStartEvaluation(currentWeekResources)}
                  disabled={evaluationCompleted}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                    evaluationCompleted
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  <FaClipboardCheck className="mr-2" />
                  {evaluationCompleted ? 'Evaluation Completed ✓' : 'Start Evaluation'}
                </button>
              ) : (
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">
                    Progress: {currentWeekResources.resources.filter(r => r.completed).length} / {currentWeekResources.resources.length} resources completed
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(currentWeekResources.resources.filter(r => r.completed).length / currentWeekResources.resources.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            {evaluationCompleted && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-center">
                  <FaCheckCircle className="text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Evaluation completed successfully</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mt-6 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="text-center mb-4">
              <FaClipboardCheck className="text-3xl text-purple-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Module Evaluation</h3>
              <p className="text-gray-600">Complete the evaluation to continue with your training</p>
            </div>
            
            <EvaluationSystem
              module={currentWeekResources}
              onComplete={handleEvaluationComplete}
              formData={formData}
            />
          </div>
        )}
      </>
    );
  }, [filteredResources, completedEvaluations, handleStartEvaluation, generatingResourceId, inlinePDFContent, showInteractiveCanvas, interactiveTitle, interactiveInstructions]);

  // Funciones optimizadas con useCallback
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSkillChange = useCallback((skill, level) => {
    setFormData(prev => ({ ...prev, [skill]: level }));
  }, []);

  const handleEquipmentChange = useCallback((e) => {
    setEquipmentInput(e.target.value);
  }, []);

  const addEquipment = useCallback((equipment) => {
    setFormData(prev => {
      if (!prev.equipmentUsed.includes(equipment)) {
        return {
          ...prev,
          equipmentUsed: [...prev.equipmentUsed, equipment]
        };
      }
      return prev;
    });
    setEquipmentInput('');
    setSuggestions([]);
  }, []);

  const removeEquipment = useCallback((equipment) => {
    setFormData(prev => ({
      ...prev,
      equipmentUsed: prev.equipmentUsed.filter(item => item !== equipment)
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log("Submitted data:", formData);
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setTimeout(() => setSubmissionSuccess(false), 3000);
    }, 1500);
  }, [formData]);

  const markAsCompleted = useCallback((id) => {
    setTrainingResources(prev =>
      prev.map(week => ({
        ...week,
        resources: week.resources.map(resource =>
          resource.id === id
            ? { ...resource, completed: !resource.completed }
            : resource
        )
      }))
    );
  }, []);

  // Función para marcar semana como completada
  const toggleWeekCompletion = useCallback((weekNumber) => {
    setCompletedWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(weekNumber)) {
        newSet.delete(weekNumber);
      } else {
        newSet.add(weekNumber);
      }
      return newSet;
    });
  }, []);

  // Función optimizada para generar el curso
  const generateCourse = useCallback(async () => {
    if (!apiKey && !demoMode) {
      setShowApiConfig(true);
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
          setGenerationStatus(demoMode ? 'Generating demonstration plan...' : 'Starting generation...');
    
    try {
      // Guardar datos del formulario en localStorage para uso posterior
      localStorage.setItem('trainingFormData', JSON.stringify(formData));
      console.log('Form data saved to localStorage:', formData);
      
      let response;
      
      if (localMode) {
        response = await OllamaService.generateTrainingPlan(formData);
      } else if (demoMode) {
        response = await DemoService.generateTrainingPlan(formData);
      } else {
        response = await OpenAIService.generateTrainingPlan(formData);
      }
      
      setGeneratedCourse(response);
      setActiveTab('course');
      setGenerationStatus('');
    } catch (error) {
      setGenerationError(error.message || "Failed to generate course. Please check your API key and try again.");
      console.error("Generation error:", error);
      setGenerationStatus('');
    } finally {
      setIsGenerating(false);
    }
  }, [apiKey, demoMode, localMode, formData]);

      // Optimized function to calculate estimated cost
  const getEstimatedCost = useCallback(() => {
    const inputTokens = 300;
    const outputTokens = 800;
    const inputCost = (inputTokens / 1000) * 0.0015;
    const outputCost = (outputTokens / 1000) * 0.002;
    return (inputCost + outputCost).toFixed(4);
  }, []);

  // Función optimizada para manejar la configuración de la API
  const handleApiKeySet = useCallback((key) => {
    setApiKey(key);
    setShowApiConfig(false);
    if (key) {
      setDemoMode(false);
    }
  }, []);

  // Función para parsear el plan de entrenamiento del markdown
  const parseTrainingPlanMarkdown = useCallback((markdown) => {
    console.log('Parsing markdown:', markdown);
    
    const weeks = [];
    const lines = markdown.split('\n');
    let currentWeek = null;
    let currentResources = [];

    for (const line of lines) {
      // Detectar semanas
      if (line.startsWith('## Week')) {
        if (currentWeek) {
          weeks.push({
            ...currentWeek,
            resources: currentResources
          });
        }
        
        const weekMatch = line.match(/## Week (\d+): (.+)/);
        if (weekMatch) {
          currentWeek = {
            weekNumber: parseInt(weekMatch[1]),
            title: weekMatch[2].trim()
          };
          currentResources = [];
          console.log('Found week:', currentWeek);
        }
      }
      
      // Detectar recursos con enlaces (formato markdown)
      const resourceMatch = line.match(/\*\*(video|pdf|interactive)\*\*:?\s*\[([^\]]+)\]\(([^)]+)\)/);
      if (resourceMatch && currentWeek) {
        const [, type, title, url] = resourceMatch;
        const resource = {
          id: `${currentWeek.weekNumber}-${currentResources.length + 1}`,
          title: title.trim(),
          type: type.toLowerCase(),
          duration: '30 min',
          url: url.trim(),
          completed: false,
          description: `${type} training resource for ${currentWeek.title}`
        };
        currentResources.push(resource);
        console.log('Found resource with link:', resource);
      }
      
      // Detectar recursos sin enlaces (formato simple)
      const resourceNoLinkMatch = line.match(/\*\*(video|pdf|interactive)\*\*:?\s*([^\n]+)/);
      if (resourceNoLinkMatch && currentWeek) {
        const [, type, title] = resourceNoLinkMatch;
        const resource = {
          id: `${currentWeek.weekNumber}-${currentResources.length + 1}`,
          title: title.trim(),
          type: type.toLowerCase(),
          duration: '30 min',
          url: null, // Sin URL por ahora
          completed: false,
          description: `${type} training resource for ${currentWeek.title}`
        };
        currentResources.push(resource);
        console.log('Found resource without link:', resource);
      }
      
      // Detectar recursos con formato diferente (con guiones)
      const resourceDashMatch = line.match(/^\s*-\s*\*\*(video|pdf|interactive)\*\*:?\s*([^\n]+)/);
      if (resourceDashMatch && currentWeek) {
        const [, type, title] = resourceDashMatch;
        const resource = {
          id: `${currentWeek.weekNumber}-${currentResources.length + 1}`,
          title: title.trim(),
          type: type.toLowerCase(),
          duration: '30 min',
          url: null,
          completed: false,
          description: `${type} training resource for ${currentWeek.title}`
        };
        currentResources.push(resource);
        console.log('Found resource with dash format:', resource);
      }
    }

    // Agregar la última semana
    if (currentWeek) {
      weeks.push({
        ...currentWeek,
        resources: currentResources
      });
    }

    console.log('Parsed weeks:', weeks);
    
    // Si no se encontraron recursos, crear recursos por defecto
    if (weeks.length > 0 && weeks.every(week => week.resources.length === 0)) {
      console.log('No resources found, creating default resources...');
      weeks.forEach(week => {
        week.resources = [
          {
            id: `${week.weekNumber}-1`,
            title: `${week.title} - Video Training`,
            type: 'video',
            duration: '30 min',
            url: null,
            completed: false,
            description: `Video training for ${week.title}`
          },
          {
            id: `${week.weekNumber}-2`,
            title: `${week.title} - Technical Documentation`,
            type: 'pdf',
            duration: '45 min',
            url: null,
            completed: false,
            description: `Technical documentation for ${week.title}`
          },
          {
            id: `${week.weekNumber}-3`,
            title: `${week.title} - Interactive Module`,
            type: 'interactive',
            duration: '60 min',
            url: null,
            completed: false,
            description: `Interactive training module for ${week.title}`
          }
        ];
      });
    }
    
    return weeks;
  }, []);

  // Función para manejar el guardado del trabajo del canvas
  const handleCanvasSave = useCallback((canvasData) => {
    console.log('Canvas work saved:', canvasData);
    // Here you could save the work to localStorage or send it to a server
    const savedWorks = JSON.parse(localStorage.getItem('interactiveWorks') || '[]');
    savedWorks.push(canvasData);
    localStorage.setItem('interactiveWorks', JSON.stringify(savedWorks));
    
    // Show success message
    alert('Your work has been saved successfully!');
  }, []);

  // Función para manejar clicks en recursos
  const handleResourceClick = useCallback(async (resource) => {
    const { title, type, url } = resource;
    
    console.log('=== RESOURCE CLICK START ===');
    console.log('Resource clicked:', { id: resource.id, title, type, url });
    
    // Si es un video de YouTube
    if (url && url.startsWith('youtube:')) {
      const videoId = url.replace('youtube:', '');
      setSelectedVideo({ videoId, title });
      return;
    }
    
    // Si es un PDF generado (formato antiguo)
    if (url && url.startsWith('data:text/plain')) {
      const content = decodeURIComponent(url.replace('data:text/plain;charset=utf-8,', ''));
      setInlinePDFContent({ content, title });
      return;
    }
    
    // Si es contenido generado (nuevo formato)
    if (url && url.startsWith('generated:')) {
      const content = decodeURIComponent(url.replace('generated:', ''));
      setInlinePDFContent({ content, title });
      return;
    }
    
    // Si es un enlace externo, abrir en nueva pestaña
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
      return;
    }
    
    // Si no hay URL, generar contenido directamente
    console.log('=== STARTING CONTENT GENERATION ===');
    console.log('No URL found, generating content directly for:', title, type);
    
    // Establecer el estado de generación
    setGeneratingResourceId(resource.id);
    
    try {
      const topics = ['plc', 'electrical', 'mechanical', 'hydraulics', 'pneumatics', 'safety', 'controls', 'automation', 'manufacturing'];
      const foundTopic = topics.find(topic => title.toLowerCase().includes(topic)) || 'industrial';
      
      if (type === 'pdf') {
        console.log('Generating PDF content for:', title);
        const { ContentGenerationService } = await import('./services/contentGenerationService');
        
        try {
          const generatedContent = await ContentGenerationService.generateRealContent(title, type);
          if (generatedContent && generatedContent.content) {
            console.log('=== CONTENT GENERATION SUCCESS ===');
            console.log('Content generated successfully, length:', generatedContent.content.length);
            setInlinePDFContent({ content: generatedContent.content, title });
            setGeneratingResourceId(null);
            return;
          }
        } catch (error) {
          console.log('API generation failed, using fallback content');
        }
        
        // Usar contenido de fallback si la API falla
        const fallbackContent = ContentGenerationService.createFallbackPDF(title, 'industrial');
        console.log('=== USING FALLBACK CONTENT ===');
        setInlinePDFContent({ content: fallbackContent.content, title });
        setGeneratingResourceId(null);
        return;
      }
      
      if (type === 'video') {
        console.log('Searching YouTube for:', title);
        const { WebSearchService } = await import('./services/webSearchService');
        const youtubeResults = await WebSearchService.searchYouTube(title, 1);
        if (youtubeResults.length > 0) {
          const video = youtubeResults[0];
          setSelectedVideo({ videoId: video.videoId, title });
          return;
        }
      }
      
      if (type === 'interactive') {
        console.log('Generating interactive instructions for:', title);
        const { ContentGenerationService } = await import('./services/contentGenerationService');
        
        try {
          const instructions = ContentGenerationService.generateInteractiveInstructions(title, 'industrial', formData);
          console.log('=== INTERACTIVE INSTRUCTIONS GENERATED ===');
          setInteractiveInstructions(instructions);
          setInteractiveTitle(title);
          setShowInteractiveCanvas(true);
          setGeneratingResourceId(null);
          return;
        } catch (error) {
          console.log('API generation failed, using fallback instructions');
        }
        
        // Usar instrucciones de fallback si la API falla
        const fallbackInstructions = ContentGenerationService.generateInteractiveInstructions(title, 'industrial', formData);
        console.log('=== USING FALLBACK INTERACTIVE INSTRUCTIONS ===');
        setInteractiveInstructions(fallbackInstructions);
        setInteractiveTitle(title);
        setShowInteractiveCanvas(true);
        setGeneratingResourceId(null);
        return;
      }
      
      alert('Generating content... Please wait a moment and try again.');
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Unable to generate content at this time. Please try again later.');
    } finally {
      setGeneratingResourceId(null);
    }
  }, [formData]);

  // Función optimizada para generar contenido adicional
  const generateAdditionalContent = useCallback(async () => {
    if (!apiKey && !demoMode) {
      setShowApiConfig(true);
      return;
    }

    setIsGenerating(true);
    try {
      let additionalContent;
      
      if (localMode) {
        additionalContent = await OllamaService.generateTrainingContent(
          { title: "Additional Training Content" },
          formData
        );
      } else if (demoMode) {
        additionalContent = await DemoService.generateTrainingContent(
          { title: "Additional Training Content" },
          formData
        );
      } else {
        additionalContent = await OpenAIService.generateTrainingContent(
          { title: "Additional Training Content" },
          formData
        );
      }
      
      const newResource = {
        id: Date.now(),
        title: demoMode ? "Demo-Generated Content" : "AI-Generated Additional Content",
        type: "interactive",
        duration: "30 min",
        url: "#",
        completed: false,
        description: demoMode ? "Contenido de demostración generado sin API" : "Contento personalizado generado por IA basado en tu perfil",
        aiContent: additionalContent
      };
      
      setTrainingResources(prev => [...prev, newResource]);
    } catch (error) {
      console.error("Error generating additional content:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [apiKey, demoMode, localMode, formData]);

  // 5. Renderizado condicional
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      {/* Global Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaCog className="text-blue-600 mr-2" />
              <span className="font-medium text-gray-700">Training Progress</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">{overallProgress}%</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Weeks:</span>
                <span className="text-sm font-medium text-blue-600">{completedWeeks.size}/{trainingResources.length}</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Avatar Flotante del Tutor */}
      <div className="fixed bottom-20 right-8 z-50">
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
            showChatbot 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600'
          }`}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <span className="text-3xl animate-bounce">👨‍🏫</span>
            {!showChatbot && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
            )}
          </div>
        </button>
        
        {/* Tooltip */}
        {!showChatbot && (
          <div className="absolute bottom-20 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
            <div className="flex items-center">
              <span className="mr-2 text-lg">👨‍🏫</span>
              <span>TechFlow Tutor</span>
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* Chatbot */}
      {showChatbot && (
        <div className="fixed bottom-4 right-4 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">👨‍🏫</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">TechFlow Tutor</h3>
                  <p className="text-blue-100 text-sm">Your personal learning guide</p>
                </div>
              </div>
              <button
                onClick={() => setShowChatbot(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>
          
          <div className="h-80 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'bot' && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm">👨‍🏫</span>
                  </div>
                )}
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className={`text-xs mt-2 ${
                    msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {msg.type === 'user' && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                    <FaUser className="text-gray-600 text-sm" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <form onSubmit={sendChatMessage} className="p-6 border-t border-gray-200 bg-white">
            <div className="flex space-x-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                                  placeholder="Write your question to the tutor..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center">
              Your tutor is here to help you with your learning
            </div>
          </form>
        </div>
      )}

      <div className="max-w-full mx-auto mt-16 px-2 sm:px-4">
        {/* API Configuration Modal */}
        {showApiConfig && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6">
                <ApiConfig onApiKeySet={handleApiKeySet} />
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-10">
          <div className="bg-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCog className="text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TechFlow Academy - Training Profile
          </h1>
          <p className="text-lg text-gray-600">
            {activeTab === 'form' 
              ? "Complete this form to receive a personalized training plan" 
              : "Your personalized training plan"}
          </p>
          
          {/* API Status Indicator */}
          <div className="mt-4 flex items-center justify-center space-x-4">
            {localMode ? (
              <div className="flex items-center text-purple-600">
                <FaRobot className="mr-2" />
                <span className="text-sm">Local AI (Ollama)</span>
                <button
                  onClick={() => setLocalMode(false)}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  Switch to API
                </button>
              </div>
            ) : demoMode ? (
              <div className="flex items-center text-orange-600">
                <FaRobot className="mr-2" />
                <span className="text-sm">Demo Mode</span>
                <button
                  onClick={() => setDemoMode(false)}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  Switch to API
                </button>
              </div>
            ) : apiKey ? (
              <div className="flex items-center text-green-600">
                <FaKey className="mr-2" />
                <span className="text-sm">API Connected</span>
                <div className="flex space-x-2 ml-2">
                  <button
                    onClick={() => setDemoMode(true)}
                    className="text-xs text-orange-600 hover:text-orange-800"
                  >
                    Demo
                  </button>
                  <button
                    onClick={() => setLocalMode(true)}
                    className="text-xs text-purple-600 hover:text-purple-800"
                  >
                    Local
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowApiConfig(true)}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <FaKey className="mr-2" />
                  OpenAI API
                </button>
                <button
                  onClick={() => setLocalMode(true)}
                  className="flex items-center text-purple-600 hover:text-purple-800 text-sm"
                >
                  <FaRobot className="mr-2" />
                  Local AI
                </button>
              </div>
            )}
            
            {/* Debug button */}
            {/* <button
              onClick={() => {
                debugApiKey();
                console.log('Current API Key State:', apiKey);
              }}
              className="flex items-center text-gray-500 hover:text-gray-700 text-xs"
            >
              <FaCog className="mr-1" />
              Debug
            </button> */}
            
            {/* Test Models button */}
            {/* <button
              onClick={async () => {
                try {
                  if (localMode) {
                    const status = await OllamaService.checkOllamaStatus();
                    console.log('Ollama status:', status);
                    if (status.status === 'available') {
                      alert(`✅ Ollama disponible\nModelos: ${status.models.map(m => m.name).join(', ')}`);
                    } else {
                      alert(`❌ Ollama no disponible\n${status.error}`);
                    }
                  } else {
                    const model = await detectAvailableModels();
                    console.log('Selected model:', model);
                    alert(`Selected model: ${model}`);
                  }
                } catch (error) {
                  console.error('Error detecting models:', error);
                  alert('Error detectando modelos: ' + error.message);
                }
              }}
              className="flex items-center text-gray-500 hover:text-gray-700 text-xs"
            >
              <FaRobot className="mr-1" />
              Test Models
            </button> */}
            
            {/* Check Account button */}
            {/* <button
              onClick={async () => {
                try {
                  const status = await checkAccountStatus();
                  console.log('Account status:', status);
                  
                  let message = '';
                  switch (status.status) {
                    case 'active':
                      message = `✅ Cuenta activa\nModelos disponibles: ${status.models}`;
                      break;
                    case 'rate_limited':
                      message = `⚠️ Rate limit activo\n${status.error}`;
                      break;
                    case 'invalid_key':
                      message = `❌ API key inválida\n${status.error}`;
                      break;
                    case 'no_quota':
                      message = `❌ Sin saldo\n${status.error}\n\nSolución:\n1. Ve a https://platform.openai.com/billing\n2. Agrega método de pago\n3. Agrega $5-10 de créditos`;
                      break;
                    default:
                      message = `❌ Error: ${status.error}`;
                  }
                  
                  alert(message);
                } catch (error) {
                  console.error('Error checking account:', error);
                  alert('Error verificando cuenta: ' + error.message);
                }
              }}
              className="flex items-center text-gray-500 hover:text-gray-700 text-xs"
            >
              <FaKey className="mr-1" />
              Check Account
            </button> */}
          </div>
        </div>

        {/* Sistema de pestañas */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-3 font-medium text-center ${activeTab === 'form' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FaUser className="inline mr-2" /> Profile Form
          </button>
          <button
            onClick={() => generatedCourse && setActiveTab('course')}
            disabled={!generatedCourse}
            className={`flex-1 py-3 font-medium text-center ${activeTab === 'course' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'} ${!generatedCourse ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-700'}`}
          >
            <FaBook className="inline mr-2" /> Training Plan
          </button>
          <button
            onClick={() => setActiveTab('evaluations')}
            className={`flex-1 py-3 font-medium text-center ${activeTab === 'evaluations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FaClipboardCheck className="inline mr-2" /> Evaluations
          </button>
        </div>

        {activeTab === 'form' ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Form - 3 columns */}
            <div className="xl:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Section 1: General Information */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FaUser className="text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">General Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., John Smith"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., john.smith@company.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., EMP001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., Senior Technician"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current role
                  </label>
                  <select
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select your role</option>
                    <option value="Maintenance Technician">Maintenance Technician</option>
                    <option value="Maintenance Supervisor">Maintenance Supervisor</option>
                    <option value="Maintenance Planner">Maintenance Planner</option>
                  </select>
                </div>
                

                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Time
                  </label>
                  <select
                    name="targetTime"
                    value={formData.targetTime}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="1">1 month</option>
                    <option value="2">2 months</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">1 year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Knowledge Source
                  </label>
                  <select
                    name="knowledgeSource"
                    value={formData.knowledgeSource}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="internal">Internal</option>
                    <option value="public">Public</option>
                    <option value="both">Internal & Public</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Technical Areas */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FaTools className="text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">Technical Areas and Experience Level</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Please rate your current skill level in each technical area
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: 'mechanical', label: 'Mechanical' },
                  { id: 'electrical', label: 'Electrical' },
                  { id: 'hydraulics', label: 'Hydraulics' },
                  { id: 'pneumatics', label: 'Pneumatics' },
                  { id: 'controls', label: 'Controls' },
                  { id: 'safetyEhs', label: 'Safety / EHS' }
                ].map((area) => (
                  <div key={area.id} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">{area.label}</h3>
                    <div className="flex flex-wrap gap-2">
                      {['none', 'basic', 'intermediate', 'advanced'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleSkillChange(area.id, level)}
                          className={`px-3 py-1 rounded-full text-sm capitalize ${
                            formData[area.id] === level
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Learning Style */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FaGraduationCap className="text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">Preferred Learning Style</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Visual (I learn best with diagrams and illustrations)",
                  "Reading (I prefer technical documents and manuals)",
                  "Kinesthetic (I learn by doing and applying knowledge)",
                  "Auditory (I learn by listening to explanations)",
                  "Not sure / I'd like to explore"
                ].map((style) => (
                  <label key={style} className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <input
                      type="radio"
                      name="learningStyle"
                      value={style}
                      checked={formData.learningStyle === style}
                      onChange={handleChange}
                      className="mt-1 mr-3"
                    />
                    <span>{style}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 4: Language */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FaGlobe className="text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">Preferred Language for Training Content</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  "English",
                  "Spanish",
                  "Spanish with technical terms in English"
                ].map((lang) => (
                  <label key={lang} className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <input
                      type="radio"
                      name="language"
                      value={lang.toLowerCase()}
                      checked={formData.language === lang.toLowerCase()}
                      onChange={handleChange}
                      className="mt-1 mr-3"
                    />
                    <span>{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 5: Time Availability */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FaClock className="text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">Time Availability</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours per week available for training
                  </label>
                  <select
                    name="hoursPerWeek"
                    value={formData.hoursPerWeek}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="1-2">1-2 hours</option>
                    <option value="3-5">3-5 hours</option>
                    <option value="6-10">6-10 hours</option>
                    <option value="10+">More than 10 hours</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred training schedule
                  </label>
                  <select
                    name="preferredSchedule"
                    value={formData.preferredSchedule}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="weekends">Weekends</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 6: Development Goal */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FaBullseye className="text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">Development Goal</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What specific skill or knowledge do you want to develop?
                </label>
                <input
                  type="text"
                  name="developmentGoal"
                  value={formData.developmentGoal}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="e.g., Strengthen basic hydraulics"
                />
              </div>
            </div>

            {/* Section 7: Equipment Used */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FaTools className="text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">Equipment Used</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add equipment or systems you work with
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={equipmentInput}
                    onChange={handleEquipmentChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., Farrel F270, Banbury..."
                  />
                  
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => addEquipment(suggestion)}
                          className="p-3 hover:bg-gray-100 cursor-pointer"
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.equipmentUsed.map((equipment, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                      {equipment}
                      <button
                        type="button"
                        onClick={() => removeEquipment(equipment)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>



            {/* Botones de acción */}
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
              {submissionSuccess ? (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                  Profile submitted successfully!
                </div>
              ) : generationError ? (
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
                  {generationError}
                </div>
              ) : (
                <div></div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin inline mr-2" />
                      Submitting...
                    </>
                  ) : "Save Profile"}
                </button>
                
                <div className="flex flex-col items-end">
                  <button
                    type="button"
                    onClick={generateCourse}
                    disabled={isGenerating || isSubmitting}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center"
                  >
                    <FaRobot className="mr-2" />
                    {isGenerating ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        {generationStatus || 'Generating...'}
                      </>
                    ) : "Generate Plan"}
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    {localMode ? 'Local AI - No cost' : demoMode ? 'Demo Mode - No cost' : `Estimated cost: ~$${getEstimatedCost()}`}
                  </p>
                </div>
              </div>
            </div>
          </form>
            </div>

            {/* Sidebar - Journey & Progress */}
            <div className="space-y-6">
              {/* Progress Overview Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <FaChartBar className="text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">Progress Overview</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{overallProgress}%</div>
                    <div className="text-sm text-gray-600">Overall Progress</div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${overallProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{openGoals.length}</div>
                      <div className="text-xs text-gray-600">Active Goals</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{goalsHistory.length}</div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Open Goals Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <FaBullseye className="text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">Open Goals</h3>
                </div>
                
                <div className="space-y-3">
                  {openGoals.map((goal) => (
                    <div key={goal.id} className="bg-gray-50 rounded-lg p-3 border">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{goal.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{goal.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ml-2 ${
                          goal.priority === 'High' ? 'bg-red-100 text-red-800' :
                          goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {goal.priority}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">
                          <FaClock className="inline mr-1" />
                          {new Date(goal.targetDate).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          goal.category === 'Technical Skills' ? 'bg-blue-100 text-blue-800' :
                          goal.category === 'Leadership' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {goal.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Achievements Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <FaGraduationCap className="text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold">Recent Achievements</h3>
                </div>
                
                <div className="space-y-3">
                  {goalsHistory.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="bg-gray-50 rounded-lg p-3 border">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{goal.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{goal.description}</p>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-lg font-bold text-green-600">{goal.score}%</div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-600">
                          <FaCalendar className="inline mr-1" />
                          {new Date(goal.completedDate).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          goal.category === 'Technical Skills' ? 'bg-blue-100 text-blue-800' :
                          goal.category === 'Safety' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {goal.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'evaluations' ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaClipboardCheck className="text-purple-600 mr-2" />
                Evaluation System
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => EvaluationService.exportEvaluations()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <FaFileExport className="mr-2" />
                  Export JSON
                </button>
                <button
                  onClick={() => EvaluationService.exportEvaluationsToCSV()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <FaDownload className="mr-2" />
                  Export CSV
                </button>
              </div>
            </div>

            {evaluationStats ? (
              <div className="space-y-6">
                {/* Estadísticas Generales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <FaClipboardCheck className="text-blue-600 mr-3 text-xl" />
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{evaluationStats.total}</div>
                        <div className="text-sm text-gray-600">Total Evaluations</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <FaCheckCircle className="text-green-600 mr-3 text-xl" />
                      <div>
                        <div className="text-2xl font-bold text-green-600">{evaluationStats.passed}</div>
                        <div className="text-sm text-gray-600">Passed</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center">
                      <FaTimesCircle className="text-red-600 mr-3 text-xl" />
                      <div>
                        <div className="text-2xl font-bold text-red-600">{evaluationStats.failed}</div>
                        <div className="text-sm text-gray-600">Failed</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center">
                      <FaChartBar className="text-purple-600 mr-3 text-xl" />
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{evaluationStats.averageScore}%</div>
                        <div className="text-sm text-gray-600">Average</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desglose por Tipo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <FaFileAlt className="text-blue-600 mr-2" />
                      Theoretical Evaluations
                    </h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{evaluationStats.theoretical}</div>
                                          <div className="text-sm text-gray-600">Total theoretical evaluations completed</div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <FaUserTie className="text-green-600 mr-2" />
                      Practical Evaluations
                    </h3>
                    <div className="text-3xl font-bold text-green-600 mb-2">{evaluationStats.practical}</div>
                                          <div className="text-sm text-gray-600">Total practical evaluations completed</div>
                  </div>
                </div>

                {/* Statistics by Module */}
                {Object.keys(evaluationStats.modules).length > 0 && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                                          <h3 className="text-lg font-semibold mb-4">Statistics by Module</h3>
                    <div className="space-y-4">
                      {Object.entries(evaluationStats.modules).map(([module, stats]) => (
                        <div key={module} className="border-b border-gray-100 pb-4 last:border-b-0">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-800">{module}</h4>
                            <div className="text-sm text-gray-600">
                              Average: {stats.averageScore}%
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-blue-600">{stats.total}</div>
                              <div className="text-gray-600">Total</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-green-600">{stats.passed}</div>
                              <div className="text-gray-600">Passed</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-red-600">{stats.failed}</div>
                              <div className="text-gray-600">Failed</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evaluation History */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Evaluation History</h3>
                  <EvaluationHistory module="all" />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FaClipboardCheck className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No evaluations registered</h3>
                <p className="text-gray-500">Evaluations will appear here once completed</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left side - Learning Path */}
              <div className="w-full lg:w-1/4 p-6 border-r border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FaRobot className="text-blue-600 mr-2" />
                    Your Learning Path
                  </h2>
                  <button 
                    onClick={() => setActiveTab('form')}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FaUser className="mr-1" /> Back to Profile
                  </button>
                </div>

                {/* Employee Profile */}
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-4">
                    <FaUser className="text-green-600 mr-3 text-xl" />
                    <h3 className="font-medium text-lg">Employee Profile</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <p className="text-gray-600">{formData.fullName || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Employee ID:</span>
                      <p className="text-gray-600">{formData.employeeId || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Position:</span>
                      <p className="text-gray-600">{formData.position || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Current Role:</span>
                      <p className="text-gray-600">{formData.currentRole || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Target Time:</span>
                      <p className="text-gray-600">{formData.targetTime} month(s)</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Knowledge Source:</span>
                      <p className="text-gray-600 capitalize">{formData.knowledgeSource}</p>
                    </div>
                  </div>
                </div>

                {/* Learning Style Indicator */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <FaGraduationCap className="text-blue-600 mr-3 text-xl" />
                    <div>
                      <h3 className="font-medium">Learning Style</h3>
                      <p className="text-sm text-gray-600">{formData.learningStyle}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {(() => {
                    const targetMonths = parseInt(formData.targetTime);
                    const modulesPerMonth = 4; // 4 semanas por mes
                    const totalModules = targetMonths * modulesPerMonth;
                    
                    return Array.from({ length: totalModules }, (_, index) => {
                      const weekNumber = index + 1;
                      const monthNumber = Math.ceil(weekNumber / 4);
                      const weekInMonth = ((weekNumber - 1) % 4) + 1;
                      
                      return (
                        <div key={index} className="relative pl-12 pb-8">
                          <div 
                            className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-200 ${
                              completedWeeks.has(weekNumber) ? 'bg-green-600 scale-110' :
                              activeWeek === weekNumber ? 'bg-blue-600 scale-110' : 'bg-gray-400 hover:bg-blue-500'
                            }`}
                            onClick={() => setActiveWeek(weekNumber)}
                          >
                            {completedWeeks.has(weekNumber) ? '✓' : weekNumber}
                          </div>
                          <div 
                            className={`bg-white p-4 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 ${
                              activeWeek === weekNumber ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => setActiveWeek(weekNumber)}
                          >
                            <h3 className="font-bold text-lg mb-2">
                              {trainingResources.find(week => week.weekNumber === weekNumber)?.title || `Week ${weekNumber}`}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">Month {monthNumber}, Week {weekInMonth}</p>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <FaClock className="mr-1" />
                              <span>5-7 hours</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Video</span>
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Interactive</span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Quiz</span>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Right side - Course Content */}
              <div className="w-full lg:w-3/4 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {trainingResources.find(week => week.weekNumber === activeWeek)?.title || 'Course Content'}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Active Week:</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {activeWeek}
                      </span>
                      <button
                        onClick={() => toggleWeekCompletion(activeWeek)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          completedWeeks.has(activeWeek)
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {completedWeeks.has(activeWeek) ? '✓ Completed' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>
                                    <div className="flex gap-2">
                    {/* Week Navigation */}
                    <div className="flex items-center space-x-2 mr-4">
                      <button
                        onClick={() => setActiveWeek(Math.max(1, activeWeek - 1))}
                        disabled={activeWeek === 1}
                        className="px-2 py-1 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                      >
                        ←
                      </button>
                      <span className="text-sm text-gray-600">Week {activeWeek}</span>
                      <button
                        onClick={() => setActiveWeek(Math.min(trainingResources.length, activeWeek + 1))}
                        disabled={activeWeek === trainingResources.length}
                        className="px-2 py-1 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                      >
                        →
                      </button>
                    </div>
                    
                    <button
                      onClick={() => alert("Export functionality would go here")}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded-lg"
                    >
                      <FaFileExport className="mr-1" /> Export
                    </button>
                    <button
                      onClick={() => generateAdditionalContent()}
                      disabled={!apiKey || isGenerating}
                      className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <FaRobot className="mr-1" />
                      {isGenerating ? 'Generating...' : 'Generate Content'}
                    </button>
                  </div>
                </div>

                {/* Content Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button 
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    All ({filteredResources.length})
                  </button>
                  <button 
                    onClick={() => setActiveFilter('video')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      activeFilter === 'video' ? 'bg-red-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Videos ({filteredResources.filter(r => r.type === 'video').length})
                  </button>
                  <button 
                    onClick={() => setActiveFilter('pdf')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      activeFilter === 'pdf' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    PDFs ({filteredResources.filter(r => r.type === 'pdf').length})
                  </button>
                  <button 
                    onClick={() => setActiveFilter('interactive')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      activeFilter === 'interactive' ? 'bg-green-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Interactive ({filteredResources.filter(r => r.type === 'interactive').length})
                  </button>
                </div>

                {/* Content Statistics */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Week {activeWeek} Content Overview</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {filteredResources.filter(r => r.type === 'video').length}
                      </div>
                      <div className="text-gray-600">Videos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {filteredResources.filter(r => r.type === 'pdf').length}
                      </div>
                      <div className="text-gray-600">Documents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {filteredResources.filter(r => r.type === 'interactive').length}
                      </div>
                      <div className="text-gray-600">Simulations</div>
                    </div>
                  </div>
                </div>

                {/* Content List */}
                <div className="space-y-4">
                  {renderTrainingResources()}
                </div>

                {/* AI-Generated Plan */}
                <div className="mt-8 border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center">
                      <FaRobot className="text-blue-600 mr-2" />
                      AI-Generated Plan
                    </h3>
                    <button
                      onClick={() => setShowFullPlan(!showFullPlan)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <span className="mr-1">{showFullPlan ? 'Collapse' : 'Expand'}</span>
                      <span className={`transform transition-transform ${showFullPlan ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                  </div>
                  
                  <div 
                    className={`prose max-w-none bg-gray-50 p-4 rounded-lg transition-all duration-300 ${
                      showFullPlan ? 'max-h-none' : 'max-h-32 overflow-hidden'
                    }`}
                  >
                    <div className="text-sm space-y-2">
                      {generatedCourse.split('\n').map((line, i) => {
                        if (line.startsWith('# ')) return <h4 key={i} className="text-lg font-bold text-blue-800">{line.substr(2)}</h4>;
                        if (line.startsWith('## ')) return <h5 key={i} className="text-md font-semibold text-gray-800">{line.substr(3)}</h5>;
                        if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} className="text-gray-700">{line.substr(2, line.length-4)}</strong>;
                        if (line.trim() === '') return <br key={i} />;
                        if (line.includes('Topics:') || line.includes('Activities:') || line.includes('Resources:')) return <h6 key={i} className="font-medium text-gray-700 mt-2">{line}</h6>;
                        return <p key={i} className="text-gray-600 text-xs">{line}</p>;
                      })}
                    </div>
                    
                    {/* Show more indicator */}
                    {!showFullPlan && (
                      <div className="text-center mt-2">
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                          Click "Expand" to see full plan
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-4 flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      Download Plan
                    </button>
                    <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
                      Share Plan
                    </button>
                    <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
                      Print Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Evaluación */}
        {showEvaluation && currentEvaluationModule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  Evaluation System - {currentEvaluationModule.title}
                </h2>
                <button
                  onClick={() => {
                    setShowEvaluation(false);
                    setCurrentEvaluationModule(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-4">
                <EvaluationSystem
                  module={currentEvaluationModule}
                  onComplete={handleEvaluationComplete}
                  formData={formData}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal de Video Player */}
        {selectedVideo && (
          <VideoPlayer
            videoId={selectedVideo.videoId}
            title={selectedVideo.title}
            onClose={() => setSelectedVideo(null)}
          />
        )}

        {/* Modal de PDF Viewer */}
        {selectedPDF && (
          <PDFViewer
            content={selectedPDF.content}
            title={selectedPDF.title}
            onClose={() => setSelectedPDF(null)}
          />
        )}
      </div>
    </div>
  );
}