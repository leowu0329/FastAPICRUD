const request = require('supertest');
const app = require('../app');
const logger = require('../utils/logger');

describe('CORS Configuration Tests', () => {
  const testOrigin =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL
      : 'http://localhost:5173';

  const invalidOrigin = 'http://malicious-site.com';

  test('應該允許來自正確源的請求', async () => {
    const response = await request(app).get('/').set('Origin', testOrigin);

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(testOrigin);
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  test('應該拒絕來自未授權源的請求', async () => {
    const response = await request(app).get('/').set('Origin', invalidOrigin);

    expect(response.status).toBe(200); // 請求本身成功
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  test('應該正確處理預檢請求 (OPTIONS)', async () => {
    const response = await request(app)
      .options('/')
      .set('Origin', testOrigin)
      .set('Access-Control-Request-Method', 'GET')
      .set('Access-Control-Request-Headers', 'Content-Type');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe(testOrigin);
    expect(response.headers['access-control-allow-methods']).toContain('GET');
    expect(response.headers['access-control-allow-headers']).toContain(
      'Content-Type',
    );
  });

  test('應該正確處理帶有授權頭的請求', async () => {
    const response = await request(app)
      .get('/')
      .set('Origin', testOrigin)
      .set('Authorization', 'Bearer test-token');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(testOrigin);
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });
});
