import { useEffect, useState } from "react";
import { useResumenAsistencias } from "./Hook/useResumenAsistencias";

import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";

const MiAsistencia = () => {
  const {
    resumen,
    loading,
    error,
    fetchResumen,
    fetchResumenByDates
  } = useResumenAsistencias();

  const [studentId, setStudentId] = useState(null);

  // Campos de formulario para fechas
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Al montar el componente, obtenemos el ID del estudiante
  useEffect(() => {
    const storedId = localStorage.getItem("id_Estudiante");
    if (storedId) {
      setStudentId(storedId);
    }
  }, []);

  // Cuando tenemos un studentId, cargamos el resumen general (sin fechas)
  useEffect(() => {
    if (studentId) {
      fetchResumen(studentId);
    }
  }, [studentId, fetchResumen]);

  // Manejador para filtrar por fechas
  const handleFiltrarFechas = (e) => {
    e.preventDefault();

    // Validar que ambas fechas estén seleccionadas
    if (!fechaInicio || !fechaFin) {
      Swal.fire({
        icon: "warning",
        title: "Fechas incompletas",
        text: "Por favor, seleccione ambas fechas para filtrar.",
        confirmButtonColor: "#2563EB"
      });
      return;
    }

    // Validar rango de fechas
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    if (inicio > fin) {
      Swal.fire({
        icon: "warning",
        title: "Rango de fechas inválido",
        text: "La fecha de inicio no puede ser mayor que la fecha de fin.",
        confirmButtonColor: "#2563EB"
      });
      return;
    }

    // Llamamos a la función del hook que filtra
    fetchResumenByDates(studentId, fechaInicio, fechaFin);
  };

  // Loading, Error, No-data
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 dark:text-white">
        <p className="text-center text-lg">Cargando resumen de asistencias...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 dark:text-white">
        <p className="text-center text-red-500 text-lg">
          Ocurrió un error: {error}
        </p>
      </div>
    );
  }
  if (!resumen) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 dark:text-white">
        <p className="text-center text-lg">No se encontró información de asistencias.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-4 dark:text-white">
        Mis Asistencias
      </h1>

      {/* Contenedor para el formulario de fechas */}
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
        <form
          onSubmit={handleFiltrarFechas}
          className="flex flex-col md:flex-row items-center gap-4 justify-center"
        >
          {/* Fecha de inicio */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 dark:text-gray-200" htmlFor="fechaInicio">
              Fecha de Inicio
            </label>
            <input
              type="date"
              id="fechaInicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="border border-gray-300 p-2 rounded-md dark:text-black"
            />
          </div>

          {/* Fecha de fin */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 dark:text-gray-200" htmlFor="fechaFin">
              Fecha de Fin
            </label>
            <input
              type="date"
              id="fechaFin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="border border-gray-300 p-2 rounded-md dark:text-black"
            />
          </div>

          {/* Botón de filtrar */}
          <div className="mt-4 md:mt-7">
            <button
              type="submit"
              className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600"
            >
              Filtrar
            </button>
          </div>
        </form>
      </div>

      {/* Resumen Totales */}
      <div className="mb-4 text-center dark:text-gray-300">
        <p className="text-lg">
          <span className="font-semibold">Ausencias Totales:</span>{" "}
          {resumen.total_ausencias}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Escapados Totales:</span>{" "}
          {resumen.total_escapados}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Justificados Totales:</span>{" "}
          {resumen.total_justificados}
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Resumen por Materia</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="border px-4 py-2 text-left dark:text-white">Materia</th>
              <th className="border px-4 py-2 text-center dark:text-white">Ausencias</th>
              <th className="border px-4 py-2 text-center dark:text-white">Escapados</th>
              <th className="border px-4 py-2 text-center dark:text-white">Justificados</th>
            </tr>
          </thead>
          <tbody>
            {resumen.resumen_por_materia.map((item) => (
              <tr
                key={item.materia.id_Materia}
                className="bg-white dark:bg-gray-600 dark:text-white"
              >
                <td className="border px-4 py-2">
                  {item.materia.nombre_Materia || "Sin nombre"}
                </td>
                <td className="border px-4 py-2 text-center">{item.ausencias}</td>
                <td className="border px-4 py-2 text-center">{item.escapados}</td>
                <td className="border px-4 py-2 text-center">{item.justificados}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MiAsistencia;