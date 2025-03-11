// src/Service/asignarSeccionService.js
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtiene todas las matrículas aceptadas (estado AC).
 */
export async function getAcceptedMatriculas() {
  const res = await fetch(`${API_URL}/matriculas?estado=AC`);
  // Suponiendo que tu backend acepte un query param ?estado=AC
  // o tal vez tengas un endpoint /matriculas/aceptadas
  if (!res.ok) {
    throw new Error("Error al obtener matrículas aceptadas");
  }
  return await res.json();
}

/**
 * Obtiene todas las secciones.
 */
export async function getSecciones() {
  const res = await fetch(`${API_URL}/secciones`);
  if (!res.ok) {
    throw new Error("Error al obtener secciones");
  }
  return await res.json();
}

/**
 * Asigna una sección a múltiples matrículas.
 * @param {number} seccionId - ID de la sección
 * @param {number[]} matriculaIds - IDs de las matrículas
 */
export async function assignSeccionToMatriculas(seccionId, matriculaIds) {
  const res = await fetch(`${API_URL}/matriculas/asignar-seccion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seccionId, matriculaIds }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error al asignar sección: ${msg}`);
  }
  return await res.json(); // Retorna las matrículas actualizadas
}
