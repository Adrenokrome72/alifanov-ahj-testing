export function getPaymentSystem(cardNumber) {
  const firstFour = cardNumber.slice(0, 4);

  if (firstFour.startsWith('4')) return 'visa';
  if (firstFour.startsWith('51') || firstFour.startsWith('52') || firstFour.startsWith('53') || firstFour.startsWith('54') || firstFour.startsWith('55')) return 'mastercard';
  if (firstFour.startsWith('2200') || firstFour.startsWith('2201') || firstFour.startsWith('2202') || firstFour.startsWith('2203') || firstFour.startsWith('2204')) return 'mir';
  return null;
}