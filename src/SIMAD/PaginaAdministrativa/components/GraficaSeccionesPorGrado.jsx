import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import CountUp from "react-countup";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registramos los componentes de Chart.js que necesitamos
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://simadlsc-backend-production.up.railway.app";

export const GraficaSeccionesPorGrado = () => {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapeo de gradoId a nombre de grado (1 -> 7°, 2 -> 8°, 3 -> 9°, 4 -> 10°, 5 -> 11°)
  const gradeMap = {
    1: "7°",
    2: "8°",
    3: "9°",
    4: "10°",
    5: "11°",
  };

  // Contadores iniciales para cada grado
  const initialGradeCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  useEffect(() => {
    const fetchSecciones = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/secciones`);
        setSecciones(data);
      } catch (err) {
        console.error(err);
        setError("Error al obtener las secciones");
      } finally {
        setLoading(false);
      }
    };
    fetchSecciones();
  }, []);

  if (loading) {
    return <p className="text-center text-blue-600">Cargando gráfica...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // Contar cuántas secciones hay para cada gradoId
  const gradeCounts = { ...initialGradeCounts };
  secciones.forEach((sec) => {
    const grade = Number(sec.gradoId);
    if (gradeCounts.hasOwnProperty(grade)) {
      gradeCounts[grade] += 1;
    }
  });

  // Convertimos el objeto de contadores en datos para la gráfica
  const gradeIds = Object.keys(gradeMap).map(Number); // [1,2,3,4,5]
  const labels = gradeIds.map((id) => gradeMap[id]);   // ["7°","8°","9°","10°","11°"]
  const dataCounts = gradeIds.map((id) => gradeCounts[id]);

  const data = {
    labels,
    datasets: [
      {
        label: "Cantidad de Secciones",
        data: dataCounts,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Opciones para quitar decimales tanto en el eje y como en los tooltips
  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          precision: 0, // Elimina decimales en el eje y
        },
      },
    },
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Secciones por Grado (7° - 11°)",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = Math.round(context.parsed.y);
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  // Calcular total de secciones
  const totalSecciones = secciones.length;

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-pink-50 min-h-full">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        📊 Gráfica de Secciones por Grado
      </h2>
      
      {/* Mostrar el total de secciones */}
      <div className="mb-8 text-center">
        <p className="text-xl font-medium text-gray-700">
          Total de Secciones:
        </p>
        <p className="text-5xl font-bold text-gray-900">
          <CountUp end={totalSecciones} duration={2.5} />
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
