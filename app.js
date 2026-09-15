const inputSize = document.getElementById("numero-de-colores");
const containerPaletas = document.getElementById("container-paletas");
const toast = document.getElementById("toast");
const botonGenerar = document.getElementById("boton-generar");
const botonGuardar = document.getElementById("boton-guardar");
const containerGuardadas = document.getElementById("paletas-guardadas");
const formatoColor = document.getElementById("formato-color");
let configuracionPaleta = [];

// ==========================================
// MODO OSCURO / CLARO
// ==========================================
const botonTema = document.getElementById("boton-tema");

botonTema.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const esModoOscuro = document.body.classList.contains("dark-mode");
  if (esModoOscuro) {
    botonTema.textContent = "☀️ Modo Claro";
  } else {
    botonTema.textContent = "🌙 Modo Oscuro";
  }
});


// Esta funcion lo que hara es generar un color HSL aleatorio

function generadorHSLrandom() {
    const h = Math.floor(Math.random() * 360); // En esta variable conseguims que el valor del Hue sea entro 0 y 359, lei que decir 360 es rendundante por que vuelve a ser el mismo rojo.
    const s = Math.floor(Math.random() * (70-10+ 1) + 10); // En esta variable guardamos un valor entre 70 y 10 de saturacion mas comoda para el ojo humano
    const l = Math.floor(Math.random() * (90 + 1 - 1) + 10); // Y en esta variable entre 90 y 10 de luminosidad

    const hex = hslToHex(h, s, l);
    return {h,s,l,hex};
}

// Convierte HSL a HEX (estándar matemático CSS)
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// ==========================================
//  RENDERIZADO Y CONTROL DE LA PALETA
// ==========================================


function configPaleta() {
  const sizeObjetivo = +(inputSize.value);
// Usamos Array.from para poder convertir un objeto array-like en un arreglo

  if(configuracionPaleta.length !== sizeObjetivo){
    configuracionPaleta = Array.from({length : sizeObjetivo}, () => ({
      ...generadorHSLrandom(),
      estaBloqueado : false
    }));
  } else {
    configuracionPaleta = configuracionPaleta.map((elemento) => {
      if (elemento.estaBloqueado) return elemento;
      return {... generadorHSLrandom(), estaBloqueado:false};

    });
  }
  renderizarPaleta();
  checkLockState();

}

function renderizarPaleta() {
  containerPaletas.innerHTML = "";
  
  const formatoSeleccionado = formatoColor.value;
  
  configuracionPaleta.forEach((slot, index) => {
    const paleta = document.createElement("article");
    paleta.classList.add("paleta-de-color");
    paleta.style.backgroundColor = slot.hex;

    const infoHex = document.createElement("p");
    infoHex.classList.add("hex-color-id");
    infoHex.textContent = slot.hex;
    infoHex.addEventListener("click", (e) => {
      e.stopPropagation();
      copyToClipboard(slot.hex);
    });

    const infoHsl = document.createElement("p");
    infoHsl.classList.add("hex-color-id");
    const stringHsl = `hsl(${slot.h}, ${slot.s}%, ${slot.l}%)`;
    infoHsl.textContent = stringHsl;
    infoHsl.addEventListener("click", (e) => {
      e.stopPropagation();
      copyToClipboard(stringHsl);
    });

    if (formatoSeleccionado === "HEX") {
      infoHsl.style.display = "none";
    } else {
      infoHex.style.display = "none";
    }

    const lockBtn = document.createElement("button");
    lockBtn.classList.add("icono-candado");
    if (slot.estaBloqueado) lockBtn.classList.add("locked");
    lockBtn.setAttribute("aria-label", slot.estaBloqueado ? "Desbloquear" : "Bloquear");
    lockBtn.textContent = slot.estaBloqueado ? "🔒" : "🔓";

    lockBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLock(index);
    });

    // --- 4. AGREGAR TODO AL DOM ---
    paleta.appendChild(infoHex);
    paleta.appendChild(infoHsl);
    paleta.appendChild(lockBtn);
    
    containerPaletas.appendChild(paleta);
  });
}

// Esta funcion alterna entre los dos estados (true o false) del boton de bloqueo de colores
function toggleLock(index) {
  configuracionPaleta[index].estaBloqueado = !configuracionPaleta[index].estaBloqueado;
  checkLockState();
  renderizarPaleta();
}


// Funcion para desactivar el inputSize, si hay algun color bloqueado

function checkLockState() {
  const hayBloqueados = configuracionPaleta.some((slot) => slot.estaBloqueado);
  inputSize.disabled = hayBloqueados;
}

// Las siguientes funciones trabajan para dar el feedback cuando se copia la info de HEX UN TOAST

function mostrarToast(message) {
  toast.textContent = message;
  toast.classList.add("mostrar");
  setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 2000);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    mostrarToast(`Copiado: ${text}`);
  }).catch(() => {
    mostrarToast("Error al copiar");
  });
}

// ==========================================
// 5. LOCAL STORAGE (Guardado de propuestas)
// ==========================================

function guardarPaleta() {
  const paletaActual = configuracionPaleta.map((slot) => slot.hex);
  const guardado = JSON.parse(localStorage.getItem("colorfly_palettes")) || [];
  
  guardado.unshift(paletaActual); // Agregamos la última al inicio
  localStorage.setItem("colorfly_palettes", JSON.stringify(guardado));

  mostrarToast("¡Paleta guardada!");
  cargarPaletasGuardadas();
}

function cargarPaletasGuardadas() {
  const guardado = JSON.parse(localStorage.getItem("colorfly_palettes")) || [];
  containerGuardadas.innerHTML = "";

  guardado.forEach((palette) => {
    const fila = document.createElement("div");
    fila.classList.add("fila-guardada");

    palette.forEach((hex) => {
      const paletaGuardada = document.createElement("div");
      paletaGuardada.classList.add("paleta-guardada");
      paletaGuardada.style.backgroundColor = hex;
      fila.appendChild(paletaGuardada);
    });

    containerGuardadas.appendChild(fila);
  });
}

botonGenerar.addEventListener("click", configPaleta);


formatoColor.addEventListener("change", () => {
  renderizarPaleta();
});

inputSize.addEventListener("change", () => {
  // Reset del estado para adaptarse al nuevo tamaño
  configuracionPaleta = [];
  configPaleta();
});

botonGuardar.addEventListener("click", guardarPaleta);

// Arranque inicial
configPaleta();
cargarPaletasGuardadas();

console.log("actualizado");