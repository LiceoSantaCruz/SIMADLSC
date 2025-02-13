

const API_URL = import.meta.env.VITE_API_URL;

//! /secciones
export const obtenerSecciones = async () => {
  const response = await fetch(`${API_URL}/secciones`);
  if (!response.ok) throw new Error('Error al obtener secciones');
  return await response.json();
};

export const obtenerSeccionesPorGrado = async (idGrado) => {
  const response = await fetch(`${API_URL}/secciones/grado/${idGrado}`);
  if (!response.ok) throw new Error('Error al obtener secciones');
  return await response.json();
};