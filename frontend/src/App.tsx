// frontend/src/App.tsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUserStore } from './store/userStore';
import * as api from './services/api';
import { useScreenSize } from './hooks/useScreenSize';
import DesktopLayout from './layouts/DesktopLayout';
import MobileLayout from './layouts/MobileLayout';
import SharedRoutes from './routes/SharedRoutes';
import LoginPage from './pages/LoginPage';
import { useCartStore } from './store/cartStore';
import WebApp from '@twa-dev/sdk';
import FullScreenLayout from './layouts/FullScreenLayout';
import AddressSelectorPage from './pages/AddressSelectorPage';
import ScrollToTop from './components/ScrollToTop';
import ProductDetailModal from './components/ProductDetailModal';

function App() {
    const { token } = useUserStore();
    const { isDesktop } = useScreenSize();
    const [isInitialized, setIsInitialized] = useState(false);
    const syncCart = useCartStore(state => state.syncWithDB);

    useEffect(() => {
        const initialize = async () => {
            if (token) {
                setIsInitialized(true);
                await syncCart();
                return;
            }
            try {
                if (WebApp.initData) {
                    console.log("Данные Telegram найдены! Начинаем тихий вход...");
                    // Отправляем строку initDataRaw на бэкенд
                    await api.loginViaTelegram(WebApp.initData);
                    await syncCart();
                } else {
                    console.log("Данные Telegram не найдены. Мы в обычном браузере.");
                }
            } catch (error) {
                console.error("Ошибка во время инициализации или тихого входа:", error);
            } finally {
                // В любом случае завершаем инициализацию
                setIsInitialized(true);
            }
        };
        initialize();
    }, [token, syncCart]);

    // Показываем "загрузчик", пока идет "тихий" логин
    if (!isInitialized) {
        return <div className="flex items-center justify-center min-h-screen">Инициализация...</div>;
    }

    // Если после всех попыток токена все еще нет, показываем страницу логина.
    if (!token) {
        return <LoginPage />;
    }

    // Если пользователь вошел, показываем приложение
    return (
    <Router>
        <ScrollToTop /> 
      <Routes>
        {/* Специальный роут для страницы с картой, который использует свой собственный layout */}
        <Route path="/select-address" element={
          <FullScreenLayout>
            <AddressSelectorPage />
          </FullScreenLayout>
        } />

        {/* Все остальные роуты используют стандартную логику с переключением layout'ов */}
        <Route path="/*" element={
          isDesktop ? (
            <DesktopLayout><SharedRoutes /></DesktopLayout>
          ) : (
            <MobileLayout><SharedRoutes /></MobileLayout>
          )
        } />
      </Routes>
      <ProductDetailModal />
    </Router>
  );
}
export default App;