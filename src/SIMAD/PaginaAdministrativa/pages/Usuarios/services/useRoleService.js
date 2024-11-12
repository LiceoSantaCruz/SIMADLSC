const BASE_URL = 'https://simadlsc-backend-production.up.railway.app'; // Asegúrate de ajustar esta URL según tu API

// Función para obtener todos los roles
export const getAllRoles = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Si necesitas token para autenticar la petición
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error al obtener los roles: ${errorMessage}`);
    }

    return await response.json();  // Devuelve los roles en formato JSON
  } catch (error) {
    console.error('Error en getAllRoles:', error);
    throw error;  // Propaga el error para que pueda ser manejado por el componente que llama esta función
  }
};
