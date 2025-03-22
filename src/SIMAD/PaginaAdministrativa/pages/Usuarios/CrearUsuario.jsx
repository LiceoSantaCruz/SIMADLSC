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
    rol_Usuario: 2,
    materias: [],
  });

  const [materiasDisponibles, setMateriasDisponibles] = useState([]);
  const [materiasCargadas, setMateriasCargadas] = useState(false);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const API_BASE_URL =
    process.env.NODE_ENV === 'production'
      ? 'https://simadlsc-backend-production.up.railway.app'
      : 'http://localhost:3000';

  const fetchMaterias = async () => {
    if (materiasCargadas) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/materias`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setMateriasDisponibles(response.data);
      setMateriasCargadas(true);
    } catch (err) {
      console.error('Error al obtener las materias:', err);
      setError('No se pudo obtener la lista de materias');
    }
  };

  const filteredMaterias = materiasDisponibles.filter(
    (materia) => !newUser.materias.some((selected) => selected.id_Materia === materia.id_Materia)
  );

  const handleAddMateria = (materiaId) => {
    const materiaSeleccionada = materiasDisponibles.find((materia) => materia.id_Materia === materiaId);
    if (materiaSeleccionada) {
      setNewUser((prevState) => ({
        ...prevState,
        materias: [...prevState.materias, materiaSeleccionada],
      }));
    }
  };

  const handleRemoveMateria = (materiaId) => {
    setNewUser((prevState) => ({
      ...prevState,
      materias: prevState.materias.filter((materia) => materia.id_Materia !== materiaId),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: name === 'rol_Usuario' ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      if (!newUser.nombre_Usuario.trim()) throw new Error('El nombre no puede estar vacío');
      if (!newUser.apellido1_Usuario.trim()) throw new Error('El primer apellido no puede estar vacío');
      if (newUser.apellido1_Usuario.length > 100) throw new Error('El primer apellido no puede exceder 100 caracteres');
      if (newUser.apellido2_Usuario.length > 100) throw new Error('El segundo apellido no puede exceder 100 caracteres');

      // Validar materias si el rol es profesor
      if (newUser.rol_Usuario === 3 && newUser.materias.length === 0) {
        throw new Error('Debe seleccionar al menos una materia para el profesor');
      }

      const userToSubmit = {
        nombre_Usuario: newUser.nombre_Usuario,
        apellido1_Usuario: newUser.apellido1_Usuario,
        apellido2_Usuario: newUser.apellido2_Usuario,
        email_Usuario: newUser.email_Usuario,
        contraseña_Usuario: newUser.contraseña_Usuario,
        rol_Usuario: newUser.rol_Usuario,
        id_Materia: newUser.materias.map((materia) => materia.id_Materia),
      };

      console.log('Datos enviados al backend:', userToSubmit);

      await createUser(userToSubmit, token);

      setNewUser({
        nombre_Usuario: '',
        apellido1_Usuario: '',
        apellido2_Usuario: '',
        email_Usuario: '',
        contraseña_Usuario: '',
        rol_Usuario: 2,
        materias: [],
      });
      setMateriaSeleccionada('');
      setSuccess(true);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      setError(error.message || 'Ocurrió un error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
        <header className="mb-8">
          <button
            onClick={() => navigate(-1)}
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

        {success && (
          <div className="bg-green-100 text-black px-4 py-2 rounded mb-4 text-center">
            Usuario creado exitosamente.
          </div>
        )}

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
            <option value={1}>superAdmin</option>
            <option value={2}>admin</option>
            <option value={3}>profesor</option>
          </select>

          {newUser.rol_Usuario === 3 && (
            <div className="md:col-span-2">
              <label className="block text-black font-bold mb-2">Materias</label>
              <div className="flex flex-col space-y-2">
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

                <select
                  onFocus={fetchMaterias}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value, 10);
                    handleAddMateria(selectedId);
                    setMateriaSeleccionada('');
                  }}
                  value={materiaSeleccionada}
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-black"
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
