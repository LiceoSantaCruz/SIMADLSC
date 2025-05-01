import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

export default function LoginPage() {
  const [email_Usuario, setEmail_Usuario] = useState("");
  const [contraseña_Usuario, setContraseña_Usuario] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    MySwal.close();

    if (!email_Usuario || !contraseña_Usuario) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa todos los campos.",
      });
      return;
    }

    try {
      // Limpia las claves antiguas
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("id_Usuario");
      localStorage.removeItem("id_Estudiante");
      localStorage.removeItem("id_Profesor");
      localStorage.removeItem("userData");

      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_Usuario, contraseña_Usuario }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 403) {
          let msg;
          if (typeof errorData.message === "string") {
            msg = errorData.message;
          } else if (Array.isArray(errorData.message)) {
            msg = errorData.message.join(", ");
          } else if (errorData.message && typeof errorData.message === "object") {
            msg = errorData.message.message ?? JSON.stringify(errorData.message);
          } else {
            msg = errorData.error ?? "Tu cuenta está bloqueada";
          }

          MySwal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: msg,
          });
          return;
        }

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
      const role = data.role;
      const token = data.access_token;
      const idProfesor = data.payload?.id_Profesor;
      const idEstudiante = data.payload?.id_Estudiante;
      const userData = data.user_data;
      const materia = data.payload?.materia;

     

      if (!role) {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "El rol de usuario no está definido.",
        });
        return;
      }

      // Guarda en localStorage usando la misma clave que luego lees
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (idProfesor !== undefined) {
        localStorage.setItem("id_Profesor", idProfesor);
      }
      if (idEstudiante !== undefined) {
        localStorage.setItem("id_Estudiante", idEstudiante);
      }
      if (materia !== undefined) {
        localStorage.setItem("materia", materia);
      }
      localStorage.setItem("userData", JSON.stringify(userData));

     
      MySwal.fire({
        icon: "success",
        title: "Éxito",
        text: "Inicio de sesión exitoso",
      });

      if (role === "profesor") navigate("/Usuario");
      else if (role === "estudiante") navigate("/Usuario");
      else navigate("/");
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "Error de conexión con el servidor.",
      });
    }
  };

  const handleGoBack = () => navigate("/paginainformativa");
  const ForgotPassword = () => navigate("/auth/forgot-password");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-8 shadow-2xl rounded-xl transition-transform transform hover:scale-105">
          <h2 className="text-center text-3xl font-bold text-blue-900 mb-4">
            Inicia sesión en tu cuenta
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email_Usuario"
                  type="email"
                  value={email_Usuario}
                  onChange={(e) => setEmail_Usuario(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 p-3 shadow-md text-black focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition ease-in-out duration-150"
                  placeholder="Ingresa tu correo electrónico"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="contraseña_Usuario"
                  type="password"
                  value={contraseña_Usuario}
                  onChange={(e) => setContraseña_Usuario(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 p-3 shadow-md text-black focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition ease-in-out duration-150"
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
              ← Volver
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
