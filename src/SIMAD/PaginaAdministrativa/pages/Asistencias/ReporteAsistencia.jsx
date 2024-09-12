import React, { useState } from 'react';

export const ReporteAsistencia = () => {
  const [role, setRole] = useState(''); // Guardar si es estudiante o profesor
  const [section, setSection] = useState(''); // Guardar la sección del estudiante
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: ''
  });

  // Datos de ejemplo
  const estudiantesData = [
    { id: 1, student: 'Juan Pérez', date: '2024-09-12', status: 'Presente', section: 'A' },
    { id: 2, student: 'Ana García', date: '2024-09-11', status: 'Ausente', section: 'B' }
  ];

  const profesoresData = [
    { id: 3, professor: 'Carlos Mendoza', date: '2024-09-12', status: 'Presente', subject: 'Matemáticas' },
    { id: 4, professor: 'Laura Sánchez', date: '2024-09-11', status: 'Ausente', subject: 'Historia' }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleRoleSelection = (role) => {
    setRole(role);
    setSection(''); // Reiniciamos la selección de sección si cambia el rol
  };

  const handleSectionChange = (e) => {
    setSection(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes aplicar la lógica para enviar los filtros
    console.log('Filtros aplicados:', filters);
    console.log('Role seleccionado:', role);
    if (role === 'estudiante') {
      console.log('Sección:', section);
    }
  };

  // Filtrar los datos según el rol y la sección
  let filteredData = [];
  if (role === 'estudiante') {
    filteredData = estudiantesData.filter((item) => {
      return section ? item.section === section : true;
    });
  } else if (role === 'profesor') {
    filteredData = profesoresData;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Reportes de Asistencia</h1>
        <p className="text-gray-600">Consulta y gestiona los reportes de asistencia según el rol y la sección.</p>
      </div>

      {/* Selección de rol */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-700">Selecciona el usuario</h2>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => handleRoleSelection('estudiante')}
            className={`px-4 py-2 rounded-md shadow ${role === 'estudiante' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            Estudiante
          </button>
          <button
            onClick={() => handleRoleSelection('profesor')}
            className={`px-4 py-2 rounded-md shadow ${role === 'profesor' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            Profesor
          </button>
        </div>
      </div>

      {/* Filtros adicionales para estudiantes */}
      {role === 'estudiante' && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-700">Selecciona la Sección</h2>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            value={section}
            onChange={handleSectionChange}
          >
            <option value="">Selecciona una Sección</option>
            <option value="A">Sección A</option>
            <option value="B">Sección B</option>
          </select>
        </div>
      )}

      {/* Filtros de búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fecha Fin</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado de Asistencia</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Todos</option>
              <option value="Presente">Presente</option>
              <option value="Ausente">Ausente</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de reportes */}
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {role === 'estudiante' ? (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sección</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profesor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materia</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.id}>
                {role === 'estudiante' ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">{item.student}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                    <td className={`px-6 py-4 whitespace-nowrap ${item.status === 'Presente' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.section}</td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">{item.professor}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                    <td className={`px-6 py-4 whitespace-nowrap ${item.status === 'Presente' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.subject}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReporteAsistencia;
