import api from './api.js';

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  return data; // { token, user }
}

export async function signup(payload) {
  const { data } = await api.post('/auth/signup', payload);
  return data;
}

export async function requestPasswordReset(username) {
  const { data } = await api.post('/auth/forgot-password', { username });
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data;
}
