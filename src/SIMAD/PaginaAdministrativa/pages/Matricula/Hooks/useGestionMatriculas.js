import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  getAllMatriculas,
  updateEstadoMatricula, 
  deleteMatricula,
} from '../Service/gestionMatriculasService';

export function useGestionMatriculas() {
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Para búsqueda por cédula
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar las matrículas al montar
  useEffect(() => {
    fetchMatriculas();
  }, []);

  const fetchMatriculas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMatriculas();
      setMatriculas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar estado de matrícula (Aceptado o Rechazado)
  const handleUpdateEstado = async (idMatricula, nuevoEstado) => {
    try {
      await updateEstadoMatricula(idMatricula, nuevoEstado);
      Swal.fire({
        icon: 'success',
        title: 'Actualizada',
        text: `La matrícula ha sido ${nuevoEstado.toLowerCase()}.`,
      });
      fetchMatriculas();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
      });
    }
  };

  // Eliminar matrícula
  const handleDelete = async (idMatricula) => {
    try {
      await deleteMatricula(idMatricula);
      Swal.fire({
        icon: 'success',
        title: 'Eliminada',
        text: 'La matrícula ha sido eliminada.',
      });
      fetchMatriculas();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
      });
    }
  };

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Filtrar matrículas por cédula del estudiante
  const filteredMatriculas = matriculas.filter((mat) =>
    mat.estudiante.cedula?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    matriculas: filteredMatriculas,
    loading,
    error,
    searchTerm,
    handleSearchChange,
    handleUpdateEstado,
    handleDelete,
  };
}