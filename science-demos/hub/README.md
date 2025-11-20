# 🌌 Interactive Scientist Hub - Cyberpunk Edition

> Transform statistical computing into an immersive cyberpunk experience. Generate distributions, analyze data, and visualize patterns - all powered by Python in your browser.

![Cyberpunk Theme](https://img.shields.io/badge/theme-cyberpunk-ff006e?style=for-the-badge)
![Python](https://img.shields.io/badge/python-3.11-00f5ff?style=for-the-badge&logo=python)
![Pyodide](https://img.shields.io/badge/pyodide-0.26.4-8b00ff?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-39ff14?style=for-the-badge)

## ✨ Features

### 🎨 Cyberpunk Design
- **Neon color palette** with pink, cyan, purple, and green accents
- **Animated grid background** with Matrix-style effects
- **50+ floating particles** creating ambient atmosphere
- **Glowing UI elements** with smooth hover effects
- **Responsive layout** adapting to any screen size

### 📊 Statistical Computing Lab
- **4 Probability Distributions**:
  - 🔔 Normal (Gaussian) - Bell curves and natural phenomena
  - 📏 Uniform - Equal probability distributions
  - 📉 Exponential - Decay and waiting times
  - 🎲 Poisson - Event counting and rare occurrences

- **6 Real-time Statistics**:
  - Mean (μ), Standard Deviation (σ), Median (M)
  - Variance (σ²), Skewness (γ₁), Kurtosis (γ₂)

- **Interactive Histogram**:
  - 30 animated bars with gradient colors (purple → cyan)
  - Hover effects with glow and elevation
  - Real-time rendering with smooth animations

### 💡 Educational Features
- **Dynamic info panels** explaining each distribution with real-world examples
- **Automated insights** analyzing shape, spread, and patterns
- **Parameter tooltips** guiding users through configuration
- **Non-intrusive hints** embedded in the interface
- **Distribution-specific tips** (e.g., 68% rule for normal distribution)

### 🚀 Technology Stack
- **Frontend**: Pure HTML5 + CSS3 + Vanilla JavaScript (no frameworks!)
- **Python Runtime**: Pyodide 0.26.4 (Python 3.11 compiled to WebAssembly)
- **Scientific Libraries**: NumPy, SciPy (running entirely in browser)
- **Fonts**: Google Fonts - Orbitron (display), Rajdhani (body)
- **CDN**: JSDelivr for Pyodide distribution

## 🎮 Live Demo

👉 **[Launch Interactive Scientist Hub](https://yourusername.github.io/jupyTerminator/science-demos/hub/)**

## 🖼️ Screenshots

### Main Interface
![Statistical Computing Lab](./docs/screenshot-main.png)

### Histogram Visualization
![Cyberpunk Histogram](./docs/screenshot-histogram.png)

### Educational Insights
![Analysis Insights](./docs/screenshot-insights.png)

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)
1. Fork this repository
2. Go to Settings → Pages
3. Select `main` branch → `/science-demos/hub/` folder
4. Click Save
5. Visit `https://yourusername.github.io/jupyTerminator/science-demos/hub/`

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/jupyTerminator.git

# Navigate to hub directory
cd jupyTerminator/science-demos/hub

# Start local server (Python 3)
python -m http.server 8080

# Open browser
# http://localhost:8080
```

### Option 3: Static Hosting
Upload the `science-demos/hub/` folder to:
- **Vercel**: Drag & drop the folder
- **Netlify**: Deploy from Git or drag & drop
- **Cloudflare Pages**: Connect your repo

## 📖 Usage Guide

### Generating Distributions

1. **Select Distribution Type**:
   - Choose from Normal, Uniform, Exponential, or Poisson
   - Read the educational panel explaining the distribution

2. **Configure Parameters**:
   - **Sample Size**: 100 - 10,000 samples (more = smoother histogram)
   - **Parameter 1**: Distribution-specific (mean, lower bound, scale, rate)
   - **Parameter 2**: Distribution-specific (std dev, upper bound, unused)

3. **Generate & Analyze**:
   - Click "⚡ GENERATE & ANALYZE" button
   - Watch animated statistics cards update
   - View histogram with gradient bars
   - Read automated insights panel

4. **Experiment**:
   - Try "🎲 Randomize" for random parameters
   - Compare different distributions
   - Observe how parameters affect shape

### Understanding Results

**Statistics Cards**:
- Hover over cards to see progress bars animate
- Compare mean vs median to detect skewness
- Check standard deviation for data spread

**Insights Panel** (appears above histogram):
- **Shape**: Symmetric, right-skewed, or left-skewed
- **Spread**: Low, moderate, or high variability
- **Key Insight**: Distribution-specific interpretation

**Histogram**:
- Hover over bars for exact ranges and counts
- Colors transition from purple (left) to cyan (right)
- Height represents frequency of values in that range

## 🎓 Educational Content

### What You'll Learn

**Probability Distributions**:
- How different distributions model real-world phenomena
- When to use each distribution type
- Parameter meanings and effects

**Statistical Concepts**:
- Central tendency (mean, median)
- Variability (std dev, variance)
- Distribution shape (skewness, kurtosis)
- Relationship between statistics

**Data Visualization**:
- How histograms represent data
- Color gradients for visual appeal
- Interactive data exploration

## 🛠️ Project Structure

```
science-demos/hub/
├── index.html          # Main HTML structure
├── hub.css             # Cyberpunk styling (1000+ lines)
├── hub.js              # JavaScript logic & Pyodide integration
└── app.py              # Python statistical functions
```

## 🎨 Customization

### Color Scheme
Edit CSS variables in `hub.css`:
```css
:root {
  --cyber-pink: #ff006e;    /* Primary accent */
  --cyber-blue: #00f5ff;    /* Secondary accent */
  --cyber-purple: #8b00ff;  /* Tertiary accent */
  --cyber-yellow: #ffbe0b;  /* Warning/highlight */
  --cyber-green: #39ff14;   /* Success/active */
}
```

### Distributions
Add new distributions in `app.py`:
```python
def generate_distribution(dist_type, size, param1, param2):
    if dist_type == 'your_distribution':
        data = your_generation_function(param1, param2, size)
    # ... rest of code
```

### Insights
Customize educational content in `hub.js`:
```javascript
function updateDistributionInfo(distribution) {
  const info = {
    your_distribution: {
      title: "Your Distribution Name",
      description: "Explanation with examples..."
    }
  };
}
```

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full support |
| Firefox | 88+     | ✅ Full support |
| Safari  | 14+     | ✅ Full support |
| Edge    | 90+     | ✅ Full support |

**Requirements**:
- JavaScript enabled
- WebAssembly support
- ~50 MB bandwidth (first load for Pyodide)
- Modern browser (2021+)

## 📦 Dependencies

**Runtime**:
- Pyodide 0.26.4 (loaded via CDN)
- NumPy (bundled with Pyodide)
- SciPy (bundled with Pyodide)

**Development**:
- None! Pure vanilla stack

**Fonts**:
- Google Fonts: Orbitron, Rajdhani (loaded via CDN)

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- [ ] Add more distributions (Beta, Gamma, Chi-square)
- [ ] Implement line/area chart modes
- [ ] Add data export functionality
- [ ] Create comparison mode (2+ distributions)
- [ ] Add statistical tests (normality, t-test, etc.)
- [ ] Implement mobile touch gestures
- [ ] Add dark/light theme toggle
- [ ] Create tutorial/walkthrough mode

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Pyodide Team** - Python in the browser magic
- **NumPy/SciPy** - Scientific computing libraries
- **Google Fonts** - Orbitron & Rajdhani typefaces
- **JSDelivr** - Fast, reliable CDN

## 📧 Contact

Created by [@yourusername](https://github.com/yourusername)

- 🐛 Report bugs: [Issues](https://github.com/yourusername/jupyTerminator/issues)
- 💡 Feature requests: [Discussions](https://github.com/yourusername/jupyTerminator/discussions)
- 📧 Email: your.email@example.com

---

<div align="center">

**Made with 💜 and ☕ in the cyberpunk metaverse**

⭐ Star this repo if you found it helpful! ⭐

</div>
