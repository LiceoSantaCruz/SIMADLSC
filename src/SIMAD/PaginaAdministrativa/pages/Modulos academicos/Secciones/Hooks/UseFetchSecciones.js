// src/Hooks/UseFetchSecciones.js
import { useState, useEffect } from 'react';
import SeccionesService from '../Services/SeccionesService';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

const UseFetchSecciones = () => {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSecciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SeccionesService.getSecciones();
      setSecciones(data);
    } catch (err) {
      setError(err.message || 'Error al obtener secciones');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Error al obtener secciones',
        confirmButtonColor: '#2563EB',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecciones();
  }, []);

  return {
    secciones,
    setSecciones,
    loading,
    error,
    fetchSecciones,
  };
};

export default UseFetchSecciones;
