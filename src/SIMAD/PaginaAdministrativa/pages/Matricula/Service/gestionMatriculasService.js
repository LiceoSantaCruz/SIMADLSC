// Ajusta a la URL real de tu backend NestJS:
const API_URL = import.meta.env.VITE_API_URL || 'https://tu-backend.com/api';

/**
 * Obtiene TODAS las matrículas (o solo pendientes, según tu endpoint).
 * Ajusta la ruta "/matricula" o "/matricula/pendientes" como necesites.
 */
export const getAllMatriculas = async () => {
 
    const response = await fetch(`${API_URL}/matriculas`);
    if (!response.ok) throw new Error('Error al obtener las matrículas');
    
    const data = await response.json();
    return data;

};
export const updateEstadoMatricula = async (idMatricula, nuevoEstado) => {
  // Convertir el estado a código esperado
  const estadoCodigo =
    nuevoEstado === 'Aceptado'
      ? 'AC'
      : nuevoEstado === 'Rechazado'
      ? 'RE'
      : nuevoEstado;

  const response = await fetch(`${API_URL}/matriculas/estado/${idMatricula}`, {
    method: 'PATCH',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nuevoEstado: estadoCodigo }),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el estado de la matrícula');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

/**
 * Elimina una matrícula.
 * @param {number} idMatricula - ID de la matrícula a eliminar.
 */
export const deleteMatricula = async (idMatricula) => {
  const response = await fetch(`${API_URL}/matriculas/${idMatricula}`, {  
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la matrícula');
  }

  // Verificar si la respuesta tiene contenido antes de intentar parsear JSON
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};
