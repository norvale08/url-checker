import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  createJob: async (urls: string[]) => {
    const res = await axios.post(`${API_URL}/jobs`, { urls });
    return res.data;
  },
  getJobs: async () => {
    const res = await axios.get(`${API_URL}/jobs`);
    return res.data;
  },
  getJobDetails: async (id: string) => {
    const res = await axios.get(`${API_URL}/jobs/${id}`);
    return res.data;
  },
  cancelJob: async (id: string) => {
    const res = await axios.delete(`${API_URL}/jobs/${id}`);
    return res.data;
  }
};
