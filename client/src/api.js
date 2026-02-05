/**
 * API client for communicating with the SmartLink backend.
 * In development, Vite proxies /api requests to localhost:3001.
 */

const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export function getTemplates() {
  return request('/templates');
}

export function createSmartLink({ title, description, template, links }) {
  return request('/links', {
    method: 'POST',
    body: JSON.stringify({ title, description, template, links }),
  });
}

export function getSmartLink(slug) {
  return request(`/links/${slug}`);
}

export function getQRDataUrl(slug) {
  return request(`/qr/${slug}/dataurl`);
}

export function getWalletPass(slug) {
  return request(`/wallet/${slug}`);
}
