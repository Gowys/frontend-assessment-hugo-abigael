import React from 'react';

function formatPrice(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductDetails({ product }) {
  return (
    <dl className="details-grid">
      <div><dt>Name</dt><dd>{product.name}</dd></div>
      <div><dt>Category</dt><dd>{product.category}</dd></div>
      <div><dt>Price</dt><dd>{formatPrice(product.price)}</dd></div>
      <div><dt>Status</dt><dd>{product.status}</dd></div>
      <div><dt>Created</dt><dd>{new Date(product.createdAt).toLocaleString()}</dd></div>
      <div><dt>ID</dt><dd>{product.id}</dd></div>
    </dl>
  );
}
