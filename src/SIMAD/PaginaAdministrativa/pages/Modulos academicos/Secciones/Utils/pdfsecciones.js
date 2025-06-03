// src/Utils/pdfsecciones.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Genera un PDF con la lista de estudiantes de una sección,
 * con encabezado institucional, ordenados alfabéticamente por:
 *   1) Primer apellido
 *   2) Segundo apellido
 *   3) Primer nombre
 *   4) Segundo nombre
 * Limita a 30 estudiantes por página y coloca un pie que dice
 * “Documento generado automáticamente”.
 *
 * @param {string} sectionName   - Nombre de la sección (ej. "7-1").
 * @param {Array<Object>} students - Array de objetos de estudiante.
 *   Se asume que cada objeto tiene al menos:
 *     - nombre_Estudiante o nombreEstudiante o nombre1 (primer nombre)
 *     - segundo_Nombre o segundoNombre o nombre2 (segundo nombre, opcional)
 *     - apellido1_Estudiante o apellido1Estudiante o apellido1 (primer apellido)
 *     - apellido2_Estudiante o apellido2Estudiante o apellido2 (segundo apellido)
 *
 * Si tus propiedades se llaman distinto, reemplaza los accesos `stu.nombre_Estudiante`,
 * `stu.apellido1_Estudiante`, etc. por las que uses en tu back-end.
 */
export const generateStudentsListPDF = (sectionName, students) => {
  // 1. Crear instancia de jsPDF
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
    // Si prefieres A4: format: 'a4'
  });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Función auxiliar para normalizar texto (minúsculas y sin tildes)
  const normalize = (text) =>
    text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // Función auxiliar para partir un array en chunks de tamaño n
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // 2. Ordenar el array de estudiantes:
  //    por primer apellido, segundo apellido, primer nombre, segundo nombre
  const sortedStudents = [...students].sort((a, b) => {
    // Extraer campos (ajusta si tus propiedades difieren)
    const apr1A = a.apellido1_Estudiante ?? a.apellido1Estudiante ?? a.apellido1 ?? '';
    const apr1B = b.apellido1_Estudiante ?? b.apellido1Estudiante ?? b.apellido1 ?? '';

    const apr2A = a.apellido2_Estudiante ?? a.apellido2Estudiante ?? a.apellido2 ?? '';
    const apr2B = b.apellido2_Estudiante ?? b.apellido2Estudiante ?? b.apellido2 ?? '';

    const nameA1 = a.nombre_Estudiante ?? a.nombreEstudiante ?? a.nombre1 ?? '';
    const nameB1 = b.nombre_Estudiante ?? b.nombreEstudiante ?? b.nombre1 ?? '';

    const nameA2 = a.segundo_Nombre ?? a.segundoNombre ?? a.nombre2 ?? '';
    const nameB2 = b.segundo_Nombre ?? b.segundoNombre ?? b.nombre2 ?? '';

    // Comparación encadenada
    const cmpApr1 = normalize(apr1A).localeCompare(normalize(apr1B));
    if (cmpApr1 !== 0) return cmpApr1;

    const cmpApr2 = normalize(apr2A).localeCompare(normalize(apr2B));
    if (cmpApr2 !== 0) return cmpApr2;

    const cmpName1 = normalize(nameA1).localeCompare(normalize(nameB1));
    if (cmpName1 !== 0) return cmpName1;

    return normalize(nameA2).localeCompare(normalize(nameB2));
  });

  // 3. Transformar el array ordenado en filas con { number, fullName }
  const allRows = sortedStudents.map((stu, index) => {
    const number = index + 1;

    // Extraer nombre y apellidos (ajusta si tus campos difieren)
    const firstName = stu.nombre_Estudiante ?? stu.nombreEstudiante ?? stu.nombre1 ?? '';
    const secondName = stu.segundo_Nombre ?? stu.segundoNombre ?? stu.nombre2 ?? '';
    const surname1 = stu.apellido1_Estudiante ?? stu.apellido1Estudiante ?? stu.apellido1 ?? '';
    const surname2 = stu.apellido2_Estudiante ?? stu.apellido2Estudiante ?? stu.apellido2 ?? '';

    // Construir nombre completo: Nombre1 Nombre2 Apellido1 Apellido2
    const fullName = [firstName, secondName, surname1, surname2]
      .filter((s) => !!s)
      .join(' ')
      .trim();

    return { number, fullName };
  });

  // 4. Partir en trozos de 30 filas cada uno (para limitar a 30 por página)
  const pageChunks = chunkArray(allRows, 30);

  // 5. Definir encabezados de columna
  const headers = [
    { header: 'No.', dataKey: 'number' },
    { header: 'Nombre Completo', dataKey: 'fullName' },
  ];

  // 6. Recorrer cada chunk y dibujar en su página correspondiente
  pageChunks.forEach((rowsChunk, pageIndex) => {
    if (pageIndex > 0) {
      doc.addPage();
    }

    // Si es la primera página, dibujar encabezado institucional y título
    if (pageIndex === 0) {
      // Encabezado institucional
      doc.setFontSize(16);
      doc.text(
        'Liceo Santa Cruz Clímaco A. Pérez',
        pageWidth / 2,
        30,
        { align: 'center' }
      );
      // Título de lista
      doc.setFontSize(18);
      const title = `Lista de Estudiantes - Sección ${sectionName}`;
      doc.text(
        title,
        pageWidth / 2,
        55,
        { align: 'center' }
      );

      // Iniciar la tabla a partir de Y = 80
      doc.autoTable({
        head: [headers.map((h) => h.header)],
        body: rowsChunk.map((row) => headers.map((h) => row[h.dataKey])),
        startY: 80,
        theme: 'striped',
        headStyles: { fillColor: [33, 150, 243] },
        styles: { fontSize: 11, cellPadding: 4 },
        didDrawPage: () => {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(10);
          doc.text(
            'Documento generado automáticamente',
            pageWidth / 2,
            pageHeight - 40,
            { align: 'center' }
          );
          const footerStr = `Página ${doc.internal.getCurrentPageInfo().pageNumber} de ${pageCount}`;
          doc.text(
            footerStr,
            pageWidth / 2,
            pageHeight - 20,
            { align: 'center' }
          );
        },
      });
    } else {
      // Páginas posteriores: solo tabla + pie
      doc.autoTable({
        head: [headers.map((h) => h.header)],
        body: rowsChunk.map((row) => headers.map((h) => row[h.dataKey])),
        startY: 40,
        theme: 'striped',
        headStyles: { fillColor: [33, 150, 243] },
        styles: { fontSize: 11, cellPadding: 4 },
        didDrawPage: () => {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(10);
          doc.text(
            'Documento generado automáticamente',
            pageWidth / 2,
            pageHeight - 40,
            { align: 'center' }
          );
          const footerStr = `Página ${doc.internal.getCurrentPageInfo().pageNumber} de ${pageCount}`;
          doc.text(
            footerStr,
            pageWidth / 2,
            pageHeight - 20,
            { align: 'center' }
          );
        },
      });
    }
  });

  // 7. Guardar el PDF con un nombre dinámico
  const timestamp = new Date().toISOString().split('T')[0]; // ej. "2025-06-05"
  const filename = `Seccion_${sectionName.replace('-', '_')}_${timestamp}.pdf`;
  doc.save(filename);
};
