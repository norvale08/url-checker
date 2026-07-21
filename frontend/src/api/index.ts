import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  timeout: 10000,
});

export const api = {
  createJob: async (urls: string[]) => {
    const res = await apiClient.post(`${API_URL}/jobs`, { urls });
    return res.data;
  },
  getJobs: async () => {
    const res = await apiClient.get(`${API_URL}/jobs`);
    return res.data;
  },
  getJobDetails: async (id: string) => {
    const res = await apiClient.get(`${API_URL}/jobs/${id}`);
    return res.data;
  },
  cancelJob: async (id: string) => {
    const res = await apiClient.delete(`${API_URL}/jobs/${id}`);
    return res.data;
  }
};
