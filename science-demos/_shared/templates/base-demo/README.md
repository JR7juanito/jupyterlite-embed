# 🎨 Base Demo Template

This is a ready-to-use template for creating new scientific web demos with Pyodide.

## 📦 What's Included

- `index.html` - Pre-styled UI with loading overlay
- `main.js` - Pyodide initialization and UI bridge
- `app.py` - Python backend template
- `README.md` - Documentation template

## 🚀 Quick Start

### 1. Copy Template

```bash
# From science-demos/ root
cp -r _shared/templates/base-demo/ ./my-new-demo/
cd my-new-demo/
```

### 2. Customize

**Edit `index.html`:**

- Change `<title>` and header text
- Add your UI controls (sliders, buttons, inputs)
- Create output containers

**Edit `app.py`:**

- Write your Python functions
- Import required packages
- Add calculations/algorithms

**Edit `main.js`:**

- Connect UI events to Python functions
- Handle results and update DOM
- Add visualization logic

### 3. Test Locally

```bash
python -m http.server 8000
# Open http://localhost:8000
```

### 4. Deploy

Push to GitHub and enable Pages, or deploy to Netlify/Vercel.

## 📋 Template Structure

```
base-demo/
├── index.html      # UI template with scientific styling
├── main.js         # JS boilerplate (Pyodide loader + bridge)
├── app.py          # Python template with example function
└── README.md       # Documentation template
```

## 🎯 Customization Guide

### Adding Python Packages

Edit `main.js`, modify the packages array:

```javascript
await pyodideLoader.loadPackages([
  "numpy",
  "scipy",
  "matplotlib", // Add more packages
  "pandas",
]);
```

### Calling Python from JavaScript

```javascript
// Method 1: Direct execution
const result = await pyodideLoader.runPython(`
  my_python_function(${arg1}, ${arg2})
`);

// Method 2: Using bridge
const result = await pythonBridge.callPython("my_function", arg1, arg2);
```

### Returning Complex Data

**In Python:**

```python
import json

def my_function():
    return json.dumps({
        'values': [1, 2, 3],
        'result': 42
    })
```

**In JavaScript:**

```javascript
const jsonStr = await pyodideLoader.runPython("my_function()");
const data = JSON.parse(jsonStr);
```

### Adding UI Controls

**Range Slider:**

```html
<div class="control-group">
  <label for="my-param">My Parameter: <span id="param-value">5</span></label>
  <input type="range" id="my-param" min="0" max="10" value="5" />
</div>
```

**Button:**

```html
<button class="btn" id="run-btn">🚀 Run Analysis</button>
```

**Select Dropdown:**

```html
<select id="my-select">
  <option value="opt1">Option 1</option>
  <option value="opt2">Option 2</option>
</select>
```

### Displaying Results

**Statistics/Numbers:**

```html
<div class="stat-card">
  <div class="stat-value" id="result-value">--</div>
  <div class="stat-label">Result Label</div>
</div>
```

**Code/Data:**

```html
<div class="results" id="output">
  <pre>Results appear here</pre>
</div>
```

**Images (e.g., Matplotlib):**

```javascript
// In Python
import matplotlib.pyplot as plt
import base64
import io

plt.plot([1,2,3], [1,4,9])
buf = io.BytesIO()
plt.savefig(buf, format='png')
buf.seek(0)
img_base64 = base64.b64encode(buf.read()).decode()

// In JavaScript
const img64 = await pyodideLoader.runPython('img_base64');
document.getElementById('plot').innerHTML =
  `<img src="data:image/png;base64,${img64}">`;
```

## 🎨 Styling Tips

The template uses CSS variables from `_shared/styles/scientific.css`:

```css
/* Use these in your custom styles */
var(--primary-color)    /* Blue accent */
var(--secondary-color)  /* Purple accent */
var(--accent-color)     /* Cyan accent */
var(--bg-primary)       /* Dark background */
var(--text-primary)     /* Light text */
```

## 📊 Example Demos

Look at these for inspiration:

- `statistical-computing/` - Full-featured stats demo
- `mathematical-analysis/` - Symbolic math with SymPy
- `signal-processing/` - FFT and waveforms

## 🐛 Common Issues

### Pyodide not loading

- Check console for network errors
- Ensure CDN is accessible
- Try different Pyodide version

### Package not found

- Verify package name (see [Pyodide packages](https://pyodide.org/en/stable/usage/packages-in-pyodide.html))
- Some packages may not be available in Pyodide

### Performance issues

- Reduce sample sizes
- Use NumPy vectorization
- Avoid large loops in Python

## 📚 Resources

- [Pyodide Documentation](https://pyodide.org/)
- [NumPy API Reference](https://numpy.org/doc/)
- [SciPy Reference](https://docs.scipy.org/)
- [Matplotlib Examples](https://matplotlib.org/stable/gallery/)

## 🎓 Best Practices

1. **Keep it focused**: One concept per demo
2. **Add comments**: Explain complex logic
3. **Error handling**: Use try/catch blocks
4. **Loading states**: Show progress feedback
5. **Mobile friendly**: Test on different screens
6. **Performance**: Profile with large datasets
7. **Documentation**: Update README with details

## 🔗 Next Steps

1. Customize the template for your use case
2. Test thoroughly in different browsers
3. Add to main `science-demos/README.md`
4. Deploy and share!

---

**Happy Building! 🚀**
