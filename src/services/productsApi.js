const DEFAULT_API_URL = 'https://my-json-server.typicode.com/<github-username>/<repo-name>/products';

export const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function getProducts() {
  return request(API_URL);
}

export function createProduct(product) {
  return request(API_URL, {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export function updateProduct(id, changes) {
  return request(`${API_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });
}

export function deleteProduct(id) {
  return request(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
}
