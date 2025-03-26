// src/auth/pages/ForgotPassword.jsx
import { useState, useEffect } from 'react';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const ForgotPassword = () => {
  const [email_Usuario, setEmail_Usuario] = useState('');
  const { handleForgotPassword } = useForgotPassword();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Verificar si hay un correo temporal en localStorage
    const tempEmail = localStorage.getItem('tempEmail');
    if (tempEmail) {
      setEmail_Usuario(tempEmail); // Rellenar automáticamente el campo
      localStorage.removeItem('tempEmail'); // Limpiar el correo temporal
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return; // Evita múltiples envíos
    }

    setIsSubmitting(true);

    try {
      await handleForgotPassword(email_Usuario);

      // Mostrar alerta de éxito y redirigir al inicio
      Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Se ha enviado un enlace para restablecer tu contraseña.',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        navigate('/'); // Redirigir a la página de inicio
      });
    } catch (error) {
      if (error.status === 404) {
        // Mostrar SweetAlert específico para el error 404
        Swal.fire({
          icon: 'error',
          title: 'Correo no encontrado',
          text: 'El correo electrónico ingresado no está registrado.',
          confirmButtonText: 'Aceptar',
        });
      } else {
        // Manejar otros errores
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Ocurrió un error al enviar el correo.',
          confirmButtonText: 'Aceptar',
        });
      }
    } finally {
      setIsSubmitting(false); // Habilitar el botón nuevamente
    }
  };

  const handleBackToInformativa = () => {
    navigate('/paginainformativa/login'); // Redirigir a /paginainformativa
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-8 shadow-2xl rounded-xl">
          {/* Botón de flecha */}
          <button
            onClick={handleBackToInformativa}
            className="flex items-center text-blue-500 hover:text-blue-700 transition duration-150 mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">Volver</span>
          </button>

          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
            Recuperar contraseña
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email_Usuario" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                id="email_Usuario"
                name="email_Usuario"
                type="email"
                value={email_Usuario}
                onChange={(e) => setEmail_Usuario(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 placeholder-gray-500 transition ease-in-out duration-150"
                placeholder="Ingresa tu correo electrónico"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150
                      ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}
                    `}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
