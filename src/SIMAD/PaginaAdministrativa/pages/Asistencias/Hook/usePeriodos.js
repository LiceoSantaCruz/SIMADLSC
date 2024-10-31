
import { useEffect, useState } from 'react';
import { obtenerPeriodos } from '../Services/PeriodoServices';

export const usePeriodos = () => {
    const [periodos, setPeriodos] = useState([]);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchPeriodos = async () => {
        try {
          const data = await obtenerPeriodos();
          setPeriodos(data);
          setError('');
        } catch (err) {
          setError(err.message);
          setPeriodos([]);
        }
      };
  
      fetchPeriodos();
    }, []);
  
    return { periodos, error };
}