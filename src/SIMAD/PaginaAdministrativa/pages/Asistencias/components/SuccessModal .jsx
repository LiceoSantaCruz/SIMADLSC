

const SuccessModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-gray-900 rounded shadow-lg p-6 max-w-sm w-full text-gray-800 dark:text-gray-100">
      
      <h2 className="text-green-600 dark:text-green-400 text-lg font-semibold mb-2">
        Éxito
      </h2>
  
      <p className="text-gray-800 dark:text-gray-300 mb-4">{message}</p>
  
      <button
        onClick={onClose}
        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
      >
        Cerrar
      </button>
  
    </div>
  </div>
  
  );
};

export default SuccessModal;
