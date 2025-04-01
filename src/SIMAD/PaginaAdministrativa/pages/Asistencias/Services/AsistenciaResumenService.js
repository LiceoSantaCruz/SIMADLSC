// Ajusta la URL base a tu entorno
const API_URL = import.meta.env.VITE_API_URL 

export const getResumenAsistenciasById = async (studentId) => {
    const response = await fetch(`${API_URL}/asistencias/resumen/${studentId}`);
    if (!response.ok) {
      throw new Error("Error al obtener el resumen de asistencias");
    }
    return response.json();
  };


  /**
 * Obtiene el resumen de asistencias con filtro de fechas:
 * GET /asistencias/estudiante/:id/resumen-fechas/:fechaInicio/:fechaFin
 */
export const getResumenAsistenciasByDates = async (studentId, fechaInicio, fechaFin) => {
    const response = await fetch(
      `${API_URL}/asistencias/estudiante/${studentId}/resumen-fechas/${fechaInicio}/${fechaFin}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener el resumen de asistencias con filtro de fechas");
    }
    return response.json();
  };