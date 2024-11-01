// src/Service/EventosService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Asegúrate de que esta sea la URL correcta de tu API

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`, // Asegúrate de almacenar el token JWT al iniciar sesión
  },
});

const EventosService = {
  // Obtener todos los eventos
  getAllEventos: async () => {
    try {
      const response = await axiosInstance.get('/eventos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos los eventos:', error);
      throw error;
    }
  },

  // Obtener eventos del usuario
  getUserEventos: async () => { // Asegúrate de que este endpoint exista y sea correcto
    try {
      const response = await axiosInstance.get('/eventos/user'); // Cambiar a la ruta correcta si es diferente
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos del usuario:', error);
      throw error;
    }
    
  },
  getDirigidosA: async () => {
    try {
      const response = await axiosInstance.get('/dirigido-a');
      return response.data; // Asumiendo que la respuesta es un array de dirigidos a
    } catch (error) {
      console.error('Error al obtener "Dirigido a":', error);
      throw error;
    }
  },

  // Obtener eventos filtrados
  getFilteredEventos: async (filtros = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Añadir parámetros de filtrado si existen
      if (filtros.fechaDesde) queryParams.append('fechaDesde', filtros.fechaDesde);
      if (filtros.fechaHasta) queryParams.append('fechaHasta', filtros.fechaHasta);
      if (filtros.horaDesde) queryParams.append('horaDesde', filtros.horaDesde);
      if (filtros.horaHasta) queryParams.append('horaHasta', filtros.horaHasta);
      if (filtros.estado) queryParams.append('estado', filtros.estado);

      const response = await axiosInstance.get(`/eventos/lista?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos filtrados:', error);
      throw error;
    }
  },

  // Obtener un evento por ID
  getEventoById: (id) => {
    return axiosInstance.get(`/eventos/${id}`);
  },

  // Crear un nuevo evento
  createEvento: async (eventoData) => {
    try {
      const response = await axiosInstance.post('/eventos', eventoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw error;
    }
  },

  // Actualizar un evento existente
  updateEvento: (id, evento) => {
    return axiosInstance.put(`/eventos/${id}`, evento);
  },

  // Aprobar un evento
  approveEvento: (id) => {
    return axiosInstance.patch(`/eventos/${id}/approve`);
  },

  // Rechazar un evento
  rejectEvento: (id) => {
    return axiosInstance.patch(`/eventos/${id}/reject`);
  },

  // Eliminar un evento
  deleteEvento: (id) => {
    return axiosInstance.delete(`/eventos/${id}`);
  },

  // Obtener todas las ubicaciones
  getUbicaciones: async () => {
    try {
      const response = await axiosInstance.get('/ubicaciones');
      return response.data; // Asumiendo que la respuesta es un array de ubicaciones
    } catch (error) {
      console.error('Error al obtener ubicaciones:', error);
      throw error;
    }
  },

  // Obtener todos los tipos de eventos
  getTiposEventos: async () => {
    try {
      const response = await axiosInstance.get('/tipos-eventos');
      return response.data; // Asumiendo que la respuesta es un array de tipos de eventos
    } catch (error) {
      console.error('Error al obtener tipos de eventos:', error);
      throw error;
    }
  },

  // Obtener estados de eventos
  getEstadosEventos: async () => {
    try {
      const response = await axiosInstance.get('/estado-eventos'); // Asegúrate de que esta ruta exista en tu backend
      return response.data; // Asumiendo que la respuesta es un array de estados de eventos
    } catch (error) {
      console.error('Error al obtener estados de eventos:', error);
      throw error;
    }
  },
};

export default EventosService;
