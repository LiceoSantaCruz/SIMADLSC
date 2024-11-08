const API_URL = 'https://simadlsc-backend-production.up.railway.app/periodos';

export const obtenerPeriodos = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener los periodos');
    const data = await response.json(); 
    return data;
}