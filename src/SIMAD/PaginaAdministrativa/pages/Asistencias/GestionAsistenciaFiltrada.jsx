// File: src/Pages/GestionAsistenciaFiltrada.jsx
import { useEffect, useState, useMemo } from "react";
import { useDatosIniciales } from "./Hook/useDatosIniciales";
import {
  obtenerGestionAsistencias,
  obtenerTodasLasAsistencias,
  actualizarAsistencia,
} from "./Services/GestionAsistenciaService";
import { usePeriodos } from "./Hook/usePeriodos";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";

export default function GestionAsistenciaFiltrada() {
  const { materias: todasMaterias, grados, secciones } = useDatosIniciales();
  const { periodos } = usePeriodos();

  // Leemos datos del profesor de localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const profesorId =
    storedUser.id_Profesor || Number(localStorage.getItem("id_Profesor"));

  // Intentamos armar nombre completo desde localStorage
  const initialProfesorNombre = [
    storedUser.nombre_Profesor,
    storedUser.apellido1_Profesor,
    storedUser.apellido2_Profesor,
  ]
    .filter((x) => x)
    .join(" ") ||
    [
      localStorage.getItem("nombre_Profesor"),
      localStorage.getItem("apellido1_Profesor"),
      localStorage.getItem("apellido2_Profesor"),
    ]
      .filter((x) => x)
      .join(" ") ||
    "—";

  const [asistencias, setAsistencias] = useState([]);
  const [profesorNombre, setProfesorNombre] = useState(
    initialProfesorNombre
  );
  const [filtros, setFiltros] = useState({
    periodo: "",
    fecha: "",
    grado: "",
    materia: "",
    seccion: "",
  });
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Carga inicial de todas las asistencias
  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerTodasLasAsistencias();
        setAsistencias(data);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error cargando asistencias.",
          confirmButtonColor: "#2563EB",
        });
      }
    })();
  }, []);

  // Filtrar solo las asistencias de este profesor
  const asistenciasDelProfesor = useMemo(
    () =>
      asistencias.filter(
        (a) => a.id_Profesor?.id_Profesor === Number(profesorId)
      ),
    [asistencias, profesorId]
  );

  // Si el backend devuelve el objeto id_Profesor con apellidos, los usamos
  useEffect(() => {
    if (asistenciasDelProfesor.length > 0) {
      const prof = asistenciasDelProfesor[0].id_Profesor;
      if (prof?.nombre_Profesor) {
        const nombreCompleto = [
          prof.nombre_Profesor,
          prof.apellido1_Profesor,
          prof.apellido2_Profesor,
        ]
          .filter((x) => x)
          .join(" ");
        setProfesorNombre(nombreCompleto);
      }
    }
  }, [asistenciasDelProfesor]);

  // Filtrar materias asignadas al profesor
  let materiaIds = [];
  if (storedUser.materia) {
    materiaIds = Array.isArray(storedUser.materia)
      ? storedUser.materia.map(Number)
      : String(storedUser.materia)
          .split(",")
          .map((id) => Number(id.trim()));
  } else if (localStorage.getItem("materia")) {
    const raw = localStorage.getItem("materia");
    materiaIds = raw.includes("[")
      ? JSON.parse(raw).map(Number)
      : raw.split(",").map((id) => Number(id.trim()));
  }
  const materias = todasMaterias.filter((m) =>
    materiaIds.includes(m.id_Materia)
  );

  // Secciones dinámicas según el grado seleccionado
  const seccionesFiltradas = filtros.grado
    ? secciones.filter((s) => s.gradoId === Number(filtros.grado))
    : secciones;

  const validateFiltros = () => {
    if (
      !filtros.periodo ||
      !filtros.grado ||
      !filtros.materia ||
      !filtros.seccion
    ) {
      return {
        isValid: false,
        message: "Seleccione Periodo, Grado, Materia y Sección.",
      };
    }
    if (filtros.fecha && new Date(filtros.fecha) > new Date()) {
      return { isValid: false, message: "La fecha no puede ser mayor a hoy." };
    }
    return { isValid: true };
  };

  // Realiza la búsqueda en el backend
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
      if (!data || data.length === 0) {
        setAsistencias([]);
        return Swal.fire({
          icon: "info",
          title: "Sin resultados",
          text: "No se encontraron asistencias con esos filtros.",
          confirmButtonColor: "#2563EB",
        });
      }
      setAsistencias(data);
      setCurrentPage(1);
    } catch (err) {
      if (err.response?.status === 404) {
        setAsistencias([]);
        return Swal.fire({
          icon: "info",
          title: "Sin resultados",
          text: "No se encontraron asistencias con esos filtros.",
          confirmButtonColor: "#2563EB",
        });
      }
      const serverMsg =
        err.response?.data?.message || "Ocurrió un error al buscar asistencias.";
      setAsistencias([]);
      Swal.fire({
        icon: "error",
        title: "Error de búsqueda",
        text: serverMsg,
        confirmButtonColor: "#2563EB",
      });
    }
  };

  // Maneja el cambio en cualquiera de los filtros
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "grado" && { seccion: "" }), // al cambiar grado, limpiamos sección
    }));
  };

  // Muestra el modal de edición sin opción "Justificado"
  const handleEditar = async (id) => {
    const asistencia = asistencias.find((a) => a.asistencia_id === id);
    if (!asistencia) return;
    const leccionesActual = Array.isArray(asistencia.lecciones)
      ? asistencia.lecciones.join(", ")
      : asistencia.lecciones;

    const html = `
      <div class="flex flex-col space-y-4 text-left">
        <div>
          <label class="block text-sm font-medium text-gray-700">Estado</label>
          <select
            id="swal-input1"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="P" ${asistencia.estado === "P" ? "selected" : ""}>Presente</option>
            <option value="A" ${asistencia.estado === "A" ? "selected" : ""}>Ausente</option>
            <option value="T" ${asistencia.estado === "T" ? "selected" : ""}>Tardía</option>
            <option value="E" ${asistencia.estado === "E" ? "selected" : ""}>Escapado</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Lecciones (separadas por coma)</label>
          <input
            id="swal-input2"
            type="text"
            placeholder="Ej: 1,2,3"
            value="${leccionesActual}"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    `;

    const { value: formValues } = await Swal.fire({
      title: "Editar asistencia",
      html,
      width: 400,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563EB",
      preConfirm: () => {
        const estado = document.getElementById("swal-input1").value;
        const lecciones = document.getElementById("swal-input2").value;
        if (!estado) Swal.showValidationMessage("Seleccione un estado");
        return { estado, lecciones };
      },
    });
    if (!formValues) return;

    const nuevasLecciones = formValues.lecciones
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l);

    if (
      formValues.estado === asistencia.estado &&
      nuevasLecciones.join() === leccionesActual
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Sin cambios",
        text: "No se detectaron cambios.",
        confirmButtonColor: "#2563EB",
      });
    }

    try {
      await actualizarAsistencia(id, {
        estado: formValues.estado,
        lecciones: nuevasLecciones,
      });
      setAsistencias((prev) =>
        prev.map((a) =>
          a.asistencia_id === id
            ? { ...a, estado: formValues.estado, lecciones: nuevasLecciones }
            : a
        )
      );
      Swal.fire({
        icon: "success",
        title: "Actualizado",
        confirmButtonColor: "#2563EB",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  // Filtrar por nombre + apellidos
  const filtradoPorBusqueda = useMemo(() => {
    return asistenciasDelProfesor.filter((a) => {
      const nom = a.id_Estudiante?.nombre_Estudiante ?? "";
      const ap1 = a.id_Estudiante?.apellido1_Estudiante ?? "";
      const ap2 = a.id_Estudiante?.apellido2_Estudiante ?? "";
      const completo = `${nom} ${ap1} ${ap2}`.toLowerCase();
      return completo.includes(busqueda.trim().toLowerCase());
    });
  }, [asistenciasDelProfesor, busqueda]);

  // Ordenamos por fecha descendente y paginamos
  const sorted = [...filtradoPorBusqueda].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Botones de paginación
  let startPage = 1,
    endPage = totalPages;
  const maxButtons = 6;
  if (totalPages > maxButtons) {
    if (currentPage <= Math.floor(maxButtons / 2)) endPage = maxButtons;
    else if (currentPage + Math.floor(maxButtons / 2) >= totalPages)
      startPage = totalPages - maxButtons + 1;
    else {
      startPage = currentPage - Math.floor(maxButtons / 2);
      endPage = startPage + maxButtons - 1;
    }
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-950 min-h-screen">
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        Gestión de asistencias 
      </h1>
      <p className="mb-1 text-lg text-gray-900 dark:text-gray-100">
        Profesor: <span className="font-medium">{profesorNombre}</span>
      </p>
      <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
        Seleccione Periodo, Grado, Materia y Sección:
      </p>

      {/* Filtros */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-6 gap-4">
        <select
          name="periodo"
          value={filtros.periodo}
          onChange={handleChange}
          className="border px-4 py-2 rounded bg-white dark:bg-gray-800"
        >
          <option value="">Periodo</option>
          {periodos.map((p) => (
            <option key={p.id_Periodo} value={p.id_Periodo}>
              {p.nombre_Periodo}
            </option>
          ))}
        </select>
        <select
          name="grado"
          value={filtros.grado}
          onChange={handleChange}
          className="border px-4 py-2 rounded bg-white dark:bg-gray-800"
        >
          <option value="">Grado</option>
          {grados.map((g) => (
            <option key={g.id_grado} value={g.id_grado}>
              {g.nivel}
            </option>
          ))}
        </select>
        <select
          name="materia"
          value={filtros.materia}
          onChange={handleChange}
          className="border px-4 py-2 rounded bg-white dark:bg-gray-800"
        >
          <option value="">Materia</option>
          {materias.map((m) => (
            <option key={m.id_Materia} value={m.id_Materia}>
              {m.nombre_Materia}
            </option>
          ))}
        </select>
        <select
          name="seccion"
          value={filtros.seccion}
          onChange={handleChange}
          className="border px-4 py-2 rounded bg-white dark:bg-gray-800"
        >
          <option value="">Sección</option>
          {seccionesFiltradas.map((s) => (
            <option key={s.id_Seccion} value={s.id_Seccion}>
              {s.nombre_Seccion}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="fecha"
          value={filtros.fecha}
          onChange={handleChange}
          className="border px-4 py-2 rounded bg-white dark:bg-gray-800"
        />
        <button
          onClick={handleBuscar}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {/* Buscador por nombre + apellidos */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Buscar estudiante..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3 border px-4 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Tabla de resultados */}
      {paginated.length > 0 ? (
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              {[
                "Estudiante",
                "Fecha",
                "Materia",
                "Sección",
                "Estado",
                "Lecciones",
                "Acciones",
              ].map((h) => (
                <th key={h} className="px-4 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((a) => (
              <tr key={a.asistencia_id} className="text-center border-t">
                <td className="px-4 py-2">
                  {a.id_Estudiante?.nombre_Estudiante}{" "}
                  {a.id_Estudiante?.apellido1_Estudiante}{" "}
                  {a.id_Estudiante?.apellido2_Estudiante || ""}
                </td>
                {/* Formato DD/MM/YYYY sin desfase de zona */}
                <td className="px-4 py-2">
                  {a.fecha.split("-").reverse().join("/")}
                </td>
                <td className="px-4 py-2">{a.id_Materia?.nombre_Materia}</td>
                <td className="px-4 py-2">{a.id_Seccion?.nombre_Seccion}</td>
                <td className="px-4 py-2">
                  {{
                    P: "Presente",
                    A: "Ausente",
                    T: "Tardía",
                    E: "Escapado",
                  }[a.estado] || a.estado}
                </td>
                <td className="px-4 py-2">
                  {Array.isArray(a.lecciones)
                    ? a.lecciones.join(", ")
                    : a.lecciones}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEditar(a.asistencia_id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">
          No hay asistencias para este profesor.
        </p>
      )}

      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 bg-gray-200 dark:bg-gray-600 rounded disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
          (page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`mx-1 w-10 h-10 flex justify-center items-center rounded text-sm ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-600 dark:text-white"
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 bg-gray-200 dark:bg-gray-600 rounded disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
