const API_URL = import.meta.env.VITE_API_URL;

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Llama al endpoint que ya cuenta las lecciones en el backend */
export const getResumenAsistenciasById = async (studentId) => {
  const res = await fetch(
    `${API_URL}/asistencias/resumen/${studentId}`,
    { headers: { "Content-Type": "application/json", ...authHeader() } }
  );
  if (!res.ok) throw new Error("Error al obtener el resumen de asistencias");
  return res.json();
};

/** Igual, pero filtrado por fechas */
export const getResumenAsistenciasByDates = async (studentId, fi, ff) => {
  const res = await fetch(
    `${API_URL}/asistencias/estudiante/${studentId}/resumen-fechas/${fi}/${ff}`,
    { headers: { "Content-Type": "application/json", ...authHeader() } }
  );
  if (!res.ok) throw new Error("Error al obtener el resumen de asistencias con fechas");
  return res.json();
};
