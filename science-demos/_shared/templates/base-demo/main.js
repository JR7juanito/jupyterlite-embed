/**
 * My Scientific Demo - Main Application
 * Replace this comment with your demo description
 */

let pyodideLoader;
let pythonBridge;
let isReady = false;

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  await initializePyodide();
  setupEventListeners();
});

/**
 * Initialize Pyodide and load Python code
 */
async function initializePyodide() {
  const progressText = document.getElementById("progress-text");
  const loadingOverlay = document.getElementById("loading-overlay");

  try {
    // Create loader with progress callback
    pyodideLoader = new PyodideLoader({
      onProgress: (message, percent) => {
        progressText.textContent = `${percent}% - ${message}`;
      },
    });

    // Load Pyodide
    await pyodideLoader.load();

    // Load required packages (customize this list)
    await pyodideLoader.loadPackages(["numpy"]);
    // Add more packages as needed:
    // await pyodideLoader.loadPackages(['numpy', 'scipy', 'matplotlib']);

    // Load Python application code
    const response = await fetch("app.py");
    const pythonCode = await response.text();
    await pyodideLoader.runPython(pythonCode);

    // Create bridge
    pythonBridge = new PythonBridge(pyodideLoader.pyodide);

    isReady = true;

    // Hide loading overlay
    setTimeout(() => {
      loadingOverlay.classList.add("hidden");
    }, 500);

    console.log("✅ Pyodide ready!");
  } catch (error) {
    console.error("❌ Error initializing Pyodide:", error);
    progressText.textContent = "Error loading Python environment";
    progressText.style.color = "#ef4444";
  }
}

/**
 * Setup UI event listeners
 */
function setupEventListeners() {
  // Run button
  document.getElementById("run-btn").addEventListener("click", runAnalysis);

  // Parameter slider with live value display
  const paramSlider = document.getElementById("example-param");
  paramSlider.addEventListener("input", (e) => {
    document.getElementById("param-value").textContent = e.target.value;
  });
}

/**
 * Main analysis function - customize this
 */
async function runAnalysis() {
  if (!isReady) {
    alert("Python environment not ready yet. Please wait...");
    return;
  }

  const btn = document.getElementById("run-btn");
  btn.disabled = true;
  btn.textContent = "⏳ Running...";

  try {
    // Get parameter value
    const param = parseInt(document.getElementById("example-param").value);

    // Call Python function
    // Method 1: Direct execution with JSON
    const pythonCode = `
import json
result = example_function(${param})
json.dumps(result)
`;
    const resultJSON = await pyodideLoader.runPython(pythonCode);
    const result = JSON.parse(resultJSON);

    // Method 2: Using bridge (alternative)
    // const result = await pythonBridge.callPython('example_function', param);

    // Display results
    displayResults(result);

    console.log("✅ Analysis complete:", result);
  } catch (error) {
    console.error("❌ Error running analysis:", error);
    alert("Error running analysis. Check console for details.");
  } finally {
    btn.disabled = false;
    btn.textContent = "🚀 Run Analysis";
  }
}

/**
 * Display results in UI - customize this
 */
function displayResults(result) {
  const resultsDiv = document.getElementById("results");

  // Format results as text
  const formatted = `
Mean: ${result.mean.toFixed(3)}
Std Dev: ${result.std.toFixed(3)}

Sample Data (first 10):
${result.data.map((v, i) => `[${i}] ${v.toFixed(4)}`).join("\n")}
  `.trim();

  resultsDiv.innerHTML = `<pre>${formatted}</pre>`;
}

// Export for debugging in console
window.app = {
  pyodideLoader,
  pythonBridge,
  runAnalysis,
};
