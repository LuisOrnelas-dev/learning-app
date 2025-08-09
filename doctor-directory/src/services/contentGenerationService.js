import { OpenAIService } from './openaiService';

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
    const prompt = `Create a comprehensive video script and description for: "${title}"

TOPIC: ${topic}
CONTEXT: Industrial training video for ${formData.currentRole}
LEARNING STYLE: ${formData.learningStyle}
EQUIPMENT: ${formData.equipmentUsed.join(', ')}

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
- **CRITICAL: Write everything in English language**

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
    const prompt = `Create an interactive training module for: "${title}"

TOPIC: ${topic}
CONTEXT: Interactive training for ${formData.currentRole}
LEARNING STYLE: ${formData.learningStyle}
EQUIPMENT: ${formData.equipmentUsed.join(', ')}

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
- **CRITICAL: Write everything in English language**

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

  // Generate instructions for interactive canvas
  static generateInteractiveInstructions(title, topic, formData) {
    const instructions = [];
    
    // Detectar el tipo de contenido basado en el título
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('hydraulic') || lowerTitle.includes('hydraulics')) {
      instructions.push(
        "Draw a basic hydraulic system diagram showing pump, reservoir, valves, and actuator",
        "Label the main components: pump, pressure relief valve, directional control valve, cylinder",
        "Sketch the flow path of hydraulic fluid through the system",
        "Draw a simple troubleshooting flowchart for common hydraulic problems",
        "Create a maintenance checklist diagram with inspection points"
      );
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
      instructions.push(
        "Draw a safety procedure flowchart for equipment startup",
        "Create a hazard identification diagram for your work area",
        "Sketch a PPE selection guide with different scenarios",
        "Draw an emergency response procedure diagram",
        "Create a safety inspection checklist diagram"
      );
    } else if (lowerTitle.includes('plc') || lowerTitle.includes('programming')) {
      instructions.push(
        "Draw a basic PLC ladder logic diagram for a simple control function",
        "Sketch a PLC system block diagram showing inputs, CPU, and outputs",
        "Create a programming flowchart for a specific operation",
        "Draw an I/O mapping diagram for a control system",
        "Sketch a troubleshooting flowchart for PLC problems"
      );
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
    
    // Agregar instrucciones específicas basadas en el estilo de aprendizaje
    if (formData.learningStyle.includes('Visual')) {
      instructions.push(
        "Use different colors to highlight different system components",
        "Create visual connections between related concepts",
        "Draw arrows to show process flow and relationships"
      );
    }
    
    if (formData.learningStyle.includes('Kinesthetic')) {
      instructions.push(
        "Practice drawing the system components step by step",
        "Create a hands-on procedure diagram you can follow",
        "Draw the sequence of actions for troubleshooting"
      );
    }
    
    return instructions.join('\n');
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