# Pokédex Frontend ⚡

Una interfaz gráfica moderna y atractiva construida con **React**, **TypeScript** y **Vite** para descubrir y registrar Pokémon. Este frontend se conecta a la [PokeAPI](https://pokeapi.co/) para obtener la información de los Pokémon y a tu **backend de NestJS** para registrar cuáles has descubierto en tu base de datos.

## 🚀 Características

- Lista inicial de los primeros 150 Pokémon cargados desde PokeAPI.
- Diseño interactivo y premium "Glassmorphism" construido con CSS nativo.
- Sistema de descubrimiento: Los Pokémon no descubiertos aparecen oscurecidos ("siluetas"). Al presionar "Descubrir", se revelan sus verdaderos colores con animaciones fluidas y guardan registro de este hito directamente en la base de datos de tu backend.
- Proxy preconfigurado integrado en Vite (`vite.config.ts`) para redireccionar con seguridad al backend de desarrollo local y evitar errores de CORS y certificados.

## 📋 Requisitos Previos

Antes de ejecutar este proyecto, asegúrate de tener:

- [Node.js](https://nodejs.org/es/) instalado (versión 18+ sugerida).
- Preferiblemente el proyecto de tu **Backend de NestJS** y MongoDB en funcionamiento (exponiendo internamente en `http://localhost:3000`).

## 🛠️ Instalación

1. Clona este repositorio (si aún no lo has hecho):
   ```bash
   git clone https://github.com/kevin-2s/frontend-pokeapi.git
   cd frontend-pokeapi
   ```

2. Instala las dependencias de NPM:
   ```bash
   npm install
   ```

## ▶️ Ejecución del Proyecto

Para levantar el servidor de desarrollo ultrarrápido con Vite, ejecuta:

```bash
npm run dev
```

La aplicación se abrirá en [http://localhost:5173](http://localhost:5173). 

> **Nota de Configuración del Backend:** 
> Este frontend emite llamadas al backend usando la ruta local `/api` (ej. `/api/pokemon`). Bajo el capó de desarrollo, **Vite** intercepta esa ruta y la redirige hacia `http://localhost:3000`. Si tu backend de NestJS está usando un entorno de red o puerto diferente, deberás modificar `vite.config.ts`.

## 🧰 Tecnologías Utilizadas

- **React 18** (Estructura de la Interfaz)
- **TypeScript** (Tipado fuerte)
- **Vite** (Empaquetador y entorno local de desarrollo veloz)
- **Lucide React** (Librería minimalista de iconos)
- **Vanilla CSS** (Estilos, gradientes y animaciones clave)
