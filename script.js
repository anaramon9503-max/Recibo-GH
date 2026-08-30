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
const reciboConcepto = document.getElementById("reciboConcepto");
const reciboImporte = document.getElementById("reciboImporte");
const reciboModalidad = document.getElementById("reciboModalidad");
const reciboEstado = document.getElementById("reciboEstado");

const transferencia = document.getElementById("transferencia");

const btnGenerar = document.getElementById("btnGenerar");
const btnDescargar = document.getElementById("btnDescargar");


// -------------------------
// FORMATEAR FECHA
// -------------------------

function formatearFecha(valor) {

  if (!valor) {
    return "--";
  }

  const partes = valor.split("-");

  const fechaLocal = new Date(
    partes[0],
    partes[1] - 1,
    partes[2]
  );

  return fechaLocal.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}


// -------------------------
// FORMATEAR HORA
// -------------------------

function formatearHora(valor) {

  if (!valor) {
    return "--";
  }

  const [horas, minutos] = valor.split(":");

  const fechaHora = new Date();

  fechaHora.setHours(
    Number(horas),
    Number(minutos)
  );

  return fechaHora.toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}


// -------------------------
// ACTUALIZAR RECIBO
// -------------------------

function actualizarRecibo() {

  reciboNombre.textContent =
    nombre.value.trim() || "Nombre del paciente";

  reciboConcepto.textContent =
    concepto.value.trim() || "Servicio";

  reciboFecha.textContent =
    formatearFecha(fecha.value);

  reciboHora.textContent =
    formatearHora(hora.value);

  reciboModalidad.textContent =
    modalidad.value;

  reciboImporte.textContent =
    importe.value
      ? Number(importe.value).toLocaleString("es-MX")
      : "0";

  reciboEstado.textContent =
    estadoPago.value;


  // Mostrar datos bancarios solamente
  // cuando el método sea transferencia.

  if (metodoPago.value === "Transferencia bancaria") {

    transferencia.style.display = "block";

  } else {

    transferencia.style.display = "none";

  }


  // Cambiar texto según estado del pago.

  if (estadoPago.value === "Pago recibido") {

    reciboEstado.textContent = "PAGO RECIBIDO";

  } else {

    reciboEstado.textContent = "PENDIENTE DE PAGO";

  }

}


// -------------------------
// ACTUALIZACIÓN AUTOMÁTICA
// -------------------------

const campos = [
  nombre,
  fecha,
  hora,
  concepto,
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


// -------------------------
// BOTÓN GENERAR
// -------------------------

btnGenerar.addEventListener("click", () => {

  if (!nombre.value.trim()) {

    alert("Escribe el nombre del paciente o cliente.");

    nombre.focus();

    return;
  }

  if (!fecha.value) {

    alert("Selecciona la fecha.");

    fecha.focus();

    return;
  }

  if (!importe.value || Number(importe.value) <= 0) {

    alert("Escribe un importe válido.");

    importe.focus();

    return;
  }

  actualizarRecibo();

  document
    .querySelector(".panel-recibo")
    .scrollIntoView({
      behavior: "smooth"
    });

});


// -------------------------
// DESCARGAR COMO PNG
// -------------------------

btnDescargar.addEventListener("click", async () => {

  actualizarRecibo();

  const recibo = document.getElementById("recibo");

  btnDescargar.disabled = true;
  btnDescargar.textContent = "Generando imagen...";

  try {

    const canvas = await html2canvas(recibo, {
      scale: 2,
      backgroundColor: "#fffdfb",
      useCORS: true
    });

    const imagen = canvas.toDataURL("image/png");

    const enlace = document.createElement("a");

    const nombreArchivo =
      nombre.value.trim()
        ? nombre.value
            .trim()
            .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, "_")
        : "cliente";

    enlace.download =
      "Recibo_" + nombreArchivo + ".png";

    enlace.href = imagen;

    enlace.click();

  } catch (error) {

    console.error(error);

    alert(
      "No se pudo generar la imagen. Intenta nuevamente."
    );

  } finally {

    btnDescargar.disabled = false;
    btnDescargar.textContent = "Descargar recibo";

  }

});


// -------------------------
// VALORES INICIALES
// -------------------------

actualizarRecibo();
