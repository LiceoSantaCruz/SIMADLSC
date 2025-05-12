import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllUsers, deleteUser, toggleBlockUser } from "./services/useUserService";
import EditUserModal from "./components/EditUserModal";
import { useUserEdit } from "./hooks/useUserEdit";
import { useRoles } from "./hooks/useRoles";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GestionUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { editUser } = useUserEdit();
  const token = localStorage.getItem("token");

  const [selectedRole, setSelectedRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  const { roles, loading: loadingRoles, error: rolesError } = useRoles(token);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los usuarios");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la lista de usuarios.",
        confirmButtonColor: "#2563EB",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockUser = async (id, bloqueado) => {
    try {
      await toggleBlockUser(id, !bloqueado, token);
      Swal.fire({
        icon: "success",
        title: bloqueado ? "Desbloqueado" : "Bloqueado",
        confirmButtonColor: "#2563EB",
      });
      setUsers((u) =>
        u.map(user =>
          user.id_usuario === id
            ? { ...user, bloqueado_Usuario: !bloqueado }
            : user
        )
      );
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id, token);
      Swal.fire({
        icon: "success",
        title: "Usuario Eliminado",
        confirmButtonColor: "#2563EB",
      });
      fetchUsers();
      setDeleteModalOpen(false);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar al usuario.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleSaveUser = async (updatedData) => {
    try {
      await editUser(selectedUser.id_usuario, updatedData, token);
      Swal.fire({
        icon: "success",
        title: "Usuario Actualizado",
        confirmButtonColor: "#2563EB",
      });
      setModalOpen(false);
      fetchUsers();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el usuario.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  // Filtrado combinado
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.nombre_Usuario} ${user.apellido1_Usuario} ${user.apellido2_Usuario}`.toLowerCase();
    const matchesName = fullName.includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole ? user.rol_Usuario.nombre_Rol === selectedRole : true;
    return matchesName && matchesRole;
  });

  // Paginación
  const indexLast = currentPage * usersPerPage;
  const indexFirst = indexLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const maxButtons = 6;
  let startPage, endPage;
  if (totalPages <= maxButtons) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const half = Math.floor(maxButtons / 2);
    if (currentPage <= half) {
      startPage = 1;
      endPage = maxButtons;
    } else if (currentPage + half >= totalPages) {
      startPage = totalPages - maxButtons + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - half;
      endPage = startPage + maxButtons - 1;
    }
  }
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-full bg-gray-100 p-6 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Lista de usuarios
          </h2>
          <Link
            to="/Crear-usuarios"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Crear usuario
          </Link>
        </div>

        {/* Buscador y filtro a la par, mismo tamaño y con título */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="searchBar" className="block mb-1 font-medium text-gray-700 dark:text-white">
              Buscar por nombre completo:
            </label>
            <input
              id="searchBar"
              type="text"
              placeholder="Escribe un nombre..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="roleFilter" className="block mb-1 font-medium text-gray-700 dark:text-white">
              Filtrar por rol:
            </label>
            <select
              id="roleFilter"
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="">Todos los roles</option>
              {roles.map(r => (
                <option key={r.id_Rol} value={r.nombre_Rol}>
                  {r.nombre_Rol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          {currentUsers.length > 0 ? (
            <table className="min-w-full table-auto bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
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
                {currentUsers.map(user => (
                  <tr key={user.id_usuario} className="border-b dark:border-gray-600">
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
                      {user.bloqueado_Usuario
                        ? <span className="text-red-500">Sí</span>
                        : <span className="text-green-500">No</span>}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="bg-green-700 text-white px-2 py-1 rounded-lg hover:bg-green-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleBlockUser(user.id_usuario, user.bloqueado_Usuario)}
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
              No hay usuarios disponibles.
            </div>
          )}
        </div>

        {/* Paginación */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 flex justify-center items-center rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {pages.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`w-10 h-10 flex justify-center items-center rounded text-sm font-medium ${
                currentPage === number
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex justify-center items-center rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modales */}
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
