
 
const API_URL = import.meta.env.VITE_API_URL;

//! /estudiantes
export const obtenerEstudiantes = async () => {
  const response = await fetch(`${API_URL}/estudiantes`);
  if (!response.ok) throw new Error('Error al obtener estudiantes');
  const data = response.json();
  return data;
};


export const getEstudiantesBySeccion = async (id_Seccion) => {
  try {
    const response = await fetch(`${API_URL}/estudiantes/seccion/${id_Seccion}`);
    if (!response.ok) throw new Error('Error al obtener los estudiantes');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
