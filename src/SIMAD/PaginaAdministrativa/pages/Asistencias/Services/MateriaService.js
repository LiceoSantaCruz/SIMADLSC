

const API_URL = import.meta.env.VITE_API_URL;


//! /materias
export const obtenerMaterias = async () => {
  const response = await fetch(`${API_URL}/materias`);
  if (!response.ok) throw new Error('Error al obtener materias');
  const data = await response.json();
  return data; 
};

