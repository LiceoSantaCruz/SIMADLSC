// src/Pages/DetalleEstudiante.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EstudiantesService from '../Service/EstudiantesService';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

// Mapping de gradoId a nivel (ajusta según corresponda)
const gradoMapping = {
  1: "Septimo",
  2: "Octavo",   // Por ejemplo, gradoId 2 se mostrará "Octavo"
  3: "Noveno",
  4: "Decimo",
  5: "Undecimo",
  6: "Duodecimo",
};

export default function DetalleEstudiante() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estudianteData, setEstudianteData] = useState(null);
  const [activeTab, setActiveTab] = useState('estudiante'); // pestaña por defecto
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstudiante = async () => {
      try {
        const data = await EstudiantesService.getEstudianteById(id);
        console.log("Datos del estudiante:", data);
        // Si la respuesta tiene la propiedad "estudiante", la usamos; si no, usamos data directamente
        setEstudianteData(data.estudiante ? data : { estudiante: data, encargadoLegal: data.encargadoLegal, seccion: data.seccion });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo cargar el estudiante',
          confirmButtonColor: '#2563EB',
        }).then(() => {
          navigate('/busqueda-estudiantes');
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEstudiante();
  }, [id, navigate]);

  if (loading) {
    return <div className="p-6 bg-gray-100 min-h-screen">Cargando...</div>;
  }

  if (!estudianteData) {
    return <div className="p-6 bg-gray-100 min-h-screen">Estudiante no encontrado.</div>;
  }

  // Extraemos la información: si existe la propiedad "estudiante", la usamos; de lo contrario, usamos estudianteData directamente.
  const studentInfo = estudianteData.estudiante || estudianteData;
  const encargadoLegalInfo = estudianteData.encargadoLegal;
  const seccionInfo = estudianteData.seccion || {};

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Detalle del Estudiante</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Volver
        </button>
      </div>
  
      {/* Pestañas */}
      <div className="mb-6 border-b border-gray-300 dark:border-gray-600">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('estudiante')}
            className={`pb-2 font-semibold ${
              activeTab === 'estudiante'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            Estudiante
          </button>
          <button
            onClick={() => setActiveTab('encargado')}
            className={`pb-2 font-semibold ${
              activeTab === 'encargado'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            Encargado Legal
          </button>
        </nav>
      </div>
  
      {/* Contenido de la pestaña Estudiante */}
      {activeTab === 'estudiante' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['Nombre', studentInfo.nombre_Estudiante],
            ['Apellidos', `${studentInfo.apellido1_Estudiante} ${studentInfo.apellido2_Estudiante}`],
            ['Cédula', studentInfo.cedula],
            ['Teléfono', studentInfo.telefono],
            ['Correo Estudiantil', studentInfo.correo_estudiantil],
            ['Fecha de Nacimiento', studentInfo.fecha_nacimiento],
            ['Sexo', studentInfo.sexo],
            ['Lugar de Nacimiento', studentInfo.lugar_de_nacimiento],
            ['Nacionalidad', studentInfo.nacionalidad],
            ['Condición Migratoria', studentInfo.condicion_migratoria || 'N/A'],
            ['Repite alguna materia', studentInfo.Repite_alguna_materia || 'N/A'],
            ['Institución de Procedencia', studentInfo.institucion_de_procedencia],
            ['Presenta alguna enfermedad', studentInfo.Presenta_alguna_enfermedad || 'N/A'],
            ['Medicamentos', studentInfo.medicamentos_que_debe_tomar || 'N/A'],
            ['Ruta de Viaje', studentInfo.Ruta_de_viaje || 'N/A'],
            ['Tipo de Adecuación', studentInfo.tipo_de_adecuacion],
            ['¿Recibe Religión?', studentInfo.recibe_religion],
            ['¿Presenta Carta?', studentInfo.presenta_carta],
            ['Nivel', seccionInfo?.gradoId ? gradoMapping[seccionInfo.gradoId] : 'N/A'],
            ['Sección', seccionInfo?.nombre_Seccion || 'N/A']
          ].map(([label, value]) => (
            <div className="flex flex-col" key={label}>
              <span className="font-semibold text-gray-700 dark:text-gray-300">{label}:</span>
              <span className="text-gray-900 dark:text-gray-100">{value}</span>
            </div>
          ))}
        </div>
      )}
  
      {/* Contenido de la pestaña Encargado Legal */}
      {activeTab === 'encargado' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {encargadoLegalInfo ? (
            [
              ['Nombre', encargadoLegalInfo.nombre_Encargado_Legal],
              ['Apellidos', `${encargadoLegalInfo.apellido1_Encargado_Legal} ${encargadoLegalInfo.apellido2_Encargado_Legal}`],
              ['Cédula', encargadoLegalInfo.N_Cedula],
              ['Ocupación', encargadoLegalInfo.ocupacion || 'N/A'],
              ['Nacionalidad', encargadoLegalInfo.nacionalidad || 'N/A'],
              ['Dirección', encargadoLegalInfo.direccion || 'N/A'],
              ['Teléfono Celular', encargadoLegalInfo.telefono_celular || 'N/A'],
              ['Habitación', encargadoLegalInfo.habitacion || 'N/A'],
              ['Correo', encargadoLegalInfo.correo || 'N/A']
            ].map(([label, value]) => (
              <div className="flex flex-col" key={label}>
                <span className="font-semibold text-gray-700 dark:text-gray-300">{label}:</span>
                <span className="text-gray-900 dark:text-gray-100">{value}</span>
              </div>
            ))
          ) : (
            <div className="col-span-2">
              <p className="text-center text-gray-600 dark:text-gray-300">
                No se ha registrado un encargado legal.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>  
  );
}
