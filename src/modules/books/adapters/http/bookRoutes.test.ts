
import request from 'supertest';
import app from '../../../../app';

const validPayload = { title: 'El túnel', author: 'Ernesto Sabato', isbn: '978-950-07-0000-6', copies: 2 };

describe('POST /books', () => {
  it('creates a book and responds with 201 and its id', async () => {
    const response = await request(app).post('/books').send(validPayload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(validPayload);
    expect(response.body.id).toBeDefined();
  });

  it('responds with 400 and the message of the broken rule', async () => {
    const response = await request(app).post('/books').send({ ...validPayload, isbn: '123' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El ISBN no es válido');
  });
});

describe('GET /books', () => {
  it('responds with 200 and an array', async () => {
    const response = await request(app).get('/books');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('GET /books/:id', () => {
  it('responds with 200 and the book', async () => {
    const created = await request(app).post('/books').send(validPayload);

    const response = await request(app).get(`/books/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(created.body);
  });

  it('responds with 404 when the book does not exist', async () => {
    const response = await request(app).get('/books/9999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Libro no encontrado');
  });
});
