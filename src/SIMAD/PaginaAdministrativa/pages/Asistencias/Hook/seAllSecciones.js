// src/Hook/useAllSecciones.js
import { useEffect, useState } from 'react';
import { obtenerSecciones } from '../Services/SeccionService';

const useAllSecciones = () => {
  const [secciones, setSecciones] = useState([]);
  const [loadingSecciones, setLoadingSecciones] = useState(true);
  const [errorSecciones, setErrorSecciones] = useState(null);

  useEffect(() => {
    const fetchSecciones = async () => {
      try {
        setLoadingSecciones(true);
        const data = await obtenerSecciones(); // Llama a tu Service
        setSecciones(data);
      } catch (error) {
        console.error(error);
        setErrorSecciones(error.message);
      } finally {
        setLoadingSecciones(false);
      }
    };
    fetchSecciones();
  }, []);

  return { secciones, loadingSecciones, errorSecciones };
};

export default useAllSecciones;
