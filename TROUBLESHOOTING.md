# 🔧 Guía de Solución de Problemas

## 📋 Tabla de Contenidos
- [Problemas de Instalación](#problemas-de-instalación)
- [Problemas de Desarrollo](#problemas-de-desarrollo)
- [Problemas de API](#problemas-de-api)
- [Problemas de Deployment](#problemas-de-deployment)
- [Problemas de Iframe](#problemas-de-iframe)

---

## Problemas de Instalación

### ❌ Error: "npm install" falla

**Síntomas:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Solución:**
1. Verifica que Node.js esté instalado: `node --version`
2. Actualiza npm: `npm install -g npm@latest`
3. Limpia caché: `npm cache clean --force`
4. Intenta de nuevo: `npm run install:all`

### ❌ Error: "concurrently: command not found"

**Solución:**
```bash
# Instala concurrently globalmente
npm install -g concurrently

# O instala solo en el proyecto
npm install
```

---

## Problemas de Desarrollo

### ❌ El frontend no se conecta al backend

**Síntomas:**
- Error de CORS
- "Failed to fetch"
- Network error

**Solución:**
1. Verifica que el backend esté corriendo en puerto 3001
2. Verifica el proxy en `frontend/vite.config.ts`:
   ```typescript
   proxy: {
     '/api': {
       target: 'http://localhost:3001',
       changeOrigin: true,
     }
   }
   ```
3. Reinicia ambos servidores: `npm run dev`

### ❌ "Cannot find module 'react'" u otros módulos

**Solución:**
```bash
# Reinstalar dependencias del frontend
cd frontend
rm -rf node_modules
npm install
```

### ❌ TypeScript errors en VSCode

**Solución:**
1. Instala las extensiones recomendadas (ver `.vscode/extensions.json`)
2. Recarga VSCode: `Ctrl+Shift+P` → "Reload Window"
3. Verifica que TypeScript esté usando la versión del workspace

---

## Problemas de API

### ❌ Error 401: "Invalid API Key"

**Síntomas:**
```json
{
  "error": "Incorrect API key provided"
}
```

**Solución:**
1. Verifica que `OPENAI_API_KEY` esté en tu archivo `.env`
2. Verifica que la key sea válida en [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. Asegúrate de que la key comience con `sk-`
4. Reinicia el servidor después de cambiar el `.env`

### ❌ Error 404: "Assistant not found"

**Síntomas:**
```json
{
  "error": "No assistant found with id 'asst_...'"
}
```

**Solución:**
1. Verifica que `ASSISTANT_ID` esté en tu archivo `.env`
2. Verifica que el Assistant exista en [platform.openai.com/assistants](https://platform.openai.com/assistants)
3. Copia el ID correcto (debe comenzar con `asst_`)
4. Reinicia el servidor

### ❌ Error 429: "Rate limit exceeded"

**Síntomas:**
```json
{
  "error": "Rate limit reached for requests"
}
```

**Solución:**
1. Espera un momento antes de volver a intentar
2. Verifica tu plan en OpenAI (puede necesitar upgrade)
3. Implementa rate limiting en el frontend si haces muchas requests

### ❌ Timeout esperando respuesta del assistant

**Síntomas:**
```json
{
  "error": "Timeout esperando la respuesta del assistant"
}
```

**Solución:**
1. Verifica tu conexión a internet
2. El assistant puede estar procesando algo complejo
3. Aumenta el timeout en `server/src/index.ts` o `api/chat.ts`:
   ```typescript
   const maxAttempts = 60; // Aumentar de 30 a 60
   ```

---

## Problemas de Deployment

### ❌ Build falla en Vercel

**Síntomas:**
```
Error: Build failed
```

**Solución:**
1. Verifica que todas las dependencias estén en `package.json`
2. Verifica que no haya errores de TypeScript: `npm run build`
3. Revisa los logs de Vercel para detalles específicos
4. Asegúrate de que `vercel.json` esté correctamente configurado

### ❌ Variables de entorno no funcionan en Vercel

**Síntomas:**
- "OPENAI_API_KEY is not defined"
- "ASSISTANT_ID is not defined"

**Solución:**
1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Agrega cada variable para todos los entornos (Production, Preview, Development)
3. Redeploy el proyecto
4. Verifica con el endpoint de health: `/api/health`

### ❌ Functions timeout en Vercel

**Síntomas:**
```
Function Execution Timeout
```

**Solución:**
1. Verifica tu plan de Vercel (Hobby plan tiene límite de 10s)
2. Optimiza el código para responder más rápido
3. Considera upgrade a plan Pro (60s timeout)

---

## Problemas de Iframe

### ❌ El iframe no se muestra

**Síntomas:**
- Espacio en blanco
- "This page can't be displayed"

**Solución:**
1. Verifica que la URL del iframe sea correcta
2. Abre la URL directamente en el navegador
3. Verifica que no haya errores en la consola del navegador
4. Asegúrate de que el dominio esté accesible

### ❌ El iframe está bloqueado por CORS

**Síntomas:**
```
Blocked by CORS policy
```

**Solución:**
1. Los iframes generalmente no tienen problemas de CORS
2. Si usas cookies, asegúrate de configurar `SameSite` correctamente
3. Verifica las políticas CSP del sitio padre

### ❌ El iframe no responde a clics

**Síntomas:**
- El chat no responde
- No se puede escribir en el input

**Solución:**
1. Verifica que el iframe no esté cubierto por otro elemento
2. Revisa el z-index del iframe
3. Asegúrate de que el iframe tenga el tamaño correcto

### ❌ El iframe se ve cortado o mal dimensionado

**Solución:**
```html
<iframe
  src="https://tu-dominio.vercel.app"
  width="400"
  height="600"
  style="border:0; min-height: 500px; max-height: 100vh;"
></iframe>
```

---

## 🆘 Problemas Comunes Adicionales

### ❌ "Port 3001 already in use"

**Solución:**
```powershell
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process

# O cambiar el puerto en .env
PORT=3002
```

### ❌ El chat se ve diferente en producción vs desarrollo

**Solución:**
1. Verifica que todos los archivos CSS estén incluidos en el build
2. Limpia caché del navegador
3. Verifica que las fuentes y assets se carguen correctamente

### ❌ Los mensajes no se muestran correctamente

**Solución:**
1. Abre DevTools (F12) y busca errores en Console
2. Verifica que el formato de los mensajes sea correcto
3. Asegúrate de que el CSS esté cargando

---

## 📞 ¿Todavía tienes problemas?

Si ninguna de estas soluciones funciona:

1. **Revisa los logs:**
   - Frontend: Consola del navegador (F12)
   - Backend: Terminal donde corre el servidor
   - Vercel: Dashboard → Functions → Logs

2. **Verifica la documentación:**
   - [README.md](./README.md)
   - [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

3. **Crea un issue:**
   - Incluye descripción detallada
   - Pasos para reproducir
   - Logs y screenshots
   - Versiones de Node.js y npm

4. **Recursos útiles:**
   - [OpenAI API Status](https://status.openai.com/)
   - [Vercel Status](https://www.vercel-status.com/)
   - [OpenAI Community Forum](https://community.openai.com/)

---

## 🔍 Comandos de Diagnóstico

```bash
# Verificar versiones
node --version
npm --version

# Verificar instalación
npm list --depth=0

# Verificar configuración
cat .env  # Linux/Mac
type .env  # Windows

# Verificar puertos en uso (Windows)
netstat -ano | findstr :3001
netstat -ano | findstr :5173

# Limpiar todo y reinstalar
rm -rf node_modules frontend/node_modules server/node_modules api/node_modules
rm -rf dist frontend/dist server/dist
npm run install:all

# Rebuild
npm run build
```
