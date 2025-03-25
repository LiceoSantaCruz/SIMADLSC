
const ErrorModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
      {/* Título */}
      <h2 className="text-xl font-bold text-red-600 mb-3 text-center">
        ¡Ha ocurrido un error!
      </h2>
  
      {/* Mensaje */}
      <p className="text-gray-800 dark:text-gray-100 text-center mb-6">
        {message || "Ocurrió un problema inesperado. Intenta nuevamente más tarde."}
      </p>
  
      {/* Botón de cerrar */}
      <div className="flex justify-center">
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md shadow transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default ErrorModal;
