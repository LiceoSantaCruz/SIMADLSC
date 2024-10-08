const ToggleButton = ({ type, label, isSelected, onClick, color }) => {
  const bgColor = isSelected
    ? `bg-${color}-700`
    : `bg-${color}-500 hover:bg-${color}-600`;

  return (
    <button
      className={`px-6 py-2 rounded-lg mr-4 ${bgColor} text-white`}
      onClick={() => onClick(type)}
    >
      {isSelected ? `Cerrar  ` : `Crear un nuevo horario`}
    </button>
  );
};

export default ToggleButton;
