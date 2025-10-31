# 🚀 INICIO RÁPIDO - JupyterLite Embed

## ✅ Lo que acabas de crear:

```
jupyterlite-embed/
├── content/
│   └── bienvenida-interactiva.ipynb    ← Notebook con 7 ejemplos interactivos
├── .github/workflows/
│   └── deploy.yml                       ← Auto-deploy a GitHub Pages
├── embed-examples.html                  ← Códigos de embed listos para copiar
├── embed-tester.html                    ← Tester interactivo de embeds
├── jupyter-lite.json                    ← Configuración JupyterLite
├── requirements.txt                     ← Dependencias
└── README.md                            ← Documentación completa
```

---

## 🎯 3 Formas de Usar Este Proyecto

### 1️⃣ PROBAR LOCALMENTE (Ahora Mismo)

Abre en tu navegador:
- `embed-tester.html` - Para probar embeds con URLs públicas
- `embed-examples.html` - Para ver todos los códigos de embed

**¡No necesitas nada más! Ya puedes ver los ejemplos.**

---

### 2️⃣ BUILD LOCAL (Opcional - Para desarrollo)

```powershell
# Instalar JupyterLite
pip install jupyterlite-core jupyterlab

# Construir tu sitio
jupyter lite build --contents content --output-dir dist

# Servir localmente
jupyter lite serve
```

Abre: `http://localhost:8000`

---

### 3️⃣ DESPLEGAR A GITHUB PAGES (Recomendado)

#### Paso 1: Crear repo en GitHub
```powershell
cd jupyterlite-embed
git init
git add .
git commit -m "Initial JupyterLite setup"
```

#### Paso 2: Subir a GitHub
```powershell
# Reemplaza con tu usuario y nombre de repo
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git branch -M main
git push -u origin main
```

#### Paso 3: Activar GitHub Pages
1. Ve a tu repo en GitHub
2. Settings → Pages
3. Source: **GitHub Actions**
4. ¡Listo! El workflow se ejecutará automáticamente

#### Paso 4: Acceder a tu sitio
En 2-5 minutos estará en:
```
https://TU-USUARIO.github.io/TU-REPO/
```

---

## 🎨 Embeber en Tu Sitio Web

### Opción A: REPL (Consola Python)
```html
<iframe 
  src="https://TU-USUARIO.github.io/TU-REPO/repl/index.html?kernel=python&toolbar=1"
  width="100%"
  height="500px"
></iframe>
```

### Opción B: Notebook Completo
```html
<iframe 
  src="https://TU-USUARIO.github.io/TU-REPO/lab/index.html?path=bienvenida-interactiva.ipynb"
  width="100%"
  height="700px"
></iframe>
```

### Opción C: JupyterLab Completo
```html
<iframe 
  src="https://TU-USUARIO.github.io/TU-REPO/lab/index.html"
  width="100%"
  height="800px"
></iframe>
```

---

## 🧪 Probar en Testers Online

### CodePen
1. Ve a https://codepen.io/pen/
2. Pega el código del iframe en la sección HTML
3. ¡Mira el resultado!

### JSFiddle
1. Ve a https://jsfiddle.net/
2. Pega en HTML
3. Click en "Run"

---

## 📝 Agregar Tus Propios Notebooks

1. Crea archivos `.ipynb` en `content/`
2. Commit y push a GitHub
3. GitHub Actions los desplegará automáticamente

**Desde VS Code:**
```powershell
# Crear nuevo notebook
code content/mi-notebook.ipynb

# Después de editarlo:
git add content/mi-notebook.ipynb
git commit -m "Add mi-notebook"
git push
```

---

## 🎯 Casos de Uso

### Para Documentación
```html
<!-- En tu README.md o docs -->
## Pruébalo en vivo
<iframe src="https://TU-URL/repl/index.html?kernel=python" width="100%" height="500px"></iframe>
```

### Para Blog Personal
```html
<!-- En tu post de blog -->
<div class="jupyter-embed">
  <iframe src="https://TU-URL/lab/index.html?path=tutorial.ipynb" 
          width="100%" height="600px"></iframe>
</div>
```

### Para Educación
```html
<!-- En plataforma educativa -->
<iframe src="https://TU-URL/notebooks/index.html?path=leccion-1.ipynb" 
        width="100%" height="700px" allowfullscreen></iframe>
```

---

## 🔧 Personalización Rápida

### Cambiar el Nombre de la App
Edita `jupyter-lite.json`:
```json
{
  "jupyter-config-data": {
    "appName": "Mi Jupyter Personalizado"
  }
}
```

### Cambiar el Tema
```json
{
  "settingsOverrides": {
    "@jupyterlab/apputils-extension:themes": {
      "theme": "JupyterLab Dark"
    }
  }
}
```

### Agregar Paquetes Python
Edita `requirements.txt`:
```
numpy
matplotlib
pandas
```

**⚠️ Solo paquetes compatibles con Pyodide:**
https://pyodide.org/en/stable/usage/packages-in-pyodide.html

---

## 📊 URLs de las Páginas

Una vez desplegado:

| Página | URL |
|--------|-----|
| **JupyterLab** | `/lab/index.html` |
| **REPL** | `/repl/index.html` |
| **Notebook Clásico** | `/notebooks/index.html` |
| **Notebook específico** | `/lab/index.html?path=NOMBRE.ipynb` |

---

## 💡 Tips Pro

1. **Cache del navegador**: Los usuarios solo descargan una vez
2. **Sin límites**: A diferencia de Binder, no hay cuotas
3. **Offline-ready**: Funciona sin internet después de cargar
4. **Mobile-friendly**: Funciona en tablets y móviles
5. **Seguro**: Todo corre en el navegador del usuario

---

## 🐛 Problemas Comunes

### El notebook no aparece
- Verifica que esté en `content/`
- Asegúrate de que sea un `.ipynb` válido
- Haz commit y push de nuevo

### GitHub Actions falla
- Ve a Actions tab en GitHub
- Revisa los logs
- Verifica que Pages esté activado

### Paquete no disponible
- Solo usa paquetes de Pyodide
- Lista completa: https://pyodide.org/en/stable/usage/packages-in-pyodide.html

---

## 📚 Recursos

- [Documentación JupyterLite](https://jupyterlite.readthedocs.io/)
- [Artículo "Jupyter Everywhere"](https://blog.jupyter.org/jupyter-everywhere-f8151c2cc6e8)
- [Paquetes Pyodide](https://pyodide.org/en/stable/usage/packages-in-pyodide.html)
- [Demo Oficial](https://jupyterlite.github.io/demo)

---

## 🎉 ¡Siguiente Paso!

1. **Abre `embed-tester.html` en tu navegador** para ver los embeds en acción
2. **Revisa `embed-examples.html`** para copiar códigos listos
3. **Sube a GitHub** para tener tu propio JupyterLite público
4. **Comparte** el link con quien quieras!

---

**¿Necesitas ayuda?** Abre un issue en el repo o revisa el README.md completo.

**¡Disfruta de Jupyter en todas partes! 🚀**
