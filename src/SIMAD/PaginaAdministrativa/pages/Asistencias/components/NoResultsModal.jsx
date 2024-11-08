
const NoResultsModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-4">No se encontraron resultados</h2>
        <p>{message}</p>
        <button 
          onClick={onClose} 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default NoResultsModal;
