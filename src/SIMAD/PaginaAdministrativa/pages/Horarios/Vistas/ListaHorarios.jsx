import { useState, useEffect } from 'react';

export const ListaHorarios = () => {
  const [horarios, setHorarios] = useState([]);
  const [filtroProfesor, setFiltroProfesor] = useState(''); // Filtro por profesor
  const [filtroMateria, setFiltroMateria] = useState('');   // Filtro por materia
  const [filtroSeccion, setFiltroSeccion] = useState('');   // Filtro por sección
  const [filtroTipo, setFiltroTipo] = useState('');         // Filtro para ver horarios de profesores o sección-grado
  const [mostrarTabla, setMostrarTabla] = useState(false);  // Controla si se muestra la tabla

  // Simulación de carga inicial de horarios desde el backend
  useEffect(() => {
    // Aquí debes hacer el fetch para obtener los horarios desde tu backend
    // Ejemplo:
    // fetch('API_URL/horarios')
    //   .then((response) => response.json())
    //   .then((data) => setHorarios(data))
    //   .catch((error) => console.error('Error al obtener los horarios:', error));

    // Comentario eliminado para dejar la lógica del fetch
  }, []);

  // Función para manejar la acción de eliminar
  const eliminarHorario = (id) => {
    setHorarios(horarios.filter((horario) => horario.id !== id));
  };

  // Función para manejar la acción de editar
  const editarHorario = (id) => {
    alert(`Editar horario con ID: ${id}`);
  };

  // Función para ver más detalles del horario
  const verDetalles = (id) => {
    alert(`Ver detalles del horario con ID: ${id}`);
  };

  // Filtrar los horarios según el tipo (Profesor o Sección-Grado)
  const horariosFiltrados = horarios.filter((horario) => {
    if (filtroTipo === 'profesor') {
      return (
        horario.tipo === 'Profesor' &&
        (horario.profesor.toLowerCase().includes(filtroProfesor.toLowerCase()) ||
        horario.asignatura.toLowerCase().includes(filtroMateria.toLowerCase()))
      );
    } else if (filtroTipo === 'seccion-grado') {
      return (
        horario.tipo === 'Sección-Grado' &&
        (horario.seccion.toLowerCase().includes(filtroSeccion.toLowerCase()) ||
        horario.asignatura.toLowerCase().includes(filtroMateria.toLowerCase()))
      );
    }
    return true;
  });

  // Función para seleccionar el tipo de horario (Profesor o Sección-Grado) y mostrar la tabla
  const seleccionarTipoHorario = (tipo) => {
    setFiltroTipo(tipo);
    setMostrarTabla(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Lista de Horarios</h2>

      {/* Filtro para elegir entre horarios de profesores o sección-grado */}
      <div className="mb-4">
        <select
          className="border p-2 rounded-lg"
          value={filtroTipo}
          onChange={(e) => seleccionarTipoHorario(e.target.value)}
        >
          <option value="">Seleccione el tipo de horario</option>
          <option value="profesor">Ver todos los horarios de profesores</option>
          <option value="seccion-grado">Ver todos los horarios por sección
          </option>
        </select>
      </div>

      {/* Filtros adicionales para profesores o sección-grado */}
      {mostrarTabla && (
        <div className="mb-4">
          {filtroTipo === 'profesor' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Filtrar por profesor o materia"
                className="border p-2 rounded-lg"
                value={filtroProfesor}
                onChange={(e) => setFiltroProfesor(e.target.value)}
              />
            </div>
          )}
          {filtroTipo === 'seccion-grado' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Filtrar por sección o materia"
                className="border p-2 rounded-lg"
                value={filtroSeccion}
                onChange={(e) => setFiltroSeccion(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* Mostrar la tabla solo si se ha seleccionado un tipo de horario */}
      {mostrarTabla && (
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              {filtroTipo === 'profesor' ? (
                <>
                  <th className="px-4 py-2">Profesor</th>
                  <th className="px-4 py-2">Asignatura</th>
                </>
              ) : (
                <th className="px-4 py-2">Sección</th>
              )}
              <th className="px-4 py-2">Día</th>
              <th className="px-4 py-2">Hora Inicio</th>
              <th className="px-4 py-2">Hora Fin</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {horariosFiltrados.length > 0 ? (
              horariosFiltrados.map((horario) => (
                <tr key={horario.id}>
                  {filtroTipo === 'profesor' ? (
                    <>
                      <td className="px-4 py-2">{horario.profesor}</td>
                      <td className="px-4 py-2">{horario.asignatura}</td>
                    </>
                  ) : (
                    <td className="px-4 py-2">{horario.seccion}</td>
                  )}
                  <td className="px-4 py-2">{horario.dia}</td>
                  <td className="px-4 py-2">{horario.horaInicio}</td>
                  <td className="px-4 py-2">{horario.horaFin}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => verDetalles(horario.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                    >
                      Ver más
                    </button>
                    <button
                      onClick={() => editarHorario(horario.id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarHorario(horario.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No se encontraron horarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaHorarios;
