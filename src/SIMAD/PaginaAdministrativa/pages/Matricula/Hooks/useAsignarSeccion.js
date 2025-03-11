// src/Hooks/useAsignarSeccion.js
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Hook para cargar las matrículas aceptadas y secciones, y asignar una sección.
 * Se asume que el endpoint GET /matriculas?estado=AC devuelve solo las matrículas aceptadas.
 */
export function useAsignarSeccion() {
  const [matriculas, setMatriculas] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos al montar
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Cargar matrículas aceptadas
        const resMats = await fetch(`${API_URL}/matriculas?estado=AC`);
        if (!resMats.ok) throw new Error("Error al obtener matrículas aceptadas");
        const mats = await resMats.json();
        setMatriculas(mats);
        // Cargar secciones
        const resSecs = await fetch(`${API_URL}/secciones`);
        if (!resSecs.ok) throw new Error("Error al obtener secciones");
        const secs = await resSecs.json();
        setSecciones(secs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /**
   * Asigna la sección a las matrículas seleccionadas.
   * @param {number} seccionId 
   * @param {number[]} matriculaIds 
   * @returns {Promise} Actualización de las matrículas
   */
  async function onAssignSeccion(seccionId, matriculaIds) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/matriculas/asignar-seccion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seccionId, matriculaIds }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Error al asignar sección: ${msg}`);
      }
      const updated = await res.json();
      // Actualizamos la lista local: reemplazamos cada matrícula actualizada
      setMatriculas((prev) =>
        prev.map((mat) =>
          matriculaIds.includes(mat.id_Matricula)
            ? updated.find((upd) => upd.id_Matricula === mat.id_Matricula) || mat
            : mat
        )
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { matriculas, secciones, loading, error, onAssignSeccion };
}
