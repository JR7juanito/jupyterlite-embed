# Mini Duo Python

Este subproyecto agrega un generador y runtime nuevos sin tocar el Duo existente.

## Qué hace

- `index.html`: generador para escribir código, generar el link y copiar el iframe.
- `play.html`: runtime compartible del mini Duo Python.
- `main/`: ejemplos estáticos tipo `main/example1`, `main/example2`.

## Cómo se publica

El workflow actual copia todo `duo/` a `_output/duo/`, así que todo lo que agregues aquí queda publicado automáticamente en GitHub Pages cuando hagas push.

## Formas de compartir

- Link instantáneo: `play.html#state=...`
- Iframe instantáneo: generado por el panel.
- Ruta física: exporta el HTML y guárdalo como `main/exampleX/index.html` antes de publicar.

## Limitación real

GitHub Pages es estático. Crear una nueva ruta pública sin redeploy no es posible. Lo viable es:

- usar links con estado en hash para compartir al instante,
- o generar archivos estáticos nuevos y volver a publicar.
