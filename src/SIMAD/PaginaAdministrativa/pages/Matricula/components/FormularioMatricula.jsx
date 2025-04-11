import useGrados from "../../Asistencias/Hook/useGrados";
import { useMatriculaForm } from "../Hooks/useMatriculaForm";
import { usePeriodos } from "../Hooks/usePeriodos";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";
import ActivarFormularioButton from "./ActivarFormularioButton";
import { useEffect, useState } from "react";
import axios from "axios"; // Asegúrate de importar axios si no está ya importado

export const FormularioMatricula = () => {
  const {
    page,
    setPage,
    handleSubmit,
    handleDownloadPDF,
    isSubmitting,
  } = useMatriculaForm();

  const { periodos } = usePeriodos();
  const { grados } = useGrados();

  // Obtenemos role y userId del localStorage (o de donde corresponda)
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId") || "default";

  // Estados para controlar la activación del formulario, el deadline y envío único
  const [isFormActive, setIsFormActive] = useState(false);
  const [deadline, setDeadline] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isEditable, setIsEditable] = useState(false); // Controla si los campos son editables

  const initialFormData = {
    estudiante: {
      cedula: "",
      nombre_Estudiante: "",
      apellido1_Estudiante: "",
      apellido2_Estudiante: "",
      // Otros campos del estudiante...
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
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length === 2) {
      setFormData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Cargamos el estado del formulario y el deadline desde localStorage al montar
  useEffect(() => {
    const formActiveLS = localStorage.getItem("formActive");
    setIsFormActive(formActiveLS === "true");

    const deadlineLS = localStorage.getItem("formDeadline");
    if (deadlineLS) {
      setDeadline(Number(deadlineLS));
    }
  }, []);

  // Escuchamos cambios en localStorage para mantener la actualización en tiempo real
  useEffect(() => {
    const handleStorageChange = () => {
      const formActiveLS = localStorage.getItem("formActive");
      setIsFormActive(formActiveLS === "true");

      const deadlineLS = localStorage.getItem("formDeadline");
      if (deadlineLS) {
        setDeadline(Number(deadlineLS));
      } else {
        setDeadline(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

// Verificamos si el usuario ya envió el formulario (envío único de 24 horas)
useEffect(() => {
  const submittedTime = localStorage.getItem(`matricula-submitted-${userId}`);
  if (submittedTime) {
    const timeDiff = Date.now() - Number(submittedTime);
    // 24 horas en milisegundos: 86400000
    if (timeDiff < 86400000) {
      setHasSubmitted(true);
    } else {
      // Si han pasado 24 horas, se elimina la marca y se permite enviar de nuevo
      localStorage.removeItem(`matricula-submitted-${userId}`);
      setHasSubmitted(false);
    }
  }
}, [userId]);

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://simadlsc-backend-production.up.railway.app'
  : 'http://localhost:3000';


  // Función para calcular la edad a partir de la fecha de nacimiento
  const handleFechaNacimientoChange = (e) => {
    handleChange(e);
    const birthDate = new Date(e.target.value);
    if (!e.target.value || isNaN(birthDate.getTime())) return;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    // Actualizamos el campo 'edad' en el estado del formulario
    const edadEvent = {
      target: { name: "estudiante.edad", value: age },
    };
    handleChange(edadEvent);
  };

  const buscarEstudiantePorCedula = async (cedula) => {
    if (!cedula || cedula.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, ingrese un número de cédula antes de buscar.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }
  
    try {
      const response = await axios.get(`${API_BASE_URL}/estudiantes/cedula/${cedula}`);
      const estudiante = response.data;
  
      if (estudiante) {
        // Actualizar los datos del estudiante y del encargado legal
        setFormData((prevData) => ({
          ...prevData,
          estudiante: {
            ...prevData.estudiante, // Mantener los valores existentes del estudiante
            cedula: estudiante.cedula,
            nombre_Estudiante: estudiante.nombre_Estudiante,
            apellido1_Estudiante: estudiante.apellido1_Estudiante,
            apellido2_Estudiante: estudiante.apellido2_Estudiante,
            fecha_nacimiento: estudiante.fecha_nacimiento,
            correo_estudiantil: estudiante.correo_estudiantil,
            telefono: estudiante.telefono,
            sexo: estudiante.sexo,
            lugar_de_nacimiento: estudiante.lugar_de_nacimiento,
            nacionalidad: estudiante.nacionalidad,
            edad: estudiante.edad,
            condicion_migratoria: estudiante.condicion_migratoria,
            Repite_alguna_materia: estudiante.Repite_alguna_materia,
            institucion_de_procedencia: estudiante.institucion_de_procedencia,
            tipo_de_adecuacion: estudiante.tipo_de_adecuacion,
            recibe_religion: estudiante.recibe_religion,
            presenta_carta: estudiante.presenta_carta,
            Presenta_alguna_enfermedad: estudiante.Presenta_alguna_enfermedad,
            medicamentos_que_debe_tomar: estudiante.medicamentos_que_debe_tomar,
            Ruta_de_viaje: estudiante.Ruta_de_viaje,
          },
          encargadoLegal: {
            ...prevData.encargadoLegal, // Mantener los valores existentes del encargado legal
            nombre_Encargado_Legal: estudiante.encargadoLegal.nombre_Encargado_Legal,
            apellido1_Encargado_Legal: estudiante.encargadoLegal.apellido1_Encargado_Legal,
            apellido2_Encargado_Legal: estudiante.encargadoLegal.apellido2_Encargado_Legal,
            N_Cedula: estudiante.encargadoLegal.N_Cedula,
            ocupacion: estudiante.encargadoLegal.ocupacion,
            nacionalidad: estudiante.encargadoLegal.nacionalidad,
            direccion: estudiante.encargadoLegal.direccion,
            telefono_celular: estudiante.encargadoLegal.telefono_celular,
            habitacion: estudiante.encargadoLegal.habitacion,
            correo: estudiante.encargadoLegal.correo,
          },
        }));
  
        // Permitir la edición si los datos son correctos
        setIsEditable(true);
  
        Swal.fire({
          icon: "success",
          title: "Estudiante encontrado",
          text: "Los datos del estudiante y del encargado legal han sido rellenados automáticamente. Ahora puedes editarlos.",
          confirmButtonColor: "#2563EB",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Permitir la edición manual si no se encuentra el estudiante
        setIsEditable(true);
        Swal.fire({
          icon: "warning",
          title: "Estudiante no encontrado",
          text: `No se encontró un estudiante con la cédula: ${cedula}. Por favor, ingrese los datos manualmente.`,
          confirmButtonColor: "#2563EB",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al buscar el estudiante. Intente nuevamente.",
          confirmButtonColor: "#2563EB",
        });
      }
    }
  };

  // Validaciones antes de enviar el formulario
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validar campos vacíos
    const missingFields = [];
    if (!formData.estudiante.cedula || formData.estudiante.cedula.trim() === "") {
      missingFields.push("Cédula");
    }
    if (!formData.estudiante.nombre_Estudiante || formData.estudiante.nombre_Estudiante.trim() === "") {
      missingFields.push("Nombre Completo");
    }
    if (!formData.estudiante.apellido1_Estudiante || formData.estudiante.apellido1_Estudiante.trim() === "") {
      missingFields.push("Primer Apellido");
    }
    if (!formData.estudiante.apellido2_Estudiante || formData.estudiante.apellido2_Estudiante.trim() === "") {
      missingFields.push("Segundo Apellido");
    }
    if (!formData.estudiante.fecha_nacimiento || formData.estudiante.fecha_nacimiento.trim() === "") {
      missingFields.push("Fecha de Nacimiento");
    }
    if (!formData.estudiante.correo_estudiantil || formData.estudiante.correo_estudiantil.trim() === "") {
      missingFields.push("Correo Estudiantil");
    }
    if (!formData.estudiante.telefono || formData.estudiante.telefono.trim() === "") {
      missingFields.push("Teléfono");
    }
   
    if (!formData.estudiante.sexo || formData.estudiante.sexo.trim() === "") {
      missingFields.push("Sexo");
    }
    if (!formData.estudiante.lugar_de_nacimiento || formData.estudiante.lugar_de_nacimiento.trim() === "") {
      missingFields.push("Lugar de Nacimiento");
    }
    if (!formData.estudiante.nacionalidad || formData.estudiante.nacionalidad.trim() === "") {
      missingFields.push("Nacionalidad");
    }
    
    if (!formData.estudiante.edad || formData.estudiante.edad.toString().trim() === "") {
      missingFields.push("Edad");
    }
    if (!formData.estudiante.condicion_migratoria || formData.estudiante.condicion_migratoria.trim() === "") {
      missingFields.push("Condición Migratoria");
    }
    if (!formData.estudiante.Repite_alguna_materia || formData.estudiante.Repite_alguna_materia.toString().trim() === "") {
      missingFields.push("Repite alguna materia");
    }
    if (!formData.estudiante.institucion_de_procedencia || formData.estudiante.institucion_de_procedencia.toString().trim() === "") {
      missingFields.push("Institución de Procedencia");
    }
    if (!formData.estudiante.tipo_de_adecuacion || formData.estudiante.tipo_de_adecuacion.toString().trim() === "") {
      missingFields.push("Tipo de Adecuación");
    }
    if (!formData.estudiante.recibe_religion || formData.estudiante.recibe_religion.toString().trim() === "") {
      missingFields.push("Recibe Religión");
    }
    if (!formData.estudiante.presenta_carta || formData.estudiante.presenta_carta.toString().trim() === "") { 
      missingFields.push("Presenta Carta");    
    } 
    if (!formData.estudiante.Presenta_alguna_enfermedad || formData.estudiante.Presenta_alguna_enfermedad.toString().trim() === "") { 
      missingFields.push("Presenta alguna enfermedad");    
    }
    if (!formData.estudiante.medicamentos_que_debe_tomar || formData.estudiante.medicamentos_que_debe_tomar.toString().trim() === "") { 
      missingFields.push("Medicamentos que debe tomar");  
    } 
    if (!formData.estudiante.Ruta_de_viaje || formData.estudiante.Ruta_de_viaje.toString().trim() === "") { 
      missingFields.push("Ruta de Viaje");  
    }
 
    if (!formData.estudiante.nombres || formData.estudiante.nombres.trim() === "") {
      missingFields.push("Nombres del encargado Legal");
    }
    if (!formData.estudiante.apellido1_Encargado_Legal || formData.estudiante.apellido1_Encargado_Legal.trim() === "") {
      missingFields.push("Apellidos 1 del encargado Legal");
    }
    if (!formData.estudiante.apellido2_Encargado_Legal || formData.estudiante.apellido2_Encargado_Legal.trim() === "") {
      missingFields.push("Apellidos 2 del encargado Legal");
    }
    if (!formData.estudiante.cedula || formData.estudiante.cedula.trim() === "") {
      missingFields.push("Cédula del encargado Legal");
    }
    if (!formData.estudiante.ocupacion || formData.estudiante.ocupacion.trim() === "") {
      missingFields.push("ocupación del encargado Legal");
    }
    if (!formData.estudiante.nacionalidad || formData.estudiante.nacionalidad.trim() === "") {
      missingFields.push("nacionalidad del encargado Legal");
    }
    if (!formData.estudiante.direccion || formData.estudiante.direccion.trim() === "") {
      missingFields.push("dirección del encargado Legal");
    }
    if (!formData.estudiante.telefono_celular || formData.estudiante.telefono_celular.trim() === "") {
      missingFields.push("teléfono celular del encargado Legal");
    }
    if (!formData.estudiante.habitacion || formData.estudiante.habitacion.trim() === "") {
      missingFields.push("habitación del encargado Legal");
    }
    if (!formData.estudiante.correo || formData.estudiante.correo.trim() === "") {
      missingFields.push("correo del encargado Legal");
    }
    if (missingFields.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios incompletos",
        text: `Por favor, complete los siguientes campos: ${missingFields.join(", ")}`,
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    // Si no hay campos vacíos, proceder con el envío
    try {
      await handleSubmit(e);
      // Guarda la hora de envío actual
      localStorage.setItem(`matricula-submitted-${userId}`, Date.now().toString());
      setHasSubmitted(true);
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Formulario enviado correctamente",
        confirmButtonColor: "#2563EB",
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Hubo un error al enviar el formulario. Intente nuevamente.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  if (hasSubmitted) {
    return (
      <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-center text-2xl font-bold mb-4 dark:text-white">
          Boleta de Matrícula Año 2025
        </h1>
        <p className="text-center text-green-600 dark:text-green-300">
          ¡Ya has enviado tu formulario de matrícula! No es posible enviar más de una vez.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 shadow-md">
      {/* Se muestra siempre el componente para controlar la activación y el contador.
          Se le pasa el role para que solo los admin/superadmin vean los botones */}
      <ActivarFormularioButton
        isFormActive={isFormActive}
        setIsFormActive={setIsFormActive}
        deadline={deadline}
        setDeadline={setDeadline}
        role={role}
      />

      <h1 className="text-center text-2xl font-bold mb-2 dark:text-white">
        Boleta de Matrícula Año 2025
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        Por favor, complete todos los campos solicitados con datos verídicos.
      </p>
     
      {/* Mensaje de aviso si el formulario está inactivo */}
      {!isFormActive && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
          <strong>El formulario está inactivo.</strong> No podrás enviarlo hasta que sea habilitado.
        </div>
      )}

      <form className="space-y-6" onSubmit={onSubmitHandler}>
        {page === 1 ? (
          <>
            {/* Página 1: Datos del Estudiante */}
            <div className="flex justify-between">
            <div>
                <label className="block text-gray-700 dark:text-gray-200">Periodo:</label>
                {periodos.length === 0 ? (
                  <p>Cargando periodos...</p>
                ) : (
                  <select
                    name="periodo"
                    value={formData.periodo}
                    onChange={handleChange}
                    className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Seleccione un periodo</option>
                    {periodos.map((periodo) => (
                      <option key={periodo.id_Periodo} value={periodo.id_Periodo}>
                        {periodo.nombre_Periodo}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200">Grado:</label>
                {grados.length === 0 ? (
                  <p>Cargando grados...</p>
                ) : (
                  <select
                    name="estudiante.gradoId"
                    value={formData.estudiante.gradoId}
                    onChange={handleChange}
                    className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Seleccione un grado</option>
                    {/* 
                      Si deseas mostrar todos los grados sin filtro, usa simplemente:
                      
                      {grados.map((grado) => (
                        <option key={grado.id_grado} value={grado.id_grado}>
                          {grado.nivel}
                        </option>
                      ))}
                      
                      Si deseas omitir solo "Sétimo", aplica un filter como se ve abajo.
                    */}
                    {grados
                      .filter((grado) => grado.nivel !== "Sétimo")
                      .map((grado) => (
                        <option key={grado.id_grado} value={grado.id_grado}>
                          {grado.nivel}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            </div>

            <h2 className="text-lg font-semibold dark:text-white">Datos del Estudiante</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              Complete la información personal del estudiante. Asegúrese de que los datos sean correctos.
            </p>
              {/* Campo de cédula al inicio */}
              <div>
              <label className="block text-gray-700 dark:text-gray-200">Nº Cédula o Pasaporte:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="estudiante.cedula"
                  value={formData.estudiante.cedula}
                  onChange={handleChange}
                  onBlur={(e) => buscarEstudiantePorCedula(e.target.value)} // Llamar a la función al perder el foco
                  placeholder="5-0442-0911"
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => buscarEstudiantePorCedula(formData.estudiante.cedula)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Buscar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Nombre Completo:</label>
                <input
                  type="text"
                  name="estudiante.nombre_Estudiante"
                  value={formData.estudiante.nombre_Estudiante}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">1º Apellido:</label>
                <input
                  type="text"
                  name="estudiante.apellido1_Estudiante"
                  value={formData.estudiante.apellido1_Estudiante}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">2º Apellido:</label>
                <input
                  type="text"
                  name="estudiante.apellido2_Estudiante"
                  value={formData.estudiante.apellido2_Estudiante}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Correo Estudiantil:</label>
                <input
                  type="email"
                  name="estudiante.correo_estudiantil"
                  value={formData.estudiante.correo_estudiantil}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  placeholder="ejemplo@correo.com"
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Teléfono:</label>
                <input
                  type="text"
                  name="estudiante.telefono"
                  value={formData.estudiante.telefono}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <label className="block text-gray-700 dark:text-gray-200">Sexo:</label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="estudiante.sexo"
                  value="Femenino"
                  checked={formData.estudiante.sexo === "Femenino"}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className="mr-2"
                />
                Femenino
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="estudiante.sexo"
                  value="Masculino"
                  checked={formData.estudiante.sexo === "Masculino"}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className="mr-2"
                />
                Masculino
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Lugar de Nacimiento:</label>
                <input
                  type="text"
                  name="estudiante.lugar_de_nacimiento"
                  value={formData.estudiante.lugar_de_nacimiento}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Fecha de Nacimiento:</label>
                <input
                  type="date"
                  name="estudiante.fecha_nacimiento"
                  value={formData.estudiante.fecha_nacimiento}
                  onChange={handleFechaNacimientoChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Nacionalidad:</label>
                <input
                  type="text"
                  name="estudiante.nacionalidad"
                  value={formData.estudiante.nacionalidad}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Edad:</label>
                <input
                  type="number"
                  name="estudiante.edad"
                  value={formData.estudiante.edad}
                  readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Campos adicionales */}
            <div className="flex space-x-4">
              <label className="block text-gray-700 dark:text-gray-200">Condición Migratoria:</label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="estudiante.condicion_migratoria"
                  value="legal"
                  checked={formData.estudiante.condicion_migratoria === "legal"}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="mr-2"
                />
                Legal
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="estudiante.condicion_migratoria"
                  value="refugiado"
                  checked={formData.estudiante.condicion_migratoria === "refugiado"}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="mr-2"
                />
                Refugiado
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="estudiante.condicion_migratoria"
                  value="ilegal"
                  checked={formData.estudiante.condicion_migratoria === "ilegal"}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="mr-2"
                />
                Ilegal
              </label>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200">Repite alguna materia:</label>
              <input
                type="text"
                name="estudiante.Repite_alguna_materia"
                value={formData.estudiante.Repite_alguna_materia}
                onChange={handleChange}
                disabled={!isEditable} // Bloquear si no es editable
                className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white mt-1"
                placeholder="Si repite alguna materia, ingrese el nombre; de lo contrario, déjelo en blanco."
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200">Institución de Procedencia:</label>
              <input
                type="text"
                name="estudiante.institucion_de_procedencia"
                value={formData.estudiante.institucion_de_procedencia}
                onChange={handleChange}
                disabled={!isEditable} // Bloquear si no es editable
                className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Tipo de Adecuación:</label>
                <select
                  name="estudiante.tipo_de_adecuacion"
                  value={formData.estudiante.tipo_de_adecuacion}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccione una opción</option>
                  <option value="N">No presenta</option>
                  <option value="DA">Adecuación de Acceso</option>
                  <option value="S">Adecuación Significativa</option>
                  <option value="NS">Adecuación No Significativa</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200">Recibe Religión:</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="estudiante.recibe_religion"
                      value="Si"
                      checked={formData.estudiante.recibe_religion === "Si"}
                      onChange={handleChange}
                      disabled={!isEditable} // Bloquear si no es editable
                      className="mr-2"
                    />
                    Sí
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="estudiante.recibe_religion"
                      value="No"
                      checked={formData.estudiante.recibe_religion === "No"}
                      onChange={handleChange}
                      disabled={!isEditable} // Bloquear si no es editable
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Presenta Carta:</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="estudiante.presenta_carta"
                      value="Si"
                      checked={formData.estudiante.presenta_carta === "Si"}
                      onChange={handleChange}
                      disabled={!isEditable} // Bloquear si no es editable
                      className="mr-2"
                    />
                    Sí
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="estudiante.presenta_carta"
                      value="No"
                      checked={formData.estudiante.presenta_carta === "No"}
                      onChange={handleChange}
                      disabled={!isEditable} // Bloquear si no es editable
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold dark:text-white">Enfermedades y Medicamentos</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              Si el estudiante presenta alguna condición médica o necesita medicación específica, indíquelo aquí.
            </p>

            <div>
              <label className="block text-gray-700 dark:text-gray-200">Presenta alguna enfermedad:</label>
              <input
                type="text"
                name="estudiante.Presenta_alguna_enfermedad"
                value={formData.estudiante.Presenta_alguna_enfermedad}
                onChange={handleChange}
                disabled={!isEditable} // Bloquear si no es editable
                className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200">Medicamentos que debe tomar:</label>
              <input
                type="text"
                name="estudiante.medicamentos_que_debe_tomar"
                value={formData.estudiante.medicamentos_que_debe_tomar}
                onChange={handleChange}
                disabled={!isEditable} // Bloquear si no es editable
                className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200">Ruta que viaja el estudiante:</label>
              <select
                name="estudiante.Ruta_de_viaje"
                value={formData.estudiante.Ruta_de_viaje}
                onChange={handleChange}
                disabled={!isEditable} // Bloquear si no es editable
                className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="">Seleccione una ruta</option>
                <option value="San Juan - Guayabal - Santa Cruz">San Juan - Guayabal - Santa Cruz</option>
                <option value="Río Cañas - Barrio Limón - Santa Cruz">Río Cañas - Barrio Limón - Santa Cruz</option>
                <option value="Bolsón - Ortega - Oriente - Santa Cruz">Bolsón - Ortega - Oriente - Santa Cruz</option>
                <option value="Guaitil - Santa Bárbara - Santa Cruz">Guaitil - Santa Bárbara - Santa Cruz</option>
                <option value="Bernabela - El Cacao - Santa Cruz">Bernabela - El Cacao - Santa Cruz</option>
                <option value="Arado - Hato Viejo - Santa Cruz">Arado - Hato Viejo - Santa Cruz</option>
                <option value="Lagunilla - San Pedro - Santa Cruz">Lagunilla - San Pedro - Santa Cruz</option>
                <option value="San José de la montaña - Santa Cruz">San José de la montaña - Santa Cruz</option>
              </select>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={() => setPage(2)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
              >
                Siguiente
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold dark:text-white">Datos del Encargado Legal</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              Ingrese la información del encargado legal o tutor del estudiante. Asegúrese de completar todos los campos.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Nombre Completo:</label>
                <input
                  type="text"
                  name="encargadoLegal.nombre_Encargado_Legal"
                  value={formData.encargadoLegal.nombre_Encargado_Legal}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">1º Apellido:</label>
                <input
                  type="text"
                  name="encargadoLegal.apellido1_Encargado_Legal"
                  value={formData.encargadoLegal.apellido1_Encargado_Legal}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">2º Apellido:</label>
                <input
                  type="text"
                  name="encargadoLegal.apellido2_Encargado_Legal"
                  value={formData.encargadoLegal.apellido2_Encargado_Legal}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Nº Cédula:</label>
                <input
                  type="text"
                  name="encargadoLegal.N_Cedula"
                  value={formData.encargadoLegal.N_Cedula}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  placeholder="5-0123-0456"
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Ocupación:</label>
                <input
                  type="text"
                  name="encargadoLegal.ocupacion"
                  value={formData.encargadoLegal.ocupacion}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Nacionalidad:</label>
                <input
                  type="text"
                  name="encargadoLegal.nacionalidad"
                  value={formData.encargadoLegal.nacionalidad}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Dirección:</label>
                <input
                  type="text"
                  name="encargadoLegal.direccion"
                  value={formData.encargadoLegal.direccion}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Teléfono Celular:</label>
                <input
                  type="text"
                  name="encargadoLegal.telefono_celular"
                  value={formData.encargadoLegal.telefono_celular}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Habitación:</label>
                <input
                  type="text"
                  name="encargadoLegal.habitacion"
                  value={formData.encargadoLegal.habitacion}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Correo:</label>
                <input
                  type="email"
                  name="encargadoLegal.correo"
                  value={formData.encargadoLegal.correo}
                  onChange={handleChange}
                  disabled={!isEditable} // Bloquear si no es editable
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600"
              >
                Descargar PDF
              </button>
              <button
                type="button"
                onClick={() => setPage(1)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600"
              >
                Anterior
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default FormularioMatricula;