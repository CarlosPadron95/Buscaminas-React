# 💣 Buscaminas React + Vite

Un clon moderno y funcional del clásico juego Buscaminas, desarrollado como proyecto de práctica para el dominio de React Hooks, Algoritmia y CSS Grid.

## 🚀 Demo

Puedes jugar la versión en vivo aquí:
👉 [https://carlospadron95.github.io/Buscaminas-React/]

## 🛠️ Tecnologías Utilizadas

- **React 19** - Librería principal para la interfaz.
- **Vite** - Herramienta de construcción ultra rápida.
- **JavaScript (ES6+)** - Lógica del juego.
- **CSS Moderno** - Layout mediante CSS Grid y Flexbox.
- **GitHub Pages** - Despliegue y hosting.

## 🧠 Desafíos Técnicos Resueltos

### 1. Algoritmo de Expansión (Flood Fill)

Se implementó un algoritmo recursivo para la apertura automática de celdas vacías. Cuando el usuario hace clic en una celda con `0` minas cercanas, la función se llama a sí misma para revelar todas las celdas adyacentes seguras.

### 2. Gestión de Estado Complejo

Para manejar el tablero (una matriz de objetos), se utilizó la inmutabilidad de React. En cada movimiento, se realiza una clonación profunda del estado para asegurar que React detecte los cambios y actualice la UI de forma eficiente.

### 3. Persistencia de Datos

Uso de 'localStorage' para almacenar y recuperar el mejor tiempo (récord) del jugador, diferenciando por el tamaño del tablero seleccionado.

## 📋 Características

- **Configuración Dinámica:** Cambia el tamaño del tablero (8x8, 12x12, 16x16) y la cantidad de minas.
- **Cronómetro en tiempo real:** Mide tu agilidad.
- **Sistema de Banderas:** Clic derecho para marcar posibles minas.
- **Diseño Retro:** Estética inspirada en el Buscaminas clásico de Windows.
