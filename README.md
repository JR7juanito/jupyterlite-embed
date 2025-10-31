# 🚀 JupyterLite Embed - Jupyter en Cualquier Web

**Jupyter interactivo 100% en el navegador - Sin instalación, sin servidor, sin complicaciones**

![JupyterLite](https://jupyterlite.readthedocs.io/en/latest/_static/icon.svg)

## 📖 ¿Qué es esto?

Este proyecto te permite embeber un Jupyter Notebook completamente funcional en **cualquier página web** usando JupyterLite. Funciona 100% en el navegador del usuario usando WebAssembly, así que:

✅ **No necesitas servidor** - Es un sitio estático  
✅ **No necesitas instalación** - Corre directamente en el navegador  
✅ **No necesitas dispositivo potente** - Todo corre en cliente con Pyodide  
✅ **Gratis para siempre** - Despliega en GitHub Pages sin costo  

## 🎯 Casos de Uso

- 📚 **Documentación interactiva**: Deja que los usuarios prueben tu librería sin instalar nada
- 🎓 **Educación**: Enseña programación sin que los estudiantes configuren entornos
- 📊 **Demos y portfolios**: Muestra código ejecutable en tu sitio personal
- 🧪 **Experimentación**: Permite a visitantes probar código Python en tu blog

## 🚀 Inicio Rápido

### Opción 1: Desplegar en GitHub Pages (Recomendado)

1. **Haz fork de este repo** o crea uno nuevo
2. **Copia estos archivos** a tu repositorio
3. **Activa GitHub Pages**:
   - Ve a Settings → Pages
   - Source: GitHub Actions
4. **Empuja a main** - GitHub Actions construirá y desplegará automáticamente

¡Listo! Tu JupyterLite estará en `https://<tu-usuario>.github.io/<tu-repo>/`

### Opción 2: Build Local

```powershell
# Instalar dependencias
pip install -r requirements.txt

# Construir JupyterLite
jupyter lite build --contents content --output-dir dist

# Servir localmente
jupyter lite serve
```

Abre `http://localhost:8000`

## 📦 Estructura del Proyecto

```
jupyterlite-embed/
├── content/                          # Notebooks que aparecerán en JupyterLite
│   └── bienvenida-interactiva.ipynb # Notebook de demostración
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions para auto-deploy
├── jupyter-lite.json                 # Configuración de JupyterLite
├── requirements.txt                  # Dependencias Python
├── embed-examples.html               # Ejemplos de cómo embeber
├── embed-tester.html                 # Página de prueba de embeds
└── README.md                         # Este archivo
```

## 🎨 Cómo Embeber

### 1️⃣ Embeber el Notebook Completo

```html
<iframe
  src="https://<tu-usuario>.github.io/<tu-repo>/lab/index.html?path=bienvenida-interactiva.ipynb"
  width="100%"
  height="600px"
  frameborder="0"
></iframe>
```

### 2️⃣ Embeber Solo la Consola Python (REPL)

```html
<iframe
  src="https://<tu-usuario>.github.io/<tu-repo>/repl/index.html?kernel=python&toolbar=1"
  width="100%"
  height="500px"
  frameborder="0"
></iframe>
```

### 3️⃣ Embeber JupyterLab Completo

```html
<iframe
  src="https://<tu-usuario>.github.io/<tu-repo>/lab/index.html"
  width="100%"
  height="800px"
  frameborder="0"
></iframe>
```

### 4️⃣ Embeber con Notebook Específico Abierto

```html
<iframe
  src="https://<tu-usuario>.github.io/<tu-repo>/notebooks/index.html?path=bienvenida-interactiva.ipynb"
  width="100%"
  height="700px"
  frameborder="0"
></iframe>
```

## 🧪 Probar tus Embeds

1. Abre `embed-tester.html` en tu navegador
2. Verás diferentes opciones de embed simulando sitios web reales
3. Prueba la interactividad directamente

**Testers online recomendados:**
- [CodePen](https://codepen.io/) - Pega el iframe en HTML
- [JSFiddle](https://jsfiddle.net/) - Prueba rápido
- [HTML Preview](https://htmlpreview.github.io/) - Para archivos de GitHub

## 📝 Personalización

### Agregar tus propios Notebooks

1. Crea archivos `.ipynb` en la carpeta `content/`
2. Haz commit y push
3. GitHub Actions los incluirá automáticamente

### Cambiar configuración

Edita `jupyter-lite.json`:

```json
{
  "jupyter-config-data": {
    "appName": "Mi Jupyter Personalizado",
    "settingsOverrides": {
      "@jupyterlab/apputils-extension:themes": {
        "theme": "JupyterLab Dark"  // Cambiar tema
      }
    }
  }
}
```

### Agregar paquetes Python

Edita `requirements.txt` con paquetes compatibles con Pyodide:

```
numpy
matplotlib
pandas
scipy
```

**⚠️ Nota**: Solo paquetes que Pyodide soporte. Ver lista: https://pyodide.org/en/stable/usage/packages-in-pyodide.html

## 🌐 Opciones de Despliegue

| Plataforma | Dificultad | Costo | Tiempo |
|------------|-----------|-------|--------|
| **GitHub Pages** | 🟢 Fácil | Gratis | 2-5 min |
| **Vercel** | 🟢 Fácil | Gratis | 2-5 min |
| **Netlify** | 🟢 Fácil | Gratis | 2-5 min |
| **ReadTheDocs** | 🟡 Medio | Gratis | 10 min |
| **Servidor propio** | 🔴 Avanzado | Variable | 30+ min |

### Despliegue en Vercel

```powershell
# Instalar Vercel CLI
npm i -g vercel

# Build
jupyter lite build --contents content --output-dir dist

# Deploy
cd dist
vercel --prod
```

### Despliegue en Netlify

1. Conecta tu repo en Netlify
2. Build command: `pip install jupyterlite-core && jupyter lite build --contents content --output-dir dist`
3. Publish directory: `dist`

## 🛠️ Parámetros URL Útiles

Personaliza el comportamiento con parámetros URL:

- `?path=notebook.ipynb` - Abrir notebook específico
- `?kernel=python` - Seleccionar kernel automáticamente
- `?toolbar=1` - Mostrar barra de herramientas
- `?theme=JupyterLab Dark` - Cambiar tema

**Ejemplo completo:**
```
/repl/index.html?kernel=python&toolbar=1&theme=JupyterLab%20Light
```

## 🎓 Recursos Educativos

- **Notebook de demostración**: Incluye 7 ejemplos interactivos en español
- **Calculadora, gráficos, juegos**: Todo sin instalar nada
- **Perfecto para aprender**: Los estudiantes solo necesitan un navegador

## 📊 Comparación: JupyterLite vs Binder

| Característica | JupyterLite | Binder |
|---------------|-------------|--------|
| **Tiempo de carga** | 🚀 2-5 segundos | 🐌 30-120 segundos |
| **Costo operación** | 💚 $0 (estático) | 💛 Requiere recursos |
| **Disponibilidad** | ✅ 100% | ⚠️ Depende capacidad |
| **Paquetes custom** | ⚠️ Solo Pyodide | ✅ Cualquiera |
| **Persistencia** | 💾 LocalStorage | ❌ Temporal |

## 🤝 Contribuir

1. Fork este proyecto
2. Agrega tus notebooks a `content/`
3. Mejora los ejemplos
4. Abre un Pull Request

## 📄 Licencia

MIT - Usa esto como quieras, en cualquier proyecto.

## 🔗 Links Útiles

- [JupyterLite Docs](https://jupyterlite.readthedocs.io/)
- [Pyodide Packages](https://pyodide.org/en/stable/usage/packages-in-pyodide.html)
- [JupyterLab Extensions](https://jupyterlab.readthedocs.io/en/stable/user/extensions.html)
- [Artículo Original: Jupyter Everywhere](https://blog.jupyter.org/jupyter-everywhere-f8151c2cc6e8)

## 💡 Tips Pro

1. **Optimiza el tamaño**: Solo incluye notebooks necesarios
2. **Usa CDN**: Para cargar más rápido
3. **Cache navegador**: Los usuarios cargan solo una vez
4. **Mobile-friendly**: Funciona en tablets y móviles
5. **Sin límites de uso**: A diferencia de Binder, no hay cuotas

## 🐛 Troubleshooting

**"No carga el notebook"**
- Verifica que el archivo esté en `content/`
- Revisa que sea un `.ipynb` válido

**"Paquete no disponible"**
- Verifica en [Pyodide packages](https://pyodide.org/en/stable/usage/packages-in-pyodide.html)
- Algunos paquetes no están disponibles en browser

**"GitHub Actions falla"**
- Verifica que Pages esté habilitado
- Revisa los logs en Actions tab

---

**¿Preguntas?** Abre un issue o revisa la [documentación oficial](https://jupyterlite.readthedocs.io/)

**¡Hecho con ❤️ para democratizar la programación!**
