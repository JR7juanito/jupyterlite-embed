"""
MODELO 3D DE PEZ REALISTA
Para uso en proyecto OpenGL/Pyglet de acuario interactivo
Basado en la forma de pez torpedo/tiburón pequeño
"""

import numpy as np
from typing import List, Tuple

class Fish3DModel:
    """
    Genera vértices y normales para un pez 3D realista
    Inspirado en la forma aerodinámica de peces torpedo
    """
    
    def __init__(self, length=1.0, thickness=0.3):
        """
        Args:
            length: Longitud total del pez (de cabeza a cola)
            thickness: Grosor máximo del cuerpo
        """
        self.length = length
        self.thickness = thickness
        self.vertices = []
        self.normals = []
        self.indices = []
        
    def generate_body(self, segments=16, rings=8):
        """
        Genera el cuerpo principal del pez usando revolución
        
        Perfil del pez (vista lateral):
        - x: 0.0 (nariz) → 1.0 (cola)
        - y: grosor en cada punto
        """
        
        # Perfil del pez (forma aerodinámica)
        profile_points = []
        
        for i in range(rings + 1):
            t = i / rings  # 0.0 a 1.0
            x = t * self.length
            
            # Función del grosor (forma de torpedo)
            if t < 0.15:  # Cabeza puntiaguda
                y = self.thickness * (t / 0.15) * 0.6
            elif t < 0.35:  # Cuerpo principal engrosándose
                y = self.thickness * (0.6 + (t - 0.15) / 0.2 * 0.4)
            elif t < 0.65:  # Parte más gruesa
                y = self.thickness
            elif t < 0.85:  # Adelgazándose hacia la cola
                y = self.thickness * (1.0 - (t - 0.65) / 0.2 * 0.7)
            else:  # Cola fina
                y = self.thickness * 0.3 * (1.0 - (t - 0.85) / 0.15)
            
            profile_points.append((x, y))
        
        # Revolución del perfil alrededor del eje X
        vertices = []
        for ring_idx, (x, radius) in enumerate(profile_points):
            for seg in range(segments):
                angle = (seg / segments) * 2 * np.pi
                
                # Coordenadas cilíndricas a cartesianas
                y = radius * np.cos(angle)
                z = radius * np.sin(angle)
                
                vertices.append([x, y, z])
        
        self.vertices = np.array(vertices, dtype=np.float32)
        
        # Generar índices para triángulos
        indices = []
        for ring in range(rings):
            for seg in range(segments):
                # Índices de los 4 vértices del quad
                current = ring * segments + seg
                next_seg = ring * segments + (seg + 1) % segments
                next_ring = (ring + 1) * segments + seg
                next_both = (ring + 1) * segments + (seg + 1) % segments
                
                # Dos triángulos por quad
                indices.extend([current, next_ring, next_seg])
                indices.extend([next_seg, next_ring, next_both])
        
        self.indices = np.array(indices, dtype=np.uint32)
        
        # Calcular normales
        self._calculate_normals()
        
        return self.vertices, self.normals, self.indices
    
    def generate_dorsal_fin(self):
        """Genera aleta dorsal (parte superior)"""
        # Forma triangular curvada
        base_x = self.length * 0.4  # Posición en el cuerpo
        height = self.thickness * 1.2
        width = self.length * 0.15
        
        fin_vertices = np.array([
            # Base del triángulo
            [base_x, 0, self.thickness],
            [base_x + width * 0.3, 0, self.thickness],
            [base_x + width * 0.7, 0, self.thickness],
            # Punta
            [base_x + width * 0.4, 0, self.thickness + height],
        ], dtype=np.float32)
        
        fin_indices = np.array([
            0, 1, 3,
            1, 2, 3,
        ], dtype=np.uint32)
        
        return fin_vertices, fin_indices
    
    def generate_pectoral_fins(self):
        """Genera aletas pectorales (laterales)"""
        base_x = self.length * 0.3
        base_y = self.thickness * 0.7
        length = self.length * 0.2
        width = self.thickness * 0.6
        
        # Aleta derecha
        right_fin = np.array([
            [base_x, base_y, 0],
            [base_x - length * 0.3, base_y + width, -width * 0.3],
            [base_x - length, base_y + width * 0.5, -width * 0.5],
        ], dtype=np.float32)
        
        # Aleta izquierda (simétrica)
        left_fin = np.array([
            [base_x, -base_y, 0],
            [base_x - length * 0.3, -base_y - width, -width * 0.3],
            [base_x - length, -base_y - width * 0.5, -width * 0.5],
        ], dtype=np.float32)
        
        return right_fin, left_fin
    
    def generate_tail(self):
        """Genera cola en forma de media luna"""
        base_x = self.length * 0.95
        height = self.thickness * 1.5
        
        # Cola con dos lóbulos
        tail_vertices = np.array([
            # Centro
            [base_x, 0, 0],
            # Lóbulo superior
            [base_x - self.length * 0.1, 0, height * 0.3],
            [base_x - self.length * 0.15, 0, height * 0.7],
            [base_x - self.length * 0.12, 0, height],
            # Lóbulo inferior
            [base_x - self.length * 0.1, 0, -height * 0.3],
            [base_x - self.length * 0.15, 0, -height * 0.7],
            [base_x - self.length * 0.12, 0, -height],
        ], dtype=np.float32)
        
        tail_indices = np.array([
            # Lóbulo superior
            0, 1, 2,
            0, 2, 3,
            # Lóbulo inferior
            0, 4, 5,
            0, 5, 6,
        ], dtype=np.uint32)
        
        return tail_vertices, tail_indices
    
    def _calculate_normals(self):
        """Calcula normales promedio para cada vértice"""
        # Inicializar normales en cero
        normals = np.zeros_like(self.vertices)
        
        # Para cada triángulo
        for i in range(0, len(self.indices), 3):
            idx0, idx1, idx2 = self.indices[i:i+3]
            
            v0 = self.vertices[idx0]
            v1 = self.vertices[idx1]
            v2 = self.vertices[idx2]
            
            # Calcular normal del triángulo
            edge1 = v1 - v0
            edge2 = v2 - v0
            normal = np.cross(edge1, edge2)
            
            # Acumular en los vértices
            normals[idx0] += normal
            normals[idx1] += normal
            normals[idx2] += normal
        
        # Normalizar
        norms = np.linalg.norm(normals, axis=1, keepdims=True)
        norms[norms == 0] = 1  # Evitar división por cero
        self.normals = normals / norms
        
        return self.normals
    
    def get_complete_model(self):
        """
        Retorna el modelo completo del pez (cuerpo + aletas + cola)
        """
        body_verts, body_normals, body_indices = self.generate_body()
        
        return {
            'vertices': body_verts,
            'normals': body_normals,
            'indices': body_indices,
            'vertex_count': len(body_verts),
            'triangle_count': len(body_indices) // 3
        }
    
    def export_to_obj(self, filename="fish_model.obj"):
        """Exporta el modelo a formato OBJ para visualización"""
        with open(filename, 'w') as f:
            f.write("# Fish 3D Model\n")
            f.write(f"# Generated with {self.__class__.__name__}\n\n")
            
            # Escribir vértices
            for v in self.vertices:
                f.write(f"v {v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")
            
            f.write("\n")
            
            # Escribir normales
            for n in self.normals:
                f.write(f"vn {n[0]:.6f} {n[1]:.6f} {n[2]:.6f}\n")
            
            f.write("\n")
            
            # Escribir caras (índices OBJ empiezan en 1)
            for i in range(0, len(self.indices), 3):
                i0 = self.indices[i] + 1
                i1 = self.indices[i+1] + 1
                i2 = self.indices[i+2] + 1
                f.write(f"f {i0}//{i0} {i1}//{i1} {i2}//{i2}\n")
        
        print(f"✅ Modelo exportado a: {filename}")
        print(f"   Vértices: {len(self.vertices)}")
        print(f"   Triángulos: {len(self.indices) // 3}")


# ============================================
# EJEMPLO DE USO
# ============================================
if __name__ == "__main__":
    print("🐟 Generando modelo 3D de pez...")
    
    # Crear modelo
    fish = Fish3DModel(length=2.0, thickness=0.6)
    model_data = fish.get_complete_model()
    
    print(f"\n📊 Estadísticas del modelo:")
    print(f"   Vértices: {model_data['vertex_count']}")
    print(f"   Triángulos: {model_data['triangle_count']}")
    
    # Exportar a OBJ (puedes abrirlo en Blender/MeshLab)
    fish.export_to_obj("fish_realistic.obj")
    
    print("\n💡 Para usar en tu proyecto OpenGL:")
    print("   1. Importa esta clase en tu código")
    print("   2. Genera el modelo: fish = Fish3DModel()")
    print("   3. Obtén los datos: data = fish.get_complete_model()")
    print("   4. Crea VAO/VBO con vertices, normals, indices")
    print("   5. Renderiza con glDrawElements()")
