# 📊 Statistical Computing Demo

Interactive statistical analysis running 100% in the browser using **Pyodide**, **NumPy**, and **SciPy**.

## 🎯 Features

- **Generate Random Distributions**: Normal, Uniform, Exponential, Poisson
- **Real-time Statistics**: Mean, Std Dev, Median, Variance, Skewness, Kurtosis
- **Interactive Histogram**: Visualize distribution shape
- **Sample Data Preview**: Inspect generated values
- **No Backend Required**: Everything runs in WebAssembly

## 🚀 Quick Start

### Option 1: Local Testing

```bash
# Navigate to this directory
cd science-demos/statistical-computing

# Start a simple HTTP server
python -m http.server 8000
# Or with Node.js
npx serve .

# Open in browser
open http://localhost:8000
```

### Option 2: GitHub Pages

This demo is designed to work directly on GitHub Pages:

```
https://<your-username>.github.io/<repo>/science-demos/statistical-computing/
```

### Option 3: Embed with iframe

```html
<iframe
  src="https://your-domain.com/science-demos/statistical-computing/"
  width="100%"
  height="800px"
  frameborder="0"
  title="Statistical Computing Demo"
>
</iframe>
```

## 📚 How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│          Browser (Client)               │
├─────────────────────────────────────────┤
│  index.html  →  User Interface          │
│  main.js     →  Event Handlers          │
│  app.py      →  Python Logic            │
├─────────────────────────────────────────┤
│  Pyodide (WebAssembly)                  │
│  ├── NumPy    (numerical computing)     │
│  ├── SciPy    (scientific computing)    │
│  └── Python   (3.11 runtime)            │
└─────────────────────────────────────────┘
```

### File Structure

```
statistical-computing/
├── index.html       # UI and layout
├── main.js          # JavaScript logic (UI ↔ Python bridge)
├── app.py           # Python statistical functions
└── README.md        # This file
```

### Key Components

**1. Pyodide Loader** (`_shared/core/pyodide-loader.js`)

- Downloads and initializes Python runtime
- Loads NumPy and SciPy packages
- Provides progress feedback

**2. Python Bridge** (`_shared/core/python-bridge.js`)

- Enables calling Python functions from JavaScript
- Converts data types between JS and Python
- Handles async operations

**3. Statistical Engine** (`app.py`)

- `generate_distribution()`: Creates random samples
- Statistical calculations using NumPy/SciPy
- Histogram generation

**4. UI Controller** (`main.js`)

- Captures user input
- Calls Python functions
- Updates DOM with results

## 🔧 Customization

### Add New Distributions

Edit `app.py`:

```python
def generate_distribution(dist_type, size, param1, param2):
    # Add your distribution
    if dist_type == 'beta':
        data = np.random.beta(param1, param2, size)
    # ...
```

Edit `index.html`:

```html
<select id="distribution">
  <option value="beta">Beta Distribution</option>
  <!-- ... -->
</select>
```

### Add New Statistics

Edit `app.py`:

```python
statistics = {
    'mean': float(np.mean(data)),
    # Add your statistic
    'range': float(np.ptp(data)),  # Peak-to-peak
}
```

Edit `index.html` and `main.js` to display it.

## 📊 Available Distributions

### Normal (Gaussian)

- **Param 1**: Mean (μ)
- **Param 2**: Standard Deviation (σ)
- **Use**: Most common natural phenomena

### Uniform

- **Param 1**: Lower bound
- **Param 2**: Upper bound
- **Use**: Random number generation, equal probability

### Exponential

- **Param 1**: Scale (λ⁻¹)
- **Param 2**: Not used
- **Use**: Time between events, decay processes

### Poisson

- **Param 1**: Rate (λ)
- **Param 2**: Not used
- **Use**: Count data, rare events

## 🎓 Educational Use

This demo is perfect for:

- **Statistics courses**: Visualize theoretical concepts
- **Data science training**: Explore distributions interactively
- **Self-learning**: Experiment with parameters
- **Research presentations**: Embed in slides or websites

## 🔬 Technical Details

### Dependencies

All packages load automatically from CDN:

- **Pyodide**: 0.26.4
- **NumPy**: Latest compatible version
- **SciPy**: Latest compatible version

### Performance

- Initial load: ~5-10 seconds (downloads Pyodide + packages)
- Subsequent runs: Instant (cached)
- Sample generation: <100ms for 10,000 samples

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Limitations

- **Large datasets**: Keep samples < 100,000 for smooth performance
- **Package size**: NumPy + SciPy = ~30 MB initial download
- **No persistence**: Data clears on page reload

## 🐛 Troubleshooting

### "Python environment not ready"

Wait for Pyodide to fully load (progress bar at top).

### Slow initial load

Normal on first visit. Pyodide caches after first download.

### Console errors

Check browser console (F12) for detailed error messages.

## 📝 License

MIT - See main project LICENSE

## 🤝 Contributing

Ideas for improvements:

- Add more distributions (Chi-square, F, t, etc.)
- Hypothesis testing tools
- Correlation analysis
- Time series analysis
- Export results to CSV

## 🔗 Related Demos

- **Mathematical Analysis**: Symbolic math with SymPy
- **Data Visualization**: Advanced Plotly dashboards
- **Signal Processing**: FFT and filtering
- **Machine Learning**: Scikit-learn in browser

---

**Built with ❤️ using Pyodide and WebAssembly**
