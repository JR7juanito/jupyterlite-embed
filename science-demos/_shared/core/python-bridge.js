/**
 * 🌉 Python Bridge - Bidirectional JS ↔ Python communication
 *
 * Allows calling Python functions from JavaScript and vice versa
 */

class PythonBridge {
  constructor(pyodide) {
    this.pyodide = pyodide;
    this.pythonFunctions = new Map();
  }

  /**
   * Register a Python function to be called from JS
   *
   * @param {string} name - Function name
   * @param {string} pythonCode - Python function definition
   */
  async registerPythonFunction(name, pythonCode) {
    await this.pyodide.runPythonAsync(pythonCode);
    const func = this.pyodide.globals.get(name);
    this.pythonFunctions.set(name, func);
  }

  /**
   * Call a registered Python function
   *
   * @param {string} name - Function name
   * @param {...any} args - Arguments to pass
   */
  async callPython(name, ...args) {
    const func = this.pythonFunctions.get(name);
    if (!func) {
      throw new Error(`Python function '${name}' not registered`);
    }

    try {
      const result = await func(...args);
      return result;
    } catch (error) {
      console.error(`Error calling Python function '${name}':`, error);
      throw error;
    }
  }

  /**
   * Expose JavaScript function to Python
   *
   * @param {string} name - Function name in Python
   * @param {Function} jsFunction - JavaScript function
   */
  exposeToJavaScript(name, jsFunction) {
    this.pyodide.globals.set(name, jsFunction);
  }

  /**
   * Get a Python variable value
   */
  getPythonVar(varName) {
    return this.pyodide.globals.get(varName);
  }

  /**
   * Set a Python variable from JS
   */
  setPythonVar(varName, value) {
    this.pyodide.globals.set(varName, value);
  }

  /**
   * Convert Python object to JS (useful for complex types)
   */
  toJS(pythonObject) {
    return pythonObject.toJs();
  }

  /**
   * Execute Python code and return result
   */
  async execute(code) {
    return await this.pyodide.runPythonAsync(code);
  }

  /**
   * Helper: Load matplotlib and return base64 image
   */
  async getMatplotlibImage() {
    const code = `
import matplotlib.pyplot as plt
import io
import base64

buf = io.BytesIO()
plt.savefig(buf, format='png', bbox_inches='tight', dpi=100)
buf.seek(0)
img_base64 = base64.b64encode(buf.read()).decode('utf-8')
plt.close()
img_base64
`;
    return await this.execute(code);
  }

  /**
   * Helper: Convert NumPy array to JS array
   */
  async numpyToArray(numpyVar) {
    const code = `${numpyVar}.tolist()`;
    return await this.execute(code);
  }

  /**
   * Helper: Convert Pandas DataFrame to JSON
   */
  async dataframeToJSON(dfVar) {
    const code = `${dfVar}.to_json(orient='records')`;
    const jsonStr = await this.execute(code);
    return JSON.parse(jsonStr);
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = PythonBridge;
}
