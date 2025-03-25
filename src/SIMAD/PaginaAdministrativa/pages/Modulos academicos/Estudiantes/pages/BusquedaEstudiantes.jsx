// src/Pages/BusquedaEstudiantes.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import UseFetchEstudiantes from '../Hooks/UseFetchEstudiantes';
import EstudiantesService from '../Service/EstudiantesService';

const BusquedaEstudiantes = () => {
  const { estudiantes, setEstudiantes, loading, error } = UseFetchEstudiantes();
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Estado para filtros: nombre, apellido y cédula
  const [filters, setFilters] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
  });

  // Estado para mensaje de error en línea
  const [errorMessage, setErrorMessage] = useState('');

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentEstudiantes = estudiantes.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(estudiantes.length / studentsPerPage);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    try {
      const data = await EstudiantesService.findByFilters(filters);
      if (data.length === 0) {
        setErrorMessage("No se encontraron estudiantes con los criterios de búsqueda.");
      }
      setEstudiantes(data);
    } catch (error) {
      console.error("Error en filtros:", error);
      setErrorMessage("Ocurrió un error al buscar estudiantes.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
    <div className="flex flex-col gap-4 mb-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Búsqueda de Estudiantes</h1>
      {errorMessage && (
        <div className="p-4 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded">
          {errorMessage}
        </div>
      )}
    </div>
  
    <form onSubmit={handleFilterSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        type="text"
        name="nombre"
        placeholder="Filtrar por nombre"
        value={filters.nombre}
        onChange={handleFilterChange}
        className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        name="apellido"
        placeholder="Filtrar por apellidos"
        value={filters.apellido}
        onChange={handleFilterChange}
        className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        name="cedula"
        placeholder="Filtrar por cédula"
        value={filters.cedula}
        onChange={handleFilterChange}
        className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Buscar
      </button>
    </form>
  
    {loading ? (
      <div className="text-center text-gray-700 dark:text-gray-200">Cargando estudiantes...</div>
    ) : error ? (
      <div className="text-center text-red-500 dark:text-red-400">{error}</div>
    ) : estudiantes.length === 0 ? (
      <div className="text-center text-gray-700 dark:text-gray-300">No se encontraron estudiantes.</div>
    ) : (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Apellido 1</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Apellido 2</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Cédula</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentEstudiantes.map((est, index) => (
                <tr
                  key={est.id_Estudiante}
                  className={`hover:bg-gray-100 dark:hover:bg-gray-700 transition ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {indexOfFirstStudent + index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{est.nombre_Estudiante}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{est.apellido1_Estudiante}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{est.apellido2_Estudiante}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{est.cedula}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    <Link
                      to={`/detalle-estudiante/${est.id_Estudiante}`}
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      title="Ver Detalles"
                    >
                      <FaUser className="mr-1" />
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`mx-1 px-3 py-1 rounded text-sm transition ${
                  currentPage === idx + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-white'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </>
    )}
  </div>
  );
};

export default BusquedaEstudiantes;
