import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await apiFetch('/stocks');
      setStocks(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/admin/adjust-stock" className="btn-secondary">Adjust Stock</Link>
          <Link to="/admin/transfer-stock" className="btn-primary">Transfer Stock</Link>
        </div>
      </div>

      <div className="card glass">
        <div className="card-header">
          <h2>Current Stock Levels</h2>
          <p>Overview of all products across all stores.</p>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Store</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {stocks.length === 0 ? (
                <tr><td colSpan="4">No stock found.</td></tr>
              ) : (
                stocks.map(stock => (
                  <tr key={stock._id}>
                    <td>{stock.productId?.name}</td>
                    <td>{stock.productId?.sku}</td>
                    <td>{stock.storeId?.name}</td>
                    <td>
                      <span className="stock-value" style={{ fontSize: '1.2rem', color: stock.quantity <= stock.productId?.threshold ? 'var(--danger)' : 'var(--primary)' }}>
                        {stock.quantity}
                      </span>
                    </td>
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

export default AdminDashboard;
