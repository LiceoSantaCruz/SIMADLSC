import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MySwal = withReactContent(Swal);

export const HorarioEstu = () => {
    const [nombreEstudiante, setNombreEstudiante] = useState('');
    const [seccion, setSeccion] = useState('');
    const [horarios, setHorarios] = useState([]); 
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                setCargando(true);
                const estudianteId = localStorage.getItem('id_estudiante'); // Asegúrate de tener el ID del estudiante
                const response = await axios.get(`http://localhost:3000/estudiantes/${estudianteId}/horario`);
    
                // Verifica que la respuesta tenga la estructura esperada
                if (!response.data || !response.data.horarios) {
                    throw new Error('Datos no válidos recibidos del servidor.');
                }
    
                const data = response.data;
    
                // Log de todos los datos recibidos
                console.log("Datos completos del servidor:", data);
    
                // Establecemos el nombre y sección del estudiante
                setNombreEstudiante(data.nombreEstudiante);
                setSeccion(data.seccion);
    
                // Establecemos los horarios
                setHorarios(data.horarios); // Asegúrate de que este sea un array de horarios
    
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
                html: `<b>Asignatura:</b> ${horario.materia?.nombre_Materia || 'N/A'}<br><b>Aula:</b> ${horario.aula?.nombre_Aula || 'N/A'}<br><b>Profesor:</b> ${horario.profesor?.nombre_Profesor || 'N/A'}`,
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
        doc.text(`Horario de ${nombreEstudiante} - Sección ${seccion}`, 10, 10);

        const tableColumn = ['Hora', ...dias];
        const tableRows = [];

        horasUnicas.forEach((hora) => {
            const fila = [hora];
            dias.forEach((dia) => {
                const horario = obtenerHorario(dia, hora);
                fila.push(horario ? `Asig: ${horario.materia?.nombre_Materia || 'N/A'}\nAula: ${horario.aula?.nombre_Aula || 'N/A'}` : '-');
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
            <h1 className="text-3xl font-bold mb-6">
                Hola, {nombreEstudiante || 'Estudiante'}! Bienvenido al horario de la sección {seccion || 'Sección'}.
            </h1>

            <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600"
                onClick={exportarPdf}
            >
                Exportar Horario como PDF
            </button>

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
                                                {horario ? 'Ver Detalles' : '-'}
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
