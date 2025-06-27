// frontend/src/App.tsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useUserStore } from './store/userStore';
import SharedRoutes from './routes/SharedRoutes'; // <-- Теперь здесь вся логика
import LoginPage from './pages/LoginPage';
import { useCartStore } from './store/cartStore';
import WebApp from '@twa-dev/sdk';
import * as api from './services/api';
import ProductDetailModal from './components/ProductDetailModal';
import ScrollToTop from './components/ScrollToTop';

function App() {
    const { token } = useUserStore();
    const [isInitialized, setIsInitialized] = useState(true);
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
         <>
            <Router>
                <ScrollToTop />
                <SharedRoutes />
            </Router>
            <ProductDetailModal />
        </>
    );
}
export default App;