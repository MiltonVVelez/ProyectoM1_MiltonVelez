
// Esta funcion lo que hara es generar un color HSL aleatorio

function generadorHSLrandom() {
    const h = Math.floor(Math.random() * 360); // En esta variable conseguims que el valor del Hue sea entro 0 y 359, lei que decir 360 es rendundante por que vuelve a ser el mismo rojo.
    const s = Math.floor(Math.random() * (70-10+ 1) + 10); // En esta variable guardamos un valor entre 70 y 10 de saturacion mas comoda para el ojo humano
    const l = Math.floor(Math.random() * (90 + 1 - 1) + 10); // Y en esta variable entre 90 y 10 de luminosidad

    return {h,s,l};
}

let paletaSeleccionada = [];

