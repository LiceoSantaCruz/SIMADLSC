// Hooks/useMatriculaForm.js
import { useState } from "react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { createMatricula } from "../Service/matriculaService";
export const useMatriculaForm = () => {
  // Estado inicial
  const initialFormData = {
    estudiante: {
      gradoId: "",
      nombre_Estudiante: "",
      apellido1_Estudiante: "",
      apellido2_Estudiante: "",
      edad: "",
      telefono: "",
      cedula: "",
      correo_estudiantil: "",
      fecha_nacimiento: "",
      sexo: "",
      lugar_de_nacimiento: "",
      nacionalidad: "",
      // Estos campos se enviarán aunque estén vacíos
      condicion_migratoria: "",
      Repite_alguna_materia: "",
      institucion_de_procedencia: "",
      Presenta_alguna_enfermedad: "",
      medicamentos_que_debe_tomar: "",
      Ruta_de_viaje: "",
      tipo_de_adecuacion: "",
      recibe_religion: "",
      presenta_carta: "",
    },
    encargadoLegal: {
      nombre_Encargado_Legal: "",
      apellido1_Encargado_Legal: "",
      apellido2_Encargado_Legal: "",
      N_Cedula: "",
      ocupacion: "",
      nacionalidad: "",
      direccion: "",
      telefono_celular: "",
      habitacion: "",
      correo: "",
    },
  };

  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mapeo de id de grado a nombre de grado (ajusta según tus datos reales)
  const gradoLabels = {
    1: "Séptimo",
    2: "Octavo",
    3: "Noveno",
    4: "Décimo",
    5: "Undécimo",
    // ...otros si aplica...
  };

  // Maneja cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const keys = name.split(".");
      if (keys.length === 1) {
        return { ...prevData, [name]: value };
      } else if (keys.length === 2) {
        return {
          ...prevData,
          [keys[0]]: {
            ...prevData[keys[0]],
            [keys[1]]: value,
          },
        };
      }
      return prevData;
    });
  };

  // Envía la matrícula al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Convertir campos numéricos explícitamente
      const matriculaData = {
        estudiante: {
          ...formData.estudiante,
          edad: parseInt(formData.estudiante.edad, 10) || 0,
          gradoId: parseInt(formData.estudiante.gradoId, 10) || 0,
          // Asegurar que todos los campos string existan
          nombre_Estudiante: formData.estudiante.nombre_Estudiante || "",
          apellido1_Estudiante: formData.estudiante.apellido1_Estudiante || "",
          apellido2_Estudiante: formData.estudiante.apellido2_Estudiante || "",
          telefono: formData.estudiante.telefono || "",
          cedula: formData.estudiante.cedula || "",
          correo_estudiantil: formData.estudiante.correo_estudiantil || "",
          fecha_nacimiento: formData.estudiante.fecha_nacimiento || "",
          sexo: formData.estudiante.sexo || "",
          lugar_de_nacimiento: formData.estudiante.lugar_de_nacimiento || "",
          nacionalidad: formData.estudiante.nacionalidad || "",
          condicion_migratoria: formData.estudiante.condicion_migratoria || "",
          Repite_alguna_materia:
            formData.estudiante.Repite_alguna_materia || "Ninguna",
          institucion_de_procedencia:
            formData.estudiante.institucion_de_procedencia || "",
          Presenta_alguna_enfermedad:
            formData.estudiante.Presenta_alguna_enfermedad || "Ninguna",
          medicamentos_que_debe_tomar:
            formData.estudiante.medicamentos_que_debe_tomar || "Ninguno",
          Ruta_de_viaje: formData.estudiante.Ruta_de_viaje || "Ninguna",
          tipo_de_adecuacion: formData.estudiante.tipo_de_adecuacion || "N",
          recibe_religion: formData.estudiante.recibe_religion || "No",
          presenta_carta: formData.estudiante.presenta_carta || "No",
        },
        encargadoLegal: {
          nombre_Encargado_Legal:
            formData.encargadoLegal.nombre_Encargado_Legal || "",
          apellido1_Encargado_Legal:
            formData.encargadoLegal.apellido1_Encargado_Legal || "",
          apellido2_Encargado_Legal:
            formData.encargadoLegal.apellido2_Encargado_Legal || "",
          N_Cedula: formData.encargadoLegal.N_Cedula || "",
          ocupacion: formData.encargadoLegal.ocupacion || "",
          nacionalidad: formData.encargadoLegal.nacionalidad || "",
          direccion: formData.encargadoLegal.direccion || "",
          telefono_celular: formData.encargadoLegal.telefono_celular || "",
          habitacion: formData.encargadoLegal.habitacion || "",
          correo: formData.encargadoLegal.correo || "",
        },
      };

      await createMatricula(matriculaData);

      Swal.fire({
        title: "Formulario enviado!",
        text: "Tu boleta de matrícula ha sido enviada correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      // Resetea el formulario
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Hubo un error al enviar el formulario.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Genera PDF (estilo institucional, toda la info en una hoja)
  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    let currentY = 5;

    // Logo institucional (15x15 mm, esquina superior izquierda)
    const logoBase64 = ""; // <-- Coloca aquí el base64 de tu logo institucional
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 5, currentY, 15, 15);
    }

    // Encabezado institucional
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Liceo de Santa Cruz Clímaco A. Pérez", 25, currentY + 10);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Dirección: Santa Cruz, Santa Cruz, Guanacaste del Hotel la Calle de Alcalá 100 mts este.",
      25,
      currentY + 18
    );
    doc.text("Teléfono: (+506) 2680-0219", 25, currentY + 26);
    doc.text("Correo: lic.santacruz@mep.go.cr", 25, currentY + 34);

    currentY += 45;

    // Título
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Boleta de Matrícula Año 2025", 105, currentY, {
      align: "center",
    });
    currentY += 12;

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(10, currentY, 200, currentY);
    currentY += 8;

    // Datos del Estudiante (todo recto, alineado a la izquierda)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Estudiante", 10, currentY);
    currentY += 8;
    doc.setFont("helvetica", "normal");
    const est = formData.estudiante;

    // Mostrar el nombre del grado en vez del id
    let gradoNombre = est.gradoId;
    if (gradoLabels[est.gradoId]) {
      gradoNombre = gradoLabels[est.gradoId];
    } else if (!isNaN(est.gradoId) && gradoLabels[parseInt(est.gradoId)]) {
      gradoNombre = gradoLabels[parseInt(est.gradoId)];
    }

    doc.text(`Grado: ${gradoNombre}`, 10, currentY);
    currentY += 7;
    doc.text(
      `Nombre: ${est.nombre_Estudiante} ${est.apellido1_Estudiante} ${est.apellido2_Estudiante}`,
      10,
      currentY
    );
    currentY += 7;
    doc.text(`Edad: ${est.edad}`, 10, currentY);
    currentY += 7;
    doc.text(`Sexo: ${est.sexo}`, 10, currentY);
    currentY += 7;
    doc.text(`Fecha Nacimiento: ${est.fecha_nacimiento}`, 10, currentY);
    currentY += 7;
    doc.text(`Cédula: ${est.cedula}`, 10, currentY);
    currentY += 7;
    doc.text(`Teléfono: ${est.telefono}`, 10, currentY);
    currentY += 7;
    doc.text(`Correo: ${est.correo_estudiantil}`, 10, currentY);
    currentY += 7;
    doc.text(`Lugar de Nacimiento: ${est.lugar_de_nacimiento}`, 10, currentY);
    currentY += 7;
    doc.text(`Nacionalidad: ${est.nacionalidad}`, 10, currentY);
    currentY += 7;
    doc.text(`Condición Migratoria: ${est.condicion_migratoria}`, 10, currentY);
    currentY += 7;
    doc.text(
      `Institución de Procedencia: ${est.institucion_de_procedencia}`,
      10,
      currentY
    );
    currentY += 7;
    doc.text(
      `Repite materia: ${est.Repite_alguna_materia || "No"}`,
      10,
      currentY
    );
    currentY += 7;
    doc.text(
      `Presenta enfermedad: ${est.Presenta_alguna_enfermedad || "No"}`,
      10,
      currentY
    );
    currentY += 7;
    doc.text(
      `Medicamentos: ${est.medicamentos_que_debe_tomar || "Ninguno"}`,
      10,
      currentY
    );
    currentY += 7;
    doc.text(`Ruta de viaje: ${est.Ruta_de_viaje || "Ninguna"}`, 10, currentY);
    currentY += 7;
    doc.text(
      `Tipo de adecuación: ${est.tipo_de_adecuacion || "N"}`,
      10,
      currentY
    );
    currentY += 7;
    doc.text(`Recibe religión: ${est.recibe_religion || "No"}`, 10, currentY);
    currentY += 7;
    doc.text(`Presenta carta: ${est.presenta_carta || "No"}`, 10, currentY);
    currentY += 10;

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(10, currentY, 200, currentY);
    currentY += 8;

    // Datos del Encargado Legal (todo recto)
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Encargado Legal", 10, currentY);
    currentY += 8;
    doc.setFont("helvetica", "normal");
    const enc = formData.encargadoLegal;
    doc.text(
      `Nombre: ${enc.nombre_Encargado_Legal} ${enc.apellido1_Encargado_Legal} ${enc.apellido2_Encargado_Legal}`,
      10,
      currentY
    );
    currentY += 7;
    doc.text(`Cédula: ${enc.N_Cedula}`, 10, currentY);
    currentY += 7;
    doc.text(`Ocupación: ${enc.ocupacion}`, 10, currentY);
    currentY += 7;
    doc.text(`Nacionalidad: ${enc.nacionalidad}`, 10, currentY);
    currentY += 7;
    doc.text(`Dirección: ${enc.direccion}`, 10, currentY);
    currentY += 7;
    doc.text(`Teléfono Celular: ${enc.telefono_celular}`, 10, currentY);
    currentY += 7;
    doc.text(`Habitación: ${enc.habitacion}`, 10, currentY);
    currentY += 7;
    doc.text(`Correo: ${enc.correo}`, 10, currentY);
    currentY += 15;

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(10, currentY, 200, currentY);
    currentY += 12;

    // Firma alineada a la derecha, más abajo y línea más corta
    // ——————————————————————————————
    // Bloque de firma en el pie de página, alineado a la derecha
    // ——————————————————————————————

    doc.setFontSize(11);

    // 1. Obtenemos ancho y alto de la página (A4 en mm)
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 2. Definimos márgenes:
    //    — margen inferior: 30 mm desde el borde
    //    — margen derecho: 10 mm desde el borde
    const bottomMargin = 30;
    const rightMargin = 10;

    // 3. Calculamos la Y donde irá el texto
    const firmaTextY = pageHeight - bottomMargin;

    // 4. Texto de firma, alineado a la derecha
    doc.text("Firma del Encargado:", pageWidth - rightMargin, firmaTextY, {
      align: "right",
    });

    // 5. Línea de firma, 5 mm por debajo del texto,
    //    con una longitud de 50 mm (ajústala a tu gusto)
    const lineaY = firmaTextY + 5;
    const lineaLen = 50;
    const x2 = pageWidth - rightMargin;
    const x1 = x2 - lineaLen;

    doc.setLineWidth(0.5);
    doc.line(x1, lineaY, x2, lineaY);

    doc.save("MatriculaLiceoSantaCruz.pdf");
  };

  return {
    page,
    setPage,
    formData,
    handleChange,
    handleSubmit,
    handleDownloadPDF,
    isSubmitting,
  };
};
