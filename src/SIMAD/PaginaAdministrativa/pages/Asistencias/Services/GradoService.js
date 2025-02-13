

const API_URL = import.meta.env.VITE_API_URL;

//! /grados
export const obtenerGrados = async () => {
  const response = await fetch(`${API_URL}/grados`);
  if (!response.ok) throw new Error('Error al obtener grados');
  const data = await response.json();
  return data
};