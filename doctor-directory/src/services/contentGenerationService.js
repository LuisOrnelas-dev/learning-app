import { OpenAIService } from './openaiService';
import { InternalResourceService } from './internalResourceService';

export class ContentGenerationService {
  // Helper function to determine content language
  static getContentLanguage(formData) {
    const lang = (formData.language || '').toLowerCase();
    if (lang.includes('spanish') && lang.includes('english')) return 'Spanish with technical terms in English';
    if (lang.includes('spanish') || lang.includes('español')) return 'Spanish';
    return 'English';
  }

  // Generate real content based on title
  static async generateRealContent(title, type, topic, formData) {
    try {
      console.log(`Generating real content for: ${title} (${type})`);
      
      // Check if we should use internal resources
      console.log('🔍 DEBUG: formData.knowledgeSource =', formData.knowledgeSource);
      console.log('🔍 DEBUG: formData =', formData);
      
      if (formData.knowledgeSource === 'internal' || formData.knowledgeSource === 'both') {
        console.log('🔍 Using internal resources for content generation');
        const internalContent = await this.generateFromInternalResources(title, type, topic, formData);
        if (internalContent) {
          console.log('✅ Internal content generated successfully');
          return internalContent;
        }
        
        if (formData.knowledgeSource === 'both') {
          // For "both" option, fall back to external generation
          console.log('🔄 No internal resources found, falling back to external generation for "both" option');
        } else {
          // For "internal" only, no fallback
          console.log('⚠️ No internal resources found, no fallback available for "internal" only');
          return null;
        }
      } else {
        console.log('🔍 Using external resources for content generation');
      }
      
      switch (type) {
        case 'pdf':
          return await this.generatePDFContent(title, topic, formData);
        case 'video':
          return await this.generateVideoContent(title, topic, formData);
        case 'interactive':
          return await this.generateInteractiveContent(title, topic, formData);
        default:
          return await this.generatePDFContent(title, topic, formData);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      return null;
    }
  }

  // Generate PDF content
  static async generatePDFContent(title, topic, formData) {
    const contentLanguage = this.getContentLanguage(formData);
    const prompt = `Create a comprehensive technical document for: "${title}"

TOPIC: ${topic}
CONTEXT: Industrial training for ${formData.currentRole}
LEARNING STYLE: ${formData.learningStyle}
EQUIPMENT: ${formData.equipmentUsed.join(', ')}
LANGUAGE: ${contentLanguage}

Please create a detailed technical document with the following structure:

# ${title}

## Overview
[Provide a clear overview of the topic and its importance in industrial applications]

## Key Concepts
[Explain the fundamental concepts with technical details]

## Practical Applications
[Describe real-world applications and use cases]

## Safety Considerations
[Include relevant safety guidelines and procedures]

## Step-by-Step Procedures
[Provide detailed step-by-step instructions where applicable]

## Troubleshooting Guide
[Common issues and solutions]

## Best Practices
[Industry best practices and recommendations]

## Summary
[Key takeaways and next steps]

Make the content:
- Technical but accessible for ${formData.currentRole}
- Focused on practical applications
- Include relevant safety information
- Suitable for ${formData.learningStyle} learners
- Professional and comprehensive
- **CRITICAL: Write everything in ${contentLanguage}**

Format as a proper technical document with clear sections and subsections.`;

    try {
      const content = await OpenAIService.generateContentDirectly(prompt);
      return {
        type: 'pdf',
        title: title,
        content: content,
        url: `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`,
        isGenerated: true
      };
    } catch (error) {
      console.error('Error generating PDF content:', error);
      return this.createFallbackPDF(title, topic);
    }
  }

  // Generate video content (transcript + description)
  static async generateVideoContent(title, topic, formData) {
    const contentLanguage = this.getContentLanguage(formData);
    const prompt = `Create a comprehensive video script and description for: "${title}"

TOPIC: ${topic}
CONTEXT: Industrial training video for ${formData.currentRole}
LEARNING STYLE: ${formData.learningStyle}
EQUIPMENT: ${formData.equipmentUsed.join(', ')}
LANGUAGE: ${contentLanguage}

Please create:

1. VIDEO DESCRIPTION (2-3 sentences):
[Engaging description of what the video covers]

2. VIDEO SCRIPT (detailed transcript):
[Complete script with timestamps, demonstrations, and explanations]

3. KEY POINTS:
[Bullet points of main topics covered]

4. PRACTICAL DEMONSTRATIONS:
[Specific demonstrations to include]

Make the content:
- Engaging and educational
- Suitable for ${formData.learningStyle} learners
- Focused on practical demonstrations
- Professional and comprehensive
- **CRITICAL: Write everything in ${contentLanguage}**

Format as a structured video script with clear sections.`;

    try {
      const content = await OpenAIService.generateContentDirectly(prompt);
      return {
        type: 'video',
        title: title,
        content: content,
        url: `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`,
        isGenerated: true
      };
    } catch (error) {
      console.error('Error generating video content:', error);
      return this.createFallbackVideo(title, topic);
    }
  }

  // Generate interactive content
  static async generateInteractiveContent(title, topic, formData) {
    const contentLanguage = this.getContentLanguage(formData);
    const prompt = `Create an interactive training module for: "${title}"

TOPIC: ${topic}
CONTEXT: Interactive training for ${formData.currentRole}
LEARNING STYLE: ${formData.learningStyle}
EQUIPMENT: ${formData.equipmentUsed.join(', ')}
LANGUAGE: ${contentLanguage}

Please create:

1. MODULE OVERVIEW:
[Description of the interactive module]

2. LEARNING OBJECTIVES:
[Specific learning goals]

3. INTERACTIVE EXERCISES:
[Step-by-step interactive exercises with scenarios]

4. PRACTICAL SCENARIOS:
[Real-world scenarios to practice]

5. ASSESSMENT QUESTIONS:
[Interactive quiz questions with explanations]

6. HANDS-ON ACTIVITIES:
[Practical activities to complete]

Make the content:
- Highly interactive and engaging
- Suitable for ${formData.learningStyle} learners
- Focused on practical application
- Include assessment and feedback
- **CRITICAL: Write everything in ${contentLanguage}**

Format as an interactive training module with clear sections.`;

    try {
      const content = await OpenAIService.generateContentDirectly(prompt);
      return {
        type: 'interactive',
        title: title,
        content: content,
        url: `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`,
        isGenerated: true
      };
    } catch (error) {
      console.error('Error generating interactive content:', error);
      return this.createFallbackInteractive(title, topic);
    }
  }

  // Generate instructions for interactive canvas (dynamic with OpenAI)
  static async generateInteractiveInstructions(title, topic, formData) {
    try {
      const contentLanguage = this.getContentLanguage(formData);
      
      const prompt = `Generate 5 SPECIFIC and DETAILED drawing/design instructions for an interactive canvas exercise about: "${title}"

CONTEXT:
- Role: ${formData.currentRole}
- Equipment: ${formData.equipmentUsed.join(', ')}
- Development Goal: ${formData.developmentGoal}
- Language: ${contentLanguage}

REQUIREMENTS:
- Each instruction must be HIGHLY SPECIFIC to the topic "${title}"
- Focus on practical, hands-on diagrams that relate directly to the user's role and equipment
- Make instructions actionable and measurable (start with verbs like "Draw", "Sketch", "Create", "Design")
- Include specific details about what components, labels, or elements should be included
- Instructions should be progressive (from basic to more complex)
- Each instruction should have a clear deliverable that can be evaluated

FORMAT: Return ONLY a simple array of 5 detailed instructions, one per line, no bullets or numbering.

Example format for PLC topic:
Draw a complete PLC ladder logic diagram showing START button, STOP button, and motor control with proper NO/NC contacts
Sketch a detailed I/O mapping diagram showing all input sensors and output actuators connected to the PLC
Create a troubleshooting flowchart with 5 specific PLC error conditions and their diagnostic steps
Design a preventive maintenance checklist diagram showing 8 key inspection points for PLC systems
Illustrate a safety interlock circuit diagram showing emergency stop, safety door, and machine guard connections

CRITICAL: 
- Write ALL instructions in ${contentLanguage}
- Make them SPECIFIC to "${title}" topic
- Include measurable deliverables
- Focus on practical application for ${formData.currentRole}`;

      const response = await OpenAIService.generateContentDirectly(prompt);
      
      // Parse the response into individual instructions
      const instructions = response
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'))
        .slice(0, 5); // Take only first 5 instructions
      
      return instructions.length > 0 ? instructions.join('\n') : this.getFallbackInstructions(title, contentLanguage).join('\n');
      
    } catch (error) {
      console.error('Error generating dynamic instructions:', error);
      const contentLanguage = this.getContentLanguage(formData);
      return this.getFallbackInstructions(title, contentLanguage).join('\n');
    }
  }

  // Generate content from internal resources
  static async generateFromInternalResources(title, type, topic, formData) {
    try {
      console.log(`🔍 Searching internal resources for: ${title} (${topic})`);
      
      // Search for relevant internal resources
      const relevantResources = await InternalResourceService.searchInternalResources(topic, formData);
      
      if (relevantResources.length === 0) {
        console.log('❌ No internal resources found for topic:', topic);
        return null;
      }
      
      console.log(`✅ Found ${relevantResources.length} relevant internal resources:`, relevantResources.map(r => r.title));
      
      // Get content from the most relevant resource
      const primaryResource = relevantResources[0];
      const resourceContent = await InternalResourceService.getResourceContent(primaryResource.id);
      
      // Generate enhanced content using OpenAI with internal resource context
      const contentLanguage = this.getContentLanguage(formData);
      const prompt = `Generate comprehensive ${type} content for: "${title}"

TOPIC: ${topic}
CONTEXT: Industrial training for ${formData.currentRole}
LEARNING STYLE: ${formData.learningStyle}
EQUIPMENT: ${formData.equipmentUsed.join(', ')}
LANGUAGE: ${contentLanguage}

INTERNAL RESOURCE CONTENT:
${resourceContent.content}

REQUIREMENTS:
- Base the content on the internal resource provided above
- Include specific details and procedures from the internal document
- Maintain consistency with company standards and procedures
- Focus on practical applications for ${formData.currentRole}
- Use technical terminology from the internal resource
- **CRITICAL: Write everything in ${contentLanguage}**

Format as a comprehensive technical document with clear sections.`;

      const generatedContent = await OpenAIService.generateContentDirectly(prompt);
      
      return {
        type: type,
        title: title,
        content: generatedContent,
        url: `internal:${primaryResource.id}`,
        isGenerated: true,
        source: 'internal',
        internalResource: primaryResource.title
      };
      
    } catch (error) {
      console.error('Error generating content from internal resources:', error);
      return null;
    }
  }

  // Generate dynamic evaluation criteria using OpenAI
  static async generateEvaluationCriteria(title, instructions, formData) {
    try {
      const contentLanguage = this.getContentLanguage(formData);
      
      const prompt = `Generate SPECIFIC evaluation criteria for each of these 5 interactive canvas instructions about: "${title}"

INSTRUCTIONS:
${instructions}

CONTEXT:
- Role: ${formData.currentRole}
- Equipment: ${formData.equipmentUsed.join(', ')}
- Development Goal: ${formData.developmentGoal}
- Language: ${contentLanguage}

REQUIREMENTS:
- Generate 5 specific evaluation criteria for EACH instruction (25 total criteria)
- Each criterion must be specific to the instruction and topic
- Focus on measurable, observable elements
- Include technical accuracy, completeness, and professional standards
- Make criteria actionable and clear for self-assessment

FORMAT: Return a JSON array with this exact structure:
[
  {
    "id": 0,
    "instruction": "instruction text here",
    "criteria": [
      "specific criterion 1",
      "specific criterion 2", 
      "specific criterion 3",
      "specific criterion 4",
      "specific criterion 5"
    ],
    "maxScore": 5
  }
]

EXAMPLE for PLC instruction "Draw a complete PLC ladder logic diagram":
{
  "id": 0,
  "instruction": "Draw a complete PLC ladder logic diagram showing START button, STOP button, and motor control with proper NO/NC contacts",
  "criteria": [
    "All required components (START, STOP, motor) are clearly drawn and labeled",
    "NO/NC contact symbols are correctly used and properly connected",
    "Ladder logic format follows standard conventions with proper rungs",
    "Power flow path is logical and complete from input to output",
    "Component values and specifications are indicated where relevant"
  ],
  "maxScore": 5
}

CRITICAL: 
- Write ALL criteria in ${contentLanguage}
- Make them SPECIFIC to "${title}" topic and each instruction
- Focus on technical accuracy and professional standards
- Return ONLY valid JSON format`;

      const response = await OpenAIService.generateContentDirectly(prompt);
      
      try {
        // Try to parse the response as JSON
        const parsedCriteria = JSON.parse(response);
        
        // Validate the structure
        if (Array.isArray(parsedCriteria) && parsedCriteria.length > 0) {
          console.log('✅ Successfully generated dynamic evaluation criteria');
          return parsedCriteria;
        } else {
          throw new Error('Invalid criteria structure');
        }
      } catch (parseError) {
        console.error('Failed to parse OpenAI response as JSON:', parseError);
        console.log('Raw response:', response);
        throw new Error('Invalid JSON response from OpenAI');
      }
      
    } catch (error) {
      console.error('Error generating dynamic evaluation criteria:', error);
      // Fallback to static criteria
      const contentLanguage = this.getContentLanguage(formData);
      return this.generateFallbackEvaluationCriteria(title, instructions, contentLanguage);
    }
  }

  // Fallback evaluation criteria if OpenAI fails
  static generateFallbackEvaluationCriteria(title, instructions, contentLanguage) {
    const isSpanish = contentLanguage.includes('Spanish');
    
    // Generate basic criteria based on instruction type
    return instructions.split('\n').map((instruction, index) => {
      const instructionLower = instruction.toLowerCase();
      let criteria = {
        id: index,
        instruction: instruction,
        criteria: [],
        maxScore: 5
      };
      
      // Generate specific criteria based on instruction type
      if (instructionLower.includes('diagram') || instructionLower.includes('diagrama')) {
        criteria.criteria = isSpanish ? [
          'Todos los componentes requeridos están incluidos',
          'Los componentes están correctamente etiquetados',
          'Las conexiones se muestran claramente',
          'El diseño está organizado y es legible',
          'Sigue las convenciones estándar de diagramas'
        ] : [
          'All required components are included',
          'Components are properly labeled',
          'Connections are clearly shown',
          'Layout is organized and readable',
          'Follows standard diagram conventions'
        ];
      } else if (instructionLower.includes('flowchart') || instructionLower.includes('flujo')) {
        criteria.criteria = isSpanish ? [
          'Todos los puntos de decisión están incluidos',
          'La dirección del flujo es clara',
          'La lógica de decisión es correcta',
          'Todos los caminos llevan a resultados',
          'El formato sigue los estándares de flowchart'
        ] : [
          'All decision points are included',
          'Flow direction is clear',
          'Decision logic is correct',
          'All paths lead to outcomes',
          'Format follows flowchart standards'
        ];
      } else if (instructionLower.includes('checklist') || instructionLower.includes('lista')) {
        criteria.criteria = isSpanish ? [
          'Todos los elementos requeridos están listados',
          'Los elementos están en orden lógico',
          'El formato es claro y legible',
          'Incluye el número apropiado de elementos',
          'Sigue las mejores prácticas de checklist'
        ] : [
          'All required items are listed',
          'Items are in logical order',
          'Format is clear and readable',
          'Includes appropriate number of items',
          'Follows checklist best practices'
        ];
      } else if (instructionLower.includes('safety') || instructionLower.includes('seguridad')) {
        criteria.criteria = isSpanish ? [
          'Todos los elementos de seguridad están incluidos',
          'Los procedimientos están en el orden correcto',
          'Las advertencias de seguridad son prominentes',
          'Sigue los estándares de seguridad',
          'Los procedimientos de emergencia son claros'
        ] : [
          'All safety elements are included',
          'Procedures are in correct order',
          'Safety warnings are prominent',
          'Follows safety standards',
          'Clear emergency procedures'
        ];
      } else {
        // Generic criteria for other types
        criteria.criteria = isSpanish ? [
          'Todos los elementos requeridos están presentes',
          'La información es precisa y relevante',
          'El diseño es claro y organizado',
          'Sigue los estándares técnicos',
          'Cumple con los requisitos de la instrucción'
        ] : [
          'All required elements are present',
          'Information is accurate and relevant',
          'Layout is clear and organized',
          'Follows technical standards',
          'Meets the instruction requirements'
        ];
      }
      
      return criteria;
    });
  }

  // Fallback instructions if API fails
  static getFallbackInstructions(title, contentLanguage) {
    const isSpanish = contentLanguage.includes('Spanish');
    const lowerTitle = title.toLowerCase();
    const instructions = [];
    
    if (lowerTitle.includes('hydraulic') || lowerTitle.includes('hydraulics') || lowerTitle.includes('hidráulico')) {
      if (isSpanish) {
        instructions.push(
          "Dibuja un diagrama básico del sistema hidráulico mostrando bomba, depósito, válvulas y actuador",
          "Etiqueta los componentes principales: bomba, válvula de alivio de presión, válvula de control direccional, cilindro",
          "Bosqueja el flujo del fluido hidráulico a través del sistema",
          "Dibuja un diagrama de solución de problemas para problemas hidráulicos comunes",
          "Crea un diagrama de lista de verificación de mantenimiento con puntos de inspección"
        );
      } else {
        instructions.push(
          "Draw a basic hydraulic system diagram showing pump, reservoir, valves, and actuator",
          "Label the main components: pump, pressure relief valve, directional control valve, cylinder",
          "Sketch the flow path of hydraulic fluid through the system",
          "Draw a simple troubleshooting flowchart for common hydraulic problems",
          "Create a maintenance checklist diagram with inspection points"
        );
      }
    } else if (lowerTitle.includes('electrical') || lowerTitle.includes('electrical systems')) {
      instructions.push(
        "Draw a basic electrical circuit diagram with power source, switch, and load",
        "Sketch a control panel layout showing main components and connections",
        "Create a lockout/tagout procedure diagram",
        "Draw a troubleshooting flowchart for electrical problems",
        "Sketch a wiring diagram for a simple motor control circuit"
      );
    } else if (lowerTitle.includes('pneumatic') || lowerTitle.includes('pneumatics')) {
      instructions.push(
        "Draw a basic pneumatic system showing compressor, air tank, valves, and actuator",
        "Label the components: air compressor, pressure regulator, solenoid valve, cylinder",
        "Sketch the air flow path through the system",
        "Create a pneumatic troubleshooting diagram",
        "Draw a maintenance schedule flowchart"
      );
    } else if (lowerTitle.includes('safety') || lowerTitle.includes('ehs')) {
      if (isSpanish) {
        instructions.push(
          "Dibuja un diagrama completo del procedimiento de bloqueo y etiquetado (LOTO) mostrando 6 pasos específicos con símbolos de candado y etiquetas",
          "Crea un diagrama de identificación de peligros para tu área de trabajo mostrando 5 zonas de riesgo específicas y medidas de control",
          "Diseña una guía visual de selección de EPP con 4 escenarios diferentes y el equipo de protección requerido para cada uno",
          "Ilustra un diagrama de procedimiento de respuesta a emergencias con rutas de evacuación y puntos de reunión específicos",
          "Bosqueja un diagrama de lista de verificación de inspección de seguridad con 8 puntos críticos de verificación antes de comenzar el trabajo"
        );
      } else {
        instructions.push(
          "Draw a complete lockout/tagout (LOTO) procedure diagram showing 6 specific steps with lock and tag symbols",
          "Create a hazard identification diagram for your work area showing 5 specific risk zones and control measures",
          "Design a visual PPE selection guide with 4 different scenarios and required protective equipment for each",
          "Illustrate an emergency response procedure diagram with evacuation routes and specific meeting points",
          "Sketch a safety inspection checklist diagram with 8 critical verification points before starting work"
        );
      }
    } else if (lowerTitle.includes('plc') || lowerTitle.includes('programming') || lowerTitle.includes('siemens')) {
      if (isSpanish) {
        instructions.push(
          "Dibuja un diagrama completo de lógica ladder de PLC mostrando botón START, STOP y control de motor con contactos NO/NC apropiados",
          "Bosqueja un diagrama detallado de mapeo de E/S mostrando todos los sensores de entrada y actuadores de salida conectados al PLC",
          "Crea un diagrama de flujo de solución de problemas con 5 condiciones de error específicas del PLC y sus pasos de diagnóstico",
          "Diseña un diagrama de lista de verificación de mantenimiento preventivo mostrando 8 puntos clave de inspección para sistemas PLC",
          "Ilustra un diagrama de circuito de interbloqueo de seguridad mostrando parada de emergencia, puerta de seguridad y conexiones de guarda de máquina"
        );
      } else {
        instructions.push(
          "Draw a complete PLC ladder logic diagram showing START button, STOP button, and motor control with proper NO/NC contacts",
          "Sketch a detailed I/O mapping diagram showing all input sensors and output actuators connected to the PLC",
          "Create a troubleshooting flowchart with 5 specific PLC error conditions and their diagnostic steps",
          "Design a preventive maintenance checklist diagram showing 8 key inspection points for PLC systems",
          "Illustrate a safety interlock circuit diagram showing emergency stop, safety door, and machine guard connections"
        );
      }
    } else if (lowerTitle.includes('maintenance') || lowerTitle.includes('preventive')) {
      instructions.push(
        "Draw a preventive maintenance schedule diagram",
        "Create a maintenance procedure flowchart",
        "Sketch a troubleshooting decision tree",
        "Draw a parts inventory management diagram",
        "Create a maintenance documentation template"
      );
    } else if (lowerTitle.includes('troubleshooting') || lowerTitle.includes('diagnostic')) {
      instructions.push(
        "Create a systematic troubleshooting flowchart",
        "Draw a decision tree for problem identification",
        "Sketch a diagnostic procedure diagram",
        "Create a root cause analysis template",
        "Draw a corrective action planning diagram"
      );
    } else {
      // Instrucciones generales para cualquier tema
      instructions.push(
        "Draw a system overview diagram showing main components",
        "Create a process flowchart for the main operation",
        "Sketch a troubleshooting decision tree",
        "Draw a maintenance procedure diagram",
        "Create a safety procedure flowchart"
      );
    }
    
    // Generic fallback instructions
    if (instructions.length === 0) {
      if (isSpanish) {
        instructions.push(
          "Dibuja un diagrama general del sistema",
          "Etiqueta los componentes principales",
          "Crea un diagrama de flujo del proceso",
          "Bosqueja procedimientos de seguridad",
          "Diseña una lista de verificación visual"
        );
      } else {
        instructions.push(
          "Draw a general system diagram",
          "Label the main components",
          "Create a process flow diagram",
          "Sketch safety procedures",
          "Design a visual checklist"
        );
      }
    }
    
    return instructions;
  }

  // Crear PDF de fallback
  static createFallbackPDF(title, topic) {
    const content = `# ${title}

## Overview
This comprehensive guide covers ${topic.toLowerCase()} fundamentals and practical applications in industrial settings. This document is designed to provide detailed, actionable information for industrial maintenance professionals, focusing on real-world applications, safety protocols, and best practices that can be immediately implemented in your daily operations.

## Key Concepts

### Fundamental Principles
- **Core Theory**: Understanding the basic physics and engineering principles behind ${topic.toLowerCase()} systems
- **System Components**: Identification and function of key components including pumps, valves, actuators, and control systems
- **Operating Parameters**: Critical parameters such as pressure, flow rates, temperature, and their interrelationships
- **Efficiency Factors**: How to optimize system performance and energy consumption

### Industrial Applications
- **Manufacturing Integration**: How ${topic.toLowerCase()} systems integrate with production lines and manufacturing processes
- **Equipment-Specific Applications**: Specific uses in different types of industrial equipment and machinery
- **Process Control**: How these systems contribute to automated process control and quality assurance
- **Scalability**: Adapting systems for different production volumes and requirements

### Safety Considerations
- **Risk Assessment**: Systematic approach to identifying potential hazards and their severity
- **Prevention Strategies**: Proactive measures to prevent accidents and equipment damage
- **Emergency Procedures**: Step-by-step protocols for handling system failures and emergencies

## Practical Applications

### Real-World Implementation Scenarios
- **Startup Procedures**: Detailed step-by-step process for safely starting ${topic.toLowerCase()} systems
- **Normal Operations**: Best practices for monitoring and maintaining optimal performance during regular operations
- **Shutdown Procedures**: Proper procedures for safely stopping systems and preparing for maintenance
- **Emergency Shutdown**: Quick and safe shutdown procedures for emergency situations

### Equipment and System Integration
- **Component Selection**: How to choose the right components for specific applications
- **Installation Guidelines**: Proper installation procedures to ensure optimal performance and safety
- **System Testing**: Comprehensive testing procedures to verify proper operation
- **Performance Optimization**: Techniques for fine-tuning system performance

### Maintenance and Troubleshooting Procedures
- **Preventive Maintenance**: Scheduled maintenance tasks to prevent system failures
- **Predictive Maintenance**: Using monitoring data to predict and prevent potential issues
- **Corrective Maintenance**: Procedures for fixing identified problems
- **Root Cause Analysis**: Systematic approach to identifying the underlying causes of problems

## Safety Considerations

### Industry Safety Standards
- **OSHA Compliance**: Understanding and implementing OSHA requirements for ${topic.toLowerCase()} systems
- **Industry Best Practices**: Following established industry standards and guidelines
- **Company-Specific Protocols**: Adapting general standards to your specific workplace requirements
- **Documentation Requirements**: Proper documentation of safety procedures and incidents

### Risk Assessment and Mitigation
- **Hazard Identification**: Systematic process for identifying potential hazards
- **Risk Evaluation**: Assessing the likelihood and severity of identified risks
- **Control Measures**: Implementing appropriate controls to reduce risk to acceptable levels
- **Monitoring and Review**: Regular review and updating of risk assessments

### Personal Protective Equipment Requirements
- **Required PPE**: Specific protective equipment needed for different tasks
- **Proper Use**: Correct procedures for using and maintaining PPE
- **Inspection Requirements**: Regular inspection and replacement of damaged or worn PPE
- **Training Requirements**: Ensuring all personnel are properly trained in PPE use

## Step-by-Step Procedures

### 1. System Preparation and Setup
- **Pre-Startup Inspection**: Complete visual and functional inspection of all components
- **Safety Checks**: Verification of all safety systems and emergency procedures
- **Parameter Verification**: Confirming all operating parameters are within acceptable ranges
- **Documentation Review**: Reviewing relevant procedures and safety information

### 2. Operation and Monitoring
- **Startup Sequence**: Proper sequence for starting system components
- **Performance Monitoring**: Key parameters to monitor during operation
- **Data Recording**: Proper documentation of operating conditions and performance
- **Problem Recognition**: Early warning signs of potential problems

### 3. Maintenance and Inspection
- **Routine Inspections**: Daily, weekly, and monthly inspection procedures
- **Scheduled Maintenance**: Preventive maintenance tasks and schedules
- **Component Replacement**: Procedures for replacing worn or damaged components
- **Performance Testing**: Regular testing to ensure optimal performance

### 4. Troubleshooting Common Issues
- **Problem Identification**: Systematic approach to identifying problems
- **Diagnostic Procedures**: Step-by-step procedures for diagnosing issues
- **Solution Implementation**: Safe and effective procedures for fixing problems
- **Verification Testing**: Confirming that problems have been resolved

## Best Practices

### Industry Standards and Guidelines
- **Quality Standards**: Following established quality standards and procedures
- **Performance Benchmarks**: Understanding and achieving industry performance standards
- **Continuous Improvement**: Systematic approach to improving processes and procedures
- **Benchmarking**: Comparing performance with industry leaders and best practices

### Quality Assurance Procedures
- **Inspection Protocols**: Comprehensive inspection procedures for quality assurance
- **Testing Procedures**: Regular testing to ensure quality standards are met
- **Documentation Standards**: Proper documentation of all quality assurance activities
- **Corrective Actions**: Procedures for addressing quality issues

### Continuous Improvement Methods
- **Performance Monitoring**: Regular monitoring of system and process performance
- **Data Analysis**: Using data to identify improvement opportunities
- **Process Optimization**: Systematic approach to improving processes and procedures
- **Training and Development**: Continuous training to improve skills and knowledge

## Advanced Topics

### System Optimization
- **Performance Analysis**: Using data to identify optimization opportunities
- **Efficiency Improvements**: Techniques for improving system efficiency
- **Cost Reduction**: Strategies for reducing operating and maintenance costs
- **Sustainability**: Implementing environmentally sustainable practices

### Technology Integration
- **Automation Systems**: Integrating with modern automation and control systems
- **Data Analytics**: Using advanced analytics to improve performance
- **Predictive Technologies**: Implementing predictive maintenance technologies
- **Digital Transformation**: Leveraging digital technologies for improved operations

## Summary
This document provides comprehensive knowledge for working with ${topic.toLowerCase()} systems in industrial environments. The information presented here should be used as a foundation for safe, efficient, and effective operation of these critical systems. Remember that safety is always the top priority, and all procedures should be followed exactly as specified. Regular training and continuous learning are essential for maintaining the highest standards of performance and safety.

### Key Takeaways
- Always prioritize safety in all operations
- Follow established procedures and protocols
- Maintain proper documentation of all activities
- Continuously improve skills and knowledge
- Work as a team to ensure safe and efficient operations

### Next Steps
- Review and understand all procedures before implementation
- Participate in regular training and safety meetings
- Contribute to continuous improvement efforts
- Share knowledge and best practices with team members`;

    return {
      type: 'pdf',
      title: title,
      content: content,
      url: `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`,
      isGenerated: true
    };
  }

  // Crear video de fallback
  static createFallbackVideo(title, topic) {
    const content = `VIDEO: ${title}

DESCRIPTION:
Comprehensive training video covering ${topic.toLowerCase()} fundamentals, practical applications, and hands-on demonstrations for industrial professionals. This video provides detailed, step-by-step guidance for safe and effective operation of ${topic.toLowerCase()} systems in industrial environments.

DETAILED SCRIPT:

00:00 - Introduction and Course Overview
- Welcome and course objectives
- Safety disclaimer and requirements
- Overview of what will be covered
- Prerequisites and required knowledge

02:00 - Basic Concepts and Principles
- Fundamental physics and engineering principles
- Key terminology and definitions
- System components and their functions
- Basic operating principles

05:00 - Equipment and Components Deep Dive
- Detailed examination of system components
- Component identification and labeling
- Function and purpose of each component
- Component interaction and relationships

08:00 - Practical Demonstrations
- Step-by-step startup procedures
- Normal operation demonstrations
- Performance monitoring techniques
- Shutdown procedures

12:00 - Safety Procedures and Protocols
- Personal protective equipment requirements
- Safety protocols and procedures
- Emergency procedures and protocols
- Risk assessment and mitigation

15:00 - Troubleshooting Guide
- Common problems and their causes
- Diagnostic procedures and techniques
- Problem-solving methodologies
- Preventive measures

18:00 - Best Practices and Tips
- Industry best practices
- Performance optimization techniques
- Maintenance best practices
- Efficiency improvement strategies

20:00 - Summary and Next Steps
- Key takeaways and learning points
- Practical application guidance
- Further learning resources
- Certification and advancement opportunities

KEY LEARNING OBJECTIVES:
- Understand fundamental principles of ${topic.toLowerCase()} systems
- Identify and understand system components
- Demonstrate safe operation procedures
- Apply troubleshooting techniques
- Implement best practices for optimal performance

PRACTICAL APPLICATIONS:
- Industrial manufacturing processes
- Equipment maintenance and repair
- System optimization and efficiency
- Safety compliance and risk management

SAFETY CONSIDERATIONS:
- Personal protective equipment requirements
- Emergency procedures and protocols
- Risk assessment and mitigation
- Compliance with safety standards

This comprehensive video provides essential training for working with ${topic.toLowerCase()} systems in industrial environments.`;

    return {
      type: 'video',
      title: title,
      content: content,
      url: `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`,
      isGenerated: true
    };
  }

  // Crear contenido interactivo de fallback
  static createFallbackInteractive(title, topic) {
    const content = `INTERACTIVE MODULE: ${title}

OVERVIEW:
Interactive training module for ${topic.toLowerCase()} fundamentals and practical applications. This comprehensive module provides hands-on learning experiences through simulations, exercises, and real-world scenarios designed to develop practical skills and knowledge.

DETAILED LEARNING OBJECTIVES:
- **Knowledge Acquisition**: Understand fundamental principles and concepts of ${topic.toLowerCase()} systems
- **Skill Development**: Develop practical skills for system operation, maintenance, and troubleshooting
- **Safety Competency**: Demonstrate proficiency in safety procedures and protocols
- **Problem-Solving**: Apply systematic approaches to identify and resolve common issues
- **Performance Optimization**: Learn techniques for optimizing system performance and efficiency

COMPREHENSIVE INTERACTIVE EXERCISES:

### 1. System Identification and Component Recognition
**Exercise Overview**: Interactive component identification and function matching
**Learning Activities**:
- **Component Library**: Explore detailed 3D models of system components
- **Function Matching**: Match components to their specific functions and applications
- **System Mapping**: Build complete system diagrams by placing components correctly
- **Component Relationships**: Understand how components interact and depend on each other

**Assessment Criteria**:
- Accurate identification of all major components
- Correct understanding of component functions
- Proper placement in system diagrams
- Understanding of component relationships

### 2. Safety Assessment and Risk Management
**Exercise Overview**: Comprehensive safety evaluation and risk assessment scenarios
**Learning Activities**:
- **Safety Checklist Completion**: Complete detailed safety checklists for different scenarios
- **Hazard Identification**: Identify potential hazards in various operational situations
- **Risk Assessment**: Evaluate risk levels and implement appropriate control measures
- **Emergency Response**: Practice emergency procedures and response protocols

**Assessment Criteria**:
- Complete and accurate safety checklist completion
- Proper identification of all potential hazards
- Appropriate risk assessment and control measures
- Correct execution of emergency procedures

### 3. Troubleshooting Scenarios and Problem-Solving
**Exercise Overview**: Real-world troubleshooting scenarios with multiple difficulty levels
**Learning Activities**:
- **Problem Analysis**: Analyze system problems using diagnostic tools and procedures
- **Root Cause Identification**: Identify underlying causes of system issues
- **Solution Development**: Develop and implement appropriate solutions
- **Verification Testing**: Verify that problems have been resolved correctly

**Assessment Criteria**:
- Systematic approach to problem identification
- Accurate diagnosis of system issues
- Effective solution implementation
- Proper verification of problem resolution

### 4. Practical Application and Hands-On Activities
**Exercise Overview**: Real-world application of knowledge and skills
**Learning Activities**:
- **Startup Procedures**: Practice safe startup procedures for different system configurations
- **Operation Monitoring**: Monitor system performance and identify potential issues
- **Maintenance Tasks**: Perform routine maintenance tasks and procedures
- **Performance Optimization**: Optimize system performance for different operating conditions

**Assessment Criteria**:
- Safe and correct execution of startup procedures
- Effective monitoring and problem recognition
- Proper completion of maintenance tasks
- Successful performance optimization

### 5. Advanced System Operations
**Exercise Overview**: Advanced operations and optimization techniques
**Learning Activities**:
- **System Integration**: Integrate ${topic.toLowerCase()} systems with other industrial systems
- **Performance Analysis**: Analyze system performance data and identify improvement opportunities
- **Efficiency Optimization**: Implement efficiency improvement strategies
- **Predictive Maintenance**: Use predictive maintenance techniques and technologies

**Assessment Criteria**:
- Successful system integration
- Accurate performance analysis
- Effective efficiency optimization
- Proper predictive maintenance implementation

INTERACTIVE FEATURES:
- **3D Simulations**: Realistic 3D simulations of system components and operations
- **Virtual Reality**: Immersive VR experiences for hands-on training
- **Real-Time Feedback**: Immediate feedback on performance and progress
- **Progress Tracking**: Comprehensive tracking of learning progress and achievements
- **Adaptive Learning**: Content that adapts to individual learning pace and style

PRACTICAL SCENARIOS:
- **Manufacturing Environment**: Realistic manufacturing scenarios and challenges
- **Emergency Situations**: Emergency response and crisis management scenarios
- **Maintenance Operations**: Comprehensive maintenance and repair scenarios
- **Performance Optimization**: System optimization and efficiency improvement scenarios

ASSESSMENT AND EVALUATION:
- **Knowledge Tests**: Comprehensive knowledge assessment with detailed feedback
- **Skill Demonstrations**: Practical skill demonstrations and evaluations
- **Scenario-Based Assessments**: Real-world scenario-based assessments
- **Performance Metrics**: Detailed performance metrics and improvement recommendations

CERTIFICATION PATHWAY:
- **Module Completion**: Successful completion of all module components
- **Performance Standards**: Meeting established performance standards and criteria
- **Safety Competency**: Demonstrating safety competency and awareness
- **Practical Application**: Successfully applying knowledge in practical scenarios

This comprehensive interactive module provides essential training for working with ${topic.toLowerCase()} systems in industrial environments, combining theoretical knowledge with practical application through engaging and effective learning experiences.`;

    return {
      type: 'interactive',
      title: title,
      content: content,
      url: `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`,
      isGenerated: true
    };
  }
} 