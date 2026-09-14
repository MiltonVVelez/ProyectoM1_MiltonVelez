# 🎨 Generador de Paletas de Color (Colorfly Studio)

¡Bienvenido al **Generador de Paletas de Color**! Una aplicación web nativa (Vanilla JS) diseñada para ayudar a diseñadores y desarrolladores a crear, ajustar y guardar paletas de colores armoniosas.

🌍 **[Ver Demo en Vivo](https://miltonvvelez.github.io/ProyectoM1_MiltonVelez/)**

---

## ✨ Características Principales

* **Generación Inteligente de Colores:** Utiliza el modelo HSL limitando la saturación y luminosidad para generar colores siempre agradables a la vista.
* **Modo Oscuro/Claro:** Transición suave entre temas para mejorar la experiencia de usuario y accesibilidad.
* **Tamaño Dinámico:** Permite elegir entre 3 y 10 colores por paleta.
* **Bloqueo de Colores:** ¿Te gusta un color pero quieres cambiar los demás? Bloquéalo (🔒) y regenera el resto.
* **Copiar al Portapapeles:** Haz clic en los valores **HEX** o **HSL** para copiarlos al instante con notificaciones *Toast* interactivas.
* **Almacenamiento Local:** Guarda tus paletas favoritas; persistirán incluso si cierras el navegador (gracias a `localStorage`).

---

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido sin frameworks, demostrando un sólido dominio de las tecnologías web base:

* **HTML5:** Estructura semántica (`<header>`, `<main>`, `<section>`, `<aside>`).
* **CSS3:** 
  * Uso avanzado de **Custom Properties (Variables)** como *Design Tokens* para temas, espaciados y tipografías.
  * Diseño Responsivo y estado de estilos (Light/Dark mode).
* **JavaScript (ES6+):**
  * Manipulación dinámica del DOM.
  * Gestión de estado local mediante arrays de objetos.
  * Uso de APIs del navegador (`navigator.clipboard`, `localStorage`).
  * Cálculos matemáticos para conversión de HSL a HEX.

---

## 🧠 Lógica y Arquitectura

### 1. Generación de Color (El secreto visual)
En lugar de generar valores HEX al azar (lo que resulta en colores sucios o demasiado fluorescentes), la aplicación utiliza **HSL (Hue, Saturation, Lightness)**:
* **Hue (Tono):** 0 - 359 (Cualquier color del espectro).
* **Saturation (Saturación):** Limitada entre 10% y 70%.
* **Lightness (Luminosidad):** Limitada entre 10% y 90%.
Esto garantiza que los colores generados sean estéticamente agradables y cómodos para el ojo humano. Posteriormente, una función matemática (`hslToHex`) convierte estos valores al estándar HEX utilizado en CSS.

### 2. Gestión de Estado (`configuracionPaleta`)
El núcleo de la aplicación es el array `configuracionPaleta`. Este array funciona como el "Estado" (State) de la app. Cada vez que se cambia el número de colores o se hace clic en "Generar", este array se actualiza respetando los colores que tienen la propiedad `estaBloqueado: true`. Posteriormente, la función `renderizarPaleta()` pinta el DOM basándose **únicamente** en este array.

---

## 🚀 Cómo Desplegar (GitHub Pages)

Este proyecto es ideal para alojarse de forma gratuita en GitHub Pages, ya que es 100% estático (Frontend).

1. Sube tu código a un repositorio público en GitHub.
2. Ve a la pestaña **Settings** (Configuración) de tu repositorio.
3. En el menú lateral izquierdo, haz clic en **Pages**.
4. En **Source** (o Build and deployment), selecciona la rama `main` (o `master`) y la carpeta `/ (root)`.
5. Haz clic en **Save**.
6. En un par de minutos, GitHub te proporcionará un enlace (ej: `https://[tu-usuario].github.io/[tu-repo]/`). ¡Pon ese enlace en la parte superior de este README!

---

## 🧑‍💻 Guía de Mantenimiento para Desarrolladores

Si deseas hacer un fork o contribuir al proyecto, aquí tienes cómo está estructurado para facilitar su escalabilidad:

### CSS (Design Tokens)
Todo el aspecto visual está controlado por variables en `:root` dentro de `style.css`. 
* Si quieres cambiar el esquema de colores del modo claro/oscuro, modifica las variables `--light-*` y `--dark-*`.
* Los espaciados y bordes están tokenizados (`--space-4`, `--radius-md`). Evita usar valores fijos (px/rem) directamente en las clases; usa siempre las variables.

### JavaScript
El archivo `app.js` sigue un patrón imperativo pero modular. 
* **Para agregar un nuevo formato de color (ej. RGB):**
  1. Crea una función matemática `hslToRgb(h, s, l)`.
  2. Modifica `generadorHSLrandom()` para que también retorne el string RGB.
  3. En `renderizarPaleta()`, clona la lógica de `infoHex` o `infoHsl` para crear un nuevo párrafo con el valor RGB y su respectivo EventListener para el portapapeles.

### LocalStorage
Las paletas se guardan bajo la key `colorfly_palettes`. Si en el futuro necesitas guardar más información (como nombres para las paletas), asegúrate de migrar la estructura actual (que es un array de arrays de HEX) a un array de objetos.

---

## ✒️ Autor

Creado por **Milton V Vélez**
* GitHub: [@MiltonVVelez](https://github.com/MiltonVVelez)
* Proyecto desarrollado para Colorfly Studio (2026).