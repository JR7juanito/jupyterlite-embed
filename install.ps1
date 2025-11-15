# Script de instalación para OpenAI Assistant Chatbot
# PowerShell

Write-Host "🤖 Instalando OpenAI Assistant Chatbot..." -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js no está instalado. Por favor instala Node.js 18 o superior." -ForegroundColor Red
    Write-Host "   Descarga desde: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green

# Verificar npm
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm no está instalado." -ForegroundColor Red
    exit 1
}
Write-Host "✅ npm encontrado: $npmVersion" -ForegroundColor Green
Write-Host ""

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Cyan
Write-Host ""

Write-Host "1/4 Instalando dependencias raíz..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias raíz" -ForegroundColor Red
    exit 1
}

Write-Host "2/4 Instalando dependencias del frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias del frontend" -ForegroundColor Red
    exit 1
}
Set-Location ..

Write-Host "3/4 Instalando dependencias del servidor..." -ForegroundColor Yellow
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias del servidor" -ForegroundColor Red
    exit 1
}
Set-Location ..

Write-Host "4/4 Instalando dependencias de la API..." -ForegroundColor Yellow
Set-Location api
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias de la API" -ForegroundColor Red
    exit 1
}
Set-Location ..

Write-Host ""
Write-Host "✅ ¡Todas las dependencias instaladas correctamente!" -ForegroundColor Green
Write-Host ""

# Verificar archivo .env
if (Test-Path ".env") {
    Write-Host "✅ Archivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Archivo .env no encontrado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 Copiando .env.example a .env..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales:" -ForegroundColor Yellow
    Write-Host "   - OPENAI_API_KEY=tu-api-key" -ForegroundColor White
    Write-Host "   - ASSISTANT_ID=tu-assistant-id" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "🎉 ¡Instalación completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Edita el archivo .env con tus credenciales de OpenAI" -ForegroundColor White
Write-Host "   2. Ejecuta: npm run dev" -ForegroundColor White
Write-Host "   3. Abre http://localhost:5173 en tu navegador" -ForegroundColor White
Write-Host ""
Write-Host "📖 Para más información, consulta README.md" -ForegroundColor Cyan
Write-Host ""
