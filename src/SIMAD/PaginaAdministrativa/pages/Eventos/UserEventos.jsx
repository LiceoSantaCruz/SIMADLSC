// src/components/UserEventos.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UseFetchEventos from './Hook/UseFetchEventos';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';
import { FaInfoCircle, FaPlus } from 'react-icons/fa';

const UserEventos = () => {
  // Estado para manejar el filtro de estado
  const [filterStatus, setFilterStatus] = useState('Aprobado');

  // Hook para obtener eventos sin filtrar inicialmente
  const { data: eventos, loading, error } = UseFetchEventos();

  // Estado para almacenar eventos filtrados
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Función para formatear la hora al formato HH:MM
  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';

    // Divide la cadena por los dos puntos
    const parts = timeStr.split(':');

    // Verifica que al menos tenga horas y minutos
    if (parts.length < 2) return timeStr;

    const hours = parts[0].padStart(2, '0');
    const minutes = parts[1].padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  // useEffect para filtrar eventos según el estado seleccionado
  useEffect(() => {
    if (eventos) {
      const filtered = eventos.filter(
        (evento) => evento.estadoEvento?.nombre.toLowerCase() === filterStatus.toLowerCase()
      );
      setFilteredEvents(filtered);
    }
  }, [eventos, filterStatus]);

  // Función para manejar el clic en un evento y mostrar detalles
  const handleEventoClick = (evento) => {
    Swal.fire({
      title: evento.nombre_Evento,
      html: `
        <p><strong>Descripción:</strong> ${evento.descripcion_Evento || 'N/A'}</p>
        <p><strong>Fecha:</strong> ${new Date(evento.fecha_Evento).toLocaleDateString()}</p>
        <p><strong>Hora de Inicio:</strong> ${formatTime(evento.hora_inicio_Evento)}</p>
        <p><strong>Hora de Fin:</strong> ${formatTime(evento.hora_fin_Evento)}</p>
        <p><strong>Dirigido A:</strong> ${evento.dirigidoA?.nombre || 'No especificado'}</p>
        <p><strong>Estado:</strong> ${evento.estadoEvento?.nombre || 'No especificado'}</p>
        <p><strong>Tipo de Evento:</strong> ${evento.tipoEvento?.nombre || 'No especificado'}</p>
        <p><strong>Ubicación:</strong> ${evento.ubicacion?.nombre || 'No especificado'}</p>
      `,
      icon: 'info',
      confirmButtonColor: '#2563EB', // Tailwind azul-600
    });
  };

  // Manejo de errores
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error,
        confirmButtonColor: '#2563EB',
      });
    }
  }, [error]);

  // Manejo de la carga
  if (loading)
    return (
      <div className="flex items-center justify-center p-6 bg-gray-100 min-h-screen">
        <p className="text-xl text-gray-700">Cargando tus solicitudes...</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Encabezado con título y botón para crear evento */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Solicitudes de eventos</h1>
        <Link
          to="/crear-eventos"
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          title="Crear nuevo evento"
        >
          <FaPlus className="mr-2" />
          Crear Evento
        </Link>
      </div>

      {/* Barra de filtros */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setFilterStatus('Aprobado')}
          className={`px-4 py-2 rounded ${
            filterStatus === 'Aprobado'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-200'
          } transition`}
        >
          Aprobados
        </button>
        <button
          onClick={() => setFilterStatus('Pendiente')}
          className={`px-4 py-2 rounded ${
            filterStatus === 'Pendiente'
              ? 'bg-yellow-500 text-white'
              : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-200'
          } transition`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFilterStatus('Rechazado')}
          className={`px-4 py-2 rounded ${
            filterStatus === 'Rechazado'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-200'
          } transition`}
        >
          Rechazados
        </button>
      </div>

      {/* Tabla de eventos */}
      {filteredEvents.length === 0 ? (
        <p className="text-gray-600">No tienes solicitudes de eventos en este estado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Hora</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEvents.map((evento, index) => (
                <tr
                  key={evento.id_Evento}
                  className={`hover:bg-gray-100 transition ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{evento.nombre_Evento}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(evento.fecha_Evento).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatTime(evento.hora_inicio_Evento)} - {formatTime(evento.hora_fin_Evento)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        evento.estadoEvento.nombre === 'Aprobado'
                          ? 'bg-green-100 text-green-800'
                          : evento.estadoEvento.nombre === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {evento.estadoEvento.nombre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEventoClick(evento)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                      title="Ver Información"
                    >
                      <FaInfoCircle className="mr-1" />
                      Ver Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserEventos;
