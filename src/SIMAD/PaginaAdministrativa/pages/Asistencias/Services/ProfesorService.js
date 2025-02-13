

const API_URL = import.meta.env.VITE_API_URL;

//! /profesores
export const obtenerProfesores = async () => {
  const response = await fetch(`${API_URL}/profesores`);
  if (!response.ok) throw new Error('Error al obtener profesores');
  return await response.json();
};

