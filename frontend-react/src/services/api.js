import axios from 'axios';
const apiClient = axios.create({ baseURL: 'http://localhost:8000/api' });

export const uploadRisetFiles = (formData) => apiClient.post('/riset/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getFilteredLinks = () => apiClient.get('/riset/links');
export const resetRisetData = () => apiClient.post('/riset/reset');

export const analyzeImages = (formData) => apiClient.post('/komreg/analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const approveAndSend = (payload) => apiClient.post('/komreg/approve-and-send', payload);

export const getDistribusiStatus = () => apiClient.get('/distribusi/status');
export const setDistribusiCapacity = (capacity) => apiClient.post('/distribusi/capacity', { capacity });
export const sendToWhatsapp = () => apiClient.post('/distribusi/send');