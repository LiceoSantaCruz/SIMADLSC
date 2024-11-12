export const AuthService = {
  resetPassword: async (token, contraseña_Usuario) => {
    try {
      const response = await fetch('https://simadlsc-backend-production.up.railway.app/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, contraseña_Usuario }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'Error en la solicitud');
        error.status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error('Error en resetPassword:', error);
      throw error; // Re-lanza el error para manejarlo en el componente que lo llama
    }
  },
};
