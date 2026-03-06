import axios from 'axios';

export const BASE_URL = 'https://railway-up-production-367d.up.railway.app';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const triggerEmergency = (payload) => api.post('/emergency/trigger', payload);

export const getHospitals = (lat, lng) => api.get('/hospitals', {
  params: { lat, lng }
});

export const getEmergency = (emergencyId) => api.get(`/emergency/${emergencyId}`);

export const acceptEmergency = (emergencyId, payload) => api.post(`/emergency/${emergencyId}/accept`, payload);

export const submitVitals = (payload) => api.post('/vitals', payload);

export default api;
