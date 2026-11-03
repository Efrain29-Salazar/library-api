import { DomainError } from '../../../shared/DomainError';
import { parseNewBook } from './Book';

// Datos de ejemplo válidos (datos de prueba en español).
const validInput = {
  title: 'Cien años de soledad',
  author: 'Gabriel García Márquez',
  isbn: '9780307474728',
  copies: 3,
};

describe('parseNewBook', () => {
  it('returns the book data trimmed', () => {
    const result = parseNewBook({ ...validInput, title: '  Cien años de soledad  ', author: ' Gabriel García Márquez ' });

    expect(result).toEqual(validInput);
  });

  it('throws when the title is missing', () => {
    expect(() => parseNewBook({ ...validInput, title: '  ' })).toThrow(new DomainError('El título es obligatorio'));
  });

  it('throws when the author is missing', () => {
    const { author, ...withoutAuthor } = validInput;

    expect(() => parseNewBook(withoutAuthor)).toThrow(new DomainError('El autor es obligatorio'));
  });

  it('accepts an ISBN of 10 or 13 digits, with or without hyphens', () => {
    expect(parseNewBook({ ...validInput, isbn: '0306406152' }).isbn).toBe('0306406152');
    expect(parseNewBook({ ...validInput, isbn: '978-0-307-47472-8' }).isbn).toBe('978-0-307-47472-8');
  });

  it('throws when the ISBN is not valid', () => {
    const message = 'El ISBN no es válido';

    expect(() => parseNewBook({ ...validInput, isbn: '12345' })).toThrow(new DomainError(message));
    expect(() => parseNewBook({ ...validInput, isbn: '97803074747AB' })).toThrow(new DomainError(message));
    expect(() => parseNewBook({ ...validInput, isbn: 9780307474728 })).toThrow(new DomainError(message));
  });

  it('throws when copies is not an integer equal or greater than 0', () => {
    const message = 'Los ejemplares deben ser un número igual o mayor que 0';

    expect(() => parseNewBook({ ...validInput, copies: -1 })).toThrow(new DomainError(message));
    expect(() => parseNewBook({ ...validInput, copies: 1.5 })).toThrow(new DomainError(message));
    expect(() => parseNewBook({ ...validInput, copies: '3' })).toThrow(new DomainError(message));
    expect(parseNewBook({ ...validInput, copies: 0 }).copies).toBe(0);
  });
});
