# 🐠 Welcome to Juanito's Reef

Simulador interactivo de comportamiento de cardumen usando el algoritmo de Boids de Craig Reynolds.

## 🎮 Controles

### Panel Lateral Izquierdo (Sliders):
- **👁️ Visión (20-150)**: Radio de percepción de cada pez
- **🤝 Cohesión (0-2)**: Fuerza de atracción hacia el grupo
- **↔️ Separación (0-3)**: Fuerza de repulsión entre peces
- **➡️ Alineación (0-2)**: Tendencia a seguir la dirección del grupo
- **⚡ Velocidad (1-6)**: Velocidad máxima de nado
- **🐠 Peces (10-100)**: Cantidad de peces en el cardumen

### Interruptores Flotantes (Arriba-Derecha):
- **🍖 Hambre ON/OFF**: Activa sistema de hambre (barras visibles)
- **💀 Muerte ON/OFF**: Activa muerte por inanición (solo si hambre activo)
- **🍽️ Auto Pellets ON/OFF**: Lanza comida automáticamente cada segundo
- **🧱 Rebote/Atravesar**: Cambia comportamiento en los bordes

### Botones Circulares (Abajo-Derecha):
- **🎲 Random**: Aleatoriza todos los sliders
- **↻ Reset**: Reinicia la simulación

### Interacción con Mouse:
- **Click en cualquier lugar**: Lanza 3-5 pellets de comida

## 🌊 Displays Navales (Abajo-Izquierda)

### Panel de Vigilancia Oceánica:
- **📡 Radar Sonar**: Detecta peces con pings animados
- **🌡️ TEMP**: Temperatura del agua (15-22°C)
- **🌀 PRES**: Presión atmosférica (1008-1018 hPa)
- **💨 WIND**: Velocidad del viento (8-20 km/h)
- **🧂 SAL**: Salinidad del agua (34.5-36.0 ppt)
- **🌊 ACOUSTIC**: Onda estilo canto de ballena (velocidad sincronizada con peces)

### Mapa de Calor de Densidad:
Visualización en tiempo real de concentración de peces:
- 🔵 Azul: 1 pez
- 🟢 Verde: 2-3 peces  
- 🟡 Amarillo: 4 peces
- 🟠 Naranja: 5-7 peces
- 🔴 Rojo: 8+ peces (cardumen denso)

## 🐟 Comportamiento de los Peces

### Colores:
- **Azul Marino**: RGB(20-80, 100-150, 180-230)
- **Violeta**: RGB(120-180, 50-120, 180-230)
- **Blanco/Plateado**: RGB(200-255, 200-255, 200-255)

### Sistema de Hambre:
1. El hambre incrementa gradualmente (0-100)
2. Barra de hambre visible sobre el pez cuando >30
3. Colores: Verde (baja) → Amarillo (media) → Rojo (alta)
4. A partir de 85% de hambre: **parpadeo rojo de alarma**
5. Al llegar a 100%: muerte por inanición

### Animación de Muerte:
- **Modo Rebote**: Pez cae al fondo y se detiene (desaparece lentamente)
- **Modo Atravesar**: Pez cae atravesando el fondo (desaparece rápido)
- Color cambia a gris (120, 120, 120)
- Ojos cambian a X
- Ángulo fijo (volteado)

## 🎨 Detalles Técnicos

### Algoritmo de Boids (Craig Reynolds):
1. **Cohesión**: `steer = (centerOfMass - position).normalize()`
2. **Separación**: `steer = sum(position - neighbor).normalize()`
3. **Alineación**: `steer = (avgVelocity - velocity).normalize()`

### Optimizaciones:
- Visión limitada (radio configurable)
- Cálculo de vecinos con distancia euclidiana
- Límite de fuerza (`maxForce = 0.2`)
- Límite de velocidad (configurable con slider)

## 🔗 Enlaces

- **Live Demo**: https://jr7juanito.github.io/jupyterlite-embed/AcuarioProyect/
- **Portafolio**: https://jr7juanito.github.io/jupyterlite-embed/

## 📚 Referencias

- [Craig Reynolds - Boids (1986)](https://www.red3d.com/cwr/boids/)
- [p5.js Documentation](https://p5js.org/reference/)
- [The Nature of Code - Chapter 6: Autonomous Agents](https://natureofcode.com/autonomous-agents/)
