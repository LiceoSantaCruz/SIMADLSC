import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";
import { crearJustificacion } from "./Services/JustificacionService";
import useMaterias from "./Hook/useMaterias";
import { useAsistenciaByCedula } from "./Hook/useAsistenciaByCedula";

export const JustificacionAusencias = () => {
  const { materias } = useMaterias();
  const { asistencias, loading, searchAsistencias, error } = useAsistenciaByCedula();

  const [formData, setFormData] = useState({
    cedula: "",
    id_Materia: "",
    fecha: "",
  });
  // Flag para indicar que se realizó una búsqueda
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
      // No se muestra alerta aquí, ya que se manejará en el useEffect
    }
  };

  // useEffect para manejar la aparición de errores utilizando el valor 'error' del hook
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
        confirmButtonColor: "#2563EB",
      });
      setHasSearched(false);
    } else if (
      hasSearched &&
      !loading &&
      asistencias.length === 0 &&
      formData.cedula.trim().length > 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró ningún estudiante con ese criterio de búsqueda. Verifica la información ingresada.",
        confirmButtonColor: "#2563EB",
      });
      setHasSearched(false);
    }
  }, [error, hasSearched, loading, asistencias, formData.cedula]);

  // Encabezado del estudiante (si hay resultados)
  const studentHeader =
    asistencias.length > 0 && (
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
    );

  // Función para justificar la ausencia utilizando SweetAlert2
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
        // Actualizamos la lista de asistencias tras justificar
        await searchAsistencias(formData);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al guardar la justificación. Intenta nuevamente.",
          confirmButtonColor: "#2563EB",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Justificar Ausencias</h2>
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
          <select name="id_Materia" onChange={handleChange} className="border p-2 rounded">
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

      {studentHeader}

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
                <td className="border px-4 py-2">{asistencia.id_Materia.nombre_Materia}</td>
                <td className="border px-4 py-2">{asistencia.id_Profesor.nombre_Profesor}</td>
                <td className="border px-4 py-2">
                  {Array.isArray(asistencia.lecciones)
                    ? asistencia.lecciones.join(", ")
                    : typeof asistencia.lecciones === "string"
                    ? asistencia.lecciones.split(",").join(", ")
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
