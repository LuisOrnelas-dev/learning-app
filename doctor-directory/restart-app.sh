#!/bin/bash

echo "🔄 Reiniciando aplicación React para solucionar problemas de rendimiento..."

# Detener procesos de Node.js que puedan estar corriendo
echo "📋 Deteniendo procesos de Node.js..."
pkill -f "node.*react-scripts" 2>/dev/null || true
pkill -f "npm.*start" 2>/dev/null || true
pkill -f "yarn.*start" 2>/dev/null || true

# Limpiar cache de npm
echo "🧹 Limpiando cache de npm..."
npm cache clean --force

# Limpiar node_modules y reinstalar
echo "📦 Reinstalando dependencias..."
rm -rf node_modules package-lock.json
npm install

# Limpiar cache del navegador (solo en macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🌐 Limpiando cache del navegador..."
    # Limpiar cache de Chrome
    rm -rf ~/Library/Caches/Google/Chrome/Default/Cache/* 2>/dev/null || true
    # Limpiar cache de Safari
    rm -rf ~/Library/Caches/com.apple.Safari/* 2>/dev/null || true
fi

# Limpiar variables de entorno
unset REACT_APP_OPENAI_API_KEY
unset NODE_ENV

echo "✅ Limpieza completada. Iniciando aplicación..."

# Iniciar la aplicación en modo desarrollo optimizado
NODE_OPTIONS="--max-old-space-size=4096" npm start 