const inputSize = document.getElementById("numero-de-colores");
const containerPaletas = document.getElementById("container-paletas");
let configuracionPaleta = [];


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
  configuracionPaleta.forEach((slot, index) => {
    const paleta = document.createElement("article");
    paleta.classList.add("paleta-de-color");
    paleta.style.backgroundColor = slot.hex;

    // A la hora de renderizar nuestra paleta, tambien crearemos un Event listener que esperara a que la tarjeta sea clickeada para copiar el hex 


    paleta.addEvenetListener("click", () => {
    copyToClipboard(slot.hex);
    });

    //Info del Hex

    const info = document.createElement("p");
    info.classList.add("hex-color-id");
    info.textContent = slot.hex;

    //Boton de bloqueo
  const lockBtn = document.createElement("button");
  lockBtn.classList.add("icono-candado");
  if (slot.estaBloqueado) lockBtn.classList.add("locked");
  lockBtn.setAttribute("aria-label", slot.estaBloqueado ? "Desbloquear" : "Bloquear");
  lockBtn.textContent = slot.estaBloqueado ? "🔒" : "🔓";

  //Aqui evitamos que cuando pulsemos el boton, no copie el hex al clipboard.

  lockBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLock(index);
    });

    paleta.appendChild(info);
    paleta.appendChild(lockBtn);
    containerPaletas.appendChild(paleta);
  });
}

// Esta funcion alterna entre los dos estados (true o false) del boton de bloqueo de colores
function toggleLock(index) {
  configuracionPaleta[index].estaBloqueado = !configuracionPaleta[index].estaBloqueado;
  checkLockState();
  renderPalette();
}







