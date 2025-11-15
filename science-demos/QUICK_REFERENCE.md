# ⚡ Quick Reference Commands

Comandos rápidos para trabajar con Science Demos.

---

## 🧪 Testing Local

### Servidor Python

```powershell
cd science-demos\statistical-computing
python -m http.server 8080
# Abrir: http://localhost:8080
```

### Servidor Node.js

```powershell
npx serve science-demos\statistical-computing
```

### Servidor PHP

```powershell
php -S localhost:8080 -t science-demos\statistical-computing
```

---

## 🎨 Crear Nuevo Demo

### Copiar Plantilla

```powershell
# PowerShell
Copy-Item -Recurse science-demos\_shared\templates\base-demo\ science-demos\mi-demo\

# Bash/Linux
cp -r science-demos/_shared/templates/base-demo/ science-demos/mi-demo/
```

### Estructura Mínima

```
mi-demo/
├── index.html    # UI
├── main.js       # JavaScript
├── app.py        # Python
└── README.md     # Docs
```

---

## 🚀 Deployment

### GitHub Pages

```powershell
git add science-demos\
git commit -m "Add science demos"
git push origin main
# Settings → Pages → Source: main branch
```

### Vercel

```powershell
cd science-demos
vercel
# Production:
vercel --prod
```

### Netlify

```powershell
cd science-demos
netlify deploy
# Production:
netlify deploy --prod
```

---

## 🔍 Testing

### Test in Browser

```powershell
# Start server
python -m http.server 8080

# Open in default browser
start http://localhost:8080
```

### Check Console

```
F12 → Console tab
Buscar errores en rojo
```

### Test iframe

```html
<iframe src="http://localhost:8080" width="800" height="600"></iframe>
```

---

## 📦 Package Management

### Check Pyodide Packages

```javascript
// En consola del navegador
await pyodide.loadPackage("micropip");
const micropip = pyodide.pyimport("micropip");
await micropip.list();
```

### Install PyPI Package

```javascript
await pyodide.loadPackage("micropip");
const micropip = pyodide.pyimport("micropip");
await micropip.install("matplotlib");
```

---

## 🐛 Debugging

### Browser Console Commands

```javascript
// Acceder al loader
window.app.pyodideLoader;

// Ejecutar Python directo
await window.app.pyodideLoader.runPython('print("Hello")');

// Ver namespace de Python
window.app.pyodideLoader.getNamespace();

// Ejecutar función del demo
window.app.runAnalysis();
```

### Check Errors

```javascript
// En consola
console.log("Pyodide ready:", window.app.pyodideLoader !== null);
```

---

## 📝 Common Edits

### Change Pyodide Version

**File**: `_shared/core/pyodide-loader.js`

```javascript
this.version = options.version || "0.26.4"; // Change here
```

### Add Python Packages

**File**: `main.js` en cada demo

```javascript
await pyodideLoader.loadPackages(["numpy", "scipy", "matplotlib"]);
```

### Update Theme Colors

**File**: `_shared/styles/scientific.css`

```css
:root {
  --primary-color: #2563eb; /* Change colors */
  --secondary-color: #7c3aed;
}
```

---

## 🔗 URLs

### Local

```
http://localhost:8080
```

### GitHub Pages

```
https://<username>.github.io/<repo>/science-demos/statistical-computing/
```

### Vercel

```
https://<project>.vercel.app/statistical-computing/
```

### Netlify

```
https://<site-name>.netlify.app/statistical-computing/
```

---

## 📊 File Sizes

### Core Files

- `pyodide-loader.js`: ~3 KB
- `python-bridge.js`: ~4 KB
- `scientific.css`: ~7 KB

### Pyodide Runtime

- Base runtime: ~5 MB
- NumPy: ~15 MB
- SciPy: ~10 MB
- **Total**: ~30 MB (cached después de primera carga)

---

## 🎯 Common Tasks

### Test All Demos

```powershell
cd science-demos
python -m http.server 8080
# Navegar manualmente a cada subdirectorio
```

### Build New Demo in 5 Steps

```powershell
# 1. Copiar template
Copy-Item -Recurse _shared\templates\base-demo\ mi-demo\

# 2. Editar HTML
code mi-demo\index.html

# 3. Editar Python
code mi-demo\app.py

# 4. Editar JS
code mi-demo\main.js

# 5. Probar
cd mi-demo
python -m http.server 8080
```

### Deploy Pipeline

```powershell
# 1. Test local
python -m http.server 8080

# 2. Commit
git add science-demos\
git commit -m "Add new demo"

# 3. Push
git push origin main

# 4. Deploy auto (si configurado)
# O manualmente:
vercel --prod
```

---

## 🛠️ Development Workflow

### Daily Workflow

```powershell
# 1. Start server
cd science-demos\<demo-name>
python -m http.server 8080

# 2. Edit files in VS Code
code .

# 3. Refresh browser to see changes
# (No build step needed!)

# 4. Commit when ready
git add .
git commit -m "Update demo"
git push
```

### Adding Features

```powershell
# 1. Edit app.py (Python logic)
# 2. Edit main.js (JS integration)
# 3. Edit index.html (UI)
# 4. Test in browser
# 5. Update README.md
```

---

## 📚 Documentation Locations

- **Main README**: `science-demos/README.md`
- **Roadmap**: `science-demos/ROADMAP.md`
- **Deployment**: `science-demos/DEPLOYMENT.md`
- **Structure**: `science-demos/STRUCTURE.md`
- **This File**: `science-demos/QUICK_REFERENCE.md`
- **Template Guide**: `_shared/templates/base-demo/README.md`
- **Demo READMEs**: `<demo-name>/README.md`

---

## 🔐 Security Headers (for deployment)

### Vercel (`vercel.json`)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" }
      ]
    }
  ]
}
```

### Netlify (`netlify.toml`)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Embedder-Policy = "require-corp"
    Cross-Origin-Opener-Policy = "same-origin"
```

---

## 🎨 iframe Embedding

### Basic

```html
<iframe
  src="https://your-url.com/science-demos/statistical-computing/"
  width="800"
  height="600"
  frameborder="0"
></iframe>
```

### Responsive

```html
<div style="position: relative; padding-bottom: 75%; height: 0;">
  <iframe
    src="https://your-url.com/science-demos/statistical-computing/"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
  ></iframe>
</div>
```

### Widget (floating)

```html
<iframe
  src="https://your-url.com/science-demos/statistical-computing/"
  style="position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border: none; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); z-index: 9999;"
></iframe>
```

---

## 💻 VS Code Integration

### Recommended Extensions

```
Live Server (ritwickdey.LiveServer)
Python (ms-python.python)
Prettier (esbenp.prettier-vscode)
```

### Open in Browser

```
Right-click index.html → Open with Live Server
```

---

## 📊 Performance Monitoring

### Browser DevTools

```
F12 → Performance tab → Record
Run demo
Stop recording
Analyze
```

### Network Tab

```
F12 → Network tab
Reload page
Check Pyodide download time
Check cache hits (304 status)
```

---

**Quick commands at your fingertips! 🚀**
