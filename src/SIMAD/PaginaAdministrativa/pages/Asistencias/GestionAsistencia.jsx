import { useEffect, useState } from "react";
import { obtenerAsistencias } from "./Services/AsistenciaService";

export const GestionAsistencia = () => {

const MATERIAS_URL = 'http://localhost:3000/materias';
const GRADOS_URL = 'http://localhost:3000/grados';
const SECCIONES_URL = 'http://localhost:3000/secciones';
const PERIODOS_URL = 'http://localhost:3000/periodos';

     const obtenerMaterias = async () => {
        const response = await fetch(MATERIAS_URL);
        if (!response.ok) {
          throw new Error('Error al obtener las materias');
        }
        return await response.json();
      };
      
       const obtenerGrados = async () => {
        const response = await fetch(GRADOS_URL);
        if (!response.ok) {
          throw new Error('Error al obtener los grados');
        }
        return await response.json();
      };
      
       const obtenerSecciones = async () => {
        const response = await fetch(SECCIONES_URL);
        if (!response.ok) {
          throw new Error('Error al obtener las secciones');
        }
        return await response.json();
      };
      
       const obtenerPeriodos = async () => {
        const response = await fetch(PERIODOS_URL);
        if (!response.ok) {
          throw new Error('Error al obtener los periodos');
        }
        return await response.json();
      };






    const [asistencias, setAsistencias] = useState([]);
    const [filtros, setFiltros] = useState({
      periodo: '',
      fecha: '',
      grado: '',
      materia: '',
      seccion: '',
    });
    const [error, setError] = useState('');
    const [materias, setMaterias] = useState([]);
    const [grados, setGrados] = useState([]);
    const [secciones, setSecciones] = useState([]);
    const [periodos, setPeriodos] = useState([]);
  
    useEffect(() => {
      cargarDatos();
    }, []);
  
    const cargarDatos = async () => {
      try {
        const [materiasData, gradosData, seccionesData, periodosData] = await Promise.all([
          obtenerMaterias(),
          obtenerGrados(),
          obtenerSecciones(),
          obtenerPeriodos(),
        ]);
        setMaterias(materiasData);
        setGrados(gradosData);
        setSecciones(seccionesData);
        setPeriodos(periodosData);
      } catch (err) {
        setError('Error al cargar los datos');
      }
    };
  
    const handleBuscar = async () => {
      try {
        const data = await obtenerAsistencias(filtros);
        setAsistencias(data);
      } catch (err) {
        setError('Error al obtener las asistencias');
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFiltros({ ...filtros, [name]: value });
    };
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Asistencias</h1>
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            name="periodo"
            value={filtros.periodo}
            onChange={handleChange}
            className="border rounded px-4 py-2"
          >
            <option value="">Seleccionar Periodo</option>
            {periodos.map((periodo) => (
              <option key={periodo.id} value={periodo.id}>{periodo.nombre}</option>
            ))}
          </select>
  
          <input
            type="date"
            name="fecha"
            value={filtros.fecha}
            onChange={handleChange}
            className="border rounded px-4 py-2"
          />
  
          <select
            name="grado"
            value={filtros.grado}
            onChange={handleChange}
            className="border rounded px-4 py-2"
          >
            <option value="">Seleccionar Grado</option>
            {grados.map((grado) => (
              <option key={grado.id} value={grado.id}>{grado.nivel}</option>
            ))}
          </select>
  
          <select
            name="materia"
            value={filtros.materia}
            onChange={handleChange}
            className="border rounded px-4 py-2"
          >
            <option value="">Seleccionar Materia</option>
            {materias.map((materia) => (
              <option key={materia.id} value={materia.id}>{materia.nombre}</option>
            ))}
          </select>
  
          <select
            name="seccion"
            value={filtros.seccion}
            onChange={handleChange}
            className="border rounded px-4 py-2"
          >
            <option value="">Seleccionar Sección</option>
            {secciones.map((seccion) => (
              <option key={seccion.id} value={seccion.id}>{seccion.nombre}</option>
            ))}
          </select>
  
          <button
            onClick={handleBuscar}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>
  
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Estudiante</th>
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Profesor</th>
              <th className="border px-4 py-2">Materia</th>
              <th className="border px-4 py-2">Sección</th>
              <th className="border px-4 py-2">Estado</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((asistencia) => (
              <tr key={asistencia.asistencia_id}>
                <td className="border px-4 py-2">{asistencia.id_Estudiante.nombre_Estudiante}</td>
                <td className="border px-4 py-2">{asistencia.fecha}</td>
                <td className="border px-4 py-2">{asistencia.id_Profesor.nombre_Profesor}</td>
                <td className="border px-4 py-2">{asistencia.id_Materia.nombre_Materia}</td>
                <td className="border px-4 py-2">{asistencia.id_Seccion.nombre_Seccion}</td>
                <td className="border px-4 py-2">{asistencia.estado}</td>
                <td className="border px-4 py-2">
                  <button className="bg-red-500 text-white px-3 py-1 rounded">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}
