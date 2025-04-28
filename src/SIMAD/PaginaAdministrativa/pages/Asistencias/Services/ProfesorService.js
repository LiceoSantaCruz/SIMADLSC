// src/Services/ProfesorService.js

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtiene la lista completa de profesores desde el endpoint /profesores
 * @returns {Promise<Array<{ id_Profesor: number, nombre_Profesor: string, apellido1_Profesor: string, ... }>>}
 * @throws Error si la respuesta HTTP no es OK
 */
export const obtenerProfesores = async () => {
  const response = await fetch(`${API_URL}/profesores`);
  if (!response.ok) {
    throw new Error(`Error al obtener profesores: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

/**
 * Obtiene la lista de profesores y el ID del profesor que ha iniciado sesión.
 * @returns {Promise<{
 *   profesores: Array<{ id_Profesor: number, nombre_Profesor: string, apellido1_Profesor: string, ... }>,
 *   selectedProfesorId: string
 * }>}
 */
export const obtenerProfesoresConSeleccion = async () => {
  // Primero, trae todos los profesores
  const profesores = await obtenerProfesores();

  // Luego, lee del localStorage el ID del profesor que inició sesión
  const selectedProfesorId = localStorage.getItem("id_Profesor") || "";

  return {
    profesores,
    selectedProfesorId
  };
};
