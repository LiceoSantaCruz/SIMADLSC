// File: src/Pages/GestionAsistencia.jsx
import { useEffect, useState, useMemo } from "react";
import { useDatosIniciales } from "./Hook/useDatosIniciales";
import {
  obtenerGestionAsistencias,
  obtenerTodasLasAsistencias,
  actualizarAsistencia,
  eliminarAsistencia,
} from "./Services/GestionAsistenciaService";
import { usePeriodos } from "./Hook/usePeriodos";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";

export const GestionAsistencia = () => {
  const { materias, grados, secciones } = useDatosIniciales();
  const { periodos } = usePeriodos();

  const [asistencias, setAsistencias] = useState([]);
  const [filtros, setFiltros] = useState({
    periodo: "",
    fecha: "",
    grado: "",
    materia: "",
    seccion: "",
  });
  const [error, setError] = useState("");

  // Paginación: 15 items por página, máximo 100 registros.
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const parseError = (_err, defaultMessage) => defaultMessage;

  const validateFiltros = () => {
    if (!filtros.periodo || !filtros.grado || !filtros.materia || !filtros.seccion) {
      return {
        isValid: false,
        message:
          "Por favor, seleccione todos los campos requeridos (Periodo, Grado, Materia y Sección).",
      };
    }
    if (filtros.fecha && new Date(filtros.fecha) > new Date()) {
      return {
        isValid: false,
        message: "La fecha seleccionada no puede ser mayor a la fecha actual.",
      };
    }
    return { isValid: true };
  };

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const data = await obtenerTodasLasAsistencias();
        setAsistencias(data);
        setError("");
      } catch (err) {
        const errorMessage = parseError(
          err,
          "Ha ocurrido un problema al obtener las asistencias. Por favor, intente de nuevo más tarde."
        );
        setError(errorMessage);
        setAsistencias([]);
        Swal.fire({ icon: "error", title: "Error", text: errorMessage, confirmButtonColor: "#2563EB" });
      }
    };
    fetchAsistencias();
  }, []);

  const handleBuscar = async () => {
    const { isValid, message } = validateFiltros();
    if (!isValid) {
      return Swal.fire({
        icon: "warning",
        title: "Validación",
        text: message,
        confirmButtonColor: "#2563EB",
      });
    }
    try {
      const data = await obtenerGestionAsistencias(filtros);
      if (data.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Sin resultados",
          text: "No se encontraron asistencias con los criterios de búsqueda.",
          confirmButtonColor: "#2563EB",
        });
        setAsistencias([]);
      } else {
        setAsistencias(data);
      }
    } catch (err) {
      const errorMessage = parseError(
        err,
        "Ocurrió un problema durante la búsqueda. Por favor, verifique los datos ingresados y vuelva a intentarlo."
      );
      setError(errorMessage);
      setAsistencias([]);
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: errorMessage,
        confirmButtonColor: "#2563EB",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const handleEditar = async (id) => {
    const asistencia = asistencias.find((a) => a.asistencia_id === id);
    if (!asistencia) return;

    const { value: formValues } = await Swal.fire({
      title: "Editar Asistencia",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Estado" value="${asistencia.estado}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Lecciones" value="${
          Array.isArray(asistencia.lecciones)
            ? asistencia.lecciones.join(", ")
            : asistencia.lecciones
        }">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563EB",
      preConfirm: () => {
        const estado = document.getElementById("swal-input1").value;
        const lecciones = document.getElementById("swal-input2").value;
        if (!estado) Swal.showValidationMessage("El campo Estado es obligatorio");
        return { estado, lecciones };
      },
    });

    if (!formValues) return;

    const newLecciones = formValues.lecciones
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l)
      .join(", ");
    const oldLecciones = Array.isArray(asistencia.lecciones)
      ? asistencia.lecciones.join(", ")
      : asistencia.lecciones;
    if (formValues.estado === asistencia.estado && newLecciones === oldLecciones) {
      return Swal.fire({
        icon: "warning",
        title: "Sin cambios",
        text: "No se detectaron cambios en la asistencia.",
        confirmButtonColor: "#2563EB",
      });
    }
    const updatedData = {
      estado: formValues.estado,
      lecciones: formValues.lecciones.split(",").map((l) => l.trim()).filter((l) => l),
    };
    try {
      await actualizarAsistencia(id, updatedData);
      setAsistencias(
        asistencias.map((a) =>
          a.asistencia_id === id ? { ...a, ...updatedData } : a
        )
      );
      Swal.fire({
        icon: "success",
        title: "Actualización exitosa",
        confirmButtonColor: "#2563EB",
      });
    } catch (err) {
      const errorMessage = parseError(
        err,
        "Error al actualizar la asistencia. Por favor, intente de nuevo."
      );
      Swal.fire({
        icon: "error",
        title: "Error al actualizar la asistencia",
        text: errorMessage,
        confirmButtonColor: "#2563EB",
      });
    }
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Confirmar Eliminación",
      text: "¿Estás seguro de que deseas eliminar esta asistencia?",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563EB",
    });
    if (!result.isConfirmed) return;
    try {
      await eliminarAsistencia(id);
      setAsistencias((prev) => prev.filter((a) => a.asistencia_id !== id));
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "La asistencia ha sido eliminada correctamente.",
        confirmButtonColor: "#2563EB",
      });
    } catch (err) {
      const errorMessage = parseError(
        err,
        "Error al eliminar la asistencia. Por favor, intente de nuevo."
      );
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#2563EB",
      });
    }
  };

  // ** NUEVO **: ordenar por fecha descendente antes de paginar
  const sortedAsistencias = useMemo(() => {
    return [...asistencias].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }, [asistencias]);

  // Paginación
  const totalItems = Math.min(sortedAsistencias.length, 100);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  // ** USAR sortedAsistencias para mostrar de más reciente a más antiguo **
  const paginatedAsistencias = sortedAsistencias.slice(indexOfFirst, indexOfLast);

  const maxButtons = 6;
  let startPage, endPage;
  if (totalPages <= maxButtons) {
    startPage = 1;
    endPage = totalPages;
  } else if (currentPage <= Math.floor(maxButtons / 2)) {
    startPage = 1;
    endPage = maxButtons;
  } else if (currentPage + Math.floor(maxButtons / 2) - 1 >= totalPages) {
    startPage = totalPages - maxButtons + 1;
    endPage = totalPages;
  } else {
    startPage = currentPage - Math.floor(maxButtons / 2) + 1;
    endPage = startPage + maxButtons - 1;
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Gestión de asistencias</h1>

      <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
        Por favor seleccione periodo, grado, materia y sección antes de realizar la búsqueda.
      </p>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { name: "periodo", label: "Seleccionar Periodo", options: periodos, key: "id_Periodo", text: "nombre_Periodo" },
          { name: "grado",   label: "Seleccionar Grado",   options: grados,  key: "id_grado",     text: "nivel" },
          { name: "materia", label: "Seleccionar Materia", options: materias, key: "id_Materia",   text: "nombre_Materia" },
          { name: "seccion", label: "Seleccionar Sección", options: secciones,key: "id_Seccion",   text: "nombre_Seccion" },
        ].map(({ name, label, options, key, text }) => (
          <select
            key={name}
            name={name}
            value={filtros[name]}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-4 py-2"
          >
            <option value="">{label}</option>
            {options.map(item => (
              <option key={item[key]} value={item[key]}>
                {item[text]}
              </option>
            ))}
          </select>
        ))}

        <input
          type="date"
          name="fecha"
          value={filtros.fecha}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-4 py-2"
        />

        <button
          onClick={handleBuscar}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          Buscar
        </button>
      </div>

      {paginatedAsistencias.length > 0 ? (
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <th className="border px-4 py-2">Estudiante</th>
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Profesor</th>
              <th className="border px-4 py-2">Materia</th>
              <th className="border px-4 py-2">Sección</th>
              <th className="border px-4 py-2">Estado</th>
              <th className="border px-4 py-2">Lecciones</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAsistencias.map((asistencia) => (
              <tr key={asistencia.asistencia_id} className="text-center border-t dark:border-gray-600">
                <td className="border px-4 py-2">
                  {asistencia.id_Estudiante?.nombre_Estudiante || "Sin nombre"}{" "}
                  {asistencia.id_Estudiante?.apellido1_Estudiante || ""}{" "}
                  {asistencia.id_Estudiante?.apellido2_Estudiante || ""}
                </td>
                <td className="border px-4 py-2">{asistencia.fecha}</td>
                <td className="border px-4 py-2">
                  {asistencia.id_Profesor?.nombre_Profesor || "Sin profesor"}{" "}
                  {asistencia.id_Profesor?.apellido1_Profesor || ""}
                </td>
                <td className="border px-4 py-2">
                  {asistencia.id_Materia?.nombre_Materia || "Sin materia"}
                </td>
                <td className="border px-4 py-2">
                  {asistencia.id_Seccion?.nombre_Seccion || "Sin sección"}
                </td>
                <td className="border px-4 py-2">
                  {asistencia.estado === "P" && "Presente"}
                  {asistencia.estado === "A" && "Ausente"}
                  {asistencia.estado === "E" && "Escapado"}
                  {asistencia.estado === "J" && "Justificado"}
                  {asistencia.estado === "T" && "Tardía"}
                </td>
                <td className="border px-4 py-2">
                  {typeof asistencia.lecciones === "string"
                    ? asistencia.lecciones.split(",").join(", ")
                    : Array.isArray(asistencia.lecciones)
                      ? asistencia.lecciones.join(", ")
                      : "N/A"}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEditar(asistencia.asistencia_id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(asistencia.asistencia_id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">No se encontraron asistencias.</p>
      )}

      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
          disabled={currentPage === 1}
          className="mx-1 w-10 h-10 flex justify-center items-center rounded text-sm transition bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white disabled:opacity-50"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
          const pageNumber = startPage + idx;
          return (
            <button
              key={pageNumber}
              onClick={() => paginate(pageNumber)}
              className={`
                mx-1 w-10 h-10 flex justify-center items-center rounded text-sm transition font-medium
                ${currentPage === pageNumber
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
          disabled={currentPage === totalPages}
          className="mx-1 w-10 h-10 flex justify-center items-center rounded text-sm transition bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white disabled:opacity-50"
        >
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default GestionAsistencia;
