import api from './api.js';

export async function lookupExistingCustomer(query) {
  const { data } = await api.get('/subscribers/search', { params: { query } });
  return data;
}

export async function createSubscriber(payload) {
  const { data } = await api.post('/subscribers', payload);
  return data;
}

export async function getDashboardStats() {
  const { data } = await api.get('/dashboard/stats');
  return data;
}

export async function getRecentActivity() {
  const { data } = await api.get('/dashboard/activity');
  return data;
}
