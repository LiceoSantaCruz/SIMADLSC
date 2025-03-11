// src/components/EventosPublicos.jsx
import { useEffect, useState } from 'react';
import UseFetchEventos from '../../PaginaAdministrativa/pages/Eventos/Hook/UseFetchEventos';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

const EventosPublicos = () => {
  const { data: eventos, loading, error } = UseFetchEventos();
  const [publicEvents, setPublicEvents] = useState([]);
  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  useEffect(() => {
    if (eventos) {
      // Filtrar eventos públicos aprobados y dirigidos a "todo publico"
      const filteredPublicEvents = eventos.filter(
        (evento) =>
          evento.estadoEvento?.nombre.toLowerCase() === 'aprobado' &&
          evento.dirigidoA?.nombre.toLowerCase() === 'todo publico'
      );
      // Ordenar por fecha y hora de inicio (ascendente)
      const sortedPublicEvents = filteredPublicEvents.sort((a, b) => {
        const dateTimeA = new Date(`${a.fecha_Evento}T${a.hora_inicio_Evento}`);
        const dateTimeB = new Date(`${b.fecha_Evento}T${b.hora_inicio_Evento}`);
        return dateTimeA - dateTimeB;
      });
      setPublicEvents(sortedPublicEvents);
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

  // Función para mostrar detalles del evento en un popup (sin mostrar el estado)
  const handleEventoClick = (evento) => {
    Swal.fire({
      title: `<strong>${evento.nombre_Evento}</strong>`,
      html: `
        <div class="text-left">
          <p><strong>Descripción:</strong> ${evento.descripcion_Evento || 'N/A'}</p>
          <p><strong>Fecha:</strong> ${new Date(evento.fecha_Evento + "T00:00:00").toLocaleDateString('es-ES')}</p>
          <p><strong>Hora de Inicio:</strong> ${formatTime(evento.hora_inicio_Evento)}</p>
          <p><strong>Hora de Fin:</strong> ${formatTime(evento.hora_fin_Evento)}</p>
          <p><strong>Dirigido A:</strong> ${evento.dirigidoA?.nombre || 'No especificado'}</p>
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
      <div className="flex items-center justify-center p-4 sm:p-8 bg-gradient-to-r from-blue-50 to-gray-200 min-h-screen">
        <p className="text-lg sm:text-xl text-gray-700">Cargando eventos para todo público...</p>
      </div>
    );
  }

  // Paginación: Calculamos el subconjunto actual de eventos
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = publicEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(publicEvents.length / eventsPerPage);

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-r from-blue-50 to-gray-200">
      <div className="container mx-auto">
        {/* Título */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-900 mb-4 sm:mb-8">
          Eventos para todo público
        </h1>
        <p className="text-center text-xs sm:text-sm text-gray-600 mb-6 sm:mb-10">
          Haz click en cada evento para ver más información.
        </p>
        {publicEvents.length === 0 ? (
          <p className="text-center text-gray-600">No hay eventos públicos disponibles.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {currentEvents.map((evento) => (
                <div
                  key={evento.id_Evento}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 transition transform hover:scale-105 cursor-pointer"
                  onClick={() => handleEventoClick(evento)}
                  onTouchStart={() => handleEventoClick(evento)}
                >
                  <h2 className="text-xl sm:text-2xl font-semibold text-blue-700">
                    {evento.nombre_Evento}
                  </h2>
                  <p className="mt-2 text-gray-600 text-xs sm:text-sm">
                    Fecha: {new Date(evento.fecha_Evento + "T00:00:00").toLocaleDateString('es-ES')}
                  </p>
                  <p className="mt-1 text-gray-600 text-xs sm:text-sm">
                    Hora: {formatTime(evento.hora_inicio_Evento)} - {formatTime(evento.hora_fin_Evento)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {evento.tipoEvento?.nombre || 'No especificado'}
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {evento.ubicacion?.nombre || 'No especificado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Paginación en tonos azules */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 sm:mt-8">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`mx-1 px-2 sm:px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-800'
                    } text-xs sm:text-sm transition`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventosPublicos;
