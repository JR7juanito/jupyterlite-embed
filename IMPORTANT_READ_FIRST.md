# 🎯 IMPORTANTE - Leer Antes de Empezar

## ⚠️ Errores TypeScript Normales

Si estás viendo errores en TypeScript en VSCode, **NO TE PREOCUPES**. Esto es completamente normal y se debe a que las dependencias aún no han sido instaladas.

### ❌ Errores que verás ANTES de instalar:
```
Cannot find module 'react'
Cannot find module 'express'
Cannot find module 'openai'
```

### ✅ Estos errores desaparecerán DESPUÉS de:
```bash
npm run install:all
```

---

## 🚀 PRIMEROS PASOS - ORDEN CORRECTO

### Paso 1: Instalar Dependencias

**Opción A - Script Automático (Recomendado):**

Windows PowerShell:
```powershell
.\install.ps1
```

Linux/Mac:
```bash
chmod +x install.sh
./install.sh
```

**Opción B - Manual:**
```bash
npm run install:all
```

Este comando instalará:
- ✅ Dependencias raíz (concurrently)
- ✅ Dependencias del frontend (React, Vite, etc.)
- ✅ Dependencias del server (Express, OpenAI SDK, etc.)
- ✅ Dependencias de la API (Vercel, OpenAI SDK)

**⏱️ Tiempo estimado: 2-3 minutos**

---

### Paso 2: Configurar Variables de Entorno

1. **Copiar el template** (si no se hizo automáticamente):
```bash
cp .env.example .env
```

2. **Editar el archivo `.env`** con tus credenciales:

```env
# ⚠️ IMPORTANTE: Reemplaza estos valores con tus credenciales reales

OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ASSISTANT_ID=asst_XXXXXXXXXXXXXXXXXXXXXXXX

# Opcional - Solo para desarrollo local
PORT=3001
NODE_ENV=development
VITE_API_URL=http://localhost:3001
```

---

### Paso 3: Obtener Credenciales de OpenAI

#### 🔑 Obtener API Key

1. Ve a: https://platform.openai.com/api-keys
2. Click en "Create new secret key"
3. Copia la key (comienza con `sk-`)
4. Pégala en `.env` como `OPENAI_API_KEY`

**⚠️ IMPORTANTE:** Guarda esta key en un lugar seguro. No la compartas ni la subas a Git.

#### 🤖 Crear un Assistant

1. Ve a: https://platform.openai.com/assistants
2. Click en "Create"
3. Configura tu assistant:
   - **Nombre:** Elige un nombre descriptivo
   - **Instructions:** Define cómo debe comportarse el assistant
   - **Model:** Selecciona `gpt-4-turbo-preview` o `gpt-3.5-turbo`
   - **Tools:** (Opcional) Activa herramientas como Code Interpreter
4. Click en "Save"
5. Copia el Assistant ID (comienza con `asst_`)
6. Pégalo en `.env` como `ASSISTANT_ID`

**Ejemplo de instrucciones para el Assistant:**
```
Eres un asistente útil y amigable. Respondes preguntas de manera clara y concisa.
Siempre tratas de ayudar al usuario de la mejor manera posible.
```

---

### Paso 4: Verificar la Instalación

Después de instalar y configurar:

1. **Verificar que no haya errores de TypeScript:**
   - Recarga VSCode: `Ctrl+Shift+P` → "Reload Window"
   - Los errores de "Cannot find module" deberían desaparecer

2. **Verificar archivos creados:**
```bash
# Windows PowerShell
Get-ChildItem -Recurse -Directory node_modules | Measure-Object

# Linux/Mac
find . -name "node_modules" -type d
```

Deberías ver 3 carpetas `node_modules`:
- `./node_modules`
- `./frontend/node_modules`
- `./server/node_modules`
- `./api/node_modules`

---

### Paso 5: Ejecutar el Proyecto

```bash
npm run dev
```

**Esto iniciará:**
- 🟢 Backend en: http://localhost:3001
- 🔵 Frontend en: http://localhost:5173

**Ver en el navegador:**
Abre http://localhost:5173

---

## ✅ Checklist de Verificación

Antes de empezar, asegúrate de:

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Dependencias instaladas (`npm run install:all`)
- [ ] Archivo `.env` creado y configurado
- [ ] `OPENAI_API_KEY` válida en `.env`
- [ ] `ASSISTANT_ID` válido en `.env`
- [ ] Puertos 3001 y 5173 disponibles
- [ ] No hay errores de TypeScript en VSCode

---

## 🔴 Problemas Comunes ANTES de Instalar

### "Cannot find module..."
✅ **Normal.** Se resuelve con `npm run install:all`

### "npm: command not found"
❌ Instala Node.js desde https://nodejs.org

### "The term 'npm' is not recognized..."
❌ Reinicia tu terminal después de instalar Node.js

---

## 🔴 Problemas Comunes DESPUÉS de Instalar

### "Port 3001 is already in use"
```powershell
# Windows: Matar proceso en puerto 3001
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process

# O cambiar puerto en .env
PORT=3002
```

### "OPENAI_API_KEY is not defined"
1. Verifica que `.env` existe en la raíz
2. Verifica que la key esté en `.env`
3. Reinicia el servidor (`Ctrl+C` y `npm run dev`)

### "No assistant found with id..."
1. Verifica el Assistant ID en OpenAI
2. Asegúrate que el Assistant no esté eliminado
3. Copia el ID correcto a `.env`

---

## 📖 Siguiente Paso

Una vez que todo funcione localmente, consulta:
- [README.md](./README.md) - Documentación completa
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Más soluciones

---

## 🎯 Resumen Rápido

```bash
# 1. Instalar
npm run install:all

# 2. Configurar
cp .env.example .env
# Editar .env con tus credenciales

# 3. Ejecutar
npm run dev

# 4. Abrir navegador
# http://localhost:5173
```

**¡Eso es todo! 🚀**
