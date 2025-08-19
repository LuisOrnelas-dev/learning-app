# 🤖 Configuración de Ollama (IA Local)

## ¿Qué es Ollama?

Ollama es una herramienta que te permite ejecutar modelos de IA localmente en tu computadora, sin necesidad de APIs externas ni costos. Es perfecto para:

- ✅ **Privacidad total** - Los datos nunca salen de tu computadora
- ✅ **Sin costos** - No hay límites de uso ni facturación
- ✅ **Funciona offline** - Una vez descargado, no necesita internet
- ✅ **Modelos gratuitos** - Llama, Mistral, CodeLlama, etc.

## 🚀 Instalación Rápida

### 1. Descargar Ollama
Ve a [https://ollama.ai](https://ollama.ai) y descarga la versión para tu sistema operativo.

### 2. Instalar y ejecutar
```bash
# En macOS/Linux, después de descargar:
chmod +x ollama
./ollama serve
```

### 3. Descargar un modelo
```bash
# Modelo recomendado para empezar:
ollama pull llama2

# Otras opciones:
ollama pull mistral    # Más rápido
ollama pull codellama  # Para código
ollama pull llama2:7b  # Versión más pequeña
```

## 🔧 Configuración en la App

1. **Ejecuta Ollama** en segundo plano
2. **Abre la app** de RetAIn
3. **Haz clic en "Local AI"** en la barra superior
4. **Prueba la conexión** con el botón "Test Models"

## 📋 Modelos Disponibles

| Modelo | Tamaño | Velocidad | Uso Recomendado |
|--------|--------|-----------|-----------------|
| `llama2` | 7B | Medio | General |
| `mistral` | 7B | Rápido | General |
| `codellama` | 7B | Medio | Código |
| `llama2:13b` | 13B | Lento | Mejor calidad |
| `llama2:7b` | 7B | Rápido | Básico |

## ⚡ Optimización

### Para mejor rendimiento:
```bash
# Usar GPU (si tienes NVIDIA):
ollama pull llama2:7b

# Usar CPU optimizado:
ollama pull llama2:7b-q4_0
```

### Para menos uso de memoria:
```bash
# Modelos cuantizados (más pequeños):
ollama pull llama2:7b-q4_0
ollama pull mistral:7b-q4_0
```

## 🔍 Solución de Problemas

### Ollama no responde
```bash
# Verificar que esté ejecutándose:
curl http://localhost:11434/api/tags

# Reiniciar Ollama:
pkill ollama
ollama serve
```

### Error de memoria
- Usa modelos más pequeños (`llama2:7b` en lugar de `llama2:13b`)
- Cierra otras aplicaciones que usen mucha RAM
- Usa modelos cuantizados (`-q4_0`)

### Lento
- Usa modelos más pequeños
- Asegúrate de tener suficiente RAM libre
- Considera usar GPU si tienes NVIDIA

## 🎯 Ventajas vs OpenAI API

| Característica | Ollama Local | OpenAI API |
|----------------|---------------|------------|
| **Costo** | Gratis | $0.0015-0.002 por 1K tokens |
| **Privacidad** | 100% local | Datos en servidores de OpenAI |
| **Velocidad** | Depende de tu hardware | Muy rápida |
| **Calidad** | Buena (7B-13B) | Excelente (GPT-4) |
| **Offline** | Sí | No |
| **Configuración** | Requiere instalación | Solo API key |

## 🚀 Próximos Pasos

1. **Instala Ollama** siguiendo los pasos arriba
2. **Descarga un modelo** (`ollama pull llama2`)
3. **Prueba la app** en modo Local AI
4. **Experimenta** con diferentes modelos

¡Disfruta de tu IA local! 🎉 