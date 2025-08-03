# Configuración de Recursos Externos

Para usar recursos externos de la web (cuando selecciones "External Knowledge Source"), necesitas configurar las siguientes API keys:

## 1. YouTube Data API Key

### Obtener la API Key:
1. Ve a: https://console.cloud.google.com/apis/credentials
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la "YouTube Data API v3"
4. Crea credenciales (API Key)
5. Copia la API key

### Configurar en la app:
Crea un archivo `.env` en la carpeta `doctor-directory` con:
```
REACT_APP_YOUTUBE_API_KEY=tu_youtube_api_key_aqui
```

## 2. Google Custom Search API

### Obtener la API Key:
1. Ve a: https://console.cloud.google.com/apis/credentials
2. Habilita la "Custom Search API"
3. Crea credenciales (API Key)
4. Copia la API key

### Crear Custom Search Engine:
1. Ve a: https://cse.google.com/cse/
2. Crea un nuevo motor de búsqueda
3. Configura para buscar en toda la web
4. Copia el Search Engine ID

### Configurar en la app:
Agrega al archivo `.env`:
```
REACT_APP_GOOGLE_API_KEY=tu_google_api_key_aqui
REACT_APP_GOOGLE_CSE_ID=tu_search_engine_id_aqui
```

## 3. Uso

Una vez configuradas las API keys:

1. En el formulario, selecciona "External Knowledge Source"
2. Llena el resto del formulario
3. Haz clic en "Generate Plan"
4. El sistema buscará automáticamente:
   - Videos de YouTube relacionados
   - PDFs y documentos técnicos
   - Recursos interactivos y simuladores

## 4. Fallback

Si las API keys no están configuradas o hay errores, el sistema usará automáticamente la base de datos local de recursos como respaldo.

## 5. Costos

- **YouTube API**: Gratis hasta 10,000 requests/día
- **Google Custom Search**: Gratis hasta 100 requests/día
- **OpenAI**: Según tu plan (gpt-3.5-turbo es muy económico) 