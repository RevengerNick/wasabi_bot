// frontend/src/App.tsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import { useUserStore } from './store/userStore';
import * as api from './services/api';
import { useScreenSize } from './hooks/useScreenSize';
import DesktopLayout from './layouts/DesktopLayout';
import MobileLayout from './layouts/MobileLayout';
import SharedRoutes from './routes/SharedRoutes';
import LoginPage from './pages/LoginPage';
import { retrieveLaunchParams } from '@telegram-apps/sdk';

function App() {
    const { token } = useUserStore();
    const { isDesktop } = useScreenSize();
    const [isInitialized, setIsInitialized] = useState(false);
    const { initDataRaw, initData } = retrieveLaunchParams();

    useEffect(() => {
        console.log("hello")
        console.log(initData)
        api.sayToServer("try to send initdataraw")
        api.sayToServer(typeof initDataRaw === 'string' ? initDataRaw : String(initDataRaw));
    if (window.Telegram?.WebApp?.initData != "") {
        api.sayToServer(`Start with data`)
        api.sayToServer(window.Telegram?.WebApp?.initData);
    } else {
        api.sayToServer(`noooo`)
    }
  }, []);

    useEffect(() => {
        console.log("start")
        api.sayToServer(`Start`)
        api.sayToServer(`${WebApp.initData} webapp_data`)
        api.sayToServer(`${window.Telegram?.WebApp?.initData} webapp_data`)
        const initialize = async () => {
            // Если токен уже есть, мы залогинены. Инициализация пройдена.
            if (token) {
                setIsInitialized(true);
                return;
            }
            
            if (WebApp.initData && WebApp.initData.length > 0) {
                try {
                    console.log("Пытаемся войти через Telegram...");
                    await api.loginViaTelegram(WebApp.initData);
                } catch (error) {
                    console.error("Тихий вход через Telegram не удался:", error);
                }
            }
            // В любом случае (даже после неудачи) завершаем инициализацию
            setIsInitialized(true);
        };
        initialize();
    }, [token]);

    useEffect(() => {
        // Настройка кнопки "назад" в клиенте Telegram
        WebApp.BackButton.show();
        const handleBackButton = () => { window.history.back(); };
        WebApp.BackButton.onClick(handleBackButton);
        return () => {
            WebApp.BackButton.offClick(handleBackButton);
            WebApp.BackButton.hide();
        };
    }, []);

    // // Показываем "загрузчик", пока идет "тихий" логин
     if (!isInitialized) {
        return <div className="flex items-center justify-center min-h-screen">Инициализация...</div>;
   }

    // Если после всех попыток токена все еще нет, показываем страницу логина.
    // Это сработает и в браузере, и если в Telegram что-то пошло не так.
    if (!token) {
        console.log("start")
        api.sayToServer(`Start`)
        api.sayToServer(`${WebApp.initData} webapp_data`)
        api.sayToServer(`${window.Telegram?.WebApp?.initData} webapp_data`)
        return <LoginPage />;
    }

    // Если пользователь вошел, показываем основное приложение
    return (
        <Router>
            {isDesktop ? (
                <DesktopLayout><SharedRoutes /></DesktopLayout>
            ) : (
                <MobileLayout><SharedRoutes /></MobileLayout>
            )}
        </Router>
    );
}

export default App;