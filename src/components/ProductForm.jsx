import React, { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, STATUSES } from '../constants';

const EMPTY_FORM = {
  name: '',
  category: '',
  price: '',
  status: 'In Stock',
};

function validate(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = 'Name is required.';
  if (!CATEGORIES.includes(values.category)) errors.category = 'Choose a valid category.';

  const price = Number(values.price);
  if (values.price === '') {
    errors.price = 'Price is required.';
  } else if (!Number.isFinite(price) || price <= 0) {
    errors.price = 'Price must be greater than 0.';
  }

  if (!STATUSES.includes(values.status)) errors.status = 'Choose a valid status.';

  return errors;
}

export default function ProductForm({ product, submitting, onSubmit, onCancel }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (product) {
      setValues({
        name: product.name ?? '',
        category: product.category ?? '',
        price: String(product.price ?? ''),
        status: product.status ?? 'In Stock',
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setTouched({});
  }, [product]);

  const errors = useMemo(() => validate(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setTouched({ name: true, category: true, price: true, status: true });
    if (!isValid || submitting) return;

    await onSubmit({
      name: values.name.trim(),
      category: values.category,
      price: Number(values.price),
      status: values.status,
    });
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={values.name} onChange={updateField} onBlur={handleBlur} autoFocus />
        {touched.name && errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <select id="category" name="category" value={values.category} onChange={updateField} onBlur={handleBlur}>
          <option value="">Select category</option>
          {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        {touched.category && errors.category && <span className="field-error">{errors.category}</span>}
      </div>

      <div className="field">
        <label htmlFor="price">Price</label>
        <input id="price" name="price" type="number" min="1" value={values.price} onChange={updateField} onBlur={handleBlur} />
        {touched.price && errors.price && <span className="field-error">{errors.price}</span>}
      </div>

      <div className="field">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={values.status} onChange={updateField} onBlur={handleBlur}>
          {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        {touched.status && errors.status && <span className="field-error">{errors.status}</span>}
      </div>

      <div className="form-actions">
        <button className="button button-secondary" type="button" onClick={onCancel} disabled={submitting}>Cancel</button>
        <button className="button button-primary" type="submit" disabled={!isValid || submitting}>
          {submitting ? 'Saving...' : product ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}
