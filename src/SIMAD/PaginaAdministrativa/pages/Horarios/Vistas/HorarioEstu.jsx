import { useState, useEffect } from 'react';
import axios from 'axios';
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

// Definición de los horarios de lecciones
const lessonTimes = {
  "1°": { start: "07:00", end: "07:40" },
  "2°": { start: "07:40", end: "08:20" },
  "3°": { start: "08:25", end: "09:05" },
  "4°": { start: "09:05", end: "09:45" },
  "5°": { start: "10:00", end: "10:40" },
  "6°": { start: "10:40", end: "11:20" },
  "7°": { start: "12:00", end: "12:40" },
  "8°": { start: "12:40", end: "13:20" },
  "9°": { start: "13:25", end: "14:05" },
  "10°": { start: "14:05", end: "14:45" },
  "11°": { start: "15:00", end: "15:40" },
  "12°": { start: "15:40", end: "16:20" },
};

export const HorarioEstu = () => {
  const [nombreEstudiante, setNombreEstudiante] = useState('');
  const [apellidosEstudiante, setApellidosEstudiante] = useState('');
  const [seccion, setSeccion] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  const role = localStorage.getItem('role');
  const estudianteId = localStorage.getItem('id_estudiante');

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      try {
        setCargando(true);
        if (role === 'admin' || role === 'superadmin') {
          const responseSecciones = await axios.get(`${API_BASE_URL}/secciones`);
          setSecciones(responseSecciones.data);
        }
        if (role === 'estudiante' && estudianteId) {
          const responseEstudiante = await axios.get(`${API_BASE_URL}/estudiantes/${estudianteId}`);
          const dataEstudiante = responseEstudiante.data;
          setNombreEstudiante(dataEstudiante.nombre_Estudiante);
          setApellidosEstudiante(
            `${dataEstudiante.apellido1_Estudiante} ${dataEstudiante.apellido2_Estudiante}`
          );
          setSeccion(dataEstudiante.seccion?.nombre_Seccion || 'Sin Sección');
          setSeccionSeleccionada(dataEstudiante.seccion.id_Seccion);
        }
        setCargando(false);
      } catch (error) {
        console.error('Error al obtener los datos iniciales:', error);
        setError('Error de conexión con el servidor.');
        setCargando(false);
      }
    };
    obtenerDatosIniciales();
  }, [role, estudianteId]);

  useEffect(() => {
    const obtenerHorarios = async () => {
      if (!seccionSeleccionada) return;
      try {
        setCargando(true);
        const responseHorarios = await axios.get(
          `${API_BASE_URL}/horarios/seccion/${seccionSeleccionada}`
        );
        // Ordenar por hora de inicio
        const horariosOrdenados = responseHorarios.data.sort((a, b) =>
          a.hora_inicio_Horario.localeCompare(b.hora_inicio_Horario)
        );
        setHorarios(horariosOrdenados);
        setCargando(false);
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
        setHorarios([]);
        setCargando(false);
      }
    };
    obtenerHorarios();
  }, [seccionSeleccionada]);

  // Función para convertir de formato 24h a 12h
  const convertirHora12 = (hora24) => {
    const [hora, minuto] = hora24.split(':');
    let horaNum = parseInt(hora, 10);
    const ampm = horaNum >= 12 ? 'PM' : 'AM';
    horaNum = horaNum % 12 || 12;
    return `${horaNum}:${minuto} ${ampm}`;
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  if (cargando) {
    return <div>Cargando datos...</div>;
  }

  // Ordenamos las lecciones y definimos los días
  const lessons = Object.keys(lessonTimes).sort((a, b) => parseInt(a) - parseInt(b));
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  // Función para obtener el horario según el día y la lección
  const obtenerHorario = (dia, lesson) => {
    const lessonStart = lessonTimes[lesson].start;
    return horarios.find(
      (h) =>
        h.dia_semana_Horario === dia &&
        h.hora_inicio_Horario.substring(0, 5) === lessonStart
    );
  };

  const mostrarDetalles = (horario) => {
    if (horario) {
      MySwal.fire({
        title: 'Detalles de la clase',
        html: `<b>Aula:</b> ${horario.aula?.nombre_Aula || 'N/A'}<br/><b>Profesor:</b> ${
          horario.profesor?.nombre_Profesor || 'N/A'
        } ${horario.profesor?.apellido1_Profesor || 'N/A'} ${horario.profesor?.apellido2_Profesor || 'N/A'}`,
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    }
  };

  const exportarPdf = () => {
    const doc = new jsPDF();
    doc.text(`Horario de ${nombreEstudiante} ${apellidosEstudiante} - Sección ${seccion}`, 10, 10);

    // La cabecera ahora es: la primera columna "Día" y luego cada lección con su rango horario
    const tableColumns = [
      'Día',
      ...lessons.map(
        (lesson) =>
          `${lesson}\n${convertirHora12(lessonTimes[lesson].start)} - ${convertirHora12(
            lessonTimes[lesson].end
          )}`
      ),
    ];
    const tableRows = dias.map((dia) => {
      const row = [dia];
      lessons.forEach((lesson) => {
        const horario = obtenerHorario(dia, lesson);
        row.push(horario ? horario.materia?.nombre_Materia || '-' : '-');
      });
      return row;
    });

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 20,
    });

    doc.save(`Horario_${nombreEstudiante}_${apellidosEstudiante}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {role !== 'admin' && role !== 'superadmin' && (
        <>
          <h1 className="text-3xl font-bold mb-4">Sección: {seccion}</h1>
          <h2 className="text-2xl font-bold mb-6">
            Hola, {nombreEstudiante} {apellidosEstudiante}! Bienvenido al horario.
          </h2>
        </>
      )}

      {role === 'admin' || role === 'superadmin' ? (
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Seleccionar Sección</label>
          <select
            value={seccionSeleccionada}
            onChange={(e) => setSeccionSeleccionada(e.target.value)}
            className="border p-2 rounded-lg w-full"
          >
            <option value="">Seleccione una sección</option>
            {secciones.map((sec) => (
              <option key={sec.id_Seccion} value={sec.id_Seccion}>
                {sec.nombre_Seccion}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {horarios.length > 0 ? (
        <>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600"
            onClick={exportarPdf}
          >
            Exportar Horario como PDF
          </button>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Tu Horario</h2>
            <table className="min-w-full table-auto bg-gray-50 shadow-sm rounded-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  {/* Primera celda: Días */}
                  <th className="px-4 py-2 text-left">Día</th>
                  {/* Ahora cada columna es una lección con su rango horario */}
                  {lessons.map((lesson, i) => (
                    <th key={i} className="px-4 py-2 text-center">
                      <div>{lesson}</div>
                      <div className="text-sm text-gray-500">
                        {`${convertirHora12(lessonTimes[lesson].start)} - ${convertirHora12(
                          lessonTimes[lesson].end
                        )}`}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dias.map((dia, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2 font-bold">{dia}</td>
                    {lessons.map((lesson) => {
                      const horario = obtenerHorario(dia, lesson);
                      return (
                        <td
                          key={lesson}
                          className="px-4 py-2 text-center cursor-pointer hover:bg-blue-100"
                          onClick={() => mostrarDetalles(horario)}
                        >
                          {horario ? horario.materia?.nombre_Materia || '-' : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg">No se encontraron horarios para la sección seleccionada.</p>
        </div>
      )}
    </div>
  );
};

export default HorarioEstu;