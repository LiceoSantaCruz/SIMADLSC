import { useState } from "react";
import { useGestionMatriculas } from "../Hooks/useGestionMatriculas";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";

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

  // Función para mostrar información detallada mediante SweetAlert2
  const showInfo = (mat) => {
    const htmlContent = `
      <p><strong>N° Boleta:</strong> ${mat.id_Matricula}</p>
      <p><strong>Fecha Creación:</strong> ${mat.fecha_creacion_Matricula}</p>
      <p><strong>Fecha Actualización:</strong> ${mat.fecha_actualizacion_Matricula}</p>
      <p><strong>Estado:</strong> ${mat.estado_Matricula}</p>
      <p><strong>Periodo:</strong> ${mat.periodo?.nombre_Periodo || ""}</p>
      <hr/>
      <h4>Datos del Estudiante</h4>
      <p><strong>Nombre:</strong> ${mat.estudiante?.nombre_Estudiante} ${mat.estudiante?.apellido1_Estudiante} ${mat.estudiante?.apellido2_Estudiante || ""}</p>
      <p><strong>Cédula:</strong> ${mat.estudiante?.cedula}</p>
      <p><strong>Edad:</strong> ${mat.estudiante?.edad}</p>
      <p><strong>Sexo:</strong> ${mat.estudiante?.sexo}</p>
      <p><strong>Nacionalidad:</strong> ${mat.estudiante?.nacionalidad}</p>
      <p><strong>Lugar de Nacimiento:</strong> ${mat.estudiante?.lugar_de_nacimiento}</p>
      <p><strong>Motivo de la Matrícula:</strong> ${mat.estudiante?.motivo_matricula || "N/A"}</p>
      <p><strong>Condición Migratoria:</strong> ${mat.estudiante?.condicion_migratoria}</p>
      <p><strong>Institución de Procedencia:</strong> ${mat.estudiante?.institucion_de_procedencia}</p>
      <p><strong>Presenta Enfermedad:</strong> ${mat.estudiante?.Presenta_alguna_enfermedad || "No"}</p>
      <p><strong>Medicamentos:</strong> ${mat.estudiante?.medicamentos_que_debe_tomar || "N/A"}</p>
      <p><strong>Ruta de Viaje:</strong> ${mat.estudiante?.Ruta_de_viaje || "N/A"}</p>
      <p><strong>Tipo de Adecuación:</strong> ${
        adecuacionMap[mat.estudiante?.tipo_de_adecuacion] || "Desconocido"
      }</p>
      <p><strong>Recibe Religión:</strong> ${mat.estudiante?.recibe_religion}</p>
      <p><strong>Presenta Carta:</strong> ${mat.estudiante?.presenta_carta}</p>
      <hr/>
      <h4>Datos del Encargado Legal</h4>
      <p><strong>Nombre:</strong> ${mat.encargadoLegal?.nombre_Encargado_Legal} ${mat.encargadoLegal?.apellido1_Encargado_Legal} ${mat.encargadoLegal?.apellido2_Encargado_Legal || ""}</p>
      <p><strong>Cédula:</strong> ${mat.encargadoLegal?.N_Cedula}</p>
      <p><strong>Ocupación:</strong> ${mat.encargadoLegal?.ocupacion}</p>
      <p><strong>Nacionalidad:</strong> ${mat.encargadoLegal?.nacionalidad}</p>
      <p><strong>Dirección:</strong> ${mat.encargadoLegal?.direccion}</p>
      <p><strong>Teléfono Celular:</strong> ${mat.encargadoLegal?.telefono_celular}</p>
      <p><strong>Habitación:</strong> ${mat.encargadoLegal?.habitacion}</p>
      <p><strong>Correo:</strong> ${mat.encargadoLegal?.correo}</p>
    `;
    Swal.fire({
      title: "Detalles de la Matrícula",
      html: htmlContent,
      confirmButtonColor: "#2563EB",
    });
  };

  // Función para confirmar la eliminación
  const showDeleteConfirm = (idMatricula) => {
    Swal.fire({
      icon: "warning",
      title: "Confirmar Eliminación",
      text: "¿Estás seguro de que deseas eliminar esta matrícula?",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563EB",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(idMatricula);
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "La matrícula ha sido eliminada.",
          confirmButtonColor: "#2563EB",
        });
      }
    });
  };

  // Opciones únicas de nivel y estado
  const niveles = Array.from(
    new Set(matriculas.map((mat) => mat.estudiante.grado.nivel))
  );
  const estados = Array.from(
    new Set(matriculas.map((mat) => mat.estado_Matricula))
  );

  // Filtrado adicional por nivel y estado
  const finalMatriculas = matriculas.filter((mat) => {
    const cumpleNivel =
      selectedNivelFilter === "" ||
      mat.estudiante.grado.nivel === selectedNivelFilter;
    const cumpleEstado =
      selectedEstadoFilter === "" ||
      mat.estado_Matricula === selectedEstadoFilter;
    return cumpleNivel && cumpleEstado;
  });

  // Ordenar matrículas: pendientes (1), rechazadas (2) y aceptadas (3)
  const sortMatriculas = (data) => {
    const orderMap = {
      RE: 2,
      AC: 3,
    };
    return [...data].sort((a, b) => {
      const aOrder = orderMap[a.estado_Matricula] || 1;
      const bOrder = orderMap[b.estado_Matricula] || 1;
      return aOrder - bOrder;
    });
  };

  const sortedMatriculas = sortMatriculas(finalMatriculas);

  // Paginación: máximo 100 registros
  const totalItems = Math.min(sortedMatriculas.length, 100);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedMatriculas = sortedMatriculas.slice(indexOfFirst, indexOfLast);

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
              <tr key={mat.id_Matricula} className="text-center">
                <td className="px-4 py-2 border">{mat.id_Matricula}</td>
                <td className="px-4 py-2 border">
                  {mat.estudiante.apellido1_Estudiante}
                </td>
                <td className="px-4 py-2 border">
                  {mat.estudiante.apellido2_Estudiante}
                </td>
                <td className="px-4 py-2 border">
                  {mat.estudiante.nombre_Estudiante}
                </td>
                <td className="px-4 py-2 border">
                  {mat.estudiante.cedula}
                </td>
                <td className="px-4 py-2 border">
                  {mat.estudiante.grado.nivel}
                </td>
                <td className="px-4 py-2 border">
                  {mat.periodo.nombre_Periodo}
                </td>
                <td className="px-4 py-2 border">
                  {mat.estado_Matricula}
                </td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => showInfo(mat)}
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
                  {mat.estado_Matricula !== "AC" &&
                    mat.estado_Matricula !== "RE" && (
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
                      onClick={() => showDeleteConfirm(mat.id_Matricula)}
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

      {/* Controles de paginación */}
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
    </div>
  );
}