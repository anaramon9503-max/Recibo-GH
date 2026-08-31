// ==============================
// CAMPOS DEL FORMULARIO
// ==============================

const nombre = document.getElementById("nombre");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const modalidad = document.getElementById("modalidad");
const importe = document.getElementById("importe");
const metodoPago = document.getElementById("metodoPago");
const estadoPago = document.getElementById("estadoPago");


// ==============================
// BOTONES
// ==============================

const btnConfirmacion = document.getElementById("btnConfirmacion");
const btnRecibo = document.getElementById("btnRecibo");
const btnGenerar = document.getElementById("btnGenerar");
const btnDescargar = document.getElementById("btnDescargar");


// ==============================
// DOCUMENTOS
// ==============================

const confirmacion = document.getElementById("confirmacion");
const recibo = document.getElementById("recibo");
const tituloPreview = document.getElementById("tituloPreview");

let tipoDocumento = "confirmacion";


// ==============================
// FORMATEAR FECHA
// ==============================

function formatearFecha(fechaTexto) {
  if (!fechaTexto) return "";

  const partes = fechaTexto.split("-");

  const anio = Number(partes[0]);
  const mes = Number(partes[1]) - 1;
  const dia = Number(partes[2]);

  const fechaLocal = new Date(anio, mes, dia);

  return fechaLocal.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}


// ==============================
// FORMATEAR HORA
// ==============================

function formatearHora(horaTexto) {
  if (!horaTexto) return "";

  const partes = horaTexto.split(":");

  let horas = Number(partes[0]);
  const minutos = partes[1];

  const periodo = horas >= 12 ? "p. m." : "a. m.";

  horas = horas % 12;

  if (horas === 0) {
    horas = 12;
  }

  return `${horas}:${minutos} ${periodo}`;
}


// ==============================
// FORMATEAR PRECIO
// ==============================

function formatearImporte(valor) {
  if (!valor) return "";

  return `$${Number(valor).toLocaleString("es-MX")} MXN`;
}


// ==============================
// ACTUALIZAR DATOS
// ==============================

function actualizarDatos() {
  const nombrePaciente = nombre.value.trim();

  const fechaSesion = formatearFecha(fecha.value);

  const horaSesion = formatearHora(hora.value);

  const modalidadSesion = modalidad.value;

  const precioSesion = formatearImporte(importe.value);

  const metodo = metodoPago.value;

  const estado = estadoPago.value;


  // CONFIRMACIÓN

  document.getElementById("confNombre").textContent =
    nombrePaciente;

  document.getElementById("confFecha").textContent =
    fechaSesion;

  document.getElementById("confHora").textContent =
    horaSesion;

  document.getElementById("confModalidad").textContent =
    modalidadSesion === "En línea"
      ? "Sesión en línea"
      : "Sesión presencial";

  document.getElementById("confImporte").textContent =
    precioSesion;


  // RECIBO

  document.getElementById("recNombre").textContent =
    nombrePaciente;

  document.getElementById("recFecha").textContent =
    fechaSesion;

  document.getElementById("recHora").textContent =
    horaSesion;

  document.getElementById("recModalidad").textContent =
    modalidadSesion;

  document.getElementById("recImporte").textContent =
    precioSesion;

  document.getElementById("recMetodo").textContent =
    metodo;

  document.getElementById("recEstado").textContent =
    estado.toUpperCase();


  // ESTADO DEL RECIBO

  if (estado === "Pago recibido") {
    document.getElementById("textoPagoPrincipal").textContent =
      "PAGO RECIBIDO";

    document.getElementById("mensajeFinalRecibo").textContent =
      "Tu sesión está confirmada";
  } else {
    document.getElementById("textoPagoPrincipal").textContent =
      "PAGO PENDIENTE";

    document.getElementById("mensajeFinalRecibo").textContent =
      "Tu sesión está registrada";
  }
}


// ==============================
// MOSTRAR CONFIRMACIÓN
// ==============================

btnConfirmacion.addEventListener("click", function () {
  tipoDocumento = "confirmacion";

  btnConfirmacion.classList.add("activo");
  btnRecibo.classList.remove("activo");

  confirmacion.classList.remove("oculto");
  recibo.classList.add("oculto");

  tituloPreview.textContent = "Confirmación de sesión";

  actualizarDatos();
});


// ==============================
// MOSTRAR RECIBO
// ==============================

btnRecibo.addEventListener("click", function () {
  tipoDocumento = "recibo";

  btnRecibo.classList.add("activo");
  btnConfirmacion.classList.remove("activo");

  recibo.classList.remove("oculto");
  confirmacion.classList.add("oculto");

  tituloPreview.textContent = "Recibo de pago";

  actualizarDatos();
});


// ==============================
// GENERAR DOCUMENTO
// ==============================

btnGenerar.addEventListener("click", function () {
  actualizarDatos();

  if (tipoDocumento === "confirmacion") {
    confirmacion.classList.remove("oculto");
    recibo.classList.add("oculto");
  } else {
    recibo.classList.remove("oculto");
    confirmacion.classList.add("oculto");
  }

  document
    .getElementById("contenedorPreview")
    .scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
});


// ==============================
// ACTUALIZAR AUTOMÁTICAMENTE
// ==============================

[
  nombre,
  fecha,
  hora,
  modalidad,
  importe,
  metodoPago,
  estadoPago
].forEach(function (campo) {

  campo.addEventListener("input", actualizarDatos);
  campo.addEventListener("change", actualizarDatos);

});


// ==============================
// ESPERAR IMÁGENES
// ==============================

function esperarImagenes(elemento) {
  const imagenes = elemento.querySelectorAll("img");

  const promesas = [];

  imagenes.forEach(function (img) {

    if (img.complete) {
      return;
    }

    promesas.push(
      new Promise(function (resolve) {
        img.onload = resolve;
        img.onerror = resolve;
      })
    );

  });

  return Promise.all(promesas);
}


// ==============================
// DESCARGAR PNG
// ==============================

btnDescargar.addEventListener("click", async function () {

  actualizarDatos();

  const documento =
    tipoDocumento === "confirmacion"
      ? confirmacion
      : recibo;


  if (typeof html2canvas === "undefined") {
    alert("No se pudo cargar la función para descargar la imagen.");
    return;
  }


  const textoOriginal = btnDescargar.textContent;

  btnDescargar.disabled = true;
  btnDescargar.textContent = "Generando imagen...";


  try {

    // Asegurar que el documento esté visible

    documento.classList.remove("oculto");


    // Esperar imágenes

    await esperarImagenes(documento);


    // Esperar fuentes si están disponibles

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }


    // Forzar tamaño correcto antes de capturar

    documento.classList.add("generando");


    // Esperar un momento para que el navegador acomode todo

    await new Promise(function (resolve) {
      setTimeout(resolve, 300);
    });


    const canvas = await html2canvas(documento, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#fffaf6",
      logging: false,
      scrollX: 0,
      scrollY: 0,
      width: documento.scrollWidth,
      height: documento.scrollHeight,
      windowWidth: 1200,
      windowHeight: documento.scrollHeight
    });


    const paciente =
      nombre.value.trim()
        .replace(/\s+/g, "_")
        .replace(/[^\wáéíóúÁÉÍÓÚñÑ_-]/g, "") || "paciente";


    const nombreArchivo =
      `${tipoDocumento}_${paciente}.png`;


    canvas.toBlob(function (blob) {

      if (!blob) {
        alert("No se pudo crear la imagen.");
        return;
      }


      const url = URL.createObjectURL(blob);

      const enlace = document.createElement("a");

      enlace.href = url;
      enlace.download = nombreArchivo;

      enlace.style.display = "none";

      document.body.appendChild(enlace);

      enlace.click();

      enlace.remove();


      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 2000);

    }, "image/png");


  } catch (error) {

    console.error("Error al generar PNG:", error);

    alert("No se pudo descargar la imagen.");

  } finally {

    documento.classList.remove("generando");

    btnDescargar.disabled = false;
    btnDescargar.textContent = textoOriginal;

  }

});


// ==============================
// INICIO
// ==============================

document.addEventListener("DOMContentLoaded", function () {

  tipoDocumento = "confirmacion";

  confirmacion.classList.remove("oculto");
  recibo.classList.add("oculto");

  btnConfirmacion.classList.add("activo");
  btnRecibo.classList.remove("activo");

  actualizarDatos();

});
