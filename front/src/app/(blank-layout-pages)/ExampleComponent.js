'use client';
import React, { useEffect } from 'react';
import useApi from '@/hooks/useApi';

const ExampleComponent = () => {
  const { loading, error, get, post } = useApi('https://api.example.com');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get('/data');
        console.log(data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, [get]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { name: 'Example' };

    try {
      const response = await post('/data', formData);
      console.log('Data submitted:', response);
    } catch (err) {
      console.error('Failed to submit data:', err);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ExampleComponent; 