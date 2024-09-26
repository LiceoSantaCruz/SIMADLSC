import { useState, useEffect } from 'react';

const FormularioHorarioProfesor = () => {
  const [grado, setGrado] = useState('');               // Estado para el grado del profesor
  const [seccion, setSeccion] = useState('');           // Estado para la sección seleccionada
  const [materia, setMateria] = useState('');           // Estado para la materia seleccionada
  const [horaInicio, setHoraInicio] = useState('');     // Estado para la hora de inicio de la clase
  const [horaFin, setHoraFin] = useState('');           // Estado para la hora de fin de la clase
  const [aula, setAula] = useState('');                 // Estado para el aula
  const [profesorId, setProfesorId] = useState('');     // Estado para el ID del profesor seleccionado

  const [secciones, setSecciones] = useState([]);       // Lista de secciones obtenida del backend
  const [materias, setMaterias] = useState([]);         // Lista de materias obtenida del backend
  const [profesores, setProfesores] = useState([]);     // Lista de profesores obtenida del backend

  useEffect(() => {
    // Simulación de petición al backend para obtener profesores, materias, y secciones
    const obtenerDatos = async () => {
      try {
        // const respuestaProfesores = await fetch('/api/profesores');
        // const profesoresData = await respuestaProfesores.json();
        // setProfesores(profesoresData);

        // Simulación de datos de profesores
        setProfesores([
          { id: '101', nombre: 'Juan Pérez' },
          { id: '102', nombre: 'Laura Rodríguez' },
          { id: '103', nombre: 'Ana Gómez' }
        ]);

        // Simulación de materias
        setMaterias(['Matemáticas', 'Historia', 'Ciencias', 'Inglés']);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    obtenerDatos();
  }, []);

  // Función que actualiza las secciones según el grado seleccionado
  const manejarCambioGrado = (gradoSeleccionado) => {
    setGrado(gradoSeleccionado);
    
    // Simulación de secciones basadas en el grado seleccionado
    if (gradoSeleccionado === '7') {
      setSecciones(['7-1', '7-2', '7-3']);
    } else if (gradoSeleccionado === '8') {
      setSecciones(['8-1', '8-2', '8-3']);
    } else if (gradoSeleccionado === '9') {
      setSecciones(['9-1', '9-2']);
    } else {
      setSecciones([]);  // Si no se selecciona un grado válido, se vacía la lista de secciones
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    const datosFormulario = {
      profesorId,       // ID del profesor seleccionado
      grado,
      seccion,
      materia,
      horaInicio,
      horaFin,
      aula
    };

    try {
      // const respuesta = await fetch('/api/horario-profesor', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(datosFormulario),
      // });

      // if (respuesta.ok) {
      //   alert('Horario registrado con éxito');
      // } else {
      //   alert('Error al registrar el horario');
      // }
    } catch (error) {
      console.error('Error al enviar los datos del formulario:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Formulario de Horario para Profesor</h1>
      <form onSubmit={manejarEnvio} className="bg-white p-6 rounded-lg shadow-md">

        {/* Combo Box para Profesor */}
        <div className="mb-4">
          <label className="block text-gray-700">Profesor</label>
          <select
            className="border p-2 rounded-lg w-full"
            value={profesorId}
            onChange={(e) => setProfesorId(e.target.value)}
          >
            <option value="">Seleccione un profesor</option>
            {profesores.map((profesor) => (
              <option key={profesor.id} value={profesor.id}>
                {profesor.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Combo Box para Grado */}
        <div className="mb-4">
          <label className="block text-gray-700">Grado</label>
          <select
            className="border p-2 rounded-lg w-full"
            value={grado}
            onChange={(e) => manejarCambioGrado(e.target.value)}
          >
            <option value="">Seleccione un grado</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
          </select>
        </div>

        {/* Combo Box para Sección */}
        <div className="mb-4">
          <label className="block text-gray-700">Sección</label>
          <select
            className="border p-2 rounded-lg w-full"
            value={seccion}
            onChange={(e) => setSeccion(e.target.value)}
          >
            <option value="">Seleccione una sección</option>
            {secciones.map((seccion, index) => (
              <option key={index} value={seccion}>
                {seccion}
              </option>
            ))}
          </select>
        </div>

        {/* Combo Box para Materia */}
        <div className="mb-4">
          <label className="block text-gray-700">Materia</label>
          <select
            className="border p-2 rounded-lg w-full"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
          >
            <option value="">Seleccione una materia</option>
            {materias.map((materia, index) => (
              <option key={index} value={materia}>
                {materia}
              </option>
            ))}
          </select>
        </div>

        {/* Hora de Inicio */}
        <div className="mb-4">
          <label className="block text-gray-700">Hora de Inicio</label>
          <input
            type="time"
            className="border p-2 rounded-lg w-full"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
          />
        </div>

        {/* Hora de Fin */}
        <div className="mb-4">
          <label className="block text-gray-700">Hora de Fin</label>
          <input
            type="time"
            className="border p-2 rounded-lg w-full"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
          />
        </div>

        {/* Aula */}
        <div className="mb-4">
          <label className="block text-gray-700">Aula</label>
          <input
            type="text"
            className="border p-2 rounded-lg w-full"
            value={aula}
            onChange={(e) => setAula(e.target.value)}
            placeholder="Ej: A101"
          />
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Registrar Horario
        </button>
      </form>
    </div>
  );
};

export default FormularioHorarioProfesor;
