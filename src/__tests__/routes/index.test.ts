import request from 'supertest';
import app from '../../app';
import indexRouter from '../../routes/index';

app.use('/', indexRouter);

describe('Test GET / route', () => {
  it('should return 200 OK with message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toEqual('Hello to BoilerPlate, build with Express + TypeScript');
  });
});
