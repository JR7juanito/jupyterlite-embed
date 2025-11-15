"""
Dashboard Multi-página con Dash (Plotly)
Versión equivalente al dashboard de Panel
"""

from dash import Dash, html, dcc, Input, Output, State, callback_context, dash_table
import dash_bootstrap_components as dbc
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Inicializar app con tema Bootstrap OSCURO
app = Dash(__name__, external_stylesheets=[dbc.themes.DARKLY], suppress_callback_exceptions=True)
app.title = "Dashboard Dash - Multi-página"

# Exponer server para Render.com
server = app.server

# CSS personalizado para modo oscuro del debug menu
app.index_string = '''
<!DOCTYPE html>
<html>
    <head>
        {%metas%}
        <title>{%title%}</title>
        {%favicon%}
        {%css%}
        <style>
            /* Modo oscuro para el debug menu de Dash */
            .dash-debug-menu__outer {
                background-color: #1a1a2e !important;
                border: 1px solid rgba(0, 255, 255, 0.3) !important;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.2), 0 0 40px rgba(255, 0, 255, 0.1) !important;
                color: #00ffff !important;
            }
            .dash-debug-menu__button {
                color: #00ffff !important;
                background-color: transparent !important;
            }
            .dash-debug-menu__button:hover {
                background-color: rgba(0, 255, 255, 0.1) !important;
            }
            .dash-debug-menu__divider {
                background-color: rgba(0, 255, 255, 0.3) !important;
            }
            .dash-debug-menu__version,
            .dash-debug-menu__status {
                color: #adb5bd !important;
            }
            .dash-debug-menu__toggle {
                background-color: #1a1a2e !important;
                border: 1px solid rgba(0, 255, 255, 0.3) !important;
                color: #00ffff !important;
            }
            .dash-debug-menu__toggle:hover {
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.5) !important;
            }
            
            /* Animación de fondo cyberpunk */
            @keyframes cyber-grid {
                0% { background-position: 0 0; }
                100% { background-position: 50px 50px; }
            }
            
            #topbar {
                background-image: 
                    linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, 0.05) 75%, rgba(255, 0, 255, 0.05) 76%, transparent 77%, transparent),
                    linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, 0.05) 75%, rgba(255, 0, 255, 0.05) 76%, transparent 77%, transparent);
                background-size: 50px 50px;
                animation: cyber-grid 2s linear infinite;
            }
            
            /* Tooltips del slider con fechas */
            .rc-slider-tooltip {
                z-index: 9999 !important;
            }
            
            /* Estilo personalizado para DatePickerRange */
            .custom-datepicker .DateInput {
                background-color: #1a1a2e !important;
            }
            .custom-datepicker .DateInput_input {
                color: #00ffff !important;
                background-color: #1a1a2e !important;
                border-bottom: 2px solid #ff00ff !important;
                font-weight: bold !important;
                font-size: 14px !important;
            }
            .custom-datepicker .DateInput_input::placeholder {
                color: #667eea !important;
            }
            .custom-datepicker .DateRangePickerInput {
                background-color: #1a1a2e !important;
                border: 2px solid #ff00ff !important;
                border-radius: 8px !important;
            }
            .custom-datepicker .DateRangePickerInput_arrow {
                color: #ff00ff !important;
            }
            .CalendarDay__selected,
            .CalendarDay__selected:active,
            .CalendarDay__selected:hover {
                background: linear-gradient(135deg, #667eea 0%, #f093fb 100%) !important;
                border: 1px solid #ff00ff !important;
            }
            .CalendarDay__selected_span {
                background: rgba(102, 126, 234, 0.3) !important;
                border: 1px solid rgba(255, 0, 255, 0.3) !important;
            }
            .DayPickerKeyboardShortcuts_show__bottomRight::before {
                border-right-color: #667eea !important;
            }
            
            /* Animación hover en botones del sidebar */
            .sidebar-btn-label {
                position: absolute;
                left: 65px;
                top: 50%;
                transform: translateY(-50%) rotate(0deg);
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid;
                border-radius: 8px;
                padding: 8px 12px;
                white-space: nowrap;
                writing-mode: vertical-rl;
                text-orientation: mixed;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s, transform 0.3s;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
                z-index: 1001;
            }
            
            .sidebar-btn-container:hover .sidebar-btn-label {
                opacity: 1;
                transform: translateY(-50%) translateX(5px);
            }
            
            @keyframes glitch-slide {
                0% { transform: translateX(0) skewX(0deg); }
                25% { transform: translateX(-5px) skewX(-2deg); opacity: 0.9; }
                50% { transform: translateX(5px) skewX(2deg); opacity: 1; }
                75% { transform: translateX(-3px) skewX(-1deg); opacity: 0.95; }
                100% { transform: translateX(0) skewX(0deg); opacity: 0.8; }
            }
            
            @keyframes glitch-text {
                0%, 90%, 100% { 
                    transform: translate(0); 
                    text-shadow: 0 0 10px #00ffff;
                }
                20% { 
                    transform: translate(-2px, 2px); 
                    text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff;
                }
                40% { 
                    transform: translate(-2px, -2px); 
                    text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff;
                }
                60% { 
                    transform: translate(2px, 2px); 
                    text-shadow: -2px 2px #ff00ff, 2px -2px #00ffff;
                }
                80% { 
                    transform: translate(2px, -2px); 
                    text-shadow: 2px 2px #ff00ff, -2px -2px #00ffff;
                }
            }
            
            @keyframes typing {
                from { width: 0; }
                to { width: 100%; }
            }
        </style>
    </head>
    <body>
        {%app_entry%}
        <footer>
            {%config%}
            {%scripts%}
            {%renderer%}
        </footer>
    </body>
</html>
'''

# ==================== GENERACIÓN DE DATOS ====================

def generar_datos_ventas():
    """Genera datos de ventas simulados (90 días)"""
    # No usar seed fijo para permitir randomización
    fecha_inicio = datetime.now() - timedelta(days=90)
    
    datos = []
    productos = ['Laptop', 'Mouse', 'Teclado', 'Monitor', 'Audífonos']
    regiones = ['Norte', 'Sur', 'Este', 'Oeste']
    
    for i in range(500):
        fecha = fecha_inicio + timedelta(days=np.random.randint(0, 90))
        datos.append({
            'fecha': fecha,
            'producto': np.random.choice(productos),
            'region': np.random.choice(regiones),
            'ventas': np.random.randint(100, 1000),
            'cantidad': np.random.randint(1, 20),
            'precio': np.random.uniform(50, 500)
        })
    
    df = pd.DataFrame(datos)
    df['ingresos'] = df['ventas'] * df['precio']
    return df

def generar_datos_timeseries():
    """Genera datos de series temporales (30 días, frecuencia horaria)"""
    np.random.seed(42)
    fecha_inicio = datetime.now() - timedelta(days=30)
    fechas = pd.date_range(start=fecha_inicio, periods=30*24, freq='h')
    
    # Generar patrones realistas
    tiempo = np.arange(len(fechas))
    
    df = pd.DataFrame({
        'fecha': fechas,
        'metrica_a': 100 + 20 * np.sin(tiempo / 24) + np.random.normal(0, 5, len(fechas)),
        'metrica_b': 200 + 30 * np.cos(tiempo / 12) + np.random.normal(0, 8, len(fechas)),
        'metrica_c': 150 + 15 * np.sin(tiempo / 36) + np.random.normal(0, 6, len(fechas)),
        'metrica_d': 180 + 25 * np.cos(tiempo / 48) + np.random.normal(0, 7, len(fechas))
    })
    
    return df

# Generar datos globales
df_ventas = generar_datos_ventas()
df_timeseries = generar_datos_timeseries()

# ==================== ESTILOS ====================

CARD_STYLE = {
    'box-shadow': '0 0 20px rgba(0, 255, 255, 0.2), 0 0 40px rgba(255, 0, 255, 0.1)',
    'border-radius': '12px',
    'padding': '20px',
    'margin-bottom': '20px',
    'background': 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
    'border': '2px solid',
    'border-image': 'linear-gradient(90deg, #00ffff, #ff00ff, #00ffff) 1',
    'position': 'relative',
    'overflow': 'hidden'
}

HEADER_STYLE = {
    'background': 'linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #ff00ff 100%)',
    'padding': '25px',
    'color': 'white',
    'margin-bottom': '30px',
    'border-radius': '12px',
    'box-shadow': '0 0 30px rgba(255, 0, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)',
    'border': '2px solid #00ffff',
    'text-shadow': '0 0 10px rgba(255, 255, 255, 0.8)'
}

# ==================== COMPONENTES REUSABLES ====================

def crear_tarjeta_kpi(titulo, valor, icono="📊"):
    """Crea una tarjeta KPI"""
    # Reducir font-size si es un valor de ingresos largo
    font_size = '20px' if '$' in str(valor) and len(str(valor)) > 10 else '28px'
    return dbc.Card([
        dbc.CardBody([
            html.H6(f"{icono} {titulo}", className="text-muted mb-2", style={'color': '#adb5bd'}),
            html.H3(valor, className="mb-0", style={'color': '#667eea', 'font-weight': 'bold', 'font-size': font_size})
        ])
    ], style=CARD_STYLE)

# ==================== LAYOUT PRINCIPAL ====================

# Estilos del topbar
TOPBAR_STYLE = {
    'position': 'fixed',
    'top': 0,
    'left': '80px',
    'right': 0,
    'height': '70px',
    'padding': '15px 30px',
    'background': 'linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
    'border-bottom': '2px solid',
    'border-image': 'linear-gradient(90deg, #00ffff, #ff00ff, #00ffff) 1',
    'box-shadow': '0 0 30px rgba(0, 255, 255, 0.2)',
    'z-index': '999',
    'display': 'flex',
    'align-items': 'center',
    'justify-content': 'center'
}

# Estilos del sidebar minimalista
SIDEBAR_STYLE = {
    'position': 'fixed',
    'top': 0,
    'left': 0,
    'bottom': 0,
    'width': '80px',
    'padding': '20px 10px',
    'background': 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
    'border-right': '2px solid',
    'border-image': 'linear-gradient(180deg, #00ffff, #ff00ff, #00ffff) 1',
    'box-shadow': '0 0 30px rgba(0, 255, 255, 0.2)',
    'overflow-y': 'auto',
    'z-index': '1000',
    'display': 'flex',
    'flex-direction': 'column',
    'align-items': 'center'
}

CONTENT_STYLE = {
    'margin-left': '80px',
    'margin-top': '70px',
    'padding': '30px',
    'background': 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
    'min-height': 'calc(100vh - 70px)'
}

# Topbar
topbar = html.Div([
    html.H1("CYBER DASHBOARD", id='titulo-animado', style={
        'margin': '0',
        'padding-left': '20px',
        'background': 'linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #ff00ff 100%)',
        '-webkit-background-clip': 'text',
        'background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        'font-weight': 'bold',
        'font-size': '32px',
        'letter-spacing': '3px',
        'display': 'inline-block',
        'vertical-align': 'middle'
    })
], style=TOPBAR_STYLE, id='topbar')

# Sidebar minimalista con navegación vertical (solo emojis)
sidebar = html.Div([
    # Logo pequeño
    html.Div("⚡", style={
        'font-size': '36px',
        'color': '#00ffff',
        'text-shadow': '0 0 15px #00ffff',
        'margin-bottom': '30px',
        'cursor': 'pointer'
    }),
    
    html.Hr(style={'border-color': '#00ffff', 'opacity': '0.3', 'margin': '10px 0', 'width': '50px'}),
    
    # Botones de navegación (solo emojis con tags)
    html.Div([
        html.Div([
            dbc.Button(
                "🏠",
                id='btn-nav-home',
                style={
                    'background': 'rgba(0, 212, 255, 0.2)',
                    'border': '2px solid #00ffff',
                    'border-radius': '12px',
                    'width': '55px',
                    'height': '55px',
                    'font-size': '28px',
                    'padding': '0',
                    'transition': 'all 0.3s',
                    'box-shadow': '0 0 10px rgba(0, 255, 255, 0.3)'
                }
            ),
            html.Div("HOME", style={
                'font-size': '9px',
                'color': '#00ffff',
                'font-weight': 'bold',
                'text-align': 'center',
                'margin-top': '5px',
                'letter-spacing': '1px'
            })
        ], className="sidebar-btn-container mb-4", style={'display': 'flex', 'flex-direction': 'column', 'align-items': 'center'}),
        
        html.Div([
            dbc.Button(
                "📊",
                id='btn-nav-analisis',
                style={
                    'background': 'rgba(102, 126, 234, 0.2)',
                    'border': '2px solid #667eea',
                    'border-radius': '12px',
                    'width': '55px',
                    'height': '55px',
                    'font-size': '28px',
                    'padding': '0',
                    'transition': 'all 0.3s',
                    'box-shadow': '0 0 10px rgba(102, 126, 234, 0.3)'
                }
            ),
            html.Div("ANÁLISIS", style={
                'font-size': '8px',
                'color': '#667eea',
                'font-weight': 'bold',
                'text-align': 'center',
                'margin-top': '5px',
                'letter-spacing': '0.5px'
            })
        ], className="sidebar-btn-container mb-4", style={'display': 'flex', 'flex-direction': 'column', 'align-items': 'center'}),
        
        html.Div([
            dbc.Button(
                "📈",
                id='btn-nav-timeseries',
                style={
                    'background': 'rgba(240, 147, 251, 0.2)',
                    'border': '2px solid #f093fb',
                    'border-radius': '12px',
                    'width': '55px',
                    'height': '55px',
                    'font-size': '28px',
                    'padding': '0',
                    'transition': 'all 0.3s',
                    'box-shadow': '0 0 10px rgba(240, 147, 251, 0.3)'
                }
            ),
            html.Div("TIME", style={
                'font-size': '9px',
                'color': '#f093fb',
                'font-weight': 'bold',
                'text-align': 'center',
                'margin-top': '5px',
                'letter-spacing': '1px'
            })
        ], className="sidebar-btn-container mb-4", style={'display': 'flex', 'flex-direction': 'column', 'align-items': 'center'}),
        
        html.Div([
            dbc.Button(
                "📡",
                id='btn-nav-streaming',
                style={
                    'background': 'rgba(0, 255, 136, 0.2)',
                    'border': '2px solid #00ff88',
                    'border-radius': '12px',
                    'width': '55px',
                    'height': '55px',
                    'font-size': '28px',
                    'padding': '0',
                    'transition': 'all 0.3s',
                    'box-shadow': '0 0 10px rgba(0, 255, 136, 0.3)'
                }
            ),
            html.Div("STREAM", style={
                'font-size': '8px',
                'color': '#00ff88',
                'font-weight': 'bold',
                'text-align': 'center',
                'margin-top': '5px',
                'letter-spacing': '0.5px'
            })
        ], className="sidebar-btn-container mb-4", style={'display': 'flex', 'flex-direction': 'column', 'align-items': 'center'}),
    ], style={'display': 'flex', 'flex-direction': 'column', 'align-items': 'center'})
], style=SIDEBAR_STYLE)

# Contenido principal
content = html.Div(id='page-content', style=CONTENT_STYLE)

# Layout principal
app.layout = html.Div([
    topbar,
    sidebar,
    content,
    
    # Stores y componentes
    dcc.Store(id='streaming-estado', data='stopped'),
    dcc.Interval(
        id='interval-streaming',
        interval=2000,
        n_intervals=0,
        disabled=True
    ),
    dcc.Store(id='current-page', data='home')
])

# ==================== CALLBACKS ====================

# Callback para navegación y actualización de indicador de página activa
@app.callback(
    [Output('page-content', 'children'),
     Output('current-page', 'data'),
     Output('btn-nav-home', 'style'),
     Output('btn-nav-analisis', 'style'),
     Output('btn-nav-timeseries', 'style'),
     Output('btn-nav-streaming', 'style')],
    [Input('btn-nav-home', 'n_clicks'),
     Input('btn-nav-analisis', 'n_clicks'),
     Input('btn-nav-timeseries', 'n_clicks'),
     Input('btn-nav-streaming', 'n_clicks')],
    State('current-page', 'data'),
    prevent_initial_call=False
)
def navigate(n_home, n_analisis, n_timeseries, n_streaming, current):
    """Maneja la navegación entre páginas y actualiza estilos de botones"""
    ctx = callback_context
    
    # Estilos base para cada botón
    style_home_base = {
        'background': 'rgba(0, 212, 255, 0.2)',
        'border': '2px solid #00ffff',
        'border-radius': '12px',
        'width': '55px',
        'height': '55px',
        'font-size': '28px',
        'padding': '0',
        'transition': 'all 0.3s',
        'box-shadow': '0 0 10px rgba(0, 255, 255, 0.3)'
    }
    
    style_analisis_base = {
        'background': 'rgba(102, 126, 234, 0.2)',
        'border': '2px solid #667eea',
        'border-radius': '12px',
        'width': '55px',
        'height': '55px',
        'font-size': '28px',
        'padding': '0',
        'transition': 'all 0.3s',
        'box-shadow': '0 0 10px rgba(102, 126, 234, 0.3)'
    }
    
    style_time_base = {
        'background': 'rgba(240, 147, 251, 0.2)',
        'border': '2px solid #f093fb',
        'border-radius': '12px',
        'width': '55px',
        'height': '55px',
        'font-size': '28px',
        'padding': '0',
        'transition': 'all 0.3s',
        'box-shadow': '0 0 10px rgba(240, 147, 251, 0.3)'
    }
    
    style_stream_base = {
        'background': 'rgba(0, 255, 136, 0.2)',
        'border': '2px solid #00ff88',
        'border-radius': '12px',
        'width': '55px',
        'height': '55px',
        'font-size': '28px',
        'padding': '0',
        'transition': 'all 0.3s',
        'box-shadow': '0 0 10px rgba(0, 255, 136, 0.3)'
    }
    
    # Estilo para botón activo (borde más grueso, brillo intenso, fondo más opaco)
    def activar_estilo(estilo_base, color_rgb):
        estilo_activo = estilo_base.copy()
        estilo_activo['border'] = '4px solid'
        estilo_activo['background'] = f'rgba{color_rgb}'
        estilo_activo['box-shadow'] = estilo_activo['box-shadow'].replace('0.3)', '0.8)')
        estilo_activo['box-shadow'] = estilo_activo['box-shadow'].replace('10px', '20px')
        return estilo_activo
    
    if not ctx.triggered:
        # Inicial: Home activo
        return (layout_home(), 'home', 
                activar_estilo(style_home_base, '(0, 212, 255, 0.5)'),
                style_analisis_base, style_time_base, style_stream_base)
    
    button_id = ctx.triggered[0]['prop_id'].split('.')[0]
    
    if button_id == 'btn-nav-home':
        return (layout_home(), 'home',
                activar_estilo(style_home_base, '(0, 212, 255, 0.5)'),
                style_analisis_base, style_time_base, style_stream_base)
    elif button_id == 'btn-nav-analisis':
        return (layout_analisis(), 'analisis',
                style_home_base,
                activar_estilo(style_analisis_base, '(102, 126, 234, 0.5)'),
                style_time_base, style_stream_base)
    elif button_id == 'btn-nav-timeseries':
        return (layout_timeseries(), 'timeseries',
                style_home_base, style_analisis_base,
                activar_estilo(style_time_base, '(240, 147, 251, 0.5)'),
                style_stream_base)
    elif button_id == 'btn-nav-streaming':
        return (layout_streaming(), 'streaming',
                style_home_base, style_analisis_base, style_time_base,
                activar_estilo(style_stream_base, '(0, 255, 136, 0.5)'))
    
    return (layout_home(), 'home',
            activar_estilo(style_home_base, '(0, 212, 255, 0.5)'),
            style_analisis_base, style_time_base, style_stream_base)

@app.callback(
    Output('interval-streaming', 'disabled'),
    Input('current-page', 'data')
)
def controlar_interval(page):
    """Activa/desactiva el interval según la página"""
    return page != 'streaming'

# ==================== LAYOUT: HOME ====================

def layout_home():
    """Layout de la página Home"""
    
    # Calcular KPIs
    total_ventas = df_ventas['ventas'].sum()
    total_ingresos = df_ventas['ingresos'].sum()
    num_productos = df_ventas['producto'].nunique()
    num_regiones = df_ventas['region'].nunique()
    
    # Datos para gráfico de tendencia
    df_tendencia = df_ventas.groupby(df_ventas['fecha'].dt.date)['ingresos'].sum().reset_index()
    
    # Top transacciones
    df_top = df_ventas.nlargest(10, 'ingresos')[['fecha', 'producto', 'region', 'ventas', 'ingresos']].copy()
    df_top['fecha'] = df_top['fecha'].dt.strftime('%Y-%m-%d')
    df_top['ingresos'] = df_top['ingresos'].round(2)
    
    return html.Div([
        # Título y descripción de la página
        html.Div([
            html.H2("🏠 HOME - Panel de Control Principal", 
                   style={'color': '#00ffff', 'text-shadow': '0 0 10px #00ffff', 'margin-bottom': '10px'}),
            html.P("Vista general de las métricas clave del sistema. Monitorea KPIs principales, tendencias de ingresos y top transacciones.",
                  style={'color': '#adb5bd', 'font-size': '16px', 'margin-bottom': '30px'})
        ]),
        
        # KPIs
        dbc.Row([
            dbc.Col(crear_tarjeta_kpi("Total Ventas", f"{total_ventas:,}"), width=3),
            dbc.Col(crear_tarjeta_kpi("Ingresos Totales", f"${total_ingresos:,.0f}", "💰"), width=3),
            dbc.Col(crear_tarjeta_kpi("Productos", f"{num_productos}", "📦"), width=3),
            dbc.Col(crear_tarjeta_kpi("Regiones", f"{num_regiones}", "🌍"), width=3),
        ], className="mb-4"),
        
        # Gráfico de tendencia con botón random flotante
        dbc.Card([
            dbc.CardBody([
                html.H5("📈 Tendencia de Ingresos", className="mb-3"),
                html.Div([
                    dcc.Graph(
                        figure=px.line(
                            df_tendencia, 
                            x='fecha', 
                            y='ingresos',
                            title='Ingresos por Día',
                            labels={'fecha': 'Fecha', 'ingresos': 'Ingresos ($)'}
                        ).update_layout(
                            hovermode='x unified',
                            template='plotly_dark'
                        )
                    ),
                    # Botón flotante posicionado absolutamente dentro del gráfico
                    dbc.Button(
                        "🎲",
                        id='btn-randomizar',
                        style={
                            'position': 'absolute',
                            'top': '55px',
                            'right': '20px',
                            'border-radius': '50%',
                            'width': '45px',
                            'height': '45px',
                            'font-size': '22px',
                            'padding': '0',
                            'background': 'linear-gradient(135deg, #ffd700, #ff8800)',
                            'border': '2px solid #ffd700',
                            'box-shadow': '0 0 20px rgba(255, 215, 0, 0.6)',
                            'z-index': '1000',
                            'transition': 'transform 0.2s',
                            'cursor': 'pointer'
                        }
                    )
                ], style={'position': 'relative'})
            ])
        ], style=CARD_STYLE, className="mb-4"),
        
        # Tabla de top transacciones
        dbc.Card([
            dbc.CardBody([
                html.H5("🏆 Top 10 Transacciones", className="mb-3"),
                dash_table.DataTable(
                    data=df_top.to_dict('records'),
                    columns=[{'name': col.title(), 'id': col} for col in df_top.columns],
                    style_table={'overflowX': 'auto'},
                    style_cell={
                        'textAlign': 'left',
                        'padding': '10px',
                        'font-family': 'Arial',
                        'backgroundColor': '#303030',
                        'color': 'white'
                    },
                    style_header={
                        'backgroundColor': '#1a1a1a',
                        'color': 'white',
                        'fontWeight': 'bold'
                    },
                    style_data_conditional=[
                        {
                            'if': {'row_index': 'odd'},
                            'backgroundColor': '#404040'
                        }
                    ],
                    page_size=10
                )
            ])
        ], style=CARD_STYLE)
    ])

# ==================== LAYOUT: ANÁLISIS ====================

def layout_analisis():
    """Layout de la página Análisis"""
    
    # Calcular rango de días para el slider
    fecha_min = df_ventas['fecha'].min()
    fecha_max = df_ventas['fecha'].max()
    total_dias = (fecha_max - fecha_min).days
    
    return html.Div([
        # Título y descripción de la página
        html.Div([
            html.H2("📊 ANÁLISIS - Exploración Interactiva de Datos", 
                   style={'color': '#667eea', 'text-shadow': '0 0 10px #667eea', 'margin-bottom': '10px'}),
            html.P("Filtra y analiza datos por productos, regiones y rangos temporales. Visualiza patrones mediante gráficos de barras, dispersión y mapas de calor.",
                  style={'color': '#adb5bd', 'font-size': '16px', 'margin-bottom': '30px'})
        ]),
        
        # Filtros en una sola fila horizontal (3 columnas a la misma altura)
        dbc.Row([
            # Productos
            dbc.Col([
                dbc.Card([
                    dbc.CardBody([
                        dbc.Button(
                            [html.Span("▶", id="triangle-productos", style={'margin-right': '10px', 'transition': 'transform 0.3s'}), "📦 Productos"],
                            id="collapse-productos-button",
                            color="primary",
                            className="mb-2",
                            n_clicks=0,
                            style={
                                'width': '100%',
                                'background': 'linear-gradient(90deg, #00d4ff 0%, #0099cc 100%)',
                                'border': '1px solid #00ffff',
                                'box-shadow': '0 0 10px rgba(0, 255, 255, 0.3)',
                                'font-weight': 'bold'
                            }
                        ),
                        dbc.Collapse(
                            dbc.Card(dbc.CardBody([
                                dcc.Checklist(
                                    id='filtro-productos',
                                    options=[{'label': f' {p}', 'value': p} for p in sorted(df_ventas['producto'].unique())],
                                    value=df_ventas['producto'].unique().tolist(),
                                    style={'color': '#00ffff'},
                                    labelStyle={'display': 'block', 'margin-bottom': '8px'}
                                )
                            ]), style={'background-color': '#1a1a2e', 'border': '1px solid #00ffff'}),
                            id="collapse-productos",
                            is_open=False
                        )
                    ])
                ], style=CARD_STYLE)
            ], width=4),
            
            # Regiones
            dbc.Col([
                dbc.Card([
                    dbc.CardBody([
                        dbc.Button(
                            [html.Span("▶", id="triangle-regiones", style={'margin-right': '10px', 'transition': 'transform 0.3s'}), "🌍 Regiones"],
                            id="collapse-regiones-button",
                            color="success",
                            className="mb-2",
                            n_clicks=0,
                            style={
                                'width': '100%',
                                'background': 'linear-gradient(90deg, #00ff88 0%, #00cc66 100%)',
                                'border': '1px solid #00ff88',
                                'box-shadow': '0 0 10px rgba(0, 255, 136, 0.3)',
                                'font-weight': 'bold'
                            }
                        ),
                        dbc.Collapse(
                            dbc.Card(dbc.CardBody([
                                dcc.Checklist(
                                    id='filtro-regiones',
                                    options=[{'label': f' {r}', 'value': r} for r in sorted(df_ventas['region'].unique())],
                                    value=df_ventas['region'].unique().tolist(),
                                    style={'color': '#00ff88'},
                                    labelStyle={'display': 'block', 'margin-bottom': '8px'}
                                )
                            ]), style={'background-color': '#1a1a2e', 'border': '1px solid #00ff88'}),
                            id="collapse-regiones",
                            is_open=False
                        )
                    ])
                ], style=CARD_STYLE)
            ], width=4),
            
            # Períodos Temporales
            dbc.Col([
                dbc.Card([
                    dbc.CardBody([
                        dbc.Button(
                            [html.Span("▶", id="triangle-fechas", style={'margin-right': '10px', 'transition': 'transform 0.3s'}), "📅 Períodos Temporales"],
                            id="collapse-fechas-button",
                            color="warning",
                            className="mb-2",
                            n_clicks=0,
                            style={
                                'width': '100%',
                                'background': 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                                'border': '1px solid #f093fb',
                                'box-shadow': '0 0 10px rgba(240, 147, 251, 0.3)',
                                'font-weight': 'bold'
                            }
                        ),
                        dbc.Collapse(
                            dbc.Card(dbc.CardBody([
                                dbc.Row([
                                    # Opciones de radio a la izquierda
                                    dbc.Col([
                                        dcc.RadioItems(
                                            id='filtro-fechas-radio',
                                            options=[
                                                {'label': ' 📅 Última Semana (7 días)', 'value': '7dias'},
                                                {'label': ' 📅 Último Mes (30 días)', 'value': '30dias'},
                                                {'label': ' 📅 Trimestre Completo (90 días)', 'value': '90dias'},
                                                {'label': ' 📅 Primeros 30 Días', 'value': 'primeros30'},
                                                {'label': ' 📅 Últimos 30 Días', 'value': 'ultimos30'}
                                            ],
                            value='90dias',
                                            style={'color': '#f093fb'},
                                            labelStyle={'display': 'block', 'margin-bottom': '8px'}
                                        )
                                    ], width=6),
                                    # Timeline simplificado a la derecha
                                    dbc.Col([
                                        html.Div(id='info-periodo', style={'color': '#adb5bd', 'font-size': '12px'})
                                    ], width=6)
                                ])
                            ]), style={'background-color': '#1a1a2e', 'border': '1px solid #f093fb'}),
                            id="collapse-fechas",
                            is_open=False
                        ),
                        dcc.Store(id='filtro-fechas', data={'start': 0, 'end': total_dias}),
                        dcc.Store(id='slider-fecha-min', data=fecha_min.isoformat()),
                        dcc.Store(id='slider-total-dias', data=total_dias)
                    ])
                ], style=CARD_STYLE)
            ], width=4)
        ], className="mb-4"),
        
        # Gráficos
        dbc.Row([
            dbc.Col([
                dbc.Card([
                    dbc.CardBody([
                        html.H5("📊 Ventas por Producto", className="mb-3"),
                        dcc.Graph(id='grafico-barras')
                    ])
                ], style=CARD_STYLE)
            ], width=6),
            dbc.Col([
                dbc.Card([
                    dbc.CardBody([
                        html.H5("🎯 Dispersión Ventas vs Precio", className="mb-3"),
                        dcc.Graph(id='grafico-scatter')
                    ])
                ], style=CARD_STYLE)
            ], width=6)
        ], className="mb-4"),
        
        dbc.Row([
            dbc.Col([
                dbc.Card([
                    dbc.CardBody([
                        html.H5("🔥 Mapa de Calor Producto-Región", className="mb-3"),
                        dcc.Graph(id='grafico-heatmap')
                    ])
                ], style=CARD_STYLE)
            ], width=12)
        ])
    ])

# Callbacks para colapsar filtros y rotar triángulos
@app.callback(
    [Output("collapse-productos", "is_open"),
     Output("triangle-productos", "style")],
    Input("collapse-productos-button", "n_clicks"),
    State("collapse-productos", "is_open"),
    prevent_initial_call=True
)
def toggle_productos(n, is_open):
    nueva_apertura = not is_open if n else is_open
    estilo_triangulo = {'margin-right': '10px', 'transition': 'transform 0.3s', 'transform': 'rotate(90deg)' if nueva_apertura else 'rotate(0deg)', 'display': 'inline-block'}
    return nueva_apertura, estilo_triangulo

@app.callback(
    [Output("collapse-regiones", "is_open"),
     Output("triangle-regiones", "style")],
    Input("collapse-regiones-button", "n_clicks"),
    State("collapse-regiones", "is_open"),
    prevent_initial_call=True
)
def toggle_regiones(n, is_open):
    nueva_apertura = not is_open if n else is_open
    estilo_triangulo = {'margin-right': '10px', 'transition': 'transform 0.3s', 'transform': 'rotate(90deg)' if nueva_apertura else 'rotate(0deg)', 'display': 'inline-block'}
    return nueva_apertura, estilo_triangulo

@app.callback(
    [Output("collapse-fechas", "is_open"),
     Output("triangle-fechas", "style")],
    Input("collapse-fechas-button", "n_clicks"),
    State("collapse-fechas", "is_open"),
    prevent_initial_call=True
)
def toggle_fechas(n, is_open):
    nueva_apertura = not is_open if n else is_open
    estilo_triangulo = {'margin-right': '10px', 'transition': 'transform 0.3s', 'transform': 'rotate(90deg)' if nueva_apertura else 'rotate(0deg)', 'display': 'inline-block'}
    return nueva_apertura, estilo_triangulo

@app.callback(
    [Output('grafico-barras', 'figure'),
     Output('grafico-scatter', 'figure'),
     Output('grafico-heatmap', 'figure')],
    [Input('filtro-productos', 'value'),
     Input('filtro-regiones', 'value'),
     Input('filtro-fechas', 'data')]
)
def actualizar_graficos_analisis(productos, regiones, rango_fechas):
    """Actualiza todos los gráficos de análisis"""
    
    # Validar que hay filtros seleccionados
    if not productos or not regiones:
        fig_vacia = go.Figure()
        fig_vacia.add_annotation(
            text="Selecciona al menos un producto y una región",
            xref="paper", yref="paper",
            x=0.5, y=0.5, showarrow=False,
            font=dict(size=14, color="gray")
        )
        fig_vacia.update_layout(template='plotly_dark')
        return fig_vacia, fig_vacia, fig_vacia
    
    # Convertir rango a fechas
    fecha_min = df_ventas['fecha'].min()
    fecha_inicio = fecha_min + timedelta(days=rango_fechas['start'])
    fecha_fin = fecha_min + timedelta(days=rango_fechas['end'])
    
    # Filtrar datos
    df_filtrado = df_ventas[
        (df_ventas['producto'].isin(productos)) &
        (df_ventas['region'].isin(regiones)) &
        (df_ventas['fecha'] >= fecha_inicio) &
        (df_ventas['fecha'] <= fecha_fin)
    ]
    
    # Si no hay datos después del filtro, mostrar mensaje
    if len(df_filtrado) == 0:
        fig_vacia = go.Figure()
        fig_vacia.add_annotation(
            text=f"No hay datos para el rango seleccionado<br>Ajusta los filtros",
            xref="paper", yref="paper",
            x=0.5, y=0.5, showarrow=False,
            font=dict(size=14, color="orange")
        )
        fig_vacia.update_layout(template='plotly_dark')
        return fig_vacia, fig_vacia, fig_vacia
    
    # Gráfico de barras
    df_barras = df_filtrado.groupby('producto')['ventas'].sum().reset_index()
    fig_barras = px.bar(
        df_barras,
        x='producto',
        y='ventas',
        title='Ventas Totales por Producto',
        color='ventas',
        color_continuous_scale='Viridis'
    ).update_layout(template='plotly_dark')
    
    # Gráfico de dispersión
    fig_scatter = px.scatter(
        df_filtrado,
        x='ventas',
        y='precio',
        color='producto',
        size='cantidad',
        title='Relación Ventas-Precio',
        labels={'ventas': 'Ventas', 'precio': 'Precio ($)'}
    ).update_layout(template='plotly_dark')
    
    # Mapa de calor
    df_heatmap = df_filtrado.pivot_table(
        values='ingresos',
        index='producto',
        columns='region',
        aggfunc='sum',
        fill_value=0
    )
    
    fig_heatmap = px.imshow(
        df_heatmap,
        labels={'x': 'Región', 'y': 'Producto', 'color': 'Ingresos'},
        title='Ingresos por Producto y Región',
        color_continuous_scale='RdYlGn'
    ).update_layout(template='plotly_dark')
    
    return fig_barras, fig_scatter, fig_heatmap

# ==================== LAYOUT: TIME SERIES ====================

def layout_timeseries():
    """Layout de la página Time Series"""
    
    return html.Div([
        # Título y descripción de la página
        html.Div([
            html.H2("📈 TIME SERIES - Series Temporales", 
                   style={'color': '#f093fb', 'text-shadow': '0 0 10px #f093fb', 'margin-bottom': '10px'}),
            html.P("Visualiza la evolución temporal de múltiples métricas. Compara tendencias, analiza patrones estacionales y estudia distribuciones de valores.",
                  style={'color': '#adb5bd', 'font-size': '16px', 'margin-bottom': '30px'})
        ]),
        
        # Selector de métricas
        dbc.Card([
            dbc.CardBody([
                html.H5("📊 Seleccionar Métricas", className="mb-3"),
                dcc.Checklist(
                    id='selector-metricas',
                    options=[
                        {'label': html.Span(' Métrica A', style={'color': '#667eea', 'font-size': '22px', 'font-weight': 'bold', 'margin-left': '10px'}), 'value': 'metrica_a'},
                        {'label': html.Span(' Métrica B', style={'color': '#f093fb', 'font-size': '22px', 'font-weight': 'bold', 'margin-left': '10px'}), 'value': 'metrica_b'},
                        {'label': html.Span(' Métrica C', style={'color': '#4facfe', 'font-size': '22px', 'font-weight': 'bold', 'margin-left': '10px'}), 'value': 'metrica_c'},
                        {'label': html.Span(' Métrica D', style={'color': '#43e97b', 'font-size': '22px', 'font-weight': 'bold', 'margin-left': '10px'}), 'value': 'metrica_d'}
                    ],
                    value=['metrica_a', 'metrica_b'],
                    inline=True,
                    style={'font-size': '22px'},
                    inputStyle={'width': '22px', 'height': '22px', 'margin-right': '5px'},
                    labelStyle={'display': 'inline-block', 'margin-right': '40px'}
                )
            ])
        ], style=CARD_STYLE, className="mb-4"),
        
        # Slider de navegación temporal
        dbc.Card([
            dbc.CardBody([
                html.H5("🕐 Navegación Temporal", className="mb-3"),
                html.Div([
                    html.Label("Rango de tiempo visible:", style={'color': '#adb5bd', 'margin-bottom': '10px'}),
                    dcc.RangeSlider(
                        id='slider-tiempo',
                        min=0,
                        max=len(df_timeseries) - 1,
                        value=[0, len(df_timeseries) - 1],
                        marks={i: {'label': df_timeseries['fecha'].iloc[i].strftime('%d/%m') if i % 20 == 0 else '', 'style': {'color': '#667eea'}} for i in range(0, len(df_timeseries), 20)},
                        tooltip={"placement": "bottom", "always_visible": False},
                        updatemode='drag'
                    )
                ])
            ])
        ], style=CARD_STYLE, className="mb-4"),
        
        # Gráfico de series temporales
        dbc.Card([
            dbc.CardBody([
                html.H5("📈 Series Temporales", className="mb-3"),
                dcc.Graph(id='grafico-series')
            ])
        ], style=CARD_STYLE, className="mb-4"),
        
        # Gráfico de distribución
        dbc.Card([
            dbc.CardBody([
                html.H5("📊 Distribución de Valores", className="mb-3"),
                dcc.Graph(id='grafico-distribucion')
            ])
        ], style=CARD_STYLE)
    ])

@app.callback(
    [Output('grafico-series', 'figure'),
     Output('grafico-distribucion', 'figure')],
    [Input('selector-metricas', 'value'),
     Input('slider-tiempo', 'value')]
)
def actualizar_timeseries(metricas_seleccionadas, rango_tiempo):
    """Actualiza gráficos de series temporales con navegación por slider"""
    
    # Filtrar datos según el rango del slider
    df_filtrado = df_timeseries.iloc[rango_tiempo[0]:rango_tiempo[1]+1]
    
    # Gráfico de líneas múltiples
    fig_series = go.Figure()
    
    colores = {'metrica_a': '#667eea', 'metrica_b': '#f093fb', 
               'metrica_c': '#4facfe', 'metrica_d': '#43e97b'}
    
    for metrica in metricas_seleccionadas:
        fig_series.add_trace(go.Scatter(
            x=df_filtrado['fecha'],
            y=df_filtrado[metrica],
            mode='lines',
            name=metrica.replace('_', ' ').title(),
            line=dict(color=colores.get(metrica, '#667eea'), width=2)
        ))
    
    fig_series.update_layout(
        title='Evolución Temporal de Métricas',
        xaxis_title='Fecha',
        yaxis_title='Valor',
        hovermode='x unified',
        template='plotly_dark',
        legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1)
    )
    
    # Histogramas
    fig_dist = go.Figure()
    
    for metrica in metricas_seleccionadas:
        fig_dist.add_trace(go.Histogram(
            x=df_filtrado[metrica],
            name=metrica.replace('_', ' ').title(),
            opacity=0.7,
            marker_color=colores.get(metrica, '#667eea')
        ))
    
    fig_dist.update_layout(
        title='Distribución de Valores',
        xaxis_title='Valor',
        yaxis_title='Frecuencia',
        barmode='overlay',
        template='plotly_dark'
    )
    
    return fig_series, fig_dist

# ==================== LAYOUT: STREAMING ====================

def layout_streaming():
    """Layout de la página Streaming"""
    
    return html.Div([
        # Título y descripción de la página
        html.Div([
            html.H2("📡 STREAMING - Monitoreo en Tiempo Real", 
                   style={'color': '#00ff88', 'text-shadow': '0 0 10px #00ff88', 'margin-bottom': '10px'}),
            html.P("Monitorea métricas del sistema en vivo. Controla el flujo de datos (Play/Pause/Stop), visualiza indicadores de CPU, memoria, red y disco, y sigue procesos activos en tiempo real.",
                  style={'color': '#adb5bd', 'font-size': '16px', 'margin-bottom': '30px'})
        ]),
        
        # Controles y System Log en la misma fila (1/3 controles + 2/3 log)
        dbc.Row([
            dbc.Col([
                dbc.Card([
                    dbc.CardBody([
                        html.H5("⚙️ Controles de Monitoreo", className="mb-3"),
                        dbc.ButtonGroup([
                            dbc.Button(id='btn-play-pause', color='success', style={'font-size': '24px', 'padding': '15px 25px', 'min-width': '80px'}),
                            dbc.Button("⏹", id='btn-stop', color='danger', style={'font-size': '24px', 'padding': '15px 25px', 'min-width': '80px'})
                        ], className='mb-3', style={'gap': '10px'}),
                        html.Div([
                            html.Small("▶️ Reproducir", style={'color': '#00ff88', 'margin-right': '20px'}),
                            html.Small("⏹ Detener", style={'color': '#ff6b6b'})
                        ], style={'text-align': 'center', 'margin-top': '10px', 'font-size': '12px'}),
                        html.P(id='estado-streaming', className='mt-3 mb-0', style={'color': '#adb5bd', 'font-size': '14px', 'text-align': 'center'})
                    ])
                ], style=CARD_STYLE)
            ], width=4),
            
            dbc.Col([
                dbc.Card([
                    dbc.CardBody([
                        html.H5("📝 System Log", className="mb-3"),
                        html.Div(id='log-eventos', style={
                            'max-height': '160px',
                            'overflow-y': 'auto',
                            'background-color': '#1a1a1a',
                            'padding': '15px',
                            'border-radius': '5px',
                            'font-family': 'monospace',
                            'color': '#00ff00',
                            'border': '1px solid #333'
                        })
                    ])
                ], style=CARD_STYLE)
            ], width=8)
        ], className="mb-4"),
        
        # Store para estado del streaming (playing/paused/stopped)
        dcc.Store(id='streaming-estado', data='stopped'),
        
        # Indicadores en tiempo real con velocímetros tipo gauge
        dbc.Row([
            dbc.Col([
                dbc.Card([
                    dbc.CardBody([
                        html.H6("💻 CPU Usage", className="text-muted", style={'text-align': 'center'}),
                        dcc.Graph(id='gauge-cpu', config={'displayModeBar': False}, style={'height': '200px', 'margin-top': '-20px'})
                    ])
                ], style=CARD_STYLE)
            ], width=3),
            dbc.Col([
                dbc.Card([
                    dbc.CardBody([
                        html.H6("🧠 Memory", className="text-muted", style={'text-align': 'center'}),
                        dcc.Graph(id='gauge-memory', config={'displayModeBar': False}, style={'height': '200px', 'margin-top': '-20px'})
                    ])
                ], style=CARD_STYLE)
            ], width=3),
            dbc.Col([
                dbc.Card([
                    dbc.CardBody([
                        html.H6("🌐 Network", className="text-muted", style={'text-align': 'center'}),
                        dcc.Graph(id='gauge-network', config={'displayModeBar': False}, style={'height': '200px', 'margin-top': '-20px'})
                    ])
                ], style=CARD_STYLE)
            ], width=3),
            dbc.Col([
                dbc.Card([
                    dbc.CardBody([
                        html.H6("💾 Disk I/O", className="text-muted", style={'text-align': 'center'}),
                        dcc.Graph(id='gauge-disk', config={'displayModeBar': False}, style={'height': '200px', 'margin-top': '-20px'})
                    ])
                ], style=CARD_STYLE)
            ], width=3)
        ], className="mb-4"),
        
        # Gráfico y procesos en la misma fila
        dbc.Row([
            dbc.Col([
                dbc.Card([
                    dbc.CardBody([
                        html.H5("📈 Métricas en Tiempo Real (últimos 30 segundos)", className="mb-3"),
                        dcc.Graph(id='grafico-streaming', config={'displayModeBar': False}, style={'height': '320px'})
                    ])
                ], style=CARD_STYLE)
            ], width=7),
            
            dbc.Col([
                dbc.Card([
                    dbc.CardBody([
                        html.H5("⚙️ Procesos Activos", className="mb-3"),
                        html.Div([
                            html.Label("Data Processing:", className="mb-1", style={'color': '#adb5bd'}),
                            dbc.Progress(id='progreso-1', value=0, striped=True, animated=True, 
                                       color="info", className="mb-3"),
                            
                            html.Label("Model Training:", className="mb-1", style={'color': '#adb5bd'}),
                            dbc.Progress(id='progreso-2', value=0, striped=True, animated=True,
                                       color="success", className="mb-3"),
                            
                            html.Label("Data Sync:", className="mb-1", style={'color': '#adb5bd'}),
                            dbc.Progress(id='progreso-3', value=0, striped=True, animated=True,
                                       color="warning", className="mb-3")
                        ], style={'height': '320px', 'display': 'flex', 'flex-direction': 'column', 'justify-content': 'space-around'})
                    ])
                ], style=CARD_STYLE)
            ], width=5)
        ], className="mb-4")
    ])

@app.callback(
    Output('streaming-estado', 'data'),
    [Input('btn-play-pause', 'n_clicks'),
     Input('btn-stop', 'n_clicks')],
    State('streaming-estado', 'data'),
    prevent_initial_call=True
)
def controlar_streaming(n_play_pause, n_stop, estado_actual):
    """Controla el estado del streaming: playing/paused/stopped"""
    ctx = callback_context
    if not ctx.triggered:
        return estado_actual
    
    button_id = ctx.triggered[0]['prop_id'].split('.')[0]
    
    if button_id == 'btn-play-pause':
        # Toggle entre playing y paused
        if estado_actual == 'playing':
            return 'paused'
        else:  # stopped o paused -> playing
            return 'playing'
    elif button_id == 'btn-stop':
        return 'stopped'
    
    return estado_actual

@app.callback(
    [Output('btn-play-pause', 'children'),
     Output('btn-play-pause', 'color')],
    Input('streaming-estado', 'data')
)
def actualizar_boton_play_pause(estado):
    """Actualiza el texto y color del botón play/pause según el estado"""
    if estado == 'playing':
        return "⏸", 'warning'
    else:  # stopped o paused
        return "▶", 'success'

@app.callback(
    [Output('gauge-cpu', 'figure'),
     Output('gauge-memory', 'figure'),
     Output('gauge-network', 'figure'),
     Output('gauge-disk', 'figure'),
     Output('progreso-1', 'value'),
     Output('progreso-2', 'value'),
     Output('progreso-3', 'value'),
     Output('grafico-streaming', 'figure'),
     Output('log-eventos', 'children'),
     Output('estado-streaming', 'children')],
    [Input('interval-streaming', 'n_intervals'),
     Input('streaming-estado', 'data')],
    prevent_initial_call=False
)
def actualizar_streaming(n_intervals, estado):
    """Actualiza los componentes de streaming con gráfico en tiempo real y 3 estados"""
    
    # Función helper para crear gauges tipo velocímetro
    def crear_gauge(valor, color, titulo):
        # Formatear el valor con coma como separador decimal
        valor_formateado = f"{valor:.1f}".replace('.', ',')
        
        fig = go.Figure(go.Indicator(
            mode="gauge+number",
            value=valor,
            title={'text': titulo, 'font': {'size': 14, 'color': color}},
            number={
                'suffix': "%", 
                'font': {'size': 28, 'color': color, 'family': 'Arial Black'},
                'valueformat': '.1f'
            },
            domain={'x': [0, 1], 'y': [0, 1]},
            gauge={
                'axis': {'range': [0, 100], 'tickwidth': 1, 'tickcolor': color, 'tickfont': {'size': 10}},
                'bar': {'color': color, 'thickness': 0.75},
                'bgcolor': "rgba(0,0,0,0)",
                'borderwidth': 2,
                'bordercolor': color,
                'steps': [
                    {'range': [0, 50], 'color': 'rgba(0, 255, 136, 0.15)'},
                    {'range': [50, 75], 'color': 'rgba(255, 193, 7, 0.15)'},
                    {'range': [75, 100], 'color': 'rgba(255, 0, 0, 0.15)'}
                ],
                'threshold': {
                    'line': {'color': "white", 'width': 2},
                    'thickness': 0.75,
                    'value': valor
                }
            }
        ))
        fig.update_layout(
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            font={'color': color, 'family': "Arial"},
            margin=dict(l=10, r=10, t=20, b=10),
            height=200
        )
        return fig
    
    # Inicializar historial si no existe o si se detecta inicio después de stop
    if not hasattr(actualizar_streaming, 'historial'):
        actualizar_streaming.historial = {'cpu': [], 'memory': [], 'network': [], 'tiempo': []}
        actualizar_streaming.ultimo_estado = 'stopped'
    
    # Reset al iniciar después de detener
    if actualizar_streaming.ultimo_estado == 'stopped' and estado == 'playing':
        actualizar_streaming.historial = {'cpu': [], 'memory': [], 'network': [], 'tiempo': []}
    
    actualizar_streaming.ultimo_estado = estado
    
    # Estado inicial (stopped)
    if estado == 'stopped':
        fig_vacia = go.Figure()
        fig_vacia.add_annotation(
            text="Sistema Detenido - Presiona ▶️ Iniciar",
            xref="paper", yref="paper",
            x=0.5, y=0.5, showarrow=False,
            font=dict(size=20, color="#ff6b6b")
        )
        fig_vacia.update_layout(template='plotly_dark')
        
        gauge_vacio = crear_gauge(0, "#666", "")
        
        return (
            gauge_vacio, gauge_vacio, gauge_vacio, gauge_vacio,
            0, 0, 0,
            fig_vacia,
            html.Div("[STOPPED] Sistema detenido. Presiona ▶️ Iniciar para comenzar.", style={'color': '#ff6b6b'}),
            "⏹️ Detenido"
        )
    
    # Estado pausado (mantiene datos actuales)
    if estado == 'paused':
        # Mantener gráfico con últimos datos
        fig_paused = go.Figure()
        
        if len(actualizar_streaming.historial['cpu']) > 0:
            fig_paused.add_trace(go.Scatter(
                x=actualizar_streaming.historial['tiempo'],
                y=actualizar_streaming.historial['cpu'],
                mode='lines+markers',
                name='CPU',
                line=dict(color='#00d9ff', width=3),
                marker=dict(size=8)
            ))
            fig_paused.add_trace(go.Scatter(
                x=actualizar_streaming.historial['tiempo'],
                y=actualizar_streaming.historial['memory'],
                mode='lines+markers',
                name='Memory',
                line=dict(color='#4d94ff', width=3),
                marker=dict(size=8)
            ))
            fig_paused.add_trace(go.Scatter(
                x=actualizar_streaming.historial['tiempo'],
                y=actualizar_streaming.historial['network'],
                mode='lines+markers',
                name='Network',
                line=dict(color='#ff6b6b', width=3),
                marker=dict(size=8)
            ))
            fig_paused.update_layout(
                template='plotly_dark',
                xaxis_title='Time',
                yaxis_title='Usage (%)',
                hovermode='x unified',
                showlegend=True,
                legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1),
                margin=dict(l=50, r=20, t=40, b=40),
                yaxis=dict(range=[0, 100])
            )
        else:
            fig_paused.add_annotation(
                text="Sistema Pausado - Sin datos",
                xref="paper", yref="paper",
                x=0.5, y=0.5, showarrow=False,
                font=dict(size=20, color="#f39c12")
            )
            fig_paused.update_layout(template='plotly_dark')
        
        # Mantener últimos valores
        ultimo_cpu = actualizar_streaming.historial['cpu'][-1] if len(actualizar_streaming.historial['cpu']) > 0 else 0
        ultimo_mem = actualizar_streaming.historial['memory'][-1] if len(actualizar_streaming.historial['memory']) > 0 else 0
        ultimo_net = actualizar_streaming.historial['network'][-1] if len(actualizar_streaming.historial['network']) > 0 else 0
        ultimo_disk = 50  # Valor fijo para disk ya que no está en historial
        
        gauge_cpu_paused = crear_gauge(ultimo_cpu, "#00d9ff", "")
        gauge_mem_paused = crear_gauge(ultimo_mem, "#4d94ff", "")
        gauge_net_paused = crear_gauge(ultimo_net, "#ff6b6b", "")
        gauge_disk_paused = crear_gauge(ultimo_disk, "#ffd93d", "")
        
        return (
            gauge_cpu_paused, gauge_mem_paused, gauge_net_paused, gauge_disk_paused,
            ultimo_cpu, ultimo_mem, ultimo_net,
            fig_paused,
            html.Div("[PAUSED] Sistema en pausa. Presiona ▶️ Iniciar para reanudar.", style={'color': '#f39c12'}),
            "⏸️ Pausado"
        )
    
    # Estado playing (actualizando)
    # Generar datos aleatorios simulando métricas del sistema
    np.random.seed(int(datetime.now().timestamp() * 1000) % 2**32)
    
    cpu = np.random.randint(30, 95)
    memory = np.random.randint(40, 80)
    network = np.random.randint(20, 90)
    disk = np.random.randint(15, 65)
    
    prog1 = np.random.randint(20, 100)
    prog2 = np.random.randint(30, 100)
    prog3 = np.random.randint(40, 100)
    
    # Agregar nuevo punto al historial
    tiempo_actual = datetime.now()
    actualizar_streaming.historial['cpu'].append(cpu)
    actualizar_streaming.historial['memory'].append(memory)
    actualizar_streaming.historial['network'].append(network)
    actualizar_streaming.historial['tiempo'].append(tiempo_actual)
    
    # Mantener solo últimos 15 puntos
    if len(actualizar_streaming.historial['cpu']) > 15:
        for key in ['cpu', 'memory', 'network', 'tiempo']:
            actualizar_streaming.historial[key] = actualizar_streaming.historial[key][-15:]
    
    # Crear gráfico de líneas en tiempo real
    fig_streaming = go.Figure()
    
    fig_streaming.add_trace(go.Scatter(
        x=actualizar_streaming.historial['tiempo'],
        y=actualizar_streaming.historial['cpu'],
        mode='lines+markers',
        name='CPU',
        line=dict(color='#00d9ff', width=3),
        marker=dict(size=8)
    ))
    
    fig_streaming.add_trace(go.Scatter(
        x=actualizar_streaming.historial['tiempo'],
        y=actualizar_streaming.historial['memory'],
        mode='lines+markers',
        name='Memory',
        line=dict(color='#4d94ff', width=3),
        marker=dict(size=8)
    ))
    
    fig_streaming.add_trace(go.Scatter(
        x=actualizar_streaming.historial['tiempo'],
        y=actualizar_streaming.historial['network'],
        mode='lines+markers',
        name='Network',
        line=dict(color='#ff6b6b', width=3),
        marker=dict(size=8)
    ))
    
    fig_streaming.update_layout(
        template='plotly_dark',
        xaxis_title='Time',
        yaxis_title='Usage (%)',
        hovermode='x unified',
        showlegend=True,
        legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1),
        margin=dict(l=50, r=20, t=40, b=40),
        yaxis=dict(range=[0, 100])
    )
    
    # Log de eventos estilo terminal
    timestamp = datetime.now().strftime('%H:%M:%S')
    eventos = [
        html.Div(f"[{timestamp}] INFO: System metrics updated (iteration #{n_intervals})", 
                style={'margin-bottom': '3px', 'color': '#00ff00'}),
        html.Div(f"[{timestamp}] STATS: CPU={cpu}% MEM={memory}% NET={network}% DISK={disk}%",
                style={'margin-bottom': '3px', 'color': '#00ff88'}),
        html.Div(f"[{timestamp}] PROCESS: DataProc={prog1}% ModelTrain={prog2}% Sync={prog3}%",
                style={'margin-bottom': '3px', 'color': '#00ffff'}),
        html.Div(f"[{timestamp}] STATUS: All systems operational",
                style={'margin-bottom': '3px', 'color': '#ffff00'})
    ]
    
    estado = f"▶️ Monitoring Active (refresh #{n_intervals})"
    
    # Crear gauges para cada métrica
    gauge_cpu = crear_gauge(cpu, "#00d9ff", "")
    gauge_memory = crear_gauge(memory, "#4d94ff", "")
    gauge_network = crear_gauge(network, "#ff6b6b", "")
    gauge_disk = crear_gauge(disk, "#ffd93d", "")
    
    return (
        gauge_cpu, gauge_memory, gauge_network, gauge_disk,
        prog1, prog2, prog3,
        fig_streaming,
        html.Div(eventos),
        estado
    )

# Callbacks para radio de rangos de fechas
@app.callback(
    Output('filtro-fechas', 'data'),
    Input('filtro-fechas-radio', 'value'),
    State('slider-total-dias', 'data')
)
def actualizar_rango_fechas(seleccion, total_dias):
    """Actualiza el rango de fechas según la selección del radio"""
    if seleccion == '7dias':
        return {'start': total_dias - 7, 'end': total_dias}
    elif seleccion == '30dias':
        return {'start': total_dias - 30, 'end': total_dias}
    elif seleccion == '90dias':
        return {'start': 0, 'end': total_dias}
    elif seleccion == 'primeros30':
        return {'start': 0, 'end': 30}
    elif seleccion == 'ultimos30':
        return {'start': total_dias - 30, 'end': total_dias}
    
    return {'start': 0, 'end': total_dias}

@app.callback(
    Output('info-periodo', 'children'),
    [Input('filtro-fechas', 'data'),
     Input('slider-fecha-min', 'data'),
     Input('slider-total-dias', 'data')]
)
def actualizar_info_periodo(rango_fechas, fecha_min_iso, total_dias):
    """Genera un timeline visual tipo roadmap del período seleccionado"""
    fecha_min = pd.to_datetime(fecha_min_iso)
    fecha_inicio = fecha_min + timedelta(days=rango_fechas['start'])
    fecha_fin = fecha_min + timedelta(days=rango_fechas['end'])
    num_dias = rango_fechas['end'] - rango_fechas['start']
    
    # Calcular porcentajes para las barras visuales
    start_pct = (rango_fechas['start'] / total_dias) * 100
    duration_pct = (num_dias / total_dias) * 100
    
    return html.Div([
        # Título del timeline
        html.Div([
            html.Strong("📊 TIMELINE DEL PERÍODO", style={'color': '#f093fb', 'font-size': '14px', 'letter-spacing': '1px'})
        ], className="mb-3", style={'text-align': 'center'}),
        
        # Diagrama visual tipo roadmap
        html.Div([
            # Línea de tiempo completa (90 días)
            html.Div([
                # Sección antes del rango (gris)
                html.Div(style={
                    'width': f'{start_pct}%',
                    'height': '30px',
                    'background': 'linear-gradient(90deg, #1a1a1a 0%, #333 100%)',
                    'display': 'inline-block',
                    'border': '1px solid #444',
                    'border-right': 'none'
                }),
                # Sección del rango seleccionado (colorido)
                html.Div([
                    html.Div([
                        html.Small(f"{num_dias}d", style={'color': 'white', 'font-weight': 'bold', 'text-shadow': '0 0 5px #000'})
                    ], style={'text-align': 'center', 'padding-top': '6px'})
                ], style={
                    'width': f'{duration_pct}%',
                    'height': '30px',
                    'background': 'linear-gradient(135deg, #667eea 0%, #f093fb 50%, #ffd700 100%)',
                    'display': 'inline-block',
                    'border': '2px solid #f093fb',
                    'box-shadow': '0 0 15px rgba(240, 147, 251, 0.6)',
                    'position': 'relative',
                    'animation': 'pulse-glow 2s infinite'
                }),
                # Sección después del rango (gris)
                html.Div(style={
                    'width': f'{100 - start_pct - duration_pct}%',
                    'height': '30px',
                    'background': 'linear-gradient(90deg, #333 0%, #1a1a1a 100%)',
                    'display': 'inline-block',
                    'border': '1px solid #444',
                    'border-left': 'none'
                })
            ], style={'width': '100%', 'margin-bottom': '15px'}),
            
            # Marcadores de fechas
            html.Div([
                html.Div([
                    html.Div([
                        html.Small("📅 Inicio", style={'color': '#888', 'font-size': '10px'}),
                        html.Div(fecha_min.strftime('%d/%m/%y'), style={'color': '#666', 'font-size': '11px', 'font-weight': 'bold'})
                    ], style={'display': 'inline-block', 'text-align': 'left'}),
                    
                    html.Div([
                        html.Small("✨ Selección", style={'color': '#f093fb', 'font-size': '10px'}),
                        html.Div(f"{fecha_inicio.strftime('%d/%m/%y')} → {fecha_fin.strftime('%d/%m/%y')}", 
                                style={'color': '#00ffff', 'font-size': '11px', 'font-weight': 'bold'})
                    ], style={'display': 'inline-block', 'margin': '0 auto', 'text-align': 'center'}),
                    
                    html.Div([
                        html.Small("📅 Fin", style={'color': '#888', 'font-size': '10px'}),
                        html.Div((fecha_min + timedelta(days=total_dias)).strftime('%d/%m/%y'), 
                                style={'color': '#666', 'font-size': '11px', 'font-weight': 'bold'})
                    ], style={'display': 'inline-block', 'float': 'right', 'text-align': 'right'})
                ], style={'width': '100%', 'position': 'relative'})
            ], className="mb-3"),
            
            # Indicadores numéricos
            html.Div([
                html.Div([
                    html.Div("⏱️", style={'font-size': '24px'}),
                    html.Div(f"{num_dias}", style={'color': '#ffd700', 'font-size': '22px', 'font-weight': 'bold'}),
                    html.Small("días", style={'color': '#888'})
                ], style={'display': 'inline-block', 'text-align': 'center', 'width': '33%'}),
                
                html.Div([
                    html.Div("📊", style={'font-size': '24px'}),
                    html.Div(f"{duration_pct:.1f}%", style={'color': '#f093fb', 'font-size': '22px', 'font-weight': 'bold'}),
                    html.Small("cobertura", style={'color': '#888'})
                ], style={'display': 'inline-block', 'text-align': 'center', 'width': '33%'}),
                
                html.Div([
                    html.Div("🎯", style={'font-size': '24px'}),
                    html.Div(f"{int(500 * (num_dias/90))}", style={'color': '#00ffff', 'font-size': '22px', 'font-weight': 'bold'}),
                    html.Small("registros", style={'color': '#888'})
                ], style={'display': 'inline-block', 'text-align': 'center', 'width': '33%'})
            ], style={'margin-top': '10px'})
        ], style={
            'background': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            'padding': '15px',
            'border-radius': '8px',
            'border': '1px solid #f093fb'
        })
    ])

# Callback para randomizar datos en Home
@app.callback(
    Output('page-content', 'children', allow_duplicate=True),
    Input('btn-randomizar', 'n_clicks'),
    prevent_initial_call=True
)
def randomizar_datos(n_clicks):
    """Regenera datos aleatorios y recarga la página Home"""
    global df_ventas
    df_ventas = generar_datos_ventas()
    return layout_home()

# ==================== EJECUTAR APP ====================

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Dashboard Dash iniciando...")
    print("📍 URL: http://localhost:8050")
    print("="*60 + "\n")
    app.run(debug=False, port=8050)
