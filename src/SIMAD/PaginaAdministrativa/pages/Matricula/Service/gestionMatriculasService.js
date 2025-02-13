// services/gestionMatriculasService.js
//https://simadlsc-backend-production.up.railway.app/matriculas

const API_URL = import.meta.env.VITE_API_URL;

// Obtener todas las matrículas con estado pendiente
export const obtenerMatriculasPendientes = async () => {
  const response = await fetch(`${API_URL}?estado=pendiente`);
  if (!response.ok) throw new Error('Error al obtener las matrículas pendientes');
  const data = await response.json();
  return data;
};

// Aprobar una matrícula y asignar sección
export const aprobarMatricula = async (idMatricula, seccionId) => {
  const response = await fetch(`${API_URL}/${idMatricula}/aprobar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado_Matricula: 'Aprobada', seccionId }),
  });
  if (!response.ok) throw new Error('Error al aprobar la matrícula');
  return await response.json();
};

// Rechazar una matrícula
export const rechazarMatricula = async (idMatricula) => {
  const response = await fetch(`${API_URL}/${idMatricula}/rechazar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado_Matricula: 'Rechazada' }),
  });
  if (!response.ok) throw new Error('Error al rechazar la matrícula');
  return await response.json();
};
