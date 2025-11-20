/**
 * 🌃 CYBERPUNK SCIENTIST HUB - Main Application
 * Interactive Python laboratory with visual effects
 */

let pyodide = null;
let isReady = false;

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  createParticles();
  drawPreviewCanvas();
  await initializePyodide();
  setupEventListeners();
  updateParameterDisplays();
  startCanvasAnimation();
});

/**
 * Create floating particles effect
 */
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.style.position = "absolute";
    particle.style.width = Math.random() * 3 + "px";
    particle.style.height = particle.style.width;
    particle.style.background = ["#ff006e", "#00f5ff", "#8b00ff", "#39ff14"][
      Math.floor(Math.random() * 4)
    ];
    particle.style.borderRadius = "50%";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.opacity = Math.random() * 0.3;
    particle.style.boxShadow = `0 0 10px ${particle.style.background}`;

    const duration = 10 + Math.random() * 20;
    const delay = Math.random() * 5;

    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;

    particlesContainer.appendChild(particle);
  }
}

/**
 * Draw preview canvas with animated wave
 */
function drawPreviewCanvas() {
  const canvas = document.getElementById("preview-canvas");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#050812";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = "rgba(0, 245, 255, 0.1)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw waveform
  let phase = 0;

  function animate() {
    ctx.fillStyle = "rgba(5, 8, 18, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = "#00f5ff";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00f5ff";

    for (let x = 0; x < canvas.width; x++) {
      const y =
        canvas.height / 2 +
        Math.sin((x + phase) * 0.02) * 30 +
        Math.sin((x + phase) * 0.05) * 15;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    phase += 2;

    if (isReady) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

/**
 * Start canvas animation loop
 */
function startCanvasAnimation() {
  // Animation already started in drawPreviewCanvas
}

/**
 * Initialize Pyodide and load Python code
 */
async function initializePyodide() {
  const progressText = document.getElementById("progress-text");
  const progressBar = document.getElementById("progress-bar");
  const loadingOverlay = document.getElementById("loading-overlay");
  const statusIndicator = document.getElementById("python-status");

  try {
    statusIndicator.textContent = "Initializing...";
    statusIndicator.style.color = "#ffbe0b";

    // Update progress
    progressText.textContent = "10%";
    progressBar.style.width = "10%";

    // Wait for Pyodide to load
    if (typeof loadPyodide === "undefined") {
      throw new Error("Pyodide script not loaded");
    }

    // Initialize Pyodide
    progressText.textContent = "30% - Loading Python runtime";
    progressBar.style.width = "30%";

    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    });

    // Load required packages
    progressText.textContent = "50% - Loading NumPy and SciPy";
    progressBar.style.width = "50%";
    await pyodide.loadPackage(["numpy", "scipy"]);

    // Load Python application code
    progressText.textContent = "80% - Loading statistical functions";
    progressBar.style.width = "80%";

    const pythonCode = await fetch("app.py");
    const code = await pythonCode.text();
    await pyodide.runPythonAsync(code);

    isReady = true;
    progressText.textContent = "100% - Ready!";
    progressBar.style.width = "100%";

    statusIndicator.textContent = "Python Ready";
    statusIndicator.style.color = "#39ff14";

    // Hide loading overlay
    setTimeout(() => {
      loadingOverlay.classList.add("hidden");
    }, 800);

    console.log("✅ Pyodide ready! NumPy, SciPy loaded.");
  } catch (error) {
    console.error("❌ Error initializing Pyodide:", error);
    progressText.textContent = `Error: ${error.message}`;
    progressText.style.color = "#ff006e";
    statusIndicator.textContent = "Error";
    statusIndicator.style.color = "#ff006e";
  }
}

/**
 * Setup UI event listeners
 */
function setupEventListeners() {
  // Generate button
  document
    .getElementById("generate-btn")
    .addEventListener("click", generateAndAnalyze);

  // Randomize button
  document.getElementById("random-btn").addEventListener("click", randomize);

  // Range sliders
  const sampleSize = document.getElementById("sample-size");
  const param1 = document.getElementById("param1");
  const param2 = document.getElementById("param2");

  sampleSize.addEventListener("input", updateParameterDisplays);
  param1.addEventListener("input", updateParameterDisplays);
  param2.addEventListener("input", updateParameterDisplays);

  // Distribution selector
  document
    .getElementById("distribution")
    .addEventListener("change", updateParameterLabels);

  // Theme toggle
  document.getElementById("theme-toggle").addEventListener("click", () => {
    alert("Theme toggle - coming soon!");
  });

  // Fullscreen
  document.getElementById("fullscreen-btn").addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  // Share button
  document.getElementById("share-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  });
}

/**
 * Randomize parameters
 */
function randomize() {
  const distributions = ["normal", "uniform", "exponential", "poisson"];
  const randomDist =
    distributions[Math.floor(Math.random() * distributions.length)];

  document.getElementById("distribution").value = randomDist;
  document.getElementById("sample-size").value =
    Math.floor(Math.random() * 9900) + 100;
  document.getElementById("param1").value = (Math.random() * 20 - 10).toFixed(
    1
  );
  document.getElementById("param2").value = (Math.random() * 4.9 + 0.1).toFixed(
    1
  );

  updateParameterLabels();
  updateParameterDisplays();

  // Add animation
  const btn = document.getElementById("random-btn");
  btn.style.transform = "rotate(360deg)";
  setTimeout(() => {
    btn.style.transform = "rotate(0deg)";
  }, 500);
}

/**
 * Update parameter labels based on distribution
 */
function updateParameterLabels() {
  const distribution = document.getElementById("distribution").value;
  const param1Label = document.querySelector('label[for="param1"]');
  const param2Label = document.querySelector('label[for="param2"]');

  // Update educational info panel
  updateDistributionInfo(distribution);

  switch (distribution) {
    case "normal":
      param1Label.innerHTML = `<span class="label-icon">μ</span> Parameter 1 (Mean): <span class="value-display" id="param1-value">0.0</span>`;
      param2Label.innerHTML = `<span class="label-icon">σ</span> Parameter 2 (Std Dev): <span class="value-display" id="param2-value">1.0</span>`;
      break;
    case "uniform":
      param1Label.innerHTML = `<span class="label-icon">▼</span> Parameter 1 (Lower): <span class="value-display" id="param1-value">0.0</span>`;
      param2Label.innerHTML = `<span class="label-icon">▲</span> Parameter 2 (Upper): <span class="value-display" id="param2-value">1.0</span>`;
      break;
    case "exponential":
      param1Label.innerHTML = `<span class="label-icon">λ</span> Parameter 1 (Scale): <span class="value-display" id="param1-value">1.0</span>`;
      param2Label.innerHTML = `<span class="label-icon">∅</span> Parameter 2 (unused): <span class="value-display" id="param2-value">1.0</span>`;
      break;
    case "poisson":
      param1Label.innerHTML = `<span class="label-icon">λ</span> Parameter 1 (Rate): <span class="value-display" id="param1-value">5.0</span>`;
      param2Label.innerHTML = `<span class="label-icon">∅</span> Parameter 2 (unused): <span class="value-display" id="param2-value">1.0</span>`;
      break;
  }

  updateParameterDisplays();
}

/**
 * Update parameter value displays
 */
function updateParameterDisplays() {
  const sampleSize = document.getElementById("sample-size");
  const param1 = document.getElementById("param1");
  const param2 = document.getElementById("param2");

  document.getElementById("size-value").textContent = sampleSize.value;
  document.getElementById("param1-value").textContent = parseFloat(
    param1.value
  ).toFixed(1);
  document.getElementById("param2-value").textContent = parseFloat(
    param2.value
  ).toFixed(1);
}

/**
 * Update distribution info panel with educational content
 */
function updateDistributionInfo(distribution) {
  const infoTitle = document.getElementById("info-title");
  const infoDescription = document.getElementById("info-description");

  const info = {
    normal: {
      title: "🔔 Normal Distribution (Gaussian)",
      description:
        "The most important distribution in statistics! It's symmetric and bell-shaped. <strong>Real examples:</strong> Human heights, IQ scores, measurement errors, blood pressure. <strong>Parameters:</strong> Mean (μ) = center point, Standard Deviation (σ) = how spread out the data is. <strong>Fun fact:</strong> 68% of data falls within 1σ of the mean!",
    },
    uniform: {
      title: "📏 Uniform Distribution",
      description:
        "Every value has equal probability - perfectly flat! <strong>Real examples:</strong> Rolling a fair die, random number generators, lottery numbers. <strong>Parameters:</strong> Lower bound = minimum value, Upper bound = maximum value. <strong>Key insight:</strong> No value is more likely than another!",
    },
    exponential: {
      title: "📉 Exponential Distribution",
      description:
        "Models waiting times and decay processes. Lots of small values, few large ones. <strong>Real examples:</strong> Time between earthquakes, radioactive decay, customer service wait times, lifespan of electronics. <strong>Parameter:</strong> Scale (λ) = average time between events. <strong>Property:</strong> Memoryless!",
    },
    poisson: {
      title: "🎲 Poisson Distribution",
      description:
        "Counts rare events in fixed time/space intervals. <strong>Real examples:</strong> Number of emails per hour, accidents per day, mutations in DNA, calls to a call center. <strong>Parameter:</strong> Rate (λ) = average number of events. <strong>Cool fact:</strong> Mean equals variance!",
    },
  };

  infoTitle.textContent = info[distribution].title;
  infoDescription.innerHTML = info[distribution].description;
}

/**
 * Generate distribution and analyze
 */
async function generateAndAnalyze() {
  if (!isReady) {
    showNotification(
      "Python environment not ready yet. Please wait...",
      "warning"
    );
    return;
  }

  const btn = document.getElementById("generate-btn");
  const btnText = btn.querySelector(".btn-text");
  const originalText = btnText.textContent;

  btn.disabled = true;
  btnText.textContent = "PROCESSING...";

  try {
    // Get parameters
    const distribution = document.getElementById("distribution").value;
    const size = parseInt(document.getElementById("sample-size").value);
    const param1 = parseFloat(document.getElementById("param1").value);
    const param2 = parseFloat(document.getElementById("param2").value);

    // Call Python function
    const pythonCode = `
import json
result = generate_distribution('${distribution}', ${size}, ${param1}, ${param2})
json.dumps(result)
`;

    const resultJSON = await pyodide.runPythonAsync(pythonCode);
    const result = JSON.parse(resultJSON);

    // Update statistics display with animation
    updateStatistics(result.statistics);

    // Update sample data preview
    updateSampleData(result.data);

    // Create histogram
    createHistogram(result.histogram);

    // Show insights in panel (non-intrusive)
    showInsightsPanel(result.statistics, distribution);

    console.log("✅ Analysis complete:", result);
  } catch (error) {
    console.error("❌ Error generating distribution:", error);
    showNotification("Error generating distribution. Check console.", "error");
  } finally {
    btn.disabled = false;
    btnText.textContent = originalText;
  }
}

/**
 * Update statistics cards with animation
 */
function updateStatistics(stats) {
  const statElements = {
    mean: document.getElementById("stat-mean"),
    std: document.getElementById("stat-std"),
    median: document.getElementById("stat-median"),
    var: document.getElementById("stat-var"),
    skew: document.getElementById("stat-skew"),
    kurt: document.getElementById("stat-kurt"),
  };

  // Animate each stat
  Object.keys(statElements).forEach((key, index) => {
    setTimeout(() => {
      const element = statElements[key];
      const value =
        stats[
          key === "var"
            ? "variance"
            : key === "std"
            ? "std"
            : key === "kurt"
            ? "kurtosis"
            : key
        ];

      // Animate number
      animateNumber(element, value, 1000);

      // Animate bar
      const card = element.closest(".stat-card");
      const bar = card.querySelector(".bar-fill");
      const percentage = Math.min(Math.abs(value) * 20, 100);
      bar.style.width = percentage + "%";
    }, index * 100);
  });
}

/**
 * Animate number counting
 */
function animateNumber(element, target, duration) {
  const start = 0;
  const startTime = Date.now();

  function update() {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);
    const current = start + (target - start) * easeOutQuart(progress);

    element.textContent = current.toFixed(3);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}

function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

/**
 * Update sample data preview
 */
function updateSampleData(data) {
  const formatted = data
    .map((val, idx) => `[${idx.toString().padStart(2, "0")}] ${val.toFixed(4)}`)
    .join("\n");

  document.getElementById(
    "sample-data"
  ).innerHTML = `<pre><code>${formatted}</code></pre>`;
}

/**
 * Create cyberpunk histogram
 */
function createHistogram(histogram) {
  console.log("📊 Creating histogram with data:", histogram);
  const { counts, edges } = histogram;
  const maxCount = Math.max(...counts);

  let html =
    '<div style="display: flex; align-items: flex-end; height: 400px; gap: 3px; padding: 20px;">';

  for (let i = 0; i < counts.length; i++) {
    const height = (counts[i] / maxCount) * 100;
    const hue = 280 + (i / counts.length) * 100; // Purple to cyan gradient

    html += `
      <div style="
        flex: 1;
        background: linear-gradient(to top, hsl(${hue}, 100%, 50%), hsl(${hue}, 100%, 70%));
        height: ${height}%;
        border-radius: 4px 4px 0 0;
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;
        box-shadow: 0 0 10px hsla(${hue}, 100%, 50%, 0.5);
        animation: barGrow 0.5s ease ${i * 0.02}s backwards;
      " 
      title="Range: ${edges[i].toFixed(2)} - ${edges[i + 1].toFixed(
      2
    )}\nCount: ${counts[i]}"
      onmouseover="this.style.transform='translateY(-10px) scale(1.05)'; this.style.boxShadow='0 0 30px hsla(${hue}, 100%, 50%, 0.8)'"
      onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 0 10px hsla(${hue}, 100%, 50%, 0.5)'">
      </div>
    `;
  }

  html += "</div>";
  html += `
    <div style="margin-top: 1rem; text-align: center; color: #9ca3af; font-size: 0.9rem;">
      <span style="color: #00f5ff;">●</span> Hover over bars for details | ${counts.length} bins
    </div>
  `;

  // Add CSS animation for bars
  if (!document.getElementById("bar-animation-style")) {
    const style = document.createElement("style");
    style.id = "bar-animation-style";
    style.textContent = `
      @keyframes barGrow {
        from {
          height: 0%;
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const container = document.getElementById("plot-container");
  console.log("📦 Container found:", container);

  // Remove flex centering styles to allow histogram to render
  container.style.display = "block";
  container.style.alignItems = "initial";
  container.style.justifyContent = "initial";

  container.innerHTML = html;
  console.log("✅ Histogram HTML inserted, bars count:", counts.length);
}

/**
 * Show notification
 */
function showNotification(message, type = "info") {
  const colors = {
    success: "#39ff14",
    warning: "#ffbe0b",
    error: "#ff006e",
    info: "#00f5ff",
  };

  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 30px;
    padding: 1rem 1.5rem;
    background: rgba(18, 23, 46, 0.95);
    border: 2px solid ${colors[type]};
    border-radius: 12px;
    color: ${colors[type]};
    font-family: 'Rajdhani', sans-serif;
    font-weight: 600;
    box-shadow: 0 0 20px ${colors[type]}40;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add notification animations
const notifStyle = document.createElement("style");
notifStyle.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(notifStyle);

/**
 * Show insights panel (non-intrusive alternative to notifications)
 */
function showInsightsPanel(stats, distribution) {
  const panel = document.getElementById("insights-panel");
  const shapeText = document.getElementById("shape-text");
  const spreadText = document.getElementById("spread-text");
  const tipText = document.getElementById("tip-text");

  // Determine shape/skewness
  let shape = "";
  if (Math.abs(stats.skewness) < 0.5) {
    shape = "Symmetric - Data is balanced around center";
  } else if (stats.skewness > 0) {
    shape = "Right-skewed - Long tail on right, most values are smaller";
  } else {
    shape = "Left-skewed - Long tail on left, most values are larger";
  }

  // Determine spread/variability
  let spread = "";
  const cv = stats.std / Math.abs(stats.mean);
  if (cv < 0.3) {
    spread = "Low variability - Data points are close together";
  } else if (cv > 1) {
    spread = "High variability - Data is very spread out";
  } else {
    spread = "Moderate variability - Typical spread for this distribution";
  }

  // Distribution-specific tip
  const tips = {
    normal: `68% of values fall between ${(stats.mean - stats.std).toFixed(
      2
    )} and ${(stats.mean + stats.std).toFixed(2)} (mean ± 1σ)`,
    uniform: `All values between ${stats.min.toFixed(
      2
    )} and ${stats.max.toFixed(2)} are equally likely`,
    exponential: `Most events happen quickly (median=${stats.median.toFixed(
      2
    )}), but some take longer (max=${stats.max.toFixed(2)})`,
    poisson: `Average rate is ${stats.mean.toFixed(
      2
    )} events. Variance (${stats.variance.toFixed(2)}) ≈ Mean`,
  };

  // Update panel content
  shapeText.textContent = shape;
  spreadText.textContent = spread;
  tipText.textContent = tips[distribution] || "Analysis complete";

  // Show panel with animation
  panel.style.display = "block";
}

// Remove old notification functions - keeping only for errors
function showNotification(message, type = "info") {
  // Only show for errors/warnings, not for info/success
  if (type !== "error" && type !== "warning") return;

  const colors = {
    warning: "#ffbe0b",
    error: "#ff006e",
  };

  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 30px;
    padding: 1rem 1.5rem;
    background: rgba(18, 23, 46, 0.95);
    border: 2px solid ${colors[type]};
    border-radius: 12px;
    color: ${colors[type]};
    font-family: 'Rajdhani', sans-serif;
    font-weight: 600;
    box-shadow: 0 0 20px ${colors[type]}40;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Export for debugging
window.app = {
  pyodide,
  generateAndAnalyze,
  randomize,
};
