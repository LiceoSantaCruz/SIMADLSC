import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UseFetchSecciones from '../Hooks/UseFetchSecciones';
import SeccionesService from '../Services/SeccionesService';
import EstudiantesService from '../../../Estudiantes/Service/EstudiantesService';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

// Función para normalizar el texto (convierte a minúsculas y elimina acentos)
const normalizeText = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

// Patrones permitidos para cada nivel (CLAVES normalizadas: sin acentos y en minúsculas)
const allowedPatterns = {
  setimo: /^7-\d+$/,
  octavo: /^8-\d+$/,
  undecimo: /^11-\d+$/,
  noveno: /^9-\d+$/,
  decimo: /^10-\d+$/,
};

// Ejemplos para cada nivel (CLAVES normalizadas)
const exampleSectionNames = {
  setimo: '7-1',
  octavo: '8-1',
  undecimo: '11-1',
  noveno: '9-1',
  decimo: '10-1',
};

// Objeto para definir el orden de los niveles (de menor a mayor)
const levelOrder = {
  setimo: 7,
  octavo: 8,
  noveno: 9,
  decimo: 10,
  undecimo: 11,
};

const Secciones = () => {
  const { secciones, loading, error, fetchSecciones } = UseFetchSecciones();
  const [nivelFilter, setNivelFilter] = useState('');
  const [levels, setLevels] = useState([]);

  // Estados para el modal de creación
  const [showModal, setShowModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionGradeId, setNewSectionGradeId] = useState('');

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const sectionsPerPage = 15; // 15 secciones por página

  // Cargar niveles desde el backend
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

  // Calcular el ejemplo de sección según el nivel seleccionado
  const getExampleSectionName = () => {
    if (newSectionGradeId) {
      const selectedLevel = levels.find(
        (level) => level.id_grado === Number(newSectionGradeId)
      );
      if (selectedLevel) {
        const normalizedNivel = normalizeText(selectedLevel.nivel);
        return exampleSectionNames[normalizedNivel] || '';
      }
    }
    return '';
  };

  const exampleSectionName = getExampleSectionName();

  // Filtrar secciones según el nivel seleccionado
  const filteredSecciones = nivelFilter
    ? secciones.filter(
        (sec) =>
          sec.grado &&
          sec.grado.nivel &&
          normalizeText(sec.grado.nivel) === normalizeText(nivelFilter)
      )
    : secciones;

  // Ordenar las secciones primero por nivel y luego por el número de la sección
  const sortedSecciones = [...filteredSecciones].sort((a, b) => {
    const nivelA = levelOrder[normalizeText(a.grado.nivel)] || 100;
    const nivelB = levelOrder[normalizeText(b.grado.nivel)] || 100;
    if (nivelA !== nivelB) return nivelA - nivelB;
    // Extraer el número de la sección (parte después del guión)
    const numA = parseInt(a.nombre_Seccion.split('-')[1], 10);
    const numB = parseInt(b.nombre_Seccion.split('-')[1], 10);
    if (numA !== numB) return numA - numB;
    // Si son iguales, se ordena alfabéticamente (opcional)
    return a.nombre_Seccion.localeCompare(b.nombre_Seccion);
  });

  // Paginación
  const indexOfLastSection = currentPage * sectionsPerPage;
  const indexOfFirstSection = indexOfLastSection - sectionsPerPage;
  const currentSecciones = sortedSecciones.slice(indexOfFirstSection, indexOfLastSection);
  const totalPages = Math.ceil(sortedSecciones.length / sectionsPerPage);

  // Handler para eliminar una sección
  const handleDelete = async (idSeccion) => {
    try {
      const estudiantesInSection = await SeccionesService.getEstudiantesPorSeccion(idSeccion);
      if (estudiantesInSection && estudiantesInSection.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No se puede eliminar',
          text: 'La sección tiene estudiantes asignados.',
          confirmButtonColor: '#2563EB',
        });
        return;
      }
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se eliminará la sección.',
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
          text: 'La sección se eliminó correctamente.',
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

  // Abrir el modal para crear sección
  const openModal = () => {
    setNewSectionName('');
    setNewSectionGradeId('');
    setShowModal(true);
  };

  // Cerrar el modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Handler para crear una nueva sección
  const handleCreateSection = async (e) => {
    e.preventDefault();

    // Validación: campo de nombre vacío
    if (!newSectionName.trim()) {
      return Swal.fire({
        icon: 'error',
        title: 'Campo vacío',
        text: `Ingrese el nombre de la sección. Ejemplo: "${exampleSectionName || '7-1'}".`,
        confirmButtonColor: '#2563EB',
      });
    }
    // Validación: nivel no seleccionado
    if (!newSectionGradeId) {
      return Swal.fire({
        icon: 'error',
        title: 'Campo vacío',
        text: 'Seleccione el nivel correspondiente.',
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
        title: 'Nivel inválido',
        text: 'El nivel seleccionado no es válido. Seleccione uno de la lista.',
        confirmButtonColor: '#2563EB',
      });
    }

    // Normalizar el nivel y obtener el patrón correspondiente
    const normalizedNivel = normalizeText(selectedLevel.nivel);
    const pattern = allowedPatterns[normalizedNivel];
    if (!pattern) {
      return Swal.fire({
        icon: 'error',
        title: 'Nivel no permitido',
        text: `No se pueden crear secciones en el nivel "${selectedLevel.nivel}".`,
        confirmButtonColor: '#2563EB',
      });
    }

    // Validar formato del nombre de la sección
    if (!pattern.test(newSectionName)) {
      return Swal.fire({
        icon: 'error',
        title: 'Formato incorrecto',
        text: `El nombre debe ser como "${exampleSectionName}" según el nivel "${selectedLevel.nivel}".`,
        confirmButtonColor: '#2563EB',
      });
    }

    // Validar la consecutividad de las secciones
    const match = newSectionName.match(/^(\d+)-(\d+)$/);
    if (!match) {
      return Swal.fire({
        icon: 'error',
        title: 'Formato incorrecto',
        text: `El nombre debe ser como "${exampleSectionName}".`,
        confirmButtonColor: '#2563EB',
      });
    }
    const sectionLevel = match[1];
    const sectionNumber = parseInt(match[2], 10);
    const previousSectionName = `${sectionLevel}-${sectionNumber - 1}`;

    // Si se intenta crear una sección mayor a 1, la sección anterior debe existir
    if (sectionNumber > 1) {
      const previousExists = secciones.some(
        (sec) => sec.nombre_Seccion.toLowerCase() === previousSectionName.toLowerCase()
      );
      if (!previousExists) {
        return Swal.fire({
          icon: 'error',
          title: 'Orden incorrecto',
          text: `Para crear la sección "${newSectionName}", primero debe existir "${previousSectionName}".`,
          confirmButtonColor: '#2563EB',
        });
      }
    }

    // Verificar que la sección no exista ya
    const sectionExists = secciones.some(
      (sec) => sec.nombre_Seccion.toLowerCase() === newSectionName.toLowerCase()
    );
    if (sectionExists) {
      return Swal.fire({
        icon: 'error',
        title: 'Sección existente',
        text: `La sección "${newSectionName}" ya existe.`,
        confirmButtonColor: '#2563EB',
      });
    }

    // Crear el objeto para el envío
    const payload = {
      nombre_Seccion: newSectionName,
      gradoId: Number(newSectionGradeId),
    };

    try {
      await SeccionesService.create(payload);
      Swal.fire({
        icon: 'success',
        title: 'Creado',
        text: `La sección "${newSectionName}" se creó correctamente.`,
        confirmButtonColor: '#2563EB',
      });
      fetchSecciones();
      closeModal();
    } catch (error) {
      console.error('Error al crear la sección:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error del sistema',
        text: 'Ocurrió un error al guardar la sección. Intente nuevamente.',
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
          {/* Botón de crear sección en verde */}
          <button
            onClick={openModal}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Crear Sección
          </button>
        </div>

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

        {sortedSecciones.length === 0 ? (
          <p className="text-center text-gray-600">No hay secciones disponibles.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentSecciones.map((seccion) => (
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

            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-800'
                    } text-sm transition`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

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
                  placeholder={exampleSectionName ? `Ej: "${exampleSectionName}"` : 'Ej: "7-1"'}
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
