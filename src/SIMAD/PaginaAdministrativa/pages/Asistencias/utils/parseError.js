// Ajusta la ruta y el nombre del archivo a tu estructura de proyecto.
export function parseErrorMessage(error) {
  // Si viene de Axios, usualmente está en error.response.data
  if (error.response && error.response.data) {
    const { message, error: errorName, statusCode } = error.response.data;
    return {
      message: message || "Ha ocurrido un error en el servidor",
      statusCode: statusCode || null,
      errorName: errorName || null,
    };
  }

  // Si no hay un formato de respuesta definido, usamos err.message genérico
  return {
    message: error.message || "Error desconocido",
    statusCode: null,
    errorName: null,
  };
}
