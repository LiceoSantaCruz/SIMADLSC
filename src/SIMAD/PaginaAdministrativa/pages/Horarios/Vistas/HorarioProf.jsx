import { useState, useEffect } from 'react';

export const HorarioProf = () => {
  const [nombreProfesor, setNombreProfesor] = useState(''); // Estado para el nombre del profesor
  const [horarios, setHorarios] = useState([]);             // Estado para los horarios del profesor
  const [horasLecciones, setHorasLecciones] = useState([]);  // Estado para las horas de las lecciones
  const [diasSemana, setDiasSemana] = useState([]);          // Estado para los días de la semana
  const [profesorId, setProfesorId] = useState(null);        // Estado para el ID del profesor (dinámico)
  const [error, setError] = useState(null);                  // Estado para manejar errores

  useEffect(() => {
    // Aquí realizamos la petición al backend para obtener el ID del profesor y sus horarios
    const obtenerDatos = async () => {
      try {
        // const respuesta = await fetch(`/api/profesor/datos`);
        // const data = await respuesta.json();

        // if (respuesta.ok) {
        //   setNombreProfesor(data.nombreProfesor);
        //   setProfesorId(data.profesorId);         // Asumiendo que el backend envía el ID del profesor
        //   setHorarios(data.horarios);             // Lista de los horarios del profesor
        //   setHorasLecciones(data.horasLecciones); // Lista de las horas de las lecciones
        //   setDiasSemana(data.diasSemana);         // Lista de los días de la semana
        // } else {
        //   setError('Error al obtener los datos del profesor.');
        // }

      } catch (error) {
        setError('Error de conexión con el servidor.');
      }
    };

    obtenerDatos();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Función para obtener los detalles del horario en una celda específica (basado en día y hora)
  const obtenerHorarioPorDiaYHora = (dia, horaInicio) => {
    return horarios.find(horario => horario.dia === dia && horario.horaInicio === horaInicio);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Hola, {nombreProfesor || 'Profesor'}! Aquí está tu horario.
      </h1>

      {/* Tabla de Horarios */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Tus Horarios</h2>
        {horasLecciones.length > 0 && diasSemana.length > 0 ? (
          <table className="min-w-full table-auto bg-gray-50 shadow-sm rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2">Hora</th>
                {diasSemana.map((dia, index) => (
                  <th key={index} className="px-4 py-2">{dia}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horasLecciones.map((hora, index) => (
                <tr key={index} className="border-b">
                  {/* Columna de horas */}
                  <td className="px-4 py-2">{hora.inicio} - {hora.fin}</td>

                  {/* Columnas de días */}
                  {diasSemana.map((dia, diaIndex) => {
                    const horario = obtenerHorarioPorDiaYHora(dia, hora.inicio);
                    return (
                      <td key={diaIndex} className="px-4 py-2 text-center">
                        {horario ? (
                          <button
                            onClick={() => alert(`Sección: ${horario.seccion}\nAula: ${horario.aula}\nAsignatura: ${horario.asignatura}`)}
                            className="text-blue-500 underline"
                          >
                            📎 Ver Detalles
                          </button>
                        ) : (
                          '-'
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No hay datos disponibles para mostrar el horario.</div>
        )}
      </div>
    </div>
  );
};
export default HorarioProf;