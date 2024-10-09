
const API_URL = 'http://localhost:3000/estudiante';

export const obtenerEstudiantes = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener estudiantes');
  const data = response.json();
  return data;
};


// export const obtenerEstudiantePorSeccion = async (id) => {
//   const response = await fetch(`${API_URL}/${id}`);
//   if (!response.ok) throw new Error('Error al obtener estudiante');
//   const data = response.json();
//   return data;
// };
