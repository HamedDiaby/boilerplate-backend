import request from 'supertest';
import app from '../../app';
import usersRouter from '../../routes/users';

app.use('/users', usersRouter);

describe('Test GET /users route', () => {
  it('should return 200 OK with message for users route', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.text).toEqual('Hello, Route users');
  });
});
