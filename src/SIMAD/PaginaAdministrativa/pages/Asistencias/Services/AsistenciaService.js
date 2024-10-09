
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