# Resumen de Pruebas AED

Este documento resume la funcionalidad añadida en el Duo Python Lab para testear código inspirado en los apuntes de **Algoritmos y Estructuras de Datos**.

## Implementado

- Harness interno de pruebas para verificar funciones representativas de los apuntes desde el editor/consola.
- Runner de pruebas que ejecuta el código actual en un namespace temporal.
- Captura de salida estándar y de errores del código cargado para no contaminar el reporte.
- Reporte de resultados con estados `OK`, `FAIL` y `SKIP`.
- Mensajería entre editor y consola para reportar el estado de ejecución.

## Cobertura actual

La suite incluye casos representativos de:

- Capítulo 1: `maximo`, `minmax`, `particionLomuto`, `evalp`, `busca`, `CamelCase`.
- Capítulo 3: `mult3`, `contar_ceros`, `LCS`, `salida`.
- Capítulo 4: `binterp`, `reversar`, listas doblemente enlazadas, `evaluar`.
- Capítulo 5: `chequeo`, `chequeo2`, `Heap.modificar`.
- Capítulo 6: `LCA`, `esABB`.
- Capítulo 7: `quicksort3`, `merge` compacto.
- Capítulo 8: `fracaso`, `kmp`, `bmh`, `bms`.
- Capítulo 10: `DFS`, `startDFS`.

## Comportamiento

- Si una función no está definida en el código actual, la suite la marca como `SKIP`.
- Si no hay tests aplicables, la ejecución se considera correcta si no hubo fallos.
- El modo normal de `Ejecutar` sigue funcionando como archivo temporal persistente entre ejecuciones.

## Nota

La cobertura de grafos queda limitada a recorridos básicos por ahora. Se puede ampliar después para MST y caminos mínimos si se normalizan las estructuras de datos usadas en esos ejercicios.
