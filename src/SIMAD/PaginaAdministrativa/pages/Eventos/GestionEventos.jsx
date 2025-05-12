import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventosService from './Service/EventosService';
import UseFetchEventos from './Hook/UseFetchEventos';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';
import {
  FaInfoCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

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
      cancelButtonText: 'Cancelar'
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
      cancelButtonText: 'Cancelar'
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
      cancelButtonText: 'Cancelar'
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
      cancelButtonText: 'Cancelar'  // opcional en info modal, no muestra cancelButton by default
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
        cancelButtonText: 'Cancelar'
      }).then(() => {
        setData((prev) =>
          prev.map((e) =>
            e.id_Evento === id ? { ...e, estadoEvento: { nombre: 'Aprobado' } } : e
          )
        );
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al aprobar el evento',
        confirmButtonColor: '#2563EB',
        cancelButtonText: 'Cancelar'
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
        cancelButtonText: 'Cancelar'
      }).then(() => {
        setData((prev) =>
          prev.map((e) =>
            e.id_Evento === id ? { ...e, estadoEvento: { nombre: 'Rechazado' } } : e
          )
        );
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al rechazar el evento',
        confirmButtonColor: '#2563EB',
        cancelButtonText: 'Cancelar'
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
        cancelButtonText: 'Cancelar'
      }).then(() => {
        setData((prev) => prev.filter((e) => e.id_Evento !== id));
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al eliminar el evento',
        confirmButtonColor: '#2563EB',
        cancelButtonText: 'Cancelar'
      });
    }
  };

  // useEffect principal para filtrar y ordenar
  useEffect(() => {
    if (eventos) {
      const filtered = eventos.filter((evento) => {
        const matchesEstado =
          filterStatus === 'Todos'
            ? true
            : evento.estadoEvento?.nombre.trim().toLowerCase() ===
              filterStatus.trim().toLowerCase();
        const matchesDirigidoA = filters.dirigido_a
          ? evento.dirigidoA?.nombre.trim().toLowerCase() ===
            filters.dirigido_a.trim().toLowerCase()
          : true;
        const matchesFecha = filters.fecha
          ? formatDateToYMD(evento.fecha_Evento) === filters.fecha
          : true;
        return matchesEstado && matchesDirigidoA && matchesFecha;
      });

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
        cancelButtonText: 'Cancelar'
      });
    }
  }, [error, errorUbicaciones, errorTiposEventos, errorEstadosEventos]);

  // Paginación
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEventos = filteredEventos.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEventos.length / eventsPerPage);

  // Lógica para limitar la cantidad de botones a 6
  const maxButtons = 6;
  let startPage, endPage;
  if (totalPages <= maxButtons) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= Math.floor(maxButtons / 2)) {
      startPage = 1;
      endPage = maxButtons;
    } else if (currentPage + Math.floor(maxButtons / 2) - 1 >= totalPages) {
      startPage = totalPages - maxButtons + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(maxButtons / 2) + 1;
      endPage = startPage + maxButtons - 1;
    }
  }

  // Función para obtener opciones únicas para "Dirigido a"
  const getUniqueDirigidoA = () => {
    const dirigidos = eventos.map((evento) => evento.dirigidoA?.nombre).filter(Boolean);
    return [...new Set(dirigidos)];
  };

  if (
    loading ||
    loadingUbicaciones ||
    loadingTiposEventos ||
    loadingEstadosEventos
  ) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <p className="text-center">Cargando eventos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Gestión de Eventos
        </h1>
        <Link
          to="/crear-eventos"
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          title="Crear nuevo evento"
        >
          <FaPlus className="mr-2" />
          Crear Evento
        </Link>
      </div>

      {/* Filtros por estado */}
      <div className="mb-6 flex space-x-4">
        {['Todos', 'Pendiente', 'Aprobado', 'Rechazado'].map((estado) => {
          const color =
            estado === 'Pendiente'
              ? 'bg-yellow-500'
              : estado === 'Aprobado'
              ? 'bg-green-600'
              : estado === 'Rechazado'
              ? 'bg-red-600'
              : 'bg-blue-600';
          const isActive = filterStatus === estado;
          return (
            <button
              key={estado}
              onClick={() => setFilterStatus(estado)}
              className={`px-4 py-2 rounded transition ${
                isActive
                  ? `${color} text-white`
                  : 'bg-white dark:bg-gray-700 dark:text-white text-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {estado}
            </button>
          );
        })}
      </div>

      {/* Filtros adicionales */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          name="dirigido_a"
          value={filters.dirigido_a}
          onChange={handleFilterChange}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla y paginación */}
      {filteredEventos.length === 0 ? (
        <div className="text-center text-gray-700 dark:text-gray-300">
          No hay eventos que coincidan con los filtros.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-blue-500 text-white">
                <tr>
                  {['Nombre', 'Fecha', 'Hora', 'Dirigido a', 'Estado', 'Acciones'].map((th) => (
                    <th
                      key={th}
                      className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentEventos.map((evento, index) => (
                  <tr
                    key={evento.id_Evento}
                    className={`transition hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
                    }`}
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{evento.nombre_Evento}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {formatDateToDMY(evento.fecha_Evento)}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {formatTime(evento.hora_inicio_Evento)} - {formatTime(evento.hora_fin_Evento)}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {evento.dirigidoA?.nombre || 'Sin Público'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          evento.estadoEvento.nombre === 'Aprobado'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : evento.estadoEvento.nombre === 'Pendiente'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {evento.estadoEvento.nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewInfo(evento)}
                        className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Ver Información"
                      >
                        <FaInfoCircle className="mr-1" />
                        Ver Info
                      </button>
                      {evento.estadoEvento.nombre.trim().toLowerCase() === 'pendiente' ? (
                        <>
                          <button
                            onClick={() => handleApprove(evento.id_Evento)}
                            className="flex items-center text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            title="Aprobar Evento"
                          >
                            <FaEdit className="mr-1" />
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleReject(evento.id_Evento)}
                            className="flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Rechazar Evento"
                          >
                            <FaTrash className="mr-1" />
                            Rechazar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleDelete(evento.id_Evento)}
                          className="flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
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

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="mx-1 w-10 h-10 flex justify-center items-center rounded transition bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 disabled:opacity-50"
              >
                <FaChevronLeft />
              </button>
              {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
                const pageNumber = startPage + idx;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`mx-1 w-10 h-10 flex justify-center items-center rounded text-sm font-medium transition ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-700'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="mx-1 w-10 h-10 flex justify-center items-center rounded transition bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 disabled:opacity-50"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GestionEventos;
