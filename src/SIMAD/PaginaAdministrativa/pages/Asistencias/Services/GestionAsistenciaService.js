import axios from "axios";

const API_URL = 'http://localhost:3000/asistencias';
export const obtenerGestionAsistencias = async (filtros) => {
  const { periodo, fecha, grado, materia, seccion } = filtros;

  const response = await axios.get(`${API_URL}/periodo/${periodo}`, {
    params: {
      fecha,
      grado,
      materia,
      seccion,
    },
  });
  
  return response.data;
  };

  export const obtenerTodasLasAsistencias = async () => {
    const response = await axios.get(`${API_URL}`); // Asegúrate de que esta sea la ruta correcta en tu backend
    return response.data;
  };

  export const actualizarAsistencia = async (id, data) => {
    const response = await axios.patch(`${API_URL}/${id}`, data);
    return response.data;
  };
  
  export const eliminarAsistencia = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  };