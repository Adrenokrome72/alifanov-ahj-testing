import { getPaymentSystem } from '../paymentSystem.js';

describe('Платежная система', () => {
  test('должен определить карту Visa', () => {
    expect(getPaymentSystem('4111111111111111')).toBe('visa');
  });

  test('должен определить карту Mastercard', () => {
    expect(getPaymentSystem('5111111111111111')).toBe('mastercard');
  });

  test('должен определить карту Мир', () => {
    expect(getPaymentSystem('2200000000000053')).toBe('mir');
  });

  test('должен вернуть null для неизвестной карты', () => {
    expect(getPaymentSystem('1234567890123456')).toBe(null);
  });
});