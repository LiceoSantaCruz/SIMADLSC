import { useState, useEffect } from 'react';

const FormularioHorarioEstudiante = () => {
  const [grado, setGrado] = useState('');               // Estado para el grado del estudiante
  const [seccion, setSeccion] = useState('');           // Estado para la sección seleccionada
  const [profesor, setProfesor] = useState('');         // Estado para el nombre del profesor
  const [materia, setMateria] = useState('');           // Estado para la materia seleccionada
  const [horaInicio, setHoraInicio] = useState('');     // Estado para la hora de inicio de la clase
  const [horaFin, setHoraFin] = useState('');           // Estado para la hora de fin de la clase
  const [aula, setAula] = useState('');                 // Estado para el aula

  const [secciones, setSecciones] = useState([]);       // Lista de secciones obtenida del backend
  const [materias, setMaterias] = useState([]);         // Lista de materias obtenida del backend

  useEffect(() => {
    // Simulación de petición al backend para obtener materias
    const obtenerMaterias = async () => {
      try {
        // const respuestaMaterias = await fetch('/api/materias');
        // const materiasData = await respuestaMaterias.json();
        // setMaterias(materiasData);

        // Simulación de datos de materias
        setMaterias(['Matemáticas', 'Historia', 'Ciencias', 'Inglés']);
      } catch (error) {
        console.error('Error al obtener materias:', error);
      }
    };

    obtenerMaterias();
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
      grado,
      seccion,
      profesor,
      materia,
      horaInicio,
      horaFin,
      aula
    };

    try {
      // const respuesta = await fetch('/api/horario-estudiante', {
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
      <h1 className="text-3xl font-bold mb-6">Formulario de Horario para Estudiante</h1>
      <form onSubmit={manejarEnvio} className="bg-white p-6 rounded-lg shadow-md">

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

        {/* Profesor */}
        <div className="mb-4">
          <label className="block text-gray-700">Profesor</label>
          <input
            type="text"
            className="border p-2 rounded-lg w-full"
            value={profesor}
            onChange={(e) => setProfesor(e.target.value)}
            placeholder="Nombre del profesor"
          />
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

export default FormularioHorarioEstudiante;
