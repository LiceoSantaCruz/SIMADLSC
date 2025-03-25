// src/Service/GradoService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const GradoService = {
  // Obtener todos los grados
  getGrados: async () => {
    try {
      const response = await axiosInstance.get('/grados');
      return response.data;
    } catch (error) {
      console.error('Error al obtener grados:', error);
      throw error;
    }
  },

  // Crear un nuevo grado
  createGrado: async (gradoData) => {
    try {
      const response = await axiosInstance.post('/grados', gradoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear grado:', error);
      throw error;
    }
  },

  // Eliminar grado por id
  deleteGrado: async (id) => {
    try {
      await axiosInstance.delete(`/grados/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar grado:', error);
      throw error;
    }
  },
};

export default GradoService;
