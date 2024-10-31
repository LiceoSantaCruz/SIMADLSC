import PropTypes from 'prop-types';
import { useState } from 'react';
import { AsistenciaStatus } from '../Services/asistencia-status.enum';

const EditarAsistenciaModal = ({ asistencia, onUpdate, onClose }) => {
  const [fecha, setFecha] = useState(asistencia.fecha);
  const [estado, setEstado] = useState(asistencia.estado);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = { fecha, estado };
    onUpdate(asistencia.asistencia_id, updatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Editar Asistencia</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            >
              {Object.entries(AsistenciaStatus).map(([key, value]) => (
                <option key={key} value={value}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
              Guardar Cambios
            </button>
            <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditarAsistenciaModal.propTypes = {
  asistencia: PropTypes.shape({
    asistencia_id: PropTypes.number.isRequired,
    fecha: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditarAsistenciaModal;
