import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

export default function LoginPage() {
  const [email_Usuario, setEmail_Usuario] = useState("");
  const [contraseña_Usuario, setContraseña_Usuario] = useState("");
  const navigate = useNavigate(); // Mueve useNavigate aquí

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar mensajes anteriores
    MySwal.close(); // Cerrar cualquier SweetAlert anterior

    if (!email_Usuario || !contraseña_Usuario) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa todos los campos.",
      });
      return;
    }

    try {
      // Limpiar el token y el role antes de hacer una nueva solicitud
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("id_Usuario");
      localStorage.removeItem("id_Estudiante");
      localStorage.removeItem("id_Profesor");
      localStorage.removeItem("userData");

      const API_URL = import.meta.env.VITE_API_URL;

      //https://simadlsc-backend-production.up.railway.app/auth/login
      // Realizar la petición al servidor para el login
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_Usuario, contraseña_Usuario }),
      });

      // Verificar si la respuesta no es 200 (OK)
      if (!response.ok) {
        const errorData = await response.json();

        // Comprobar el mensaje de error y ajustar según sea necesario
        const errorMessage =
          errorData.message === "Invalid email"
            ? "Correo electrónico incorrecto."
            : errorData.message === "Invalid password"
            ? "Contraseña incorrecta."
            : "Error en el inicio de sesión. Credenciales incorrectas.";

        MySwal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
        return;
      }

      const data = await response.json();
      
      // Extraer los datos relevantes de la respuesta
      const role = data.role; // Asegúrate de que esto sea correcto
      const token = data.access_token; // Asegúrate de que esto sea correcto
      const idProfesor = data.payload?.id_Profesor; // Cambia esta línea
      const idEstudiante = data.payload?.id_Estudiante; // Cambia esta línea
      const userData = data.user_data; // Verifica si esto es correcto
      const materia = data.payload?.materia; // Verifica si esto es correcto
      
      
      // Verificar si existe un rol
      if (!role) {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "El rol de usuario no está definido.",
        });
        return;
      }

      // Guardar el token y el role en localStorage
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        if (idProfesor) {
          localStorage.setItem("id_profesor", idProfesor);
        }
        if (idEstudiante) {
        localStorage.setItem("id_estudiante", idEstudiante);
      }
        if (materia) {
        localStorage.setItem("materia", materia);
      }
        localStorage.setItem("user_data", JSON.stringify(userData));
      } catch (error) {
        console.error("Error al guardar en localStorage:", error);
      }

      // Mostrar mensaje de éxito
      MySwal.fire({
        icon: "success",
        title: "Éxito",
        text: "Inicio de sesión exitoso",
      });

      // Redirigir al usuario a la página principal o una específica según el rol
      if (role === "profesor") {
        navigate("/horarios/profesor"); // Redirigir a la página de horarios del profesor
      } else if (role === "estudiante") {
        navigate("/horarios/estudiante"); // Redirigir a la página de horarios del estudiante
      } else {
        navigate("/"); // Redirigir a la página principal
      }

    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "Error de conexión con el servidor.",
      });
    }
  };

  // Función para redirigir a "paginainformativa"
  const handleGoBack = () => {
    navigate("/paginainformativa");
  };

  // Función para redirigir a "forgot-password"
  const ForgotPassword = () => {
    navigate("/auth/forgot-password");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-8 shadow-2xl rounded-xl transition-transform transform hover:scale-105">
          <h2 className="text-center text-3xl font-bold text-blue-900 mb-4">
            Inicia sesión en tu cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800"
              >
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email_Usuario"
                  type="email"
                  value={email_Usuario}
                  onChange={(e) => setEmail_Usuario(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition ease-in-out duration-150"
                  placeholder="Ingresa tu correo electrónico"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-800"
              >
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="contraseña_Usuario"
                  type="password"
                  value={contraseña_Usuario}
                  onChange={(e) => setContraseña_Usuario(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition ease-in-out duration-150"
                  placeholder="Ingresa tu contraseña"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handleGoBack}
              className="text-blue-700 font-medium hover:underline flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver
            </button>

            <button
              onClick={ForgotPassword}
              className="text-blue-600 font-medium hover:underline hover:text-blue-800"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
