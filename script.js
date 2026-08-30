const nombre = document.getElementById("nombre");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const concepto = document.getElementById("concepto");
const importe = document.getElementById("importe");
const modalidad = document.getElementById("modalidad");
const metodoPago = document.getElementById("metodoPago");
const estadoPago = document.getElementById("estadoPago");

const reciboNombre = document.getElementById("reciboNombre");
const reciboFecha = document.getElementById("reciboFecha");
const reciboHora = document.getElementById("reciboHora");
const reciboImporte = document.getElementById("reciboImporte");
const reciboModalidad = document.getElementById("reciboModalidad");
const reciboMetodo = document.getElementById("reciboMetodo");
const reciboEstado = document.getElementById("reciboEstado");

const estadoBanner = document.getElementById("estadoBanner");
const transferencia = document.getElementById("transferencia");

const btnGenerar = document.getElementById("btnGenerar");
const btnDescargar = document.getElementById("btnDescargar");


// ======================================
// FORMATEAR FECHA
// ======================================

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

  return fechaLocal.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}


// ======================================
// FORMATEAR HORA
// ======================================

function formatearHora(valor) {

  if (!valor) {
    return "--";
  }

  const partes = valor.split(":");

  let horas = Number(partes[0]);
  const minutos = partes[1];

  const periodo = horas >= 12 ? "p. m." : "a. m.";

  horas = horas % 12;

  if (horas === 0) {
    horas = 12;
  }

  return `${horas}:${minutos} ${periodo}`;
}


// ======================================
// FORMATEAR IMPORTE
// ======================================

function formatearImporte(valor) {

  if (!valor) {
    return "0";
  }

  const numero = Number(valor);

  return numero.toLocaleString("es-MX", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}


// ======================================
// ACTUALIZAR TODO EL RECIBO
// ======================================

function actualizarRecibo() {

  // Nombre
  reciboNombre.textContent =
    nombre.value.trim() || "Nombre del paciente";


  // Fecha
  reciboFecha.textContent =
    formatearFecha(fecha.value);


  // Hora
  reciboHora.textContent =
    formatearHora(hora.value);


  // Modalidad
  reciboModalidad.textContent =
    modalidad.value;


  // Importe
  reciboImporte.textContent =
    formatearImporte(importe.value);


  // Método de pago
  reciboMetodo.textContent =
    metodoPago.value;


  // Estado
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


  // Mostrar datos bancarios solo
  // si el pago fue por transferencia

  if (metodoPago.value === "Transferencia bancaria") {

    transferencia.style.display = "block";

  } else {

    transferencia.style.display = "none";

  }

}


// ======================================
// ACTUALIZAR EN TIEMPO REAL
// ======================================

const campos = [
  nombre,
  fecha,
  hora,
  importe,
  modalidad,
  metodoPago,
  estadoPago
];

campos.forEach(campo => {

  campo.addEventListener(
    "input",
    actualizarRecibo
  );

  campo.addEventListener(
    "change",
    actualizarRecibo
  );

});


// ======================================
// BOTÓN VISTA PREVIA
// ======================================

btnGenerar.addEventListener("click", () => {

  if (!nombre.value.trim()) {

    alert(
      "Escribe el nombre del paciente."
    );

    nombre.focus();

    return;
  }


  if (!fecha.value) {

    alert(
      "Selecciona la fecha de la sesión."
    );

    fecha.focus();

    return;
  }


  if (!hora.value) {

    alert(
      "Selecciona la hora de la sesión."
    );

    hora.focus();

    return;
  }


  if (!importe.value ||
      Number(importe.value) <= 0) {

    alert(
      "Escribe un valor válido para la sesión."
    );

    importe.focus();

    return;
  }


  actualizarRecibo();


  document
    .querySelector(".area-recibo")
    .scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

});


// ======================================
// DESCARGAR RECIBO COMO PNG
// ======================================

btnDescargar.addEventListener(
  "click",
  async () => {

    actualizarRecibo();


    if (!nombre.value.trim()) {

      alert(
        "Primero escribe el nombre del paciente."
      );

      nombre.focus();

      return;

    }


    const recibo =
      document.getElementById("recibo");


    btnDescargar.disabled = true;

    btnDescargar.textContent =
      "Generando imagen...";


    try {

      // Esperar a que carguen
      // las imágenes del recibo

      const imagenes =
        recibo.querySelectorAll("img");


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


      const canvas =
        await html2canvas(recibo, {

          scale: 3,

          backgroundColor: "#fffaf6",

          useCORS: true,

          allowTaint: true,

          logging: false,

          scrollX: 0,

          scrollY: 0

        });


      const imagen =
        canvas.toDataURL(
          "image/png",
          1.0
        );


      const enlace =
        document.createElement("a");


      let nombreArchivo =
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
        `Recibo_${nombreArchivo}.png`;


      enlace.href = imagen;


      document.body.appendChild(
        enlace
      );


      enlace.click();


      document.body.removeChild(
        enlace
      );


    } catch (error) {

      console.error(
        "Error al generar recibo:",
        error
      );


      alert(
        "No se pudo generar la imagen. Intenta nuevamente."
      );

    } finally {

      btnDescargar.disabled = false;

      btnDescargar.textContent =
        "Descargar recibo";

    }

  }
);


// ======================================
// INICIAR
// ======================================

actualizarRecibo();
