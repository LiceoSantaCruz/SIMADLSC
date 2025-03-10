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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Detalle del Estudiante</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Volver
          </button>
        </div>

        {/* Pestañas */}
        <div className="mb-6 border-b border-gray-300">
          <nav className="flex space-x-6">
            <button
              onClick={() => setActiveTab('estudiante')}
              className={`pb-2 font-semibold ${
                activeTab === 'estudiante'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Estudiante
            </button>
            <button
              onClick={() => setActiveTab('encargado')}
              className={`pb-2 font-semibold ${
                activeTab === 'encargado'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Encargado Legal
            </button>
          </nav>
        </div>

        {/* Contenido de la pestaña Estudiante */}
        {activeTab === 'estudiante' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Nombre:</span>
              <span className="text-gray-900">{studentInfo.nombre_Estudiante}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Apellidos:</span>
              <span className="text-gray-900">
                {studentInfo.apellido1_Estudiante} {studentInfo.apellido2_Estudiante}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Cédula:</span>
              <span className="text-gray-900">{studentInfo.cedula}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Teléfono:</span>
              <span className="text-gray-900">{studentInfo.telefono}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Correo Estudiantil:</span>
              <span className="text-gray-900">{studentInfo.correo_estudiantil}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Fecha de Nacimiento:</span>
              <span className="text-gray-900">{studentInfo.fecha_nacimiento}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Sexo:</span>
              <span className="text-gray-900">{studentInfo.sexo}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Lugar de Nacimiento:</span>
              <span className="text-gray-900">{studentInfo.lugar_de_nacimiento}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Nacionalidad:</span>
              <span className="text-gray-900">{studentInfo.nacionalidad}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Condición Migratoria:</span>
              <span className="text-gray-900">{studentInfo.condicion_migratoria || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Repite alguna materia:</span>
              <span className="text-gray-900">{studentInfo.Repite_alguna_materia || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Institución de Procedencia:</span>
              <span className="text-gray-900">{studentInfo.institucion_de_procedencia}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Presenta alguna enfermedad:</span>
              <span className="text-gray-900">{studentInfo.Presenta_alguna_enfermedad || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Medicamentos:</span>
              <span className="text-gray-900">{studentInfo.medicamentos_que_debe_tomar || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Ruta de Viaje:</span>
              <span className="text-gray-900">{studentInfo.Ruta_de_viaje || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Tipo de Adecuación:</span>
              <span className="text-gray-900">{studentInfo.tipo_de_adecuacion}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">¿Recibe Religión?:</span>
              <span className="text-gray-900">{studentInfo.recibe_religion}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">¿Presenta Carta?:</span>
              <span className="text-gray-900">{studentInfo.presenta_carta}</span>
            </div>
            {/* Mostrar Nivel y Sección basados en la sección */}
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Nivel:</span>
              <span className="text-gray-900">
                {seccionInfo && seccionInfo.gradoId ? gradoMapping[seccionInfo.gradoId] : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Sección:</span>
              <span className="text-gray-900">
                {seccionInfo?.nombre_Seccion || 'N/A'}
              </span>
            </div>
          </div>
        )}

        {/* Contenido de la pestaña Encargado Legal */}
        {activeTab === 'encargado' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {encargadoLegalInfo ? (
              <>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">Nombre:</span>
                  <span className="text-gray-900">
                    {encargadoLegalInfo.nombre_Encargado_Legal}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">Apellidos:</span>
                  <span className="text-gray-900">
                    {encargadoLegalInfo.apellido1_Encargado_Legal}{' '}
                    {encargadoLegalInfo.apellido2_Encargado_Legal}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">Cédula:</span>
                  <span className="text-gray-900">
                    {encargadoLegalInfo.N_Cedula}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">Ocupación:</span>
                  <span className="text-gray-900">
                    {encargadoLegalInfo.ocupacion || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">Nacionalidad:</span>
                  <span className="text-gray-900">
                    {encargadoLegalInfo.nacionalidad || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">Dirección:</span>
                  <span className="text-gray-900">
                    {encargadoLegalInfo.direccion || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">Teléfono Celular:</span>
                  <span className="text-gray-900">
                    {encargadoLegalInfo.telefono_celular || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">Habitación:</span>
                  <span className="text-gray-900">
                    {encargadoLegalInfo.habitacion || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">Correo:</span>
                  <span className="text-gray-900">
                    {encargadoLegalInfo.correo || 'N/A'}
                  </span>
                </div>
              </>
            ) : (
              <div className="col-span-2">
                <p className="text-center text-gray-600">
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
