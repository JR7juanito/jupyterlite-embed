# JupyterLite - Algoritmos

[![lite-badge](https://jupyterlite.rtfd.io/en/latest/_static/badge.svg)](https://JR7juanito.github.io/jupyterlite-embed/)

Este proyecto contiene notebooks interactivos de algoritmos y estructuras de datos desplegados con JupyterLite.

## 🚀 Acceso rápido

Puedes acceder a los notebooks directamente en tu navegador sin instalar nada:

**[Abrir JupyterLite](https://JR7juanito.github.io/jupyterlite-embed/)**

## 📚 Notebooks disponibles

- **01_Introduccion.ipynb**: Conceptos básicos de programación en Python

## 🎯 Cómo embeber en tu sitio web

Puedes embeber cualquier notebook usando un iframe:

```html
<iframe 
  src="https://JR7juanito.github.io/jupyterlite-embed/lab/index.html?path=01_Introduccion.ipynb"
  width="100%" 
  height="600px"
  frameborder="0">
</iframe>
```

### Opciones de URL

- **Vista Lab**: `/lab/index.html?path=NOTEBOOK.ipynb`
- **Vista Notebook clásica**: `/notebooks/index.html?path=NOTEBOOK.ipynb`
- **Vista Repl**: `/repl/index.html`

## 🛠️ Desarrollo local

Si quieres probar localmente:

```bash
# Instalar JupyterLite
pip install jupyterlite-core jupyterlite-pyodide-kernel

# Construir el sitio
jupyter lite build --contents content --output-dir _output

# Servir localmente
jupyter lite serve --output-dir _output
```

## 📦 Estructura del proyecto

```
jupyterlite-project/
├── content/              # Notebooks y archivos de contenido
│   └── 01_Introduccion.ipynb
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions para auto-deploy
├── jupyter-lite.json     # Configuración de JupyterLite
├── requirements.txt      # Dependencias Python
└── README.md
```

## 🔄 Actualización automática

Cada vez que hagas push a la rama principal, GitHub Actions:
1. Construye el sitio JupyterLite
2. Lo despliega automáticamente en GitHub Pages

## 📝 Licencia

Este proyecto es de uso educativo.
