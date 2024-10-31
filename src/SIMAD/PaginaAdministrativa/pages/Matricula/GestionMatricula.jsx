import { useState } from 'react';
import useGestionMatriculas from './Hooks/useGestionMatriculas';
import Swal from 'sweetalert2';

const GestionMatriculas = () => {
  const { matriculas, loading, error, handleApprove, handleReject } = useGestionMatriculas();
  const [selectedSeccion, setSelectedSeccion] = useState('');

  const handleAssignSeccion = (id_Matricula) => {
    Swal.fire({
      title: 'Asignar Sección',
      input: 'text',
      inputLabel: 'Ingrese el ID de la sección',
      showCancelButton: true,
      confirmButtonText: 'Asignar',
      preConfirm: (seccionId) => {
        setSelectedSeccion(seccionId);
        handleApprove(id_Matricula, seccionId);
      },
    });
  };

  if (loading) return <p className="text-center text-gray-500">Cargando matrículas...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Matrículas</h1>
      
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Cédula</th>
              <th className="px-6 py-4 text-left">Nombre del Estudiante</th>
              <th className="px-6 py-4 text-left">Apellidos</th>
              <th className="px-6 py-4 text-left">Grado</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {matriculas.map((matricula) => (
              <tr key={matricula.id_Matricula} className="border-b hover:bg-gray-100 transition">
                <td className="px-6 py-4">{matricula.id_Matricula}</td>
                <td className="px-6 py-4">{matricula.estudiante?.Cedula || 'Sin Cédula'}</td>
                <td className="px-6 py-4">{matricula.estudiante?.nombre_Estudiante || 'Sin Nombre'}</td>
                <td className="px-6 py-4">
                  {matricula.estudiante?.apellido1_Estudiante || ''}{' '}
                  {matricula.estudiante?.apellido2_Estudiante || ''}
                </td>
                <td className="px-6 py-4">{matricula.estudiante?.grado?.nombre || 'Sin Grado'}</td>
                <td className="px-6 py-4">{matricula.estado_Matricula}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleAssignSeccion(matricula.id_Matricula)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Aprobar y Asignar Sección
                  </button>
                  <button
                    onClick={() => handleReject(matricula.id_Matricula)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionMatriculas;
