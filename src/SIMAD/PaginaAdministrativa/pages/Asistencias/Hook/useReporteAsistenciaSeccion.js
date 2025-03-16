import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const useReporteAsistenciaSeccion = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarReporteSeccion = async ({ idSeccion, fechaInicio, fechaFin }) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_URL}/asistencias/reporte-seccion/${idSeccion}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      const data = await response.json();
      setReporte(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { reporte, loading, error, buscarReporteSeccion };
};