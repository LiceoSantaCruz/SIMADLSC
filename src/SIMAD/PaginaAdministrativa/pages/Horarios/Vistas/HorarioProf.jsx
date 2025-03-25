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

  // Días de la semana
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  // Función para convertir 24h a 12h
  const convertirHora12 = (hora24) => {
    const [hora, minuto] = hora24.split(':');
    let horaNum = parseInt(hora, 10);
    const ampm = horaNum >= 12 ? 'PM' : 'AM';
    horaNum = horaNum % 12 || 12;
    return `${horaNum}:${minuto} ${ampm}`;
  };

  // Obtener lista de profesores para admin/superadmin
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

  // Obtener datos y horarios del profesor seleccionado (o del profesor logueado)
  useEffect(() => {
    const obtenerDatosProfesorYHorario = async () => {
      try {
        let profesorId = idProfesorSeleccionado;
        if (role === 'profesor') profesorId = idProfesorLocal;
        if (!profesorId) return;

        // Datos del profesor
        const profesorResponse = await fetch(`${API_BASE_URL}/profesores/${profesorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!profesorResponse.ok)
          throw new Error('Error al obtener los datos del profesor.');
        const profesorData = await profesorResponse.json();
        setNombreProfesor(profesorData.nombre_Profesor);
        setApellidosProfesor(`${profesorData.apellido1_Profesor} ${profesorData.apellido2_Profesor}`);

        // Horarios del profesor
        const horariosResponse = await fetch(`${API_BASE_URL}/horarios/profesor/${profesorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!horariosResponse.ok)
          throw new Error('Error al obtener los horarios del profesor.');
        const horariosData = await horariosResponse.json();
        if (Array.isArray(horariosData)) {
          // Ordenamos por hora de inicio y, si son iguales, por hora de fin
          const horariosOrdenados = horariosData.sort((a, b) => {
            const startComparison = a.hora_inicio_Horario.localeCompare(b.hora_inicio_Horario);
            return startComparison !== 0 ? startComparison : a.hora_fin_Horario.localeCompare(b.hora_fin_Horario);
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

  // Ordenar las lecciones según la hora de inicio usando lessonTimes
  const lessons = Object.keys(lessonTimes).sort((a, b) =>
    lessonTimes[a].start.localeCompare(lessonTimes[b].start)
  );

  // Función para obtener el horario de un día y lección específica
  const obtenerHorarioPorDiaYLeccion = (dia, lessonKey) => {
    const lessonStart = lessonTimes[lessonKey].start;
    return horarios.find(
      (horario) =>
        horario.dia_semana_Horario === dia &&
        horario.hora_inicio_Horario.substring(0, 5) === lessonStart
    );
  };

  // Mostrar detalles con SweetAlert
  const mostrarDetalles = (horario) => {
    if (horario) {
      MySwal.fire({
        title: 'Detalles de la clase',
        html: `<b>Asignatura:</b> ${horario.materia?.nombre_Materia || 'N/A'}<br>
               <b>Aula:</b> ${horario.aula?.nombre_Aula || 'N/A'}<br>
               <b>Sección:</b> ${horario.seccion?.nombre_Seccion || 'N/A'}`,
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    }
  };

  // Función para exportar a PDF con mejoras (orientación landscape, fuente reducida)
  const exportarPdf = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const title = `Horario de ${nombreProfesor} ${apellidosProfesor}`;
    doc.setFontSize(12);
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, margin);

    const tableColumns = [
      'Día',
      ...lessons.map(
        (lesson) =>
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

    doc.save(`Horario_${nombreProfesor}_${apellidosProfesor}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-800 dark:text-white">
    {(role === 'admin' || role === 'superadmin') && (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold mb-4">Selecciona un Profesor</h1>
        <select
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded-lg w-full"
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
    )}
  
    <button
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed transition"
      onClick={exportarPdf}
      disabled={!idProfesorSeleccionado && role !== 'profesor'}
    >
      Exportar Horario como PDF
    </button>
  
    {horarios.length > 0 ? (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">
          {role === 'profesor'
            ? `Horario de ${nombreProfesor} ${apellidosProfesor}`
            : 'Horarios de todos los profesores'}
        </h2>
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 sticky top-0">
            <tr>
              <th className="px-2 py-2 text-left text-xs">Día</th>
              {lessons.map((lesson, i) => (
                <th key={i} className="px-2 py-2 text-center text-xs">
                  <div>{lesson}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {`${convertirHora12(lessonTimes[lesson].start)} - ${convertirHora12(
                      lessonTimes[lesson].end
                    )}`}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {diasSemana.map((dia, i) => (
              <tr key={i} className="border-b dark:border-gray-700">
                <td className="px-2 py-2 font-semibold">{dia}</td>
                {lessons.map((lesson) => {
                  const horario = obtenerHorarioPorDiaYLeccion(dia, lesson);
                  return (
                    <td
                      key={lesson}
                      className="px-2 py-2 text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                      onClick={() => mostrarDetalles(horario)}
                    >
                      {horario ? (
                        <button className="text-blue-600 dark:text-blue-400 underline">
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
      </div>
    ) : (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <p className="text-lg dark:text-gray-300">
          No hay horarios para mostrar.
        </p>
      </div>
    )}
  </div>
  
  );
};

export default HorarioProf;
