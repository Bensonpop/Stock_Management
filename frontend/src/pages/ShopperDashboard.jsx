import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const ShopperDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thresholdFilter, setThresholdFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (threshold = '') => {
    setLoading(true);
    try {
      const endpoint = threshold !== '' ? `/stocks?threshold=${threshold}` : '/stocks';
      const res = await apiFetch(endpoint);
      setStocks(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchData(thresholdFilter);
  };

  if (loading && stocks.length === 0) return <div>Loading...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1>Store Products</h1>
{/*         
        <form onSubmit={handleFilter} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="number" 
            placeholder="Max stock threshold..." 
            className="form-input" 
            value={thresholdFilter}
            onChange={e => setThresholdFilter(e.target.value)}
          />
          <button type="submit" className="btn-secondary">Filter</button>
          {thresholdFilter && (
            <button type="button" className="btn-secondary sm" onClick={() => { setThresholdFilter(''); fetchData(''); }}>Clear</button>
          )}
        </form> */}
      </div>

      <div className="grid-cards">
        {stocks.map(stock => (
          <div key={stock._id} className="item-card glass">
            <h3>{stock.productId?.name}</h3>
            <p>{stock.productId?.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Store</span>
                <div style={{ fontWeight: '500' }}>{stock.storeId?.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stock.storeId?.location}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Available Stock</span>
                <div className="stock-value">{stock.quantity}</div>
              </div>
            </div>
          </div>
        ))}
        {stocks.length === 0 && (
          <div className="card glass" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <p>No products available matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopperDashboard;
