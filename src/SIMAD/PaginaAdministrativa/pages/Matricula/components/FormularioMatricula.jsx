import useGrados from "../../Asistencias/Hook/useGrados";
import { useMatriculaForm } from "../Hooks/useMatriculaForm";
import { usePeriodos } from "../Hooks/usePeriodos";

export const FormularioMatricula = () => {
  const {
    page,
    setPage,
    formData,
    handleChange,
    handleSubmit,
    handleDownloadPDF,
    isSubmitting,
  } = useMatriculaForm();

  const { periodos } = usePeriodos();
  const { grados } = useGrados();

  // Función para calcular la edad a partir de la fecha de nacimiento
  const handleFechaNacimientoChange = (e) => {
    handleChange(e);
    const birthDate = new Date(e.target.value);
    if (!e.target.value || isNaN(birthDate.getTime())) return;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    // Actualizamos el campo 'edad' en el estado del formulario
    const edadEvent = {
      target: { name: "estudiante.edad", value: age },
    };
    handleChange(edadEvent);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md">
      <h1 className="text-center text-2xl font-bold mb-2">
        Boleta de Matrícula Año 2025
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Por favor, complete todos los campos solicitados con datos verídicos.
        Verifique la información antes de enviar el formulario.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {page === 1 ? (
          <>
            {/* Página 1: Datos del Estudiante */}
            <div className="flex justify-between">
              <div>
                <label className="block text-gray-700">Periodo:</label>
                {periodos.length === 0 ? (
                  <p>Cargando periodos...</p>
                ) : (
                  <select
                    name="periodo"
                    value={formData.periodo}
                    onChange={handleChange}
                    className="border p-2 rounded-md w-full"
                  >
                    <option value="">Seleccione un periodo</option>
                    {periodos.map((periodo) => (
                      <option
                        key={periodo.id_Periodo}
                        value={periodo.id_Periodo}
                      >
                        {periodo.nombre_Periodo}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-gray-700">Grado:</label>
                {grados.length === 0 ? (
                  <p>Cargando grados...</p>
                ) : (
                  <select
                    name="estudiante.gradoId"
                    value={formData.estudiante.gradoId}
                    onChange={handleChange}
                    className="border p-2 rounded-md w-full"
                  >
                    <option value="">Seleccione un grado</option>
                    {grados.map((grado) => (
                      <option key={grado.id_grado} value={grado.id_grado}>
                        {grado.nivel}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <h2 className="text-lg font-semibold">Datos del Estudiante</h2>
            <p className="text-sm text-gray-500 mb-2">
              Complete la información personal del estudiante. Asegúrese de que los datos sean correctos.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Nombre Completo:</label>
                <input
                  type="text"
                  name="estudiante.nombre_Estudiante"
                  value={formData.estudiante.nombre_Estudiante}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">1º Apellido:</label>
                <input
                  type="text"
                  name="estudiante.apellido1_Estudiante"
                  value={formData.estudiante.apellido1_Estudiante}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">2º Apellido:</label>
                <input
                  type="text"
                  name="estudiante.apellido2_Estudiante"
                  value={formData.estudiante.apellido2_Estudiante}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  Nº Cédula o Pasaporte:
                </label>
                <input
                  type="text"
                  name="estudiante.cedula"
                  value={formData.estudiante.cedula}
                  onChange={handleChange}
                  placeholder="5-0123-0456"
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Teléfono:</label>
                <input
                  type="text"
                  name="estudiante.telefono"
                  value={formData.estudiante.telefono}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Correo Estudiantil:</label>
                <input
                  type="email"
                  name="estudiante.correo_estudiantil"
                  value={formData.estudiante.correo_estudiantil}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <label className="block text-gray-700">Sexo:</label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="estudiante.sexo"
                  value="Femenino"
                  checked={formData.estudiante.sexo === "Femenino"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Femenino
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="estudiante.sexo"
                  value="Masculino"
                  checked={formData.estudiante.sexo === "Masculino"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Masculino
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700">Lugar de Nacimiento:</label>
                <input
                  type="text"
                  name="estudiante.lugar_de_nacimiento"
                  value={formData.estudiante.lugar_de_nacimiento}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Fecha de Nacimiento:</label>
                <input
                  type="date"
                  name="estudiante.fecha_nacimiento"
                  value={formData.estudiante.fecha_nacimiento}
                  onChange={handleFechaNacimientoChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Nacionalidad:</label>
                <input
                  type="text"
                  name="estudiante.nacionalidad"
                  value={formData.estudiante.nacionalidad}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Edad:</label>
                <input
                  type="number"
                  name="estudiante.edad"
                  value={formData.estudiante.edad}
                  readOnly
                  className="border p-2 rounded-md w-full"
                />
              </div>
            </div>

            {/* Se agregan los campos de Condición Migratoria y Repite alguna materia */}
            <div className="flex space-x-4">
              <label className="block text-gray-700">Condición Migratoria:</label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="estudiante.condicion_migratoria"
                  value="legal"
                  checked={formData.estudiante.condicion_migratoria === "legal"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Legal
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="estudiante.condicion_migratoria"
                  value="refugiado"
                  checked={formData.estudiante.condicion_migratoria === "refugiado"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Refugiado
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="estudiante.condicion_migratoria"
                  value="ilegal"
                  checked={formData.estudiante.condicion_migratoria === "ilegal"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Ilegal
              </label>
            </div>

            <div>
              <label className="block text-gray-700">Repite alguna materia:</label>
              <input
                type="text"
                name="estudiante.Repite_alguna_materia"
                value={formData.estudiante.Repite_alguna_materia}
                onChange={handleChange}
                className="border p-2 rounded-md w-full mt-1"
                placeholder="Si repite alguna materia, ingrese el nombre; de lo contrario, déjelo en blanco."
              />
            </div>

            <div>
              <label className="block text-gray-700">Institución de Procedencia:</label>
              <input
                type="text"
                name="estudiante.institucion_de_procedencia"
                value={formData.estudiante.institucion_de_procedencia}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Tipo de Adecuación:</label>
                <select
                  name="estudiante.tipo_de_adecuacion"
                  value={formData.estudiante.tipo_de_adecuacion}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">Seleccione una opción</option>
                  <option value="N">No presenta</option>
                  <option value="DA">Adecuación de Acceso</option>
                  <option value="S">Adecuación Significativa</option>
                  <option value="NS">Adecuación No Significativa</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700">Recibe Religión:</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="estudiante.recibe_religion"
                      value="Si"
                      checked={formData.estudiante.recibe_religion === "Si"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Sí
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="estudiante.recibe_religion"
                      value="No"
                      checked={formData.estudiante.recibe_religion === "No"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700">Presenta Carta:</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="estudiante.presenta_carta"
                      value="Si"
                      checked={formData.estudiante.presenta_carta === "Si"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Sí
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="estudiante.presenta_carta"
                      value="No"
                      checked={formData.estudiante.presenta_carta === "No"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold">Enfermedades y Medicamentos</h2>
            <p className="text-sm text-gray-500 mb-2">
              Si el estudiante presenta alguna condición médica o necesita medicación específica, indíquelo aquí.
            </p>

            <div>
              <label className="block text-gray-700">Presenta alguna enfermedad:</label>
              <input
                type="text"
                name="estudiante.Presenta_alguna_enfermedad"
                value={formData.estudiante.Presenta_alguna_enfermedad}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700">Medicamentos que debe tomar:</label>
              <input
                type="text"
                name="estudiante.medicamentos_que_debe_tomar"
                value={formData.estudiante.medicamentos_que_debe_tomar}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700">Ruta que viaja el estudiante:</label>
              <input
                type="text"
                name="estudiante.Ruta_de_viaje"
                value={formData.estudiante.Ruta_de_viaje}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
              />
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={() => setPage(2)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
              >
                Siguiente
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold">Datos del Encargado Legal</h2>
            <p className="text-sm text-gray-500 mb-2">
              Ingrese la información del encargado legal o tutor del estudiante. Asegúrese de completar todos los campos.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Nombre Completo:</label>
                <input
                  type="text"
                  name="encargadoLegal.nombre_Encargado_Legal"
                  value={formData.encargadoLegal.nombre_Encargado_Legal}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">1º Apellido:</label>
                <input
                  type="text"
                  name="encargadoLegal.apellido1_Encargado_Legal"
                  value={formData.encargadoLegal.apellido1_Encargado_Legal}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">2º Apellido:</label>
                <input
                  type="text"
                  name="encargadoLegal.apellido2_Encargado_Legal"
                  value={formData.encargadoLegal.apellido2_Encargado_Legal}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Nº Cédula:</label>
                <input
                  type="text"
                  name="encargadoLegal.N_Cedula"
                  value={formData.encargadoLegal.N_Cedula}
                  onChange={handleChange}
                  placeholder="5-0123-0456"
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Ocupación:</label>
                <input
                  type="text"
                  name="encargadoLegal.ocupacion"
                  value={formData.encargadoLegal.ocupacion}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Nacionalidad:</label>
                <input
                  type="text"
                  name="encargadoLegal.nacionalidad"
                  value={formData.encargadoLegal.nacionalidad}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Dirección:</label>
                <input
                  type="text"
                  name="encargadoLegal.direccion"
                  value={formData.encargadoLegal.direccion}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Teléfono Celular:</label>
                <input
                  type="text"
                  name="encargadoLegal.telefono_celular"
                  value={formData.encargadoLegal.telefono_celular}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Habitación:</label>
                <input
                  type="text"
                  name="encargadoLegal.habitacion"
                  value={formData.encargadoLegal.habitacion}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Correo:</label>
                <input
                  type="email"
                  name="encargadoLegal.correo"
                  value={formData.encargadoLegal.correo}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600"
              >
                Descargar PDF
              </button>
              <button
                type="button"
                onClick={() => setPage(1)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600"
              >
                Anterior
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default FormularioMatricula;
