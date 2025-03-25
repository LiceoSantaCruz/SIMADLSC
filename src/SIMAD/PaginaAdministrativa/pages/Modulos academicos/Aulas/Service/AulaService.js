import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const AulaService = {
  getAulas: async () => {
    try {
      const response = await axiosInstance.get('/aulas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener aulas:', error);
      throw error;
    }
  },

  createAula: async (aulaData) => {
    try {
      const response = await axiosInstance.post('/aulas', aulaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear aula:', error);
      throw error;
    }
  },

  deleteAula: async (id) => {
    try {
      await axiosInstance.delete(`/aulas/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar aula:', error);
      throw error;
    }
  },
};

export default AulaService;
