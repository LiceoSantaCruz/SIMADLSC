// src/Hooks/UseFetchEstudiantesPorSeccion.js
import { useState, useEffect, useCallback } from 'react';
import EstudiantesService from '../Service/EstudiantesService';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

const UseFetchEstudiantesPorSeccion = (seccionId) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEstudiantesPorSeccion = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EstudiantesService.getEstudiantesPorSeccion(seccionId);
      setEstudiantes(data);
    } catch (err) {
      const mensajeError =
        err.response?.data?.message || 'Error al obtener estudiantes por sección';
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
  }, [seccionId]);

  useEffect(() => {
    if (seccionId) {
      fetchEstudiantesPorSeccion();
    }
  }, [seccionId, fetchEstudiantesPorSeccion]);

  return {
    estudiantes,
    setEstudiantes,
    loading,
    error,
    fetchEstudiantesPorSeccion,
  };
};

export default UseFetchEstudiantesPorSeccion;
