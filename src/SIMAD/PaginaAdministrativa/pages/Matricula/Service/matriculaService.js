// services/matriculaService.js
//https://simadlsc-backend-production.up.railway.app/matriculas
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
    const data = await response.json();
    console.log(data)
    return data;

   } 


