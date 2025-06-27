import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import DesktopLayout from '../layouts/DesktopLayout';
import MobileLayout from '../layouts/MobileLayout';
import FullScreenLayout from '../layouts/FullScreenLayout';
import { useScreenSize } from '../hooks/useScreenSize';
import UpdatePhonePage from '../pages/UpdatePhonePage';
import AddAddressPage from '../pages/AddAddressPage';

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
const PaymentMethodsPage = lazy(() => import('../pages/PaymentMethodsPage'));
const AddressListPage = lazy(() => import('../pages/AddressListPage'));
// Компонент-заглушка, который будет показываться, пока подгружается код страницы

const MainRoutes = () => (
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/menu" element={<MenuPage />} />
    <Route path="/menu/:categoryId" element={<ProductListPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/update-phone" element={<UpdatePhonePage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/orders" element={<OrderHistoryPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/payment-methods" element={<PaymentMethodsPage />} />
    <Route path="/addresses" element={<AddressListPage />} />
    <Route path="/add-address" element={<AddAddressPage />} />
  </Routes>
);

const PageLoader = () => (
    <div className="flex justify-center items-center h-screen">
        <div>Загрузка страницы...</div>
    </div>
);
const SharedRoutes = () => {
    const { isDesktop } = useScreenSize();
    
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Отдельный роут для полноэкранной страницы */}
                <Route path="/select-address" element={
                    <FullScreenLayout><AddressSelectorPage /></FullScreenLayout>
                } />

                {/* Все остальные роуты используют стандартный layout */}
                <Route path="/*" element={
                    isDesktop
                        ? <DesktopLayout><MainRoutes /></DesktopLayout>
                        : <MobileLayout><MainRoutes /></MobileLayout>
                } />
            </Routes>
        </Suspense>
    );
};

export default SharedRoutes;