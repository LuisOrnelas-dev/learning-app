#!/bin/bash

echo "🤖 Instalador de Ollama para RetAIn"
echo "=============================================="

# Detectar sistema operativo
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📱 Detectado: macOS"
    OS="macos"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Detectado: Linux"
    OS="linux"
else
    echo "❌ Sistema operativo no soportado: $OSTYPE"
    exit 1
fi

# Verificar si Ollama ya está instalado
if command -v ollama &> /dev/null; then
    echo "✅ Ollama ya está instalado"
    echo "🚀 Iniciando Ollama..."
    ollama serve &
    sleep 3
    
    echo "📥 Descargando modelo llama2..."
    ollama pull llama2
    
    echo "🎉 ¡Configuración completada!"
    echo "💡 Ahora puedes usar la app en modo 'Local AI'"
    exit 0
fi

# Instalar Ollama
echo "📥 Descargando Ollama..."

if [[ "$OS" == "macos" ]]; then
    # macOS
    curl -fsSL https://ollama.ai/install.sh | sh
elif [[ "$OS" == "linux" ]]; then
    # Linux
    curl -fsSL https://ollama.ai/install.sh | sh
fi

# Verificar instalación
if ! command -v ollama &> /dev/null; then
    echo "❌ Error: Ollama no se instaló correctamente"
    echo "💡 Intenta instalarlo manualmente desde https://ollama.ai"
    exit 1
fi

echo "✅ Ollama instalado correctamente"

# Iniciar Ollama
echo "🚀 Iniciando Ollama..."
ollama serve &
sleep 5

# Descargar modelo
echo "📥 Descargando modelo llama2 (esto puede tomar varios minutos)..."
ollama pull llama2

# Verificar que todo funcione
echo "🔍 Verificando instalación..."
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✅ Ollama está funcionando correctamente"
    echo "🎉 ¡Configuración completada!"
    echo ""
    echo "💡 Próximos pasos:"
    echo "1. Abre la app de RetAIn"
    echo "2. Haz clic en 'Local AI' en la barra superior"
    echo "3. Prueba la conexión con 'Test Models'"
    echo "4. ¡Disfruta de tu IA local!"
else
    echo "❌ Error: Ollama no responde en http://localhost:11434"
    echo "💡 Intenta reiniciar Ollama manualmente:"
    echo "   ollama serve"
fi 