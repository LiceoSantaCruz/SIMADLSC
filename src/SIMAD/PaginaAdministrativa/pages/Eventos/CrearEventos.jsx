// src/CrearEventos.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';
import UseFetchEventos from './Hook/UseFetchEventos';
import EventosService from './Service/EventosService';

const CrearEventos = () => {
  const { 
    ubicaciones, 
    loadingUbicaciones, 
    errorUbicaciones,
    tiposEventos,
    loadingTiposEventos,
    errorTiposEventos,
    estadosEventos,
    loadingEstadosEventos,
    errorEstadosEventos,
    dirigidosA,
    loadingDirigidosA,
    errorDirigidosA,
  } = UseFetchEventos();

  // Función para obtener la fecha actual en formato YYYY-MM-DD (hora local)
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    nombre_Evento: '',
    descripcion_Evento: '',
    fecha_Evento: getTodayDate(),
    hora_inicio_Evento: '',
    hora_fin_Evento: '',
    id_dirigido_a: '',
    ubicacion: '',
    tipo_evento: '',   
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Función para verificar que la fecha sea al menos 3 días de anticipación.
   * Usamos split para crear la fecha local (sin la parte horaria) y compararla.
   */
  const isAtLeastThreeDaysAhead = (fecha) => {
    const [year, month, day] = fecha.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day); // Se crea la fecha a medianoche local
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Sumamos 3 días (en milisegundos)
    const tresDias = 3 * 24 * 60 * 60 * 1000;
    const minDate = new Date(today.getTime() + tresDias);
    return selectedDate >= minDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre_Evento.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'El nombre del evento no puede estar vacío.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    if (!formData.ubicacion || !formData.tipo_evento) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, selecciona una ubicación y un tipo de evento.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    if (!formData.fecha_Evento || !formData.hora_inicio_Evento || !formData.hora_fin_Evento) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, completa la fecha y las horas del evento.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    if (!isAtLeastThreeDaysAhead(formData.fecha_Evento)) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'El evento debe ser reservado con al menos 3 días de anticipación.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    // Crear objetos Date usando split para que se construyan en hora local
    const [year, month, day] = formData.fecha_Evento.split('-').map(Number);
    const [startHour, startMinute] = formData.hora_inicio_Evento.split(':').map(Number);
    const fechaInicio = new Date(year, month - 1, day, startHour, startMinute);
    const [endHour, endMinute] = formData.hora_fin_Evento.split(':').map(Number);
    const fechaFinObj = new Date(year, month - 1, day, endHour, endMinute);

    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFinObj.getTime())) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Fecha u hora inválida.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    const diffInMs = fechaFinObj - fechaInicio;
    if (diffInMs < 3600000) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'La duración del evento debe ser de al menos 1 hora.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    if (fechaFinObj <= fechaInicio) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La hora de fin debe ser posterior a la hora de inicio.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    if (loadingEstadosEventos) {
      Swal.fire({
        icon: 'info',
        title: 'Cargando...',
        text: 'Por favor, espera mientras se cargan los estados del evento.',
        showConfirmButton: false,
      });
      return;
    }
    if (errorEstadosEventos) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los estados del evento.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    if (loadingDirigidosA) {
      Swal.fire({
        icon: 'info',
        title: 'Cargando...',
        text: 'Por favor, espera mientras se cargan los públicos.',
        showConfirmButton: false,
      });
      return;
    }
    if (errorDirigidosA) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los públicos.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    if (!formData.id_dirigido_a) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, selecciona a quién está dirigido el evento.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    const estadoPendiente = estadosEventos.find(
      (estado) => estado.nombre.toLowerCase() === 'pendiente'
    );
    if (!estadoPendiente) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el estado "pendiente".',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        nombre_Evento: formData.nombre_Evento.trim(),
        descripcion_Evento: formData.descripcion_Evento.trim(),
        fecha_Evento: formData.fecha_Evento,
        hora_inicio_Evento: formData.hora_inicio_Evento,
        hora_fin_Evento: formData.hora_fin_Evento,
        id_dirigido_a: parseInt(formData.id_dirigido_a, 10),
        id_ubicacion: parseInt(formData.ubicacion, 10),
        id_tipo_evento: parseInt(formData.tipo_evento, 10),
        id_estado_evento: estadoPendiente.id,
      };

      await EventosService.createEvento(payload);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Evento creado exitosamente.',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          content: 'swal2-content',
          confirmButton: 'swal2-confirm',
        },
        buttonsStyling: false,
      }).then(() => {
        navigate('/user-eventos');
      });
    } catch (err) {
      console.error('Error al crear evento:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al crear evento',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          content: 'swal2-content',
          confirmButton: 'swal2-confirm',
        },
        buttonsStyling: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Nuevo Evento</h2>

        {/* Campo de Nombre del Evento */}
        <div className="mb-4">
          <label htmlFor="nombre_Evento" className="block text-sm font-medium mb-2">
            Nombre del Evento
          </label>
          <input
            type="text"
            id="nombre_Evento"
            name="nombre_Evento"
            placeholder="Ej: Feria de Ciencias"
            value={formData.nombre_Evento}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Campo de Descripción */}
        <div className="mb-4">
          <label htmlFor="descripcion_Evento" className="block text-sm font-medium mb-2">
            Descripción del Evento
          </label>
          <textarea
            id="descripcion_Evento"
            name="descripcion_Evento"
            placeholder="Ej: Un evento para mostrar proyectos de investigación y actividades culturales de nuestros estudiantes"
            value={formData.descripcion_Evento}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Campo de Fecha del Evento */}
        <div className="mb-4">
          <label htmlFor="fecha_Evento" className="block text-sm font-medium mb-2">
            Fecha del Evento
          </label>
          <input
            type="date"
            id="fecha_Evento"
            name="fecha_Evento"
            value={formData.fecha_Evento}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            min={getTodayDate()}
          />
        </div>

        {/* Campos de Hora de Inicio y Fin */}
        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
            <label htmlFor="hora_inicio_Evento" className="block text-sm font-medium mb-2">
              Hora de Inicio
            </label>
            <input
              type="time"
              id="hora_inicio_Evento"
              name="hora_inicio_Evento"
              value={formData.hora_inicio_Evento}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="hora_fin_Evento" className="block text-sm font-medium mb-2">
              Hora de Fin
            </label>
            <input
              type="time"
              id="hora_fin_Evento"
              name="hora_fin_Evento"
              value={formData.hora_fin_Evento}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>

        {/* Campo de Dirigido a */}
        <div className="mb-6">
          <label htmlFor="id_dirigido_a" className="block text-sm font-medium mb-2">
            Dirigido a
          </label>
          {loadingDirigidosA ? (
            <p>Cargando públicos...</p>
          ) : errorDirigidosA ? (
            <p className="text-red-500">Error al cargar los públicos: {errorDirigidosA}</p>
          ) : (
            <select
              id="id_dirigido_a"
              name="id_dirigido_a"
              value={formData.id_dirigido_a}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Selecciona un público</option>
              {dirigidosA.map((publico) => (
                <option key={publico.id} value={publico.id}>
                  {publico.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Campo de Ubicación */}
        <div className="mb-6">
          <label htmlFor="ubicacion" className="block text-sm font-medium mb-2">
            Ubicación
          </label>
          {loadingUbicaciones ? (
            <p>Cargando ubicaciones...</p>
          ) : errorUbicaciones ? (
            <p className="text-red-500">Error al cargar ubicaciones: {errorUbicaciones}</p>
          ) : (
            <select
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Selecciona una ubicación</option>
              {ubicaciones.map((ubicacion) => (
                <option key={ubicacion.id} value={ubicacion.id}>
                  {ubicacion.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Campo de Tipo de Evento */}
        <div className="mb-6">
          <label htmlFor="tipo_evento" className="block text-sm font-medium mb-2">
            Tipo de Evento
          </label>
          {loadingTiposEventos ? (
            <p>Cargando tipos de eventos...</p>
          ) : errorTiposEventos ? (
            <p className="text-red-500">Error al cargar tipos de eventos: {errorTiposEventos}</p>
          ) : (
            <select
              id="tipo_evento"
              name="tipo_evento"
              value={formData.tipo_evento}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Selecciona un tipo de evento</option>
              {tiposEventos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Creando...' : 'Crear Evento'}
        </button>
      </form>
    </div>
  );
};

export default CrearEventos;
