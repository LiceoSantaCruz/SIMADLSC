const ConfirmDeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}) => {
  // Si quieres mantener la verificación, revisa la prop `isOpen`
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md transition-all">
    
    {/* Título del modal */}
    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
      {title || "Confirmar"}
    </h3>

    {/* Mensaje del modal */}
    <p className="mb-4 text-gray-700 dark:text-gray-300">
      {message}
    </p>

    {/* Botones de acción */}
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 transition"
      >
        Cancelar
      </button>
      <button
        onClick={onConfirm}
        className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition"
      >
        Confirmar
      </button>
    </div>
  </div>
</div>

  );
};

export default ConfirmDeleteModal;
