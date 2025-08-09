// Service to handle evaluations
export class EvaluationService {
  // Generate specific questions based on week content using OpenAI
  static async generateWeekQuestions(weekTitle, weekContent, formData = {}) {
    try {
      // Detectar idioma
      const isSpanish = (formData.language || '').toLowerCase().includes('spanish') || 
                        (formData.language || '').toLowerCase().includes('español');
      const language = isSpanish ? 'Spanish' : 'English';
      
      // Generar preguntas dinámicamente con OpenAI
      const { OpenAIService } = await import('./openaiService');
      
      // Crear contexto de los recursos de la semana
      const resourceContext = weekContent.map(resource => 
        `- ${resource.title}: ${resource.description || ''}`
      ).join('\n');
      
      const prompt = `Create 5 challenging multiple-choice questions for a technical evaluation about: "${weekTitle}"

CONTEXT:
- Week Topic: ${weekTitle}
- Resources covered:
${resourceContext}
- Student Role: ${formData.currentRole || 'Maintenance Technician'}
- Equipment: ${(formData.equipmentUsed || []).join(', ')}
- Development Goal: ${formData.developmentGoal || 'Technical skills improvement'}
- Language: ${language}

REQUIREMENTS:
- Create CHALLENGING questions (intermediate to advanced level)
- Questions should be specific to the week topic
- Include technical details and practical scenarios
- Each question must have exactly 4 options
- Mark the correct answer clearly
- Provide detailed explanations
- Questions should test understanding, application, and analysis
- Make questions relevant to ${formData.currentRole || 'maintenance technician'} work

FORMAT (JSON):
[
  {
    "id": 1,
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Detailed explanation of why this answer is correct",
    "category": "topic_category"
  }
]

CRITICAL: Write everything in ${language}. Create exactly 5 questions in valid JSON format.`;

      console.log('🧠 Generating dynamic questions for:', weekTitle);
      const response = await OpenAIService.generateContentDirectly(prompt);
      
      // Parsear la respuesta JSON
      try {
        const questions = JSON.parse(response);
        if (Array.isArray(questions) && questions.length > 0) {
          console.log('✅ Generated', questions.length, 'dynamic questions');
          return questions;
        }
      } catch (parseError) {
        console.warn('Failed to parse OpenAI response, using fallback questions');
      }
      
    } catch (error) {
      console.error('Error generating dynamic questions:', error);
    }
    
    // Fallback a preguntas estáticas si falla OpenAI
    console.log('🔄 Using fallback static questions');
    return this.generateFallbackQuestions(weekTitle, formData);
  }
  
  // Extraer temas del título de la semana
  static extractTopicsFromTitle(title) {
    const topics = [];
    const lowerTitle = title.toLowerCase();
    
    // Detectar temas específicos
    if (lowerTitle.includes('safety') || lowerTitle.includes('ehs')) {
      topics.push('safety');
    }
    if (lowerTitle.includes('hydraulic') || lowerTitle.includes('hydraulics')) {
      topics.push('hydraulics');
    }
    if (lowerTitle.includes('electrical') || lowerTitle.includes('electrical systems')) {
      topics.push('electrical');
    }
    if (lowerTitle.includes('pneumatic') || lowerTitle.includes('pneumatics')) {
      topics.push('pneumatics');
    }
    if (lowerTitle.includes('control') || lowerTitle.includes('controls')) {
      topics.push('controls');
    }
    if (lowerTitle.includes('mechanical') || lowerTitle.includes('mechanics')) {
      topics.push('mechanical');
    }
    if (lowerTitle.includes('plc') || lowerTitle.includes('programming')) {
      topics.push('plc');
    }
    if (lowerTitle.includes('maintenance') || lowerTitle.includes('preventive')) {
      topics.push('maintenance');
    }
    if (lowerTitle.includes('troubleshooting') || lowerTitle.includes('diagnostic')) {
      topics.push('troubleshooting');
    }
    if (lowerTitle.includes('quality') || lowerTitle.includes('qc')) {
      topics.push('quality');
    }
    
    // Si no se detectaron temas específicos, usar temas generales
    if (topics.length === 0) {
      topics.push('general', 'safety', 'operations');
    }
    
    return topics;
  }
  
  // Generar preguntas para un tema específico
  static generateQuestionsForTopic(topic, weekContent, startId) {
    const questions = [];
    
    switch (topic) {
      case 'safety':
        questions.push(
          {
            id: startId + 1,
            question: "What is the first step in any safety procedure before working on equipment?",
            options: [
              "Lockout/Tagout procedures",
              "Start the equipment",
              "Call a supervisor",
              "Put on gloves only"
            ],
            correct: 0,
            explanation: "Lockout/Tagout procedures are the first and most critical safety step before any equipment work.",
            category: "safety"
          },
          {
            id: startId + 2,
            question: "Which PPE is required when working with hydraulic systems?",
            options: [
              "Safety glasses, gloves, and steel-toed boots",
              "Only safety glasses",
              "No PPE is required",
              "Only gloves"
            ],
            correct: 0,
            explanation: "Complete PPE including safety glasses, gloves, and steel-toed boots is required for hydraulic work.",
            category: "safety"
          },
          {
            id: startId + 3,
            question: "What should you do if you notice a hydraulic fluid leak?",
            options: [
              "Stop work immediately, isolate the system, and report it",
              "Continue working and report it later",
              "Ignore it if it's small",
              "Try to fix it yourself"
            ],
            correct: 0,
            explanation: "Hydraulic fluid leaks are serious safety hazards and must be addressed immediately.",
            category: "safety"
          }
        );
        break;
        
      case 'hydraulics':
        questions.push(
          {
            id: startId + 1,
            question: "What is the primary function of a hydraulic pump?",
            options: [
              "Convert mechanical energy to hydraulic energy",
              "Store hydraulic fluid",
              "Control system pressure",
              "Filter contaminants"
            ],
            correct: 0,
            explanation: "Hydraulic pumps convert mechanical energy from motors into hydraulic energy by pressurizing fluid.",
            category: "hydraulics"
          },
          {
            id: startId + 2,
            question: "What happens if hydraulic fluid becomes contaminated?",
            options: [
              "System performance degrades and components wear faster",
              "Nothing, contamination is normal",
              "System pressure increases",
              "Fluid becomes more efficient"
            ],
            correct: 0,
            explanation: "Contamination causes accelerated wear and reduced system performance.",
            category: "hydraulics"
          },
          {
            id: startId + 3,
            question: "What is the purpose of a relief valve in a hydraulic system?",
            options: [
              "Protect the system from overpressure",
              "Increase system pressure",
              "Filter the fluid",
              "Store hydraulic energy"
            ],
            correct: 0,
            explanation: "Relief valves protect the system by limiting maximum pressure.",
            category: "hydraulics"
          }
        );
        break;
        
      case 'electrical':
        questions.push(
          {
            id: startId + 1,
            question: "What is the purpose of a circuit breaker in an electrical system?",
            options: [
              "Protect against overcurrent and short circuits",
              "Increase voltage",
              "Store electrical energy",
              "Control motor speed"
            ],
            correct: 0,
            explanation: "Circuit breakers protect equipment and personnel from electrical faults.",
            category: "electrical"
          },
          {
            id: startId + 2,
            question: "What should you check first when troubleshooting an electrical problem?",
            options: [
              "Power supply and circuit breakers",
              "Motor temperature",
              "Wire colors",
              "Equipment age"
            ],
            correct: 0,
            explanation: "Always start troubleshooting by checking power supply and protection devices.",
            category: "electrical"
          },
          {
            id: startId + 3,
            question: "What is the correct sequence for electrical lockout/tagout?",
            options: [
              "Identify, isolate, lockout, verify",
              "Lockout, work, restore",
              "Turn off, work, turn on",
              "Tag, work, remove tag"
            ],
            correct: 0,
            explanation: "Proper LOTO sequence ensures complete isolation and verification.",
            category: "electrical"
          }
        );
        break;
        
      case 'pneumatics':
        questions.push(
          {
            id: startId + 1,
            question: "What is the primary advantage of pneumatic systems?",
            options: [
              "Clean operation and simple maintenance",
              "High power density",
              "Low cost installation",
              "High precision control"
            ],
            correct: 0,
            explanation: "Pneumatic systems are clean and require minimal maintenance.",
            category: "pneumatics"
          },
          {
            id: startId + 2,
            question: "What component removes moisture from compressed air?",
            options: [
              "Air dryer",
              "Pressure regulator",
              "Flow control valve",
              "Solenoid valve"
            ],
            correct: 0,
            explanation: "Air dryers remove moisture to prevent system damage.",
            category: "pneumatics"
          },
          {
            id: startId + 3,
            question: "What happens if air pressure is too low in a pneumatic system?",
            options: [
              "System performance decreases and actuators may not work",
              "System efficiency improves",
              "No effect on operation",
              "Pressure automatically increases"
            ],
            correct: 0,
            explanation: "Low pressure causes poor performance and actuator failure.",
            category: "pneumatics"
          }
        );
        break;
        
      case 'controls':
        questions.push(
          {
            id: startId + 1,
            question: "What is the purpose of a PLC in industrial automation?",
            options: [
              "Control and automate industrial processes",
              "Only monitor temperature",
              "Store data only",
              "Generate reports"
            ],
            correct: 0,
            explanation: "PLCs are designed to control and automate industrial processes.",
            category: "controls"
          },
          {
            id: startId + 2,
            question: "What type of signal does a typical sensor provide to a PLC?",
            options: [
              "Analog or digital input signal",
              "Only analog signal",
              "Only digital signal",
              "Wireless signal only"
            ],
            correct: 0,
            explanation: "Sensors provide either analog or digital signals to PLCs.",
            category: "controls"
          },
          {
            id: startId + 3,
            question: "What is the purpose of an HMI in a control system?",
            options: [
              "Provide human-machine interface for operators",
              "Only control motors",
              "Store historical data",
              "Generate alarms only"
            ],
            correct: 0,
            explanation: "HMIs provide the interface between operators and control systems.",
            category: "controls"
          }
        );
        break;
        
      case 'maintenance':
        questions.push(
          {
            id: startId + 1,
            question: "What is the primary goal of preventive maintenance?",
            options: [
              "Prevent equipment failures before they occur",
              "Fix equipment after it breaks",
              "Reduce maintenance costs only",
              "Increase production speed"
            ],
            correct: 0,
            explanation: "Preventive maintenance aims to prevent failures through scheduled maintenance.",
            category: "maintenance"
          },
          {
            id: startId + 2,
            question: "What should be included in a maintenance checklist?",
            options: [
              "Safety procedures, inspection points, and required tools",
              "Only safety procedures",
              "Only inspection points",
              "Only tool requirements"
            ],
            correct: 0,
            explanation: "Complete checklists include safety, inspection, and tool requirements.",
            category: "maintenance"
          },
          {
            id: startId + 3,
            question: "What is the purpose of maintenance documentation?",
            options: [
              "Track maintenance history and improve procedures",
              "Only satisfy regulatory requirements",
              "Only track costs",
              "Only record failures"
            ],
            correct: 0,
            explanation: "Documentation helps track history and improve maintenance procedures.",
            category: "maintenance"
          }
        );
        break;
        
      default:
        // Preguntas generales para temas no específicos
        questions.push(
          {
            id: startId + 1,
            question: "What is the most important factor in industrial operations?",
            options: [
              "Safety of personnel and equipment",
              "Production speed",
              "Cost reduction",
              "Equipment efficiency"
            ],
            correct: 0,
            explanation: "Safety is always the top priority in industrial operations.",
            category: "general"
          },
          {
            id: startId + 2,
            question: "What should you do before starting any new procedure?",
            options: [
              "Review procedures and safety requirements",
              "Start immediately to save time",
              "Ask a coworker for help",
              "Skip safety checks"
            ],
            correct: 0,
            explanation: "Always review procedures and safety requirements before starting.",
            category: "general"
          },
          {
            id: startId + 3,
            question: "What is the purpose of standard operating procedures (SOPs)?",
            options: [
              "Ensure consistent and safe operations",
              "Only satisfy management requirements",
              "Only track performance",
              "Only reduce training time"
            ],
            correct: 0,
            explanation: "SOPs ensure consistent, safe, and efficient operations.",
            category: "general"
          }
        );
    }
    
    return questions;
  }
  
  // Generar preguntas generales
  static generateGeneralQuestions(weekTitle, startId) {
    return [
      {
        id: startId + 1,
        question: `What is the main objective of ${weekTitle.toLowerCase()} training?`,
        options: [
          "Develop safe and effective operational skills",
          "Only pass the evaluation",
          "Only learn theory",
          "Only meet requirements"
        ],
        correct: 0,
        explanation: "Training objectives focus on developing practical, safe operational skills.",
        category: "general"
      },
      {
        id: startId + 2,
        question: "What should you do if you encounter an unfamiliar situation?",
        options: [
          "Stop, assess, and consult procedures or supervisors",
          "Continue working and figure it out",
          "Ignore the situation",
          "Ask coworkers only"
        ],
        correct: 0,
        explanation: "Always stop, assess, and consult proper resources for unfamiliar situations.",
        category: "general"
      },
      {
        id: startId + 3,
        question: "What is the importance of continuous learning in industrial operations?",
        options: [
          "Stay current with technology and safety practices",
          "Only advance in career",
          "Only meet requirements",
          "Only increase salary"
        ],
        correct: 0,
        explanation: "Continuous learning ensures current knowledge of technology and safety practices.",
        category: "general"
      }
    ];
  }
  
  // Mezclar array de preguntas
  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  // Validar evaluación antes de guardar
  static validateEvaluation(evaluation) {
    const errors = [];
    
    if (!evaluation.module) {
      errors.push("Module title is required");
    }
    
    if (!evaluation.employee) {
      errors.push("Employee name is required");
    }
    
    if (typeof evaluation.score !== 'number' || evaluation.score < 0 || evaluation.score > 100) {
      errors.push("Score must be a number between 0 and 100");
    }
    
    if (!evaluation.answers || Object.keys(evaluation.answers).length === 0) {
      errors.push("Evaluation answers are required");
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
  
  // Guardar evaluación
  static saveEvaluation(evaluation) {
    try {
      const validation = this.validateEvaluation(evaluation);
      if (!validation.isValid) {
        console.error("Evaluation validation failed:", validation.errors);
        return false;
      }
      
      const existingEvaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
      existingEvaluations.push({
        ...evaluation,
        id: Date.now(),
        date: new Date().toISOString()
      });
      
      localStorage.setItem('evaluations', JSON.stringify(existingEvaluations));
      return true;
    } catch (error) {
      console.error("Error saving evaluation:", error);
      return false;
    }
  }
  
  // Obtener estadísticas de evaluaciones
  static getEvaluationStats() {
    try {
      const evaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
      
      const stats = {
        total: evaluations.length,
        passed: evaluations.filter(e => e.passed).length,
        failed: evaluations.filter(e => !e.passed).length,
        averageScore: evaluations.length > 0 
          ? Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length)
          : 0,
        theoretical: evaluations.filter(e => e.type === 'theoretical').length,
        practical: evaluations.filter(e => e.type === 'practical').length,
        modules: {}
      };
      
      // Estadísticas por módulo
      evaluations.forEach(evaluation => {
        if (!stats.modules[evaluation.module]) {
          stats.modules[evaluation.module] = {
            total: 0,
            passed: 0,
            failed: 0,
            averageScore: 0,
            scores: []
          };
        }
        
        stats.modules[evaluation.module].total++;
        if (evaluation.passed) {
          stats.modules[evaluation.module].passed++;
        } else {
          stats.modules[evaluation.module].failed++;
        }
        stats.modules[evaluation.module].scores.push(evaluation.score);
      });
      
      // Calcular promedios por módulo
      Object.keys(stats.modules).forEach(module => {
        const moduleStats = stats.modules[module];
        moduleStats.averageScore = Math.round(
          moduleStats.scores.reduce((sum, score) => sum + score, 0) / moduleStats.scores.length
        );
        delete moduleStats.scores; // Limpiar array de scores
      });
      
      return stats;
    } catch (error) {
      console.error("Error getting evaluation stats:", error);
      return {
        total: 0,
        passed: 0,
        failed: 0,
        averageScore: 0,
        theoretical: 0,
        practical: 0,
        modules: {}
      };
    }
  }
  
  // Exportar evaluaciones como JSON
  static exportEvaluations() {
    try {
      const evaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
      const dataStr = JSON.stringify(evaluations, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `evaluations_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    } catch (error) {
      console.error("Error exporting evaluations:", error);
    }
  }
  
  // Exportar evaluaciones como CSV
  static exportEvaluationsToCSV() {
    try {
      const evaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
      
      const headers = ['ID', 'Date', 'Employee', 'Employee ID', 'Module', 'Type', 'Score', 'Passed'];
      const csvContent = [
        headers.join(','),
        ...evaluations.map(e => [
          e.id,
          e.date,
          e.employee,
          e.employeeId,
          e.module,
          e.type,
          e.score,
          e.passed
        ].join(','))
      ].join('\n');
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `evaluations_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (error) {
      console.error("Error exporting evaluations to CSV:", error);
    }
  }
  
  // Generar preguntas de fallback cuando OpenAI falla
  static generateFallbackQuestions(weekTitle, formData = {}) {
    const isSpanish = (formData.language || '').toLowerCase().includes('spanish') || 
                      (formData.language || '').toLowerCase().includes('español');
    
    if (isSpanish) {
      return [
        {
          id: 1,
          question: "¿Cuál es el primer paso en cualquier procedimiento de seguridad antes de trabajar en equipos?",
          options: [
            "Procedimientos de Bloqueo/Etiquetado",
            "Encender el equipo", 
            "Llamar a un supervisor",
            "Solo ponerse guantes"
          ],
          correct: 0,
          explanation: "Los procedimientos de Bloqueo/Etiquetado son críticos para la seguridad.",
          category: "safety"
        },
        {
          id: 2,
          question: "¿Qué función principal tiene una bomba hidráulica?",
          options: [
            "Convertir energía mecánica a energía hidráulica",
            "Filtrar el fluido hidráulico",
            "Controlar la temperatura",
            "Medir la presión"
          ],
          correct: 0,
          explanation: "Las bombas hidráulicas convierten energía mecánica en presión hidráulica.",
          category: "hydraulics"
        },
        {
          id: 3,
          question: "¿Cuál es la función principal de un PLC en equipos industriales?",
          options: [
            "Controlar procesos automáticamente",
            "Generar electricidad",
            "Filtrar señales",
            "Enfriar equipos"
          ],
          correct: 0,
          explanation: "Los PLCs automatizan y controlan procesos industriales.",
          category: "plc"
        },
        {
          id: 4,
          question: `¿Cuál es la aplicación principal de este tema: "${weekTitle}"?`,
          options: [
            "Mejorar eficiencia operacional",
            "Reducir costos únicamente",
            "Aumentar personal",
            "Eliminar equipos"
          ],
          correct: 0,
          explanation: "El objetivo principal es mejorar la eficiencia y confiabilidad operacional.",
          category: "general"
        },
        {
          id: 5,
          question: "¿Qué consideración es más importante en mantenimiento industrial?",
          options: [
            "Seguridad del personal",
            "Velocidad de reparación",
            "Costo de materiales",
            "Apariencia del equipo"
          ],
          correct: 0,
          explanation: "La seguridad del personal siempre debe ser la prioridad número uno.",
          category: "safety"
        }
      ];
    } else {
      return [
        {
          id: 1,
          question: "What is the first step in any safety procedure before working on equipment?",
          options: [
            "Lockout/Tagout procedures",
            "Start the equipment",
            "Call a supervisor",
            "Put on gloves only"
          ],
          correct: 0,
          explanation: "Lockout/Tagout procedures are critical for safety.",
          category: "safety"
        },
        {
          id: 2,
          question: "What is the primary function of a hydraulic pump?",
          options: [
            "Convert mechanical energy to hydraulic energy",
            "Filter hydraulic fluid",
            "Control temperature",
            "Measure pressure"
          ],
          correct: 0,
          explanation: "Hydraulic pumps convert mechanical energy to hydraulic pressure.",
          category: "hydraulics"
        },
        {
          id: 3,
          question: "What is the main function of a PLC in industrial equipment?",
          options: [
            "Control processes automatically",
            "Generate electricity",
            "Filter signals",
            "Cool equipment"
          ],
          correct: 0,
          explanation: "PLCs automate and control industrial processes.",
          category: "plc"
        },
        {
          id: 4,
          question: `What is the main application of this topic: "${weekTitle}"?`,
          options: [
            "Improve operational efficiency",
            "Reduce costs only",
            "Increase personnel",
            "Remove equipment"
          ],
          correct: 0,
          explanation: "The main goal is to improve operational efficiency and reliability.",
          category: "general"
        },
        {
          id: 5,
          question: "What consideration is most important in industrial maintenance?",
          options: [
            "Personnel safety",
            "Repair speed",
            "Material cost",
            "Equipment appearance"
          ],
          correct: 0,
          explanation: "Personnel safety should always be the number one priority.",
          category: "safety"
        }
      ];
    }
  }

  // Traducir preguntas a español (traducción básica) - DEPRECATED
  static translateQuestionsToSpanish(questions) {
    return questions.map((question, index) => {
      // Para simplificar, usar preguntas pre-traducidas básicas
      const spanishQuestions = [
        {
          question: "¿Cuál es el primer paso en cualquier procedimiento de seguridad antes de trabajar en equipos?",
          options: [
            "Procedimientos de Bloqueo/Etiquetado",
            "Encender el equipo", 
            "Llamar a un supervisor",
            "Solo ponerse guantes"
          ],
          explanation: "Los procedimientos de Bloqueo/Etiquetado son críticos para la seguridad."
        },
        {
          question: "¿Qué función principal tiene una bomba hidráulica?",
          options: [
            "Convertir energía mecánica a energía hidráulica",
            "Filtrar el fluido hidráulico",
            "Controlar la temperatura",
            "Medir la presión"
          ],
          explanation: "Las bombas hidráulicas convierten energía mecánica en presión hidráulica."
        },
        {
          question: "¿Cuál es la función principal de un PLC en equipos industriales?",
          options: [
            "Controlar procesos automáticamente",
            "Generar electricidad",
            "Filtrar señales",
            "Enfriar equipos"
          ],
          explanation: "Los PLCs automatizan y controlan procesos industriales."
        }
      ];
      
      // Usar pregunta española si existe, si no mantener la original con id actualizado
      const spanishQ = spanishQuestions[index % spanishQuestions.length];
      
      return {
        ...question,
        question: spanishQ.question,
        options: spanishQ.options,
        explanation: spanishQ.explanation
      };
    });
  }
} 