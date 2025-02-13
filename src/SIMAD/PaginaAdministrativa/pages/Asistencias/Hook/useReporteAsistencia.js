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
            setError(null); // Limpia el error antes de hacer la búsqueda
            const data = await obtenerReporteAsistencias(cedula, fechaInicio, fechaFin, idPeriodo);
            
            if (data && data.length > 0) {
                setAsistencias(data); // Establece los datos si no son vacíos
                setGrado(data[0].id_grado.nivel);
                setSeccion(data[0].id_Seccion.nombre_Seccion);
            } else {
                setAsistencias([]); // Si no hay datos, asegúrate de limpiar
                setGrado('');
                setSeccion('');
                setError("No se encontraron asistencias para los filtros ingresados."); // Mostrar error si no hay datos
            }
        } catch (err) {
            setAsistencias([]); // Asegura que el estado esté limpio
            setGrado('');
            setSeccion('');
            setError("Error al obtener las asistencias"); // Mostrar error si algo falla
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
        error,
        buscarAsistencias,
    };
  };