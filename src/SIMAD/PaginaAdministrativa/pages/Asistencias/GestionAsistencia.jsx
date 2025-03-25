import { useEffect, useState } from "react";
import { useDatosIniciales } from "./Hook/useDatosIniciales";
import {
  actualizarAsistencia,
  eliminarAsistencia,
  obtenerGestionAsistencias,
  obtenerTodasLasAsistencias,
} from "./Services/GestionAsistenciaService";
import { usePeriodos } from "./Hook/usePeriodos";
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

  // Paginación: 20 items por página, máximo 100 registros.
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  /**
   * parseError:
   * Retorna siempre un mensaje amigable para el usuario,
   * sin exponer detalles técnicos del error.
   */
  const parseError = (_err, defaultMessage) => {
    // Ignoramos el error original y mostramos solo el mensaje recibido como parámetro.
    return defaultMessage;
  };

  // Función de validación para los filtros de búsqueda
  const validateFiltros = () => {
    // Validar campos obligatorios (excepto fecha, que se asume opcional)
    if (!filtros.periodo || !filtros.grado || !filtros.materia || !filtros.seccion) {
      return {
        isValid: false,
        message: "Por favor, seleccione todos los campos requeridos (Periodo, Grado, Materia y Sección).",
      };
    }

    // Validar que la fecha no sea mayor a la actual (si está ingresada)
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
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: "#2563EB",
        });
      }
    };

    fetchAsistencias();
  }, []);

  const handleBuscar = async () => {
    // Validar filtros antes de ejecutar la búsqueda
    const { isValid, message } = validateFiltros();
    if (!isValid) {
      Swal.fire({
        icon: "warning",
        title: "Validación",
        text: message,
        confirmButtonColor: "#2563EB",
      });
      return;
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
      // Mensaje de advertencia amigable para búsquedas fallidas
      const errorMessage = parseError(
        err,
        "Ocurrió un problema durante la búsqueda. Por favor, verifique los datos ingresados y vuelva a intentarlo."
      );
      console.error("Error al obtener las asistencias:", err);
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

        if (!estado) {
          Swal.showValidationMessage("El campo Estado es obligatorio");
        }
        return { estado, lecciones };
      },
    });

    if (formValues) {
      // Validar si se realizaron cambios
      const newLecciones = formValues.lecciones
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l !== "")
        .join(", ");
      const oldLecciones = Array.isArray(asistencia.lecciones)
        ? asistencia.lecciones.join(", ")
        : asistencia.lecciones;

      if (formValues.estado === asistencia.estado && newLecciones === oldLecciones) {
        Swal.fire({
          icon: "warning",
          title: "Sin cambios",
          text: "No se detectaron cambios en la asistencia.",
          confirmButtonColor: "#2563EB",
        });
        return;
      }

      const updatedData = {
        estado: formValues.estado,
        lecciones: formValues.lecciones
          .split(",")
          .map((l) => l.trim())
          .filter((l) => l !== ""),
      };

      try {
        await actualizarAsistencia(asistencia.asistencia_id, updatedData);
        setAsistencias(
          asistencias.map((a) =>
            a.asistencia_id === asistencia.asistencia_id
              ? { ...a, ...updatedData }
              : a
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
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error al actualizar la asistencia",
          text: errorMessage,
          confirmButtonColor: "#2563EB",
        });
      }
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

    if (result.isConfirmed) {
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
        setError(errorMessage);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: "#2563EB",
        });
      }
    }
  };

  // Cálculo de paginación: se limita el total de asistencias a 100.
  const totalItems = Math.min(asistencias.length, 100);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedAsistencias = asistencias.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
    <h1 className="text-2xl font-bold mb-4">Gestión de Asistencias</h1>
  
    <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
      Por favor seleccione Periodo, Grado, Materia y Sección antes de realizar la búsqueda.
    </p>
  
    <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Filtros */}
      {[
        {
          name: "periodo",
          label: "Seleccionar Periodo",
          options: periodos,
          key: "id_Periodo",
          text: "nombre_Periodo"
        },
        {
          name: "grado",
          label: "Seleccionar Grado",
          options: grados,
          key: "id_grado",
          text: "nivel"
        },
        {
          name: "materia",
          label: "Seleccionar Materia",
          options: materias,
          key: "id_Materia",
          text: "nombre_Materia"
        },
        {
          name: "seccion",
          label: "Seleccionar Sección",
          options: secciones,
          key: "id_Seccion",
          text: "nombre_Seccion"
        },
      ].map(({ name, label, options, key, text }) => (
        <select
          key={name}
          name={name}
          value={filtros[name]}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-4 py-2"
        >
          <option value="">{label}</option>
          {options.map((item) => (
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
  
    {/* Tabla de resultados */}
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
              <td className="border px-4 py-2">{asistencia.estado}</td>
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
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
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
    <div className="flex justify-center items-center gap-4 mt-4">
      <button
        onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
        disabled={currentPage === 1}
        className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-gray-800 dark:text-gray-200">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() =>
          currentPage < totalPages && setCurrentPage((prev) => prev + 1)
        }
        disabled={currentPage === totalPages}
        className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  </div>
  
  );
};