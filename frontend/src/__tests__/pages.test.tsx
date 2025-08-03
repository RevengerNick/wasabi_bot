// frontend/src/__tests__/pages.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../pages/LoginPage';
import * as api from '../services/api';

const mockedApi = vi.mocked(api);

describe('LoginPage', () => {
  it('should show an error message on failed login', async () => {
    const user = userEvent.setup();
    // Настраиваем мок API на возврат ошибки
    mockedApi.loginViaPhone.mockRejectedValue(new Error('Неверные данные'));

    render(<LoginPage />);

    // Симулируем действия пользователя
    await user.type(screen.getByLabelText(/номер телефона/i), '123456789');
    await user.click(screen.getByRole('button', { name: /получить код/i }));
    
    await user.type(screen.getByLabelText(/код подтверждения/i), '111111');
    await user.click(screen.getByRole('button', { name: /подтвердить/i }));

    // Проверяем, что появилось сообщение об ошибке
    expect(await screen.findByText(/не удалось обновить номер/i)).toBeInTheDocument();
  });
});