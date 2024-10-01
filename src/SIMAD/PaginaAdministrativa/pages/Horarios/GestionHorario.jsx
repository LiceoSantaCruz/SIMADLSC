import { useState } from 'react';
import FormularioHorarioEstudiante from './Formularios/FormularioHorarioEstudiante';
import FormularioHorarioProfesor from './Formularios/FormularioHorarioProfesor';
import ListaHorarios from './Vistas/ListaHorarios';

export const GestionHorario = () => {
  const [formularioSeleccionado, setFormularioSeleccionado] = useState(null);

  const seleccionarFormulario = (tipo) => {
    if (formularioSeleccionado === tipo) {
      setFormularioSeleccionado(null); // Si el mismo formulario está seleccionado, lo cierra
    } else {
      setFormularioSeleccionado(tipo); // Si es un formulario diferente, lo abre
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Horarios</h1>

      {/* Botones para seleccionar el tipo de formulario */}
      <div className="mb-6">
        <button
          className={`px-6 py-2 rounded-lg mr-4 ${
            formularioSeleccionado === 'profesor' ? 'bg-blue-700' : 'bg-blue-500'
          } text-white`}
          onClick={() => seleccionarFormulario('profesor')}
        >
          {formularioSeleccionado === 'profesor' ? 'Cerrar horario para profesor' : 'Crear horario para profesor'}
        </button>
        <button
          className={`px-6 py-2 rounded-lg ${
            formularioSeleccionado === 'estudiante' ? 'bg-green-700' : 'bg-green-500'
          } text-white`}
          onClick={() => seleccionarFormulario('estudiante')}
        >
          {formularioSeleccionado === 'estudiante' ? 'Cerrar horario para estudiante' : 'Crear horario para estudiante'}
        </button>
      </div>

      {/* Mostrar el formulario correspondiente */}
      {formularioSeleccionado === 'profesor' && <FormularioHorarioProfesor />}
      {formularioSeleccionado === 'estudiante' && <FormularioHorarioEstudiante />}

      {/* Lista de Horarios solo se muestra si no hay formulario seleccionado */}
      {!formularioSeleccionado && <ListaHorarios />}
    </div>
  );
};

export default GestionHorario;
