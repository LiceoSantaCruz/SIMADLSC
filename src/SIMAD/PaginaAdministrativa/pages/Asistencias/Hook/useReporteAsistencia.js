import { useState } from "react";
import { obtenerReporteAsistencias } from "../Services/AsistenciaService";

export const useReporteAsistencia = () => {
    const [cedula, setCedula] = useState("");
    const [grado, setGrado] = useState("");
    const [seccion, setSeccion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [idPeriodo, setIdPeriodo] = useState("");
    const [asistencias, setAsistencias] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const buscarAsistencias = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await obtenerReporteAsistencias(cedula, fechaInicio, fechaFin, idPeriodo);
        
        // Si data es un objeto que contiene la propiedad "asistencias"
        const asistenciasArray = Array.isArray(data)
          ? data
          : data?.asistencias || [];
    
        if (asistenciasArray.length > 0) {
          setAsistencias(asistenciasArray);
          setGrado(asistenciasArray[0].id_grado.nivel);
          setSeccion(asistenciasArray[0].id_Seccion.nombre_Seccion);
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
      asistencias,
      setAsistencias,
      error,       // "not-found" | "server-error" | null
      buscarAsistencias,
      loading,
    };
  };