// src/Utils/pdfComprobanteMatricula.js
import jsPDF from "jspdf";

/**
 * Genera el “Comprobante de Matrícula” en PDF para una matrícula activa,
 * sin logo. Contiene:
 *   - Marca de agua con el nombre del colegio y "0219", centrada y muy tenue.
 *   - Encabezado con nombre del colegio, dirección, teléfono y correo.
 *   - Título “Comprobante de Matrícula” centrado.
 *   - Texto oficial con datos del estudiante y encargado en **negrita**,
 *     todo bien alineado en líneas continuas.
 *   - Pie de página con “Documento generado automáticamente” y número de página.
 *
 * @param {Object} matricula - Objeto con datos de matrícula:
 *   - estudiante: {
 *       cedula: string,
 *       nombre_Estudiante: string,
 *       apellido1_Estudiante: string,
 *       apellido2_Estudiante?: string,
 *       grado: { nivel: string }
 *     }
 *   - encargadoLegal: {
 *       N_Cedula: string,
 *       nombre_Encargado_Legal: string,
 *       apellido1_Encargado_Legal: string,
 *       apellido2_Encargado_Legal?: string
 *     }
 *   - año_Lectivo: string
 *   - fecha_Matricula: string (ISO “YYYY-MM-DD”)
 */
export const generateComprobanteMatriculaPDF = (matricula) => {
  // 1) Crear instancia de jsPDF en formato “Letter”
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ----------------------------------------------------
  // 2) Dibujar marca de agua centrada, muy tenue (usando GState para opacidad)
  // ----------------------------------------------------
  const watermarkText = "Liceo de Santa Cruz 0219";
  const watermarkFontSize = 60; // tamaño medio para que se note suavemente

  // Comprobamos si disponemos de GState en jsPDF
  if (typeof doc.setGState === "function") {
    // Crear un GState con opacidad muy baja (0.05)
    const gState = new doc.GState({ opacity: 0.10 });
    doc.setGState(gState);
  } else {
    // Si no, al menos usamos un gris muy claro
    doc.setTextColor(200, 200, 200);
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(watermarkFontSize);

  // Calcular dimensiones del texto sin rotar
  const textWidth = doc.getTextWidth(watermarkText);
  const textHeight = watermarkFontSize; // aproximación de la altura

  // Convertir ángulo 45° a radianes
  const theta = (45 * Math.PI) / 180;
  // Desplazamientos para centrar un texto rotado 45°
  const dx = (textWidth / 2) * Math.cos(theta) + (textHeight / 2) * Math.sin(theta);
  const dy = (textWidth / 2) * Math.sin(theta) - (textHeight / 2) * Math.cos(theta);

  // Dibujar la marca de agua (antes del resto del contenido)
  doc.text(
    watermarkText,
    pageWidth / 2 - dx,
    pageHeight / 2 + dy,
    { angle: 45 }
  );

  // Restaurar estado normal (opacidad = 1) para el contenido principal
  if (typeof doc.setGState === "function") {
    const normalState = new doc.GState({ opacity: 1 });
    doc.setGState(normalState);
  }
  doc.setTextColor(0, 0, 0);

  // ----------------------------------------------------
  // 3) Extraer y formatear datos del objeto matricula
  // ----------------------------------------------------
  const stu = matricula.estudiante || {};
  const enc = matricula.encargadoLegal || {};
  const añoLectivo = matricula.año_Lectivo || "";
  const fechaMatricula = matricula.fecha_Matricula
    ? new Date(matricula.fecha_Matricula).toLocaleDateString("es-CR")
    : new Date().toLocaleDateString("es-CR");
  const gradoCurso = stu.grado?.nivel || "";

  const nombreEstCompleto = [
    stu.nombre_Estudiante ?? "",
    stu.apellido1_Estudiante ?? "",
    stu.apellido2_Estudiante ?? ""
  ]
    .filter(v => !!v)
    .join(" ");

  const nombreEncCompleto = [
    enc.nombre_Encargado_Legal ?? "",
    enc.apellido1_Encargado_Legal ?? "",
    enc.apellido2_Encargado_Legal ?? ""
  ]
    .filter(v => !!v)
    .join(" ");

  // ----------------------------------------------------
  // 4) Encabezado del Colegio (sin logo)
  // ----------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Liceo de Santa Cruz Clímaco A. Pérez", 30, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(
    "Dirección: Santa Cruz, Santa Cruz, Guanacaste. 100 mts este del Hotel La Calle de Alcalá.",
    30,
    58
  );
  doc.text("Teléfono: (+506) 2680-0219", 30, 76);
  doc.text("Correo: lic.santacruz@mep.go.cr", 30, 94);

  // Línea separadora
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(30, 104, pageWidth - 30, 104);

  // ----------------------------------------------------
  // 5) Título “Comprobante de Matrícula” centrado
  // ----------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Comprobante de Matrícula", pageWidth / 2, 124, { align: "center" });

  // ----------------------------------------------------
  // 6) Texto oficial con datos en negrita, bien alineado
  // ----------------------------------------------------
  const lineHeight = 16;
  let cursorX = 30;
  let cursorY = 144; // espacio debajo del título
  const maxX = pageWidth - 30;

  const segments = [
    { text: "Por medio del presente documento se hace constar que el/la estudiante ", bold: false },
    { text: nombreEstCompleto || "", bold: true },
    { text: ", titular de la cédula de identidad número ", bold: false },
    { text: stu.cedula || "", bold: true },
    { text: ", ha sido inscrito(a) y matriculado(a) para el año lectivo ", bold: false },
    { text: añoLectivo, bold: true },
    { text: " en el grado o curso de ", bold: false },
    { text: gradoCurso, bold: true },
    { text: ", bajo la representación y responsabilidad de su encargado(a) legal ", bold: false },
    { text: nombreEncCompleto || "", bold: true },
    { text: ", portador(a) de cédula de identidad número ", bold: false },
    { text: enc.N_Cedula || "", bold: true },
    { text: ". Con fecha ", bold: false },
    { text: fechaMatricula, bold: true },
    { text: ", se deja constancia de que el(la) estudiante cumple con todos los requisitos académicos, administrativos y de documentación exigidos para su formalización en el sistema de registro educativo, quedando debidamente inscrito(a) en los libros oficiales de matrícula. Este comprobante acredita la validez de la inscripción y deberá conservarse como respaldo oficial durante todo el período escolar.", bold: false }
  ];

  const drawMixedText = () => {
    segments.forEach(seg => {
      doc.setFont("helvetica", seg.bold ? "bold" : "normal");
      doc.setFontSize(12);

      seg.text.split(" ").forEach((word, idx) => {
        const spacer = idx < seg.text.split(" ").length - 1 ? " " : "";
        const chunk = word + spacer;
        const textWidth = doc.getTextWidth(chunk);

        if (cursorX + textWidth > maxX) {
          cursorX = 30;
          cursorY += lineHeight;
        }

        doc.text(chunk, cursorX, cursorY);
        cursorX += textWidth;
      });
    });
    cursorY += lineHeight;
    cursorX = 30;
  };

  drawMixedText();

  // ----------------------------------------------------
  // 7) Pie de página con “Documento generado automáticamente” y número de página
  // ----------------------------------------------------
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text(
    "Documento generado automáticamente",
    pageWidth / 2,
    pageHeight - 40,
    { align: "center" }
  );
  const currentPageNum = doc.internal.getCurrentPageInfo().pageNumber;
  doc.text(
    `Página ${currentPageNum} de ${doc.internal.getNumberOfPages()}`,
    pageWidth / 2,
    pageHeight - 20,
    { align: "center" }
  );

  // ----------------------------------------------------
  // 8) Guardar/descargar el PDF con nombre dinámico
  // ----------------------------------------------------
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `Comprobante_Matricula_${stu.cedula}_${timestamp}.pdf`;
  doc.save(filename);
};
