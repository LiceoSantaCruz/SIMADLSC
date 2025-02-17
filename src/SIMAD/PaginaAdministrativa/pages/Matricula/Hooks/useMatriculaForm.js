import { useState } from 'react'
import Swal from 'sweetalert2'
import jsPDF from 'jspdf'
import { createMatricula } from '../Service/matriculaService'

export const useMatriculaForm = () => {
  // Estado inicial: usamos Repite_alguna_materia para anotar la materia repetida
  const initialFormData = {
    periodo: '',
    estudiante: {
      gradoId: '',
      nombre_Estudiante: '',
      apellido1_Estudiante: '',
      apellido2_Estudiante: '',
      edad: '',
      telefono: '',
      cedula: '',
      correo_estudiantil: '',
      fecha_nacimiento: '',
      sexo: '',
      lugar_de_nacimiento: '',
      nacionalidad: '',
      condicion_migratoria: '',
      Repite_alguna_materia: '', // Se usará este campo para ingresar el nombre de la materia repetida
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
  }

  const [page, setPage] = useState(1)
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Función para manejar cambios en los inputs (texto, radio, etc.)
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => {
      const keys = name.split('.')
      if (keys.length === 1) {
        return { ...prevData, [name]: value }
      } else if (keys.length === 2) {
        return {
          ...prevData,
          [keys[0]]: {
            ...prevData[keys[0]],
            [keys[1]]: value,
          },
        }
      }
      return prevData
    })
  }

  // Envía la matrícula al backend
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
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
      }

      // Elimina campos vacíos si no tienen valor
      if (!matriculaData.estudiante.Repite_alguna_materia) {
        delete matriculaData.estudiante.Repite_alguna_materia
      }
      if (!matriculaData.estudiante.Presenta_alguna_enfermedad) {
        delete matriculaData.estudiante.Presenta_alguna_enfermedad
      }

      await createMatricula(matriculaData)

      Swal.fire({
        title: 'Formulario enviado!',
        text: 'Tu boleta de matrícula ha sido enviada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      })
      // Resetea el formulario a su estado inicial
      setFormData(initialFormData)
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Hubo un error al enviar el formulario.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Genera un PDF dinámico con los datos ingresados en una sola hoja
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'letter',
    })

    const pageWidth = doc.internal.pageSize.getWidth()

    // Encabezado centrado
    doc.setFontSize(14)
    doc.text('LICEO DE SANTA CRUZ', pageWidth / 2, 50, { align: 'center' })
    doc.setFontSize(12)
    doc.text('Boleta de Matrícula Año 2025', pageWidth / 2, 70, { align: 'center' })

    // Datos del Estudiante
    let startY = 90
    doc.setFontSize(12)
    doc.text('Datos del Estudiante:', 40, startY)
    startY += 20
    doc.setFontSize(10)
    doc.text(`Periodo: ${formData.periodo}`, 40, startY)
    startY += 15
    doc.text(`Grado: ${formData.estudiante.gradoId}`, 40, startY)
    startY += 15
    doc.text(`Nombre: ${formData.estudiante.nombre_Estudiante}`, 40, startY)
    startY += 15
    doc.text(
      `Apellidos: ${formData.estudiante.apellido1_Estudiante} ${formData.estudiante.apellido2_Estudiante}`,
      40,
      startY
    )
    startY += 15
    doc.text(`Cédula: ${formData.estudiante.cedula}`, 40, startY)
    startY += 15
    doc.text(`Teléfono: ${formData.estudiante.telefono}`, 40, startY)
    startY += 15
    doc.text(
      `Repite materia: ${formData.estudiante.Repite_alguna_materia || 'No'}`,
      40,
      startY
    )
    startY += 25

    // Datos del Encargado Legal
    doc.setFontSize(12)
    doc.text('Datos del Encargado Legal:', 40, startY)
    startY += 20
    doc.setFontSize(10)
    doc.text(`Nombre: ${formData.encargadoLegal.nombre_Encargado_Legal}`, 40, startY)
    startY += 15
    doc.text(`Cédula: ${formData.encargadoLegal.N_Cedula}`, 40, startY)
    startY += 25

    // Firma
    doc.setFontSize(10)
    doc.text('Firma del Encargado:', 40, startY)
    doc.line(150, startY, 350, startY)

    doc.save('MatriculaConDatos.pdf')
  }

  return {
    page,
    setPage,
    formData,
    handleChange,
    handleSubmit,
    handleDownloadPDF,
    isSubmitting,
  }
}
