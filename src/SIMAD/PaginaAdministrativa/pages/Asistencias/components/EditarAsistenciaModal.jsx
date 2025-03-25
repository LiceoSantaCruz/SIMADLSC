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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md transition-all">
      
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Editar Asistencia
      </h2>
  
      <form onSubmit={handleSubmit}>
        {/* Fecha */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
  
        {/* Estado */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          >
            {Object.entries(AsistenciaStatus).map(([key, value]) => (
              <option key={key} value={value}>
                {key}
              </option>
            ))}
          </select>
        </div>
  
        {/* Botones */}
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md transition dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
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
