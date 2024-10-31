// services/matriculaService.js

const API_URL = 'http://localhost:3000/matriculas'; // Reemplaza con la URL de tu API backend

export const createMatricula = async (matriculaData) => {
  
    const response = await fetch( API_URL, {
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


