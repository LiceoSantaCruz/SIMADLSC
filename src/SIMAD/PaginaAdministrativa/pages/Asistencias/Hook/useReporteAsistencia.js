import { useState } from "react";
import { obtenerReporteAsistencias } from "../Services/AsistenciaService";

export const useReporteAsistencia = () => {
    const [cedula, setCedula] = useState('');
    const [grado, setGrado] = useState('');
    const [seccion, setSeccion] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [idPeriodo, setIdPeriodo] = useState('');
    const [asistencias, setAsistencias] = useState([]);
    const [error, setError] = useState(null);
  
    const buscarAsistencias = async () => {
      try {
        setError(null);
        const data = await obtenerReporteAsistencias(cedula, fechaInicio, fechaFin, idPeriodo);
        setAsistencias(data);
  
        // Auto-completar grado y sección si hay datos
        if (data.length > 0) {
          setGrado(data[0].id_grado.nivel);
          setSeccion(data[0].id_Seccion.nombre_Seccion);
        } else {
          setGrado('');
          setSeccion('');
        }
      } catch (err) {
        setError(err.message);
        setAsistencias([]);
        setGrado('');
        setSeccion('');
      }
    };
  
    return {
      cedula,
      setCedula,
      grado,
      seccion,
      fechaInicio,
      setFechaInicio,
      fechaFin,
      setFechaFin,
      idPeriodo,
      setIdPeriodo,
      asistencias,
      error,
      buscarAsistencias,
    };
  };