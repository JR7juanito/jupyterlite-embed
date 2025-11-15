#!/bin/bash

# Script de instalación para OpenAI Assistant Chatbot
# Bash (Linux/Mac)

echo "🤖 Instalando OpenAI Assistant Chatbot..."
echo ""

# Verificar Node.js
echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18 o superior."
    echo "   Descarga desde: https://nodejs.org"
    exit 1
fi
echo "✅ Node.js encontrado: $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado."
    exit 1
fi
echo "✅ npm encontrado: $(npm --version)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
echo ""

echo "1/4 Instalando dependencias raíz..."
npm install || { echo "❌ Error instalando dependencias raíz"; exit 1; }

echo "2/4 Instalando dependencias del frontend..."
cd frontend && npm install || { echo "❌ Error instalando dependencias del frontend"; exit 1; }
cd ..

echo "3/4 Instalando dependencias del servidor..."
cd server && npm install || { echo "❌ Error instalando dependencias del servidor"; exit 1; }
cd ..

echo "4/4 Instalando dependencias de la API..."
cd api && npm install || { echo "❌ Error instalando dependencias de la API"; exit 1; }
cd ..

echo ""
echo "✅ ¡Todas las dependencias instaladas correctamente!"
echo ""

# Verificar archivo .env
if [ -f ".env" ]; then
    echo "✅ Archivo .env encontrado"
else
    echo "⚠️  Archivo .env no encontrado"
    echo ""
    echo "📝 Copiando .env.example a .env..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales:"
    echo "   - OPENAI_API_KEY=tu-api-key"
    echo "   - ASSISTANT_ID=tu-assistant-id"
    echo ""
fi

echo ""
echo "🎉 ¡Instalación completada!"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Edita el archivo .env con tus credenciales de OpenAI"
echo "   2. Ejecuta: npm run dev"
echo "   3. Abre http://localhost:5173 en tu navegador"
echo ""
echo "📖 Para más información, consulta README.md"
echo ""
