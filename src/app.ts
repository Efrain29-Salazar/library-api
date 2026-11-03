import express from "express";

import { InMemoryBookRepository } from "./modules/books/adapters/persistence/InMemoryBookRepository";
import { BookService } from "./modules/books/application/BookService";
import { createBookRouter } from "./modules/books/adapters/http/bookRoutes";
import { BookRepository } from "./modules/books/ports/BookRepository";
import { PostgresBookRepository } from "./modules/books/adapters/persistence/PostgresBookRepository";
import { createPostgresPool } from "./shared/database/postgresPool";
import { errorHandler, notFoundHandler } from "./shared/httpErrorHandlers";

const app = express();

// Permite leer el cuerpo de las peticiones en formato JSON
app.use(express.json());

const sampleBooks = [
    {id: 1, title: 'Cien años de soledad', author: 'Gabriel García Márquez', isbn: '9780307474728', copies: 3},
    {id: 2, title: 'El túnel', author: 'Ernesto Sabato', isbn: '9789500700006', copies: 2},
];

const createBookRepository = (): { name: string; repository: BookRepository } => {
    const databaseUrl = process.env.DATABASE_URL;

    if (process.env.BOOKS_ADAPTER === 'sql' && databaseUrl) {
        return { name: 'PostgreSQL with pg', repository: new PostgresBookRepository(createPostgresPool(databaseUrl)) };
    }

    return { name: 'in memory', repository: new InMemoryBookRepository(sampleBooks) };
};


const bookPersistence = createBookRepository();
console.log(`Books persistence: ${bookPersistence.name}`);
const bookRepository: BookRepository = bookPersistence.repository;


const bookService = new BookService(bookRepository);


app.use('/books', createBookRouter(bookService));

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
