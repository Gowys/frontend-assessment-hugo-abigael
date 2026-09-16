import React from 'react';

function formatPrice(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export default function ProductTable({ products, onView, onEdit, onDelete }) {
  if (products.length === 0) {
    return <div className="empty-state">No products match the current filters.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created</th>
            <th className="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} onDoubleClick={() => onView(product)}>
              <td data-label="Name">{product.name}</td>
              <td data-label="Category">
                <span className="badge badge-category">{product.category}</span>
              </td>
              <td data-label="Price">{formatPrice(product.price)}</td>
              <td data-label="Status">
                <span className={`badge ${product.status === 'In Stock' ? 'badge-in' : 'badge-out'}`}>
                  {product.status}
                </span>
              </td>
              <td data-label="Created">{formatDate(product.createdAt)}</td>
              <td data-label="Actions" className="row-actions">
                <button className="button button-ghost" type="button" onClick={() => onView(product)}>View</button>
                <button className="button button-ghost" type="button" onClick={() => onEdit(product)}>Edit</button>
                <button className="button button-danger" type="button" onClick={() => onDelete(product)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
