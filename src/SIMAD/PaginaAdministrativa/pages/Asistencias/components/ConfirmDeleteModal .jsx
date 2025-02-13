
const ConfirmDeleteModal = ({ message, onConfirm, onCancel }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
          <h2 className="text-red-600 text-lg font-semibold mb-4">Confirmación</h2>
          <p className="text-gray-800 mb-4">{message}</p>
          <div className="flex justify-end">
            <button
              onClick={onCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmDeleteModal;