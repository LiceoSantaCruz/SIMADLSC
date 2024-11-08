
const API_URL = 'https://simadlsc-backend-production.up.railway.app/asistencias';

export const crearAsistencias = async (asistenciasData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(asistenciasData),
  });

  if (!response.ok) throw new Error('Error al crear asistencias');
  return await response.json();
};

export const obtenerAsistencias = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener asistencias');
  return await response.json();
};

export const justificarAusencia = async (asistenciaId, justificacion) => {
  const response = await fetch(`${API_URL}/${asistenciaId}/justificar`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ justificacion }),
  });
  if (!response.ok) {
      throw new Error('Error al justificar la ausencia');
  }
  return response.json();
};

export const fetchAsistencias = async ({ cedula, fecha, id_Materia }) => {
  let url = `${API_URL}/estudiante/${cedula}`;
  const params = new URLSearchParams();
  if (fecha) params.append('fecha', fecha);
  if (id_Materia) params.append('id_Materia', id_Materia);
  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error al obtener las asistencias');
  }
  return response.json();
};

export const obtenerReporteAsistencias = async (cedula, fechaInicio, fechaFin, idPeriodo) => {
  const params = new URLSearchParams();
  if (fechaInicio) params.append('fechaInicio', fechaInicio);
  if (fechaFin) params.append('fechaFin', fechaFin);
  if (idPeriodo) params.append('id_Periodo', idPeriodo);

  const url = `http://localhost:3000/asistencias/reporte/${cedula}?${params.toString()}`;

  
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data = await response.json();
    return data;
  
};