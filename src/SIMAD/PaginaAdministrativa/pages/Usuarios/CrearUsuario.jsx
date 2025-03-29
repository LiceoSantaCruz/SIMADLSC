import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, getAllMaterias } from '../Usuarios/services/useUserService';
import Swal from 'sweetalert2';
import "@sweetalert2/theme-bulma/bulma.css";
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

  const fetchMaterias = async () => {
    if (materiasCargadas) return;
    try {
      const data = await getAllMaterias(token);
      setMateriasDisponibles(data);
      setMateriasCargadas(true);
    } catch (err) {
      console.error('Error al obtener las materias:', err);
      setError('No se pudo obtener la lista de materias');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener la lista de materias. Verifica tu conexión o contacta al administrador.',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  const filteredMaterias = materiasDisponibles.filter(
    (materia) =>
      !newUser.materias.some((selected) => selected.id_Materia === materia.id_Materia)
  );

  const handleAddMateria = (materiaId) => {
    const materiaSeleccionadaObj = materiasDisponibles.find(
      (materia) => materia.id_Materia === materiaId
    );
    if (materiaSeleccionadaObj) {
      setNewUser((prev) => ({
        ...prev,
        materias: [...prev.materias, materiaSeleccionadaObj],
      }));
    }
  };

  const handleRemoveMateria = (materiaId) => {
    setNewUser((prev) => ({
      ...prev,
      materias: prev.materias.filter((materia) => materia.id_Materia !== materiaId),
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

    // VALIDACIONES CON MENSAJES PERSONALIZADOS
    if (!newUser.nombre_Usuario.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'El nombre no puede estar vacío.',
        confirmButtonColor: '#2563EB',
      });
      setLoading(false);
      return;
    }
    if (!newUser.apellido1_Usuario.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'El primer apellido no puede estar vacío.',
        confirmButtonColor: '#2563EB',
      });
      setLoading(false);
      return;
    }
    if (newUser.apellido1_Usuario.length > 100) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'El primer apellido no puede exceder 100 caracteres.',
        confirmButtonColor: '#2563EB',
      });
      setLoading(false);
      return;
    }
    if (newUser.apellido2_Usuario.length > 100) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'El segundo apellido no puede exceder 100 caracteres.',
        confirmButtonColor: '#2563EB',
      });
      setLoading(false);
      return;
    }
    if (!newUser.email_Usuario.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'El correo electrónico no puede estar vacío.',
        confirmButtonColor: '#2563EB',
      });
      setLoading(false);
      return;
    }
    if (!newUser.contraseña_Usuario.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'La contraseña no puede estar vacía.',
        confirmButtonColor: '#2563EB',
      });
      setLoading(false);
      return;
    }
    if (newUser.rol_Usuario === 3 && newUser.materias.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Debe seleccionar al menos una materia para el profesor.',
        confirmButtonColor: '#2563EB',
      });
      setLoading(false);
      return;
    }

    try {
      const userToSubmit = {
        nombre_Usuario: newUser.nombre_Usuario,
        apellido1_Usuario: newUser.apellido1_Usuario,
        apellido2_Usuario: newUser.apellido2_Usuario,
        email_Usuario: newUser.email_Usuario,
        contraseña_Usuario: newUser.contraseña_Usuario,
        rol_Usuario: newUser.rol_Usuario,
        id_Materia: newUser.materias.map((materia) => materia.id_Materia),
      };

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

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Usuario creado exitosamente.',
        confirmButtonColor: '#2563EB',
      });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      setError(error.message || 'Ocurrió un error al crear el usuario');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ocurrió un error al crear el usuario.',
        confirmButtonColor: '#2563EB',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 dark:bg-gray-900">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <header className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-black dark:text-white flex items-center mb-4 hover:underline"
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
          <h1 className="text-3xl font-bold text-black dark:text-white text-center">
            Crear Nuevo Usuario
          </h1>
        </header>

        {success && (
          <div className="bg-green-100 dark:bg-green-800 text-black dark:text-white px-4 py-2 rounded mb-4 text-center">
            Usuario creado exitosamente.
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-800 text-black dark:text-white px-4 py-2 rounded mb-4 text-center">
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
            className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
          <input
            type="text"
            name="apellido1_Usuario"
            value={newUser.apellido1_Usuario}
            onChange={handleInputChange}
            placeholder="Primer Apellido"
            className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
          <input
            type="text"
            name="apellido2_Usuario"
            value={newUser.apellido2_Usuario}
            onChange={handleInputChange}
            placeholder="Segundo Apellido"
            className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="email"
            name="email_Usuario"
            value={newUser.email_Usuario}
            onChange={handleInputChange}
            placeholder="Correo Electrónico"
            className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
            autoComplete="off"
          />
          <input
            type="password"
            name="contraseña_Usuario"
            value={newUser.contraseña_Usuario}
            onChange={handleInputChange}
            placeholder="Contraseña"
            className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
            autoComplete="off"
          />

          <select
            name="rol_Usuario"
            value={newUser.rol_Usuario}
            onChange={handleInputChange}
            className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value={1}>superAdmin</option>
            <option value={2}>admin</option>
            <option value={3}>profesor</option>
          </select>

          {newUser.rol_Usuario === 3 && (
            <div className="md:col-span-2">
              <label className="block text-black dark:text-white font-bold mb-2">Materias</label>
              <div className="flex flex-col space-y-2">
                {newUser.materias.map((materia) => (
                  <div key={materia.id_Materia} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    <span className="text-black dark:text-white">{materia.nombre_Materia}</span>
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
                  className="border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
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
              className={`bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-indigo-700 ${loading ? 'cursor-not-allowed' : ''}`}
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