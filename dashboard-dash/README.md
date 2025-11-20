# 🎨 Dashboard Multi-página con Dash (Plotly)

Versión equivalente al dashboard de Panel, implementado con Dash para comparar ambas tecnologías.

## 📋 Características

- ✅ **4 páginas interactivas**: Home, Análisis, Time Series, Streaming
- ✅ **KPIs dinámicos**: Métricas actualizadas en tiempo real
- ✅ **Filtros reactivos**: Dropdowns, date pickers con callbacks múltiples
- ✅ **Streaming en vivo**: Actualización cada 2 segundos con control de pausa
- ✅ **Gráficos Plotly**: Barras, scatter, heatmap, series temporales
- ✅ **Diseño Bootstrap**: Responsivo y profesional

## 🚀 Instalación

```bash
# Instalar dependencias
pip install -r requirements.txt

# O instalar paquetes individuales
pip install dash dash-bootstrap-components plotly pandas numpy
```

## ▶️ Ejecutar Dashboard

```bash
python app.py
```

El dashboard estará disponible en: **http://localhost:8050**

## 📁 Estructura del Código

### Componentes principales:

1. **Layout Principal** (líneas 95-125)
   - Header con degradado
   - Tabs para navegación
   - Contenedor dinámico
   - Interval para streaming

2. **Callbacks** (líneas 127-150)
   - Renderizado dinámico de contenido
   - Control de interval según pestaña activa

3. **Página Home** (líneas 152-218)
   - 4 KPIs: Ventas, Ingresos, Productos, Regiones
   - Gráfico de tendencia temporal
   - Tabla top 10 transacciones

4. **Página Análisis** (líneas 220-330)
   - **Filtros**: Productos (multi), Regiones (multi), Rango de fechas
   - **Callback complejo**: 1 callback actualiza 3 gráficos simultáneamente
   - Gráfico de barras por producto
   - Scatter ventas vs precio
   - Heatmap producto-región

5. **Página Time Series** (líneas 332-435)
   - Selector de métricas (checkbox)
   - Gráfico multi-línea con overlay
   - Histogramas de distribución

6. **Página Streaming** (líneas 437-560)
   - Botón pause/resume
   - 4 indicadores numéricos actualizándose
   - 3 barras de progreso animadas
   - Log de eventos en tiempo real

## 🎯 Comparación vs Panel

| Aspecto | Panel | Dash (este proyecto) |
|---------|-------|---------------------|
| **Líneas de código** | 585 | 560 |
| **Callbacks** | Decorador `@pn.depends` | Decorador `@app.callback` |
| **Filtros reactivos** | Widgets + `.interactive()` | Inputs → Outputs explícitos |
| **Streaming** | `pn.state.add_periodic_callback` | `dcc.Interval` + callback |
| **Multi-página** | `pn.Tabs` | `dcc.Tabs` |
| **Gráficos** | hvPlot/HoloViews | Plotly (px + go) |
| **Estilos** | Templates Panel | Bootstrap + CSS inline |

## 🔥 Ventajas de esta implementación Dash

1. **Callback único multi-output** (línea 268):
   ```python
   @app.callback(
       [Output('grafico-barras', 'figure'),
        Output('grafico-scatter', 'figure'),
        Output('grafico-heatmap', 'figure')],
       [Input('filtro-productos', 'value'), ...]
   )
   ```
   → Un solo callback actualiza 3 gráficos eficientemente

2. **Control preciso del streaming** (líneas 531-558):
   - Pausa/resume sin recargar página
   - Estado persistente con `dcc.Store`
   - Interval activable/desactivable

3. **Gráficos Plotly nativos**:
   - Mejor rendimiento que conversiones
   - Interactividad superior (hover, zoom, pan)
   - Subplots y overlays fáciles

## 📊 Características avanzadas

### 1. Pattern matching callbacks (no usado aquí, pero posible)
```python
@app.callback(
    Output({'type': 'grafico', 'index': ALL}, 'figure'),
    Input('actualizar-todos', 'n_clicks')
)
```

### 2. Clientside callbacks (JavaScript)
Para actualizaciones ultra-rápidas sin Python

### 3. Long callbacks
Para procesos que toman >30 segundos

## 🛠️ Personalización

### Cambiar tema Bootstrap:
```python
app = Dash(__name__, external_stylesheets=[dbc.themes.DARKLY])
# Opciones: BOOTSTRAP, CERULEAN, COSMO, CYBORG, DARKLY, FLATLY, etc.
```

### Ajustar frecuencia de streaming:
```python
dcc.Interval(interval=5000)  # 5 segundos en vez de 2
```

### Agregar nueva página:
1. Crear función `layout_nueva_pagina()`
2. Agregar Tab en línea 117
3. Agregar caso en callback línea 135

## 🚀 Deploy

### Opción 1: Render.com (gratis)
```bash
# Crear cuenta en Render
# Conectar repo GitHub
# Render auto-detecta Dash app
```

### Opción 2: Heroku
```bash
# Crear Procfile
web: gunicorn app:server
```

### Opción 3: PythonAnywhere
```bash
# Subir archivos
# Configurar WSGI
```

## 📝 Notas técnicas

- **Puerto predeterminado**: 8050 (vs 5007 en Panel)
- **Debug mode**: `app.run(debug=True)` recarga automáticamente
- **Productión**: Usar `gunicorn` en vez de `app.run()`
- **Estado**: Dash no tiene estado persistente entre callbacks (usar `dcc.Store`)

## 🎓 Recursos

- [Dash Documentation](https://dash.plotly.com/)
- [Dash Bootstrap Components](https://dash-bootstrap-components.opensource.faculty.ai/)
- [Plotly Graph Objects](https://plotly.com/python/graph-objects/)
- [Dash Gallery](https://dash.gallery/)
