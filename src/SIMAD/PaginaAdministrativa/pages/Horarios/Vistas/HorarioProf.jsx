import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MySwal = withReactContent(Swal);

// URL base de la API
const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://simadlsc-backend-production.up.railway.app'
    : 'http://localhost:3000';

const lessonTimes = {
  "1": { start: "07:00", end: "07:40" },
  "2": { start: "07:40", end: "08:20" },
  "Recreo 1 ": { start: "08:20", end: "08:30" },
  "3": { start: "08:30", end: "09:10" },
  "4": { start: "09:10", end: "09:50" },
  "Recreo 2 ": { start: "09:50", end: "10:00" },
  "5": { start: "10:00", end: "10:40" },
  "6": { start: "10:40", end: "11:20" },
  "Almuerzo": { start: "11:20", end: "12:00" },
  "7": { start: "12:00", end: "12:40" },
  "8": { start: "12:40", end: "13:20" },
  "Recreo 3 ": { start: "13:20", end: "13:25" },
  "9": { start: "13:25", end: "14:05" },
  "10": { start: "14:05", end: "14:45" },
  "Recreo 4": { start: "14:45", end: "14:55" },
  "11": { start: "14:55", end: "15:35" },
  "12": { start: "15:35", end: "16:15" },
};

export const HorarioProf = () => {
  const [profesores, setProfesores] = useState([]);
  const [idProfesorSeleccionado, setIdProfesorSeleccionado] = useState(null);
  const [nombreProfesor, setNombreProfesor] = useState('');
  const [apellidosProfesor, setApellidosProfesor] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [error, setError] = useState(null);

  const role = localStorage.getItem('role');
  const idProfesorLocal = localStorage.getItem('id_profesor');

  // Definimos los días de la semana
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  // Función para convertir de 24h a 12h
  const convertirHora12 = (hora24) => {
    const [hora, minuto] = hora24.split(':');
    let horaNum = parseInt(hora, 10);
    const ampm = horaNum >= 12 ? 'PM' : 'AM';
    horaNum = horaNum % 12 || 12;
    return `${horaNum}:${minuto} ${ampm}`;
  };

  useEffect(() => {
    const obtenerProfesores = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profesores`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok)
          throw new Error('Error al obtener la lista de profesores.');
        const profesoresData = await response.json();
        setProfesores(profesoresData);
      } catch (error) {
        console.error('Error al obtener los profesores:', error);
        setError('Error al cargar la lista de profesores.');
      }
    };

    if (role === 'admin' || role === 'superadmin') {
      obtenerProfesores();
    }
  }, [role]);

  useEffect(() => {
    const obtenerDatosProfesorYHorario = async () => {
      try {
        let profesorId = idProfesorSeleccionado;
        if (role === 'profesor') profesorId = idProfesorLocal;
        if (!profesorId) return;

        const profesorResponse = await fetch(
          `${API_BASE_URL}/profesores/${profesorId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (!profesorResponse.ok)
          throw new Error('Error al obtener los datos del profesor.');
        const profesorData = await profesorResponse.json();
        setNombreProfesor(profesorData.nombre_Profesor);
        setApellidosProfesor(
          `${profesorData.apellido1_Profesor} ${profesorData.apellido2_Profesor}`
        );

        const horariosResponse = await fetch(
          `${API_BASE_URL}/horarios/profesor/${profesorId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (!horariosResponse.ok)
          throw new Error('Error al obtener los horarios del profesor.');
        const horariosData = await horariosResponse.json();
        if (Array.isArray(horariosData)) {
          // Ordenar por hora de inicio y, en caso de igualdad, por hora de fin
          const horariosOrdenados = horariosData.sort((a, b) => {
            const startComparison = a.hora_inicio_Horario.localeCompare(b.hora_inicio_Horario);
            return startComparison !== 0
              ? startComparison
              : a.hora_fin_Horario.localeCompare(b.hora_fin_Horario);
          });
          setHorarios(horariosOrdenados);
        } else {
          setHorarios([]);
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError('Error de conexión con el servidor o credenciales inválidas.');
      }
    };

    obtenerDatosProfesorYHorario();
  }, [idProfesorSeleccionado, role, idProfesorLocal]);

  // Ordenar lecciones por la hora de inicio usando lessonTimes
  const lessons = Object.keys(lessonTimes).sort((a, b) =>
    lessonTimes[a].start.localeCompare(lessonTimes[b].start)
  );

  // Obtenemos el horario para un día y una lección específica comparando la hora de inicio
  const obtenerHorarioPorDiaYLeccion = (dia, lessonKey) => {
    const lessonStart = lessonTimes[lessonKey].start;
    return horarios.find(
      (horario) =>
        horario.dia_semana_Horario === dia &&
        horario.hora_inicio_Horario.substring(0, 5) === lessonStart
    );
  };

  const mostrarDetalles = (horario) => {
    if (horario) {
      MySwal.fire({
        title: `Detalles de la clase`,
        html: `<b>Asignatura:</b> ${horario.materia?.nombre_Materia || 'N/A'}<br>
               <b>Aula:</b> ${horario.aula?.nombre_Aula || 'N/A'}<br>
               <b>Sección:</b> ${horario.seccion?.nombre_Seccion || 'N/A'}`,
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    }
  };

  // Función para exportar a PDF (se ordena por inicio y fin)
  const exportarPdf = () => {
    const doc = new jsPDF();
    doc.text(`Horario de ${nombreProfesor} ${apellidosProfesor}`, 10, 10);

    // Encabezado: primera columna "Día" y luego cada columna es una lección con su rango
    const tableColumn = [
      'Día',
      ...lessons.map((lesson) =>
        `${lesson}\n${convertirHora12(lessonTimes[lesson].start)} - ${convertirHora12(lessonTimes[lesson].end)}`
      ),
    ];

    const tableRows = diasSemana.map((dia) => {
      const row = [dia];
      lessons.forEach((lesson) => {
        const horario = obtenerHorarioPorDiaYLeccion(dia, lesson);
        row.push(
          horario
            ? `Asig: ${horario.materia?.nombre_Materia || 'N/A'}\nAula: ${horario.aula?.nombre_Aula || 'N/A'}`
            : '-'
        );
      });
      return row;
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      // En este ejemplo se usa el tema por defecto, pero se puede ajustar
    });
    doc.save(`Horario_${nombreProfesor}_${apellidosProfesor}.pdf`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {role === 'admin' || role === 'superadmin' ? (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Selecciona un Profesor</h1>
          <select
            className="border p-2 rounded-lg w-full mb-4"
            onChange={(e) => setIdProfesorSeleccionado(e.target.value)}
            value={idProfesorSeleccionado || ''}
          >
            <option value="">Seleccione un profesor</option>
            {profesores.map((profesor) => (
              <option key={profesor.id_Profesor} value={profesor.id_Profesor}>
                {`${profesor.nombre_Profesor} ${profesor.apellido1_Profesor} ${profesor.apellido2_Profesor}`}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600"
        onClick={exportarPdf}
        disabled={!idProfesorSeleccionado && role !== 'profesor'}
      >
        Exportar Horario como PDF
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          {role === 'profesor'
            ? `Horario de ${nombreProfesor} ${apellidosProfesor}`
            : 'Horarios de todos los profesores'}
        </h2>
        {horarios.length > 0 ? (
          <table className="min-w-full table-auto bg-gray-50 shadow-sm rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Día</th>
                {Object.keys(lessonTimes)
                  .sort((a, b) => lessonTimes[a].start.localeCompare(lessonTimes[b].start))
                  .map((lesson, index) => (
                    <th key={index} className="px-4 py-2 text-center">
                      <div>{lesson}</div>
                      <div className="text-sm text-gray-500">
                        {`${convertirHora12(lessonTimes[lesson].start)} - ${convertirHora12(lessonTimes[lesson].end)}`}
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {diasSemana.map((dia, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 font-bold">{dia}</td>
                  {Object.keys(lessonTimes)
                    .sort((a, b) => lessonTimes[a].start.localeCompare(lessonTimes[b].start))
                    .map((lesson, idx) => {
                      const horario = obtenerHorarioPorDiaYLeccion(dia, lesson);
                      return (
                        <td key={idx} className="px-4 py-2 text-center">
                          {horario ? (
                            <button
                              onClick={() => mostrarDetalles(horario)}
                              className="text-blue-500 underline"
                            >
                              {horario.seccion?.nombre_Seccion || 'Ver detalles'}
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
          <div className="text-center p-4">No hay horarios para mostrar.</div>
        )}
      </div>
    </div>
  );
};

export default HorarioProf;
