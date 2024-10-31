import { useEffect, useState } from "react";
import { obtenerTodasLasAsistencias } from "../Services/GestionAsistenciaService";


export const useAllAsistencias = () => {
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchAsistencias = async () => {
        try {
          const data = await obtenerTodasLasAsistencias();
          setAsistencias(data);
          setError('');
        } catch (err) {
          setError('Error al obtener las asistencias');
          setAsistencias([]);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAsistencias();
    }, []);
  
    return { asistencias, loading, error };
  };