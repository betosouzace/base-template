import { useState } from 'react';

const useApi = (baseURL) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, endpoint, data = null) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw the error for further handling if needed
    } finally {
      setLoading(false);
    }
  };

  const get = (endpoint) => request('GET', endpoint);
  const post = (endpoint, data) => request('POST', endpoint, data);
  const put = (endpoint, data) => request('PUT', endpoint, data);
  const del = (endpoint) => request('DELETE', endpoint);

  return { loading, error, get, post, put, del };
};

export default useApi; 