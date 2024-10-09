// src/SIMAD/PaginaAdministrativa/pages/Horarios/GestionHorario.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioHorarioEstudiante from './Formularios/FormularioHorarioEstudiante';
import FormularioHorarioProfesor from './Formularios/FormularioHorarioProfesor';
import ListaHorarios from './Vistas/ListaHorarios';

export const GestionHorario = () => {
  const [formularioSeleccionado, setFormularioSeleccionado] = useState(null);
  const [grados, setGrados] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [gradosRes, materiasRes, profesoresRes, aulasRes, horariosRes] = await Promise.all([
          axios.get('http://localhost:3000/grados'),
          axios.get('http://localhost:3000/materias'),
          axios.get('http://localhost:3000/profesores'),
          axios.get('http://localhost:3000/aulas'),
          axios.get('http://localhost:3000/horarios'),
        ]);

        setGrados(gradosRes.data);
        setMaterias(materiasRes.data);
        setProfesores(profesoresRes.data);
        setAulas(aulasRes.data);
        setHorarios(horariosRes.data);
        setCargando(false);
      } catch (err) {
        console.error('Error al obtener datos:', err);
        setError('Hubo un problema al cargar los datos.');
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []);

  const seleccionarFormulario = (tipo) => {
    if (formularioSeleccionado === tipo) {
      setFormularioSeleccionado(null); // Si el mismo formulario está seleccionado, lo cierra
    } else {
      setFormularioSeleccionado(tipo); // Si es un formulario diferente, lo abre
    }
  };

  const handleSubmitSuccess = (nuevoHorario) => {
    setHorarios([...horarios, nuevoHorario]);
    alert('Horario registrado exitosamente.');
  };

  if (cargando) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

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
      {formularioSeleccionado === 'profesor' && (
        <FormularioHorarioProfesor
          onSubmitSuccess={handleSubmitSuccess}
          grados={grados}
          materias={materias}
          profesores={profesores}
          aulas={aulas}
        />
      )}
      {formularioSeleccionado === 'estudiante' && (
        <FormularioHorarioEstudiante
          onSubmitSuccess={handleSubmitSuccess}
          grados={grados}
          materias={materias}
          profesores={profesores}
          aulas={aulas}
        />
      )}

      {/* Lista de Horarios solo se muestra si no hay formulario seleccionado */}
      {!formularioSeleccionado && (
        <ListaHorarios
          horarios={horarios}
          grados={grados}
          materias={materias}
          profesores={profesores}
          aulas={aulas}
          setHorarios={setHorarios}
        />
      )}
    </div>
  );
};

export default GestionHorario;
