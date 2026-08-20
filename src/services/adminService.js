import api from './api.js';

export async function getAgents() {
  const { data } = await api.get('/admin/agents');
  return data;
}

export async function getRegistrations({ status, page = 1, pageSize = 10 } = {}) {
  const { data } = await api.get('/admin/registrations', { params: { status, page, pageSize } });
  return data;
}

export async function decideRegistration(id, decision) {
  const { data } = await api.patch(`/admin/registrations/${id}`, { decision });
  return data;
}

export async function getAllActivity() {
  const { data } = await api.get('/admin/activity');
  return data;
}
