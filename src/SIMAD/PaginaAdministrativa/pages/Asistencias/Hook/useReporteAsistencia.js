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
  
        if (data && data.length > 0) {
          setAsistencias(data);
          setGrado(data[0].id_grado.nivel);
          setSeccion(data[0].id_Seccion.nombre_Seccion);
        } else {
          // Arreglo vacío sin 404 => interpretamos como sin resultados
          setAsistencias([]);
          setGrado("");
          setSeccion("");
          setError("not-found");
        }
      } catch (err) {
        // Distinguimos según el mensaje de error
        if (err.message === "NOT_FOUND") {
          // Sin resultados (404)
          setAsistencias([]);
          setGrado("");
          setSeccion("");
          setError("not-found");
        } else {
          // Error de servidor (500, 403, etc.)
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