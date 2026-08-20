import api from './api.js';

export async function getPrimaryOffers(paymentType) {
  const { data } = await api.get('/offers/primary', { params: { paymentType } });
  return data;
}

export async function getSupplementaryOffers(primaryOfferId) {
  const { data } = await api.get(`/offers/${primaryOfferId}/supplementary`);
  return data;
}
