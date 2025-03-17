// Ajusta a tu URL real:
const API_URL = import.meta.env.VITE_API_URL;

export const createMatricula = async (matriculaData) => {
  const response = await fetch(`${API_URL}/matriculas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(matriculaData),
  });
  if (!response.ok) throw new Error('Error al crear matricula');
  return await response.json();
};
