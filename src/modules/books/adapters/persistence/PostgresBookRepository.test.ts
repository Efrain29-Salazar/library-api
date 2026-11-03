
import 'dotenv/config';
import { Pool } from 'pg';
import { createPostgresPool } from '../../../../shared/database/postgresPool';
import { PostgresBookRepository } from './PostgresBookRepository';


const testDatabaseUrl = process.env.TEST_DATABASE_URL?.trim();
const developmentDatabaseUrl = process.env.DATABASE_URL?.trim();

if (!testDatabaseUrl) {
  throw new Error('Falta TEST_DATABASE_URL en el archivo .env');
}

if (testDatabaseUrl === developmentDatabaseUrl) {
  throw new Error('TEST_DATABASE_URL no puede ser igual a DATABASE_URL: las pruebas borrarían los datos de desarrollo');
}

const sampleBook = {
  title: 'Cien años de soledad',
  author: 'Gabriel García Márquez',
  isbn: '9780307474728',
  copies: 3,
};

describe('PostgresBookRepository', () => {
  let pool: Pool;
  let repository: PostgresBookRepository;


  beforeAll(() => {
    pool = createPostgresPool(testDatabaseUrl);
    repository = new PostgresBookRepository(pool);
  });


  beforeEach(async () => {
    await pool.query('TRUNCATE books RESTART IDENTITY');
  });


  afterAll(async () => {
    await pool.end();
  });

  it('starts empty', async () => {
    expect(await repository.findAll()).toEqual([]);
  });

  it('saves a book and assigns an id', async () => {
    const saved = await repository.save(sampleBook);

    expect(saved).toEqual({ id: 1, ...sampleBook });
  });

  it('assigns increasing ids and lists what was saved', async () => {
    await repository.save(sampleBook);
    const second = await repository.save({ ...sampleBook, title: 'El túnel' });

    expect(second.id).toBe(2);
    expect(await repository.findAll()).toHaveLength(2);
  });

  it('finds an existing book by id', async () => {
    const saved = await repository.save(sampleBook);

    expect(await repository.findById(saved.id)).toEqual(saved);
  });

  it('returns undefined when the book does not exist', async () => {
    expect(await repository.findById(999)).toBeUndefined();
  });
});
