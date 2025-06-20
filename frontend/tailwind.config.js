// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // В блоке extend мы РАСШИРЯЕМ стандартную тему, а не заменяем ее.
    extend: {
      // Здесь мы определяем наши кастомные цвета, чтобы их можно было использовать в классах
      colors: {
        'brand-dark': '#0F1614',
        'brand-green-light': '#5E8C75',
        'brand-green': '#00A554',
        'brand-gray': '#EFF4F2',
      },
    },
  },
  // Здесь мы регистрируем все плагины, которые хотим использовать
  plugins: [
    require('@tailwindcss/line-clamp'), // <-- Вот как правильно подключать плагин
  ],
}