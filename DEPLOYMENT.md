# 🚀 Guía de Deployment - SmartPato AI

## Paso 1: Preparar el Proyecto

### 1.1 Instalar Vercel CLI (si no lo tienes)

```powershell
npm install -g vercel
```

### 1.2 Verificar que todo esté construido

```powershell
npm run build
```

## Paso 2: Deploy a Vercel

### 2.1 Iniciar sesión en Vercel

```powershell
vercel login
```

### 2.2 Deploy el proyecto

```powershell
vercel
```

Cuando te pregunte:

- **Set up and deploy?** → YES
- **Which scope?** → Selecciona tu cuenta
- **Link to existing project?** → NO
- **What's your project's name?** → `smartpato-ai` (o el que prefieras)
- **In which directory is your code located?** → `./` (presiona Enter)

### 2.3 Configurar Variables de Entorno

Después del primer deploy, configura las variables de entorno:

```powershell
vercel env add GROQ_API_KEY
```

Pega tu API key de Groq (obtén una gratis en https://console.groq.com)

Selecciona: **Production, Preview, Development**

```powershell
vercel env add GROQ_MODEL
```

Pega: `llama-3.3-70b-versatile`

Selecciona: **Production, Preview, Development**

### 2.4 Deploy a Producción

```powershell
vercel --prod
```

## Paso 3: Obtener la URL

Después del deployment, Vercel te dará una URL como:

```
https://smartpato-ai.vercel.app
```

## Paso 4: Crear el Embed (iframe)

Una vez deployado, usa este código HTML en cualquier sitio web:

### Opción 1: iframe Básico

```html
<iframe
  src="https://TU-URL.vercel.app"
  width="400"
  height="600"
  frameborder="0"
  style="border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
>
</iframe>
```

### Opción 2: iframe Flotante (Widget)

```html
<!-- Botón flotante -->
<button
  id="smartpato-btn"
  style="
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2d5f6e 0%, #1a3a52 100%);
  border: 3px solid rgba(94, 234, 212, 0.5);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 9999;
  font-size: 30px;
"
>
  🦆
</button>

<!-- iframe oculto -->
<div
  id="smartpato-container"
  style="
  display: none;
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 400px;
  height: 600px;
  z-index: 9999;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  border-radius: 15px;
  overflow: hidden;
"
>
  <iframe
    src="https://TU-URL.vercel.app"
    width="100%"
    height="100%"
    frameborder="0"
  >
  </iframe>
</div>

<script>
  const btn = document.getElementById("smartpato-btn");
  const container = document.getElementById("smartpato-container");

  btn.addEventListener("click", () => {
    container.style.display =
      container.style.display === "none" ? "block" : "none";
  });
</script>
```

### Opción 3: iframe Responsivo

```html
<div
  style="position: relative; padding-bottom: 150%; height: 0; max-width: 400px;"
>
  <iframe
    src="https://TU-URL.vercel.app"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 10px;"
    frameborder="0"
  >
  </iframe>
</div>
```

## Paso 5: Verificar el Deploy

1. Abre la URL de Vercel en tu navegador
2. Prueba que el chat funcione correctamente
3. Verifica que las imágenes (patin.gif, smartpato-typing.gif, bill.gif) se vean correctamente

## Troubleshooting

### Si las imágenes no aparecen:

- Asegúrate de que todos los .gif están en `frontend/public/`
- Vercel automáticamente sirve archivos de `frontend/dist/` después del build

### Si el API no responde:

- Verifica que las variables de entorno estén configuradas: `vercel env ls`
- Revisa los logs: `vercel logs TU-URL.vercel.app`

### Si quieres actualizar el deploy:

```powershell
# Hacer cambios en el código, luego:
vercel --prod
```

## Comandos Útiles

```powershell
# Ver todos tus proyectos
vercel ls

# Ver variables de entorno
vercel env ls

# Ver logs en tiempo real
vercel logs TU-URL.vercel.app --follow

# Eliminar un proyecto
vercel rm TU-PROYECTO
```

---

🎉 **¡Listo! Tu chatbot SmartPato AI está deployado y listo para embeber en cualquier sitio web!**
