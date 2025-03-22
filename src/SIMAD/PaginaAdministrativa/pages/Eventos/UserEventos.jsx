import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UseFetchEventos from './Hook/UseFetchEventos';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';
import { FaInfoCircle, FaPlus } from 'react-icons/fa';

// Función para formatear la hora al formato HH:MM
const formatTime = (timeStr) => {
  if (!timeStr) return 'N/A';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const hours = parts[0].padStart(2, '0');
  const minutes = parts[1].padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Función para formatear la fecha a dd/mm/yyyy para mostrar
const formatDateToDMY = (fechaString) => {
  const date = new Date(fechaString + "T00:00:00");
  return date.toLocaleDateString('es-ES');
};

// Función para formatear la fecha a YYYY-MM-DD para filtrar
const formatDateToYMD = (fechaString) => {
  const date = new Date(fechaString + "T00:00:00");
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const UserEventos = () => {
  // Estado para manejar el filtro de estado
  const [filterStatus, setFilterStatus] = useState('Aprobado');

  // Hook para obtener eventos sin filtrar inicialmente
  const { data: eventos, loading, error } = UseFetchEventos();

  // Estado para almacenar eventos filtrados
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  // Estado para filtros adicionales (dirigido_a y fecha)
  const [filters, setFilters] = useState({
    dirigido_a: '',
    fecha: '',
  });

  // Filtrar eventos según estado, dirigido_a y fecha, y ordenarlos por el evento más próximo a ocurrir
  useEffect(() => {
    if (eventos) {
      const filtered = eventos.filter((evento) => {
        const matchesEstado =
          evento.estadoEvento?.nombre.trim().toLowerCase() === filterStatus.trim().toLowerCase();
        const matchesDirigidoA = filters.dirigido_a
          ? evento.dirigidoA?.nombre.trim().toLowerCase() === filters.dirigido_a.trim().toLowerCase()
          : true;
        const matchesFecha = filters.fecha
          ? formatDateToYMD(evento.fecha_Evento) === filters.fecha
          : true;
        return matchesEstado && matchesDirigidoA && matchesFecha;
      });

      // Ordenar de manera ascendente por fecha y hora de inicio (evento más próximo a ocurrir primero)
      const sorted = filtered.sort((a, b) => {
        const dateTimeA = new Date(`${a.fecha_Evento}T${a.hora_inicio_Evento}`);
        const dateTimeB = new Date(`${b.fecha_Evento}T${b.hora_inicio_Evento}`);
        return dateTimeA - dateTimeB;
      });

      setFilteredEvents(sorted);
      setCurrentPage(1);
    }
  }, [eventos, filterStatus, filters]);

  // Función para mostrar detalles del evento en un popup
  const handleViewInfo = (evento) => {
    Swal.fire({
      title: evento.nombre_Evento,
      html: `
        <p><strong>Descripción:</strong> ${evento.descripcion_Evento || 'N/A'}</p>
        <p><strong>Fecha:</strong> ${formatDateToDMY(evento.fecha_Evento)}</p>
        <p><strong>Hora de Inicio:</strong> ${formatTime(evento.hora_inicio_Evento)}</p>
        <p><strong>Hora de Fin:</strong> ${formatTime(evento.hora_fin_Evento)}</p>
        <p><strong>Dirigido a:</strong> ${evento.dirigidoA?.nombre || 'No especificado'}</p>
        <p><strong>Estado:</strong> ${evento.estadoEvento?.nombre || 'No especificado'}</p>
        <p><strong>Tipo de Evento:</strong> ${evento.tipoEvento?.nombre || 'No especificado'}</p>
        <p><strong>Ubicación:</strong> ${evento.ubicacion?.nombre || 'No especificado'}</p>
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

  if (loading)
    return (
      <div className="flex items-center justify-center p-6 bg-gray-100 min-h-screen">
        <p className="text-xl text-gray-700">Cargando tus solicitudes...</p>
      </div>
    );

  // Paginación: calcular la porción actual de eventos
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Función para obtener opciones únicas para "Dirigido a"
  const getUniqueDirigidoA = () => {
    const dirigidos = eventos.map((evento) => evento.dirigidoA?.nombre).filter(Boolean);
    return [...new Set(dirigidos)];
  };

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

      {/* Barra de filtros por estado */}
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

      {/* Filtros adicionales */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          name="dirigido_a"
          value={filters.dirigido_a}
          onChange={(e) => {
            const { name, value } = e.target;
            setFilters((prev) => ({ ...prev, [name]: value }));
          }}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los Públicos</option>
          {getUniqueDirigidoA().map((dirigido, index) => (
            <option key={index} value={dirigido}>
              {dirigido}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="fecha"
          value={filters.fecha}
          onChange={(e) => {
            const { name, value } = e.target;
            setFilters((prev) => ({ ...prev, [name]: value }));
          }}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla de Eventos */}
      {filteredEvents.length === 0 ? (
        <p className="text-gray-600">No tienes solicitudes de eventos que coincidan con los filtros.</p>
      ) : (
        <>
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
                {currentEvents.map((evento, index) => (
                  <tr
                    key={evento.id_Evento}
                    className={`hover:bg-gray-100 transition ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{evento.nombre_Evento}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(evento.fecha_Evento + "T00:00:00").toLocaleDateString('es-ES')}
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
                        onClick={() => handleViewInfo(evento)}
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

          {/* Controles de paginación */}
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

export default UserEventos;
