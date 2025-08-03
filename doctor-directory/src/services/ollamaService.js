// Servicio para usar Ollama localmente
import resources from './resources.json';

export class OllamaService {
  static async generateTrainingPlan(formData) {
    try {
      const prompt = this.buildTrainingPlanPrompt(formData);
      
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral', // o 'mistral', 'codellama', etc.
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1500
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error with Ollama:', error);
      throw new Error('Ollama no está disponible. Asegúrate de que esté instalado y ejecutándose en http://localhost:11434');
    }
  }

  static async generateTrainingContent(module, formData) {
    try {
      const prompt = this.buildContentPrompt(module, formData);
      
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral',
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.8,
            top_p: 0.9,
            max_tokens: 1000
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error with Ollama:', error);
      throw new Error('Ollama no está disponible');
    }
  }

  static async generateChatbotResponse(userMessage, context) {
    try {
      const prompt = `You are a helpful technical training tutor. Context: ${context}. User: ${userMessage}`;
      
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral',
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 300
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error with Ollama:', error);
      return "Lo siento, Ollama no está disponible. ¿Podrías verificar que esté instalado y ejecutándose?";
    }
  }

  static buildTrainingPlanPrompt(formData) {
    // Construir lista de temas a partir del formulario
    const topics = [];
    if (formData.developmentGoal) topics.push(formData.developmentGoal);
    if (formData.equipmentUsed && formData.equipmentUsed.length > 0) topics.push(...formData.equipmentUsed);
    ["mechanical","electrical","hydraulics","pneumatics","controls","safetyEhs"].forEach(skill => {
      if (formData[skill] && formData[skill] !== 'none') topics.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    });
    const topicsList = topics.map(t => t.trim()).filter(Boolean).join(', ');
    return `You are an expert instructional designer.

Create a technical training plan for ${formData.fullName} (${formData.currentRole}) at TechFlow Academy.

Focus the modules on the following topics: ${topicsList}. You may add related subtopics if needed, but prioritize the user's topics.

For each module, use the topic as the module title. For each module, ALWAYS list at least 2-3 learning resources (video, PDF, or interactive) as a bullet list. For each resource, include:
- The type (video, PDF, interactive)
- A realistic title
- A brief description

Format the plan in Markdown, with each module as a level 2 heading (##) and resources as a bullet list. Example:

## PLC Programming
- **Video:** Introduction to PLCs - A beginner-friendly video on PLC basics.
- **PDF:** PLC Programming Guide - Downloadable guide for PLC programming.
- **Interactive:** PLC Simulator - Practice PLC logic with an online simulator.

Personalize the plan using this profile:
- Learning Style: ${formData.learningStyle}
- Language: ${formData.language}
- Hours per week: ${formData.hoursPerWeek}
- Preferred schedule: ${formData.preferredSchedule}
- Development Goal: ${formData.developmentGoal}
- Equipment Used: ${formData.equipmentUsed.join(', ')}
- Skills: Mechanical(${formData.mechanical}), Electrical(${formData.electrical}), Hydraulics(${formData.hydraulics}), Pneumatics(${formData.pneumatics}), Controls(${formData.controls}), Safety/EHS(${formData.safetyEhs})
`;
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
2. Specific learning objectives
3. Recommended activities and exercises
4. Assessment questions or practical tasks
5. Additional resources and references

Make the content engaging and practical, suitable for ${formData.learningStyle} learners.`;
  }

  // Función para verificar si Ollama está disponible
  static async checkOllamaStatus() {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (response.ok) {
        const data = await response.json();
        return {
          status: 'available',
          models: data.models || []
        };
      }
      return { status: 'error', error: 'Ollama not responding' };
    } catch (error) {
      return { 
        status: 'not_available', 
        error: 'Ollama not running. Install from https://ollama.ai' 
      };
    }
  }
} 

// Enriquecer el markdown generado por IA con links reales
export function enrichWithRealResources(aiPlanMarkdown) {
  let enriched = aiPlanMarkdown;
  
  resources.forEach(resource => {
    // Buscar coincidencias más flexibles usando palabras clave
    const keywords = resource.title.toLowerCase().split(' ').filter(word => word.length > 3);
    const resourceType = resource.type.toLowerCase();
    
    // Crear regex más flexible que busque palabras clave
    keywords.forEach(keyword => {
      // Escapar caracteres especiales en la palabra clave
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Buscar líneas que contengan la palabra clave y el tipo de recurso
      const regex = new RegExp(`(\\*\\*${resourceType}\\*\\*:?\\s*)([^\\n]*${escapedKeyword}[^\\n]*?)(\\n|$)`, 'gi');
      enriched = enriched.replace(regex, (match, prefix, title, suffix) => {
        // Si ya tiene un link, no lo cambiamos
        if (title.includes('http') || title.includes('[')) return match;
        // Reemplazar con el link real
        return `${prefix}[${title.trim()}](${resource.url})${suffix}`;
      });
    });
    
    // También buscar coincidencias exactas del título
    const escapedTitle = resource.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactRegex = new RegExp(`(\\*\\*${resourceType}\\*\\*:?\\s*)([^\\n]*${escapedTitle}[^\\n]*?)(\\n|$)`, 'gi');
    enriched = enriched.replace(exactRegex, (match, prefix, title, suffix) => {
      if (title.includes('http') || title.includes('[')) return match;
      return `${prefix}[${title.trim()}](${resource.url})${suffix}`;
    });
  });
  
  return enriched;
} 