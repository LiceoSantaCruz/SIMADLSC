
import { useEffect, useState } from 'react';
import { obtenerSecciones } from '../Services/SeccionService';

const useSecciones = () => {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSecciones = async () => {
      try {
        const data = await obtenerSecciones();
        setSecciones(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSecciones();
  }, []);

  return { secciones, loading };
};

export default useSecciones;
