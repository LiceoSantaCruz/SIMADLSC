// hooks/useGestionMatriculas.js

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { aprobarMatricula, obtenerMatriculasPendientes, rechazarMatricula } from '../Service/gestionMatriculasService';

export const useGestionMatriculas = () => {
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatriculas = async () => {
      try {
        setLoading(true);
        const data = await obtenerMatriculasPendientes();
        setMatriculas(data);
      } catch (err) {
        setError('Error al cargar las matrículas');
      } finally {
        setLoading(false);
      }
    };

    fetchMatriculas();
  }, []);

  const handleApprove = async (idMatricula, seccionId) => {
    try {
      await aprobarMatricula(idMatricula, seccionId);
      setMatriculas((prev) =>
        prev.map((matricula) =>
          matricula.id_Matricula === idMatricula
            ? { ...matricula, estado_Matricula: 'Aprobada', seccionId }
            : matricula
        )
      );
      Swal.fire({
        icon: 'success',
        title: 'Aprobado',
        text: 'La matrícula ha sido aprobada.',
        confirmButtonColor: '#2563EB',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al aprobar la matrícula.',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  const handleReject = async (idMatricula) => {
    try {
      await rechazarMatricula(idMatricula);
      setMatriculas((prev) =>
        prev.map((matricula) =>
          matricula.id_Matricula === idMatricula
            ? { ...matricula, estado_Matricula: 'Rechazada' }
            : matricula
        )
      );
      Swal.fire({
        icon: 'success',
        title: 'Rechazado',
        text: 'La matrícula ha sido rechazada.',
        confirmButtonColor: '#2563EB',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al rechazar la matrícula.',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  return {
    matriculas,
    loading,
    error,
    handleApprove,
    handleReject,
  };
};

export default useGestionMatriculas;
