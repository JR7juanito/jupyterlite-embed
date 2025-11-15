# 🚀 Science Demos Roadmap

Lista priorizada de demos científicas interactivas basadas en el ecosistema NumPy.

## ✅ Fase 1: Core Demos (Implementadas)

### 1. Statistical Computing ✅

**Status**: Implementado  
**Path**: `statistical-computing/`  
**Packages**: NumPy, SciPy  
**Features**:

- Generación de distribuciones (Normal, Uniform, Exponential, Poisson)
- Estadísticas descriptivas en tiempo real
- Histogramas interactivos
- Preview de datos

**Educational Value**: ⭐⭐⭐⭐⭐  
**Technical Difficulty**: ⭐⭐  
**Time to Build**: 2-3 hours

---

## 🔄 Fase 2: Mathematical & Visualization (En Proceso)

### 2. Mathematical Analysis

**Status**: Planeado  
**Path**: `mathematical-analysis/`  
**Packages**: SymPy, NumPy, Matplotlib  
**Features**:

- Calculadora simbólica
- Derivadas e integrales
- Resolver ecuaciones
- Graficar funciones matemáticas
- Expansión en series (Taylor, Fourier)

**Use Cases**:

- Cálculo universitario
- Álgebra simbólica
- Verificación de tareas

**Technical Notes**:

```python
import sympy as sp
x = sp.Symbol('x')
expr = sp.sin(x) * sp.exp(x)
derivative = sp.diff(expr, x)
integral = sp.integrate(expr, x)
```

**Educational Value**: ⭐⭐⭐⭐⭐  
**Technical Difficulty**: ⭐⭐⭐  
**Time to Build**: 3-4 hours

---

### 3. Data Visualization Dashboard

**Status**: Planeado  
**Path**: `data-visualization/`  
**Packages**: Pandas, NumPy, Plotly (via JS)  
**Features**:

- Cargar CSV desde archivo o ejemplo
- Pandas DataFrame interactivo
- Gráficos: scatter, line, bar, heatmap
- Filtros y agregaciones
- Export a JSON/CSV

**Use Cases**:

- Análisis exploratorio de datos
- Dashboards educativos
- Visualización rápida

**Technical Notes**:

```python
import pandas as pd
df = pd.read_csv('data.csv')
summary = df.describe()
filtered = df[df['column'] > threshold]
```

**Educational Value**: ⭐⭐⭐⭐⭐  
**Technical Difficulty**: ⭐⭐⭐  
**Time to Build**: 4-5 hours

---

### 4. Signal Processing

**Status**: Planeado  
**Path**: `signal-processing/`  
**Packages**: NumPy, SciPy (signal)  
**Features**:

- Generador de señales (seno, cuadrada, triangular)
- FFT (Fast Fourier Transform)
- Filtros (low-pass, high-pass, band-pass)
- Espectrograma
- Audio synthesis básico

**Use Cases**:

- Procesamiento de audio
- Análisis de frecuencias
- Telecomunicaciones

**Technical Notes**:

```python
from scipy import signal
from scipy.fft import fft, fftfreq

# Generate signal
t = np.linspace(0, 1, 1000)
sig = np.sin(2*np.pi*50*t) + np.sin(2*np.pi*120*t)

# FFT
yf = fft(sig)
xf = fftfreq(len(t), 1/1000)

# Filter
b, a = signal.butter(4, 100, 'low', fs=1000)
filtered = signal.filtfilt(b, a, sig)
```

**Educational Value**: ⭐⭐⭐⭐  
**Technical Difficulty**: ⭐⭐⭐⭐  
**Time to Build**: 5-6 hours

---

### 5. Image Processing

**Status**: Planeado  
**Path**: `image-processing/`  
**Packages**: NumPy, scikit-image  
**Features**:

- Cargar imagen (drag & drop)
- Filtros: blur, sharpen, edge detection
- Transformaciones: rotate, resize, crop
- Ajustes: brightness, contrast, saturation
- Histograma de color

**Use Cases**:

- Visión por computadora
- Procesamiento de imágenes médicas
- Fotografía computacional

**Technical Notes**:

```python
from skimage import filters, transform, exposure

# Load image (base64)
img = np.array(image_data)

# Apply filters
blurred = filters.gaussian(img, sigma=2)
edges = filters.sobel(img)

# Transform
rotated = transform.rotate(img, angle)
resized = transform.resize(img, (height, width))
```

**Educational Value**: ⭐⭐⭐⭐⭐  
**Technical Difficulty**: ⭐⭐⭐⭐  
**Time to Build**: 6-7 hours

---

## 🌟 Fase 3: Advanced Domains (Futuro)

### 6. Quantum Computing Simulator

**Status**: Idea  
**Path**: `quantum-computing/`  
**Packages**: NumPy, QuTip (si está disponible) o implementación custom  
**Features**:

- Simulador de qubits
- Puertas cuánticas (Hadamard, CNOT, Pauli)
- Circuitos cuánticos visuales
- Medición y colapso
- Algoritmos: Deutsch, Grover (simplificado)

**Use Cases**:

- Educación en computación cuántica
- Visualización de superposición/entrelazamiento
- Introducción a algoritmos cuánticos

**Technical Difficulty**: ⭐⭐⭐⭐⭐  
**Time to Build**: 10+ hours

---

### 7. Machine Learning Playground

**Status**: Idea  
**Path**: `machine-learning/`  
**Packages**: NumPy, scikit-learn  
**Features**:

- Clasificación (SVM, Decision Trees, kNN)
- Regresión (Linear, Polynomial)
- Clustering (K-means, DBSCAN)
- Datasets interactivos (2D)
- Visualización de fronteras de decisión
- Train/Test split y métricas

**Use Cases**:

- Introducción a ML
- Visualizar overfitting/underfitting
- Comparar algoritmos

**Technical Notes**:

```python
from sklearn import svm, tree, neighbors
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Generate data
X, y = make_classification(n_samples=100, n_features=2)

# Train model
model = svm.SVC(kernel='rbf')
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
```

**Educational Value**: ⭐⭐⭐⭐⭐  
**Technical Difficulty**: ⭐⭐⭐⭐  
**Time to Build**: 8-10 hours

---

### 8. Astronomy Data Viewer

**Status**: Idea  
**Path**: `astronomy/`  
**Packages**: NumPy, AstroPy (si disponible)  
**Features**:

- Visualización de coordenadas celestes
- Cálculo de posiciones planetarias
- Conversión de unidades astronómicas
- Simulación de órbitas
- Datos de estrellas cercanas

**Use Cases**:

- Educación en astronomía
- Planificación de observaciones
- Visualización de fenómenos celestes

**Technical Difficulty**: ⭐⭐⭐⭐  
**Time to Build**: 7-8 hours

---

### 9. Bioinformatics Toolkit

**Status**: Idea  
**Path**: `bioinformatics/`  
**Packages**: NumPy, Biopython (si disponible) o custom  
**Features**:

- Análisis de secuencias DNA/RNA
- Transcripción y traducción
- Alineamiento de secuencias
- Cálculo de GC content
- Búsqueda de motivos

**Use Cases**:

- Biología molecular
- Genómica
- Educación en bioinformática

**Technical Notes**:

```python
def transcribe(dna):
    return dna.replace('T', 'U')

def translate(rna):
    codon_table = {
        'AUG': 'M', 'UUU': 'F', 'UUC': 'F',
        # ... genetic code
    }
    protein = ''
    for i in range(0, len(rna), 3):
        codon = rna[i:i+3]
        protein += codon_table.get(codon, 'X')
    return protein
```

**Educational Value**: ⭐⭐⭐⭐  
**Technical Difficulty**: ⭐⭐⭐  
**Time to Build**: 6-7 hours

---

### 10. Geoscience Maps

**Status**: Idea  
**Path**: `geoscience/`  
**Packages**: NumPy, Pandas, Folium (via JS) o custom  
**Features**:

- Mapas interactivos con marcadores
- Datos geográficos (terremotos, volcanes)
- Heatmaps geoespaciales
- Análisis de elevación
- Visualización de datos climáticos

**Use Cases**:

- Geografía
- Ciencias de la tierra
- Análisis ambiental

**Technical Difficulty**: ⭐⭐⭐⭐  
**Time to Build**: 7-8 hours

---

## 🎯 Priorización de Implementación

### Criterios de Prioridad

1. **Educational Value** (40%): ¿Qué tan útil es para aprender?
2. **Technical Feasibility** (30%): ¿Qué tan fácil es con Pyodide?
3. **Visual Appeal** (20%): ¿Qué tan atractivo es?
4. **Time Investment** (10%): Tiempo vs. impacto

### Orden Recomendado

**Alta Prioridad (Próximas 2 semanas)**:

1. ✅ Statistical Computing (completado)
2. 🔄 Mathematical Analysis (alto valor educativo, factible)
3. 🔄 Signal Processing (muy visual, buenas demos)
4. 🔄 Data Visualization (fundamental para data science)

**Media Prioridad (Mes 2)**: 5. Image Processing (muy visual, popular) 6. Machine Learning (muy demandado) 7. Quantum Computing (nicho pero impresionante)

**Baja Prioridad (Futuro)**: 8. Astronomy (requiere datos externos) 9. Bioinformatics (nicho más específico) 10. Geoscience (complejo con mapas)

---

## 📊 Progress Tracker

| Demo                  | Status      | Completion | Priority | Next Steps              |
| --------------------- | ----------- | ---------- | -------- | ----------------------- |
| Statistical Computing | ✅ Complete | 100%       | High     | Documentation           |
| Mathematical Analysis | 📋 Planned  | 0%         | High     | Start skeleton          |
| Signal Processing     | 📋 Planned  | 0%         | High     | Research FFT viz        |
| Data Visualization    | 📋 Planned  | 0%         | High     | Choose charting lib     |
| Image Processing      | 💡 Idea     | 0%         | Medium   | Check scikit-image      |
| Machine Learning      | 💡 Idea     | 0%         | Medium   | Test sklearn in Pyodide |
| Quantum Computing     | 💡 Idea     | 0%         | Medium   | Build qubit simulator   |
| Astronomy             | 💡 Idea     | 0%         | Low      | Find datasets           |
| Bioinformatics        | 💡 Idea     | 0%         | Low      | Design UI               |
| Geoscience            | 💡 Idea     | 0%         | Low      | Evaluate mapping libs   |

---

## 🛠️ Implementation Workflow

Para cada nuevo demo:

1. **Copiar plantilla**:

   ```bash
   cp -r _shared/templates/base-demo/ ./<new-demo>/
   ```

2. **Diseñar UI** (30 min):

   - Sketch en papel
   - Definir controles
   - Planear outputs

3. **Implementar Python** (2-3 hrs):

   - Escribir funciones core
   - Testear lógica
   - Optimizar performance

4. **Conectar JS** (1-2 hrs):

   - Event handlers
   - Llamadas a Python
   - Actualizar DOM

5. **Estilizar** (1 hr):

   - Ajustar CSS
   - Responsive design
   - Animaciones

6. **Documentar** (30 min):

   - README específico
   - Comentarios en código
   - Ejemplos de uso

7. **Probar** (1 hr):

   - Cross-browser testing
   - Edge cases
   - Performance

8. **Deploy** (15 min):
   - Push a GitHub
   - Verificar en Pages
   - Probar iframe

---

## 📝 Notes & Ideas

### Possible Extensions

- **Interactive Tutorials**: Guías paso a paso dentro de cada demo
- **Export Functionality**: Guardar resultados/gráficos
- **Share Links**: URL con parámetros para compartir configuraciones
- **Jupyter Integration**: Opción de abrir en JupyterLite
- **Code Editor**: Ver/editar el Python code en vivo
- **Mobile Optimization**: Touch-friendly controls

### Community Contributions

Ideas de la comunidad:

- Physics simulations (pendulum, projectile motion)
- Chemistry molecular viewer
- Economics models (supply/demand curves)
- Game theory simulators
- Cryptography demos

---

**Last Updated**: 2025-11-14  
**Next Review**: Cuando se complete Fase 2
