// src/utils/contarLecciones.js
export const contarLecciones = (lecciones) => {
  if (Array.isArray(lecciones)) {
    return lecciones.length;
  }
  if (typeof lecciones === "string") {
    return lecciones
      .split(",")
      .filter((l) => l.trim() !== "")
      .length;
  }
  return 0;
};
