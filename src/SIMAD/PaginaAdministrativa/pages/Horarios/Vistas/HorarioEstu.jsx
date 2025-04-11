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
        // Ordenar los horarios por hora de inicio
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

  // Ordenar las lecciones según la hora de inicio
  const lessons = Object.entries(lessonTimes)
    .sort(([, a], [, b]) => a.start.localeCompare(b.start))
    .map(([key]) => key);

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

 const subjectColors = {
    'Religión': 'bg-indigo-200',
    'Español': 'bg-yellow-200',
    'Estudios Sociales': 'bg-purple-200',
    'Matemática': 'bg-blue-200',
    'Inglés': 'bg-pink-200',
    'Ciencias': 'bg-green-200',
    'Química': 'bg-teal-200',
    'Biología': 'bg-lime-200',
    'Física': 'bg-orange-200',
    'Educación Física': 'bg-rose-200',
    'Educación para el Hogar': 'bg-cyan-200',
    'Psicología': 'bg-fuchsia-200',
    'Turismo': 'bg-violet-200',
    'Francés': 'bg-emerald-200',
    'Artes Plásticas': 'bg-red-200',
    'Música': 'bg-indigo-300',
    'Informática - Cómputo': 'bg-blue-300',
    'Emprendedurismo': 'bg-amber-300',
    'Sexualidad y Afectividad': 'bg-pink-300',
    'Filosofía': 'bg-gray-300',
    'Coordinación de Departamento': 'bg-yellow-300',
    'Comité de Evaluación': 'bg-purple-300',
    'Educación Cívica': 'bg-green-300',
    'Formación Tecnológica': 'bg-teal-300',
    'Guía': 'bg-lime-300',
    'Orientación': 'bg-orange-300',
    'Artes Industriales': 'bg-red-300',
};

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
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const title = `Horario de ${nombreEstudiante} ${apellidosEstudiante} - Sección ${seccion}`;
    doc.setFontSize(12);
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, margin);

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
      startY: margin + 20,
      theme: 'grid',
      headStyles: {
        fillColor: [100, 100, 100],
        textColor: 255,
        halign: 'center',
        fontSize: 8,
        cellPadding: 3,
      },
      bodyStyles: {
        halign: 'center',
        fontSize: 8,
        cellPadding: 3,
      },
      styles: { fontSize: 8, cellPadding: 3 },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: 'right' }
      );
    }

    doc.save(`Horario_${nombreEstudiante}_${apellidosEstudiante}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-gray-800 dark:text-white">
      {role !== 'admin' && role !== 'superadmin' && (
        <>
          <h1 className="text-xl font-bold mb-1 text-center">
            Horario {new Date().getFullYear()}
          </h1>
          <h2 className="text-sm font-medium mb-1 text-center">
            {nombreEstudiante} {apellidosEstudiante}
          </h2>
          <h3 className="text-sm font-medium mb-4 text-center">
            Sección: {seccion}
          </h3>
        </>
      )}

      {(role === 'admin' || role === 'superadmin') && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Seleccionar Sección
          </label>
          <select
            value={seccionSeleccionada}
            onChange={(e) => setSeccionSeleccionada(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-800 dark:text-white text-sm"
          >
            <option value="">Seleccione una sección</option>
            {secciones.map((sec) => (
              <option key={sec.id_Seccion} value={sec.id_Seccion}>
                {sec.nombre_Seccion}
              </option>
            ))}
          </select>
        </div>
      )}

      {horarios.length > 0 ? (
        <>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg mb-4 text-sm transition"
            onClick={exportarPdf}
          >
            Exportar Horario como PDF
          </button>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
            <h2 className="text-lg font-bold mb-4 text-center">Tu Horario</h2>
            <table className="min-w-full table-auto text-xs">
              <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 sticky top-0">
                <tr>
                  <th className="px-2 py-1 text-left">Día</th>
                  {lessons.map((lesson, i) => (
                    <th key={i} className="px-2 py-1 text-center">
                      <div>{lesson}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">
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
                  <tr key={i} className="border-b dark:border-gray-700">
                    <td className="px-2 py-1 font-semibold">{dia}</td>
                    {lessons.map((lesson) => {
                      const horario = obtenerHorario(dia, lesson);
                      const subjectColorClass =
                        horario &&
                        horario.materia &&
                        subjectColors[horario.materia.nombre_Materia]
                          ? subjectColors[horario.materia.nombre_Materia]
                          : 'bg-white dark:bg-gray-900';

                      return (
                        <td
                          key={lesson}
                          className={`px-2 py-1 text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition ${subjectColorClass}`}
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
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
          <p className="text-sm dark:text-gray-300">
            No se encontraron horarios para la sección seleccionada.
          </p>
        </div>
      )}
    </div>
  );
};

export default HorarioEstu;
