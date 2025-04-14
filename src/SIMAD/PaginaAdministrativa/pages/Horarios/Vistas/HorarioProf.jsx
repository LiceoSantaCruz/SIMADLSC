import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

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

  const lessons = Object.keys(lessonTimes).sort((a, b) =>
    lessonTimes[a].start.localeCompare(lessonTimes[b].start)
  );

  const obtenerHorarioPorDiaYLeccion = (dia, lessonKey) => {
    const lessonStart = lessonTimes[lessonKey].start;
    return horarios.find(
      (horario) =>
        horario.dia_semana_Horario === dia &&
        horario.hora_inicio_Horario.substring(0, 5) === lessonStart
    );
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

    const profesorSeleccionado = role === 'profesor'
      ? `${nombreProfesor} ${apellidosProfesor}`
      : profesores.find(p => String(p.id_Profesor) === String(idProfesorSeleccionado));

    const nombreCompleto = typeof profesorSeleccionado === 'string'
      ? profesorSeleccionado
      : profesorSeleccionado
        ? `${profesorSeleccionado.nombre_Profesor} ${profesorSeleccionado.apellido1_Profesor} ${profesorSeleccionado.apellido2_Profesor}`
        : 'Profesor Desconocido';

    const fecha = new Date().toLocaleDateString('es-CR');

    const title = `Horario de ${nombreCompleto}`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
    doc.text(title, titleX, margin);

    doc.setFontSize(10);
    doc.text(`Generado el: ${fecha}`, pageWidth - margin, margin, { align: 'right' });

    const tableColumns = ['Lección', ...diasSemana];

    const tableRows = lessons.map((lesson) => {
      const horaInicio = convertirHora12(lessonTimes[lesson].start);
      const horaFin = convertirHora12(lessonTimes[lesson].end);
      const leccionTitulo = `${lesson}\n${horaInicio} - ${horaFin}`;

      const row = [leccionTitulo];

      diasSemana.forEach((dia) => {
        const horario = obtenerHorarioPorDiaYLeccion(dia, lesson);

        if (horario) {
          const materia = horario.materia?.nombre_Materia || '-';
          const seccion = horario.seccion?.nombre_Seccion || '-';
          const aula = horario.aula?.nombre_Aula || '-';

          row.push(`${materia}\nSección: ${seccion}\nAula: ${aula}`);
        } else {
          row.push('-');
        }
      });

      return row;
    });

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: margin + 25,
      theme: 'grid',
      headStyles: {
        fillColor: [22, 78, 99],
        textColor: 255,
        fontSize: 9,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 8,
        halign: 'center',
        cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
      },
      styles: {
        fontSize: 8,
        overflow: 'linebreak',
      },
      columnStyles: {
        0: { cellWidth: 70 }, // primera columna (Lección)
      },
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

    const fechaArchivo = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
    const nombreArchivo = `Horario_${nombreCompleto.replace(/\s+/g, '_')}_${fechaArchivo}.pdf`;

    doc.save(nombreArchivo);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-800 dark:text-white">
      {(role === 'admin' || role === 'superadmin') && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Selecciona un Profesor</h1>
          <select
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded-lg w-full text-sm"
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

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {role === 'profesor'
            ? `Horario de ${nombreProfesor} ${apellidosProfesor}`
            : idProfesorSeleccionado
              ? `Horario de ${profesores.find(p => p.id_Profesor === Number(idProfesorSeleccionado))?.nombre_Profesor || ''}`
              : 'Selecciona un profesor para ver su horario'}
        </h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          onClick={exportarPdf}
          disabled={!idProfesorSeleccionado && role !== 'profesor'}
        >
          Exportar Horario como PDF
        </button>
      </div>

      {horarios.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md overflow-x-auto">
          <table className="table-auto w-full min-w-max text-xs text-center border-collapse">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
              <tr>
                <th className="px-3 py-2 sticky top-0 left-0 bg-gray-200 dark:bg-gray-700 z-20 text-left">
                  Lección
                </th>
                {diasSemana.map((dia, i) => (
                  <th
                    key={i}
                    className="px-3 py-2 sticky top-0 bg-gray-200 dark:bg-gray-700 z-10 whitespace-nowrap"
                  >
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson, i) => {
                const horaInicio = convertirHora12(lessonTimes[lesson].start);
                const horaFin = convertirHora12(lessonTimes[lesson].end);

                return (
                  <tr key={i} className="border-b dark:border-gray-700">
                    <td className="px-3 py-2 font-semibold bg-gray-100 dark:bg-gray-800 sticky left-0 z-10 text-left">
                      {lesson}
                      <div className="text-[10px] text-gray-600 dark:text-gray-300">
                        {horaInicio} - {horaFin}
                      </div>
                    </td>

                    {diasSemana.map((dia) => {
                      const horario = obtenerHorarioPorDiaYLeccion(dia, lesson);
                      return (
                        <td
                          key={`${dia}-${lesson}`}
                        >
                          {horario ? (
                            <>
                              <div className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                                {horario.materia?.nombre_Materia}
                              </div>
                              <div className="text-[11px] text-gray-600 dark:text-gray-300">
                                {horario.seccion?.nombre_Seccion} | Aula {horario.aula?.nombre_Aula}
                              </div>
                            </>
                          ) : (
                            '-'
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <p className="text-lg dark:text-gray-300">No hay horarios para mostrar.</p>
        </div>
      )}
    </div>
  );
};

export default HorarioProf;
