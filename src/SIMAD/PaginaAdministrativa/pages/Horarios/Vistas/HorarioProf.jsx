import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MySwal = withReactContent(Swal);

export const HorarioProf = () => {
  const [nombreProfesor, setNombreProfesor] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [horasLecciones, setHorasLecciones] = useState([]);
  const [diasSemana, setDiasSemana] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerHorarioDesdeBackend = async () => {
      try {
        const idProfesor = localStorage.getItem('id_profesor');
        if (!idProfesor) {
          throw new Error('No se encontró el ID del profesor. Inicia sesión nuevamente.');
        }

        const response = await fetch(`http://localhost:3000/horarios/profesor/${idProfesor}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos del horario desde el servidor.');
        }

        const data = await response.json();

        // Asegúrate de que los datos sean válidos
        if (data) {
          setNombreProfesor(data.nombreProfesor || 'Profesor');
          setHorarios(data.horarios || []);
          setHorasLecciones(data.horasLecciones || []);
          setDiasSemana(data.diasSemana || []);
        } else {
          throw new Error('Datos no válidos recibidos del servidor.');
        }
      } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
        setError('Error de conexión con el servidor o credenciales inválidas.');
      }
    };

    obtenerHorarioDesdeBackend();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const obtenerHorarioPorDiaYHora = (dia, horaInicio) => {
    return horarios.find(horario => horario.dia === dia && horario.horaInicio === horaInicio);
  };

  const mostrarDetalles = (horario) => {
    if (horario) {
      MySwal.fire({
        title: `Detalles de la clase`,
        html: `<b>Asignatura:</b> ${horario.asignatura}<br><b>Aula:</b> ${horario.aula}<br><b>Sección:</b> ${horario.seccion}`,
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

  const exportarPdf = () => {
    const doc = new jsPDF();
    doc.text(`Horario de ${nombreProfesor}`, 10, 10);

    const tableColumn = ['Hora', ...diasSemana];
    const tableRows = [];

    horasLecciones.forEach((hora) => {
      const fila = [`${hora.inicio} - ${hora.fin}`];
      diasSemana.forEach((dia) => {
        const horario = obtenerHorarioPorDiaYHora(dia, hora.inicio);
        fila.push(horario ? `Asig: ${horario.asignatura}\nAula: ${horario.aula}` : '-');
      });
      tableRows.push(fila);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`Horario_${nombreProfesor}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Hola, {nombreProfesor}! Aquí está tu horario.
      </h1>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600"
        onClick={exportarPdf}
      >
        Exportar Horario como PDF
      </button>

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
                  <td className="px-4 py-2">{hora.inicio} - {hora.fin}</td>
                  {diasSemana.map((dia, diaIndex) => {
                    const horario = obtenerHorarioPorDiaYHora(dia, hora.inicio);
                    return (
                      <td key={diaIndex} className="px-4 py-2 text-center">
                        {horario ? (
                          <button
                            onClick={() => mostrarDetalles(horario)}
                            className="text-blue-500 underline"
                          >
                            {horario.seccion}
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
