import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    quantity: '',
    storeId: '',
    threshold: 10
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, storesRes] = await Promise.all([
        apiFetch('/products'),
        apiFetch('/stores')
      ]);
      setProducts(Array.isArray(productsRes) ? productsRes : []);
      setStores(Array.isArray(storesRes) ? storesRes : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
          threshold: Number(formData.threshold)
        })
      });
      setSuccess('Product created successfully');
      setFormData({ name: '', description: '', sku: '', quantity: '', storeId: '', threshold: 10 });
      fetchData(); 
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1>Product Management</h1>
      </div>

      <div className="card glass">
        <div className="card-header">
          <h2>Create New Product</h2>
          <p>Add a new product to the system.</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-error" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>{success}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>SKU</label>
            <input type="text" className="form-input" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" className="form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Initial Quantity</label>
            <input type="number" min="0" className="form-input" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Store</label>
            <select className="form-input" value={formData.storeId} onChange={e => setFormData({...formData, storeId: e.target.value})} required>
              <option value="">Select a store</option>
              {(stores || []).map(store => (
                <option key={store._id} value={store._id}>{store.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Low Stock Threshold</label>
            <input type="number" min="0" className="form-input" value={formData.threshold} onChange={e => setFormData({...formData, threshold: e.target.value})} required />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn-primary">Create Product</button>
          </div>
        </form>
      </div>

      <div className="card glass">
        <div className="card-header">
          <h2>Product List</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Threshold</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="3">No products found.</td></tr>
              ) : (
                products.map(p => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>{p.threshold}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
