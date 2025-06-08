import { useState } from "react";
import { obtenerReporteAsistencias } from "../Services/AsistenciaService";

export const useReporteAsistencia = () => {
    const [cedula, setCedula] = useState("");
    const [grado, setGrado] = useState("");
    const [seccion, setSeccion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [idPeriodo, setIdPeriodo] = useState("");
    const [idMateria, setIdMateria] = useState("");
    const [asistencias, setAsistencias] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const buscarAsistencias = async (fechaInicioParam, fechaFinParam) => {
      setLoading(true);
      setError(null);
      try {
        // Usar los parámetros si se proporcionan, de lo contrario usar los valores del estado
        const fechaInicioFinal = fechaInicioParam !== undefined ? fechaInicioParam : fechaInicio;
        const fechaFinFinal = fechaFinParam !== undefined ? fechaFinParam : fechaFin;
        
        const data = await obtenerReporteAsistencias(cedula, fechaInicioFinal, fechaFinFinal, idPeriodo, idMateria);
        
        // Si data es un objeto que contiene la propiedad "asistencias"
        const asistenciasArray = Array.isArray(data)
          ? data
          : data?.asistencias || [];
    
        if (asistenciasArray.length > 0) {
          // Filtrar por materia si se indicó
          let filtradas = asistenciasArray;
          if (idMateria) {
            filtradas = filtradas.filter(a =>
              a.id_Materia?.id_Materia.toString() === idMateria.toString()
            );
          }
          setAsistencias(filtradas);
          if (filtradas.length > 0) {
            setGrado(filtradas[0].id_grado.nivel);
            setSeccion(filtradas[0].id_Seccion.nombre_Seccion);
          } else {
            setGrado("");
            setSeccion("");
            setError("not-found");
          }
        } else {
          setAsistencias([]);
          setGrado("");
          setSeccion("");
          setError("not-found");
        }
      } catch (err) {
        if (err.message === "NOT_FOUND") {
          setAsistencias([]);
          setGrado("");
          setSeccion("");
          setError("not-found");
        } else {
          setAsistencias([]);
          setGrado("");
          setSeccion("");
          setError("server-error");
        }
      } finally {
        setLoading(false);
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
      idMateria,
      setIdMateria,
      asistencias,
      setAsistencias,
      error,       // "not-found" | "server-error" | null
      buscarAsistencias,
      loading,
    };
  };