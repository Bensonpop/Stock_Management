import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const StockAdjustment = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    storeId: '',
    quantity: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
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
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await apiFetch('/stocks', {
        method: 'POST',
        body: JSON.stringify({
          productId: formData.productId,
          storeId: formData.storeId,
          quantity: Number(formData.quantity)
        })
      });
      setSuccess('Stock adjusted successfully');
      setFormData({ productId: '', storeId: '', quantity: '' });
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '600px' }}>
      <div className="card glass">
        <div className="card-header">
          <h2>Adjust Stock</h2>
          <p>Update stock quantity for a product in a specific store.</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-error" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>{success}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Product</label>
            <select className="form-input" value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} required>
              <option value="">Select a product</option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Store</label>
            <select className="form-input" value={formData.storeId} onChange={e => setFormData({...formData, storeId: e.target.value})} required>
              <option value="">Select a store</option>
              {stores.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Quantity to Add/Remove (e.g. 50 or -5)</label>
            <input type="number" className="form-input" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
          </div>
          <button type="submit" className="btn-primary">Adjust Stock</button>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustment;
