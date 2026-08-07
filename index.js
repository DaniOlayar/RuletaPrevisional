let baseDeDatos = {};
let categorias = [];
let rotacionActual = 0;
let puntajeActual = 0; // Variable para los puntos

// Referencias del DOM
const ruleta = document.getElementById("ruleta");
const btnGirar = document.getElementById("btn-girar");
const panelInicio = document.getElementById("panel-inicio");
const seccionJuego = document.getElementById("seccion-juego");
const inputNombre = document.getElementById("input-nombre");
const btnComenzar = document.getElementById("btn-comenzar");
const marcadorPuntos = document.getElementById("marcador-puntos");
const spanNombreUsuario = document.getElementById("span-nombre-usuario");
const contadorPuntos = document.getElementById("contador-puntos");

const panelPregunta = document.getElementById("panel-pregunta");
const panelResultado = document.getElementById("panel-resultado");
const badgeCategoria = document.getElementById("categoria-badge");
const textoPregunta = document.getElementById("pregunta-texto");
const contenedorOpciones = document.getElementById("opciones");
const iconoResultado = document.getElementById("icono-resultado");
const textoResultado = document.getElementById("texto-resultado");
const btnReintentar = document.getElementById("btn-reintentar");

// --- 1. CARGAR DATOS DESDE EL JSON ---
async function cargarDatos() {
  try {
    const respuesta = await fetch("preguntas.json");
    baseDeDatos = await respuesta.json();
    categorias = Object.keys(baseDeDatos);
    inicializarRuleta();
  } catch (error) {
    console.error("Error al cargar preguntas:", error);
    alert(
      "Recuerda usar Live Server para cargar el archivo JSON correctamente.",
    );
  }
}

cargarDatos();

// --- 2. FLUJO DE INICIO ---
btnComenzar.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();
  if (nombre === "") {
    alert("Por favor, ingresa un nombre para continuar.");
    return;
  }

  // Configurar marcador
  spanNombreUsuario.textContent = nombre;
  marcadorPuntos.classList.remove("marcador-oculto");

  // Ocultar inicio y mostrar ruleta
  panelInicio.classList.add("oculto");
  seccionJuego.classList.remove("seccion-oculta");
  seccionJuego.classList.add("seccion-visible");
});

// --- 3. CONSTRUCCIÓN DE LA RULETA ---
function inicializarRuleta() {
  let gradientCSS = [];
  const anguloPorCategoria = 360 / categorias.length;

  categorias.forEach((cat, index) => {
    const color = baseDeDatos[cat].color;
    gradientCSS.push(
      `${color} ${index * anguloPorCategoria}deg ${(index + 1) * anguloPorCategoria}deg`,
    );

    const span = document.createElement("span");
    span.className = "etiqueta-ruleta";
    span.textContent = cat;

    const rotacionTexto =
      index * anguloPorCategoria + anguloPorCategoria / 2 - 90;
    span.style.transform = `translateY(-50%) rotate(${rotacionTexto}deg)`;

    ruleta.appendChild(span);
  });

  ruleta.style.background = `conic-gradient(${gradientCSS.join(", ")})`;
}

function ocultarPaneles() {
  panelPregunta.classList.remove("mostrar");
  panelPregunta.classList.add("oculto");
  panelResultado.classList.remove("mostrar");
  panelResultado.classList.add("oculto");
}

btnGirar.addEventListener("click", () => {
  ocultarPaneles();
  btnGirar.disabled = true;

  const gradosAleatorios = Math.floor(Math.random() * 360);
  const girosExtra = (Math.floor(Math.random() * 4) + 5) * 360;
  rotacionActual += girosExtra + gradosAleatorios;

  ruleta.style.transform = `rotate(${rotacionActual}deg)`;

  setTimeout(() => {
    btnGirar.disabled = false;
    determinarCategoria(rotacionActual);
  }, 3500);
});

function determinarCategoria(grados) {
  const normalizados = grados % 360;
  const gradoFlecha = (360 - normalizados) % 360;
  const anguloPorCategoria = 360 / categorias.length;
  const indice = Math.floor(gradoFlecha / anguloPorCategoria);

  cargarPregunta(categorias[indice]);
}

function cargarPregunta(nombreCategoria) {
  const datos = baseDeDatos[nombreCategoria];
  const pre =
    datos.preguntas[Math.floor(Math.random() * datos.preguntas.length)];

  badgeCategoria.textContent = nombreCategoria;
  badgeCategoria.style.backgroundColor = datos.color;
  textoPregunta.textContent = pre.pregunta;
  contenedorOpciones.innerHTML = "";

  pre.opciones.forEach((opcion) => {
    const btn = document.createElement("button");
    btn.className = "btn-opcion";
    btn.textContent = opcion;
    btn.onclick = () => verificarRespuesta(opcion, pre.respuesta);
    contenedorOpciones.appendChild(btn);
  });

  panelPregunta.classList.remove("oculto");
  panelPregunta.classList.add("mostrar");
}

function verificarRespuesta(seleccion, correcta) {
  ocultarPaneles();

  if (seleccion === correcta) {
    puntajeActual += 1; // Aumenta un punto si acierta
    contadorPuntos.textContent = puntajeActual;

    iconoResultado.textContent = "🎉";
    textoResultado.textContent = "¡Súper! +1 Punto.";
    textoResultado.style.color = "#6BCB77";
  } else {
    iconoResultado.textContent = "😅";
    textoResultado.textContent = "¡Casi! Era: " + correcta;
    textoResultado.style.color = "#FF6B6B";
  }

  btnReintentar.onclick = () => {
    ocultarPaneles();
    btnGirar.click();
  };

  panelResultado.classList.remove("oculto");
  panelResultado.classList.add("mostrar");
}
