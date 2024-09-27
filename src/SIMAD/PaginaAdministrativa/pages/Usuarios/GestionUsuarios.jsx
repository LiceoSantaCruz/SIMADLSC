import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllUsers,
  deleteUser,
  toggleBlockUser,
} from "./services/useUserService"; // Servicio
import EditUserModal from "./components/EditUserModal"; // Modal para edición de usuario
import { useUserEdit } from "./hooks/useUserEdit"; // Hook para editar usuarios
import { useRoles } from "./hooks/useRoles"; // Hook para obtener roles
import ConfirmDeleteModal from "./components/ConfirmDeleteModal"; // Modal personalizado para confirmación de eliminación

const GestionUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Estado para controlar el modal de eliminación
  const [userToDelete, setUserToDelete] = useState(null); // Usuario a eliminar
  const { editUser } = useUserEdit();
  const token = localStorage.getItem("token"); // Recuperar el token

  // Hook para obtener los roles
  const { roles, loading: loadingRoles, error: rolesError } = useRoles(token);

  // Función para cargar usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers(token);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
      setError("Error al cargar los usuarios");
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchUsers();
  }, []);


  // Función para bloquear o desbloquear usuarios
  const handleBlockUser = async (id, bloqueado_Usuario) => {
    try {
      // Realiza la petición al backend para bloquear/desbloquear
      await toggleBlockUser(id, !bloqueado_Usuario, token);

      // Actualizamos el estado del usuario en el frontend para reflejar el cambio
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id_usuario === id
            ? { ...user, bloqueado_Usuario: !bloqueado_Usuario }
            : user
        )
      );
    } catch (error) {
      console.error("Error al bloquear/desbloquear el usuario:", error);
    }
  };

  // Función para eliminar usuario
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id, token);
      fetchUsers(); // Actualizar la lista de usuarios
      setDeleteModalOpen(false); // Cierra el modal después de eliminar
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  // Abrir el modal de confirmación de eliminación
  const openDeleteModal = (user) => {
    setUserToDelete(user); // Guardamos el usuario que se va a eliminar
    setDeleteModalOpen(true); // Abrimos el modal
  };

  // Abrir el modal de edición de usuario
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Guardar cambios del usuario
  const handleSaveUser = async (updatedData) => {
    await editUser(selectedUser.id_usuario, updatedData, token);
    setModalOpen(false);
    fetchUsers(); // Refresca la lista
  };

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow-md py-6 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Usuarios
          </h1>
          <Link
            to="/Crear-usuarios"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Crear Usuario
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Lista de Usuarios</h2>
        <div className="overflow-x-auto">
          {users.length > 0 ? (
            <table className="min-w-full table-auto bg-gray-50 shadow-sm rounded-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Nombre Completo</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Rol</th>
                  <th className="px-4 py-2 text-left">Bloqueado</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id_usuario} className="border-b">
                    <td className="px-4 py-2">{`${user.nombre_Usuario} ${user.apellido1_Usuario} ${user.apellido2_Usuario}`}</td>
                    <td className="px-4 py-2">{user.email_Usuario}</td>
                    <td className="px-4 py-2">{user.rol_Usuario.nombre_Rol}</td>
                    <td className="px-4 py-2">
                      {user.bloqueado_Usuario ? (
                        <span className="text-red-500">Sí</span>
                      ) : (
                        <span className="text-green-500">No</span>
                      )}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="bg-green-700 text-white px-2 py-1 rounded-lg hover:bg-yellow-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          handleBlockUser(
                            user.id_usuario,
                            user.bloqueado_Usuario
                          )
                        }
                        className={`px-2 py-1 rounded-lg text-white ${
                          user.bloqueado_Usuario
                            ? "bg-blue-400 hover:bg-blue-500" 
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {user.bloqueado_Usuario ? "Desbloquear" : "Bloquear"}
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>No hay usuarios disponibles.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para confirmar la eliminación del usuario */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => handleDeleteUser(userToDelete.id_usuario)}
        userName={`${userToDelete?.nombre_Usuario} ${userToDelete?.apellido1_Usuario}`}
      />

      {isModalOpen && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveUser}
          roles={roles}
          loadingRoles={loadingRoles}
          rolesError={rolesError}
          token={token}
        />
      )}
    </div>
  );
};

export default GestionUsuarios;
