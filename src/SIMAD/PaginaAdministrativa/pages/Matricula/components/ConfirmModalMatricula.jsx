export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mb-4 text-gray-700 dark:text-gray-300">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Confirmar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
    
    );
  }