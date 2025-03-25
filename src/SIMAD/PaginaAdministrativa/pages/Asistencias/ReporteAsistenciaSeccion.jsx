import { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useReporteAsistenciaSeccion } from './Hook/useReporteAsistenciaSeccion';
import useAllSecciones from './Hook/seAllSecciones';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

const ReporteAsistenciaSeccion = () => {
  const [nombreSeccion, setNombreSeccion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Obtenemos la lógica para buscar el reporte
  const { reporte, loading, error, buscarReporteSeccion } = useReporteAsistenciaSeccion();

  // Hook para obtener todas las secciones
  const { secciones, loadingSecciones, errorSecciones } = useAllSecciones();

  // Para controlar si el usuario ya presionó "Consultar"
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * handleSubmit:
   * Validamos campos antes de buscar, y si todo está bien,
   * marcamos hasSearched = true y llamamos a buscarReporteSeccion.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) Validar que el campo nombreSeccion no esté vacío
    if (!nombreSeccion.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, ingresa la sección (ej: 7-1).",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    // 2) Validar formato "7-1"
    if (!/^\d+-\d+$/.test(nombreSeccion)) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: 'El formato de la sección es incorrecto. Debe ser algo como "7-1".',
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    // 3) Validar fechas
    if (!fechaInicio || !fechaFin) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, ingresa las fechas de inicio y fin.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      Swal.fire({
        icon: "warning",
        title: "Rango de fechas inválido",
        text: "La fecha de inicio no puede ser mayor que la fecha de fin.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    // Buscamos la sección en el array secciones
    const seccionEncontrada = secciones.find(
      (sec) => sec.nombre_Seccion.toLowerCase() === nombreSeccion.toLowerCase()
    );
    if (!seccionEncontrada) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: `No se encontró la sección "${nombreSeccion}". Verifica el nombre.`,
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    // 4) Marcamos que el usuario hizo una búsqueda
    setHasSearched(true);

    // 5) Disparamos la búsqueda
    const idSeccion = seccionEncontrada.id_Seccion;
    try {
      await buscarReporteSeccion({ idSeccion, fechaInicio, fechaFin });
    } catch (error) {
      // Cualquier error adicional se manejará en el useEffect
      console.error("Error al buscar reporte de sección:", error);
    }
  };

  /**
   * handleChange: Reseteamos hasSearched a false para
   * evitar mostrar modales mientras el usuario edita
   */
  const handleChangeSeccion = (e) => {
    setNombreSeccion(e.target.value);
    setHasSearched(false);
  };
  const handleChangeFechaInicio = (e) => {
    setFechaInicio(e.target.value);
    setHasSearched(false);
  };
  const handleChangeFechaFin = (e) => {
    setFechaFin(e.target.value);
    setHasSearched(false);
  };

  /**
   * useEffect para mostrar SweetAlerts solo si hasSearched = true
   * y ya no está loading (loading = false).
   */
  useEffect(() => {
    if (!hasSearched || loading) return;

    if (error === "not-found") {
      // Mostramos un warning de "Sin resultados"
      Swal.fire({
        icon: "warning",
        title: "Sin resultados",
        text: "No se encontraron datos para la sección y fechas ingresadas. Verifica la información.",
        confirmButtonColor: "#2563EB",
      });
      setHasSearched(false);
    } else if (error === "server-error") {
      // Error real
      Swal.fire({
        icon: "error",
        title: "Ocurrió un problema",
        text: "No fue posible obtener el reporte de asistencia. Por favor, inténtalo de nuevo.",
        confirmButtonColor: "#2563EB",
      });
      setHasSearched(false);
    }
    // Caso: no hay error, pero el reporte es nulo o no hay datos
    else if (!error && !reporte) {
      Swal.fire({
        icon: "warning",
        title: "Sin resultados",
        text: "No se encontraron datos para la sección y fechas ingresadas.",
        confirmButtonColor: "#2563EB",
      });
      setHasSearched(false);
    }
  }, [hasSearched, loading, error, reporte]);

  /**
   * handleExportPDF:
   * Genera un PDF con la info del reporte
   */
  const handleExportPDF = () => {
    const input = document.getElementById("reporte-seccion");
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`Reporte_Asistencia_Seccion_${nombreSeccion}.pdf`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 text-gray-800 dark:text-gray-100 transition-colors duration-300">
    <h1 className="text-2xl font-bold mb-4">Reporte de Asistencia por Sección</h1>
  
    {/* Formulario */}
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Sección (ej: 7-1)
          </label>
          <input
            type="text"
            value={nombreSeccion}
            onChange={handleChangeSeccion}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md"
            placeholder="7-1, 10-2, 11-8, etc."
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={handleChangeFechaInicio}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Fecha Final
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={handleChangeFechaFin}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md"
          />
        </div>
  
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={loadingSecciones}
          >
            {loadingSecciones ? "Cargando secciones..." : "Consultar"}
          </button>
        </div>
      </form>
    </div>
  
    {/* Error al cargar secciones */}
    {errorSecciones && (
      <p className="text-red-500 dark:text-red-400">
        Error al cargar las secciones: {errorSecciones}
      </p>
    )}
  
    {/* Indicador de carga */}
    {loading && (
      <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4">
        Cargando reporte...
      </p>
    )}
  
    {/* Renderizado del reporte */}
    {reporte && (
      <div
        id="reporte-seccion"
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          Sección: {reporte.nombre_Seccion}
        </h2>
  
        <div className="mb-4">
          <h3 className="font-bold">Estadísticas Generales</h3>
          <p>Asistencias Totales: {reporte.estadisticas_generales.total_asistencias}</p>
          <p>Ausencias Totales: {reporte.estadisticas_generales.total_ausencias}</p>
          <p>Escapados Totales: {reporte.estadisticas_generales.total_escapados}</p>
          <p>Justificados Totales: {reporte.estadisticas_generales.total_justificados}</p>
        </div>
  
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Estudiante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Asistencias
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Ausencias
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Escapados
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Justificados
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {reporte.estudiantes.map((est) => (
              <tr key={est.id_Estudiante}>
                <td className="px-6 py-4 whitespace-nowrap">{est.nombre_completo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{est.asistencias}</td>
                <td className="px-6 py-4 whitespace-nowrap">{est.ausencias}</td>
                <td className="px-6 py-4 whitespace-nowrap">{est.escapados}</td>
                <td className="px-6 py-4 whitespace-nowrap">{est.justificados}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  
    {/* Exportar PDF */}
    {reporte && (
      <div className="mt-6">
        <button
          onClick={handleExportPDF}
          className="w-full bg-green-700 hover:bg-green-800 text-white p-2 rounded-md shadow focus:ring-2 focus:ring-green-600 focus:outline-none"
        >
          Exportar Reporte a PDF
        </button>
      </div>
    )}
  </div>
  
  );
};

export default ReporteAsistenciaSeccion;