

const SuccessModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-green-600 text-lg font-semibold mb-2">Éxito</h2>
        <p className="text-gray-800 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
