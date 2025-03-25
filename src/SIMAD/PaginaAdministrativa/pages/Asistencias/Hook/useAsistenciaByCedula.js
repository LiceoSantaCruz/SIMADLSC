import { useState } from "react";
import { fetchAsistencias } from "../Services/AsistenciaService";

export const useAsistenciaByCedula = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(false);
  // Objeto { type, message? } para manejar tipos de error
  const [error, setError] = useState(null);

  const searchAsistencias = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAsistencias(params);
      setAsistencias(data);
    } catch (err) {
      console.error("Error en searchAsistencias:", err.message);

      // Analizamos el prefijo del mensaje
      if (err.message.startsWith("NOT_FOUND:")) {
        setError({ type: "not-found" });
      } else if (err.message.startsWith("CLIENT_ERROR:")) {
        setError({
          type: "server-error", // O "client-error" si prefieres un tipo distinto
          message: err.message.replace("CLIENT_ERROR:", "").trim(),
        });
      } else if (err.message.startsWith("SERVER_ERROR:")) {
        setError({
          type: "server-error",
          message: err.message.replace("SERVER_ERROR:", "").trim() ||
            "Ocurrió un problema al obtener las asistencias. Intenta de nuevo.",
        });
      } else if (err.message.startsWith("NETWORK_ERROR:")) {
        setError({
          type: "network-error",
          message: "No pudimos conectar con el servidor. Verifica tu conexión e inténtalo nuevamente.",
        });
      } else {
        // Cualquier otro caso no contemplado
        setError({
          type: "server-error",
          message: "Ocurrió un problema al obtener las asistencias. Intenta de nuevo.",
        });
      }
      setAsistencias([]);
    } finally {
      setLoading(false);
    }
  };

  return { asistencias, loading, error, searchAsistencias };
};