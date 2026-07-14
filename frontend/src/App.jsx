import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProductManagement from './pages/ProductManagement';
import StoreManagement from './pages/StoreManagement';
import StockAdjustment from './pages/StockAdjustment';
import StockTransfer from './pages/StockTransfer';
import ShopperDashboard from './pages/ShopperDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/stores" element={<StoreManagement />} />
            <Route path="/admin/adjust-stock" element={<StockAdjustment />} />
            <Route path="/admin/transfer-stock" element={<StockTransfer />} />
          </Route>

          {/* Shopper Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Shopper', 'Admin']} />}>
            <Route path="/shopper" element={<ShopperDashboard />} />
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Wildcard */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}