import { useState } from "react";
import { fetchAsistencias } from "../Services/AsistenciaService";

export const useAsistenciaByCedula = () => {
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const searchAsistencias = async (params) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAsistencias(params);
        setAsistencias(data);
      } catch (err) {
        setError('Error al obtener las asistencias');
      } finally {
        setLoading(false);
      }
    };
  
    return { asistencias, loading, error, searchAsistencias };
}
