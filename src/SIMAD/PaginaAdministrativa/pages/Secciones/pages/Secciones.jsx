import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UseFetchSecciones from '../Hooks/UseFetchSecciones';
import SeccionesService from '../Services/SeccionesService';
import EstudiantesService from '../../../Estudiantes/Service/EstudiantesService';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

// Función auxiliar para normalizar (minúsculas y quitar acentos)
const normalizeText = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const Secciones = () => {
  const { secciones, loading, error, fetchSecciones } = UseFetchSecciones();
  const [nivelFilter, setNivelFilter] = useState('');
  const [levels, setLevels] = useState([]);

  // Estados para el modal de creación
  const [showModal, setShowModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionGradeId, setNewSectionGradeId] = useState('');

  // Definición de patrones permitidos para cada nivel (con claves normalizadas)
  const allowedPatterns = {
    'setimo': /^7-\d+$/,
    'octavo': /^8-\d+$/,
    'undecimo': /^11-\d+$/,
    'noveno': /^9-\d+$/,
    'décimo': /^10-\d+$/,
    // Puedes agregar otros niveles si es necesario
  };

  // Traer niveles desde backend
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await EstudiantesService.getNiveles();
        setLevels(data);
      } catch (err) {
        console.error('Error al obtener niveles:', err);
      }
    };
    fetchLevels();
  }, []);

  // Filtrar secciones según el nivel (usando sec.grado.nivel)
  const filteredSecciones = nivelFilter
    ? secciones.filter(
        (sec) =>
          sec.grado &&
          sec.grado.nivel &&
          normalizeText(sec.grado.nivel) === normalizeText(nivelFilter)
      )
    : secciones;

  // Handler para eliminar una sección
  const handleDelete = async (idSeccion) => {
    try {
      const estudiantesInSection = await SeccionesService.getEstudiantesPorSeccion(idSeccion);
      if (estudiantesInSection && estudiantesInSection.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No se puede eliminar',
          text: 'No es posible eliminar la sección porque tiene estudiantes asignados.',
          confirmButtonColor: '#2563EB',
        });
        return;
      }
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará la sección.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2563EB',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
      });
      if (result.isConfirmed) {
        await SeccionesService.deleteSeccion(idSeccion);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La sección ha sido eliminada.',
          confirmButtonColor: '#2563EB',
        });
        fetchSecciones();
      }
    } catch (error) {
      console.error('Error al eliminar sección:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al eliminar la sección.',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  // Handler para abrir el modal
  const openModal = () => {
    setNewSectionName('');
    setNewSectionGradeId('');
    setShowModal(true);
  };

  // Handler para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Handler para crear una nueva sección
  const handleCreateSection = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!newSectionName.trim()) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre de la sección es obligatorio.',
        confirmButtonColor: '#2563EB',
      });
    }
    if (!newSectionGradeId) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes seleccionar un nivel válido.',
        confirmButtonColor: '#2563EB',
      });
    }

    // Buscar el nivel seleccionado
    const selectedLevel = levels.find(
      (level) => level.id_grado === Number(newSectionGradeId)
    );
    if (!selectedLevel) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nivel seleccionado no coincide con los niveles disponibles.',
        confirmButtonColor: '#2563EB',
      });
    }

    // Normalizar el nivel
    const normalizedNivel = normalizeText(selectedLevel.nivel);

    // Validar que el nivel esté permitido (tenga un patrón definido)
    const pattern = allowedPatterns[normalizedNivel];
    if (!pattern) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se permiten secciones para el nivel "${selectedLevel.nivel}".`,
        confirmButtonColor: '#2563EB',
      });
    }

    // Validar que el nombre ingresado cumpla el patrón
    if (!pattern.test(newSectionName)) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Para el nivel "${selectedLevel.nivel}", el nombre de la sección debe cumplir el formato, por ejemplo, "11-<número>" para Undécimo.`,
        confirmButtonColor: '#2563EB',
      });
    }

    // Validación: verificar si la sección ya existe (ignorando mayúsculas/minúsculas)
    const sectionExists = secciones.some(
      (sec) => sec.nombre_Seccion.toLowerCase() === newSectionName.toLowerCase()
    );
    if (sectionExists) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La sección que intentas crear ya existe.',
        confirmButtonColor: '#2563EB',
      });
    }

    // Payload para la creación
    const payload = {
      nombre_Seccion: newSectionName,
      gradoId: Number(newSectionGradeId),
    };

    try {
      await SeccionesService.create(payload);
      Swal.fire({
        icon: 'success',
        title: 'Creado',
        text: 'La sección se ha creado correctamente.',
        confirmButtonColor: '#2563EB',
      });
      fetchSecciones();
      closeModal();
    } catch (error) {
      console.error('Error al crear sección:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al crear la sección.',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 min-h-screen">
        <p className="text-xl text-gray-700">Cargando secciones...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Lista de Secciones</h1>
          {/* Botón para abrir el modal de creación */}
          <button
            onClick={openModal}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Crear Sección
          </button>
        </div>

        {/* Filtro por nivel */}
        <div className="mb-4">
          <label htmlFor="nivelFilter" className="block text-gray-700 font-medium mb-1">
            Filtrar por Nivel:
          </label>
          <select
            id="nivelFilter"
            value={nivelFilter}
            onChange={(e) => setNivelFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="">Todos los niveles</option>
            {levels.map((level, index) => (
              <option key={level.id_grado || index} value={level.nivel}>
                {level.nivel}
              </option>
            ))}
          </select>
        </div>

        {filteredSecciones.length === 0 ? (
          <p className="text-center text-gray-600">No hay secciones disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSecciones.map((seccion) => (
              <div key={seccion.id_Seccion} className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-blue-600">
                  {seccion.nombre_Seccion}
                </h2>
                {seccion.grado && (
                  <p className="text-gray-700">Nivel: {seccion.grado.nivel}</p>
                )}
                <div className="mt-4 flex justify-between">
                  <Link
                    to={`/lista-estudiantes/${seccion.id_Seccion}`}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Ver Lista
                  </Link>
                  <button
                    onClick={() => handleDelete(seccion.id_Seccion)}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para crear sección */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Crear Sección</h2>
            <form onSubmit={handleCreateSection}>
              <div className="mb-4">
                <label htmlFor="sectionName" className="block text-gray-700 font-medium mb-1">
                  Nombre de la Sección:
                </label>
                <input
                  type="text"
                  id="sectionName"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 7-5, 8-6, 11-5, 11-6, etc."
                />
              </div>
              <div className="mb-4">
                <label htmlFor="sectionLevel" className="block text-gray-700 font-medium mb-1">
                  Nivel:
                </label>
                <select
                  id="sectionLevel"
                  value={newSectionGradeId}
                  onChange={(e) => setNewSectionGradeId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione un nivel</option>
                  {levels.map((level) => (
                    <option key={level.id_grado} value={level.id_grado}>
                      {level.nivel}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
              <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
               
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Secciones;
