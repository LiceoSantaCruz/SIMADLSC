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

  if (loading) return <p className="text-center text-blue-600 dark:text-blue-300">Cargando estadísticas...</p>;
  if (error) return <p className="text-center text-red-500 dark:text-red-400">{error}</p>;

  const totalEstudiantes = estudiantes.length;
  const totalHombres = estudiantes.filter(est => est.sexo === "Masculino").length;
  const totalMujeres = estudiantes.filter(est => est.sexo === "Femenino").length;

  const porcentajeHombres = ((totalHombres / totalEstudiantes) * 100).toFixed(1);
  const porcentajeMujeres = ((totalMujeres / totalEstudiantes) * 100).toFixed(1);

  return (
    <div className="p-12 bg-gradient-to-r from-blue-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 min-h-full transition-colors duration-300">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
        📊 Estadísticas del Colegio
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Total de Estudiantes */}
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md bg-white dark:bg-gray-900 flex flex-col items-center">
          <Users className="text-gray-700 dark:text-gray-200 w-12 h-12 mb-2" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Total Estudiantes</h3>
          <p className="text-5xl font-bold text-gray-900 dark:text-white">
            <CountUp end={totalEstudiantes} duration={2.5} />
          </p>
        </div>

        {/* Hombres */}
        <div className="p-6 border border-blue-300 dark:border-blue-500 rounded-xl shadow-md bg-white dark:bg-gray-900 flex flex-col items-center">
          <Mars className="text-blue-500 dark:text-blue-400 w-12 h-12 mb-2" />
          <h3 className="text-xl font-semibold text-blue-500 dark:text-blue-400">Hombres</h3>
          <p className="text-5xl font-bold text-blue-600 dark:text-blue-300">
            <CountUp end={totalHombres} duration={2.5} />
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{porcentajeHombres}% del total</p>
        </div>

        {/* Mujeres */}
        <div className="p-6 border border-pink-300 dark:border-pink-500 rounded-xl shadow-md bg-white dark:bg-gray-900 flex flex-col items-center">
          <Venus className="text-pink-500 dark:text-pink-400 w-12 h-12 mb-2" />
          <h3 className="text-xl font-semibold text-pink-500 dark:text-pink-400">Mujeres</h3>
          <p className="text-5xl font-bold text-pink-600 dark:text-pink-300">
            <CountUp end={totalMujeres} duration={2.5} />
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{porcentajeMujeres}% del total</p>
        </div>
      </div>
    </div>
  );
};
