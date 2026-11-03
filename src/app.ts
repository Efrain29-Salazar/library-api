import express from "express";

import { InMemoryBookRepository } from "./modules/books/adapters/persistence/InMemoryBookRepository";
import { BookService } from "./modules/books/application/BookService";
import { createBookRouter } from "./modules/books/adapters/http/bookRoutes";
import { BookRepository } from "./modules/books/ports/BookRepository";
import { errorHandler, notFoundHandler } from "./shared/httpErrorHandlers";

const app = express();


app.use(express.json());



const sampleBooks = [
    {id: 1, title: 'Cien años de soledad', author: 'Gabriel García Márquez', isbn: '9780307474728', copies: 3},
    {id: 2, title: 'El túnel', author: 'Ernesto Sabato', isbn: '9789500700006', copies: 2},
];

const bookRepository: BookRepository = new InMemoryBookRepository(sampleBooks);

const bookService = new BookService(bookRepository);

app.use('/books', createBookRouter(bookService));

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
