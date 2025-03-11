// src/Pages/ListaEstudiantes.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import UseFetchEstudiantesPorSeccion from '../../../Estudiantes/Hooks/UseFetchEstudiantesPorSeccion';

const ListaEstudiantes = () => {
  // Obtén el parámetro de la URL (asegúrate de definir la ruta en el Router, por ejemplo, "/lista-estudiantes/:seccionId")
  const { seccionId } = useParams();
  // Convertir el parámetro a número (siempre se recibe como string)
  const seccionIdNumber = Number(seccionId);

  const { estudiantes, loading, error } = UseFetchEstudiantesPorSeccion(seccionIdNumber);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Calcular índices para la paginación
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentEstudiantes = estudiantes.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(estudiantes.length / studentsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-100 min-h-screen">
        <p className="text-xl text-gray-700">Cargando estudiantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-6">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (estudiantes.length === 0) {
    return (
      <div className="text-center p-6">
        <p>No se encontraron estudiantes asignados a esta sección.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Lista de Estudiantes - Sección {seccionIdNumber}
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">Apellido</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">Cédula</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentEstudiantes.map((est, index) => (
              <tr
                key={est.id_Estudiante}
                className={`hover:bg-gray-100 transition ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {indexOfFirstStudent + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {est.nombre_Estudiante}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {est.apellido1_Estudiante}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {est.cedula}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link
                    to={`/detalle-estudiante/${est.id_Estudiante}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
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
                currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

ListaEstudiantes.propTypes = {
  // Ya no recibimos seccionId por props, lo obtenemos de la URL con useParams.
};

export default ListaEstudiantes;
