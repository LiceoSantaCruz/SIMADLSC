import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from './services/useUserService';
import axios from 'axios';



const CrearUsuario = () => {
  const [newUser, setNewUser] = useState({
    nombre_Usuario: '',
    apellido1_Usuario: '',
    apellido2_Usuario: '',
    email_Usuario: '',
    contraseña_Usuario: '',
    rol_Usuario: 2, // Inicializa con el rol predeterminado, por ejemplo, "Administrativo"
    materias: [], // Lista de materias seleccionadas
  });

  const [materiasDisponibles, setMateriasDisponibles] = useState([]); // Materias disponibles desde el backend
  const [materiasCargadas, setMateriasCargadas] = useState(false); // Estado para verificar si las materias ya fueron cargadas
  const [loading, setLoading] = useState(false); // Estado de carga
  const [success, setSuccess] = useState(false); // Estado de éxito
  const [error, setError] = useState(null); // Estado de error

  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Asegúrate de que el token JWT esté almacenado en localStorage

  const API_BASE_URL =
  process.env.NODE_ENV === 'production'
  ? 'https://simadlsc-backend-production.up.railway.app'
  : 'http://localhost:3000';

// Función para obtener las materias desde el backend con Axios
const fetchMaterias = async () => {
if (materiasCargadas) return; // Evita múltiples solicitudes

try {
  const response = await axios.get(`${API_BASE_URL}/materias`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  setMateriasDisponibles(response.data); // Guardar materias
  setMateriasCargadas(true); // Marcar como cargadas
} catch (err) {
  console.error('Error al obtener las materias:', err);
  setError('No se pudo obtener la lista de materias');
}
};

// Filtrar materias disponibles para excluir las ya seleccionadas
const filteredMaterias = materiasDisponibles.filter(
  (materia) => !newUser.materias.some((selected) => selected.id_Materia === materia.id_Materia)
);

  // Manejar la selección de materias
  const handleAddMateria = (materiaId) => {
    const materiaSeleccionada = materiasDisponibles.find((materia) => materia.id_Materia === materiaId);
    if (materiaSeleccionada) {
      setNewUser((prevState) => ({
        ...prevState,
        materias: [...prevState.materias, materiaSeleccionada], // Agregar la materia seleccionada
      }));
    }
  };

  // Manejar la eliminación de materias seleccionadas
  const handleRemoveMateria = (materiaId) => {
    setNewUser((prevState) => ({
      ...prevState,
      materias: prevState.materias.filter((materia) => materia.id_Materia !== materiaId), // Remover la materia seleccionada
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: name === 'rol_Usuario' ? parseInt(value, 10) : value, // Convertimos rol_Usuario a número
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setLoading(true); // Indica que el formulario está en proceso de envío
    setSuccess(false);
    setError(null); // Resetea cualquier error anterior

    try {
      // Crear el objeto para enviar al backend (sin incluir id_Materia)
      const userToSubmit = {
        nombre_Usuario: newUser.nombre_Usuario,
        apellido1_Usuario: newUser.apellido1_Usuario,
        apellido2_Usuario: newUser.apellido2_Usuario,
        email_Usuario: newUser.email_Usuario,
        contraseña_Usuario: newUser.contraseña_Usuario,
        rol_Usuario: newUser.rol_Usuario,
      };

      // Validar que los campos no estén vacíos o excedan los límites
      if (!userToSubmit.nombre_Usuario.trim()) throw new Error('El nombre no puede estar vacío');
      if (!userToSubmit.apellido1_Usuario.trim()) throw new Error('El primer apellido no puede estar vacío');
      if (userToSubmit.apellido1_Usuario.length > 100) throw new Error('El primer apellido no puede exceder 100 caracteres');
      if (userToSubmit.apellido2_Usuario.length > 100) throw new Error('El segundo apellido no puede exceder 100 caracteres');

      // Muestra en la consola los datos que se enviarán al backend
      console.log('Datos enviados al backend:', userToSubmit);

      // Llamamos al servicio de crear usuario
      await createUser(userToSubmit, token);

      // Si fue exitoso, reseteamos el formulario
      setNewUser({
        nombre_Usuario: '',
        apellido1_Usuario: '',
        apellido2_Usuario: '',
        email_Usuario: '',
        contraseña_Usuario: '',
        rol_Usuario: 2, // Resetear al rol predeterminado
        materias: [], // Resetear la lista de materias
      });
      setSuccess(true); // Mostramos el mensaje de éxito
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      setError(error.message); // Mostramos el mensaje de error
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
        <header className="mb-8">
          {/* Botón de volver con flecha */}
          <button
            onClick={() => navigate(-1)} // Volver a la página anterior
            className="text-black flex items-center mb-4 hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L4.414 10l3.293 3.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Volver
          </button>
          <h1 className="text-3xl font-bold text-black text-center">Crear Nuevo Usuario</h1>
        </header>

        {/* Mostrar mensaje de éxito si el usuario fue creado */}
        {success && (
          <div className="bg-green-100 text-black px-4 py-2 rounded mb-4 text-center">
            Usuario creado exitosamente.
          </div>
        )}

        {/* Mostrar mensaje de error si ocurrió un error */}
        {error && (
          <div className="bg-red-100 text-black px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre_Usuario"
            value={newUser.nombre_Usuario}
            onChange={handleInputChange}
            placeholder="Nombre"
            className="border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
          <input
            type="text"
            name="apellido1_Usuario"
            value={newUser.apellido1_Usuario}
            onChange={handleInputChange}
            placeholder="Primer Apellido"
            className="border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
          <input
            type="text"
            name="apellido2_Usuario"
            value={newUser.apellido2_Usuario}
            onChange={handleInputChange}
            placeholder="Segundo Apellido"
            className="border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="email"
            name="email_Usuario"
            value={newUser.email_Usuario}
            onChange={handleInputChange}
            placeholder="Correo Electrónico"
            className="border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
            autoComplete="off"
          />
          <input
            type="password"
            name="contraseña_Usuario"
            value={newUser.contraseña_Usuario}
            onChange={handleInputChange}
            placeholder="Contraseña"
            className="border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
            autoComplete="off"
          />

          <select
            name="rol_Usuario"
            value={newUser.rol_Usuario}
            onChange={handleInputChange}
            className="border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            {/* Excluir la opción de "Estudiante" */}
            <option value={1}>superAdmin</option>
            <option value={2}>admin</option>
            <option value={3}>profesor</option>
            {/* No incluimos el rol de estudiante */}
          </select>

          {/* Campo adicional para la materia si el rol es profesor */}
          {newUser.rol_Usuario === 3 && (
            <div className="md:col-span-2">
              <label className="block text-black font-bold mb-2">Materias</label>
              <div className="flex flex-col space-y-2">
                {/* Lista de materias seleccionadas */}
                {newUser.materias.map((materia) => (
                  <div key={materia.id_Materia} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span className="text-black">{materia.nombre_Materia}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMateria(materia.id_Materia)}
                      className="text-red-500 hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
                {/* Select para agregar materias */}
                <select
                  onFocus={fetchMaterias} // Cargar materias al interactuar con el campo
                  onChange={(e) => handleAddMateria(parseInt(e.target.value, 10))}
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-black"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Seleccionar Materia
                  </option>
                  {filteredMaterias.map((materia) => (
                    <option key={materia.id_Materia} value={materia.id_Materia}>
                      {materia.nombre_Materia}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className={`bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-indigo-700 ${
                loading ? 'cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuario;
