# TechFlow Academy - Training Profile Generator

Una aplicación React para generar planes de entrenamiento personalizados usando inteligencia artificial.

## Características

- 📝 Formulario de perfil completo para empleados
- 🤖 Generación de planes de entrenamiento con OpenAI GPT-4
- 💬 Chatbot inteligente para asistencia
- 📊 Seguimiento de progreso en tiempo real
- 🎯 Contenido personalizado basado en habilidades y objetivos
- 📱 Interfaz responsive y moderna

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar OpenAI API

1. Ve a [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crea una cuenta o inicia sesión
3. Navega a la sección "API Keys"
4. Crea una nueva API key
5. Copia la clave (empieza con `sk-`)

### 3. Configurar la API en la aplicación

**Opción A: Configuración automática (Recomendada)**
1. Ejecuta la aplicación: `npm start`
2. Haz clic en "Configure OpenAI API" en la interfaz
3. Pega tu API key y haz clic en "Save & Test"

**Opción B: Configuración manual**
1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega tu API key:
```
REACT_APP_OPENAI_API_KEY=sk-tu-api-key-aqui
REACT_APP_OPENAI_MODEL=gpt-4
```

### 4. Ejecutar la aplicación

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Uso

1. **Completar el perfil**: Llena el formulario con la información del empleado
2. **Generar plan**: Haz clic en "Generate Plan" para crear un plan personalizado
3. **Revisar contenido**: Explora los módulos y recursos generados
4. **Usar el chatbot**: Haz preguntas sobre el entrenamiento usando el tutor virtual

## Estructura del proyecto

```
src/
├── components/
│   └── ApiConfig.js          # Configuración de API
├── services/
│   └── openaiService.js      # Servicio de OpenAI
├── App.js                    # Componente principal
└── index.js                  # Punto de entrada
```

## Tecnologías utilizadas

- **React 19** - Framework de UI
- **Tailwind CSS** - Estilos
- **OpenAI API** - Generación de contenido
- **React Icons** - Iconografía

## Seguridad

⚠️ **Importante**: Esta aplicación almacena la API key localmente para desarrollo. Para producción, considera:

- Usar un backend para manejar las llamadas a la API
- Implementar autenticación de usuarios
- Usar variables de entorno del servidor
- Implementar rate limiting

## Costos

El uso de la API de OpenAI tiene costos asociados:
- GPT-4: ~$0.03 por 1K tokens de entrada, ~$0.06 por 1K tokens de salida
- Un plan de entrenamiento típico cuesta aproximadamente $0.10-0.30

## Solución de problemas

### Error: "Invalid API Key"
- Verifica que la API key sea correcta
- Asegúrate de que tenga saldo en tu cuenta de OpenAI
- Revisa que la key no haya expirado

### Error: "Rate limit exceeded"
- Espera unos minutos antes de intentar de nuevo
- Considera actualizar tu plan de OpenAI

### La aplicación no carga
- Verifica que todas las dependencias estén instaladas
- Revisa la consola del navegador para errores
- Asegúrate de que el puerto 3000 esté disponible

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
