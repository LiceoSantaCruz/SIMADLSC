const API_URL = 'http://localhost:3000/periodos';

export const obtenerPeriodos = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener los periodos');
    const data = await response.json(); 
    return data;
}