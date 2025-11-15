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

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 525;

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
        fishes[i].seekFood(foodPellets);
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
        this.color = color(
            random(200, 255), 
            random(100, 180), 
            random(0, 80), 
            200
        );
        this.hunger = random(0, 50); // Nivel de hambre (0-100, más alto = más hambre)
        this.hungerRate = random(0.02, 0.05); // Qué tan rápido tiene hambre
        this.isDead = false;
        this.deathAngle = 0; // Ángulo fijo al morir (volteado)
        this.opacity = 255; // Opacidad durante muerte
        this.deathVelocity = 0; // Velocidad de caída
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
            // Animación de muerte - solo caída, sin rotación
            this.deathVelocity += 0.15; // Aceleración hacia abajo (gravedad)
            this.position.y += this.deathVelocity;
            
            // Fade out cuando toca el fondo
            if (this.position.y >= height - 20) {
                this.opacity -= 8; // Desvanecerse rápidamente
                this.opacity = max(0, this.opacity);
            }
        } else {
            // Comportamiento normal
            this.position.add(this.velocity);
            this.velocity.add(this.acceleration);
            this.velocity.limit(params.maxSpeed);
            this.acceleration.mult(0); // Reset
            
            // Incrementar hambre con el tiempo
            this.hunger = min(100, this.hunger + this.hungerRate);
            
            // Morir de hambre si alcanza 100
            if (this.hunger >= 100) {
                this.die();
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
        const margin = 20;
        
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
        
        // ========== BARRA DE HAMBRE (si tiene hambre y está vivo) ==========
        if (this.hunger > 30 && !this.isDead) {
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
    // Generar valores aleatorios para cada parámetro
    const randomVision = Math.floor(Math.random() * (150 - 20) + 20);
    const randomCohesion = (Math.random() * 2).toFixed(1);
    const randomSeparation = (Math.random() * 3).toFixed(1);
    const randomAlignment = (Math.random() * 2).toFixed(1);
    const randomSpeed = (Math.random() * 5 + 1).toFixed(1);
    const randomFishCount = Math.floor(Math.random() * (200 - 10) + 10);
    
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
    // Solo agregar comida si se hace click dentro del canvas
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        // Crear 3-5 pellets en la posición del click
        let numPellets = floor(random(3, 6));
        for (let i = 0; i < numPellets; i++) {
            let offsetX = random(-15, 15);
            let offsetY = random(-15, 15);
            foodPellets.push(new FoodPellet(mouseX + offsetX, mouseY + offsetY));
        }
    }
}
