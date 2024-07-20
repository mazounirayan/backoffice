// src/services/apiService.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://pa-api-0tcm.onrender.com'
});

export const fetchAgs = async () => {
  const response = await apiClient.get('/ags');
  return response.data;
};

export const fetchAgById = async (id:number) => {
    const response = await apiClient.get(`/ags/${id}`);
    return response.data;
  };
