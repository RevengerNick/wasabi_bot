// src/routes/SharedRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import MenuPage from '../pages/MenuPage';
import ProductListPage from '../pages/ProductListPage';
import CartPage from '../pages/CartPage';
import ProfilePage from '../pages/ProfilePage';

// Заглушки для десктопных страниц
const ReservationsPage = () => <div className="text-center p-10">Reservations Page</div>;
const AboutPage = () => <div className="text-center p-10">About Us Page</div>;
const ContactPage = () => <div className="text-center p-10">Contact Page</div>;

const SharedRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/menu" element={<MenuPage />} />
    <Route path="/menu/:categoryId" element={<ProductListPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/reservations" element={<ReservationsPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
  </Routes>
);

export default SharedRoutes;