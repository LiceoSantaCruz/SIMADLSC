// src/Hooks/UseFetchEstudiantes.js
import { useState, useEffect, useCallback } from 'react';
import EstudiantesService from '../Service/EstudiantesService';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

const UseFetchEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEstudiantes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Se obtiene la lista completa (search vacío)
      const data = await EstudiantesService.getEstudiantes('');
      setEstudiantes(data);
    } catch (err) {
      const mensajeError = err.response?.data?.message || 'Error al obtener estudiantes';
      setError(mensajeError);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensajeError,
        confirmButtonColor: '#2563EB',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstudiantes();
  }, [fetchEstudiantes]);

  return {
    estudiantes,
    setEstudiantes,
    loading,
    error,
    fetchEstudiantes,
  };
};

export default UseFetchEstudiantes;
