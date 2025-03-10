import { useEffect, useState } from 'react';
import UseFetchEventos from '../pages/Eventos/Hook/UseFetchEventos';
import { CalendarDays, Clock, Users } from "lucide-react";

export const EventList = () => {
  const { data: eventos, loading, error } = UseFetchEventos();
  const [approvedEvents, setApprovedEvents] = useState([]);

  useEffect(() => {
    if (eventos) {
      const filteredApprovedEvents = eventos.filter(
        (evento) => evento.estadoEvento?.nombre.toLowerCase() === 'aprobado'
      );
      setApprovedEvents(filteredApprovedEvents);
    }
  }, [eventos]);

  // Formato de hora HH:MM
  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    const hours = parts[0].padStart(2, '0');
    const minutes = parts[1].padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return <p className="text-center text-blue-600">Cargando eventos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error al cargar los eventos.</p>;
  }

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-pink-50 min-h-full">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📅 Próximos Eventos</h2>

      {approvedEvents.length === 0 ? (
        <p className="text-center text-gray-500">No hay eventos aprobados por ahora.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {approvedEvents.map((event) => (
            <div key={event.id_Evento} className="p-6 border border-gray-200 rounded-xl shadow-md bg-white flex flex-col">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{event.nombre_Evento}</h3>
              
              {/* Fecha del evento */}
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <CalendarDays className="w-5 h-5 text-blue-500 mr-2" />
                <span>{new Date(event.fecha_Evento).toLocaleDateString()}</span>
              </div>

              {/* Hora del evento */}
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                <span>
                  {formatTime(event.hora_inicio_Evento)} - {formatTime(event.hora_fin_Evento)}
                </span>
              </div>

              {/* Dirigido a */}
              <div className="flex items-center text-gray-600 text-sm">
                <Users className="w-5 h-5 text-blue-500 mr-2" />
                <span>Dirigido a: {event.dirigidoA?.nombre || 'Público no especificado'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
