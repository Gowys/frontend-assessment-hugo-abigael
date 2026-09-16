import React, { useEffect, useMemo, useState } from 'react';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import ProductDetails from './components/ProductDetails';
import Modal from './components/Modal';
import Toast from './components/Toast';
import { CATEGORIES, STATUSES } from './constants';
import {
  API_URL,
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from './services/productsApi';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [lastAction, setLastAction] = useState(null);

  async function loadProducts() {
    setLoading(true);
    setToast(null);
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setToast({
        type: 'error',
        title: 'Could not load products',
        message: error.message,
        retry: true,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = !query || product.name.toLowerCase().includes(query);
      const matchesCategory = !category || product.category === category;
      const matchesStatus = !status || product.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  async function handleCreate(values) {
    const temporaryProduct = {
      ...values,
      id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const previousProducts = products;
    setProducts((current) => [temporaryProduct, ...current]);
    setSubmitting(true);
    setModal(null);

    try {
      const response = await createProduct({
        ...values,
        createdAt: temporaryProduct.createdAt,
      });

      setProducts((current) => current.map((product) => (
        product.id === temporaryProduct.id
          ? { ...temporaryProduct, ...(response || {}), id: response?.id ?? temporaryProduct.id }
          : product
      )));
      setToast({ type: 'success', title: 'Product created' });
      setLastAction(null);
    } catch (error) {
      setProducts(previousProducts);
      setToast({ type: 'error', title: 'Create failed', message: 'The optimistic update was rolled back.', retry: false });
      setLastAction(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(values) {
    const selected = modal?.product;
    if (!selected) return;

    const previousProducts = products;
    const optimisticProduct = { ...selected, ...values };
    setProducts((current) => current.map((product) => (
      product.id === selected.id ? optimisticProduct : product
    )));
    setSubmitting(true);
    setModal(null);

    try {
      const response = await updateProduct(selected.id, values);
      setProducts((current) => current.map((product) => (
        product.id === selected.id ? { ...optimisticProduct, ...(response || {}) } : product
      )));
      setToast({ type: 'success', title: 'Product updated' });
      setLastAction(null);
    } catch (error) {
      setProducts(previousProducts);
      setToast({ type: 'error', title: 'Update failed', message: 'The optimistic update was rolled back.' });
      setLastAction(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete(product) {
    const previousProducts = products;
    setProducts((current) => current.filter((item) => item.id !== product.id));
    setModal(null);

    try {
      await deleteProduct(product.id);
      setToast({ type: 'success', title: 'Product deleted' });
      setLastAction(null);
    } catch (error) {
      setProducts(previousProducts);
      setToast({ type: 'error', title: 'Delete failed', message: 'The optimistic update was rolled back.' });
      setLastAction(null);
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">BIA Energi · Frontend Assessment</p>
          <h1>Product Dashboard</h1>
          <p className="subtitle">Manage products with search, filters, validation, and optimistic CRUD updates.</p>
        </div>
        <button className="button button-primary" type="button" onClick={() => setModal({ type: 'create' })}>
          + Add Product
        </button>
      </header>

      {API_URL.includes('<github-username>') && (
        <div className="config-warning">
          Configure <code>VITE_API_URL</code> before submission so the app points to your live my-json-server endpoint.
        </div>
      )}

      <section className="filters" aria-label="Product filters">
        <label className="search-field">
          <span>Search</span>
          <input
            type="search"
            placeholder="Search product name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label>
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label>
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Products</h2>
            <p>{filteredProducts.length} of {products.length} products</p>
          </div>
          <button className="button button-secondary" type="button" onClick={loadProducts} disabled={loading}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="skeleton-list" aria-label="Loading products">
            {Array.from({ length: 5 }).map((_, index) => <div className="skeleton-row" key={index} />)}
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onView={(product) => setModal({ type: 'view', product })}
            onEdit={(product) => setModal({ type: 'edit', product })}
            onDelete={(product) => setModal({ type: 'delete', product })}
          />
        )}
      </section>

      {modal?.type === 'view' && (
        <Modal title="Product Details" onClose={() => setModal(null)}>
          <ProductDetails product={modal.product} />
        </Modal>
      )}

      {(modal?.type === 'create' || modal?.type === 'edit') && (
        <Modal title={modal.type === 'create' ? 'Add Product' : 'Edit Product'} onClose={() => setModal(null)}>
          <ProductForm
            product={modal.type === 'edit' ? modal.product : null}
            submitting={submitting}
            onSubmit={modal.type === 'create' ? handleCreate : handleEdit}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {modal?.type === 'delete' && (
        <Modal title="Delete Product" onClose={() => setModal(null)} size="small">
          <p>Are you sure you want to delete <strong>{modal.product.name}</strong>?</p>
          <div className="form-actions">
            <button className="button button-secondary" type="button" onClick={() => setModal(null)}>Cancel</button>
            <button className="button button-danger" type="button" onClick={() => confirmDelete(modal.product)}>Delete</button>
          </div>
        </Modal>
      )}

      <Toast
        toast={toast}
        onClose={() => setToast(null)}
        onRetry={() => {
          if (lastAction) lastAction();
          else loadProducts();
        }}
      />
    </main>
  );
}
