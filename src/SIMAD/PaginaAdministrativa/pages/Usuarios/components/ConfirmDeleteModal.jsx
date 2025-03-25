import PropTypes from 'prop-types';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center">
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Confirmar Eliminación</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        ¿Estás seguro que deseas eliminar al usuario <strong className="text-gray-900 dark:text-white">{userName}</strong>?
      </p>
      <div className="flex justify-end">
        <button
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400 dark:hover:bg-gray-600"
          onClick={onClose}
        >
          No
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={onConfirm}
        >
          Sí, eliminar
        </button>
      </div>
    </div>
  </div>
  
  );
};

// Validación de las props con PropTypes
ConfirmDeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
};

export default ConfirmDeleteModal;
