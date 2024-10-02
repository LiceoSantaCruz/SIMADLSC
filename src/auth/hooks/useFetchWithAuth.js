import { useAuth } from './useAuth';

export const useFetchWithAuth = () => {
  const { token } = useAuth();

  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || 'Error en la solicitud');
      error.status = response.status;
      throw error;
    }
    return response.json();
  };

  return { fetchWithAuth };
};
