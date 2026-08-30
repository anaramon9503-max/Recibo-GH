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

const tituloVista = document.getElementById("tituloVista");
const grupoEstadoPago = document.getElementById("grupoEstadoPago");

const confNombre = document.getElementById("confNombre");
const confFecha = document.getElementById("confFecha");
const confHora = document.getElementById("confHora");
const confModalidad = document.getElementById("confModalidad");
const confImporte = document.getElementById("confImporte");
const confTransferencia = document.getElementById("confTransferencia");

const reciboNombre = document.getElementById("reciboNombre");
const reciboFecha = document.getElementById("reciboFecha");
const reciboHora = document.getElementById("reciboHora");
const reciboModalidad = document.getElementById("reciboModalidad");
const reciboImporte = document.getElementById("reciboImporte");
const reciboMetodo = document.getElementById("reciboMetodo");
const reciboEstado = document.getElementById("reciboEstado");

const estadoBanner = document.getElementById("estadoBanner");
const transferencia = document.getElementById("transferencia");

let tipoDocumento = "confirmacion";


/* =========================================
   FORMATO
========================================= */

function formatearFecha(valor) {
  if (!valor) return "--";

  const partes = valor.split("-");

  const fechaLocal = new Date(
    Number(partes[0]),
    Number(partes[1]) - 1,
    Number(partes[2])
  );

  let texto = fechaLocal.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return texto.charAt(0).toUpperCase() + texto.slice(1);
}


function formatearHora(valor) {
  if (!valor) return "--";

  const [horaTexto, minutos] = valor.split(":");

  let horas = Number(horaTexto);

  const periodo =
    horas >= 12 ? "p. m." : "a. m.";

  horas = horas % 12;

  if (horas === 0) {
    horas = 12;
  }

  return `${horas}:${minutos} ${periodo}`;
}


function formatearImporte(valor) {
  if (!valor) return "0";

  return Number(valor).toLocaleString("es-MX", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}


/* =========================================
   CONFIRMACIÓN
========================================= */

function actualizarConfirmacion() {

  confNombre.textContent =
    nombre.value.trim() || "Nombre del paciente";

  confFecha.textContent =
    formatearFecha(fecha.value);

  confHora.textContent =
    formatearHora(hora.value);

  confModalidad.textContent =
    modalidad.value;

  confImporte.textContent =
    formatearImporte(importe.value);

  if (metodoPago.value === "Transferencia bancaria") {
    confTransferencia.style.display = "block";
  } else {
    confTransferencia.style.display = "none";
  }
}


/* =========================================
   RECIBO
========================================= */

function actualizarRecibo() {

  reciboNombre.textContent =
    nombre.value.trim() || "Nombre del paciente";

  reciboFecha.textContent =
    formatearFecha(fecha.value);

  reciboHora.textContent =
    formatearHora(hora.value);

  reciboModalidad.textContent =
    modalidad.value;

  reciboImporte.textContent =
    formatearImporte(importe.value);

  reciboMetodo.textContent =
    metodoPago.value;


  if (estadoPago.value === "Pago recibido") {

    reciboEstado.textContent =
      "PAGO RECIBIDO";

    estadoBanner.textContent =
      "PAGO RECIBIDO";

  } else {

    reciboEstado.textContent =
      "PENDIENTE DE PAGO";

    estadoBanner.textContent =
      "PENDIENTE DE PAGO";
  }


  if (metodoPago.value === "Transferencia bancaria") {
    transferencia.style.display = "block";
  } else {
    transferencia.style.display = "none";
  }
}


function actualizarTodo() {
  actualizarConfirmacion();
  actualizarRecibo();
}


/* =========================================
   CAMBIAR DOCUMENTO
========================================= */

function mostrarConfirmacion() {

  tipoDocumento = "confirmacion";

  confirmacion.classList.remove("oculto");
  recibo.classList.add("oculto");

  btnConfirmacion.classList.add("activa");
  btnRecibo.classList.remove("activa");

  tituloVista.textContent =
    "Vista previa - Confirmación de cita";

  grupoEstadoPago.style.display =
    "none";

  btnDescargar.textContent =
    "Descargar confirmación";

  actualizarTodo();
}


function mostrarRecibo() {

  tipoDocumento = "recibo";

  recibo.classList.remove("oculto");
  confirmacion.classList.add("oculto");

  btnRecibo.classList.add("activa");
  btnConfirmacion.classList.remove("activa");

  tituloVista.textContent =
    "Vista previa - Recibo de pago";

  grupoEstadoPago.style.display =
    "block";

  btnDescargar.textContent =
    "Descargar recibo";

  actualizarTodo();
}


btnConfirmacion.addEventListener(
  "click",
  mostrarConfirmacion
);


btnRecibo.addEventListener(
  "click",
  mostrarRecibo
);


/* =========================================
   ACTUALIZACIÓN AUTOMÁTICA
========================================= */

[
  nombre,
  fecha,
  hora,
  modalidad,
  importe,
  metodoPago,
  estadoPago
].forEach(campo => {

  campo.addEventListener(
    "input",
    actualizarTodo
  );

  campo.addEventListener(
    "change",
    actualizarTodo
  );

});


/* =========================================
   VALIDAR
========================================= */

function validarDatos() {

  if (!nombre.value.trim()) {

    alert("Escribe el nombre del paciente.");

    nombre.focus();

    return false;
  }


  if (!fecha.value) {

    alert("Selecciona la fecha de la sesión.");

    fecha.focus();

    return false;
  }


  if (!hora.value) {

    alert("Selecciona la hora.");

    hora.focus();

    return false;
  }


  if (
    !importe.value ||
    Number(importe.value) <= 0
  ) {

    alert("Escribe un importe válido.");

    importe.focus();

    return false;
  }


  return true;
}


/* =========================================
   ACTUALIZAR VISTA
========================================= */

btnGenerar.addEventListener(
  "click",
  () => {

    if (!validarDatos()) {
      return;
    }

    actualizarTodo();

    document
      .querySelector(".vista")
      .scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  }
);


/* =========================================
   ESPERAR IMÁGENES
========================================= */

async function esperarImagenes(elemento) {

  const imagenes =
    elemento.querySelectorAll("img");

  await Promise.all(
    Array.from(imagenes).map(img => {

      if (img.complete) {
        return Promise.resolve();
      }

      return new Promise(resolve => {

        img.onload = resolve;
        img.onerror = resolve;

      });

    })
  );
}


/* =========================================
   DESCARGAR
========================================= */

btnDescargar.addEventListener(
  "click",
  async () => {

    if (!validarDatos()) {
      return;
    }


    actualizarTodo();


    const documentoActual =
      tipoDocumento === "confirmacion"
        ? confirmacion
        : recibo;


    btnDescargar.disabled = true;

    btnDescargar.textContent =
      "Generando documento...";


    const scrollAnteriorX =
      window.scrollX;

    const scrollAnteriorY =
      window.scrollY;


    try {

      await esperarImagenes(
        documentoActual
      );


      if (
        document.fonts &&
        document.fonts.ready
      ) {

        try {
          await document.fonts.ready;
        } catch (e) {}

      }


      /*
        Quitamos temporalmente el escalado
        del celular usando la clase que
        ya existe en tu CSS.
      */

      documentoActual.classList.add(
        "exportando"
      );


      documentoActual.style.setProperty(
        "width",
        "1080px",
        "important"
      );

      documentoActual.style.setProperty(
        "max-width",
        "1080px",
        "important"
      );

      documentoActual.style.setProperty(
        "transform",
        "none",
        "important"
      );

      documentoActual.style.setProperty(
        "margin",
        "0",
        "important"
      );

      documentoActual.style.setProperty(
        "background",
        "#fffaf6",
        "important"
      );


      await new Promise(resolve => {

        requestAnimationFrame(() => {

          requestAnimationFrame(resolve);

        });

      });


      const alto =
        Math.max(
          documentoActual.scrollHeight,
          1600
        );


      /*
        Capturamos EL DOCUMENTO REAL.
        Ya no usamos copia escondida.
        Ya no usamos foreignObjectRendering.
      */

      const canvas =
        await html2canvas(
          documentoActual,
          {

            scale: 1,

            backgroundColor:
              "#fffaf6",

            useCORS: true,

            allowTaint: false,

            logging: false,

            scrollX: 0,

            scrollY: 0,

            width: 1080,

            height: alto,

            windowWidth: 1080,

            windowHeight: alto,

            removeContainer: true

          }
        );


      const nombreArchivo =
        nombre.value
          .trim()
          .normalize("NFD")
          .replace(
            /[\u0300-\u036f]/g,
            ""
          )
          .replace(
            /[^a-zA-Z0-9]/g,
            "_"
          );


      const enlace =
        document.createElement("a");


      if (
        tipoDocumento === "confirmacion"
      ) {

        enlace.download =
          `Confirmacion_${nombreArchivo}.png`;

      } else {

        enlace.download =
          `Recibo_${nombreArchivo}.png`;

      }


      enlace.href =
        canvas.toDataURL(
          "image/png",
          1
        );


      enlace.style.display =
        "none";


      document.body.appendChild(
        enlace
      );


      enlace.click();


      setTimeout(() => {

        if (enlace.parentNode) {

          enlace.parentNode.removeChild(
            enlace
          );

        }

      }, 100);


    } catch (error) {

      console.error(
        "Error al generar:",
        error
      );

      alert(
        "No se pudo generar la imagen."
      );


    } finally {

      /*
        Regresamos la vista exactamente
        como estaba.
      */

      documentoActual.classList.remove(
        "exportando"
      );

      documentoActual.style.removeProperty(
        "width"
      );

      documentoActual.style.removeProperty(
        "max-width"
      );

      documentoActual.style.removeProperty(
        "transform"
      );

      documentoActual.style.removeProperty(
        "margin"
      );

      documentoActual.style.removeProperty(
        "background"
      );


      window.scrollTo(
        scrollAnteriorX,
        scrollAnteriorY
      );


      btnDescargar.disabled =
        false;


      btnDescargar.textContent =
        tipoDocumento === "confirmacion"
          ? "Descargar confirmación"
          : "Descargar recibo";

    }

  }
);


/* =========================================
   INICIO
========================================= */

actualizarTodo();
mostrarConfirmacion();
