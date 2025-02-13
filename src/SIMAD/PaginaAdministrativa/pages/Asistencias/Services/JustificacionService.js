

const API_URL = import.meta.env.VITE_API_URL;



//! /justificacion-ausencia
export const crearJustificacion = async (idAsistencia, descripcion) => {
    const response = await fetch(`${API_URL}/justificacion-ausencia/${idAsistencia}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descripcion }),
    });
    
    if (!response.ok) {
        throw new Error('Error al justificar la ausencia');
    }

    return response.json();
};

export const obtenerJustificaciones = async () => {
    const response = await fetch(`${API_URL}/justificacion-ausencia`);
    if (!response.ok) {
        throw new Error('Error al obtener las justificaciones');
    }
    return response.json();
};