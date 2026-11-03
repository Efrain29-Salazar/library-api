import { Router } from 'express';

import { DomainError } from '../../../../shared/DomainError';
import { HTTP_STATUS } from '../../../../shared/httpStatus';

import { BookService } from '../../application/BookService';

const parseId = (value: string): number => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new DomainError('El identificador no es válido');
  }

  return id;
};


export const createBookRouter = (service: BookService): Router => {
  const router = Router();


  router.get('/', async (req, res) => {
    const books = await service.list();

    res.status(HTTP_STATUS.OK).json(books);
  });


  router.get('/:id', async (req, res) => {
    const book = await service.getById(parseId(req.params.id));

    res.status(HTTP_STATUS.OK).json(book);
  });

  router.post('/', async (req, res) => {
    const book = await service.create(req.body);

    res.status(HTTP_STATUS.CREATED).json(book);
  });

  return router;
};
