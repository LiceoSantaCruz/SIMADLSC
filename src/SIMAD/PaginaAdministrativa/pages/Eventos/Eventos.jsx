// src/components/Eventos.jsx

import { useEffect, useState } from 'react';
import UseFetchEventos from './Hook/UseFetchEventos';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

const Eventos = () => {
  const { data: eventos, loading, error } = UseFetchEventos(); // Sin pasar parámetro
  const [approvedEvents, setApprovedEvents] = useState([]);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  useEffect(() => {
    if (eventos) {
      const filteredApprovedEvents = eventos.filter(
        (evento) =>
          evento.estadoEvento?.nombre.toLowerCase() === 'aprobado'
      );
      setApprovedEvents(filteredApprovedEvents);
      setCurrentPage(1);
    }
  }, [eventos]);

  // Función para formatear la hora al formato HH:MM
  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    const hours = parts[0].padStart(2, '0');
    const minutes = parts[1].padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Función para formatear una fecha a dd/mm/yyyy
  const formatDateToDMY = (fechaString) => {
    // Forzamos la interpretación de la fecha en UTC al añadir "T00:00:00"
    const date = new Date(fechaString + "T00:00:00");
    return date.toLocaleDateString('es-ES');
  };

  // Función para mostrar el detalle del evento en un popup
  const handleEventoClick = (evento) => {
    Swal.fire({
      title: `<strong>${evento.nombre_Evento}</strong>`,
      html: `
        <div class="text-left">
          <p><strong>Descripción:</strong> ${evento.descripcion_Evento || 'N/A'}</p>
          <p><strong>Fecha:</strong> ${formatDateToDMY(evento.fecha_Evento)}</p>
          <p><strong>Hora de Inicio:</strong> ${formatTime(evento.hora_inicio_Evento)}</p>
          <p><strong>Hora de Fin:</strong> ${formatTime(evento.hora_fin_Evento)}</p>
          <p><strong>Dirigido A:</strong> ${evento.dirigidoA?.nombre || 'No especificado'}</p>
          <p><strong>Estado:</strong> ${evento.estadoEvento?.nombre || 'No especificado'}</p>
          <p><strong>Tipo de Evento:</strong> ${evento.tipoEvento?.nombre || 'No especificado'}</p>
          <p><strong>Ubicación:</strong> ${evento.ubicacion?.nombre || 'No especificado'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#2563EB',
    });
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-100 min-h-screen">
        <p className="text-xl text-gray-700">Cargando eventos...</p>
      </div>
    );
  }

  // Paginación: calcular los índices y la porción actual
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = approvedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(approvedEvents.length / eventsPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Eventos Aprobados</h1>
      </div>
      {approvedEvents.length === 0 ? (
        <p className="text-gray-600">No hay eventos aprobados disponibles.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {currentEvents.map((evento) => (
              <li
                key={evento.id_Evento}
                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-blue-50 transition"
                onClick={() => handleEventoClick(evento)}
                onTouchStart={() => handleEventoClick(evento)}
              >
                <h2 className="text-xl font-semibold text-blue-600">
                  {evento.nombre_Evento}
                </h2>
                <p className="text-gray-600">
                  Fecha: {formatDateToDMY(evento.fecha_Evento)}
                </p>
                <p className="text-gray-600">
                  Hora: {formatTime(evento.hora_inicio_Evento)} - {formatTime(evento.hora_fin_Evento)}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {evento.tipoEvento?.nombre || 'No especificado'}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {evento.estadoEvento?.nombre || 'No especificado'}
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    {evento.ubicacion?.nombre || 'No especificado'}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* Controles de paginación en tonos azules */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`mx-1 px-3 py-1 rounded transition text-sm ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Eventos;
