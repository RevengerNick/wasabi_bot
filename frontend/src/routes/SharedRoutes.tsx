import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// --- ГЛАВНОЕ ИЗМЕНЕНИЕ ---
// Мы импортируем страницы не напрямую, а с помощью React.lazy.
// Это говорит Vite "упакуй каждую из этих страниц в отдельный файл".
const HomePage = lazy(() => import('../pages/HomePage'));
const MenuPage = lazy(() => import('../pages/MenuPage'));
const ProductListPage = lazy(() => import('../pages/ProductListPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const OrderHistoryPage = lazy(() => import('../pages/OrderHistoryPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const AddressSelectorPage = lazy(() => import('../pages/AddressSelectorPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
// Компонент-заглушка, который будет показываться, пока подгружается код страницы
const PageLoader = () => (
    <div className="flex justify-center items-center h-screen">
        <div>Загрузка страницы...</div>
    </div>
);
const SharedRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/menu/:categoryId" element={<ProductListPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/orders" element={<OrderHistoryPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/select-address" element={<AddressSelectorPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  </Suspense>
);

export default SharedRoutes;