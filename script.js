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


/* ===============================
   FORMATO
=============================== */

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


/* ===============================
   CONFIRMACIÓN
=============================== */

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


/* ===============================
   RECIBO
=============================== */

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
    reciboEstado.textContent = "PAGO RECIBIDO";
    estadoBanner.textContent = "PAGO RECIBIDO";
  } else {
    reciboEstado.textContent = "PENDIENTE DE PAGO";
    estadoBanner.textContent = "PENDIENTE DE PAGO";
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


/* ===============================
   CAMBIAR DOCUMENTO
=============================== */

function mostrarConfirmacion() {
  tipoDocumento = "confirmacion";

  confirmacion.classList.remove("oculto");
  recibo.classList.add("oculto");

  btnConfirmacion.classList.add("activa");
  btnRecibo.classList.remove("activa");

  tituloVista.textContent =
    "Vista previa - Confirmación de cita";

  grupoEstadoPago.style.display = "none";

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

  grupoEstadoPago.style.display = "block";

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


/* ===============================
   ACTUALIZACIÓN AUTOMÁTICA
=============================== */

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


/* ===============================
   VALIDAR
=============================== */

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


/* ===============================
   ESPERAR IMÁGENES
=============================== */

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


/* ===============================
   CREAR COPIA PARA EXPORTAR
=============================== */

async function crearCopiaParaDescarga(original) {
  const contenedor =
    document.createElement("div");

  contenedor.style.position = "fixed";
  contenedor.style.left = "-20000px";
  contenedor.style.top = "0";
  contenedor.style.width = "1080px";
  contenedor.style.background = "#fffaf6";
  contenedor.style.overflow = "visible";
  contenedor.style.zIndex = "-99999";

  const copia =
    original.cloneNode(true);

  copia.classList.remove("oculto");
  copia.classList.add("exportando");

  copia.style.setProperty(
    "display",
    "block",
    "important"
  );

  copia.style.setProperty(
    "width",
    "1080px",
    "important"
  );

  copia.style.setProperty(
    "max-width",
    "none",
    "important"
  );

  copia.style.setProperty(
    "transform",
    "none",
    "important"
  );

  copia.style.setProperty(
    "transform-origin",
    "top left",
    "important"
  );

  copia.style.setProperty(
    "margin",
    "0",
    "important"
  );

  copia.style.setProperty(
    "position",
    "relative",
    "important"
  );

  copia.style.setProperty(
    "background",
    "#fffaf6",
    "important"
  );

  copia.style.setProperty(
    "background-image",
    "none",
    "important"
  );

  contenedor.appendChild(copia);

  document.body.appendChild(contenedor);

  await esperarImagenes(copia);

  if (
    document.fonts &&
    document.fonts.ready
  ) {
    try {
      await document.fonts.ready;
    } catch (e) {}
  }

  await new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });

  return {
    copia,
    contenedor
  };
}


/* ===============================
   DESCARGAR
=============================== */

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

    let contenedorTemporal = null;

    try {
      const resultado =
        await crearCopiaParaDescarga(
          documentoActual
        );

      const copia = resultado.copia;
      contenedorTemporal =
        resultado.contenedor;

      const alto = Math.max(
        copia.scrollHeight,
        1600
      );

      const canvas = await html2canvas(
        copia,
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

          foreignObjectRendering: true,

          onclone: (
            documentoClonado
          ) => {
            const doc =
              documentoClonado.getElementById(
                tipoDocumento ===
                  "confirmacion"
                  ? "confirmacion"
                  : "recibo"
              );

            if (doc) {
              doc.style.setProperty(
                "background",
                "#fffaf6",
                "important"
              );

              doc.style.setProperty(
                "background-image",
                "none",
                "important"
              );

              doc.style.setProperty(
                "transform",
                "none",
                "important"
              );

              doc.style.setProperty(
                "width",
                "1080px",
                "important"
              );

              doc.style.setProperty(
                "max-width",
                "1080px",
                "important"
              );

              doc.style.setProperty(
                "margin",
                "0",
                "important"
              );

              doc.style.setProperty(
                "box-shadow",
                "none",
                "important"
              );
            }

            documentoClonado.body
              .style.background =
              "#fffaf6";

            documentoClonado
              .documentElement
              .style.background =
              "#fffaf6";
          }
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
        tipoDocumento ===
        "confirmacion"
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
        "No se pudo generar el documento. Intenta nuevamente."
      );

    } finally {
      if (
        contenedorTemporal &&
        contenedorTemporal.parentNode
      ) {
        contenedorTemporal
          .parentNode
          .removeChild(
            contenedorTemporal
          );
      }

      btnDescargar.disabled =
        false;

      btnDescargar.textContent =
        tipoDocumento === "confirmacion"
          ? "Descargar confirmación"
          : "Descargar recibo";
    }
  }
);


/* ===============================
   INICIO
=============================== */

actualizarTodo();
mostrarConfirmacion();
