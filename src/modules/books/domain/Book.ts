import { DomainError } from '../../../shared/DomainError';

// interface: define la estructura de un libro.
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  copies: number;
}

// Datos que se esperan recibir desde el cliente (todo menos el id, que lo asigna el repositorio).
export type NewBook = Omit<Book, 'id'>;

// ISBN de 10 o 13 dígitos. Antes de comprobar se quitan los guiones.
const ISBN_PATTERN = /^(\d{10}|\d{13})$/;

// Comprueba que un valor sea un texto con contenido (no vacío ni solo espacios).
const isFilledText = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';

// Valida los datos de entrada y devuelve un libro limpio.
export const parseNewBook = (input: unknown): NewBook => {
  const { title, author, isbn, copies } = (input ?? {}) as Record<string, unknown>;

  // Regla 1: el título es obligatorio.
  if (!isFilledText(title)) {
    throw new DomainError('El título es obligatorio');
  }

  // Regla 2: el autor es obligatorio.
  if (!isFilledText(author)) {
    throw new DomainError('El autor es obligatorio');
  }

  // Regla 3: el ISBN tiene 10 o 13 dígitos (se aceptan guiones).
  if (typeof isbn !== 'string' || !ISBN_PATTERN.test(isbn.trim().replace(/-/g, ''))) {
    throw new DomainError('El ISBN no es válido');
  }

  // Regla 4: los ejemplares son un número entero igual o mayor que 0.
  if (typeof copies !== 'number' || !Number.isInteger(copies) || copies < 0) {
    throw new DomainError('Los ejemplares deben ser un número igual o mayor que 0');
  }

  // Devuelve los datos limpios (sin espacios sobrantes).
  return { title: title.trim(), author: author.trim(), isbn: isbn.trim(), copies };
};
