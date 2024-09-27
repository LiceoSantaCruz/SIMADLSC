import { useState } from 'react';
import FormularioHorarioEstudiante from './Formularios/FormularioHorarioEstudiante';
import FormularioHorarioProfesor from './Formularios/FormularioHorarioProfesor';
import ListaHorarios from './Vistas/ListaHorarios';

export const GestionHorario = () => {
  const [formularioSeleccionado, setFormularioSeleccionado] = useState(null);

  const seleccionarFormulario = (tipo) => {
    setFormularioSeleccionado(tipo);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Horarios</h1>

      {/* Botones para seleccionar el tipo de formulario */}
      <div className="mb-6">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg mr-4"
          onClick={() => seleccionarFormulario('profesor')}
        >
          Crear horario para profesor
        </button>
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-lg"
          onClick={() => seleccionarFormulario('estudiante')}
        >
          Crear horario para estudiante
        </button>
      </div>

      {/* Mostrar el formulario correspondiente */}
      {formularioSeleccionado === 'profesor' && <FormularioHorarioProfesor />}
      {formularioSeleccionado === 'estudiante' && <FormularioHorarioEstudiante />}

      {/* Lista de Horarios */}
      <ListaHorarios />
    </div>
  );
};

export default GestionHorario;
