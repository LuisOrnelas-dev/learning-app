// Configuración de OpenAI
export const OPENAI_CONFIG = {
  // Modelo por defecto
  DEFAULT_MODEL: 'gpt-4',
  
  // Configuración de prompts
  PROMPTS: {
    TRAINING_PLAN: {
      SYSTEM: "You are an expert technical training consultant specializing in industrial maintenance and manufacturing. Create detailed, personalized training plans that are practical and actionable.",
      TEMPERATURE: 0.7,
      MAX_TOKENS: 2000
    },
    TRAINING_CONTENT: {
      SYSTEM: "You are a technical training content creator. Generate engaging, practical training materials including videos, documents, and interactive exercises.",
      TEMPERATURE: 0.8,
      MAX_TOKENS: 1500
    },
    CHATBOT: {
      SYSTEM: "You are a helpful technical training tutor for TechFlow Academy. You help students with their training questions and provide guidance on technical topics.",
      TEMPERATURE: 0.7,
      MAX_TOKENS: 300
    }
  },
  
  // Configuración de rate limiting
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 10,
    REQUESTS_PER_HOUR: 100
  },
  
  // Configuración de fallback
  FALLBACK_RESPONSES: {
    CHATBOT: [
      "I understand your question. I'll help you find the information you need.",
      "Excellent progress. Would you like me to explain something specific about the content?",
      "Based on your profile, I recommend reviewing that section. Do you need additional help?",
      "Very good! You're progressing correctly. Is there anything else I can help you with?",
      "Perfect, that's an excellent question. Let me explain the details."
    ]
  }
};

// Función para validar API key
export const validateApiKey = (apiKey) => {
  if (!apiKey) return false;
  if (!apiKey.startsWith('sk-')) return false;
  if (apiKey.length < 20) return false;
  return true;
};

// Función para obtener la configuración del modelo
export const getModelConfig = (modelType = 'DEFAULT_MODEL') => {
  const model = process.env.REACT_APP_OPENAI_MODEL || OPENAI_CONFIG.DEFAULT_MODEL;
  const promptConfig = OPENAI_CONFIG.PROMPTS[modelType] || OPENAI_CONFIG.PROMPTS.TRAINING_PLAN;
  
  return {
    model,
    ...promptConfig
  };
}; 