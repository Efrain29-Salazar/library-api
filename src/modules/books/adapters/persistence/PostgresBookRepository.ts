import { Pool } from 'pg';

import { Book, NewBook } from '../../domain/Book';
import { BookRepository } from '../../ports/BookRepository';


const COLUMNS = 'id, title, author, isbn, copies';


export class PostgresBookRepository implements BookRepository {
  constructor(private readonly pool: Pool) {}


  findAll = async (): Promise<Book[]> => {
    const result = await this.pool.query<Book>(`SELECT ${COLUMNS} FROM books ORDER BY id`);

    return result.rows;
  };


  findById = async (id: number): Promise<Book | undefined> => {
    const result = await this.pool.query<Book>(`SELECT ${COLUMNS} FROM books WHERE id = $1`, [id]);

    return result.rows[0];
  };


  save = async (newBook: NewBook): Promise<Book> => {
    const result = await this.pool.query<Book>(
      `INSERT INTO books (title, author, isbn, copies)
       VALUES ($1, $2, $3, $4)
       RETURNING ${COLUMNS}`,
      [newBook.title, newBook.author, newBook.isbn, newBook.copies],
    );

    return result.rows[0];
  };
}
