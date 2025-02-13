import { useState } from "react";
import { crearJustificacion } from "./Services/JustificacionService";
import useMaterias from "./Hook/useMaterias";
import { useAsistenciaByCedula } from "./Hook/useAsistenciaByCedula";
import JustificationModal from "./components/JustificationModal";
import SuccessModal from "./components/SuccessModal ";

export const JustificacionAusencias = () => {
  const { materias } = useMaterias();
  const { asistencias, loading, error, searchAsistencias } = useAsistenciaByCedula();

  const [formData, setFormData] = useState({
    cedula: "",
    id_Materia: "",
    fecha: "",
  });

  const [showJustificationModal, setShowJustificationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedAsistenciaId, setSelectedAsistenciaId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchAsistencias(formData);
  };

  const handleJustificar = (asistenciaId) => {
    setSelectedAsistenciaId(asistenciaId);
    setShowJustificationModal(true);
  };

  const handleConfirmJustification = async (descripcion) => {
    try {
      await crearJustificacion(selectedAsistenciaId, descripcion);
      setShowJustificationModal(false);
      setShowSuccessModal(true); // Mostrar modal de éxito
      setSelectedAsistenciaId(null);
      // Actualizar la lista de asistencias después de justificar
      searchAsistencias(formData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Justificar Ausencias</h2>
      <form onSubmit={handleSearch} className="bg-white p-4 rounded shadow-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="cedula"
            placeholder="Cédula del Estudiante"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="fecha"
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <select name="id_Materia" onChange={handleChange} className="border p-2 rounded">
            <option value="">Seleccionar Materia</option>
            {materias.map((materia) => (
              <option key={materia.id_Materia} value={materia.id_Materia}>
                {materia.nombre_Materia}
              </option>
            ))}
          </select>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Buscar
          </button>
        </div>
      </form>

      {loading ? (
        <p>Cargando asistencias...</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Fecha</th>
              <th className="py-2">Materia</th>
              <th className="py-2">Profesor</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Justificar</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((asistencia) => (
              <tr key={asistencia.asistencia_id} className="text-center">
                <td className="border px-4 py-2">{asistencia.fecha}</td>
                <td className="border px-4 py-2">{asistencia.id_Materia.nombre_Materia}</td>
                <td className="border px-4 py-2">{asistencia.id_Profesor.nombre_Profesor}</td>
                <td className="border px-4 py-2">{asistencia.estado}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleJustificar(asistencia.asistencia_id)}
                    className="bg-green-700 text-white px-2 py-1 rounded"
                    disabled={asistencia.estado !== "A"}
                  >
                    Justificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modales */}
      {showJustificationModal && (
        <JustificationModal
          onConfirm={handleConfirmJustification}
          onClose={() => setShowJustificationModal(false)}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          message="¡Justificación guardada con éxito!"
          onClose={() => setShowSuccessModal(false)} // Cierra correctamente el modal
        />
      )}
    </div>
  );
};