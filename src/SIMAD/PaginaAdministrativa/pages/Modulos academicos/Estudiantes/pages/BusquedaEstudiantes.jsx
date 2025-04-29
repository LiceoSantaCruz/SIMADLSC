// src/Pages/BusquedaEstudiantes.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UseFetchEstudiantes from '../Hooks/UseFetchEstudiantes';
import EstudiantesService from '../Service/EstudiantesService';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '@sweetalert2/theme-bulma/bulma.css';

const MySwal = withReactContent(Swal);

const BusquedaEstudiantes = () => {
  const { estudiantes, setEstudiantes, loading, error } = UseFetchEstudiantes();
  const [filters, setFilters] = useState({ nombre: '', apellido: '', cedula: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const role = localStorage.getItem('role');

  useEffect(() => {
    setCurrentPage(1);
    cargarEstudiantes();
  }, [filters]);

  const cargarEstudiantes = async () => {
    try {
      const data = await EstudiantesService.findByFilters(filters);
      // Ordenar únicamente por primer apellido
      data.sort((a, b) =>
        a.apellido1_Estudiante.localeCompare(b.apellido1_Estudiante, 'es', { sensitivity: 'base' })
      );
      setEstudiantes(data);
      setErrorMessage('');
    } catch {
      setErrorMessage('Error al cargar estudiantes.');
    }
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleFilterSubmit = async e => {
    e.preventDefault();
    setCurrentPage(1);
    await cargarEstudiantes();
    if (!estudiantes.length) setErrorMessage('No se encontraron estudiantes.');
  };

  const handleDeactivate = async id => {
    const { isConfirmed } = await MySwal.fire({
      title: '¿Inactivar este estudiante?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'button is-success',
        cancelButton: 'button is-danger'
      }
    });
    if (!isConfirmed) return;
    try {
      await EstudiantesService.deactivateEstudiante(id);
      await cargarEstudiantes();
      MySwal.fire({ icon: 'success', title: 'Estudiante inactivado', timer: 1200, showConfirmButton: false });
    } catch {
      MySwal.fire({ icon: 'error', title: 'Error al inactivar' });
    }
  };

  const handleChangeSection = async estudiante => {
    try {
      const allSections = await EstudiantesService.getSecciones();
      const opciones = allSections
        .filter(sec => sec.gradoId === estudiante.grado.id_grado)
        .reduce((opts, sec) => ({ ...opts, [sec.id_Seccion]: sec.nombre_Seccion }), {});
      const result = await MySwal.fire({
        title: 'Selecciona nueva sección',
        input: 'select',
        inputOptions: opciones,
        inputPlaceholder: 'Elige sección',
        showCancelButton: true,
        confirmButtonText: 'Cambiar',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'button is-info',
          cancelButton: 'button is-danger'
        }
      });
      if (!result.isConfirmed || !result.value) return;
      await EstudiantesService.updateSeccion(estudiante.id_Estudiante, parseInt(result.value, 10));
      await cargarEstudiantes();
      MySwal.fire({ icon: 'success', title: 'Sección actualizada', timer: 1500, showConfirmButton: false });
    } catch {
      MySwal.fire({ icon: 'error', title: 'No se pudo actualizar la sección' });
    }
  };

  // Paginación
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentList = estudiantes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(estudiantes.length / studentsPerPage);
  const maxButtons = 6;
  let start = 1, end = totalPages;
  if (totalPages > maxButtons) {
    const half = Math.floor(maxButtons / 2);
    if (currentPage <= half) end = maxButtons;
    else if (currentPage + half - 1 >= totalPages) start = totalPages - maxButtons + 1;
    else { start = currentPage - half; end = start + maxButtons - 1; }
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Búsqueda de Estudiantes</h1>

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleFilterSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          name="nombre"
          placeholder="Nombre"
          value={filters.nombre}
          onChange={handleFilterChange}
          className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="apellido"
          placeholder="Apellido"
          value={filters.apellido}
          onChange={handleFilterChange}
          className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="cedula"
          placeholder="Cédula"
          value={filters.cedula}
          onChange={handleFilterChange}
          className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
          Buscar
        </button>
      </form>

      {loading ? (
        <div className="text-center text-gray-700 dark:text-gray-200">Cargando estudiantes...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Apellido 1</th>
                  <th className="px-6 py-3 text-left">Apellido 2</th>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">Cédula</th>
                  <th className="px-6 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentList.map((est, idx) => {
                  const inactive = est.estado_Estudiante === 'Inactivo';
                  return (
                    <tr
                      key={est.id_Estudiante}
                      className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {est.apellido1_Estudiante}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {est.apellido2_Estudiante}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {est.nombre_Estudiante}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {est.cedula}
                      </td>
                      <td className="px-6 py-4 flex space-x-3">
                        <Link
                          to={`/detalle-estudiante/${est.id_Estudiante}`}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
                        >
                          Info
                        </Link>
                        {(role === 'admin' || role === 'superadmin') && (
                          <>
                            <button
                              onClick={() => handleDeactivate(est.id_Estudiante)}
                              disabled={inactive}
                              className={`px-2 py-1 rounded text-sm transition ${
                                inactive
                                  ? 'bg-red-600 text-white cursor-not-allowed'
                                  : 'bg-green-500 hover:bg-green-600 text-white'
                              }`}
                            >
                              Inactivar
                            </button>
                            <button
                              onClick={() => handleChangeSection(est)}
                              disabled={inactive}
                              className={`px-2 py-1 rounded text-sm transition ${
                                inactive
                                  ? 'bg-gray-400 text-white cursor-not-allowed'
                                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                              }`}
                            >
                              Cambiar Sección
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                &lt;
              </button>
              {Array.from({ length: end - start + 1 }).map((_, i) => {
                const num = start + i;
                return (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-3 py-1 rounded text-sm transition ${
                      currentPage === num
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-white'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BusquedaEstudiantes;
