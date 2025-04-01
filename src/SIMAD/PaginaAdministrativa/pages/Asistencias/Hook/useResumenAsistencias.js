import { useCallback, useState } from "react";
import { getResumenAsistenciasByDates, getResumenAsistenciasById } from "../Services/AsistenciaResumenService";

export const useResumenAsistencias = () => {
    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    // Memoriza la función para no causar bucles en useEffect
    const fetchResumen = useCallback(async (studentId) => {
      setLoading(true);
      setError(null);
      setResumen(null);
      try {
        const data = await getResumenAsistenciasById(studentId);
        setResumen(data);
      } catch (err) {
        setError(err.message || "Error al cargar el resumen de asistencias");
      } finally {
        setLoading(false);
      }
    }, []);
  
    // Función para cargar con rango de fechas
    const fetchResumenByDates = useCallback(async (studentId, fechaInicio, fechaFin) => {
      setLoading(true);
      setError(null);
      setResumen(null);
      try {
        const data = await getResumenAsistenciasByDates(studentId, fechaInicio, fechaFin);
        setResumen(data);
      } catch (err) {
        setError(err.message || "Error al cargar el resumen de asistencias con fechas");
      } finally {
        setLoading(false);
      }
    }, []);
  
    return {
      resumen,
      loading,
      error,
      fetchResumen,
      fetchResumenByDates
    };
  };