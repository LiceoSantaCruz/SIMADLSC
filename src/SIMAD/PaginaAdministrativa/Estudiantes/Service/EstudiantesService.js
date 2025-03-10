// src/Service/EstudiantesService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const EstudiantesService = {
  // Obtener lista de estudiantes con búsqueda simple
  getEstudiantes: async (search = '') => {
    try {
      const response = await axiosInstance.get(`/estudiantes?search=${encodeURIComponent(search)}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
      throw error;
    }
  },

  // Filtrar estudiantes solo por nombre, apellido y cédula
  findByFilters: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.nombre && filters.nombre.trim()) {
        queryParams.append('nombre', filters.nombre.trim());
      }
      if (filters.cedula && filters.cedula.trim()) {
        queryParams.append('cedula', filters.cedula.trim());
      }
      if (filters.apellido && filters.apellido.trim()) {
        queryParams.append('apellido', filters.apellido.trim());
      }
      const response = await axiosInstance.get(`/estudiantes?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al filtrar estudiantes:', error);
      throw error;
    }
  },

  // Obtener detalle de un estudiante por ID
  getEstudianteById: async (id) => {
    try {
      const response = await axiosInstance.get(`/estudiantes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el estudiante:', error);
      throw error;
    }
  },

  // Crear un nuevo estudiante
  createEstudiante: async (estudianteData) => {
    try {
      const response = await axiosInstance.post('/estudiantes', estudianteData);
      return response.data;
    } catch (error) {
      console.error('Error al crear estudiante:', error);
      throw error;
    }
  },

  // Actualizar un estudiante existente
  updateEstudiante: async (id, estudianteData) => {
    try {
      const response = await axiosInstance.put(`/estudiantes/${id}`, estudianteData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estudiante:', error);
      throw error;
    }
  },

  // Eliminar un estudiante
  deleteEstudiante: async (id) => {
    try {
      await axiosInstance.delete(`/estudiantes/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      throw error;
    }
  },

  // Obtener secciones (para otros usos)
  getSecciones: async () => {
    try {
      const response = await axiosInstance.get('/secciones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener secciones:', error);
      throw error;
    }
  },

  // Obtener niveles (para otros usos)
  getNiveles: async () => {
    try {
      const response = await axiosInstance.get('/grados');
      return response.data;
    } catch (error) {
      console.error('Error al obtener niveles:', error);
      throw error;
    }
  },
};

export default EstudiantesService;
