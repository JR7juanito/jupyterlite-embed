# ⚠️ Problemas Conocidos - JupyterLite

## Error más común: `!pip install aed-utilities`

### 🔴 Problema
Al ejecutar algunos notebooks verás este error:

```python
!pip install aed-utilities
```

```
OSError: Not available
```

### ✅ Solución Simple
**Simplemente comenta o elimina esa línea** en el notebook:

```python
# !pip install aed-utilities
# import aed_utilities as aed
```

La mayoría de los notebooks funcionan perfectamente sin este módulo.

---

## ¿Por qué pasa esto?

JupyterLite corre **completamente en tu navegador** usando WebAssembly (Pyodide). No tiene acceso al sistema operativo, por lo que:

- ❌ No funciona `!pip install`
- ❌ No funciona `!apt-get`
- ❌ No funcionan comandos del sistema
- ✅ SÍ funcionan: `numpy`, `matplotlib`, `pandas`, `scipy`

---

## Alternativa con micropip

Si necesitas instalar un paquete que **SÍ existe en PyPI** con wheels compatibles:

```python
import micropip
await micropip.install('nombre-paquete')
```

⚠️ No todos los paquetes son compatibles con Pyodide.

---

## Si necesitas todas las funcionalidades

Para usar el curso completo con `aed-utilities`:

1. **Google Colab** (recomendado): https://github.com/ivansipiran/AED-Apuntes
2. **Jupyter local**: Clona el repo y ejecuta localmente

---

## Paquetes disponibles en JupyterLite

Los siguientes paquetes **SÍ funcionan**:
- ✅ numpy
- ✅ matplotlib
- ✅ pandas
- ✅ scipy
- ✅ scikit-learn (parcial)
- ✅ sympy

Ver lista completa: https://pyodide.org/en/stable/usage/packages-in-pyodide.html
