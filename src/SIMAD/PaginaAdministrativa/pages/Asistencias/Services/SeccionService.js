
const API_URL = 'https://simadlsc-backend-production.up.railway.app/secciones';

export const obtenerSecciones = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener secciones');
  return await response.json();
};

export const obtenerSeccionesPorGrado = async (idGrado) => {
  const response = await fetch(`${API_URL}/grado/${idGrado}`);
  if (!response.ok) throw new Error('Error al obtener secciones');
  return await response.json();
};