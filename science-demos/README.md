# 🔬 Science Demos - Interactive Python Web Apps

Colección de aplicaciones científicas interactivas que corren 100% en el navegador usando **Pyodide** y **JupyterLite**.

## 🎯 Objetivo

Explorar todo el ecosistema científico de Python (NumPy, SciPy, Pandas, etc.) transformado en **plataformas web interactivas embebibles** sin necesidad de backend.

## 📁 Estructura del Proyecto

```
science-demos/
├── README.md                 # Este archivo
├── _shared/                  # Componentes reutilizables
│   ├── core/                # Motor base (Pyodide loader, utils)
│   ├── templates/           # Plantillas HTML/JS
│   └── styles/              # CSS compartido
├── statistical-computing/   # Demos de estadística
├── signal-processing/       # Procesamiento de señales
├── image-processing/        # Procesamiento de imágenes
├── data-visualization/      # Visualización de datos
├── mathematical-analysis/   # Análisis matemático
├── quantum-computing/       # Computación cuántica
├── astronomy/               # Astronomía
├── bioinformatics/          # Bioinformática
├── geoscience/              # Geociencias
└── machine-learning/        # Machine Learning
```

## 🚀 Stack Tecnológico

- **Runtime Python**: Pyodide (Python en WebAssembly)
- **Notebooks**: JupyterLite (Jupyter en el navegador)
- **Visualización**: Plotly, Bokeh, Matplotlib (vía Pyodide)
- **Científico**: NumPy, SciPy, Pandas, SymPy
- **Deployment**: GitHub Pages / Netlify / Vercel

## 🎨 Demos Priorizadas

### Fase 1: Core Demos (Funcionales)

1. ✅ **Statistical Computing** - Análisis estadístico interactivo
2. 🔄 **Mathematical Analysis** - Calculadora simbólica con SymPy
3. 🔄 **Data Visualization** - Dashboard con Plotly
4. 🔄 **Signal Processing** - Análisis FFT en tiempo real
5. 🔄 **Image Processing** - Filtros de imagen con scikit-image

### Fase 2: Dominios Avanzados

6. **Quantum Computing** - Simulador de circuitos cuánticos
7. **Machine Learning** - Entrenamiento en browser
8. **Astronomy** - Visualización de datos astronómicos
9. **Bioinformatics** - Análisis de secuencias DNA
10. **Geoscience** - Mapas geográficos interactivos

## 📦 Cómo Usar

### Opción 1: Abrir Localmente

```bash
# Desde la raíz del proyecto
cd science-demos/statistical-computing
python -m http.server 8000
# O con Node.js
npx serve .
```

### Opción 2: GitHub Pages

1. Activa GitHub Pages en la configuración del repo
2. Selecciona la rama principal y carpeta `/science-demos`
3. Accede a: `https://<usuario>.github.io/<repo>/science-demos/<demo>/`

### Opción 3: Embed con iframe

```html
<iframe
  src="https://<tu-dominio>/science-demos/statistical-computing/"
  width="800"
  height="600"
  frameborder="0"
>
</iframe>
```

## 🛠️ Crear Nueva Demo

1. Copia la plantilla base:

```bash
cp -r _shared/templates/base-demo/ ./mi-nueva-demo/
```

2. Edita `index.html`:

   - Cambia el título
   - Actualiza la descripción

3. Edita `app.py`:

   - Escribe tu lógica Python
   - Define funciones expuestas a JS

4. Edita `main.js`:

   - Conecta UI con funciones Python
   - Maneja eventos del DOM

5. Prueba localmente y despliega

## 🔧 Componentes Compartidos

### `_shared/core/pyodide-loader.js`

Carga optimizada de Pyodide con cache y progreso.

### `_shared/core/python-bridge.js`

API JS ↔ Python para comunicación bidireccional.

### `_shared/templates/base-demo/`

Plantilla completa lista para usar.

### `_shared/styles/scientific.css`

Estilos profesionales para apps científicas.

## 📚 Recursos

- [Pyodide Docs](https://pyodide.org/)
- [JupyterLite](https://jupyterlite.readthedocs.io/)
- [NumPy Ecosystem](https://numpy.org/ecosystem/)
- [WebAssembly](https://webassembly.org/)

## 📄 Licencia

MIT - Ver LICENSE en la raíz del proyecto.
