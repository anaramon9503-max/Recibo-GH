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

  const periodo = horas >= 12 ? "p. m." : "a. m.";

  horas = horas % 12;

  if (horas === 0) horas = 12;

  return `${horas}:${minutos} ${periodo}`;
}

function formatearImporte(valor) {
  if (!valor) return "0";

  return Number(valor).toLocaleString("es-MX", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

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

function actualizarTodo() {
  actualizarConfirmacion();
  actualizarRecibo();
}

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

btnConfirmacion.addEventListener(
  "click",
  mostrarConfirmacion
);

btnRecibo.addEventListener(
  "click",
  mostrarRecibo
);

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

  if (!importe.value || Number(importe.value) <= 0) {
    alert("Escribe un importe válido.");
    importe.focus();
    return false;
  }

  return true;
}

btnGenerar.addEventListener(
  "click",
  () => {

    if (!validarDatos()) return;

    actualizarTodo();

    document
      .querySelector(".vista")
      .scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  }
);

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


// =====================================
// DESCARGAR PNG EN DOS MITADES
// =====================================

btnDescargar.addEventListener(
  "click",
  async () => {

    if (!validarDatos()) return;

    actualizarTodo();

    const documentoActual =
      tipoDocumento === "confirmacion"
        ? confirmacion
        : recibo;

    btnDescargar.disabled = true;

    btnDescargar.textContent =
      tipoDocumento === "confirmacion"
        ? "Generando confirmación..."
        : "Generando recibo...";

    try {

      await esperarImagenes(documentoActual);

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

      const alto =
        documentoActual.scrollHeight;

      const anchoMitad = 540;


      // ===========================
      // MITAD IZQUIERDA
      // ===========================

      const canvasIzquierdo =
        await html2canvas(
          documentoActual,
          {
            scale: 1,

            x: 0,
            y: 0,

            width: anchoMitad,
            height: alto,

            backgroundColor: "#fffaf6",

            useCORS: true,
            allowTaint: true,

            logging: false,

            scrollX: 0,
            scrollY: 0,

            windowWidth: 1400
          }
        );


      // ===========================
      // MITAD DERECHA
      // ===========================

      const canvasDerecho =
        await html2canvas(
          documentoActual,
          {
            scale: 1,

            x: anchoMitad,
            y: 0,

            width: anchoMitad,
            height: alto,

            backgroundColor: "#fffaf6",

            useCORS: true,
            allowTaint: true,

            logging: false,

            scrollX: 0,
            scrollY: 0,

            windowWidth: 1400
          }
        );


      // ===========================
      // UNIR LAS DOS MITADES
      // ===========================

      const canvasFinal =
        document.createElement("canvas");

      canvasFinal.width = 1080;
      canvasFinal.height = alto;

      const ctx =
        canvasFinal.getContext("2d");

      ctx.fillStyle = "#fffaf6";

      ctx.fillRect(
        0,
        0,
        canvasFinal.width,
        canvasFinal.height
      );

      ctx.drawImage(
        canvasIzquierdo,
        0,
        0
      );

      ctx.drawImage(
        canvasDerecho,
        anchoMitad,
        0
      );


      // ===========================
      // RESTAURAR VISTA
      // ===========================

      documentoActual.style.transform =
        transformAnterior;

      documentoActual.style.margin =
        marginAnterior;

      documentoActual.style.position =
        positionAnterior;


      // ===========================
      // DESCARGAR
      // ===========================

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

      enlace.download =
        tipoDocumento === "confirmacion"
          ? `Confirmacion_${nombreArchivo}.png`
          : `Recibo_${nombreArchivo}.png`;

      enlace.href =
        canvasFinal.toDataURL(
          "image/png",
          1
        );

      document.body.appendChild(enlace);

      enlace.click();

      document.body.removeChild(enlace);


    } catch (error) {

      console.error(error);

      alert(
        tipoDocumento === "confirmacion"
          ? "No se pudo generar la confirmación. Intenta nuevamente."
          : "No se pudo generar el recibo. Intenta nuevamente."
      );

    } finally {

      btnDescargar.disabled = false;

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
