// src/Pages/MiAsistencia.jsx
import { useEffect, useState } from "react";
import { useResumenAsistencias } from "./Hook/useResumenAsistencias";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";
import { esDiaLaborable, validarRangoFechas } from "./utils/dateUtils";

const MiAsistencia = () => {
  const { resumen, loading, error, fetchResumen, fetchResumenByDates } =
    useResumenAsistencias();

  const [studentId, setStudentId]     = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin]       = useState("");

  // Leer ID
  useEffect(() => {
    const id = localStorage.getItem("id_Estudiante");
    if (id) setStudentId(+id);
  }, []);

  // Carga inicial
  useEffect(() => {
    if (studentId !== null) {
      fetchResumen(studentId);
    }
  }, [studentId, fetchResumen]);

  // Mostrar alert si no hay registros (404) u otro error informativo
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "info",
        title: "Sin registros",
        text: error,
        confirmButtonColor: "#2563EB",
      });
    }
  }, [error]);

  const handleFiltrarFechas = (e) => {
    e.preventDefault();

    const validacion = validarRangoFechas(fechaInicio, fechaFin);
    if (!validacion.isValid) {
      return Swal.fire({
        icon: "warning",
        title: "Fechas inválidas",
        text: validacion.message,
        confirmButtonColor: "#2563EB",
      });
    }

    // Enviar fechas tal cual
    fetchResumenByDates(studentId, fechaInicio, fechaFin);
  };

  if (loading)  return <p className="p-6">Cargando…</p>;
  if (error)    return null;  // el alert ya cubrió el mensaje
  if (!resumen) return <p className="p-6">No hay datos.</p>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-4 dark:text-white">
        Mi asistencia
      </h1>

      <form
        onSubmit={handleFiltrarFechas}
        className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md flex flex-col md:flex-row gap-4 justify-center"
      >
        {/* Fecha Inicio */}
        <div className="flex flex-col">
          <label htmlFor="fechaInicio" className="mb-1 text-gray-700 dark:text-gray-200">
            Fecha inicio
          </label>
          <input
            type="date"
            id="fechaInicio"
            value={fechaInicio}
            onChange={(e) => {
              const fecha = e.target.value;
              if (!fecha || esDiaLaborable(fecha)) {
                setFechaInicio(fecha);
              } else {
                Swal.fire({
                  icon: "warning",
                  title: "Día no válido",
                  text: "Solo se permiten días laborables (lunes a viernes).",
                  confirmButtonColor: "#2563EB",
                });
              }
            }}
            className="border p-2 rounded-md dark:text-black"
          />
        </div>
        {/* Fecha Fin */}
        <div className="flex flex-col">
          <label htmlFor="fechaFin" className="mb-1 text-gray-700 dark:text-gray-200">
            Fecha fin
          </label>
          <input
            type="date"
            id="fechaFin"
            value={fechaFin}
            onChange={(e) => {
              const fecha = e.target.value;
              if (!fecha || esDiaLaborable(fecha)) {
                setFechaFin(fecha);
              } else {
                Swal.fire({
                  icon: "warning",
                  title: "Día no válido",
                  text: "Solo se permiten días laborables (lunes a viernes).",
                  confirmButtonColor: "#2563EB",
                });
              }
            }}
            className="border p-2 rounded-md dark:text-black"
          />
        </div>
        <button
          type="submit"
          className="mt-4 md:mt-7 bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600"
        >
          Filtrar
        </button>
      </form>

      {/* Totales ya contados por el backend */}
      <div className="mb-4 text-center dark:text-gray-300 space-y-1">
        <p>
          <span className="font-semibold">Ausencias totales:</span>{" "}
          {resumen.total_ausencias}
        </p>
        <p>
          <span className="font-semibold">Escapadas totales:</span>{" "}
          {resumen.total_escapados}
        </p>
        <p>
          <span className="font-semibold">Justificados totales:</span>{" "}
          {resumen.total_justificados}
        </p>
        <p>
          <span className="font-semibold">Tardías totales:</span>{" "}
          {resumen.total_tardias}
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 dark:text-white">
        Resumen por materia
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="border px-4 py-2 text-left dark:text-white">Materia</th>
              <th className="border px-4 py-2 text-center dark:text-white">Ausencias</th>
              <th className="border px-4 py-2 text-center dark:text-white">Escapados</th>
              <th className="border px-4 py-2 text-center dark:text-white">Justificados</th>
              <th className="border px-4 py-2 text-center dark:text-white">Tardías</th>
            </tr>
          </thead>
          <tbody>
            {resumen.resumen_por_materia.map((m) => (
              <tr key={m.materia.id_Materia} className="bg-white dark:bg-gray-600 dark:text-white">
                <td className="border px-4 py-2">{m.materia.nombre_Materia || "Sin nombre"}</td>
                <td className="border px-4 py-2 text-center">{m.ausencias}</td>
                <td className="border px-4 py-2 text-center">{m.escapados}</td>
                <td className="border px-4 py-2 text-center">{m.justificados}</td>
                <td className="border px-4 py-2 text-center">{m.tardias}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MiAsistencia;
