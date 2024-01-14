const request = require('supertest');
let server;


describe('Test API route', () => {
  beforeAll(() => {
    server = require('../server');
  });
  afterAll(async () => {
    await server.close();
  });
  it('should return true for the first row state', async () => {
    const response = await request(server).get('/api/test');
    expect(response.statusCode).toBe(200);
    expect(response.body[0].state).toBe(true);
  });
});
