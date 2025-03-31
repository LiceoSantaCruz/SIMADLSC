import { useEffect, useState } from "react";

export default function ActivarFormularioButton({
    isFormActive,
    setIsFormActive,
    deadline,
    setDeadline,
    role
  }) {
    const [countdown, setCountdown] = useState("");
  
    useEffect(() => {
      if (!deadline) return;
  
      const intervalId = setInterval(() => {
        const now = new Date().getTime();
        const distance = deadline - now;
  
        // Si se cumple el plazo, deshabilitamos el formulario y actualizamos localStorage
        if (distance <= 0) {
          clearInterval(intervalId);
          setCountdown("00d 00h:00m:00s");
          setIsFormActive(false);
          localStorage.setItem("formActive", "false");
          localStorage.removeItem("formDeadline");
          return;
        }
  
        // Calculamos días, horas, minutos y segundos
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
        const formattedTime = `${days.toString().padStart(2, "0")}d ${hours
          .toString()
          .padStart(2, "0")}h:${minutes.toString().padStart(2, "0")}m:${seconds
          .toString()
          .padStart(2, "0")}s`;
        setCountdown(formattedTime);
      }, 1000);
  
      return () => clearInterval(intervalId);
    }, [deadline, setIsFormActive]);
  
    // Configuramos la activación por 4 días
    const handleEnable = () => {
      const fourDaysFromNow = new Date().getTime() + 4 * 24 * 60 * 60 * 1000;
      setDeadline(fourDaysFromNow);
      setIsFormActive(true);
      localStorage.setItem("formActive", "true");
      localStorage.setItem("formDeadline", fourDaysFromNow.toString());
    };
  
    // Deshabilita el formulario de inmediato
    const handleDisable = () => {
      setIsFormActive(false);
      setDeadline(null);
      setCountdown("");
      localStorage.setItem("formActive", "false");
      localStorage.removeItem("formDeadline");
    };
  
    return (
      <div className="mb-4 p-4 border border-gray-300 dark:border-gray-700 rounded-md flex flex-col items-center">
        {/* Solo se muestran los botones si el usuario es admin o superadmin */}
        {(role === "admin" || role === "superadmin") && (
          <div className="flex justify-center space-x-2 mb-2">
            <button
              onClick={handleEnable}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Habilitar Formulario
            </button>
            <button
              onClick={handleDisable}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Deshabilitar Formulario
            </button>
          </div>
        )}
        {/* El contador se muestra para cualquier usuario, si existe deadline y el formulario está activo */}
        {deadline && isFormActive && (
          <p className="text-gray-800 dark:text-gray-200">
            Tiempo restante: <strong>{countdown}</strong>
          </p>
        )}
      </div>
    );
  }