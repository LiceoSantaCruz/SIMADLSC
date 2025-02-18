// Hooks/useMatriculaForm.js
import { useState } from "react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { createMatricula } from "../Service/matriculaService";
export const useMatriculaForm = () => {
  // Estado inicial
  const initialFormData = {
    periodo: "",
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
      // Convertir campos numéricos
      const matriculaData = {
        periodo: parseInt(formData.periodo, 10),
        estudiante: {
          ...formData.estudiante,
          edad: parseInt(formData.estudiante.edad, 10),
          gradoId: parseInt(formData.estudiante.gradoId, 10),
        },
        encargadoLegal: {
          ...formData.encargadoLegal,
        },
      };

      // A diferencia de antes, NO eliminamos campos vacíos:
      // Se envían tal cual, aunque sean cadenas vacías.

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

  // Genera PDF (opcional)
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(14);
    doc.text("LICEO DE SANTA CRUZ", pageWidth / 2, 50, { align: "center" });
    doc.setFontSize(12);
    doc.text("Boleta de Matrícula Año 2025", pageWidth / 2, 70, { align: "center" });

    let startY = 90;
    doc.setFontSize(12);
    doc.text("Datos del Estudiante:", 40, startY);
    startY += 20;
    doc.setFontSize(10);
    doc.text(`Periodo: ${formData.periodo}`, 40, startY);
    startY += 15;
    doc.text(`Grado: ${formData.estudiante.gradoId}`, 40, startY);
    startY += 15;
    doc.text(`Nombre: ${formData.estudiante.nombre_Estudiante}`, 40, startY);
    startY += 15;
    doc.text(
      `Apellidos: ${formData.estudiante.apellido1_Estudiante} ${formData.estudiante.apellido2_Estudiante}`,
      40,
      startY
    );
    startY += 15;
    doc.text(`Cédula: ${formData.estudiante.cedula}`, 40, startY);
    startY += 15;
    doc.text(`Teléfono: ${formData.estudiante.telefono}`, 40, startY);
    startY += 15;
    doc.text(
      `Repite materia: ${formData.estudiante.Repite_alguna_materia || "No"}`,
      40,
      startY
    );
    startY += 25;

    doc.setFontSize(12);
    doc.text("Datos del Encargado Legal:", 40, startY);
    startY += 20;
    doc.setFontSize(10);
    doc.text(
      `Nombre: ${formData.encargadoLegal.nombre_Encargado_Legal}`,
      40,
      startY
    );
    startY += 15;
    doc.text(`Cédula: ${formData.encargadoLegal.N_Cedula}`, 40, startY);
    startY += 25;

    doc.setFontSize(10);
    doc.text("Firma del Encargado:", 40, startY);
    doc.line(150, startY, 350, startY);

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
