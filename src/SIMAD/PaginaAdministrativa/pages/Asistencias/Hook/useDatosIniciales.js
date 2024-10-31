
import { useEffect, useState } from 'react';
import { obtenerMaterias } from '../Services/MateriaService';
import { obtenerGrados } from '../Services/GradoService';
import { obtenerSecciones } from '../Services/SeccionService';

export const useDatosIniciales = () => {
  const [materias, setMaterias] = useState([]);
  const [grados, setGrados] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [materiasData, gradosData, seccionesData] = await Promise.all([
        obtenerMaterias(),
        obtenerGrados(),
        obtenerSecciones(),
      ]);
      setMaterias(materiasData);
      setGrados(gradosData);
      setSecciones(seccionesData);
    } catch (err) {
      setError('Error al cargar los datos');
    }
  };

  return { materias, grados, secciones, error };
};
