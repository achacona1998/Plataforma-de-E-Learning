import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Hook personalizado para manejar llamadas a la API con estado de carga y error
 * @param {string} url - URL de la API
 * @param {object} options - Opciones adicionales (method, data, dependencies)
 * @returns {object} - { data, loading, error, refetch }
 */
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    method = 'GET',
    data: requestData = null,
    dependencies = [],
    immediate = true
  } = options;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const config = {
        method,
        url: `http://localhost:5000${url}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (requestData && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.data = requestData;
      }

      const response = await axios(config);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error en la solicitud');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && url) {
      fetchData();
    }
  }, [url, immediate, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Hook para manejar operaciones CRUD básicas
 * @param {string} baseUrl - URL base del recurso
 * @returns {object} - Funciones CRUD y estados
 */
export const useCrud = (baseUrl) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000${baseUrl}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setItems(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000${baseUrl}`, itemData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setItems(prev => [...prev, response.data.data || response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000${baseUrl}/${id}`, itemData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setItems(prev => prev.map(item => 
        item._id === id ? (response.data.data || response.data) : item
      ));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000${baseUrl}/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setItems,
    setError
  };
};