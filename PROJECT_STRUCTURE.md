# 📁 Estructura Completa del Proyecto

```
jupyTerminator/
│
├── 📂 frontend/                    # Aplicación React + Vite
│   ├── public/
│   │   └── vite.svg               # Favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatApp.tsx        # Componente principal del chat
│   │   │   └── ChatApp.css        # Estilos del chat
│   │   ├── App.tsx                # Componente raíz
│   │   ├── App.css                # Estilos de App
│   │   ├── main.tsx               # Entry point
│   │   ├── index.css              # Estilos globales
│   │   └── vite-env.d.ts          # Tipos de Vite
│   ├── index.html                 # HTML base
│   ├── vite.config.ts             # Configuración de Vite
│   ├── tsconfig.json              # TypeScript config
│   ├── tsconfig.node.json         # TypeScript config para Node
│   └── package.json               # Dependencias del frontend
│
├── 📂 server/                      # Backend Express (desarrollo local)
│   ├── src/
│   │   └── index.ts               # Servidor Express
│   ├── tsconfig.json              # TypeScript config
│   └── package.json               # Dependencias del backend
│
├── 📂 api/                         # Funciones serverless (Vercel)
│   ├── chat.ts                    # Endpoint principal de chat
│   ├── health.ts                  # Health check
│   ├── thread-new.ts              # Crear nuevo thread
│   ├── tsconfig.json              # TypeScript config
│   └── package.json               # Dependencias de la API
│
├── 📂 examples/                    # Ejemplos de integración
│   └── embed-examples.html        # Ejemplos de iframe
│
├── 📂 .vscode/                     # Configuración de VSCode
│   ├── extensions.json            # Extensiones recomendadas
│   ├── launch.json                # Configuración de debug
│   └── settings.json              # Settings del workspace
│
├── 📄 .env.example                # Template de variables de entorno
├── 📄 .gitignore                  # Archivos ignorados por Git
├── 📄 package.json                # Scripts raíz del proyecto
├── 📄 vercel.json                 # Configuración de Vercel
│
├── 📄 README.md                   # Documentación principal
├── 📄 QUICKSTART.md              # Guía de inicio rápido
├── 📄 CONTRIBUTING.md            # Guía de contribución
├── 📄 CHANGELOG.md               # Historial de cambios
├── 📄 LICENSE                    # Licencia MIT
│
├── 📄 install.ps1                # Script de instalación (Windows)
└── 📄 install.sh                 # Script de instalación (Linux/Mac)
```

## 🎯 Flujo de Datos

```
Usuario en navegador
    ↓
[Frontend React - localhost:5173]
    ↓ (HTTP Request)
/api/chat
    ↓
[Backend Express - localhost:3001] (desarrollo)
    ó
[Vercel Serverless Function] (producción)
    ↓
[OpenAI Assistants API]
    ↓
[Response con mensaje del Assistant]
    ↓
[Frontend muestra el mensaje]
```

## 📦 Dependencias Principales

### Frontend
- React 18
- TypeScript 5
- Vite 5

### Backend (Desarrollo)
- Express 4
- OpenAI SDK 4
- TypeScript 5
- dotenv
- cors

### API (Producción)
- @vercel/node
- OpenAI SDK 4
- TypeScript 5

### Root
- concurrently (para ejecutar frontend + backend simultáneamente)

## 🔧 Scripts Disponibles

### Raíz del proyecto
- `npm run install:all` - Instala todas las dependencias
- `npm run dev` - Ejecuta frontend + backend en desarrollo
- `npm run dev:frontend` - Solo frontend
- `npm run dev:backend` - Solo backend
- `npm run build` - Build de todo el proyecto
- `npm run preview` - Preview del build

### Frontend (cd frontend/)
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build

### Server (cd server/)
- `npm run dev` - Servidor con hot reload
- `npm run build` - Compilar TypeScript
- `npm run start` - Ejecutar versión compilada

## 🚀 URLs de Desarrollo

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/api/health
- Chat Endpoint: http://localhost:3001/api/chat

## 🌐 URLs de Producción (después del deploy)

- App completa: https://tu-dominio.vercel.app
- Health Check: https://tu-dominio.vercel.app/api/health
- Chat API: https://tu-dominio.vercel.app/api/chat

## 📝 Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| `tsconfig.json` | Configuración de TypeScript |
| `vite.config.ts` | Configuración de Vite |
| `vercel.json` | Configuración de deployment en Vercel |
| `.env` | Variables de entorno (no committear) |
| `.env.example` | Template de variables de entorno |

## 🔐 Variables de Entorno Requeridas

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `OPENAI_API_KEY` | API Key de OpenAI | ✅ Sí |
| `ASSISTANT_ID` | ID del Assistant de OpenAI | ✅ Sí |
| `PORT` | Puerto del servidor (dev) | ⚠️ Opcional (default: 3001) |
| `NODE_ENV` | Entorno de ejecución | ⚠️ Opcional |
| `VITE_API_URL` | URL del backend (dev) | ⚠️ Opcional |

## 🎨 Personalización

### Cambiar Colores
Edita `frontend/src/components/ChatApp.css`:
- `.chat-header` - Color del header
- `.message--user .message-content` - Color mensajes del usuario
- `.message--assistant .message-content` - Color mensajes del assistant

### Cambiar Textos
Edita `frontend/src/components/ChatApp.tsx`:
- Título y subtítulo del header
- Placeholder del input
- Mensaje de bienvenida

### Agregar Funcionalidades
- Persistencia: Usa localStorage para guardar conversaciones
- Markdown: Integra una librería de markdown rendering
- Temas: Implementa un sistema de temas claro/oscuro
- Archivos: Agrega soporte para enviar archivos
