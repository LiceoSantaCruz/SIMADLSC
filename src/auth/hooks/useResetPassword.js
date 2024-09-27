// src/auth/hooks/useResetPassword.js
import { useState } from 'react';
import { resetPassword } from '../services/resetPasswordService';

export const useResetPassword = (token) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResetPassword = async (password) => {
    try {
      setError('');
      await resetPassword(token, password);
      setSuccess('Contraseña restablecida con éxito.');
    } catch (error) {
      setError(error.message);
    }
  };

  return { handleResetPassword, error, success };
};
