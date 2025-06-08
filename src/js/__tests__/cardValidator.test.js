import { isValidCard } from '../cardValidator.js';

describe('Валидатор кредитных карт', () => {
  test('должен валидировать действительный номер карты Visa', () => {
    expect(isValidCard('4111111111111111')).toBe(true);
  });

  test('должен валидировать действительный номер карты Мир', () => {
    expect(isValidCard('2200000000000053')).toBe(true);
  });

  test('должен вернуть false для недействительного номера карты', () => {
    expect(isValidCard('1234567890123456')).toBe(false);
  });

  test('должен вернуть false для слишком короткого номера карты', () => {
    expect(isValidCard('123456789012')).toBe(false);
  });

  test('должен вернуть false для нечислового ввода', () => {
    expect(isValidCard('4111abcd11111111')).toBe(false);
  });
});