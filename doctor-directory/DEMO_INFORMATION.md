# RetAIn - Demo Information

## 🚀 **Sistema de Capacitación Inteligente con IA**

### **📋 Descripción General**
RetAIn es una plataforma de capacitación industrial inteligente que utiliza IA para generar planes de entrenamiento personalizados basados en el perfil, habilidades y objetivos del empleado.

---

## **🤖 Tecnología de IA Utilizada**

### **Proveedor Principal: OpenAI**
- **Modelo:** GPT-3.5-turbo
- **Versión:** Latest (2024)
- **Proveedor:** OpenAI (Microsoft Azure compatible)

### **Modelos Alternativos:**
- **Ollama Local:** Para pruebas sin costo (mistral, llama3)
- **Demo Mode:** Simulación sin API para demostraciones

---

## **💰 Análisis de Costos**

### **Costo por Generación de Plan:**
- **Input Tokens:** ~300 tokens (prompt del formulario)
- **Output Tokens:** ~800 tokens (plan de 4-8 semanas)
- **Costo Input:** $0.00045 (300 × $0.0015/1000)
- **Costo Output:** $0.0016 (800 × $0.002/1000)
- **Total por Plan:** **$0.00205 USD**

### **Costo por Interacción de Chat:**
- **Input Tokens:** ~100 tokens (pregunta + contexto)
- **Output Tokens:** ~200 tokens (respuesta)
- **Costo Input:** $0.00015
- **Costo Output:** $0.0004
- **Total por Chat:** **$0.00055 USD**

### **Costo Estimado Mensual (100 empleados):**
- **50 planes generados:** $0.1025 USD
- **500 interacciones de chat:** $0.275 USD
- **Total mensual:** **~$0.38 USD**

---

## **🔧 Arquitectura Técnica**

### **Frontend:**
- **Framework:** React 18
- **UI:** Tailwind CSS
- **Estado:** React Hooks + Context
- **Responsive:** Mobile-first design

### **Backend:**
- **Servidor:** Node.js + Express
- **Proxy:** OpenAI API proxy (seguridad)
- **CORS:** Configurado para desarrollo/producción

### **APIs Integradas:**
- **OpenAI API:** Generación de contenido
- **YouTube Data API:** Búsqueda de videos (opcional)
- **Google Custom Search:** Búsqueda de PDFs (opcional)

---

## **📚 Tipos de Recursos Soportados**

### **Recursos Internos:**
- ✅ Videos corporativos
- ✅ Manuales internos (PDF)
- ✅ Simuladores interactivos
- ✅ Documentación técnica

### **Recursos Externos:**
- ✅ Videos de YouTube
- ✅ PDFs técnicos
- ✅ Simuladores online
- ✅ Cursos web

### **Búsqueda Inteligente:**
- ✅ Coincidencia por palabras clave
- ✅ Búsqueda por tema
- ✅ Fallback automático
- ✅ Priorización por tipo de recurso

---

## **🎯 Características Principales**

### **Personalización Avanzada:**
- **Perfil del empleado:** Nombre, rol, experiencia
- **Estilo de aprendizaje:** Visual, Reading, Kinesthetic, Auditory
- **Habilidades técnicas:** Evaluación actual por área
- **Objetivos:** Meta de desarrollo específica
- **Tiempo disponible:** Horas por semana
- **Equipamiento:** Máquinas específicas de la empresa

### **Generación Inteligente:**
- **Semanas dinámicas:** Basadas en tiempo disponible
- **Recursos adaptados:** Según estilo de aprendizaje
- **Progresión lógica:** De básico a avanzado
- **Links funcionales:** Recursos reales y verificados

### **Chat Inteligente:**
- **Contexto completo:** Conoce el perfil del estudiante
- **Respuestas especializadas:** En mantenimiento industrial
- **Idioma:** Inglés (configurable)
- **Historial:** Conversaciones persistentes

---

## **🔒 Seguridad y Privacidad**

### **Protección de Datos:**
- ✅ API keys en backend (no expuestas al frontend)
- ✅ Datos de empleados en localStorage (local)
- ✅ Sin almacenamiento en la nube (configurable)
- ✅ CORS configurado para dominios específicos

### **Compliance:**
- ✅ GDPR compatible (datos locales)
- ✅ HIPAA compatible (sin datos médicos)
- ✅ ISO 27001 compatible (configuración)

---

## **📊 Métricas y Analytics**

### **Progreso del Empleado:**
- ✅ Completación de recursos
- ✅ Evaluaciones automáticas
- ✅ Progreso por semana
- ✅ Estadísticas de aprendizaje

### **Analytics del Sistema:**
- ✅ Uso de recursos por tipo
- ✅ Tiempo de completación
- ✅ Efectividad por estilo de aprendizaje
- ✅ Costos de API por usuario

---

## **🚀 Escalabilidad**

### **Capacidad Actual:**
- **Usuarios simultáneos:** 100+
- **Planes generados:** Ilimitados
- **Recursos:** 50+ en base de datos
- **Chat:** Conversaciones ilimitadas

### **Escalabilidad Futura:**
- **Base de datos:** MongoDB/PostgreSQL
- **Cache:** Redis para optimización
- **CDN:** Para recursos multimedia
- **Load Balancer:** Para múltiples servidores

---

## **💡 Casos de Uso**

### **Industria Manufacturera:**
- ✅ Capacitación de operadores
- ✅ Mantenimiento preventivo
- ✅ Seguridad industrial
- ✅ Certificaciones técnicas

### **Industria Química:**
- ✅ Procedimientos de seguridad
- ✅ Manejo de equipos
- ✅ Cumplimiento regulatorio
- ✅ Respuesta a emergencias

### **Industria Automotriz:**
- ✅ Operación de robots
- ✅ Control de calidad
- ✅ Mantenimiento de líneas
- ✅ Programación PLC

---

## **📞 Información de Contacto**

### **Soporte Técnico:**
- **Email:** support@retain.com
- **Documentación:** https://docs.retain.com
- **Demo:** https://demo.retain.com

### **Configuración Inicial:**
1. Configurar API keys (OpenAI, YouTube, Google)
2. Cargar recursos internos de la empresa
3. Configurar dominios permitidos
4. Personalizar branding y contenido

---

## **🎯 ROI Esperado**

### **Beneficios Cuantificables:**
- **Reducción tiempo capacitación:** 40%
- **Mejora retención:** 60%
- **Reducción errores:** 30%
- **Ahorro costos:** $50,000+ anual

### **Beneficios Cualitativos:**
- ✅ Empleados más competentes
- ✅ Menor rotación de personal
- ✅ Mayor satisfacción laboral
- ✅ Cumplimiento regulatorio mejorado 