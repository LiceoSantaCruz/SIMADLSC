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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-green-600 text-lg font-semibold mb-2">Justificar</h2>
        <textarea
          className="w-full border p-2 rounded mb-4"
          rows={4}
          placeholder="Ingrese el motivo de la justificación"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-1">
          <button
            onClick={handleConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded ">
            Confirmar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default JustificationModal;
