// src/Services/SeccionesService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const SeccionesService = {
  // Obtener todas las secciones
  getSecciones: async () => {
    try {
      const response = await axiosInstance.get('/secciones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener secciones:', error);
      throw error;
    }
  },

  // Eliminar una sección por ID
  deleteSeccion: async (id) => {
    try {
      const response = await axiosInstance.delete(`/secciones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la sección:', error);
      throw error;
    }
  },

  // Obtener estudiantes de una sección
  getEstudiantesPorSeccion: async (idSeccion) => {
    try {
      const response = await axiosInstance.get(`/estudiantes/seccion/${idSeccion}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estudiantes por sección:', error);
      throw error;
    }
  },

  // Crear una nueva sección
  create: async (seccionData) => {
    try {
      const response = await axiosInstance.post('/secciones', seccionData);
      return response.data;
    } catch (error) {
      console.error('Error al crear la sección:', error);
      throw error;
    }
  },
};

export default SeccionesService;
