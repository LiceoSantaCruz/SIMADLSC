import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const useReporteAsistenciaSeccion = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarReporteSeccion = async ({ idSeccion, fechaInicio, fechaFin }) => {
    setLoading(true);
    setError(null);
    setReporte(null);

    try {
      const url = `${API_URL}/asistencias/reporte-seccion/${idSeccion}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          // Sin resultados o sección no encontrada
          throw new Error("NOT_FOUND");
        } else {
          // Error de servidor (500, etc.)
          throw new Error("SERVER_ERROR");
        }
      }

      const data = await response.json();

      // Si tu backend retorna un objeto con "estudiantes" vacío,
      // también podrías interpretarlo como "not-found".
      if (!data || !data.estudiantes || data.estudiantes.length === 0) {
        throw new Error("NOT_FOUND");
      }

      setReporte(data);
    } catch (err) {
      if (err.message === "NOT_FOUND") {
        setError("not-found");
      } else {
        setError("server-error");
      }
    } finally {
      setLoading(false);
    }
  };

  return { reporte, loading, error, buscarReporteSeccion };
};