
//https://simadlsc-backend-production.up.railway.app/periodos
const API_URL = import.meta.env.VITE_API_URL;

export const obtenerPeriodos = async () => {
    const response = await fetch(`${API_URL}/periodos`);
    if (!response.ok) throw new Error('Error al obtener los periodos');
    const data = await response.json(); 
    return data;
}