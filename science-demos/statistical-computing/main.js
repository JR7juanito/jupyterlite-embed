/**
 * Statistical Computing Demo - Main Application
 * Connects UI to Python backend via Pyodide
 */

let pyodide = null;
let isReady = false;

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  await initializePyodide();
  setupEventListeners();
  updateParameterDisplays();
});

/**
 * Initialize Pyodide and load Python code
 */
async function initializePyodide() {
  const progressText = document.getElementById("progress-text");
  const loadingOverlay = document.getElementById("loading-overlay");

  try {
    // Update progress
    progressText.textContent = "10% - Initializing Pyodide...";

    // Wait for Pyodide to load (from script tag in HTML)
    if (typeof loadPyodide === "undefined") {
      throw new Error("Pyodide script not loaded");
    }

    // Initialize Pyodide
    progressText.textContent = "30% - Loading Python runtime...";
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    });

    // Load required packages
    progressText.textContent = "50% - Loading NumPy and SciPy...";
    await pyodide.loadPackage(["numpy", "scipy"]);

    // Load Python application code
    progressText.textContent = "80% - Loading app code...";
    const response = await fetch("app.py");
    const pythonCode = await response.text();
    await pyodide.runPythonAsync(pythonCode);

    isReady = true;
    progressText.textContent = "100% - Ready!";

    // Hide loading overlay
    setTimeout(() => {
      loadingOverlay.classList.add("hidden");
    }, 500);

    console.log("✅ Pyodide ready! NumPy, SciPy loaded.");
  } catch (error) {
    console.error("❌ Error initializing Pyodide:", error);
    progressText.textContent = `Error: ${error.message}`;
    progressText.style.color = "#ef4444";
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

  // Range sliders with live value display
  const sampleSize = document.getElementById("sample-size");
  const param1 = document.getElementById("param1");
  const param2 = document.getElementById("param2");

  sampleSize.addEventListener("input", updateParameterDisplays);
  param1.addEventListener("input", updateParameterDisplays);
  param2.addEventListener("input", updateParameterDisplays);

  // Distribution selector
  document.getElementById("distribution").addEventListener("change", () => {
    updateParameterLabels();
    updateParameterDisplays();
  });
}

/**
 * Update parameter labels based on selected distribution
 */
function updateParameterLabels() {
  const distribution = document.getElementById("distribution").value;
  const param1Label = document.querySelector('label[for="param1"]');
  const param2Label = document.querySelector('label[for="param2"]');

  switch (distribution) {
    case "normal":
      param1Label.innerHTML = `Parameter 1 (μ/mean): <span id="param1-value">0</span>`;
      param2Label.innerHTML = `Parameter 2 (σ/std): <span id="param2-value">1</span>`;
      break;
    case "uniform":
      param1Label.innerHTML = `Parameter 1 (lower): <span id="param1-value">0</span>`;
      param2Label.innerHTML = `Parameter 2 (upper): <span id="param2-value">1</span>`;
      break;
    case "exponential":
      param1Label.innerHTML = `Parameter 1 (scale): <span id="param1-value">1</span>`;
      param2Label.innerHTML = `Parameter 2 (unused): <span id="param2-value">1</span>`;
      break;
    case "poisson":
      param1Label.innerHTML = `Parameter 1 (λ): <span id="param1-value">5</span>`;
      param2Label.innerHTML = `Parameter 2 (unused): <span id="param2-value">1</span>`;
      break;
  }
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
 * Generate distribution and analyze
 */
async function generateAndAnalyze() {
  if (!isReady) {
    alert("Python environment not ready yet. Please wait...");
    return;
  }

  const btn = document.getElementById("generate-btn");
  btn.disabled = true;
  btn.textContent = "⏳ Generating...";

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

    // Update statistics display
    updateStatistics(result.statistics);

    // Update sample data preview
    updateSampleData(result.data);

    // Create histogram
    createHistogram(result.histogram);

    console.log("✅ Analysis complete:", result);
  } catch (error) {
    console.error("❌ Error generating distribution:", error);
    alert("Error generating distribution. Check console for details.");
  } finally {
    btn.disabled = false;
    btn.textContent = "🎲 Generate & Analyze";
  }
}

/**
 * Update statistics cards
 */
function updateStatistics(stats) {
  document.getElementById("stat-mean").textContent = stats.mean.toFixed(3);
  document.getElementById("stat-std").textContent = stats.std.toFixed(3);
  document.getElementById("stat-median").textContent = stats.median.toFixed(3);
  document.getElementById("stat-var").textContent = stats.variance.toFixed(3);
  document.getElementById("stat-skew").textContent = stats.skewness.toFixed(3);
  document.getElementById("stat-kurt").textContent = stats.kurtosis.toFixed(3);
}

/**
 * Update sample data preview
 */
function updateSampleData(data) {
  const formatted = data
    .map((val, idx) => `[${idx.toString().padStart(2, "0")}] ${val.toFixed(4)}`)
    .join("\n");

  document.getElementById("sample-data").innerHTML = `<pre>${formatted}</pre>`;
}

/**
 * Create histogram using simple ASCII/HTML visualization
 * (In production, you could use Plotly.js or Chart.js)
 */
function createHistogram(histogram) {
  const { counts, edges } = histogram;
  const maxCount = Math.max(...counts);

  // Create simple bar chart with HTML/CSS
  let html =
    '<div style="display: flex; align-items: flex-end; height: 300px; gap: 2px;">';

  for (let i = 0; i < counts.length; i++) {
    const height = (counts[i] / maxCount) * 100;
    const color = `hsl(${200 + i * 5}, 70%, 50%)`;

    html += `
      <div style="
        flex: 1;
        background: linear-gradient(to top, ${color}, ${color}dd);
        height: ${height}%;
        border-radius: 4px 4px 0 0;
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;
      " 
      title="Range: ${edges[i].toFixed(2)} - ${edges[i + 1].toFixed(
      2
    )}, Count: ${counts[i]}"
      onmouseover="this.style.opacity='0.7'"
      onmouseout="this.style.opacity='1'">
      </div>
    `;
  }

  html += "</div>";
  html += `<div style="margin-top: 1rem; text-align: center; color: #94a3b8; font-size: 0.9rem;">
    Hover over bars for details | ${counts.length} bins
  </div>`;

  document.getElementById("plot-container").innerHTML = html;
}

// Export for debugging
window.app = {
  pyodide,
  generateAndAnalyze,
};
