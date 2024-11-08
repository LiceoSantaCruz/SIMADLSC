
const API_URL = 'https://simadlsc-backend-production.up.railway.app/materias';

export const obtenerMaterias = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener materias');
  const data = await response.json();
  return data; 
};
