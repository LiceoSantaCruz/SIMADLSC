// src/Service/matriculaService.js
const API_URL = import.meta.env.VITE_API_URL;

export const createMatricula = async (formData) => {
  // NO pongas headers: fetch se encargará de definir multipart/form-data con su boundary
  const response = await fetch(`${API_URL}/matriculas`, {
    method: 'POST',
    body: formData,  
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear matrícula: ${response.status} ${errorText}`);
  }
  return await response.json();
};
