import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) without parameters', () => {
    return request(app.getHttpServer())
      .get('/v1/pagination')
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      });
  });

  it('should throw an error if currentPage or numberPages < 1', () => {
    return request(app.getHttpServer())
      .get('/v1/pagination?currentPage=0&numberPages=10')
      .expect(400)
      .expect({
        statusCode: 400,
        message:
          'Invalid currentPage or numberPages (values must be greater than 0)',
      });
  });

  it('should throw an error if currentPage or numberPages is empty', () => {
    return request(app.getHttpServer())
      .get('/v1/pagination?currentPage=&numberPages=10')
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      });
  });

  it('should throw an error if currentPage > numberPages', () => {
    return request(app.getHttpServer())
      .get('/v1/pagination?currentPage=11&numberPages=10')
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Invalid currentPage (currentPage > numberPages)',
      });
  });

  it('/ (GET) with currentPage = 1, numberPages = 10', () => {
    return request(app.getHttpServer())
      .get('/v1/pagination?currentPage=1&numberPages=10')
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body[0]).toEqual(
          expect.objectContaining({
            pagination: ['**1**', '2', '3', '4', '5', '...'],
          }),
        );
      });
  });

  it('/ (GET) with currentPage = 2, numberPages = 10', () => {
    return request(app.getHttpServer())
      .get('/v1/pagination?currentPage=2&numberPages=10')
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body[0]).toEqual(
          expect.objectContaining({
            pagination: ['1', '**2**', '3', '4', '5', '...'],
          }),
        );
      });
  });

  it('/ (GET) with currentPage = 3, numberPages = 10', () => {
    return request(app.getHttpServer())
      .get('/v1/pagination?currentPage=3&numberPages=10')
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body[0]).toEqual(
          expect.objectContaining({
            pagination: ['1', '2', '**3**', '4', '5', '...'],
          }),
        );
      });
  });

  it('/ (GET) with currentPage = 4, numberPages = 10', () => {
    return request(app.getHttpServer())
      .get('/v1/pagination?currentPage=4&numberPages=10')
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body[0]).toEqual(
          expect.objectContaining({
            pagination: ['...', '2', '3', '**4**', '5', '6', '...'],
          }),
        );
      });
  });

  it('/ (GET) with currentPage = 5, numberPages = 10', () => {
    return request(app.getHttpServer())
      .get('/v1/pagination?currentPage=5&numberPages=10')
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body[0]).toEqual(
          expect.objectContaining({
            pagination: ['...', '3', '4', '**5**', '6', '7', '...'],
          }),
        );
      });
  });

  it('/ (GET) with currentPage = 6, numberPages = 10', () => {
    return request(app.getHttpServer())
      .get('/v1/pagination?currentPage=6&numberPages=10')
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body[0]).toEqual(
          expect.objectContaining({
            pagination: ['...', '4', '5', '**6**', '7', '8', '...'],
          }),
        );
      });
  });

  it('/ (GET) with currentPage = 7, numberPages = 10', () => {
    return request(app.getHttpServer())
      .get('/v1/pagination?currentPage=7&numberPages=10')
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body[0]).toEqual(
          expect.objectContaining({
            pagination: ['...', '5', '6', '**7**', '8', '9', '...'],
          }),
        );
      });
  });

  it('/ (GET) with currentPage = 8, numberPages = 10', () => {
    return request(app.getHttpServer())
      .get('/v1/pagination?currentPage=8&numberPages=10')
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body[0]).toEqual(
          expect.objectContaining({
            pagination: ['...', '6', '7', '**8**', '9', '10'],
          }),
        );
      });
  });

  it('/ (GET) with currentPage = 9, numberPages = 10', () => {
    return request(app.getHttpServer())
      .get('/v1/pagination?currentPage=9&numberPages=10')
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body[0]).toEqual(
          expect.objectContaining({
            pagination: ['...', '6', '7', '8', '**9**', '10'],
          }),
        );
      });
  });

  it('/ (GET) with currentPage = 10, numberPages = 10', () => {
    return request(app.getHttpServer())
      .get('/v1/pagination?currentPage=10&numberPages=10')
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body[0]).toEqual(
          expect.objectContaining({
            pagination: ['...', '6', '7', '8', '9', '**10**'],
          }),
        );
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
