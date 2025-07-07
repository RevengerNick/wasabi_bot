// backend/src/__tests__/auth.test.ts
import request from 'supertest';
import app from '../app';
import { validateTelegramData } from '../utils/telegramValidator';
jest.mock('../utils/telegramValidator');

describe('Auth API', () => {
  
  describe('POST /auth/telegram-login', () => {

    it('should return 200 OK and a token when validateTelegramData returns true', async () => {
      // Настраиваем наш мок: при вызове он должен вернуть успешный результат
      (validateTelegramData as jest.Mock).mockReturnValue({
        isValid: true,
        user: { id: 12345, first_name: 'Test' } // Пример данных пользователя
      });
      
      const response = await request(app)
        .post('/auth/telegram-login')
        .send({ initData: 'any-fake-data-because-it-will-be-mocked' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should return 403 Forbidden when validateTelegramData returns false', async () => {
      // Настраиваем мок на провальный результат
      (validateTelegramData as jest.Mock).mockReturnValue({
        isValid: false,
        user: null
      });

      await request(app)
        .post('/auth/telegram-login')
        .send({ initData: 'any-data' })
        .expect(403);
    });
  });
  
  describe('POST /auth/phone-login', () => {
    it('should return 200 OK and a token for an existing user with correct code', async () => {
      const response = await request(app)
        .post('/auth/phone-login')
        .send({ phoneNumber: '+9989946816679', code: '121212' }) // <--- ИСПРАВЛЕНО
        .expect(200);
      
      expect(response.body).toHaveProperty('token');
    });

    it('should return 200 OK and create a new user for a new phone number', async () => {
      const uniquePhone = `+998909${Date.now()}`.slice(0, 13);
      const response = await request(app)
        .post('/auth/phone-login')
        .send({ phoneNumber: uniquePhone, code: '121212' }) // <--- ИСПРАВЛЕНО
        .expect(200);

      expect(response.body.user).toHaveProperty('phone_number', uniquePhone);
    });

    it('should return 403 Forbidden for an incorrect code', async () => {
      await request(app)
        .post('/auth/phone-login')
        .send({ phoneNumber: '+998901234567', code: '999999' }) // <--- ИСПРАВЛЕНО
        .expect(403);
    });
  });
});