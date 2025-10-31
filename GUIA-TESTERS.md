# 🧪 Guía para Probar en Testers Online

## ✅ Acabas de abrir 2 páginas HTML:

1. **embed-tester.html** - Tester interactivo con URLs públicas funcionando
2. **embed-examples.html** - Todos los códigos de embed listos para copiar

---

## 🚀 PRUEBA AHORA MISMO (Sin desplegar nada)

### Opción 1: Usar embed-tester.html

La página que acabas de abrir ya funciona con URLs públicas de JupyterLite:

✅ **Demo Oficial**: https://jupyterlite.github.io/demo
✅ **Try Jupyter**: https://jupyter.org/try-jupyter
✅ **REPLite**: https://replite.vercel.app

**¿Cómo usarlo?**

1. Selecciona un tipo de embed (REPL, Notebook, Lab)
2. Elige una de las URLs públicas (están preconfiguradas)
3. Haz clic en "Cargar Preview"
4. ¡Ve el resultado en vivo!
5. Copia el código generado

---

## 🎨 PROBAR EN CODEPEN (Súper fácil)

### Paso 1: Abre CodePen
Ir a: https://codepen.io/pen/

### Paso 2: Copia este código en la sección HTML

```html
<!-- OPCIÓN A: REPL - Consola Python -->
<iframe 
  src="https://jupyterlite.github.io/demo/repl/index.html?kernel=python&toolbar=1"
  width="100%"
  height="500px"
  frameborder="0"
  allowfullscreen
></iframe>

<!-- OPCIÓN B: Notebook Completo -->
<!-- Descomenta para probar:
<iframe 
  src="https://jupyterlite.github.io/demo/lab/index.html"
  width="100%"
  height="700px"
  frameborder="0"
></iframe>
-->
```

### Paso 3: ¡Mira el resultado!

En la ventana de preview verás JupyterLite funcionando.

---

## 🎯 PROBAR EN JSFIDDLE

### Ir a: https://jsfiddle.net/

**En la sección HTML, pega:**

```html
<h2>🚀 JupyterLite en JSFiddle</h2>

<iframe 
  src="https://replite.vercel.app/repl?kernel=python&toolbar=1"
  width="100%"
  height="600px"
  style="border: 2px solid #667eea; border-radius: 8px;"
></iframe>
```

**Luego haz clic en "Run"** ▶️

---

## 🌐 PROBAR EN GLITCH

### Ir a: https://glitch.com/

1. Crea un nuevo proyecto HTML/CSS/JS
2. En `index.html`, reemplaza todo con:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>JupyterLite Demo</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    h1 {
      color: white;
      text-align: center;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 JupyterLite Embebido</h1>
    
    <iframe 
      src="https://jupyterlite.github.io/demo/repl/index.html?kernel=python&toolbar=1"
      width="100%"
      height="600px"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </div>
</body>
</html>
```

3. Haz clic en "Show" para ver tu página

---

## 📱 PROBAR EN BLOGGER/WORDPRESS

### Para Blogger:

1. Crea un nuevo post
2. Cambia a vista HTML (no visual)
3. Pega el código del iframe
4. Publica

### Para WordPress:

1. Crea un nuevo post/página
2. Añade un bloque "HTML personalizado"
3. Pega el código del iframe
4. Vista previa/Publicar

---

## 🎬 URLs PÚBLICAS LISTAS PARA USAR

Puedes usar estas URLs inmediatamente sin desplegar nada:

### 1. Demo Oficial de JupyterLite
```
https://jupyterlite.github.io/demo/repl/index.html?kernel=python&toolbar=1
```

### 2. Try Jupyter
```
https://jupyter.org/try-jupyter/lab
```

### 3. REPLite (Optimizado)
```
https://replite.vercel.app/repl?kernel=python&toolbar=1
```

### 4. NumPy Interactive
```
https://numpy.org/doc/stable/user/basics.html
```
(Scroll hacia abajo para ver el embed)

---

## 🔥 EJEMPLO COMPLETO PARA COPIAR

Este código funciona inmediatamente en cualquier HTML:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Python Interactivo en tu Navegador</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        
        h1 {
            color: #333;
            text-align: center;
        }
        
        .jupyter-container {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        iframe {
            border: 2px solid #667eea;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <h1>🐍 Aprende Python - ¡Pruébalo Ahora!</h1>
    
    <div class="jupyter-container">
        <p>
            Escribe código Python directamente en la consola de abajo. 
            No necesitas instalar nada, funciona 100% en tu navegador.
        </p>
        
        <iframe 
            src="https://jupyterlite.github.io/demo/repl/index.html?kernel=python&toolbar=1"
            width="100%"
            height="600px"
            frameborder="0"
            allowfullscreen
        ></iframe>
        
        <p style="margin-top: 20px; color: #666;">
            💡 Prueba escribir: <code>print("¡Hola, mundo!")</code> y presiona Shift+Enter
        </p>
    </div>
</body>
</html>
```

**Guarda esto como `test.html` y ábrelo en tu navegador** - ¡Funcionará inmediatamente!

---

## 📊 Comparación de Testers

| Plataforma | Facilidad | Velocidad | Compartir | Mejor para |
|------------|-----------|-----------|-----------|------------|
| **CodePen** | ⭐⭐⭐⭐⭐ | Rápido | ✅ Fácil | Pruebas rápidas |
| **JSFiddle** | ⭐⭐⭐⭐⭐ | Rápido | ✅ Fácil | Compartir código |
| **Glitch** | ⭐⭐⭐⭐ | Medio | ✅ Muy fácil | Proyectos completos |
| **HTML Local** | ⭐⭐⭐⭐⭐ | Instantáneo | ❌ No | Desarrollo local |

---

## 🎯 SIGUIENTE PASO: Desplegar Tu Versión

Una vez que hayas probado con las URLs públicas, puedes:

1. **Subir a GitHub** (ver README.md)
2. **Desplegar a GitHub Pages** (automático con GitHub Actions)
3. **Usar tu propia URL** en los embeds
4. **Personalizar notebooks** con tu contenido

---

## 💡 Tips Pro

### Personalizar el Tamaño
```html
<!-- Más pequeño -->
<iframe src="..." width="100%" height="400px"></iframe>

<!-- Más grande -->
<iframe src="..." width="100%" height="800px"></iframe>

<!-- Pantalla completa -->
<iframe src="..." width="100%" height="100vh"></iframe>
```

### Responsive (Se adapta al móvil)
```html
<div style="position: relative; padding-bottom: 56.25%; height: 0;">
  <iframe 
    src="..." 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
  ></iframe>
</div>
```

### Con Tema Oscuro
```html
<iframe 
  src="https://jupyterlite.github.io/demo/repl/index.html?kernel=python&toolbar=1&theme=JupyterLab%20Dark"
></iframe>
```

---

## ❓ FAQ

**P: ¿Funciona en móviles?**
R: Sí! JupyterLite es responsive y funciona en tablets y móviles.

**P: ¿Necesito pagar algo?**
R: No. Tanto JupyterLite como GitHub Pages son 100% gratis.

**P: ¿Mis usuarios necesitan instalar algo?**
R: No. Todo corre en el navegador con WebAssembly.

**P: ¿Qué navegadores soporta?**
R: Chrome, Firefox, Edge, Safari (modernos). No IE11.

**P: ¿Hay límites de uso?**
R: No en GitHub Pages (hasta 100GB bandwidth/mes, más que suficiente).

**P: ¿Puedo usarlo comercialmente?**
R: Sí. JupyterLite es open source (BSD License).

---

## 🎉 ¡Empieza Ahora!

1. ✅ Abre embed-tester.html (ya lo hiciste)
2. ✅ Prueba diferentes opciones de embed
3. ✅ Copia el código que te guste
4. ✅ Pégalo en CodePen o tu sitio
5. ✅ ¡Comparte Python interactivo con el mundo!

---

**¿Necesitas ayuda?** Revisa el README.md completo o abre un issue en GitHub.

**¡Que disfrutes tu Jupyter en todas partes! 🚀**
