// src/services/apiService.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3006'
});

export const fetchAgs = async () => {
  const response = await apiClient.get('/ags');
  return response.data;
};
