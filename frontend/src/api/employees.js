import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

export const getEmployees = async (params = {}) => {
  const response = await api.get('/employees', { params });
  return response.data;
};

export const createEmployee = async (payload) => {
  const response = await api.post('/employees', payload);
  return response.data;
};

export const updateEmployee = async (id, payload) => {
  const response = await api.put(`/employees/${id}`, payload);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
};
