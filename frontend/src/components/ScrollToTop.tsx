// src/components/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Получаем текущее местоположение (путь) из роутера
  const { pathname } = useLocation();

  // Используем useEffect, чтобы отслеживать изменения в pathname
  useEffect(() => {
    // При каждом изменении пути, прокручиваем окно в самый верх
    window.scrollTo(0, 0);
  }, [pathname]); // Эффект будет срабатывать каждый раз, когда pathname меняется

  // Этот компонент ничего не рендерит, он только выполняет действие
  return null;
};

export default ScrollToTop;