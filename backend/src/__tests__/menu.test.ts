// backend/src/__tests__/menu.test.ts
import request from 'supertest';
import app from '../app';

describe('Menu & Search API', () => {

  describe('GET /categories', () => {
    it('should return 200 OK and an array of categories with product counts', async () => {
      const response = await request(app)
        .get('/categories')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        // Проверяем, что у категории есть поле _count с количеством продуктов
        expect(response.body[0]).toHaveProperty('_count');
        expect(response.body[0]._count).toHaveProperty('products');
        expect(typeof response.body[0]._count.products).toBe('number');
      }
    });
  });

  describe('GET /products', () => {
    it('should return 200 OK and products for a valid category_id', async () => {
      const response = await request(app)
        .get('/products?category_id=1') // Предполагаем, что категория с ID=1 существует
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 400 Bad Request if category_id is not provided', async () => {
      await request(app)
        .get('/products')
        .expect(400);
    });
  });
  
  describe('GET /search', () => {
    it('should return 200 OK and an array of products for a valid query', async () => {
        const response = await request(app)
        .get('/search?q=ролл')
        .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 400 Bad Request if query "q" is not provided', async () => {
        await request(app)
        .get('/search')
        .expect(400);
    });
  });
});