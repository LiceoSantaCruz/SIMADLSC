import { useEffect, useState } from "react";
import EstudiantesService from "../../PaginaAdministrativa/pages/Modulos academicos/Estudiantes/Service/EstudiantesService";
import { Users, Mars, Venus } from "lucide-react";
import CountUp from "react-countup";

export const Estadisticas = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const data = await EstudiantesService.getEstudiantes();
        setEstudiantes(data);
      } catch (err) {
        setError("Error al obtener los estudiantes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiantes();
  }, []);

  if (loading) return <p className="text-center text-blue-600">Cargando estadísticas...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // **Cálculos de estadísticas**
  const totalEstudiantes = estudiantes.length;
  const totalHombres = estudiantes.filter(est => est.sexo === "Masculino").length;
  const totalMujeres = estudiantes.filter(est => est.sexo === "Femenino").length;

  const porcentajeHombres = ((totalHombres / totalEstudiantes) * 100).toFixed(1);
  const porcentajeMujeres = ((totalMujeres / totalEstudiantes) * 100).toFixed(1);

  return (
    <div className="p-12 bg-gradient-to-r from-blue-50 to-pink-50 min-h-full ">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">📊 Estadísticas del Colegio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Total de Estudiantes */}
        <div className="p-6 border border-gray-200 rounded-xl shadow-md bg-white flex flex-col items-center">
          <Users className="text-gray-700 w-12 h-12 mb-2" />
          <h3 className="text-xl font-semibold text-gray-700">Total Estudiantes</h3>
          <p className="text-5xl font-bold text-gray-900">
            <CountUp end={totalEstudiantes} duration={2.5} />
          </p>
        </div>

        {/* Hombres */}
        <div className="p-6 border border-blue-300 rounded-xl shadow-md bg-white flex flex-col items-center">
          <Mars className="text-blue-500 w-12 h-12 mb-2" />
          <h3 className="text-xl font-semibold text-blue-500">Hombres</h3>
          <p className="text-5xl font-bold text-blue-600">
            <CountUp end={totalHombres} duration={2.5} />
          </p>
          <p className="text-sm text-gray-500">{porcentajeHombres}% del total</p>
        </div>

        {/* Mujeres */}
        <div className="p-6 border border-pink-300 rounded-xl shadow-md bg-white flex flex-col items-center">
          <Venus className="text-pink-500 w-12 h-12 mb-2" />
          <h3 className="text-xl font-semibold text-pink-500">Mujeres</h3>
          <p className="text-5xl font-bold text-pink-600">
            <CountUp end={totalMujeres} duration={2.5} />
          </p>
          <p className="text-sm text-gray-500">{porcentajeMujeres}% del total</p>
        </div>
      </div>
    </div>
  );
};
