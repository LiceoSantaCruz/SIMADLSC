import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventosService from './Service/EventosService';
import UseFetchEventos from './Hook/UseFetchEventos';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';
import { FaInfoCircle, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// Función para formatear la hora al formato HH:MM
const formatTime = (timeStr) => {
  if (!timeStr) return 'N/A';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const hours = parts[0].padStart(2, '0');
  const minutes = parts[1].padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Función para formatear la fecha a dd/mm/yyyy para mostrar en la tabla
const formatDateToDMY = (fechaString) => {
  const date = new Date(fechaString + 'T00:00:00');
  return date.toLocaleDateString('es-ES');
};

// Función para formatear la fecha a YYYY-MM-DD para filtrar
const formatDateToYMD = (fechaString) => {
  const date = new Date(fechaString + 'T00:00:00');
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const GestionEventos = () => {
  const {
    data: eventos,
    setData,
    loading,
    error,
    loadingUbicaciones,
    errorUbicaciones,
    loadingTiposEventos,
    errorTiposEventos,
    loadingEstadosEventos,
    errorEstadosEventos,
  } = UseFetchEventos();

  // Por defecto, filtramos por "Pendiente"
  const [filterStatus, setFilterStatus] = useState('Pendiente');

  // Filtros adicionales: para "dirigido_a" y fecha
  const [filters, setFilters] = useState({
    dirigido_a: '',
    fecha: '',
  });

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  // Estado local para los eventos filtrados
  const [filteredEventos, setFilteredEventos] = useState([]);

  // Handlers de filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers para aprobar, rechazar, eliminar y ver info
  const handleApprove = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas aprobar este evento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Sí, aprobar',
    }).then((result) => {
      if (result.isConfirmed) {
        approveEvento(id);
      }
    });
  };

  const handleReject = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas rechazar este evento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#2563EB',
      confirmButtonText: 'Sí, rechazar',
    }).then((result) => {
      if (result.isConfirmed) {
        rejectEvento(id);
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar este evento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#2563EB',
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEvento(id);
      }
    });
  };

  const handleViewInfo = (evento) => {
    Swal.fire({
      title: evento.nombre_Evento,
      html: `
        <p><strong>Descripción:</strong> ${evento.descripcion_Evento || 'N/A'}</p>
        <p><strong>Fecha:</strong> ${formatDateToDMY(evento.fecha_Evento)}</p>
        <p><strong>Hora de Inicio:</strong> ${formatTime(evento.hora_inicio_Evento)}</p>
        <p><strong>Hora de Fin:</strong> ${formatTime(evento.hora_fin_Evento)}</p>
        <p><strong>Dirigido a:</strong> ${evento.dirigidoA?.nombre || 'Sin Público'}</p>
        <p><strong>Estado:</strong> ${evento.estadoEvento?.nombre || 'Sin Estado'}</p>
        <p><strong>Tipo de Evento:</strong> ${evento.tipoEvento?.nombre || 'Sin Tipo'}</p>
        <p><strong>Ubicación:</strong> ${evento.ubicacion?.nombre || 'Sin Ubicación'}</p>
      `,
      icon: 'info',
      confirmButtonColor: '#2563EB',
    });
  };

  // Llamadas a EventosService
  const approveEvento = async (id) => {
    try {
      await EventosService.approveEvento(id);
      Swal.fire({
        icon: 'success',
        title: 'Aprobado',
        text: 'El evento ha sido aprobado.',
        confirmButtonColor: '#2563EB',
      }).then(() => {
        setData((prevEventos) =>
          prevEventos.map((evento) =>
            evento.id_Evento === id
              ? { ...evento, estadoEvento: { nombre: 'Aprobado' } }
              : evento
          )
        );
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al aprobar el evento',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  const rejectEvento = async (id) => {
    try {
      await EventosService.rejectEvento(id);
      Swal.fire({
        icon: 'success',
        title: 'Rechazado',
        text: 'El evento ha sido rechazado.',
        confirmButtonColor: '#2563EB',
      }).then(() => {
        setData((prevEventos) =>
          prevEventos.map((evento) =>
            evento.id_Evento === id
              ? { ...evento, estadoEvento: { nombre: 'Rechazado' } }
              : evento
          )
        );
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al rechazar el evento',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  const deleteEvento = async (id) => {
    try {
      await EventosService.deleteEvento(id);
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El evento ha sido eliminado.',
        confirmButtonColor: '#2563EB',
      }).then(() => {
        setData((prevEventos) => prevEventos.filter((evento) => evento.id_Evento !== id));
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al eliminar el evento',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  // useEffect principal para filtrar y ordenar
  useEffect(() => {
    if (eventos) {
      // 1) Filtrar
      const filtered = eventos.filter((evento) => {
        // Estado
        const matchesEstado =
          filterStatus === 'Todos'
            ? true
            : evento.estadoEvento?.nombre.trim().toLowerCase() ===
              filterStatus.trim().toLowerCase();

        // Dirigido a
        const matchesDirigidoA = filters.dirigido_a
          ? evento.dirigidoA?.nombre.trim().toLowerCase() ===
            filters.dirigido_a.trim().toLowerCase()
          : true;

        // Fecha
        const matchesFecha = filters.fecha
          ? formatDateToYMD(evento.fecha_Evento) === filters.fecha
          : true;

        return matchesEstado && matchesDirigidoA && matchesFecha;
      });

      // 2) Ordenar de manera ascendente por fecha y hora de inicio
      const sorted = filtered.sort((a, b) => {
        const dateTimeA = new Date(`${a.fecha_Evento}T${a.hora_inicio_Evento}`);
        const dateTimeB = new Date(`${b.fecha_Evento}T${b.hora_inicio_Evento}`);
        return dateTimeA - dateTimeB;
      });

      setFilteredEventos(sorted);
      setCurrentPage(1);
    }
  }, [eventos, filterStatus, filters, setData]);

  // Manejo de errores global
  useEffect(() => {
    if (error || errorUbicaciones || errorTiposEventos || errorEstadosEventos) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error || errorUbicaciones || errorTiposEventos || errorEstadosEventos,
        confirmButtonColor: '#2563EB',
      });
    }
  }, [error, errorUbicaciones, errorTiposEventos, errorEstadosEventos]);

  // Paginación
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEventos = filteredEventos.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEventos.length / eventsPerPage);

  // Función para obtener opciones únicas para "Dirigido a"
  const getUniqueDirigidoA = () => {
    const dirigidos = eventos.map((evento) => evento.dirigidoA?.nombre).filter(Boolean);
    return [...new Set(dirigidos)];
  };

  // Mientras carga
  if (loading || loadingUbicaciones || loadingTiposEventos || loadingEstadosEventos) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <p className="text-center">Cargando eventos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Encabezado con título y botón para crear evento */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Eventos</h1>
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
          onClick={() => setFilterStatus('Todos')}
          className={`px-4 py-2 rounded ${
            filterStatus === 'Todos'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-200'
          } transition`}
        >
          Todos
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
          onClick={() => setFilterStatus('Aprobado')}
          className={`px-4 py-2 rounded ${
            filterStatus === 'Aprobado'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-200'
          } transition`}
        >
          Aprobados
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
          onChange={handleFilterChange}
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
          onChange={handleFilterChange}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla de Eventos */}
      {filteredEventos.length === 0 ? (
        <div className="text-center">No hay eventos que coincidan con los filtros.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Dirigido a
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentEventos.map((evento, index) => (
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
                      {/* Se muestra la fecha con formatDateToDMY */}
                      <div className="text-sm text-gray-900">
                        {formatDateToDMY(evento.fecha_Evento)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatTime(evento.hora_inicio_Evento)} - {formatTime(evento.hora_fin_Evento)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {evento.dirigidoA?.nombre || 'Sin Público'}
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
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                      <button
                        onClick={() => handleViewInfo(evento)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                        title="Ver Información"
                      >
                        <FaInfoCircle className="mr-1" />
                        Ver Info
                      </button>
                      {evento.estadoEvento.nombre.trim().toLowerCase() === 'pendiente' ? (
                        <>
                          <button
                            onClick={() => handleApprove(evento.id_Evento)}
                            className="flex items-center text-green-600 hover:text-green-800"
                            title="Aprobar Evento"
                          >
                            <FaEdit className="mr-1" />
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleReject(evento.id_Evento)}
                            className="flex items-center text-red-600 hover:text-red-800"
                            title="Rechazar Evento"
                          >
                            <FaTrash className="mr-1" />
                            Rechazar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleDelete(evento.id_Evento)}
                          className="flex items-center text-red-600 hover:text-red-800"
                          title="Eliminar Evento"
                        >
                          <FaTrash className="mr-1" />
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Controles de paginación en tonos azules */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-800'
                  } text-sm transition`}
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

export default GestionEventos;
