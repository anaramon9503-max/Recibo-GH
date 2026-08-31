const nombre = document.getElementById("nombre");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const modalidad = document.getElementById("modalidad");
const importe = document.getElementById("importe");
const metodoPago = document.getElementById("metodoPago");

const btnConfirmacion = document.getElementById("btnConfirmacion");
const btnRecibo = document.getElementById("btnRecibo");
const btnGenerar = document.getElementById("btnGenerar");
const btnDescargar = document.getElementById("btnDescargar");

const confirmacion = document.getElementById("confirmacion");
const recibo = document.getElementById("recibo");

const tituloVista = document.getElementById("tituloVista");

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


// ===============================
// FECHA
// ===============================

function formatearFecha(valor) {

  if (!valor) {
    return "--";
  }

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


// ===============================
// HORA
// ===============================

function formatearHora(valor) {

  if (!valor) {
    return "--";
  }

  const [horaTexto, minutos] = valor.split(":");

  let horas = Number(horaTexto);

  const periodo =
    horas >= 12
      ? "p. m."
      : "a. m.";

  horas = horas % 12;

  if (horas === 0) {
    horas = 12;
  }

  return `${horas}:${minutos} ${periodo}`;
}


// ===============================
// IMPORTE
// ===============================

function formatearImporte(valor) {

  if (!valor) {
    return "0";
  }

  return Number(valor).toLocaleString("es-MX", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}


// ===============================
// ACTUALIZAR CONFIRMACIÓN
// ===============================

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


// ===============================
// ACTUALIZAR RECIBO
// ===============================

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


  reciboEstado.textContent =
    "PAGO RECIBIDO";

  estadoBanner.textContent =
    "PAGO RECIBIDO";


  if (metodoPago.value === "Transferencia bancaria") {

    transferencia.style.display = "block";

  } else {

    transferencia.style.display = "none";

  }

}


// ===============================
// ACTUALIZAR TODO
// ===============================

function actualizarTodo() {

  actualizarConfirmacion();
  actualizarRecibo();

}


// ===============================
// MOSTRAR CONFIRMACIÓN
// ===============================

function mostrarConfirmacion() {

  tipoDocumento = "confirmacion";

  confirmacion.classList.remove("oculto");
  recibo.classList.add("oculto");

  btnConfirmacion.classList.add("activa");
  btnRecibo.classList.remove("activa");

  tituloVista.textContent =
    "Vista previa - Confirmación de cita";

  btnDescargar.textContent =
    "Descargar confirmación";

  actualizarTodo();

}


// ===============================
// MOSTRAR RECIBO
// ===============================

function mostrarRecibo() {

  tipoDocumento = "recibo";

  recibo.classList.remove("oculto");
  confirmacion.classList.add("oculto");

  btnRecibo.classList.add("activa");
  btnConfirmacion.classList.remove("activa");

  tituloVista.textContent =
    "Vista previa - Recibo de pago";

  btnDescargar.textContent =
    "Descargar recibo";

  actualizarTodo();

}


// ===============================
// BOTONES TIPO DOCUMENTO
// ===============================

btnConfirmacion.addEventListener(
  "click",
  mostrarConfirmacion
);

btnRecibo.addEventListener(
  "click",
  mostrarRecibo
);


// ===============================
// CAMBIOS EN TIEMPO REAL
// ===============================

[
  nombre,
  fecha,
  hora,
  modalidad,
  importe,
  metodoPago
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


// ===============================
// VALIDAR
// ===============================

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


// ===============================
// VISTA PREVIA
// ===============================

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


// ===============================
// ESPERAR IMÁGENES
// ===============================

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


// ===============================
// DESCARGAR PNG
// ===============================

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


    if (tipoDocumento === "confirmacion") {

      btnDescargar.textContent =
        "Generando confirmación...";

    } else {

      btnDescargar.textContent =
        "Generando recibo...";

    }


    try {

      await esperarImagenes(
        documentoActual
      );


      const transformAnterior =
        documentoActual.style.transform;

      const marginAnterior =
        documentoActual.style.margin;

      const positionAnterior =
        documentoActual.style.position;


      documentoActual.style.transform =
        "none";

      documentoActual.style.margin =
        "0";

      documentoActual.style.position =
        "relative";


      await new Promise(resolve =>
        setTimeout(resolve, 200)
      );


      const canvas =
        await html2canvas(
          documentoActual,
          {

            scale: 1,

            width: 1080,

            height:
              documentoActual.scrollHeight,

            backgroundColor:
              "#fffaf6",

            useCORS: true,

            allowTaint: true,

            logging: false,

            scrollX: 0,

            scrollY: 0,

            windowWidth: 1400

          }
        );


      documentoActual.style.transform =
        transformAnterior;

      documentoActual.style.margin =
        marginAnterior;

      documentoActual.style.position =
        positionAnterior;


      const enlace =
        document.createElement("a");


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


      document.body.appendChild(
        enlace
      );


      enlace.click();


      document.body.removeChild(
        enlace
      );


    } catch (error) {

      console.error(error);


      alert(
        tipoDocumento === "confirmacion"
          ? "No se pudo generar la confirmación. Intenta nuevamente."
          : "No se pudo generar el recibo. Intenta nuevamente."
      );


    } finally {

      btnDescargar.disabled =
        false;


      btnDescargar.textContent =
        tipoDocumento === "confirmacion"
          ? "Descargar confirmación"
          : "Descargar recibo";

    }

  }
);


// ===============================
// INICIAR
// ===============================

actualizarTodo();

mostrarConfirmacion();
