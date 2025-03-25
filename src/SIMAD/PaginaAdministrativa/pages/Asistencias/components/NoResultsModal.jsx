
const NoResultsModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg max-w-sm mx-auto text-gray-800 dark:text-gray-100">
      
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        No se encontraron resultados
      </h2>
  
      <p className="text-gray-700 dark:text-gray-300">{message}</p>
  
      <button 
        onClick={onClose} 
        className="mt-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
      >
        Cerrar
      </button>
  
    </div>
  </div>
  );
};

export default NoResultsModal;
