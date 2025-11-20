/**
 * 🔧 Pyodide Loader - Optimized loading with progress feedback
 *
 * Features:
 * - CDN caching
 * - Progress callbacks
 * - Package pre-loading
 * - Error handling
 */

class PyodideLoader {
  constructor(options = {}) {
    this.version = options.version || "0.26.4";
    this.indexURL = `https://cdn.jsdelivr.net/pyodide/v${this.version}/full/`;
    this.onProgress = options.onProgress || (() => {});
    this.onReady = options.onReady || (() => {});
    this.pyodide = null;
  }

  /**
   * Load Pyodide runtime
   */
  async load() {
    try {
      this.onProgress("Waiting for Pyodide...", 10);

      // Wait for Pyodide to be available (loaded from HTML script tag)
      await new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (typeof loadPyodide !== "undefined") {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);

        // Timeout after 30 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error("Pyodide failed to load after 30 seconds"));
        }, 30000);
      });

      this.onProgress("Initializing Python runtime...", 30);

      // Initialize Pyodide
      this.pyodide = await loadPyodide({
        indexURL: this.indexURL,
      });

      this.onProgress("Pyodide ready!", 100);
      this.onReady(this.pyodide);

      return this.pyodide;
    } catch (error) {
      console.error("Error loading Pyodide:", error);
      throw error;
    }
  }

  /**
   * Load Python packages
   */
  async loadPackages(packages = []) {
    if (!this.pyodide) {
      throw new Error("Pyodide not initialized. Call load() first.");
    }

    this.onProgress(`Loading packages: ${packages.join(", ")}...`, 50);

    try {
      await this.pyodide.loadPackage(packages);
      this.onProgress("Packages loaded!", 80);
    } catch (error) {
      console.error("Error loading packages:", error);
      throw error;
    }
  }

  /**
   * Run Python code
   */
  async runPython(code) {
    if (!this.pyodide) {
      throw new Error("Pyodide not initialized.");
    }

    return await this.pyodide.runPythonAsync(code);
  }

  /**
   * Get Python namespace (access Python variables from JS)
   */
  getNamespace() {
    return this.pyodide.globals;
  }

  /**
   * Load and run Python file
   */
  async loadPythonFile(url) {
    const response = await fetch(url);
    const code = await response.text();
    return await this.runPython(code);
  }

  /**
   * Install packages from PyPI (micropip)
   */
  async installPackage(packageName) {
    await this.pyodide.loadPackage("micropip");
    const micropip = this.pyodide.pyimport("micropip");
    await micropip.install(packageName);
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = PyodideLoader;
}
