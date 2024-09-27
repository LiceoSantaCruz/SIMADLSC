// src/auth/pages/ForgotPassword.jsx
import { useState } from 'react';
import { useForgotPassword } from '../hooks/useForgotPassword';

export const ForgotPassword = () => {
  const [email_Usuario, setEmail_Usuario] = useState('');
  const { handleForgotPassword, error, success } = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleForgotPassword(email_Usuario);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-8 shadow-2xl rounded-xl transition-transform transform hover:scale-105">
          <h2 className="text-center text-3xl font-bold text-blue-900 mb-4">
            Recuperar contraseña
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email_Usuario"
                type="email"
                value={email_Usuario}
                onChange={(e) => setEmail_Usuario(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition ease-in-out duration-150"
                placeholder="Ingresa tu correo electrónico"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <div>
              <button
                type="submit"
                className="w-full justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              >
                Enviar enlace
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
