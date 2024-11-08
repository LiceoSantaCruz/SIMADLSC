import {  useEffect, useState } from "react";
import { useDatosIniciales } from "./Hook/useDatosIniciales";
import { actualizarAsistencia, eliminarAsistencia, obtenerGestionAsistencias, obtenerTodasLasAsistencias } from "./Services/GestionAsistenciaService";
import { usePeriodos } from "./Hook/usePeriodos";
import EditarAsistenciaModal from "./components/EditarAsistenciaModal";
import NoResultsModal from "./components/NoResultsModal";

export const GestionAsistencia = () => {
  const { materias, grados, secciones } = useDatosIniciales();
  const { periodos } = usePeriodos(); 

  const [asistencias, setAsistencias] = useState([]);
  const [filtros, setFiltros] = useState({
    periodo: '',
    fecha: '',
    grado: '',
    materia: '',
    seccion: '',
  });
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [asistenciaSeleccionada, setAsistenciaSeleccionada] = useState(null);
  const [noResultsVisible, setNoResultsVisible] = useState(false); // Nuevo estado para el modal de resultados

  // Nueva función para obtener todas las asistencias al cargar el componente
  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const data = await obtenerTodasLasAsistencias(); 
        setAsistencias(data);
        setError('');
      } catch (err) {
        setError('Error al obtener las asistencias');
        setAsistencias([]);
      }
    };

    fetchAsistencias();
  }, []); // Se ejecuta al montar el componente

  const handleBuscar = async () => {
    try {
      const data = await obtenerGestionAsistencias(filtros);
      if (data.length === 0) {
        setNoResultsVisible(true); // Mostrar modal si no hay resultados
      } else {
        setAsistencias(data);
        setNoResultsVisible(false); // Cerrar el modal si hay resultados
      }
    } catch (err) {
      console.error('Error al obtener las asistencias:', err);
      setError('Error al obtener las asistencias');
      setAsistencias([]);
      setNoResultsVisible(true); // También mostrar modal en caso de error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const handleEditar = (id) => {
    const asistencia = asistencias.find(a => a.asistencia_id === id);
    setAsistenciaSeleccionada(asistencia);
    setModalVisible(true);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await actualizarAsistencia(id, updatedData);
      // Actualizar la lista de asistencias después de la actualización
      setAsistencias(asistencias.map(a => (a.asistencia_id === id ? { ...a, ...updatedData } : a)));
      setModalVisible(false); // Cerrar el modal después de la actualización
    } catch (err) {
      setError('Error al actualizar la asistencia');
    }
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta asistencia?");
    if (confirmar) {
      try {
        await eliminarAsistencia(id);
        setAsistencias(asistencias.filter((asistencia) => asistencia.asistencia_id !== id));
      } catch (err) {
        setError('Error al eliminar la asistencia');
      }
    }
  };

  const handleCloseModal = () => {
    setNoResultsVisible(false); // Cerrar el modal
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Asistencias</h1>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <select
          name="periodo"
          value={filtros.periodo}
          onChange={handleChange}
          className="border rounded px-4 py-2"
        >
          <option value="">Seleccionar Periodo</option>
          {periodos.map((periodo) => (
            <option key={periodo.id_Periodo} value={periodo.id_Periodo}>
              {periodo.nombre_Periodo}
            </option>
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
            <option key={grado.id_grado} value={grado.id_grado}>
              {grado.nivel}
            </option>
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
            <option key={materia.id_Materia} value={materia.id_Materia}>
              {materia.nombre_Materia}
            </option>
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
            <option key={seccion.id_Seccion} value={seccion.id_Seccion}>
              {seccion.nombre_Seccion}
            </option>
          ))}
        </select>

        <button
          onClick={handleBuscar}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {asistencias.length > 0 ? (
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
                <td className="border px-4 py-2">
                  {asistencia.id_Estudiante.nombre_Estudiante}{' '}
                  {asistencia.id_Estudiante.apellido1_Estudiante}
                </td>
                <td className="border px-4 py-2">{asistencia.fecha}</td>
                <td className="border px-4 py-2">
                  {asistencia.id_Profesor.nombre_Profesor}{' '}
                  {asistencia.id_Profesor.apellido1_Profesor}
                </td>
                <td className="border px-4 py-2">
                  {asistencia.id_Materia.nombre_Materia}
                </td>
                <td className="border px-4 py-2">
                  {asistencia.id_Seccion.nombre_Seccion}
                </td>
                <td className="border px-4 py-2">{asistencia.estado}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEditar(asistencia.asistencia_id)}
                    className="bg-green-700 text-white px-3 py-1 rounded mr-2 hover:bg-green-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(asistencia.asistencia_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-300"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron asistencias.</p>
      )}

      {modalVisible && asistenciaSeleccionada && (
        <EditarAsistenciaModal
          asistencia={asistenciaSeleccionada}
          onUpdate={handleUpdate}
          onClose={() => setModalVisible(false)}
        />
      )}

      {noResultsVisible && (
        <NoResultsModal 
          message="No se encontraron asistencias con los criterios de búsqueda." 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}