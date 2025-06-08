export function isValidCard(cardNumber) {
  const digits = cardNumber.replace(/\D/g, '').split('').map(Number);
  if (digits.length < 13 || digits.length > 16) return false;

  let sum = 0;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];
    if ((digits.length - 1 - i) % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  return sum % 10 === 0;
}