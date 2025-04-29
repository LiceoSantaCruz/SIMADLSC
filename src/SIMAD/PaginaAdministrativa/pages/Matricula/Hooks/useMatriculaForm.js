// Hooks/useMatriculaForm.js
import { useState } from "react";
import Swal from "sweetalert2";
import { createMatricula } from "../Service/matriculaService";

export const useMatriculaForm = () => {
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
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Maneja cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const keys = name.split(".");
      if (keys.length === 1) {
        return { ...prev, [name]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
        };
      }
      return prev;
    });
  };

  // Maneja selección de archivos
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // Elimina un archivo específico
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Limpia todos los archivos seleccionados
  const clearFiles = () => {
    setFiles([]);
  };

  // Envía la matrícula junto a los archivos
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const matriculaData = {
        estudiante: {
          ...formData.estudiante,
          edad: parseInt(formData.estudiante.edad, 10) || 0,
          gradoId: parseInt(formData.estudiante.gradoId, 10) || 0,
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
          telefono_celular:
            formData.encargadoLegal.telefono_celular || "",
          habitacion: formData.encargadoLegal.habitacion || "",
          correo: formData.encargadoLegal.correo || "",
        },
      };

      const payload = new FormData();
      payload.append("data", JSON.stringify(matriculaData));
      files.forEach((file) => payload.append("archivo", file));

      await createMatricula(payload);

      Swal.fire({
        title: "Formulario enviado!",
        text: "Tu boleta de matrícula ha sido enviada correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      setFormData(initialFormData);
      clearFiles();
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

  return {
    page,
    setPage,
    formData,
    handleChange,
    handleFileChange,
    removeFile,
    clearFiles,
    files,
    handleSubmit,
    isSubmitting,
  };
};
