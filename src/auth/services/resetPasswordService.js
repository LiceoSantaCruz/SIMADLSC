// src/auth/services/resetPasswordService.js
export const resetPassword = async (token, password) => {
    const response = await fetch('http://localhost:3000/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
  
    if (!response.ok) {
      throw new Error('Hubo un error al restablecer la contraseña.');
    }
  
    return await response.json();
  };
  