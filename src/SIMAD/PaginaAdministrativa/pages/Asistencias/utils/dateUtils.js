// Utilidades para manejo de fechas en zona horaria de Centro América (Costa Rica)

/**
 * Ajusta una fecha a la zona horaria de Costa Rica (UTC-6)
 * @param {string} fecha - Fecha en formato ISO (YYYY-MM-DD)
 * @returns {string} - Fecha ajustada en formato ISO (YYYY-MM-DD)
 */
export const ajustarFechaCostaRica = (fecha) => {
  if (!fecha) return "";
  
  // Crear fecha con la zona horaria local del navegador
  const fechaLocal = new Date(fecha);
  
  // Crear fecha en UTC
  const fechaUTC = new Date(Date.UTC(
    fechaLocal.getFullYear(),
    fechaLocal.getMonth(),
    fechaLocal.getDate(),
    12, 0, 0 // Mediodía para evitar problemas con cambios de horario
  ));
  
  // Convertir a string ISO y extraer solo la parte de la fecha
  return fechaUTC.toISOString().split('T')[0];
};

/**
 * Formatea una fecha para mostrar en la UI
 * @param {string} fecha - Fecha en formato ISO o timestamp
 * @returns {string} - Fecha formateada para mostrar
 */
export const formatearFechaUI = (fecha) => {
  if (!fecha) return "";
  // Parsear la fecha como local para evitar desfase de zona horaria
  const [year, month, day] = fecha.split('-').map(Number);
  const fechaLocal = new Date(year, month - 1, day);
  return fechaLocal.toLocaleDateString('es-CR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Verifica si una fecha es día laborable (lunes a viernes)
 * @param {string} fecha - Fecha en formato ISO (YYYY-MM-DD)
 * @returns {boolean}
 */
export const esDiaLaborable = (fecha) => {
  if (!fecha) return false;
  // Parsear fecha como local para obtener el día correcto
  const [year, month, dayNum] = fecha.split('-').map(Number);
  const fechaLocal = new Date(year, month - 1, dayNum);
  const diaSemana = fechaLocal.getDay(); // 0 es domingo, 1 es lunes...
  return diaSemana >= 1 && diaSemana <= 5;
};

/**
 * Valida un rango de fechas
 * @param {string} fechaInicio - Fecha inicial en formato ISO
 * @param {string} fechaFin - Fecha final en formato ISO
 * @returns {{ isValid: boolean, message: string }}
 */
export const validarRangoFechas = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    return {
      isValid: false,
      message: "Ambas fechas son requeridas"
    };
  }

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  if (inicio > fin) {
    return {
      isValid: false,
      message: "La fecha de inicio no puede ser posterior a la fecha final"
    };
  }

  if (!esDiaLaborable(fechaInicio) || !esDiaLaborable(fechaFin)) {
    return {
      isValid: false,
      message: "Solo se permiten días laborables (lunes a viernes)"
    };
  }

  return { isValid: true, message: "" };
}; 