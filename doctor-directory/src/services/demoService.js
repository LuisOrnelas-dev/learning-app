// Servicio de demostración que genera planes sin API
export class DemoService {
  static async generateTrainingPlan(formData) {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return `# Personalized Training Plan for ${formData.fullName}

## Profile Summary
- **Role:** ${formData.currentRole}
- **Learning Style:** ${formData.learningStyle}
- **Objective:** ${formData.developmentGoal}
- **Availability:** ${formData.hoursPerWeek} hours per week

## Learning Path

### Module 1: Basic Fundamentals (${formData.hoursPerWeek === '1-2' ? '2' : '4'} hours)
**Focus:** Review of fundamental concepts and safety

**Topics:**
- Basic operation principles of ${formData.equipmentUsed.length > 0 ? formData.equipmentUsed[0] : 'industrial equipment'}
- Safety protocols for industrial operations
- Introduction to mechanical systems

**Recommended Activities:**
- Interactive 3D equipment visualization
- Virtual tour of safety procedures
- Case study analysis

### Module 2: Core Skills Development (${formData.hoursPerWeek === '1-2' ? '3' : '6'} hours)
**Focus:** Strengthening of main technical skills

**Topics:**
- ${formData.developmentGoal.includes('hidráulica') ? 'Advanced hydraulic systems' : 'Key technical skills'}
- Diagnostic techniques and problem solving
- Preventive maintenance strategies

**Recommended Activities:**
- Practical simulation exercises
- Diagnostic scenario practice
- Maintenance planning workshop

### Module 3: Specialized Applications (${formData.hoursPerWeek === '1-2' ? '2' : '4'} hours)
**Focus:** Specific application in used equipment

**Topics:**
- Specific focus on ${formData.equipmentUsed.join(', ')}
- Advanced control systems
- Operational efficiency optimization

**Recommended Activities:**
- Specific equipment simulations
- Performance benchmarking
- Optimization challenge

## Recommended Resources

### Video Content
1. **Technical Video Series** - Fundamental concepts
2. **Equipment Tutorials** - Specific operation of ${formData.equipmentUsed[0] || 'key equipment'}
3. **Case Studies** - Practical applications in industry

### Documentation
1. **Technical Manuals** - Official equipment documentation
2. **Procedure Guides** - Safety and operation protocols
3. **Data Sheets** - Detailed technical specifications

### Interactive Simulations
1. **3D Simulator** - Virtual equipment operation
2. **Diagnostic Modules** - Problem solving practice
3. **Test Environments** - Safe experimentation

## Evaluation Metrics

### Pre-Evaluation
- **Basic Knowledge Test** - Initial assessment
- **Skills Analysis** - Identification of strengths and improvement areas

### Continuous Evaluation
- **Practical Projects** - Knowledge application
- **Module Evaluations** - Progress tracking
- **Supervisor Feedback** - On-the-job evaluation

### Final Evaluation
- **Practical Demonstration** - Skills application
- **Comprehensive Evaluation** - Measurement of achieved objectives

## Timeline and Milestones

### Week 1-2: Fundamentals
- Complete Module 1
- Basic knowledge evaluation
- Resource familiarization

### Week 3-4: Core Development
- Complete Module 2
- Intermediate practical projects
- Progress evaluation

### Week 5-6: Specialization
- Complete Module 3
- Final integrative project
- Final evaluation

## Important Notes

*This plan has been generated in demo mode. To get a completely personalized plan with AI, configure your OpenAI API key.*

**Next Steps:**
1. Review and adjust the plan according to specific needs
2. Coordinate with supervisors for implementation
3. Establish follow-up and evaluation dates`;
  }

  static async generateTrainingContent(module, formData) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return `# Content for ${module.title}

## Learning Objectives
- Understand the fundamentals of ${module.title.toLowerCase()}
- Apply knowledge in practical situations
- Develop diagnostic and problem-solving skills

## Recommended Activities
1. **Material Reading** - Relevant technical documentation
2. **Practical Exercises** - Concept application
3. **Simulations** - Practice in virtual environment
4. **Evaluations** - Progress measurement

## Additional Resources
- Specific technical manuals
- Tutorial videos
- Industry case studies

*Content generated in demo mode.*`;
  }

  static async generateChatbotResponse(userMessage, context) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = [
      "I understand your question about training. I'll help you find the information you need.",
              "Excellent progress in your training. Would you like me to explain something specific about the content?",
        "Based on your profile, I recommend reviewing that section. Do you need additional help?",
        "Very good! You're progressing correctly in your training plan. Is there anything else I can help you with?",
      "Perfect, that's an excellent question about the technical content. Let me explain the details."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
} 