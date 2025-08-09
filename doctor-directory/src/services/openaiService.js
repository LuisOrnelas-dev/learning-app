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
    console.log('=== PROMPT BEING SENT TO API ===');
    console.log('FormData received:', formData);
    console.log('Language field:', formData.language);
    console.log('Equipment field:', formData.equipmentUsed);
    console.log('Learning style field:', formData.learningStyle);
    console.log('Development goal field:', formData.developmentGoal);
    console.log('Prompt length:', prompt.length);
    console.log('FULL PROMPT:', prompt);
    console.log('=== END PROMPT DEBUG ===');
    const response = await callOpenAIProxy({
      messages: [
        { role: "system", content: "You are an expert technical training consultant specializing in industrial maintenance and manufacturing. You MUST follow ALL instructions exactly as specified. Create detailed, personalized training plans that are practical and actionable. CRITICAL: You must respond in the exact language requested, use the exact number of weeks specified, and follow the resource type distribution exactly as instructed." },
        { role: "user", content: prompt }
      ],
      model: "gpt-4",
      temperature: 0.3,
      max_tokens: 4000
    });
    console.log('=== API RESPONSE ===');
    console.log('Response length:', response.length);
    console.log('Full response:', response);
    console.log('=== END RESPONSE DEBUG ===');
    return response;
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
          content: `You are an expert technical training tutor for TechFlow Academy's learning management system, specializing in industrial maintenance, PLC programming, electrical systems, and manufacturing equipment.

ABOUT THIS SYSTEM:
You are part of TechFlow Academy's AI-powered training platform that:
- Generates personalized training plans based on employee profiles
- Creates custom PDFs, videos, and interactive content
- Provides evaluation systems with theoretical and practical assessments
- Offers interactive canvas tools for hands-on learning
- Tracks progress through weekly modules and resources

Your role is to:
1. Help users navigate and use the TechFlow Academy platform
2. Answer technical questions about training content
3. Provide guidance on learning paths and progress
4. Explain how to use platform features (evaluations, interactive tools, etc.)
5. Assist with troubleshooting both technical content and platform usage
6. Motivate and encourage learning progress

Current student context: ${context}

IMPORTANT RULES:
- ALWAYS respond in English by default
- If the user writes in Spanish, respond in Spanish
- When users ask about "the app" or "the system", refer to TechFlow Academy platform
- Help with both technical content AND platform usage
- Be professional but friendly
- Provide practical, actionable advice
- Reference specific training content when relevant
- Keep responses concise but informative
- Guide users on how to use platform features effectively

Respond as a knowledgeable instructor who understands both the technical content AND the learning platform itself.`
        },
        { role: "user", content: userMessage }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 400
    });
  }

  // Generate content directly with a custom prompt
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
    // Calcular semanas basadas EXACTAMENTE en tiempo objetivo
    const targetMonths = parseInt(formData.targetTime) || 1;
    const hoursPerWeek = parseInt(formData.hoursPerWeek.split('-')[0]) || 2;
    
    // SEMANAS EXACTAS: 1 mes = 4 semanas, 2 meses = 8 semanas, etc.
    const adjustedWeeks = targetMonths * 4;
    
    // Determine content language based on preference
    const getContentLanguage = () => {
      const lang = (formData.language || '').toLowerCase();
      if (lang.includes('spanish') && lang.includes('english')) return 'Spanish with technical terms in English';
      if (lang.includes('spanish') || lang.includes('español')) return 'Spanish';
      return 'English';
    };

    // Determine resource types based on learning style
    const getResourceTypes = () => {
      if (formData.learningStyle.includes('Reading')) {
        return 'Focus EXCLUSIVELY on written materials: PDFs, manuals, technical documents, guides, and written procedures. Minimize videos and interactive content.';
      }
      if (formData.learningStyle.includes('Auditory')) {
        return 'Focus PRIMARILY on audio/video content: video lectures, audio explanations, recorded presentations, and verbal instructions. Include some PDFs as transcripts.';
      }
      if (formData.learningStyle.includes('Visual')) {
        return 'Focus PRIMARILY on visual content: videos with demonstrations, visual diagrams, infographics, and visual simulations. Include interactive visual tools.';
      }
      if (formData.learningStyle.includes('Kinesthetic')) {
        return 'Focus PRIMARILY on hands-on interactive content: interactive simulations, practical exercises, hands-on activities, and step-by-step practice modules.';
      }
      return 'Provide a balanced mix of all resource types.';
    };

    // Prioritize skills based on current levels
    const getPrioritySkills = () => {
      const skillLevels = {
        mechanical: formData.mechanical,
        electrical: formData.electrical,
        hydraulics: formData.hydraulics,
        pneumatics: formData.pneumatics,
        controls: formData.controls,
        safetyEhs: formData.safetyEhs
      };
      
      const prioritySkills = Object.entries(skillLevels)
        .filter(([skill, level]) => level === 'none' || level === 'basic')
        .map(([skill, level]) => `${skill} (currently ${level})`)
        .join(', ');
      
      return prioritySkills || 'All technical areas for advancement';
    };

    return `Create a HIGHLY PERSONALIZED industrial technical training plan for ${formData.fullName} (${formData.currentRole}, ${formData.position}) at TechFlow Academy.

🚨 **PRIORITY ORDER (FOLLOW THIS EXACT ORDER):**

1️⃣ **PRIMARY FOCUS - DEVELOPMENT GOAL:**
"${formData.developmentGoal}"
- This is the MAIN objective - every week must advance toward this goal
- Use exact keywords and concepts from this goal
- All content must be directly applicable to achieving this specific goal

2️⃣ **SECONDARY FOCUS - EQUIPMENT SPECIALIZATION:**
Primary Equipment: ${formData.equipmentUsed.join(', ') || 'Industrial equipment'}
- Tailor all training to this specific equipment
- Include equipment-specific troubleshooting, maintenance, and operation
- Use brand-specific procedures and terminology

3️⃣ **TERTIARY FOCUS - ROLE REQUIREMENTS:**
- Current Role: ${formData.currentRole}
- Position: ${formData.position}
- Adapt content to match day-to-day responsibilities of this role

4️⃣ **SUPPORTING SKILLS (ONLY as needed for the above goals):**
Current Skill Levels: Mechanical(${formData.mechanical}), Electrical(${formData.electrical}), Hydraulics(${formData.hydraulics}), Pneumatics(${formData.pneumatics}), Controls(${formData.controls}), Safety/EHS(${formData.safetyEhs})
- Use skills ONLY to support the development goal and equipment focus
- Don't create generic skill training - focus on goal-specific applications

⏰ **TIME STRUCTURE:**
- Target Duration: ${targetMonths} month(s) = ${adjustedWeeks} weeks EXACTLY
- Weekly Time: ${formData.hoursPerWeek} hours
- Schedule: ${formData.preferredSchedule}
- Total Hours: ${adjustedWeeks * hoursPerWeek} hours

🎨 **LEARNING STYLE ADAPTATION:**
${getResourceTypes()}

${formData.learningStyle.includes('Reading') ? `
**RESOURCE BREAKDOWN FOR READING LEARNERS:**
- 80% PDFs, manuals, technical documents, written procedures
- 15% Videos (only for complex demonstrations)
- 5% Interactive (only for assessments)` : ''}

${formData.learningStyle.includes('Auditory') ? `
**RESOURCE BREAKDOWN FOR AUDITORY LEARNERS:**
- 70% Videos with strong audio explanations and lectures
- 20% PDFs (as transcripts and reference materials)
- 10% Interactive (audio-guided simulations)` : ''}

${formData.learningStyle.includes('Visual') ? `
**RESOURCE BREAKDOWN FOR VISUAL LEARNERS:**
- 60% Videos with visual demonstrations and diagrams
- 25% Interactive visual simulations and tools
- 15% PDFs with rich visual content` : ''}

${formData.learningStyle.includes('Kinesthetic') ? `
**RESOURCE BREAKDOWN FOR KINESTHETIC LEARNERS:**
- 70% Interactive hands-on simulations and exercises
- 20% Videos showing step-by-step procedures
- 10% PDFs (only for quick reference guides)` : ''}

🌍 **LANGUAGE REQUIREMENTS:**
- Content Language: ${getContentLanguage()}
- ALL titles, descriptions, and content must be in ${getContentLanguage()}

**TRAINING PLAN STRUCTURE:**
Create EXACTLY ${adjustedWeeks} weeks with this format:

## Week X: [Specific Topic for ${formData.currentRole}]

**Learning Objectives:**
- [Role-specific objective 1]
- [Equipment-specific objective 2]
- [Skill-gap focused objective 3]

**Resources (2-3 per week):**
- **[Type]:** [Title] - [Description tailored to ${formData.currentRole}]
- **[Type]:** [Title] - [Description relating to ${formData.equipmentUsed.join(', ')}]

**CRITICAL REQUIREMENTS - FOLLOW EXACTLY:**
1. **DEVELOPMENT GOAL PRIORITY:** Every week must DIRECTLY advance toward: "${formData.developmentGoal}" - this is the PRIMARY focus
2. **Equipment Focus:** All content must relate to ${formData.equipmentUsed.join(', ') || 'the specified equipment'} when possible
3. **Role Relevance:** All content must be relevant to ${formData.currentRole} and ${formData.position}
4. **Week Progression:** Build systematically toward the development goal, not general skills
5. **RESOURCE TYPES - MANDATORY DISTRIBUTION:** ${getResourceTypes()}
6. **Language:** ALL content in ${getContentLanguage()}

🚨 **LEARNING STYLE ENFORCEMENT:**
${formData.learningStyle.includes('Reading') ? `
EACH WEEK MUST HAVE:
- 2-3 PDFs/Documents/Manuals (this is the MAIN resource type)
- Maximum 1 Video (only if absolutely necessary for complex demonstrations)
- NO Interactive resources (except for final assessments)
NEVER create equal amounts of each type - PDFs must dominate!` : ''}

${formData.learningStyle.includes('Visual') ? `
EACH WEEK MUST HAVE:
- 2-3 Videos with visual demonstrations
- 1 Interactive visual tool/simulation
- Maximum 1 PDF (only for reference)` : ''}

${formData.learningStyle.includes('Auditory') ? `
EACH WEEK MUST HAVE:
- 2-3 Videos with strong audio explanations
- 1 PDF as transcript/reference
- Maximum 1 Interactive (audio-guided)` : ''}

${formData.learningStyle.includes('Kinesthetic') ? `
EACH WEEK MUST HAVE:
- 2-3 Interactive hands-on exercises/simulations
- 1 Video showing step-by-step procedures
- Maximum 1 PDF (quick reference only)` : ''}

Continue for all ${adjustedWeeks} weeks, ensuring each week builds toward the development goal while addressing the specific needs of a ${formData.currentRole} working with ${formData.equipmentUsed.join(', ')}.`;
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

**IMPORTANT: Provide all content in English language.**

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