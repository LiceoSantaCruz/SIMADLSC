import { useState } from "react";

const JustificationModal = ({ onConfirm, onClose }) => {
  const [description, setDescription] = useState("");

  const handleConfirm = () => {
    if (description.trim()) {
      onConfirm(description);
      onClose();
    } else {
      alert("Por favor, ingrese un motivo para la justificación.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
      {/* Título */}
      <h2 className="text-xl font-bold text-green-600 mb-4 text-center">
        Justificar Ausencia
      </h2>
  
      {/* Área de texto */}
      <textarea
        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-lg mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
        rows={5}
        placeholder="Ingrese el motivo de la justificación"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
  
      {/* Botones */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleConfirm}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md transition font-medium"
        >
          Confirmar
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md transition font-medium"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default JustificationModal;
