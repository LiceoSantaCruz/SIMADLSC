import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";
import { crearJustificacion } from "./Services/JustificacionService";
import useMaterias from "./Hook/useMaterias";
import { useAsistenciaByCedula } from "./Hook/useAsistenciaByCedula";

// Función auxiliar para crear un mensaje detallado cuando no se encuentran resultados
function buildNoResultsMessage(cedula, materia, fecha) {
  let msg = "No se encontraron asistencias";
  if (cedula.trim()) msg += ` para “${cedula}”`;
  if (materia)    msg += ` en la materia “${materia}”`;
  if (fecha)      msg += ` con fecha “${fecha}”`;
  return msg + ". Por favor, verifica la información e inténtalo nuevamente.";
}

export const JustificacionAusencias = () => {
  const { materias } = useMaterias();
  const { asistencias, loading, error, searchAsistencias } =
    useAsistenciaByCedula();

  const [formData, setFormData] = useState({
    cedula: "",
    id_Materia: "",
    fecha: "",
  });
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setHasSearched(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    try {
      await searchAsistencias(formData);
    } catch (err) {
      console.error("Error al buscar asistencias:", err);
    }
  };

  const handleJustificar = async (asistenciaId) => {
    const { value: descripcion } = await Swal.fire({
      title: "Justificar ausencia",
      input: "textarea",
      inputLabel: "Descripción",
      inputPlaceholder: "Ingresa la justificación aquí...",
      showCancelButton: true,
      confirmButtonText: "Justificar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563EB",
    });
    if (!descripcion) return;

    try {
      await crearJustificacion(asistenciaId, descripcion);
      Swal.fire({
        icon: "success",
        title: "¡Justificación guardada con éxito!",
        confirmButtonColor: "#2563EB",
      });
      await searchAsistencias(formData);
    } catch (err) {
      console.error("Error al guardar justificación:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible guardar la justificación. Por favor, inténtalo nuevamente.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  useEffect(() => {
    if (!hasSearched) return;

    if (error) {
      const materiaNombre = materias.find(
        (m) => m.id_Materia === formData.id_Materia
      )?.nombre_Materia;
      Swal.fire({
        icon: error.type === "not-found" ? "warning" : "error",
        title: error.type === "not-found" ? "Sin resultados" : "Ocurrió un problema",
        text:
          error.type === "not-found"
            ? buildNoResultsMessage(formData.cedula, materiaNombre, formData.fecha)
            : error.message,
        confirmButtonColor: "#2563EB",
      });
      setHasSearched(false);
    }
  }, [error, hasSearched, asistencias, formData, materias]);

  // Ordenamos por fecha descendente sin cambiar diseño
  const sortedAsistencias = [...asistencias].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Justificar ausencias</h1>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Para buscar ausencias, primero ingresa la <strong>cédula</strong> del
        estudiante. Si lo deseas, también puedes filtrar por{" "}
        <strong>fecha</strong> y/o <strong>materia</strong> para refinar la
        búsqueda. Luego, haz clic en <strong>buscar</strong> para ver los
        resultados. Finalmente, presiona <strong>justificar</strong> en la fila
        correspondiente para registrar la justificación.
      </p>

      {/* Formulario de búsqueda */}
      <form
        onSubmit={handleSearch}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow-md mb-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="cedula"
            placeholder="Cédula o Nombre del estudiante"
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 rounded"
            required
          />
          <input
            type="date"
            name="fecha"
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 rounded"
          />
          <select
            name="id_Materia"
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 rounded"
          >
            <option value="">Seleccionar Materia</option>
            {materias.map((materia) => (
              <option key={materia.id_Materia} value={materia.id_Materia}>
                {materia.nombre_Materia}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Info del estudiante */}
      {sortedAsistencias.length > 0 && !loading && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Estudiante:{" "}
            {`${sortedAsistencias[0].id_Estudiante.nombre_Estudiante} ${sortedAsistencias[0].id_Estudiante.apellido1_Estudiante} ${
              sortedAsistencias[0].id_Estudiante.apellido2_Estudiante || ""
            }`}
          </h3>
          <p className="text-md">
            Sección: {sortedAsistencias[0].id_Seccion?.nombre_Seccion || "N/A"}
          </p>
        </div>
      )}

      {/* Tabla de resultados */}
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">
          Cargando asistencias...
        </p>
      ) : (
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-center">
            <tr>
              <th className="py-2 border">Fecha</th>
              <th className="py-2 border">Materia</th>
              <th className="py-2 border">Profesor</th>
              <th className="py-2 border">Lecciones</th>
              <th className="py-2 border">Estado</th>
              <th className="py-2 border">Acción</th>
            </tr>
          </thead>
          <tbody>
            {sortedAsistencias.map((asistencia) => (
              <tr
                key={asistencia.asistencia_id}
                className="text-center border-t dark:border-gray-600"
              >
                <td className="border px-4 py-2">{asistencia.fecha}</td>
                <td className="border px-4 py-2">
                  {asistencia.id_Materia?.nombre_Materia || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {asistencia.id_Profesor?.nombre_Profesor || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {Array.isArray(asistencia.lecciones)
                    ? asistencia.lecciones.join(", ")
                    : typeof asistencia.lecciones === "string"
                    ? asistencia.lecciones.split(", ").join(", ")
                    : "N/A"}
                </td>
                <td className="border px-4 py-2">{asistencia.estado}</td>
                <td className="border px-4 py-2">
                  {asistencia.estado === "A" && (
                    <button
                      onClick={() => handleJustificar(asistencia.asistencia_id)}
                      className="bg-green-700 hover:bg-green-800 text-white px-2 py-1 rounded"
                    >
                      Justificar
                    </button>
                  )}
                  {asistencia.estado === "J" && (
                    <button
                      disabled
                      className="bg-red-600 text-white px-2 py-1 rounded cursor-default"
                    >
                      Justificado
                    </button>
                  )}
                  {/* Si estado es "P", no mostramos botón */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
