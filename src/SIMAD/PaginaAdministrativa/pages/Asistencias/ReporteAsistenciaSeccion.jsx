import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useReporteAsistenciaSeccion } from './Hook/useReporteAsistenciaSeccion';
import useAllSecciones from './Hook/seAllSecciones';

// Hook que obtiene el reporte
// Hook que trae TODAS las secciones

const ReporteAsistenciaSeccion = () => {
  // Aquí guardamos el texto que digita el usuario (ej: "7-1")
  const [nombreSeccion, setNombreSeccion] = useState('');

  // Fechas
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Hook para obtener el reporte
  const { reporte, loading, error, buscarReporteSeccion } = useReporteAsistenciaSeccion();

  // Hook para cargar todas las secciones (podrías usar useSecciones si tienes un grado, pero
  // aquí asumo que quieres buscar libremente por nombre de sección).
  const {
    secciones,          // Array de objetos: [{ id_Seccion, nombre_Seccion }, ...]
    loadingSecciones,
    errorSecciones
  } = useAllSecciones();

  // Manejo de submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de fechas
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      alert('La fecha de inicio no puede ser mayor que la fecha de fin.');
      return;
    }

    // Validación de formato de sección
    if (!nombreSeccion.match(/^\d+-\d+$/)) {
      alert('El formato de la sección es incorrecto. Debe ser algo como "7-1".');
      return;
    }

    if (!nombreSeccion || !fechaInicio || !fechaFin) {
      alert('Por favor completa todos los campos.');
      return;
    }

    // Buscamos la sección que coincida con lo digitado (ignorando mayúsculas/minúsculas)
    const seccionEncontrada = secciones.find(
      (sec) => sec.nombre_Seccion.toLowerCase() === nombreSeccion.toLowerCase()
    );

    if (!seccionEncontrada) {
      alert(`No se encontró la sección "${nombreSeccion}". Verifica el nombre.`);
      return;
    }

    // Si la encontramos, tomamos su ID real
    const idSeccion = seccionEncontrada.id_Seccion;

    // Ahora sí, llamamos a la función que hace la búsqueda del reporte
    try {
      await buscarReporteSeccion({ idSeccion, fechaInicio, fechaFin });
    } catch (error) {
      alert('Ocurrió un error al buscar el reporte. Por favor intenta nuevamente.');
    }
  };

  // Manejo de exportar a PDF (igual que tu ejemplo)
  const handleExportPDF = () => {
    const input = document.getElementById('reporte-seccion');
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Reporte_Asistencia_Seccion_${nombreSeccion}.pdf`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Reporte de Asistencia por Sección</h1>

      {/* Formulario */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Input para la sección, en lugar de un ID numérico */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Sección (ej: 7-1)</label>
            <input
              type="text"
              value={nombreSeccion}
              onChange={(e) => setNombreSeccion(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="7-1, 10-2, 11-8, etc."
              required
            />
          </div>

          {/* Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Fecha Fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Final</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Botón */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md shadow hover:bg-blue-600"
              disabled={loadingSecciones}
            >
              {loadingSecciones ? 'Cargando secciones...' : 'Consultar'}
            </button>
          </div>
        </form>
      </div>

      {/* Errores de secciones */}
      {errorSecciones && <p className="text-red-500">Error: {errorSecciones}</p>}

      {/* Cargando o error del reporte */}
      {loading && <p>Cargando reporte...</p>}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Renderizar reporte */}
      {reporte && (
        <div id="reporte-seccion" className="bg-white p-4 rounded-lg shadow overflow-x-auto mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Sección: {reporte.nombre_Seccion} (ID: {reporte.id_Seccion})
          </h2>

          <div className="mb-4">
            <h3 className="font-bold">Estadísticas Generales</h3>
            <p>Asistencias Totales: {reporte.estadisticas_generales.total_asistencias}</p>
            <p>Ausencias Totales: {reporte.estadisticas_generales.total_ausencias}</p>
            <p>Escapados Totales: {reporte.estadisticas_generales.total_escapados}</p>
            <p>Justificados Totales: {reporte.estadisticas_generales.total_justificados}</p>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asistencias</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ausencias</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Escapados</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Justificados</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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

      {/* Botón para exportar PDF */}
      {reporte && (
        <div className="mt-6">
          <button
            onClick={handleExportPDF}
            className="w-full bg-green-700 text-white p-2 rounded-md shadow hover:bg-green-800"
          >
            Exportar Reporte a PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ReporteAsistenciaSeccion;
