# 🤖 OpenAI Assistant Chatbot Embebible

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff.svg)](https://vitejs.dev/)
[![OpenAI](https://img.shields.io/badge/OpenAI-Assistants_API-412991.svg)](https://platform.openai.com/docs/assistants)

Chatbot embebible que utiliza **OpenAI Assistants API** con una interfaz moderna inspirada en **Superinterface** para crear una interfaz de chat lista para producción que puede ser integrada en cualquier sitio web mediante un iframe.

> 🚀 **¿Primera vez aquí?** Lee [IMPORTANT_READ_FIRST.md](./IMPORTANT_READ_FIRST.md) para evitar errores comunes.

---

## 📸 Preview

```
┌─────────────────────────────────┐
│       AI Assistant              │
│  Powered by OpenAI Assistants   │
├─────────────────────────────────┤
│                                 │
│  👋 ¡Hola! ¿En qué puedo       │
│     ayudarte hoy?               │
│                                 │
│         Hola, necesito ayuda ██ │
│                                 │
│  ¡Por supuesto! Estoy aquí     │
│  para ayudarte...               │
│                                 │
│         Gracias 😊             ██ │
│                                 │
├─────────────────────────────────┤
│  Escribe tu mensaje aquí...  📤 │
└─────────────────────────────────┘
```

> Una vez deployado, puedes integrarlo en cualquier sitio con un simple `<iframe>`

## ✨ Características

- 🎨 Interfaz de chat moderna y responsiva con UI personalizada
- 🔐 Backend seguro que protege tu API key de OpenAI
- 🚀 Deployment fácil en Vercel
- 📱 Totalmente responsivo y optimizado para iframe
- 💬 Conversaciones persistentes mediante threads de OpenAI
- ⚡ Stack moderno: React + TypeScript + Vite + Express

## 🏗️ Estructura del Proyecto

```
.
├── frontend/          # Aplicación React con Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatApp.tsx      # Componente principal del chat
│   │   │   └── ChatApp.css
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── server/            # Backend Express (desarrollo local)
│   ├── src/
│   │   └── index.ts
│   ├── tsconfig.json
│   └── package.json
│
├── api/              # Funciones serverless para Vercel
│   ├── chat.ts
│   ├── health.ts
│   └── thread-new.ts
│
├── .env.example      # Template de variables de entorno
├── vercel.json       # Configuración de deployment
└── package.json      # Scripts raíz del proyecto
```

## 🚀 Inicio Rápido

### 1️⃣ Prerequisitos

- Node.js 18 o superior
- Una cuenta de OpenAI con acceso a la Assistants API
- Un Assistant creado en OpenAI (obtén tu `assistant_id`)

### 2️⃣ Instalación

```bash
# Clonar el repositorio
git clone <tu-repo>
cd jupyTerminator

# Instalar todas las dependencias (raíz, frontend, server y api)
npm run install:all
```

### 3️⃣ Configuración

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Configuración de OpenAI
OPENAI_API_KEY=sk-proj-tu-api-key-aqui
ASSISTANT_ID=asst_tu-assistant-id-aqui

# Configuración del servidor (desarrollo local)
PORT=3001
NODE_ENV=development

# Frontend (desarrollo local)
VITE_API_URL=http://localhost:3001
```

### 4️⃣ Crear tu Assistant en OpenAI

1. Ve a [platform.openai.com/assistants](https://platform.openai.com/assistants)
2. Crea un nuevo Assistant
3. Configura su nombre, instrucciones y modelo
4. Copia el `assistant_id` (comienza con `asst_...`)
5. Pégalo en tu archivo `.env`

**Opcional - Agregar búsqueda web:**
Si quieres que tu assistant pueda buscar en Google, puedes agregar una función usando [Firecrawl](https://www.firecrawl.dev/):
- Obtén una API key de Firecrawl
- Agrégala a tu `.env`: `FIRECRAWL_API_KEY=tu-key`
- Configura la función en tu Assistant

## 💻 Desarrollo Local

### Iniciar el entorno completo

```bash
# Ejecutar frontend y backend simultáneamente
npm run dev
```

Esto iniciará:
- Frontend en `http://localhost:5173`
- Backend en `http://localhost:3001`

### Iniciar por separado

```bash
# Solo backend
npm run dev:backend

# Solo frontend (en otra terminal)
npm run dev:frontend
```

### Probar el chat

Abre tu navegador en `http://localhost:5173` y deberías ver la interfaz del chat lista para usar.

## 📦 Build para Producción

```bash
# Build completo
npm run build

# Preview del build
npm run preview
```

## 🌐 Deploy en Vercel

### Opción 1: Deploy automático con GitHub (Recomendado)

1. **Sube tu código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/tu-repo.git
   git push -u origin main
   ```

2. **Conecta con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración

3. **Configura las variables de entorno**
   
   En Vercel Dashboard → Settings → Environment Variables, agrega:
   
   | Variable | Valor | Entorno |
   |----------|-------|---------|
   | `OPENAI_API_KEY` | `sk-proj-...` | Production, Preview, Development |
   | `ASSISTANT_ID` | `asst_...` | Production, Preview, Development |
   | `NODE_ENV` | `production` | Production |
   
4. **Deploy!**
   - Click en "Deploy"
   - Espera a que termine el build
   - ¡Tu chatbot está listo!

### Opción 2: Deploy desde la CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy a preview
vercel

# Configurar variables de entorno
vercel env add OPENAI_API_KEY
vercel env add ASSISTANT_ID

# Deploy a producción
vercel --prod
```

### Verificar el Deployment

Una vez deployado:
1. Vercel te dará una URL (ej: `https://tu-proyecto.vercel.app`)
2. Visita la URL para verificar que funciona
3. Prueba el endpoint de salud: `https://tu-proyecto.vercel.app/api/health`

### Configuración de Dominio Personalizado

1. Ve a Vercel Dashboard → Settings → Domains
2. Agrega tu dominio personalizado
3. Sigue las instrucciones de DNS
4. ¡Listo! Tu chat estará en `https://tu-dominio.com`

## 🎯 Embeber el Chat en tu Sitio Web

Una vez deployado, puedes embeber el chat en cualquier página HTML usando un iframe:

```html
<iframe
  src="https://TU-DOMINIO.vercel.app"
  width="400"
  height="600"
  style="border:0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
  title="AI Assistant Chat"
></iframe>
```

### Ejemplo con personalización

```html
<!-- Chat flotante en la esquina -->
<div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
  <iframe
    src="https://TU-DOMINIO.vercel.app"
    width="380"
    height="600"
    style="border:0; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);"
  ></iframe>
</div>
```

### Integración con botón de apertura

```html
<!-- Botón -->
<button id="openChat" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
  💬 Chat con IA
</button>

<!-- Contenedor del iframe (inicialmente oculto) -->
<div id="chatContainer" style="display: none; position: fixed; bottom: 80px; right: 20px; z-index: 9999;">
  <iframe
    src="https://TU-DOMINIO.vercel.app"
    width="380"
    height="600"
    style="border:0; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);"
  ></iframe>
</div>

<script>
  document.getElementById('openChat').addEventListener('click', function() {
    const container = document.getElementById('chatContainer');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  });
</script>
```

## 🔧 API Endpoints

### `POST /api/chat`

Envía un mensaje al assistant.

**Request:**
```json
{
  "message": "Hola, ¿cómo estás?",
  "threadId": "thread_abc123" // Opcional, se crea uno nuevo si no se provee
}
```

**Response:**
```json
{
  "response": "¡Hola! Estoy bien, gracias por preguntar. ¿En qué puedo ayudarte hoy?",
  "threadId": "thread_abc123"
}
```

### `GET /api/health`

Verifica el estado del servidor.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "assistantId": "configured"
}
```

### `POST /api/thread/new`

Crea un nuevo thread manualmente.

**Response:**
```json
{
  "threadId": "thread_xyz789"
}
```

## 🎨 Personalización

### Cambiar colores del chat

Edita `frontend/src/components/ChatApp.css`:

```css
.chat-header {
  background: linear-gradient(135deg, #TU-COLOR-1 0%, #TU-COLOR-2 100%);
}

:global(.si-message--user) {
  background: #TU-COLOR-USUARIO;
}
```

### Modificar el título y subtítulo

Edita `frontend/src/components/ChatApp.tsx`:

```tsx
<h1>Tu Título Aquí</h1>
<p className="chat-subtitle">Tu subtítulo personalizado</p>
```

### Personalizar placeholder

```tsx
<Chat
  messages={messages}
  onSend={sendMessage}
  isProcessing={isProcessing || isLoading}
  placeholder="Tu mensaje personalizado..."
/>
```

## 🔍 Troubleshooting

### El chat no responde

1. Verifica que `OPENAI_API_KEY` esté configurada correctamente
2. Verifica que `ASSISTANT_ID` sea válido
3. Revisa los logs en la consola del navegador y del servidor

### Error 500 en producción

1. Asegúrate de que las variables de entorno estén configuradas en Vercel
2. Verifica que el Assistant exista en tu cuenta de OpenAI
3. Revisa los logs en Vercel Dashboard → Functions

### El iframe no se muestra correctamente

1. Verifica que la URL del iframe sea correcta
2. Asegúrate de que no haya políticas CSP bloqueando el iframe
3. Intenta con diferentes dimensiones de ancho/alto

## 📚 Recursos Adicionales

- [OpenAI Assistants API Documentation](https://platform.openai.com/docs/assistants/overview)
- [Superinterface](https://superinterface.ai) - Inspiración para la UI
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)

## 📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue o pull request.

---

**Hecho con ❤️ usando OpenAI Assistants API y Superinterface**
