import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useAsignarSeccion() {
  const [matriculas, setMatriculas] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Cargar matrículas sin sección asignada
        const resMats = await fetch(`${API_URL}/matriculas/sin-seccion`);
        if (!resMats.ok) throw new Error("Error al obtener matrículas sin sección");
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
      // Actualizamos la lista local: eliminamos las matrículas actualizadas
      setMatriculas((prev) =>
        prev.filter((mat) => !matriculaIds.includes(mat.id_Matricula))
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