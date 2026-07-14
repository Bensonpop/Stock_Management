import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null; // Don't show navbar if not logged in

  return (
    <nav className="navbar glass">
      <div className="nav-brand">
        <h2>Stock<span>Flow</span></h2>
      </div>
      
      <div className="nav-links">
        {user.role === 'Admin' ? (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/stores">Stores</Link>
          </>
        ) : (
          <Link to="/shopper">Dashboard</Link>
        )}
      </div>

      <div className="nav-user">
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
        </div>
        <button onClick={handleLogout} className="btn-secondary sm">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
