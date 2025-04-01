// src/utils/pdfGenerator.js
import jsPDF from "jspdf";

export const generarPDF = ({
  logoBase64,
  estudianteNombre,
  cedula,
  grado,
  seccion,
  asistencias,
  traducirEstado,
}) => {
  const pdf = new jsPDF("p", "mm", "a4");
  let currentY = 5;

  // Agrega el logo del colegio (más pequeño y en la esquina: 15x15 mm)
  pdf.addImage(logoBase64, "PNG", 5, currentY, 15, 15);

  // Encabezado ajustado con información del colegio, incluyendo correo institucional
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("Liceo de Santa Cruz Clímaco A. Pérez", 25, currentY + 10);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    "Dirección: Santa Cruz, Santa Cruz, Guanacaste del Hotel la Calle de Alcalá 100 mts este.",
    25,
    currentY + 18
  );
  pdf.text("Teléfono: (+506) 2680-0219", 25, currentY + 26);
  // Agregamos el correo institucional debajo del teléfono
  pdf.text("Correo: lic.santacruz@mep.go.cr", 25, currentY + 34);

  // Ajusta currentY para dejar espacio después del encabezado
  currentY += 45;

  // Título del reporte
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Reporte de Ausencias y Escapadas", 105, currentY, { align: "center" });
  currentY += 10;

  // Datos del estudiante
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Estudiante: ${estudianteNombre}`, 10, currentY);
  currentY += 6;
  pdf.text(`Cédula: ${cedula}`, 10, currentY);
  currentY += 6;
  pdf.text(`Grado: ${grado}`, 10, currentY);
  currentY += 6;
  pdf.text(`Sección: ${seccion}`, 10, currentY);
  currentY += 8;

  // Función auxiliar para contar lecciones
  const contarLecciones = (lecciones) => {
    if (Array.isArray(lecciones)) {
      return lecciones.length;
    } else if (typeof lecciones === "string") {
      return lecciones.split(",").filter((l) => l.trim() !== "").length;
    }
    return 0;
  };

  // Contadores por lecciones para ausencias y escapadas
  const totalAusencias = asistencias
    .filter((asistencia) => asistencia.estado === "A")
    .reduce((acc, asistencia) => acc + contarLecciones(asistencia.lecciones), 0);

  const totalEscapadas = asistencias
    .filter((asistencia) => asistencia.estado === "E")
    .reduce((acc, asistencia) => acc + contarLecciones(asistencia.lecciones), 0);

  pdf.text(
    `Total de Ausencias: ${totalAusencias}   |   Total de Escapadas: ${totalEscapadas}`,
    10,
    currentY
  );
  currentY += 10;

  // Línea separadora
  pdf.setLineWidth(0.5);
  pdf.line(10, currentY, 200, currentY);
  currentY += 6;

  // Encabezados de la tabla
  pdf.setFont("helvetica", "bold");
  pdf.text("Fecha", 10, currentY);
  pdf.text("Lecciones", 40, currentY);
  pdf.text("Estado", 90, currentY);
  pdf.text("Materia", 120, currentY);
  pdf.text("Profesor", 150, currentY);
  currentY += 4;
  pdf.setLineWidth(0.2);
  pdf.line(10, currentY, 200, currentY);
  currentY += 6;

  // Filtramos para que en la tabla aparezcan solo ausencias (estado "A") y escapadas (estado "E")
  const registrosFiltrados = asistencias.filter(
    (asistencia) => asistencia.estado === "A" || asistencia.estado === "E"
  );

  // Listado de asistencias (ausencias y escapadas)
  pdf.setFont("helvetica", "normal");
  registrosFiltrados.forEach((asistencia) => {
    const fecha = new Date(asistencia.fecha).toLocaleDateString();
    const lecciones = Array.isArray(asistencia.lecciones)
      ? asistencia.lecciones.join(", ")
      : typeof asistencia.lecciones === "string"
      ? asistencia.lecciones.split(",").join(", ")
      : "N/A";
    const estado = traducirEstado(asistencia.estado);
    const materia = asistencia.id_Materia.nombre_Materia;
    const profesor = `${asistencia.id_Profesor.nombre_Profesor} ${asistencia.id_Profesor.apellido1_Profesor}`;

    pdf.text(fecha, 10, currentY);
    pdf.text(lecciones, 40, currentY, { maxWidth: 40 });
    pdf.text(estado, 90, currentY);
    pdf.text(materia, 120, currentY, { maxWidth: 25 });
    pdf.text(profesor, 150, currentY, { maxWidth: 40 });
    currentY += 8;

    // Control de paginación
    if (currentY > 280) {
      pdf.addPage();
      currentY = 10;
    }
  });

  // Pie de página
  pdf.setFontSize(10);
  pdf.text("Documento generado automáticamente", 105, 290, { align: "center" });

  pdf.save(`Reporte_Asistencias_${cedula}.pdf`);
};
