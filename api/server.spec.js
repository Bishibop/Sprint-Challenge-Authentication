const request = require('supertest');
const server = require('./server.js');
const db = require('../database/dbConfig.js')

describe('server.js', () => {
  beforeEach(async () => {
    await db('users').truncate();
  });

  describe('register endpoint', () => {

    it('should return a 201 status code', async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/auth/register').send({
        username: 'billy',
        password: '20 oz steak'
      });
      expect(response.status).toEqual(expectedStatusCode);
    });

    it('should return a JWT on successful registration', async () => {
      const response = await request(server).post('/api/auth/register').send({
        username: 'billy',
        password: '20 oz steak'
      });
      expect(typeof response.body.token).toEqual('string');
    });

    it('should return an error if no username is supplied', async () => {
      const expectedStatusCode = 500;
      const response = await request(server).post('/api/auth/register').send({
        password: '20 oz steak'
      });
      expect(response.status).toEqual(expectedStatusCode);
    });

    it('should return an error if no password is supplied', async () => {
      const expectedStatusCode = 500;
      const response = await request(server).post('/api/auth/register').send({
        username: 'billy'
      });
      expect(response.status).toEqual(expectedStatusCode);
    });

    it('should return unauthorized if a blank username is supplied', async () => {
      const expectedStatusCode = 401;
      const response = await request(server).post('/api/auth/register').send({
        username: '',
        password: '20 oz steak'
      });
      expect(response.status).toEqual(expectedStatusCode);
    });

    it('should return unauthorized if a blank password is supplied', async () => {
      const expectedStatusCode = 401;
      const response = await request(server).post('/api/auth/register').send({
        username: 'billy',
        password: ''
      });
      expect(response.status).toEqual(expectedStatusCode);
    });
  });

  describe('login endpoint', () => {
    it('should return OK status code on successful login', async () => {
      const expectedResponse = 200;
      usernameAndPassword = {
        username: 'billy',
        password: '20 oz steak'
      };
      const registerResponse = await request(server)
        .post('/api/auth/register')
        .send(usernameAndPassword);
      const loginResponse = await request(server)
        .post('/api/auth/login')
        .send(usernameAndPassword);
      expect(loginResponse.status).toEqual(expectedResponse);
    });

    it('should return a JWT on successful login', async () => {
      usernameAndPassword = {
        username: 'billy',
        password: '20 oz steak'
      };
      const registerResponse = await request(server)
        .post('/api/auth/register')
        .send(usernameAndPassword);
      const loginResponse = await request(server)
        .post('/api/auth/login')
        .send(usernameAndPassword);
      expect(typeof loginResponse.body.token).toEqual('string');
    });

    it('should return 401 status code on bad password', async () => {
      const expectedResponse = 401;
      usernameAndPassword = {
        username: 'billy',
        password: '20 oz steak'
      };
      const registerResponse = await request(server)
        .post('/api/auth/register')
        .send(usernameAndPassword);
      const loginResponse = await request(server)
        .post('/api/auth/login')
        .send({...usernameAndPassword, password: 'hello world'});
      expect(loginResponse.status).toEqual(expectedResponse);
    });

    it('should return 401 status code on unknown user', async () => {
      const expectedResponse = 401;
      usernameAndPassword = {
        username: 'billy',
        password: '20 oz steak'
      };
      const registerResponse = await request(server)
        .post('/api/auth/register')
        .send(usernameAndPassword);
      const loginResponse = await request(server)
        .post('/api/auth/login')
        .send({...usernameAndPassword, username: 'foobar'});
      expect(loginResponse.status).toEqual(expectedResponse);
    });
  });
});
