import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const StockTransfer = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    fromStoreId: '',
    toStoreId: '',
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
    
    if (formData.fromStoreId === formData.toStoreId) {
      return setError('Source and destination stores cannot be the same');
    }
    
    if (Number(formData.quantity) <= 0) {
      return setError('Transfer quantity must be positive');
    }

    try {
      await apiFetch('/stocks/transfer', {
        method: 'POST',
        body: JSON.stringify({
          productId: formData.productId,
          fromStoreId: formData.fromStoreId,
          toStoreId: formData.toStoreId,
          quantity: Number(formData.quantity)
        })
      });
      setSuccess('Stock transferred successfully');
      setFormData({ productId: '', fromStoreId: '', toStoreId: '', quantity: '' });
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '600px' }}>
      <div className="card glass">
        <div className="card-header">
          <h2>Transfer Stock</h2>
          <p>Move stock securely between stores.</p>
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
            <label>From Store (Source)</label>
            <select className="form-input" value={formData.fromStoreId} onChange={e => setFormData({...formData, fromStoreId: e.target.value})} required>
              <option value="">Select source store</option>
              {stores.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>To Store (Destination)</label>
            <select className="form-input" value={formData.toStoreId} onChange={e => setFormData({...formData, toStoreId: e.target.value})} required>
              <option value="">Select destination store</option>
              {stores.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Quantity to Transfer</label>
            <input type="number" min="1" className="form-input" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
          </div>
          <button type="submit" className="btn-primary">Transfer Stock</button>
        </form>
      </div>
    </div>
  );
};

export default StockTransfer;
