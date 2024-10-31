import { useReporteAsistencia } from './Hook/useReporteAsistencia';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { usePeriodos } from './Hook/usePeriodos';

export const ReporteAsistencia = () => {
  const {
    cedula,
    setCedula,
    grado,
    seccion,
    fechaInicio,
    fechaFin,
    idPeriodo,
    setFechaInicio,
    setFechaFin,
    setIdPeriodo,
    asistencias,
    error,
    buscarAsistencias,
    
  } = useReporteAsistencia();

  const {periodos} = usePeriodos();

  const handleSubmit = (e) => {
    e.preventDefault();
    buscarAsistencias();
  };

  const handleExportPDF = () => {
    const input = document.getElementById('reporte-asistencias');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`Reporte_Asistencias_${cedula}.pdf`);
      })
      .catch((err) => {
        console.error('Error al generar el PDF:', err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Reportes de Asistencia</h1>
        <p className="text-gray-600">
          Consulta y gestiona los reportes de asistencia por cédula de estudiante y fechas.
        </p>
      </div>

      {/* Formulario de búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">
              Cédula del Estudiante
            </label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Ingresa la cédula del estudiante"
              required
            />
          </div>

          <div>
            <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700">
              Fecha de Inicio
            </label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700">
              Fecha Final
            </label>
            <input
              type="date"
              id="fechaFin"
              name="fechaFin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* Select para el periodo */}
          <div>
            <label htmlFor="idPeriodo" className="block text-sm font-medium text-gray-700">
              Periodo
            </label>
            <select
              name="idPeriodo"
              value={idPeriodo}
              onChange={(e) => setIdPeriodo(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Seleccionar Periodo</option>
              {periodos.map((periodo) => (
                <option key={periodo.id_Periodo} value={periodo.id_Periodo}>
                  {periodo.nombre_Periodo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {/* Resultados */}
      {asistencias.length > 0 && (
        <>
          <div id="reporte-asistencias" className="bg-white p-4 rounded-lg shadow overflow-x-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Grado: {grado}</h3>
              <h3 className="text-lg font-semibold">Sección: {seccion}</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Materia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Justificación
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {asistencias.map((asistencia) => (
                  <tr key={asistencia.asistencia_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(asistencia.fecha).toLocaleDateString()}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${
                        asistencia.estado === 'PRESENTE' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {asistencia.estado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {asistencia.id_Materia.nombre_Materia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {`${asistencia.id_Profesor.nombre_Profesor} ${asistencia.id_Profesor.apellido1_Profesor}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {asistencia.justificacionAusencia
                        ? asistencia.justificacionAusencia.descripcion
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botón para exportar a PDF */}
          <div className="mt-6">
            <button
              onClick={handleExportPDF}
              className="w-full bg-green-700 text-white p-2 rounded-md shadow hover:bg-green-800 focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            >
              Exportar Reporte a PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReporteAsistencia;
