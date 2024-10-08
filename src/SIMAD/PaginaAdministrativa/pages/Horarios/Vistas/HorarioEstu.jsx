import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import for table formatting

const MySwal = withReactContent(Swal);

export const HorarioEstu = () => {
  const [nombreEstudiante, setNombreEstudiante] = useState(''); // Estado para el nombre del estudiante
  const [seccion, setSeccion] = useState(''); // Estado para la sección
  const [horarios, setHorarios] = useState([]); // Estado para los horarios
  const [error, setError] = useState(null); // Estado para manejar errores
  const [cargando, setCargando] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargando(true);

        // Realizar una petición al backend para obtener los datos del estudiante
        const response = await axios.get('http://localhost:3000/estudiantes/horario'); // Ajusta la URL según tu API

        const data = response.data;

        setNombreEstudiante(data.nombreEstudiante);
        setSeccion(data.seccion);
        setHorarios(data.horarios);

        setCargando(false);
      } catch (error) {
        console.error('Error al obtener los datos del estudiante:', error);
        setError('Error de conexión con el servidor.');
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (cargando) {
    return <div>Cargando datos...</div>;
  }

  // Agrupamos los horarios por hora
  const horasUnicas = [...new Set(horarios.map(horario => `${horario.horaInicio} - ${horario.horaFin}`))];
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  const obtenerHorario = (dia, hora) => {
    return horarios.find(h => h.dia === dia && `${h.horaInicio} - ${h.horaFin}` === hora);
  };

  const mostrarDetalles = (horario) => {
    if (horario) {
      MySwal.fire({
        title: `Detalles de la clase`,
        html: `<b>Asignatura:</b> ${horario.asignatura}<br><b>Aula:</b> ${horario.aula}<br><b>Profesor:</b> ${horario.profesor}`,
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    } else {
      MySwal.fire({
        title: 'Detalles de la clase',
        text: 'No hay clase en este horario',
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    }
  };

  // Función para exportar el horario como PDF
  const exportarPdf = () => {
    const doc = new jsPDF();

    doc.text(`Horario de ${nombreEstudiante} - Sección ${seccion}`, 10, 10);

    const tableColumn = ['Hora', ...dias];
    const tableRows = [];

    horasUnicas.forEach((hora) => {
      const fila = [hora];
      dias.forEach((dia) => {
        const horario = obtenerHorario(dia, hora);
        fila.push(horario ? `Asig: ${horario.asignatura}\nAula: ${horario.aula}` : '-');
      });
      tableRows.push(fila);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`Horario_${nombreEstudiante}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Mensaje con el nombre del estudiante y la sección */}
      <h1 className="text-3xl font-bold mb-6">
        Hola, {nombreEstudiante || 'Estudiante'}! Bienvenido al horario de la sección {seccion || 'Sección'}.
      </h1>

      {/* Botón para exportar a PDF */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600"
        onClick={exportarPdf}
      >
        Exportar Horario como PDF
      </button>

      {/* Tabla de Horarios */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Tu Horario</h2>
        {horarios.length > 0 ? (
          <table className="min-w-full table-auto bg-gray-50 shadow-sm rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Hora</th>
                {dias.map((dia, index) => (
                  <th key={index} className="px-4 py-2 text-left">{dia}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horasUnicas.map((hora, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{hora}</td>
                  {dias.map((dia) => {
                    const horario = obtenerHorario(dia, hora);
                    return (
                      <td
                        key={dia}
                        className="px-4 py-2 text-center cursor-pointer hover:bg-blue-100"
                        onClick={() => mostrarDetalles(horario)}
                      >
                        {horario ? seccion : '-'}
                      </td>
                    );
                  })}
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
