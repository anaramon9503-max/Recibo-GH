const nombre = document.getElementById("nombre");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const modalidad = document.getElementById("modalidad");
const importe = document.getElementById("importe");
const metodoPago = document.getElementById("metodoPago");
const estadoPago = document.getElementById("estadoPago");

const btnConfirmacion = document.getElementById("btnConfirmacion");
const btnRecibo = document.getElementById("btnRecibo");
const btnGenerar = document.getElementById("btnGenerar");
const btnDescargar = document.getElementById("btnDescargar");

const confirmacion = document.getElementById("confirmacion");
const recibo = document.getElementById("recibo");
const tituloPreview = document.getElementById("tituloPreview");

/* =========================================================
   VARIABLES DE CONTROL
========================================================= */

let tipoDocumento = "confirmacion";


/* =========================================================
   CAMBIAR ENTRE CONFIRMACIÓN Y RECIBO
========================================================= */

btnConfirmacion.addEventListener("click", () => {
  tipoDocumento = "confirmacion";

  btnConfirmacion.classList.add("activo");
  btnRecibo.classList.remove("activo");

  confirmacion.classList.remove("oculto");
  recibo.classList.add("oculto");

  tituloPreview.textContent = "Confirmación de sesión";
});


btnRecibo.addEventListener("click", () => {
  tipoDocumento = "recibo";

  btnRecibo.classList.add("activo");
  btnConfirmacion.classList.remove("activo");

  recibo.classList.remove("oculto");
  confirmacion.classList.add("oculto");

  tituloPreview.textContent = "Recibo de pago";
});


/* =========================================================
   FORMATO DE FECHA
========================================================= */

function formatearFecha(valorFecha) {

  if (!valorFecha) {
    return "Fecha de la sesión";
  }

  const partes = valorFecha.split("-");

  const anio = Number(partes[0]);
  const mes = Number(partes[1]) - 1;
  const dia = Number(partes[2]);

  const fechaObjeto = new Date(anio, mes, dia);

  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado"
  ];

  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre"
  ];

  return `${dias[fechaObjeto.getDay()]}, ${dia} de ${meses[mes]} de ${anio}`;
}


/* =========================================================
   FORMATO DE HORA
========================================================= */

function formatearHora(valorHora) {

  if (!valorHora) {
    return "Hora de la sesión";
  }

  const partes = valorHora.split(":");

  let horas = Number(partes[0]);
  const minutos = partes[1];

  let periodo = "a. m.";

  if (horas >= 12) {
    periodo = "p. m.";
  }

  if (horas === 0) {
    horas = 12;
  } else if (horas > 12) {
    horas = horas - 12;
  }

  return `${horas}:${minutos} ${periodo}`;
}


/* =========================================================
   FORMATO DE MODALIDAD
========================================================= */

function formatearModalidadConfirmacion(valor) {

  if (valor === "En línea") {
    return "Sesión en línea";
  }

  if (valor === "Presencial") {
    return "Sesión presencial";
  }

  return valor;
}


/* =========================================================
   FORMATO DEL IMPORTE
========================================================= */

function formatearImporte(valor) {

  if (!valor) {
    return "$0 MXN";
  }

  const numero = Number(valor);

  return `$${numero.toLocaleString("es-MX")} MXN`;
}


/* =========================================================
   GENERAR DOCUMENTO
========================================================= */

btnGenerar.addEventListener("click", () => {

  const nombreValor =
    nombre.value.trim() || "NOMBRE DEL PACIENTE";

  const fechaValor =
    formatearFecha(fecha.value);

  const horaValor =
    formatearHora(hora.value);

  const modalidadValor =
    modalidad.value;

  const importeValor =
    formatearImporte(importe.value);

  const metodoValor =
    metodoPago.value;

  const estadoValor =
    estadoPago.value;


  /* =======================================================
     DATOS DE LA CONFIRMACIÓN
  ======================================================= */

  document.getElementById("confNombre").textContent =
    nombreValor;

  document.getElementById("confFecha").textContent =
    fechaValor;

  document.getElementById("confHora").textContent =
    horaValor;

  document.getElementById("confModalidad").textContent =
    formatearModalidadConfirmacion(modalidadValor);

  document.getElementById("confImporte").textContent =
    importeValor;


  /* =======================================================
     DATOS DEL RECIBO
  ======================================================= */

  document.getElementById("recNombre").textContent =
    nombreValor;

  document.getElementById("recFecha").textContent =
    fechaValor;

  document.getElementById("recHora").textContent =
    horaValor;

  document.getElementById("recModalidad").textContent =
    modalidadValor;

  document.getElementById("recImporte").textContent =
    importeValor;

  document.getElementById("recMetodo").textContent =
    metodoValor;

  document.getElementById("recEstado").textContent =
    estadoValor.toUpperCase();


  /* =======================================================
     TEXTO PRINCIPAL DEL RECIBO
  ======================================================= */

  const textoPagoPrincipal =
    document.getElementById("textoPagoPrincipal");

  const mensajeFinalRecibo =
    document.getElementById("mensajeFinalRecibo");


  if (estadoValor === "Pago recibido") {

    textoPagoPrincipal.textContent =
      "PAGO RECIBIDO";

    mensajeFinalRecibo.textContent =
      "Tu sesión está confirmada";

  } else {

    textoPagoPrincipal.textContent =
      "PAGO PENDIENTE";

    mensajeFinalRecibo.textContent =
      "Tu sesión está registrada";

  }


  /* =======================================================
     MOSTRAR EL DOCUMENTO SELECCIONADO
  ======================================================= */

  if (tipoDocumento === "confirmacion") {

    confirmacion.classList.remove("oculto");
    recibo.classList.add("oculto");

  } else {

    recibo.classList.remove("oculto");
    confirmacion.classList.add("oculto");

  }


  /* =======================================================
     BAJAR A LA VISTA PREVIA
  ======================================================= */

  document
    .getElementById("contenedorPreview")
    .scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

});


/* =========================================================
   DESCARGAR PNG
========================================================= */

btnDescargar.addEventListener("click", async () => {

  const documentoActivo =
    tipoDocumento === "confirmacion"
      ? confirmacion
      : recibo;


  /* =======================================================
     VERIFICAR QUE HTML2CANVAS CARGÓ
  ======================================================= */

  if (typeof html2canvas === "undefined") {

    alert(
      "No se pudo cargar la función de descarga. Revisa tu conexión a internet."
    );

    return;
  }


  /* =======================================================
     PREPARAR DOCUMENTO
  ======================================================= */

  documentoActivo.classList.add("generando");


  const textoOriginal =
    btnDescargar.textContent;

  btnDescargar.textContent =
    "Generando imagen...";

  btnDescargar.disabled =
    true;


  try {

    /* =====================================================
       ESPERAR FUENTES E IMÁGENES
    ===================================================== */

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }


    const imagenes =
      documentoActivo.querySelectorAll("img");

    await Promise.all(

      Array.from(imagenes).map((img) => {

        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {

          img.onload = resolve;
          img.onerror = resolve;

        });

      })

    );


    /* =====================================================
       CREAR CANVAS
    ===================================================== */

    const canvas =
      await html2canvas(documentoActivo, {

        scale: 2,

        useCORS: true,

        allowTaint: false,

        backgroundColor: "#fffaf6",

        logging: false,

        scrollX: 0,

        scrollY: 0,

        windowWidth: 1200

      });


    /* =====================================================
       CREAR NOMBRE DEL ARCHIVO
    ===================================================== */

    const nombrePaciente =
      nombre.value.trim()
        .replace(/\s+/g, "_")
        .replace(/[^\wáéíóúÁÉÍÓÚñÑ_-]/g, "");


    const tipoNombre =
      tipoDocumento === "confirmacion"
        ? "confirmacion"
        : "recibo";


    const nombreArchivo =
      nombrePaciente
        ? `${tipoNombre}_${nombrePaciente}.png`
        : `${tipoNombre}_sesion.png`;


    /* =====================================================
       DESCARGAR
    ===================================================== */

    const enlace =
      document.createElement("a");

    enlace.download =
      nombreArchivo;

    enlace.href =
      canvas.toDataURL("image/png", 1.0);

    document.body.appendChild(enlace);

    enlace.click();

    enlace.remove();


  } catch (error) {

    console.error(error);

    alert(
      "Hubo un problema al generar la imagen. Intenta nuevamente."
    );

  } finally {

    documentoActivo.classList.remove("generando");

    btnDescargar.textContent =
      textoOriginal;

    btnDescargar.disabled =
      false;

  }

});


/* =========================================================
   ACTUALIZACIÓN AUTOMÁTICA DEL PREVIEW
========================================================= */

const camposFormulario = [
  nombre,
  fecha,
  hora,
  modalidad,
  importe,
  metodoPago,
  estadoPago
];


camposFormulario.forEach((campo) => {

  campo.addEventListener("change", () => {
    btnGenerar.click();
  });

});


/* =========================================================
   VALOR INICIAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  confirmacion.classList.remove("oculto");

  recibo.classList.add("oculto");

  btnConfirmacion.classList.add("activo");

  btnRecibo.classList.remove("activo");

});
