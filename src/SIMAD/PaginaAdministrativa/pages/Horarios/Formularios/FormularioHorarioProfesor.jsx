import { useState, useEffect } from 'react';

const FormularioHorarioProfesor = () => {
  const [grado, setGrado] = useState('');               // Estado para el grado del profesor
  const [seccion, setSeccion] = useState('');           // Estado para la sección seleccionada
  const [materia, setMateria] = useState('');           // Estado para la materia seleccionada
  const [dia, setDia] = useState('');                   // Estado para el día seleccionado
  const [rangoHoras, setRangoHoras] = useState('');     // Estado para el rango de horas (inicio y fin)
  const [aula, setAula] = useState('');                 // Estado para el aula
  const [profesorId, setProfesorId] = useState('');     // Estado para el ID del profesor seleccionado

  const [secciones, setSecciones] = useState([]);       // Lista de secciones obtenida del backend
  const [materias, setMaterias] = useState([]);         // Lista de materias obtenida del backend
  const [profesores, setProfesores] = useState([]);     // Lista de profesores obtenida del backend

  useEffect(() => {
    // Simulación de petición al backend para obtener profesores, materias, y secciones
    const obtenerDatos = async () => {
      try {
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

    const [horaInicio, horaFin] = rangoHoras.split(' - ');

    const datosFormulario = {
      profesorId,       // ID del profesor seleccionado
      grado,
      seccion,
      materia,
      dia,
      horaInicio,
      horaFin,
      aula
    };

    try {
      // Simulación del envío de los datos al backend
      console.log('Datos enviados:', datosFormulario);
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

        {/* Combo Box para Día */}
        <div className="mb-4">
          <label className="block text-gray-700">Día</label>
          <select
            className="border p-2 rounded-lg w-full"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
          >
            <option value="">Seleccione un día</option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
          </select>
        </div>

        {/* Combo Box para Rango de Horas */}
        <div className="mb-4">
          <label className="block text-gray-700">Hora (Inicio - Fin)</label>
          <select
            className="border p-2 rounded-lg w-full"
            value={rangoHoras}
            onChange={(e) => setRangoHoras(e.target.value)}
          >
            <option value="">Seleccione un rango de horas</option>
            <option value="07:00 - 08:00">07:00 - 08:00</option>
            <option value="08:00 - 09:30">08:00 - 09:30</option>
            <option value="10:00 - 11:30">10:00 - 11:30</option>
            <option value="12:00 - 13:30">12:00 - 13:30</option>
            <option value="14:00 - 15:30">14:00 - 15:30</option>
          </select>
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
