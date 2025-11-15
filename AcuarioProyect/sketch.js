// ============================================
// SIMULADOR DE BOIDS - ALGORITMO DE REYNOLDS
// Vista superior de pecera rectangular
// ============================================

let fishes = [];
let foodPellets = [];
let params = {
    vision: 60,           // Rango de visión moderado (realista para cardumen)
    cohesion: 0.8,        // Agrupación moderada (no demasiado compacto)
    separation: 1.2,      // Separación natural entre peces
    alignment: 1.0,       // Alineación fuerte (nadan juntos)
    maxSpeed: 2.5,        // Velocidad natural y fluida
    fishCount: 50         // Cardumen reducido para peces más grandes
};

// Estados de los toggles
let hungerEnabled = false;  // Iniciar sin hambre
let deathEnabled = true;
let autoPelletsEnabled = false;
let wallBounceMode = true; // true = rebote, false = atravesar

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 525;

// ============================================
// DATOS OCEÁNICOS (para displays navales)
// ============================================
let oceanData = {
    temperature: 18.5,      // °C
    pressure: 1013.2,       // hPa
    windSpeed: 12.3,        // km/h
    windDirection: 0,       // grados
    waveHeight: 1.8,        // metros
    salinity: 35.2,         // ppt
    radarSweep: 0,          // ángulo del radar
    sonarPings: []          // pings del sonar
};

// ============================================
// SETUP - Inicialización
// ============================================
function setup() {
    let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('canvas-container');
    
    // Crear peces iniciales
    for (let i = 0; i < params.fishCount; i++) {
        fishes.push(new Fish());
    }
    
    // Conectar sliders
    connectSliders();
}

// ============================================
// DRAW - Loop principal
// ============================================
function draw() {
    // Fondo: agua con gradiente
    drawWater();
    
    // Auto-pellets aleatorios
    if (autoPelletsEnabled && frameCount % 60 === 0) { // Cada segundo
        let x = random(50, width - 50);
        let y = random(20, 100);
        let numPellets = floor(random(2, 5));
        for (let i = 0; i < numPellets; i++) {
            foodPellets.push(new FoodPellet(x + random(-10, 10), y));
        }
    }
    
    // Actualizar y mostrar pellets de comida
    for (let i = foodPellets.length - 1; i >= 0; i--) {
        foodPellets[i].update();
        foodPellets[i].show();
        
        // Eliminar pellets consumidos o que llegaron al fondo
        if (foodPellets[i].consumed || foodPellets[i].position.y > height - 10) {
            foodPellets.splice(i, 1);
        }
    }
    
    // Actualizar y mostrar cada pez
    for (let i = fishes.length - 1; i >= 0; i--) {
        fishes[i].flock(fishes);
        if (hungerEnabled) {
            fishes[i].seekFood(foodPellets);
        }
        fishes[i].update();
        fishes[i].edges();
        fishes[i].show();
        
        // Eliminar peces muertos que ya desaparecieron
        if (fishes[i].isDead && fishes[i].opacity <= 0) {
            fishes.splice(i, 1);
            params.fishCount--;
            // Actualizar slider y valor mostrado
            document.getElementById('fishCount').value = params.fishCount;
            document.getElementById('fishCount-val').textContent = params.fishCount;
        }
    }
    
    // Actualizar y dibujar displays navales
    updateOceanData();
    drawNavalDisplays();
}

// ============================================
// CALCULAR CERCANÍA PROMEDIO ENTRE PECES
// ============================================
function calculateAverageProximity() {
    if (fishes.length < 2) return 50; // Valor por defecto si hay pocos peces
    
    let totalDistance = 0;
    let count = 0;
    
    // Calcular distancia promedio entre cada pez y sus vecinos cercanos
    for (let fish of fishes) {
        if (fish.isDead) continue;
        
        let nearestDist = Infinity;
        for (let other of fishes) {
            if (other === fish || other.isDead) continue;
            
            let d = dist(fish.position.x, fish.position.y, other.position.x, other.position.y);
            if (d < nearestDist) {
                nearestDist = d;
            }
        }
        
        if (nearestDist !== Infinity) {
            totalDistance += nearestDist;
            count++;
        }
    }
    
    return count > 0 ? totalDistance / count : 50;
}

// ============================================
// DISPLAYS NAVALES - Información oceánica
// ============================================
function updateOceanData() {
    // Actualizar datos con variaciones MUY sutiles (más lentas y realistas)
    if (frameCount % 10 === 0) { // Solo actualizar cada 10 frames
        oceanData.temperature += random(-0.02, 0.02);
        oceanData.temperature = constrain(oceanData.temperature, 15, 22);
    }
    
    if (frameCount % 15 === 0) { // Cada 15 frames
        oceanData.pressure += random(-0.1, 0.1);
        oceanData.pressure = constrain(oceanData.pressure, 1008, 1018);
    }
    
    if (frameCount % 12 === 0) { // Cada 12 frames
        oceanData.windSpeed += random(-0.15, 0.15);
        oceanData.windSpeed = constrain(oceanData.windSpeed, 8, 20);
    }
    
    oceanData.windDirection += random(-1, 1);
    oceanData.windDirection = (oceanData.windDirection + 360) % 360;
    
    if (frameCount % 20 === 0) { // Cada 20 frames
        oceanData.waveHeight += random(-0.02, 0.02);
        oceanData.waveHeight = constrain(oceanData.waveHeight, 0.5, 3.0);
    }
    
    if (frameCount % 25 === 0) { // Cada 25 frames
        oceanData.salinity += random(-0.005, 0.005);
        oceanData.salinity = constrain(oceanData.salinity, 34.5, 36.0);
    }
    
    // Barrido del radar - velocidad fija medianamente lenta
    oceanData.radarSweep = (oceanData.radarSweep + 0.9) % 360; // 60% de 1.5 = 0.9
    
    // Generar pings de sonar aleatorios
    if (frameCount % 30 === 0 && oceanData.sonarPings.length < 5) {
        oceanData.sonarPings.push({
            angle: random(360),
            distance: random(30, 80),
            life: 60
        });
    }
    
    // Actualizar pings
    for (let i = oceanData.sonarPings.length - 1; i >= 0; i--) {
        oceanData.sonarPings[i].life--;
        if (oceanData.sonarPings[i].life <= 0) {
            oceanData.sonarPings.splice(i, 1);
        }
    }
}

function drawNavalDisplays() {
    push();
    
    // Panel principal contenedor (esquina inferior izquierda) - 50% más pequeño
    let panelX = 15;
    let panelY = height - 95;
    let panelW = 140;
    let panelH = 82;
    
    // Fondo semitransparente
    fill(0, 20, 30, 180);
    stroke(0, 180, 200, 150);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 5);
    
    // Línea superior decorativa
    stroke(0, 200, 220, 200);
    strokeWeight(1);
    line(panelX, panelY + 8, panelX + panelW, panelY + 8);
    
    // Título
    noStroke();
    fill(0, 220, 255);
    textSize(7);
    textFont('monospace');
    textAlign(LEFT, TOP);
    text('OCEAN SURVEILLANCE', panelX + 4, panelY + 2);
    
    // === RADAR CIRCULAR (izquierda) ===
    drawRadarDisplay(panelX + 35, panelY + 40, 27);
    
    // === DATOS ATMOSFÉRICOS (derecha superior) ===
    drawAtmosphericData(panelX + 72, panelY + 15);
    
    // === GRÁFICO DE OLAS (derecha inferior) ===
    drawWaveGraph(panelX + 72, panelY + 50);
    
    // === MAPA DE CALOR DE DENSIDAD (a la derecha del panel) ===
    drawHeatMap(panelX + panelW + 10, panelY);
    
    pop();
}

function drawRadarDisplay(x, y, radius) {
    push();
    translate(x, y);
    
    // Fondo del radar
    fill(0, 10, 15, 200);
    stroke(0, 150, 170, 100);
    strokeWeight(0.5);
    circle(0, 0, radius * 2);
    
    // Círculos concéntricos
    noFill();
    stroke(0, 180, 200, 80);
    for (let i = 1; i <= 3; i++) {
        circle(0, 0, (radius * 2 * i) / 3);
    }
    
    // Líneas de cuadrante
    stroke(0, 180, 200, 60);
    line(-radius, 0, radius, 0);
    line(0, -radius, 0, radius);
    
    // Barrido del radar (línea que gira)
    let sweepAngle = radians(oceanData.radarSweep);
    stroke(0, 255, 200, 200);
    strokeWeight(1.5);
    line(0, 0, cos(sweepAngle) * radius, sin(sweepAngle) * radius);
    
    // Gradiente del barrido
    for (let i = 0; i < 60; i++) {
        let angle = sweepAngle - radians(i * 2);
        let alpha = map(i, 0, 60, 100, 0);
        stroke(0, 255, 200, alpha);
        strokeWeight(0.5);
        line(0, 0, cos(angle) * radius, sin(angle) * radius);
    }
    
    // Pings del sonar (peces detectados)
    for (let ping of oceanData.sonarPings) {
        let pingAngle = radians(ping.angle);
        let pingDist = map(ping.distance, 0, 100, 0, radius);
        let pingAlpha = map(ping.life, 0, 60, 0, 255);
        
        fill(0, 255, 150, pingAlpha);
        noStroke();
        circle(cos(pingAngle) * pingDist, sin(pingAngle) * pingDist, 2);
        
        // Anillo expansivo
        noFill();
        stroke(0, 255, 150, pingAlpha * 0.5);
        let ringSize = map(ping.life, 60, 0, 2, 6);
        circle(cos(pingAngle) * pingDist, sin(pingAngle) * pingDist, ringSize);
    }
    
    // Etiqueta
    fill(0, 220, 255);
    noStroke();
    textSize(6);
    textAlign(CENTER, TOP);
    text('SONAR', 0, radius + 3);
    
    pop();
}

function drawAtmosphericData(x, y) {
    push();
    
    fill(0, 220, 255);
    noStroke();
    textSize(6);
    textFont('monospace');
    textAlign(LEFT, TOP);
    
    let lineH = 7;
    
    // Temperatura
    text('TEMP: ' + oceanData.temperature.toFixed(1) + 'C', x, y);
    
    // Presión
    text('PRES: ' + oceanData.pressure.toFixed(0), x, y + lineH);
    
    // Viento
    text('WIND: ' + oceanData.windSpeed.toFixed(1), x, y + lineH * 2);
    
    // Salinidad
    text('SAL: ' + oceanData.salinity.toFixed(1), x, y + lineH * 3);
    
    pop();
}

function drawWaveGraph(x, y) {
    push();
    
    let graphW = 60;
    let graphH = 20;
    
    // Fondo del gráfico
    fill(0, 10, 15, 150);
    stroke(0, 180, 200, 100);
    strokeWeight(0.5);
    rect(x, y, graphW, graphH, 2);
    
    // Velocidad de traslación basada en velocidad de peces (1-6 -> 0.3-1.5)
    let translationSpeed = map(params.maxSpeed, 1, 6, 0.3, 1.5);
    
    // Dibujar onda caótica estilo canto de ballena
    noFill();
    stroke(0, 255, 200, 200);
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < graphW; i += 2) {
        // Componentes de frecuencia múltiple (armónicos) como sonidos de ballena
        let phase = (frameCount * translationSpeed * 0.1) + (i * 0.15);
        
        // Onda fundamental (baja frecuencia)
        let fundamental = sin(phase) * 0.5;
        
        // Armónico 1 (frecuencia media con modulación)
        let harmonic1 = sin(phase * 2.3 + sin(phase * 0.3) * 2) * 0.3;
        
        // Armónico 2 (frecuencia alta, más errático)
        let harmonic2 = sin(phase * 4.7 + cos(phase * 0.7) * 3) * 0.2;
        
        // Componente caótico (simula clics y chirridos de ballena)
        let chaos = sin(phase * 8.5) * cos(phase * 3.2) * 0.15;
        
        // Modulación de amplitud (respiración/pulso)
        let envelope = (sin(phase * 0.2) * 0.5 + 0.5) * 0.8 + 0.2;
        
        // Combinar todos los componentes
        let wave = (fundamental + harmonic1 + harmonic2 + chaos) * envelope * oceanData.waveHeight * 2.5;
        let yPos = y + graphH / 2 + wave;
        vertex(x + i, yPos);
    }
    endShape();
    
    // Línea base
    stroke(0, 180, 200, 80);
    strokeWeight(0.5);
    line(x, y + graphH / 2, x + graphW, y + graphH / 2);
    
    // Etiqueta actualizada
    fill(0, 220, 255);
    noStroke();
    textSize(5);
    textAlign(LEFT, TOP);
    text('ACOUSTIC:' + oceanData.waveHeight.toFixed(1) + 'm', x + 2, y + 2);
    
    pop();
}

function drawHeatMap(x, y) {
    push();
    
    let mapW = 70;
    let mapH = 82;
    let gridSize = 10; // Tamaño de cada celda
    let cols = floor(mapW / gridSize);
    let rows = floor(mapH / gridSize) - 1; // Quitar una fila inferior
    
    // Fondo
    fill(0, 20, 30, 180);
    stroke(0, 180, 200, 150);
    strokeWeight(1);
    rect(x, y, mapW, mapH, 5);
    
    // Título
    noStroke();
    fill(0, 220, 255);
    textSize(7);
    textFont('monospace');
    textAlign(LEFT, TOP);
    text('DENSITY', x + 4, y + 2);
    
    // Línea decorativa
    stroke(0, 200, 220, 200);
    strokeWeight(1);
    line(x, y + 8, x + mapW, y + 8);
    
    // Crear mapa de calor basado en posición de peces
    let densityMap = [];
    for (let i = 0; i < cols; i++) {
        densityMap[i] = [];
        for (let j = 0; j < rows; j++) {
            densityMap[i][j] = 0;
        }
    }
    
    // Contar peces en cada celda
    for (let fish of fishes) {
        if (!fish.isDead) {
            let cellX = floor(map(fish.position.x, 0, width, 0, cols));
            let cellY = floor(map(fish.position.y, 0, height, 0, rows));
            cellX = constrain(cellX, 0, cols - 1);
            cellY = constrain(cellY, 0, rows - 1);
            densityMap[cellX][cellY]++;
        }
    }
    
    // Dibujar mapa de calor
    noStroke();
    let startY = y + 12;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let density = densityMap[i][j];
            let cellX = x + i * gridSize;
            let cellY = startY + j * gridSize;
            
            if (density > 0) {
                // Escala de color: azul (bajo) -> verde -> amarillo -> naranja -> rojo (alto)
                let heatColor;
                if (density === 1) {
                    heatColor = color(0, 100, 200, 150); // Azul
                } else if (density === 2) {
                    heatColor = color(0, 200, 150, 170); // Verde-cyan
                } else if (density === 3) {
                    heatColor = color(100, 220, 50, 190); // Verde-amarillo
                } else if (density === 4) {
                    heatColor = color(220, 200, 0, 210); // Amarillo
                } else if (density >= 5 && density < 8) {
                    heatColor = color(255, 150, 0, 230); // Naranja
                } else {
                    heatColor = color(255, 50, 0, 250); // Rojo intenso
                }
                
                fill(heatColor);
                rect(cellX, cellY, gridSize, gridSize);
            } else {
                // Celda vacía - muy oscuro
                fill(0, 10, 20, 80);
                rect(cellX, cellY, gridSize, gridSize);
            }
        }
    }
    
    // Borde del mapa
    noFill();
    stroke(0, 180, 200, 100);
    strokeWeight(0.5);
    rect(x, startY, mapW, mapH - 12);
    
    pop();
}

// ============================================
// FUNCIONES DE TOGGLE
// ============================================
function toggleHunger() {
    hungerEnabled = !hungerEnabled;
    const toggle = document.getElementById('hunger-toggle');
    const label = document.getElementById('hunger-label');
    const deathContainer = document.getElementById('death-container');
    
    if (hungerEnabled) {
        toggle.classList.add('active');
        label.textContent = 'Con Hambre';
        // Mostrar toggle de muerte cuando hambre está activo
        deathContainer.style.display = 'flex';
    } else {
        toggle.classList.remove('active');
        label.textContent = 'Sin Hambre';
        // Ocultar toggle de muerte cuando hambre está inactivo
        deathContainer.style.display = 'none';
        // Resetear hambre de todos los peces
        for (let fish of fishes) {
            if (!fish.isDead) {
                fish.hunger = 0;
                fish.blinkState = false;
                fish.blinkTimer = 0;
            }
        }
    }
}

function toggleDeath() {
    deathEnabled = !deathEnabled;
    const toggle = document.getElementById('death-toggle');
    const label = document.getElementById('death-label');
    
    if (deathEnabled) {
        toggle.classList.add('active');
        label.textContent = 'Con Muerte';
    } else {
        toggle.classList.remove('active');
        label.textContent = 'Sin Muerte';
    }
}

function toggleAutoPellets() {
    autoPelletsEnabled = !autoPelletsEnabled;
    const toggle = document.getElementById('autopellet-toggle');
    const label = document.getElementById('autopellet-label');
    
    if (autoPelletsEnabled) {
        toggle.classList.add('active');
        label.textContent = 'Auto ON';
    } else {
        toggle.classList.remove('active');
        label.textContent = 'Auto OFF';
    }
}

function toggleWallMode() {
    wallBounceMode = !wallBounceMode;
    const toggle = document.getElementById('wall-toggle');
    const label = document.getElementById('wall-label');
    
    if (wallBounceMode) {
        toggle.classList.add('active');
        label.textContent = 'Rebote';
    } else {
        toggle.classList.remove('active');
        label.textContent = 'Atravesar';
    }
}

// ============================================
// CLASE FOOD PELLET - Comida para peces
// ============================================
class FoodPellet {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0.5); // Cae lentamente
        this.size = random(4, 7);
        this.color = color(139, 69, 19); // Café (comida)
        this.consumed = false;
        this.nutritionValue = 20; // Cuánta hambre satisface
    }
    
    update() {
        if (!this.consumed) {
            this.position.add(this.velocity);
            // Movimiento ondulante
            this.position.x += sin(frameCount * 0.05) * 0.3;
        }
    }
    
    show() {
        if (!this.consumed) {
            // Pellet con brillo
            fill(this.color);
            stroke(89, 45, 10);
            strokeWeight(1);
            circle(this.position.x, this.position.y, this.size);
            
            // Brillo
            fill(255, 200, 100, 150);
            noStroke();
            circle(this.position.x - this.size * 0.15, this.position.y - this.size * 0.15, this.size * 0.4);
        }
    }
    
    isEaten(fishPos, fishSize) {
        let d = dist(fishPos.x, fishPos.y, this.position.x, this.position.y);
        return d < fishSize + this.size;
    }
}

// ============================================
// CLASE FISH - Representa cada pez
// ============================================
class Fish {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.size = random(12, 20); // Peces más grandes
        
        // Colores: azul marino, violeta o blanco
        let colorChoice = floor(random(3));
        if (colorChoice === 0) {
            // Azul marino
            this.color = color(
                random(20, 80),    // R bajo
                random(100, 150),  // G medio
                random(180, 230),  // B alto
                200
            );
        } else if (colorChoice === 1) {
            // Violeta
            this.color = color(
                random(120, 180),  // R medio-alto
                random(50, 120),   // G bajo-medio
                random(180, 230),  // B alto
                200
            );
        } else {
            // Blanco/plateado
            this.color = color(
                random(200, 255),  // R alto
                random(200, 255),  // G alto
                random(200, 255),  // B alto
                200
            );
        }
        
        this.hunger = random(0, 50); // Nivel de hambre (0-100, más alto = más hambre)
        this.hungerRate = random(0.02, 0.05); // Qué tan rápido tiene hambre
        this.isDead = false;
        this.deathAngle = 0; // Ángulo fijo al morir (volteado)
        this.opacity = 255; // Opacidad durante muerte
        this.deathVelocity = 0; // Velocidad de caída
        this.blinkState = false; // Estado de parpadeo para pre-muerte
        this.blinkTimer = 0; // Contador para controlar parpadeo
        this.originalColor = color(
            red(this.color),
            green(this.color),
            blue(this.color)
        );
    }
    
    // Buscar y comer comida
    seekFood(pellets) {
        if (this.isDead) return; // Los muertos no comen
        if (this.hunger < 30) return; // Solo busca comida si tiene hambre
        
        let closest = null;
        let closestDist = Infinity;
        
        // Encontrar el pellet más cercano
        for (let pellet of pellets) {
            if (pellet.consumed) continue;
            
            let d = dist(
                this.position.x, this.position.y,
                pellet.position.x, pellet.position.y
            );
            
            if (d < closestDist && d < 150) { // Solo ve comida a 150px
                closestDist = d;
                closest = pellet;
            }
        }
        
        // Ir hacia la comida si la encuentra
        if (closest) {
            let desired = p5.Vector.sub(closest.position, this.position);
            desired.setMag(params.maxSpeed * 1.5); // Más rápido cuando busca comida
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxForce * 2); // Mayor fuerza para buscar comida
            this.acceleration.add(steer.mult(2)); // Prioridad alta
            
            // Comer si está lo suficientemente cerca
            if (closest.isEaten(this.position, this.size)) {
                closest.consumed = true;
                this.hunger = max(0, this.hunger - closest.nutritionValue);
            }
        }
    }
    
    // Comportamiento de cardumen (flocking)
    flock(fishes) {
        if (this.isDead) return; // Los muertos no participan en el cardumen
        
        let alignment = this.align(fishes);
        let cohesion = this.cohere(fishes);
        let separation = this.separate(fishes);
        
        // Aplicar pesos de los parámetros
        alignment.mult(params.alignment);
        cohesion.mult(params.cohesion);
        separation.mult(params.separation);
        
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }
    
    // Regla 1: ALINEACIÓN - Dirigirse en la misma dirección que vecinos
    align(fishes) {
        let steering = createVector();
        let total = 0;
        
        for (let other of fishes) {
            let d = dist(
                this.position.x, this.position.y,
                other.position.x, other.position.y
            );
            
            if (other !== this && d < params.vision) {
                steering.add(other.velocity);
                total++;
            }
        }
        
        if (total > 0) {
            steering.div(total);
            steering.setMag(params.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        
        return steering;
    }
    
    // Regla 2: COHESIÓN - Moverse hacia el centro del grupo
    cohere(fishes) {
        let steering = createVector();
        let total = 0;
        
        for (let other of fishes) {
            let d = dist(
                this.position.x, this.position.y,
                other.position.x, other.position.y
            );
            
            if (other !== this && d < params.vision) {
                steering.add(other.position);
                total++;
            }
        }
        
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(params.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        
        return steering;
    }
    
    // Regla 3: SEPARACIÓN - Evitar choques con vecinos cercanos
    separate(fishes) {
        let steering = createVector();
        let total = 0;
        
        for (let other of fishes) {
            let d = dist(
                this.position.x, this.position.y,
                other.position.x, other.position.y
            );
            
            if (other !== this && d < params.vision / 2) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d); // Más fuerte cuanto más cerca
                steering.add(diff);
                total++;
            }
        }
        
        if (total > 0) {
            steering.div(total);
            steering.setMag(params.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        
        return steering;
    }
    
    // Actualizar posición y velocidad
    update() {
        if (this.isDead) {
            if (wallBounceMode) {
                // Modo rebote: pez muerto cae y se detiene en el fondo
                if (this.position.y < height - 20) {
                    this.deathVelocity += 0.15; // Aceleración hacia abajo (gravedad)
                    this.position.y += this.deathVelocity;
                } else {
                    // Detenerse en el fondo
                    this.position.y = height - 20;
                    this.deathVelocity = 0;
                    // Fade out lento cuando está en el fondo
                    this.opacity -= 2;
                    this.opacity = max(0, this.opacity);
                }
            } else {
                // Modo atravesar: animación normal (cae y desaparece)
                this.deathVelocity += 0.15; // Aceleración hacia abajo (gravedad)
                this.position.y += this.deathVelocity;
                
                // Fade out cuando toca el fondo
                if (this.position.y >= height - 20) {
                    this.opacity -= 8; // Desvanecerse rápidamente
                    this.opacity = max(0, this.opacity);
                }
            }
        } else {
            // Comportamiento normal
            this.position.add(this.velocity);
            this.velocity.add(this.acceleration);
            this.velocity.limit(params.maxSpeed);
            this.acceleration.mult(0); // Reset
            
            // Incrementar hambre con el tiempo (solo si está habilitado)
            if (hungerEnabled) {
                this.hunger = min(100, this.hunger + this.hungerRate);
                
                // Animación de pre-muerte (parpadeo de alarma) cuando está cerca de morir
                if (deathEnabled && this.hunger >= 85) {
                    this.blinkTimer++;
                    if (this.blinkTimer % 15 === 0) { // Parpadea cada 15 frames (~4 veces por segundo)
                        this.blinkState = !this.blinkState;
                    }
                } else {
                    this.blinkState = false;
                    this.blinkTimer = 0;
                }
                
                // Morir de hambre si alcanza 100 (solo si muerte está habilitada)
                if (deathEnabled && this.hunger >= 100) {
                    this.die();
                }
            } else {
                // Si el hambre se desactiva, resetear estados de parpadeo
                this.blinkState = false;
                this.blinkTimer = 0;
            }
        }
    }
    
    // Función de muerte
    die() {
        this.isDead = true;
        this.deathAngle = this.velocity.heading() + PI; // Ángulo fijo volteado
        this.velocity.mult(0); // Dejar de nadar
        // Cambiar a color gris
        this.color = color(120, 120, 120, 255);
    }
    
    // Rebotar en los bordes (comportamiento de acuario)
    edges() {
        if (this.isDead) return; // Los muertos no rebotan
        
        const margin = 20;
        
        if (wallBounceMode) {
            // Modo rebote
            if (this.position.x > width - margin) {
                this.velocity.x *= -1;
                this.position.x = width - margin;
            } else if (this.position.x < margin) {
                this.velocity.x *= -1;
                this.position.x = margin;
            }
            
            if (this.position.y > height - margin) {
                this.velocity.y *= -1;
                this.position.y = height - margin;
            } else if (this.position.y < margin) {
                this.velocity.y *= -1;
                this.position.y = margin;
            }
        } else {
            // Modo atravesar (wrap around)
            if (this.position.x > width + margin) {
                this.position.x = -margin;
            } else if (this.position.x < -margin) {
                this.position.x = width + margin;
            }
            
            if (this.position.y > height + margin) {
                this.position.y = -margin;
            } else if (this.position.y < -margin) {
                this.position.y = height + margin;
            }
        }
    }
    
    // Dibujar el pez (estilo realista 3D)
    show() {
        push();
        
        // Calcular ángulo de dirección
        let angle;
        if (this.isDead) {
            // Pez muerto con ángulo fijo (volteado, sin rotación)
            angle = this.deathAngle;
        } else {
            angle = this.velocity.heading();
        }
        
        translate(this.position.x, this.position.y);
        rotate(angle);
        
        // Aplicar opacidad si está muriendo
        let currentColor = color(
            red(this.color),
            green(this.color),
            blue(this.color),
            this.opacity
        );
        
        // Aplicar efecto de parpadeo de alarma (pre-muerte) solo si modo muerte está activado
        if (!this.isDead && this.blinkState && deathEnabled && hungerEnabled) {
            // Color de alarma estilo ambulancia (rojo y blanco alternando)
            currentColor = color(255, 0, 0, this.opacity); // Rojo brillante
        }
        
        // ========== CUERPO PRINCIPAL (elipsoide) ==========
        // Sombra inferior (efecto 3D)
        fill(red(this.color) - 60, green(this.color) - 60, blue(this.color) - 60, this.opacity * 0.6);
        noStroke();
        ellipse(0, this.size * 0.15, this.size * 1.8, this.size * 0.8);
        
        // Cuerpo brillante superior
        fill(currentColor);
        stroke(red(this.color) - 40, green(this.color) - 40, blue(this.color) - 40, this.opacity * 0.7);
        strokeWeight(1.5);
        ellipse(0, 0, this.size * 1.8, this.size * 0.9);
        
        // Highlight (brillo superior)
        fill(255, 255, 255, this.opacity * 0.4);
        noStroke();
        ellipse(this.size * 0.2, -this.size * 0.15, this.size * 0.8, this.size * 0.3);
        
        // ========== ALETAS DORSALES ==========
        fill(red(this.color) - 20, green(this.color) - 20, blue(this.color) - 20, this.opacity * 0.8);
        stroke(red(this.color) - 60, green(this.color) - 60, blue(this.color) - 60, this.opacity * 0.8);
        strokeWeight(1);
        
        // Aleta dorsal principal
        beginShape();
        vertex(0, -this.size * 0.45);
        vertex(-this.size * 0.3, -this.size * 0.7);
        vertex(-this.size * 0.5, -this.size * 0.5);
        vertex(-this.size * 0.2, -this.size * 0.45);
        endShape(CLOSE);
        
        // ========== ALETAS PECTORALES (laterales) ==========
        // Aleta izquierda
        fill(red(this.color) - 30, green(this.color) - 30, blue(this.color) - 30, this.opacity * 0.7);
        beginShape();
        vertex(-this.size * 0.2, 0);
        vertex(-this.size * 0.5, this.size * 0.6);
        vertex(-this.size * 0.3, this.size * 0.3);
        endShape(CLOSE);
        
        // Aleta derecha (simétrica)
        beginShape();
        vertex(-this.size * 0.2, 0);
        vertex(-this.size * 0.5, -this.size * 0.6);
        vertex(-this.size * 0.3, -this.size * 0.3);
        endShape(CLOSE);
        
        // ========== COLA (forma de media luna) ==========
        fill(red(this.color) - 40, green(this.color) - 40, blue(this.color) - 40, this.opacity * 0.85);
        stroke(red(this.color) - 70, green(this.color) - 70, blue(this.color) - 70, this.opacity * 0.8);
        strokeWeight(1.5);
        
        // Lóbulo superior
        beginShape();
        vertex(-this.size * 0.9, 0);
        vertex(-this.size * 1.3, -this.size * 0.5);
        vertex(-this.size * 1.1, -this.size * 0.2);
        endShape(CLOSE);
        
        // Lóbulo inferior
        beginShape();
        vertex(-this.size * 0.9, 0);
        vertex(-this.size * 1.3, this.size * 0.5);
        vertex(-this.size * 1.1, this.size * 0.2);
        endShape(CLOSE);
        
        // ========== CABEZA Y OJO ==========
        // Cabeza redondeada
        fill(red(this.color) + 20, green(this.color) + 20, blue(this.color) + 20, this.opacity);
        noStroke();
        ellipse(this.size * 0.6, 0, this.size * 0.8, this.size * 0.7);
        
        // Solo mostrar ojos si está vivo
        if (!this.isDead) {
            // Ojo blanco
            fill(255, 255, 255, this.opacity);
            stroke(0, 0, 0, this.opacity * 0.4);
            strokeWeight(1);
            circle(this.size * 0.7, -this.size * 0.1, this.size * 0.25);
            
            // Pupila
            fill(0, 0, 0, this.opacity);
            noStroke();
            circle(this.size * 0.75, -this.size * 0.12, this.size * 0.12);
            
            // Brillo en el ojo
            fill(255, 255, 255, this.opacity * 0.8);
            circle(this.size * 0.78, -this.size * 0.15, this.size * 0.05);
        } else {
            // Ojos de pez muerto (X)
            stroke(0, 0, 0, this.opacity * 0.6);
            strokeWeight(2);
            let eyeX = this.size * 0.7;
            let eyeY = -this.size * 0.1;
            let eyeSize = this.size * 0.15;
            line(eyeX - eyeSize, eyeY - eyeSize, eyeX + eyeSize, eyeY + eyeSize);
            line(eyeX - eyeSize, eyeY + eyeSize, eyeX + eyeSize, eyeY - eyeSize);
        }
        
        // ========== BARRA DE HAMBRE (si tiene hambre y está vivo y modo hambre está ON) ==========
        if (hungerEnabled && this.hunger > 30 && !this.isDead) {
            let barWidth = this.size * 1.5;
            let barHeight = 3;
            let barX = -barWidth / 2;
            let barY = -this.size * 1.2;
            
            // Fondo de la barra
            fill(50, 50, 50, 150);
            noStroke();
            rect(barX, barY, barWidth, barHeight, 2);
            
            // Barra de hambre (roja -> amarilla -> verde)
            let hungerPercent = this.hunger / 100;
            let barColor;
            if (hungerPercent > 0.7) {
                barColor = color(220, 20, 20); // Rojo (mucha hambre)
            } else if (hungerPercent > 0.4) {
                barColor = color(220, 180, 20); // Amarillo (hambre media)
            } else {
                barColor = color(100, 220, 20); // Verde (poca hambre)
            }
            
            fill(barColor);
            rect(barX, barY, barWidth * hungerPercent, barHeight, 2);
        }
        
        // ========== BOCA ==========
        stroke(red(this.color) - 80, green(this.color) - 80, blue(this.color) - 80, this.opacity * 0.8);
        strokeWeight(1.5);
        noFill();
        arc(this.size * 0.85, this.size * 0.05, this.size * 0.15, this.size * 0.1, 0, PI);
        
        pop();
    }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function drawWater() {
    // Gradiente de agua azul
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(color(100, 180, 230), color(40, 120, 180), inter);
        stroke(c);
        line(0, y, width, y);
    }
    
    // Título superior izquierdo
    push();
    noStroke();
    textSize(24);
    textFont('Georgia, serif');
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    
    // Sombra del texto
    fill(0, 0, 0, 120);
    text("Welcome to Juanito's Reef", 22, 22);
    
    // Borde azul marino (dibujando el texto varias veces con offset)
    fill(20, 60, 120, 255);
    text("Welcome to Juanito's Reef", 19, 19);
    text("Welcome to Juanito's Reef", 21, 19);
    text("Welcome to Juanito's Reef", 19, 21);
    text("Welcome to Juanito's Reef", 21, 21);
    
    // Texto principal blanco
    fill(255, 255, 255, 255);
    text("Welcome to Juanito's Reef", 20, 20);
    
    // Subtítulo decorativo
    fill(255, 255, 255, 200);
    textSize(10);
    textStyle(NORMAL);
    textFont('monospace');
    text('~ Interactive Boids Simulation ~', 22, 48);
    
    pop();
}

function connectSliders() {
    // Vision
    document.getElementById('vision').addEventListener('input', (e) => {
        params.vision = parseFloat(e.target.value);
        document.getElementById('vision-val').textContent = params.vision;
    });
    
    // Cohesion
    document.getElementById('cohesion').addEventListener('input', (e) => {
        params.cohesion = parseFloat(e.target.value);
        document.getElementById('cohesion-val').textContent = params.cohesion.toFixed(1);
    });
    
    // Separation
    document.getElementById('separation').addEventListener('input', (e) => {
        params.separation = parseFloat(e.target.value);
        document.getElementById('separation-val').textContent = params.separation.toFixed(1);
    });
    
    // Alignment
    document.getElementById('alignment').addEventListener('input', (e) => {
        params.alignment = parseFloat(e.target.value);
        document.getElementById('alignment-val').textContent = params.alignment.toFixed(1);
    });
    
    // Max Speed
    document.getElementById('maxSpeed').addEventListener('input', (e) => {
        params.maxSpeed = parseFloat(e.target.value);
        document.getElementById('maxSpeed-val').textContent = params.maxSpeed.toFixed(1);
    });
    
    // Fish Count
    document.getElementById('fishCount').addEventListener('input', (e) => {
        let newCount = parseInt(e.target.value);
        document.getElementById('fishCount-val').textContent = newCount;
        
        // Ajustar número de peces
        while (fishes.length < newCount) {
            fishes.push(new Fish());
        }
        while (fishes.length > newCount) {
            fishes.pop();
        }
        params.fishCount = newCount;
    });
}

function resetSimulation() {
    fishes = [];
    for (let i = 0; i < params.fishCount; i++) {
        fishes.push(new Fish());
    }
}

function randomizeParams() {
    // Generar valores aleatorios solo para los deslizadores (sliders)
    const randomVision = Math.floor(Math.random() * (150 - 20) + 20);
    const randomCohesion = (Math.random() * 2).toFixed(1);
    const randomSeparation = (Math.random() * 3).toFixed(1);
    const randomAlignment = (Math.random() * 2).toFixed(1);
    const randomSpeed = (Math.random() * 5 + 1).toFixed(1);
    const randomFishCount = Math.floor(Math.random() * (100 - 10) + 10);
    
    // NO aleatorizar toggles (interruptores) - el usuario los controla manualmente
    
    // Actualizar parámetros
    params.vision = randomVision;
    params.cohesion = parseFloat(randomCohesion);
    params.separation = parseFloat(randomSeparation);
    params.alignment = parseFloat(randomAlignment);
    params.maxSpeed = parseFloat(randomSpeed);
    
    // Actualizar sliders y valores mostrados
    document.getElementById('vision').value = randomVision;
    document.getElementById('vision-val').textContent = randomVision;
    
    document.getElementById('cohesion').value = randomCohesion;
    document.getElementById('cohesion-val').textContent = randomCohesion;
    
    document.getElementById('separation').value = randomSeparation;
    document.getElementById('separation-val').textContent = randomSeparation;
    
    document.getElementById('alignment').value = randomAlignment;
    document.getElementById('alignment-val').textContent = randomAlignment;
    
    document.getElementById('maxSpeed').value = randomSpeed;
    document.getElementById('maxSpeed-val').textContent = randomSpeed;
    
    document.getElementById('fishCount').value = randomFishCount;
    document.getElementById('fishCount-val').textContent = randomFishCount;
    
    // Ajustar cantidad de peces
    while (fishes.length < randomFishCount) {
        fishes.push(new Fish());
    }
    while (fishes.length > randomFishCount) {
        fishes.pop();
    }
    params.fishCount = randomFishCount;
}

// ============================================
// INTERACCIÓN CON MOUSE
// ============================================
function mousePressed() {
    // DEBUG: Mostrar coordenadas del click para ajustar áreas de exclusión
    console.log(`Click en: x=${mouseX}, y=${mouseY}, canvas: ${width}x${height}`);
    
    // Verificar que el click fue dentro del canvas
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
        console.log('Click fuera del canvas - IGNORADO');
        return;
    }
    
    // Verificar que no se clickeó sobre áreas de botones/toggles flotantes
    // Área de toggles (arriba derecha) - expandida para cubrir toda el área
    if (mouseX > width - 200 && mouseY < 180) {
        console.log('Click en zona de toggles - IGNORADO');
        return;
    }
    
    // Área de botones circulares (abajo derecha) - expandida
    if (mouseX > width - 100 && mouseY > height - 180) {
        console.log('Click en zona de botones - IGNORADO');
        return;
    }
    
    // Crear 3-5 pellets en la posición del click
    console.log('Generando comida en área segura');
    let numPellets = floor(random(3, 6));
    for (let i = 0; i < numPellets; i++) {
        let offsetX = random(-15, 15);
        let offsetY = random(-15, 15);
        foodPellets.push(new FoodPellet(mouseX + offsetX, mouseY + offsetY));
    }
}
