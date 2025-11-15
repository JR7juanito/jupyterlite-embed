// ============================================
// SIMULADOR DE BOIDS - VERSIÓN 3 CON DISPLAYS OCEANOGRÁFICOS
// Esta versión incluye displays navales (radar, sonar, gráficos)
// ENFOQUE: Documentación de componentes interactivos
// ============================================

// ============================================
// CONECTAR SLIDERS - MECANISMO DE INTERACTIVIDAD
// ============================================
// Esta función conecta los sliders HTML con los parámetros de JavaScript
// Usa addEventListener con evento 'input' para capturar cambios en tiempo real
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
        
        // Ajustar número de peces dinámicamente
        while (fishes.length < newCount) {
            fishes.push(new Fish());
        }
        while (fishes.length > newCount) {
            fishes.pop();
        }
        params.fishCount = newCount;
    });
}

// ============================================
// FUNCIONES DE TOGGLE - INTERRUPTORES INTERACTIVOS
// ============================================

// Toggle de Hambre - Activa/desactiva sistema de alimentación
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

// Toggle de Muerte - Activa/desactiva mortalidad por hambre
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

// Toggle de Auto-Pellets - Generación automática de comida
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

// Toggle de Modo de Paredes - Rebote vs Atravesar
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
// INTERACCIÓN CON MOUSE - SISTEMA DE ALIMENTACIÓN
// ============================================
// Esta función captura clicks del mouse y genera comida en esa posición
// Solo funciona dentro del área del canvas (evita interferencia con controles)
function mousePressed() {
    // Validar que el click esté dentro del canvas
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        // Crear múltiples pellets en la posición del click
        let numPellets = floor(random(3, 6));
        for (let i = 0; i < numPellets; i++) {
            let offsetX = random(-15, 15);
            let offsetY = random(-15, 15);
            foodPellets.push(new FoodPellet(mouseX + offsetX, mouseY + offsetY));
        }
    }
}

// ============================================
// DISPLAYS NAVALES - VISUALIZACIÓN DINÁMICA
// ============================================
// Estas funciones crean visualizaciones interactivas que responden
// a los parámetros del sistema y el estado de los peces

// Actualizar datos oceánicos con variaciones sutiles
function updateOceanData() {
    // Actualizar temperatura cada 10 frames
    if (frameCount % 10 === 0) {
        oceanData.temperature += random(-0.02, 0.02);
        oceanData.temperature = constrain(oceanData.temperature, 15, 22);
    }
    
    // Actualizar presión cada 15 frames
    if (frameCount % 15 === 0) {
        oceanData.pressure += random(-0.1, 0.1);
        oceanData.pressure = constrain(oceanData.pressure, 1008, 1018);
    }
    
    // Actualizar velocidad del viento cada 12 frames
    if (frameCount % 12 === 0) {
        oceanData.windSpeed += random(-0.15, 0.15);
        oceanData.windSpeed = constrain(oceanData.windSpeed, 8, 20);
    }
    
    // Dirección del viento (rotación continua)
    oceanData.windDirection += random(-1, 1);
    oceanData.windDirection = (oceanData.windDirection + 360) % 360;
    
    // Altura de olas cada 20 frames
    if (frameCount % 20 === 0) {
        oceanData.waveHeight += random(-0.02, 0.02);
        oceanData.waveHeight = constrain(oceanData.waveHeight, 0.5, 3.0);
    }
    
    // Salinidad cada 25 frames
    if (frameCount % 25 === 0) {
        oceanData.salinity += random(-0.005, 0.005);
        oceanData.salinity = constrain(oceanData.salinity, 34.5, 36.0);
    }
    
    // INTERACTIVIDAD: Barrido del radar sincronizado con velocidad de peces
    // La velocidad del radar refleja el parámetro maxSpeed
    let radarSpeed = map(params.maxSpeed, 1, 6, 0.5, 3);
    oceanData.radarSweep = (oceanData.radarSweep + radarSpeed) % 360;
    
    // Generar pings de sonar aleatorios (simulando detección de peces)
    if (frameCount % 30 === 0 && oceanData.sonarPings.length < 5) {
        oceanData.sonarPings.push({
            angle: random(360),
            distance: random(30, 80),
            life: 60
        });
    }
    
    // Actualizar vida de pings
    for (let i = oceanData.sonarPings.length - 1; i >= 0; i--) {
        oceanData.sonarPings[i].life--;
        if (oceanData.sonarPings[i].life <= 0) {
            oceanData.sonarPings.splice(i, 1);
        }
    }
}

// Gráfico de ondas con velocidad interactiva
function drawWaveGraph(x, y) {
    push();
    
    let graphW = 60;
    let graphH = 20;
    
    // Fondo del gráfico
    fill(0, 10, 15, 150);
    stroke(0, 180, 200, 100);
    strokeWeight(0.5);
    rect(x, y, graphW, graphH, 2);
    
    // INTERACTIVIDAD: Velocidad de onda sincronizada con velocidad de peces
    // El parámetro maxSpeed afecta directamente la velocidad de la animación
    let waveSpeed = map(params.maxSpeed, 1, 6, 0.02, 0.1);
    
    noFill();
    stroke(0, 255, 200, 200);
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < graphW; i += 2) {
        let wave = sin((frameCount + i * 5) * waveSpeed) * oceanData.waveHeight * 2.5;
        let yPos = y + graphH / 2 + wave;
        vertex(x + i, yPos);
    }
    endShape();
    
    // Línea base
    stroke(0, 180, 200, 80);
    strokeWeight(0.5);
    line(x, y + graphH / 2, x + graphW, y + graphH / 2);
    
    // Etiqueta
    fill(0, 220, 255);
    noStroke();
    textSize(5);
    textAlign(LEFT, TOP);
    text('WAVE:' + oceanData.waveHeight.toFixed(1) + 'm', x + 2, y + 2);
    
    pop();
}

// ============================================
// NOTAS SOBRE INTERACTIVIDAD
// ============================================
/*
MECANISMOS CLAVE DE INTERACTIVIDAD EN ESTA VERSIÓN:

1. SLIDERS (connectSliders):
   - Usa addEventListener con evento 'input'
   - Captura cambios en tiempo real mientras se arrastra
   - Actualiza tanto params como el display del valor
   - El slider de fishCount modifica dinámicamente el array de peces

2. TOGGLES (toggleHunger, toggleDeath, etc.):
   - Alternan estados booleanos (true/false)
   - Actualizan clases CSS para feedback visual
   - Modifican comportamiento del sistema en tiempo real
   - Algunos toggles afectan la visibilidad de otros controles

3. MOUSE (mousePressed):
   - Detecta clicks dentro del canvas usando mouseX/mouseY
   - Genera objetos FoodPellet en la posición del click
   - Valida que el click no sea en controles UI

4. DISPLAYS DINÁMICOS (updateOceanData, drawWaveGraph):
   - Responden a cambios en params (especialmente maxSpeed)
   - Velocidad del radar y olas se sincroniza con velocidad de peces
   - Visualización en tiempo real del estado del sistema

5. SINCRONIZACIÓN:
   - Los sliders modifican params inmediatamente
   - Los métodos de Fish leen params en cada frame
   - El resultado es feedback visual instantáneo
*/

// ============================================
// CÓDIGO COMPLETO ORIGINAL DE SKETCH (3)
// ============================================

let fishes = [];
let foodPellets = [];
let params = {
    vision: 60,
    cohesion: 0.8,
    separation: 1.2,
    alignment: 1.0,
    maxSpeed: 2.5,
    fishCount: 50
};

let hungerEnabled = false;
let deathEnabled = true;
let autoPelletsEnabled = false;
let wallBounceMode = true;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 525;

let oceanData = {
    temperature: 18.5,
    pressure: 1013.2,
    windSpeed: 12.3,
    windDirection: 0,
    waveHeight: 1.8,
    salinity: 35.2,
    radarSweep: 0,
    sonarPings: []
};

function setup() {
    let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('canvas-container');
    
    for (let i = 0; i < params.fishCount; i++) {
        fishes.push(new Fish());
    }
    
    connectSliders();
}

function draw() {
    drawWater();
    
    if (autoPelletsEnabled && frameCount % 60 === 0) {
        let x = random(50, width - 50);
        let y = random(20, 100);
        let numPellets = floor(random(2, 5));
        for (let i = 0; i < numPellets; i++) {
            foodPellets.push(new FoodPellet(x + random(-10, 10), y));
        }
    }
    
    for (let i = foodPellets.length - 1; i >= 0; i--) {
        foodPellets[i].update();
        foodPellets[i].show();
        
        if (foodPellets[i].consumed || foodPellets[i].position.y > height - 10) {
            foodPellets.splice(i, 1);
        }
    }
    
    for (let i = fishes.length - 1; i >= 0; i--) {
        fishes[i].flock(fishes);
        if (hungerEnabled) {
            fishes[i].seekFood(foodPellets);
        }
        fishes[i].update();
        fishes[i].edges();
        fishes[i].show();
        
        if (fishes[i].isDead && fishes[i].opacity <= 0) {
            fishes.splice(i, 1);
            params.fishCount--;
            document.getElementById('fishCount').value = params.fishCount;
            document.getElementById('fishCount-val').textContent = params.fishCount;
        }
    }
    
    updateOceanData();
    drawNavalDisplays();
}

function drawNavalDisplays() {
    push();
    
    let panelX = 15;
    let panelY = height - 95;
    let panelW = 140;
    let panelH = 82;
    
    fill(0, 20, 30, 180);
    stroke(0, 180, 200, 150);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 5);
    
    stroke(0, 200, 220, 200);
    strokeWeight(1);
    line(panelX, panelY + 8, panelX + panelW, panelY + 8);
    
    noStroke();
    fill(0, 220, 255);
    textSize(7);
    textFont('monospace');
    textAlign(LEFT, TOP);
    text('OCEAN SURVEILLANCE', panelX + 4, panelY + 2);
    
    drawRadarDisplay(panelX + 35, panelY + 40, 27);
    drawAtmosphericData(panelX + 72, panelY + 15);
    drawWaveGraph(panelX + 72, panelY + 50);
    drawHeatMap(panelX + panelW + 10, panelY);
    
    pop();
}

function drawRadarDisplay(x, y, radius) {
    push();
    translate(x, y);
    
    fill(0, 10, 15, 200);
    stroke(0, 150, 170, 100);
    strokeWeight(0.5);
    circle(0, 0, radius * 2);
    
    noFill();
    stroke(0, 180, 200, 80);
    for (let i = 1; i <= 3; i++) {
        circle(0, 0, (radius * 2 * i) / 3);
    }
    
    stroke(0, 180, 200, 60);
    line(-radius, 0, radius, 0);
    line(0, -radius, 0, radius);
    
    let sweepAngle = radians(oceanData.radarSweep);
    stroke(0, 255, 200, 200);
    strokeWeight(1.5);
    line(0, 0, cos(sweepAngle) * radius, sin(sweepAngle) * radius);
    
    for (let i = 0; i < 60; i++) {
        let angle = sweepAngle - radians(i * 2);
        let alpha = map(i, 0, 60, 100, 0);
        stroke(0, 255, 200, alpha);
        strokeWeight(0.5);
        line(0, 0, cos(angle) * radius, sin(angle) * radius);
    }
    
    for (let ping of oceanData.sonarPings) {
        let pingAngle = radians(ping.angle);
        let pingDist = map(ping.distance, 0, 100, 0, radius);
        let pingAlpha = map(ping.life, 0, 60, 0, 255);
        
        fill(0, 255, 150, pingAlpha);
        noStroke();
        circle(cos(pingAngle) * pingDist, sin(pingAngle) * pingDist, 2);
        
        noFill();
        stroke(0, 255, 150, pingAlpha * 0.5);
        let ringSize = map(ping.life, 60, 0, 2, 6);
        circle(cos(pingAngle) * pingDist, sin(pingAngle) * pingDist, ringSize);
    }
    
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
    
    text('TEMP: ' + oceanData.temperature.toFixed(1) + 'C', x, y);
    text('PRES: ' + oceanData.pressure.toFixed(0), x, y + lineH);
    text('WIND: ' + oceanData.windSpeed.toFixed(1), x, y + lineH * 2);
    text('SAL: ' + oceanData.salinity.toFixed(1), x, y + lineH * 3);
    
    pop();
}

function drawHeatMap(x, y) {
    push();
    
    let mapW = 70;
    let mapH = 82;
    let gridSize = 10;
    let cols = floor(mapW / gridSize);
    let rows = floor(mapH / gridSize);
    
    fill(0, 20, 30, 180);
    stroke(0, 180, 200, 150);
    strokeWeight(1);
    rect(x, y, mapW, mapH, 5);
    
    noStroke();
    fill(0, 220, 255);
    textSize(7);
    textFont('monospace');
    textAlign(LEFT, TOP);
    text('DENSITY', x + 4, y + 2);
    
    stroke(0, 200, 220, 200);
    strokeWeight(1);
    line(x, y + 8, x + mapW, y + 8);
    
    let densityMap = [];
    for (let i = 0; i < cols; i++) {
        densityMap[i] = [];
        for (let j = 0; j < rows; j++) {
            densityMap[i][j] = 0;
        }
    }
    
    for (let fish of fishes) {
        if (!fish.isDead) {
            let cellX = floor(map(fish.position.x, 0, width, 0, cols));
            let cellY = floor(map(fish.position.y, 0, height, 0, rows));
            cellX = constrain(cellX, 0, cols - 1);
            cellY = constrain(cellY, 0, rows - 1);
            densityMap[cellX][cellY]++;
        }
    }
    
    noStroke();
    let startY = y + 12;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let density = densityMap[i][j];
            let cellX = x + i * gridSize;
            let cellY = startY + j * gridSize;
            
            if (density > 0) {
                let heatColor;
                if (density === 1) {
                    heatColor = color(0, 100, 200, 150);
                } else if (density === 2) {
                    heatColor = color(0, 200, 150, 170);
                } else if (density === 3) {
                    heatColor = color(100, 220, 50, 190);
                } else if (density === 4) {
                    heatColor = color(220, 200, 0, 210);
                } else if (density >= 5 && density < 8) {
                    heatColor = color(255, 150, 0, 230);
                } else {
                    heatColor = color(255, 50, 0, 250);
                }
                
                fill(heatColor);
                rect(cellX, cellY, gridSize, gridSize);
            } else {
                fill(0, 10, 20, 80);
                rect(cellX, cellY, gridSize, gridSize);
            }
        }
    }
    
    noFill();
    stroke(0, 180, 200, 100);
    strokeWeight(0.5);
    rect(x, startY, mapW, mapH - 12);
    
    pop();
}

class FoodPellet {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0.5);
        this.size = random(4, 7);
        this.color = color(139, 69, 19);
        this.consumed = false;
        this.nutritionValue = 20;
    }
    
    update() {
        if (!this.consumed) {
            this.position.add(this.velocity);
            this.position.x += sin(frameCount * 0.05) * 0.3;
        }
    }
    
    show() {
        if (!this.consumed) {
            fill(this.color);
            stroke(89, 45, 10);
            strokeWeight(1);
            circle(this.position.x, this.position.y, this.size);
            
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

class Fish {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.size = random(12, 20);
        
        let colorChoice = floor(random(3));
        if (colorChoice === 0) {
            this.color = color(random(20, 80), random(100, 150), random(180, 230), 200);
        } else if (colorChoice === 1) {
            this.color = color(random(120, 180), random(50, 120), random(180, 230), 200);
        } else {
            this.color = color(random(200, 255), random(200, 255), random(200, 255), 200);
        }
        
        this.hunger = random(0, 50);
        this.hungerRate = random(0.02, 0.05);
        this.isDead = false;
        this.deathAngle = 0;
        this.opacity = 255;
        this.deathVelocity = 0;
        this.blinkState = false;
        this.blinkTimer = 0;
        this.originalColor = color(red(this.color), green(this.color), blue(this.color));
    }
    
    seekFood(pellets) {
        if (this.isDead) return;
        if (this.hunger < 30) return;
        
        let closest = null;
        let closestDist = Infinity;
        
        for (let pellet of pellets) {
            if (pellet.consumed) continue;
            
            let d = dist(this.position.x, this.position.y, pellet.position.x, pellet.position.y);
            
            if (d < closestDist && d < 150) {
                closestDist = d;
                closest = pellet;
            }
        }
        
        if (closest) {
            let desired = p5.Vector.sub(closest.position, this.position);
            desired.setMag(params.maxSpeed * 1.5);
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxForce * 2);
            this.acceleration.add(steer.mult(2));
            
            if (closest.isEaten(this.position, this.size)) {
                closest.consumed = true;
                this.hunger = max(0, this.hunger - closest.nutritionValue);
            }
        }
    }
    
    flock(fishes) {
        if (this.isDead) return;
        
        let alignment = this.align(fishes);
        let cohesion = this.cohere(fishes);
        let separation = this.separate(fishes);
        
        alignment.mult(params.alignment);
        cohesion.mult(params.cohesion);
        separation.mult(params.separation);
        
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }
    
    align(fishes) {
        let steering = createVector();
        let total = 0;
        
        for (let other of fishes) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            
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
    
    cohere(fishes) {
        let steering = createVector();
        let total = 0;
        
        for (let other of fishes) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            
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
    
    separate(fishes) {
        let steering = createVector();
        let total = 0;
        
        for (let other of fishes) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            
            if (other !== this && d < params.vision / 2) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d);
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
    
    update() {
        if (this.isDead) {
            this.deathVelocity += 0.15;
            this.position.y += this.deathVelocity;
            
            if (this.position.y >= height - 20) {
                this.opacity -= 8;
                this.opacity = max(0, this.opacity);
            }
        } else {
            this.position.add(this.velocity);
            this.velocity.add(this.acceleration);
            this.velocity.limit(params.maxSpeed);
            this.acceleration.mult(0);
            
            if (hungerEnabled) {
                this.hunger = min(100, this.hunger + this.hungerRate);
                
                if (deathEnabled && this.hunger >= 85) {
                    this.blinkTimer++;
                    if (this.blinkTimer % 15 === 0) {
                        this.blinkState = !this.blinkState;
                    }
                } else {
                    this.blinkState = false;
                    this.blinkTimer = 0;
                }
                
                if (deathEnabled && this.hunger >= 100) {
                    this.die();
                }
            } else {
                this.blinkState = false;
                this.blinkTimer = 0;
            }
        }
    }
    
    die() {
        this.isDead = true;
        this.deathAngle = this.velocity.heading() + PI;
        this.velocity.mult(0);
        this.color = color(120, 120, 120, 255);
    }
    
    edges() {
        if (this.isDead) return;
        
        const margin = 20;
        
        if (wallBounceMode) {
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
    
    show() {
        push();
        
        let angle;
        if (this.isDead) {
            angle = this.deathAngle;
        } else {
            angle = this.velocity.heading();
        }
        
        translate(this.position.x, this.position.y);
        rotate(angle);
        
        let currentColor = color(red(this.color), green(this.color), blue(this.color), this.opacity);
        
        if (!this.isDead && this.blinkState && deathEnabled && hungerEnabled) {
            currentColor = color(255, 0, 0, this.opacity);
        }
        
        fill(red(this.color) - 60, green(this.color) - 60, blue(this.color) - 60, this.opacity * 0.6);
        noStroke();
        ellipse(0, this.size * 0.15, this.size * 1.8, this.size * 0.8);
        
        fill(currentColor);
        stroke(red(this.color) - 40, green(this.color) - 40, blue(this.color) - 40, this.opacity * 0.7);
        strokeWeight(1.5);
        ellipse(0, 0, this.size * 1.8, this.size * 0.9);
        
        fill(255, 255, 255, this.opacity * 0.4);
        noStroke();
        ellipse(this.size * 0.2, -this.size * 0.15, this.size * 0.8, this.size * 0.3);
        
        fill(red(this.color) - 20, green(this.color) - 20, blue(this.color) - 20, this.opacity * 0.8);
        stroke(red(this.color) - 60, green(this.color) - 60, blue(this.color) - 60, this.opacity * 0.8);
        strokeWeight(1);
        
        beginShape();
        vertex(0, -this.size * 0.45);
        vertex(-this.size * 0.3, -this.size * 0.7);
        vertex(-this.size * 0.5, -this.size * 0.5);
        vertex(-this.size * 0.2, -this.size * 0.45);
        endShape(CLOSE);
        
        fill(red(this.color) - 30, green(this.color) - 30, blue(this.color) - 30, this.opacity * 0.7);
        beginShape();
        vertex(-this.size * 0.2, 0);
        vertex(-this.size * 0.5, this.size * 0.6);
        vertex(-this.size * 0.3, this.size * 0.3);
        endShape(CLOSE);
        
        beginShape();
        vertex(-this.size * 0.2, 0);
        vertex(-this.size * 0.5, -this.size * 0.6);
        vertex(-this.size * 0.3, -this.size * 0.3);
        endShape(CLOSE);
        
        fill(red(this.color) - 40, green(this.color) - 40, blue(this.color) - 40, this.opacity * 0.85);
        stroke(red(this.color) - 70, green(this.color) - 70, blue(this.color) - 70, this.opacity * 0.8);
        strokeWeight(1.5);
        
        beginShape();
        vertex(-this.size * 0.9, 0);
        vertex(-this.size * 1.3, -this.size * 0.5);
        vertex(-this.size * 1.1, -this.size * 0.2);
        endShape(CLOSE);
        
        beginShape();
        vertex(-this.size * 0.9, 0);
        vertex(-this.size * 1.3, this.size * 0.5);
        vertex(-this.size * 1.1, this.size * 0.2);
        endShape(CLOSE);
        
        fill(red(this.color) + 20, green(this.color) + 20, blue(this.color) + 20, this.opacity);
        noStroke();
        ellipse(this.size * 0.6, 0, this.size * 0.8, this.size * 0.7);
        
        if (!this.isDead) {
            fill(255, 255, 255, this.opacity);
            stroke(0, 0, 0, this.opacity * 0.4);
            strokeWeight(1);
            circle(this.size * 0.7, -this.size * 0.1, this.size * 0.25);
            
            fill(0, 0, 0, this.opacity);
            noStroke();
            circle(this.size * 0.75, -this.size * 0.12, this.size * 0.12);
            
            fill(255, 255, 255, this.opacity * 0.8);
            circle(this.size * 0.78, -this.size * 0.15, this.size * 0.05);
        } else {
            stroke(0, 0, 0, this.opacity * 0.6);
            strokeWeight(2);
            let eyeX = this.size * 0.7;
            let eyeY = -this.size * 0.1;
            let eyeSize = this.size * 0.15;
            line(eyeX - eyeSize, eyeY - eyeSize, eyeX + eyeSize, eyeY + eyeSize);
            line(eyeX - eyeSize, eyeY + eyeSize, eyeX + eyeSize, eyeY - eyeSize);
        }
        
        if (hungerEnabled && this.hunger > 30 && !this.isDead) {
            let barWidth = this.size * 1.5;
            let barHeight = 3;
            let barX = -barWidth / 2;
            let barY = -this.size * 1.2;
            
            fill(50, 50, 50, 150);
            noStroke();
            rect(barX, barY, barWidth, barHeight, 2);
            
            let hungerPercent = this.hunger / 100;
            let barColor;
            if (hungerPercent > 0.7) {
                barColor = color(220, 20, 20);
            } else if (hungerPercent > 0.4) {
                barColor = color(220, 180, 20);
            } else {
                barColor = color(100, 220, 20);
            }
            
            fill(barColor);
            rect(barX, barY, barWidth * hungerPercent, barHeight, 2);
        }
        
        stroke(red(this.color) - 80, green(this.color) - 80, blue(this.color) - 80, this.opacity * 0.8);
        strokeWeight(1.5);
        noFill();
        arc(this.size * 0.85, this.size * 0.05, this.size * 0.15, this.size * 0.1, 0, PI);
        
        pop();
    }
}

function drawWater() {
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(color(100, 180, 230), color(40, 120, 180), inter);
        stroke(c);
        line(0, y, width, y);
    }
    
    push();
    fill(255, 255, 255, 220);
    noStroke();
    textSize(24);
    textFont('Georgia, serif');
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    
    fill(0, 0, 0, 100);
    text("Welcome to Juanito's Reef", 22, 22);
    
    fill(0, 200, 255, 240);
    text("Welcome to Juanito's Reef", 20, 20);
    
    fill(255, 255, 255, 180);
    textSize(10);
    textStyle(NORMAL);
    textFont('monospace');
    text('~ Interactive Boids Simulation ~', 22, 48);
    
    pop();
}

function resetSimulation() {
    fishes = [];
    for (let i = 0; i < params.fishCount; i++) {
        fishes.push(new Fish());
    }
}

function randomizeParams() {
    const randomVision = Math.floor(Math.random() * (150 - 20) + 20);
    const randomCohesion = (Math.random() * 2).toFixed(1);
    const randomSeparation = (Math.random() * 3).toFixed(1);
    const randomAlignment = (Math.random() * 2).toFixed(1);
    const randomSpeed = (Math.random() * 5 + 1).toFixed(1);
    const randomFishCount = Math.floor(Math.random() * (100 - 10) + 10);
    
    params.vision = randomVision;
    params.cohesion = parseFloat(randomCohesion);
    params.separation = parseFloat(randomSeparation);
    params.alignment = parseFloat(randomAlignment);
    params.maxSpeed = parseFloat(randomSpeed);
    
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
    
    while (fishes.length < randomFishCount) {
        fishes.push(new Fish());
    }
    while (fishes.length > randomFishCount) {
        fishes.pop();
    }
    params.fishCount = randomFishCount;
}
