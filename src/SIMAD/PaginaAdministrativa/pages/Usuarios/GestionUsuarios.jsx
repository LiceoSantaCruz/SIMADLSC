import { useEffect, useState } from "react";
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
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GestionUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Modal de eliminación
  const [userToDelete, setUserToDelete] = useState(null); // Usuario a eliminar

  const { editUser } = useUserEdit();
  const token = localStorage.getItem("token");

  const [selectedRole, setSelectedRole] = useState(""); // Filtro por rol
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const usersPerPage = 7; // Usuarios por página
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda

  // Hook para obtener roles
  const { roles, loading: loadingRoles, error: rolesError } = useRoles(token);

  // Función para cargar usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers(token);
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar los usuarios:", err);
      setError("Error al cargar los usuarios");
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la lista de usuarios. Revisa la consola o contacta al administrador.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para bloquear/desbloquear usuarios
  const handleBlockUser = async (id, bloqueado_Usuario) => {
    try {
      await toggleBlockUser(id, !bloqueado_Usuario, token);
      Swal.fire({
        icon: "success",
        title: "Operación exitosa",
        text: bloqueado_Usuario
          ? "El usuario ha sido desbloqueado correctamente."
          : "El usuario ha sido bloqueado correctamente.",
        confirmButtonColor: "#2563EB",
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id_usuario === id
            ? { ...user, bloqueado_Usuario: !bloqueado_Usuario }
            : user
        )
      );
    } catch (error) {
      console.error("Error al bloquear/desbloquear el usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo bloquear/desbloquear al usuario. Intenta de nuevo.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  // Función para eliminar usuario
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id, token);
      Swal.fire({
        icon: "success",
        title: "Usuario Eliminado",
        text: "El usuario ha sido eliminado correctamente.",
        confirmButtonColor: "#2563EB",
      });
      fetchUsers();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar al usuario. Intenta de nuevo.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  // Abrir modal de eliminación
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  // Abrir modal de edición
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Guardar cambios del usuario
  const handleSaveUser = async (updatedData) => {
    try {
      await editUser(selectedUser.id_usuario, updatedData, token);
      Swal.fire({
        icon: "success",
        title: "Usuario Actualizado",
        text: "Los datos del usuario se han actualizado correctamente.",
        confirmButtonColor: "#2563EB",
      });
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Error al actualizar el usuario:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el usuario. Intenta de nuevo.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  // Filtrar usuarios por nombre y rol
  const filteredUsers = users
    .filter((user) =>
      `${user.nombre_Usuario} ${user.apellido1_Usuario} ${user.apellido2_Usuario}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((user) =>
      selectedRole ? user.rol_Usuario.nombre_Rol === selectedRole : true
    );

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const maxButtons = 6;
  let startPage, endPage;
  if (totalPages <= maxButtons) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= Math.floor(maxButtons / 2)) {
      startPage = 1;
      endPage = maxButtons;
    } else if (currentPage + Math.floor(maxButtons / 2) - 1 >= totalPages) {
      startPage = totalPages - maxButtons + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(maxButtons / 2) + 1;
      endPage = startPage + maxButtons - 1;
    }
  }

  // Función para cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-full bg-gray-100 p-6 dark:bg-gray-900">
      <header className="py-4 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center"></div>
      </header>

      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Lista de Usuarios
          </h2>
          <Link
            to="/Crear-usuarios"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Crear Usuario
          </Link>
        </div>

        {/* Buscador */}
        <div className="mb-4">
          <label
            htmlFor="searchBar"
            className="block text-gray-700 dark:text-white font-medium"
          >
            Buscar por Nombre:
          </label>
          <input
            id="searchBar"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Escribe un nombre..."
            className="mt-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full bg-white dark:bg-gray-700 text-black dark:text-white"
          />
        </div>

        {/* Filtro por rol */}
        <div className="mb-4">
          <label
            htmlFor="roleFilter"
            className="block text-gray-700 dark:text-white font-medium"
          >
            Filtrar por Rol:
          </label>
          <select
            id="roleFilter"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mt-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full bg-white dark:bg-gray-700 text-black dark:text-white"
          >
            <option value="">Todos</option>
            {roles.map((role) => (
              <option key={role.id_Rol} value={role.nombre_Rol}>
                {role.nombre_Rol}
              </option>
            ))}
          </select>
        </div>

        {/* Tabla de usuarios */}
        <div className="overflow-x-auto">
          {currentUsers.length > 0 ? (
            <table className="min-w-full table-auto bg-gray-50 dark:bg-gray-700 shadow-sm rounded-lg">
              <thead className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Nombre Completo</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Rol</th>
                  <th className="px-4 py-2 text-left">Bloqueado</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user.id_usuario}
                    className="border-b dark:border-gray-600"
                  >
                    <td className="px-4 py-2 text-black dark:text-white">
                      {`${user.nombre_Usuario} ${user.apellido1_Usuario} ${user.apellido2_Usuario}`}
                    </td>
                    <td className="px-4 py-2 text-black dark:text-white">
                      {user.email_Usuario}
                    </td>
                    <td className="px-4 py-2 text-black dark:text-white">
                      {user.rol_Usuario.nombre_Rol}
                    </td>
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
                          handleBlockUser(user.id_usuario, user.bloqueado_Usuario)
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
            <div className="text-center text-gray-500 py-10 dark:text-gray-300">
              <p>No hay usuarios disponibles.</p>
            </div>
          )}
        </div>

        {/* Paginación personalizada */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          {/* Botón anterior */}
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="mx-1 w-10 h-10 flex justify-center items-center rounded text-sm transition bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
            const pageNumber = startPage + idx;
            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`mx-1 w-10 h-10 flex justify-center items-center rounded text-sm transition font-medium ${
                  currentPage === pageNumber
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          {/* Botón siguiente */}
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="mx-1 w-10 h-10 flex justify-center items-center rounded text-sm transition bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => handleDeleteUser(userToDelete.id_usuario)}
        userName={`${userToDelete?.nombre_Usuario} ${userToDelete?.apellido1_Usuario}`}
      />

      {/* Modal de edición de usuario */}
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
