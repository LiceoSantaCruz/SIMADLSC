import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const obtenerGestionAsistencias = async (filtros) => {
  const { periodo, fecha, grado, materia, seccion } = filtros;

  const response = await axios.get(`${API_URL}/asistencias/periodo/${periodo}`, {
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
    const response = await axios.get(`${API_URL}/asistencias`); 
    return response.data;
  };

  export const actualizarAsistencia = async (id, data) => {
    const response = await axios.patch(`${API_URL}/asistencias/${id}`, data);
    return response.data;
  };
  
  export const eliminarAsistencia = async (id) => {
    await axios.delete(`${API_URL}/asistencias/${id}`);
  };

  export const deleteAllAsistencias = async () => {
  await axios.delete(`${API_URL}/asistencias`);
};