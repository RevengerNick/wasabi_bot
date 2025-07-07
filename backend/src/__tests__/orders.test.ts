// backend/src/__tests__/orders.test.ts
import request from 'supertest';
import app from '../app';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price_at_order: number;
  // добавь другие поля, если они есть
}

describe('Cart & Orders API (Protected Routes)', () => {
  let authToken: string;
  const testProductId = 1; // ID продукта, который существует в тестовой БД

  beforeAll(async () => {
    const response = await request(app)
      .post('/auth/phone-login')
      .send({ phoneNumber: '+998946816679', code: '121212' });
    
    authToken = response.body.token;
  });

  describe('Cart workflow', () => {
    it('GET /cart -> should retrieve the user cart', async () => {
      await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('POST /cart -> should add a product to the cart', async () => {
      const response = await request(app)
        .post('/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProductId, quantity: 2 })
        .expect(200);
      // Проверяем, что товар действительно добавился в корзину
       const itemInCart = response.body.items.find((item: CartItem) => item.product_id === testProductId);
      expect(itemInCart).toBeDefined();
      expect(itemInCart.quantity).toBe(2);
    });
  });

  describe('Order workflow', () => {
    // Убедимся, что в корзине что-то есть перед созданием заказа
    beforeAll(async () => {
       await request(app)
        .post('/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProductId, quantity: 1 });
    });

    it('POST /orders -> should create an order from the cart', async () => {
      await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ address: 'Test address, 123', contactPhone: '+998907654321' })
        .expect(201); // Ожидаем 201 Created
    });

     it('GET /orders/history -> should retrieve user order history', async () => {
      const response = await request(app)
        .get('/orders/history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // После предыдущего теста в истории должен быть как минимум один заказ
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});