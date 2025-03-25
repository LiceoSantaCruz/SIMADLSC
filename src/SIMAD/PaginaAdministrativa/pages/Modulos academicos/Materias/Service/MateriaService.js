import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const MateriaService = {
  // Obtener todas las materias
  getMaterias: async () => {
    try {
      const response = await axiosInstance.get('/materias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener materias:', error);
      throw error;
    }
  },

  // Crear una nueva materia
  createMateria: async (materiaData) => {
    try {
      const response = await axiosInstance.post('/materias', materiaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear materia:', error);
      throw error;
    }
  },

  // Eliminar materia por ID
  deleteMateria: async (id) => {
    try {
      await axiosInstance.delete(`/materias/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar materia:', error);
      throw error;
    }
  },
};

export default MateriaService;
