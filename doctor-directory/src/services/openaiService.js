import OpenAI from 'openai';
import { OPENAI_CONFIG, getModelConfig, validateApiKey } from '../config/openai';

// Variable para almacenar la API key dinámicamente
let apiKey = process.env.REACT_APP_OPENAI_API_KEY || localStorage.getItem('openai_api_key');

// Función para configurar la API key
export const setApiKey = (key) => {
  apiKey = key;
  if (key) {
    localStorage.setItem('openai_api_key', key);
  } else {
    localStorage.removeItem('openai_api_key');
  }
};

// Función para obtener la API key actual
export const getApiKey = () => {
  return apiKey || localStorage.getItem('openai_api_key');
};

// Función para crear instancia de OpenAI
const createOpenAI = () => {
  const currentApiKey = getApiKey();
  if (!currentApiKey) {
    throw new Error('API key not configured');
  }
  
  return new OpenAI({
    apiKey: currentApiKey,
    dangerouslyAllowBrowser: true // Solo para desarrollo - en producción usar backend
  });
};

const API_URL = 'https://openai-proxy-3wxw.onrender.com/api/generate';

export class OpenAIService {
  static async generateTrainingPlan(formData) {
    const prompt = this.buildTrainingPlanPrompt(formData);
    return callOpenAIProxy({
      messages: [
        { role: "system", content: "You are an expert technical training consultant specializing in industrial maintenance and manufacturing. Create detailed, personalized training plans that are practical and actionable." },
        { role: "user", content: prompt }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 2000
    });
  }

  static async generateTrainingContent(module, formData) {
    const prompt = this.buildContentPrompt(module, formData);
    return callOpenAIProxy({
      messages: [
        { role: "system", content: "You are a technical training content creator. Generate engaging, practical training materials including videos, documents, and interactive exercises." },
        { role: "user", content: prompt }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      max_tokens: 1500
    });
  }

  static async generateChatbotResponse(userMessage, context) {
    return callOpenAIProxy({
      messages: [
        { 
          role: "system", 
          content: `You are an expert technical training tutor for TechFlow Academy, specializing in industrial maintenance, PLC programming, electrical systems, and manufacturing equipment.

Your role is to:
1. Answer technical questions about training content
2. Provide guidance on learning paths and progress
3. Explain complex concepts in simple terms
4. Help with troubleshooting and problem-solving
5. Motivate and encourage learning progress

Current student context: ${context}

IMPORTANT RULES:
- Always respond in English
- Be professional but friendly
- Provide practical, actionable advice
- Reference specific training content when relevant
- Keep responses concise but informative
- If you don't know something, suggest where to find the information

Respond as a knowledgeable technical instructor who genuinely wants to help the student succeed.`
        },
        { role: "user", content: userMessage }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 400
    });
  }

  // Generar contenido directamente con un prompt personalizado
  static async generateContentDirectly(prompt) {
    return callOpenAIProxy({
      messages: [
        {
          role: "system",
          content: `You are an expert technical writer and industrial training content creator. Create comprehensive, professional, and educational content for industrial training. Focus on practical applications, safety, and real-world scenarios.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1500
    });
  }

  static buildTrainingPlanPrompt(formData) {
    // Calcular semanas basadas en tiempo objetivo y horas disponibles
    const targetMonths = parseInt(formData.targetTime) || 1;
    const hoursPerWeek = parseInt(formData.hoursPerWeek.split('-')[0]) || 2;
    
    // Calcular semanas totales basadas en tiempo objetivo
    const totalWeeks = targetMonths * 4; // 4 semanas por mes
    
    // Ajustar basado en horas disponibles (más horas = menos semanas necesarias)
    const adjustedWeeks = Math.max(3, Math.min(12, Math.ceil(totalWeeks * (2 / hoursPerWeek))));
    
    return `Create a comprehensive, personalized INDUSTRIAL TECHNICAL training plan for ${formData.fullName} (${formData.currentRole}) at TechFlow Academy.

**CRITICAL: Focus ONLY on industrial topics: PLC programming, electrical systems, mechanical systems, hydraulics, pneumatics, industrial controls, automation, safety, and manufacturing equipment. DO NOT include cybersecurity, software development, or non-industrial topics.**

EMPLOYEE PROFILE:
- Name: ${formData.fullName}
- Email: ${formData.email}
- Employee ID: ${formData.employeeId}
- Position: ${formData.position}
- Current Role: ${formData.currentRole}
- Learning Style: ${formData.learningStyle}
- Language Preference: ${formData.language}
- Time Availability: ${formData.hoursPerWeek} hours per week
- Preferred Schedule: ${formData.preferredSchedule}
- Target Time: ${targetMonths} month(s)
- Development Goal: ${formData.developmentGoal}

TECHNICAL SKILLS ASSESSMENT (Current Level):
- Mechanical: ${formData.mechanical}
- Electrical: ${formData.electrical}
- Hydraulics: ${formData.hydraulics}
- Pneumatics: ${formData.pneumatics}
- Controls: ${formData.controls}
- Safety/EHS: ${formData.safetyEhs}

EQUIPMENT USED: ${formData.equipmentUsed.join(', ')}

Please create a ${adjustedWeeks}-week training plan with the following structure:

**IMPORTANT: Use exactly ${adjustedWeeks} weeks, each with ## Week X: [Title] format**

**PLANNING CONSIDERATIONS:**
1. **Current Skills Gap:** Focus on areas where skills are 'none' or 'basic'
2. **Equipment Focus:** Prioritize training related to ${formData.equipmentUsed.join(', ')}
3. **Learning Style Adaptation:** 
   - If Visual: Prioritize videos, diagrams, interactive simulations, and visual demonstrations
   - If Reading: Focus on technical documents, manuals, PDF guides, and written materials
   - If Kinesthetic: Emphasize hands-on activities, interactive simulations, and practical exercises
   - If Auditory: Include audio explanations, video lectures, and verbal instructions
4. **Schedule Preference:** Consider ${formData.preferredSchedule} availability
5. **Language:** Provide content in ${formData.language}
6. **Progressive Learning:** Build from current skill levels to advanced

For each week, include:
1. **Week Title** - Focus on specific skills from the development goal
2. **Learning Objectives** - What will be learned this week
3. **Resources** - List 2-3 resources per week, prioritizing the learning style:

**For Visual Learners (${formData.learningStyle.includes('Visual') ? 'YES' : 'NO'}):**
   - **Video:** [Clear, concise title] - [Visual demonstration/explanation]
   - **Interactive:** [Clear, concise title] - [Visual simulation/diagram]
   - **PDF:** [Clear, concise title] - [Visual guide with diagrams]

**For Reading Learners (${formData.learningStyle.includes('Reading') ? 'YES' : 'NO'}):**
   - **PDF:** [Specific technical topic] - [Comprehensive technical document with detailed content, examples, and procedures]
   - **PDF:** [Equipment-specific manual] - [Step-by-step manual for ${formData.equipmentUsed.join(', ')}]
   - **Video:** [Clear, concise title] - [Supplemental visual aid]

**For Kinesthetic Learners (${formData.learningStyle.includes('Kinesthetic') ? 'YES' : 'NO'}):**
   - **Interactive:** [Clear, concise title] - [Hands-on simulation]
   - **Interactive:** [Clear, concise title] - [Practical exercise]
   - **Video:** [Clear, concise title] - [Demonstration to follow along]

**For Auditory Learners (${formData.learningStyle.includes('Auditory') ? 'YES' : 'NO'}):**
   - **Video:** [Clear, concise title] - [Audio explanation/lecture]
   - **Video:** [Clear, concise title] - [Verbal instruction]
   - **PDF:** [Clear, concise title] - [Written transcript/notes]

**IMPORTANT:** Keep titles short and clear (max 50 characters). Avoid hashtags, long descriptions, or technical jargon in titles.

**CRITICAL FORMAT REQUIREMENTS:**
- Use exactly this format for each week: ## Week X: [Topic]
- Use exactly this format for each resource: - **Video:** [Title] - [Description]
- Always include 2-3 resources per week
- Always use Video, PDF, or Interactive as the type

Example format:
## Week 1: PLC Programming Basics
- **Video:** PLC Introduction - Basic concepts and overview
- **PDF:** PLC Manual - Complete programming guide
- **Interactive:** PLC Simulator - Practice programming

## Week 2: Electrical Systems
- **Video:** Electrical Basics - Understanding circuits
- **PDF:** Electrical Guide - Safety and procedures
- **Interactive:** Circuit Simulator - Build and test circuits

Continue for all ${adjustedWeeks} weeks, focusing on the development goal: "${formData.developmentGoal}".

**TIMELINE CONSIDERATIONS:**
- Target completion: ${targetMonths} month(s)
- Weekly commitment: ${formData.hoursPerWeek} hours
- Preferred schedule: ${formData.preferredSchedule}
- Total estimated hours: ${adjustedWeeks * hoursPerWeek} hours

**PERSONALIZATION REQUIREMENTS:**
- Start with areas where current skills are 'none' or 'basic'
- Include equipment-specific training for: ${formData.equipmentUsed.join(', ')}
- **Learning Style Priority:** 
  ${formData.learningStyle.includes('Visual') ? '- Prioritize visual resources (videos, diagrams, simulations)' : ''}
  ${formData.learningStyle.includes('Reading') ? '- Focus on written materials (manuals, documents, guides)' : ''}
  ${formData.learningStyle.includes('Kinesthetic') ? '- Emphasize hands-on activities and interactive exercises' : ''}
  ${formData.learningStyle.includes('Auditory') ? '- Include audio explanations and verbal instructions' : ''}
- **Resource Priority:** 
  ${formData.knowledgeSource === 'internal' ? '- Use internal company resources when available' : ''}
  ${formData.knowledgeSource === 'public' ? '- Use external/public resources from the web' : ''}
  ${formData.knowledgeSource === 'both' ? '- Combine internal and external resources appropriately' : ''}
- Provide content in ${formData.language}
- Consider ${formData.preferredSchedule} schedule preferences

Make each week progressive, building on previous knowledge and current skill levels.`;
  }

  static buildContentPrompt(module, formData) {
    return `Generate specific training content for Module: ${module.title}

Context:
- Employee Role: ${formData.currentRole}
- Learning Style: ${formData.learningStyle}
- Equipment: ${formData.equipmentUsed.join(', ')}
- Development Goal: ${formData.developmentGoal}

Please create:
1. A detailed lesson plan for this module
2. Key learning objectives
3. Recommended activities (videos, hands-on, reading, etc.)
4. Assessment methods
5. Success criteria

Format the response in Markdown.`;
  }
}

async function callOpenAIProxy({ messages, model, temperature, max_tokens }) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, model, temperature, max_tokens }),
  });
  const data = await response.json();
  if (data.content) return data.content;
  throw new Error(data.error || 'Error from OpenAI proxy');
} 