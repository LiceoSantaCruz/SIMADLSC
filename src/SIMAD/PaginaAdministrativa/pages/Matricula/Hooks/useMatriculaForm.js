
import { useState } from 'react';
import Swal from 'sweetalert2';
import { createMatricula } from '../Service/matriculaService';

export const useMatriculaForm = () => {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    periodo: '', // Asegúrate de que 'periodo' está incluido aquí
    estudiante: {
      gradoId: '',
      nombre_Estudiante: '',
      apellido1_Estudiante: '',
      apellido2_Estudiante: '',
      edad: '',
      telefono: '',
      cedula: '', // Asegúrate de que 'cedula' está incluida aquíedula: '',
      correo_estudiantil: '',
      fecha_nacimiento: '',
      sexo: '',
      lugar_de_nacimiento: '',
      nacionalidad: '',
      condicion_migratoria: '',
      Repite_alguna_materia: '',
      institucion_de_procedencia: '',
      Presenta_alguna_enfermedad: '',
      medicamentos_que_debe_tomar: '',
      Ruta_de_viaje: '',
      tipo_de_adecuacion: '',
      recibe_religion: '',
      presenta_carta: '',
    },
    encargadoLegal: {
      nombre_Encargado_Legal: '',
      apellido1_Encargado_Legal: '',
      apellido2_Encargado_Legal: '',
      N_Cedula: '',
      ocupacion: '',
      nacionalidad: '',
      direccion: '',
      telefono_celular: '',
      habitacion: '',
      correo: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const keys = name.split('.');

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

  const handleRadioChange = handleChange;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
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
  
      // Remove empty fields
      if (!matriculaData.estudiante.Repite_alguna_materia) {
        delete matriculaData.estudiante.Repite_alguna_materia;
      }
      if (!matriculaData.estudiante.Presenta_alguna_enfermedad) {
        delete matriculaData.estudiante.Presenta_alguna_enfermedad;
      }
  
      console.log('Datos a enviar:', matriculaData);
  
      await createMatricula(matriculaData);
  
      Swal.fire({
        title: 'Formulario enviado!',
        text: 'Tu boleta de matrícula ha sido enviada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
  
      // Reset the form if necessary
      // setFormData({ ... }); // Reset formData to initial state
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Hubo un error al enviar el formulario.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleDownload = () => {
    Swal.fire({
      title: 'Descargando formulario!',
      text: 'El formulario de matrícula se está descargando.',
      icon: 'info',
      confirmButtonText: 'Aceptar',
    });

    const link = document.createElement('a');
    link.href = '/MatriculaLiceoSantaCruz.pdf';
    link.download = 'MatriculaLiceoSantaCruz.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return {
    page,
    setPage,
    formData,
    handleChange,
    handleRadioChange,
    handleSubmit,
    handleDownload,
    isSubmitting,
  };
};
