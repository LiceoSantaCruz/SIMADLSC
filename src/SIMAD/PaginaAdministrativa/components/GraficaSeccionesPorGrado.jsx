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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://simadlsc-backend-production.up.railway.app";

export const GraficaSeccionesPorGrado = () => {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gradeMap = {
    1: "7°",
    2: "8°",
    3: "9°",
    4: "10°",
    5: "11°",
  };

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
    return <p className="text-center text-blue-600 dark:text-blue-300">Cargando gráfica...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 dark:text-red-400">{error}</p>;
  }

  const gradeCounts = { ...initialGradeCounts };
  secciones.forEach((sec) => {
    const grade = Number(sec.gradoId);
    if (gradeCounts.hasOwnProperty(grade)) {
      gradeCounts[grade] += 1;
    }
  });

  const gradeIds = Object.keys(gradeMap).map(Number);
  const labels = gradeIds.map((id) => gradeMap[id]);
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

  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          precision: 0,
          color: "#9ca3af", // gray-400 para modo oscuro también
        },
        grid: {
          color: "#e5e7eb", // gray-200 para modo claro
        },
      },
      x: {
        ticks: {
          color: "#9ca3af",
        },
        grid: {
          color: "#e5e7eb",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#4b5563", // text-gray-700
        },
      },
      title: {
        display: true,
        text: "Secciones por Grado (7° - 11°)",
        color: "#111827", // gray-900
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

  const totalSecciones = secciones.length;

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 min-h-full">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
        📊 Gráfica de Secciones por Grado
      </h2>

      <div className="mb-8 text-center">
        <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
          Total de Secciones:
        </p>
        <p className="text-5xl font-bold text-gray-900 dark:text-white">
          <CountUp end={totalSecciones} duration={2.5} />
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
