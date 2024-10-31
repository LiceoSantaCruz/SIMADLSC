
const API_URL = 'http://localhost:3000/asistencias';

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