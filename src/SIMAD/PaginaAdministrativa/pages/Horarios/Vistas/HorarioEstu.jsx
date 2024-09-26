import { useState, useEffect } from 'react';

export const HorarioEstu = () => {
  const [nombreEstudiante, setNombreEstudiante] = useState(''); // Estado para el nombre del estudiante
  const [seccion, setSeccion] = useState('');                   // Estado para la sección
  const [horarios, setHorarios] = useState([]);                 // Estado para los horarios
  const [error, setError] = useState(null);                     // Estado para manejar errores

  useEffect(() => {
    // Aquí realizamos la petición al backend para obtener los datos del estudiante, su sección y sus horarios
    const obtenerDatos = async () => {
      try {
        // const respuesta = await fetch('/api/estudiante-datos'); // URL del endpoint del backend
        // const data = await respuesta.json();

        // if (respuesta.ok) {
        //   setNombreEstudiante(data.nombreEstudiante);
        //   setSeccion(data.seccion);
        //   setHorarios(data.horarios); // Asumiendo que data.horarios es una lista de los horarios
        // } else {
        //   setError('Error al obtener los datos del estudiante.');
        // }

        // Comentarios para mostrar cómo se manejarán los datos del backend

      } catch (error) {
        console.error('Error al obtener los datos del estudiante:', error);
        setError('Error de conexión con el servidor.');
      }
    };

    obtenerDatos();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Mensaje con el nombre del estudiante y la sección */}
      <h1 className="text-3xl font-bold mb-6">
        Hola, {nombreEstudiante || 'Estudiante'}! Bienvenido al horario de {seccion || 'Sección'}.
      </h1>

      {/* Tabla de Horarios */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Tu Horario</h2>
        {horarios.length > 0 ? (
          <table className="min-w-full table-auto bg-gray-50 shadow-sm rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Día</th>
                <th className="px-4 py-2 text-left">Hora Inicio</th>
                <th className="px-4 py-2 text-left">Hora Fin</th>
                <th className="px-4 py-2 text-left">Asignatura</th>
                <th className="px-4 py-2 text-left">Aula</th>
                <th className="px-4 py-2 text-left">Detalles</th> {/* Nueva columna para ver detalles */}
              </tr>
            </thead>
            <tbody>
              {horarios.map((horario, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{horario.dia}</td>
                  <td className="px-4 py-2">{horario.horaInicio}</td>
                  <td className="px-4 py-2">{horario.horaFin}</td>
                  <td className="px-4 py-2">{horario.asignatura}</td>
                  <td className="px-4 py-2">{horario.aula}</td>
                  <td className="px-4 py-2 text-center">
                    {/* Botón o ícono para ver los detalles */}
                    <button
                      onClick={() => alert(`Asignatura: ${horario.asignatura}\nAula: ${horario.aula}\nProfesor: ${horario.profesor}`)}
                      className="text-blue-500 underline"
                    >
                      📎 Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No tienes horarios asignados.</div>
        )}
      </div>
    </div>
  );
};

export default HorarioEstu;
