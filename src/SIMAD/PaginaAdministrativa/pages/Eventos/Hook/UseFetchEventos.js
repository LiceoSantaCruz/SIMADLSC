// src/Hooks/UseFetchEventos.js

import { useState, useEffect } from 'react';
import EventosService from '../Service/EventosService';

const UseFetchEventos = (type = 'all') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para Ubicaciones
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loadingUbicaciones, setLoadingUbicaciones] = useState(true);
  const [errorUbicaciones, setErrorUbicaciones] = useState(null);

  // Estados para Tipos de Evento
  const [tiposEventos, setTiposEventos] = useState([]);
  const [loadingTiposEventos, setLoadingTiposEventos] = useState(true);
  const [errorTiposEventos, setErrorTiposEventos] = useState(null);

  // Estados para Estados de Evento
  const [estadosEventos, setEstadosEventos] = useState([]);
  const [loadingEstadosEventos, setLoadingEstadosEventos] = useState(true);
  const [errorEstadosEventos, setErrorEstadosEventos] = useState(null);

  // Estados para Dirigidos A
  const [dirigidosA, setDirigidosA] = useState([]);
  const [loadingDirigidosA, setLoadingDirigidosA] = useState(true);
  const [errorDirigidosA, setErrorDirigidosA] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      setLoading(true);
      try {
        let response;
        if (type === 'user') {
          response = await EventosService.getUserEventos();
        } else {
          response = await EventosService.getAllEventos();
        }
        setData(response);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al obtener eventos');
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [type]);

  useEffect(() => {
    const fetchUbicaciones = async () => {
      setLoadingUbicaciones(true);
      try {
        const response = await EventosService.getUbicaciones();
        setUbicaciones(response);
      } catch (err) {
        setErrorUbicaciones(err.response?.data?.message || 'Error al obtener ubicaciones');
      } finally {
        setLoadingUbicaciones(false);
      }
    };

    const fetchTiposEventos = async () => {
      setLoadingTiposEventos(true);
      try {
        const response = await EventosService.getTiposEventos();
        setTiposEventos(response);
      } catch (err) {
        setErrorTiposEventos(err.response?.data?.message || 'Error al obtener tipos de eventos');
      } finally {
        setLoadingTiposEventos(false);
      }
    };

    const fetchEstadosEventos = async () => {
      setLoadingEstadosEventos(true);
      try {
        const response = await EventosService.getEstadosEventos();
        setEstadosEventos(response);
      } catch (err) {
        setErrorEstadosEventos(err.response?.data?.message || 'Error al obtener estados de eventos');
      } finally {
        setLoadingEstadosEventos(false);
      }
    };

    const fetchDirigidosA = async () => {
      setLoadingDirigidosA(true);
      try {
        const response = await EventosService.getDirigidosA();
        setDirigidosA(response);
      } catch (err) {
        setErrorDirigidosA(err.response?.data?.message || 'Error al obtener "Dirigido a"');
      } finally {
        setLoadingDirigidosA(false);
      }
    };

    // Realizar todas las solicitudes en paralelo
    const fetchAll = async () => {
      await Promise.all([
        fetchUbicaciones(),
        fetchTiposEventos(),
        fetchEstadosEventos(),
        fetchDirigidosA(),
      ]);
    };

    fetchAll();
  }, []);

  return { 
    data, 
    setData, // Añadido para actualizar el estado desde el componente
    loading, 
    error,
    ubicaciones,
    loadingUbicaciones,
    errorUbicaciones,
    tiposEventos,
    loadingTiposEventos,
    errorTiposEventos,
    estadosEventos,
    loadingEstadosEventos,
    errorEstadosEventos,
    dirigidosA, // Añadido
    loadingDirigidosA, // Añadido
    errorDirigidosA, // Añadido
  };
};

export default UseFetchEventos;
