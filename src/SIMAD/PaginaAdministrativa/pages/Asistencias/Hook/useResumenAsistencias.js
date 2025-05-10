import { useCallback, useState } from "react";
import {
  getResumenAsistenciasById,
  getResumenAsistenciasByDates,
} from "../Services/AsistenciaResumenService";

export const useResumenAsistencias = () => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchResumen = useCallback(async (id) => {
    setLoading(true); setError(null); setResumen(null);
    try {
      const data = await getResumenAsistenciasById(id);
      setResumen(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchResumenByDates = useCallback(async (id, fi, ff) => {
    setLoading(true); setError(null); setResumen(null);
    try {
      const data = await getResumenAsistenciasByDates(id, fi, ff);
      setResumen(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { resumen, loading, error, fetchResumen, fetchResumenByDates };
};
