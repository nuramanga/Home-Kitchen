import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Импорт компонентов
import HomePage from './components/HomePage';
import Restaurant from './components/Restaurant';
import Cart from './components/Cart';
import OrderTracking from './components/OrderTracking';
import DashboardChef from './components/DashboardChef';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chefs/:id" element={<Restaurant />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders/:id/tracking" element={<OrderTracking />} />
        <Route path="/chef/dashboard" element={<DashboardChef />} />
      </Routes>
    </Router>
  );
}

export default App;