import { useState } from "react";
import { useGestionMatriculas } from "../Hooks/useGestionMatriculas";
import ConfirmDeleteModal from "../../Asistencias/components/ConfirmDeleteModal ";
export default function GestionMatricula() {
  const {
    matriculas,
    loading,
    error,
    searchTerm,
    handleSearchChange,
    handleUpdateEstado,
    handleDelete,
  } = useGestionMatriculas();

  // Estados del componente
  const [selectedMatricula, setSelectedMatricula] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [matriculaToDelete, setMatriculaToDelete] = useState(null);

  // Filtros adicionales: nivel y estado
  const [selectedNivelFilter, setSelectedNivelFilter] = useState("");
  const [selectedEstadoFilter, setSelectedEstadoFilter] = useState("");

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mapa para mostrar el nombre completo de la adecuación
  const adecuacionMap = {
    N: "No presenta",
    DA: "Adecuación de Acceso",
    S: "Adecuación Significativa",
    NS: "Adecuación No Significativa",
  };

  if (loading) {
    return <p>Cargando matrículas...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Al hacer clic en "Info", abrimos el modal con la matrícula seleccionada
  const handleInfo = (mat) => {
    setSelectedMatricula(mat);
  };

  // Cerrar modal de información
  const closeModal = () => {
    setSelectedMatricula(null);
  };

  // Abrir modal de confirmación para eliminación
  const openConfirmModal = (idMatricula) => {
    setMatriculaToDelete(idMatricula);
    setIsConfirmModalOpen(true);
  };

  // Confirmar eliminación
  const confirmDelete = () => {
    handleDelete(matriculaToDelete);
    setIsConfirmModalOpen(false);
  };

  // Obtener opciones únicas de nivel y estado de las matrículas
  const niveles = Array.from(
    new Set(matriculas.map((mat) => mat.estudiante.grado.nivel))
  );
  const estados = Array.from(new Set(matriculas.map((mat) => mat.estado_Matricula)));

  // Filtrado adicional: por nivel y estado
  const finalMatriculas = matriculas.filter((mat) => {
    const cumpleNivel =
      selectedNivelFilter === "" || mat.estudiante.grado.nivel === selectedNivelFilter;
    const cumpleEstado =
      selectedEstadoFilter === "" || mat.estado_Matricula === selectedEstadoFilter;
    return cumpleNivel && cumpleEstado;
  });

  // Paginación: calcular índices y subconjunto
  const totalItems = Math.min(finalMatriculas.length, 100); // máximo 100 registros
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedMatriculas = finalMatriculas.slice(indexOfFirst, indexOfLast);

  // Manejadores de paginación
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Matrículas</h2>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por cédula..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="border p-2 rounded-md"
        />
        <select
          value={selectedNivelFilter}
          onChange={(e) => {
            setSelectedNivelFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded-md"
        >
          <option value="">Todos los niveles</option>
          {niveles.map((nivel) => (
            <option key={nivel} value={nivel}>
              {nivel}
            </option>
          ))}
        </select>
        <select
          value={selectedEstadoFilter}
          onChange={(e) => {
            setSelectedEstadoFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded-md"
        >
          <option value="">Todos los estados</option>
          {estados.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Buscar
        </button>
      </div>

      {/* Tabla principal */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">N° boleta</th>
              <th className="px-4 py-2 border">Apellido1</th>
              <th className="px-4 py-2 border">Apellido2</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Cédula</th>
              <th className="px-4 py-2 border">Nivel</th>
              <th className="px-4 py-2 border">Periodo</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMatriculas.map((mat) => (
              <tr key={mat.id_Matricula}>
                <td className="px-4 py-2 border">{mat.id_Matricula}</td>
                <td className="px-4 py-2 border">{mat.estudiante.apellido1_Estudiante}</td>
                <td className="px-4 py-2 border">{mat.estudiante.apellido2_Estudiante}</td>
                <td className="px-4 py-2 border">{mat.estudiante.nombre_Estudiante}</td>
                <td className="px-4 py-2 border">{mat.estudiante.cedula}</td>
                <td className="px-4 py-2 border">{mat.estudiante.grado.nivel}</td>
                <td className="px-4 py-2 border">{mat.periodo.nombre_Periodo}</td>
                <td className="px-4 py-2 border">{mat.estado_Matricula}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => handleInfo(mat)}
                    className="bg-gray-300 px-2 py-1 rounded-md"
                  >
                    Info
                  </button>
                  {mat.estado_Matricula !== "AC" && (
                    <button
                      onClick={() =>
                        handleUpdateEstado(mat.id_Matricula, "Aceptado")
                      }
                      className="bg-green-500 text-white px-2 py-1 rounded-md"
                    >
                      Aceptar
                    </button>
                  )}
                  {mat.estado_Matricula !== "RE" && (
                    <button
                      onClick={() =>
                        handleUpdateEstado(mat.id_Matricula, "Rechazado")
                      }
                      className="bg-yellow-400 px-2 py-1 rounded-md"
                    >
                      Rechazar
                    </button>
                  )}
                  {mat.estado_Matricula === "RE" && (
                    <button
                      onClick={() => openConfirmModal(mat.id_Matricula)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {paginatedMatriculas.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  No se encontraron matrículas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Componentes de paginación */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* Modal de información adicional */}
      {selectedMatricula && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white w-11/12 md:w-1/2 p-6 rounded shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
            <h3 className="text-xl font-semibold mb-4">
              Detalles de la Matrícula
            </h3>
            <p>
              <strong>N° Boleta:</strong> {selectedMatricula.id_Matricula}
            </p>
            <p>
              <strong>Fecha Creación:</strong>{" "}
              {selectedMatricula.fecha_creacion_Matricula}
            </p>
            <p>
              <strong>Fecha Actualización:</strong>{" "}
              {selectedMatricula.fecha_actualizacion_Matricula}
            </p>
            <p>
              <strong>Estado:</strong> {selectedMatricula.estado_Matricula}
            </p>
            <p>
              <strong>Periodo:</strong>{" "}
              {selectedMatricula.periodo?.nombre_Periodo}
            </p>
            <h4 className="text-lg font-semibold mt-4">Datos del Estudiante</h4>
            <p>
              <strong>Nombre:</strong>{" "}
              {selectedMatricula.estudiante?.nombre_Estudiante}{" "}
              {selectedMatricula.estudiante?.apellido1_Estudiante}{" "}
              {selectedMatricula.estudiante?.apellido2_Estudiante}
            </p>
            <p>
              <strong>Cédula:</strong> {selectedMatricula.estudiante?.cedula}
            </p>
            <p>
              <strong>Edad:</strong> {selectedMatricula.estudiante?.edad}
            </p>
            <p>
              <strong>Sexo:</strong> {selectedMatricula.estudiante?.sexo}
            </p>
            <p>
              <strong>Nacionalidad:</strong>{" "}
              {selectedMatricula.estudiante?.nacionalidad}
            </p>
            <p>
              <strong>Lugar de Nacimiento:</strong>{" "}
              {selectedMatricula.estudiante?.lugar_de_nacimiento}
            </p>
            <p>
              <strong>Condición Migratoria:</strong>{" "}
              {selectedMatricula.estudiante?.condicion_migratoria}
            </p>
            <p>
              <strong>Institución de Procedencia:</strong>{" "}
              {selectedMatricula.estudiante?.institucion_de_procedencia}
            </p>
            <p>
              <strong>Presenta Enfermedad:</strong>{" "}
              {selectedMatricula.estudiante?.Presenta_alguna_enfermedad || "No"}
            </p>
            <p>
              <strong>Medicamentos:</strong>{" "}
              {selectedMatricula.estudiante?.medicamentos_que_debe_tomar || "N/A"}
            </p>
            <p>
              <strong>Ruta de Viaje:</strong>{" "}
              {selectedMatricula.estudiante?.Ruta_de_viaje || "N/A"}
            </p>
            <p>
              <strong>Tipo de Adecuación:</strong>{" "}
              {adecuacionMap[selectedMatricula.estudiante?.tipo_de_adecuacion] ||
                "Desconocido"}
            </p>
            <p>
              <strong>Recibe Religión:</strong>{" "}
              {selectedMatricula.estudiante?.recibe_religion}
            </p>
            <p>
              <strong>Presenta Carta:</strong>{" "}
              {selectedMatricula.estudiante?.presenta_carta}
            </p>
            <h4 className="text-lg font-semibold mt-4">Encargado Legal</h4>
            <p>
              <strong>Nombre:</strong>{" "}
              {selectedMatricula.encargadoLegal?.nombre_Encargado_Legal}{" "}
              {selectedMatricula.encargadoLegal?.apellido1_Encargado_Legal}{" "}
              {selectedMatricula.encargadoLegal?.apellido2_Encargado_Legal}
            </p>
            <p>
              <strong>Cédula:</strong>{" "}
              {selectedMatricula.encargadoLegal?.N_Cedula}
            </p>
            <p>
              <strong>Ocupación:</strong>{" "}
              {selectedMatricula.encargadoLegal?.ocupacion}
            </p>
            <p>
              <strong>Nacionalidad:</strong>{" "}
              {selectedMatricula.encargadoLegal?.nacionalidad}
            </p>
            <p>
              <strong>Dirección:</strong>{" "}
              {selectedMatricula.encargadoLegal?.direccion}
            </p>
            <p>
              <strong>Teléfono Celular:</strong>{" "}
              {selectedMatricula.encargadoLegal?.telefono_celular}
            </p>
            <p>
              <strong>Habitación:</strong>{" "}
              {selectedMatricula.encargadoLegal?.habitacion}
            </p>
            <p>
              <strong>Correo:</strong>{" "}
              {selectedMatricula.encargadoLegal?.correo}
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {isConfirmModalOpen && (
        <ConfirmDeleteModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={confirmDelete}
          title="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar esta matrícula?"
        />
      )}
    </div>
  );
}
