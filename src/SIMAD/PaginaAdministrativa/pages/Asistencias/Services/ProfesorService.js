// src/services/profesor.service.js

const API_URL = 'https://simadlsc-backend-production.up.railway.app/profesores';

export const obtenerProfesores = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener profesores');
  return await response.json();
};
