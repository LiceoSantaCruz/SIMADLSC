import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";
import { crearJustificacion } from "./Services/JustificacionService";
import useMaterias from "./Hook/useMaterias";
import { useAsistenciaByCedula } from "./Hook/useAsistenciaByCedula";
// Función auxiliar para crear un mensaje detallado cuando no se encuentran resultados
function buildNoResultsMessage(cedula, materia, fecha) {
  let msg = "No se encontraron asistencias";
  if (cedula.trim()) {
    msg += ` para “${cedula}”`;
  }
  if (materia) {
    msg += ` en la materia “${materia}”`;
  }
  if (fecha) {
    msg += ` con fecha “${fecha}”`;
  }
  msg += ". Por favor, verifica la información e inténtalo nuevamente.";
  return msg;
}

export const JustificacionAusencias = () => {
  const { materias } = useMaterias();
  const { asistencias, loading, error, searchAsistencias } = useAsistenciaByCedula();

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
    if (descripcion) {
      try {
        await crearJustificacion(asistenciaId, descripcion);
        Swal.fire({
          icon: "success",
          title: "¡Justificación guardada con éxito!",
          confirmButtonColor: "#2563EB",
        });
        await searchAsistencias(formData);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No fue posible guardar la justificación. Por favor, inténtalo nuevamente.",
          confirmButtonColor: "#2563EB",
        });
      }
    }
  };

  useEffect(() => {
    if (!hasSearched) return;

    if (error) {
      switch (error.type) {
        case "not-found":
          Swal.fire({
            icon: "warning",
            title: "Sin resultados",
            text: buildNoResultsMessage(
              formData.cedula,
              materias.find((m) => m.id_Materia === formData.id_Materia)?.nombre_Materia,
              formData.fecha
            ),
            confirmButtonColor: "#2563EB",
          });
          break;
        case "network-error":
          Swal.fire({
            icon: "error",
            title: "Problema de conexión",
            text: "No pudimos conectar con el servidor. Verifica tu conexión e inténtalo nuevamente.",
            confirmButtonColor: "#2563EB",
          });
          break;
        case "server-error":
        default:
          Swal.fire({
            icon: "error",
            title: "Ocurrió un problema",
            text:
              error.message ||
              "Tuvimos inconvenientes para obtener las asistencias. Intenta de nuevo más tarde.",
            confirmButtonColor: "#2563EB",
          });
          break;
      }
      setHasSearched(false);
    } else if (!loading && asistencias.length === 0 && formData.cedula.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Sin resultados",
        text: buildNoResultsMessage(
          formData.cedula,
          materias.find((m) => m.id_Materia === formData.id_Materia)?.nombre_Materia,
          formData.fecha
        ),
        confirmButtonColor: "#2563EB",
      });
      setHasSearched(false);
    }
  }, [error, hasSearched, loading, asistencias, formData, materias]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Justificar Ausencias</h1>

      {/* Texto explicativo para guiar al usuario en la búsqueda */}
      <p className="mb-4 text-gray-700">
        Para buscar asistencias, primero ingresa la <strong>cédula</strong> del estudiante.
        Si lo deseas, también puedes filtrar por <strong>fecha</strong> y/o
        <strong> materia</strong> para refinar la búsqueda. Luego, haz clic en{" "}
        <strong>Buscar</strong> para ver los resultados. Finalmente, presiona{" "}
        <strong>Justificar</strong> en la fila correspondiente para registrar la justificación.
      </p>

      <form onSubmit={handleSearch} className="bg-white p-4 rounded shadow-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="cedula"
            placeholder="Cédula o Nombre del Estudiante"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="fecha"
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <select
            name="id_Materia"
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Seleccionar Materia</option>
            {materias.map((materia) => (
              <option key={materia.id_Materia} value={materia.id_Materia}>
                {materia.nombre_Materia}
              </option>
            ))}
          </select>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Buscar
          </button>
        </div>
      </form>

      {/* Encabezado del estudiante si hay asistencias */}
      {asistencias.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Estudiante: {asistencias[0]?.id_Estudiante?.nombre_Estudiante}{" "}
            {asistencias[0]?.id_Estudiante?.apellido1_Estudiante}{" "}
            {asistencias[0]?.id_Estudiante?.apellido2_Estudiante || ""}
          </h3>
          <p className="text-md">
            Sección: {asistencias[0]?.id_Seccion?.nombre_Seccion || "N/A"}
          </p>
        </div>
      )}

      {loading ? (
        <p>Cargando asistencias...</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr className="text-center">
              <th className="py-2 border">Fecha</th>
              <th className="py-2 border">Materia</th>
              <th className="py-2 border">Profesor</th>
              <th className="py-2 border">Lecciones</th>
              <th className="py-2 border">Estado</th>
              <th className="py-2 border">Justificar</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((asistencia) => (
              <tr key={asistencia.asistencia_id} className="text-center">
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
                  <button
                    onClick={() => handleJustificar(asistencia.asistencia_id)}
                    className="bg-green-700 text-white px-2 py-1 rounded"
                    disabled={asistencia.estado !== "A"}
                  >
                    Justificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};