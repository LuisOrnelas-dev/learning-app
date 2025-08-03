# Guía de Uso de la API de OpenAI

## Configuración Inicial

### 1. Obtener API Key

1. Ve a [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crea una cuenta o inicia sesión
3. Navega a "API Keys"
4. Haz clic en "Create new secret key"
5. Copia la clave (empieza con `sk-`)

### 2. Configurar en la Aplicación

**Opción A: Interfaz de Usuario (Recomendada)**
- Ejecuta la aplicación
- Haz clic en "Configure OpenAI API"
- Pega tu API key
- Haz clic en "Save & Test"

**Opción B: Archivo .env**
```bash
# Crea un archivo .env en la raíz del proyecto
REACT_APP_OPENAI_API_KEY=sk-tu-api-key-aqui
REACT_APP_OPENAI_MODEL=gpt-4
```

## Funcionalidades Disponibles

### 1. Generación de Planes de Entrenamiento

**Cuándo se ejecuta:**
- Al hacer clic en "Generate Plan" después de completar el formulario

**Qué hace:**
- Analiza el perfil del empleado
- Genera un plan personalizado con 3-5 módulos
- Incluye objetivos, actividades y recursos recomendados
- Estima tiempos basados en disponibilidad

**Prompt utilizado:**
```
Create a comprehensive, personalized technical training plan for a [ROLE] at TechFlow Academy.

EMPLOYEE PROFILE:
- Name: [NAME]
- Role: [ROLE]
- Learning Style: [STYLE]
- Language Preference: [LANGUAGE]
- Time Availability: [HOURS] hours per week
- Development Goal: [GOAL]

TECHNICAL SKILLS ASSESSMENT:
- Mechanical: [LEVEL]
- Electrical: [LEVEL]
- Hydraulics: [LEVEL]
- Pneumatics: [LEVEL]
- Controls: [LEVEL]
- Safety/EHS: [LEVEL]

EQUIPMENT: [EQUIPMENT_LIST]

Please create a detailed training plan with:
1. Employee Profile Summary
2. Learning Path Overview (3-5 modules)
3. Detailed Module Breakdown
4. Recommended Resources
5. Evaluation Metrics
6. Timeline and Milestones
```

### 2. Generación de Contenido Adicional

**Cuándo se ejecuta:**
- Al hacer clic en "Generate Content" en la pestaña de curso

**Qué hace:**
- Crea contenido específico basado en el perfil
- Genera lecciones, ejercicios y evaluaciones
- Adapta el contenido al estilo de aprendizaje

**Prompt utilizado:**
```
Generate specific training content for Module: [MODULE_TITLE]

Context:
- Employee Role: [ROLE]
- Learning Style: [STYLE]
- Equipment: [EQUIPMENT]
- Development Goal: [GOAL]

Please create:
1. A detailed lesson plan for this module
2. Specific learning objectives
3. Recommended activities and exercises
4. Assessment questions or practical tasks
5. Additional resources and references
```

### 3. Chatbot Inteligente

**Cuándo se ejecuta:**
- Cada vez que el usuario envía un mensaje en el chat

**Qué hace:**
- Proporciona respuestas contextuales sobre el entrenamiento
- Ayuda con preguntas técnicas
- Guía al usuario en su proceso de aprendizaje

**Contexto incluido:**
- Nombre del empleado
- Rol actual
- Estilo de aprendizaje
- Progreso actual

## Configuración Avanzada

### Modelos Disponibles

```javascript
// En src/config/openai.js
export const OPENAI_CONFIG = {
  DEFAULT_MODEL: 'gpt-4',
  PROMPTS: {
    TRAINING_PLAN: {
      SYSTEM: "...",
      TEMPERATURE: 0.7,
      MAX_TOKENS: 2000
    },
    TRAINING_CONTENT: {
      SYSTEM: "...",
      TEMPERATURE: 0.8,
      MAX_TOKENS: 1500
    },
    CHATBOT: {
      SYSTEM: "...",
      TEMPERATURE: 0.7,
      MAX_TOKENS: 300
    }
  }
};
```

### Personalización de Prompts

Para personalizar los prompts, edita el archivo `src/config/openai.js`:

```javascript
PROMPTS: {
  TRAINING_PLAN: {
    SYSTEM: "Tu prompt personalizado aquí...",
    TEMPERATURE: 0.7, // 0.0 = muy determinístico, 1.0 = muy creativo
    MAX_TOKENS: 2000  // Máximo de tokens en la respuesta
  }
}
```

### Rate Limiting

La aplicación incluye configuración básica de rate limiting:

```javascript
RATE_LIMIT: {
  REQUESTS_PER_MINUTE: 10,
  REQUESTS_PER_HOUR: 100
}
```

## Manejo de Errores

### Errores Comunes

1. **"Invalid API Key"**
   - Verifica que la key sea correcta
   - Asegúrate de que empiece con `sk-`
   - Revisa que tenga saldo en tu cuenta

2. **"Rate limit exceeded"**
   - Espera unos minutos
   - Considera actualizar tu plan de OpenAI

3. **"Model not found"**
   - Verifica que el modelo especificado esté disponible
   - Usa `gpt-4` o `gpt-3.5-turbo`

### Fallbacks

La aplicación incluye respuestas de fallback para el chatbot:

```javascript
FALLBACK_RESPONSES: {
  CHATBOT: [
    "Entiendo tu pregunta. Te ayudo a encontrar la información que necesitas.",
    "Excelente progreso. ¿Te gustaría que te explique algo específico?",
    // ... más respuestas
  ]
}
```

## Costos Estimados

### Por Plan de Entrenamiento
- **Entrada:** ~500-800 tokens
- **Salida:** ~1000-1500 tokens
- **Costo:** ~$0.05-0.15

### Por Interacción de Chatbot
- **Entrada:** ~50-100 tokens
- **Salida:** ~100-200 tokens
- **Costo:** ~$0.005-0.015

### Por Contenido Adicional
- **Entrada:** ~200-300 tokens
- **Salida:** ~500-800 tokens
- **Costo:** ~$0.02-0.05

## Mejores Prácticas

### 1. Optimización de Prompts
- Sé específico en las instrucciones
- Incluye contexto relevante
- Usa ejemplos cuando sea posible

### 2. Manejo de Errores
- Siempre incluye fallbacks
- Valida la API key antes de usarla
- Maneja rate limits apropiadamente

### 3. Seguridad
- Nunca expongas la API key en el frontend en producción
- Usa un backend para manejar las llamadas
- Implementa autenticación de usuarios

### 4. Monitoreo
- Registra el uso de tokens
- Monitorea los costos
- Revisa la calidad de las respuestas

## Ejemplos de Uso

### Generar Plan para Técnico de Mantenimiento

```javascript
const formData = {
  fullName: "Juan Pérez",
  currentRole: "Maintenance Technician",
  mechanical: "intermediate",
  electrical: "basic",
  hydraulics: "none",
  learningStyle: "Kinesthetic (I learn by doing)",
  developmentGoal: "Improve hydraulic systems knowledge",
  equipmentUsed: ["Farrel F270", "Banbury"]
};

const plan = await OpenAIService.generateTrainingPlan(formData);
```

### Generar Contenido Específico

```javascript
const module = {
  title: "Hydraulic Systems Fundamentals"
};

const content = await OpenAIService.generateTrainingContent(module, formData);
```

### Chatbot con Contexto

```javascript
const context = "Employee: Juan Pérez, Role: Maintenance Technician, Progress: 45%";
const response = await OpenAIService.generateChatbotResponse(
  "¿Cómo puedo mejorar mi conocimiento de sistemas hidráulicos?",
  context
);
```

## Troubleshooting

### La API no responde
1. Verifica tu conexión a internet
2. Revisa que la API key sea válida
3. Confirma que tengas saldo en tu cuenta

### Respuestas de baja calidad
1. Ajusta el `temperature` en la configuración
2. Mejora los prompts del sistema
3. Proporciona más contexto en las solicitudes

### Errores de tokens
1. Reduce `MAX_TOKENS` en la configuración
2. Simplifica los prompts
3. Divide las solicitudes grandes en partes más pequeñas 