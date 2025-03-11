export function AlertModal({ isOpen, onClose, title, message }) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
        <div className="bg-white p-6 rounded shadow-lg">
          <h3 className="text-xl font-semibold mb-4">{title}</h3>
          <p className="mb-4">{message}</p>
          <div className="text-right">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }