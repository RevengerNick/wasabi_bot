// backend/src/__tests__/users.test.ts
import request from 'supertest';
import app from '../app';

describe('User API (Protected Routes)', () => {
  let authToken: string;

  // Этот блок выполнится один раз перед всеми тестами в этом файле
  beforeAll(async () => {
    // Логинимся как тестовый пользователь, чтобы получить токен
    const response = await request(app)
      .post('/auth/phone-login')
      .send({ phoneNumber: '+998946816680', code: '121212' }); // Используем тестового пользователя
    
    authToken = response.body.token;
  });

  describe('POST /users/update-phone', () => {
    it('should return 200 OK and update user phone with a valid token', async () => {
      const newPhone = `+99899${Date.now()}`.slice(0, 13);
      const response = await request(app)
        .post('/users/update-phone')
        .set('Authorization', `Bearer ${authToken}`) // Устанавливаем заголовок
        .send({ phoneNumber: newPhone })
        .expect(200);
      expect(response.body.user.phone_number).toBe(newPhone);
    });

    it('should return 401 Unauthorized without a token', async () => {
      await request(app)
        .post('/users/update-phone')
        .send({ phone: '+998901112233' })
        .expect(401);
    });

    it('should return 401 Unauthorized with an invalid token', async () => {
      await request(app)
        .post('/users/update-phone')
        .set('Authorization', 'Bearer invalidtoken')
        .send({ phone: '+998901112233' })
        .expect(401);
    });
  });
  
  describe('DELETE /users/delete-me', () => {
    // ВНИМАНИЕ: этот тест удаляет пользователя. В реальной системе
    // нужно создавать нового пользователя для каждого теста и удалять его.
    it('should return 200 OK with a valid token', async () => {
      // Создаем и логиним временного юзера специально для этого теста
      const tempPhone = `+99899${Date.now()}`.slice(0, 13);
      const loginRes = await request(app).post('/auth/phone-login').send({ phoneNumber: tempPhone, code: '121212' });
      const tempToken = loginRes.body.token;

      await request(app)
        .delete('/users/delete-me')
        .set('Authorization', `Bearer ${tempToken}`)
        .expect(200);
    });

     it('should return 401 Unauthorized without a token', async () => {
      await request(app)
        .delete('/users/delete-me')
        .expect(401);
    });
  });
});