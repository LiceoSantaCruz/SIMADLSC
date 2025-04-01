import jsPDF from "jspdf";

export const generarPDFSeccion = ({
  logoBase64,
  nombreSeccion,
  fechaInicio,
  fechaFin,
  estadisticas, // { total_asistencias, total_ausencias, total_escapados, total_justificados }
  estudiantes,  // [{ nombre_completo, asistencias, ausencias, escapados, justificados }, ...]
}) => {
  const pdf = new jsPDF("p", "mm", "a4");
  let currentY = 5;

  // Logo (esquina superior izquierda, 15x15)
  pdf.addImage(logoBase64, "PNG", 5, currentY, 15, 15);

  // Encabezado del colegio
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
  pdf.text("Correo: lic.santacruz@mep.go.cr", 25, currentY + 34);

  currentY += 45;

  // Título del reporte
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Reporte de Asistencia por Sección", 105, currentY, { align: "center" });
  currentY += 10;

  // Info de la sección
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Sección: ${nombreSeccion}`, 10, currentY);
  currentY += 6;
  pdf.text(`Fecha de Inicio: ${fechaInicio}`, 10, currentY);
  currentY += 6;
  pdf.text(`Fecha Fin: ${fechaFin}`, 10, currentY);
  currentY += 8;

  // Estadísticas
  pdf.setFont("helvetica", "bold");
  pdf.text("Estadísticas Generales", 10, currentY);
  currentY += 6;
  pdf.setFont("helvetica", "normal");
  pdf.text(`Asistencias Totales: ${estadisticas.total_asistencias}`, 10, currentY);
  currentY += 6;
  pdf.text(`Ausencias Totales: ${estadisticas.total_ausencias}`, 10, currentY);
  currentY += 6;
  pdf.text(`Escapados Totales: ${estadisticas.total_escapados}`, 10, currentY);
  currentY += 6;
  pdf.text(`Justificados Totales: ${estadisticas.total_justificados}`, 10, currentY);
  currentY += 10;

  // Línea separadora
  pdf.setLineWidth(0.5);
  pdf.line(10, currentY, 200, currentY);
  currentY += 6;

  // Encabezados de la tabla
  pdf.setFont("helvetica", "bold");
  // "Estudiante" a la izquierda, sin centrar
  pdf.text("Estudiante", 10, currentY);

  // Estas columnas sí las centramos en posiciones X fijas
  pdf.text("Asistencias", 105, currentY, { align: "center" });
  pdf.text("Ausencias", 130, currentY, { align: "center" });
  pdf.text("Escapados", 155, currentY, { align: "center" });
  pdf.text("Justificados", 180, currentY, { align: "center" });

  currentY += 4;
  pdf.setLineWidth(0.2);
  pdf.line(10, currentY, 200, currentY);
  currentY += 6;

  // Filas de la tabla
  pdf.setFont("helvetica", "normal");
  estudiantes.forEach((est) => {
    // Nombre a la izquierda (X=10)
    pdf.text(est.nombre_completo, 10, currentY);

    // Números centrados en la misma posición X que sus encabezados
    pdf.text(String(est.asistencias), 105, currentY, { align: "center" });
    pdf.text(String(est.ausencias), 130, currentY, { align: "center" });
    pdf.text(String(est.escapados), 155, currentY, { align: "center" });
    pdf.text(String(est.justificados), 180, currentY, { align: "center" });

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

  pdf.save(`Reporte_Asistencia_Seccion_${nombreSeccion}.pdf`);
};
